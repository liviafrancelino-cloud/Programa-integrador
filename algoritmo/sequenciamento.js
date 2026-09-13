// ==========================================================
// PROJETO INTEGRADOR - FÁBRICA DE EMBALAGENS
// ALGORITMO DE SEQUENCIAMENTO DA PRODUÇÃO
// ==========================================================


// ==========================================================
// 1. LISTA DE ORDENS DE FABRICAÇÃO
// ==========================================================

const ordensFabricacao = [

    {
        codigo: "OF001",
        dataEntrega: "2026-09-15",
        cor: "Azul",
        medida: "30x40",
        tipoOF: "especifica",
        maquina: "M01",
        tempoProducao: 4,
        urgente: false,
        ordemCadastro: 1
    },

    {
        codigo: "OF002",
        dataEntrega: "2026-09-13",
        cor: "Branco",
        medida: "30x40",
        tipoOF: "especifica",
        maquina: "M01",
        tempoProducao: 3,
        urgente: false,
        ordemCadastro: 2
    },

    {
        codigo: "OF003",
        dataEntrega: "2026-09-14",
        cor: "Preto",
        medida: "40x50",
        tipoOF: "compartilhada",
        maquina: null,
        tempoProducao: 5,
        urgente: true,
        ordemCadastro: 3
    },

    {
        codigo: "OF004",
        dataEntrega: "2026-09-13",
        cor: "Azul",
        medida: "40x50",
        tipoOF: "compartilhada",
        maquina: null,
        tempoProducao: 2,
        urgente: false,
        ordemCadastro: 4
    }
];


// ==========================================================
// 2. MÁQUINAS DISPONÍVEIS
// ==========================================================

const maquinas = [

    {
        codigo: "M01",
        nome: "Impressora 01",
        capacidadeHoras: 8,
        horasOcupadas: 0,
        corAtual: null,
        status: "Disponível"
    },

    {
        codigo: "M02",
        nome: "Impressora 02",
        capacidadeHoras: 8,
        horasOcupadas: 0,
        corAtual: null,
        status: "Disponível"
    },

    {
        codigo: "M03",
        nome: "Impressora 03",
        capacidadeHoras: 8,
        horasOcupadas: 0,
        corAtual: null,
        status: "Disponível"
    }
];


// ==========================================================
// 3. PRIORIDADE DAS CORES
// ==========================================================

// Quanto menor o número, maior a prioridade.

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
// 4. REGISTRO DE ALTERAÇÕES
// ==========================================================

const alteracoesFila = [];


// ==========================================================
// 5. FUNÇÃO DE SEQUENCIAMENTO
// ==========================================================

function sequenciarOrdens(ordens) {

    return [...ordens].sort((a, b) => {

        // --------------------------------------------------
        // 1º CRITÉRIO: DATA DE ENTREGA
        // --------------------------------------------------

        const diferencaData =
            new Date(a.dataEntrega) -
            new Date(b.dataEntrega);

        if (diferencaData !== 0) {

            return diferencaData;
        }


        // --------------------------------------------------
        // 2º CRITÉRIO: COR
        // --------------------------------------------------

        const prioridadeA =
            prioridadeCores[a.cor] ?? 999;

        const prioridadeB =
            prioridadeCores[b.cor] ?? 999;

        if (prioridadeA !== prioridadeB) {

            return prioridadeA - prioridadeB;
        }


        // --------------------------------------------------
        // 3º CRITÉRIO: MEDIDA
        // --------------------------------------------------

        const diferencaMedida =
            a.medida.localeCompare(b.medida);

        if (diferencaMedida !== 0) {

            return diferencaMedida;
        }


        // --------------------------------------------------
        // 4º CRITÉRIO: ORDEM DE CADASTRO
        // --------------------------------------------------

        return a.ordemCadastro -
            b.ordemCadastro;
    });
}


// ==========================================================
// 6. CRIAR A FILA NORMAL
// ==========================================================

let filaProducao =
    sequenciarOrdens(ordensFabricacao);


