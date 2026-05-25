# Tela 02: Pesquisa Anual Obrigatória

## Objetivo

Coletar a atualização cadastral e a situação profissional do egresso antes de liberar o restante do fluxo logado.

## Referência no TAP

- `RF02` Pesquisa anual obrigatória
- `RNF01` Privacidade e LGPD
- `RNF04` Responsividade

## Rota Sugerida

- `/pesquisa-anual`

## Perfil de Acesso

- Egresso autenticado

## Conteúdo Obrigatório

- Título explicando obrigatoriedade da atualização
- Texto curto sobre finalidade institucional da coleta
- Lista de perguntas objetivas
- Campo para e-mail atual
- Ação primária para enviar respostas
- Indicação de progresso, se a tela for paginada

## Componentes `shadcn` Preferenciais

- `card`
- `input`
- `checkbox`
- `button`
- `separator`
- Se necessário: adicionar `field`, `field-group`, `radio-group`, `select`, `progress`

## Estrutura da Interface

- Cabeçalho simples, sem distrações
- Card principal com formulário
- Rodapé do card com ação de envio

## Regras de Negócio Visíveis

- O usuário não deve pular essa etapa quando ela estiver pendente
- Perguntas precisam ser objetivas e rápidas de responder
- O sistema deve explicar por que o e-mail atualizado é solicitado

## Estados Necessários

- Carregando ao salvar
- Erro por campo obrigatório não preenchido
- Sucesso com liberação do painel
- Estado parcial, se houver salvamento em rascunho

## Checklist de Planejamento

- Usar grupos de campos com legendas claras
- Manter perguntas e respostas como único alvo clicável
- Não usar textos genéricos como `Continuar`
- Em telas pequenas, perguntas e ações devem permanecer legíveis
- Se houver múltiplas etapas, refletir progresso sem ambiguidade

## Observações

- Esta tela existe por regra de negócio, então a UX precisa reduzir atrito
- Idealmente não deve parecer um cadastro longo
