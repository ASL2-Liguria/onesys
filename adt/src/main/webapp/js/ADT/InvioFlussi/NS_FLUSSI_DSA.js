/**
 * User: alessandroa
 * Date: 06/02/2014
 */

var NS_FLUSSI_DSA = {
			
			setShowButton : function(){
				$('#btnShowFileAnagraficoDSA').on('click',function(){
					NS_FLUSSI_DSA.scaricaFlussi($(this).prev().val(), 'File Anagrafico DSA');
				});
				$('#btnShowFileClinicoDSA').on('click',function(){
					NS_FLUSSI_DSA.scaricaFlussi($(this).prev().val(), 'File Clinico DSA');
				});
				$('#btnShowFileRRDSA').on('click',function(){
					NS_FLUSSI_DSA.scaricaFlussi($(this).prev().val(), 'File Ricette Rosse DSA');
				});
				$('#btnShowFileTipiDSA').on('click',function(){
					NS_FLUSSI_DSA.scaricaFlussi($(this).prev().val(), 'File Tipi DSA');
				});
			},
			generaFlussi : function(sendFlussi){
				
				/**
				 * Funzione che crea gli archivi per ogni tipologia di flusso generato.
				 */
				NS_LOADING.showLoading({"timeout" : 0});
				var urlToCall = _URL_GENERAZIONE_FLUSSI + 'DSA/genera?' ;
				var dataToSend= 'user=' + home.baseUser.IDEN_PER + '::Data=' + document.getElementById('h-txtDataFine').value;

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
		            	eval('var json = ' + resp);
		            	
		            	if(Boolean(json.success))
		            	{
		            		_FLUSSO_GENERATO = true;
		            		home.NOTIFICA.success({message: "Generazione Flussi DSA effettuata correttamente", timeout: 3, title: 'Success'});
	                        
			            	$('#' +'txtFileClinicoDSA').val(json['fileClinicoDSA']);
			            	$('#' +'txtFileRRDSA').val(json['fileRRDSA']);
			            	$('#' +'txtFileTipiDSA').val(json['fileTipiDSA']); 
			            	$('#' +'txtFileAnagraficoDSA').val(json['fileAnagraficoDSA']);
			            	// $('#' +'txtInvioDSA').val('NO');
			            	
			            	$('#' + 'fieldsetOutputDSA').show();
			            	
			            	if (sendFlussi){
			            		NS_FLUSSI_DSA.inviaFlussi();
			            	}
	                    }
		            	else
	                    {
	                    	_FLUSSO_GENERATO = false;
	                    	home.NOTIFICA.error({message: "Attenzione errore nella generazione dei Flussi", timeout: 5, title: "Error"});
	                    }
		            	
		            	NS_PAGINA.Events.setButton();
		            	
		            },
		            error: function (resp)
		            {
		            	NS_LOADING.hideLoading();
		            	_FLUSSO_GENERATO = false;
		            	eval('var json = ' + resp);
		                home.NOTIFICA.error({message: "Attenzione errore nella generazione dei Flussi " + json.message, timeout: 5, title: "Error"});
		            }
		       });

			},
			
			inviaFlussi : function(){
					
				/**
				 * Funzione NON utilizzata in quanto � stato specificato che i files relativi ai flussi
				 * NON vengono inviati tramite mail ma vengono caricati manualmente su un portale regionale.
				 * Per farla funzionare riattivare i campi e-mail e oggetto.
				 * Il parametro FILE contiene il nome del file che deve avere il file scaricato in fase di download.
				 */
				
				if (!NS_PAGINA.Check.checkValidMail()){
					return;
				}
				
				if(!NS_PAGINA.Check.checkMailObjectNotNull()){
					return;
				}
				
				var urlToCall = _URL_GENERAZIONE_FLUSSI + 'DSA/invio?' ;
				var dataToSend	= 	'::File1=' + $('#txtFileAnagraficoDSA').val()
									+ '::File2=' + $('#txtFileClinicoDSA').val()
									+ '::File3=' + $('#txtFileRRDSA').val()
									+ '::File4=' + $('#txtFileTipiDSA').val()
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
	                        
		            		home.NOTIFICA.success({message: "Invio flussi DSA effettuato correttamente", timeout: 3, title: 'Success'});
			            	// $('#' +'txtInvioDSA').val('SI');
			            	
			            	$('#' + 'fieldsetOutput' + _FLUSSO).show();
	                    }
		            	else
	                    {
	                    	_FLUSSO_INVIATO = false;
	                    	home.NOTIFICA.error({message: "Errore nell'invio dei flussi DSA: " + json.message, timeout: 5, title: "Error"});
	                    }
		            	
		            	NS_PAGINA.Events.setButton();
		            	
		            },
		            error: function (resp)
		            {
		            	_FLUSSO_INVIATO = false;
		            	home.NOTIFICA.error({message: "Errore nell'invio dei flussi DSA", timeout: 5, title: "Error"});
		            }
		       });
			},
			
			visualizzaFlussi : function(file, descr){
				
				if (!_FLUSSO_GENERATO){
					home.NOTIFICA.error({message: "Flusso NON Generato", timeout: 5, title: "Error"});
					return;
				}
				
				if(file == null || file == ''){
					home.NOTIFICA.error({message: "Nome File NON Valido", timeout: 5, title: "Error"});
					return;
				}
				
				$('#fieldsetOutputFile').hide();
				
				var urlToCall = _URL_GENERAZIONE_FLUSSI + 'DSA/visualizza?' ;
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
				 */
				
				if (!_FLUSSO_GENERATO){
					home.NOTIFICA.error({message: "Flusso NON Generato", timeout: 5, title: "Error"});
					return;
				}
				
				if(file == null || file == ''){
					home.NOTIFICA.error({message: "Nome File NON Valido", timeout: 5, title: "Error"});
					return;
				}
				
				var urlToCall = _URL_GENERAZIONE_FLUSSI + 'DSA/visualizza?' ;
				var dataToSend	= 	'user=' + home.baseUser.IDEN_PER + '::File=' + file;

				$('#fieldsetOutputFile').hide();
				
				document.getElementById('iOutputFile').src = "proxy?CALL="+ urlToCall +"&PARAM="+dataToSend+"&METHOD=GET&FILE="+file;
				
			}
}; 