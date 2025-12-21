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
    const { crop, symptoms, severity, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch pests for the specified crop
    const { data: cropData } = await supabase
      .from('crops')
      .select('id, name')
      .ilike('name', `%${crop}%`)
      .limit(1)
      .maybeSingle();

    let pestContext = "";
    if (cropData) {
      const { data: pests } = await supabase
        .from('pests')
        .select(`
          name, name_hi, symptoms, symptoms_hi, damage, damage_hi, season, tags,
          advisories (prevention, mechanical, biological, chemical, safety)
        `)
        .eq('crop_id', cropData.id);

      if (pests) {
        pestContext = JSON.stringify(pests, null, 2);
      }
    }

    const lang = language === 'hi' ? 'Hindi' : 'English';

    const systemPrompt = `You are an expert agricultural entomologist. Based on the symptoms described, identify the most likely pests.

Crop: ${crop}
Symptoms reported: ${symptoms.join(', ')}
Severity: ${severity}

Pest database for this crop:
${pestContext}

IMPORTANT:
1. Match the symptoms to pests in the database.
2. Rank pests by how well their symptoms match.
3. Provide confidence scores.
4. Recommend immediate actions following IPM sequence.
5. Respond in ${lang}.

Respond in JSON format:
{
  "rankedPests": [
    {"name": "pest name", "nameHi": "Hindi name", "confidence": 0.9, "matchingSymptoms": ["symptom1", "symptom2"]},
    {"name": "pest 2", "nameHi": "Hindi name", "confidence": 0.6, "matchingSymptoms": []}
  ],
  "recommendedActions": [
    {"type": "prevention", "action": "action description"},
    {"type": "mechanical", "action": "action description"},
    {"type": "biological", "action": "action description"},
    {"type": "chemical", "action": "action description", "warning": "safety warning"}
  ],
  "urgency": "high|medium|low",
  "additionalNotes": "any other advice"
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
          { role: "user", content: `Analyze symptoms: ${symptoms.join(', ')}` }
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
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    let parsedResponse;
    try {
      const jsonMatch = aiResponse.match(/```json\n?([\s\S]*?)\n?```/) || aiResponse.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : aiResponse;
      parsedResponse = JSON.parse(jsonStr);
    } catch {
      parsedResponse = {
        rankedPests: [],
        recommendedActions: [],
        urgency: "medium",
        error: "Could not parse AI response"
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
          type: 'symptom',
          input_summary: `${crop}: ${symptoms.slice(0, 3).join(', ')}`,
          output_summary: JSON.stringify(parsedResponse.rankedPests?.slice(0, 3))
        });
      }
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-symptom-check function:", error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
