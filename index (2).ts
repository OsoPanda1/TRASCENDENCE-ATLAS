import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const DAILY_LIMIT = 10;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No auth" }), { status: 401, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: userErr } = await supabase.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
    }

    // Service role client for profile updates
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Check daily quota
    const { data: profile } = await adminClient
      .from("profiles")
      .select("ai_daily_quota_used, ai_quota_reset_at")
      .eq("user_id", user.id)
      .single();

    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), { status: 404, headers: corsHeaders });
    }

    const today = new Date().toISOString().slice(0, 10);
    let quotaUsed = profile.ai_daily_quota_used ?? 0;

    // Reset if new day
    if (profile.ai_quota_reset_at !== today) {
      quotaUsed = 0;
      await adminClient
        .from("profiles")
        .update({ ai_daily_quota_used: 0, ai_quota_reset_at: today })
        .eq("user_id", user.id);
    }

    // Check admin bypass
    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    const isAdmin = !!roleData;

    if (!isAdmin && quotaUsed >= DAILY_LIMIT) {
      return new Response(JSON.stringify({
        error: "AI_DAILY_LIMIT_REACHED",
        message: "Has alcanzado el límite diario de 10 interacciones con Isabella IA. Mañana se reinicia tu cuota.",
        quota_used: quotaUsed,
        quota_limit: DAILY_LIMIT,
      }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { message, history } = await req.json();
    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Missing message" }), { status: 400, headers: corsHeaders });
    }

    // Build messages for AI
    const systemPrompt = `Eres Isabella, la asistente académica IA del Master Elite en Marketing Digital 360 de UTAMV.
Tu rol:
- Responder preguntas sobre el programa, módulos (10 módulos), certificación, exámenes y pagos.
- Dar consejos de marketing digital basados en el contenido del curso.
- Contacto de soporte: tamvonlinenetwork@outlook.es
- Precio Master: $199 USD (acceso vitalicio).
- Exámenes de módulo: 10 preguntas, 30 min, mínimo 70%. Examen final: 50 preguntas, 60 min, mínimo 80%.
- Siempre responde en español profesional y amigable.
- No reveles datos de otros usuarios.
- Si no sabes algo, sugiere contactar soporte humano.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(history || []).slice(-8).map((m: any) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI not configured" }), { status: 500, headers: corsHeaders });
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error("AI Gateway error:", errText);
      return new Response(JSON.stringify({ error: "AI error" }), { status: 502, headers: corsHeaders });
    }

    const aiData = await aiResponse.json();
    const reply = aiData.choices?.[0]?.message?.content || "Lo siento, no pude procesar tu pregunta.";

    // Increment quota (non-admin only)
    if (!isAdmin) {
      await adminClient
        .from("profiles")
        .update({ ai_daily_quota_used: quotaUsed + 1 })
        .eq("user_id", user.id);
    }

    return new Response(JSON.stringify({
      reply,
      quota_used: isAdmin ? quotaUsed : quotaUsed + 1,
      quota_limit: isAdmin ? 999 : DAILY_LIMIT,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), { status: 500, headers: corsHeaders });
  }
});
