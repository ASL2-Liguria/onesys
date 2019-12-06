# ONE.SYS PS

Applicativo sviluppato per la gestione informatica delle pratiche di Pronto Soccorso. 

## Descrizione

ONE.SYS PS è una piattaforma software sviluppata per la gestione completa e integrata di tutto il percorso DEA dei pazienti che accedono presso i Pronto Soccorso e PPI dell’Azienda Sanitaria Locale ASL2 Savonese.

Il sistema garantisce:

- la gestione dei pazienti delle strutture interessate;
- l’agevole utilizzo dello strumento in funzione delle diverse figure professionali coinvolte nel processo (medici, infermieri, ecc.);
- l’integrazione con software di terze parti in uso presso ASL2;
- funzioni per l’estrazione dei dati, la gestione statistica e la produzione della reportistica.

### Contesto
I passaggi di Pronto Soccorso registrati nel 2018 ammontano a circa 130.969 per un totale di circa 1.401.111 prestazioni erogate, compredenti sia quelle effettuate dal personale delle strutture di Pronto Soccorso sia quelle relative a consulenze ed esami effettuati per pazienti di Pronto Soccorso da altre unità operative, così ripartite:

|Presidio Ospedaliero|||||Accessi|||||Prestazioni|
|:-------------------|||||:-----:|||||:---------:|
| Savona             |||||53.784 |||||543.445    | 
| Cairo Montenotte   |||||9.225  |||||74.752     | 
| Pietra Ligure      |||||43.419 |||||560.794    |
| Albenga            |||||24.541 |||||222.120    |

Gli operatori attualmente assegnati alle strutture sono:

|Tipologia personale|||N.     |
|:------------------|||:-----:|
| Medici            |||129    |
| Infermieri        |||194    |
| OSS               |||41     |


### Casi d'uso
ONE.SYS PS gestisce tutto il percorso DEA dei pazienti che accedono presso i Pronto Soccorso e PPI dell’Azienda Sanitaria Locale ASL2 Savonese.

#### Singolo caso d'uso
**Flusso di eventi**: *Paziente codice bianco non esente che accede in Pronto Soccorso*

1. L'utente di triage, dopo aver effettuato l'accesso al sistema, ricerca il paziente in anagrafica; 
2. Se il paziente non è presente in anagrafica, il sistema permette l'inserimento di una nuova anagrafica, rendendo evidente all'utente quali campi sono obbligatori per il corretto inserimento della nuova anagrafica;
3. L'utente apre la cartella di PS e procede all'inserimento dei dati amministrativi e clinici, necessari per l'inquadramento del paziente;
4. Il triagista assegna il codice colore al paziente e procede alla stampa del verbale di triage e del numero di chiamata;
5. Il paziente viene inserito in Lista di Attesa;
6. Il medico procede con la presa in carico medica;
7. L'utente medico compila la valutazione medica e se necessario richiede esami diagnostici e/o consulenze verso i dipartimentali;
8. L'utente medico consulta gli esiti delle richieste effettuate verso i dipartimentali;
9. L'utente medico compila e firma digitalmente il verbale di chiusura, dimettendo il paziente;
10. Il sistema stampa in automatico la distinta di pagamento da fornire al paziente per il pagamento della prestazione di Pronto Soccorso.

### Finalità
ONE.SYS PS è stato progettato sulla base e sulle esigenze dei Dipartimentali di Emergenza ed è finalizzato alla semplificazione e alla facilitazione del lavoro degli operatori, garantendo un miglioramento nell'efficienza dell'intera struttura. L’applicativo consente di acquisire velocemente tutte le informazioni, anagrafiche, cliniche e patologiche relative al paziente, di redigere facilmente i verbali di Pronto Soccorso, di produrre tutti i documenti previsti dalla normativa  ed avvalorare, grazie alle diverse integrazioni predisposte, la storia clinica del paziente.

#### Descrizione funzionale
Le funzionalità dell’applicativo ONE.SYS PS rispecchiano in toto il flusso del paziente all’interno della struttura di Pronto Soccorso, gestendo in modo integrato il dialogo informativo con le altre Unità Operative interessate (accertamenti, consulenze) e garantendo sia la produzione di verbali, certificati e stampe di corredo quanto gli aspetti medico-legali.

