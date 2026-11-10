# ENCICLOPEDIA — Biblioteca consultabile (v1.2)

Sito pubblico, minimalista e responsive, pubblicato su **GitHub Pages**. L'interfaccia è **di sola lettura**: il visitatore non deve scrivere articoli, fornire appunti, creare nuove enciclopedie o gestire dati locali.

## Flusso editoriale corretto

L'utente indica a ChatGPT **quale enciclopedia o argomento desidera**. ChatGPT si occupa della progettazione dell'indice, della ricerca delle fonti, della stesura originale, delle verifiche, dei rimandi interni e della pubblicazione degli aggiornamenti direttamente in questo repository GitHub.

Il sito serve per **consultare** i materiali pubblicati: biblioteca, indici, capitoli, bibliografia, ricerca e collegamenti interni.

## Organizzazione dei contenuti

- `psicologia-data.js`: indice editoriale pianificato dell'enciclopedia Psicologia, con 11 aree disciplinari e oltre 300 argomenti distinti.
- `psicologia-introduzione.js`: panoramica autonoma su oggetto, metodi e campi della psicologia.
- `psicologia-origini.js`: quattro ulteriori voci storiche, caricate dopo la base, con ID e fonti indipendenti.
- `contenuti.js`: **testi effettivamente pubblicati** con ID stabili, titolo, percorso, sintesi, corpo in formato Markdown, fonti e data di aggiornamento.
- `app.js`: navigazione, ricerca, resa dei capitoli e bibliografia in modalità lettura.
- `index.html` / `styles.css`: struttura e design responsive.

La presenza di un argomento nell'indice **non** implica che sia stato scritto, verificato o pubblicato. I capitoli non pubblicati sono marcati «In preparazione», senza aprire un editor.

## Contenuti iniziali pubblicati

1. *Psicologia: Oggetto, Metodi e Campi di Studio*.
2. *Storia della Psicologia: dalle Origini Filosofiche alla Nascita della Scienza*.
3. *Wundt e la Fondazione della Psicologia Sperimentale*.
4. *Strutturalismo*.
5. *Funzionalismo*.
6. *Gestalt e Psicologia della Forma*.
7. *Comportamentismo Classico e Neocomportamentismo*.

Si tratta di **prime stesure**, non di capitoli dichiarati esaustivi. Il progetto enciclopedico richiede ampliamenti, verifiche ulteriori e pubblicazioni progressive.

## Integrità e fonti

I testi sono archiviati nel repository e tracciabili tramite la cronologia Git. Ogni voce può contenere fonti esterne elencate nella bibliografia. Evitare dati inventati, attribuzioni incerte o citazioni non verificate. Le sintesi originali non sostituiscono la consultazione critica delle fonti.

## Pubblicazione

GitHub Pages: https://gianji.github.io/Gianji-s-encyclopedia/

Branch di pubblicazione: `main`, cartella `/(root)`.

Non occorrono login, server applicativo, database o `localStorage` per leggere i contenuti. Le modifiche al sito e ai capitoli avvengono nel repository.

## Obiettivo editoriale e contatore (10 novembre 2026)

La prima enciclopedia è **Psicologia** e la soglia di completamento programmata è **oltre 500.000 parole sostanziali**: 500.001 è il minimo numerico, non una stima delle parole già redatte. L'indice costituisce il piano, non il risultato. Per raggiungere tale scala bisognerà ampliare profondamente le voci, curare bibliografia e collegamenti e pubblicare nuovi capitoli verificati.

Il sito mostra un indicatore calcolato dai **soli corpi delle voci effettivamente pubblicate**. Il conteggio elimina URL e segnaposto di citazione e scarta, tramite un insieme dichiarato nel codice di `app.js`, articoli, preposizioni, congiunzioni, pronomi e altre parole grammaticali comuni. È una **stima trasparente e riproducibile**, non un'analisi morfosintattica infallibile: locuzioni, omografie, forme flesse e prestiti possono produrre scarti. Nessun numero pianificato viene contato come testo già scritto. Questa metrica non sostituisce revisione scientifica, approfondimento o verifica delle fonti.

Le nuove voci mantengono il formato di appunti di studio, con struttura autonoma, precisazioni sulle controversie, termini, esempi, fonti ed espliciti rimandi; le prime stesure non vanno presentate come trattazioni definitive.
