var ELENCO_LOG = {
	
	init : function() {

		ELENCO_LOG.objWk = null;
			
		home.ELENCO_LOG	= this;
		
		home.NS_CONSOLEJS.addLogger({name : 'ELENCO_LOG', console : 0});
	    window.logger = home.NS_CONSOLEJS.loggers['ELENCO_LOG'];
	    

	    ELENCO_LOG.db = $.NS_DB.getTool({_logger : window.logger});
        
        /*** e faccio partire la ricerca da ieri ad oggi ***/
        var data_inizio_iso = $("#h-txtDaData").val() !== "" ? $('#h-txtDaData').val() : moment().subtract('days', 1).format('YYYYMMDD');
        $("#h-txtDaData").val(data_inizio_iso);
        var data_inizio = data_inizio_iso.substr(6,2) + '/' + data_inizio_iso.substr(4,2) + '/' + data_inizio_iso.substr(0,4);
        $("#txtDaData").val(data_inizio);
        
        chkTipoLOG.selectAll();
        ELENCO_LOG.setCmbOra();
        ELENCO_LOG.setLayout();
        ELENCO_LOG.initWk();
	},
	
	setEvents: function() {
		
		$('input').on('keyup', function(e) {
		    if (e.which == 13) {
		    	ELENCO_LOG.filterWk();
		    }
		});
		
		$("#butCerca").on("click", function(){ELENCO_LOG.filterWk()});
		$("#butSelezionaTutti").on("click", function(){ELENCO_LOG.selezionaTutti()});
		$("#butDeselezionaTutti").on("click", function(){ELENCO_LOG.deselezionaTutti()});		
	},
	
	selezionaTutti: function() {
		chkTipoLOG.selectAll();
	},
	
	deselezionaTutti: function() {
		chkTipoLOG.deselectAll();
	},
	
	setCmbOra : function() {

		var cmbOraInizio = $("#cmbOraInizio");
		var cmbOraFine = $("#cmbOraFine");
		
		for(var i=0; i<24; i++){
			var ora = i.toString().length == 1 ? '0' + i.toString() : i.toString();
			var optStart = $("<option/>", {value:ora}).text(ora);
			var optEnd = $("<option/>", {value:ora}).text(ora);
			cmbOraInizio.append(optStart);
			cmbOraFine.append(optEnd);

			if (ora == moment().add(1, 'hours').format('HH')) {
				optEnd.attr("selected",true);
				cmbOraFine.find("option[value=" + ora + "]").attr("selected",true);
			}
		}
	},
	
	setLayout: function() {
		$('#tabs-Elenco_LOG').hide();
		$('#divWkElencoLOG').height($('.contentTabs').height() - $('#fldRicerca').height() - 90);
	},
		
	initWk: function() {
		
		/*** di default filtro tra ieri ed oggi ***/
        var da_data = $("#h-txtDaData").val() !== "" ? $('#h-txtDaData').val() : moment().subtract('days', 1).format('YYYYMMDD');
        var a_data = $("#h-txtAData").val() !== "" ? $("#h-txtAData").val() : moment().format('YYYYMMDD');

        var da_ora = $("#cmbOraInizio").val() !== "" ? $("#cmbOraInizio").val() : '00';
        var a_ora = $("#cmbOraFine").val() !== "" ? $("#cmbOraFine").val() : moment().add(1, 'hours').format('HH');
		
		var tipo_LOG = $("#h-chkTipoLOG").val();
		
		ELENCO_LOG.objWk = new WK({
			id 			: "WK_ELENCO_LOG",
			container 	: "divWkElencoLOG",
			aBind 		: [ 'data_inizio', 'data_fine', 'tipo_LOG' ],
			aVal 		: [ da_data + da_ora, a_data + a_ora, tipo_LOG ]
		});
			
		ELENCO_LOG.objWk.loadWk();
	},
		
	filterWk: function() {
		
		/*** di default filtro tra ieri ed oggi ***/
        var da_data = $("#h-txtDaData").val() !== "" ? $('#h-txtDaData').val() : moment().subtract('days', 1).format('YYYYMMDD');
        var a_data = $("#h-txtAData").val() !== "" ? $("#h-txtAData").val() : moment().format('YYYYMMDD');

        var da_ora = $("#cmbOraInizio").val() !== "" ? $("#cmbOraInizio").val() : '00';
        var a_ora = $("#cmbOraFine").val() !== "" ? $("#cmbOraFine").val() : moment().add(1, 'hours').format('HH');
		
		var tipo_LOG = $("#h-chkTipoLOG").val();
						
		ELENCO_LOG.objWk.filter({
			aBind 		: [ 'data_inizio', 'data_fine', 'tipo_LOG' ],
			aVal 		: [ da_data + da_ora, a_data + a_ora, tipo_LOG ]
		});
	},
	
	setVerificato: function(data) {
		ELENCO_LOG.saveVerificato(data[0].IDEN, 'S');
	},
	
	unsetVerificato: function(data) {
		ELENCO_LOG.saveVerificato(data[0].IDEN, 'N');
	},
	
	saveVerificato: function(iden, verificato) {
		
		ELENCO_LOG.db.call_function(
				{
					id: 'PCK_TRACE_USER_ACTION.SEGNALAVERIFICATO',
					datasource: 'PORTALE_PIC',
					parameter: {
						"pIden" 	: {v: iden, t: 'N'},
						"pUser" 	: {v: home.baseUser.IDEN_PER, t: 'V'},
						"pVerif"	: {v: verificato, t: 'V'}
					}
				}
			).done(function(resp) {
				if (resp.p_result.indexOf('OK')==0) {
					home.NOTIFICA.success({
						'title'		: 'Success',
						'message'	: "Operazione di verifica registrata correttamente.",
						'timeout'	: 5
					});
					
					ELENCO_LOG.objWk.refresh();
				}else{
					home.NOTIFICA.error({
						'title'		: 'Attenzione',
						'message'	: "Errore nella procedura di verifica.",
						'timeout'	: 5
					});
				}
			}
		);
	},
	
	whereIfRiga: function(rec){
		return (LIB.isValid(rec) && rec.length == 1);
	},
	
	whereIfUnverified: function(rec){
		return(
				ELENCO_LOG.whereIfRiga(rec) && 
				rec[0].VERIFICATO != 'S' && 
				LIB.isValid(rec[0].IDEN) && rec[0].IDEN != ''
		);
	},
	
	whereIfVerified: function(rec){
		return(
				ELENCO_LOG.whereIfRiga(rec) && 
				rec[0].VERIFICATO == 'S' && 
				rec[0].UTE_VERIFICA == home.baseUser.IDEN_PER &&
				rec[0].DATA_VERIFICA_ISO >= moment().subtract(12, 'hours').format('YYYYMMDDHH')
		);
	}
};

$(document).ready(function() {
	
	ELENCO_LOG.init();
	ELENCO_LOG.setEvents();
});