##### Funzionalità
- Gestione anagrafica:
>> a. integrazione con Anagrafe Aziendale dei contatti (AAC);
>
>> b. inserimento nuova anagrafica;
>
>> c. inserimento "paziente sconosciuto".

- Trattamento dei dati personali:
>> a. registrazione del consenso al trattamento al momento dell'accesso in PS, con inserimento automatico della data/ora in cui è stato raccolto e dell'operatore;
>
>> b. gestione del consenso rilasciato da terzi in caso di paziente non cosciente o minore;
>
>> c. possibilità di oscuramento dell'intero episodio di PS.

- Triage:
>> a. attribuzione del codice di priorità con possibilità di rivalutazione nel corso della permanenza in PS; il sistema gestisce la frequenza di rivalutazione in funzione dei codici di priorità assegnati, tenendo conto di quanto stabilito dalle norme vigenti e dando opportuna segnalazione agli operatori.

- Rilevazione e gestione dati clinici:
>> a. anamnesi;
> 
>> b. valutazione del dolore e rilevazione dei parametri vitali e fisiologici del paziente;la rilevazione dei parametri clinici è disponibile durante tutto il percorso del paziente, dal triage alla dimissione.

- Gestione delle terapie:
>> a. prescrizione e somministrazione delle terapie in modalità semplificata;
>
>> b. Gestione di informazioni di dettaglio quali, ad esempio, dosi, posologia, unità di misura, via di somministrazione;
>
>> c. integrazione in sola lettura con FARMADATI, che consente la ricerca del farmaco sia per nome commerciale che per principio attivo.

- Osservazione Breve Intensiva (OBI):
>> a. possibilità di invio del paziente in OBI;
>
>> b. gestione della cartella del paziente OBI.
>
- Gestione dei percorsi *fast track*; 
>
- Consulenze:
>> a. richiesta di prestazioni agli altri dipartimentali (visite, esami, accertamenti), con possiblità di configurare pacchetti predefiniti di prestazioni da richiedere;
>
>> b. integrazione con i software del Laboratorio Analisi e Radiologia; 
>
>> c. disponibilità di funzione dedicata per la refertazione delle consulenze da parte degli specialisti;
>
>> d. possibilità per il consulente di aggiungere prestazioni selezionabili da elenchi precostituiti;
>
>> e. a chiusura della consulenza validazione da parte dello specialista con possibilità di firma digitale;
>
>> f. limitazioni di accesso ai dati dei pazienti da parte dei consulenti, che visualizzano solo i pazienti per i quali erogano le consulenze richieste e i relativi precedenti;
>
>> g. disponibilità di elenco a video che permette di visualizzare lo stato delle richieste/consulenze e i referti/immagini associati (se presenti).    

- Tracciabilità del paziente:
>> a. stampa del braccialetto identificativo del paziente completo di generalità e codice a barre.

- Produzione certificati di legge:
>> a. per i certificati di malattia INPS e denunce INAIL, raccolta dei dati necessari all'interno dell'applicativo, utilizzando tutte le informazioni già raccolte (es. generalità del paziente, dati di residenza, diagnosi di dimissione, prognosi, ecc.) e interfacciamento con i sistemi degli Enti competenti per la trasmissione dei dati; 
>
>> b. produzione delle altre certificazioni previste dalle norme vigenti.

- Ticket:
>> a. gestione del ticket in base alla norma vigente in Regione Liguria;
>
>> b. alla chiusura del verbale, stampa automatica della distinta di pagamento, nei casi previsti dall'attuale normativa (ad es. pazienti non esenti, dimessi con codice bianco, ecc.), completa di codice a barre per la lettura automatica da parte dei Totem per il pagamento.

- Dimissione e chiusura dell'accesso di PS:
>> a. chiusura dell'accesso di PS con registrazione di tutte le informazioni necessarie e di quelle previste dalle normative vigenti;
>
>> b. possibilità per utenti amministratori di riaprire un accesso di PS già chiuso;
>
>> c. possibilità di inserire/modificare informazioni di tipo amministrativo (ad es. ASL di residenza del paziente) anche dopo la chiusura dell'accesso di PS per registrare informazioni necessarie all'invio del flusso informativo.

