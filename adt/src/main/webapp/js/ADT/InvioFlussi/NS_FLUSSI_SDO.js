/**
 * User: alessandroa
 * Date: 06/02/2014
 */

var NS_FLUSSI_SDO = {
			
			setShowButton : function() {
				$('#btnShowFileAnagraficoSDO_Pietra').on('click',function(){
					NS_FLUSSI_SDO.scaricaFlussi($(this).prev().val(), 'File Anagrafico SDO Presidio Ponente');
				});
				$('#btnShowFileClinicoSDO_Pietra').on('click',function(){
					NS_FLUSSI_SDO.scaricaFlussi($(this).prev().val(), 'File Clinico SDO Presidio Ponente');
				});
				$('#btnShowFileAnagraficoSDO_Savona').on('click',function(){
					NS_FLUSSI_SDO.scaricaFlussi($(this).prev().val(), 'File Anagrafico SDO Presidio Levante');
				});
				$('#btnShowFileClinicoSDO_Savona').on('click',function(){
					NS_FLUSSI_SDO.scaricaFlussi($(this).prev().val(), 'File Clinico SDO Presidio Levante');
				});
			},
			
			generaFlussi : function(sendFlussi) {
				
				NS_LOADING.showLoading({"timeout" : 0});
				
				var urlToCall = _URL_GENERAZIONE_FLUSSI + 'SDO/genera?' ;
				var dataToSend = 'user=' + home.baseUser.IDEN_PER + '::Data=' + document.getElementById('h-txtDataFine').value;
				
				logger.debug("Genera Flussi - NS_FLUSSI_SDO.generaFlussi - urloToCall -> " + urlToCall + ", dataToSend -> " + dataToSend)
				
				jQuery.support.cors = true;
				
		        jQuery.ajax({
		            url: "proxy",
		            data:"CALL="+ urlToCall +"&PARAM="+dataToSend+"&METHOD=GET",
		            cache: false,
		            type: "POST",
		            crossDomain: false,
		            contentType:"application/x-www-form-urlencoded",
		            success: function (resp)
		            {
		            	NS_LOADING.hideLoading();
		            	
		            	logger.debug("Genera Flussi - NS_FLUSSI_SDO.generaFlussi - Response -> " + resp)
		            	var json = JSON.parse(resp);
		            	
		            	if(Boolean(json.success))
		            	{
		            		_FLUSSO_GENERATO = true;
		            		
		            		logger.info("Genera Flussi SUCCESS - NS_FLUSSI_SDO.generaFlussi - Flusso Generato Correttamente");
		            		home.NOTIFICA.success({message: "Generazione Flussi SDO effettuata correttamente", timeout: 3, title: 'Success'});
	                        
			            	$('#' +'txtFileClinicoSDO_Savona').val(json['fileClinicoSDO_Savona']);
			            	$('#' +'txtFileAnagraficoSDO_Savona').val(json['fileAnagraficoSDO_Savona']);
			            	$('#' +'txtFileClinicoSDO_Pietra').val(json['fileClinicoSDO_Pietra']);
			            	$('#' +'txtFileAnagraficoSDO_Pietra').val(json['fileAnagraficoSDO_Pietra']);
			            	// $('#' +'txtInvioSDO').val('NO');
			            	
			            	$('#' + 'fieldsetOutputSDO').show();
			            	
			            	if (sendFlussi){
			            		NS_FLUSSI_SDO.inviaFlussi();
			            	}
	                    }
		            	else
	                    {
		            		_FLUSSO_GENERATO = false;
		            		
			            	NS_LOADING.hideLoading();
	                    	
	                    	home.NOTIFICA.error({message: "Attenzione errore nella generazione dei Flussi", timeout: 5, title: "Error"});
	                    	logger.info("Genera Flussi ERROR - NS_FLUSSI_SDO.generaFlussi - Generazione Flusso in ERRORE");
	                    }
		            	
		            	NS_PAGINA.Events.setButton();
		            	
		            },
		            error: function (resp)
		            {
		            	_FLUSSO_GENERATO = false;

		            	var json = JSON.parse(resp);
		            	
		            	NS_LOADING.hideLoading();
		                home.NOTIFICA.error({message: "Attenzione errore nella generazione dei Flussi " + json.message, timeout: 5, title: "Error"});
		                logger.info("Genera Flussi ERROR - NS_FLUSSI_SDO.generaFlussi - Generazione Flusso in ERRORE");
		            }
		       });

			},
			
			inviaFlussi : function(){

				/**
				 * Funzione NON utilizzata in quanto e' stato specificato che i files relativi ai flussi
				 * NON vengono inviati tramite mail ma vengono caricati manualmente su un portale regionale.
				 * Per farla funzionare riattivare i campi e-mail e oggetto.
				 */
				
				if (!NS_PAGINA.Check.checkValidMail()){
					return;
				}
				
				if(!NS_PAGINA.Check.checkMailObjectNotNull()){
					return;
				}
				
				var urlToCall = _URL_GENERAZIONE_FLUSSI + 'SDO/invio?' ;
				var dataToSend	= 	'::File1=' + $('#txtFileAnagraficoSDO').val()
									+ '::File2=' + $('#txtFileClinicoSDO').val()
									+ '::Email=' + $('#txtMail').val()
									+ '::Oggetto=' + $('#txtOggettoMail').val();
				
				jQuery.support.cors = true;
				
		        jQuery.ajax({
		            url: "proxy",
		            data:"CALL="+ urlToCall +"&PARAM="+dataToSend+"&METHOD=GET",
		            cache: false,
		            type: "POST",
		            crossDomain: false,
		            contentType:"application/x-www-form-urlencoded",
		            success: function (resp)
		            {
		            	eval('var json = ' + resp);
		            	
		            	if(json.success)
		            	{
		            		_FLUSSO_INVIATO = true;
	                        
		            		home.NOTIFICA.success({message: "Invio flussi SDO effettuato correttamente", timeout: 3, title: 'Success'});
			            	// $('#' +'txtInvioSDO').val('SI');
			            	
			            	$('#' + 'fieldsetOutput' + _FLUSSO).show();
	                    }
		            	else
	                    {
	                    	_FLUSSO_INVIATO = false;
	                    	home.NOTIFICA.error({message: "Errore nell'invio dei flussi SDO: " + json.message, timeout: 5, title: "Error"});
	                    }
		            	
		            	NS_PAGINA.Events.setButton();
		            	
		            },
		            error: function (resp)
		            {
		            	_FLUSSO_INVIATO = false;
		            	home.NOTIFICA.error({message: "Errore nell'invio dei flussi SDO", timeout: 5, title: "Error"});
		            }
		       });
			},
			
			visualizzaFlussi : function(file, descr){
				
				/**
				 * Funzione Non pi� utilizzata non cancellata per il timore di possibili cambi di idea.
				 */
				if (!_FLUSSO_GENERATO){
					home.NOTIFICA.error({message: "Flusso NON Generato", timeout: 5, title: "Error"});
					return;
				}
				
				if(file == null || file == ''){
					home.NOTIFICA.error({message: "Nome File NON Valido", timeout: 5, title: "Error"});
					return;
				}
				
				$('#fieldsetOutputFile').hide();
				
				var urlToCall = _URL_GENERAZIONE_FLUSSI + 'SDO/visualizza?' ;
				var dataToSend	= 	'user=' + home.baseUser.IDEN_PER + '::File=' + file;
				
				document.getElementById('iOutputFile').src = "proxy?CALL="+ urlToCall +"&PARAM="+dataToSend+"&METHOD=GET";
				$('#fieldsetOutputFile').show();
				$('#fieldsetOutputFile > legend').html(descr);
				
			},
			
			scaricaFlussi : function(file, descr){
				
				/**
				 * Setta l'attributo dell'IFRAME utilizzato precedentemente per la visualizzaione.
				 * la URL restituisce un buffer che il browser ti fa scaricare.
				 * Il metodo utilizzato di elcomiddleware � sempre 'visualizza' in quanto restituisce un BUFFER.
				 * Il parametro FILE contiene il nome del file che deve avere il file scaricato in fase di download.
				 */
				
				if (!_FLUSSO_GENERATO){
					home.NOTIFICA.error({message: "Flusso NON Generato", timeout: 5, title: "Error"});
					return;
				}
				
				if(file == null || file == ''){
					home.NOTIFICA.error({message: "Nome File NON Valido", timeout: 5, title: "Error"});
					return;
				}
				
				var urlToCall = _URL_GENERAZIONE_FLUSSI + 'SDO/visualizza?' ;
				var dataToSend	= 	'user=' + home.baseUser.IDEN_PER + '::File=' + file;

				$('#fieldsetOutputFile').hide();
				
				document.getElementById('iOutputFile').src = "proxy?CALL="+ urlToCall +"&PARAM="+dataToSend+"&METHOD=GET&FILE="+file;
				
			}
}; 