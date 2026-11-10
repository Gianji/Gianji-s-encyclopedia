# ENCICLOPEDIA — Biblioteca consultabile (v1.2)

Sito pubblico, minimalista e responsive, pubblicato su **GitHub Pages**. L'interfaccia è **di sola lettura**: il visitatore non deve scrivere articoli, fornire appunti, creare nuove enciclopedie o gestire dati locali.

## Standard editoriale vigente (10 novembre 2026)

**Ogni argomento autonomo diventa un volume enciclopedico, non una voce riassuntiva.** Soglia inderogabile **almeno 20.000 parole sostanziali per volume** e obiettivo ordinario **40.000 o più**; raggiungere la lunghezza non basta senza analisi completa, controllo documentario e verifica dell'assenza di ripetizioni. Il conteggio esclude bibliografia, sitografia, apparati citazionali, articoli, preposizioni, congiunzioni e altre parole grammaticali. Il numero visualizzato è una **stima automatica**, non una certificazione morfosintattica.

Con **329 volumi pianificati**, la soglia minima collettiva diventerebbe **6.580.000 parole sostanziali** e l'obiettivo di 40.000 per volume sarebbe **13.160.000 parole sostanziali**. Il vecchio obiettivo complessivo di 500.000 parole è **superato e non più valido** come criterio di completezza.

**Stato reale dei contenuti preesistenti: 12 bozze consultabili, 0 volumi certificati completi.** Non è stata scritta né verificata l'intera opera da 13,16 milioni di parole. I conteggi pregressi descrivono il materiale disponibile, non il lavoro concluso.

Vedi [STANDARD_EDITORIALE_PSICOLOGIA.md](STANDARD_EDITORIALE_PSICOLOGIA.md) per il protocollo integrale e [PIANO_RICERCA_STORIA_PSICOLOGIA.md](PIANO_RICERCA_STORIA_PSICOLOGIA.md) per la struttura analitica del primo volume (programma indicativo da 53.900 parole sostanziali, non materiale già prodotto). [fonti-psicologia.js](fonti-psicologia.js) conserva schede verificate di manuali, monografie, fonti primarie digitalizzate, enciclopedie e programmi universitari: **una scheda bibliografica verificata non equivale a lettura integrale né a prova di un fatto specifico**. Il sito presenta separatamente il repertorio bibliografico e la sitografia; l'intero apparato è escluso dal conteggio.

Il controllo strutturale è in [scripts/verifica-volumi.mjs](scripts/verifica-volumi.mjs) ed è predisposto per essere eseguito su GitHub Actions a ogni aggiornamento. Verifica riferimenti numerati, titoli canonici, metadati, testi identici molto lunghi e certificazioni improprie; **non può** certificare in automatico accuratezza scientifica, correttezza di citazioni o conteggio linguistico definitivo.

## Flusso editoriale corretto

L'utente indica a ChatGPT **quale enciclopedia o argomento desidera**. ChatGPT si occupa della progettazione dell'indice, della ricerca delle fonti, della stesura originale, delle verifiche, dei rimandi interni e della pubblicazione degli aggiornamenti direttamente in questo repository GitHub.

Il sito serve per **consultare** i materiali pubblicati: biblioteca, indici, capitoli, bibliografia, ricerca e collegamenti interni.

## Organizzazione dei contenuti

- `psicologia-data.js`: indice editoriale pianificato dell'enciclopedia Psicologia, con 11 aree disciplinari e oltre 300 argomenti distinti.
- `psicologia-introduzione.js`: panoramica autonoma su oggetto, metodi e campi della psicologia.
- `psicologia-origini.js`: quattro ulteriori voci storiche, caricate dopo la base, con ID e fonti indipendenti.
- `psicologia-storia-estesa.js`: revisione analitica del capitolo generale, con 46 sezioni e bibliografia ampliata.
- `psicologia-storia-antichita-globale.js`, `psicologia-storia-greco-romana.js`, `psicologia-storia-medievale.js`, `psicologia-storia-eta-moderna.js`, `psicologia-storia-ottocento.js`: monografie storiche integrative con rimandi all'articolo cronologico.
- `contenuti.js`: **testi effettivamente pubblicati** con ID stabili, titolo, percorso, sintesi, corpo in formato Markdown, fonti e data di aggiornamento.
- `fonti-psicologia.js`: registro di lavoro con metadati editoriali controllati di libri, manuali, programmi, enciclopedie e fonti digitalizzate.
- `app.js`: navigazione, ricerca, resa delle bozze, bibliografia separata, soglie per volume e stati di verifica.
- `index.html` / `styles.css`: struttura e design responsive.

