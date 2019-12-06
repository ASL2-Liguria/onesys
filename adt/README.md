# ONE.SYS ADT

Applicativo sviluppato per la gestione amministrativa del percorso ospedaliero del paziente, dall'accettazione alla dimissione. 

## Descrizione

Il sistema ONE.SYS ADT è una piattaforma web sviluppata per gestire adeguatamente dal punto di vista amministrativo il percorso ospedaliero del paziente a partire dalla sua accettazione sino alla sua dimissione, sia che queste funzioni siano gestite centralmente da appositi sportelli, sia che esse siano gestite direttamente dai reparti di
degenza.
Tale gestione è garantita in totale conformità alla normativa vigente a livello regionale e nazionale, nonché sulla base delle esigenze informative aziendali dell'ASL2 SAVONESE.

### Contesto
I volumi di attività registrati nel 2018 ammontano a:

|Presidio Ospedaliero||Ricoveri Ordinari||DH/Day Surgery||Day Service||||Ex PAC|
|:-------------------||:---------------:||:------------:||:---------:||||:-----:|
| Savona             ||17.271           ||5.752         ||619        ||||2.005  |
| Cairo Montenotte   ||892              ||625           ||0          ||||1.441  |
| Pietra Ligure      ||12.931           ||2.974         ||655        ||||12     |
| Albenga            ||3.426            ||1.228         ||0          ||||1.854  |

Gli operatori attualmente assegnati alle strutture sono:

|Tipologia personale|N.     |
|:------------------|:-----:|
| Medici            |908    |
| Infermieri        |1.715   |

### Casi d'uso
ONE.SYS ADT gestisce gli accessi in una struttura ospedaliera, dalla 'prenotazione' di un ricovero mediante l'utilizzo di liste d’attesa, al successivo percorso, dall’accettazione alla dimissione di ogni paziente.

#### Singolo caso d'uso
**Flusso di eventi 1**: *Apertura e dimissione di un ricovero ordinario programmato non urgente*

1. L'utente di reparto, dopo aver effettuato l'accesso al sistema, ricerca il paziente in anagrafica; 
2. Se il paziente non è presente in anagrafica, il sistema permette l'inserimento di una nuova anagrafica, rendendo evidente all'utente quali campi sono obbligatori per il corretto inserimento della nuova anagrafica;
3. L'utente compila la maschera di accettazione del ricovero, valorizzando i campi obbligatori per il flusso;
4. il paziente viene inserito nella lista dei pazienti ricoverati;
5. l'utente  di reparto, se necessario, può, per tutta la durata del ricovero, trasferire il paziente verso un'altra unità operativa;
6. a  fine ricovero, l'utente di reparto procede con la dimissione del paziente;
7. L'utente medico compila la scheda di dimissione ospedaliera;
8. l'archivio clinico procede con l'archivizione e la tariffazione della SDO.

**Flusso di eventi 2**: *Apertura e chiusura di un ricovero di tipo DSA*
1. L'utente di reparto, dopo aver effettuato l'accesso al sistema, ricerca il paziente in anagrafica; 
2. Se il paziente non è presente in anagrafica, il sistema permette l'inserimento di una nuova anagrafica, rendendo evidente all'utente quali campi sono obbligatori per il corretto inserimento della nuova anagrafica;
3. L'utente compila la maschera di accettazione del DSA, valorizzando i campi obbligatori per il flusso DSA;
4. il paziente viene inserito nella lista dei DSA aperti;
5. l'utente  medico di reparto (case manager) visita il paziente e inserisce il paziente in un percorso di cura specifico;
6. l'utente medico, dopo aver visitato il paziente, prescrive, a partire da un elenco precostituito di prestazioni che dipende dal percorso specifico in cui è inserito il paziente, gli accertamenti a cui il paziente stesso dovrà sottoporsi;
7. le richieste per gli accertamenti prescritti sono inviate ai diversi dipartimentali tramite il modulo integrato di order entry;
8. il medico prende visione dei referti degli accertamenti richiesti grazie al visualizzatore dei documenti;
9. L'utente medico, al termine del percorso del DSA, compila la lettera di chiusura del DSA da fornire al paziente.

