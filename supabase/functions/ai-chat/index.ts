import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Create Supabase client to fetch pest data for RAG
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch relevant pest and advisory data based on context
    let pestContext = "";
    if (context?.crop) {
      const { data: cropData } = await supabase
        .from('crops')
        .select('id, name, name_hi')
        .ilike('name', `%${context.crop}%`)
        .limit(1)
        .maybeSingle();

      if (cropData) {
        const { data: pests } = await supabase
          .from('pests')
          .select(`
            name, name_hi, symptoms, symptoms_hi, damage, damage_hi,
            advisories (prevention, prevention_hi, mechanical, mechanical_hi, biological, biological_hi, chemical, chemical_hi, safety, safety_hi)
          `)
          .eq('crop_id', cropData.id);

        if (pests && pests.length > 0) {
          pestContext = `\n\nRelevant pest database for ${cropData.name}:\n${JSON.stringify(pests, null, 2)}`;
        }
      }
    }

    const language = context?.language === 'hi' ? 'Hindi' : 'English';
    
    const systemPrompt = `You are KrishiRakshak AI, an expert agricultural pest management advisor for Indian farmers.

IMPORTANT RULES:
1. Always respond in ${language}.
2. If the farmer hasn't mentioned their crop or symptoms, ASK clarifying questions first.
3. ALWAYS follow IPM (Integrated Pest Management) sequence:
   - First: Prevention strategies
   - Second: Mechanical/physical methods
   - Third: Biological control
   - LAST RESORT: Chemical pesticides (with safety warnings)
4. Include safety warnings for any chemical recommendations.
5. Be concise but thorough. Use simple language farmers can understand.
6. If you're not sure about something, say so. Don't hallucinate.
7. Consider the farmer's location (${context?.location || 'Punjab, India'}) and crop stage (${context?.cropStage || 'unknown'}).

${pestContext}

Recent spray history: ${JSON.stringify(context?.recentSprays || [])}

Format your response as JSON with these fields:
{
  "reply": "Your farmer-friendly answer in ${language}",
  "likelyPests": [{"name": "pest name", "confidence": 0.8}],
  "actions": ["action 1", "action 2"],
  "warnings": ["safety warning 1"],
  "followUpQuestions": ["question if needed"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    // Try to parse as JSON, fallback to plain text
    let parsedResponse;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = aiResponse.match(/```json\n?([\s\S]*?)\n?```/) || aiResponse.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : aiResponse;
      parsedResponse = JSON.parse(jsonStr);
    } catch {
      parsedResponse = {
        reply: aiResponse,
        likelyPests: [],
        actions: [],
        warnings: [],
        followUpQuestions: []
      };
    }

    // Log the AI interaction
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        await supabase.from('ai_logs').insert({
          user_id: user.id,
          type: 'chat',
          input_summary: message.substring(0, 200),
          output_summary: parsedResponse.reply?.substring(0, 200)
        });
      }
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-chat function:", error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
