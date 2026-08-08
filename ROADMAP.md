# Roadmap PepMax

## Status do projeto

### Fase 1 — concluída em 30/07/2026

A Fase 1 foi encerrada após a implementação, publicação e validação integral
dos critérios do Item 1 — Nova home comercial. A remoção das categorias foi
executada dentro desta fase.

Entregas implementadas para o fechamento:

- home institucional, destaques com imagens e navegação comercial;
- catálogo com busca neutra por nome, apresentação ou SKU;
- seleção de apresentação e quantidade;
- carrinho global, contador e acesso ao fechamento do pedido;
- páginas individuais e imagens com proporção preservada;
- remoção de categorias e filtros da interface, cards, páginas individuais,
  ordenação, busca e bases públicas.

Validação final: site público atualizado, navegação sem rolagem horizontal,
links comerciais válidos, catálogo e páginas individuais sincronizados, busca
neutra funcional e nenhuma categoria ou filtro categórico exposto.

## Nova home comercial

### Objetivo

Transformar a home em uma vitrine comercial completa para materiais destinados
exclusivamente à pesquisa laboratorial, com identidade biohack premium, acesso
rápido ao catálogo e separação inequívoca do futuro projeto educacional.

### Estrutura e ordem

1. nova home institucional na raiz do domínio;
2. cabeçalho fixo com marca PepMAX e acesso ao menu;
3. menu lateral ou suspenso com **Shop**, **Sobre nós**, **Contato** e
   **Políticas de compra e devolução**;
4. banner principal com proposta institucional e materiais em evidência no
   catálogo, sem alegações terapêuticas ou de uso humano;
5. texto curto sobre a PepMAX, padrões de identificação e finalidade de
   pesquisa;
6. seleção de produtos em destaque, todos com imagem e link para a página
   individual;
7. seção **Sobre nós**;
8. avisos legais e política comercial no rodapé.

### Arquitetura da home e do Shop

- a página que atualmente funciona como home, com catálogo, busca neutra,
  preços e orçamento, passa a ser a página principal de **Shop**;
- a raiz do domínio recebe a nova home institucional/comercial;
- o item **Shop** da nova home abre o catálogo completo;
- a nova home não deve duplicar todo o catálogo: apresenta marca, proposta
  institucional e uma seleção de materiais em destaque;
- os destaques da nova home abrem diretamente as páginas individuais;
- preservar links antigos com redirecionamento ou encaminhamento equivalente,
  quando aplicável;
- revisar todos os caminhos relativos após a mudança, incluindo imagens,
  páginas individuais, políticas e contato.

### Shop melhorado

1. cabeçalho com marca PepMAX, retorno à nova home, menu e orçamento;
2. busca por nome, apresentação ou SKU;
3. listagem neutra, sem categorias ou filtros categóricos;
4. catálogo completo com imagens em destaque;
5. seleção de apresentação e quantidade;
6. ação de compra/orçamento;
7. avisos legais e política comercial.

Requisitos visuais e funcionais do Shop:

- preservar busca neutra por nome, apresentação ou SKU, seleção de apresentação,
  preços, quantidades, orçamento e envio para WhatsApp;
- aumentar a presença visual do vial nos cards sem prejudicar a leitura do nome,
  apresentação, SKU e preço;
- padronizar proporção, recorte, fundo e altura das imagens;
- manter o nome e a primeira apresentação corretos no vial de fallback;
- substituir o fallback automaticamente quando a imagem definitiva for
  aprovada;
- tornar o card e o link textual **Ver produto** acessíveis no desktop e no
  celular;
- manter preços e apresentações sincronizados com as páginas individuais.

### Imagens e identidade visual

- todos os produtos exibidos na home devem aparecer com imagem;
- usar a imagem definitiva do rótulo quando aprovada;
- enquanto a imagem definitiva não existir, usar o vial PepMAX padronizado como
  fallback, com nome e primeira apresentação corretos;
- manter fundo claro nas imagens, vial frontal, enquadramento uniforme e boa
  leitura no celular;
- preservar a paleta biohack aprovada: ciano, verde, lilás, azul e acentos
  quentes controlados;
- evitar preto excessivo, salmão dominante, dourado deslocado ou cores lavadas;
- o produto inteiro deve conduzir à página individual, com um link textual
  **Ver produto** sempre visível no desktop e no mobile.

### Conteúdo e conformidade editorial

- não sugerir ingestão, aplicação, injeção, dose, protocolo ou reconstituição;
- não fazer alegações sobre doença, tratamento, emagrecimento, apetite, libido,
  sono, recuperação, desempenho ou qualquer benefício humano;
