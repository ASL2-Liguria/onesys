var WindowCartella 	= null;
var _V_DATI			= null;
var _CONTEXT		= null;
var _USER_LOGIN		= null;
var _NUM_RICHIESTE	= 5;
var _IDX_REFRESH 	= 0;
var idenRichiesta='';
var _V_FILTRO = {
	'numRichieste' : 5,
	'daData' : '',
	'aData' : '',
	'elencoEsami' : '',
	'provRisultati' : '',
	'idenAnag' : '',
	'tipologia' : '',
	'branca' :''
};

jQuery(document).ready(function(){
	
	window.WindowCartella = window;   
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    } 
	NS_DATI_LABO.init();
	
});

/**
 * Ricarica il frame interno se nel frame superiore il valore di CONTROLLO_ACCESSO è differente.
 * 
 * @author  gianlucab
 * @version 1.0
 * @since   2014-10-03
 */
jQuery(window).load(function(){
	try {
		if (typeof top.CartellaPaziente === 'object')
			top.CartellaPaziente.controllaPaziente($('form[name=EXTERN] input[name=CONTROLLO_ACCESSO]').val());
	} catch(e) {
		alert(e.message);
	}
});

var NS_DATI_LABO = {
	
	init:function(){
		
		NS_DATI_LABO.definisciComportamento();
		NS_DATI_LABO.setEvents();
		NS_DATI_LABO.setStyles();
		NS_DATI_LABO.NS_FILTRI_FUNZIONI.loadIframe();
		NS_DATI_LABO.setButtonBehaviors();
	},
	
	setButtonBehaviors:function(){
		// top.inserisciRichiestaConsulenza
		$('.HeaderButton').each(function(){
			switch(this.id){
				case 'expPdf':
					set(this,'','Esporta in Pdf',NS_DATI_LABO.NS_FILTRI_EXPORT.esportaPdf);
					break;
				case 'expExcel':
					set(this,'','Esporta in Excel',NS_DATI_LABO.NS_FILTRI_EXPORT.AutomateExcel);
					break;
				case 'insRisultato':
					set(this,'','Inserisci Risultato Manualmente',NS_DATI_LABO.NS_FILTRI_FUNZIONI.addRisultato);
					break;
				case 'insRichiesta':
					set(this,'','Inserisci Richiesta Consulenza',WindowCartella.inserisciRichiestaConsulenza);
					break;
				case 'refreshDatiLabo':
					set(this,'','Aggiorna Risultati di Laboratorio',NS_DATI_LABO.NS_FILTRI_FUNZIONI.aggiornaDatiStrutturati);
					break;
			}
		});
		
		function set(obj,className,title,clickFunction){
			$(obj).addClass(className).attr({"title":title}).click(clickFunction);
		}
		
	},
	
	// Gestione Apertura in Cartella o Fuori (MMG)
	definisciComportamento : function(){
	
		var _PROV_CHIAMATA	= NS_UTILITY.getUrlParameter('provChiamata');
		
		
		if(_PROV_CHIAMATA == 'CARTELLA' || _PROV_CHIAMATA == 'INFO'){ 
		
			_V_DATI					= WindowCartella.getForm();
			_USER_LOGIN				= WindowCartella.baseUser.LOGIN;
			
			_V_FILTRO.numRichieste	= $('[name="selectRichieste"]').val();
			_V_FILTRO.idenAnag		= WindowCartella.getPaziente('IDEN');
			
		}else if(_PROV_CHIAMATA == 'MMG'){
			
			_V_DATI = {
				'idRemoto' 		: NS_UTILITY.getUrlParameter('idPatient'),
				'reparto' 		: 'MMG',
				'provenienza' 	: 'ESTERNO_CARTELLA'
			};
			
			_USER_LOGIN				= NS_UTILITY.getUrlParameter('userLogin');
			_V_FILTRO.numRichieste	= NS_UTILITY.getUrlParameter('numRichieste');
			_V_FILTRO.idenAnag		= NS_UTILITY.getUrlParameter('idenAnag');

		}else if(_PROV_CHIAMATA == 'AMBULATORIO'){

			_V_DATI					= WindowCartella.getForm();			
			_V_FILTRO.numRichieste	= NS_UTILITY.getUrlParameter('numRichieste');
			_V_FILTRO.idenAnag		= WindowCartella.getPaziente('IDEN');
			_USER_LOGIN				= WindowCartella.baseUser.LOGIN;			
			_V_DATI.idRemoto 		= WindowCartella.getPaziente('ID_REMOTO');
			
			$('#insRichiesta').hide();
			$('#insRisultato').hide();
			// alert(_V_DATI.reparto+ '\n' + WindowCartella.baseUser.LOGIN + '\n id remoto: ' + WindowCartella.getPaziente('ID_REMOTO'));
			
		}else if(_PROV_CHIAMATA == 'IPATIENT'){
			
			_V_DATI = {
                                'nosologico'            :'',    
				'idRemoto' 		: '',
				'reparto' 		: 'IPATIENT',
				'provenienza' 	: 'ESTERNO_CARTELLA'
			};
			
			_V_FILTRO.numRichieste	= NS_UTILITY.getUrlParameter('numRichieste');
			_V_FILTRO.idenAnag		= NS_UTILITY.getUrlParameter('idenAnag');
			_USER_LOGIN				= NS_UTILITY.getUrlParameter('userLogin');
			_V_DATI.idRemoto 		= NS_UTILITY.getUrlParameter('idPatient');
			
			$('#insRichiesta').hide();
			$('#insRisultato').hide();
		
		}
		
		_CONTEXT	= _PROV_CHIAMATA;	
		_MODALITA	= NS_UTILITY.getUrlParameter('modalita');
		
		if (_MODALITA=='PAZIENTE_RICHIESTA'){
			$('#divFiltroDate').hide();
		}

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
		else if(_CONTEXT == 'IPATIENT')
			NS_DATI_LABO.STYLES.setHeightIframeIPatient();			
		else if(_CONTEXT == 'MMG')
			NS_DATI_LABO.STYLES.setHeightIframeIPatient();
		else if(_CONTEXT == 'INFO')
			NS_DATI_LABO.STYLES.setHeightIframeInfo();
	
	},
	
	STYLES :{
		
		setGenericStyle : function(){
		
			$("td[class~='tdIntAltriRep']").css("position","relative");
			$("td[class~='tdIntAltriRep']").each(function(){
				$(this).append("<div title='"+$(this).attr('DESCRPROV')+"' style='position:absolute;top:-0px;right:-0px' class='triangoloNote'></div>");
			});		
			$('UL[id="filtriBranca"]').find('LI').addClass('pulsanteLISelezionato');
		
		},
		
		setHeightIframeInCartella : function(){

			var height 	= $(window.parent).height() - 140;
			$('#iframeGriglia').css({'height' : height});
		
		},
		
		setHeightIframeInfo : function(){
		//	var height 	= parseInt(window.parent.$('#frameDatiStrutturati').css('height'))-40;
			var height 	= parseInt(window.parent.$('#frameDatiStrutturati').css('height'));
			$('#divMenu').hide();
			$('#iframeGriglia').css({'height' : height});
			
		
		},
		
		
		setHeightIframeMMG : function(){
			
			var height 	= $(window.parent).height() - 50;
			$('#iframeGriglia').css({'height' : height});
		
		},
		
		setHeightIframeIPatient : function(){
			
			var height 	= $(window.parent).height() - 70;
			$('#iframeGriglia').css({'height' : height});
		
		}
	},
	
	EVENTS : {
	
		setGenericEvents : function(){
		
			// Set Title Provenienza - propertychange keyup input paste
			//nascondo il filtro sulla provenienza
			$('#lblElencoProvenienza').hide();
			$('#lblSceltaProvenienza').hide();
			$('#lblElencoProvenienza').bind("propertychange keyup input paste",function(){
				
				if($(this).text() == '')
					$('#lblSceltaProvenienza').attr('title','Provenienze Selezionate: ').removeClass('esamiSelezionatiTrue');				
				else
					$('#lblSceltaProvenienza').attr('title','Provenienze Selezionate: ' + $('#lblElencoProvenienza').text()).addClass('esamiSelezionatiTrue');								
			});
		
		},
		
		setInputDatepicker : function(){
			
			// Datepicker Evento e Limitazioni
			NS_UTILITY.controlloData('inpFiltroDaData');
			NS_UTILITY.controlloData('inpFiltroAData');
			NS_UTILITY.setDatepicker('inpFiltroDaData');
			NS_UTILITY.setDatepicker('inpFiltroAData');
			
			 if(_MODALITA!='PAZIENTE_RICHIESTA'){
				// Set Today input aData - Non USO clsdate perché Fuori dalla Cartella potrei NON Averlo
				var date 	= new Date(); 
				var day		= '0' + date.getDate(); day	= day.substring((day.length-2),day.length);
				var month	= '0' + (date.getMonth()+1); month = month.substring((month.length-2),month.length);			
				var year	= date.getFullYear();			
				$('#inpFiltroAData').val(day + '/' + month + '/' + year);
			 }
			
			if(_MODALITA=='RICOVERO'){
				if (WindowCartella.getRicovero("DEA_DATA_INGRESSO")!=''){
					if (_V_DATI.iden_prericovero == null || _V_DATI.iden_prericovero == ""){
						vDataInizio=WindowCartella.getRicovero("DEA_DATA_INGRESSO");						
					}else{
						vDataInizio=WindowCartella.getPrericovero("DATA_INIZIO");
					}
				}
				else{
					vDataInizio=(_V_DATI.iden_prericovero == null || _V_DATI.iden_prericovero == "") ? WindowCartella.getRicovero("DATA_INIZIO") :WindowCartella.getPrericovero("DATA_INIZIO");
				}
				$('#inpFiltroDaData').val(vDataInizio.substring(6,8)+'/'+vDataInizio.substring(4,6)+'/'+vDataInizio.substring(0,4));
				
				if (parent.getRicovero("DATA_FINE")!="")
				{			
					var vDataFine=WindowCartella.clsDate.dateAddStr(WindowCartella.getRicovero("DATA_FINE"),'YYYYMMDD','','D','30');
					$('#inpFiltroAData').val(vDataFine.substring(6,8)+'/'+vDataFine.substring(4,6)+'/'+vDataFine.substring(0,4));
				}
					
					
					
			}
			else if(_MODALITA!='PAZIENTE_RICHIESTA'){
				var vDate=new Date();
				vDate.setTime(date.getTime()+(-180*1000*60*60*24));
				day= '0' + vDate.getDate(); day	= day.substring((day.length-2),day.length);
				month	= '0' + (vDate.getMonth()+1); month = month.substring((month.length-2),month.length);			
				year	= vDate.getFullYear();
				$('#inpFiltroDaData').val(day + '/' + month + '/' + year);
			}
			
			$('#inpFiltroDaData,#inpFiltroAData').attr('disabled','disabled');

			
			
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
				try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){top.NS_PAGINA.Events.attesa(false);}
				return false;
			}
			return true;			
		},
		
		checkDateFormat : function(){
		
			try{
				inpDaData	= parseInt(_V_FILTRO['daData']);
				inpAData	= parseInt(_V_FILTRO['aData']);
			}catch(e){
				alert('Verificare il Formato delle Date Inserite');
				return false;
			}
			
			return true;
		},
		
		checkPeriodoDate : function(){
			
			var a 	= parseInt(_V_FILTRO['daData']);
			var b 	= parseInt(_V_FILTRO['aData']);
			var	elencoEsami = $('#hEsamiFiltro').val();
                        
			if(a > b){
                            $('#inpFiltroDaData').val( _V_FILTRO['aData'].substr(6,2) +'/'+  _V_FILTRO['aData'].substr(4,2) +'/'+ _V_FILTRO['aData'].substr(0,4));
                            var inpDaData	= $('#inpFiltroDaData').val();
                            inpDaData	= inpDaData.substr(6,4) + inpDaData.substr(3,2) + inpDaData.substr(0,2);                       
                            _V_FILTRO.daData	=  inpDaData;
                        }else{
                            var daTmpData  = new Date();
                            daTmpData.setYear( _V_FILTRO['daData'].substr(0,4));
                            daTmpData.setMonth(_V_FILTRO['daData'].substr(4,2)-1);
                            daTmpData.setDate( _V_FILTRO['daData'].substr(6,2));
                            var aTmpData   = new Date();
                            aTmpData.setYear( _V_FILTRO['aData'].substr(0,4));
                            aTmpData.setMonth(_V_FILTRO['aData'].substr(4,2)-1);
                            aTmpData.setDate( _V_FILTRO['aData'].substr(6,2));
                        
                            var diff = (parseInt(aTmpData.getTime()-daTmpData.getTime())/(24*3600*1000));
                            if ((diff)>=365 && elencoEsami==''){
                                return false;
                            }
                        }     
			return true;
		}
		
	},
	
	NS_FILTRI_FUNZIONI : {

		loadIframe:function(pParametriExtra){

			// Se Apro un Ricovero Ambulatoriale dentro la Cartella aperta da Ambulatorio La chiamata deve essere AMBULATORIO
			if (_CONTEXT == 'CARTELLA' || _CONTEXT=='INFO')
				_CONTEXT	= WindowCartella.getRicovero('TIPOLOGIA') == 'AMB' ? 'AMBULATORIO' : _CONTEXT;
			
			url = 'servletGeneric?class=cartellaclinica.cartellaPaziente.datiStrutturatiLabo.listDocumentLaboratorioGriglia&provChiamata=' + _CONTEXT+'&modalita='+_MODALITA;	
			url	+='&idPatient=' + _V_DATI.idRemoto;
			
			
            // Giorni PS
			url	+= $('input[name="datiPs"]').val() == 'S' ? '&giorni_ps=' + $('input[name="datiPsGiorni"]').val() : '&giorni_ps=0';
			
			if(_CONTEXT == 'CARTELLA' || _CONTEXT=='INFO'){
				
			    idenRichiesta	= NS_UTILITY.getUrlParameter('idenRichiesta');
				var numRichieste	= WindowCartella.baseReparti.getValue(_V_DATI.reparto,"VISUALIZZATORE_NUM_RICH").split('#')[1];

				
				
				if (idenRichiesta == ''){
					
					// Chiamata da Wk Ricoverati
					url	+= '&reparto=' + _V_DATI.reparto + '&daData=' + _V_FILTRO.daData + '&aData=' + _V_FILTRO.aData;
								
					if (_MODALITA== 'RICOVERO'){
						if  (_V_DATI.iden_prericovero == null || _V_DATI.iden_prericovero == ""){
							if (WindowCartella.getRicovero("DEA_STR")==null || WindowCartella.getRicovero("DEA_STR")==""){
								_V_DATI.nosologico = _V_DATI.ricovero;
							}else{
								_V_DATI.nosologico = _V_DATI.ricovero + ','+  WindowCartella.getRicovero("DEA_STR")+"-"+WindowCartella.getRicovero("DEA_ANNO")+"-"+WindowCartella.getRicovero("DEA_CARTELLA");
							}
						}else{
							_V_DATI.nosologico= _V_DATI.ricovero + ','+  _V_DATI.prericovero;
						}
						url +='&nosologico=' + _V_DATI.nosologico;											
					}
					
					// Passo il Parametro del Numero Richieste
					url += '&numRichieste=' + _V_FILTRO.numRichieste; 
					
				}else{				
					// Chiamata da Wk Richieste
					url += '&idenRichiesta=' + idenRichiesta + '&reparto='+ NS_UTILITY.getUrlParameter('reparto');	
					_V_DATI.reparto=NS_UTILITY.getUrlParameter('reparto');
				}
                url +="&emergenza_medica="+WindowCartella.getPaziente('EMERGENZA_MEDICA');
    	        url += "&TIPOLOGIA_ACCESSO="+WindowCartella.document.EXTERN.ModalitaAccesso.value;
    	        url += "&EVENTO_CORRENTE="+WindowCartella.getRicovero("NUM_NOSOLOGICO");
			}else{
				// Chiamata da Fuori Cartella (MMG o  Altro)
				url += '&reparto=' + _V_DATI.reparto + '&numRichieste=' + _V_FILTRO.numRichieste+ '&daData=' + _V_FILTRO.daData + '&aData=' + _V_FILTRO.aData;
                url +="&emergenza_medica="+top._SET_EMERGENZA_MEDICA;
    	        url += "&TIPOLOGIA_ACCESSO="+top._TIPOLOGIA_ACCESSO;
    	        url += "&EVENTO_CORRENTE="+top._EVENTO_CORRENTE;
			}
			
			if(typeof pParametriExtra != 'undefined')
				url	+= pParametriExtra;
			
		if(_CONTEXT != 'MMG'){
			eval('var privacy = ' + WindowCartella.baseReparti.getValue(_V_DATI.reparto,'ATTIVA_PRIVACY'));
			url +="&ATTIVA_PRIVACY="+privacy.DATI_LABORATORIO.ATTIVA;
		}
			if(_USER_LOGIN == 'dario' )
				alert('Alert Debug Solo per User dario! \n - Load Iframe: ' + url);
			NS_DATI_LABO.NS_FILTRI_FUNZIONI.setSrcIframe(url);
		},
				
		aggiornaDatiStrutturati : function(){
	
			var extraParameter		= '';
			var extraTipo='';
			_V_FILTRO.numRichieste	= $('select[name="selectRichieste"]').val();
			_V_FILTRO.elencoEsami	= $('#hEsamiFiltro').val();
			_V_FILTRO.provRisultati	= $('#hProvenienzaFiltro').val();
			_V_FILTRO.branca='';
			
			switch ($('UL[id="filtriBranca"]').find('.pulsanteLISelezionato').length)
			{
			case 0:
				alert('Attenzione, selezionare almeno una branca');
				return;
			case 1:
			case 2:
				$('UL[id="filtriBranca"]').find('.pulsanteLISelezionato').each(function() {
					if(_V_FILTRO.branca!=''){
						_V_FILTRO.branca+=',';
					}							
					if ($(this).attr('id')=='LABO') 
						_V_FILTRO.branca+='L';
					else if ($(this).attr('id')=='MICRO') 
						_V_FILTRO.branca+='A';
					else
						_V_FILTRO.branca+='V';					
				});
				break;
			default:
				null;
				
			}
			try{WindowCartella.utilMostraBoxAttesa(true);}catch(e){};

			extraParameter	= '&elencoEsami=' + encodeURIComponent(_V_FILTRO.elencoEsami) + '&provRisultati='+_V_FILTRO.provRisultati;
			if(_V_FILTRO.branca!=''){
				extraParameter+='&branca='+_V_FILTRO.branca;
			}
			
			if (_MODALITA!= 'PAZIENTE_RICHIESTA'){

				if(!NS_UTILITY.impostaFiltroDate()){
					try{top.utilMostraBoxAttesa(false);}catch(e){}
					return;
				}

				if(!NS_DATI_LABO.CHECK.checkDateFormat())
					return;

				if(!NS_DATI_LABO.CHECK.checkPeriodoDate()){
					try{top.utilMostraBoxAttesa(false);}catch(e){}
					return alert('Inserire un range di date inferiore all\' anno o filtrare per analisi');
				}
				if(!NS_DATI_LABO.CHECK.checkDaDataTutte())
					return;
			}

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
		},
		
		
		
		scegliBranca:function(value){

			var id = value;
			var _this = document.getElementById(id);

				if (!hasClass(_this,"pulsanteLISelezionato")){
					addClass(_this,"pulsanteLISelezionato");
				
				}else{
					removeClass(_this,"pulsanteLISelezionato");				
				}

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
			
			var orientamento	= _CONTEXT == 'CARTELLA' ? orientamento = WindowCartella.baseReparti.getValue(reparto,"orientamentoStampaDatiLabo") : orientamento = 1;
			var funzione		= orientamento == 1 ? funzione = 'LABO_DATI_STRUTTURATI_VERTICALE' : funzione = 'LABO_DATI_STRUTTURATI_ORIZZONTALE';

			sf	= '&prompt<pReparto>='+reparto+'&prompt<pOrientamento>='+orientamento+'&prompt<pIdenAnag>='+$('#iframeGriglia').contents().find('#iden_anag').val();
            sf += '&prompt<pidenRichiesta>=' + idenRichiesta;
            sf += '&prompt<pIdPaziente>=' + _V_DATI.idRemoto;
            sf += '&prompt<pNumRichieste>=' + _V_FILTRO.numRichieste;
			if (_MODALITA == 'PAZIENTE_RICHIESTA'){
				sf += '&prompt<pNosologico>=';
				sf += '&prompt<pDaData>=';
				sf += '&prompt<pAData>=';
				}
			else if(_MODALITA == 'PAZIENTE'){
				sf += '&prompt<pNosologico>=';
				sf += '&prompt<pDaData>=' + _V_FILTRO.daData;
				sf += '&prompt<pAData>=' + _V_FILTRO.aData;
			}
            else{
				sf += '&prompt<pNosologico>=' + _V_DATI.nosologico;
				sf += '&prompt<pDaData>=' + _V_FILTRO.daData;
				sf += '&prompt<pAData>=' + _V_FILTRO.aData;
			}
			sf += '&prompt<pElencoEsami>=' + _V_FILTRO.elencoEsami;
            sf += '&prompt<pProvRisultati>=' + _V_FILTRO.provRisultati;
            sf += '&prompt<pModalita>=' + _MODALITA;
            sf += '&prompt<pBranca>=' + _V_FILTRO.branca;
            
            //alert(sf);
            

            if (_CONTEXT == 'CARTELLA')
            	WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,null);
            else if (_CONTEXT == 'MMG'){
            	var url ='http://10.106.0.120:8082/whale/ServletStampe?report=ESTERNO_CARTELLA/DATI_STRUTTURATI/DATI_STRUTTURATI_GLOBALE_V.RPT'+sf;
            	parent.home.NS_FENIX_PRINT.caricaDocumento({URL:url});
            }else{
            	var url =  'elabStampa?stampaFunzioneStampa=' + funzione + '&stampaAnteprima=S&stampaReparto=ESTERNO_CARTELLA&stampaSelection='+sf+'&ServletStampe=N';
            	var finestra = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);

            	try{
            		WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);
            	}catch(e){

            	}
            }

		},
	
		AutomateExcel:function(){
		
			// Start Excel and get Application object.
			var oXL = new ActiveXObject("Excel.Application");
			   
			oXL.Visible = true;
			
		   	// Get a new workbook.
			var oWB = oXL.Workbooks.Add();
			var oSheet = oWB.ActiveSheet;
			
			oXL.UserControl = true;
			oXL.WindowState = 2;
                        oXL.WindowState = 1;
			oXL.Application.Visible = true;
			oXL.ActiveWindow.Activate();
			
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
				
			  	oSheet.Cells(1, 2).Value = $('#iframeGriglia').contents().find('#nome').val() ; // WindowCartella.getPaziente("COGN");
			  	oSheet.Cells(1, 2).HorizontalAlignment = -4108;
			  	oSheet.Cells(2, 2).Value = $('#iframeGriglia').contents().find('#cognome').val(); // WindowCartella.getPaziente("NOME");
			  	oSheet.Cells(2, 2).HorizontalAlignment = -4108;
			  	oSheet.Cells(3, 2).Value = $('#iframeGriglia').contents().find('#datanasc').val().substring(6,8)+"/"+$('#iframeGriglia').contents().find('#datanasc').val().substring(4,6)+"/"+$('#iframeGriglia').contents().find('#datanasc').val().substring(0,4); // WindowCartella.getPaziente("DATA")
			  	oSheet.Cells(3, 2).HorizontalAlignment = -4108;
			  	oSheet.Cells(4, 2).Value = $('#iframeGriglia').contents().find('#codfisc').val();
			  	oSheet.Cells(4, 2).HorizontalAlignment = -4108;
			}
			  
			// Intestazione Sinistra
			var rigaInizioInt;
			$("#iframeGriglia").contents().find("#tabIntestazione td").each(function(index,value) {
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
			$("#iframeGriglia").contents().find("#tabIntestazioneRisultati tr td").each(function(index,value) {
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
				
				}else if($(this).hasClass('rigaAnalisiMulti')){
					
					oSheet.Cells(indexRow+7, 1).Value = $(this).text().replace("<BR>"," ").replace("&nbsp;","");
					oSheet.Cells(indexRow+7, 1).Font.Bold=false;
					oSheet.Cells(indexRow+7, 1).HorizontalAlignment = -4108;
					oSheet.Cells(indexRow+7, 1).Borders.LineStyle = 1;
					oSheet.Cells(indexRow+7, 1).Borders.Weight = 2;
				
				}else{ 
					
					var indexFineTableLeft;
					$(this).find('td').each(function(indexCol,value) {
						if (indexCol>0){
							oSheet.Cells(indexRow+7, indexCol).Value = $(this).text().replace("<BR>"," ").replace("&nbsp;","");
							if (indexCol>1)
								oSheet.Cells(indexRow+7, indexCol).xlCenter;														
							
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
			oSheet.Columns("A:T").EntireColumn.AutoFit;
			   
		   	// Make sure Excel is visible and give the user control of Excel's lifetime.
			oXL.Visible = true;
			oXL.Visible = false;
			oXL.Visible = true;
			/*oXL.UserControl = true;
			oXL.WindowState = 2;
        	oXL.WindowState = 1;
			oXL.Application.Visible = true;
			oXL.ActiveWindow.Activate();*/
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
				if(_MODALITA=='RICOVERO'){

					if (WindowCartella.getRicovero("DEA_DATA_INGRESSO")!=''){
						if(_V_DATI.iden_prericovero == null || _V_DATI.iden_prericovero == ""){
							return WindowCartella.clsDate.setData(WindowCartella.getRicovero("DEA_DATA_INGRESSO"),"00:00");
						}else{
							return WindowCartella.clsDate.setData(WindowCartella.getPrericovero("DATA_INIZIO"),"00:00");							
						}
					}
					else{
						if(_V_DATI.iden_prericovero == null || _V_DATI.iden_prericovero == ""){
							return WindowCartella.clsDate.setData(parent.getRicovero("DATA_INIZIO"),"00:00");	
						}
						else{
							return WindowCartella.clsDate.setData(parent.getPrericovero("DATA_INIZIO"),"00:00");
						}
					}
				}
				else{
					var d = new Date();			
					d.setYear('1900');
					d.setMonth('00');
					d.setDate('01');					
					return d;
				}
			},
			maxDate: function(){					
					var d = new Date();
                    if (_CONTEXT != 'MMG' && _CONTEXT != 'IPATIENT'){

                        if(WindowCartella.getRicovero("DATA_FINE")!=""){
                        	var vDataFine = WindowCartella.clsDate.dateAddStr(WindowCartella.getRicovero("DATA_FINE"),'YYYYMMDD','','D','30')
                            return	WindowCartella.clsDate.setData(vDataFine,"00:00");
                        }
                    }
					return d;
				
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
		
		if (inpAData.length > 10){
			alert('Attenzione. Controllare Il Valore Immesso nel Campo A DATA');
			var inpAData	= $('#inpFiltroAData').val('');
			return false;
		}
		
		if (inpDaData.length > 10){
			alert('Attenzione. Controllare Il Valore Immesso nel Campo DA DATA');
			$('#inpFiltroDaData').val('');
			return false;
		}
		
		if(inpDaData.length > 0){
                        inpDaData	= inpDaData.substr(6,4) + inpDaData.substr(3,2) + inpDaData.substr(0,2);                
                }
                if(inpAData.length > 0)
			inpAData	= inpAData.substr(6,4) + inpAData.substr(3,2) + inpAData.substr(0,2);
		else{
			var date 	= new Date(); 
			var day		= '0' + date.getDate(); day	= day.substring((day.length-2),day.length);
			var month	= '0' + (date.getMonth()+1); month = month.substring((month.length-2),month.length);			
			var year	= date.getFullYear();
			inpAData	= year + month + day;
                        var inpAData	= $('#inpFiltroAData').val( day +'/'+  month +'/'+ year);
			
		}
		
		_V_FILTRO.daData	=  inpDaData;
		_V_FILTRO.aData		=  inpAData;
		return true;
		
	},
                
        getAbsolutePath:function ()
        {
            var loc = window.location;
            var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
            return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));  
        }
	
};


