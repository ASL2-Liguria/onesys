var WindowCartella = null;
var data_ini_rico;
var idenVisita;
var tipoDiario;

$(document).ready(function(){
	NS_DIARI_RIAB.init();
	NS_DIARI_RIAB.setEvents();
	
});

var NS_DIARI_RIAB={
	init: function(){
		window.WindowCartella = window;
	    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
	        window.WindowCartella = window.WindowCartella.parent;
	    }
	    window.baseReparti = WindowCartella.baseReparti;
	    window.baseGlobal = WindowCartella.baseGlobal;
	    window.basePC = WindowCartella.basePC;
	    window.baseUser = WindowCartella.baseUser;
		try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){} ;
		// imposto la combo tipi diario in base all'utente loggato
		if (baseUser.TIPO=='F'){
			$("select[name='cmbTipoDiario']").val('\'FISIOTERAPISTA\'');
		}
		else if (baseUser.TIPO=='L'){
			$("select[name='cmbTipoDiario']").val('\'LOGOPEDISTA\'');
		}
		else{
			$("select[name='cmbTipoDiario']").val('\'FISIOTERAPISTA\',\'LOGOPEDISTA\'');
		}
		// carico le configurazioni per i controlli sulla modifica dei diari
		eval(window.baseReparti.getValue(WindowCartella.getAccesso("COD_CDC"),'DIARI_CONTROLLI_JS'));
		// imposto la data di inizio ricovero come limite superiore di filtro
		var vDati = WindowCartella.getForm(document);
        
     // imposto data inizio ricovero e iden_visita per la visualizzazione dei diari riab
		
		switch(WindowCartella.FiltroCartella.getLivelloValue(vDati)){
			case "IDEN_ANAG": 
			case "ANAG_REPARTO" : 	data_ini_rico = WindowCartella.getPaziente("DATA"); $("#hIden").val(''); break;
			case "NUM_NOSOLOGICO" :	data_ini_rico = WindowCartella.getRicovero("DATA_INIZIO"); $("#hIden").val(''); break;
			case "IDEN_VISITA" : 	data_ini_rico = WindowCartella.getAccesso("DATA_INIZIO"); $("#hIden").val(vDati.iden_visita);break;
		};
		$("#txtDaData").val(clsDate.str2str(data_ini_rico,'YYYYMMDD','DD/MM/YYYY'));
		// imposto il numero nosologico per filtro
		/*$("#hNumNosologico").val(vDati.ricovero);*/
        $('form[name="EXTERN"]').append($('<input type="hidden" name = "WHERE_WK_EXTRA"/>'));
        $('form[name="EXTERN"] input[name="WHERE_WK_EXTRA"]').val("(IDEN_VISITA="+vDati.iden_ricovero+" or PARENT="+vDati.iden_ricovero+")"); 
		aux_applica_filtro();
		
	},
	resettaCampi: function(){
		$("#txtAData").val('');
	},
	setEvents: function(){
		$("#txtDaData").keypress(function(e){
			if(e.keyCode == 13){
				aux_applica_filtro();
			}
		});
		$("#txtAData").keypress(function(e){
			if(e.keyCode == 13){
				aux_applica_filtro();
			}
		});
		NS_DIARI_RIAB.setDatepicker();
    	if(_STATO_PAGINA == 'I'){
    		var Ubicazione = WindowCartella.CartellaPaziente.getAccesso("Ubicazione");

        	if(Ubicazione == null){
        		Ubicazione.LETTO = '';
        	}

        	if(Ubicazione.LETTO){
        		$('#hLetto').val(Ubicazione.LETTO);
        	}
    	}		
	},
	setDatepicker:function(){
		// si elimina la classe messa dal configuratore (che era senza minDate)
		$('#txtDaData').removeClass('hasDatepick');
		// si elimina il calendario
		$('#txtDaData').next().remove();
		// si reimposta la classe, configurando anche minDate, così viene anche rimesso il calendario
		$('#txtDaData').datepick({
			onClose: function(){
				jQuery(this).focus();
				}, 
			showOnFocus: false,
			minDate: function(){				
				switch(WindowCartella.FiltroCartella.getLivelloValue()){
					case "IDEN_ANAG": 
					case "ANAG_REPARTO" : 	return clsDate.setData(WindowCartella.getPaziente("DATA"),"00:00");
					case "NUM_NOSOLOGICO" :	return clsDate.setData(WindowCartella.getRicovero("DATA_INIZIO"),"00:00");
					case "IDEN_VISITA" :	return clsDate.setData(WindowCartella.getAccesso("DATA_INIZIO"),"00:00");
				}
				
			},
			showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"/>'
		});
	}
};

function aux_applica_filtro(){
	var contextMenu;
	// controllo campi
	// data inizio non può essere minore della data di inizio ricovero
	var daData = $('#txtDaData').val();
	if (daData!=""){
		var dFiltro = clsDate.str2date(daData,'DD/MM/YYYY'); // trasformo in date
		var dIni = clsDate.str2date(data_ini_rico,'YYYYMMDD'); // trasformo in Date		
		if (dFiltro < dIni){
			alert('La data di inizio periodo non può essere anteriore alla data di inizio ricovero');
			// la data viene rimessa a inizio ricovero nel reparto attuale
			$("#txtDaData").val(clsDate.str2str(data_ini_rico,'YYYYMMDD','DD/MM/YYYY'));
		}
	}
	else{
		$('#txtDaData').val(clsDate.str2str(data_ini_rico,'YYYYMMDD','DD/MM/YYYY'));
	}
	contextMenu="&CONTEXT_MENU="+(document.EXTERN.CONTEXT_MENU.value=='LETTURA'?"WK_DIARI_LETTURA":"");
	var url="servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_DIARI"+contextMenu+'&ILLUMINA=javascript:illumina(this.sectionRowIndex);';//&WHERE_WK=WHERE IDEN_VISITA=" + idenVisita+filtroDaData+filtroAData+filtroTipoDiario+contextMenu;
	applica_filtro(url);
}