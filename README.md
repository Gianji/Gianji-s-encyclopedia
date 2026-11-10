# ENCICLOPEDIA — Biblioteca consultabile (v1.2)

Sito pubblico, minimalista e responsive, pubblicato su **GitHub Pages**. L'interfaccia è **di sola lettura**: il visitatore non deve scrivere articoli, fornire appunti, creare nuove enciclopedie o gestire dati locali.

## Flusso editoriale corretto

L'utente indica a ChatGPT **quale enciclopedia o argomento desidera**. ChatGPT si occupa della progettazione dell'indice, della ricerca delle fonti, della stesura originale, delle verifiche, dei rimandi interni e della pubblicazione degli aggiornamenti direttamente in questo repository GitHub.

Il sito serve per **consultare** i materiali pubblicati: biblioteca, indici, capitoli, bibliografia, ricerca e collegamenti interni.

## Organizzazione dei contenuti

- `psicologia-data.js`: indice editoriale pianificato dell'enciclopedia Psicologia, con 11 aree disciplinari e 322 argomenti distinti.
- `contenuti.js`: **testi effettivamente pubblicati** con ID stabili, titolo, percorso, sintesi, corpo in formato Markdown, fonti e data di aggiornamento.
- `app.js`: navigazione, ricerca, resa dei capitoli e bibliografia in modalità lettura.
- `index.html` / `styles.css`: struttura e design responsive.

La presenza di un argomento nell'indice **non** implica che sia stato scritto, verificato o pubblicato. I capitoli non pubblicati sono marcati «In preparazione», senza aprire un editor.

## Contenuti iniziali pubblicati

1. *Storia della Psicologia: dalle Origini Filosofiche alla Nascita della Scienza*.
2. *Wundt e la Fondazione della Psicologia Sperimentale*.

Si tratta di **prime stesure**, non di capitoli dichiarati esaustivi. Il progetto enciclopedico richiede ampliamenti, verifiche ulteriori e pubblicazioni progressive.

## Integrità e fonti

I testi sono archiviati nel repository e tracciabili tramite la cronologia Git. Ogni voce può contenere fonti esterne elencate nella bibliografia. Evitare dati inventati, attribuzioni incerte o citazioni non verificate. Le sintesi originali non sostituiscono la consultazione critica delle fonti.

## Pubblicazione

GitHub Pages: https://gianji.github.io/Gianji-s-encyclopedia/

Branch di pubblicazione: `main`, cartella `/(root)`.

Non occorrono login, server applicativo, database o `localStorage` per leggere i contenuti. Le modifiche al sito e ai capitoli avvengono nel repository.
