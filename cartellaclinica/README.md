# ONE.SYS CARTELLA DI RICOVERO

Applicativo sviluppato per la gestione informatica e clinica delle pratiche di ricovero, dall'ammissione del paziete in reparto alla sua dimissione. 

## Descrizione

ONE.SYS CARTELLA DI RICOVERO è una piattaforma applicativa predisposta per ottimizzare il flusso di gestione dei ricoveri, garantendo la centralità del paziente e la fruizione delle informazioni cliniche a tutti gli attori coinvolti nel percorso di cura dell’assistito, riducendo il rischio clinico per il paziente.

Il sistema garantisce:

- la gestione dei pazienti delle strutture interessate;
- l’agevole utilizzo dello strumento in funzione delle diverse figure professionali coinvolte nel processo (medici, infermieri, ecc.);
- l’integrazione con software di terze parti in uso presso ASL2 SAVONESE.

### Contesto
Il numero di posti letto nel 2018 ammontano a circa 995 così ripartiti:

|Presidio Ospedaliero|||||Strutture|||||||Posti letto|
|:-------------------|||||:-------:|||||||:---------:|
| Savona             |||||25       |||||||470        | 
| Cairo Montenotte   |||||5        |||||||42         | 
| Pietra Ligure      |||||30       |||||||382        |
| Albenga            |||||14       |||||||101        |

Gli operatori attualmente assegnati alle strutture sono:

|Tipologia personale|||||N.      |
|:------------------|||||:------:|
| Medici            |||||1094    |
| Infermieri        |||||1966    |
| Fisioterapisti    |||||124     |
| Amministrativi    |||||296     |


### Casi d'uso
ONE.SYS CARTELLA DI RICOVERO gestisce tutto il percorso dei pazienti ricoverati (ordinari, DH, DS) che accedono presso i reparti di ricovero dell’Azienda Sanitaria Locale ASL2 Savonese.

#### Singolo caso d'uso
**Flusso di eventi 1**: *Apertura e dimissione di un ricovero ordinario programmato non urgente*

1. L'utente di reparto, dopo aver effettuato l'accesso al sistema, ricerca il paziente tra i pazienti ricoverati per allettarlo e compilare le informazioni di accesso; 
2. l'utente medico di reparto procede alla compilazione di anamnesi ed esame obiettivo e se necessario richiede esami diagnostici e/o consulenze verso i dipartimentali;
3. l'utente medico di reparto procede con la prescrizione della terapia che il paziente dovrà seguire durante il ricovero;
4. l'utente infermiere procede, agli orari stabiliti, a somministrare la terapia prescritta;
5. gli utenti, sia medici che infermieri, procedono alla stesura dei diari di loro competenza;
6. A fine ricovero, l'utente medico procede alla compilazione della lettera di dimissione;
7. L'utente di reparto procede alla stampa globale della cartella per la sua archiviazione.

**Flusso di eventi 2**: *Apertura e chiusura di un prericovero per intervento chirurgico*

1. L'utente di reparto, dopo aver effettuato l'accesso al sistema, ricerca il paziente tra i pazienti che hanno un prericovero aperto, in modo da procedere con la compilazione delle informazioni di accesso; 
2. l'utente medico di reparto procede alla compilazione di anamnesi ed esame obiettivo e prenota gli esami diagnostici e/o le consulenze necessari al fine di valutare l'idoneità del paziente a sottoporsi all'intervento chirurgico;
3. Una volta refertati tutti gli accertamenti/consulenze richiesti, l'utente medico decide se il paziente è idoneo per l'intervento;
4. Se il paziente è idoneo all'intervento, il prericovero aperto sfocia nel successivo ricovero e l'utente medico/infermiere può importare tutti i dati clinici/amministrativi sulla nuova cartella di ricovero;
5. Se il paziente non è idoneo all'intervento, il prericovero aperto viene chiuso.

### Finalità
ONE.SYS CARTELLA DI RICOVERO è prediposto a tracciare informaticamente tutte le informazioni relative agli eventi ed alla documentazione prodotta per il paziente, al fine di confezionare un vero e proprio dossier digitale del paziente, eventualmente esponbile anche all'esterno della struttura.

#### Descrizione funzionale

Si riportano di seguito le principali funzionalità di ONE.SYS CARTELLA DI RICOVERO.

