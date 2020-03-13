# ONE.SYS PIC

Applicativo sviluppato per la raccolta e la gestione dei consensi al trattamento dati personali e alla costituzione del DSE . 

## Descrizione

ONE.SYS PIC è un sistema sviluppato in tecnologia web che prevede la raccolta e la gestione dei seguenti consensi:
1.	Consenso generale una tantum a trattare i dati di salute a fini di cura in modalità analogica e digitale; 
2.	Consenso specifico una tantum a costituire il dossier e ad integrarlo con i dati prodotti da ASL2 successivamente alla suddetta espressione di consenso ;
3.	Consenso specifico una tantum ad integrare il dossier con i dati sensibili raccolti in formato elettronico dal 2001 ad oggi ( esclusi super-sensibili );
4.	Consenso specifico ad integrare il dossier con il singolo dato sensibile al momento in cui si forma; 
5.	Consenso specifico ad integrare il dossier con il singolo dato super-sensibile. 

### Contesto
I consensi registrati sul sistema dall' anno 2018 a oggi ammontano a 267.843, così suddivisi:

|Anno|Consenso unico DSE|Consenso documento|Consenso evento|Caregiver|Canale di visibilità MMG|
|:---|:----------------:|:----------------:|:-------------:|:-------:|:----------------------:|
|2018|84.755            |2.170             |25             |42.965   |5.900                   |
|2019|74.245            |1.201             |3.720          |46.729   |6.151                   |

### Casi d'uso
ONE.SYS PIC gestisce l'acquisizione di varie tipologie di consenso, ovvero trattamento dati, costituzione del DSE, dati sensibili pregressi, caregiver, consenso al singolo documento e al singolo evento.

#### Singolo caso d'uso

- 1° caso d'uso:
>
>>1. Il paziente, a contatto con strutture ricettive ASL2, si identifica all’operatore;
>> 2. Il paziente consulta l’informativa;  
>> 3. Il paziente comunica all’operatore le scelte per le varie voci del consenso ( a cui sono collegate e leggibili le conseguenze di una determinata  scelta).

- 2° caso d'uso:
>
>> 1. Cartaceo trasposto. 

- Consenso/Revoca specifico Evento o Documento: l’operatore registra la volontà del paziente;
>
- I documenti prodotti prima dell’espressione di volontà da parte del paziente sulla costituzione o meno del DSE, rimarranno visibili esclusivamente al medico/ambulatorio redattore (in caso di referti ambulatoriali) o il reparto produttore (in caso di ricoveri),e solo a paziente in carico o al MMG che lo ha in cura ed è stato incaricato al trattamento dei dati. 
>
- Visualizzazione e oscuramento da parte del paziente (si prendono in considerazione le modalità di acquisizione delle voci di consenso):
>
>> - Il paziente, a contatto con strutture ricettive incaricate, si identifica all’operatore;
>> - Il paziente comunica all’operatore le sue indicazioni riguardanti visualizzazione ed oscuramento rispetto i propri dati;
>> - L’operatore riporta su sistema informatico le scelte effettuate dal paziente (in caso di oscuramento) o permette la visualizzazione del DSE (in caso di visualizzazione).

### Finalità
ONE.SYS PIC ha come obiettivo una gestione del dossier sanitario elettronico (DSE) imperniata sul sistema dei consensi correlata agli accessi ed alla visibilità dei dati, in relazione ai profili assegnati agli operatori, l’oscuramento di default dei dati, la revoca e le relative modalità di acquisizione.

#### Descrizione funzionale
Si riportano di seguito le principali funzionalità di ONE.SYS PIC.

##### Funzionalità
Il portale consensi permette di gestire le seguenti operazioni:
- ricerca pazienti (su anagrafica aziendale aggiornata in real time con l’anagrafica regionale);
>
- Inserimento/modifica/revoca del consenso generale comprensivo di:
>> a. Consenso generale una tantum a trattare i dati di salute a fini di cura in modalità analogica e digitale ;
>
>> b. Consenso specifico una tantum a costituire il dossier sanitario elettronico;
>
>> c. Consenso specifico una tantum ad integrare il dossier sanitario elettronico con i dati sensibili raccolti in formato elettronico dal 2001 ad oggi ( esclusi super-sensibili ).
>
- Gestione storico consensi;
>
- Funzionalità per allegare documenti al Consenso;
>
- Gestione oscuramenti / rimozione oscuramenti eventi;
>
- Gestione oscuramenti / rimozione oscuramenti documenti;
>
- Funzionalità di stampa di:
>> a. informativa;
>
>> b. consensi compilati;
>
>> c. modulistica consensi precompilata (dati anagrafici);
>
>> d. modulistica di revoca. 
>
- Gestione Audit Log;
>
- Gestione Alert di notifica;
>
- Gestione comunicazione real-time in multicast con applicativi che hanno effettuato sottoscrizione al servizio (per la comunicazione delle variazioni dei consensi).