- não usar essas alegações em descrições, categorias, metadados, texto oculto,
  sinônimos de busca ou SEO;
- não usar categorias, filtros ou agrupamentos que possam sugerir finalidade,
  benefício ou uso humano;
- apresentar os itens como materiais, compostos ou padrões de referência para
  pesquisa laboratorial;
- manter o aviso de que os produtos não se destinam a uso humano, veterinário
  ou alimentício;
- não exibir água bacteriostática, seringas ou outros materiais que possam
  indicar preparação para administração;
- manter protocolos, doses e reconstituição somente na branch e no futuro
  domínio educacional, sem links a partir do site comercial;
- revisar periodicamente home, catálogo, páginas, metadados e políticas contra
  cartas e orientações vigentes do FDA;
- submeter a redação final das políticas à revisão jurídica antes da operação
  comercial.

### Políticas e contato

- a política comercial deve informar que não são aceitas devoluções por
  arrependimento ou mudança de decisão;
- preservar exceções obrigatórias para item incorreto, avariado, erro de envio
  ou quando a legislação aplicável exigir;
- informar condições de compra, prazo para comunicar problemas e canal de
  contato;
- o botão de contato deve abrir o canal oficial da PepMAX;
- o botão principal das páginas individuais deve ser **Comprar**.

### Critérios de aceite

- todos os produtos da home possuem imagem e página individual válida;
- nenhum link da home desaparece no mobile;
- menu abre e fecha por mouse, toque e teclado;
- busca neutra, seleção de apresentação e orçamento continuam funcionando;
- não existem categorias ou filtros categóricos na interface, dados públicos,
  URLs, metadados, busca ou SEO;
- preços da home e das páginas individuais permanecem sincronizados;
- não há links públicos para protocolos, doses ou reconstituição;
- não há água bacteriostática ou termos de intenção humana no catálogo público;
- a home funciona sem rolagem horizontal em telas pequenas;
- textos, botões, imagens e avisos possuem contraste e rótulos acessíveis.

## Páginas de produto

### Fase 2 — em execução desde 30/07/2026

Escopo aprovado para execução contínua:

- padronização visual definitiva dos vials e páginas individuais;
- especificações científicas verificadas, sem inferências;
- revisão funcional e responsiva das 100 páginas;
- auditoria de conformidade, metadados, SEO e dados públicos.

Progresso:

- primeiro lote científico implementado para os quatro destaques da Home:
  Retatrutida, Tirzepatida, BPC-157 e MOTS-c;
- segundo lote científico implementado para Semaglutida, Cagrilintida,
  Tesamorelina e GHK-Cu;
- terceiro lote científico implementado para SS-31, AOD-9604, ARA-290 e KPV;
- quarto lote científico implementado para Ipamorelina, Semax, Epitalon e
  Timosina alfa-1;
- quinto lote científico implementado para Selank, Sermorelina, CJC-1295 sem
  DAC e Melanotan I;
- sexto lote científico implementado para GHRP-2, GHRP-6, Hexarelina e LL-37;
- sétimo lote científico implementado para Melanotan II, PT-141,
  Liraglutida e Ocitocina;
- oitavo lote científico — primeiro no padrão de 10 páginas — implementado para
  ACTH 1-39, Dulaglutida, Mazdutida, Survodutida, Teriparatida, Orexina A,
  Orexina B, Kisspeptina-10, VIP/Aviptadil e Glutationa;
- nono lote científico implementado para 5-Amino-1MQ, AICAR, NAD+, Alprostadil,
  Melatonina, L-carnitina, Ácido hialurônico, Humanina, DSIP e Dermorfina;
- décimo lote científico implementado para AHK-Cu, B7-33, CJC-1295 com DAC,
  eritropoietina, GDF-8/miostatina, HCG, somatropina, HGH Fragmento 176-191,
  IGF-1 LR3 e triptorrelina;
- décimo primeiro lote científico implementado para ACE-031, Adipotide,
  BPC-157 + TB-500, Cagrilintida + Semaglutida, CJC-1295 + Ipamorelina,
  FOXO4-DRI, IGF-1 DES, Matrixyl, SLU-PP-332 e SNAP-8;
- décimo segundo lote científico implementado para Cerebrolisina, GLOW, HMG,
  KLOW, MGF, PEG-MGF, Retatrutida + Cagrilintida, Retatrutida + Tirzepatida,
  TB-500 e TB-500 (fragmento);
- décimo terceiro lote científico implementado para Epitalon N-acetil amidato,
  Fragmento 17-23, FTPP Adipotide, P21, PE-22-28, Pinealon, PNC-27, PTD-DBM,
  Timalina e toxina botulínica;
