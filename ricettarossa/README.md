# ONE.SYS RICETTA ROSSA

Applicativo sviluppato per la gestione informatica delle prescrizioni su ricetta di farmaci e prestazioni. 

## Descrizione

ONE.SYS RICETTA ROSSA è una piattaforma applicativa che permette la prescrizione su ricetta dematerializzata, rossa informatizzata e bianca di farmaci e prestazioni.

### Contesto

Il numero di ricette emmesse dall'anno 2011 all'anno 2017 da parte dei medici ospedalieri ammontano a 687.132, così ripartite:

|Anno|N° ricette elettroniche emesse da medici ASL2|N° ricette dematerializzate emesse da medici ASL2|
|:---|:-------------------------------------------:|:-----------------------------------------------:|
|2011|1.583                                        |0                                                |
|2012|64.090                                       |0                                                |
|2013|110.238                                      |0                                                |
|2014|135.204                                      |0                                                |
|2015|150.706                                      |4.605                                            |
|2016|128.812                                      |91.894                                           |
|2017|40.237                                       |261.854                                          | 

### Casi d'uso

ONE.SYS RICETTA ROSSA è una piattaforma applicativa che permette la prescrizione su ricetta dematerializzata, rossa informatizzata e bianca di farmaci e prestazioni.

### Finalità

ONE.SYS RICETTA ROSSA è una piattaforma applicativa che permette la prescrizione su ricetta dematerializzata, rossa informatizzata e bianca di farmaci e prestazioni.

#### Descrizione funzionale

Si riportano di seguito le principali funzionalità di ONE.SYS RICETTA ROSSA.

#### Funzionalità
Le funzionalità presenti sul modulo di Ricetta sono le seguenti:
>
- *Ricerca anagrafica*: permette di ricercare l’anagrafica del paziente su cui si vuole prescrivere le ricette e visualizzare lo storico delle ricette prescritte; 
>
- *Inserimento prescrizione farmaci*: permette di prescrivere farmaci su ricette dematerializzate e/o ricette rosse informatizzate; la ricerca del farmaco da prescrivere si basa sul database nazionale dei farmaci e, per ogni farmaco da prescrivere, è possibile indicare la posologia, il numero di confezioni e la nota CUF (se disponibile). È possibile anche indicare se il farmaco prescritto è associabile ad una esenzione.
>
- *Inserimento prescrizione prestazioni*: permette di prescrivere prestazioni ed accertamenti su ricette dematerializzate o su ricette rosse informatizzate; la ricerca della prestazione da prescrivere avviene mediante una schermata ad hoc, dove è possibile ricercare la prestazione, per descrizione o per codice ministeriale, sul catalogo messo a disposizione dal cliente, o su cataloghi regionali/nazionali. E’ possibile per l’utente creare profili rapidi di prescrizione, contenenti un set di prestazioni preselezionate, al fine di velocizzare la fase di prescrizione. Per ogni prestazione da prescrivere è possibile indicare la quantità, l’esenzione associata (se presente l’associazione tra la prestazione e l’esenzione per patologia indicata per la ricetta, il sistema automaticamente assocerà l’esenzione corretta alla prestazione che si sta prescrivendo), il quesito clinico, la priorità, la tipologia di accesso e il tipo di ricetta. In caso di prestazione ciclica, il sistema permette inoltre di indicare il numero di sedute per ogni ciclo.
>
- *Lista delle ricette del paziente*: permette di visualizzare, per il paziente selezionato, lo storico delle ricette prescritte, sia di farmaci che di prestazioni, con informazioni quali la data di prescrizione e lo stato delle ricette.

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

Il software necessita del coellgamento ad un'istanza di Oracle RDBMS versione 11.2.0.4 la cui installazione va eseguita seguendo le indicazioni del produttore.

L'esecuzione della webapp richiede i seguenti componenti che, risultando NON ridistribuibili ai termini della relativa licenza, non sono inclusi nel repository e vanno ottenuti seguendo le indicazioni del produttore:

|File di libreria|Fonte|
|-|-|
|CC-Viewer.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
|CCLib.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
|CrystalClear.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
|ElcoCore-W-R-AIO-2.6.0.jar|https://www.elco.it/ |
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

Una volta ottenuti i jar indicati al paragrafo "Prerequisiti e dipendenze" per l'esecuzione della webapp questi vanno copiati nella directory "WEB-INF/lib" del progetto.

Una volta ottenuti i jar indicati al paragrafo "Prerequisiti e dipendenze" per l'esecuzione dell'applet questi vanno copiati nella directory "std/app" del progetto.
Prima dell'esecuzione assicurarsi che tutti i jar contenuti nella directory "std/app" risultino coerentemente firmati tramite il medesimo certificato utilizzando il compoenente jarsigner (https://docs.oracle.com/javase/7/docs/technotes/tools/windows/jarsigner.html)

### Istruzioni per l'installazione

Assicurarsi che gli artefatti, sia in ambiente di sviluppo che  in ambiente di produzione, vengano eseguiti specificando il parametro di avvio "-Dfile.encoding=ISO8859_1".

#### Installazione dell'ambiente di sviluppo 

E' presente un utente predefinito "user" con password "user".

Si riportano di seguito le indicazioni per l'installazione dell'ambiente di sviluppo; tutti punti riportati sono relativi al'installazione lato client dello sviluppatore, ad eccezione del punto 8., che riguarda l'installazione lato server (che si suppone essere comune a più sviluppatori):

1. Sistema operativo da Windows 7 in avanti, oppure Linux Centos 7.7.
2. Installare java JDK versione 7 (preferibile la 7u80).
3. Scaricare da GitHub i sorgenti, le librerie, gli script ed i dump Oracle necessari.
4. Installare Tomcat 7.x.x (preferibile la 7.0.96) utilizzando i file context.xml, web.xml, etc. forniti (vedere punto 3).
5. Installare una IDE che supporti Java es. (Eclipse dalla Mars 2 in avanti).
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
