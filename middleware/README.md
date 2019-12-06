# ONE.SYS MIDDLEWARE

Nell’ambito del progetto ONE.SYS, il Middleware si costituisce come elemento cardine per la gestione e l’implementazione dell’integrazione tra il sistema ONE.SYS e gli applicativi aziendali in uso, garantendo il mantenimento di tutte le funzionalità e permettendo l’implementazione di una struttura con carattere interaziendale.

## Descrizione

La soluzione nasce dall’esigenza di uniformare le intergazioni tra i vari applicativi in ambito sanitario nel rispetto dei principali standard di settore, agevolando in questo modo anche lo sviluppo delle stesse.
Il Middleware riveste un ruolo di carattere fondamentale per coniugare le esigenze espresse dalla singola Azienda coinvolta nel progetto e la logica di interoperabilità, proponendosi come connettore funzionale di informazioni e dati prodotti a livello aziendale e interaziendale.

### Contesto

Si riporta di seguito il dettaglio delle integraizoni del software ONE.SYS gestite dal middleware:

|Integrazione                                                  |Modalità di integrazione|
|:-------------------------------------------------------------|:----------------------:|
|AAC                                                           |HL7                     |
|Orma Web                                                      |HL7 - Web Services      |
|Anatomia Patologica                                           |HL7                     |
|Sistema di gestione 118                                       |Web services            |
|Trace Master                                                  |HL7                     |
|Radioterapia                                                  |HL7                     |
|FSE                                                           |Web Services            |
|SAR Regione Liguria                                           |Web Services            |
|Farmadati                                                     |Web Services            |
|Moduli ONE.SYS. - Repository                                  |Web Services            |
|Integrazione invio referti di laboratorio a Repository        |Web Service             |
|Integrazione invio referti di anatomia patologica a Repository|Web Service             |
|Integrazione invio referti di ambulatorio a Repository        |Web Service             |
|Integrazione invio verbali di PS a Repository                 |Web Service             |
|Integrazione invio verbali operatori a Repository             |HL7                     |
|ADT/PS                                                        |HL7                     |

### Finalità

La soluzione si configura come uno dei punti cardine dell’intero progetto ONE.SYS, costituendosi come elemento di cooperazione tra i sistemi informativi aziendali ed elemento imprescindibile per la gestione della interoperabilità funzionale, basata sul principio di condivisione, in piena osservanza con quanto disposto in materia di protezione dei dati personali, della documentazione clinica del paziente.
>
Si pone come obiettivo inoltre quello di proporre una architettura basata su standard internazionali e profili previsti per il settore sanitario.

#### Descrizione funzionale

Il modulo ONE.SYS Middleware permette:
> - piena configurabilità e flessibilità dei flussi di informazioni tra sistemi, rispondendo  agli standard di settore (tra i quali: HL7, XDS, CDA) o linee guida di settore (ad esempio IHE);
> - lo scambio uniforme di informazioni tra sistemi in base ai consensi nella pubblicazione e nella condivisione delle informazioni rilasciati dagli assistiti;
> - la riduzione delle tempistiche per la realizzazione di integrazioni tra sistemi informativi in ambito sanitario.
>
Il Middleware è caratterizzato da flessibilità, ergonomia e modularità, tali da consentire alla soluzione di porsi come interlocutore per tutti gli attori coinvolti nella soluzione.
>
Questo modulo è progettato per garantire l’implementazione di ogni tipo di integrazione in ambito sanitario e costituisce l’interfaccia unica tra i diversi componenti esterni ed interni della soluzione proposta.
>
Per garantire il raggiungimento degli obiettivi operativi, il Middleware è stato sviluppato integralmente sul Framework di Apache Camel, una delle piattaforme di integrazione open-source tra le più versatili e diffuse, per garantire il più ampio spettro di funzionalità e servizi a valore aggiunto specializzati per il settore sanitario.
Il Middleware è quindi stato realizzato per garantire l’implementazione di una struttura operativa orientata all’ergonomia e alla flessibilità, prevedendo numerose e diverse operazioni, tra cui:
> - la creazione di route e regole di mediazione attraverso l'utilizzo di domain - specif languages, quali a titolo esemplificativo e non esaustivo: Java-based Fluent-API, Spring, Blueprint XML, Scala DSL;
> - la possibilità di lavorare con diversi sistemi di trasporto (come, ad esempio HTTP, TCP, HTTPS, SSH, ActiveMQ, etc.), attraverso l'uso di URI;
> - la completa gestione dei log generati dall’intero sistema, con l'utilizzo di una logica logback, sia su file che su database;
> - l’implementazione e utilizzo di template XML per la gestione della messaggistica HL7;
> - la creazione di regole di trasformazione del dato riutilizzabili;
> - la possibilità di integrarsi con sistemi esterni attraverso molteplici tecnologie, a titolo esemplificativo e non esaustivo: HL7, Web Service, logiche di tabelle di scambio, gestori di code, e possibilità di implementazione di nuove metodologie.


