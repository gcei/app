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
- Campos de e-mail e senha para egresso
- Campos de e-mail e senha para empresa
- Link `Esqueci minha senha` em ambos os modos
- Botão primário de entrada
- Logo abaixo do botão principal, atalho simples `Sou empresa`

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
- O egresso entra por e-mail e senha
- A empresa entra por e-mail e senha
- O acesso interno usa o mesmo acesso de empresa nesta etapa
- Em caso de credenciais inválidas, o fluxo deve bloquear o avanço com mensagem de erro

## Estados Necessários

- Carregando: botão desabilitado com `spinner`
- Erro de validação: mensagem objetiva com próximo passo
- Sucesso: redirecionamento para pesquisa anual ou painel
- Bloqueio: usuário válido, mas sem permissão de acesso

## Checklist de Planejamento

- Cada campo com rótulo visível, não apenas placeholder
- Feedback de erro próximo ao campo
- Botão de ação principal sem ruído adicional
- Foco visível no campo e no botão
- Não usar ilustração com gradiente
- Garantir que `Sou empresa` fique abaixo da ação principal no fluxo padrão

## Observações

- Esta é a primeira tela crítica da apresentação
- O acesso precisa ser objetivo e sem explicar detalhes técnicos ao usuário final
