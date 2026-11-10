/* ENCICLOPEDIA — v1.0.0
 * App statica, nessuna dipendenza. Dati conservati localmente nel browser.
 */
(() => {
  'use strict';

  const STORE = 'enciclopedia.archive.v1';
  const DRAFTS = 'enciclopedia.drafts.v1';
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
  const now = () => new Date().toISOString();
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
  function initialData() {
    return {version:1, encyclopedias:[{
      id:'psicologia',name:'Psicologia',description:'Uno spazio da costruire: fondamenti, scuole, autori e concetti.',createdAt:now(),updatedAt:now()
    }],articles:[]};
  }
  function readLocal(key) {try{return localStorage.getItem(key);}catch{return null;}}
  function writeLocal(key, value) {try{localStorage.setItem(key,value);return true;}catch{return false;}}
  function loadDb() {
    const raw = readLocal(STORE);
    if (raw) {try {const d=JSON.parse(raw);if(d&&d.version===1&&Array.isArray(d.encyclopedias)&&Array.isArray(d.articles)) return d;}catch{}}
    const initial=initialData();writeLocal(STORE,JSON.stringify(initial));return initial;
  }
  let db = loadDb();
  let editor = null;
  let modalReturnFocus = null;
  let pendingImport = null;
  let toastTimer = 0;
  let lastRouteKey = '';

  function commit(next) {
    if (!writeLocal(STORE,JSON.stringify(next))) {toast('Salvataggio non riuscito: memoria del browser non disponibile.');return false;}
    db=next;render();return true;
  }
  function closeMenus() {
    $('#new-menu').hidden = true;
    $('#new-button').setAttribute('aria-expanded','false');
    const context = $('#context-menu');
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
    return {type:parts[0]||'home',id:parts[1]||'',section:searchParams.get('sezione')||''};
  }
  function routeId(route) {
    if(route.type==='enciclopedia'||route.type==='nuova-voce')return route.id;
    if(route.type==='voce'||route.type==='modifica')return getArt(route.id)?.encyclopediaId||'';
    return '';
  }
  function linkForArticle(id, section='') {return `#/voce/${encodeURIComponent(id)}${section?`?sezione=${encodeURIComponent(slug(section))}`:''}`;}
  function go(url) {
    closeMenus();closeMobile();
    if(editor && editor.dirty && !confirm('Hai modifiche non salvate. Vuoi uscire? La bozza resta conservata su questo dispositivo.')) return;
    editor=null;
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
    const recent=[...db.articles].sort((a,b)=>new Date(b.updatedAt)-new Date(a.updatedAt)).slice(0,6);
    const main=$('#main');
    main.innerHTML=`<div class="hero"><p class="eyebrow">LA TUA BIBLIOTECA DEL SAPERE</p>
        <h1 class="display-title">Ogni conoscenza,<br>al suo posto.</h1>
        <p class="description">Enciclopedie indipendenti, voci ordinate per argomento e collegamenti diretti tra i concetti. Tutto in un unico spazio, senza distrazioni.</p>
        ${!libraries.length?`<div class="hero-actions"><button class="primary-button" data-action="create-encyclopedia">${ico('plus')}Crea enciclopedia</button></div>`:''}
      </div>
      <section aria-labelledby="libraries-title"><div class="section-heading"><h2 id="libraries-title">Enciclopedie</h2><small>${plural(libraries.length,'collezione','collezioni')}</small></div>
      ${libraries.length?`<div class="library-grid">${libraries.map(en=>`<a class="library-card" href="#/enciclopedia/${encodeURIComponent(en.id)}">
        <span class="library-icon">${ico('book')}</span><span class="library-card-title">${esc(en.name)}</span>
        <span class="library-card-subtitle">${esc(en.description||'Una collezione di conoscenze.')}</span>
        <span class="library-card-bottom">${plural(articleCount(en.id),'voce','voci')}${ico('corner')}</span>
      </a>`).join('')}</div>`:emptyBlock('Inizia da una materia','Crea la tua prima enciclopedia. Potrai aggiungere argomenti, capitoli e voci in qualsiasi momento.','Crea enciclopedia','create-encyclopedia','book')}
      </section>
      ${recent.length?`<section class="recent-section" aria-labelledby="recent-title"><div class="section-heading"><h2 id="recent-title">Ultime modifiche</h2><small>${plural(db.articles.length,'voce totale','voci totali')}</small></div>
       <div class="recent-list">${recent.map(a=>`<a href="${linkForArticle(a.id)}" class="recent-row"><span class="recent-icon">${ico('file')}</span>
         <span class="recent-details"><strong>${esc(a.title)}</strong><small>${esc(getEn(a.encyclopediaId)?.name||'')} ${a.path?' · '+esc(a.path):''}</small></span>
         <span class="recent-date">${dateFmt(a.updatedAt)}</span></a>`).join('')}</div></section>`:''}`;
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
  function renderEncyclopedia(en) {
    bread([{label:'Biblioteca',href:'#/'},{label:en.name}]);
    const count=articleCount(en.id),root=buildTree(getArticles(en.id));
    $('#main').innerHTML=`<div class="page-header"><div>
      <p class="eyebrow">ENCICLOPEDIA</p><h1 class="display-title">${esc(en.name)}</h1>
      <p class="description">${esc(en.description || 'La tua raccolta di voci e approfondimenti.')}</p>
      <span class="count-pill">${plural(count,'voce','voci')}</span></div>
      <div class="page-header-actions"><button type="button" class="secondary-button" data-action="add-article" data-id="${esc(en.id)}">${ico('plus')} Nuova voce</button>
      <div class="menu-anchor"><button type="button" class="icon-button" aria-label="Opzioni enciclopedia" data-action="toggle-context">${ico('more')}</button>
      <div class="dropdown" id="context-menu" role="menu" hidden><button role="menuitem" data-action="edit-encyclopedia" data-id="${esc(en.id)}">${ico('pencil')}Rinomina e descrizione</button><button role="menuitem" class="danger" data-action="delete-encyclopedia" data-id="${esc(en.id)}">${ico('trash')}Elimina enciclopedia</button></div></div></div></div>
      ${count?`<section class="toc-panel" aria-label="Indice dell'enciclopedia"><div class="toc-heading"><h2>Indice degli argomenti</h2><span>${plural(count,'voce','voci')}</span></div>${drawTree(root)}</section>`
      :emptyBlock('La struttura parte dalla prima voce','Scrivi una voce e assegnale un percorso, ad esempio “Fondamenti / Storia”. L’indice si organizzerà automaticamente.','Scrivi la prima voce','add-article','file-plus')}`;
    $$('[data-action="add-article"]',$('#main')).forEach(el=>el.dataset.id=en.id);
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
          `<a href="#" data-action="create-missing" data-title="${esc(title.trim())}" data-en="${esc(encyclopediaId)}" class="missing-link" title="Voce non ancora presente">${basicText(label)}</a>`;
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
    return `<section class="sources-section" aria-label="Fonti"><h2>Fonti e riferimenti</h2>
      <ol class="sources-list">${sources.map((s,i)=>{
        const url=safeUrl(s.trim());
        return `<li id="fonte-${i+1}">${url?`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(s)}</a>`:esc(s)}</li>`;
      }).join('')}</ol></section>`;
  }
  function renderArticle(article) {
    const en=getEn(article.encyclopediaId),{html,toc}=renderMarkdown(article.content,article.encyclopediaId);
    bread([{label:'Biblioteca',href:'#/'},{label:en?.name||'Enciclopedia',href:`#/enciclopedia/${encodeURIComponent(article.encyclopediaId)}`},{label:article.title}]);
    $('#main').innerHTML=`<div class="article-top-actions"><span class="label">${esc(en?.name||'')}</span><div style="display:flex;align-items:center;gap:8px"><button class="secondary-button" type="button" data-action="edit-article" data-id="${esc(article.id)}">${ico('pencil')} Modifica</button>
      <div class="menu-anchor"><button type="button" class="icon-button" aria-label="Opzioni voce" data-action="toggle-context">${ico('more')}</button>
      <div class="dropdown" id="context-menu" role="menu" hidden><button type="button" role="menuitem" class="danger" data-action="delete-article" data-id="${esc(article.id)}">${ico('trash')}Elimina voce</button></div></div></div></div>
      <div class="article-layout ${toc.length?'':'no-aside'}"><article class="article-main">
        ${article.path?`<p class="article-path">${esc(article.path.split('/').map(x=>x.trim()).join(' / '))}</p>`:''}
        <h1 class="article-title">${esc(article.title)}</h1>
        ${article.summary?`<p class="article-summary">${esc(article.summary)}</p>`:''}
        <div class="article-meta"><span>Aggiornata il ${dateFmt(article.updatedAt)}</span><span class="bullet">·</span><span>${plural(article.sources.length,'fonte','fonti')}</span></div>
        <hr class="article-divider">
        <div class="article-body">${html||'<p style="color:#9ca9a0">Questa voce non contiene ancora testo.</p>'}</div>
        ${sourcesHtml(article.sources)}
      </article>${toc.length?`<aside class="article-toc" aria-label="Indice della voce"><h3>IN QUESTA VOCE</h3>${toc.map(item=>
        `<a href="#" data-scroll="${esc(item.id)}" class="level-${item.level}">${esc(item.text)}</a>`).join('')}</aside>`:''}</div>`;
  }
  function readDraft(key) {
    try{const all=JSON.parse(readLocal(DRAFTS)||'{}');return all[key]||null;}catch{return null;}
  }
  function saveDraft(key,values) {
    try{const all=JSON.parse(readLocal(DRAFTS)||'{}');all[key]=values;writeLocal(DRAFTS,JSON.stringify(all));}catch{}
  }
  function removeDraft(key) {
    try{const all=JSON.parse(readLocal(DRAFTS)||'{}');delete all[key];writeLocal(DRAFTS,JSON.stringify(all));}catch{}
  }
  function editorValues() {
    return {title:$('#field-title')?.value||'',path:$('#field-path')?.value||'',summary:$('#field-summary')?.value||'',content:$('#field-content')?.value||'',sources:$('#field-sources')?.value||'',encyclopediaId:$('#field-encyclopedia')?.value||editor?.encyclopediaId||''};
  }
  function initEditor(article,enId,route) {
    const key=article?`edit-${article.id}`:`new-${enId}`;
    if(editor?.key===key)return;
    const fallback=article?{title:article.title,path:article.path,summary:article.summary,content:article.content,sources:article.sources.join('\n'),encyclopediaId:article.encyclopediaId}:{title:'',path:'',summary:'',content:'',sources:'',encyclopediaId:enId};
    const stored=readDraft(key);
    editor={key,articleId:article?.id||'',encyclopediaId:enId,values:stored||fallback,dirty:!!stored,preview:false};
  }
  function renderEditor(article,enId,route) {
    if(!getEn(enId)){go('#/');return;}
    initEditor(article,enId,route);
    bread([{label:'Biblioteca',href:'#/'},{label:getEn(enId)?.name||'',href:`#/enciclopedia/${encodeURIComponent(enId)}`},{label:article?'Modifica voce':'Nuova voce'}]);
    const e=editor,otherEn=db.encyclopedias;
    $('#main').innerHTML=`<div class="editor-frame"><div class="editor-top"><div><p class="eyebrow">EDITOR</p><h1>${article?'Modifica la voce':'Nuova voce'}</h1></div>
      <div class="editor-buttons"><button class="secondary-button" data-action="cancel-editor">Annulla</button><button class="primary-button" data-action="save-article">${ico('check')}Salva voce</button></div></div>
      <div class="editor-grid"><div class="editor-fields">
        <div class="segmented" aria-label="Modalità editor"><button type="button" data-action="editor-tab" data-tab="write" class="${!e.preview?'selected':''}" aria-pressed="${!e.preview}">Scrivi</button><button type="button" data-action="editor-tab" data-tab="preview" class="${e.preview?'selected':''}" aria-pressed="${e.preview}">Anteprima</button></div>
        <div id="editor-writing" ${e.preview?'hidden':''}>
          <div class="field"><label for="field-title">Titolo della voce <span style="color:#b04a42">*</span></label><input id="field-title" type="text" maxlength="180" autocomplete="off" placeholder="Es. 1.1 — Origini della psicologia" value="${esc(e.values.title)}"></div>
          <div class="field"><label for="field-encyclopedia">Enciclopedia</label><select id="field-encyclopedia">${otherEn.map(en=>`<option value="${esc(en.id)}" ${e.values.encyclopediaId===en.id?'selected':''}>${esc(en.name)}</option>`).join('')}</select></div>
          <div class="field"><label for="field-path">Percorso nell’indice <span class="hint">facoltativo</span></label><input id="field-path" type="text" maxlength="420" placeholder="Es. Fondamenti / Storia / Età moderna" value="${esc(e.values.path)}"></div>
          <div class="field"><label for="field-summary">Introduzione <span class="hint">facoltativa</span></label><textarea id="field-summary" rows="2" placeholder="Una breve presentazione della voce...">${esc(e.values.summary)}</textarea></div>
          <div class="field"><label for="field-content">Contenuto della voce</label><textarea class="content-input" id="field-content" spellcheck="true" placeholder="## Primo argomento\n\nScrivi qui i tuoi appunti, con definizioni, spiegazioni e rimandi ad altre voci...">${esc(e.values.content)}</textarea></div>
          <div class="field"><label for="field-sources">Fonti e riferimenti <span class="hint">una fonte per riga</span></label><textarea id="field-sources" class="sources-input" placeholder="Autore, opera, edizione, pagina...\nhttps://esempio.it/fonte">${esc(e.values.sources)}</textarea></div>
        </div>
        <div id="editor-preview" ${!e.preview?'hidden':''}></div>
        <p id="editor-status" class="editor-status">${e.dirty?'Bozza conservata su questo dispositivo. Premi “Salva voce” per pubblicarla nell’archivio.':'Le modifiche vengono conservate come bozza fino al salvataggio.'}</p>
      </div>
      <aside class="editor-help"><h3>Scrittura essenziale</h3><p>La formattazione resta nel testo: nessuna barra strumenti che occupa spazio.</p>
        <p><code>## Sezione</code> Titolo di sezione</p><p><code>### Sottosezione</code> Titolo di approfondimento</p>
        <p><code>**testo**</code> Grassetto</p><p><code>- voce</code> Elenco</p>
        <hr class="help-separator"><h3>Collegamenti intelligenti</h3>
        <p><code>[[Memoria]]</code> rimanda direttamente alla voce “Memoria”, anche in un’altra enciclopedia.</p>
        <p><code>[[Memoria#Tipi]]</code> apre una sezione specifica della voce.</p>
        <p><code>[^1]</code> rimanda alla prima fonte, inserita nel campo qui a lato.</p>
        <hr class="help-separator"><p>Le voci con lo stesso titolo nella medesima enciclopedia non possono duplicarsi.</p>
      </aside></div></div>`;
    if(e.preview)renderPreview();
  }
  function renderPreview() {
    if(!editor)return;
    const data=editor.values,{html}=renderMarkdown(data.content,data.encyclopediaId);
    $('#editor-preview').innerHTML=`<div class="preview-shell"><h2 class="preview-title">${esc(data.title||'Senza titolo')}</h2>${data.summary?`<p class="article-summary">${esc(data.summary)}</p>`:''}<div class="article-body">${html||'<p style="color:#9ca9a0">Inizia a scrivere per vedere l’anteprima.</p>'}</div>${sourcesHtml(data.sources.split('\n').map(x=>x.trim()).filter(Boolean))}</div>`;
  }
  function saveArticle() {
    if(!editor)return;
    const a=editor.articleId?getArt(editor.articleId):null;
    const raw=editor.values;
    const title=raw.title.trim(),enId=raw.encyclopediaId;
    if(!title){toast('Inserisci un titolo per la voce.');if(editor.preview){editor.preview=false;renderEditor(a,editor.encyclopediaId);}$(' #field-title'.trim())?.focus();return;}
    if(!getEn(enId)){toast('Scegli un’enciclopedia valida.');return;}
    if(db.articles.some(x=>x.id!==a?.id&&x.encyclopediaId===enId&&normalize(x.title)===normalize(title))){toast('Esiste già una voce con questo titolo in questa enciclopedia.');return;}
    const time=now(),record={id:a?.id||makeId(),encyclopediaId:enId,title,path:raw.path.split('/').map(x=>x.trim()).filter(Boolean).join(' / '),summary:raw.summary.trim(),content:raw.content.trim(),sources:raw.sources.split('\n').map(x=>x.trim()).filter(Boolean),createdAt:a?.createdAt||time,updatedAt:time};
    const next={...db,articles:a?db.articles.map(x=>x.id===a.id?record:x):[...db.articles,record]};
    if(writeLocal(STORE,JSON.stringify(next))){db=next;removeDraft(editor.key);editor=null;location.hash=linkForArticle(record.id);render();toast('Voce salvata.');}
    else toast('Impossibile salvare: spazio insufficiente o memoria non disponibile.');
  }
  function showModal(content,cls='') {
    modalReturnFocus=document.activeElement;
    $('#overlay-root').innerHTML=`<div class="overlay ${cls}" id="app-overlay"><div class="modal" role="dialog" aria-modal="true" aria-label="Finestra di dialogo">${content}</div></div>`;
    hydrateIcons($('#overlay-root'));
    $('#overlay-root').querySelector('input,button,select,textarea')?.focus();
  }
  function closeModal() {
    $('#overlay-root').innerHTML='';
    modalReturnFocus?.focus?.();
    modalReturnFocus=null;
  }
  function modalHead(title,description='') {
    return `<div class="modal-header"><div><h2 class="modal-title">${esc(title)}</h2>${description?`<p class="modal-subtitle">${esc(description)}</p>`:''}</div>
      <button class="icon-button modal-close" type="button" data-action="close-modal" aria-label="Chiudi">${ico('x')}</button></div>`;
  }
  function encyclopediaModal(en=null) {
    closeMenus();
    showModal(`${modalHead(en?'Modifica enciclopedia':'Nuova enciclopedia','Un luogo ordinato per raccogliere tutto ciò che riguarda una materia.')}
      <form id="encyclopedia-form" data-edit="${esc(en?.id||'')}">
      <div class="field"><label for="en-name">Nome <span style="color:#b04a42">*</span></label><input id="en-name" name="name" required maxlength="100" value="${esc(en?.name||'')}" placeholder="Es. Psicologia" autofocus></div>
      <div class="field"><label for="en-description">Descrizione <span class="hint">facoltativa</span></label><textarea id="en-description" name="description" maxlength="500" placeholder="Di cosa parlerà questa enciclopedia?">${esc(en?.description||'')}</textarea></div>
      <div class="modal-actions"><button type="button" class="secondary-button" data-action="close-modal">Annulla</button><button class="primary-button" type="submit">${en?'Salva modifiche':'Crea enciclopedia'}</button></div></form>`);
    $('#en-name')?.focus();
  }
  function submitEncyclopedia() {
    const form=$('#encyclopedia-form');if(!form)return;
    const name=$('#en-name').value.trim(),description=$('#en-description').value.trim(),id=form.dataset.edit;
    if(!name){$('#en-name').focus();return;}
    if(db.encyclopedias.some(e=>e.id!==id&&normalize(e.name)===normalize(name))){toast('Un’enciclopedia con questo nome esiste già.');return;}
    const previous=id?getEn(id):null;
    const record={id:previous?.id||makeId(),name,description,createdAt:previous?.createdAt||now(),updatedAt:now()};
    const next={...db,encyclopedias:previous?db.encyclopedias.map(e=>e.id===id?record:e):[...db.encyclopedias,record]};
    if(commit(next)){closeModal();location.hash=`#/enciclopedia/${encodeURIComponent(record.id)}`;render();toast(previous?'Enciclopedia aggiornata.':'Enciclopedia creata.');}
  }
  function chooseEncyclopedia() {
    if(!db.encyclopedias.length){encyclopediaModal();return;}
    const current=routeId(getRoute());if(getEn(current)){go(`#/nuova-voce/${encodeURIComponent(current)}`);return;}
    if(db.encyclopedias.length===1){go(`#/nuova-voce/${encodeURIComponent(db.encyclopedias[0].id)}`);return;}
    showModal(`${modalHead('Dove vuoi scrivere?','Seleziona l’enciclopedia a cui apparterrà la nuova voce.')}
      <div class="choice-options">${[...db.encyclopedias].sort((a,b)=>sortIt(a.name,b.name)).map(e=>`<button class="choice" type="button" data-action="choose-encyclopedia" data-id="${esc(e.id)}"><strong>${esc(e.name)}</strong><small>${plural(articleCount(e.id),'voce','voci')}</small></button>`).join('')}</div>`);
  }
  function confirmDelete(type,id) {
    const a=type==='article'?getArt(id):null,en=type==='encyclopedia'?getEn(id):null,entity=a||en;
    if(!entity)return;
    const count=en?articleCount(en.id):0;
    const desc=en?`L’enciclopedia “${en.name}” e tutte le sue ${plural(count,'voce','voci')} verranno eliminate dal browser. L’operazione non può essere annullata senza una copia esportata.`:
      `La voce “${a.title}” verrà eliminata dal browser. L’operazione non può essere annullata senza una copia esportata.`;
    showModal(`${modalHead(en?'Eliminare l’enciclopedia?':'Eliminare questa voce?',desc)}
      <div class="modal-actions"><button class="secondary-button" type="button" data-action="close-modal">Annulla</button>
      <button class="primary-button danger-button" type="button" data-action="confirm-delete" data-kind="${esc(type)}" data-id="${esc(id)}">Elimina definitivamente</button></div>`);
  }
  function doDelete(type,id) {
    const oldEnId=type==='article'?getArt(id)?.encyclopediaId||'':'';
    const next=type==='article'?{...db,articles:db.articles.filter(a=>a.id!==id)}:{...db,encyclopedias:db.encyclopedias.filter(e=>e.id!==id),articles:db.articles.filter(a=>a.encyclopediaId!==id)};
    if(writeLocal(STORE,JSON.stringify(next))){db=next;closeModal();editor=null;location.hash=type==='article'?`#/enciclopedia/${encodeURIComponent(oldEnId)}`:'#/';render();toast(type==='article'?'Voce eliminata.':'Enciclopedia eliminata.');}
    else toast('Non è stato possibile aggiornare l’archivio.');
  }
  function archiveModal() {
    closeMenus();
    showModal(`${modalHead('Gestione archivio','Le voci sono salvate nel browser di questo dispositivo. Conserva una copia per trasferirle o proteggerle.')}
      <button type="button" class="archive-option" data-action="export-archive"><span data-icon="download"></span><span><strong>Esporta archivio</strong><small>Scarica un file JSON con tutte le enciclopedie e le voci.</small></span></button>
      <button type="button" class="archive-option" data-action="import-archive"><span data-icon="upload"></span><span><strong>Importa archivio</strong><small>Unisci nuovi contenuti o sostituisci l’archivio attuale.</small></span></button>
      <p class="archive-note">Archivio attuale: ${plural(db.encyclopedias.length,'enciclopedia','enciclopedie')} e ${plural(db.articles.length,'voce','voci')}. Non è ancora prevista sincronizzazione tra dispositivi.</p>`);
  }
  function exportDb() {
    const data=JSON.stringify({...db,exportedAt:now(),generator:'ENCICLOPEDIA 1.0'},null,2),blob=new Blob([data],{type:'application/json'}),url=URL.createObjectURL(blob);
    const link=document.createElement('a');link.href=url;link.download=`ENCICLOPEDIA-backup-${new Date().toISOString().slice(0,10)}.json`;
    document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),5000);toast('Copia dell’archivio preparata.');
  }
  function validateImport(input) {
    if(!input||input.version!==1||!Array.isArray(input.encyclopedias)||!Array.isArray(input.articles))throw Error('Formato archivio non riconosciuto.');
    if(input.encyclopedias.length>15000||input.articles.length>150000)throw Error('Archivio troppo grande.');
    const used=new Set(),en=[];
    for(const e of input.encyclopedias){
      if(!e||typeof e.id!=='string'||typeof e.name!=='string'||!e.name.trim()||used.has(e.id))throw Error('Enciclopedie non valide nel file.');
      used.add(e.id);en.push({id:e.id.slice(0,150),name:e.name.slice(0,100),description:String(e.description||'').slice(0,500),createdAt:e.createdAt||now(),updatedAt:e.updatedAt||now()});
    }
    const enIds=new Set(en.map(x=>x.id)),articles=[],artIds=new Set();
    for(const a of input.articles){
      if(!a||typeof a.id!=='string'||typeof a.title!=='string'||!a.title.trim()||!enIds.has(a.encyclopediaId)||artIds.has(a.id))throw Error('Voci non valide o scollegate nel file.');
      artIds.add(a.id);articles.push({id:a.id.slice(0,150),encyclopediaId:a.encyclopediaId,title:a.title.slice(0,180),path:String(a.path||'').slice(0,420),summary:String(a.summary||'').slice(0,20000),content:String(a.content||'').slice(0,2000000),sources:Array.isArray(a.sources)?a.sources.slice(0,1500).map(x=>String(x).slice(0,2000)):[],createdAt:a.createdAt||now(),updatedAt:a.updatedAt||now()});
    }
    return {version:1,encyclopedias:en,articles};
  }
  async function selectImport(file) {
    if(!file)return;
    if(file.size>80*1024*1024){toast('Il file supera 80 MB.');return;}
    try {pendingImport=validateImport(JSON.parse(await file.text()));
      showModal(`${modalHead('Importa un archivio',`Il file contiene ${plural(pendingImport.encyclopedias.length,'enciclopedia','enciclopedie')} e ${plural(pendingImport.articles.length,'voce','voci')}. Scegli come procedere.`)}
        <div class="choice-options"><button class="choice" type="button" data-action="apply-import" data-mode="merge"><strong>Unisci senza cancellare</strong><small>Mantiene le voci attuali e aggiunge quelle nuove. I duplicati non vengono importati.</small></button>
        <button class="choice" type="button" data-action="ask-replace"><strong>Sostituisci tutto</strong><small>Cancella i dati attuali e carica soltanto quelli del file. Richiede conferma.</small></button></div>`);
    }catch(error){pendingImport=null;toast(error?.message||'Non è stato possibile leggere il file JSON.');}
    $('#import-input').value='';
  }
  function mergeDb(old,addition) {
    const result={version:1,encyclopedias:old.encyclopedias.map(x=>({...x})),articles:old.articles.map(x=>({...x}))};
    const mapping=new Map(),idSet=new Set(result.encyclopedias.map(x=>x.id)),articleIdSet=new Set(result.articles.map(x=>x.id));
    for(const en of addition.encyclopedias) {
      const existing=result.encyclopedias.find(x=>x.id===en.id||normalize(x.name)===normalize(en.name));
      if(existing)mapping.set(en.id,existing.id);
      else {const newId=idSet.has(en.id)?makeId():en.id;idSet.add(newId);result.encyclopedias.push({...en,id:newId});mapping.set(en.id,newId);}
    }
    let added=0;
    for(const a of addition.articles) {
      const target=mapping.get(a.encyclopediaId);
      if(!target)continue;
      if(result.articles.some(x=>x.id===a.id || (x.encyclopediaId===target&&normalize(x.title)===normalize(a.title))))continue;
      const newId=articleIdSet.has(a.id)?makeId():a.id;articleIdSet.add(newId);
      result.articles.push({...a,id:newId,encyclopediaId:target});added++;
    }
    return {result,added};
  }
  function applyImport(mode) {
    if(!pendingImport)return;
    const r=mode==='replace'?{result:pendingImport,added:pendingImport.articles.length}:mergeDb(db,pendingImport);
    if(writeLocal(STORE,JSON.stringify(r.result))){db=r.result;pendingImport=null;editor=null;closeModal();location.hash='#/';render();toast(mode==='replace'?'Archivio sostituito.':`${plural(r.added,'nuova voce importata','nuove voci importate')}.`);}
    else toast('Impossibile importare: memoria del browser insufficiente.');
  }
  function replaceConfirm() {
    showModal(`${modalHead('Confermi la sostituzione?','Tutte le enciclopedie e voci presenti nel browser saranno eliminate e sostituite con il file importato. Esporta prima una copia se desideri conservarle.')}
      <div class="modal-actions"><button class="secondary-button" type="button" data-action="close-modal">Annulla</button><button class="primary-button danger-button" type="button" data-action="apply-import" data-mode="replace">Sostituisci archivio</button></div>`);
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
    $('#search-results').innerHTML=`${!encyclopedias.length&&!articles.length?'<div class="search-no-results">Nessun risultato trovato.<br>Puoi creare una nuova voce dall’archivio.</div>':''}
      ${encyclopedias.length?`<div class="search-category">ENCICLOPEDIE</div>${encyclopedias.map(e=>`<button class="search-result" data-action="search-nav" data-href="#/enciclopedia/${encodeURIComponent(e.id)}"><span class="result-icon">${ico('book')}</span><span class="result-text"><strong>${esc(e.name)}</strong><small>${plural(articleCount(e.id),'voce','voci')}</small></span><span class="arrow">${ico('chevron')}</span></button>`).join('')}`:''}
      ${articles.length?`<div class="search-category">VOCI</div>${articles.map(a=>`<button class="search-result" data-action="search-nav" data-href="${linkForArticle(a.id)}"><span class="result-icon">${ico('file')}</span><span class="result-text"><strong>${esc(a.title)}</strong><small>${esc(getEn(a.encyclopediaId)?.name||'')}${a.path?' · '+esc(a.path):''}</small></span><span class="arrow">${ico('chevron')}</span></button>`).join('')}`:''}`;
  }
  function jumpToSection(section) {
    if(!section)return;
    const find=()=>document.getElementById(section.startsWith('sezione-')||section.startsWith('fonte-')?section:`sezione-${slug(section)}`);
    const element=find();if(element)element.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function render() {
    const route=getRoute();
    renderSidebar(route);
    if(route.type==='home'){editor=null;renderHome();}
    else if(route.type==='enciclopedia'){editor=null;const en=getEn(route.id);if(en)renderEncyclopedia(en);else{location.hash='#/';renderHome();}}
    else if(route.type==='voce'){editor=null;const a=getArt(route.id);if(a)renderArticle(a);else{location.hash='#/';renderHome();}}
    else if(route.type==='modifica'){const a=getArt(route.id);if(a)renderEditor(a,a.encyclopediaId,route);else{location.hash='#/';renderHome();}}
    else if(route.type==='nuova-voce'){if(getEn(route.id))renderEditor(null,route.id,route);else{location.hash='#/';renderHome();}}
    else{location.hash='#/';renderHome();}
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
    const node=e.target.closest('[data-action]');if(!node)return;
    const action=node.dataset.action;
    if(node.tagName==='A')e.preventDefault();
    if(action==='toggle-sidebar'){
      const open=!$('#sidebar').classList.contains('open');$('#sidebar').classList.toggle('open',open);$('#mobile-shade').hidden=!open;
      $('.mobile-menu-button').setAttribute('aria-expanded',String(open));return;
    }
    if(action==='toggle-new'){
      const menu=$('#new-menu'),wasOpen=!menu.hidden;closeMenus();menu.hidden=wasOpen;$('#new-button').setAttribute('aria-expanded',String(!wasOpen));return;
    }
    if(action==='toggle-context'){const menu=$('#context-menu'),wasOpen=!menu.hidden;closeMenus();menu.hidden=wasOpen;return;}
    switch(action){
      case 'open-search':showSearch();break;
      case 'create-encyclopedia':encyclopediaModal();break;
      case 'create-article':closeMenus();chooseEncyclopedia();break;
      case 'add-article':go(`#/nuova-voce/${encodeURIComponent(node.dataset.id||routeId(getRoute()))}`);break;
      case 'edit-encyclopedia':encyclopediaModal(getEn(node.dataset.id));break;
      case 'delete-encyclopedia':confirmDelete('encyclopedia',node.dataset.id);break;
      case 'edit-article':go(`#/modifica/${encodeURIComponent(node.dataset.id)}`);break;
      case 'delete-article':confirmDelete('article',node.dataset.id);break;
      case 'confirm-delete':doDelete(node.dataset.kind,node.dataset.id);break;
      case 'close-modal':closeModal();break;
      case 'choose-encyclopedia':closeModal();go(`#/nuova-voce/${encodeURIComponent(node.dataset.id)}`);break;
      case 'cancel-editor':go(editor?.articleId?linkForArticle(editor.articleId):`#/enciclopedia/${encodeURIComponent(editor?.encyclopediaId||'')}`);break;
      case 'save-article':saveArticle();break;
      case 'editor-tab':if(editor){if(!editor.preview)editor.values=editorValues();editor.preview=node.dataset.tab==='preview';renderEditor(editor.articleId?getArt(editor.articleId):null,editor.encyclopediaId,getRoute());}break;
      case 'create-missing':{
        if(!getEn(node.dataset.en)){toast('Enciclopedia di destinazione non trovata.');break;}
        const title=node.dataset.title;go(`#/nuova-voce/${encodeURIComponent(node.dataset.en)}`);
        // La pagina di creazione viene resa al cambio di hash; precompilazione dopo il rendering.
        setTimeout(()=>{if(editor&&!editor.values.title){editor.values.title=title;editor.dirty=true;const field=$('#field-title');if(field)field.value=title;saveDraft(editor.key,editor.values);const status=$('#editor-status');if(status)status.textContent='Bozza conservata su questo dispositivo. Premi “Salva voce” per pubblicarla nell’archivio.';}},0);break;
      }
      case 'open-archive':archiveModal();break;
      case 'export-archive':exportDb();break;
      case 'import-archive':$('#import-input').click();break;
      case 'apply-import':applyImport(node.dataset.mode);break;
      case 'ask-replace':replaceConfirm();break;
      case 'search-nav':{const path=node.dataset.href;closeModal();go(path);break;}
    }
  }
  document.addEventListener('click',clickAction);
  document.addEventListener('click',e=>{
    if(!e.target.closest('.new-wrap,.menu-anchor'))closeMenus();
    if(e.target.id==='app-overlay')closeModal();
  });
  document.addEventListener('input',e=>{
    if(e.target.id==='search-input')updateSearch(e.target.value);
    if(editor&&e.target.closest('#editor-writing')){
      editor.values=editorValues();editor.dirty=true;
      saveDraft(editor.key,editor.values);
      const status=$('#editor-status');if(status)status.textContent='Bozza conservata su questo dispositivo. Premi “Salva voce” per pubblicarla nell’archivio.';
    }
  });
  document.addEventListener('change',e=>{
    if(e.target.id==='import-input')selectImport(e.target.files?.[0]);
    if(editor&&e.target.id==='field-encyclopedia'){editor.values=editorValues();editor.dirty=true;saveDraft(editor.key,editor.values);}
  });
  document.addEventListener('submit',e=>{
    if(e.target.id==='encyclopedia-form'){e.preventDefault();submitEncyclopedia();}
  });
  document.addEventListener('keydown',e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();showSearch();return;}
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='s'&&editor){e.preventDefault();if(!editor.preview)editor.values=editorValues();saveArticle();return;}
    if(e.key==='Escape'){if($('#overlay-root').innerHTML)closeModal();else if($('#sidebar').classList.contains('open'))closeMobile();else closeMenus();return;}
    if(e.key==='Enter'&&e.target.id==='search-input'){e.preventDefault();const first=$('.search-result');if(first){closeModal();go(first.dataset.href);}return;}
    if(e.key==='Tab'&&$('#app-overlay')){
      const focusable=$$('button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),a[href]', $('#app-overlay')).filter(el=>el.offsetParent!==null);
      if(focusable.length){const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
    }
  });
  window.addEventListener('hashchange',()=>{closeMobile();render();});
  window.addEventListener('beforeunload',e=>{if(editor?.dirty){e.preventDefault();e.returnValue='';}});
  $('#mobile-shade').addEventListener('click',closeMobile);
  hydrateIcons(document);
  render();
})();