### Pagine istituzionali relative al progetto

Nulla di rilevante.

### Documentazione aggiuntiva

Nulla di rilevante.

### Struttura repository

1. configs => contiene le configurazioni dell'ambiente in esecuzione
2. src/main/java => root folder dei file java
3. src/main/resources => folder contenente file NON java da includere nel JAR risultante
4. lib => folder contenente le librerie java di terze parti


### Prerequisiti e dipendenze

Dipendenze esterne:

|File di libreria|Fonte|
|-|-|
|dicom-2.0.85.jar|https://www.elco.it/ |


#### Installazione delle dipendenze

Una volta ottenuto il jar indicato al paragrafo "Prerequisiti e dipendenze" questo va inserito nel classpath di Java.

### Istruzioni per l'installazione

#### Setup pre-avvio

L'utilizzo di SSL risulta disabilitato come impostazione di default.
L'attivazione avviene attravferso la configurazione dell'elemento "/WEBSSL/ACTIVE" contenuto nel file "configs/middleware/main".
Prerequisito per l'attivazione è la generazione di un keystore in formato JKS ([Creating a KeyStore in JKS Format](https://docs.oracle.com/cd/E19509-01/820-3503/ggfen/index.html)).
E' possibile configurare il percorso del keystore attraverso l'elemento "/WEBSSL/KEYSTORE" contenuto nel file "configs/middleware/main".

Occorre escplicitare il nome host della macchina ospitante attaverso l'elemento "/INTERNALDBBINDADDRESS"  contenuto nel file "configs/middleware/main".

E' presente un utente amministratore predefinito "admin" con password "t29'L\BnF:'bF(Ps".
E' presente un utente standard predefinito "read" con password "t29'L\BnF:'bF(Ps".

#### Installazione dell'ambiente di sviluppo 

1. Sistema operativo Windows 10 oppure Linux Centos 7.7.
2. Installare java JDK versione 8 (preferibile ultimo update).
3. Scaricare da GitHub i sorgenti e tutte le dipendenze necessarie.
4. Installare una IDE che supporti Java (es. Eclipse dalla Mars 2 in avanti).
5. Creare su Eclipse un progetto che punti ai sorgenti scaricati ed aggiungere al suo classpath le librerie necessarie (vedere punto 3) (n.b.: assicurarsi che venga inclusa come sorgente la cartella src/main/resources).
6. Per eseguire il progetto nella IDE usare come main class "elco.CamelMain" e come argomento del programma "start"

n.b.: per l'esecuzione di "elco.CamelMain" con JDK 8 occorre specificare il VM argument "-Djava.net.preferIPv4Stack=true".

#### Installazione in ambiente di produzione (server)

1. Installare il sistema operativo che si intende utilizzare per la produzione, Windows 10 o Linux Centos (preferibile Centos 7.7 con almeno 4 GB di RAM);
2. Installare java JDK versione 8 (preferibile ultimo update);
3. Sostituire nella cartella libs della struttura di installazione scaricabile da GitHub i nuovi jar creati dalla compilazione dei sorgenti ed eventuali dipendenze aggiornate.
4. Configurazione servizio:
> Windows: 
>> - nel file elcomiddleware.bat configurare la variabile JAVA_PATH in modo che punti all'installazione di java 8 presente (es. /usrl/local/JDK8/bin/java).
>>

>> - Configurare la JAVA_MEMORY in base alle necessità (la memoria è espressa in MB. Default 1024).
>>

>> - Eseguire il comando "createService.bat install"

> Linux: 
>> - nei file elcomiddlewareSystemd.sh o elcomiddlewareSystemd.sh (in base alle proprie necessità) 
>>

>> - configurare la variabile JAVA_PATH in modo che punti all'installazione di java 8 presente (es.         /usrl/local/JDK8/bin/java).
>>
                
>> - Configurare la JAVA_MEMORY in base alle necessità (la memoria è espressa in MB. Default 1024).
>>

>> - Eseguire lo script "serviceSystemd.sh install" o "serviceSysV.sh install" in base alle scelta effettuata precedentemente

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
