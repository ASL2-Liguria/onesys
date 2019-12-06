/**
 * File JavaScript in uso dalla scheda 'ACCERTAMENTO_INFERMIERISTICO_ASL2_NIDO'.
 * 
 * @author	gianlucab
 * @version	1.2
 * @since	2014-06-06
 */

var WindowCartella = null;

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

var NEONATOLOGIA = {};
(function() {
	var _this = this;
	
	this.strError = null;
	
	this.iden_scheda = null;
	
	this.init = function() {
		_this.iden_scheda = parseInt($('form[name=EXTERN] input[name=IDEN_SCHEDA]').val(),10) || null;
        
		// Aggiunta attributo "for" per le label accanto i radio input
		$("input:radio").each(function() {
			var label = $(this).next().next();
			if (label.attr("tagName").toUpperCase() == 'LABEL') {
				var idname = $(this).attr('name') + '_' + $(this).val();
				$(this).attr("id", idname);
				label.attr("for", idname);
			}
		});
		
		// Aggiunta attributo "for" per le label accanto ai check input
		$('label[name^=lblchk]').each(function () {
			var idname = $(this).attr("name").replace(/^(lbl)(chk[\s\S]*)$/, "$2");
			$(this).attr("for", idname);
		});
		
		NS_FUNCTIONS.moveLeftField({name: 'txtPervietaAno', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtScreeningMet', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		$('#txtPervietaAnoInf, #txtScreeningMetInf').parent().attr('colspan', 8);
	};
	
	this.caricaDati = function() {
		// Carico la data e l'ora di nascita dal partogramma (readonly)
		var dataNascita = '';
		var oraNascita = '';
		var rs = WindowCartella.executeQuery("nido.xml","caricaDataNascita", [WindowCartella.getRicovero("IDEN"), WindowCartella.getRicovero("IDEN_RIFERIMENTO")]);
		if (rs.next()){
			try {
				var indice = Number(rs.getString("cmbFiglio")) || 1;
				dataNascita = rs.getString("DataNascita").split('@')[indice-1];
				oraNascita = rs.getString("OraNascita").split('@')[indice-1];
			} catch(e) {}
		}
		NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtDataNascita'), dataNascita);
		NS_FUNCTIONS.assegnaCampoTestoNonRegistrato($('#txtOraNascita'), oraNascita);
		
		// Carico le informazioni dell'utente loggato
		rs = WindowCartella.executeQuery("nido.xml","caricaInfermiere", [baseUser.IDEN_PER]);
		if (rs.next()){
			descr_inf = rs.getString("Descr");
			hiden_inf = rs.getString("Iden");
		}
	};
	
	this.setEvents = function() {
		// Campi non editabili (sola lettura)
		$('input[type=text][readonly], [disabled], textarea[readonly]').css({'color':'#6D6D6D','background-color': 'transparent' ,'border':'1px solid transparent'});
		
		// Compilazione automatica di data, ora e infermiere che ha eseguito la rilevazione
		$('#txtCircCranica, #txtCircToracica, #txtLunghezza, #txtTemperatura, select[name=cmbPervietaAno], #txtPervietaAno,'+
		  '#txtProfilassiO, #txtProfilassiA, #txtMeconio, #txtUrine, select[name=cmbScreeningAudDX], select[name=cmbScreeningAudSX],'+
		  'select[name=cmbScreeningMet], #txtScreeningMet, #txtFreqCard, #txtSaturazione').change(function(){
		
			var today = new Date();
			var strData = ('0'+today.getDate()).slice(-2)+'/'+('0'+(today.getMonth()+1)).slice(-2)+'/'+today.getFullYear();
			var strOra = ('0'+today.getHours()).slice(-2)+':'+('0'+today.getMinutes()).slice(-2);
			var item = $(this).attr('name').match(/^(txt|cmb)([\s\S]+)$/i)[2];

			$('input[name=txt'+item+'Data]').val(strData);
			$('input[name=txt'+item+'Ora]').val(strOra);
			if (descr_inf != '' && hiden_inf != '') {
				$('input[name=h'+item+'Inf]').val(hiden_inf);
				$('input[name=txt'+item+'Inf]').val(descr_inf);
			} else {
				$('input[name=h'+item+'Inf]').val('');
				$('input[name=txt'+item+'Inf]').val('');				
			}
		});
		
		// Apertura selezione del personale infermieristico sul click della label
		$('label[name$="Inf"]').each(function(){
			var element = $(this)[0];
			var item = $(this).attr("id").replace(/^(lbl|txt)([\s\S]+)(Inf)$/, "$2");
			item = "'"+item+"'";
			element.onclick = function() {
				var items = {'inValInf': 'txt'+eval(item)+'Inf', 'hInf': 'h'+eval(item)+'Inf'};
				launch_scandb_link(this, items);
			};
		});
		/*
		// Apertura selezione del personale infermieristico sul blur del campo di testo
		$('input[name$="Inf"][type=text]').each(function(){
			var element = $(this)[0];
			var item = $(this).attr("id").replace(/^(lbl|txt)([\s\S]+)(Inf)$/, "$2");
			item = "'"+item+"'";
			element.onblur = function() {
				var items = {'inValInf': 'txt'+eval(item)+'Inf', 'hInf': 'h'+eval(item)+'Inf'};
				launch_scandb_link(this, items);
			};
		});*/
		
		// Controllo sulla data
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		$('input[type=text][name$=Data]').each(function() {
			oDateMask.attach($(this)[0]); 
		});
		
		// Controllo sull'ora
		$('input[type=text][name$=Ora]').each(function() {
			$(this).blur(function(){ oraControl_onblur($(this)[0]); });
			$(this).keyup(function(){ oraControl_onkeyup($(this)[0]); });
		});
		
		// Per i salvataggi successivi vengono segnalati i campi importati da altre schede non ancora registrati nell'xml
		if (_this.iden_scheda != null) {
			NS_FUNCTIONS.segnalaCampiNonRegistrati();
			if (_STATO_PAGINA != 'L' && $('[data-uncommitted]').length > 0 && _this.strError == null) {
				_this.strError = 'Sono presenti dati non salvati provenienti dal ricovero della madre.\n\nPer convalidare l\'importazione è necessario registrare nuovamente la scheda.';
			}
		}
		
		// I campi importati da altre schede sono ora registrati nell'xml
		document.body.ok_registra = function() {
			NS_FUNCTIONS.segnalaCampiRegistrati();
		};
	};
	
	this.save = function(){
		// Compilazione automatica di data, ora e infermiere che ha eseguito la rilevazione
		var success=true;
		$('#txtCircCranica, #txtCircToracica, #txtLunghezza, #txtTemperatura, select[name=cmbPervietaAno], #txtPervietaAno,'+
		  '#txtProfilassiO, #txtProfilassiA, #txtMeconio, #txtUrine, select[name=cmbScreeningAudDX], select[name=cmbScreeningAudSX],'+
		  '#txtScreeningMet, #txtFreqCard, #txtSaturazione').each(function(){
		
			if (!success) return;
			var item = $(this).attr('name').match(/^(txt|cmb)([\s\S]+)$/i)[2];
			
			if($(this).val()!=''){
				if($('input[name=txt'+item+'Data]').val()=='' ||
					$('input[name=txt'+item+'Ora]').val()=='' ||
					$('input[name=h'+item+'Inf]').val()=='' ||
					$('input[name=txt'+item+'Inf]').val()=='') {
					success=false;
				}
			}
		});
		
		if (!success) {
			alert('Prego compilare data, ora e infermiere per tutti i campi popolati.');
			return;
		}
		
		NS_FUNCTIONS.records();
	};
	
	this.registraPesoNascita = function(){
		// Evento associato alla registrazione della scheda	
		var peso=rilevaAggiornamentoPeso();
		if (peso == null) return;

		var pBinds = new Array(
			document.EXTERN.USER_ID.value,
			document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,
			null,
			0,
			clsDate.getData(new Date(),'YYYYMMDD') ,
			clsDate.getOra(new Date()),
			peso,
			null,
			'',
			'',
			'',
			'PesogNasc',
			'ESAME_OBIETTIVO' // il parametro verrà rilevato ma non visualizzato
		);
		var vResp = WindowCartella.executeStatement("parametri.xml","setParametro",pBinds,1);
		if(vResp[0]=='KO'){
			return alert(vResp[1]);
		}
		//alert(vResp[2]);
	};
	
	/* private attributes */
	var descr_inf = '';
	var hiden_inf = '';
	
	/* private methods */
	function rilevaAggiornamentoPeso(){
		// Rileva se il peso alla nascita è stato modificato.
		// Nota: il valore registrato nell'esame obiettivo ha la priorità.
		var pBinds = new Array();		
		pBinds.push(document.EXTERN.IDEN_VISITA.value);
		var vResp = WindowCartella.executeStatement("nido.xml","aggiornaParametroPesogNascita",pBinds,1);
		if(vResp[0]=='KO'){
			return alert(vResp[1]);
		}
		return vResp[2];
	}
}).apply(NEONATOLOGIA);

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
