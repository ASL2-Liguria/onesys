var WindowCartella = null;

jQuery(document).ready(function() {
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }

    try {
        WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {
        /*catch nel caso non venga aperta dalla cartella*/
    }

    $('#lblAlternareAppoggioPiedi,#lblAvanti90DaEretta,#lblDaErettaASeduta,#lblDaSedutaAEretta,#lblErettaOcchiChiusi,#lblErettaPiediTandem,#lblErettaPiediUniti,#lblInPiediSenzaAppoggio,#lblInPiediSuPiede,#lblRaccogliere,#lblRuotareTroncoDaEretta,#lblRuotare360,#lblSedutiSenzaAppoggio,#lblTrasferimentiLettoSedia').addClass('labelClass').parent().removeClass('classTdLabelLink').addClass('tdClass classTdLabel').append($('<div></div>').addClass('Link'));
    infoBBS.init();

    if (document.EXTERN.BISOGNO.value == 'N') {
        document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
    }

    if (_STATO_PAGINA == 'L') {
    	document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
        document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
    }

    try {
        if (!WindowCartella.ModalitaCartella.isStampabile(document)) {
            document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
        }
    } catch (e) {
    }

    try {
        if (!WindowCartella.ModalitaCartella.isStampabile(document)) {
            document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
        }
    } catch (e) {
    }

    $('#groupBBS .classDataEntryTable tbody tr td:first').css('width', '550px');
    $('#groupBBS .classDataEntryTable tbody tr:last-child td:last-child').css('width', '550px');
});

var count;
var click;
function countChecked() {
    count = 0;
    click = 'N';

    sommaBBS(document.all.chkAlternareAppoggioPiedi);
    sommaBBS(document.all.chkAvanti90DaEretta);
    sommaBBS(document.all.chkDaErettaASeduta);
    sommaBBS(document.all.chkDaSedutaAEretta);
    sommaBBS(document.all.chkErettaOcchiChiusi);
    sommaBBS(document.all.chkErettaPiediTandem);
    sommaBBS(document.all.chkErettaPiediUniti);
    sommaBBS(document.all.chkInPiediSenzaAppoggio);
    sommaBBS(document.all.chkInPiediSuPiede);
    sommaBBS(document.all.chkRaccogliere);
    sommaBBS(document.all.chkRuotareTroncoDaEretta);
    sommaBBS(document.all.chkRuotare360);
    sommaBBS(document.all.chkSedutiSenzaAppoggio);
    sommaBBS(document.all.chkTrasferimentiLettoSedia);

    if (click == 'S' || count > 0) {
        document.all.txtScoreTotale.value = count;
        document.all.txtScoreTotale.disabled = true;
    }
}

function sommaBBS(radio) {
    for (i = 0; i < radio.length; i++) {
        if (radio[i].checked) {
            click = 'S';
            if (i == '0')
                count += 4;
            else if (i == '1')
                count += 3;
            else if (i == '2')
                count += 2;
            else if (i == '3')
                count += 1;
        }
    }
}

function chiudiBBS() {
    try {
        var opener = window.dialogArguments;

        var query = "select to_char(data_ultima_modifica,'DD/MM/YYYY') DATA_ULTIMA_MODIFICA from radsql.cc_scale where key_legame='SCALA_BBS' and iden_visita=" + document.EXTERN.IDEN_VISITA.value;
        query += "@DATA_ULTIMA_MODIFICA";
        query += "@1";
        dwr.engine.setAsync(false);
        CJsUpdate.select(query, gestDati);
        dwr.engine.setAsync(true);

    } catch (e) {}
}

function gestDati(dati) {
    var array_dati = null;
    try {
        var opener = window.dialogArguments;
        array_dati = dati.split('@');
        if (array_dati[0] != "$$$$$") {
            opener.document.getElementById('txtDataBBS').value = array_dati[0];
            opener.document.getElementById('txtEsitoBBS').value = document.getElementById('txtTotale').value;
        }
    } catch (e) {}
}

