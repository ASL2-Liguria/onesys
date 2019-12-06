/**
 * File JavaScript in uso dalla scheda 'PARTO_ASL2_NIDO'.
 * 
 * @author	gianlucab
 * @version	1.1
 * @since	2014-05-28
 */

var WindowCartella = null;

var hNumeroFigli      = 1;
var hDataParto        = [];
var hOraParto         = [];
var hPesoNeonato      = [];
var hNoteFiglio       = [];
var hPresentazione    = [];
var hPlacentaDiametro = [];
var hPlacentaPeso     = [];
var hMembrane         = [];
var hInserzione       = [];
var hFunicolo         = [];
var hVasi             = [];

$(document).ready(function() {	
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }

    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    try {
        NEONATOLOGIA.init();
        NEONATOLOGIA.caricaDati();
        NEONATOLOGIA.setEvents();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }
    
    if (document.EXTERN.BISOGNO.value=='N'){
        document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
    }

    if (_STATO_PAGINA == 'L'){
        document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
    }

    try{
        if(!WindowCartella.ModalitaCartella.isStampabile(document)){
            document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
        }
    }
    catch(e){}
        
    try {
        WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {
        /*catch nel caso non venga aperta dalla cartella*/
    }
});

$(window).load(function(){
    if (NEONATOLOGIA.strError != null) {
    	alert(NEONATOLOGIA.strError);
    }
});

