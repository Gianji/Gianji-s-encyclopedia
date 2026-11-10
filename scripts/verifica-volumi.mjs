#!/usr/bin/env node
/**
 * ENCICLOPEDIA — controllo strutturale e metrico, Node.js >=20, nessuna dipendenza.
 * Non può certificare la verità fattuale: richiede verifiche umane/documentarie.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=path.resolve(process.cwd());
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const errors=[],warnings=[],notes=[];
const html=read('index.html');
const files=[...html.matchAll(/<script\b[^>]*\bsrc="([^"]+\.js)"/g)].map(m=>m[1]);
const context=vm.createContext({window:{}});
for(const file of files){
  if(!fs.existsSync(path.join(root,file))){errors.push('Script mancante: '+file);continue;}
  try{new vm.Script(read(file),{filename:file});}catch(e){errors.push('Errore sintattico in '+file+': '+e.message);continue;}
  if(file==='app.js')continue;
  try{vm.runInContext(read(file),context,{filename:file,timeout:3000});}
  catch(e){errors.push('Errore durante il caricamento di '+file+': '+e.message);}
}
const window=context.window;
const original=Array.isArray(window.ENCICLOPEDIA_ARTICOLI)?window.ENCICLOPEDIA_ARTICOLI:[];
const extra=Array.isArray(window.ENCICLOPEDIA_ARTICOLI_EXTRA)?window.ENCICLOPEDIA_ARTICOLI_EXTRA:[];
const articles=[...new Map([...original,...extra].map(a=>[a.id,a])).values()];
const refBook=Array.isArray(window.PSICOLOGIA_REPERTORIO_FONTI)?window.PSICOLOGIA_REPERTORIO_FONTI:[];
const registry=new Map(refBook.map(a=>[a.id,a]));
const planned=(Array.isArray(window.PSICOLOGIA_INDICE)?window.PSICOLOGIA_INDICE:[])
  .flatMap(area=>area.topics);
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('it-IT').trim();
const plannedTitles=new Set(planned.map(norm));
const existingTitles=new Set(articles.map(a=>norm(a.title)));
const app=read('app.js');
const stopFragment=app.match(/const stopWords=new Set\(\(\s*([\s\S]*?)\)\.normalize\('NFD'\)/);
if(!stopFragment)errors.push('Non è stato possibile controllare il metodo di conteggio di app.js');
const stopWords=new Set((stopFragment?[...stopFragment[1].matchAll(/'([^']*)'/g)].map(m=>m[1]).join(''):'')
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/\s+/));
const min=20000,target=40000;
const contentBody=markdown=>String(markdown||'').split(/^#{1,4}\s+(?:bibliografia|sitografia|fonti(?:\s+e\s+riferimenti)?|riferimenti\s+bibliografici|bibliography|references)\s*$/im)[0];
const wordCount=md=>{
  const clean=contentBody(md).replace(/https?:\/\/[^\s)]+/g,' ').replace(/\[\^\d+\]/g,' ');
  const tokens=clean.match(/\p{L}+(?:['’]\p{L}+)*/gu)||[];
  return tokens.reduce((n,w)=>{
    const z=norm(w).replace(/^[\p{L}]+['’]/u,'');
    return n+(z.length>1&&!stopWords.has(z)?1:0);
  },0);
};
let words=0, complete=0;
const paragraphs=new Map();
const duplicateParagraphs=[];
for(const a of articles){
  if(!a.id||!a.encyclopediaId||!a.title||typeof a.content!=='string')errors.push('Dati mancanti in '+String(a.id));
  if(!plannedTitles.has(norm(a.title)))warnings.push('Voce non presente nell’indice: '+a.title);
  const n=wordCount(a.content);words+=n;
  const sources=Array.isArray(a.sources)?a.sources:[];
  for(const match of a.content.matchAll(/\[\^(\d+)\]/g)){
    const num=Number(match[1]);
    if(num<1||num>sources.length)errors.push('Riferimento [^'+num+'] senza fonte in '+a.id);
  }
  for(const s of sources) {
    if(typeof s!=='string'||!/^https?:\/\/\S+/.test(s))warnings.push('Fonte non URL / non strutturata: '+a.id);
  }
  for(const l of a.content.matchAll(/\[\[([^|#\]]+)/g)){
    const dest=norm(l[1]);
    if(!existingTitles.has(dest) && !plannedTitles.has(dest)){
      warnings.push('Rimando a titolo non canonico: '+a.id+' → '+l[1]);
    }
  }
  for(const id of (a.researchSourceIds||[])) if(!registry.has(id)) errors.push('Fonte bibliografica non presente: '+id+' in '+a.id);
  const isClaimedComplete=a.editorialStatus==='complete';
  if(isClaimedComplete) {
    const criteria={minimum:n>=min,target:n>=target,factChecked:a.factChecked===true,
      duplicationAudit:a.duplicationAudit===true,wordCountCertified:a.wordCountCertified===true,
      bibliographyAudit:a.bibliographyAudit===true};
    const missing=Object.entries(criteria).filter(([,v])=>!v).map(([k])=>k);
    if(missing.length)errors.push('Volume dichiarato completo ma non certificabile '+a.id+': '+missing.join(', '));
    else complete++;
  }else if(n<min){notes.push(a.id+' · BOZZA · '+n.toLocaleString('it-IT')+' parole stimate');}
  else notes.push(a.id+' · TESTO DA VERIFICARE · '+n.toLocaleString('it-IT')+' parole stimate');
  for(const para of contentBody(a.content).split(/\n\s*\n/).map(p=>p.replace(/[#*_>\[\]\d]+/g,' ').replace(/\s+/g,' ').trim())){
    const key=norm(para);
    if(key.length<320)continue;
    const prior=paragraphs.get(key);
    if(prior&&prior!==a.id) duplicateParagraphs.push(prior+' / '+a.id);
    else paragraphs.set(key,a.id);
  }
}
for(const ref of refBook){
  if(!ref.id||!ref.author||!ref.year||!ref.title||!ref.kind||!ref.verification||!ref.url)
    errors.push('Scheda bibliografica incompleta: '+String(ref.id));
  if(!/^https?:\/\/\S+/.test(ref.url))errors.push('URL di fonte bibliografica malformato: '+ref.id);
}
if(duplicateParagraphs.length) warnings.push('Paragrafi lunghi identici in più volumi: '+[...new Set(duplicateParagraphs)].join('; '));
const plannedCount=plannedTitles.size;
if(plannedCount===0)errors.push('Indice editoriale vuoto');
if(new Set(articles.map(a=>a.id)).size!==articles.length) errors.push('ID dei volumi duplicati');
console.log('ENCICLOPEDIA — AUDIT DOCUMENTALE E DI STRUTTURA');
console.log('Volumi pianificati:',plannedCount,'| Testi consultabili:',articles.length,'| Completi verificati:',complete);
console.log('Parole sostanziali STIMATE in tutti i testi:',words.toLocaleString('it-IT'));
console.log('Soglia per volume:',min.toLocaleString('it-IT'),'| Obiettivo:',target.toLocaleString('it-IT'));
console.log('Obiettivo teorico globale:',(plannedCount*target).toLocaleString('it-IT'));
console.log('Fonti catalogate:',refBook.length,'| Avvisi:',warnings.length,'| Errori:',errors.length);
for(const note of notes)console.log('  ',note);
for(const warning of warnings)console.warn('AVVISO:',warning);
for(const error of errors)console.error('ERRORE:',error);
console.log('ATTENZIONE: non sono certificati né il conteggio linguistico né la correttezza dei fatti, delle pagine o delle fonti.');
if(errors.length)process.exitCode=1;
