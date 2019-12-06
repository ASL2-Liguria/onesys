# ONE.SYS MMG

Applicativo sviluppato per la gestione informatica della cartella clinica del paziente da parte del medico di medicina generale/pediatra di libera scelta.

## Descrizione

ONE.SYS MMG è una piattaforma applicativa predisposta per per la gestione informatica della cartella clinica del paziente da parte del medico di medicina generale/pediatra di libera scelta.

### Contesto
Il numero di ricette emmesse dall'anno 2011 all'anno 2017 da parte dei medici di medicina generale / pls ammontano a 8.792.801, così ripartite:

|Anno||||||||N° ricette elettroniche emesse da MMG/PLS|N° ricette dematerializzate emesse da MMG/PLS||||||||
|:---||||||||:---------------------------------------:|:-------------------------------------------:||||||||
|2013||||||||153.187                                  |0                                            ||||||||
|2014||||||||2.045.041                                |6.950                                        ||||||||
|2015||||||||2.269.836                                |658.080                                      ||||||||
|2016||||||||1.111.512                                |1.861.063                                    ||||||||
|2017||||||||434.666                                  |2.605.707                                    ||||||||

Gli operatori che attualmente accedono al sistema sono:

|Tipologia personale         |||||||N.      |
|:---------------------------|||||||:------:|
| Medici                     |||||||340     |
| Infermieri e Amministrativi|||||||127     |

### Casi d'uso

ONE.SYS MMG permette al medico di medicina generale/pls di avere una visione completa della storia clinica del suo assistito, nonchè la gestione della cartella clinica.

**Flusso di eventi**: *Compilazione della cartella e prescrizione di farmaci e accertamenti per il proprio l'assistito*

1. L'utente medico di base, dopo aver effettuato l'accesso al sistema, ricerca il paziente in anagrafica dei propri assistiti; 
2. il paziente illustra al medico di famiglia il proprio stato di salute e i sintomi riscontrati;
3. l'utente medico apre la cartella clinica del proprio assistito e inserisce i problemi e le diagnosi del paziente;
4. l'utente medico consulta, grazie al visualizzatore dei documenti, eventuali referti di accertamenti diagnostici effettuati precedentemente dal paziente;
5. l'utente medico compila, se necessario, il diario clinico, inserendo anche i parametri vitali rilevati durante la visita;
6. l'utente medico, grazie al modulo di prescrizione integrato, prescrive al paziente eventuali farmaci o eventuali accertamenti da eseguire.

### Finalità

ONE.SYS MMG è nato con l’intento di integrare l’attività del Medico di Medicina Generale e del Pediatra di Libera Scelta con informazioni provenienti dall’ASL, permettendo quindi al medico di avere una visione a 360° sul proprio assistito.

#### Descrizione funzionale

Si riportano di seguito le principali funzionalità di ONE.SYS MMG.

#### Funzionalità

