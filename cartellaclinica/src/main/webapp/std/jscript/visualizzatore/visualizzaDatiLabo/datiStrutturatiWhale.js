var WindowCartella 	= null;
var _V_DATI			= null;
var _CONTEXT		= null;
var _PROV_CAHIAMATA	= null;
var _USER_LOGIN		= null;
var _NUM_RICHIESTE	= 5;
var _IDX_REFRESH 	= 0;
var _TIPO_RICOVERO	= null;
var _V_FILTRO = {
	'numRichieste' : 5,
	'daData' : '',
	'aData' : '',
	'elencoEsami' : '',
	'provRisultati' : '',
	'idenAnag' : ''
}


jQuery(document).ready(function(){
	
	window.WindowCartella = window;   
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    } 
	NS_DATI_LABO.init();
	 
});

var NS_DATI_LABO = {
	
	init:function(){
		
		NS_DATI_LABO.definisciComportamento();
		NS_DATI_LABO.setEvents();
		NS_DATI_LABO.setStyles();
		NS_DATI_LABO.NS_FILTRI_FUNZIONI.loadIframe();
		
	},
	
	// Gestione Apertura in Cartella o Fuori (MMG)
	definisciComportamento : function(){
	
		var provenienza	= NS_UTILITY.getUrlParameter('provChiamata');
		// alert('Provenienza: ' + NS_UTILITY.getUrlParameter('provChiamata'));
		if(provenienza == '' || provenienza == 'CARTELLA'){ 
		
			_CONTEXT				= 'CARTELLA';
			_V_DATI					= WindowCartella.getForm();
			_USER_LOGIN				= WindowCartella.baseUser.LOGIN;
			
			_V_FILTRO.numRichieste	= WindowCartella.baseReparti.getValue(_V_DATI.reparto,"VISUALIZZATORE_NUM_RICH").split('#')[1];
			_V_FILTRO.idenAnag		= NS_UTILITY.getUrlParameter('idenAnag');

		}else if(provenienza == 'MMG'){
			
			_CONTEXT			= 'MMG';
			_V_DATI = {
				'idRemoto' 		: NS_UTILITY.getUrlParameter('idPatient'),
				'reparto' 		: 'MMG',
				'provenienza' 	: 'ESTERNO_CARTELLA'
			}
			
			_USER_LOGIN				= NS_UTILITY.getUrlParameter('userLogin');
			_V_FILTRO.numRichieste	= NS_UTILITY.getUrlParameter('numRichieste');
			_V_FILTRO.idenAnag		= NS_UTILITY.getUrlParameter('idenAnag');
			
			$('.pulsWkRich').hide();
			$('#divAddRisultato').hide();			

		}else if(provenienza == 'AMBULATORIO'){
			
			_CONTEXT			= 'AMBULATORIO';
			_V_DATI = {
				'idRemoto' 		: '',
				'reparto' 		: 'AMBULATORIO',
				'provenienza' 	: 'ESTERNO_CARTELLA'
			}
			_V_FILTRO.numRichieste	= NS_UTILITY.getUrlParameter('numRichieste');
			_V_FILTRO.idenAnag		= NS_UTILITY.getUrlParameter('idenAnag');
			_USER_LOGIN				= NS_UTILITY.getUrlParameter('userLogin');
			var vResp				= executeStatement("datiStrutturatiLabo.xml","getInfoPaziente",[_V_FILTRO.idenAnag],4);
			_V_DATI.idRemoto 		= vResp[5]

		}else if(provenienza == 'IPATIENT'){
			
			_CONTEXT			= 'IPATIENT';
			_V_DATI = {
				'idRemoto' 		: '',
				'reparto' 		: 'IPATIENT',
				'provenienza' 	: 'ESTERNO_CARTELLA'
			}
			_V_FILTRO.numRichieste	= NS_UTILITY.getUrlParameter('numRichieste');
			_V_FILTRO.idenAnag		= NS_UTILITY.getUrlParameter('idenAnag');
			_USER_LOGIN				= NS_UTILITY.getUrlParameter('userLogin');
			_V_DATI.idRemoto 		= NS_UTILITY.getUrlParameter('idPatient');
			
			$('.pulsWkRich').hide();
			$('#divAddRisultato').hide();

		}
		
		_PROV_CAHIAMATA	= _CONTEXT;			

	},		
			
	setEvents : function(){

		NS_DATI_LABO.EVENTS.setGenericEvents();
		NS_DATI_LABO.EVENTS.openSceltaEsamiVisualizzazione();
		NS_DATI_LABO.EVENTS.setInputDatepicker();			
	
	},
	
	setStyles : function(){
	
		NS_DATI_LABO.STYLES.setGenericStyle();
		
		if(_CONTEXT == 'CARTELLA' || _CONTEXT == 'AMBULATORIO')
			NS_DATI_LABO.STYLES.setHeightIframeInCartella();
		else
			NS_DATI_LABO.STYLES.setHeightIframeOutCartella();	
	
	},
	
	STYLES :{
		
		setGenericStyle : function(){
		
			$("td[class~='tdIntAltriRep']").css("position","relative");
			$("td[class~='tdIntAltriRep']").each(function(){
				$(this).append("<div title='"+$(this).attr('DESCRPROV')+"' style='position:absolute;top:-0px;right:-0px' class='triangoloNote'></div>");
			});		
		
		},
		
		setHeightIframeInCartella : function(){

			var height 	= $(window.parent).height() - 140;
			$('#iframeGriglia').css({'height' : height + 'px'});
		
		},
		
		setHeightIframeOutCartella : function(){
			
			var height 	= $(window.parent).height() - 50;
			$('#iframeGriglia').css({'height' : height+'px','overflow':'scroll'});
		
		}
	},
	
	EVENTS : {
	
		setGenericEvents : function(){
		
			// Set Title Provenienza - propertychange keyup input paste
			$('#lblElencoProvenienza').hide();
			$('#lblElencoProvenienza').bind("propertychange keyup input paste",function(){
				
				if($(this).text() == '')
					$('#lblSceltaProvenienza').attr('title','Provenienze Selezionate: ').removeClass('esamiSelezionatiTrue');				
				else
					$('#lblSceltaProvenienza').attr('title','Provenienze Selezionate: ' + $('#lblElencoProvenienza').text()).addClass('esamiSelezionatiTrue');								
			});
			
			$('#inpFiltroDaData').bind("propertychange keyup input paste",function(){				
				NS_UTILITY.impostaFiltroDate();
			});
			$('#inpFiltroAData').bind("propertychange keyup input paste",function(){				
				NS_UTILITY.impostaFiltroDate();
			});
		
		},
		
		setInputDatepicker : function(){
			
			// Datepicker Evento e Limitazioni
			NS_UTILITY.controlloData('inpFiltroDaData');
			NS_UTILITY.controlloData('inpFiltroAData');
			NS_UTILITY.setDatepicker('inpFiltroDaData');
			NS_UTILITY.setDatepicker('inpFiltroAData');
			
			// Set Today input aData - Non USO clsdate perché Fuori dalla Cartella potrei NON Averlo
			var date 	= new Date(); 
			var day		= '0' + date.getDate(); day	= day.substring((day.length-2),day.length);
			var month	= '0' + (date.getMonth()+1); month = month.substring((month.length-2),month.length);			
			var year	= date.getFullYear();			
			
			$('#inpFiltroAData').val(day + '/' + month + '/' + year);
			NS_UTILITY.impostaFiltroDate();
		
		},
		
		openSceltaEsamiVisualizzazione : function(){
		
			$('#lblSceltaEsamiProfili').click(function(){
			
				$.fancybox({
					'padding'	: 3,
					'width'		: $(document).width()/10*9,
					'height'	: $(document).height()/10*8,
					'href'		: 'servletGenerator?KEY_LEGAME=SCELTA_ESAMI_PROFILI_DATI_STRUTTURATI&REPARTO='+ _V_DATI.reparto,
					'type'		: 'iframe',
					'showCloseButton':false
				});
				
			});
		
		}
	},
	
	CHECK : {
		
		checkDaDataTutte : function(){
			
			var cmbRichieste	= $('select[name="selectRichieste"]').val();
			var	elencoEsami		= $('#hEsamiFiltro').val();
			
			if(cmbRichieste == 'TUTTE' && elencoEsami == '' && _CONTEXT != 'CARTELLA'){
				alert('Per Visualizzare Tutti i Dati del Paziente é Necessario Selezionare Almeno una Prestazione');
				try{WindowCartella.utilMostraBoxAttesa(false)}catch(e){alert(e.edscription)}
				return false;
			}
			return true;			
		},
		
		checkDateFormat : function(){
		
			try{
				inpDaData	= parseInt(_V_FILTRO['daData']);
				inpAData	= parseInt(_V_FILTRO['aData']);
			}catch(e){
				alert('Verificare il Formato delle Date Inserite')
				return false;
			}
			
			return true;
		},
		
		checkPeriodoDate : function(){
			
			var a 	= parseInt(_V_FILTRO['daData']);
			var b 	= parseInt(_V_FILTRO['aData']);
			
			if(a > b)
				$('#inpFiltroDaData').val( _V_FILTRO['aData'].substr(6,2) +'/'+  _V_FILTRO['aData'].substr(4,2) +'/'+ _V_FILTRO['aData'].substr(0,4));
			
			return true;
		}
		
	},
	
	NS_FILTRI_FUNZIONI : {

		loadIframe:function(pParametriExtra){
		
			url = 'servletGeneric?class=cartellaclinica.cartellaPaziente.Visualizzatore.html.listDocumentLabWhale.listDocumentLaboratorioGriglia&provChiamata=' + _CONTEXT;	

			if(_CONTEXT == 'CARTELLA'){
				
				var idenRichiesta	= NS_UTILITY.getUrlParameter('idenRichiesta');
				var numRichieste	= WindowCartella.baseReparti.getValue(_V_DATI.reparto,"VISUALIZZATORE_NUM_RICH").split('#')[1];
				
				if (!isNaN(idenRichiesta)){
					
					// Chiamata da Wk Ricoverati
					url	+= '&reparto=' + _V_DATI.reparto + '&daData=' + _V_FILTRO.daData + '&aData=' + _V_FILTRO.aData;
					switch (WindowCartella.FiltroCartella.getLivelloValue())
					{
						case 'ANAG_REPARTO': 	
							
							url += '&idPatient=' + _V_DATI.idRemoto;
							break;
						
						case 'NUM_NOSOLOGICO':
							
							if(_V_DATI.iden_prericovero == null || _V_DATI.iden_prericovero == "")
								url += '&nosologico=' + _V_DATI.ricovero;
							else
								url += '&nosologico=' + _V_DATI.ricovero + ',' + _V_DATI.prericovero;
							
							break;
					}
					
					// Passo il Parametro del Numero Richieste
					url += '&numRichieste=' + _V_FILTRO.numRichieste; 
					
				}else{		
					
					// Chiamata da Wk Richieste
					url += 'idenRichiesta=' + idenRichiesta + '&reparto='+pParametri.reparto;
					
				}
				
			}else{
				// Chiamata da Fuori Cartella (MMG o AMBULATORIO o IPATIENT)
				url += '&reparto=' + _V_DATI.reparto + '&idPatient=' + _V_DATI.idRemoto  + '&numRichieste=' + _V_FILTRO.numRichieste;
				// url += '&reparto=' + _V_DATI.reparto + '&idPatient=' + _V_DATI.idRemoto  + '&numRichieste=' + _V_FILTRO.numRichieste + '&daData=' + _V_FILTRO.daData + '&aData=' + _V_FILTRO.aData;
			}
			
			if(typeof pParametriExtra != 'undefined')
				url	+= pParametriExtra;
				
			// servletGeneric?class=cartellaclinica.cartellaPaziente.Visualizzatore.html.listDocumentLabWhale.listDocumentLaboratorioFiltro&reparto=UTIM_SV&nosologico=&elencoEsami=&numRichieste=10&idPatient=SCCLCU84D23I480Q&daData=&aData=20130211&provRisultati=&provChiamata=MMG&userLogin=arry&idenAnag=667572
			if(_USER_LOGIN == 'arry' )
				alert('Alert Debug Solo per User Arry! \n - Load Iframe: ' + url);

			NS_DATI_LABO.NS_FILTRI_FUNZIONI.setSrcIframe(url);
		},
				
		aggiornaDatiStrutturati : function(){
	
			var extraParameter		= '';
			_V_FILTRO.numRichieste	= $('select[name="selectRichieste"]').val();
			_V_FILTRO.elencoEsami	= $('#hEsamiFiltro').val();
			_V_FILTRO.provRisultati	= $('#hProvenienzaFiltro').val();			

			try{WindowCartella.utilMostraBoxAttesa(true)}catch(e){};
						
			extraParameter	= '&elencoEsami=' + encodeURIComponent(_V_FILTRO.elencoEsami) + '&provRisultati='+_V_FILTRO.provRisultati;	
			
			if(!NS_DATI_LABO.CHECK.checkDateFormat())
				return;
				
			if(!NS_DATI_LABO.CHECK.checkPeriodoDate())
				return;
			
			if(!NS_DATI_LABO.CHECK.checkDaDataTutte())
				return;
			
			NS_DATI_LABO.NS_FILTRI_FUNZIONI.loadIframe(extraParameter);
				
		},
		
		// Apri Pagina Inserimento Manuale Risultati
		addRisultato : function(){
	
			$.fancybox({
				'padding'	: 3,
				'width'		: $(document).width()/10*9,
				'height'	: $(document).height()/10*3,
				'href'		: 'servletGenerator?KEY_LEGAME=ADD_DATI_STRUTTURATI',
				'type'		: 'iframe',
				'showCloseButton':false
			});
		},
		
		setSrcIframe:function(url){
			$("#iframeGriglia").attr("src", url);
		}	
	
	},
	
	NS_FILTRI_EXPORT : {
		
		esportaPdf : function(){

			/*	
			 *  2 orientamenti -> 2 report
			 * 	1 == verticale
			 * 	0 == orizzontale
			*/
	
			var sf			 = '';
			var anteprima	 = 'S';		
			var reparto		 = $('input#reparto').val();
			
			var elencoTestate		= '';
			$('#iframeGriglia').contents().find('#tabellaInt td').each(function(index, value){
				elencoTestate	= elencoTestate != '' ? elencoTestate += ',' : elencoTestate;
				elencoTestate	+= $(this).attr('IDEN_RICHIESTA').split('|')[0].replace("'","");
			});			
			
			var elencoEsami				= $('input#hEsamiFiltro').val();
			$('#iframeGriglia').contents().find('.colGraf').each(function(){
				elencoEsami	= elencoEsami != '' ? elencoEsami += ',' : elencoEsami;
				elencoEsami	+= $(this).attr('codiceEsame');				
			});	

			// alert(' - Reparto: ' + reparto + '\n - Elenco Esami: ' + elencoEsami + '\n - Elenco Richieste: ' + elencoTestate + '\n Iden Anag: ' + _V_FILTRO.idenAnag);
	
			var orientamento	= _CONTEXT == 'CARTELLA' ? orientamento = WindowCartella.baseReparti.getValue(reparto,"orientamentoStampaDatiLabo") : orientamento = 1;
			var funzione		= orientamento == 1 ? funzione = 'LABO_DATI_STRUTTURATI_VERTICALE' : funzione = 'LABO_DATI_STRUTTURATI_ORIZZONTALE';

			sf	= '&prompt<pReparto>='+_V_DATI.reparto+'&prompt<pOrientamento>='+orientamento+'&prompt<pIdenAnag>='+_V_FILTRO.idenAnag+'&prompt<pElencoTestate>='+elencoTestate+'&prompt<pElencoEsami>=' + escape(escape(elencoEsami));
			
			// alert(sf)
			if (_CONTEXT == 'CARTELLA')
				WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,null);
			else{
				var url =  'elabStampa?stampaFunzioneStampa=' + funzione + '&stampaAnteprima=S&stampaReparto=ASL2&stampaSelection='+sf+'&ServletStampe=N';
				var finestra = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
			    try{
			    	WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
					}
			    catch(e){}
				
			}
	
		},
	
		AutomateExcel:function(){
		
			// Start Excel and get Application object.
			var oXL = new ActiveXObject("Excel.Application");
			   
			oXL.Visible = true;
			
		   	// Get a new workbook.
			var oWB = oXL.Workbooks.Add();
			var oSheet = oWB.ActiveSheet;
			   
			// dati anagrafici
			if(true){
				oSheet.Cells(1, 1).Value = "COGNOME:";
			  	oSheet.Cells(1, 1).Font.Bold=true;
			  	oSheet.Cells(2, 1).Value = "NOME:";
			  	oSheet.Cells(2, 1).Font.Bold=true;
			  	oSheet.Cells(3, 1).Value = "DATA DI NASCITA:";
			  	oSheet.Cells(3, 1).Font.Bold=true;
			  	oSheet.Cells(4, 1).Value = "CODICE FISCALE:";
			  	oSheet.Cells(4, 1).Font.Bold=true;
			  	oSheet.Cells(1, 2).Value = $('#iframeGriglia').contents().find('#cognome').val();//WindowCartella.getPaziente("COGN");
			  	oSheet.Cells(1, 2).HorizontalAlignment = -4108;
			  	oSheet.Cells(2, 2).Value = $('#iframeGriglia').contents().find('#nome').val();//WindowCartella.getPaziente("NOME");
			  	oSheet.Cells(2, 2).HorizontalAlignment = -4108;
			  	oSheet.Cells(3, 2).Value = $('#iframeGriglia').contents().find('#datanasc').val();//WindowCartella.getPaziente("DATA").substring(6,8)+"/"+WindowCartella.getPaziente("DATA").substring(4,6)+"/"+WindowCartella.getPaziente("DATA").substring(0,4);
			  	oSheet.Cells(3, 2).HorizontalAlignment = -4108;
			  	oSheet.Cells(4, 2).Value = $('#iframeGriglia').contents().find('#codfisc').val();//WindowCartella.getPaziente("ID_REMOTO");
			  	oSheet.Cells(4, 2).HorizontalAlignment = -4108;
			}
			  
			// Intestazione Sinistra
			var rigaInizioInt;
			$("#iframeGriglia").contents().find("#tabellaBloc th").each(function(index,value) {
				if (index>0){
					var contenutoCella = $(this).text();
					contenutoCella = contenutoCella.replace("<BR>"," ").replace("&nbsp;","");
					oSheet.Cells(6, index).Value = contenutoCella;
					oSheet.Cells(6, index).Font.Bold=true;
					oSheet.Cells(6, index).HorizontalAlignment = -4108;
					oSheet.Cells(6, index).Borders.LineStyle = 1;
					oSheet.Cells(6, index).Borders.Weight = 2;
					rigaInizioInt = index;
				}
			});
			
			// Intestazione Destra
			$("#iframeGriglia").contents().find("#tabellaInt tr td").each(function(index,value) {
				index = index+1; //index parte da 0, lo sposto a 1
				var contenutoCella = $(this).text();
				contenutoCella = contenutoCella.replace("<BR>"," ").replace("&nbsp;","").substr(0,2) + '.' + contenutoCella.replace("<BR>"," ").replace("&nbsp;","").substr(3,2) + '.' + contenutoCella.replace("<BR>"," ").replace("&nbsp;","").substr(6,4)+ ' ' +contenutoCella.replace("<BR>"," ").replace("&nbsp;","").substr(10,5);
				oSheet.Cells(6, index + rigaInizioInt).Value =  contenutoCella;
				oSheet.Cells(6, index + rigaInizioInt).Font.Bold=true;
				oSheet.Cells(6, index + rigaInizioInt).HorizontalAlignment = -4108;
				oSheet.Cells(6, index + rigaInizioInt).Borders.LineStyle = 1;
				oSheet.Cells(6, index + rigaInizioInt).Borders.Weight = 2;
			});	
			
	
			// Dati
			var indexRighe;
			$("#iframeGriglia").contents().find("#tabellaLeft tr").each(function(indexRow,value) {
				//index parte da 0, lo sposto a 1
				indexRighe = indexRow;
				if ($(this).hasClass('rigaGruppo')){

					oSheet.Cells(indexRow+7, 1).Value = $(this).text().replace("<BR>"," ").replace("&nbsp;","");
					oSheet.Cells(indexRow+7, 1).Font.Bold=true;
					oSheet.Cells(indexRow+7, 1).HorizontalAlignment = -4108;
					oSheet.Cells(indexRow+7, 1).Borders.LineStyle = 1;
					oSheet.Cells(indexRow+7, 1).Borders.Weight = 2;					
					
				}else{ 
					
					var indexFineTableLeft;
					$(this).find('td').each(function(indexCol,value) {
						if (indexCol>0){
							oSheet.Cells(indexRow+7, indexCol).Value = $(this).text().replace("<BR>"," ").replace("&nbsp;","");
							oSheet.Cells(indexRow+7, indexCol).HorizontalAlignment = -4108;   
							oSheet.Cells(indexRow+7, indexCol).Borders.LineStyle = 1;
							oSheet.Cells(indexRow+7, indexCol).Borders.Weight = 2;
							indexFineTableLeft = indexCol;
						}
					});
					
					indexFineTableLeft = indexFineTableLeft+1;
					$("#iframeGriglia").contents().find('#datiTable tr').eq(indexRighe).find('td').each(function(idx,value){
						oSheet.Cells(indexRighe+7, idx + indexFineTableLeft).Value = $(this).text().replace("<BR>"," ").replace("&nbsp;","");
						oSheet.Cells(indexRighe+7, idx + indexFineTableLeft).HorizontalAlignment = -4108;   
						oSheet.Cells(indexRighe+7, idx + indexFineTableLeft).Borders.LineStyle = 1;
						oSheet.Cells(indexRighe+7, idx + indexFineTableLeft).Borders.Weight = 2;			
						
					});
				}
			});	
	
			oSheet.columns.autofit;
			   
		   	// Make sure Excel is visible and give the user control of Excel's lifetime.
			oXL.Visible = true;
			oXL.Visible = false;
			oXL.Visible = true;
			oXL.UserControl = true;
		}
	}
	
};

