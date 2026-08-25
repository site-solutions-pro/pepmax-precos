# PepMax Commerce Core v1

## Objetivo

Transformar o PepMax de um site estatico com catalogo em uma base preparada para operar como eShop completo, sem interromper o storefront atual durante a migracao.

## Principio arquitetural

O storefront nunca deve ser a fonte primaria de produto, preco, estoque, pedido ou regra comercial. O Commerce Core passa a ser a fonte central de verdade e publica somente dados aprovados para a camada publica.

## Arquitetura em 3 camadas

### Camada 1 - Commerce Core / Backoffice

Responsavel por:

- produtos;
- variantes e apresentacoes;
- SKUs;
- custo privado;
- preco de venda;
- margem;
- estoque e disponibilidade;
- cupons e promocoes;
- clientes;
- pedidos;
- pagamentos;
- frete;
- impostos;
- status de fulfillment;
- auditoria e historico;
- fluxo draft -> review -> approved -> published -> archived.

Dados privados como custo, fornecedor e margem nunca devem ser publicados no storefront.

### Camada 2 - Storefront

Responsavel por:

- Home;
- Shop;
- busca;
- pagina de produto;
- selecao de variante;
- carrinho persistente;
- checkout;
- conta do cliente;
- historico de pedidos;
- tracking;
- politicas e FAQ.

O storefront consome apenas uma projecao publica dos dados aprovados no Commerce Core.

### Camada 3 - Biblioteca / Conteudo

Responsavel por:

- biblioteca tecnica;
- SEO;
- referencias;
- dossies;
- versionamento editorial;
- ligacoes contextuais com paginas comerciais quando apropriado.

## Fluxo comercial de referencia

Visitante -> Produto -> Carrinho -> Checkout -> Pagamento -> Pedido -> Fulfillment -> Tracking -> Pos-venda

## Entidades minimas do Commerce Core

### Product

Representa o item comercial conceitual.

Campos principais:

- id
- slug
- name
- description
- status
- brand
- product_type
- research_only
- seo_title
- seo_description
- created_at
- updated_at

### Variant

Cada apresentacao comercial possui SKU proprio.

Campos principais:

- id
- product_id
- sku
- presentation
- price
- compare_at_price
- currency
- cost_private
- inventory_policy
- stock_quantity
- active
- image_url
- weight
- created_at
- updated_at

### Customer

- id
- email
- first_name
- last_name
- phone
- billing_address
- shipping_address
- created_at
- updated_at

### Cart

- id
- customer_id opcional
- session_id
- currency
- status
- created_at
- updated_at

### CartItem

- cart_id
- variant_id
- quantity
- unit_price_snapshot

### Order

- id
- order_number
- customer_id
- email
- currency
- subtotal
- discount_total
- shipping_total
- tax_total
- total
- payment_status
- fulfillment_status
- order_status
- shipping_address
- billing_address
- created_at
- updated_at

### OrderItem

Preserva snapshot do produto para que alteracoes futuras do catalogo nao mudem pedidos antigos.

- order_id
- variant_id
- sku_snapshot
- product_name_snapshot
- presentation_snapshot
- unit_price
- quantity
- line_total

### Payment

- id
- order_id
- provider
- provider_payment_id
- amount
- currency
- status
- created_at

### InventoryMovement

- id
- variant_id
- quantity_delta
- reason
- reference_type
- reference_id
- created_at

### AuditLog

- id
- actor
- entity_type
- entity_id
- action
- before_json
- after_json
- created_at

## Regras obrigatorias

1. Cada variante vendavel possui SKU unico.
2. Preco publico vem exclusivamente da variante aprovada.
3. Custo e margem sao privados.
4. Pedidos preservam snapshots de SKU, nome, apresentacao e preco.
5. Estoque nao pode depender de valores hardcoded no HTML.
6. Checkout deve validar novamente preco, disponibilidade e cupom no servidor antes de criar o pedido.
7. Pagamento nunca deve ser considerado aprovado apenas por retorno do navegador; deve existir confirmacao server-side/webhook.
8. Toda publicacao comercial deve poder ser auditada e revertida.
9. O site atual permanece operacional durante a migracao.
10. Nenhuma mudanca de Commerce Core deve quebrar URLs publicas existentes sem redirecionamento controlado.

## Fases de implementacao

### Fase A - Fundacao

- [x] criar branch dedicada ao Commerce Core v1;
- [x] definir arquitetura e modelo de dados;
- [ ] mapear catalogo atual para produtos e variantes;
- [ ] criar fonte unica de catalogo estruturado;
- [ ] criar validador de SKU, preco e apresentacao;
- [ ] eliminar duplicidade de preco entre Home, Shop e paginas individuais.

### Fase B - API e persistencia

- [ ] provisionar banco PostgreSQL;
- [ ] criar schema e migrations;
- [ ] implementar API de leitura publica;
- [ ] implementar API administrativa autenticada;
- [ ] implementar logs de auditoria.

### Fase C - Carrinho e Checkout

- [ ] carrinho persistente;
- [ ] endpoint de validacao do carrinho;
- [ ] checkout server-side;
- [ ] cupons;
- [ ] frete;
- [ ] impostos;
- [ ] integracao com provedor de pagamento;
- [ ] criacao do pedido somente apos validacao.

### Fase D - Pedidos e Fulfillment

- [ ] painel de pedidos;
- [ ] status de pagamento;
- [ ] status de fulfillment;
- [ ] tracking;
- [ ] notificacoes transacionais;
- [ ] historico do cliente.

### Fase E - Admin

- [ ] autenticacao;
- [ ] CRUD de produtos e variantes;
- [ ] estoque;
- [ ] precificacao;
- [ ] pedidos;
- [ ] cupons;
- [ ] auditoria;
- [ ] preview e aprovacao antes da publicacao.

## Criterio para novas features

Antes de implementar uma mudanca, responder:

> Esta mudanca aproxima o PepMax de um eShop completo, escalavel, auditavel e administravel?

Se nao, deve perder prioridade frente ao Commerce Core.
