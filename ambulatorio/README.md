# ONE.SYS GESTIONE AMBULATORIALE

Applicativo sviluppato per la gestione informatica di tutte le fasi tipiche dell’iter ambulatoriale del paziente. 

## Descrizione

ONE.SYS GESTIONE AMBULATORIALE è una piattaforma applicativa predisposta per ottimizzare il flusso di gestione di tutte le fasi dell'iter ambulatoriale del paziente, dalla prenotazione delle prestazioni alla refertazione delle stesse.

Il sistema garantisce:

- la gestione dei pazienti delle strutture interessate;
- l’agevole utilizzo dello strumento in funzione delle diverse figure professionali coinvolte nel processo (medici, infermieri, ecc.);
- l’integrazione con software di terze parti in uso presso ASL2 SAVONESE.

### Contesto
Il numero di prestazioni erogate nell'anno 2018 ammontano a circa 731.786 così ripartite:

|Presidio Ospedaliero|||||Prestazioni Erogate|
|:-------------------|||||:-----------------:|
| Savona             |||||389.819            | 
| Cairo Montenotte   |||||42.113             | 
| Pietra Ligure      |||||162.037            |
| Albenga            |||||137.817            |

Gli operatori attualmente assegnati alle strutture sono:

|Tipologia personale||N.      |
|:------------------||:------:|
| Medici            ||852     |
| Infermieri        ||867     |
| Fisioterapisti    ||101     |
| Amministrativi    ||41      |


### Casi d'uso

ONE.SYS GESTIONE AMBULATORIALE gestisce di tutte le fasi dell'iter ambulatoriale del paziente, dalla prenotazione delle prestazioni alla refertazione delle stesse.

#### Singolo caso d'uso
**Flusso di eventi**: *Accettazione e refertazione di una prestazione ambulatoriale per un paziente esterno*

1. L'utente della struttura ambulatoriale, dopo aver effettuato l'accesso al sistema, ricerca la prenotazione del paziente e accetta la prenotazione;  
2. l'utente medico procede alla visita del paziente e la referta;
3. l'utente medico dopo aver consegnato il referto al paziente, gli prescrive eventuali visite e/o prestazioni successive accedendo al modulo prescrittivo.

### Finalità

ONE.SYS GESTIONE AMBULATORIALE, oltre a gestire il flusso ambulatoriale del paziente, permette di avere la rendicontazione precisa delle prestazioni erogate dai centri di costo che lo utilizzano, in modo da avere evidenza di quelli che sono i carichi di lavoro in capo ad ogni struttura.

#### Descrizione funzionale

Si riportano di seguito le principali funzionalità di ONE.SYS GESTIONE AMBULATORIALE.

#### Funzionalità

- Ricerca anagrafica
> La funzionalità di ricerca anagrafica permette di:
>
>> - ricercare l'anagrafica del paziente tramite diversi parametri di ricerca configurabili;
>> - Inserire una nuova anagrafica;
>> - accedere allo storico del paziente;
>> - acquisire il consenso privacy;
>> - accedere alla funzionalità di prenotazione esame;
>> - effettuare l'import dei dati della ricetta dematerializzata/rossa elettronica tramite CF e NRE.
>
- Prenotazione: questa funzionalità permette di effettuare prenotazioni e di consultare le agende e i relativi posti disponibili/occupati, divise per sala di erogazione. La funzionalità permette inoltre:
>
>> - possibilità di aggiungere note a orario o a slot;
>> - possibilità di sospendere posti;
>> - possibilità di spostamento e cancellazione prenotazione con motivazione;
>> - possibilità di stampa della modulistica (es. foglio di prenotazione).
>
- Lista di lavoro: all'interno della lista di lavoro sono riportate tutte le prestazioni previste per la giornata. Da questa lista l'utente può:
>
>> - Accettare, erogare e refertare le prestazioni ambulatoriali;
>> - Allegare file all'anagrafica del paziente;
>> - Stampare la modulistica necessaria;
>> - Acquisire il consenso privacy;
>> - Accedere allo storico del paziente;
>> - Accedere al modulo prescrittivo.
>
- Refertazione
> La funzionalità di refertazione ambulatoriale permette all'utente medico di:
>
>> - refertare le prestazioni ambulatoriali tramite console di refertazione dedicate e predisposte per la firma digitale;
>> - configurare referti standard;
>> - importare testi di referti precedenti all'interno del testo del referto.
>
> Dalla console di refertazione, l'utente può accedere:
>> - alla cartella ambulatoriale del paziente;
>> - alla documentazione del paziente;
>> - allo storico del paziente;
>> - al modulo prescrittivo.
>
- Gestione richieste ricevute
> La worklist delle richieste ricevute permette di:
>
>> - Visualizzare le richieste ricevute all'ambulatorio di appartenza;
>> - filtrare le richieste ricevute per stato della richiesta, centro di costo, metodica, data della richiesta e provenienza;
>> - prenotare e/o accettare la richiesta;
>> - stampare la modulistica.

#### Manuale utente

Fare riferimento al file '' nella medesima cartella di questo file.

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

L'esecuzione della webapp richiede i seguenti componenti che, risultando NON ridistribuibili ai termini della relativa licenza, non sono inclusi nel repository e vanno ottenuti seguendo le indicazioni del produttore:

|File di libreria|Fonte|
|-|-|
|CC-Viewer.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
|CCLib.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
|CrystalClear.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
|ElcoCore-W-A-AIO-2.6.0.jar|https://www.elco.it/ |
|JBarcodeBean.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
|Sero.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
|ojdbc6.jar|Oracle - JDBC and UCP Downloads page https://www.oracle.com/database/technologies/appdev/jdbc-downloads.html |
|orai18n-11.2.0.4.0.jar|Oracle JDBC Drivers https://www.oracle.com/database/technologies/appdev/jdbc-downloads.html |
|svgSalamander-tiny.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
|ucp.jar|Oracle - JDBC and UCP Downloads page https://www.oracle.com/database/technologies/appdev/jdbc-downloads.html |


#### Installazione delle dipendenze

Una volta ottenuti i jar indicati al paragrafo "Prerequisiti e dipendenze" per l'esecuzione della webapp questi vanno copiati nella directory "WEB-INF/lib" del progetto.

### Istruzioni per l'installazione

Assicurarsi che gli artefatti, sia in ambiente di sviluppo che  in ambiente di produzione, vengano eseguiti specificando il parametro di avvio "-Dfile.encoding=ISO8859_1".

#### Installazione dell'ambiente di sviluppo 

E' presente un utente predefinito "utente" con password "password".

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
