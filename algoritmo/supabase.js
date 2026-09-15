// ==========================================================
// CONEXÃO COM SUPABASE
// Projeto Integrador - Fábrica de Embalagens
// ==========================================================

const { createClient } = require("@supabase/supabase-js");

// URL do seu projeto Supabase
const SUPABASE_URL = "https://cikukabbsmzjsdmsjosv.supabase.co";

// Chave publicável do seu projeto Supabase
const SUPABASE_KEY = "sb_publishable_59nCIbK4Ol9AhUX1V0e86g_gEz4BRkI";

// Cria a conexão com o Supabase
const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// Exporta a conexão para outros arquivos
module.exports = supabase;
