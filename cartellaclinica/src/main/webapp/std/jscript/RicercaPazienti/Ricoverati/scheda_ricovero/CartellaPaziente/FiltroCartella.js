var FiltroCartella = {

	value : {
		LIVELLO:{LEFT:null,RIGHT:null},
		DA_DATA:{LEFT:null,RIGHT:null},
		A_DATA:{LEFT:null,RIGHT:null},
		NUMERO_RECORDS:{LEFT:null,RIGHT:null}
	},	
	div : null,
	Funzione : {
		/*
		<cod_funzione>:{
			LIVELLO:<valore>,
			DA_DATA:{enable:<boolean>,value:<valore>},
			A_DATA:{enable:<boolean>,value:<valore>},
			NUMERO_RECORDS:{enable:<boolean>,value:<valore>},					
		}
		*/
	},	
	
	reset:function(){
		FiltroCartella.Funzione = {};
	},
	
	logger:null,
	
	init : function(){

		FiltroCartella.div = $('div#divFiltroCartella');

		FiltroCartella.div.find('div[value="IDEN_VISITA"] div.btnMenu').click(openMenuAccessi);
		FiltroCartella.div.find('div[value="NUM_NOSOLOGICO"] div.btnMenu').click(openMenuRicoveri);
		FiltroCartella.div.find('div[value="ANAG_REPARTO"] div.btnMenu').click(openMenuReparti);
		FiltroCartella.div.find('div[value="ANAG_STRUTTURA"] div.btnMenu').click(openMenuStrutture);

		FiltroCartella.div.find('label').click(function(e){
				e.stopPropagation();
                if ($(this).parent().attr("value")=='IDEN_ANAG' && bloccaAperturaIpatient(CartellaPaziente.getPaziente("ID_REMOTO")))
                    return alert('Dati non disponibili in quanto il paziente ha negato il consenso privacy alla creazione del proprio fascicolo sanitario su sistema Onesys.');

				FiltroCartella.logger.info('Cambio filtro:' + $(this).parent().attr("value"));
				FiltroCartella.changeLivelloValue($(this).parent().attr("value"));
		});
		
		$('div#daData input')
		.on("blur",function(){
			FiltroCartella.changeDaDataValue($(this).val());
			})
		.datepick({
			onClose: function(){
				FiltroCartella.changeDaDataValue($('div#daData input').val());
			},
			minDate: function(){				
				switch(FiltroCartella.getLivelloValue()){
					case "IDEN_ANAG": 
					case "ANAG_REPARTO" :
					case "ANAG_STRUTTURA" : return clsDate.setData(getPaziente("DATA"),"00:00");
					case "NUM_NOSOLOGICO" :	return clsDate.setData(getRicovero("DATA_INIZIO"),"00:00");
					case "IDEN_VISITA" :	return clsDate.setData(getAccesso("DATA_INIZIO"),"00:00");
				}				
			},
			showOnFocus: false,
			showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"/>'
		})
		.parent().find('a').click(function(){
			FiltroCartella.addGiorniDaData(($(this).hasClass("previous")?-1:1));
		})
		;
		
		$('div#aData input')
		.on("blur",function(){
			FiltroCartella.changeADataValue($(this).val());
			})		
		.datepick({
			onClose: function(){
				FiltroCartella.changeADataValue($('div#aData input').val());
			},
			showOnFocus: false,
			showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"/>'
		})
		.parent().find('a').click(function(){
			FiltroCartella.addGiorniAData(($(this).hasClass("previous")?-1:1));
		});	
		
		$('#slNrRecord').change(function(){
			FiltroCartella.changeNrRecordsValue($(this).val());
		});
		
	},	

	setLivelloValue:function(pValue){
		FiltroCartella.logger.debug('setLivelloValue : ' + pValue);
		
		FiltroCartella.value['LIVELLO'][sezioneAttiva] = pValue;
		FiltroCartella.div.find('div.filtro').removeClass('selected');
		FiltroCartella.div.find('div[value="'+pValue+'"]').addClass("selected");		
	},
	
	getLivelloValue:function(){
		return FiltroCartella.value['LIVELLO'][sezioneAttiva];
	},
	
	changeLivelloValue:function(pValue){
			
		switch(pValue){
			case 'IDEN_VISITA':
					if(CartellaPaziente.getAccesso() == null)return openMenuAccessi();
				break;
			case 'NUM_NOSOLOGICO':
					if(CartellaPaziente.getRicovero() == null)return openMenuRicoveri();
				break;
			case 'ANAG_REPARTO':
					if(CartellaPaziente.getReparto() == null)return openMenuReparti();
					break;
			case 'ANAG_STRUTTURA':
					if(CartellaPaziente.getReparto("COD_STRUTTURA") == null)return openMenuStrutture();
					break;					
			case 'IDEN_ANAG':
				break;
		};	
		
		if(!FiltroCartella.div.find('div[value="'+pValue+'"]').hasClass("disabled")){
			FiltroCartella.Funzione[CartellaPaziente.getFunzione()]['LIVELLO'] = pValue;
			FiltroCartella.setLivelloValue(pValue);
		}		
		refreshPage();
	},		
	
	setDaDataValue:function(pObj){

		FiltroCartella.value['DA_DATA'][sezioneAttiva] = pObj;
		if (pObj['value'] != null && pObj['value'] != ""){
			$('#daData input').val(clsDate.str2str(pObj.value,'YYYYMMDD','DD/MM/YYYY'));
		}
	},
	
	getDaDataEnable:function(){		
		return FiltroCartella.value['DA_DATA'][sezioneAttiva].enable;
	},
	
	getDaDataValue:function(){
		return FiltroCartella.value['DA_DATA'][sezioneAttiva].value;
	},	
		
	changeDaDataValue:function(pValue){
		FiltroCartella.value['DA_DATA'][sezioneAttiva].value = clsDate.str2str(pValue,'DD/MM/YYYY','YYYYMMDD');	
		$('#daData input').val(pValue);	
		if(FiltroCartella.getADataValue() < FiltroCartella.getDaDataValue()){
			FiltroCartella.changeADataValue(clsDate.str2str(FiltroCartella.getDaDataValue(),'YYYYMMDD','DD/MM/YYYY'));
		}		
	
	},
	
	addGiorniDaData:function(pValue){
		var new_date = clsDate.dateAdd(clsDate.str2date(FiltroCartella.getDaDataValue(),'YYYYMMDD'),'D',pValue);				
		FiltroCartella.changeDaDataValue(clsDate.getData(new_date,'DD/MM/YYYY'));	
	},
	
	setADataValue:function(pObj){		
		FiltroCartella.value['A_DATA'][sezioneAttiva] = pObj;
		if (pObj['value'] != null && pObj['value'] != ""){
			$('#aData input').val(clsDate.str2str(pObj.value,'YYYYMMDD','DD/MM/YYYY'));
		}
	},
	
	getADataEnable:function(){
		return FiltroCartella.value['A_DATA'][sezioneAttiva].enable;
	},
	
	getADataValue:function(){
		return FiltroCartella.value['A_DATA'][sezioneAttiva].value;
	},		

	changeADataValue:function(pValue){
		FiltroCartella.value['A_DATA'][sezioneAttiva].value = clsDate.str2str(pValue,'DD/MM/YYYY','YYYYMMDD');
		$('#aData input').val(pValue);	
		if(FiltroCartella.getADataValue() < FiltroCartella.getDaDataValue()){
			FiltroCartella.changeDaDataValue(clsDate.str2str(FiltroCartella.getADataValue(),'YYYYMMDD','DD/MM/YYYY'));
		}		
		// refreshPage();		
	},
	
	addGiorniAData:function(pValue){
		var new_date = clsDate.dateAdd(clsDate.str2date(FiltroCartella.getADataValue(),'YYYYMMDD'),'D',pValue);				
		FiltroCartella.changeADataValue(clsDate.getData(new_date,'DD/MM/YYYY'));	
	},	
	
	setNrRecordsValue:function(pObj){
		// Imposto il Valore dell'Oggetto (Alla Prossima Chiamata Non Prendo le Configurazioni Iniziali)
		FiltroCartella.value['NUMERO_RECORDS'][sezioneAttiva] = pObj;		

		// Compongo le Option della Select
		var valoreOption	= ModalitaCartella.basic['NUMERO_RECORDS']['DATI_LABORATORIO'].value_select();
		valoreOption		= valoreOption.split(',');
		
		fill_select('slNrRecord', valoreOption,valoreOption);
		selectOptionByText('slNrRecord', pObj.value);
	},
	
	getNrRecordsValue:function(){
		return FiltroCartella.value['NUMERO_RECORDS'][sezioneAttiva].value;
	},
	
	getNrRecordsEnable:function(){
		return FiltroCartella.value['A_DATA'][sezioneAttiva].enable;
	},

	changeNrRecordsValue:function(pValue){
		FiltroCartella.value['NUMERO_RECORDS'][sezioneAttiva].value = pValue;	
	},
	
	getIdenRiferimento:function(pDati){
		switch(FiltroCartella.getLivelloValue()){
			case 'IDEN_VISITA':   return pDati.iden_visita;
			case 'NUM_NOSOLOGICO':return pDati.iden_ricovero;
			default : return '';
		}
	},

	getIdenRiferimentoInserimento:function(pDati){
		switch(ModalitaCartella.getTipoInserimento(pDati)){
			case 'IDEN_VISITA':   return pDati.iden_visita;
			case 'NUM_NOSOLOGICO':return pDati.iden_ricovero;
			default : return '';
		}
	},

	disableFiltroLivello:function(pDati){
		FiltroCartella.setLivelloValue('');
		$('div#intest label.head').hide().next().hide();

		FiltroCartella.showLabel("lblFunzione");

		if(getAccesso("IDEN") 	!= ''){
			FiltroCartella.showLabel("lblDataInizio");
			FiltroCartella.showLabel("lblDataFine");
		}
		if(getRicovero("IDEN") 	!= ''){
			FiltroCartella.showLabel("lblCartella");
		}
		if(getReparto("COD_CDC")	!= ''){
			FiltroCartella.showLabel("lblReparto");
		}		
	},
	
	disableFiltroData:function(pDati){
		FiltroCartella.FiltroData.daData.enable(false);
		FiltroCartella.FiltroData.aData.enable(false);
	},
	
	FiltroData:{
		daData:{
			enable:function(bool){
				if(bool){
					$('#divFiltroCartellaDate #daData').show();
				}else{
					$('#divFiltroCartellaDate #daData').hide();
				}								
			}
		},
		
		aData:{
			enable:function(bool){
				if(bool){
					$('#divFiltroCartellaDate #aData').show();
				}else{
					$('#divFiltroCartellaDate #aData').hide();
					//FiltroCartella.value['A_DATA'][sezioneAttiva] = {enable : bool,value:''};
				}
				
			}
		}
	},	
	
	disableFiltroNrRecords:function(pDati){
		FiltroCartella.FiltroNrRecords.enable(false);
	},
	
	FiltroNrRecords : {
		enable : function(bool){
			if(bool){
				$('#divFiltroNrRecords').show();
			}else{;
				$('#divFiltroNrRecords').hide();
			}
		}
	},
	off:function(pDati){
		FiltroCartella.disableFiltroLivello(pDati);
		FiltroCartella.disableFiltroData(pDati);
	},

	check : function(){
		if(typeof FiltroCartella.Funzione[CartellaPaziente.getFunzione()] == 'undefined'){
			FiltroCartella.Funzione[CartellaPaziente.getFunzione()] = {};
		}			

	},
		
	checkFiltroLivello:function(pDati){
		
		FiltroCartella.logger.debug('checkFiltroLivello : ' + FiltroCartella.Funzione[CartellaPaziente.getFunzione()]);
		
		var filtri_funzione = FiltroCartella.Funzione[CartellaPaziente.getFunzione()];
		if(typeof filtri_funzione['LIVELLO'] == 'undefined'){//se Ã¨ la prima apertura prendo la configurazione
			filtri_funzione['LIVELLO'] = ModalitaCartella.getFilter(pDati);
		}
		FiltroCartella.setLivelloValue(filtri_funzione['LIVELLO']);

		var _filters = ModalitaCartella.getFilters(pDati);

		FiltroCartella.div.find('div.filtro').hide();
		FiltroCartella.logger.debug('checkFiltroLivello : start loop');
		for(var i in _filters){
			
			FiltroCartella.logger.debug('checkFiltroLivello : looping['+i+']');
			
			var _filtro = FiltroCartella.div.find('div[value="'+i+'"]');
			
			//if(_filters[i].enable)
				_filtro.show().find('label').text(_filters[i].label);
			
			_filtro.removeClass("disabled")
			if(!_filters[i].enable){
				_filtro.addClass("disabled")
			}
			
			if(_filters[i].menu){
				_filtro.find('.btnMenu').show();
			}else{
				_filtro.find('.btnMenu').hide();
			}
		}
		
		FiltroCartella.logger.debug('checkFiltroLivello : end loop');
		
		$('div#intest label.head').hide().next().hide();
		FiltroCartella.div.show().prev().show();
		pLabels = ModalitaCartella.getVisibleLabels()[FiltroCartella.getLivelloValue()];
		if(typeof pLabels != 'undefined'){
			for(var i=0;i<pLabels.length;i++){
				FiltroCartella.showLabel(pLabels[i]);
			}
			
		}				
	},
	
	checkFiltroDaData:function(pDati){
		
		// Oggetto Parametri di Ogni Funzione
		var filtri_funzione = FiltroCartella.Funzione[CartellaPaziente.getFunzione()];
		
		FiltroCartella.logger.info('checkFiltroDaData : ' + typeof filtri_funzione['DA_DATA']);
		// Alla Prima Apertura prendo la configurazione Generale
		if(typeof filtri_funzione['DA_DATA'] == 'undefined'){
				
				var FiltroDaData = ModalitaCartella.getFilterData(pDati)['DA_DATA'];							
				
				var FiltroValue = null;
				if(FiltroDaData.enable){
					// Reperisco valore Filtro				
					FiltroValue = typeof FiltroDaData.value == 'function' ? FiltroDaData.value() : FiltroDaData.value;
				}				
				
				filtri_funzione['DA_DATA'] = {enable:FiltroDaData.enable,value:FiltroValue};
				
		}
		
		FiltroCartella.setDaDataValue(filtri_funzione['DA_DATA']);
		FiltroCartella.FiltroData.daData.enable(FiltroCartella.getDaDataEnable());		
	},	
	
	checkFiltroAData:function(pDati){
		
		var filtri_funzione = FiltroCartella.Funzione[CartellaPaziente.getFunzione()];

		// Alla Prima Apertura prendo la configurazione Generale
		if(typeof filtri_funzione['A_DATA'] == 'undefined'){
				
				var FiltroAData = ModalitaCartella.getFilterData(pDati)['A_DATA']; 
				
				var FiltroValue = null;
				// Mostro/Nascondo Sezione Filtro 'Da Data'
				if(FiltroAData.enable){
				// Imposto il Valore dell'Input				
					FiltroValue = typeof FiltroAData.value == 'function' ? FiltroAData.value() : FiltroAData.value;
				}

				filtri_funzione['A_DATA'] = {enable:FiltroAData.enable,value:FiltroValue};
				
		}
		
		FiltroCartella.setADataValue(filtri_funzione['A_DATA']);
		FiltroCartella.FiltroData.aData.enable(FiltroCartella.getADataEnable());

	},	
	
	checkFiltroNrRecords:function(pDati){
		
		// Crea oggetto FiltroCartella.Funzione per la Proprieta 'NUMERO_RECORDS'
		var filtri_funzione = FiltroCartella.Funzione[CartellaPaziente.getFunzione()];
		
		FiltroCartella.logger.info('checkFiltroNrRecords : ' + filtri_funzione['NUMERO_RECORDS']);		
		
		// Alla Prima Apertura prendo la configurazione Generale
		if(typeof filtri_funzione['NUMERO_RECORDS'] == 'undefined'){
				
			// Ritorna Oggetto con Configurazione Iniziale per la Proprieta 'NUMERO_RECORDS'
			var FiltroNrRecords = ModalitaCartella.getFilterNrRecords(pDati);	
				
			var FiltroValue = null;
			
			// Sel Proprietà enable dell'Oggetto è True salvo il Value (valore di CC_CONFIGURA_REPARTO per il KEY 'VISUALIZZATORE_NUM_RICH')
			if(FiltroNrRecords.enable)							
				FiltroValue = typeof FiltroNrRecords.value == 'function' ? FiltroNrRecords.value() : FiltroNrRecords.value;
			
			filtri_funzione['NUMERO_RECORDS'] = {enable:FiltroNrRecords.enable,value:FiltroValue};				
		}
		// Valorizza la Select e FiltroCartella.value 
		FiltroCartella.setNrRecordsValue(filtri_funzione['NUMERO_RECORDS']);
		// Visualizzo Il Filtro
		FiltroCartella.FiltroNrRecords.enable(FiltroCartella.getNrRecordsEnable());
	},
	
	showLabel:function(pIdLabel){
		var vLabel = $('#' + pIdLabel);
		
		if (vLabel.text()!='')
			vLabel.show().prev().show();
	}

};
