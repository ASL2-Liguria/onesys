# ONE.SYS PIANI TERAPEUTICI

Applicativo sviluppato per la gestione informatica delle prescrizioni di piani terapeutici. 

## Descrizione

ONE.SYS PIANI TERAPEUTICI è una piattaforma applicativa che permette l’inserimento e la prescrizione di piani terapeutici.

### Contesto

Il numero di piani terapeutici prescritti dall'anno 2012 all'anno 2018 da parte dei medici ospedalieri ammontano a 71.756, così ripartiti:

|Anno|||||||N° di PT prescritti||||||||
|:---|||||||:-----------------:||||||||
|2012|||||||3.858              ||||||||
|2013|||||||7.122              ||||||||
|2014|||||||9.545              ||||||||
|2015|||||||11.962             ||||||||
|2016|||||||12.260             ||||||||
|2017|||||||13.134             ||||||||
|2018|||||||13.875             ||||||||

### Casi d'uso

ONE.SYS PIANI TERAPEUTICI è una piattaforma applicativa che permette l’inserimento di piani terapeutici.

### Finalità

ONE.SYS PIANI TERAPEUTICI è una piattaforma applicativa che permette l’inserimento di piani terapeutici.

#### Descrizione funzionale

Si riportano di seguito le principali funzionalità di ONE.SYS PIANI TERAPEUTICI.

#### Funzionalità
Le funzionalità presenti sul modulo dei piani terapeutici sono le seguenti:
>
- *Ricerca anagrafica*: permette di ricercare l’anagrafica del paziente su cui si vuole inserire un piano terapeutico.
>
- *Inserimento Piano Terapeutico*: è possibile tramite una schermata ad hoc inserire un piano terapeutico; per ogni piano terapeutico è possibile indicare la data di attivazione, la scadenza, il principio attivo da inserire nel piano terapeutico. 
Per ogni principio attivo selezionato, vengono mostrati i farmaci prescrivibili su Piano Terapeutico, con le indicazioni terapeutiche. 
È possibile firmare digitalmente il piano terapeutico, in questo modo il piano sarà inviato alla base dati regionale.
>
- *Visualizza Piani Terapeutici del paziente*: permette di visualizzare i piani terapeutici inseriti per il paziente di interesse. Da questa funzionalità è possibile:
>> - rinnovare i piani terapeutici inseriti e firmati digitalmente;
>> - chiudere i piani terapeutici prima della data di scadenza prefissata.

#### Manuale utente

Fare riferimento al file "<>" presente nella medesima cartella di questo file

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

L'esecuzione della webapp richiede i seguenti componenti che, risultando NON ridistribuibili ai termini della relativa licenza, non sono inclusi nel repository e vanno ottenuti seguendo le indicazioni del produttore:

|File di libreria|Fonte|
|-|-|
|CC-Viewer.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
|CCLib.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
|CrystalClear.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
|ElcoCore-W-PT-AIO-2.6.0.jar|https://www.elco.it/ |
|JBarcodeBean.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
|PDFOne.jar|https://www.gnostice.com/ (PDFOne) |
|Sero.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
|Sprinta.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
|iaik_jce.jar|http://jce.iaik.tugraz.at/ |
|ojdbc6.jar|Oracle - JDBC and UCP Downloads page https://www.oracle.com/database/technologies/appdev/jdbc-downloads.html |
|orai18n-11.2.0.4.0.jar|Oracle JDBC Drivers https://www.oracle.com/database/technologies/appdev/jdbc-downloads.html |
|svgSalamander-tiny.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
|ucp.jar|Oracle - JDBC and UCP Downloads page https://www.oracle.com/database/technologies/appdev/jdbc-downloads.html |


L'esecuzione dell'applet richiede i seguenti componenti che, risultando NON ridistribuibili ai termini della relativa licenza, non sono inclusi nel repository e vanno ottenuti seguendo le indicazioni del produttore:

|File di libreria|Fonte|
|-|-|
|PDFOne.jar|https://www.gnostice.com/ (PDFOne) |
|JTwain.jar|https://asprise.com/product/jtwain/ |

#### Installazione delle dipendenze

Una volta ottenuti i jar indicati al paragrafo "Una volta ottenuti i jar indicati al paragrafo "Prerequisiti e dipendenze" per l'esecuzione della webapp questi vanno copiati nella directory "WEB-INF/lib" del progetto.