-  Verbale di PS:
>> a. produzione di un documento in formato standard (CADES), con apposizione di firma digitale e invio del documento al Repository aziendale; interfacciamento con il Fascicolo Sanitario Elettronico di Regione Liguria per l'invio dei verbali di PS;
>
>> b. inclusione nel documento degli elementi raccolti durante l'accesso di PS;
>
>> c. possibilità di uno stato 'in bozza' del verbale;
>
>> d. possibilità di riaprire un verbale validato e firmato gestendo automaticamente le versioni. 

- Ricovero:
>> a. se il paziente deve essere ricoverato, è possibile registrare l'informazione specificando il reparto di competenza clinica ed eventualmente quello di appoggio;
>
>> b. integrazione con ONE.SYS ADT per la generazione della SDO.

- Passaggi di consegne:
>> a. la funzione conferisce agli operatori (personale medico e infermieristico) subentranti la presa in carico del paziente;
>
>> b. il passaggio di consegne può essere eseguito sull'intero blocco di pazienti in visita o in attesa selezionato dall'utente.

- Liste pazienti:
>> a. lista pazienti in attesa;
>
>> b. lista pazienti presi in carico;
>
>> c. lista pazienti in OBI;
>
>> d. lista pazienti chiusi.

- Stampe:
>> a. stampa delle etichette di laboratorio;
>
>> b. stampa del braccialetto identificativo del paziente;
>
>> c. stampa di modulistica varia (ad es. denuncia all'autorità giudiziaria, consensi informati, ecc.).                   

- Statistiche:
>> a. disponibilità di statistiche predefinite sui principali indicatori;
>
>> b. possibilità di costruire statistiche personalizzate combinando parametri di ricerca e informazioni da estrarre;
>
>> c. output delle statistiche in formato PDF, .xls, .csv, ecc.   

- Gestione dei flussi informativi regionali/ministeriali:
>> a. gestione dei flussi previsti dall'attuale normativa;
>
>> b. applicazione dei principali controlli in fase di registrazione dei dati con segnalazione in tempo reale agli operatori della anomalie da correggere;
>
>> c. estrazione dei flussi con preparazione di file nel formato richiesto da specifiche.   

#### Manuale utente

Fare riferimento al file "<>" presente nella medesima cartella di questo file.

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
|ElcoCore-F-P-AIO-2.6.0.jar|https://www.elco.it/ |
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

E' presente un utente predefinito "ps" con password "www".

Si riportano di seguito le indicazioni per l'installazione dell'ambiente di sviluppo; tutti punti riportati sono relativi al'installazione lato client dello sviluppatore, ad eccezione del punto 8., che riguarda l'installazione lato server (che si suppone essere comune a più sviluppatori):

1. Sistema operativo da Windows 7 in avanti, oppure Linux Centos 7.7.
2. Installare java JDK versione 7 (preferibile la 7u80).
3. Scaricare da GitHub i sorgenti, le librerie, gli script ed i dump Oracle necessari.
4. Installare Tomcat 7.x.x (preferibile la 7.0.96) utilizzando i file context.xml, web.xml, etc. forniti (vedere punto 3).
5. Installare una IDE che supporti Java es. Eclipse dalla Mars 2 in avanti.
6. Configurare Eclipse in modo che possa utilizzare Tomcat durante la fase di sviluppo/modifica.
7. Creare su Eclipse un progetto che punti ai sorgenti scaricati ed aggiungere al suo classpath le librerie necessarie (vedere punto 3).
8. Installare Oracle 11.x.x (preferibile 11.2.0.4) utilizzando la versione adatta al sistema operativo scelto per l'ambiente di sviluppo. Effettuare l'installazione standard di un'istanza stand alone. Creare mediante gli script forniti (vedere punto 6) gli utenti ed i tablespace necessari. Utilizzando i dump, creare le tabelle, le procedure, le funzioni e tutti gli oggetti necessari al funzionamento del sistema.
9. Configurare nei file "src/main/webapp/config/caronte/connection_\*.properties" i puntamenti al database creato (vedere punto 8).

#### Installazione in ambiente di produzione

Si riportano di seguito le indicazioni per l'installazione dell'ambiente di produzione lato server:

1. Installare il sistema operativo che si intende utilizzare per la produzione (preferibile OracleLinux 7 con almeno 6 GB di RAM per Oracle e 4 GB di RAM per Tomcat);
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

Nulla di rilevante.

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