- Anagrafica e ricerca dei pazienti
>Il modulo ONE.SYS MMG consente l’integrazione con l’anagrafica aziendale.
>
> Tramite una pagina dedicata, permette di ricercare tra i propri assistiti e tra quelli presenti in anagrafica sanitaria (se collegata). L’integrazione con l’anagrafica permette inoltre di associare correttamente l’esenzioni corrette al paziente, mantenendo queste informazioni sempre aggiornate e riducendo eventuali errori di associazioni in caso di scadenza non comunicata dal paziente.
>
- Problemi/Diagnosi
> L’applicativo prevede una sezione dedicata all’inserimento e la registrazione delle problematiche/diagnosi del paziente. In questo modo il medico può visualizzare ad ogni apertura di cartella i problemi ed il relativo stato di avanzamento. Inoltre il medico ha la possibilità di correlare più diagnosi/problematiche insieme, consentendo un raggruppamento logico e clinico di quanto accade al paziente. La sezione permette inoltre, per le pazienti di sesso femminile, di inserire la gravidanza; inserendo tali informazioni il sistema calcola automaticamente la settimana di gravidanza e considera automaticamente, nelle varie prescrizioni, l’esenzione correlata a tale settimana, facilitando il compito al medico prescrittore.
>
- Diari
> Il medico, all’interno della cartella clinica del paziente, ha la possibilità di inserire delle note di diario per registrare il decorso del proprio paziente. Attraverso la sezione dedicata è possibile compilare inoltre le visite, con una struttura configurabile e con la possibilità di correlarle ai parametri rilevati.
>
- Bacheca
>Funzionalità molto utilizzata del modulo ONE.SYS MMG è la bacheca del medico. La bacheca è accessibile dall’utente sia all’interno della cartella (filtrando le informazioni anche per il paziente) che all’esterno (filtrate per utente). L’utente ha la possibilità di inserirsi promemoria con scadenze ed urgenze programmate, allegare file. Se configurate, è possibile ricevere in tale sezione le comunicazioni da parte dell’Azienda, al fine di rendere più diretta la comunicazione con il MMG/PLS.
>
- Cartella Clinica
> Il modulo ONE.SYS MMG, dopo aver ricercato il paziente, permette l’apertura della Cartella Clinica relativa, la quale può prevedere oltre alla gestione classica, una gestione orientata alle problematiche inserite per il paziente dal medico. In questo modo per il medico potrà essere più semplice vedere quanto prescritto e inserito in correlazione alla problematica scelta.
>
> L’applicativo consente di gestire ed implementare la cartella clinica del paziente, permettendo la registrazione e la visualizzazione di informazioni relative al paziente, quali diari e schede inerenti il Patient Summary, le visite, vaccinazioni, rilevazioni, PPIP, gravidanze, allergie; l’utente, tramite policy derivanti dai consensi concessi dal paziente, può accedere alla documentazione clinica dell’assistito, potendo visualizzare referti strumentali, referti di laboratorio analisi, referti di visite specialistiche, lettere di dimissioni, verbali di PS. È inoltre possibile la visualizzazione dei dati strutturati di laboratorio, in accordo con le regole privacy vigenti ed i consensi del paziente.
> 
> La possibilità di visualizzare in maniera organizzata questo insieme di informazioni permette di avere un quadro completo delle dinamiche cliniche legate al paziente, permettendo all’utente di accedere facilmente alle varie funzionalità, sia tramite il riepilogo, sia tramite il menu, sia tramite le icone di accesso rapido.
>
- Prescrizione
> Il modulo ONE.SYS MMG, attraverso una interfaccia ergonomica e fruibile, mette a disposizione un metodo di prescrizione rapido, con il quale il medico può, partendo se vuole dallo storico delle prescrizioni già effettuate, oppure ricercando nuovi farmaci e prestazioni, prescrivere una ricetta (bianca, rossa, dematerializzata). Il sistema, in maniera automatica e trasparente all’utente, suggerisce associazioni automatiche di esenzioni (del paziente) alle prestazioni/farmaci che si stanno prescrivendo. Inoltre il medico è libero di modificare/introdurre nuove esenzioni, in autonomia. Attraverso meccanismi grafici, il sistema notifica visivamente le informazioni correlate ai farmaci/accertamenti che si stanno prescrivendo, tra le quali, a titolo di esempio, il calcolo della rimanenza del farmaco dall’ultima prescrizione, la presenza di un Piano Terapeutico collegato al farmaco, l’associazione di Note AIFA alla prescrizione, ecc. . 
>
- Certificati e Modulistica
> Il modulo ONE.SYS MMG dispone di una sezione specifica in cui viene raccolta tutta la modulistica che il medico di medicina generale o PLS può compilare per il suo assistito, a partire dai certificati di malattia per la scuola, fino ad arrivare a modulistica specifica per richieste quali, a titolo esemplificativo, il porto d’armi o l’assistenza domiciliare integrata (ADI).
>
> Inoltre, tramite un collegamento diretto con il servizio messo a disposizione dal Sistema Tessera Sanitaria, l’applicativo consente la compilazione del Certificato di Malattia, che viene direttamente inviato all’INPS. La compilazione viene facilitata inserendo le informazioni di contatto, al fine di velocizzare l’operatività del medico.
>
- Vaccinazioni
> Il modulo permette la gestione delle vaccinazioni (antinfluenzali e non). Permette di inserire e rendicontare i vaccini antinfluenzali, i quali verranno configurati sul sistema, delle campagne annuali. Le informazioni potranno essere rendicontate verso l’ASL di appartenenza del medico attraverso reportistica stampata oppure tramite invio elettronico delle informazioni verso i dipartimenti di prevenzione delle aziende. Questo facilita il lavoro del medico e dell’azienda, consentendo una gestione snella e rapida dell’incombenza della rendicontazione.
>
- Patient Summary
> Il Patient Summary è una scheda che viene compilata dal modulo ONE.SYS MMG da parte del medico di medicina generale o pediatra di libera scelta e riporta le seguenti informazioni: 
>
>> - Dati generali del paziente: comprendono le informazioni riepilogative del paziente, recapiti telefonici di familiari / tutori.
>
>> - Anamnesi: comprende le informazioni relative all’anamnesi fisiologica e familiare del paziente. 
>
>> - Anamnesi Clinica: comprende le informazioni relative all’anamnesi clinica del paziente, con eventuali indicazioni su trapianti e protesi.
>
>> - Allergie / Intolleranze: comprende le informazioni relative ad allergie e / o intolleranze del paziente. 
>
>> - Interventi: comprende la cronologia degli interventi subiti dal paziente.
>
>> - Problemi: comprende l’elenco dei problemi legati al paziente.
>
>> - Terapie Croniche: comprende l’elenco dei farmaci segnalati come terapia cronica nella scheda paziente.
>
>> - Accertamenti: comprende una selezione degli accertamenti prescritti al paziente.
>
>> - Screening: comprende l’elenco degli screening effettuati dal paziente.
>
>> - Esenzioni: comprende l’elenco delle esenzioni associate al paziente.
>
>> - Vaccinazioni: comprende l’elenco delle vaccinazioni effettuate dal paziente.
>
>> - Info: comprende eventuali ulteriori informazioni rilevanti.
>
>> - Medico Curante: contiene le informazioni relative al medico curante.
>
- Pediatri di Libera Scelta
> Il pediatra di libera scelta utilizza lo stesso modulo dedicato ai MMG, avendo a disposizione determinate funzionalità e modulistica, dedicata alla sua professione. Tra le varie peculiarità vi sono i Bilanci Di Salute, compilabili e programmabili secondo scadenze, grafici e curve di crescita, scadenziario per visite e controlli del paziente, una visione della cartella dedicata, più fruibile per la gestione del paziente pediatrico. Inoltre anche la modulistica è dedicata, nonché la creazione delle schede dedicate come le visite che sono differenti da quelle dei MMG.

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
Per usufruire delle funzionalità di stampa e reportistica il software richiede la presenza di un'istanza di CrystalClear la cui installazione va eseguita seguendo le indicazioni del produttore.

