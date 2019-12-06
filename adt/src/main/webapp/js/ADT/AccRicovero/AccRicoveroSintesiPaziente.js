var NS_SINTESI_PAZIENTE = {
		
		tpl : null,
		ricoveroSelected : null,
		
		init : function(){

			NS_SINTESI_PAZIENTE.setButtonScheda();
			
			if (NS_SINTESI_PAZIENTE.tpl !== null){
				return;
			}
			
			// Mostro il velo di attesa.
			NS_LOADING.showLoading({"timeout" : 0});
			
			// Implementazione converter per gestione DATE
			$.views.converters({
				
				  dateConverter : function(value) {	
					  
					  var formatIn = this.tagCtx.props.formatIn;
					  var formatOut = this.tagCtx.props.formatOut;
					  var result = value != null ? moment(value, formatIn).format(formatOut) : "";
				     
					  return result;
				  }
			});

			$.get("config/ADT/templates/SINTESI_RICOVERO/structure.txt", function(value) {
				
				NS_SINTESI_PAZIENTE.tpl = $.templates(value);
				
				$("#tabSintesiPaziente").append(
						NS_SINTESI_PAZIENTE.tpl.render(
								NS_CONTATTO_METHODS.getContattiAnagrafica(_JSON_CONTATTO.anagrafica.id)
						)
				);
				
				NS_SINTESI_PAZIENTE.setEvents();
				NS_SINTESI_PAZIENTE.selezionaRicovero();
				NS_LOADING.hideLoading();
			});
		},
		
		/**
		 * Definizione dei vari eventi sugli elementi della pagina.
		 * <ul>
		 * 	<li>Al click su ogni codice ICD viene visualizzata la rispettiva descrizione.</li>
		 *  <li>Gestione evento per la stampa della SDO relativa ad ogni ricovero,</li>
		 * </ul>
		 * 
		 * @author alessandro.arrighi
		 */
		setEvents : function(){
			
			NS_SINTESI_PAZIENTE.ricoveroSelected = _JSON_CONTATTO.id;
			
			$(".tdDescrizioneICD > input").css({"visibility":"hidden"});
			$(".butStampaSDO").on("click", function(){
				NS_SINTESI_PAZIENTE.stampaSDO($(this).attr("iden_contatto"));
			});
			
			$(".spICD").on("click", function(){
				$(".tdDescrizioneICD > input").css({"visibility":"hidden"});
				$(".spICD").removeClass("spICDSelected");
				$(this).addClass("spICDSelected");
				$(this).closest("TABLE").find(".tdDescrizioneICD > input").val($(this).attr("data-descrizione")).css({"visibility":"visible"});
			});
		},

		/**
		 * A partire dalla cartella aperta viene evidenziato il riepilogo corrispondente.
		 * La gestione dello sfondo del riepilogo avviene tramite due classi appicate direttamente al fieldset.
		 * Le classi in questione sono <b>fldSintesiPazienteClose</b> e <b>fldSintesiPazienteOpen</b>
		 * 
		 * @author alessandro.arrighi
		 */
		selezionaRicovero : function(){
			$("fieldset[iden_contatto='" + _JSON_CONTATTO.id + "']").removeClass("fldSintesiPazienteClose").addClass("fldSintesiPazienteOpen");
		},
		
		/**
		 * Definizione dei button specifici per il tabulatore.
		 * Visualizzo solo il button di chusura della pagina.
		 * 
		 * @author alessandro.arrighi
		 */
		setButtonScheda : function(){
			$(".butChiudi").show();
		},
		
		/**
		 * Tutte le sintesi dei ricoveri DIMESSI visualizzano il button STAMPA SDO.
		 * Al click viene controllato in lazy se per il contatto richiesto la SDO e' firmata.
		 *  
		 * @author alessandro.arrighi
		 */
		stampaSDO : function(idenContatto){
			
			var _iden_contatto = idenContatto == null ? NS_SINTESI_PAZIENTE.ricoveroSelected : idenContatto;
			var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

	   		var parameters =
	        {
	            'P_IDEN_CONTATTO' : {t: 'N', v : _iden_contatto, d:'I'},
				'P_RESULT' : {t:'C',d:'O'}
	        };
	   		
	        var xhr =  db.call_procedure(
	        {
	            id: 'FX$PCK_SDO.GET_SDO',
	            parameter : parameters
	        });
	        
	        xhr.done(function (data, textStatus, jqXHR) {
	        	
	        	var message = data['P_RESULT'].split('|')[1];
	        	message = message.replace(/\n/g,'\\n');
	        	
	            var resp =  JSON.parse(message);
	        
	        	if (resp.success && resp.firma)
	        	{
	        			var par = {
	        					PRINT_DIRECTORY : 'SDO',
	        					PRINT_REPORT : "SDO",
	        					PRINT_PROMPT : "&promptpIdenContatto=" + _iden_contatto,
	        					STAMPANTE : home.basePC.STAMPANTE_REFERTO,
	        					beforeApri : home.NS_FENIX_PRINT.initStampa
	        			};
	        			
	                    home.NS_FENIX_PRINT.caricaDocumento(par);
	                    home.NS_FENIX_PRINT.apri(par);
	        	}		
	        	else if (resp.success && !resp.firma)
	        	{
	        		home.NOTIFICA.error({message: 'Impossibile stampare SDO non firmata' ,timeout: 5, title: "Error"});
	        	}
	        	else if (!resp.success)
	        	{
	        		logger.error("Error Recupro Info SDO - NS_SINTESI_PAZINETE.stampaSDO" + NS_SINTESI_PAZIENTE.ricoveroSelected + " -> " + GetSDOResponse.message);
	                home.NOTIFICA.error({message: "Attenzione Errore durante Recupero Informazioni SDO", title: "Error"});
	            }
	        	
	        	NS_DIMISSIONE_SDO.aggiornaPagina();
	        	
	        });
				
		}
};