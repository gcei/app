# Tela 06: Banco de Talentos

## Objetivo

Permitir que empresas e recrutadores encontrem egressos por filtros públicos sem acessar dados sensíveis.

## Referência no TAP

- `RF05` Vitrine pública
- `RF06` Filtros de busca
- `RNF01` Privacidade e LGPD
- `RNF04` Responsividade

## Rota Sugerida

- `/talentos`

## Perfil de Acesso

- Público

## Conteúdo Obrigatório

- Título da vitrine pública
- Campo ou bloco de filtros
- Lista de perfis resumidos
- Contagem de resultados
- Acesso ao detalhe do perfil

## Componentes `shadcn` Preferenciais

- `input`
- `card`
- `button`
- `table`, se houver modo tabular em desktop
- `sheet`, para filtros em mobile
- `avatar`
- `separator`
- `skeleton`
- Se necessário: adicionar `select`, `badge`, `pagination`, `empty`

## Estrutura da Interface

- Cabeçalho público com acesso ao login
- Bloco de filtros
- Lista ou grade de resultados
- Ações por perfil

## Regras de Negócio Visíveis

- Exibir apenas dados profissionais e institucionais
- Não expor e-mail, telefone ou endereço exato
- Filtros prioritários: curso, cidade e habilidades

## Estados Necessários

- Carregando resultados
- Sem resultados
- Erro de busca
- Resultado com poucos itens
- Resultado com paginação

## Checklist de Planejamento

- Filtros precisam refletir no estado da URL
- A listagem deve suportar texto longo em habilidades e experiências
- Cada card deve ter ação específica, por exemplo `Ver Perfil`
- Em mobile, filtros não podem quebrar a leitura dos resultados

## Observações

- Esta tela vende o valor do sistema para o público externo
- A privacidade precisa ser perceptível, não apenas implícita
