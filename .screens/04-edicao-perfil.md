# Tela 04: Edição de Perfil e Currículo

## Objetivo

Permitir que o egresso preencha e edite seus dados complementares para compor currículo e perfil público.

## Referência no TAP

- `RF03` Gestão de perfil
- `RF04` Geração de PDF
- `RNF01` Privacidade e LGPD
- `RNF04` Responsividade

## Rota Sugerida

- `/perfil/editar`

## Perfil de Acesso

- Egresso autenticado

## Conteúdo Obrigatório

- Dados pessoais permitidos
- Endereço até nível de bairro
- Telefone
- Habilidades
- Experiências
- Links profissionais
- Controle de visibilidade pública do perfil

## Componentes `shadcn` Preferenciais

- `card`
- `input`
- `input-group`
- `textarea`
- `switch`
- `button`
- `separator`
- Se necessário: adicionar `field`, `field-group`, `badge`, `tabs`

## Estrutura da Interface

- Cabeçalho com título e ações de salvar
- Formulário dividido por seções
- Agrupamento lógico: contato, localização, competências, experiências, links

## Regras de Negócio Visíveis

- Endereço completo não deve aparecer na área pública
- E-mail e telefone são dados privados
- O usuário deve controlar se o perfil aparece na vitrine pública
- Habilidades e experiências devem alimentar currículo e perfil público

## Estados Necessários

- Carregando dados atuais
- Erro por validação
- Sucesso ao salvar
- Seções vazias

## Checklist de Planejamento

- Cada campo precisa de rótulo e nome claro
- Não usar placeholder como substituto de instrução
- Campos de link precisam indicar formato esperado
- Em mobile, o formulário deve virar uma coluna única
- Revisar densidade visual para não parecer formulário burocrático

## Observações

- Esta é a tela com maior densidade de dados do protótipo
- Vale considerar divisão por abas apenas se melhorar leitura, não por estética
