# Controle Financeiro

Projeto web simples para gerenciar finanças pessoais, registrar entradas e saídas, organizar movimentações por categoria e acompanhar compras feitas no crédito.

Esta versão mantém a proposta do projeto original, mas com uma interface redesenhada, usando um visual inspirado em caderno financeiro/ledger, cartões de resumo e navegação por abas.

## Funcionalidades

- Cadastro de movimentações financeiras.
- Classificação por tipo: entrada ou saída.
- Seleção de categoria e meio de pagamento.
- Suporte a compras parceladas no crédito.
- Cálculo automático de saldo atual, total de entradas e total de saídas.
- Filtros por tipo, período, categoria, meio de pagamento e intervalo de datas.
- Aba para cadastro, edição e exclusão de categorias.
- Aba de fatura para visualizar compras no crédito por mês/ano.
- Persistência dos dados no navegador usando `localStorage`.

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript
- LocalStorage

## Estrutura do Projeto

```text
Controle-financeiro/
├── index.html
├── style.css
├── script.js
├── script_sem comentarios.js
└── README.md
```

## Como Executar

Como o projeto não depende de servidor ou instalação de pacotes, basta abrir o arquivo `index.html` no navegador.

1. Baixe ou clone este repositório.
2. Abra a pasta do projeto.
3. Dê dois cliques no arquivo `index.html`.

Também é possível abrir com a extensão Live Server do VS Code, caso prefira.

## Como Usar

Na aba **Movimentações**, cadastre uma nova entrada ou saída preenchendo descrição, valor, tipo, data, categoria e meio de pagamento.

Se o meio de pagamento for crédito, o sistema permite informar o número de parcelas. As parcelas são distribuídas automaticamente em meses diferentes.

Na aba **Categorias**, é possível criar novas categorias, editar categorias existentes e remover categorias que não estejam vinculadas a movimentações.

Na aba **Fatura**, o sistema mostra as compras feitas no crédito e permite filtrar por mês e ano.

## Armazenamento dos Dados

Os dados são salvos localmente no navegador por meio do `localStorage`. Isso significa que:

- As informações continuam salvas ao recarregar a página.
- Os dados ficam apenas no navegador usado.
- Limpar os dados do navegador pode apagar as movimentações e categorias cadastradas.

## Observações

Este projeto foi desenvolvido com foco em estudo e prática de manipulação do DOM, formulários, filtros, persistência local e organização visual com CSS.