#### Funzionalità
- Prospetto degenti: questa funzionalità permette la visualizzazione delle camere e dei letti (con relativo stato di occupazione) e l'allettamento dei pazienti tramite funzionalità di *drag and drop*.
>
- Ricerca anagrafica: questa funzionalità permette la ricerca dell'anagrafica del paziente tramite diversi parametri di ricerca configurabili; è possible inoltre inserire nuove anagraifche non presenti a sistema.
>
- Ricerca pazienti ricoverati: questa worklist permette la visualizzazione dei pazienti ricoverati presso i reparti associati all'utente:
>> - presenza di avvertenze che permettono all'utente di accedere con rapidità a determinate funzioni e che forniscono indicazioni cliniche;
>> - informazione del letto in cui è allettato il paziente;
>> - informazione circa l'ubicazione del paziente.
>
- Inquadramento clinico: l'inquadramento clinico è la prima fase del processo di ricovero e viene gestita entro le prime 24 ore dall'avvenuta accettazione del paziente.
L'inquadramento clinico prevede le seguenti sezioni:
>> a. Dati generali sul paziente: questa sezione contiene informazioni di carattere generale quali la professione, i rilievi socio-ambientali e altre notizie, importanti per la gestione del ricovero e dell'assistenza del paziente. La maggior parte delle informazioni gestite all'interno di questa sezione risultano pre-compilate grazie ai seguenti scenari:
>>> - integrazione nativa con ONE.SYS ADT;
>>> - proposta dati generali del precedente ricovero, se presenti, con richiesta di importazione suggerita dal sistema ma confermata dall'utente;
>>> - menù a tendina con elementi a scelta rapida;
>>> - menù a text box con elementi a scelta rapida;
>>> - testo libero.
>
>> b. Gestione Anamnesi: l'anamnesi è gestita mediante una serie di schede strutturate che consentono l'inserimento delle diverse informazioni tra cui: terapie al momento del ricovero, l'elenco degli interventi subiti dal paziente e le sue allergie o intolleranze. Nel dettaglio, la funzionalità Anamnesi è divisa nelle seguenti sezioni:
>>> - Anamnesi familiare:
>>>> - Familiarità;
>>>> - Note.

>>> - Anamnesi fisiologica:
>>>> - Dati sul percorso nascita;
>>>> - Dati su eventuale cilco mestruale o condizione di menopausa;
>>>> - Vaccinazioni effettuate;
>>>> - Note.

>>> - Abitudini di vita:
>>>> - Fumo;
>>>> - Alcol;
>>>> - Attività fisica extra-lavorativa;
>>>> - Note.

