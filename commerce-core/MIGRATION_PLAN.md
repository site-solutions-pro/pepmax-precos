# Migration Plan - PepMax eShop

## Principio

A migracao deve ser incremental e reversivel. O storefront atual permanece funcional ate que cada bloco do Commerce Core esteja validado.

## Estado atual observado

O site ainda possui dados comerciais embutidos em arquivos do frontend. Por exemplo, `assets/home.js` contem uma lista local de produtos com nome, slug, SKU e apresentacao para o carrossel da Home. Esse padrao sera eliminado gradualmente para evitar multiplas fontes de verdade.

## Etapa 1 - Inventario de fontes de dados

Mapear todos os lugares que hoje armazenam ou repetem:

- nome de produto;
- slug;
- SKU;
- apresentacao;
- preco;
- imagem;
- disponibilidade;
- links para pagina individual.

Escopo minimo:

- Home;
- Shop;
- paginas individuais;
- scripts de carrinho;
- arquivos auxiliares em `tools/`;
- eventuais bases JSON/JS existentes.

Resultado esperado: matriz `campo x fonte x consumidor`.

## Etapa 2 - Catalogo canonico

Criar um catalogo canonico privado seguindo `schemas/product.schema.json`.

Regras:

- um SKU deve existir uma unica vez no catalogo canonico;
- precos de venda devem ser derivados somente dessa fonte;
- custos e fornecedores devem permanecer em bloco privado;
- nenhum campo privado pode aparecer no snapshot publico;
- publicacao exige `status=approved` e `publication.state=published`.

## Etapa 3 - Snapshot publico

Gerar artefato publico contendo apenas campos necessarios ao storefront:

- id;
- slug;
- nome;
- descricao publica;
- imagem/alt;
- variantes ativas;
- SKU;
- preco;
- moeda;
- disponibilidade publica;
- versao do snapshot.

Nunca incluir:

- custo;
- fornecedor;
- margem;
- notas internas;
- regras internas de preco;
- credenciais;
- dados pessoais.

## Etapa 4 - Storefront read-only

Migrar consumidores nesta ordem:

1. Home;
2. Shop;
3. paginas individuais;
4. carrinho.

Durante esta etapa o storefront apenas le o snapshot; nenhuma gravacao comercial deve depender de localStorage como fonte autoritativa.

## Etapa 5 - Checkout e pedidos

Adicionar backend transacional para:

- criacao do checkout;
- reserva de estoque;
- calculo de totais;
- desconto;
- imposto;
- frete;
- pagamento;
- criacao de pedido;
- idempotencia;
- confirmacao de pagamento.

O navegador nunca deve ser autoridade para preco final, imposto, desconto ou estoque.

## Etapa 6 - Fulfillment e cliente

Adicionar:

- conta de cliente;
- historico de pedidos;
- status de fulfillment;
- tracking;
- cancelamento/refund conforme regras;
- notificacoes transacionais.

## Etapa 7 - Admin e governanca

Adicionar painel autenticado com:

- CRUD de produto/variante;
- custo e fornecedor;
- preco e margem;
- estoque;
- preview;
- aprovacao;
- publicacao;
- historico;
- diff;
- rollback;
- trilha de auditoria.

## Gates obrigatorios

Nenhuma migracao pode ir para `main` se:

- alterar precos existentes sem aprovacao explicita;
- remover produto ou SKU silenciosamente;
- expor dados privados;
- quebrar links atuais;
- quebrar carrinho existente antes de o substituto estar validado;
- introduzir duas fontes autoritativas para o mesmo dado.

## Definicao de pronto do Commerce Core v1

O v1 sera considerado funcional quando:

- os 100 produtos estiverem no catalogo canonico;
- Home, Shop e paginas individuais consumirem a mesma fonte;
- precos/SKUs nao forem duplicados manualmente no frontend;
- houver validacao automatica do catalogo;
- checkout persistente criar pedidos no backend;
- pagamento, estoque e total do pedido forem validados no servidor;
- houver administracao e auditoria basicas;
- o storefront atual puder ser desligado sem perda de dados comerciais.
