# ENCICLOPEDIA — Versione 1.1

Prototipo **funzionante**, senza framework, server, account o dipendenze esterne. Interfaccia in italiano, responsive per computer, tablet e smartphone.

## Avvio

Apri `index.html` con un browser moderno. Per pubblicarlo online, carica `index.html`, `styles.css`, `psicologia-data.js` e `app.js` nella stessa cartella di un hosting statico, per esempio GitHub Pages.

## Prima enciclopedia: Psicologia

La prima enciclopedia è **Psicologia**, con un indice editoriale derivato dai titoli della struttura di studio: **11 aree tematiche, 323 posizioni nell'indice e 322 argomenti distinti**. La sezione «Psicologia» di OneNote conteneva anche una pagina generale «TOPICS», che non è stata conteggiata come area disciplinare.

- Aprendo Psicologia si trova l'indice, con aree espandibili e numerazione per capitoli.
- Selezionando un titolo «Da scrivere», si apre una nuova voce con titolo e percorso precompilati.
- Le voci effettivamente salvate diventano accessibili dall'indice; le voci fuori dall'indice restano sotto «Altre voci».
- La ricerca globale include anche i titoli pianificati, distinguendoli dalle voci già salvate.
- Se un argomento compare in più aree, è previsto un unico contenuto canonico, con rimandi dalle altre sezioni.
- I titoli pianificati **non sono capitoli già scritti o verificati**. Nessun testo preesistente del quaderno OneNote viene pubblicato automaticamente.

## Funzioni disponibili

- Enciclopedie indipendenti: creazione, rinomina e cancellazione.
- Voci con titolo, sintesi, contenuto, fonti e percorso gerarchico personalizzabile. Percorsi del tipo `Fondamenti / Storia / Autori` creano un indice annidato senza gestione manuale.
- Scrittura di appunti con titoli `##`, sottotitoli `###`, grassetto `**...**`, elenchi, citazioni, codice e anteprima.
- Riferimenti interni `[[Titolo della voce]]`, `[[Titolo#Nome sezione]]` e fonti `[^1]`.
- Ricerca globale su nomi, titoli, percorso, introduzione e contenuto; scorciatoia Ctrl+K / Cmd+K.
- Modifica e cancellazione voci. Salvataggio in `localStorage` e bozze automatiche locali.
- Backup JSON, importazione **senza cancellazioni** (unione) o sostituzione completa con conferma.
- Evita automaticamente titoli duplicati nella stessa enciclopedia.
- Layout mobile con menu a scomparsa e controlli accessibili via tastiera.

## Importante sui dati

I dati **non** sono sincronizzati e restano esclusivamente nel browser/dispositivo utilizzato. Cancellare i dati del sito, usare un altro browser o cambiare dispositivo può far perdere i contenuti. Effettuare regolarmente **Gestione archivio → Esporta archivio**.

La presenza del campo «Fonti» non equivale a una verifica automatica: la valutazione dell'attendibilità sarà integrata in una fase successiva.

## Evoluzione futura

Questa versione definisce la base grafica e funzionale, non ancora l'architettura definitiva. Prima di inserirvi contenuti molto estesi, è consigliata una versione con database e autenticazione, versionamento/revisioni delle voci, archiviazione remota e backup automatici.