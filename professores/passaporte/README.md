# Meu passaporte da Oficina

Um carimbo de Visto, com a data, para cada ferramenta da Oficina de Prompts que o professor já abriu, e uma sugestão do que conhecer agora. Dá para imprimir.

| Campo        | Valor                                                                        |
| ------------ | ---------------------------------------------------------------------------- |
| Público      | Professores da Educação Básica que fazem a Oficina de Prompts                |
| Projeto      | Educador 5.0 e GamificaEdu                                                   |
| O que ensina | O caminho pelas ferramentas da Oficina, do Jogo do Prompt a publicar o jogo  |
| Como usar    | Celular ou computador, no mesmo navegador em que o professor usa a Oficina   |
| Endereço     | https://gamificapampa.github.io/recursos-pedagogicos/professores/passaporte/ |
| Autoria      | Arthur Medeiros                                                              |

Os carimbos vêm do `js/passaporte.js` do `identidade-visual`, que a barra do topo carrega sozinha: abrir a página de uma ferramenta já vale o carimbo. Ficam só no aparelho (`localStorage`, na chave `gp-lembrar:passaporte`), e nada é enviado. Ferramenta nova da Oficina ganha uma linha em `CARIMBOS`, no `passaporte.js`.
