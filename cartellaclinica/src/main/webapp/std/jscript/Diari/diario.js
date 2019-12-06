/**
 * Javascript in uso dalla pagina SCHEDA_DIARIO_MEDICO. 
 */
var WindowCartella = null;

$(function(){
	window.WindowCartella = window;
	while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
		window.WindowCartella = window.WindowCartella.parent;
	}
	window.baseReparti = WindowCartella.baseReparti;
	window.baseGlobal = WindowCartella.baseGlobal;
	window.basePC = WindowCartella.basePC;
	window.baseUser = WindowCartella.baseUser;

	try {
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.dati.txtData);
	}catch(e){}

	eval(WindowCartella.baseReparti.getValue(document.EXTERN.REPARTO.value,'DIARI_CONTROLLI_JS'));

	$('input[name=txtOra]').bind('keyup', function(){ oraControl_onkeyup(document.getElementById('txtOra'));});
	$('input[name=txtOra]').bind('blur', function(){ oraControl_onblur(document.getElementById('txtOra'));});
	$('input[name=txtData]').bind('blur', function(){if($('input[name=txtData]').val().substr(5,1)!='/' || $('input[name=txtData]').val().length!=10 ) {alert('Inserire la data nel formato corretto'); $('input[name=txtData]').focus();}});

	var maxLength = 32767;
	var msg = 'Attenzione: il testo inserito supera la lunghezza massima consentita.\n\nPremendo ok il sistema troncherà il testo in eccesso.';
	jQuery('#txtDiario').attr("maxlength", String(maxLength)).blur(function(e) {
		maxlength(this, maxLength, msg);
	}).focus();

	var txtOra=$("input[name=txtOra]");
	txtOra.css({float:'left'}).parent().append($('<div></div>').addClass('classDivTestiStd').attr("title","Testi Standard").click(function(){apriTestiStandard('txtDiario');}));

	switch (document.EXTERN.KEY_TIPO_DIARIO.value) {
	case 'MEDICO':
	case 'INFERMIERE' :
		$("a#lblImportaParametri").parent().width(200);
		break;
	case 'OSTETRICO' :
		txtOra.parent().append($('<div></div>').addClass('classDivDieta').attr("title","Inserisci Dieta").click(function(){inserisciDieta();}));
		$("a#lblImportaParametri").parent().hide();
		break;
	case 'SOCIALE':
	default:
		$("a#lblImportaParametri").parent().hide();
		break;
	}

	if(_STATO_PAGINA == 'L'){
		document.getElementById('lblRegistra').parentElement.style.display = 'none';
		$('#lblImportaParametri').parent().hide();
	}

	if (baseUser.TIPO=='L' || baseUser.TIPO=='F' || baseUser.TIPO=='D') {
		$('#lblImportaParametri').parent().hide();
	}

	caricamentoPagina();

});

function  apriTestiStandard(targetOut){

	if(_STATO_PAGINA == 'L'){return;}

	var url='servletGenerator?KEY_LEGAME=SCHEDA_TESTI_STD&TARGET='+targetOut+'&PROV='+document.EXTERN.FUNZIONE.value;
	$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 580,
		'href'		: url,
		'type'		: 'iframe'
	});
}

function caricamentoPagina(){
	if(_STATO_PAGINA == 'I'){
		document.all.divGroupInfo.style.display='none';
		var Ubicazione = WindowCartella.CartellaPaziente.getAccesso("Ubicazione");

		if(Ubicazione == null){
			Ubicazione.LETTO = '';
		}

		if(Ubicazione.LETTO){
			$('#hLetto').val(Ubicazione.LETTO);
		}
		var dataMorte=WindowCartella.getPaziente('DATA_MORTE_CCE');
		if(document.EXTERN.KEY_TIPO_DIARIO.value=='INFERMIERE' && dataMorte!='')
		{
			if (confirm("Il paziente è deceduto in data "+dataMorte.substr(6,2)+"/"+dataMorte.substr(4,2)+"/"+dataMorte.substr(0,4) +" alle ore "+WindowCartella.getPaziente('ORA_MORTE_CCE')+". Si vuole inserire una nota di diario riferita a tale evento?")){
				
				var rs = WindowCartella.executeQuery("segnalazioneDecesso.xml","retrieveDescrMed",[WindowCartella.getPaziente('IDEN_PER_MORTE_CCE')]);
				if(rs.next()){
					$('input[name=txtData]').val(dataMorte.substr(6,2)+"/"+dataMorte.substr(4,2)+"/"+dataMorte.substr(0,4));
					$('input[name=txtOra]').val(WindowCartella.getPaziente('ORA_MORTE_CCE'));  			
					$('#txtDiario').val("Constatato il decesso il giorno "+dataMorte.substr(6,2)+"/"+dataMorte.substr(4,2)+"/"+dataMorte.substr(0,4)+" alle ore "+WindowCartella.getPaziente('ORA_MORTE_CCE') + " da parte del medico "+rs.getString("DESCR"));
				}
				
			}
		}
	}
}

