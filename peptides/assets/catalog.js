const PRODUCTS=[
{slug:"retatrutida",name:"Retatrutida",cat:"GLP-1 e metabólicos",desc:"Composto investigacional de ação tripla em receptores metabólicos.",items:[["RT5","5 mg",30],["RT10","10 mg",37],["RT15","15 mg",43],["RT20","20 mg",48],["RT30","30 mg",54],["RT40","40 mg",66],["RT50","50 mg",79],["RT60","60 mg",90]]},
{slug:"tirzepatida",name:"Tirzepatida",cat:"GLP-1 e metabólicos",desc:"Composto da classe dos agonistas duplos GIP/GLP-1.",items:[["TR5","5 mg",25],["TR10","10 mg",28],["TR15","15 mg",31],["TR20","20 mg",33],["TR30","30 mg",38],["TR40","40 mg",44],["TR50","50 mg",40],["TR60","60 mg",45],["TR80","80 mg",84],["TR100","100 mg",94]]},
{slug:"semaglutida",name:"Semaglutida",cat:"GLP-1 e metabólicos",desc:"Composto da classe dos agonistas do receptor GLP-1.",items:[["SM5","5 mg",25],["SM10","10 mg",28],["SM15","15 mg",31],["SM20","20 mg",33],["SM30","30 mg",38]]},
{slug:"bpc-157",name:"BPC-157",cat:"Reparo e recuperação",desc:"Peptídeo investigacional frequentemente estudado em modelos de reparo tecidual.",items:[["BC5","5 mg",25],["BC10","10 mg",32],["BC20","20 mg",42]]},
{slug:"ghk-cu",name:"GHK-Cu",cat:"Cosmético e estético",desc:"Complexo peptídeo-cobre utilizado em linhas de pesquisa de pele e matriz extracelular.",items:[["CU50","50 mg",30],["CU100","100 mg",55]]},
{slug:"tesamorelina",name:"Tesamorelina",cat:"GH e secretagogos",desc:"Análogo de GHRH para pesquisa especializada.",items:[["TSM5","5 mg",30],["TSM10","10 mg",48],["TSM20","20 mg",77]]},
{slug:"ipamorelina",name:"Ipamorelina",cat:"GH e secretagogos",desc:"Secretagogo investigacional do hormônio do crescimento.",items:[["IP5","5 mg",28],["IP10","10 mg",33]]},
{slug:"mots-c",name:"MOTS-c",cat:"Longevidade e mitocondrial",desc:"Peptídeo derivado da mitocôndria para pesquisa metabólica.",items:[["MS10","10 mg",31],["MS40","40 mg",47]]},
{slug:"ss-31",name:"SS-31 (elamipretida)",cat:"Longevidade e mitocondrial",desc:"Peptídeo direcionado à mitocôndria, também conhecido como elamipretida.",items:[["2S10","10 mg",34],["2S50","50 mg",80]]},
{slug:"tb-500",name:"TB-500",cat:"Reparo e recuperação",desc:"Material investigacional relacionado à timosina beta-4.",items:[["TB5","5 mg",33],["TB10","10 mg",42]]},
{slug:"cjc-1295-ipamorelina",name:"CJC-1295 + Ipamorelina",cat:"Blends e combinações",desc:"Blend investigacional com dois componentes claramente identificados.",items:[["CP10","10 mg total",37]]},
{slug:"glow-70",name:"GLOW 70",cat:"Blends e combinações",desc:"Blend de BPC-157, GHK-Cu e TB-500, com 70 mg totais por vial.",items:[["BBG70","70 mg total",47]]}
];
const money=n=>"US$ "+n.toFixed(2);
const productUrl=p=>`./${p.slug}/`;
function catalog(){
 const grid=document.querySelector("#catalogGrid"),q=document.querySelector("#search"),cat=document.querySelector("#category");
 [...new Set(PRODUCTS.map(p=>p.cat))].forEach(c=>cat.insertAdjacentHTML("beforeend",`<option>${c}</option>`));
 const draw=()=>{const term=q.value.toLowerCase();const list=PRODUCTS.filter(p=>(cat.value==="Todos"||p.cat===cat.value)&&(p.name+" "+p.cat+" "+p.desc).toLowerCase().includes(term));
 grid.innerHTML=list.map(p=>`<a class="card" href="${productUrl(p)}"><span class="category">${p.cat}</span><h2>${p.name}</h2><p>${p.desc}</p><span class="from">A partir de <b>${money(Math.min(...p.items.map(x=>x[2])))}</b> por vial</span></a>`).join("")||`<p class="notice">Nenhum produto encontrado.</p>`};
 q.addEventListener("input",draw);cat.addEventListener("change",draw);draw();
}
function detail(slug){
 const p=PRODUCTS.find(x=>x.slug===slug);if(!p)return;
 document.title=`${p.name} | PepMax Peptides`;
 document.querySelector("#product").innerHTML=`<div><span class="eyebrow">${p.cat}</span><h1>${p.name}</h1><p class="lead">${p.desc}</p><div class="facts"><div class="fact"><b>Pó liofilizado</b>Apresentação de pesquisa</div><div class="fact"><b>Preço por vial</b>Caixa: 10 vials</div><div class="fact"><b>Uso em pesquisa</b>Não destinado ao consumo humano</div></div></div><aside class="panel"><span class="eyebrow">Apresentações disponíveis</span><div class="variants">${p.items.map(x=>`<div class="variant"><span><b>${x[1]}</b><br><span class="sku">SKU ${x[0]}</span></span><b>${money(x[2])}</b></div>`).join("")}</div><a class="btn" href="../../?q=${encodeURIComponent(p.name)}">Adicionar ao orçamento</a><p class="sku" style="margin-top:14px">Preços em dólar americano, por vial. Frete e impostos não incluídos.</p></aside>`;
}