#### Manuale utente

Fare riferimento al file '' presente nella medesima cartella di questo file

### Pagine istituzionali relative al progetto

Nulla di rilevante.

### Documentazione aggiuntiva

Nulla di rilevante.

### Struttura repository

Il repository prevede un singolo ramo e la struttura sintetica delle directory è la seguente:

1. src/main/webapp => root folder della webapp risultato della compilazione, contiene le risorse javascript, css, html, immagini e tutte le altre risorse statiche
2. src/main/webapp/WEB-INF/lib => folder contenente le librerie java di terze parti

### Prerequisiti e dipendenze

Il software necessita del collegamento ad un'istanza di Oracle RDBMS versione 11.2.0.4 la cui installazione va eseguita seguendo le indicazioni del produttore.
Per usufruire delle funzionalità di stampa e reportistica il software richiede la presenza di un'istanza di CrystalClear la cui installazione va eseguita seguendo le indicazioni del produttore.

L'esecuzione della webapp richiede i seguenti componenti che, risultando NON ridistribuibili ai termini della relativa licenza, non sono inclusi nel repository e vanno ottenuti seguendo le indicazioni del produttore:

|File di libreria|Fonte|
|-|-|
|ElcoCore-F-C-AIO-2.6.0.jar|https://www.elco.it/ |
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

### Istruzioni per l'istallazione

#### Installazione dell'ambiente di sviluppo 

E' presente un utente predefinito "pic" con password "www".

Si riportano di seguito le indicazioni per l'installazione dell'ambiente di sviluppo; tutti punti riportati sono relativi al'installazione lato client dello sviluppatore, ad eccezione del punto 8., che riguarda l'installazione lato server (che si suppone essere comune a più sviluppatori):


1. Sistema operativo da Windows 7 in avanti, oppure utilizzare quello preferito (es. Linux).
>
2. Installare java JDK versione 7 (preferibile la 7u80).
>
3. Scaricare da GitHub i sorgenti, le librerie, gli script ed i dump Oracle necessari.
>
4. Installare Tomcat 7.x.x (preferibile la 7.0.96) utilizzando i file context.xml, web.xml, etc. forniti (vedere punto 3).
>
5. Installare una IDE che supporti Java es. (Eclipse dalla Mars 2 in avanti).
>
6. Configurare Eclipse in modo che possa utilizzare Tomcat durante la fase di sviluppo/modifica.
>
7. Creare su Eclipse un progetto che punti ai sorgenti scaricati ed aggiungere al suo classpath le librerie necessarie (vedere punto 3).
>
8. Installare Oracle 11.x.x (preferibile 11.2.0.4) utilizzando la versione adatta al sistema operativo scelto per l'ambiente di sviluppo. Effettuare l'installazione standard di un'istanza stand alone. Creare mediante gli script forniti (vedere punto 6) gli utenti ed i tablespace necessari. Utilizzando i dump creare le tabelle, le procedure, le funzioni e tutti gli oggetti necessari al funzionamento del sistema.
>
9. Configurare nei file "src/main/webapp/config/caronte/connection_\*.properties" i puntamenti al database creato (vedere punto 8).

#### Installazione in ambiente di produzione

1. Installare il sistema operativo che si intende utilizzare per la produzione (preferibile OracleLinux 7 con almeno 6 GB di RAM per Oracle e 4 GB di RAM per Tomcat)
>
2. Installare java JDK versione 7 (preferibile la 7u80)
>
3. Installare Tomcat 7.x.x (preferibile la 7.0.96) utilizzando creati nell'ambiente di sviluppo/test
>
4. Installare Oracle 11.x.x (preferibile 11.2.0.4) utilizzando la versione adatta al sistema operativo scelto per l'ambiente di produzione. Per la creazione degli schemi utilizzare quanto preparato per l'ambiente di sviluppo/test
>
5. Configurare nei file "src/main/webapp/config/caronte/connection_\*.properties" i puntamenti al database creato (vedere punto 4)
>
6. Installare Crystal Clear 8.2.x per le stampe seguendo le istruzioni presenti sul sito del produttore (https://www.inetsoftware.de/products/clear-reports)

### Status del progetto

In considerazione del fatto che il software è attualmente utilizzato in ambiente di produzione è da considerarsi STABILE.

### Limitazioni e known issues

Nulla di rilevante

### Sistemi di Continuos Integration, Continuos Delivery e Code Coverage

Non è previsto alcun sistema di queste categorie

### Sistemi di automazione deployment

Non è previsto alcun sistema di automazione delle build

### Copyright

ASL2 Savonese.

#### Soggetti incaricati del mantenimento del progetto

Liguria Digitale S.p.A.

#### Segnalazioni di sicurezza

Eventuali segnalazioni di sicurezza vanno inviate all'indirizzo indirizzo mail
