import type { CurriculoMock } from "@/mocks/egresso-curriculos"

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function renderList(items: string[]) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
}

export function downloadCurriculo(curriculo: CurriculoMock) {
  const documentTitle = `${curriculo.nome}.html`
  const html = `<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(curriculo.nome)}</title>
    <style>
      :root {
        color-scheme: light;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 48px;
        font-family: "Nunito Sans", Arial, sans-serif;
        background: #ffffff;
        color: #111827;
      }

      main {
        max-width: 840px;
        margin: 0 auto;
      }

      header {
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 24px;
        margin-bottom: 24px;
      }

      h1,
      h2 {
        margin: 0;
      }

      h1 {
        font-size: 32px;
        line-height: 1.1;
      }

      h2 {
        font-size: 16px;
        margin-bottom: 12px;
      }

      p {
        margin: 0;
        line-height: 1.7;
      }

      section {
        margin-bottom: 24px;
      }

      .meta {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px 24px;
        margin-top: 16px;
      }

      .meta-item span {
        display: block;
      }

      .meta-label {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: #6b7280;
        margin-bottom: 4px;
      }

      ul {
        margin: 0;
        padding-left: 20px;
      }

      li {
        margin-bottom: 8px;
        line-height: 1.7;
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <h1>${escapeHtml(curriculo.nomeCompleto)}</h1>
        <div class="meta">
          <div class="meta-item">
            <span class="meta-label">E-mail</span>
            <span>${escapeHtml(curriculo.email)}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Telefone</span>
            <span>${escapeHtml(curriculo.telefone)}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Cidade</span>
            <span>${escapeHtml(curriculo.cidade)}</span>
          </div>
        </div>
      </header>

      <section>
        <h2>Objetivo profissional</h2>
        <p>${escapeHtml(curriculo.objetivo)}</p>
      </section>

      <section>
        <h2>Habilidades</h2>
        <ul>${renderList(curriculo.habilidades)}</ul>
      </section>

      <section>
        <h2>Idiomas</h2>
        <ul>${renderList(curriculo.idiomas)}</ul>
      </section>

      <section>
        <h2>Experiência</h2>
        <ul>${renderList(curriculo.experiencias)}</ul>
      </section>

      <section>
        <h2>Formação</h2>
        <ul>${renderList(curriculo.formacao)}</ul>
      </section>
    </main>
  </body>
</html>`

  const blob = new Blob([html], { type: "text/html;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = documentTitle
  document.body.appendChild(link)
  link.click()
  link.remove()

  window.setTimeout(() => {
    URL.revokeObjectURL(url)
  }, 0)
}
