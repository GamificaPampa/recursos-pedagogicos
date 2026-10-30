# Caça aos Bugs!

Em 30 segundos, a criança toca nos insetos que aparecem na tela do celular para consertar o app da escola.

| Campo        | Valor                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ |
| Público      | Sem idade definida |
| Projeto      | Curso de Engenharia de Software da UNIPAMPA, Campus Alegrete                                                             |
| O que ensina | Testes e depuração: quem cria software passa muito tempo testando para achar os bugs antes de quem usa o app             |
| Como usar    | Celular. Na sala, projete o [estande.html](estande.html), que mostra o QR code para a turma entrar e o placar ao vivo |
| Endereço     | https://gamificapampa.github.io/recursos-pedagogicos/criancas/caca-bugs/                                                 |
| Autoria      | Arthur Medeiros                                                                                                          |

O placar passa pelo [ntfy.sh](https://ntfy.sh) e guarda só o apelido e os pontos, por 12 horas. A criança não digita nome: o jogo sorteia um apelido (um bicho, um adjetivo e um número, como "Capivara Veloz 42"), o botão Trocar sorteia outro e ele fica guardado no aparelho. O recorde de cada aparelho também fica só no próprio celular.

Cada turma tem a sua sala. O [estande.html](estande.html) sorteia um código de 4 letras e mostra junto do QR code, que já leva o código no endereço (`?sala=ABCD`); só quem usa o mesmo código aparece naquele telão. A criança confere ou digita o código na hora de enviar e, sem ele, joga normal, mas a jogada não vai para o placar. "Nova sala", na engrenagem do telão, troca o código e começa um placar vazio.

O botão "Resumo da turma" do telão abre os números da sala (jogadas, apelidos diferentes, média e melhor pontuação, faixas de pontos e quantos bugs escaparam) e imprime sem listar apelidos; para isso o jogo manda junto da jogada quantos bugs escaparam, sem dado pessoal.

Para testar mudanças, use uma cópia com outro canal de placar: o canal deste jogo, com o código da sala no fim, é o que aparece no telão das turmas.

No projetor, aperte P (ou abra com ?professor no fim do endereço) para escolher a fase, mostrar a resposta e pausar.