var infoBBS = {
    init: function() {
        $('.Link').live('click', function() {
            infoBBS.open($(this).parent().find('label').attr('id'));
        });
        
        NS_FUNCTIONS.moveLeftField({name: 'txtAusili', width: '100%', space: '&nbsp;&nbsp;&nbsp;'});
        
        var arrValue = [];
        $('select[name="chkAusili"] option').filter(function(){
        	return $.trim($(this).text()).match(/(specificare)/ig);
        }).each(function(){
        	arrValue.push($(this).val());
        });
        
        var callback = {
        	'function': function() {
        		if (this.id == 'txtAusili') NS_FUNCTIONS.setCampoStato('txtAusili','lblAusili', this.enable ? 'O' : 'E');
        	},
        	'arguments': null,
        	'scope': null
        };
        
        NS_FUNCTIONS.enableDisable($('select[name="chkAusili"]'), arrValue, ['txtAusili'], false, callback);
        $('select[name="chkAusili"]').change(function() {
        	NS_FUNCTIONS.enableDisable($('select[name="chkAusili"]'), arrValue, ['txtAusili'], true, callback);	
        });
    },
    open: function(id) {
        popupBBS.remove();

        var paramObj = {
            obj: null,
            title: null,
            width: 900,
            height: 300
        };

        paramObj.vObj = $('<table id=tableInfoBBS></table>')
                ;
        switch (id) {
            case 'lblDaSedutaAEretta':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(4)'))
                        .append($('<td style="width: 20%;"></td>').text('(3)'))
                        .append($('<td style="width: 20%;"></td>').text('(2)'))
                        .append($('<td style="width: 20%;"></td>').text('(1)'))
                        .append($('<td style="width: 20%;"></td>').text('(0)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('E\' capace di alzarsi senza usare le mani e di stabilizzarsi nella nuova postura senza aiuto.'))
                                .append($('<td style="vertical-align: top;"></td>').text('E\' capace di sollevarsi da solo ma utilizzando le mani, al primo tentativo.'))
                                .append($('<td style="vertical-align: top;"></td>').text('E\' capace di sollevarsi aiutandosi con le mani ma solo dopo alcuni tentativi.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di minima assistenza per alzarsi dalla sedia o stabilizzare la nuova postura.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Ha bisogno di moderata o completa assistenza per alzarsi dalla sedia.'))
                                );
                paramObj.title = "Passaggio dalla stazione eretta a quella seduta: \"Si alzi e cerchi di non usare le mani come oppoggio\".";
                break;
            case 'lblInPiediSenzaAppoggio':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(4)'))
                        .append($('<td style="width: 20%;"></td>').text('(3)'))
                        .append($('<td style="width: 20%;"></td>').text('(2)'))
                        .append($('<td style="width: 20%;"></td>').text('(1)'))
                        .append($('<td style="width: 20%;"></td>').text('(0)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('E\' in grado di stare in  piedi con sicurezza per due minuti.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Può mantenere la stazione eretta per due minuti ma con la sorveglianza di una persona.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Sta in piedi per 30 secondi senza appoggio.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di molti tentativi per stare in piedi per 30 secondi senza appoggio.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Incapace di stare in piedi per 30 secondi senza assistenza.'))
                                );
                paramObj.title = "Stare in piedi senza appoggio: \"Stia in piedi senza appoggiarsi per due minuti\".";
                break;                
            case 'lblSedutiSenzaAppoggio':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(4)'))
                        .append($('<td style="width: 20%;"></td>').text('(3)'))
                        .append($('<td style="width: 20%;"></td>').text('(2)'))
                        .append($('<td style="width: 20%;"></td>').text('(1)'))
                        .append($('<td style="width: 20%;"></td>').text('(0)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Può stare seduto senza appoggio e con sicurezza per due minuti.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Può stare seduto per due minuti ma con la sorveglianza di una persona.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Può stare seduto per 30 secondi.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Può stare seduto per 10 secondi.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Incapace di stare seduto senza appoggio per 10 secondi.'))
                                );
                paramObj.title = "Stare seduti senza appoggio allo schienale ma con i piedi appoggiati sul pavimento o su un panchetto o sgabello: \"Stia seduto senza appoggiare la schiena e con le braccia incrociate per 2 minuti\".";
                break;
            case 'lblDaErettaASeduta':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(4)'))
                        .append($('<td style="width: 20%;"></td>').text('(3)'))
                        .append($('<td style="width: 20%;"></td>').text('(2)'))
                        .append($('<td style="width: 20%;"></td>').text('(1)'))
                        .append($('<td style="width: 20%;"></td>').text('(0)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Può sedersi senza pericolo e con minimo uso delle mani.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Controlla la discesa usando le mani.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Appoggia la parte posteriore delle gambe alla sedia per controllare la discesa.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Si siede da solo ma non controlla la discesa.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di assistenza per sedersi.'))
                                );
                paramObj.title = "Passaggio dalla posizione eretta alla posizione seduta: \"Si sieda\".";
                break;
            case 'lblTrasferimentiLettoSedia':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(4)'))
                        .append($('<td style="width: 20%;"></td>').text('(3)'))
                        .append($('<td style="width: 20%;"></td>').text('(2)'))
                        .append($('<td style="width: 20%;"></td>').text('(1)'))
                        .append($('<td style="width: 20%;"></td>').text('(0)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Può trasferirsi con sicurezza con minimo uso delle mani.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Può trasferirsi con sicurezza con evidente uso delle mani.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Può trasferirsi solo con suggerimenti verbali e/o sorveglianza di una persona.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di assistenza di una persona.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di due persone che lo assistano o lo sorveglino per essere sicuro.'))
                                );
                paramObj.title = "Trasferimenti letto-sedia: \"Si sposti da una sedia al letto e viceversa: prima utilizzando una sedia con braccioli, poi una sedia senza braccioli\".";
                break;
            case 'lblErettaOcchiChiusi':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(4)'))
                        .append($('<td style="width: 20%;"></td>').text('(3)'))
                        .append($('<td style="width: 20%;"></td>').text('(2)'))
                        .append($('<td style="width: 20%;"></td>').text('(1)'))
                        .append($('<td style="width: 20%;"></td>').text('(0)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Riesce a eseguire con sicurezza.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Riesce a eseguire con la sorveglianza di una persona.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Riesce ad eseguire per 3 secondi.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Incapace di tenere gli occhi chiusi per 3 secondi, ma sta in piedi stabilmente.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di aiuto per non cadere.'))
                                );
                paramObj.title = "Stazione eretta a occhi chiusi: \"Stia in piedi con gli occhi chiusi e fermo per 10 secondi\".";
                break;
            case 'lblErettaPiediUniti':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(4)'))
                        .append($('<td style="width: 20%;"></td>').text('(3)'))
                        .append($('<td style="width: 20%;"></td>').text('(2)'))
                        .append($('<td style="width: 20%;"></td>').text('(1)'))
                        .append($('<td style="width: 20%;"></td>').text('(0)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('E\' capace di unire i piedi da solo e di stare in piedi per 1 minuto con sicurezza.'))
                                .append($('<td style="vertical-align: top;"></td>').text('E\' capace di unire i piedi da solo e di stare in piedi per 1 minuto con sicurezza con la sorveglianza di una persona.'))
                                .append($('<td style="vertical-align: top;"></td>').text('E\' capace di unire i piedi da solo, ma non riesce a mantenerli uniti per 30 secondi.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Ha bisogno di aiuto per raggiungere questa posizione, ma la può mantenere per 15 secondi.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Ha bisogno di aiuto per raggiungere questa posizione e non è in grado di mantenerla per 15 secondi.'))
                                );
                paramObj.title = "Stazione eretta a piedi uniti: \"Stia in piedi con i piedi uniti e senza appoggio\".";
                break;
            case 'lblAvanti90DaEretta':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(4)'))
                        .append($('<td style="width: 20%;"></td>').text('(3)'))
                        .append($('<td style="width: 20%;"></td>').text('(2)'))
                        .append($('<td style="width: 20%;"></td>').text('(1)'))
                        .append($('<td style="width: 20%;"></td>').text('(0)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Può spingersi in avanti con sicurezza per più di 25 cm.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Per più di 12.5 cm con sicurezza.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Per più di 5 cm con sicurezza.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Si spinge in avanti ma necessita di sorveglianza.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Perde l\'equilibrio o necessita di sostegno per evitare la caduta.'))
                                );
                paramObj.title = "Inclinarsi in avanti a braccia flesse a 90°, partendo dalla posizione eretta: \"Si inclini in avanti il più possibile, con le braccia flesse a 90° e le dita estese\".";
                break;
            case 'lblRaccogliere':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(4)'))
                        .append($('<td style="width: 20%;"></td>').text('(3)'))
                        .append($('<td style="width: 20%;"></td>').text('(2)'))
                        .append($('<td style="width: 20%;"></td>').text('(1)'))
                        .append($('<td style="width: 20%;"></td>').text('(0)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Può raccogliere l\'oggetto facilmente e con sicurezza.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Può raccoglierlo, ma necessita della sorveglianza di una persona.'))
                                .append($('<td style="vertical-align: top;"></td>').text('E\' incapace di raccoglierlo ma giunge sino a 2-5 cm da esso e può mantenersi in equilibrio da solo.'))
                                .append($('<td style="vertical-align: top;"></td>').text('E\' incapace di raccogliere l\'oggetto e necessita di sorveglianza durante i tentativi.'))
                                .append($('<td style="vertical-align: top;"></td>').text('E\' incapace di provare o necessita di assistenza per non perdere l\'equilibrio o cadere.'))
                                );
                paramObj.title = "Raccogliere da terra un oggetto posizionato davanti ai piedi del soggetto.";
                break;
            case 'lblRuotareTroncoDaEretta':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(4)'))
                        .append($('<td style="width: 20%;"></td>').text('(3)'))
                        .append($('<td style="width: 20%;"></td>').text('(2)'))
                        .append($('<td style="width: 20%;"></td>').text('(1)'))
                        .append($('<td style="width: 20%;"></td>').text('(0)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Riesce a guardare indietro da entrambe le parti e sposta bene il peso del corpo.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Riesce a guardare indietro da un lato solo; dal lato opposto sposta meno il peso del corpo.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Riesce a guardare solo di lato, ma mantiene l\'equilibrio.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di sorveglianza quando si gira.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di assistenza per evitare di perdere l\'equilibrio o cadere.'))
                                );
                paramObj.title = "Girarsi guardando dietro la spalla destra e quella sinistra, durante la stazione eretta: \"Giri il capo cercando di guardare direttamente dietro di sé, prima a destra e poi a sinistra\".";
                break;
            case 'lblRuotare360':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(4)'))
                        .append($('<td style="width: 20%;"></td>').text('(3)'))
                        .append($('<td style="width: 20%;"></td>').text('(2)'))
                        .append($('<td style="width: 20%;"></td>').text('(1)'))
                        .append($('<td style="width: 20%;"></td>').text('(0)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Riesce a ruotare completamente in entrambe le direzioni con sicurezza in 4 secondi o meno.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Riesce a ruotare completamente con sicurezza in una sola direzione in 4 secondi o meno.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Riesce a ruotare completamente con sicurezza ma lentamente.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di sorveglianza di una persona o di suggerimenti verbali.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di assistenza mentre ruota.'))
                                );
                paramObj.title = "Ruotare di 360° gradi: \"Ruoti su se stesso completamente, stando sul posto\" dopo una pausa: \"ripeta la rotazione nella direzione opposta\".";
                break;
            case 'lblAlternareAppoggioPiedi':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(4)'))
                        .append($('<td style="width: 20%;"></td>').text('(3)'))
                        .append($('<td style="width: 20%;"></td>').text('(2)'))
                        .append($('<td style="width: 20%;"></td>').text('(1)'))
                        .append($('<td style="width: 20%;"></td>').text('(0)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Riesce a stare in piedi da solo e con sicurezza e a completare 8 movimenti in 20 secondi.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Riesce a stare in piedi da solo e con sicurezza e a completare 8 movimenti, ma impiega più di 20 secondi.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Riesce a eseguire 4 movimenti senza aiuto ma con sorveglianza.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Riesce a eseguire più di 2 movimenti e necessita di minima assistenza.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Ha bisogno di assistenza per non cadere o non riesce a eseguire.'))
                                );
                paramObj.title = "Appoggiare alternativamente i piedi su un gradino (o su un panchetto) mentre si rimane in stazione eretta senza appoggio: \"Metta ciascun piede alternativamente per 4 volte sul gradino o sul panchetto\".";
                break;
            case 'lblErettaPiediTandem':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(4)'))
                        .append($('<td style="width: 20%;"></td>').text('(3)'))
                        .append($('<td style="width: 20%;"></td>').text('(2)'))
                        .append($('<td style="width: 20%;"></td>').text('(1)'))
                        .append($('<td style="width: 20%;"></td>').text('(0)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Riesce a mettere da solo i due piedi in tandem e mantiene la posizione per 30 secondi.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Riesce a mettere i piedi uno davanti all\'altro (non in tandem) e mentiene questa posizione per 30 secondi.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Riesce a effettuare da solo un piccolo passo e mentiene per 30 secondi questa posizione.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Necessita di aiuto per effettuare il passo ma può tenere la posizione per 15 secondi.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Perde l\'equilibrio mentre esegue il passo o mentre sta in piedi.'))
                                );
                paramObj.title = "Stazione eretta con i piedi in tandem: \"Metta i piedi uno davanti all'altro con un tallone a contatto della punta dell'altro. Se non riesce, metta un piede aventi in modo che il tallone sia comunque avanti rispetto alla punta dell'altro piede\".";
                break;
            case 'lblInPiediSuPiede':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                        .append($('<td style="width: 20%;"></td>').text('(4)'))
                        .append($('<td style="width: 20%;"></td>').text('(3)'))
                        .append($('<td style="width: 20%;"></td>').text('(2)'))
                        .append($('<td style="width: 20%;"></td>').text('(1)'))
                        .append($('<td style="width: 20%;"></td>').text('(0)'))
                        )
                        .append(
                                $('<tr></tr>')
                                .append($('<td style="vertical-align: top;"></td>').text('Riesce a sollevare la gamba da solo e mantenere la posizione per più di 10 secondi.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Riesce a sollevare la gamba da solo e mantenere la posizione per  5-10 secondi.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Riesce a sollevare la gamba da solo e mantenere la posizione per  3-4 secondi.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Cerca di sollevare la gamba e non la mantiene sollevata per 3 secondi, ma riesce a stare in piedi da solo.'))
                                .append($('<td style="vertical-align: top;"></td>').text('Non riesce nemmeno a tentare di eseguire il compito o necessita di assistenza per evitare cadute.'))
                                );
                paramObj.title = "Stare su un piede solo senza appoggio: \"Stia su un piede solo il più a lungo possibile, senza appoggiarsi\".";
                break;            
        }

        popupBBS.append({
            obj: paramObj.vObj,
            title: paramObj.title,
            width: paramObj.width,
            height: paramObj.height
        });
    },
    show: function() {
        $('#lblFunzione').addClass('Link');
    },
    hide: function() {
        $('#lblFunzione').removeClass('Link');
    }
};


var popupBBS = {
    append: function(pParam) {
        popupBBS.remove();

        pParam.header = (typeof pParam.header != 'undefined' ? pParam.header : null);
        pParam.footer = (typeof pParam.footer != 'undefined' ? pParam.footer : null);
        pParam.title = (typeof pParam.title != 'undefined' ? pParam.title : "");
        pParam.width = (typeof pParam.width != 'undefined' ? pParam.width : 500);
        pParam.height = (typeof pParam.height != 'undefined' ? pParam.height : 300);

        $('body').append(
                $('<div id="divPopUpInfoBBS"></div>')
                .css("font-size", "12px")
                .append(pParam.header)
                .append(pParam.obj)
                .append(pParam.footer)
                .attr("title", pParam.title)
                );

        $('#divPopUpInfoBBS').dialog({
            position: [event.clientX, event.clientY],
            width: pParam.width,
            height: pParam.height
        });

        popupBBS.setRemoveEvents();

    },
    remove: function() {
        $('#divPopUpInfoBBS').remove();
    },
    setRemoveEvents: function() {
        $("body").click(popupBBS.remove);
    }
};