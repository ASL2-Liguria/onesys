/**
 * User: alessandroa
 * Date: 06/02/2014
 * 
 * Per il funzionamento in locale necessita l'installazione dell'ElcoMiddleware.
 * I test sono stati effettuati sia in locale che puntando al dell'ElcoMiddleware sul pc di robertod.
 * _URL_GENERAZIONE_FLUSSI : CONFIG_WEB.PARAMETRI -> WHERE  ID_RUPPO = 'GLOBALI' AND NOME = 'URL_GENERAZIONE_FLUSSI'
 */

var _FLUSSO = '';
var _FLUSSO_GENERATO = false;
var _FLUSSO_INVIATO = false;
var _URL_GENERAZIONE_FLUSSI = '';

$(document).ready(function () {
	NS_PAGINA.init();
});

var NS_PAGINA = {
		
		init : function(){
			
			home.NS_CONSOLEJS.addLogger({name:'GenerazioneFlussi',console:0});
			window.logger = home.NS_CONSOLEJS.loggers['GenerazioneFlussi'];
            
			NS_PAGINA.Events.setEvents();
		},
		Events : {
			
			setEvents : function(){
				NS_PAGINA.Style.hideAllFieldsetFlusso();
				NS_PAGINA.Events.setFlussoFromCombo();
				NS_PAGINA.Events.setButtonsEvents();
				NS_PAGINA.Style.setStyle();
				NS_PAGINA.Events.setButton();
				
				NS_FENIX_SCHEDA.addFieldsValidator({config:"V_FLUSSI"});
			},
			setButtonsEvents : function(){
				
				/**
				 * Imposta Le funzioni Generiche dei Button.
				 * Per Ogni Button di Scarica ne setta il comportamento specifico.
				 */

				_URL_GENERAZIONE_FLUSSI = home.baseGlobal['URL_GENERAZIONE_FLUSSI'];
				
				logger.info("Definizione _URL_GENERAZIONE_FLUSSI -> " + _URL_GENERAZIONE_FLUSSI);

				$(".butGenera").on('click',function(){NS_FUNZIONI.generaFlussi();});
				// $(".butGeneraInvia").on('click',function(){NS_FUNZIONI.generaInviaFlussi();});
				// $(".butInvia").on('click',function(){NS_FUNZIONI.inviaFlussi();});
				NS_FLUSSI_SDO.setShowButton();
				NS_FLUSSI_DSA.setShowButton();
				NS_FLUSSI_ST.setShowButton();

			},
			
			setFlussoFromCombo : function(){
				$("#cmbTipoFlusso").change(function(){
					NS_PAGINA.Events.resetGlobal();
					NS_PAGINA.Events.setButton();
					NS_PAGINA.Style.hideAllFieldsetFlusso();
					NS_PAGINA.Style.hideFieldsetOutputFile();
					_FLUSSO = $(this).val();
				});
				
			},
			
			/**
			 * Mostra I Bottoni a Seconda dello stadio della generazione del flusso 
			 */
			
			setButton : function(){
				
				if (_FLUSSO_GENERATO) {
					$(".butInvia").show();
				} else {
					$(".butInvia").hide();
				}
			},
			
			resetGlobal : function(){
				_FLUSSO = '';
				_FLUSSO_GENERATO = false;
				_FLUSSO_INVIATO = false;
			}
		},
		
		Style : {
			
			setStyle : function(){
				NS_PAGINA.Style.setGeneric();
				NS_PAGINA.Style.hideAllFieldsetFlusso();
				NS_PAGINA.Style.showFieldsetFlusso();
			},
			setGeneric : function(){
				$('#fieldsetOutputFile').hide();
				$('.iFile').css({'width':'140px'});
				$('.tdLblShort').css({'width':'85px'});
				$('#iOutputFile').css({'overflow':'scroll','width':'100%','height':'150px'});
			},
			hideAllFieldsetFlusso : function(){
				$("#cmbTipoFlusso > option").each(function(){
					$('#' + 'fieldsetOutput' + $(this).val()).hide();
					$('#' + 'fieldsetOutput' + $(this).val() + ' input').val('');
					$('#' + 'txtInvio' + $(this).val()).css({'width':'25px'});
				});
			},
			hideFieldsetOutputFile : function(){
				$('#fieldsetOutputFile').attr('src','').hide();
			},
			showFieldsetFlusso : function(){
				$('#' + 'fieldsetOutput' + _FLUSSO).show();
			}
		},
		
		Check : {
			
			chekFlussoNotNull : function(){
				if (_FLUSSO == null || _FLUSSO == ''){
					return home.NOTIFICA.error({message: "Selezionare Tipologia del Flusso", timeout: 5, title: "Error"});;
				}
				return true;
			},
			checkValidMail : function(){
				
				var re = new RegExp('[@]');
				var mail = $('#txtMail').val();
				
				if (mail == null || mail == ''){
					home.NOTIFICA.error({message: "Inserire un indirizzo mail", timeout: 5, title: "Error"});
					return false;
				}
				 
				if (!mail.match(re)) {
					home.NOTIFICA.error({message: "Inserire un indirizzo mail valido", timeout: 5, title: "Error"});
					return false;
				}
				
				return true;
			},
			checkMailObjectNotNull : function(){
				
				var oggettoMail = $('#txtOggettoMail').val();
				if (oggettoMail == null || oggettoMail == ''){
					home.NOTIFICA.error({message: "Inserire un oggetto alla Mail", timeout: 5, title: "Error"});
					return false;
				}
				return true;
			},
			checkDataNotNull : function(){
				
				var dataFine = document.getElementById('h-txtDataFine').value;
				var message = '';
				
				if (dataFine == ''){
					message += '\nIl Valore della data di FINE e\' vuoto.';
				}
				
				if (message != ''){
					alert(message);
					return false; 
				}
				return true;
			}
		},
		
		Utils : {
			
	        getTime : function(){
	            var now = new Date();
	            var our = '0'+now.getHours(); our = our.substr(our.length-2,2);
	            var min = '0'+now.getMinutes(); min = min.substr(min.length-2,2);

	            return our + ':' + min;
	        },
	        
	        getDate :function(){
	        	var now = new Date();
	        	var day = now.getDate();
	        	var month = '0'+(now.getMonth()+1); month = month.substr(month.length-2,2);
	        	var year = now.getFullYear();

	        	return day + '/' + month + '/' + year;
	        }
	    }
}; 

var NS_FUNZIONI = {
		
		generaFlussi : function(){
			
			if(!NS_FENIX_SCHEDA.validateFields()){
				return;
			};
			
			switch (_FLUSSO) {
			case "SDO":
				NS_FLUSSI_SDO.generaFlussi();
				break;
			case "DSA":
				NS_FLUSSI_DSA.generaFlussi();
				break;
			case "ST":
				NS_FLUSSI_ST.generaFlussi();
				break;
			}
			
		}
};