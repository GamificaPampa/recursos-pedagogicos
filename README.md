# Recursos pedagógicos

Jogos e materiais que o GamificaPampa leva para as escolas públicas de Alegrete/RS. Tudo é publicado pelo GitHub Pages em [gamificapampa.github.io/recursos-pedagogicos](https://gamificapampa.github.io/recursos-pedagogicos/), e o menu para projetar na sala está em [gamificapampa.github.io/turma](https://gamificapampa.github.io/turma/).

## Para crianças

Jogos de Engenharia de Software para crianças de 6 a 14 anos. Funcionam no celular, no tablet e no projetor.

| Jogo | Idade | Abrir no navegador | Código |
| --- | --- | --- | --- |
| Robô pega a estrela | 6+ | [jogar](https://gamificapampa.github.io/recursos-pedagogicos/criancas/robo/) | [criancas/robo](criancas/robo) |
| Ninja dos Bugs | 6+ | [jogar](https://gamificapampa.github.io/recursos-pedagogicos/criancas/ninja/) | [criancas/ninja](criancas/ninja) |
| Programação em Dupla | 7+ | [jogar](https://gamificapampa.github.io/recursos-pedagogicos/criancas/dupla/) | [criancas/dupla](criancas/dupla) |
| Conecta o Sistema | 8+ | [jogar](https://gamificapampa.github.io/recursos-pedagogicos/criancas/conecta/) | [criancas/conecta](criancas/conecta) |
| Arcade do Código, três jogos com placar | Todas | [jogar](https://gamificapampa.github.io/recursos-pedagogicos/criancas/arcade/) | [criancas/arcade](criancas/arcade) |
| Caça aos Bugs! | Não informada | [jogar](https://gamificapampa.github.io/recursos-pedagogicos/criancas/caca-bugs/) | [criancas/caca-bugs](criancas/caca-bugs) |
| Missão Dev, a primeira versão dos jogos | Não informada | [jogar](https://gamificapampa.github.io/recursos-pedagogicos/criancas/missao-dev/) | [criancas/missao-dev](criancas/missao-dev) |
| Pizzaria das Frações, exemplo de Matemática | 9 e 10 anos | [jogar](https://gamificapampa.github.io/recursos-pedagogicos/criancas/pizzaria-das-fracoes/) | [criancas/pizzaria-das-fracoes](criancas/pizzaria-das-fracoes) |
| Ciclo da Água, exemplo de Ciências | 10 e 11 anos | [jogar](https://gamificapampa.github.io/recursos-pedagogicos/criancas/ciclo-da-agua/) | [criancas/ciclo-da-agua](criancas/ciclo-da-agua) |
| Fábrica de Sílabas, exemplo de Língua Portuguesa | 6 e 7 anos | [jogar](https://gamificapampa.github.io/recursos-pedagogicos/criancas/fabrica-de-silabas/) | [criancas/fabrica-de-silabas](criancas/fabrica-de-silabas) |
| Caminho da Escola, exemplo de Geografia | 8 e 9 anos | [jogar](https://gamificapampa.github.io/recursos-pedagogicos/criancas/caminho-da-escola/) | [criancas/caminho-da-escola](criancas/caminho-da-escola) |
| Balança do Bit, exemplo de Matemática para os anos finais | 12 e 13 anos | [jogar](https://gamificapampa.github.io/recursos-pedagogicos/criancas/balanca-do-bit/) | [criancas/balanca-do-bit](criancas/balanca-do-bit) |
| Detetive da Notícia, exemplo de Língua Portuguesa para os anos finais | 12 a 15 anos | [jogar](https://gamificapampa.github.io/recursos-pedagogicos/criancas/detetive-da-noticia/) | [criancas/detetive-da-noticia](criancas/detetive-da-noticia) |

Material de apoio: [mapas da Programação em Dupla](https://gamificapampa.github.io/recursos-pedagogicos/criancas/dupla/mapas.html) ([PDF](https://gamificapampa.github.io/recursos-pedagogicos/criancas/dupla/mapas.pdf)) e as telas para projetar na sala do [Arcade](https://gamificapampa.github.io/recursos-pedagogicos/criancas/arcade/estande.html), do [Caça aos Bugs](https://gamificapampa.github.io/recursos-pedagogicos/criancas/caca-bugs/estande.html) e da [Missão Dev](https://gamificapampa.github.io/recursos-pedagogicos/criancas/missao-dev/estande.html).

Sem internet: o [kit sem internet](https://github.com/GamificaPampa/recursos-pedagogicos/releases/download/kit-sem-internet/kit-sem-internet.zip) traz o menu da turma, os jogos e a aula para abrir com dois cliques num notebook ou pendrive. Ele é montado sozinho a cada mudança na `main`, pelo `.github/workflows/kit-sem-internet.yml`.

## Para professores

| Material | Abrir no navegador | Código |
| --- | --- | --- |
| Aula de 50 minutos com os jogos | [página da aula](https://gamificapampa.github.io/recursos-pedagogicos/professores/aula-engenharia-de-software/), [roteiro](https://gamificapampa.github.io/recursos-pedagogicos/professores/aula-engenharia-de-software/roteiro.html), [slides](https://gamificapampa.github.io/recursos-pedagogicos/professores/aula-engenharia-de-software/slides.html), [folha de atividades](https://gamificapampa.github.io/recursos-pedagogicos/professores/aula-engenharia-de-software/atividades.html), [certificado](https://gamificapampa.github.io/recursos-pedagogicos/professores/aula-engenharia-de-software/certificado.html) | [professores/aula-engenharia-de-software](professores/aula-engenharia-de-software) |
| Oficina de Prompts, quatro encontros para criar atividades, histórias e jogos com o Gemini | [página da oficina](https://gamificapampa.github.io/recursos-pedagogicos/professores/oficina-prompts/), [curso online](https://gamificapampa.github.io/recursos-pedagogicos/professores/oficina-prompts/curso.html), [construtor de prompts](https://gamificapampa.github.io/recursos-pedagogicos/professores/oficina-prompts/construtor.html) | [professores/oficina-prompts](professores/oficina-prompts) |
| Medalhas do Bit, para imprimir e entregar na hora da conquista | [medalhas](https://gamificapampa.github.io/recursos-pedagogicos/professores/medalhas/) | [professores/medalhas](professores/medalhas) |

## Como adicionar um recurso

Copie `modelos/recurso/` para `criancas/<nome>/` ou `professores/<nome>/`. O modelo já traz a fonte, as cores, os botões, o céu com nuvens e morros e o mascote Bit, e cada recurso abre em `https://gamificapampa.github.io/recursos-pedagogicos/<publico>/<nome>/`. As regras completas estão em [AGENTS.md](AGENTS.md).

### Com um assistente de IA

Clone este repositório, abra o Claude Code (ou outro assistente que leia `AGENTS.md`) dentro da pasta e peça, por exemplo, "quero criar um jogo de memória sobre algoritmos para crianças de 8 anos". O assistente segue o passo a passo de [`.claude/skills/novo-recurso`](.claude/skills/novo-recurso/SKILL.md), que cobre a ficha do recurso, a pasta, a identidade visual, o teste no celular, o registro neste README e o pull request.

## Créditos

Os jogos e a Oficina de Prompts foram criados por [Arthur Medeiros](https://medeiros08.github.io/) no repositório [Código Mirim](https://github.com/medeiros08/Codigo-Mirim), para apresentar o curso de Engenharia de Software da UNIPAMPA, Campus Alegrete. O jogo Robô pega a estrela é de Paulo Severo ([paulosevero/robo-estrela](https://github.com/paulosevero/robo-estrela)).
