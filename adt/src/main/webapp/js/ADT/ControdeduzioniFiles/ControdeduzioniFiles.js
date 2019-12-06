/*
 *  author : Graziav
 *  date : 20150520
 *  gestione files input/output per flusso Controdeduzioni
 */

var _URL_CONTRODEDUZIONI = home.baseGlobal['URL_CONTRODEDUZIONI'];
//Variable to store your files
var files;
var _FLUSSO_GENERATO;

$(document).ready(function () {
	NS_CONTRODEDUZIONI_FILES.init();
	NS_CONTRODEDUZIONI_FILES.setEvents();
	
});

var NS_CONTRODEDUZIONI_FILES={
		init:function(){
			// hide fieldset
			$('#fieldsetOutputControdeduzioni').hide();
			// default anno precedente all'attuale
			$("#txtAnno").val(moment().add(-1,'y').format('YYYY'));
			NS_CONTRODEDUZIONI_FILES.Style.hideFieldsetOutputFile();
		},
		setEvents:function(){
			// add event upload file
			$("#butUpLoad").click(function(){
				NS_CONTRODEDUZIONI_FILES.caricaFile();
			});
			// Add events selezione file
			$('input[type=file]').on('change', prepareUpload);
			// add event genera file
			$("#butGenera").click(function(){
				NS_CONTRODEDUZIONI_FILES.generaFile();
			});
			$('#btnShowFileAnagrafico').on('click',function(){
				NS_CONTRODEDUZIONI_FILES.scaricaFlussi($(this).prev().val(), 'File Controdeduzioni Anagrafico');
			});
			$('#btnShowFileClinico').on('click',function(){
				NS_CONTRODEDUZIONI_FILES.scaricaFlussi($(this).prev().val(), 'File Controdeduzioni Clinico');
			});
		},
		caricaFile:function(){
			
			NS_LOADING.showLoading({"timeout" : 0});
			
			var urlToCall = _URL_CONTRODEDUZIONI + 'upload?' ;
			var data = new FormData();
		    $.each(files, function(key, value)
		    {
		        data.append(key, value);
		    });
		    
			logger.debug("Flusso controdeduzioni - urlToCall -> " + urlToCall );
			
			jQuery.support.cors = true;
			
	        jQuery.ajax({
	            url:  urlToCall,
	            data: data,
	            cache: false,
	            type: "POST",
	            processData: false, // Don't process the files
	            contentType: false, // Set content type to false as jQuery will tell the server its a query string request
	            success: function(data, textStatus, jqXHR)
	            {
	            	NS_LOADING.hideLoading();
	            	//alert(data);
	            	eval('var resp=' + data);
	                if(resp.success)
	                {
	                    // Success so call function to process the form
	                    //alert('success ' + JSON.stringify(data));
	                	home.NOTIFICA.success({message: "Flusso controdeduzioni : File caricato correttamente", timeout: 3, title: 'Success'});
	                }
	                else
	                {
	                    // Handle errors here
	                    //alert('resp= ' +JSON.stringify(resp));
	                	home.NOTIFICA.error({message: "Attenzione: errore in caricamento file: "+resp.message, timeout: 5, title: "Error"});
	                }
	            },
	            error: function(jqXHR, textStatus, errorThrown)
	            {
	                // Handle errors here
	            	NS_LOADING.hideLoading();
	            	home.NOTIFICA.error({message: "Chiamata ajax in errore upload file: "+textStatus, timeout: 5, title: "Error"});
	            }
	          });
		},
		generaFile:function(){
			// verifica anno e regione compilati
			var anno=$("#txtAnno").val();
			var regione=$("#txtRegione").val();
			if (anno=='' || regione==''){
				home.NOTIFICA.error({message: "Indicare anno e regione", timeout: 5, title: "Error"});
				return;
			}
			NS_LOADING.showLoading({"timeout" : 0});
			
			var urlToCall = _URL_CONTRODEDUZIONI + 'genera?' ;
			var dataToSend = 'user=' + home.baseUser.IDEN_PER + '::Anno=' + anno+'::Regione='+regione;
			
			logger.debug("Genera File output controdeduzioni - urlToCall -> " + urlToCall + ", dataToSend -> " + dataToSend);
			
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
	            	
	            	logger.debug("Genera File output controdeduzioni - Response -> " + resp)
	            	var json = JSON.parse(resp);
	            	
	            	if(Boolean(json.success))
	            	{
	            		_FLUSSO_GENERATO = true;
	            		
	            		logger.info("Genera File output controdeduzioni - File Generato Correttamente");
	            		home.NOTIFICA.success({message: "Generazione File output controdeduzioni effettuata correttamente", timeout: 3, title: 'Success'});
                        
		            	$('#txtFileClinico').val(json['nome_file_controdeduzioni_clinico']);
		            	$('#txtFileAnagrafico').val(json['nome_file_controdeduzioni_anagrafico']);
		            			            	
		            	$('#fieldsetOutputControdeduzioni').show();
		            	
                    }
	            	else
                    {
	            		_FLUSSO_GENERATO = false;
	            		
		            	NS_LOADING.hideLoading();
                    	
                    	home.NOTIFICA.error({message: "Attenzione errore nella generazione del file di output controdeduzioni", timeout: 5, title: "Error"});
                    	logger.info("Attenzione errore nella generazione del file di output controdeduzioni");
                    }
	            	
	            	//NS_PAGINA.Events.setButton();
	            	
	            },
	            error: function (resp)
	            {
	            	_FLUSSO_GENERATO = false;

	            	var json = JSON.parse(resp);
	            	
	            	NS_LOADING.hideLoading();
	                home.NOTIFICA.error({message: "Attenzione errore nella generazione dei Flussi " + json.message, timeout: 5, title: "Error"});
	                logger.info("Errore nella chiamata ajax di generazione file output controdeduzioni");
	            }
	       });
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
			
			var urlToCall = _URL_CONTRODEDUZIONI + 'visualizza?' ;
			var dataToSend	= 	'user=' + home.baseUser.IDEN_PER + '::File=' + file;

			NS_CONTRODEDUZIONI_FILES.Style.hideFieldsetOutputFile();
			
			document.getElementById('iOutputFile').src = "proxy?CALL="+ urlToCall +"&PARAM="+dataToSend+"&METHOD=GET&FILE="+file;
			
			NS_CONTRODEDUZIONI_FILES.Style.showFieldsetOutputFile();
			$('#fieldsetOutputFile > legend').html(descr);
		},
		
		Style:{
			hideFieldsetOutputFile : function(){
				$('#fieldsetOutputFile').hide();
				$('#fieldsetOutputFile').attr('src','').hide();
			},
			showFieldsetOutputFile : function(){
				$('#fieldsetOutput').show();
			}
		}
		
};
//Grab the files and set them to our variable
function prepareUpload(event)
{
  files = event.target.files;
}