**Flusso di eventi 3**: *Inserimento di un paziente in lista attesa chirurgica*
1. L'utente di reparto, dopo aver effettuato l'accesso al sistema, ricerca il paziente in anagrafica; 
2. Se il paziente non è presente in anagrafica, il sistema permette l'inserimento di una nuova anagrafica, rendendo evidente all'utente quali campi sono obbligatori per il corretto inserimento della nuova anagrafica;
3. L'utente compila la maschera di inserimento del paziente in lista attesa;
4. il paziente viene inserito in lista attesa;
5. il paziente viene automaticamente in lista di chiamata; il paziente verrà chiamato per l'intervento a seconda della data di inserimento in lista e della priorità all'intervento;
6. una volta fissata la data dell'intervento, il paziente viene inserito in lista operatoria; il paziente sparisce dalla lista di attesa e viene aperto il ricovero.

### Finalità
Il sistema ONE.SYS ADT permette di organizzare e monitorare gli accessi in una struttura ospedaliera, dalla 'prenotazione' di un ricovero mediante l'utilizzo di liste d’attesa, al successivo percorso, dall’accettazione alla dimissione di ogni paziente. 
Tramite la soluzione, in fase di dimissione è possibile gestire le procedure di chiusura della Scheda di Dimissione Ospedaliera (SDO), l’archiviazione delle cartelle cliniche e la rendicontazione delle attività a fine statistico (flussi). 
Il modulo ADT presenta funzionalità dedicate al personale di portineria, del back office di accettazione, dell’archivio cartelle e supporta inoltre la gestione del percorso degli accessi di Day Service (DSA) e degli interventi chirurgici ambulatoriali (ex PAC).
Il modulo ADT è pienamente integrabile con i sistemi informativi ospedalieri, tra cui Anagrafica Centrale, Cartella di ricovero, Order Entry, Repository, ed è nativamente integrato con tutti i moduli del progetto ONE.SYS.

#### Descrizione funzionale
Il modulo ONE.SYS ADT è la soluzione sviluppata per soddisfare le diverse esigenze in ambito di ospedalizzazione del paziente, supportando l’intero flusso di gestione dei ricoveri in regime Ordinario e Day hospital (tra cui anche i casi di Day Surgery).

##### Funzionalità
Di seguito si descrivono le principali funzionalità e peculiarità del modulo ONE.SYS ADT riferite all’intero percorso di degenza del paziente in una struttura ospedaliera, dalla fase di pre-ospedalizzazione a quella di post-ospedalizzazione:

- Trattamento dei dati personali:
>> a. registrazione del consenso al trattamento al momento dell'accettazione del ricovero, con inserimento automatico della data/ora in cui è stato raccolto e dell'operatore;
>
>> b. gestione del consenso rilasciato da terzi in caso di paziente non cosciente o minore;
>
>> c. possibilità di oscuramento dell'intero episodio di ricovero.

- Gestione ricoveri e DH:
>> a. generazione automatica del nosologico, secondo le regole stabilite da ASL2;
>
>> b. gestione dei diversi regimi di ricovero, secondo le specifiche della normativa vigente; obbligatorietà inserimento campi 'data di prenotazione', 'priorità',  'reparto giuridico', 'reparto assistenziale', 'regime di ricovero', 'tipo di ricovero', 'motivo di ricovero', 'provenienza', 'onere':
>
>> c. gestione dei dati di raccordo neonato - mamma;
>
>> d. gestione DH, con rilevazione accessi e dati amministrativi specifici previsti a fini amministrativi.

- Gestione prericoveri:
>> a. inserimento dell'accesso di pre-ricovero, indicando data inizio e specialità/reparto di riferimento e corredandolo di informazioni utili nell’ambito di un futuro ricovero;
>
>> b. all’atto del ricovero dei pazienti che hanno affrontato un pre-ricovero propedeutico all’ospedalizzazione, il sistema legherà i due eventi (pre-ricovero e ricovero) in modo da definire un percorso, amministrativo e clinico-organizzativo, di continuità di cura;
>
>> c. nel caso in cui non sia necessario ricoverare al termine del pre-ricovero il paziente, o comunque interrompere anticipatamente il percorso di pre-ospedalizzazione, il sistema consente la chiusura dell’accesso di pre-ricovero.

