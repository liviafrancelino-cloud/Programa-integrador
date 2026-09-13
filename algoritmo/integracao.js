// ==========================================================
// PROJETO INTEGRADOR - FÁBRICA DE EMBALAGENS
// INTEGRAÇÃO DOS ALGORITMOS
// ==========================================================


// ==========================================================
// 1. ORDENS DE FABRICAÇÃO
// ==========================================================

const ordensFabricacao = [
    {
        codigo: "OF001",
        dataEntrega: "2026-09-15",
        cidade: "Limeira",
        cor: "Azul",
        medida: "30x40",
        tipoOF: "especifica",
        maquina: "M01",
        tempoProducao: 4,
        peso: 500,
        urgente: false,
        ordemCadastro: 1
    },

    {
        codigo: "OF002",
        dataEntrega: "2026-09-13",
        cidade: "Limeira",
        cor: "Branco",
        medida: "30x40",
        tipoOF: "especifica",
        maquina: "M01",
        tempoProducao: 3,
        peso: 300,
        urgente: false,
        ordemCadastro: 2
    },

    {
        codigo: "OF003",
        dataEntrega: "2026-09-14",
        cidade: "Piracicaba",
        cor: "Preto",
        medida: "40x50",
        tipoOF: "compartilhada",
        maquina: null,
        tempoProducao: 5,
        peso: 700,
        urgente: true,
        ordemCadastro: 3
    },

    {
        codigo: "OF004",
        dataEntrega: "2026-09-13",
        cidade: "Limeira",
        cor: "Azul",
        medida: "40x50",
        tipoOF: "compartilhada",
        maquina: null,
        tempoProducao: 2,
        peso: 400,
        urgente: false,
        ordemCadastro: 4
    }
];


// ==========================================================
// 2. PRIORIDADE DAS CORES
// ==========================================================

const prioridadeCores = {
    "Branco": 1,
    "Amarelo": 2,
    "Azul": 3,
    "Verde": 4,
    "Vermelho": 5,
    "Marrom": 6,
    "Preto": 7
};


// ==========================================================
// 3. MÁQUINAS
// ==========================================================

const maquinas = [
    {
        codigo: "M01",
        nome: "Impressora 01",
        capacidadeHoras: 8,
        horasOcupadas: 0,
        status: "Disponível"
    },

    {
        codigo: "M02",
        nome: "Impressora 02",
        capacidadeHoras: 8,
        horasOcupadas: 0,
        status: "Disponível"
    },

    {
        codigo: "M03",
        nome: "Impressora 03",
        capacidadeHoras: 8,
        horasOcupadas: 0,
        status: "Disponível"
    }
];


// ==========================================================
// 4. VEÍCULOS
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
// 5. REGISTRO DE ALTERAÇÕES
// ==========================================================

const alteracoesFila = [];


// ==========================================================
// 6. SEQUENCIAMENTO
// ==========================================================

function sequenciarOrdens(ordens) {

    return [...ordens].sort((a, b) => {

        // 1º - Data de entrega

        const diferencaData =
            new Date(a.dataEntrega) -
            new Date(b.dataEntrega);

        if (diferencaData !== 0) {
            return diferencaData;
        }


        // 2º - Cor

        const prioridadeA =
            prioridadeCores[a.cor] ?? 999;

        const prioridadeB =
            prioridadeCores[b.cor] ?? 999;

        if (prioridadeA !== prioridadeB) {
            return prioridadeA - prioridadeB;
        }


        // 3º - Medida

        const diferencaMedida =
            a.medida.localeCompare(b.medida);

        if (diferencaMedida !== 0) {
            return diferencaMedida;
        }


        // 4º - Ordem de cadastro

        return a.ordemCadastro -
               b.ordemCadastro;
    });
}


// ==========================================================
// 7. CRIAR FILA DE PRODUÇÃO
// ==========================================================

let filaProducao =
    sequenciarOrdens(ordensFabricacao);


// ==========================================================
// 8. TRATAMENTO DE URGÊNCIA
// ==========================================================

