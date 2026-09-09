approvedVial=function(p,item){
 const escapeXml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const name=escapeXml(p?.name||'PepMAX'),dose=escapeXml(item?.[1]||'');
 const short=name.length>20?name.slice(0,19)+'…':name;
 const font=short.length>16?17:short.length>12?19:short.length>8?22:25;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 560">
 <defs>
  <linearGradient id="cap" x1="0" x2="1"><stop stop-color="#56636a"/><stop offset=".13" stop-color="#eef3f5"/><stop offset=".29" stop-color="#87949a"/><stop offset=".47" stop-color="#f8fbfc"/><stop offset=".66" stop-color="#7c898f"/><stop offset=".84" stop-color="#e7edef"/><stop offset="1" stop-color="#4f5d64"/></linearGradient>
  <linearGradient id="glass" x1="0" x2="1"><stop stop-color="#17313b" stop-opacity=".82"/><stop offset=".08" stop-color="#b8e9f2" stop-opacity=".64"/><stop offset=".19" stop-color="#1a3540" stop-opacity=".62"/><stop offset=".43" stop-color="#effcff" stop-opacity=".24"/><stop offset=".62" stop-color="#0b2028" stop-opacity=".72"/><stop offset=".83" stop-color="#a5e7f2" stop-opacity=".55"/><stop offset="1" stop-color="#142b35" stop-opacity=".82"/></linearGradient>
  <linearGradient id="glassEdge" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d8fbff" stop-opacity=".78"/><stop offset=".32" stop-color="#5bdff0" stop-opacity=".28"/><stop offset=".7" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#3fd9ee" stop-opacity=".5"/></linearGradient>
  <linearGradient id="label" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#05080a"/><stop offset=".55" stop-color="#0b1013"/><stop offset="1" stop-color="#040708"/></linearGradient>
  <radialGradient id="floor" cx="50%" cy="50%" r="50%"><stop stop-color="#000" stop-opacity=".62"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
  <filter id="shadow" x="-40%" y="-30%" width="180%" height="190%"><feDropShadow dx="0" dy="22" stdDeviation="16" flood-color="#000" flood-opacity=".72"/></filter>
  <filter id="glow" x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="8"/></filter>
 </defs>
 <ellipse cx="210" cy="513" rx="112" ry="22" fill="url(#floor)"/>
 <ellipse cx="210" cy="473" rx="78" ry="14" fill="#1ee7ff" opacity=".08" filter="url(#glow)"/>
 <g filter="url(#shadow)">
  <rect x="122" y="40" width="176" height="62" rx="18" fill="url(#cap)" stroke="#d5dfe3" stroke-opacity=".55"/>
  <path d="M132 60h156" stroke="#fff" stroke-opacity=".3"/><path d="M136 86h148" stroke="#38464d" stroke-opacity=".6"/>
  <rect x="143" y="96" width="134" height="36" rx="9" fill="#0c1114" stroke="#64757d" stroke-opacity=".35"/>
  <path d="M151 124h118l20 38v268c0 32-22 55-51 55h-56c-29 0-51-23-51-55V162z" fill="url(#glass)" stroke="url(#glassEdge)" stroke-width="3"/>
  <path d="M151 124h118" stroke="#f2feff" stroke-opacity=".55" stroke-width="2"/>
  <path d="M149 154c18 10 104 10 122 0" fill="none" stroke="#8debf7" stroke-opacity=".25"/>
  <path d="M157 154v265c0 25 10 39 28 48" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="6" stroke-linecap="round"/>
  <path d="M274 164v248c0 22-8 39-23 49" fill="none" stroke="#56dff0" stroke-opacity=".19" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="210" cy="459" rx="62" ry="10" fill="#d9fbff" opacity=".14"/>
  <rect x="139" y="205" width="142" height="194" rx="4" fill="url(#label)" stroke="#22343c"/>
  <path d="M143 209h134" stroke="#1fe3fb" stroke-opacity=".22"/>
  <text x="210" y="246" text-anchor="middle" font-family="Inter,Poppins,Arial,sans-serif" font-size="27" font-weight="500" fill="#f5f8f9">Pep<tspan fill="#20dff7">MAX</tspan></text>
  <line x1="159" y1="264" x2="261" y2="264" stroke="#22343a"/>
  <text x="210" y="312" text-anchor="middle" font-family="Inter,Poppins,Arial,sans-serif" font-size="${font}" font-weight="500" fill="#fff">${short}</text>
  <text x="210" y="338" text-anchor="middle" font-family="Inter,Poppins,Arial,sans-serif" font-size="8.5" font-weight="600" letter-spacing="1.8" fill="#aebbc0">RESEARCH COMPOUND</text>
  <text x="210" y="359" text-anchor="middle" font-family="Inter,Poppins,Arial,sans-serif" font-size="7.2" font-weight="500" letter-spacing="1.45" fill="#74858c">FOR RESEARCH USE ONLY</text>
  <line x1="160" y1="377" x2="203" y2="377" stroke="#20dff7" stroke-width="3"/>
  <path d="M226 287l14 7 13-8 12 7" fill="none" stroke="#20dff7" stroke-opacity=".19"/><circle cx="226" cy="287" r="2" fill="#20dff7" opacity=".28"/><circle cx="240" cy="294" r="2" fill="#20dff7" opacity=".28"/><circle cx="253" cy="286" r="2" fill="#20dff7" opacity=".28"/><circle cx="265" cy="293" r="2" fill="#20dff7" opacity=".28"/>
  <text x="210" y="430" text-anchor="middle" font-family="Inter,Poppins,Arial,sans-serif" font-size="17" font-weight="600" fill="#20dff7">${dose}</text>
 </g>
 </svg>`;
 return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg)
};