L'esecuzione della webapp richiede i seguenti componenti che, risultando NON ridistribuibili ai termini della relativa licenza, non sono inclusi nel repository e vanno ottenuti seguendo le indicazioni del produttore:

|File di libreria|Fonte|
|-|-|
|ElcoCore-F-M-AIO-2.6.0.jar|https://www.elco.it/ |
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

E' presente un utente medico predefinito "mmg" con password "www".
E' presente un utente medico predefinito "amm_mmg" con password "www".

Si riportano di seguito le indicazioni per l'installazione dell'ambiente di sviluppo; tutti punti riportati sono relativi al'installazione lato client dello sviluppatore, ad eccezione del punto 8., che riguarda l'installazione lato server (che si suppone essere comune a più sviluppatori):

1. Sistema operativo da Windows 7 in avanti, oppure Linux Centos 7.7.
2. Installare java JDK versione 7 (preferibile la 7u80).
3. Scaricare da GitHub i sorgenti, le librerie, gli script ed i dump Oracle necessari.
4. Installare Tomcat 7.x.x (preferibile la 7.0.96) utilizzando i file context.xml, web.xml, etc. forniti (vedere punto 3).
5. Installare una IDE che supporti Java es. Eclipse dalla Mars 2 in avanti.
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
6. Installare Crystal Clear 8.2.x per le stampe seguendo le istruzioni presenti sul sito del produttore (https://www.inetsoftware.de/products/clear-reports).

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
