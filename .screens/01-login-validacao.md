# Tela 01: Acesso Inicial

## Objetivo

Concentrar o acesso inicial com foco em egresso por padrão e atalho simples para empresa.

## Referência no TAP

- `RF01` Autenticação de egresso
- `RNF05` Integração de API
- `RNF04` Responsividade

## Rota Sugerida

- `/login`

## Perfil de Acesso

- Público

## Conteúdo Obrigatório

- Identidade do GCEI e vínculo com o IFAL
- Marca temporária usando `react.svg` enquanto o logo oficial não existir
- Fluxo inicial padrão para egresso
- Campo de CPF para egresso
- Campos de e-mail e senha para empresa
- Botão primário de entrada
- Logo abaixo do botão principal, atalho simples `Sou empresa`
- Texto curto abaixo do CPF informando a validação no SISTEC

## Componentes `shadcn` Preferenciais

- `card`
- `input`
- `button`
- `tooltip`, se houver ajuda contextual
- Se necessário: adicionar `field`, `field-group`, `alert` para estruturar o formulário e retorno de erro

## Estrutura da Interface

- Bloco institucional de apresentação do sistema
- Card central com formulário
- Link simples abaixo da ação principal para alternar o tipo de acesso

## Regras de Negócio Visíveis

- O fluxo padrão exibido ao abrir a tela é o de egresso
- O egresso entra por CPF e depende de validação no SISTEC
- A empresa entra por e-mail e senha
- O acesso interno usa o mesmo acesso de empresa nesta etapa
- Em caso de CPF não encontrado ou não elegível, o fluxo do egresso deve bloquear avanço

## Estados Necessários

- Carregando: botão desabilitado com `spinner`
- Erro de validação: mensagem objetiva com próximo passo
- Sucesso: redirecionamento para pesquisa anual ou painel
- Bloqueio: CPF válido, mas sem status de egresso

## Checklist de Planejamento

- Cada campo com rótulo visível, não apenas placeholder
- Feedback de erro próximo ao campo
- Botão de ação principal sem ruído adicional
- Foco visível no campo e no botão
- Não usar ilustração com gradiente
- Aplicar máscara de CPF durante a digitação
- Garantir que `Sou empresa` fique abaixo da ação principal no fluxo padrão

## Observações

- Esta é a primeira tela crítica da apresentação
- O acesso precisa ser objetivo e sem explicar detalhes técnicos ao usuário final