// ==========================================================
// 7. FUNÇÃO PARA COLOCAR UMA OF COMO URGENTE
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


    // Verificar se a OF existe

    if (indice === -1) {

        console.log(
            `OF ${codigoOF} não encontrada.`
        );

        return;
    }


    // Verificar se já está na primeira posição

    if (indice === 0) {

        console.log(
            `OF ${codigoOF} já está no início da fila.`
        );

        return;
    }


    // Guardar posição anterior

    const posicaoAnterior =
        indice + 1;


    // Retirar a OF da fila

    const [ofUrgente] =
        filaProducao.splice(indice, 1);


    // Marcar como urgente

    ofUrgente.urgente = true;


    // Colocar no início da fila

    filaProducao.unshift(ofUrgente);


    // Registrar alteração

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
// 8. TRATAMENTO DAS OFs URGENTES
// ==========================================================

// Exemplo de alteração feita pelo PCP.

filaProducao
    .filter(of => of.urgente)
    .forEach(ofUrgente => {

        colocarComoUrgente(

            ofUrgente.codigo,

            "João - PCP",

            "Cliente solicitou antecipação da entrega"
        );
    });


// ==========================================================
// 9. DISTRIBUIÇÃO DAS OFs NAS MÁQUINAS
// ==========================================================

function distribuirMaquinas(fila) {

    fila.forEach(of => {


        // --------------------------------------------------
        // OF ESPECÍFICA
        // --------------------------------------------------

        if (of.tipoOF === "especifica") {

            const maquina =
                maquinas.find(
                    m => m.codigo === of.maquina
                );


            // Máquina não encontrada

            if (!maquina) {

                console.log(
                    `Máquina ${of.maquina} não encontrada para ${of.codigo}.`
                );

                return;
            }


            // Calcular capacidade restante

            const capacidadeRestante =
                maquina.capacidadeHoras -
                maquina.horasOcupadas;


            // Verificar se a OF cabe na máquina

            if (
                of.tempoProducao <=
                capacidadeRestante
            ) {

                maquina.horasOcupadas +=
                    of.tempoProducao;


                console.log(
                    `${of.codigo} direcionada para ${maquina.codigo}`
                );

            } else {

                console.log(

                    `NÃO FOI POSSÍVEL PROGRAMAR ${of.codigo} na ${maquina.codigo}.`
                );

                console.log(

                    `Capacidade disponível: ${capacidadeRestante}h | ` +
                    `Tempo necessário: ${of.tempoProducao}h`
                );
            }

            return;
        }


        // --------------------------------------------------
        // OF COMPARTILHADA
        // --------------------------------------------------

        const maquinasDisponiveis =
            maquinas.filter(

                m =>

                    m.status === "Disponível" &&

                    m.horasOcupadas +
                    of.tempoProducao
                    <=
                    m.capacidadeHoras
            );


        // Verificar se existe máquina disponível

        if (
            maquinasDisponiveis.length === 0
        ) {

            console.log(

                `Não há capacidade disponível para ${of.codigo}.`
            );

            return;
        }


        // --------------------------------------------------
        // ESCOLHER A MÁQUINA COM MENOR CARGA
        // --------------------------------------------------

        maquinasDisponiveis.sort(

            (a, b) =>
                a.horasOcupadas -
                b.horasOcupadas
        );


        const maquinaEscolhida =
            maquinasDisponiveis[0];


        // Definir a máquina da OF

        of.maquina =
            maquinaEscolhida.codigo;


        // Atualizar carga

        maquinaEscolhida.horasOcupadas +=
            of.tempoProducao;


        console.log(

            `${of.codigo} distribuída para ${maquinaEscolhida.codigo}`
        );
    });
}


// ==========================================================
// EXECUTAR DISTRIBUIÇÃO
// ==========================================================

distribuirMaquinas(filaProducao);


// ==========================================================
// 10. DETECTAR TROCAS DE COR
// ==========================================================

