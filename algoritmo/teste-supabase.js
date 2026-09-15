// ==========================================================
// TESTE DE CONEXÃO COM SUPABASE
// ==========================================================

const supabase = require("./supabase");

async function testarConexao() {

    console.log("========================================");
    console.log("TESTANDO CONEXÃO COM SUPABASE");
    console.log("========================================");

    const { data, error } = await supabase
        .from("maquina")
        .select("*");

    if (error) {
        console.log("❌ ERRO AO CONECTAR COM O SUPABASE");
        console.log(error);
        return;
    }

    console.log("✅ CONEXÃO REALIZADA COM SUCESSO!");
    console.log("");
    console.log("Máquinas encontradas no banco:");

    console.table(data);

    console.log("");
    console.log("========================================");
    console.log(`Total de máquinas: ${data.length}`);
    console.log("========================================");
}

testarConexao();