function colocarComoUrgente(
    codigoOF,
    usuario,
    motivo
) {

    const indice =
        filaProducao.findIndex(
            of => of.codigo === codigoOF
        );


    if (indice === -1) {

        console.log(
            `OF ${codigoOF} não encontrada.`
        );

        return;
    }


    if (indice === 0) {

        return;
    }


    const posicaoAnterior =
        indice + 1;


    const [ofUrgente] =
        filaProducao.splice(
            indice,
            1
        );


    ofUrgente.urgente = true;


    filaProducao.unshift(
        ofUrgente
    );


    alteracoesFila.push({

        codigoOF: codigoOF,

        usuario: usuario,

        dataHora: new Date(),

        motivo: motivo,

        posicaoAnterior:
            posicaoAnterior,

        novaPosicao: 1
    });
}


// ==========================================================
// 9. APLICAR URGÊNCIAS
// ==========================================================

filaProducao
    .filter(of => of.urgente)
    .forEach(of => {

        colocarComoUrgente(
            of.codigo,
            "João - PCP",
            "Cliente solicitou antecipação da entrega"
        );
    });


// ==========================================================
// 10. DISTRIBUIÇÃO DAS MÁQUINAS
// ==========================================================

function distribuirMaquinas(fila) {

    fila.forEach(of => {

        // OF específica

        if (of.tipoOF === "especifica") {

            const maquina =
                maquinas.find(
                    m =>
                        m.codigo ===
                        of.maquina
                );


            if (maquina) {

                maquina.horasOcupadas +=
                    of.tempoProducao;
            }

            return;
        }


        // OF compartilhada

        const disponiveis =
            maquinas.filter(
                maquina =>
                    maquina.status ===
                    "Disponível" &&
                    maquina.horasOcupadas +
                    of.tempoProducao <=
                    maquina.capacidadeHoras
            );


        if (disponiveis.length === 0) {

            console.log(
                `Sem capacidade para ${of.codigo}`
            );

            return;
        }


        // Menor carga

        disponiveis.sort(
            (a, b) =>
                a.horasOcupadas -
                b.horasOcupadas
        );


        const maquinaEscolhida =
            disponiveis[0];


        of.maquina =
            maquinaEscolhida.codigo;


        maquinaEscolhida.horasOcupadas +=
            of.tempoProducao;
    });
}


// Executar distribuição

distribuirMaquinas(
    filaProducao
);


// ==========================================================
// 11. MONTAGEM DAS CARGAS
// ==========================================================

const cargas = [];


function calcularDataMontagem(
    dataEntrega
) {

    const data =
        new Date(dataEntrega);

    data.setDate(
        data.getDate() - 2
    );

    return data
        .toISOString()
        .split("T")[0];
}


function encontrarVeiculo(
    peso
) {

    const possiveis =
        veiculos
            .filter(
                veiculo =>
                    veiculo.capacidade >=
                    peso
            )
            .sort(
                (a, b) =>
                    a.capacidade -
                    b.capacidade
            );


    if (possiveis.length === 0) {

        return null;
    }


    return possiveis[0];
}


function criarCarga(
    cidade,
    dataEntrega
) {

    const numero =
        cargas.length + 1;


    const carga = {

        codigo:
            `CARGA${String(numero).padStart(3, "0")}`,

        cidade: cidade,

        dataEntrega:
            dataEntrega,

        dataMontagem:
            calcularDataMontagem(
                dataEntrega
            ),

        pesoTotal: 0,

        capacidadeVeiculo: 0,

        veiculo: null,

        ordensFabricacao: [],

        status: "Em montagem"
    };


    cargas.push(carga);


    return carga;
}


