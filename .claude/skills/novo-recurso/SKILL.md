---
name: novo-recurso
description: Cria um recurso pedagógico novo do GamificaPampa (jogo, atividade, aula ou material de formação de professores) a partir do modelo, com a identidade visual, a pasta, o endereço publicado e o registro no README. Use quando alguém pedir para criar, fazer ou adicionar um jogo, uma atividade ou um material para crianças ou professores no GamificaPampa.
---

# Novo recurso pedagógico

Cada recurso nasce de `modelos/recurso/`, vive numa pasta própria e abre direto no navegador. O caminho do recurso no repositório decide o endereço publicado, conforme o `AGENTS.md`.

## Passos

1. **Ficha do recurso.** Descubra público (crianças ou professores), faixa de idade, projeto (Educador 5.0, GamificaEdu ou outro), o que o recurso ensina, como será usado (celular, tablet, projetor, impresso) e quem é o autor. Pergunte à pessoa só o que faltar no pedido. Pronto quando todos os campos de `modelos/recurso/README.md` têm valor.
2. **Pasta.** Escolha um nome curto em minúsculas, sem acento, com hífen entre as palavras, e confirme que `criancas/<nome>/` ou `professores/<nome>/` ainda não existe. Copie `modelos/recurso/` para lá. Pronto quando a pasta nova tem `index.html` e `README.md`.
3. **Recurso.** Construa o jogo ou o material dentro do `index.html`, seguindo as regras de visual e de conteúdo abaixo. Troque cada comentário `TROCAR` e cada texto de exemplo do modelo. Pronto quando `grep -rn "TROCAR\|Nome do recurso\|O jogo ou o material entra aqui" <pasta>` não encontra nada e o `README.md` da pasta está preenchido.
4. **Teste.** Sirva o repositório como manda o `AGENTS.md` e abra o recurso em largura de celular (375 px) e de projetor (1280 px). Pronto quando a página abre sem erro no console, usa a fonte Fredoka, cabe na tela sem rolagem lateral e cada botão responde ao toque e ao teclado.
5. **Registro.** Acrescente uma linha na tabela certa do `README.md` da raiz, com o link publicado e o link da pasta, no mesmo formato das linhas que já existem, e um cartão na seção certa do `index.html` da raiz (`#criancas`, `#materias` ou `#professores`), igual aos que já estão lá. Se for um jogo para crianças, ele também entra no menu da turma, que monta os cartões a partir de uma lista só:
   - grave o desenho do cartão em `criancas/<nome>/capa.svg` (200 × 120, fundo transparente, como as capas que já existem);
   - gere o QR do link curto com `python ../equipe/ferramentas/qr.py arquivo https://gamificapampa.github.io/<atalho> criancas/<nome>/qr.svg` (o `equipe` é privado; quem não tiver acesso pede ao Arthur);
   - acrescente a pasta à lista `RECURSOS` do `.github/scripts/kit_sem_internet.py`;
   - avise a pessoa que a lista `JOGOS` (`jogos.js`) e o link curto (`404.html`) ficam no repositório do hub, `gamificapampa.github.io`, e ofereça incluir o jogo nos dois.
   Pronto quando o jogo aparece no `/turma/` e o kit sem internet monta sem erro.
6. **Entrega.** Crie uma branch, faça o commit e abra o pull request. Termine dizendo à pessoa o endereço que o recurso terá depois do merge.

## Visual

- Carregue `fontes.css`, `cores.css`, `componentes.css`, `cenario.css` e `animacoes.css` de `/identidade-visual/css/`, como o modelo já faz. Use as variáveis de cor (`--ink`, `--blue`, `--pink`, `--mint`, `--yellow`, `--orange`, `--purple`) e os componentes `.loud`, `.card`, `.btn`, `.pill` e `.bubble`.
- A cor do botão diz a ação, igual em toda a org: `.btn--jogar` (verde) para jogar, `.btn--conhecer` (amarelo) para ler ou ver, `.btn--falar` (rosa) para falar com a equipe, `.btn--compartilhar` (roxo) para mandar o link, `.btn--baixar` (laranja) para baixar, e só `.btn` (branco, sem ícone) para a ação secundária, como voltar. Cada cor tem o seu ícone, e o código dele está na vitrine.
- O céu, as nuvens, os símbolos de código e os morros vêm do cenário do modelo (`.cenario`, `.nuvem`, `.simbolo`, `.morros`), e o movimento vem das classes `.anima-*`. Mude posição e tamanho pelos atributos `style`, sem desenhar outro céu nem escrever `@keyframes` que já existem. A vitrine em `https://gamificapampa.github.io/identidade-visual/` mostra cada peça com o código.
- Escreva o CSS e o JavaScript próprios do recurso no próprio `index.html`. Imagens e sons ficam na pasta do recurso.
- O Bit, o robô do modelo, é o guia. Ele fala em primeira pessoa, no balão, para dar instruções e comemorar acertos.
- Alvos de toque têm pelo menos 48 px. O texto tem contraste alto sobre o fundo. Imagens têm `alt`, e o recurso funciona só com teclado.

## Conteúdo

- Português do Brasil, com palavras que uma criança da faixa de idade conhece e frases curtas. Para professores, linguagem direta de sala de aula.
- Uma instrução por tela. O erro vira dica para tentar de novo, e o acerto ganha festa (estrela, som, mensagem do Bit).
- O recurso funciona sem login e sem cadastro, e nada do que a criança faz sai do navegador. Bibliotecas e serviços externos ficam de fora, para a página abrir rápido na internet da escola.
- Quando o recurso trabalhar um conceito de Engenharia de Software ou de IA, diga no `README.md` da pasta qual conceito é, em uma frase.
