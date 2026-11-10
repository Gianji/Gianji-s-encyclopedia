/* ENCICLOPEDIA — lettura pubblica. Contenuti statici versionati su GitHub. */
(() => {
  'use strict';

  const PSYCHOLOGY_INDEX = Array.isArray(window.PSICOLOGIA_INDICE) ? window.PSICOLOGIA_INDICE : [];
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const paths = {
    book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
    library:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M12 4v16"/>',
    file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
    'file-plus':'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 12v6M9 15h6"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    archive:'<rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v12h14V8M10 12h4"/>',
    x:'<path d="M18 6 6 18M6 6l12 12"/>',
    download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4"/>',
    upload:'<path d="M12 16V4m-4 4 4-4 4 4M4 17v4h16v-4"/>',
    chevron:'<path d="m9 18 6-6-6-6"/>',
    arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
    more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    pencil:'<path d="m16 5 3 3M4 20l4.5-1 10.2-10.2a2.12 2.12 0 0 0-3-3L5.5 16z"/>',
    trash:'<path d="M3 6h18m-2 0-1 14H6L5 6m3 0V4h8v2M10 10v7M14 10v7"/>',
    check:'<path d="M20 6 9 17l-5-5"/>',
    info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    corner:'<path d="M8 5h11v11M19 5 5 19"/>'
  };
  function ico(name) {
    const body = paths[name] || paths.file;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }
  function hydrateIcons(root = document) {
    $$('[data-icon]', root).forEach(el => { el.innerHTML = ico(el.dataset.icon); el.removeAttribute('data-icon'); });
  }
  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function makeId() {
    return typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID() : `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,10)}`;
  }
  function normalize(str) {
    return String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('it-IT').trim();
  }
  function slug(s) {return normalize(s).replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') || 'sezione';}
  const now = () => '2026-11-10T12:45:00+01:00';
  const dateFmt = d => {
    const t = new Date(d);
    return Number.isFinite(t.getTime()) ? new Intl.DateTimeFormat('it-IT',{day:'numeric',month:'short',year:'numeric'}).format(t) : '—';
  };
  const sortIt = (a,b) => a.localeCompare(b,'it',{numeric:true,sensitivity:'base'});
  const getEn = id => db.encyclopedias.find(e=>e.id===id);
  const getArt = id => db.articles.find(a=>a.id===id);
  const getArticles = id => db.articles.filter(a=>a.encyclopediaId===id);
  const articleCount = id => getArticles(id).length;
  const plural = (count, singular, pluralWord) => `${count} ${count === 1 ? singular : pluralWord}`;
  // Metrica editoriale: conteggio conservativo, riproducibile, dei lemmi non grammaticali.
  // Non è un lemmatizzatore morfosintattico: il dato è una stima, non una certificazione linguistica.
  const VOLUME_MIN_WORDS=20000;
  const VOLUME_TARGET_WORDS=40000;
  const MIN_WORD_GOAL=new Set(PSYCHOLOGY_INDEX.flatMap(area=>area.topics.map(normalize))).size * VOLUME_TARGET_WORDS;
  const stopWords=new Set((
    'a ad ai agli al alla alle allo all anche anziche avendo avere aveva avevano avevi avevo avra avranno avrebbe avrebbero avresti avrete avremo avro '+
    'c ce ci cio cioe come con contro cui d da dagli dai dal dalla dalle dallo de degli dei del della delle dello dell di dopo durante '+
    'e ed egli ella esse essi esso essa essendo eppure era eramo erano eravate eravamo eravamo eri ero essere '+
    'fra fu furono gia gli ha hai hanno ho i il in io l la le lei li lo loro lui ma me mi mentre miei mio mia mie '+
    'ne nei nel nella nelle nello nessuna nessuno no non noi nostra nostre nostri nostro o od oppure ora per pero poiche '+
    'quale quali quando quanto quanti quante quella quelle quelli quello questa queste questi questo qui '+
    'sara saranno sarebbe sarebbero saremo sarete sarò se sei senza si sia siamo siano siete sono sopra sotto sua sue suoi suo '+
    'sul sulla sulle sugli sui sullo su sua sua su un una uno uno tra tu tua tue tuoi tuo '+
    'vi voi vostra vostre vostri vostro che chi cosa cosi tanto talmente tale tali molto molti molte ogni '+
    'alcuna alcuni alcune alcune alcuni altro altri altre altra alle allora almeno ancora invece dunque quindi '+
    'tuttavia benché sebbene siccome affinché qualora nonostante pur prima poi sempre mai gia '+
    'nel nei negli nelle nell dell dall all sull c d l m n s t '+
    'fui foste fossi fosse fossero stato stata stati state ecco ecc'
  ).normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/\s+/));
  const numberIt=n=>new Intl.NumberFormat('it-IT').format(n);
  function contentWordCount(markdown) {
    const body=String(markdown||'').split(/^#{1,4}\s+(?:bibliografia|sitografia|fonti(?:\s+e\s+riferimenti)?|riferimenti\s+bibliografici|bibliography|references)\s*$/im)[0];
    const clean=body.replace(/https?:\/\/[^\s)]+/g,' ').replace(/\[\^\d+\]/g,' ');
    const tokens=clean.match(/\p{L}+(?:['’]\p{L}+)*/gu)||[];
    return tokens.reduce((sum,word)=>{
      const normalized=normalize(word).replace(/^[\p{L}]+['’]/u,'');
      return sum+(normalized.length>1&&!stopWords.has(normalized)?1:0);
    },0);
  }
  function isVolumeComplete(article) {
    // La lunghezza, da sola, non certifica rigore scientifico o unicità dei contenuti.
    return contentWordCount(article.content)>=VOLUME_TARGET_WORDS && article.editorialStatus==='complete'
      && article.factChecked===true && article.duplicationAudit===true
      && article.wordCountCertified===true && article.bibliographyAudit===true;
  }
  const countBookStatus=articles=>articles.filter(isVolumeComplete).length;
  function initialData() {
    return {version:1, encyclopedias:[{
      id:'psicologia',name:'Psicologia',description:'Studio scientifico della mente, del comportamento e delle relazioni: dalla storia alle applicazioni.',createdAt:now(),updatedAt:now()
    }],articles:[]};
  }
  function loadDb() {
    const base=initialData();
    const published=Array.isArray(window.ENCICLOPEDIA_ARTICOLI)?window.ENCICLOPEDIA_ARTICOLI:[];
    const additional=Array.isArray(window.ENCICLOPEDIA_ARTICOLI_EXTRA)?window.ENCICLOPEDIA_ARTICOLI_EXTRA:[];
    const usable=[...published,...additional].filter(a=>a&&a.id&&a.title&&a.encyclopediaId&&typeof a.content==='string');
    base.articles=[...new Map(usable.map(a=>[a.id,a])).values()]
      .map(a=>({...a,summary:a.summary||'',path:a.path||'',sources:Array.isArray(a.sources)?a.sources:[]}));
    return base;
  }
  let db = loadDb();
  let modalReturnFocus = null;
  let lastRouteKey = '';


  function closeMenus() {
    const menu=$('#new-menu'),button=$('#new-button'),context=$('#context-menu');
    if(menu)menu.hidden=true;
    if(button)button.setAttribute('aria-expanded','false');
    if(context)context.hidden=true;
  }

  function toast(msg) {
    const root=$('#toast-root');
    root.innerHTML=`<div class="toast">${ico('check')}<span>${esc(msg)}</span></div>`;
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>root.innerHTML='',3800);
  }
  function getRoute() {
    const hash=(location.hash||'#/').slice(1), clean=hash.split('?')[0];
    const parts=clean.split('/').filter(Boolean).map(part=>{try{return decodeURIComponent(part);}catch{return part;}});
    const searchParams=new URLSearchParams(hash.includes('?') ? hash.slice(hash.indexOf('?')+1):'');
    return {type:parts[0]||'home',id:parts[1]||'',section:searchParams.get('sezione')||'',title:searchParams.get('titolo')||'',path:searchParams.get('percorso')||''};
  }
  function routeId(route) {
    if(route.type==='enciclopedia'||route.type==='nuova-voce')return route.id;
    if(route.type==='voce'||route.type==='modifica')return getArt(route.id)?.encyclopediaId||'';
    return '';
  }
  function linkForArticle(id, section='') {return `#/voce/${encodeURIComponent(id)}${section?`?sezione=${encodeURIComponent(slug(section))}`:''}`;}
  function go(url) {
    closeMenus();closeMobile();
    if(location.hash===url)render();else location.hash=url;
  }
  function closeMobile() {
    $('#sidebar').classList.remove('open');$('#mobile-shade').hidden=true;
    $('.mobile-menu-button').setAttribute('aria-expanded','false');
  }
  function bread(items) {
    $('#breadcrumb').innerHTML=items.map((x,i)=>{
      const content=x.href?`<a href="${esc(x.href)}">${esc(x.label)}</a>`:`<span class="current">${esc(x.label)}</span>`;
      return `${i?'<span class="crumb-sep">/</span>':''}${content}`;
    }).join('');
  }
  function renderSidebar(route) {
    const nav=$('#sidebar-nav'),activeId=routeId(route);
    nav.innerHTML=`<a class="nav-item ${route.type==='home'?'active':''}" href="#/">${ico('library')}<span class="label">Biblioteca</span></a>
      <div class="nav-separator"></div>${[...db.encyclopedias].sort((a,b)=>sortIt(a.name,b.name)).map(en=>
      `<a class="nav-item ${en.id===activeId?'active':''}" href="#/enciclopedia/${encodeURIComponent(en.id)}">${ico('book')}<span class="label">${esc(en.name)}</span><span class="nav-count">${articleCount(en.id)}</span></a>`
      ).join('')}`;
  }
  function emptyBlock(title,body,label,action,icon='file') {
    return `<div class="empty-card"><span class="empty-icon">${ico(icon)}</span><h3>${esc(title)}</h3><p>${esc(body)}</p><button type="button" class="secondary-button" data-action="${esc(action)}">${ico('plus')}${esc(label)}</button></div>`;
  }
  function renderHome() {
    bread([{label:'Biblioteca'}]);
    const libraries=[...db.encyclopedias].sort((a,b)=>sortIt(a.name,b.name));
    const recent=[...db.articles].sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt)).slice(0,7);
    $('#main').innerHTML=`<div class="hero"><p class="eyebrow">BIBLIOTECA DEL SAPERE</p>
       <h1 class="display-title">Ogni conoscenza,<br>al suo posto.</h1>
       <p class="description">Enciclopedie costruite e documentate per la consultazione. Tu scegli le materie, i contenuti vengono redatti e aggiornati direttamente in questo archivio.</p></div>
       <section aria-labelledby="libraries-title"><div class="section-heading"><h2 id="libraries-title">Enciclopedie</h2><small>${plural(libraries.length,'collezione','collezioni')}</small></div>
       <div class="library-grid">${libraries.map(en=>`<a class="library-card" href="#/enciclopedia/${encodeURIComponent(en.id)}">
       <span class="library-icon">${ico('book')}</span><span class="library-card-title">${esc(en.name)}</span>
       <span class="library-card-subtitle">${esc(en.description||'Un archivio della conoscenza.')}</span>
       <span class="library-card-bottom">${plural(articleCount(en.id),'voce pubblicata','voci pubblicate')}${ico('corner')}</span></a>`).join('')}</div></section>
       ${recent.length?`<section class="recent-section"><div class="section-heading"><h2>Ultime pubblicazioni</h2><small>${plural(db.articles.length,'voce','voci')}</small></div>
       <div class="recent-list">${recent.map(article=>`<a href="${linkForArticle(article.id)}" class="recent-row">
       <span class="recent-icon">${ico('file')}</span><span class="recent-details"><strong>${esc(article.title)}</strong>
       <small>${esc(getEn(article.encyclopediaId)?.name||'')} · ${esc(article.path||'')}</small></span>
       <span class="recent-date">${dateFmt(article.updatedAt)}</span></a>`).join('')}</div></section>`:''}`;
  }

  function buildTree(articles) {
    const root={children:new Map(),articles:[]};
    for(const a of articles) {
      const tokens=String(a.path||'').split('/').map(x=>x.trim()).filter(Boolean),p=tokens.length?tokens:[];
      let node=root;
      for(const token of p){const k=normalize(token);if(!node.children.has(k))node.children.set(k,{name:token,children:new Map(),articles:[]});node=node.children.get(k);}
      node.articles.push(a);
    }
    return root;
  }
  function countTree(n) {return n.articles.length + [...n.children.values()].reduce((s,x)=>s+countTree(x),0);}
  function drawTree(n,depth=0) {
    const children=[...n.children.values()].sort((a,b)=>sortIt(a.name,b.name));
    const articles=[...n.articles].sort((a,b)=>sortIt(a.title,b.title));
    return `<ul class="topic-tree ${depth?'topic-children':''}">
      ${children.map(c=>`<li class="topic-group"><details ${depth<2?'open':''}><summary>${ico('chevron')}<span>${esc(c.name)}</span><span class="topic-count">${countTree(c)}</span></summary>${drawTree(c,depth+1)}</details></li>`).join('')}
      ${articles.map(a=>`<li class="topic-leaf"><a href="${linkForArticle(a.id)}">${ico('file')}<span>${esc(a.title)}</span><span class="leaf-arrow">${ico('chevron')}</span></a></li>`).join('')}
    </ul>`;
  }

  // Indice editoriale: i titoli programmati non diventano voci pubblicate finché non sono salvati.
  function psychologyPlanCount() {
    return new Set(PSYCHOLOGY_INDEX.flatMap(area=>area.topics.map(normalize))).size;
  }
  function psychologyArticleLink(title,path,enId='psicologia') {
    return '#/nuova-voce/'+encodeURIComponent(enId)+'?titolo='+encodeURIComponent(title)+'&percorso='+encodeURIComponent(path);
  }
  function renderPsychologyOutline(en) {
    const articles=getArticles(en.id);
    const byTitle=new Map(articles.map(a=>[normalize(a.title),a]));
    const canonical=new Map();
    PSYCHOLOGY_INDEX.forEach(area=>area.topics.forEach(title=>{const k=normalize(title);if(!canonical.has(k))canonical.set(k,area.name);}));
    const published=[...canonical.keys()].filter(k=>byTitle.has(k)).length;
    const completed=countBookStatus(articles);
    const substantiveWords=articles.reduce((sum,a)=>sum+contentWordCount(a.content),0);
    const completion=Math.min(100,100*substantiveWords/MIN_WORD_GOAL);
    const panels=PSYCHOLOGY_INDEX.map((area,i)=>{
      const ready=area.topics.filter(t=>byTitle.has(normalize(t))).length;
      const done=area.topics.filter(t=>{const a=byTitle.get(normalize(t));return a&&isVolumeComplete(a);}).length;
      const rows=area.topics.map((title,j)=>{
        const article=byTitle.get(normalize(title));
        const prefix=`<span class="psych-topic-number">${i+1}.${j+1}</span><span class="psych-topic-title">${esc(title)}</span>`;
        return article
          ?`<li><a class="psych-topic is-written" href="${linkForArticle(article.id)}">${prefix}<span class="psych-topic-status">${isVolumeComplete(article)?"Completo":"Bozza"}</span>${ico('chevron')}</a></li>`
          :`<li><div class="psych-topic is-pending" aria-label="${esc(title)}: in preparazione">${prefix}<span class="psych-topic-status">In preparazione</span></div></li>`;
      }).join('');
      return `<details class="psych-area" ${i===0?'open':''}><summary><span class="psych-area-number">${String(i+1).padStart(2,'0')}</span><strong>${esc(area.name)}</strong><span class="psych-area-progress">${done} completi · ${ready-done} bozze</span>${ico('chevron')}</summary><ol class="psych-topics">${rows}</ol></details>`;
    }).join('');
    const extras=articles.filter(a=>!canonical.has(normalize(a.title)));
    return `<section class="toc-panel psych-panel" aria-label="Indice di Psicologia">
       <div class="toc-heading"><h2>Indice degli argomenti</h2><span>${PSYCHOLOGY_INDEX.length} aree · ${canonical.size} argomenti previsti</span></div>
       <p class="psych-intro">Ogni capitolo è un volume autonomo: minimo 20.000 parole sostanziali, obiettivo editoriale almeno 40.000. I testi disponibili prima della verifica restano bozze consultabili; non devi fornire tu gli appunti.</p>
       <p class="psych-overview"><strong>${published}</strong> bozze consultabili · <strong>${completed}</strong> volumi completi verificati · ${canonical.size} volumi pianificati.</p>
       <div class="psych-word-stat"><div><strong>${numberIt(substantiveWords)}</strong> parole sostanziali stimate nei testi consultabili <span>· obiettivo teorico ${numberIt(MIN_WORD_GOAL)} (${canonical.size} volumi × ${numberIt(VOLUME_TARGET_WORDS)})</span></div>
       <small>${completion.toLocaleString('it-IT',{maximumFractionDigits:2})}% del piano indicativo · bibliografie e sitografie escluse · conteggio automatico non certificato</small>
       <progress class="psych-progress" max="${MIN_WORD_GOAL}" value="${Math.min(substantiveWords,MIN_WORD_GOAL)}" aria-label="Progresso delle parole sostanziali"></progress></div>
       <div class="psych-areas">${panels}</div></section>`
       +(extras.length?`<section class="toc-panel psych-extra"><div class="toc-heading"><h2>Approfondimenti aggiuntivi</h2><span>${extras.length}</span></div>${drawTree(buildTree(extras))}</section>`:'' );
  }

  function searchPsychologyPlans(query) {
    const q=normalize(query);
    if(!q || !getEn('psicologia') || !PSYCHOLOGY_INDEX.length)return [];
    const recorded=new Set(getArticles('psicologia').map(a=>normalize(a.title)));
    const seen=new Set(),out=[];
    for(const area of PSYCHOLOGY_INDEX) {
      for(const title of area.topics) {
        const key=normalize(title);
        if(seen.has(key))continue;
        seen.add(key);
        if(recorded.has(key) || !(key.includes(q)||normalize(area.name).includes(q)))continue;
        out.push({title,path:area.name});
        if(out.length===25)return out;
      }
    }
    return out;
  }
  function renderPsychologySearchResults(plans) {
    return "<div class='search-category'>IN PREPARAZIONE · PSICOLOGIA</div>"+
      plans.map(item=>"<div class='search-result is-pending' aria-disabled='true'><span class='result-icon'>"+ico('file')+"</span><span class='result-text'><strong>"+esc(item.title)+"</strong><small>"+esc(item.path)+" · Non ancora pubblicato</small></span></div>").join('');
  }

  function renderEncyclopedia(en) {
    bread([{label:'Biblioteca',href:'#/'},{label:en.name}]);
    const count=articleCount(en.id);
    const isPsychology=en.id==='psicologia'&&PSYCHOLOGY_INDEX.length>0;
    $('#main').innerHTML=`<div class="page-header"><div>
      <p class="eyebrow">ENCICLOPEDIA</p><h1 class="display-title">${esc(en.name)}</h1>
      <p class="description">${esc(en.description||'Raccolta documentata di articoli e approfondimenti.')}</p>
      <span class="count-pill">${plural(count,'voce pubblicata','voci pubblicate')}</span></div></div>
      ${isPsychology?renderPsychologyOutline(en):count?`<section class="toc-panel" aria-label="Indice dell'enciclopedia">
      <div class="toc-heading"><h2>Indice degli argomenti</h2><span>${plural(count,'voce','voci')}</span></div>
      ${drawTree(buildTree(getArticles(en.id)))}</section>`:
      `<section class="toc-panel"><div class="toc-heading"><h2>Contenuti in preparazione</h2></div>
      <p class="psych-intro">Questa enciclopedia non contiene ancora voci pubblicate.</p></section>`}`;
  }

  function findByTitle(title,encyclopediaId) {
    const n=normalize(title);
    const local=db.articles.find(a=>a.encyclopediaId===encyclopediaId&&normalize(a.title)===n);
    if(local)return local;
    const matches=db.articles.filter(a=>normalize(a.title)===n);
    return matches.length===1?matches[0]:null;
  }
  function safeUrl(raw) {
    try {const url=new URL(raw);return ['https:','http:'].includes(url.protocol)?url.href:null;}catch{return null;}
  }
  function basicText(input) {
    let s=esc(input);
    s=s.replace(/`([^`]+)`/g,'<code>$1</code>');
    s=s.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
    s=s.replace(/(^|[^*])\*([^*]+)\*/g,'$1<em>$2</em>');
    return s;
  }
  function renderInline(text,encyclopediaId) {
    const re=/(\[\[[^\]]+\]\]|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|\[\^\d+\])/gi;
    let pos=0,out='';
    for(const match of String(text).matchAll(re)) {
      out+=basicText(text.slice(pos,match.index));
      const token=match[0];
      if(token.startsWith('[[')) {
        const spec=token.slice(2,-2),bar=spec.indexOf('|');
        const destination=(bar===-1?spec:spec.slice(0,bar)).trim(),label=(bar===-1?spec:spec.slice(bar+1)).trim();
        const [title,...sectionBits]=destination.split('#'),section=sectionBits.join('#');
        const target=findByTitle(title.trim(),encyclopediaId);
        out+=target?`<a href="${linkForArticle(target.id,section)}" title="Apri ${esc(title.trim())}">${basicText(label)}</a>`:
          `<span class="missing-link" title="Voce non ancora pubblicata">${basicText(label)}</span>`;
      } else if(token.startsWith('[^')) {
        const num=token.slice(2,-1);
        out+=`<a href="#" class="footnote-ref" data-scroll="fonte-${num}" aria-label="Vai alla fonte ${num}">[${num}]</a>`;
      } else {
        const m=/^\[([^\]]+)\]\(([^)]+)\)$/.exec(token);
        const url=m&&safeUrl(m[2]);
        out+=url?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${basicText(m[1])}</a>`:basicText(token);
      }
      pos=match.index+token.length;
    }
    return out+basicText(text.slice(pos));
  }
  function renderMarkdown(raw,encyclopediaId) {
    const lines=String(raw||'').replace(/\r\n?/g,'\n').split('\n');
    const toc=[], html=[];
    let para=[],listType='',listRows=[],quote=[],code=[],codeOpen=false;
    const used=new Map();
    const paraFlush=()=>{if(para.length){html.push(`<p>${para.map(x=>renderInline(x,encyclopediaId)).join('<br>')}</p>`);para=[];}};
    const listFlush=()=>{if(listRows.length){html.push(`<${listType}>${listRows.map(x=>`<li>${renderInline(x,encyclopediaId)}</li>`).join('')}</${listType}>`);listRows=[];listType='';}};
    const quoteFlush=()=>{if(quote.length){html.push(`<blockquote><p>${quote.map(x=>renderInline(x,encyclopediaId)).join('<br>')}</p></blockquote>`);quote=[];}};
    const flush=()=>{paraFlush();listFlush();quoteFlush();};
    for(const line of lines) {
      if(/^\s*```/.test(line)) {flush();if(codeOpen){html.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`);code=[];codeOpen=false;}else codeOpen=true;continue;}
      if(codeOpen){code.push(line);continue;}
      const trimmed=line.trim();
      if(!trimmed){flush();continue;}
      const h=/^(#{1,4})\s+(.+)$/.exec(trimmed);
      if(h){flush();const lvl=Math.min(4,Math.max(2,h[1].length)),heading=h[2].replace(/\s+#+$/,'').trim();
        const base=slug(heading),seq=(used.get(base)||0)+1;used.set(base,seq);
        const id=`sezione-${base}${seq>1?'-'+seq:''}`;
        toc.push({text:heading,level:lvl,id});html.push(`<h${lvl} id="${id}">${renderInline(heading,encyclopediaId)}</h${lvl}>`);continue;}
      if(/^([-*_])\1\1\1*$/.test(trimmed)){flush();html.push('<hr>');continue;}
      const ul=/^[-*+]\s+(.+)$/.exec(trimmed),ol=/^\d+[.)]\s+(.+)$/.exec(trimmed);
      if(ul||ol){paraFlush();quoteFlush();const type=ul?'ul':'ol';if(listType && listType!==type)listFlush();listType=type;listRows.push((ul||ol)[1]);continue;}
      if(/^>\s?/.test(trimmed)){paraFlush();listFlush();quote.push(trimmed.replace(/^>\s?/,''));continue;}
      listFlush();quoteFlush();para.push(trimmed);
    }
    flush();if(codeOpen&&code.length)html.push(`<pre><code>${esc(code.join('\n'))}</code></pre>`);
    return {html:html.join('\n'),toc};
  }
  function sourcesHtml(sources) {
    if(!sources.length)return '';
    return `<section class="sources-section" aria-label="Fonti"><h2>Fonti online e riferimenti puntuali</h2>
      <ol class="sources-list">${sources.map((s,i)=>{
        const url=safeUrl(s.trim());
        return `<li id="fonte-${i+1}">${url?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(s)}</a>`:esc(s)}</li>`;
      }).join('')}</ol></section>`;
  }

  // Repertorio distinto dalle note [^n]: le schede di un libro non equivalgono
  // alla consultazione integrale o alla verifica di un'affermazione specifica.
  function researchBibliographyHtml(article) {
    const registry=Array.isArray(window.PSICOLOGIA_REPERTORIO_FONTI)?window.PSICOLOGIA_REPERTORIO_FONTI:[];
    const ids=new Set(Array.isArray(article.researchSourceIds)?article.researchSourceIds:[]);
    const refs=registry.filter(ref=>ids.has(ref.id));
    if(!refs.length)return '';
    const items=refs.map(ref=>{
      const url=safeUrl(ref.url);
      const source=esc([ref.author,ref.year,ref.title,ref.edition,ref.publisher,ref.identifier].filter(Boolean).join(' · '));
      const open=url?'<a href="'+esc(url)+'" target="_blank" rel="noopener noreferrer">Scheda e disponibilità</a>':'';
      return '<li><strong>'+esc(ref.kind)+'</strong><p>'+source+'</p><small>'+esc(ref.verification)+'</small> '+open+'</li>';
    }).join('');
    return '<section class="sources-section research-bibliography" aria-label="Bibliografia di ricerca"><h2>Bibliografia e programmi di ricerca</h2><p class="bibliography-disclaimer">Metadati verificati presso editori, archivi o università. La presenza in questo repertorio non significa che l’opera sia stata letta integralmente né che sostenga, senza una verifica puntuale, tutte le affermazioni del capitolo. Questo apparato è escluso dal conteggio delle parole.</p><ol class="research-bib-list">'+items+'</ol></section>';
  }

  function renderArticle(article) {
    const en=getEn(article.encyclopediaId),{html,toc}=renderMarkdown(article.content,article.encyclopediaId);
    bread([{label:'Biblioteca',href:'#/'},{label:en?.name||'Enciclopedia',href:`#/enciclopedia/${encodeURIComponent(article.encyclopediaId)}`},{label:article.title}]);
    $('#main').innerHTML=`<div class="article-top-actions"><span class="label">${esc(en?.name||'')}</span></div>
      <div class="article-layout ${toc.length?'':'no-aside'}"><article class="article-main">
        ${article.path?`<p class="article-path">${esc(article.path.split('/').map(x=>x.trim()).join(' / '))}</p>`:''}
        <h1 class="article-title">${esc(article.title)}</h1>
        ${article.summary?`<p class="article-summary">${esc(article.summary)}</p>`:''}
        <p class="volume-stage">${isVolumeComplete(article)?"Volume completo e verificato":"Bozza consultabile · in redazione e verifica"}</p>
        <div class="article-meta"><span>Aggiornata il ${dateFmt(article.updatedAt)}</span><span class="bullet">·</span><span>${plural(article.sources.length,'fonte','fonti')}</span><span class="bullet">·</span><span>${numberIt(contentWordCount(article.content))} parole sostanziali stimate (min. ${numberIt(VOLUME_MIN_WORDS)}, obiettivo ${numberIt(VOLUME_TARGET_WORDS)}; bibliografia esclusa)</span></div>
        <hr class="article-divider"><div class="article-body">${html||'<p>Contenuto in preparazione.</p>'}</div>
        ${sourcesHtml(article.sources)}
        ${researchBibliographyHtml(article)}
      </article>${toc.length?`<aside class="article-toc" aria-label="Indice della voce"><h3>IN QUESTA VOCE</h3>
      ${toc.map(item=>`<a href="#" data-scroll="${esc(item.id)}" class="level-${item.level}">${esc(item.text)}</a>`).join('')}</aside>`:''}</div>`;
  }

  function closeModal() {
    $('#overlay-root').innerHTML='';
    modalReturnFocus?.focus?.();
    modalReturnFocus=null;
  }

  function showSearch() {
    closeMenus();closeMobile();
    modalReturnFocus=document.activeElement;
    $('#overlay-root').innerHTML=`<div class="overlay search-overlay" id="app-overlay"><div class="search-dialog" role="dialog" aria-modal="true" aria-label="Cerca nell'archivio">
      <div class="search-input-row">${ico('search')}<input id="search-input" type="search" aria-label="Cerca" placeholder="Cerca una voce, un concetto, una materia..." autocomplete="off"><button type="button" class="esc-button" data-action="close-modal" aria-label="Chiudi ricerca">ESC</button></div>
      <div class="search-results" id="search-results"></div><div class="search-foot">Cerca in titoli, percorsi e contenuti · Premi Invio per aprire il primo risultato</div>
      </div></div>`;
    const field=$('#search-input');field.focus();updateSearch('');
  }
  function searchAll(query) {
    const q=normalize(query);
    if(!q) return {encyclopedias:db.encyclopedias.slice(0,4),articles:[...db.articles].sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt)).slice(0,6)};
    const score=a=>{const t=normalize(a.title),p=normalize(a.path),s=normalize(a.summary),body=normalize(a.content);return t===q?20:t.startsWith(q)?12:t.includes(q)?8:p.includes(q)?5:s.includes(q)?3:body.includes(q)?1:0;};
    return {encyclopedias:db.encyclopedias.filter(e=>normalize(e.name+' '+e.description).includes(q)).slice(0,6),articles:db.articles.map(a=>({item:a,score:score(a)})).filter(x=>x.score>0).sort((x,y)=>y.score-x.score||new Date(y.item.updatedAt)-new Date(x.item.updatedAt)).slice(0,30).map(x=>x.item)};
  }
  function updateSearch(query) {
    const {encyclopedias,articles}=searchAll(query);
    const plans=searchPsychologyPlans(query);
    $('#search-results').innerHTML=`${!encyclopedias.length&&!articles.length&&!plans.length?'<div class="search-no-results">Nessun risultato pubblicato trovato.</div>':''}
      ${encyclopedias.length?`<div class="search-category">ENCICLOPEDIE</div>${encyclopedias.map(e=>`<button class="search-result" data-action="search-nav" data-href="#/enciclopedia/${encodeURIComponent(e.id)}"><span class="result-icon">${ico('book')}</span><span class="result-text"><strong>${esc(e.name)}</strong><small>${plural(articleCount(e.id),'voce','voci')}</small></span><span class="arrow">${ico('chevron')}</span></button>`).join('')}`:''}
      ${articles.length?`<div class="search-category">VOCI</div>${articles.map(a=>`<button class="search-result" data-action="search-nav" data-href="${linkForArticle(a.id)}"><span class="result-icon">${ico('file')}</span><span class="result-text"><strong>${esc(a.title)}</strong><small>${esc(getEn(a.encyclopediaId)?.name||'')}${a.path?' · '+esc(a.path):''}</small></span><span class="arrow">${ico('chevron')}</span></button>`).join('')}`:''}`;
    if(plans.length)$('#search-results').insertAdjacentHTML('beforeend',renderPsychologySearchResults(plans));
  }
  function jumpToSection(section) {
    if(!section)return;
    const find=()=>document.getElementById(section.startsWith('sezione-')||section.startsWith('fonte-')?section:`sezione-${slug(section)}`);
    const element=find();if(element)element.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function render() {
    const route=getRoute();
    renderSidebar(route);
    if(route.type==='home')renderHome();
    else if(route.type==='enciclopedia') {
      const en=getEn(route.id);
      if(en)renderEncyclopedia(en); else {location.hash='#/';renderHome();}
    } else if(route.type==='voce') {
      const article=getArt(route.id);
      if(article)renderArticle(article); else {location.hash='#/';renderHome();}
    } else {
      location.hash='#/';
      renderHome();
    }
closeMenus();hydrateIcons($('#main'));
    const key=`${route.type}/${route.id}`;
    if(lastRouteKey!==key){lastRouteKey=key;window.scrollTo({top:0,behavior:'instant'});}
    if(route.section)requestAnimationFrame(()=>jumpToSection(route.section));
  }

  function clickAction(e) {
    const scroll=e.target.closest('[data-scroll]');
    if(scroll){e.preventDefault();jumpToSection(scroll.dataset.scroll);return;}
    const anchor=e.target.closest('a[href^="#/"]');
    if(anchor){e.preventDefault();go(anchor.getAttribute('href'));return;}
    const node=e.target.closest('[data-action]');
    if(!node)return;
    switch(node.dataset.action){
      case 'toggle-sidebar': {
        const open=!$('#sidebar').classList.contains('open');
        $('#sidebar').classList.toggle('open',open);
        $('#mobile-shade').hidden=!open;
        $('.mobile-menu-button').setAttribute('aria-expanded',String(open));
        break;
      }
      case 'open-search':showSearch();break;
      case 'close-modal':closeModal();break;
      case 'search-nav': {
        const url=node.dataset.href;
        if(url){closeModal();go(url);}
        break;
      }
    }
  }
  document.addEventListener('click',clickAction);
  document.addEventListener('click',e=>{if(e.target.id==='app-overlay')closeModal();});
  document.addEventListener('input',e=>{if(e.target.id==='search-input')updateSearch(e.target.value);});
  document.addEventListener('keydown',e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();showSearch();return;}
    if(e.key==='Escape'){
      if($('#overlay-root').innerHTML)closeModal();
      else if($('#sidebar').classList.contains('open'))closeMobile();
      return;
    }
    if(e.key==='Enter'&&e.target.id==='search-input'){
      e.preventDefault();const first=$('.search-result[data-href]');if(first){closeModal();go(first.dataset.href);}return;
    }
    if(e.key==='Tab'&&$('#app-overlay')){
      const focusable=$$('button:not([disabled]),input:not([disabled]),a[href]',$('#app-overlay')).filter(el=>el.offsetParent!==null);
      if(focusable.length){
        const first=focusable[0],last=focusable.at(-1);
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    }
  });
  window.addEventListener('hashchange',()=>{closeMobile();render();});
  $('#mobile-shade').addEventListener('click',closeMobile);
  hydrateIcons(document);
  render();
})();