var NEONATOLOGIA = {
	apgar: {"1":  [],
		    "5":  [],
		    "10": [],
		    "15": []},
		    
	strError: null,
	
	iden_scheda: null,
		
	init: function() {
		this.iden_scheda = parseInt($('form[name=EXTERN] input[name=IDEN_SCHEDA]').val(),10) || null;
		
		// Aggiunta attributo "for" per le label accanto ai radio input
		$("input:radio").each(function() {
			var label = $(this).next().next();
			if (label.attr("tagName").toUpperCase() == 'LABEL') {
				var id = $(this).attr('name')+'_'+$(this).val();
				$(this).attr("id", id);
	    		label.attr("for", id);
			}
	    });
		
        // Aggiunta attributo "for" per le label accanto ai check input
        $('label[name^=lblchk]').each(function () {
        	var idname = $(this).attr("name").replace(/^(lbl)(chk[\s\S]*)$/, "$2");
        	$(this).attr("for", idname);
        });
                
        // Ridefinisco l'allineamento delle sezioni
        $('#groupNascita').after('<div id="container" style="display:inline;overflow:hidden;height: auto;"></div>');
        $('#groupPunteggioApgar').remove().appendTo($('#container')).css({'float':'left','width':'1px'});
        $('#groupRianimazionePrimaria').remove().appendTo($('#container')).css({'float':'left','width':'auto'});
        //$('#groupTravaglioParto').remove().insertAfter($('#container'));
        $('#lblTipoRianimazione').parent().attr('rowspan', '2');
        $('input[name=chkSiO2]').parent().attr('colspan', $('input[name=chkIPPVMaschera]').parent().attr('colspan'));

        //$('select[name=cmbFiglio]').parent().css('border', '2px solid red');
	},
	caricaDati: function(){
		/**
		 * IDEN_RIFERIMENTO è un nuovo attributo della tabella RADSQL.NOSOLOGICI_PAZIENTE del figlio
		 * che corrisponde all'IDEN del ricovero della madre (ACCESSO = 0). In questo modo è possibile
		 * reperire le schede ANAMNESI e PARTOGRAMMA_PARTO. Se al ricovero è associato un prericovero è
		 * possibile consultare anche la scheda SETTIMANA36.
		 */
		var pBinds = new Array();
		pBinds.push(top.getRicovero("IDEN_RIFERIMENTO"));
		this.strError = "Impossibile reperire le informazioni relative al ricovero della madre.";
		var rs = WindowCartella.executeQuery("nido.xml","caricaPartogramma",pBinds);
		if(rs.next()){
			// Carica dal partogramma (readonly)
			NS_FUNCTIONS.assegnaCampoRadioNonRegistrato($('input[name=rdoTipoPartoP]'), rs.getString("rdoTipoPartoP"));	
			NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('select[name=cmbTipoTravaglio]'), rs.getString('cmbTipoTravaglio'));
			NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtTravaglioDataInizio'), rs.getString('txtTravaglioDataInizio'));
			NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtTravaglioOraInizio'), rs.getString('txtTravaglioOraInizio'));
			
			hNumeroFigli = parseInt(rs.getString('txtNumeroGemelli'),10);
			hNumeroFigli = !isNaN(hNumeroFigli) && hNumeroFigli > 0 ? hNumeroFigli : 1;
			hNumeroFIgli = hOraParto.length <= hNumeroFigli ? hNumeroFigli : hOraParto.length; // retrocompatibilità
			NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtNumeroGemelli'), String(hNumeroFigli));
			
			NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('select[name=cmbRotturaMembrane]'), rs.getString('cmbRotturaMembrane'));
			NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtRotturaMembraneData'), rs.getString('txtRotturaMembraneData'));
			NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtRotturaMembraneOra'), rs.getString('txtRotturaMembraneOra'));
			NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('select[name=cmbLiquidoAmniotico]'), rs.getString('cmbLiquidoAmniotico'));
			NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('select[name=cmbLiquidoAmnioticoQ]'), rs.getString('cmbLiquidoAmnioticoQ'));
			NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('select[name=cmbTipoPartoTP]'), rs.getString('cmbTipoPartoTP'));
			NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('select[name=cmbDistocico]'), rs.getString('cmbDistocico'));
			NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('select[name=cmbCesareo]'), rs.getString('cmbCesareo'));
			NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('select[name=cmbAnalgesia]'), rs.getString('cmbAnalgesia'));
			NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtAnalgesiaEpidurale'), rs.getString('txtAnalgesiaEpidurale'));
			
			// Carica la sezione relativa ai figli
			hDataParto = rs.getString('hDataParto').split('@');
			hOraParto = rs.getString('hOraParto').split('@');
			hPesoNeonato = rs.getString("hPesoNeonato").split('@');
			hNoteFiglio = rs.getString("hNoteFiglio").split('@');
			hPresentazione = rs.getString("hPresentazione").split('@');
			hPlacentaDiametro = rs.getString("hPlacentaDiametro").split('@');
			hPlacentaPeso = rs.getString("hPlacentaPeso").split('@');
			hMembrane = rs.getString("hMembrane").split('@');
			hInserzione = rs.getString("hInserzione").split('@');
			hFunicolo = rs.getString("hFunicolo").split('@');
			hVasi = rs.getString("hVasi").split('@');
			
			this.strError = null;
		}

		rs = WindowCartella.executeQuery("nido.xml","carica36Settimana",pBinds);
		if(rs.next()){
			NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtBCF'), rs.getString('txtBCF'));
			this.strError = null;
		}
		
		var txtUM = "";
		rs = WindowCartella.executeQuery("nido.xml","caricaAnamnesiRicovero",pBinds);
		if(rs.next()){
			txtUM = rs.getString('txtUM');
			this.strError = null;
		}
                
        for(var i=0; i<hNumeroFigli; i++) {
        	$('select[name=cmbFiglio]').append('<option value="'+(i+1)+'">'+(i+1)+'</option>');
        }
		
		rs = WindowCartella.executeQuery("nido.xml","caricaDatiParto",[document.EXTERN.IDEN_VISITA.value]);
		if(rs.next()){
			$('select[name=cmbFiglio]').val(rs.getString("cmbFiglio"));
		}
        
		// Carica le informazioni del figlio selezionato
		NEONATOLOGIA.selezionaFiglio($('select[name=cmbFiglio]').val());
		
		// Calcola l'età gestazionale
		NEONATOLOGIA.calcolaEtaGestazionale(txtUM);
	},
	setEvents: function() {
		// Campi non editabili (sola lettura)
		$('input[type=text][readonly], [disabled], textarea[readonly]').css({'color':'#6D6D6D','background-color': 'transparent' ,'border':'1px solid transparent'});
		
		// Calcola la durata in ore del travaglio
        NEONATOLOGIA.evidenziaTravaglio();
		$('input[name=txtDataParto], input[name=txtOraParto], input[name=txtRotturaMembraneData], input[name=txtRotturaMembraneOra]').blur(function(){
			NEONATOLOGIA.evidenziaTravaglio();
		});

    	// Ricarica i punteggi di Apgar
        $('#groupPunteggioApgar select').each(function () {
        	NEONATOLOGIA.calcolaApgar($(this));
        });
		$('#groupPunteggioApgar select').change(function(){
			NEONATOLOGIA.calcolaApgar($(this));
		});
		
		// Ricarica le informazioni del figlio selezionato
		$('select[name=cmbFiglio]').change(function(){
			NEONATOLOGIA.selezionaFiglio($(this).val(), true);
		});
		
		// Impedisce la modifica delle date
		$('.datepick-trigger').hide();
		
		//TODO
		// Per i salvataggi successivi vengono segnalati i campi importati da altre schede non ancora registrati nell'xml
		if (this.iden_scheda != null) {
			NS_FUNCTIONS.segnalaCampiNonRegistrati();
			if (_STATO_PAGINA != 'L' && $('[data-uncommitted]').length > 0 && this.strError == null) {
				this.strError = 'Sono presenti dati non salvati provenienti dal ricovero della madre.\n\nPer convalidare l\'importazione è necessario registrare nuovamente la scheda.';
			}
		}
		
		// I campi importati da altre schede sono ora registrati nell'xml
		document.body.ok_registra = function() {
			NS_FUNCTIONS.segnalaCampiRegistrati();
		};
	},
	evidenziaTravaglio: function() {
		var strDataParto = $('#txtDataParto').attr('value')+' '+$('#txtOraParto').attr('value');
		var strDataRotturaMembrane = $('#txtRotturaMembraneData').attr('value')+' '+$('#txtRotturaMembraneOra').attr('value');
		var pattern = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/;
		
		var dataParto = new Date(undefined);
		var dateArray = strDataParto.match(pattern); 
		if (dateArray) dataParto = new Date(
		    (+dateArray[3]),
		    (+dateArray[2])-1, // Careful, month starts at 0!
		    (+dateArray[1]),
		    (+dateArray[4]),
		    (+dateArray[5]),
		    0
		);
		
		var dataRotturaMembrane = new Date(undefined);
		dateArray = strDataRotturaMembrane.match(pattern); 
		if (dateArray) dataRotturaMembrane = new Date(
		    (+dateArray[3]),
		    (+dateArray[2])-1, // Careful, month starts at 0!
		    (+dateArray[1]),
		    (+dateArray[4]),
		    (+dateArray[5]),
		    0
		);

		$('#divGroupTravaglioParto').css('border', '0');
		if (!isNaN(dataParto.getTime()) && !isNaN(dataRotturaMembrane.getTime())) {
			var diff = (dataParto.getTime() - dataRotturaMembrane.getTime()) / (1000*60*60); // hours
			if (diff >= 18)
				$('#divGroupTravaglioParto').css('border', '2px solid red');
			//alert('Durata travaglio (ore): '+diff);
		}
	},
	selezionaFiglio: function(val, reset) {
		var index = parseInt(val, 10);
		if (isNaN(index) || index < 1) index = 1;
		if (index > hNumeroFigli) index = hNumeroFigli;
		index--;
		
		// Carica dal partogramma (campi in sola lettura)
		if (typeof hDataParto[index] === 'string') NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtDataParto'), hDataParto[index]);
		if (typeof hOraParto[index] === 'string') NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtOraParto'), hOraParto[index]);
		if (typeof hNoteFiglio[index] === 'string') NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtNoteFiglio'), hNoteFiglio[index]);
		if (typeof hPresentazione[index] === 'string') NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('select[name=cmbPresentazione]'), hPresentazione[index]);
		if (typeof hPlacentaDiametro[index] === 'string') NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtPlacentaDiametro'), hPlacentaDiametro[index]);
		if (typeof hPlacentaPeso[index] === 'string') NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtPlacentaPeso'), hPlacentaPeso[index]);
		if (typeof hMembrane[index] === 'string') NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('select[name=cmbMembrane]'), hMembrane[index]);
		if (typeof hInserzione[index] === 'string') NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('select[name=cmbInserzioneFunicolo]'), hInserzione[index]);
		if (typeof hFunicolo[index] === 'string') NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtFunicolo'), hFunicolo[index]);
		
		// Carica dal partogramma (campi editabili)
		if (reset || $('#txtPesoNeonato').val() == '') {
			if (typeof hPesoNeonato[index] === 'string') $('#txtPesoNeonato').val(hPesoNeonato[index]);
		}
		if (reset || $('#txtVasi').val() == '') {
			if (typeof hVasi[index] === 'string') $('#txtVasi').val(hVasi[index]);
		}
	},
	calcolaEtaGestazionale: function(txtUM) {
		var strDataParto = $('#txtDataParto').attr('value')+' 00:00';
		var strDataUltimaMestruazione = txtUM+' 00:00';
		var pattern = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/;
		
		var dataParto = new Date(undefined);
		var dateArray = strDataParto.match(pattern); 
		if (dateArray) dataParto = new Date(
		    (+dateArray[3]),
		    (+dateArray[2])-1, // Careful, month starts at 0!
		    (+dateArray[1]),
		    (+dateArray[4]),
		    (+dateArray[5]),
		    0
		);
		
		var dataUltimaMestruazione = new Date(undefined);
		dateArray = strDataUltimaMestruazione.match(pattern); 
		if (dateArray) dataUltimaMestruazione = new Date(
		    (+dateArray[3]),
		    (+dateArray[2])-1, // Careful, month starts at 0!
		    (+dateArray[1]),
		    (+dateArray[4]),
		    (+dateArray[5]),
		    0
		);
		
		var etaGestazionale = '';
		if (!isNaN(dataParto.getTime()) && !isNaN(dataUltimaMestruazione.getTime())) {
			if (dataParto.getTime() > dataUltimaMestruazione.getTime()) {
				var diff = (dataParto.getTime() - dataUltimaMestruazione.getTime()) / (1000*60*60*24); // days
				var weeks = Math.floor(diff/7);
				var days = Math.floor(diff-weeks*7);
				etaGestazionale = weeks+'+'+days;
			}
		}
		NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtEtaGest'), etaGestazionale);
	},
	calcolaApgar: function(element){
		var i = element.attr("name").replace(/^[^\d]+/, "");
		var array = NEONATOLOGIA.apgar;
		var p = parseInt(element.attr('value'),10);
		try {
			array[i][element.attr('name')] = isNaN(p) ? 0 : p;
			
			p = 0;
			for (var key in array[i]) {
				p += array[i][key];
			}
			$('#txtTotale'+i).attr('value', p ? p : '');
		} catch (e) {
			alert(e.message);
		}
	}
};

// Stampa la scheda
function stampa(){
	try {
		var vDati 		= WindowCartella.getForm();
		var iden_visita	= vDati.iden_ricovero;
		var funzione	= document.EXTERN.FUNZIONE.value;
		var reparto		= vDati.reparto;
		var anteprima	= 'S';
		var sf			= '&prompt<pVisita>='+iden_visita;

		WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,WindowCartella.basePC.PRINTERNAME_REF_CLIENT);		
	} catch(e) {
		window.alert(e.message);
	}
}
