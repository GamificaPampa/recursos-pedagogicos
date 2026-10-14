# Recursos pedagógicos do GamificaPampa

Jogos para crianças e materiais para professores da Educação Básica, publicados pelo GitHub Pages. Para criar um recurso novo (jogo, atividade, aula, oficina), siga [`.claude/skills/novo-recurso/SKILL.md`](.claude/skills/novo-recurso/SKILL.md).

## Onde fica cada recurso

- `criancas/<nome>/` guarda jogos e atividades que as crianças usam.
- `professores/<nome>/` guarda aulas, oficinas e materiais de formação.
- `modelos/recurso/` é o ponto de partida de todo recurso novo.
- Cada pasta de recurso tem um `index.html` e um `README.md`. O `README.md` da raiz lista todos os recursos.

O recurso em `criancas/robo/` abre em `https://gamificapampa.github.io/recursos-pedagogicos/criancas/robo/`. Toda pasta segue esse padrão.

## Identidade visual

Os recursos carregam fonte, cores e componentes do repositório [identidade-visual](https://github.com/GamificaPampa/identidade-visual) pelo caminho absoluto `/identidade-visual/`, que funciona porque os dois repositórios são publicados no mesmo domínio. Para mudar uma cor ou um componente, mude lá.

## Testar no computador

O caminho `/identidade-visual/` só existe quando os dois repositórios estão lado a lado e servidos a partir da pasta-mãe:

```bash
git clone https://github.com/GamificaPampa/identidade-visual ../identidade-visual
python3 -m http.server 8000 --directory ..
```

Depois abra `http://localhost:8000/recursos-pedagogicos/<publico>/<nome>/`.

## Publicar

Mudanças entram na `main` por pull request, com mensagem no padrão Conventional Commits. Depois do merge, o GitHub Pages publica em cerca de um minuto. Respostas de questionários e dados de professores, crianças ou escolas ficam fora do repositório.
