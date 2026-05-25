# Tela 07: Perfil Público do Egresso

## Objetivo

Exibir o resumo profissional do egresso para consulta pública, preservando os dados privados conforme LGPD.

## Referência no TAP

- `RF05` Vitrine pública
- `RF07` Comunicação segura
- `RNF01` Privacidade e LGPD

## Rota Sugerida

- `/talentos/:id`

## Perfil de Acesso

- Público

## Conteúdo Obrigatório

- Nome do egresso
- Curso e vínculo institucional com IFAL
- Cidade e bairro, se permitido
- Habilidades
- Resumo profissional
- Experiências
- Botão de contato

## Componentes `shadcn` Preferenciais

- `card`
- `avatar`
- `button`
- `separator`
- `breadcrumb`
- Se necessário: adicionar `badge`

## Estrutura da Interface

- Cabeçalho com breadcrumb
- Bloco principal com identidade profissional
- Seções separadas para competências e experiências
- Bloco lateral ou final com ação de contato

## Regras de Negócio Visíveis

- Não exibir e-mail, telefone ou endereço completo
- O botão de contato deve mediar a comunicação
- O perfil público precisa reforçar o selo de egresso validado

## Estados Necessários

- Carregando
- Perfil não encontrado
- Perfil oculto
- Perfil sem experiências cadastradas

## Checklist de Planejamento

- Títulos em ordem hierárquica
- Conteúdo longo precisa quebrar linha sem estourar layout
- Ação principal deve ser `Entrar em Contato`
- Em mobile, a ação de contato precisa continuar visível sem cobrir conteúdo

## Observações

- Esta tela deve ser sóbria e profissional
- Evitar qualquer visual que lembre rede social informal
