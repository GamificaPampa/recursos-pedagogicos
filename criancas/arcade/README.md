# Arcade do Código

Três jogos rápidos com o robô Bit, com níveis e um placar para a turma: Ninja dos Glitches, Esteira de Testes e Robô Construtor.

| Campo        | Valor                                                                                                                              |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| Público      | Todas as idades                                                                                                                    |
| Projeto      | Curso de Engenharia de Software da UNIPAMPA, Campus Alegrete                                                                       |
| O que ensina | Depuração (Ninja dos Glitches), testes de software (Esteira de Testes) e integração e entrega contínuas, o CI/CD (Robô Construtor) |
| Como usar    | Celular. Na sala, projete o [estande.html](estande.html), que mostra o QR code para a turma entrar e o placar ao vivo |
| Endereço     | https://gamificapampa.github.io/recursos-pedagogicos/criancas/arcade/                                                              |
| Autoria      | Arthur Medeiros                                                                                                                    |

O placar passa pelo [ntfy.sh](https://ntfy.sh) e guarda só o apelido e os pontos, por 12 horas. A criança não digita nome: o jogo sorteia um apelido (um bicho, um adjetivo e um número, como "Capivara Veloz 42"), o botão Trocar sorteia outro e ele fica guardado no aparelho.

Cada turma tem a sua sala. O [estande.html](estande.html) sorteia um código de 4 letras e mostra junto do QR code, que já leva o código no endereço (`?sala=ABCD`); só quem usa o mesmo código aparece naquele telão. A criança confere ou digita o código na hora de enviar e, sem ele, joga normal, mas a jogada não vai para o placar. "Nova sala", na engrenagem do telão, troca o código e começa um placar vazio.

Para testar mudanças, use uma cópia com outro canal de placar: o canal deste jogo, com o código da sala no fim, é o que aparece no telão das turmas.

No projetor, aperte P (ou abra com ?professor no fim do endereço) para escolher a fase, mostrar a resposta e pausar.
