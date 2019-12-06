/**
 * User: matteopi
 * Date: 06/02/13
 * Time: 12.35
 */

var WindowCartella = null;
jQuery(document).ready(function(){

        window.WindowCartella = window;
        while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
            window.WindowCartella = window.WindowCartella.parent;
        }
        try{
            WindowCartella.utilMostraBoxAttesa(false);
        }catch(e)
        {/*catch nel caso non venga aperta dalla cartella*/}

        infoFace.init();
        infoFace.events();

        if (_STATO_PAGINA == 'L'){
            document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
        }

        try{
            if(!WindowCartella.ModalitaCartella.isStampabile(document)){
                document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
            }
        }
        catch(e){}
        try{
            if(!WindowCartella.ModalitaCartella.isStampabile(document)){
                document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
            }
        }
        catch(e){}
    }
);


var infoFace = {


    init:function(){

        //gestione delle textarea espandibili
        var maxLength = 4000;
        var msg = 'Attenzione: il testo inserito supera la lunghezza massima consentita.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?';
        $('textarea[name=txtDescrBreve],textarea[name=txtDiagnosiProv]').addClass("expand").attr("maxlength", String(maxLength)).blur(function(e) {
            maxlength(this, maxLength, msg);
        });
        $("textarea[class*=expand]").TextAreaExpander();
        //gestione dei popup di info
        $('#lblAbusoAlcoolDroghe,#lblAllucinazioni,#lblAltriCompAutoLes,#lblAnsFobAttPanic,#lblAttConc,#lblComportamentoAggressivo,#lblDanniFisiciVsAltri,#lblDeliri,#lblDisOrgIdeativa,#lblDisturbiSonno,#lblMemoria,#lblOssessioniEComp,#lblPreoccSomatiche,#lblProbAlim,#lblProbAlimHide,#lblRiduzAttiMotivInteress,#lblSconosciuta,#lblTendenzeSuicide,#lblTotale,#lblUmoreDepresso,#lblUmoreEuforico,#lblRischioAttuale,#lblLivelloAssistenza,#lblAttivita,#lblProva').addClass('labelClass').parent().removeClass('classTdLabelLink').addClass('tdClass classTdLabel').append($('<span></span>').addClass('Link'));
        //dimensioni colonne
        $('#lblDanniFisiciVsAltri, #lblDisOrgIdeativa, #lblMemoria').parent().css({'width':'500px','height':'auto'});
        $('#lblDescrBreve,#lblValutazione').parent().css({'width':'320px','height':'auto'});
        //disattivazione degli input text dei totali
        $('input[name=txtTotaleComportamento], [name=txtTotaleFunzCogn], [name=txtTotaleSalMentale]').attr('disabled',true);
        //nascosto il pulsante chiudi come in ogni altra scala
        $("#lblChiudi").parent().parent().hide();
        //nascosto il pulsante stampa in caso di sola lettura(personale infermieristico)
        if(WindowCartella.ModalitaCartella.isReadonly(document)){
            $("#lblregistra").parent().parent().hide();
        }

    },
    events:function(){

        if(WindowCartella.ModalitaCartella.isReadonly(document)){
            $("#lblregistra").parent().parent().hide();
        }
        //gestione dei pop  up di info
        $('.Link').live('click',function(){
            infoFace.open($(this).parent().find('label').attr('id'));
        });
        //gestione del calcolo del totale ad ogni cambiamento
        $('tr td').click(function(){
            var id =  $(this).closest('div').attr('id')
            if(id=='groupFace'){
                return;
            }else{
                switch (id){
                    case ('divComportamento'):
                        infoFace.radioTotal(id,"txtTotaleComportamento");
                        break;
                    case ('divFunzioniCong'):
                        infoFace.radioTotal(id,"txtTotaleFunzCogn");
                        break;
                    case('divSaluteMentale'):
                        infoFace.radioTotal(id,"txtTotaleSalMentale");
                        break;
                };

            }

        });

        infoFace.radioTotal("divComportamento","txtTotaleComportamento");
        infoFace.radioTotal("divFunzioniCong","txtTotaleFunzCogn");
        infoFace.radioTotal("divSaluteMentale","txtTotaleSalMentale");
        //valorizzare il date con il giorno attuale
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();

        if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = dd+'/'+mm+'/'+yyyy;
        $('#dateData').attr("value",today);

    },

    radioTotal:function(idDiv, nome_totale){

        var numberTotal = 0;
        $('#'+idDiv+' table tr').each(function(){
            $(this).find('input').each(function(i){
                if($(this).is(':checked')&& typeof i!= 'undefined'){
                    if(i>4){
                        i=4;
                    }
                    numberTotal = numberTotal +  i;
                }
            });
        });
        $('input[name='+nome_totale+']').val(numberTotal);

    },
    open:function(id){

        popupFace.remove();

        var paramObj = {
            obj:null,
            title:null,
            width:900,
            height:null
        };
        paramObj.vObj = $('<table  id=tableInfoFace></table>');

        switch(id){
            case 'lblDanniFisiciVsAltri':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(0) ASSENTE'))
                            .append($('<td></td>').text('(1) LIEVE'))
                            .append($('<td></td>').text('(2) MODERATO'))
                            .append($('<td></td>').text('(3) GRAVE'))
                            .append($('<td></td>').text('(4) MOLTO GRAVE'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('Non sono evidenti idee o comportamenti potenzialmente dannosi nei confronti di altre persone.'))
                            .append($('<td></td>').text('Occasionali idee di procurare lesioni ad altre persone ma nessun vero proposito di preparare o mettere in atto comportamenti lesivi.'))
                            .append($('<td></td>').text('Idee persistenti di aggredire/singoli tentativi di aggressione ma nessun serio proposito di provocare gravi danni (es. un singolo episodio di un pugno dato per rabbia).'))
                            .append($('<td></td>').text('Idee persistenti o frequenti di provocare gravi danni ad altre persone - propositi o atti ripetuti di aggressioni non gravemente dannosi.'))
                            .append($('<td></td>').text("Intenzione chiaramente espressa di commettere gravi atti lesivi come progettare un'aggressione o attuare un'aggressione con il chiaro proposito di provocare gravi lesioni o danni ad altre persone."))
                    )
                ;

                paramObj.title="Danni fisici verso altri (violenza, aggressione sessuale, incendio doloso, ecc))";
                break;
            /* non viene ancora utilizzato, in attesa di implementazione
             case 'lblRischioAttuale':
             $(paramObj.vObj).append(
             $('<tr></tr>')
             .append($('<td></td>').text('(0) NESSUN RISCHIO APPARENTE'))
             .append($('<td></td>').text('(1) RISCHIO APPARENTE LIEVE'))
             .append($('<td></td>').text('(2) RISCHIO APPARENTE SIGNIFICATIVO'))
             .append($('<td></td>').text('(3) RISCHIO APPARENTE GRAVE'))
             .append($('<td></td>').text('(4) RISCHIO APPARENTE GRAVE E IMMINENTE'))
             )
             .append(
             $('<tr></tr>')
             .append($('<td></td>').text('Nessuna storia o segno premonitore di rischio.'))
             .append($('<td></td>').text('Non vi sono attualmente elementi indicativi di rischio ma la storia del paziente o segni premoritori indicano un rischio probabile. il trattamento standard assicura la neccessaria vigilanza o controllo . Non sono previsti piani specifici o misure di prevenzione del rischio.'))
             .append($('<td></td>').text("La storia e le condizioni del paziente indicano la presenza di rischio e questo è considerato un problema importante. E' neccessario mettere a punto un piano specifico in aggiunta al progetto di trattamento."))
             .append($('<td></td>').text('Le circostanze sono tali da mettere a punto e attuare un piano di gestione del rischio.'))
             .append($('<td></td>').text("La storia e le condizioni del paziente indicano la presenza di rischio, ad esempio, il paziente prepara l'atto. Il piano di gestione del rischio ha la massima priorità"))
             )
             ;
             paramObj.title="RISCHIO ATTUALE";
             paramObj.height = 400;
             break; */
            case 'lblLivelloAssistenza':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(0) NESSUNO'))
                            .append($('<td></td>').text('(1) BASSO'))
                            .append($('<td></td>').text('(2) MEDIO'))
                            .append($('<td></td>').text('(3) ALTO'))
                            .append($('<td></td>').text('(4) MOLTO ALTO'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('Nessuna neccessità.'))
                            .append($('<td></td>').text("Un monitoraggio periodico nell'ambito dei normali contatti. In via precauzionale può essere utile un piano di gestionedel rischio."))
                            .append($('<td></td>').text("Neccessità di intervento(ad esempio deve essere messo in atto il piano di gestione del rischio, programma comportamentale."))
                            .append($('<td></td>').text('Intervento intensivo nel territorio(ad esempio trattamento domiciliare) o neccessità di assistenza in regime di ricovero ospedaliero.'))
                            .append($('<td></td>').text("Neccessità di ambiente ad alta protezione(ad esempio assistenza intendiva in reparto o speciale programma di assistenza/osservazione)."))
                    )
                ;
                paramObj.title="LIVELLO DI ASSISTENZA RICHIESTO PER GESTIRE IL COMPORTAMENTO";

                break;
            case 'lblComportamentoAggressivo':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(0) ASSENTE'))
                            .append($('<td></td>').text('(1) LIEVE'))
                            .append($('<td></td>').text('(2) MODERATO'))
                            .append($('<td></td>').text('(3) GRAVE'))
                            .append($('<td></td>').text('(4) MOLTO GRAVE'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('Non evidenti comportamenti aggressivi.'))
                            .append($('<td></td>').text("Reazioni transitorie di rabbia in situazioni frustranti, comportamenti offensivi."))
                            .append($('<td></td>').text("Costante irritabilità/occasionali minacce verbali, minacce o lievi danni alle cose sufficienti a determinare allarme negli altri."))
                            .append($('<td></td>').text('Comportamenti intimidatori/minacciosi, significativi danni alle cose con conseguente grave allarme negli altri.'))
                            .append($('<td></td>').text("Ostilità persistente/atteggiamento prepotente con minaccia di violenza fisica, gravi danni alle cose, causa grave allarme negli altri."))
                    )
                ;
                paramObj.title="COMPORTAMENTO AGGRESSIVO (danneggiare la proprietà altrui, essere verbalmente aggressivo, rissoso, minaccioso ecc, esclude i comportamenti codificati nel precedente item)";
                break;
            case 'lblTendenzeSuicide':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(0) ASSENTE'))
                            .append($('<td></td>').text('(1) LIEVE'))
                            .append($('<td></td>').text('(2) MODERATO'))
                            .append($('<td></td>').text('(3) GRAVE'))
                            .append($('<td></td>').text('(4) MOLTO GRAVE'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('Non sono evidenti comportamenti autolesivi o idee di suicidio.'))
                            .append($('<td></td>').text("Idee di suicidio non persistenti ma nessun presagio all'atto(esempio sporadicamente accenna di farla finita ma senza reali atti preparatori)."))
                            .append($('<td></td>').text("Idee di suicidio persistenti anche rispetto alla scelta del metodo ma nessun reale segnale di atti preparatori."))
                            .append($('<td></td>').text('Idee di suicidio persistenti con atti preparatori.'))
                            .append($('<td></td>').text("Tentativi recenti o chiari atti preparatori finalizzati al suicidio."))
                    )
                ;
                paramObj.title="TENDENZE SUICIDE (deve essere chiaramente evidente un'intenzione autolesiva per codificare come tentato omicidio)";
                break;
            case 'lblAltriCompAutoLes':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(0) ASSENTE'))
                            .append($('<td></td>').text('(1) LIEVE'))
                            .append($('<td></td>').text('(2) MODERATO'))
                            .append($('<td></td>').text('(3) GRAVE'))
                            .append($('<td></td>').text('(4) MOLTO GRAVE'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('Nessun comportamento autolesivo.'))
                            .append($('<td></td>').text("Comportamenti che suscitano preoccupazione ma con conseguenze lievi(graffiarsi o saltuarialmente ricorrere a purganti senza un'indicazione precisa)."))
                            .append($('<td></td>').text("Comportamenti con conseguenze significative sul piano fisico ma senza pericolo di vita(esempio lacerazioni, ustioni di primo grado, contusioni)."))
                            .append($('<td></td>').text('Comportamenti che possono determinare lesioni permanenti(cicatrici) o menomazioni.'))
                            .append($('<td></td>').text("Episioni di danno fisico grave con rischio di menomazione grave o di morte."))
                    )
                ;
                paramObj.title="ALTRI COMPORTAMENTI DELIBERATAMENTE AUTOLESIVI(esempio tagliarsi, bruciarsi, battere la testa, abusare di purganti ecc.)";
                break;
            case 'lblAbusoAlcoolDroghe':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(0) ASSENTE'))
                            .append($('<td></td>').text('(1) LIEVE'))
                            .append($('<td></td>').text('(2) MODERATO'))
                            .append($('<td></td>').text('(3) GRAVE'))
                            .append($('<td></td>').text('(4) MOLTO GRAVE'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('Bevitore adeguato rispetto alle norme sociali. Nessun uso di sostanze illegali.'))
                            .append($('<td></td>').text("Occasionali trasgressioni che non destano preoccupazione. Uso voluttuario di droghe leggere."))
                            .append($('<td></td>').text("Abuso di sostanze (Es. frequenti eccessi nel bere o assunzione di sostanze stupefacenti tali da creare preoccupazione). Al massimo causano la transitoria perdita di controllo."))
                            .append($('<td></td>').text('Consistente e massaccia assunzione e/o perdita di controllo causa di preoccupazionee condizionante il funzionamento quotidiano (esempio ubriachezza persistente, ricerca assidua di sostanze).'))
                            .append($('<td></td>').text("La vita quotidiana è dominata dai problemi derivanti l'assunzione delle sostanze(come procurarsi la droga, assunzione,astinenza, ecc )."))
                    )
                ;
                paramObj.title="ALTRI COMPORTAMENTI DELIBERATAMENTE AUTOLESIVI(esempio tagliarsi, bruciarsi, battere la testa, abusare di purganti ecc.)";
                break;

            case 'lblProbAlim':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(0) ASSENTE'))
                            .append($('<td></td>').text('(1) LIEVE'))
                            .append($('<td></td>').text('(2) MODERATO'))
                            .append($('<td></td>').text('(3) GRAVE'))
                            .append($('<td></td>').text('(4) MOLTO GRAVE'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('Nessun problema nel comportamento alimentare.'))
                            .append($('<td></td>').text("A volte eccesso o diminuzione della quantità di cibo giornaliera. Difficolatà nell'assumere il cibo in maniera adeguata o eccessiva, preoccupazione per la quantità di calorie asssunte."))
                            .append($('<td></td>').text('Evidenti problemi conseguenti a una marcata diminuzione dell'+"'"+'alimentazione. Preoccupazione di assumere troppe calorie e di aumentare di peso con episodi occasionali di "abbuffate", vomito provocato o uso improprio di lassativi.'))
                            .append($('<td></td>').text('Gravi problemi rilativi alla riduzione dell'+"'"+'assunzione di cibo o all'+"'"+'aumento del peso. Frequenti "abbuffate" e abusi di lassativi. Grave impatto sulla vita quotidiana.'))
                            .append($('<td></td>').text("I comportamenti determinati dalla preoccupazione per il proprio corpo e dall'alimentazione sono dominanti nella vita quotidiana e le relazioni sociali sono fortemente limitate."))
                    )
                ;
                paramObj.title="PROBLEMI ALIMENTARI";
                break;
            case 'lblAttivita':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(0) ASSENTE'))
                            .append($('<td></td>').text('(1) LIEVE'))
                            .append($('<td></td>').text('(2) MODERATO'))
                            .append($('<td></td>').text('(3) GRAVE'))
                            .append($('<td></td>').text('(4) MOLTO GRAVE'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('Il livello di attività è di entità abituale per la persona.'))
                            .append($('<td></td>').text("E' osservabile un aumento del livello di attività o manifestazioni di irrequitezza, agitazione o eccitamento. Tuttavia,l'iperattività, per quanto rilevabile, è mantenuta entro i limiti dell'ordinario(ad esempio può stare seduto stando ragionevolmente fermo durante l'intervista, l'iperattività non incide marcatamente con le iterazioni sociali o le attività)."))
                            .append($('<td></td>').text("Marcato aumento dell'attività che influenza le iterazioni e le attività quotidiane(ad esempio non riesce a star seduto fermo per un tempo abbastanza prolungato, frequentemente deve alzarsi per poi sedersi di nuovo; si impegna in più attività di quante è in grado di gestire)."))
                            .append($('<td></td>').text('Impatto grave sulle iterazioni e attività quaotidiane (ad esempio frequente andirivieni o irrequitezza, coinvolgimento in un livello di attività insostenibile, trova difficile portare a termine qualunque cosa). Difficile interagire con il soggetto a causa del livello di eccitamento/attività.'))
                            .append($('<td></td>').text("Costante ed eccessivo livello di attività. Irrequietezza estrema, agitazione o eccitamento che dominano le interazioni con gli altri. Incapace di impegnarsi o portare a termine le ordinarie attività quotidiane (ad esempio trascorre la maggior parte del giorno camminando avanti e indietro o in un permanente stato di agitazione)."))
                    )
                ;
                paramObj.title="ATTIVITA' (inclusa irrequietezza e agitazione)";
                break;
            case 'lblMemoria':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(0) ASSENTE'))
                            .append($('<td></td>').text('(1) LIEVE'))
                            .append($('<td></td>').text('(2) MODERATO'))
                            .append($('<td></td>').text('(3) GRAVE'))
                            .append($('<td></td>').text('(4) MOLTO GRAVE'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('Al massimo, occasionali errori(ad esempio occasionalmente dimentica dei nomi).'))
                            .append($('<td></td>').text("Lievi ma definite dimenticanze (esempio difficoltà a ricordare i nomi di conoscenti o eventi)."))
                            .append($('<td></td>').text("Dimenticanze marcate al punto che alcune attività sono compromesse (ad esempio non è sicuro di trovare oggetti o portare a compimento un piano di lavoro)."))
                            .append($('<td></td>').text('Dimenticanze persistenti che limitano estremamente sia la gamma di attività svolte in precedenza sia il funzionamento autonomo della persona(ad esempio in modo persistente smarrisce la strada, perde degli oggetti, si dimentica delle cose da fare). Non è adeguatamente orientato in almeno una delle tre dimensioni:tempo, spazio e persona.'))
                            .append($('<td></td>').text("Deficit della memoria molto esteso. Incapacità di ricordare eventi passati e/o recenti o riconoscere persone familiari in misura invalidante, cioè tale da avere un livello di autonomia minimo (ad esempio grave disorientamento nello spazione, nel tempo e sulla persona)."))
                    )
                ;
                paramObj.title="MEMORIA";
                break;
            case 'lblAttConc':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(0) ASSENTE'))
                            .append($('<td></td>').text('(1) LIEVE'))
                            .append($('<td></td>').text('(2) MODERATO'))
                            .append($('<td></td>').text('(3) GRAVE'))
                            .append($('<td></td>').text('(4) MOLTO GRAVE'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('Non sono evidenti problemi di attenzione o concentrazione.'))
                            .append($('<td></td>').text("Riesce a seguire conversazioni o programmi TV ma si distrae facilmente."))
                            .append($('<td></td>').text("Trova difficile seguire conversazionio conversazioni TV anche solo per un paio di minuti."))
                            .append($('<td></td>').text('Frequente distraibilità. Non riesce a seguire conversazioni o programmi TV.'))
                            .append($('<td></td>').text("Non riesce a prestare attenzione ad esempio non è in grado di formulare o rispondere a domande."))
                    )
                ;
                paramObj.title="ATTENZIONE/CONCENTRAZIONE";
                break;
            case 'lblDisOrgIdeativa':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(0) ASSENTE'))
                            .append($('<td></td>').text('(1) LIEVE'))
                            .append($('<td></td>').text('(2) MODERATO'))
                            .append($('<td></td>').text('(3) GRAVE'))
                            .append($('<td></td>').text('(4) MOLTO GRAVE'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('Nessun problema di disorganizzazione ideativa.'))
                            .append($('<td></td>').text("Occasionali anomalie del linguaggio o nel modo di ragionare(esempio lieve fuga delle idee o allentamento dei nessi associativi con minimo impatto sulle capacità di comunicazione)."))
                            .append($('<td></td>').text("Marcati disturbi nei modi di parlare e di ragionare che interferiscono nettamente sulla capacità di comunicazione."))
                            .append($('<td></td>').text('Modo di parlare o di ragionare così disturbato da limitare la capacità di comunicare e di svolgere le normali attività quotidiane.'))
                            .append($('<td></td>').text("Il linguaggio e la capacità di ragionare sono tanti disturbati da provocare una grave disabilità."))
                    )
                ;
                paramObj.title="DISORGANIZZAZIONE IDEATIVA";
                break;
            case 'lblDeliri':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(0) ASSENTE'))
                            .append($('<td></td>').text('(1) LIEVE'))
                            .append($('<td></td>').text('(2) MODERATO'))
                            .append($('<td></td>').text('(3) GRAVE'))
                            .append($('<td></td>').text('(4) MOLTO GRAVE'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('Nessuna evidenza di convinzioni deliranti.'))
                            .append($('<td></td>').text("Sono presenti deliri ma non sono chiaramente evidenti nel comportamento quotidinao e/o negli atteggiamenti assunti."))
                            .append($('<td></td>').text("Le convinzioni deliranti sono evidenti nel comportamento quotidiano e/o negli atteggiamenti assunti ma hanno un impatto limitato ad aree circoscritte di attività e/o a particolari atteggiamenti."))
                            .append($('<td></td>').text("Le convinzioni deliranti condizionano la maggior parte del comportamento quotidiano, influenzano la programmazione delle attività, l'atteggiamento generale e la modalità di comunicare."))
                            .append($('<td></td>').text("Il comportamento è completamente condizionato dalle convinzioni deliranti."))
                    )
                ;
                paramObj.title="DELIRI(esclude deliri di colpa o ipocondriaci)";
                break;
            case 'lblAllucinazioni':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(0) ASSENTE'))
                            .append($('<td></td>').text('(1) LIEVE'))
                            .append($('<td></td>').text('(2) MODERATO'))
                            .append($('<td></td>').text('(3) GRAVE'))
                            .append($('<td></td>').text('(4) MOLTO GRAVE'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text("Nessuna evidenza di allucinazioni."))
                            .append($('<td></td>').text("Sono presenti allucinazioni uditive o visive ma causano al massimo un lieve disagio con conseguenze limitate sul comportamento."))
                            .append($('<td></td>').text("E' presente una qualche consapevolezza ma le allucinazioni interferiscono sul funzionamento quotidiano in modo significativo."))
                            .append($('<td></td>').text("La Consapevolezza è molto limitata, le allucinazioni continue e la reazione ad esse determinano un impatto importante sul funzionamento quotidiano."))
                            .append($('<td></td>').text("Le allucinazioni e le loro conseguenze ad esse condizionano completamente l'attività mentale e il funzionamento quotidiano: non è presente alcuna consapevolezza."))
                    )
                ;
                paramObj.title="ALLUCINAZIONI";
                break;
            case 'lblUmoreEuforico':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(0) ASSENTE'))
                            .append($('<td></td>').text('(1) LIEVE'))
                            .append($('<td></td>').text('(2) MODERATO'))
                            .append($('<td></td>').text('(3) GRAVE'))
                            .append($('<td></td>').text('(4) MOLTO GRAVE'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text("Nessuna evidenza di umore/ideazione euforica."))
                            .append($('<td></td>').text("Tono dell'umore elevato o euforia di intensità e frequenza insufficenti a produrre alterazioni comportamentali."))
                            .append($('<td></td>').text("Tono dell'umore elevato o euforia visibilmente insolita per le persone che gli stanno intorno e con significativo impatto sui ritmi della vita quotidiana. Il soggetto è coinvolto in idee o progetti esageratamente ottimistici grandiosi riguardanti la sua persona."))
                            .append($('<td></td>').text("Umore elevato oeuforia che causa una grave compromissione del funzionamento sociale e/o lavorativo. Il soggetto è coinvolto in idee o progetti esaltati e grandiosi rigurdanti la sua persona."))
                            .append($('<td></td>').text("Umore elevato o euforia domina il comportamento causando completa compromissione del funzionamento sociale e/o lavorativo. Idee e progetti assolutamente esagerati Grandiosità."))
                    )
                ;
                paramObj.title="UMORE EUFORICO";
                break;
            case 'lblUmoreDepresso':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(0) ASSENTE'))
                            .append($('<td></td>').text('(1) LIEVE'))
                            .append($('<td></td>').text('(2) MODERATO'))
                            .append($('<td></td>').text('(3) GRAVE'))
                            .append($('<td></td>').text('(4) MOLTO GRAVE'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text("Nessun problema di umore depresso; al massimo occasionale tristezza o umore deflesso."))
                            .append($('<td></td>').text("L'abbassamento dell'umore non è persistente ma pervade molti aspetti dell'attività quotidiana. Bassa stima di sè."))
                            .append($('<td></td>').text("L'umore chiaramente depresso è presente per la maggior parte del tempo, talvolta con pianto e interferisce in modo significato sul funzionamento quotidiano. Idee di colpa, autoaccusa e svalutazione."))
                            .append($('<td></td>').text("L'umore depresso è presente in maniera continuativa; spesso facilità al pianto; persistono idee di colpa, autoaccusa e disperazione; limitate capacità di affrontare la vita quotidiana. Marcati sentimenti di inferiorità."))
                            .append($('<td></td>').text("Il funzionamento normale è seriamente limitato per la gravità del disturbo dell'umore oppure il funzionamento è condizionato da forti idee di colpa, autoaccusa e disperazione."))
                    )
                ;
                paramObj.title="UMORE DEPRESSO";
                break;
            case 'lblOssessioniEComp':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(0) ASSENTE'))
                            .append($('<td></td>').text('(1) LIEVE'))
                            .append($('<td></td>').text('(2) MODERATO'))
                            .append($('<td></td>').text('(3) GRAVE'))
                            .append($('<td></td>').text('(4) MOLTO GRAVE'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text("Nessun problema di tipo ossessivo e compulsivo."))
                            .append($('<td></td>').text("Presenza di idee ossessive intrusive e/o necessità di mettere in pratica circoscritti comportamenti compulsivi. Non vi è comunque, un condizionamento apprezzabile sul comportamento del soggetto nella vita quotidiana."))
                            .append($('<td></td>').text("Le idee ossessive e/o i comportamenti compulsivi  hanno un significativo impatto sull'attività, sul funzionamento sociale e/o lavorativo a causa del disagio ad essi collegato o a causa della frequenza dei comportamenti o di entrambi i fattori."))
                            .append($('<td></td>').text("Le ossessioni e i comportamenti compulsivi causano una grave compromissione del funzionamento sociale e lavorativo e/o sono causa frequente di grave disagio."))
                            .append($('<td></td>').text("Il funzionamento quotidiano è condizionato totalmente e in modo costante da continue idee ossessive e/o da comportamenti compulsivi persistenti e ripetitivi; la costanza di tali disturbi crea livelli di disagio tali da causare seia disabilità."))
                    )
                ;
                paramObj.title="OSSESSIONE E COMPULSIONI (valutare sulla base della frequenza e della intensità delle ossessioni e compulsioni non sul livello di ansia associato e valutato altrove).";
                break;
            case 'lblAnsFobAttPanic':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(0) ASSENTE'))
                            .append($('<td></td>').text('(1) LIEVE'))
                            .append($('<td></td>').text('(2) MODERATO'))
                            .append($('<td></td>').text('(3) GRAVE'))
                            .append($('<td></td>').text('(4) MOLTO GRAVE'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text("Nessun problema di ansia, fobie o attacchi di panico."))
                            .append($('<td></td>').text("Periodi trasitori di preoccupazione, sensazione di tensione, paura. Occasionalmente condotte di evitamento ma senza ripercussioni comportamentali."))
                            .append($('<td></td>').text("Persistenti preoccupazioni, paure e tensioni di intensità tali da condizionare le attività quotidiane esempio evitamento regolare di determinate situazioni o luoghi."))
                            .append($('<td></td>').text("Continue e ripetitive esperienze di intensa preoccupazione, paure e tensioni."))
                            .append($('<td></td>').text("Lo stato mentale è dominato da uno stato di ansia molto intensa. Il comportamento ne è condizionato al punto di rendere il paziente incapace di svolgere le normali attività quotidiane."))
                    )
                ;
                paramObj.title="ANSIA, FOBIE E ATTACCHI DI PANICO.";
                break;
            case 'lblPreoccSomatiche':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(0) ASSENTE'))
                            .append($('<td></td>').text('(1) LIEVE'))
                            .append($('<td></td>').text('(2) MODERATO'))
                            .append($('<td></td>').text('(3) GRAVE'))
                            .append($('<td></td>').text('(4) MOLTO GRAVE'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text("Non sono evidenti problemi legati a preoccupazioni somatiche."))
                            .append($('<td></td>').text("Preoccupazioni per il proprio stato fisico in assenza di evidenti e giustificabili cause, ma con conseguenze comportamentali minime, ad esempio non cerca la rassicurazione dei medici."))
                            .append($('<td></td>').text("Persistenti preoccupazioni per il proprio stato fisico in assenza di evidenti e giustifabili cause, che inducono a richiedere accertamenti clinici e rassicurazioni dei medici."))
                            .append($('<td></td>').text("Continue rimuginazioni sulla propria condizione fisica. I comportamenti conseguenti incidono sulle normali attività quotidiane(per esempio richieste frequenti di accertamenti clinici)."))
                            .append($('<td></td>').text("Rimuginazioni con convinzioni di avere una malattia incurabile, non sensibili ad alcuna rassicurazione, nonostante l'assenza di alcun riscontro organico in tal senso, in misura tale da causare disabilità."))
                    )
                ;
                paramObj.title="PREOCCUPAZIONI SOMATICHE(include i deliri ipocondriaci).";
                break;
            case 'lblRiduzAttiMotivInteress':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(0) ASSENTE'))
                            .append($('<td></td>').text('(1) LIEVE'))
                            .append($('<td></td>').text('(2) MODERATO'))
                            .append($('<td></td>').text('(3) GRAVE'))
                            .append($('<td></td>').text('(4) MOLTO GRAVE'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text("Energia, motivazione e interessi a livello usuale per la persona."))
                            .append($('<td></td>').text("Viene riferita una chiara riduzione degli interessi o dell'energia(ad esempio diminuito interesse nelle attivitào ridotta gratificazione da esse), ma l'impatto osservabile sul livello di attività è trascurabile."))
                            .append($('<td></td>').text("Perdita di interesse o di energia che provoca una marcata riduzione dell'attività. può essere ancora presente una certa gratificazione ricavabile dalle attivià in cui si impegna."))
                            .append($('<td></td>').text("Grave restrizione delle attività quotidiane che deriva da una mancanza di energia o interesse. Gratificazione estremamente limitata nelle attività solitamente piacevoli (ad esempio sembra provare scarso piacere del cibo, sesso e interessi quotidiani)."))
                            .append($('<td></td>').text("Attività quotidine ridotte al minimo. Riferisce di non avere nessun interesse, energia o gratificazione dall'intraprendere tali attività."))
                    )
                ;
                paramObj.title="RIDUZIONE DELL'ATTIVITA', MOTIVAZIONE E INTERESSI.";
                break;
            case 'lblDisturbiSonno':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(0) ASSENTE'))
                            .append($('<td></td>').text('(1) LIEVE'))
                            .append($('<td></td>').text('(2) MODERATO'))
                            .append($('<td></td>').text('(3) GRAVE'))
                            .append($('<td></td>').text('(4) MOLTO GRAVE'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text("Nessun disturbo del sonno."))
                            .append($('<td></td>').text("Difficoltà nell'addormentamento, nel rimanere addormentati, e/o eccesso di sonno. Al massimo influenza transitoria sul funzionamento sociale e lavorativo."))
                            .append($('<td></td>').text("Difficoltà nell'addormentamento, nel rimanere addormentati oppure nell'eccesso di sonno che provocano una riduzione del funzionamento sociale e/o una persistente condizione di disagio."))
                            .append($('<td></td>').text("I disturbi del sonno sono causati da un grave disagio e/o notevole disturbo del funzionamento sociale e lavorativo."))
                            .append($('<td></td>').text("Difficoltà nel sonno con grave disagio del paziente e grave limitazione delle capacità di affrontare le normali attività quotidiane."))
                    )
                ;
                paramObj.title="DISTURBI DEL SONNO.";
                break;
        }


        popupFace.append({
            obj:paramObj.vObj,
            title:paramObj.title,
            width:paramObj.width,
            height:paramObj.height
        });


    }

};


var popupFace = {

    append:function(pParam){

        popupFace.remove();


        pParam.header = (typeof pParam.header != 'undefined' 	? pParam.header : null);
        pParam.footer = (typeof pParam.footer != 'undefined' 	? pParam.footer : null);
        pParam.title = 	(typeof pParam.title != 'undefined' 	? pParam.title 	: "");
        pParam.width = 	(typeof pParam.width != 'undefined' 	? pParam.width 	: 500);
        pParam.height = (typeof pParam.height != 'undefined' 	? pParam.height : 300);


        $('body').append(
            $('<div id="divPopUpInfoFace"></div>')
                .css("font-size","12px")
                .append(pParam.header)
                .append(pParam.obj)
                .append(pParam.footer)
                .attr("title",pParam.title)
        );

        $('#divPopUpInfoFace').dialog({
            position:	[event.clientX,event.clientY],
            width:		pParam.width,
            height:		pParam.height
        });

        popupFace.setRemoveEvents();

    },

    remove:function(){
        $('#divPopUpInfoFace').remove();
    },

    setRemoveEvents:function(){
        $("body").click(popupFace.remove);
    }

};