Una volta ottenuti i jar indicati al paragrafo "Prerequisiti e dipendenze" per l'esecuzione dell'applet questi vanno copiati nella directory "std/app" del progetto.
Prima dell'esecuzione assicurarsi che tutti i jar contenuti nella directory "std/app" risultino coerentemente firmati tramite il medesimo certificato utilizzando il compoenente jarsigner (https://docs.oracle.com/javase/7/docs/technotes/tools/windows/jarsigner.html)

Assicurarsi che gli artefatti, sia in ambiente di sviluppo che  in ambiente di produzione, vengano eseguiti specificando il parametro di avvio "-Dfile.encoding=ISO8859_1".

### Istruzioni per l'installazione

#### Installazione dell'ambiente di sviluppo 

E' presente un utente predefinito "user" con password "user".

Si riportano di seguito le indicazioni per l'installazione dell'ambiente di sviluppo; tutti punti riportati sono relativi al'installazione lato client dello sviluppatore, ad eccezione del punto 8., che riguarda l'installazione lato server (che si suppone essere comune a più sviluppatori):

1. Sistema operativo da Windows 7 in avanti, oppure Linux Centos 7.7.
2. Installare java JDK versione 7 (preferibile la 7u80).
3. Scaricare da GitHub i sorgenti, le librerie, gli script ed i dump Oracle necessari.
4. Installare Tomcat 7.x.x (preferibile la 7.0.96) utilizzando i file context.xml, web.xml, etc. forniti (vedere punto 3).
5. Installare una IDE che supporti Java es. Eclipse dalla Mars 2 in avanti.
6. Configurare Eclipse in modo che possa utilizzare Tomcat durante la fase di sviluppo/modifica.
7. Creare su Eclipse un progetto che punti ai sorgenti scaricati ed aggiungere al suo classpath le librerie necessarie (vedere punto 3).
8. Installare Oracle 11.x.x (preferibile 11.2.0.4) utilizzando la versione adatta al sistema operativo scelto per l'ambiente di sviluppo. Effettuare l'installazione standard di un'istanza stand alone. Creare mediante gli script forniti (vedere punto 6) gli utenti ed i tablespace necessari. Utilizzando i dump creare le tabelle, le procedure, le funzioni e tutti gli oggetti necessari al funzionamento del sistema.
9. Configurare nel file context.xml i puntamenti al database creato (vedere punto 8).
10. Configurare nella tabella IMAGOWEB.GES_CONFIG_PAGE i puntamenti al database creato (vedere punto 8; select \* from IMAGOWEB.GES_CONFIG_PAGE where PAGINA = 'CONNESSIONE_DB_CONFIGURAZIONE_SCHEDE')

#### Installazione in ambiente di produzione

Si riportano di seguito le indicazioni per l'installazione dell'ambiente di produzione lato server:

1. Installare il sistema operativo che si intende utilizzare per la produzione (preferibile OracleLinux 7 (7.6) con almeno 6 GB di RAM per Oracle e 4 GB di RAM per Tomcat);
2. Installare java JDK versione 7 (preferibile la 7u80);
3. Installare Tomcat 7.x.x (preferibile la 7.0.96) utilizzando creati nell'ambiente di sviluppo/test;
4. Installare Oracle 11.x.x (preferibile 11.2.0.4) utilizzando la versione adatta al sistema operativo scelto per l'ambiente di produzione. Per la creazione degli schemi utilizzare quanto preparato per l'ambiente di sviluppo/test;
5. Configurare nel file context.xml i puntamenti al database creato (vedere punto 4);
6. Configurare nella tabella IMAGOWEB.GES_CONFIG_PAGE i puntamenti al database creato (vedere punto 4; select \* from IMAGOWEB.GES_CONFIG_PAGE where PAGINA = 'CONNESSIONE_DB_CONFIGURAZIONE_SCHEDE')
7. Installare Crystal Clear 8.2.x per le stampe seguendo le istruzioni presenti sul sito del produttore (https://www.inetsoftware.de/products/clear-reports) .

#### Installazione client 

Si riportano di seguito le indicazioni per l'installazione dell'ambiente di produzione sui client degli utenti:

1. I sistemi operativi supportati sono WindowsXP SP3, Windows Vista, Windows 7 e Windows 10.
2. Il modulo può essere utilizzato su qualsiasi PC in rete. In tal caso, per un corretto funzionamento dell’applicativo, i client devono avere come caratteristiche hardware un minimo 1GB di RAM, scheda di rete 100Mb, risoluzione monitor ottimale 1024x768, browser Internet Explorer 7 o superiore, Java con versione dalla 1.6 in avanti.
3. Il browser testato è Internet Explorer 7 o superiore.
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