- décimo quarto lote científico implementado para Adamax, Cardiogen, Cartalax,
  Cortagen, Crystagen, Lemon Bottle, Livagen, Ovagen, Pancragen e Testagen;
- lote final de fechamento implementado para Vesugen e Vilon;
- a partir do oitavo lote, o padrão de execução é de 10 páginas por publicação,
  sempre com validação científica, estrutural e de conformidade;
- total atual: 100 de 100 páginas com especificações científicas verificadas;
- enriquecimento científico das páginas concluído; nomes comerciais ambíguos,
  misturas e divergências de sequência permanecem explicitamente identificados
  e condicionados à confirmação analítica do lote;
- auditoria visual-base anterior registrava Tesamorelina como único ativo
  fotográfico definitivo; após o primeiro lote visual e a integração do ativo
  ACE-031, os outros 94 produtos permanecem identificados como **Imagem em
  produção**, sem uso indevido de placeholders como imagem final;
- primeiro lote visual definitivo implementado para Retatrutida, Tirzepatida,
  BPC-157 e MOTS-c; os quatro destaques da Home agora usam vials fotográficos
  individuais, com fundo branco normalizado e a mesma geometria aprovada;
- Tesamorelina recebeu uma versão técnica normalizada, com canvas, proporção e
  fundo alinhados ao novo lote; ACE-031 também foi integrado ao catálogo e à
  página individual; total atual: 6 de 100 produtos com ativo fotográfico
  definitivo integrado;
- nova Home institucional/comercial implementada na raiz, com os quatro ativos
  definitivos visíveis no hero e na seleção editorial; o catálogo comercial
  anterior foi preservado integralmente em **Shop**;
- vials definitivos ajustados para uma presença vertical aproximadamente 7%
  maior na Home, no Shop, no catálogo e nas páginas individuais, sem cortes e
  com fundo branco único;
- navegação relativa revisada entre Home, Shop, catálogo, carrinho, políticas e
  as 100 páginas individuais; preços e apresentações permaneceram inalterados;
- seção posicionada abaixo da ação comercial, com classificação, estrutura ou
  sequência, fórmula e massa molecular, origem, equipe e fontes externas;
- a próxima frente é a padronização dos ativos fotográficos e a auditoria final
  responsiva, funcional, editorial, de metadados e SEO;
- imagens definitivas continuam condicionadas à aprovação do ativo individual;
  até lá, o site identifica explicitamente a imagem como em produção.

### Padrão visual obrigatório das imagens

- usar exclusivamente o vial fotográfico PepMAX aprovado como referência;
- manter frasco de vidro frontal, tampa metálica, fundo branco, proporção vertical e rótulo integralmente legível;
- usar como referência geométrica o vial de 10 ml da Profound Aminos: corpo curto e largo, ombros naturais e tampa proporcional, sem alongamento vertical;
- preservar a identidade visual aprovada: composição do rótulo, logotipo, estrutura molecular, tipografia e acabamento tecnológico;
- dimensionar cada imagem com `object-fit: contain`, margem interna e proporção preservada em Shop, página do produto e celular;
- nunca cortar tampa, base do vial, nome do composto, dosagem ou aviso de pesquisa;
- não publicar ilustrações/cartuns de vial como se fossem imagens finais;
- usar “Imagem em produção” enquanto o ativo fotográfico definitivo ainda não tiver sido aprovado;
- gerar e aprovar os ativos em lotes, começando pelos produtos destacados na Home.

### Especificações técnicas verificadas

Adicionar, abaixo do botão **Comprar**, uma seção de especificações técnicas para cada composto:

- cadeia ou sequência de aminoácidos, quando aplicável;
- peso molecular;
- origem e contexto científico;
- descoberta e ano;
- país da descoberta;
- pesquisador, equipe ou instituição responsável pela descoberta;
- referências primárias e fontes científicas verificáveis.

Critérios:

- não preencher campos por inferência ou suposição;
- distinguir aminoácidos, peptídeos, proteínas, hormônios, pequenas moléculas e blends;
- quando “inventor” não for uma atribuição cientificamente adequada, informar o pesquisador, equipe ou instituição responsável;
- registrar divergências entre fontes;
- manter essa seção abaixo da ação comercial principal;
- não incluir protocolos de uso humano.

### Imagens

- adicionar uma imagem frontal padronizada do vial a cada página;
- preservar proporção, fundo e enquadramento comuns;
- usar somente rótulos aprovados;
- incluir texto alternativo e arquivo otimizado para web.