La presenza di un argomento nell'indice **non** implica che sia stato scritto, verificato o pubblicato. I capitoli non pubblicati sono marcati «In preparazione», senza aprire un editor.

## Bozze iniziali consultabili (non volumi completi)

1. *Psicologia: Oggetto, Metodi e Campi di Studio*.
2. *Storia della Psicologia: dalle Origini Filosofiche alla Nascita della Scienza*.
3. *Wundt e la Fondazione della Psicologia Sperimentale*.
4. *Strutturalismo*.
5. *Funzionalismo*.
6. *Gestalt e Psicologia della Forma*.
7. *Comportamentismo Classico e Neocomportamentismo*.
8. *Concezioni della mente nelle civiltà antiche: India, Cina e Vicino Oriente*.
9. *La psicologia nella Grecia antica e a Roma: anima, percezione, memoria e passioni*.
10. *La mente nel Medioevo e nel Rinascimento: tradizioni arabe, scolastica e umanesimo*.
11. *Mente, corpo e conoscenza tra Seicento e Illuminismo*.
12. *L'Ottocento e la nascita della psicologia scientifica: strumenti, laboratori e controversie*.

Si tratta di **prime stesure incomplete**, non di volumi che raggiungono le nuove soglie. Il progetto enciclopedico richiede ampliamenti, verifiche ulteriori e pubblicazioni progressive.

## Integrità e fonti

I testi sono archiviati nel repository e tracciabili tramite la cronologia Git. Ogni voce può contenere fonti esterne elencate nella bibliografia. Evitare dati inventati, attribuzioni incerte o citazioni non verificate. Le sintesi originali non sostituiscono la consultazione critica delle fonti.

## Pubblicazione

GitHub Pages: https://gianji.github.io/Gianji-s-encyclopedia/

Branch di pubblicazione: `main`, cartella `/(root)`.

Non occorrono login, server applicativo, database o `localStorage` per leggere i contenuti. Le modifiche al sito e ai capitoli avvengono nel repository.

## Obiettivo editoriale precedente (archivio: sostituito dal nuovo standard)

**Nota storica:** in una versione precedente si ipotizzavano oltre 500.000 parole sostanziali complessive. Questo requisito è ora superato dalla regola dei 20.000 minimi e 40.000 obiettivo per ciascun volume, come indicato sopra.

Il sito mostra un indicatore calcolato dai **soli corpi dei testi consultabili**, che non implica il completamento dei volumi. Il conteggio elimina URL e segnaposto di citazione e scarta, tramite un insieme dichiarato nel codice di `app.js`, articoli, preposizioni, congiunzioni, pronomi e altre parole grammaticali comuni. È una **stima trasparente e riproducibile**, non un'analisi morfosintattica infallibile: locuzioni, omografie, forme flesse e prestiti possono produrre scarti. Nessun numero pianificato viene contato come testo già scritto. Questa metrica non sostituisce revisione scientifica, approfondimento o verifica delle fonti.

Le nuove voci mantengono il formato di appunti di studio, con struttura autonoma, precisazioni sulle controversie, termini, esempi, fonti ed espliciti rimandi; le prime stesure non vanno presentate come trattazioni definitive.

## Ampliamento storico del 10 novembre 2026

Il capitolo "Storia della Psicologia" non è più una voce di circa 1.500 parole: il testo principale comprende oltre 12.500 parole complessive e 46 sezioni, con cinque monografie integrative di circa 2.000-2.700 parole ciascuna. L'insieme della biblioteca supera 32.000 parole complessive considerando i corpi degli articoli; il conteggio delle **parole sostanziali** è fornito direttamente dal sito secondo il metodo descritto sopra, senza confondere parole totali e parole lessicali stimate.

Le pubblicazioni sono **prime stesure estese**, non un completamento del progetto né una prova di verifica esaustiva di ogni dettaglio storiografico. Le future integrazioni devono migliorare profondità, copertura geografica, repertori di fonti primarie, analisi biografiche e discussioni specialistiche, evitando ripetizioni arbitrarie.

**Verifica editoriale precedente (snapshot, 10 novembre 2026):** 12 bozze consultabili; 11 aree, 329 argomenti distinti in indice; 32.707 parole complessive nei corpi degli articoli e circa **20.163 parole sostanziali stimate** con l'algoritmo del sito. La ricostruzione storica principale contiene 12.564 parole complessive; sommando le cinque monografie integrate si ottengono 24.790 parole complessive per l'approfondimento storico. Le cifre evolvono a ogni pubblicazione e non equivalgono a un'attestazione di esaustività.