- Gestione liste di attesa:
>> a. gestione delle liste di attesa mediche, chirurgiche e ambulatoriali chirurgiche, con tracciatura delle attività eseguite dal personale ospedaliero: la chiamata telefonica al paziente, la proposta della data di ricovero, l’eventuale motivazione del paziente per la posticipazione della spedalizzazione, l’eventuale data proposta dal paziente;
>
>> b. le liste d’attesa mediche e/o chirurgiche confluiscono, in base alla configurazione adottata, nelle relative liste di chiamata, differenziabili per specialità o per percorso. La lista di chiamata può essere regolata da diverse variabili tra cui il grado di urgenza e la data di inserimento all’interno della lista d’attesa.

- Gestione Day Service Ambulatoriali (DSA):
>> a. Gestione dati amministrativi DSA, come ad esempio il numero poligrafico o NRE della ricetta di riferimento dell’apertura del percorso DSA, il case manager di riferimento, ed alcune informazioni cliniche legate al primo accesso del paziente;
>
>> b. Funzione di gestione percorsi DSA;
>
>> c. Compilazione modulistica DSA;
>
>> d. Funzioni di prescrizione accertamenti riconducibili al singolo percorso DSA;
>
>> e. Monitoraggio scadenze percorsi DSA.

- Gestione interventi chirurgici ambulatoriali (Ex-PAC): 
>> a. rilevazione dei dati specifici e delle informazioni a carattere amministrativo funzionali all'assolvimento del debito informativo verso Regione Liguria;

- Chiusura della SDO:
>> a. Integrazione con sistema Sale Operatorie per rilevazione codici intervento;
>
>> b. Compilazione codici diagnosi, coadiuvato da integrazione con sistema Finder per la verifica preventiva di congruità ed appropriatezza delle codifiche utilizzate a fini di compilazione SDO;
>
>> c. Compilazione e firma digitale SDO. 

- Stampe:
>> a. stampa della SDO;
>
>> b. stampa dei certificati di ricovero e di degenza;
>
>> c. stampa del frontespizio;
>
>> d. stampa del braccialetto identificativo del paziente;
>
>> e. stampa di etichette di laboratorio (per i DSA);
>
>> f. stampa delle ricette (per i DSA);
>
>> g. stampa di altra modulistica.

- Back Office e Archivio Clinico:
>> a. Gestione e monitoraggio dello stato delle cartelle archiviate;
>
>> b. Tariffazione delle cartelle complete, tramite integrazione con il sistema Grouper di 3M, garantendo così elevata affidabilità nel calcolo del DRG con evidenza di eventuali anomalie;
>
>> c. Gestione e monitoraggio delle richieste di copie delle cartelle archiviate, con segnalazione e tracciatura dello stato di avanzamento della richiesta (es. copia fatta e firmata, copia ricevuta, copia consegnata, copia spedita, ecc.).

- Modulo Portineria:
>> a. gestione del front office;
>
>> b. il profilo dell'utente di portineria è soggetto alle limitazioni pertinenti all'attività (visibilità dello storico inibita, oscuramento dei dati clinici).

- Liste pazienti:
>> a. Lista pazienti ricoverati;
>
>> b. Lista pazienti dimessi;
>
>> c. Lista trasferimenti effettuati;
>
>> d. Lista DRG e Tariffazione;
>
>> e. Lista gestione richieste cartella;
>
>> f. Lista gestione movimenti cartella;
>
>> g. Lista DSA aperti e chiusi;
>
>> h. Lista PAC aperti/chiusi.

- Statistiche:
>> a. disponibilità di statistiche predefinite sui principali indicatori;
>
>> b. possibilità di costruire statistiche personalizzate combinando parametri di ricerca e informazioni da estrarre;
>
>> c. output delle statistiche in formato PDF, .xls, .csv, ecc.   

