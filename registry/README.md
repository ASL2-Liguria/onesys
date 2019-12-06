# ONE.SYS REPOSITORY

Il Repository ONE.SYS 

## Descrizione



### Contesto

Il numero di documenti archiviati fino al 2018 ammontano a 8.846.958, così suddivisi:

|Tipologia                        |N° documenti archiviati               |
|:--------------------------------|:------------------------------------:|
|Laboratorio Analisi              |5.757.432                             |
|Anatomia Patologica              |3.568                                 |
|Radiologia                       |1.310.999                             |
|Medicina Nucleare                |119.792                               |
|Referti di Endoscopia            |33.127                                |
|Cardiologia                      |395.080                               |
|Verbali di PS                    |495.893                               |
|Referti Ambulatoriali            |418.986                               |
|Referti di consulenza            |112.836                               |
|Lettere di dimissione            |168.238                               |
|Lettera Terapia Primo ciclo      |10.821                                |
|Lettera al curante               |693                                   |
|Lettera di trasferimento         |987                                   |
|Lettera di prosecuzione ricovero |924                                   |
|Verbali di sala operatoria       |5.652                                 |
|Referti di visita anestesiologica|12.930                                |

### Finalità

Il Repository ONE.SYS ha come principale obiettivo quello di ottimizzare i processi di consultazione dei documenti prodotti dall’azienda in formato digitale. 

#### Descrizione funzionale

Il Repository ONE.SYS si basa su un'infrastruttura che permette la condivisione di documenti clinici relativi ad un paziente. 
>
L'interoperabilità necessaria per una tale infrastruttura si basa su una famiglia di profili di integrazione incentrati sul profilo Cross-Enterprise Document Sharing (XDS.a).
>
Il profilo XDS è focalizzato sulla fornitura di specifiche standard per gestire la condivisione di documenti tra le aziende sanitarie. 
>
Sulle fondamenta del profilo XDS, sono stati sviluppati successivamente diversi IHE Integration Profiles "content-oriented" per affrontare in maniera più specifica il contenuto dei documenti che devono essere condivisi.
>
Il Profilo di Integrazione XDS si pone come obiettivo la creazione di un’infrastruttura che consenta la condivisione di documenti clinici all’interno di un dominio (in questo specifico caso ASL2). 
>
Tale profilo è gestito da più attori distinti, aventi responsabilità differenti e che interagiscono tra loro attraverso transazioni con scopi diversi.  
>
Si riporta di seguito il dettaglio degli attori coinvolti, specificando per ognuno, il proprio ruolo:
> - Document Source: è l’attore incaricato della produzione dei documenti ed il responsabile della loro pubblicazione. Deve spedire i documenti ed i metadati correlati al Document Repository, in modo da consentirne la pubblicazione sul Document Registry;
> - Document Repository: è l’attore incaricato della memorizzazione dei documenti ricevuti dal Document Source e dell’invio dei metadati corrispondenti al Document Registry. Ad ogni documento viene assegnato un indirizzo che consente il recupero del documento stesso da parte del Document Consumer;
> - Document Registry: è l’attore preposto per la conservazione delle informazioni contenute nei metadati ricevuti in corrispondenza ad ogni transazione eseguita dal Document Source verso un Document Repository. I metadati conservati includono il link al documento nel Repository in cui questo è memorizzato. Questo attore ha inoltre il compito di rispondere alle interrogazioni ricevute dal Document Consumer restituendo le informazioni necessarie per il recupero dello specifico documento presente su un Repository;
> - Document Consumer: è l’attore che interroga il Document Registry per ottenere i documenti e le informazioni corrispondenti a determinati parametri di ricerca ed esegue il retrieve dei documenti di interesse dal Repository nel quale sono conservati. Il Document Consumer utilizza la transazione Retrieve Document Set per ottenere i documenti dal Document Repository. Per poter fare ciò il Document Consumer deve prima ottenere l’identificativo del documento dal Document Registry mediante una transazione di Registry Stored Query.

### Pagine istituzionali relative al progetto

Nulla di rilevante.

### Documentazione aggiuntiva

Nulla di rilevante.

### Struttura repository

Il repository prevede un singolo ramo e la struttura sintetica delle directory è la seguente:

1. registry-a/config/registry_oracle_db.php => contiene i puntamenti al database server
2. registry-a => contiene l'implementazione del componente logico XDS.a Registry
3. repository => contiene l'implementazione del componente logico XDS Repository

### Prerequisiti e dipendenze

Il software necessita del collegamento ad un'istanza di Oracle RDBMS versione 11.2.0.4 la cui installazione va eseguita seguendo le indicazioni del produttore.

#### Installazione delle dipendenze

nulla di rilevante

### Istruzioni per l'installazione

#### Installazione dell'ambiente di sviluppo 

Si riportano di seguito le indicazioni per l'installazione dell'ambiente di sviluppo; tutti punti riportati sono relativi al'installazione lato client dello sviluppatore, ad eccezione del punto 8., che riguarda l'installazione lato server (che si suppone essere comune a più sviluppatori):

1. Sistema operativo da Windows 7 in avanti, oppure Linux Centos 7.7.
2. Installare PHP versione 5.6 (preferibile la 5.6.40)
3. Installare modulo OCI8 per il collegamento al database server
4. Scaricare da GitHub i sorgenti, le librerie, gli script ed i dump Oracle necessari.
5. Installare Apache 2.2.11
6. Installare una IDE che supporti PHP es. Eclipse PDT.
7. Creare su Eclipse un progetto che punti ai sorgenti scaricati.
8. Installare Oracle 11.x.x (preferibile 11.2.0.4) utilizzando la versione adatta al sistema operativo scelto per l'ambiente di sviluppo. Effettuare l'installazione standard di un'istanza stand alone. Creare mediante gli script forniti gli utenti ed i tablespace necessari. Utilizzando i dump, creare le tabelle, le procedure, le funzioni e tutti gli oggetti necessari al funzionamento del sistema.
9. Configurare nel file registry-a/config/registry_oracle_db.php i puntamenti al database creato (vedere punto 8)
10. Configurare nel file repository/config/repository_oracle_db.php i puntamenti al database creato (vedere punto 8)
11. Configurare nella tabella XDSREPOSITORY.REGISTRY, attraverso la colonne HOST e PORT, la location dell'istanza registry 
12. Configurare nella tabella XDSREPOSITORY.REPOSITORY, attraverso la colonne HOST e PORT, la location dell'istanza repository

#### Installazione in ambiente di produzione

1. Installare il sistema operativo che si intende utilizzare per la produzione (preferibile OracleLinux 7 con almeno 6 GB di RAM per Oracle e 4 GB di RAM per Tomcat)
2. Installare PHP versione 5.6 (preferibile la 5.6.40)
3. Installare modulo OCI8 per il collegamento al database server
4. Installare Apache 2.2.11
5. Installare Oracle 11.x.x (preferibile 11.2.0.4) utilizzando la versione adatta al sistema operativo scelto per l'ambiente di produzione. Per la creazione degli schemi utilizzare quanto preparato per l'ambiente di sviluppo/test
6. Configurare nel file registry-a/config/registry_oracle_db.php i puntamenti al database creato (vedere punto 5)
7. Configurare nel file repository/config/repository_oracle_db.php i puntamenti al database creato (vedere punto 5)
8. Configurare nella tabella XDSREPOSITORY.REGISTRY, attraverso la colonne HOST e PORT, la location dell'istanza registry 
9. Configurare nella tabella XDSREPOSITORY.REPOSITORY, attraverso la colonne HOST e PORT, la location dell'istanza repository

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