function importaParametri() {
	var vRs = WindowCartella.executeQuery("parametri.xml","getUltimiParametriRilevati",[WindowCartella.getPaziente("IDEN"),WindowCartella.getRicovero("IDEN"),WindowCartella.getForm().reparto,'']);

	var vParametri="";
	while(vRs.next()) {
		vParametri += vRs.getString("DESCRIZIONE")+": "+vRs.getString("VALORE")+"\n";
	}
	if (vParametri=="") {
		alert("Nessun parametro rilevato da importare");
	} else {
		var txtDiario = $("textarea#txtDiario");
		txtDiario.val(txtDiario.val()=="" ? vParametri:txtDiario.val()+ "\n"+vParametri);
	}
};


/**
 * Callback eseguita dopo la registrazione di un diario
 */
function chiudi(){
	if (typeof parent.aux_applica_filtro === 'function'){
		parent.aux_applica_filtro();
	} else {
		$('iframe#frameDiari',parent.document)[0].contentWindow.location.reload();	
	}
	if (document.EXTERN.KEY_TIPO_DIARIO.value=='MEDICO'){
		var rowCount=parent.frameDiari.document.getElementById('oTable').rows.length;
		if (parent.NS_DIARIO_GENERICO && !parent.NS_DIARIO_GENERICO.isDiarioMedicoSelezionato()){
			rowCount=-1;
		}
		if (rowCount==0){
			if (config.tipi['MEDICO'].epicrisi=='S' && String($('form[name=EXTERN] input[name=ARRIVATO_DA]').val()) != 'CC_SCHEDE_METAL'){
				return parent.frameSecondario.InserisciEpicrisi();
			}
		}
	}
	parent.$.fancybox.close();
}


function chiudiDiario() {
	if (document.getElementById('txtDiario').value!='' && _STATO_PAGINA!='L') {
		if (confirm("Attenzione: sono presenti dati non salvati, si vuol procedere al salvataggio?")){
			registraDiario();
		}
		else
			parent.$.fancybox.close(); 
	} else {
		parent.$.fancybox.close(); 
	}
}

function inserisciDieta() {
	if(_STATO_PAGINA == 'L'){return;}
	var url='servletGenerator?KEY_LEGAME=SCHEDA_DIETA&KEY_IDEN_VISITA='+WindowCartella.getAccesso("IDEN")+'&KEY_TIPO_DIARIO=DIETA';
	$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 580,
		'href'		: url,
		'type'		: 'iframe'
	});
}

function registraDiario(){
	var data = clsDate.str2date($("INPUT[name='txtData']").val(),'DD/MM/YYYY',$("INPUT[name='txtOra']").val());
	var range;
	try {
		range = parent.config.tipi[parent.document.EXTERN.KEY_TIPO_DIARIO.value].inserimento;
		if (typeof range['range'] === 'object') range = range['range'];
		else throw new Error();
	} catch(e) {
		range = {down: null, top: null}; // controllo sulla data disabilitato
	}

	var check = clsDate.dateCompare(data, new Date(), range);
	switch(check) {
	case 1:
		if(confirm("Non è possibile inserire una nota di diario con data ed ora superiori" + (range.top ? "a "+range.top+" ore rispetto" : "") + " a quelle attuali, si desidera reimpostare data/ora?")) {
			$("INPUT[name='txtData']").val(clsDate.getData(new Date(),'DD/MM/YYYY'));
			$("INPUT[name='txtOra']").val(clsDate.getOra(new Date()));
		}
		return;
	case -1:
		if(confirm("Non è possibile inserire una nota di diario con data ed ora inferiori" + (range.down ? "a "+range.down+" ore rispetto" : "") + " a quelle attuali, si desidera reimpostare data/ora?")) {
			$("INPUT[name='txtData']").val(clsDate.getData(new Date(),'DD/MM/YYYY'));
			$("INPUT[name='txtOra']").val(clsDate.getOra(new Date()));
		}
		return;
	case 0: default: // data valida
	}

	registra();	
}
