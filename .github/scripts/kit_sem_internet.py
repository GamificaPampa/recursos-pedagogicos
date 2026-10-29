"""Monta o kit sem internet: o menu da turma, os jogos e a aula com as crianças, para abrir com dois cliques
num notebook ou num pendrive, mesmo sem internet.

O GitHub Actions roda este arquivo a cada mudança na main (.github/workflows/kit-sem-internet.yml) e publica o
kit-sem-internet.zip na release "kit-sem-internet". Para montar no computador, com os repositórios lado a lado
como pede o AGENTS.md:

    python .github/scripts/kit_sem_internet.py ../gamificapampa.github.io ../identidade-visual saida

Só os QR codes continuam apontando para o site, porque são lidos pelos celulares.
"""
import os
import re
import shutil
import sys
from pathlib import Path

SITE = "https://gamificapampa.github.io/"
RAIZ = Path(__file__).resolve().parents[2]
# Os jogos do menu da turma (a lista JOGOS do jogos.js do hub) e a aula com as crianças
RECURSOS = ["criancas/robo", "criancas/ninja", "criancas/dupla", "criancas/conecta", "criancas/arcade",
            "criancas/caca-bugs", "criancas/missao-dev", "criancas/pizzaria-das-fracoes", "criancas/balanca-do-bit",
            "criancas/fabrica-de-silabas", "criancas/detetive-da-noticia", "criancas/ciclo-da-agua",
            "criancas/caminho-da-escola", "criancas/linha-do-tempo", "criancas/atelie-das-cores",
            "criancas/circuito-do-bit", "criancas/ingles-com-o-bit", "criancas/reta-do-bit", "criancas/laboratorio-de-equacoes",
            "criancas/genetica-do-bit", "criancas/lampada-do-bit", "criancas/quem-pensou-isso",
            "criancas/dados-em-jogo", "criancas/escolas-literarias", "criancas/monte-a-redacao",
            "criancas/mapa-do-bit", "criancas/detetive-da-historia", "criancas/galeria-do-bit", "criancas/cozinha-das-misturas", "professores/aula-engenharia-de-software"]
FONTE = "identidade-visual/fontes/fredoka/fredoka.woff2"
# Pastas do identidade-visual que as páginas do kit carregam: CSS, scripts (Bit que fala e ícones), poses do Bit e logos
PASTAS_IDENTIDADE = ["css", "js", "mascote", "logos"]
FONTE_GOOGLE = re.compile(r'(?:<link rel="preconnect" href="https://fonts\.(?:googleapis|gstatic)\.com"(?: crossorigin)?>\s*)*'
                          r'<link href="https://fonts\.googleapis\.com/css2\?family=Fredoka[^"]*" rel="stylesheet">')
LEIA_ME = """Kit sem internet do GamificaPampa

Dê dois cliques em index.html para abrir o menu dos jogos para a turma. Os jogos, os slides,
o roteiro, a folha de atividades e o certificado da aula abrem direto deste computador ou
pendrive, sem internet.

O que ainda precisa de internet:
- os QR codes, que abrem a versão online no celular das crianças;
- o placar ao vivo do Arcade do Código e do Caça aos Bugs.

Sem celular para a turma, use os cartões de seta do roteiro e os mapas impressos da
Programação em Dupla.

Versão online: https://gamificapampa.github.io/turma/
"""


def relativo(destino, arquivo):
    return os.path.relpath(destino, arquivo.parent).replace(os.sep, "/")


def no_kit(caminho, kit):
    # Endereço dentro do kit para um caminho do site, ou None se ele não veio para o kit
    alvo = kit / caminho
    if caminho.endswith("/") or alvo.is_dir():
        alvo = alvo / "index.html"
    return alvo if alvo.is_file() else None


