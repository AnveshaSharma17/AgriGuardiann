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
    const { image, crop, language } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all pests for context
    const { data: pests } = await supabase
      .from('pests')
      .select('name, name_hi, symptoms, symptoms_hi, tags, crops(name)')
      .limit(50);

    const pestNames = pests?.map(p => p.name).join(', ') || '';
    const lang = language === 'hi' ? 'Hindi' : 'English';

    const systemPrompt = `You are an expert agricultural entomologist specializing in identifying insect pests in Indian crops.

Available pests in our database: ${pestNames}

Analyze the provided image and identify likely insect pest(s) affecting the crop/plant.

IMPORTANT:
1. Only identify pests that are visible or whose damage symptoms are clearly visible.
2. Provide confidence scores based on how certain you are.
3. List the top 3 most likely pests.
4. Include follow-up questions to confirm the identification.
5. Respond in ${lang}.

Respond in JSON format:
{
  "predictions": [
    {"name": "pest name in English", "nameHi": "pest name in Hindi", "confidence": 0.8, "symptoms": ["symptom 1", "symptom 2"]},
    {"name": "pest 2", "nameHi": "pest 2 hi", "confidence": 0.5, "symptoms": []}
  ],
  "observedSymptoms": ["what you see in the image"],
  "followUpQuestions": ["Do you see sticky honeydew?", "Are leaves curling?"],
  "cropDetected": "crop name if visible"
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
          { 
            role: "user", 
            content: [
              { type: "text", text: `Identify the pest in this ${crop || 'crop'} image.` },
              { type: "image_url", image_url: { url: image } }
            ]
          }
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

    let parsedResponse;
    try {
      const jsonMatch = aiResponse.match(/```json\n?([\s\S]*?)\n?```/) || aiResponse.match(/```\n?([\s\S]*?)\n?```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : aiResponse;
      parsedResponse = JSON.parse(jsonStr);
    } catch {
      parsedResponse = {
        predictions: [],
        observedSymptoms: [],
        followUpQuestions: [],
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
          type: 'image',
          input_summary: `Image analysis for ${crop || 'unknown crop'}`,
          output_summary: JSON.stringify(parsedResponse.predictions?.slice(0, 3))
        });
      }
    }

    return new Response(JSON.stringify(parsedResponse), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-identify-image function:", error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