NS_UTILITY = {
	
	getUrlParameter : function(name){
	
		var tmpURL = document.location.href;
		var regexS = "[\\?&]"+name+"=([^&#]*)";
		var regex = new RegExp( regexS );
		var results = regex.exec( tmpURL );
		
		if( results == null )
			return "";
		else
			return results[1];
	},
	
	setDatepicker:function(idElemento){
		$('#' + idElemento).datepick({
			onClose : function(){
				NS_UTILITY.impostaFiltroDate();
			},
			showOnFocus: false,
			minDate: function(){				
				if(_CONTEXT == 'CARTELLA')
				{
					switch(WindowCartella.FiltroCartella.getLivelloValue()){
						case "IDEN_ANAG": 
						case "ANAG_REPARTO" : 	return parent.clsDate.setData(parent.getPaziente("DATA"),"00:00");
						case "NUM_NOSOLOGICO" :	return parent.clsDate.setData(parent.getRicovero("DATA_INIZIO"),"00:00");
						case "IDEN_VISITA" :	return parent.clsDate.setData(parent.getAccesso("DATA_INIZIO"),"00:00");
					}
				
				}else{
					var d = new Date(); d.setDate(d.getDate()-365);
					return d;
				}
			},
			showTrigger: '<img class="trigger" src="imagexPix/calendario/cal20x20.gif" class="trigger"/>'
		});		
	},
	
	controlloData:function(id){
		
		try {
			var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
			oDateMask.attach(document.getElementById(id));
		}catch(e){
			alert('Applicazione maschera data in errore: '+e.description);
		}
	},
	
	impostaFiltroDate : function(){

		var inpDaData	= $('#inpFiltroDaData').val();
		var inpAData	= $('#inpFiltroAData').val();
		
		if(inpDaData.length > 0)
			inpDaData	= inpDaData.substr(6,4) + inpDaData.substr(3,2) + inpDaData.substr(0,2);
		else{
			
			if(_CONTEXT == 'CARTELLA'){
				/* inpDaData	= WindowCartella.getRicovero("DATA_ORA_INIZIO").substring(0,8);
			}else{
				var date 	= new Date(); 
				var day		= '0' + date.getDate(); day	= day.substring((day.length-2),day.length);
				var month	= '0' + (date.getMonth()+1); month = month.substring((month.length-2),month.length);			
				var year	= (date.getFullYear()-1);
				inpDaData	= year + month + day;
			}*/
				switch (WindowCartella.FiltroCartella.getLivelloValue())
				{				 						
					case 'ANAG':
					case 'ANAG_REPARTO':
						break;
					case 'NUM_NOSOLOGICO':					
						// inpDaData	= WindowCartella.getRicovero("DATA_ORA_INIZIO").substring(0,8);					
						break;
				}
			}
		}
		
		if(inpAData.length > 0)
			inpAData	= inpAData.substr(6,4) + inpAData.substr(3,2) + inpAData.substr(0,2);
		else{
			var date 	= new Date(); 
			var day		= '0' + date.getDate(); day	= day.substring((day.length-2),day.length);
			var month	= '0' + (date.getMonth()+1); month = month.substring((month.length-2),month.length);			
			var year	= date.getFullYear();
			inpAData	= year + month + day;
			
		}
		
		_V_FILTRO.daData	=  inpDaData;
		_V_FILTRO.aData		=  inpAData;
		// alert(_V_FILTRO.daData + ' ###### ' + _V_FILTRO.aData)
		
	}
	
}


