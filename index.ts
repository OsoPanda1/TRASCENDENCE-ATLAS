import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { supabaseAdmin } from "../lib/supabaseAdmin.ts";
import { getRateLimit } from "./rateLimit.ts";

// Tabla para auditoría IA
const createAuditTable = async () => {
  try {
    await supabaseAdmin.rpc("create_table_if_not_exists", {
      table_name: "ai_audit_log",
      columns: [
        { name: "id", type: "uuid", primary_key: true, default: "uuid_generate_v4()" },
        { name: "user_id", type: "uuid" },
        { name: "prompt_hash", type: "bytea" },
        { name: "response_hash", type: "bytea" },
        { name: "created_at", type: "timestamptz", default: "now()" }
      ]
    });
  } catch (error) {
    console.error("Error creating audit table:", error);
  }
};

await createAuditTable();

// Función principal
serve(async (req) => {
  const { user_id, prompt } = await req.json();

  if (!(await getRateLimit(user_id))) return new Response("Rate limit exceeded", { status: 429 });

  const response = "Respuesta académica simulada UTAMV";

  // Registrar uso de IA
  await supabaseAdmin.from("visitor_ai_usage").upsert({
    user_id,
    usage_date: new Date().toISOString().slice(0, 10),
    requests_count: 1
  }, { onConflict: ["user_id", "usage_date"], increment: { requests_count: 1 } });

  // Auditoría completa
  if (prompt) {
    const encoder = new TextEncoder();
    const promptHash = await crypto.subtle.digest("SHA-256", encoder.encode(prompt));
    const responseHash = await crypto.subtle.digest("SHA-256", encoder.encode(response));

    await supabaseAdmin.from("ai_audit_log").insert({
      user_id,
      prompt_hash: new Uint8Array(promptHash),
      response_hash: new Uint8Array(responseHash),
      created_at: new Date().toISOString()
    });
  }

  return new Response(JSON.stringify({ response }), { 
    headers: { "Content-Type": "application/json" } 
  });
});
