# PepMax Commerce Core v1

## Objetivo

Esta pasta inicia a migracao do PepMax de um site/catalogo estatico para um eShop governado por uma fonte central de verdade.

O Commerce Core deve controlar dados comerciais e operacionais. O storefront publico deixa progressivamente de manter precos, SKUs, disponibilidade e regras comerciais duplicadas em HTML/JavaScript.

## Arquitetura de 3 camadas orientada ao eShop

### Camada 1 - Commerce Core privado

Responsavel por:

- produtos e variantes;
- SKU;
- custo privado;
- preco de venda;
- margem e regras de preco;
- estoque e disponibilidade;
- cupons e promocoes;
- impostos e frete;
- clientes;
- pedidos e pagamentos;
- fulfillment e tracking;
- historico, auditoria, aprovacao e rollback.

Dados de custo, fornecedor, margem e regras internas nunca devem ser publicados no storefront.

### Camada 2 - Storefront

Responsavel por:

- Home;
- Shop;
- pagina de produto;
- busca;
- variantes/apresentacoes;
- carrinho;
- checkout;
- conta do cliente;
- pedidos;
- politicas e FAQ.

O storefront deve consumir somente dados publicaveis e aprovados pelo Commerce Core.

### Camada 3 - Biblioteca tecnica

Responsavel por:

- conteudo tecnico e cientifico;
- referencias;
- SEO editorial;
- versionamento;
- status de revisao;
- ligacao controlada com paginas comerciais quando apropriado.

Conteudo editorial nao deve ser usado como deposito de regras comerciais privadas.

## Fluxo alvo

1. dado comercial entra no Commerce Core;
2. validacoes automaticas verificam consistencia;
3. alteracao recebe status de revisao;
4. aprovacao libera snapshot publico;
5. storefront consome apenas o snapshot aprovado;
6. pedidos retornam ao Core como registros transacionais;
7. eventos ficam registrados para auditoria.

## Fase atual

Esta primeira entrega e deliberadamente nao destrutiva. O site existente continua funcionando enquanto contratos, schemas e migracao sao preparados.

### Milestone CC-V1.1 - Fundacao

- contrato central de produto/variante;
- separacao entre campos publicos e privados;
- status de publicacao;
- modelo de estoque;
- modelo inicial de pedido;
- estrategia de migracao do catalogo atual.

### Milestone CC-V1.2 - Catalogo central

- migrar os 100 produtos e suas apresentacoes;
- eliminar duplicacao de SKU/preco entre Home, Shop e paginas individuais;
- gerar snapshot publico validado.

### Milestone CC-V1.3 - Transacao

- carrinho server-backed;
- checkout;
- pagamentos;
- impostos;
- frete;
- pedido persistente.

### Milestone CC-V1.4 - Operacao

- estoque;
- fulfillment;
- tracking;
- conta do cliente;
- painel administrativo;
- auditoria e rollback.

## Regra de arquitetura

Nenhuma nova funcionalidade comercial deve criar uma segunda fonte de verdade para SKU, preco, estoque, disponibilidade ou status de venda.
