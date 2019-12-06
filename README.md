# SISTEMA ONE.SYS

Applicativo modulare sviluppato con l'obiettivo di informatizzare di tutti i dati amministrativi e sanitari inerenti i pazienti che accedono ai servizi dell'Azienda,
relativamente a prestazioni erogate sia in regime di ricovero, sia in regime ambulatoriale
e presso i servizi sanitari territoriali.

Le macro - componenti del sistema ONE.SYS disponibili ai fini della concessione in riuso sono le seguenti:
1. Sistema di autenticazione utenti mediante smart card;
>
2. Cartella di ricovero (ordinario e DH) completata in tutte le sue componenti, sia
mediche sia infermieristiche, nonché della gestione della farmacoterapia
(prescrizione e somministrazione a bordo letto), integrata con il sistema di gestione
order entry unificato per la richiesta di prestazioni diagnostiche e consulenze
interne e la consultazione dei relativi referti;
>
3. Prescrizione ricetta rossa e relativo invio dati al SAC, tramite SAR;
>
4. Prescrizione piani terapeutici e relativo invio al sistema regionale di monitoraggio;
>
5. Cartella ambulatoriale;
>
6. ADT (Accettazione, Dimissione e Trasferimento pazienti, con compilazione SDO);
>
7. Pronto Soccorso;
>
8. Cartella Medici di Medicina Generale / Pediatri di Libera Scelta, integrata nel
sistema di dossier sanitario, con condivisione del patient summary del paziente;

Il rilevante punto di forza del progetto ONE.SYS è costituito dall’unificazione, all’interno di un unico ambiente, di tutte le informazioni sanitarie inerenti i contatti del paziente con l’Azienda, consentendo:
1. l’implementazione di un sistema di single sign on, con identificazione del paziente
mediante smart card;
>
2. la gestione unificata dei profili di abilitazione;
>
3. la possibilità di condivisione immediata delle informazioni fra diversi operatori e
strutture;
>
4. la miglior gestione dell’appropriatezza in fase prescrittiva, stante la consultabilità on line di tutti i referti diagnostici prodotti;
>
5. la miglior gestione del rischio clinico, grazie alla ripartizione dei compiti e delle funzioni fra differenti figure professionali e la registrazione on line in tempo reale degli eventi clinici, con relativa firma digitale.

### Contesto

Gli utenti che attualmente utilizzano ONE.SYS ammontano a 4092.

### Finalità

ONE.SYS  è un sistema informatizzato destinato ad essere utilizzato presso tutti i servizi sanitari, ospedalieri e territoriali, di una Azienda Sanitaria. In particolare il sistema integra funzionalmente i pronto soccorso, i reparti ospedalieri (utilizzatori principalmente della cartella di ricovero), le diagnostiche (mediante order entry unificato ed interscambio in tempo reale di richieste di prestazioni, risultati strutturati e documenti firmati digitalmente), le strutture ambulatoriali (ospedaliere e territoriali) e i servizi territoriali Asl ed i MMG/PLS).

### Struttura repository

Il repository è costituito dai seguenti sottoelementi:

1. ONE.SYS PORTALE;
>
2. ONE.SYS ADT;
>
3. ONE.SYS PS;
>
4. ONE.SYS CARTELLA DI RICOVERO;
>
5. ONE.SYS GESTIONE AMBULATORIALE;
>
6. ONE.SYS RICETTA ROSSA;
>
7. ONE.SYS PIANI TERAPEUTICI;
>
8. ONE.SYS MMG;
>
9. ONE.SYS REPOSITORY;
>
10. MIDDLEWARE.

file readme presente in ogni sottocartella
