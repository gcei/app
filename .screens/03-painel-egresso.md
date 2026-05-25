# Tela 03: Painel do Egresso

## Objetivo

Servir como ponto de entrada da área logada, resumindo status do perfil, currículo e próximas ações.

## Referência no TAP

- `RF03` Gestão de perfil
- `RF04` Geração de PDF
- `RNF04` Responsividade

## Rota Sugerida

- `/painel`

## Perfil de Acesso

- Egresso autenticado

## Conteúdo Obrigatório

- Saudação com nome do egresso
- Resumo do perfil
- Indicador de completude
- Acesso para editar dados
- Acesso para gerar currículo
- Resumo de visibilidade pública

## Componentes `shadcn` Preferenciais

- `sidebar`
- `card`
- `button`
- `separator`
- `breadcrumb`
- `avatar`
- `tooltip`
- Se necessário: adicionar `badge`, `progress`

## Estrutura da Interface

- Sidebar para navegação principal em desktop
- Cabeçalho interno com breadcrumb e ação principal
- Cards de resumo em grid
- Área central com próximos passos

## Regras de Negócio Visíveis

- O usuário precisa entender o que falta para ter um currículo completo
- O status público do perfil não deve expor contato privado
- A geração de currículo depende do preenchimento mínimo do perfil

## Estados Necessários

- Carregando resumo inicial
- Perfil incompleto
- Perfil completo
- Sem experiências cadastradas

## Checklist de Planejamento

- Cards com hierarquia forte de título e descrição
- Textos longos precisam quebrar corretamente
- Navegação precisa funcionar em desktop e mobile
- Ação principal deve ser específica, por exemplo `Editar Perfil`
- Evitar excesso de métricas que não existem no TAP

## Observações

- Esta tela é ideal para a narrativa de apresentação do sistema
- O painel deve parecer institucional e objetivo, não uma rede social
