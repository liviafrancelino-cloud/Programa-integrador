
C:\Program Files\nodejs\node.exe .\sequenciamento.js

========================================
TESTE 1 - PRIORIDADE DE ENTREGA
========================================
Ordem: OF-B → OF-C → OF-A
✅ PASSOU - A OF com entrega mais próxima fica primeiro

========================================
TESTE 2 - PRIORIDADE DE COR
========================================
Ordem: OF-B(Branco) → OF-C(Azul) → OF-A(Preto)
✅ PASSOU - Branco tem prioridade sobre Azul
✅ PASSOU - Azul tem prioridade sobre Preto

========================================
TESTE 3 - PRIORIDADE DE MEDIDA
========================================
Ordem: OF-B(30x40) → OF-A(40x50)
✅ PASSOU - A medida é usada como terceiro critério

========================================
TESTE 4 - OF URGENTE
========================================
Ordem: OF003 → OF001 → OF002
✅ PASSOU - OF urgente vai para a primeira posição
✅ PASSOU - Alteração é registrada
✅ PASSOU - Usuário é registrado
✅ PASSOU - Motivo é registrado
✅ PASSOU - Posição anterior é registrada
✅ PASSOU - Nova posição é 1

========================================
TESTE 5 - CAPACIDADE DA MÁQUINA
========================================
OF001 direcionada para M01
OF002 direcionada para M01
NÃO FOI POSSÍVEL PROGRAMAR OF003 na M01.
Capacidade disponível: 1h | Tempo necessário: 2h
✅ PASSOU - OF001 foi programada na M01
✅ PASSOU - OF002 foi programada na M01
✅ PASSOU - OF003 não foi programada por falta de capacidade
✅ PASSOU - M01 ficou com 7h

========================================
TESTE 6 - OF COMPARTILHADA
========================================
OF004 distribuída para M03
OF004 ficou na M03
✅ PASSOU - OF compartilhada vai para a máquina com menor carga

========================================
TESTE 7 - TROCA DE COR
========================================
OF001: SEM TROCA | OF002: SEM TROCA | OF003: TROCA | OF004: TROCA
✅ PASSOU - Primeira OF não possui troca
✅ PASSOU - Mesma cor não gera troca
✅ PASSOU - Branco para Azul gera troca
✅ PASSOU - Azul para Preto gera troca

========================================
TESTE 8 - FILAS POR MÁQUINA
========================================
M01: OF001, OF002
M02: OF003
M03: Nenhuma
✅ PASSOU - M01 possui 2 OFs
✅ PASSOU - M02 possui 1 OF
✅ PASSOU - M03 está vazia
✅ PASSOU - OF não programada não entra em nenhuma fila

========================================
TESTE 9 - CENÁRIO COMPLETO
========================================
OF003 distribuída para M01
OF002 direcionada para M01
OF004 distribuída para M02
NÃO FOI POSSÍVEL PROGRAMAR OF001 na M01.
Capacidade disponível: 0h | Tempo necessário: 4h

========================================
FILA GERAL DE PRODUÇÃO
========================================
1º - OF003 | Entrega: 2026-09-14 | Cor: Preto | Medida: 40x50 | Máquina: M01 | Urgente: SIM | Troca de cor: NÃO
2º - OF002 | Entrega: 2026-09-13 | Cor: Branco | Medida: 30x40 | Máquina: M01 | Urgente: NÃO | Troca de cor: SIM
3º - OF004 | Entrega: 2026-09-13 | Cor: Azul | Medida: 40x50 | Máquina: M02 | Urgente: NÃO | Troca de cor: SIM
4º - OF001 | Entrega: 2026-09-15 | Cor: Azul | Medida: 30x40 | Máquina: Não programada | Urgente: NÃO | Troca de cor: NÃO

========================================
FILAS POR MÁQUINA
========================================

Máquina M01:
1º - OF003 | Cor: Preto | Medida: 40x50 | Tempo: 5h
2º - OF002 | Cor: Branco | Medida: 30x40 | Tempo: 3h

Máquina M02:
1º - OF004 | Cor: Azul | Medida: 40x50 | Tempo: 2h

Máquina M03:
Nenhuma OF programada.

========================================
CARGA DAS MÁQUINAS
========================================
M01 - Impressora 01 | Ocupação: 8h / 8h
M02 - Impressora 02 | Ocupação: 2h / 8h
M03 - Impressora 03 | Ocupação: 0h / 8h

========================================
REGISTRO DE ALTERAÇÕES
========================================
OF: OF003
Usuário: João - PCP
Data e hora: Tue Sep 15 2026 18:19:12 GMT-0300 (Horário Padrão de Brasília)
Motivo: Cliente solicitou antecipação da entrega
Posição anterior: 3
Nova posição: 1
-----------------------------
✅ PASSOU - OF003 foi para M01
✅ PASSOU - OF002 foi para M01
✅ PASSOU - OF004 foi para M02
✅ PASSOU - OF001 ficou não programada
✅ PASSOU - M01 ficou com 8h
✅ PASSOU - M02 ficou com 2h
✅ PASSOU - OF001 não entrou na fila da M01
✅ PASSOU - OF003 possui registro de alteração

========================================
RESUMO DOS TESTES
========================================
✅ Testes que passaram: 31
❌ Testes que não passaram: 0
📊 Total de testes: 31

🎉 TODOS OS TESTES PASSARAM!
========================================
