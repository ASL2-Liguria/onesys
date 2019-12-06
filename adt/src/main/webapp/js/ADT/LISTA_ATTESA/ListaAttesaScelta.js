var _IDEN_ANAG;

jQuery(document).ready(function () {
	NS_LISTA_ATTESA_SCELTA.init();
});

var NS_LISTA_ATTESA_SCELTA = {
	
		init : function(){
			NS_LISTA_ATTESA_SCELTA.Events.setEvents();
			NS_LISTA_ATTESA_SCELTA.Style.setGenericStyle();
            NS_LISTA_ATTESA_SCELTA.gestAutologin();
		},

        gestAutologin : function(){
        	
            if (typeof $("#IDEN_ANAG").val() == 'undefined' || $("#IDEN_ANAG").val() == '' )
            {
                var CODICE_FISCALE = $("#CODICE_FISCALE").val();
                var COGNOME = $("#COGNOME").val();
                var COMUNE_NASCITA = $("#COMUNE_NASCITA").val();
                var NOME = $("#NOME").val();
                var DATA_NASCITA = $("#DATA_NASCITA").val();
                var SESSO = $("#SESSO").val();

                var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

	            var xhr = db.call_function(
	            {
	                id: 'ASL2_IDENTIFICA_ANAG',
	                parameter : { 
	                	"p_CODICE_FISCALE" : {v : CODICE_FISCALE, t:'V', d:'I'},
	                	"p_COGNOME" : {v : COGNOME, t:'V', d:'I'},
	                	"p_COM_NASC" : {v : COMUNE_NASCITA, t:'V', d:'I'},
	                	"p_DATA_NASCITA" : {v : DATA_NASCITA, t:'V', d:'I'},
	                	"p_NOME" : {v : NOME, t:'V', d:'I'},
	                	"p_SESSO" : {v : SESSO, t:'V', d:'I'}
	                }
	            });

	            xhr.done(function (data, textStatus, jqXHR) {
	            	
	            	if (window.DOMParser) 
	            	{
                        parser = new DOMParser();
                        xmlDoc = parser.parseFromString(data.p_result, "text/xml");
                    } 
	            	else 
                    { 
	            		// Internet Explorer
                        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                        xmlDoc.async = false;
                        xmlDoc.loadXML(data.p_result);
                    }
	            	
	            });
	            
	            xhr.fail(function (jqXHR, textStatus, errorThrown) {
	                logger.error("ASL2_IDENTIFICA_ANAG Error -> " + JSON.stringify(jqXHR));
	                home.NOTIFICA.error({message: "Error Identificazione Anagrafica", title: "Error"});
	            });

            }
            else
            {
                _IDEN_ANAG = $("#IDEN_ANAG").val();
            }

        },
        
		Events : {
			
			setEvents : function(){

		        $('#butApplica').on('click', function()
        		{
		        	var completaInserimento = function()
            		{
            			var descrLista = $('#cmbLista').find('option:selected').attr('data-descr');
	        			
			        	home.DESCRIZIONE_CDC_LISTA = $('#cmbReparto').find('option:selected').attr('data-descr');
	        			
	        			if(typeof descrLista !== "undefined" && descrLista !== "")
	            		{
	            			var url = 'page?KEY_LEGAME=LISTA_ATTESA_WRAPPER' + 
	            			'&IDEN_ANAG='+_IDEN_ANAG +
	    					'&STATO_PAGINA=I' + 
	    					'&ID_LISTA=' + $('#cmbLista option:selected').val() +
	    					'&BUTTONS=' + $('#cmbLista option:selected').attr('data-buttons') +
	    					'&USERNAME=' + home.baseUser.USERNAME + 
	    					'&IDEN_PER=' + home.baseUser.IDEN_PER +
	    					'&STATO_PAGINA=I';
	            			
	            			$('#iframeListaAttesa').attr('src', url);
	            		}
	        			else
	        			{
	            			home.NOTIFICA.error({message: 'Valorizzare Lista di Attesa', timeout: 3, title: 'Error'});
	            		}
            		};
		        	
		        	var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

		            var xhr = db.call_function(
		            {
		                id: 'FX$PCK_LISTA_ATTESA_PZ.IS_PAZIENTE_IN_LISTA',
		                parameter: { 
		                	"P_IDEN_ANAGRAFICA" : {v : _IDEN_ANAG, t:'N', d:'I'},
		                	"P_ID_LISTA" : {v : $('#cmbLista option:selected').val(), t:'N', d:'I'}
		                }
		            });

		            xhr.done(function (data, textStatus, jqXHR) {
		            	
		            	if (data["p_result"] > 0)
		            	{
		            		home.DIALOG.si_no({
		    		           	title : "Inserimento Paziente In Lista",
		    		           	msg : "Il Paziente Risulta Gi&agrave; Presente In Lista Di Attesa. Si Conferma Il Reinserimento?",
		    		           	cbkNo : function(){ $('#iframeListaAttesa').attr('src', 'about:blank'); },
		    		           	cbkSi: function(){
		    		           		completaInserimento();
		    		           	}
		    	        	}); 
		            			
		            	} else {
		            		completaInserimento();
	            		}
		            	
		            });
		            
		            xhr.fail(function (jqXHR, textStatus, errorThrown) {
		                logger.error(JSON.stringify(jqXHR));
		                home.NOTIFICA.error({message: "Errore Determinazione Presenza Paziente In Lista", title: "Error"});
		            });

        		});
		        
		        $('#butChiudi').on('click',function(){NS_FENIX_SCHEDA.chiudi();});
		        
			}
		},
		
		Style : {
			
			setGenericStyle : function(){
				
				var hBody = $('#page').height();
				var hHeader = $('.headerTabs').height();
				var hFooter = $('.footerTabs').height();
				var hContentTabs = $('.contentTabs').height();
				
			    $('#cmbLista').css({"width":"420"});
		        $('.headerTabs').hide();
		        $('.footerTabs').hide();
		        $('#page').css({'overflow':'hidden','height': hBody});
		        $('.contentTabs').css({'height': hContentTabs + hHeader + hFooter})
		        $('#iframeListaAttesa').css({'width':'100%','height': hBody - 125});
			}
		}
};