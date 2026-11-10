# ENCICLOPEDIA — Versione 1.0

Prototipo **funzionante**, senza framework, server, account o dipendenze esterne. Interfaccia in italiano, responsive per computer, tablet e smartphone.

## Avvio

Apri `index.html` con un browser moderno. Per pubblicarlo online, carica `index.html`, `styles.css` e `app.js` nella stessa cartella di un hosting statico, per esempio GitHub Pages.

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