- Gestione dei flussi informativi regionali/ministeriali:
>> a. gestione dei flussi previsti dall'attuale normativa: flusso SDO, flusso DSA, flusso controdeduzioni, flusso HSP 22-24;
>
>> b. applicazione dei principali controlli in fase di registrazione dei dati con segnalazione in tempo reale agli operatori della anomalie da correggere;
>
>> c. estrazione dei flussi con preparazione di file nel formato richiesto da specifiche. 

#### Manuale utente

Fare riferimento al file '' nella medesima cartella di questo file.

### Pagine istituzionali relative al progetto

Nulla di rilevante.

### Documentazione aggiuntiva

Nulla di rilevante.

### Struttura repository

Il repository prevede un singolo ramo e la struttura sintetica delle directory è la seguente:

1. src/main/java => root folder dei file java 
2. src/main/webapp => root folder della webapp risultato della compilazione, contiene le risorse javascript, css, html, immagini e tutte le altre risorse statiche
3. src/main/webapp/WEB-INF/lib => folder contenente le librerie java di terze parti

### Prerequisiti e dipendenze

Il software necessita del collegamento ad un'istanza di Oracle RDBMS versione 11.2.0.4 la cui installazione va eseguita seguendo le indicazioni del produttore.

Per usufruire delle funzionalità di stampa e reportistica il software richiede la presenza di un'istanza di CrystalClear la cui installazione va eseguita seguendo le indicazioni del produttore.

L'esecuzione della webapp richiede i seguenti componenti che, risultando NON ridistribuibili ai termini della relativa licenza, non sono inclusi nel repository e vanno ottenuti seguendo le indicazioni del produttore:

|File di libreria|Fonte|
|-|-|
|ElcoCore-F-A-AIO-2.6.0.jar|https://www.elco.it/ |
|ojdbc6-11.2.0.4.0.jar|Oracle - JDBC and UCP Downloads page https://www.oracle.com/database/technologies/appdev/jdbc-downloads.html |
|orai18n-11.2.0.4.0.jar|Oracle JDBC Drivers https://www.oracle.com/database/technologies/appdev/jdbc-downloads.html |
|ucp5-11.2.0.3.0.jar|Oracle - JDBC and UCP Downloads page https://www.oracle.com/database/technologies/appdev/jdbc-downloads.html |


L'esecuzione dell'applet richiede i seguenti componenti che, risultando NON ridistribuibili ai termini della relativa licenza, non sono inclusi nel repository e vanno ottenuti seguendo le indicazioni del produttore:

|File di libreria|Fonte|
|-|-|
|PDFOne.jar|https://www.gnostice.com/ (PDFOne) |
|JTwain.jar|https://asprise.com/product/jtwain/ |

#### Installazione delle dipendenze

Una volta ottenuti i jar indicati al paragrafo "Prerequisiti e dipendenze" per l'esecuzione della webapp questi vanno copiati nella directory "WEB-INF/lib" del progetto.

Una volta ottenuti i jar indicati al paragrafo "Prerequisiti e dipendenze" per l'esecuzione dell'applet questi vanno copiati nella directory "app" del progetto.
Prima dell'esecuzione assicurarsi che tutti i jar contenuti nella directory "app" risultino coerentemente firmati tramite il medesimo certificato utilizzando il compoenente jarsigner (https://docs.oracle.com/javase/7/docs/technotes/tools/windows/jarsigner.html)

Assicurarsi che gli artefatti, sia in ambiente di sviluppo che  in ambiente di produzione, vengano eseguiti specificando il parametro di avvio "-Dfile.encoding=ISO8859_1".

### Istruzioni per l'installazione

#### Installazione dell'ambiente di sviluppo 

E' presente un utente predefinito "adtuser" con password "www".

Si riportano di seguito le indicazioni per l'installazione dell'ambiente di sviluppo; tutti punti riportati sono relativi al'installazione lato client dello sviluppatore, ad eccezione del punto 8., che riguarda l'installazione lato server (che si suppone essere comune a più sviluppatori):