def ajustar(arquivo, kit):
    texto = arquivo.read_text(encoding="utf-8")
    fonte = relativo(kit / FONTE, arquivo)
    texto = texto.replace('url("/identidade-visual/fontes/fredoka/fredoka.woff2")', f'url("{fonte}")')
    texto = FONTE_GOOGLE.sub(f'<style>@font-face {{ font-family: "Fredoka"; src: url("{fonte}") format("woff2"); '
                             'font-weight: 300 700; font-display: swap }</style>', texto)

    def identidade(encontrado):
        # /identidade-visual/js/bit.js vira um caminho relativo para a cópia que veio no kit
        alvo = kit / "identidade-visual" / encontrado.group(2)
        if not alvo.is_file():
            return encontrado.group(0)
        return f"{encontrado.group(1)}{relativo(alvo, arquivo)}{encontrado.group(3)}"

    texto = re.sub(r'((?:src|href)="|url\(")/identidade-visual/([^"]+)(")', identidade, texto)
    # A lista de jogos do hub, que o menu da turma lê, fica na raiz do kit
    texto = texto.replace('src="/jogos.js"', f'src="{relativo(kit / "jogos.js", arquivo)}"')

    def link(encontrado):
        endereco = encontrado.group(2)
        base, marca, ancora = endereco.partition("#")
        if base.startswith(SITE):
            caminho = base[len(SITE):].split("?")[0]
            caminho = "index.html" if caminho in ("turma", "turma/") else caminho.removeprefix("recursos-pedagogicos/")
            alvo = kit / "index.html" if caminho == "index.html" else no_kit("recursos-pedagogicos/" + caminho, kit)
        elif base and not re.match(r"[a-z]+:", base) and not base.startswith("/"):
            alvo = no_kit(os.path.relpath((arquivo.parent / base.split("?")[0]).resolve(), kit).replace(os.sep, "/")
                          + ("/" if base.endswith("/") else ""), kit)
            if alvo is None:
                return encontrado.group(0)
        else:
            return encontrado.group(0)
        if alvo is None:
            return encontrado.group(0)
        return f'{encontrado.group(1)}"{relativo(alvo, arquivo)}{marca}{ancora}"'

    texto = re.sub(r'(href=)"([^"]*)"', link, texto)
    arquivo.write_text(texto, encoding="utf-8", newline="\n")


def conferir(kit):
    # Todo link relativo e todo arquivo carregado pelas páginas precisa existir dentro do kit
    faltando = []
    # O menu da turma monta os cartões pelo jogos.js: cada jogo precisa da pasta, da capa e do QR
    for pasta in re.findall(r"pasta: '([^']+)'", (kit / "jogos.js").read_text(encoding="utf-8")):
        for nome in ("index.html", "capa.svg", "qr.svg"):
            if not (kit / "recursos-pedagogicos" / "criancas" / pasta / nome).is_file():
                faltando.append(f"jogos.js: {pasta}/{nome}")
    for pagina in kit.rglob("*.html"):
        texto = pagina.read_text(encoding="utf-8")
        for endereco in re.findall(r'(?:href|src)="([^"]+)"', texto) + re.findall(r'url\("([^"]+)"\)', texto):
            base = endereco.split("#")[0].split("?")[0]
            if not base or re.match(r"[a-z]+:", base) or base.startswith("//"):
                continue
            if base.startswith("/") or not (pagina.parent / base).exists():
                faltando.append(f"{pagina.relative_to(kit).as_posix()}: {endereco}")
    return faltando


def montar(hub, identidade, saida):
    kit = saida / "kit-sem-internet"
    shutil.rmtree(kit, ignore_errors=True)
    for recurso in RECURSOS:
        shutil.copytree(RAIZ / recurso, kit / "recursos-pedagogicos" / recurso, ignore=shutil.ignore_patterns("*.md"))
    (kit / FONTE).parent.mkdir(parents=True)
    for nome in ("fredoka.woff2", "OFL.txt"):
        shutil.copy2(identidade / "fontes" / "fredoka" / nome, (kit / FONTE).parent / nome)
    for pasta in PASTAS_IDENTIDADE:
        shutil.copytree(identidade / pasta, kit / "identidade-visual" / pasta)
    shutil.copy2(hub / "turma" / "index.html", kit / "index.html")
    shutil.copy2(hub / "jogos.js", kit / "jogos.js")
    (kit / "LEIA-ME.txt").write_text(LEIA_ME, encoding="utf-8", newline="\r\n")
    for pagina in kit.rglob("*.html"):
        ajustar(pagina, kit)
    faltando = conferir(kit)
    if faltando:
        sys.exit("Links que não abrem no kit:\n" + "\n".join(faltando))
    arquivo = shutil.make_archive(str(saida / "kit-sem-internet"), "zip", saida, "kit-sem-internet")
    paginas = len(list(kit.rglob("*.html")))
    print(f"{arquivo}: {paginas} páginas, {os.path.getsize(arquivo) // 1024} KB")


if __name__ == "__main__":
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    montar(Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve(), Path(sys.argv[3]).resolve())
