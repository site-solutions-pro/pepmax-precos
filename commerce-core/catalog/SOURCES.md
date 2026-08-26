# PepMax Catalog Source Map

## Objetivo

Registrar as fontes atuais que alimentam a experiência comercial antes da migração para o Commerce Core.

## Fonte legada principal

### `peptides/assets/catalog.js`

Status: **fonte comercial legada primária**.

Contém o array `PRODUCTS` com:

- `slug`;
- nome comercial;
- descrição curta;
- variantes em `items`;
- SKU legado;
- apresentação;
- preço em USD.

Enquanto a migração não estiver concluída, qualquer divergência entre páginas individuais e o array `PRODUCTS` deve ser tratada como finding do agente A5.

## Fontes derivadas / duplicadas

### `assets/home.js`

Mantém uma seleção manual de produtos para o carrossel da Home, incluindo nome, slug, SKU e apresentação. É uma duplicação deliberadamente temporária e deve ser substituída por leitura do snapshot público do Commerce Core.

### `peptides/<slug>/index.html`

As páginas individuais apresentam dados comerciais e científicos. Durante a migração, elas são consumidoras candidatas do catálogo canônico, não fonte de verdade.

### `peptides/assets/catalog-image-overrides.js`

Mantém overrides visuais. Deve permanecer separado de preço, SKU e estoque.

### `peptides/assets/variant-vial-sync.js`

Sincroniza imagem/variante na interface. Deve consumir identidade de variante do catálogo canônico quando o adapter estiver ativo.

## Regras de migração

1. Nenhum preço novo deve ser introduzido diretamente em Home ou página de produto após a ativação do catálogo canônico.
2. Nenhum SKU deve ser inventado durante a extração. Valores ausentes são registrados como `null` e bloqueiam publicação definitiva daquela variante.
3. O catálogo canônico nasce em estado `review/preview` até o A5 confirmar paridade.
4. Custos, fornecedores e margens nunca são emitidos no snapshot público.
5. O arquivo legado só deixa de ser fonte operacional após paridade 100% validada e aprovação do release gate A6.

## Pipeline CC-V1.2

```text
peptides/assets/catalog.js
        |
        v
extract-legacy-catalog.mjs
        |
        +--> products.generated.json
        |        |
        |        +--> auditoria SKU/preço/contagem
        |
        v
public-catalog adapter
        |
        +--> Home
        +--> Shop
        +--> páginas individuais
```
