// ==========================================================
// PROJETO INTEGRADOR - FÁBRICA DE EMBALAGENS
// ALGORITMO DE MONTAGEM DE CARGAS
// ==========================================================


// ==========================================================
// 1. ORDENS DE FABRICAÇÃO
// ==========================================================

const ordensFabricacao = [
    {
        codigo: "OF001",
        cidade: "Limeira",
        dataEntrega: "2026-09-15",
        peso: 500
    },

    {
        codigo: "OF002",
        cidade: "Limeira",
        dataEntrega: "2026-09-13",
        peso: 300
    },

    {
        codigo: "OF003",
        cidade: "Piracicaba",
        dataEntrega: "2026-09-14",
        peso: 700
    },

    {
        codigo: "OF004",
        cidade: "Limeira",
        dataEntrega: "2026-09-13",
        peso: 400
    },

    {
        codigo: "OF005",
        cidade: "Piracicaba",
        dataEntrega: "2026-09-14",
        peso: 600
    },

    {
        codigo: "OF006",
        cidade: "Rio Claro",
        dataEntrega: "2026-09-16",
        peso: 800
    }
];


// ==========================================================
// 2. VEÍCULOS DISPONÍVEIS
// ==========================================================

const veiculos = [
    {
        codigo: "V01",
        nome: "Caminhão 01",
        capacidade: 1000
    },

    {
        codigo: "V02",
        nome: "Caminhão 02",
        capacidade: 1500
    },

    {
        codigo: "V03",
        nome: "Caminhão 03",
        capacidade: 2000
    }
];


// ==========================================================
// 3. LISTA DE CARGAS
// ==========================================================

const cargas = [];


// ==========================================================
// 4. FUNÇÃO PARA COMPARAR DATAS
// ==========================================================

function compararDatas(data1, data2) {

    return new Date(data1) - new Date(data2);
}


// ==========================================================
// 5. FUNÇÃO PARA CALCULAR A DATA DE MONTAGEM
// ==========================================================

// A carga pode ser montada até 2 dias antes da entrega.

function calcularDataMontagem(dataEntrega) {

    const data = new Date(dataEntrega);

    data.setDate(data.getDate() - 2);

    return data.toISOString().split("T")[0];
}


// ==========================================================
// 6. ORGANIZAR AS OFs
// ==========================================================

// Primeiro:
// - data de entrega
// - cidade

const ordensOrganizadas = [...ordensFabricacao].sort((a, b) => {

    const diferencaData =
        compararDatas(
            a.dataEntrega,
            b.dataEntrega
        );

    if (diferencaData !== 0) {

        return diferencaData;
    }


    return a.cidade.localeCompare(b.cidade);
});


// ==========================================================
// 7. FUNÇÃO PARA ENCONTRAR VEÍCULO
// ==========================================================

function encontrarVeiculo(peso) {

    // Procurar o menor veículo que consiga transportar
    // o peso da carga.

    const veiculosPossiveis =
        veiculos
            .filter(
                veiculo =>
                    veiculo.capacidade >= peso
            )
            .sort(
                (a, b) =>
                    a.capacidade -
                    b.capacidade
            );


    if (veiculosPossiveis.length === 0) {

        return null;
    }


    return veiculosPossiveis[0];
}


// ==========================================================
// 8. CRIAR UMA NOVA CARGA
// ==========================================================

function criarCarga(cidade, dataEntrega) {

    const numeroCarga =
        cargas.length + 1;


    const carga = {

        codigo:
            `CARGA${String(numeroCarga).padStart(3, "0")}`,

        cidade: cidade,

        dataEntrega: dataEntrega,

        dataMontagem:
            calcularDataMontagem(dataEntrega),

        pesoTotal: 0,

        capacidadeVeiculo: 0,

        veiculo: null,

        ordensFabricacao: [],

        status: "Em montagem"
    };


    cargas.push(carga);


    return carga;
}


// ==========================================================
// 9. MONTAR AS CARGAS
// ==========================================================

