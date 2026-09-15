// ==========================================================
// CONEXÃO COM SUPABASE
// Projeto Integrador - Fábrica de Embalagens
// ==========================================================

require("dotenv").config({
    path: require("path").resolve(__dirname, "../.env")
});

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    throw new Error(
        "SUPABASE_URL ou SUPABASE_SECRET_KEY não foi configurada no arquivo .env"
    );
}

const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_SECRET_KEY
);

module.exports = supabase;
