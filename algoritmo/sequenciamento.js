// Lista de Ordens de Fabricação
const ordensFabricacao = [
    {
        codigo: "OF001",
        dataEntrega: "2026-09-15",
        cor: "Azul",
        medida: "30x40",
        maquina: "M01",
        urgente: false
    },
    {
        codigo: "OF002",
        dataEntrega: "2026-09-13",
        cor: "Branco",
        medida: "30x40",
        maquina: "M01",
        urgente: false
    },
    {
        codigo: "OF003",
        dataEntrega: "2026-09-14",
        cor: "Preto",
        medida: "40x50",
        maquina: "M01",
        urgente: true
    },
    {
        codigo: "OF004",
        dataEntrega: "2026-09-13",
        cor: "Azul",
        medida: "40x50",
        maquina: "M01",
        urgente: false
    }
];


// Ordenar as OFs pela data de entrega
ordensFabricacao.sort((a, b) => {
    return new Date(a.dataEntrega) - new Date(b.dataEntrega);
});


// Mostrar a fila de produção
console.log("FILA DE PRODUÇÃO:");

ordensFabricacao.forEach((of, indice) => {
    console.log(
        `${indice + 1}º - ${of.codigo} - Entrega: ${of.dataEntrega}`
    );
});
