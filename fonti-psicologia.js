/* Registro di ricerca: verifica dei metadati != lettura integrale != supporto di una tesi. */
window.PSICOLOGIA_REPERTORIO_FONTI = [
  {
    "id": "greenwood-2015",
    "kind": "libro accademico",
    "author": "John D. Greenwood",
    "year": "2015",
    "title": "A Conceptual History of Psychology: Exploring the Tangled Web",
    "edition": "2ª edizione",
    "publisher": "Cambridge University Press",
    "identifier": "DOI 10.1017/CBO9781107414914",
    "url": "https://www.cambridge.org/core/books/conceptual-history-of-psychology/28A438145E2C8A4C575710BDB10B7481",
    "verification": "Metadati controllati sulla scheda editoriale; testo integrale non verificato"
  },
  {
    "id": "danziger-1990",
    "kind": "monografia accademica",
    "author": "Kurt Danziger",
    "year": "1990",
    "title": "Constructing the Subject: Historical Origins of Psychological Research",
    "publisher": "Cambridge University Press",
    "identifier": "DOI 10.1017/CBO9780511524059",
    "url": "https://www.cambridge.org/core/books/constructing-the-subject/6B1C7891EC8C6670ECD341B3F3E08B65",
    "verification": "Metadati e indice controllati sulla scheda editoriale; testo integrale non verificato"
  },
  {
    "id": "baker-2012",
    "kind": "handbook collettaneo",
    "author": "David B. Baker (a cura di)",
    "year": "2012",
    "title": "The Oxford Handbook of the History of Psychology: Global Perspectives",
    "publisher": "Oxford University Press",
    "identifier": "DOI 10.1093/oxfordhb/9780195366556.001.0001",
    "url": "https://academic.oup.com/edited-volume/35476",
    "verification": "Metadati e indice controllati sulla scheda editoriale; capitoli completi non verificati"
  },
  {
    "id": "mecacci-2008",
    "kind": "manuale universitario",
    "author": "Luciano Mecacci",
    "year": "2008",
    "title": "Manuale di storia della psicologia",
    "publisher": "Giunti",
    "identifier": "ISBN 9788809030787",
    "url": "https://flore.unifi.it/handle/2158/354247",
    "verification": "Metadati controllati presso archivio istituzionale dell'Università di Firenze; testo integrale non verificato"
  },
  {
    "id": "mecacci-2019",
    "kind": "manuale universitario",
    "author": "Luciano Mecacci",
    "year": "2019",
    "title": "Storia della psicologia. Dal Novecento a oggi",
    "publisher": "Editori Laterza",
    "identifier": "ISBN 9788859300489 (edizione cartacea riportata nella scheda 2019)",
    "url": "https://www.laterza.it/scheda-libro/?isbn=9788858136829",
    "verification": "Metadati controllati sulla scheda editoriale; testo integrale non verificato"
  },
  {
    "id": "ebbinghaus-1885",
    "kind": "fonte primaria digitalizzata",
    "author": "Hermann Ebbinghaus",
    "year": "1885; traduzione inglese del 1913",
    "title": "Über das Gedächtnis / Memory: A Contribution to Experimental Psychology",
    "publisher": "Edizione digitale York University, Classics in the History of Psychology",
    "identifier": "Opera originale 1885; trad. Ruger e Bussenius, 1913",
    "url": "https://psychclassics.yorku.ca/Ebbinghaus/index.htm",
    "verification": "Metadati, traduzione e indice controllati nella collezione digitale; passaggi specifici da verificare"
  },
  {
    "id": "sep-wundt",
    "kind": "enciclopedia specialistica",
    "author": "Stanford Encyclopedia of Philosophy",
    "year": "revisione sostanziale 2022",
    "title": "Wilhelm Maximilian Wundt",
    "publisher": "Stanford University",
    "identifier": "Voce enciclopedica specialistica",
    "url": "https://plato.stanford.edu/entries/wilhelm-wundt/",
    "verification": "Scheda e riferimento documentario consultati; verificare i passaggi specifici prima della citazione"
  },
  {
    "id": "openstax-psychology-2e",
    "kind": "manuale universitario aperto",
    "author": "OpenStax",
    "year": "edizione online in aggiornamento",
    "title": "Psychology 2e",
    "publisher": "Rice University, OpenStax",
    "identifier": "Manuale open access",
    "url": "https://openstax.org/books/psychology-2e/pages/1-introduction",
    "verification": "Scheda e capitoli online accessibili; ogni fatto citato deve essere verificato nella sezione pertinente"
  },
  {
    "id": "unimib-storia",
    "kind": "programma universitario",
    "author": "Università degli Studi di Milano-Bicocca",
    "year": "scheda consultata nel 2026",
    "title": "Storia della Psicologia — scheda dell'insegnamento e bibliografia",
    "publisher": "Università degli Studi di Milano-Bicocca",
    "identifier": "Programma di corso",
    "url": "https://elearning.unimib.it/course/info.php?id=62070",
    "verification": "Scheda del programma e riferimenti a Mecacci verificati; serve a pianificare il syllabus, non a provare tesi scientifiche"
  },
  {
    "id": "malta-psy1620",
    "kind": "programma universitario",
    "author": "University of Malta",
    "year": "anno accademico 2026/2027",
    "title": "PSY1620 — History of Psychology",
    "publisher": "University of Malta",
    "identifier": "Study-unit description",
    "url": "https://www.um.edu.mt/courses/studyunit/PSY1620",
    "verification": "Scheda e letture suggerite controllate; serve a confrontare ampiezza didattica, non a provare tesi scientifiche"
  },
  {
    "id": "apa-manual-7",
    "kind": "manuale metodologico",
    "author": "American Psychological Association",
    "year": "2020",
    "title": "Publication Manual of the American Psychological Association",
    "edition": "7ª edizione",
    "publisher": "American Psychological Association",
    "identifier": "DOI 10.1037/0000165-000",
    "url": "https://apastyle.apa.org/products/publication-manual-7th-edition",
    "verification": "Metadati e ambito del manuale controllati su sito ufficiale; non è una fonte primaria per fatti della storia della psicologia"
  }
];
(() => {
 const published = Array.isArray(window.ENCICLOPEDIA_ARTICOLI) ? window.ENCICLOPEDIA_ARTICOLI : [];
 const history = published.find(a => a.id === 'psicologia-storia-scientifica');
 if (history) history.researchSourceIds = ["greenwood-2015","danziger-1990","baker-2012","mecacci-2008","mecacci-2019","ebbinghaus-1885","sep-wundt","openstax-psychology-2e","unimib-storia","malta-psy1620"];
})();