>>> - Anamnesi professionale;
>>> - Anamnesi patologica remota:
>>>> - Positività sierologiche (in caso di positività e/o presenza di microorganismi multiresistenti viene attivato un alert nell'intestazione della cartlla clinica elettronica, visibile in tutte le fasi del flusso);
>>>> - Patologie;
>>>> - Note.

>>> - Interventi chirurgici, con inserimento del codice ICD9-CM/ICD-10;
>>> - Anamnesi patologica prossima;
>>> - Gestione allergie (in caso di presenza viene attivato un alert nell'intestazione della cartella clinica elettronica, visibile in tutte le fasi del flusso):

>>>> - Allergie;
>>>> - Intolleranze;
>>>> - Reazioni avverse.
>>> - Elenco terapie al momento del ricovero
>>> - Gestione problemi attivi all'ingresso;
>>> - Moivazione del ricovero, con inserimento del codice ICD 9-CM/ICD-10.
>
>> c. Gestione Esame Obiettivo: tale sezione permette la gestione sia delle informazioni cliniche comuni a tutti i reparti sia di quelle specialistiche proprie di un determinato reparto e/o specialità. Questo consente di avere uniformità dei dati gestiti conservando allo stesso tempo la possibilità di gestire le informazioni peculiari di ciascuna specialità clinica. Le informazioni cliniche, attivabili per singoli reparti/specialità, gestite all'interno dell'esame obiettivo sono le seguenti:
>>> - Generalità;
>>> - Apparato respiratorio;
>>> - Apparato cardiovascolare;
>>> - Apparato digerente;
>>> - Altri apparati;
>
>> d. Scale di valutazione: le scale di valutazione clinica sono fondamentali nell'ottica di un efficace inquadramento del paziente e nella gestione di tutto il percorso di cura dello stesso. Di seguito si elencano alcune delle scale presenti su ONE.SYS CARTELLA DI RICOVERO:
>>> - Valutazione di rischio trombotico individuale;
>>> - Scala Painad;
>>> - Scala di Braden;
>>> - Scala di Conley;
>>> - Mini-Mental State Examination;
>>> - Scala Motricity Index;
>>> - Scala di Barthel;
>>> - Scala APRI;
>>> - Score CHA2DS2-VASC;
>>> - Score HAS-BLED;
>>> - Score di Wells;
>>> - Scala di Face;
>>> - Scala Soas;
>>> - Scala Tegner-Lysholm Total Knee Score (TLKSS);
>>> - Scala NAFLD;
>>> - Scala MAGPS;
>>> - Scala di Meld;
>>> - Scala Harris Hip Score (HHS);
>>> - Scala di Child-Pugh;
>>> - Score Ray;
>>> - Score Port PSI;
>>> - Score di Padua;
>>> - Score Mews;
>>> - Score Grace;
>>> - Scala Oxford Knee;
>>> - Scala Oxford Hip;
>>> - Scala NIHSS;
>>> - 6 Minutes Walk Test (6MWT);
>>> - FAC - Functional Ambulation Categories;
>>> - 10 Meter Walk Test (10MWT);
>>> - Scala valutazione funzionale;
>>> - Time Up and Go (TUG);
>>> - Trunk Impairment Scale (TIS);
>>> - Scala Tinetti;
>>> - Scala Trunk Control Test (TCT);
>>> - Scala Motricity Index;
>>> - Scala D.O.S.S.;
>>> - 9-Hole Peg Test;
>>> - Dynamic Gait Index;
>>> - Fugl-Meyer;
>>> - Scala A.S.H.A.;
>>> - Rischio infettivo perioperatorio.
>
- Valutazione infermieristica paziente all'ingresso: la valutazione infermieristica consiste nella raccolta di dati soggettivi e obiettivi, con lo scopo di esprimere un giudizio infermieristico sul paziente. Per gestire le attività inerenti l'accertamento infermieristico, il modello preso come riferimento permette di individuare i bisogni del paziente, formulare degli obiettivi e, più in generale, pianificare le attivià infermieristiche. L'accertamento infermieristico è trattato mediante nove sezioni:
>> a. Respirazione;
>> b. Alimentazione;
>> c. Eliminazione;
>> d. Igiene;
>> e. Movimento;
>> f. Riposo;
>> g. Ambiente;
>> h. Comunicazione;
>> l. Funzione Cardiocircolatoria.
>
- Gestione Esami/Consulenze: questa sezione consente all'utente di richiedere esami e consulenze verso i vari dipartimentali; le principali funzionalità sono:
>
>> - inserimento di prenotazioni;
>> - inserimento di richieste/consulenze;
>> - visualizzazione dei dati strutturati di laboratorio;
>> - visualizzazione dei dati strutturati di microbiologia;
>> - visualizzazione documenti del paziente;
>> - Visualizzazione richieste/prenotazioni inviate.
>
- Consulenze ricevute: questa worklist consente la visualizzazione  delle consulenze ricevute al reparto di appartenenza. L'utente può:
>> - filtrare la worklist per stato della richiesta, centro di costo di provenienza, data della richiesta e nominativo del paziente;
>> - accettare/refertare la consulenza.
>
- Diari clinici: l'applicativo consente la redazione dei diari clinici (medici e infermieristici), utili al fine di descrivere, giornalmente, il decorso delle patologie e di altri fatti clinici rilevanti, che devono essere annotati al momento del loro accadimento. 
>
> L'applicativo prevede inoltre la possbilità di inserire altre tipologie di diari associati ad altre figure professionali. I diari riportano in automatico le generalità del paziente, data e ora di rilevamento, l'operatore che redatto e il testo relativo. Ciascun operatore può visualizzare in ogni momento il diario medico e infermieristico relativo al paziente; non è consentita la modifica di una nota di diario se non all'operatore che ha redatto la nota stessa ed è configurabile un tempo massimo entro il quale è permessa tale operazione. 

- Farmacoterapia:
>La sezione "Farmacoterapia" permette la visualizzazione:
>> a. delle terapie in atto o programmate per il paziente;
>> b. dei parametri vitali rilevati in forma tabellare;
>> c. dei presidi del paziente;
>> d. delle lesioni del paziente con relative medicazioni.
>
> L'operatore può andare ad inserire i valori relativi a ciascuna attività; l'inserimento dei valori è profilato a seconda della figura professionale (medico o infermiere).
>
>Il medico inoltre ha la possibilità di programmare una serie di rilevazioni periodiche a carico degli infermieri.
>
> E' presente una sezione dedicata al monitoraggio delle terapie inserite, raggruppate per tipologia di somministrazione. Nella parte sinistra della schermata sono riassunte tutte le terapie del paziente con, per ciascuna, le indicazioni di base della prescrizione (data inizio e data di fine terapia, farmaco/i da somministrare, posologia per ogni singola somministrazione), oltre all'esibizione dei parametri vitali, dei presidi e delle attività infermieristiche. Sulla parte destra della schermata, sotto una fascia oraria rappresentante i vari turni ospedalieri (mattina, pomeriggio, notte) in corrispondenza delle voci di cui sopra, viene riportato la stato avanzamento di ciascuna.
>
> #### *Prescrizione farmaci*
> L’attività di prescrizione delle terapie per il paziente è prevista per il solo personale medico.
Le principali tipologie di somministrazione presenti sono le seguenti:
>> - orali;
>
>> - endovenose (con sotto categorie “diluita” e “bolo”);
>
>> - infusioni continue (con sotto categorie “continua” e “pompa siringa”);
>
>> - nutrizionali (con sotto categorie “infusioni parenterali”, “infusioni enterali”);
>
>> - sottocutanee (con sotto categorie “insulina fissa”, “insulina secondo stick”, “altro”);
>
>> - intramuscolari;
>
>> - varie (con sotto categorie “cerotti“, “aerosol“, “ossigenoterapia“). 
>
> A seconda della modalità di somministrazione è prevista una specifica scheda di prescrizione.
>
> L’utente medico ha a disposizione tre diverse modalità di inserimento della prescrizione:
>
>> - Per protocolli terapeutici
>
>> - Terapie standard
>
>> - per tipologia di somministrazione
>
>La modalità di prescrizione per protocolli terapeutici permette al medico di inserire un insieme di terapie definite e preimpostate associate ad una determinata patologia.
>
>La modalità di prescrizione che utilizza le terapie standard, permette all’utente medico di inserire una singola terapia preimpostata con definite modalità di somministrazione.
In entrambi i casi sopra descritti, il medico si troverà i dati della prescrizione già impostati secondo quanto definito nelle terapie del protocollo terapeutico prescelto o nella terapia definita nella terapia standard selezionata, con la possibilità, prima di confermare tali terapie, di apportare eventuali variazioni rispetto al protocollo, in base al caso clinico trattato.
>
>Le terapie standard, come i protocolli terapeutici, possono essere configurate a livello di Unità operativa o a livello di singolo utente.
>
>Per quanto riguarda la prescrizione per tipologia di somministrazione, all’interno della scheda di prescrizione è possibile l’inserimento di tutti i dati necessari per il salvataggio della terapia.
>
> I dati da inserire in fase di prescrizione di una terapia, per tutte le tipologie di terapie, sono:
>
>> - farmaco;
>> - forma farmaceutica;
>> - modalità di somministrazione;
>> - dosaggio per somministrazione;
>> - data di inizio e durata della terapia;
>> - frequenza di somministrazione;
>> - velocità di infusione o tempo di somministrazione (solo per le terapie che lo richiedono).
>
> *Ricerca Farmaci*
>
> Il modulo di prescrizione prevede la possibilità di scegliere i farmaci da inserire nelle varie schede di prescrizione (contestualmente alla loro compilazione) secondo diverse modalità di ricerca:
>
>> - Ricerca per nome commerciale: inserendo il nome completo o parte di esso;
>
>> - Ricerca per principio attivo: inserendo il principio attivo o parte di esso;
>
>> - Ricerca per codifica ATC: inserendo la codifica completa o parte di essa.
>
> *Tipologia di prescrizione*
>
> Di seguito si riportano, a titolo esemplificativo, alcune tipologie di terapie prescrivibili.
>
>> #### 1. Terapia endovenosa
>
>> Per questa tipologia di somministrazione, i campi previsti sono i seguenti:
>
>> - Scelta in relazione alla somministrazione mediante bolo o pompa siringa;
>
>> - Liquido di infusione;
>
>> - dosaggio (con relativa unità di misura);
>
>> - volume totale (calcolato ed inserito in automatico dal programma, eventualmente modificabile manualmente);
>
>> - data e ora di inizio terapia (proposte dal sistema in automatico quelle correnti, ma sempre modificabili dall'utente);
>
>> - velocità o durata di somministrazione (inserendo uno dei due dati, l'altro viene calcolato in automatico);
>
>> - prescrizioni (indicazioni sulla tempistica di somministrazione del farmaco);
>
>> - durata terapia (inserendo o il numero di giorni o impostandola fino a fine ricovero).
>
>Inoltre l’operatore può inserire uno o più soluti da somministrare in un'unica operazione, scrivere eventuali note e selezionare la tipologia (antibiotica, chemioterapica, altro).
>
>> #### 2. Terapia infusionale continua
>
>> Questa modalità consente di inserire informazioni relative a:
>
>> - Liquido di infusione;
>
>> - dosaggio (con relativa unità di misura: ml, fiale, siringhe, flaconi...);
>
>> - volume totale (calcolato ed inserito in automatico dal programma, eventualmente modificabile manualmente);
>
>> - data e ora di inizio terapia (proposte dal sistema in automatico quelle correnti, ma sempre modificabili dall'utente);
>
>> - velocità o durata di somministrazione (inserendo uno dei due dati, l'altro viene calcolato in automatico);
>
>> - prescrizioni (indicazioni sulla tempistica di somministrazione del farmaco);
>
>> - durata terapia (inserendo o il numero di giorni o impostandola fino a fine ricovero);
>
>> - concentrazione;
>
>> - dosaggio espresso in gamma/kg/ore e vari sottomultipli.
>
>> Inoltre l’operatore può inserire uno o più soluti da somministrare in un'unica operazione, scrivere eventuali note e selezionare la tipologia (antibiotica, chemioterapica, altro).
>
>> Per le terapie infusionali continue, il sistema avvisa l'utente infermieristico quando è necessario procedere al cambio della sacca.
>
>> #### 3. Terapia orale
>
>> Questa modalità consente di inserire informazioni relative a:
>
>> - Farmaco;
>
>> - Dosaggio (con relativa unità di misura);
>
>> - Prescrizioni (indicazioni sulla tempistica di somministrazione del farmaco);
>
>> - Data e ora di inizio terapia (proposte dal sistema in automatico quelle correnti, ma sempre modificabili dall'utente);
>
>> - Durata terapia (inserendo o il numero di giorni o impostandola fino a fine ricovero);
>
>> - Note.
>
>> #### 4. Ossigenoterapia
>
>> Questa modalità consente di inserire informazioni relative a:
>
>> - Modalità di somministrazione dell'ossigenoterapia (forcelle, maschera semplice, maschera con reservoir, maschera di Venturi, C-Pap, ventilatore meccanico PCV e PSV) con i rispettivi parametri (litri/min, percentuale, FiO2, Peep, Pressione di Controllo, Frequenza Respiratoria);
>
>> - Data e ora di inizio terapia (proposte dal sistema in automatico quelle correnti, ma sempre modificabili dall'utente);
>
>> - Note.
>
>> #### 5. Terapie sottocutanee
>
>> Questa modalità consente di inserire informazioni relative a:
>
>> - Farmaco;
>
>> - Data e ora di inizio terapia (proposte dal sistema in automatico quelle correnti, ma sempre modificabili dall'utente);
>
>> - Durata terapia (inserendo o il numero di giorni o impostandola fino a fine ricovero);
>
>> - Note.
>
> *Modalità di somministrazione*
> 
> E' prevista la possibilità di selezionare varie modalità di somministrazione (ovvero le tempistiche di somministrazione del farmaco o della terapia).
>
>> - Frequenza: il medico può impostare, a partire da una data e ora di inizio, gli intervalli di somministrazione (a distanza di ore/giorni/ settimane). Il sistema fornisce come data e ora di inizio quelle correnti, mantenendo la possibilità di modifica da parte dell’utente.
>
>> - Oraria: questa modalità permette di scegliere gli orari di somministrazione della terapia. A partire da una data e un orario di inizio terapia, viene visualizzata una fascia oraria rappresentante le 24 ore
successive, che permette di selezionare gli orari di somministrazione. Al fine di rendere più agevole l’operazione descritta, sono stati previsti profili orari standard definiti dal reparto.
>
>> - Al bisogno: l’applicativo consente la gestione della prescrizione di terapia al verificarsi di un determinato evento. L'evento scatenante può essere, ad esempio, il manifestarsi di un sintomo (nausea, insonnia, agitazione psicomotoria, etc.), la discrasia di un parametro vitale rispetto ad un valore soglia (ad esempio frequenza cardiaca troppo bassa, saturazione non sufficiente, temperatura superiore ad un certo valore, dolore intenso classificabile tramite la scala Vas). Nel caso in cui la terapia al bisogno venga prescritta associata alla rilevazione di un parametro vitale il medico dovrà indicare il parametro vitale ed il valore soglia del parametro vitale di riferimento che determinerà la somministrazione della terapia; dovrà inoltre indicare il dosaggio da somministrare al bisogno ed il dosaggio massimo giornaliero. Nel piano giornaliero della terapia, al verificarsi di un valore del parametro vitale fuori soglia, associato alla terapia al bisogno, verrà indicato l’onere di somministrazione della terapia al bisogno prescritta.
>
>> - Estemporanea: questa modalità consente l’inserimento di una terapia estemporanea, costituita da una singola somministrazione. Questa funzione prescrittiva usata anche in casi di emergenza, permette al medico di scegliere la terapia, il sistema propone data e ora correnti per la
somministrazione, al fine di rendere più rapido l’inserimento, ma l’utente ha la possibilità di modificare tali informazioni inserendo anche una data successiva. Anche l’operazione di somministrazione può avvenire con data e ora successiva. Nel piano di terapia del paziente, tale prescrizione viene contraddistinta con una scritta che ne evidenzia il carattere estemporaneo/di
urgenza.
>
>> - TAO (anticoagulante): questa modalità consente di gestire le peculiarità della terapia anticoagulante. Il medico, a seguito della selezione del farmaco, deve indicare l’arco temporale di durata della terapia e ha la possibilità di indicare per ogni singola somministrazione giornaliera un
diverso dosaggio di somministrazione. Il dosaggio di ogni singola somministrazione per tutti i giorni di validità della terapia, può essere definito in una fase successiva rispetto a quella di prescrizione,
sulla base di diverse valutazioni, tra cui la risposta del paziente alla terapia e i valori dell’INR.
>
> Per la gestione di terapie da somministrare in giorni non consecutivi, si possono selezionare i giorni della settimana in cui attivare la prescrizione, con le stesse modalità di somministrazione sopra descritte.
Inoltre, nel caso di terapie con dosi diverse a seconda dell'orario, l'utente durante la compilazione della scheda di prescrizione può spuntare la relativa voce e indicare i diversi dosaggi nei relativi orari.
Una volta inserite, le schede di prescrizione vengono riepilogate nel foglio di terapia del paziente per permettere una visione chiara e rapida di tutto il piano. La scheda di prescrizione può sempre essere facilmente richiamata e visualizzata.
> #### *Somministrazione*
>
>Il sistema consente di segnalare, sia da parte dell'utente medico che dell’infermiere, l’avvenuta somministrazione della terapia.
L'applicativo presenta agli infermieri una videata con l’elenco delle terapie in corso prescritte dal medico per il paziente. Ad ogni operazione corrisponde un cambiamento di colore del dettaglio per fornire un colpo
d’occhio evidente dello stato avanzamento della terapia in corso del paziente:
>
>> - Terapia prescritta non ancora somministrata (prima dell’orario di somministrazione prescritto): l’icona di evidenza della terapia è di colore bianco;
>
>> - Terapia somministrata: l’icona di evidenza della terapia diventerà di colore verde. L'utente ha la possibilità di redigere note, visibili al passaggio con il mouse sopra il dettaglio della terapia;
>
>> - Terapia non somministrata: in questo caso l’icona assumerà il colore rosso. L’utente ha l’onere di indicare obbligatoriamente la motivazione della mancata somministrazione che sarà visibile nel piano di terapia;
>
>> - Terapia infusionale in corso: l’icona di evidenza sarà di colore arancione;
>
>> - Terapia sospesa: l’icona di evidenza sarà di colore grigio.
>
>L’applicativo fornisce la possibilità di segnalare l’avvenuta somministrazione della terapia in orari diversi rispetto a quelli dell’erogazione al paziente.
In particolare una terapia può essere indicata come somministrata secondo le seguenti modalità:
>
>> - somministrata all'ora di prescrizione, ma indicata dall'utente in orario successivo a quello di prescrizione. L'utente può inserire motivazione del ritardo (ad esempio se ha somministrato la terapia all'ora prevista ma per qualche impedimento non è riuscita a registrarla contemporaneamente);
>
>> - somministrata e indicata ad un orario successivo a quello prescritto. L'utente può inserire relativa motivazione (ad esempio se il paziente non è in reparto perché è stato sottoposto ad un esame).
In caso di errore ogni operazione può essere annullata solo dall'utente che l'ha eseguita. 
>
>Ogni operazione effettuata da parte dell’utente viene tracciata, con indicazione dell’ora a cui è stata eseguita.
Il sistema prevede, ad ogni somministrazione, il salvataggio in automatico:
>
>> - dell’operatore che effettua la somministrazione;
>
>> - data e ora di registrazione della somministrazione da parte dell’utente (diversi dalla data e ora di somministrazione che possono essere indicati dall’utente e che saranno a loro volta registrati dal sistema);
>
>> - farmaci effettivamente somministrati, relativamente alla prescrizione.
>
- M.E.T. e scheda Outreach
> All’interno della cartella è presente una funzionalità ad hoc per la compilazione da parte dei rianimatori del cartellino M.E.T. Il cartellino M.E.T. contiene una serie di informazioni da compilare, alcune opzionali e alcune obbligatorie,tra cui ad esempio:
>> - Dati anagrafici del paziente: cognome, nome, sesso, data nascita, età;
>> - Data ricovero;
>> - Numero cartella;
>> - Sede della chiamata: indicazione del reparto in cui il paziente è ricoverato giuridicamente ed assistenzialmente. Per i pazienti non ricoverati,  viene riportata l’informazione del luogo provenienza chiamata, il quale presente alcune opzioni di compilazioni, tra cui ad esempio: portineria, corridoio, laboratorio analisi, cappella, bar, radiologia;
>> - Tempi e composizione del cartellino M.E.T., dove sono riportati i seguenti campi:
>>> - Data di intervento;
>>> - Ora di chiamata;
>>> - Ora di arrivo M.E.T/inizio intervento;
>>> - Ora di rientro M.E.T/ fine intervento;
>>> - Durata missione;
>>> - Nome del medico;
>>> - Nome dell’infermiere;
>> - Presenti sul posto (campo a scelta multipla)
>> - Provenienza M.E.T.
>> - Procedura di chiamata corretta;
>> - Motivo della chiamata: viene riportato dal rianimatore il motivo per cui è stato chiamato a intervenire, alcune delle voci disponibili sono le seguenti:
>>> - Coma 
>>> - Ostruzioni vie aeree
>>> - valutazione pre/post operatoria
>>> - richiesta accesso venoso
>>> - sedazione per CVC
>>> - sedazione per PTCA
>>> - sedazione per lussazione
>>> - Altro, con in aggiunta un campo di testo libero.
>> - Interventi: riporta le attività effettuate prima e dopo l’arrivo del rianimatore presso la sede della chiamata.
>> - Evoluzione; 

>Se il paziente viene indicato come rivedibile, la scheda M.E.T. potrà essere rivalutata ogni volta che ci sarà un intervento programmato da parte dell’utente di rianimazione.

>Se l’utente rianimatore, durante la compilazione del cartellino M.E.T., indicherà come evoluzione ‘Inserito in Outreach C. Care’, oltre alla compilazione della scheda MET e del diario di competenza, sarà obbligato a compilare la scheda di Outreach.
> Tale scheda si compone delle seguenti informazioni:
>> - Reparto;
>> - cognome e nome del paziente;
>> - data nascita;
>> - data ricovero;
>> - diagnosi di ingresso;
>> - data entrata outreach;
>> - reclutamento: scelta fra reparto, dopo TI, trauma, altro con motivazione;
>> - patologia: respiratoria, renale, sepsi, cardiovascolare, metabolica e altro con motivazione;
>> - parametri SAPS II (riferito al peggior valore per ogni parametro delle ultime 24 ore):
>>> - età
>>> - FC
>>> - PAs
>>> - Temp
>>> - PaO2/FiO2
>>> - QU (tempo di quick)
>>> - Azotemia
>>> - Creatinina
>>> - GB
>>> - K+
>>> - Na+
>>> - HCO3 (bicarbonati da ega)
>>> - GCS Tot (link alla scala di Glasgow per la compilazione se non già presente)
>>> - Ammissione
>>> - Comorbidità;	
>> - Data uscita outreach;

>Al fine di agevolare la  visione delle attività per gli utenti della rianimazione, è presente una lista dedicata in modo da poter evincere le seguenti caratteristiche:
>> - quali pazienti sono stati indicati come CCOR;
>> - quali pazienti sono rivedibili
>> - quali pazienti hanno popolato un cartellino M.E.T.
>
- Gestione reparto ostetricia e neonatologia
>La cartella prevede la gestione dedicata del reparto di ostetricia e del reparto di neonatologia. 
>In particolare le peculiarità sono:

>**Madre**
>> - 36° settimana: raccolta di tutte le informazioni rilevanti la donna in gravidanza;
>> - Monitoraggio;
>> - Anamnesi: composta dalla parte specialistica di ostetrica e ginecologia;
>> - Triage ostestrico;
>> - Partogramma/Parto: attraverso il quale viene gestito tutto il percorso della paziente prima e durante il parto; Alcune informazioni peculiari inserite saranno importabili direttamente nella cartella neonatologica;
>> - Diario Ostetrico.

>**Figli**
>> - Parto;
>> - Esame obiettivo all’ingresso;
>> - Anamnesi familiare ostetrica della madre;
>> - Esame obiettivo all’uscita.

>Il sistema ONE.SYS prevede, attraverso una funzionalità dedicata, la possibilità di legare l’accesso ambulatoriale del percorso nascite con il ricovero per la nascita del neonato. Lo storico delle informazioni rilevate nella scheda del monitoraggio, compilata durante i singoli accessi a partire dalla 36 settimana, saranno disponibili in visualizzazione all’interno del percorso di cura.
>
- Chiusura Ricovero
>La sezione di chiusura del ricovero permette all'utente di compilare tutta la modulistica necessaria per concludere l'iter del paziente ricoverato; le principali funzionalità sono:
>
>> - inserimento lettera di dimissione;
>> - farmaci in primo ciclo (itg con la farmacia);
>> - inserimento lettera di trasferimento;
>> - lettera al curante (DH);
>> - lettera di primo ciclo (DH);
>> - stampe e schede di compilazione relative al decesso;
>> - collegamento al modulo ONE.SYS ADT per la compilazione della SDO;
>> - funzionalità di verifica della compilazione di tutti i moduli atti a costituire la cartella clinica;
>> - stampa globale della cartella clinica.
>
- I-Patient
> L’I-Patient rappresenta una visione d’insieme, completa ed essenziale dei dati sanitari del Dossier del paziente. L’obiettivo di I-Patient consiste nel fornire al clinico un cruscotto interattivo, volto alla consultazione degli elementi clinici ed amministrativi legati all'assistito, in modo sintetico e mirato alle necessità del singolo operatore. In questo modo, l’utente che accede all’I-Patient può consultare e navigare in un riassunto dinamico, che consente al clinico di inquadrare la situazione clinica del paziente in modo completo, senza dover navigare attraverso i vari moduli per reperire le informazioni necessarie.
 
> La soluzione prevede sezioni configurabili, che di default propongono:
>> - Lista Ricoveri;
>> - Lista DH;
>> - Accessi di PS;
>> - Dati Strutturati di Laboratorio;
>> - Cartelle Ambulatoriali;
>> - Visite Ambulatoriali;
>> - Patient Summary (se collegato con il modulo MMG/PLS);
>> - Piani Terapeutici compilati in azienda;
>> - Documenti del Paziente;
>> - Elenco Prestazioni Strumentali.

>Le sezioni sono dinamiche e permettono l’accesso ai dati elencati indirizzando l’utente direttamente sul modulo interessato (esempio: dalla lista dei ricoveri, in caso si abbiano le autorizzazioni corrette, l’utente può essere indirizzato sulla CCE del paziente, al fine di visualizzare il dato nella sua completezza).

> La visibilità di tutte queste informazioni è controllata tramite l’utilizzo di un algoritmo che effettua l’analisi dei dati in base ai consensi di visualizzazione concessi dal paziente ed al suo coinvolgimento nel percorso di cura del paziente. Questo assicura il corretto trattamento dei dati ed il corretto utilizzo interno all’Azienda, secondo le policy di visualizzazione governate dal trattamento dati e dai consensi correlati.


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

Il software necessita del coellgamento ad un'istanza di Oracle RDBMS versione 11.2.0.4 la cui installazione va eseguita seguendo le indicazioni del produttore.

L'esecuzione della webapp richiede i seguenti componenti che, risultando NON ridistribuibili ai termini della relativa licenza, non sono inclusi nel repository e vanno ottenuti seguendo le indicazioni del produttore:

|File di libreria|Fonte|
|-|-|
|CC-Viewer.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
|CCLib.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
|CrystalClear.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
|ElcoCore-W-CC-AIO-2.6.0.jar|https://www.elco.it/ |
|JBarcodeBean.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
|PDFOne.jar|https://www.gnostice.com/ (PDFOne) |
|Sero.jar|https://www.inetsoftware.de/ (Crystal Clear 8.2.X) |
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

1. Installare il sistema operativo che si intende utilizzare per la produzione (preferibile OracleLinux 7 (7.6)) con almeno 6 GB di RAM per Oracle e 4 GB di RAM per Tomcat);
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
