/**
 * User: alessandroa
 * Date: 06/02/2014
 */

var NS_FLUSSI_PS = {
			
			setShowButton : function(){
				$('#btnShowFileAnagraficoPS').on('click',function(){
					NS_FLUSSI_PS.scaricaFlussi($(this).prev().val(), 'File Anagrafico PS');
				});
				$('#btnShowFileClinicoPS').on('click',function(){
					NS_FLUSSI_PS.scaricaFlussi($(this).prev().val(), 'File Clinico PS');
				});
			},
			generaFlussi : function(sendFlussi){
				
				/**
				 * Funzione che crea gli archivi per ogni tipologia di flusso generato.
				 */
				
				var urlToCall = _URL_GENERAZIONE_FLUSSI + 'PS/genera?' ;
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
		            	eval('var json = ' + resp);
		            	if(Boolean(json.success))
		            	{
		            		_FLUSSO_GENERATO = true;
		            		home.NOTIFICA.success({message: "Generazione Flussi PS effettuata correttamente", timeout: 3, title: 'Success'});
	                        
			            	$('#' +'txtFileClinicoPS').val(json['fileClinicoPS']);
			            	$('#' +'txtFileAnagraficoPS').val(json['fileAnagraficoPS']);
			            	// $('#' +'txtInvioPS').val('NO');
			            	
			            	$('#' + 'fieldsetOutputPS').show();
			            	
			            	if (sendFlussi){
			            		NS_FLUSSI_PS.inviaFlussi();
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
		            	_FLUSSO_GENERATO = false;
		            	eval('var json = ' + resp);
		                home.NOTIFICA.error({message: "Attenzione errore nella generazione dei Flussi " + json.message, timeout: 5, title: "Error"});
		            }
		       });

			},
			
			inviaFlussi : function(){
					
				/**
				 * Funzione NON utilizzata in quanto è stato specificato che i files relativi ai flussi
				 * NON vengono inviati tramite mail ma vengono caricati manualmente su un portale regionale.
				 * Per farla funzionare riattivare i campi e-mail e oggetto.
				 */
				
				if (!NS_PAGINA.Check.checkValidMail()){
					return;
				}
				
				if(!NS_PAGINA.Check.checkMailObjectNotNull()){
					return;
				}
				
				var urlToCall = _URL_GENERAZIONE_FLUSSI + 'PS/invio?' ;
				var dataToSend	= 	'user=' + home.baseUser.IDEN_PER 
									+ '::File1=' + $('#txtFileAnagraficoPS').val()
									+ '::File2=' + $('#txtFileClinicoPS').val()
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
	                        
		            		home.NOTIFICA.success({message: "Invio flussi PS effettuato correttamente", timeout: 3, title: 'Success'});
			            	// $('#' +'txtInvioPS').val('SI');
			            	
			            	$('#' + 'fieldsetOutput' + _FLUSSO).show();
			            	
	                    }
		            	else
	                    {
	                    	_FLUSSO_INVIATO = false;
	                    	home.NOTIFICA.error({message: "Errore nell'invio dei flussi PS: " + json.message, timeout: 5, title: "Error"});
	                    }
		            	
		            	NS_PAGINA.Events.setButton();
		            	
		            },
		            error: function (resp)
		            {
		            	_FLUSSO_INVIATO = false;
		            	home.NOTIFICA.error({message: "Errore nell'invio dei flussi PS", timeout: 5, title: "Error"});
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
				
				var urlToCall = _URL_GENERAZIONE_FLUSSI + 'PS/visualizza?' ;
				var dataToSend	= 	'user=' + home.baseUser.IDEN_PER + '::File=' + file;
				
				document.getElementById('iOutputFile').src = "proxy?CALL="+ urlToCall +"&PARAM="+dataToSend+"&METHOD=GET";
				$('#fieldsetOutputFile').show();
				$('#fieldsetOutputFile > legend').html(descr);
				
			},
			
			scaricaFlussi : function(file, descr){
				
				/**
				 * Setta l'attributo dell'IFRAME utilizzato precedentemente per la visualizzaione.
				 * la URL restituisce un buffer che il browser ti fa scaricare.
				 * Il metodo utilizzato di elcomiddleware è sempre 'visualizza' in quanto restituisce un BUFFER.
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
				
				var urlToCall = _URL_GENERAZIONE_FLUSSI + 'PS/visualizza?' ;
				var dataToSend	= 	'user=' + home.baseUser.IDEN_PER + '::File=' + file;

				$('#fieldsetOutputFile').hide();
				
				document.getElementById('iOutputFile').src = "proxy?CALL="+ urlToCall +"&PARAM="+dataToSend+"&METHOD=GET&FILE="+file;
				
			}
}; 