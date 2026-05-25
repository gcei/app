/**
 * Configuração de ambiente do app.
 *
 * Centraliza a leitura das variáveis `VITE_*` expostas pelo Vite, com validação
 * em tempo de carregamento para falhar cedo caso a configuração esteja ausente.
 */

const rawBaseUrl = import.meta.env.VITE_API_BASE_URL

if (!rawBaseUrl) {
  throw new Error(
    "VITE_API_BASE_URL não está definida. Crie um arquivo .env.local na raiz do projeto com:\n" +
      "VITE_API_BASE_URL=/api  (dev, via proxy do Vite — ver vite.config.ts)",
  )
}

/** URL base da API GCEI, sem barra final. */
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "")