function montarCargas(ordens) {

    ordens.forEach(of => {

        // --------------------------------------------------
        // Procurar uma carga existente
        // para a mesma cidade e data.
        // --------------------------------------------------

        let cargaExistente =
            cargas.find(
                carga =>
                    carga.cidade === of.cidade &&
                    carga.dataEntrega === of.dataEntrega
            );


        // --------------------------------------------------
        // Se não existir, criar uma carga.
        // --------------------------------------------------

        if (!cargaExistente) {

            cargaExistente =
                criarCarga(
                    of.cidade,
                    of.dataEntrega
                );
        }


        // --------------------------------------------------
        // Verificar o peso da carga atual.
        // --------------------------------------------------

        const novoPeso =
            cargaExistente.pesoTotal +
            of.peso;


        // --------------------------------------------------
        // Verificar se existe veículo para o novo peso.
        // --------------------------------------------------

        const veiculo =
            encontrarVeiculo(novoPeso);


        // --------------------------------------------------
        // Se o peso couber no veículo:
        // adicionar a OF.
        // --------------------------------------------------

        if (veiculo) {

            cargaExistente.pesoTotal =
                novoPeso;

            cargaExistente.capacidadeVeiculo =
                veiculo.capacidade;

            cargaExistente.veiculo =
                veiculo.codigo;

            cargaExistente.ordensFabricacao.push(
                of.codigo
            );

        }

        // --------------------------------------------------
        // Se não couber:
        // criar outra carga.
        // --------------------------------------------------

        else {

            const novaCarga =
                criarCarga(
                    of.cidade,
                    of.dataEntrega
                );


            const novoVeiculo =
                encontrarVeiculo(of.peso);


            // Verificar se a própria OF
            // cabe em algum veículo.

            if (novoVeiculo) {

                novaCarga.pesoTotal =
                    of.peso;

                novaCarga.capacidadeVeiculo =
                    novoVeiculo.capacidade;

                novaCarga.veiculo =
                    novoVeiculo.codigo;

                novaCarga.ordensFabricacao.push(
                    of.codigo
                );

            } else {

                // OF acima da capacidade
                novaCarga.status =
                    "Erro: peso acima da capacidade";

                novaCarga.pesoTotal =
                    of.peso;

                novaCarga.ordensFabricacao.push(
                    of.codigo
                );
            }
        }
    });
}


// ==========================================================
// 10. EXECUTAR MONTAGEM DAS CARGAS
// ==========================================================

montarCargas(ordensOrganizadas);


// ==========================================================
// 11. ATUALIZAR STATUS DAS CARGAS
// ==========================================================

function atualizarStatusCargas() {

    cargas.forEach(carga => {

        if (
            carga.status ===
            "Erro: peso acima da capacidade"
        ) {

            return;
        }


        // Se tiver OFs e veículo definido,
        // a carga está pronta.

        if (
            carga.ordensFabricacao.length > 0 &&
            carga.veiculo !== null
        ) {

            carga.status = "Pronta";
        }
    });
}


atualizarStatusCargas();


// ==========================================================
// 12. MOSTRAR AS CARGAS
// ==========================================================

console.log("\n=================================");
console.log("CARGAS DE ENTREGA");
console.log("=================================");


cargas.forEach(carga => {

    console.log(
        `\n${carga.codigo}`
    );

    console.log(
        `Cidade: ${carga.cidade}`
    );

    console.log(
        `Data de entrega: ${carga.dataEntrega}`
    );

    console.log(
        `Data de montagem: ${carga.dataMontagem}`
    );

    console.log(
        `Peso total: ${carga.pesoTotal} kg`
    );

    console.log(
        `Veículo: ${carga.veiculo || "Não definido"}`
    );

    console.log(
        `Capacidade: ${carga.capacidadeVeiculo} kg`
    );

    console.log(
        `OFs: ${carga.ordensFabricacao.join(", ")}`
    );

    console.log(
        `Status: ${carga.status}`
    );

    console.log(
        "---------------------------------"
    );
});


// ==========================================================
// 13. VERIFICAR CAPACIDADE DAS CARGAS
// ==========================================================

console.log("\n=================================");
console.log("VERIFICAÇÃO DE CAPACIDADE");
console.log("=================================");


cargas.forEach(carga => {

    if (
        carga.pesoTotal >
        carga.capacidadeVeiculo
    ) {

        console.log(
            `${carga.codigo}: CAPACIDADE EXCEDIDA`
        );

    } else {

        console.log(
            `${carga.codigo}: Capacidade OK`
        );
    }
});


// ==========================================================
// 14. RESUMO FINAL
// ==========================================================

console.log("\n=================================");
console.log("RESUMO");
console.log("=================================");

console.log(
    `Total de OFs: ${ordensFabricacao.length}`
);

console.log(
    `Total de cargas: ${cargas.length}`
);

console.log(
    `Veículos disponíveis: ${veiculos.length}`
);