function montarCargas(
    ordens
) {

    ordens.forEach(of => {

        let carga =
            cargas.find(
                c =>
                    c.cidade ===
                    of.cidade &&
                    c.dataEntrega ===
                    of.dataEntrega
            );


        if (!carga) {

            carga =
                criarCarga(
                    of.cidade,
                    of.dataEntrega
                );
        }


        const novoPeso =
            carga.pesoTotal +
            of.peso;


        const veiculo =
            encontrarVeiculo(
                novoPeso
            );


        if (veiculo) {

            carga.pesoTotal =
                novoPeso;

            carga.capacidadeVeiculo =
                veiculo.capacidade;

            carga.veiculo =
                veiculo.codigo;

            carga.ordensFabricacao.push(
                of.codigo
            );

        } else {

            const novaCarga =
                criarCarga(
                    of.cidade,
                    of.dataEntrega
                );


            const novoVeiculo =
                encontrarVeiculo(
                    of.peso
                );


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


// Executar montagem

montarCargas(
    filaProducao
);


// ==========================================================
// 12. IDENTIFICAR TROCAS DE COR
// ==========================================================

function verificarTrocasDeCor(
    fila
) {

    const ultimaCorPorMaquina = {};


    fila.forEach(of => {

        const maquina =
            of.maquina;


        if (
            !ultimaCorPorMaquina[maquina]
        ) {

            of.trocaCor = false;

        } else {

            of.trocaCor =
                ultimaCorPorMaquina[maquina]
                !== of.cor;
        }


        ultimaCorPorMaquina[maquina] =
            of.cor;
    });
}


verificarTrocasDeCor(
    filaProducao
);


// ==========================================================
// 13. RESULTADO DO SEQUENCIAMENTO
// ==========================================================

console.log("\n=================================");
console.log("SEQUENCIAMENTO DA PRODUÇÃO");
console.log("=================================");


filaProducao.forEach(
    (of, indice) => {

        console.log(
            `${indice + 1}º - ` +
            `${of.codigo} | ` +
            `Entrega: ${of.dataEntrega} | ` +
            `Cor: ${of.cor} | ` +
            `Medida: ${of.medida} | ` +
            `Máquina: ${of.maquina} | ` +
            `Urgente: ${
                of.urgente
                    ? "SIM"
                    : "NÃO"
            } | ` +
            `Troca de cor: ${
                of.trocaCor
                    ? "SIM"
                    : "NÃO"
            }`
        );
    }
);


// ==========================================================
// 14. RESULTADO DAS MÁQUINAS
// ==========================================================

console.log("\n=================================");
console.log("CARGA DAS MÁQUINAS");
console.log("=================================");


maquinas.forEach(
    maquina => {

        console.log(
            `${maquina.codigo} - ` +
            `${maquina.nome} | ` +
            `Ocupação: ` +
            `${maquina.horasOcupadas}h / ` +
            `${maquina.capacidadeHoras}h`
        );
    }
);


// ==========================================================
// 15. RESULTADO DAS CARGAS
// ==========================================================

console.log("\n=================================");
console.log("CARGAS DE ENTREGA");
console.log("=================================");


cargas.forEach(
    carga => {

        console.log(
            `\n${carga.codigo}`
        );

        console.log(
            `Cidade: ${carga.cidade}`
        );

        console.log(
            `Entrega: ${carga.dataEntrega}`
        );

        console.log(
            `Montagem: ${carga.dataMontagem}`
        );

        console.log(
            `Peso: ${carga.pesoTotal} kg`
        );

        console.log(
            `Veículo: ${
                carga.veiculo ||
                "Não definido"
            }`
        );

        console.log(
            `Capacidade: ${
                carga.capacidadeVeiculo
            } kg`
        );

        console.log(
            `OFs: ${
                carga.ordensFabricacao.join(
                    ", "
                )
            }`
        );

        console.log(
            `Status: ${carga.status}`
        );
    }
);


// ==========================================================
// 16. REGISTRO DE ALTERAÇÕES
// ==========================================================

console.log("\n=================================");
console.log("ALTERAÇÕES DA FILA");
console.log("=================================");


alteracoesFila.forEach(
    alteracao => {

        console.log(
            `OF: ${alteracao.codigoOF}`
        );

        console.log(
            `Usuário: ${alteracao.usuario}`
        );

        console.log(
            `Data/hora: ${alteracao.dataHora}`
        );

        console.log(
            `Motivo: ${alteracao.motivo}`
        );

        console.log(
            `Posição anterior: ${
                alteracao.posicaoAnterior
            }`
        );

        console.log(
            `Nova posição: ${
                alteracao.novaPosicao
            }`
        );

        console.log(
            "---------------------------------"
        );
    }
);


// ==========================================================
// 17. RESUMO FINAL
// ==========================================================

console.log("\n=================================");
console.log("RESUMO DO PROCESSAMENTO");
console.log("=================================");

console.log(
    `OFs processadas: ${
        filaProducao.length
    }`
);

console.log(
    `Cargas criadas: ${
        cargas.length
    }`
);

console.log(
    `Máquinas utilizadas: ${
        maquinas.filter(
            m => m.horasOcupadas > 0
        ).length
    }`
);

console.log(
    `Alterações registradas: ${
        alteracoesFila.length
    }`
);
