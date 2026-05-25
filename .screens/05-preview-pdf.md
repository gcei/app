# Tela 05: Pré-visualização e Exportação do Currículo

## Objetivo

Permitir que o egresso revise o currículo padronizado e exporte o documento em PDF com selo institucional.

## Referência no TAP

- `RF04` Geração de PDF
- `RNF04` Responsividade

## Rota Sugerida

- `/curriculo`

## Perfil de Acesso

- Egresso autenticado

## Conteúdo Obrigatório

- Prévia do currículo
- Selo de validação institucional
- Botão de exportação
- Aviso quando houver dados faltantes
- Lista resumida das seções incluídas

## Componentes `shadcn` Preferenciais

- `card`
- `button`
- `separator`
- `skeleton`
- `tooltip`
- `alert-dialog`, se houver confirmação antes de sair sem salvar

## Estrutura da Interface

- Cabeçalho com ação principal de exportação
- Área de prévia central
- Coluna lateral ou bloco superior com checklist de preenchimento

## Regras de Negócio Visíveis

- O layout final é padronizado pelo sistema
- O currículo pode ser exportado apenas com conteúdo mínimo preenchido
- O selo do IFAL precisa aparecer como elemento institucional, não decorativo

## Estados Necessários

- Carregando prévia
- Currículo incompleto
- Prévia pronta para exportação
- Erro na geração

## Checklist de Planejamento

- Botão principal com texto específico: `Exportar PDF`
- Preview precisa manter legibilidade em viewport pequena
- Se a visualização embutida for limitada no mobile, priorizar resumo e ação de download
- Não depender de efeitos visuais para comunicar validação

## Observações

- Para o protótipo, a fidelidade visual do PDF é importante para a apresentação
- A tela deve deixar claro que o documento foi gerado a partir dos dados do perfil
