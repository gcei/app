# Tela 08: Contato Seguro com o Egresso

## Objetivo

Permitir que uma empresa envie uma mensagem ao egresso sem visualizar o e-mail ou telefone dele.

## Referência no TAP

- `RF07` Comunicação segura
- `RNF01` Privacidade e LGPD

## Rota Sugerida

- Fluxo acionado a partir de `/talentos/:id`
- Preferência de UI: diálogo modal ou sheet

## Perfil de Acesso

- Público

## Conteúdo Obrigatório

- Título explicando o envio seguro
- Campo para nome da empresa ou recrutador
- Campo para e-mail de retorno
- Campo para mensagem
- Ação de envio
- Texto informando que o contato do egresso não será exposto

## Componentes `shadcn` Preferenciais

- `sheet` ou `dialog`, conforme profundidade do formulário
- `input`
- `textarea`
- `button`
- `separator`
- Se necessário: adicionar `field`, `field-group`

## Estrutura da Interface

- Overlay curto e direto
- Cabeçalho com contexto do egresso
- Corpo com formulário
- Rodapé com ação de envio

## Regras de Negócio Visíveis

- O remetente deve fornecer meios mínimos de identificação
- O sistema envia a mensagem sem revelar dados privados do egresso
- O envio precisa ter feedback claro de sucesso ou falha

## Estados Necessários

- Carregando ao enviar
- Erro de validação
- Sucesso com confirmação
- Bloqueio por limite ou indisponibilidade, se existir

## Checklist de Planejamento

- Overlay precisa ter título acessível
- O foco deve entrar e sair do modal corretamente
- Campos precisam de `label`
- Não usar confirmação vaga como `Enviado`
- O texto de sucesso deve explicar o que aconteceu

## Observações

- Mesmo sendo um fluxo curto, esta é uma funcionalidade sensível do sistema
- O discurso visual deve priorizar confiança e clareza