function verificarTrocaDeCor(fila) {

    let ultimaCor = null;


    fila.forEach(of => {

        if (ultimaCor === null) {

            of.trocaCor = false;

        } else {

            of.trocaCor =
                ultimaCor !== of.cor;
        }


        // Atualizar última cor produzida

        ultimaCor = of.cor;
    });
}


// ==========================================================
// EXECUTAR VERIFICAÇÃO
// ==========================================================

verificarTrocaDeCor(filaProducao);


// ==========================================================
// 11. ORGANIZAR FILA POR MÁQUINA
// ==========================================================

function criarFilasMaquinas(fila) {

    const filas = {};


    maquinas.forEach(maquina => {

        filas[maquina.codigo] = [];
    });


    fila.forEach(of => {

        if (of.maquina) {

            filas[of.maquina].push(of);
        }
    });


    return filas;
}


const filasMaquinas =
    criarFilasMaquinas(filaProducao);


// ==========================================================
// 12. MOSTRAR FILA GERAL
// ==========================================================

console.log(
    "\n================================="
);

console.log(
    "FILA GERAL DE PRODUÇÃO"
);

console.log(
    "================================="
);


filaProducao.forEach(
    (of, indice) => {

        console.log(

            `${indice + 1}º - ` +

            `${of.codigo} | ` +

            `Entrega: ${of.dataEntrega} | ` +

            `Cor: ${of.cor} | ` +

            `Medida: ${of.medida} | ` +

            `Máquina: ${of.maquina ?? "Não programada"} | ` +

            `Urgente: ${of.urgente ? "SIM" : "NÃO"} | ` +

            `Troca de cor: ${of.trocaCor ? "SIM" : "NÃO"}`
        );
    }
);


// ==========================================================
// 13. MOSTRAR FILA DE CADA MÁQUINA
// ==========================================================

console.log(
    "\n================================="
);

console.log(
    "FILAS POR MÁQUINA"
);

console.log(
    "================================="
);


Object.keys(filasMaquinas)
    .forEach(codigoMaquina => {

        console.log(
            `\nMáquina ${codigoMaquina}:`
        );


        if (
            filasMaquinas[codigoMaquina]
                .length === 0
        ) {

            console.log(
                "Nenhuma OF programada."
            );

            return;
        }


        filasMaquinas[codigoMaquina]
            .forEach(
                (of, indice) => {

                    console.log(

                        `${indice + 1}º - ` +

                        `${of.codigo} | ` +

                        `Cor: ${of.cor} | ` +

                        `Medida: ${of.medida} | ` +

                        `Tempo: ${of.tempoProducao}h`
                    );
                }
            );
    });


// ==========================================================
// 14. MOSTRAR CARGA DAS MÁQUINAS
// ==========================================================

console.log(
    "\n================================="
);

console.log(
    "CARGA DAS MÁQUINAS"
);

console.log(
    "================================="
);


maquinas.forEach(maquina => {

    console.log(

        `${maquina.codigo} - ` +

        `${maquina.nome} | ` +

        `Ocupação: ${maquina.horasOcupadas}h / ` +

        `${maquina.capacidadeHoras}h`
    );
});


// ==========================================================
// 15. REGISTRO DE ALTERAÇÕES DA FILA
// ==========================================================

console.log(
    "\n================================="
);

console.log(
    "REGISTRO DE ALTERAÇÕES"
);

console.log(
    "================================="
);


if (
    alteracoesFila.length === 0
) {

    console.log(
        "Nenhuma alteração registrada."
    );

} else {

    alteracoesFila.forEach(
        alteracao => {

            console.log(
                `OF: ${alteracao.codigoOF}`
            );

            console.log(
                `Usuário: ${alteracao.usuario}`
            );

            console.log(
                `Data e hora: ${alteracao.dataHora}`
            );

            console.log(
                `Motivo: ${alteracao.motivo}`
            );

            console.log(
                `Posição anterior: ${alteracao.posicaoAnterior}`
            );

            console.log(
                `Nova posição: ${alteracao.novaPosicao}`
            );

            console.log(
                "-----------------------------"
            );
        }
    );
}
