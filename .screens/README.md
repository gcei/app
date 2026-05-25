# Especificação de Telas

Este diretório quebra o TAP em entregas menores, orientadas por tela, para sustentar a prototipação do GCEI.

## Fonte

- Documento-base: `.spec/TAP - Proint 2 (1).pdf`
- Requisitos centrais mapeados:
  - `RF01` autenticação por CPF
  - `RF02` pesquisa anual obrigatória
  - `RF03` gestão de perfil
  - `RF04` geração de currículo em PDF
  - `RF05` vitrine pública
  - `RF06` filtros de busca
  - `RF07` contato seguro
  - `RNF01` privacidade e LGPD
  - `RNF04` responsividade

## Regras de Ouro

- Sempre usar `Tailwind CSS`.
- Nunca inventar componente quando já existir equivalente em `shadcn/ui`.
- Antes de compor algo novo, verificar os componentes já instalados em `src/components/ui`.
- Se um componente necessário não estiver instalado, adicionar o componente do ecossistema `shadcn` antes de considerar markup customizado.
- Nunca usar gradientes.
- Toda tela precisa nascer com critérios de responsividade, acessibilidade e estados vazios.
- Ao final de cada ciclo, revisar acentuação e ortografia dos arquivos.

## Componentes Já Disponíveis

- `alert-dialog`
- `avatar`
- `breadcrumb`
- `button`
- `button-group`
- `card`
- `checkbox`
- `input`
- `input-group`
- `separator`
- `sheet`
- `sidebar`
- `skeleton`
- `spinner`
- `switch`
- `table`
- `textarea`
- `toggle`
- `tooltip`

## Fluxo de Planejamento

Cada especificação de tela deve responder:

1. Qual problema do TAP a tela resolve.
2. Quem acessa a tela.
3. Quais dados aparecem e quais dados devem ficar ocultos.
4. Quais componentes `shadcn` devem ser usados primeiro.
5. Quais estados precisam existir: carregando, vazio, erro, sucesso, bloqueio.
6. Quais regras da `web-design-guidelines` influenciam a tela.

## Fases do Protótipo

### Fase 1

- [01-login-validacao.md](./01-login-validacao.md)

### Fase 2

- [02-pesquisa-anual.md](./02-pesquisa-anual.md)

### Fase 3

- [03-painel-egresso.md](./03-painel-egresso.md)
- [04-edicao-perfil.md](./04-edicao-perfil.md)

### Fase 4

- [05-preview-pdf.md](./05-preview-pdf.md)

### Fase 5

- [06-banco-talentos.md](./06-banco-talentos.md)
- [07-perfil-publico.md](./07-perfil-publico.md)
- [08-contato-seguro.md](./08-contato-seguro.md)

## Observação de UX

Durante o planejamento das telas, foram considerados os pontos mais relevantes da `web-design-guidelines`:

- hierarquia clara de títulos
- formulários com rótulos visíveis
- foco visível
- botões com texto específico
- estados vazios e de erro explícitos
- texto preparado para conteúdo longo
- ações destrutivas com confirmação
- layout responsivo sem depender de medições em JavaScript

## Template

Usar [_template.md](./_template.md) para novas telas derivadas do TAP.