1. Sistema operativo da Windows 7 in avanti, oppure utilizzare quello preferito (es. Linux Centos 7.7).
2. Installare java JDK versione 7 (preferibile la 7u80).
3. Scaricare da GitHub i sorgenti, le librerie, gli script ed i dump Oracle necessari.
4. Installare Tomcat 7.x.x (preferibile la 7.0.96) utilizzando i file context.xml, web.xml, etc. forniti (vedere punto 3).
5. Installare una IDE che supporti Java (es. Eclipse dalla Mars 2 in avanti).
6. Configurare Eclipse in modo che possa utilizzare Tomcat durante la fase di sviluppo/modifica.
7. Creare su Eclipse un progetto che punti ai sorgenti scaricati ed aggiungere al suo classpath le librerie necessarie (vedere punto 3).
8. Installare Oracle 11.x.x (preferibile 11.2.0.4) utilizzando la versione adatta al sistema operativo scelto per l'ambiente di sviluppo. Effettuare l'installazione standard di un'istanza stand alone. Creare mediante gli script forniti (vedere punto 6) gli utenti ed i tablespace necessari. Utilizzando i dump creare le tabelle, le procedure, le funzioni e tutti gli oggetti necessari al funzionamento del sistema.
9. Configurare nei file "src/main/webapp/config/caronte/connection_\*.properties" i puntamenti al database creato (vedere punto 8).

#### Installazione in ambiente di produzione

Si riportano di seguito le indicazioni per l'installazione dell'ambiente di produzione lato server:

1. Installare il sistema operativo che si intende utilizzare per la produzione (preferibile OracleLinux 7 (7.6) con almeno 6 GB di RAM per Oracle e 4 GB di RAM per Tomcat);
2. Installare java JDK versione 7 (preferibile la 7u80);
3. Installare Tomcat 7.x.x (preferibile la 7.0.96) utilizzando creati nell'ambiente di sviluppo/test;
4. Installare Oracle 11.x.x (preferibile 11.2.0.4) utilizzando la versione adatta al sistema operativo scelto per l'ambiente di produzione. Per la creazione degli schemi utilizzare quanto preparato per l'ambiente di sviluppo/test;
5. Configurare nei file "src/main/webapp/config/caronte/connection_\*.properties" i puntamenti al database creato (vedere punto 4);
6. Installare Crystal Clear 8.2.x per le stampe seguendo le istruzioni presenti sul sito del produttore (https://www.inetsoftware.de/products/clear-reports) . 

#### Installazione client 

Si riportano di seguito le indicazioni per l'installazione dell'ambiente di produzione sui client degli utenti:

1. I sistemi operativi supportati sono Windows 7 e Windows 10.
2. Il modulo può essere utilizzato su qualsiasi PC in rete. In tal caso, per un corretto funzionamento dell’applicativo, i client devono avere come caratteristiche hardware un minimo 1GB di RAM, scheda di rete 100Mb, risoluzione monitor ottimale 1024x768, browser Internet Explorer 9 o superiore, Java con versione dalla 1.6 in avanti.
3. Il browser testato è Internet Explorer 9 o superiore.
4. Effettuare le seguenti configurazioni: aggiungere nei siti attendibili la url di ONE.SYS, attivare tutti i controlli sugli ActiveX nel pannello delle Opzioni Internet del browser.

### Status del progetto

In considerazione del fatto che il software è attualmente utilizzato in ambiente di produzione è da considerarsi STABILE.

### Limitazioni e known issues

Nulla di rilevante

### Sistemi di Continuos Integration, Continuos Delivery e Code Coverage

Non è previsto alcun sistema di queste categorie.

### Sistemi di automazione deployment

Non è previsto alcun sistema di automazione delle build.

### Copyright

ASL2 Savonese.

#### Soggetti incaricati del mantenimento del progetto

Liguria Digitale S.p.A.

#### Segnalazioni di sicurezza

Eventuali segnalazioni di sicurezza vanno inviate all'indirizzo indirizzo mail
