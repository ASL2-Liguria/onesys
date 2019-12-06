var NS_PAC_WK_ACCESSI = {
		
		wkAccessi : null,
		
		init : function(){
			
			if (!NS_PAC_WK_ACCESSI.wkAccessi)
			{
	            var params = {
	            	container : "divWkAccessiPAC",
		    		id : 'WK_PAC_ACCESSI_PAZIENTE',
	                aBind : ['iden_contatto'],
	                aVal : [_IDEN_CONTATTO]
	            };
	            $("div#divWkAccessiPAC").height("200px");
	            
	            NS_PAC_WK_ACCESSI.wkAccessi = new WK(params);
	            NS_PAC_WK_ACCESSI.wkAccessi.loadWk();
	        }
	    },
	    
	    inserisciAccessoPAC : function(rec) 
	    {
	    	var _json_contatto = NS_CONTATTO_METHODS.getContattoById(rec.IDEN_CONTATTO);
	        var _table = $(	"<table>" +
	        		"<tr><td colspan='2'><div id='gestioneInizioAccessoPAC'></div></td></tr>" +
	        		"<tr class='trOraDialog'><td><span>Ora Inizio</span></td><td class='tdText oracontrol w80px'><input type='hidden' id='h-txtDataAccessoPAC'/><input type='text' id='txtOraInizioAccessoPAC' class='tdObb' /></td></tr>" +
	        		"<tr class='trOraDialog'><td><span>Ora Fine</span></td><td class='tdText oracontrol w80px'><input type='text' id='txtOraFineAccessoPAC' class='tdObb' /></td></tr>" +
	        	"</table>");
	        
	        var completaInserimentoAccessoPAC = function(){
	        	
	        	var _ora_inizio = $('#txtOraInizioAccessoPAC').val();
	        	var _ora_fine = $('#txtOraFineAccessoPAC').val();
	         	var _data = $('#h-txtDataAccessoPAC').val();
	             
	         	if (_data === "" || _data == null) {
	         		return home.NOTIFICA.error({message: "Selezionare la data di inizio dell'accesso PAC", timeout: 6, title: 'Error'});
	         	}
	         
	         	if (_ora_inizio.length < 5) {
	         		return home.NOTIFICA.error({message: "Popolare correttamente l'ora di inizio dell'accesso PAC", timeout: 6, title: 'Error'});
	         	}
	         
	         	if (_ora_fine.length < 5) {
	         		return home.NOTIFICA.error({message: "Popolare correttamente l'ora di fine dell'accesso PAC", timeout: 6, title: 'Error'});
	         	}
	         
	         	var _json_assistenziale = {};
	             
	         	$.extend(_json_assistenziale, _json_contatto.contattiAssistenziali[_json_contatto.contattiAssistenziali.length - 1]);
	         
	         	_json_assistenziale.id = null;
	         	_json_assistenziale.stato = {id : null, codice : "ADMITTED"};
	            _json_assistenziale.dataInizio = moment(_data,"DD/MM/YYYY").format("YYYYMMDD") + _ora_inizio;
	            _json_assistenziale.dataFine = moment(_data,"DD/MM/YYYY").format("YYYYMMDD") + _ora_fine;
	            _json_assistenziale.uteInserimento = {id : home.baseUser.IDEN_PER, codice : null};
	            _json_assistenziale.note = "Accesso PAC aperto in data " + moment().format("YYYYMMDDHH:mm") + " dall'utente " + home.baseUser.USERNAME + " (personale " + home.baseUser.IDEN_PER + ")";
				_json_assistenziale.codiciEsterni =  {"codice1": null, "codice2": null, "codice3": null, "contatto": null};

				var pSegnalaAccesso = {"contatto" : _json_assistenziale, "hl7Event" : "Segnala accesso PAC","notifica" : {"show" : "S", "message" : "Inserimento Accesso PAC Avvenuto con Successo", "errorMessage" : "Errore Durante Inserimento Accesso PAC", "timeout" : 3}, "cbkSuccess" : function(){ $.dialog.hide(); NS_PAC_WK_ACCESSI.wkAccessi.refresh();}, "cbkError" : function(){}};

				NS_CONTATTO_METHODS.upsertAccesso(pSegnalaAccesso);
	        };
	        
	        $.dialog(_table, {
					buttons : 	
					[
					 	{label: "Annulla", action: function (ctx) { $.dialog.hide(); }},
				        {label : "Prosegui", action : function(){ completaInserimentoAccessoPAC(); }}
					],
					title : "Inserisci Accesso PAC " + _json_contatto.codice.codice,
		          	height : 340,
		          	width : 250
	        });
	    
	        _table.Zebra_DatePicker({always_visible: $("#gestioneInizioAccessoPAC"), direction: [moment(_json_contatto.dataInizio,"YYYYMMDDHH:mm").format("DD/MM/YYYY"), moment().format("DD/MM/YYYY")], onSelect: function(data,dataIso) {
	        	$("#h-txtDataAccessoPAC").val(data);
	        }});
	        
	        $('#txtOraInizioAccessoPAC, #txtOraFineAccessoPAC').live().setMask("29:59").keypress(function() {
	            
	        	var currentMask = $(this).data('mask').mask;
	            var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
	             
	            if (newMask != currentMask) {
	            	$(this).setMask(newMask);
	            }
	             
	         });
	         
	         $("#gestioneInizioAccessoPAC div.Zebra_DatePicker").css({"position":"relative"});
	         $(".trOraDialog > td").css({"padding-top":"5px"});
	    },
	    
	    chiudiAccessoPAC : function(rec) 
	    {
	    	var _json_contatto = NS_CONTATTO_METHODS.getContattoById(rec.IDEN_CONTATTO);
	        var _json_assistenziale = null;
	    	
	        for (var i = 0; i < _json_contatto.contattiAssistenziali.length; i++)
	    	{
	    		if (_json_contatto.contattiAssistenziali[i].id === rec.IDEN_ACCESSO) {
	    			_json_assistenziale = _json_contatto.contattiAssistenziali[i];
	    		}
	    	}
	        
	        var _ora_fine_init = _json_assistenziale.dataFine == null ? moment().format("HH:mm") : moment(_json_assistenziale.dataFine,"YYYYMMDDHH:mm").format("HH:mm");
	        
	    	var _table = $(	"<table>" +
	        		"<tr><td colspan='2'>Per completare la chiusura dell'accesso aperto in data <b>" + moment(_json_assistenziale.dataInizio,"YYYYMMDDHH:mm").format("DD/MM/YYYY") + "</b> confermare i dati di chiusura.<br /></td></tr>" +
	        		"<tr class='trOraDialog'><td><span>Ora Inizio</span></td><td class='tdText oracontrol w80px'><input type='text' id='txtOraInizioAccessoPAC' class='tdObb' value='" + moment(_json_assistenziale.dataInizio,"YYYYMMDDHH:mm").format("HH:mm") + "' /></td></tr>" +
	        		"<tr class='trOraDialog'><td><span>Ora Fine</span></td><td class='tdText oracontrol w80px'><input type='text' id='txtOraFineAccessoPAC' class='tdObb' value='" + _ora_fine_init + "' /></td></tr>" +
	        	"</table>");
	        
	        var completaChiusuraAccessoPAC = function(){
	        	
	        	var _ora_inizio = $('#txtOraInizioAccessoPAC').val();
	        	var _ora_fine = $('#txtOraFineAccessoPAC').val();
	         
	         	if (_ora_inizio.length < 5) {
	         		return home.NOTIFICA.error({message: "Popolare correttamente l'ora di inizio dell'accesso PAC", timeout: 6, title: 'Error'});
	         	}
	         
	         	if (_ora_fine.length < 5) {
	         		return home.NOTIFICA.error({message: "Popolare correttamente l'ora di fine dell'accesso PAC", timeout: 6, title: 'Error'});
	         	}
	         
	         	_json_assistenziale.stato = {id : null, codice : "DISCHARGED"};
	         	_json_assistenziale.attivo = false;
	            _json_assistenziale.dataInizio = moment(_json_assistenziale.dataInizio,"YYYYMMDDHH:mm").format("YYYYMMDD") + _ora_inizio;
	            _json_assistenziale.dataFine = moment(_json_assistenziale.dataInizio,"YYYYMMDDHH:mm").format("YYYYMMDD") + _ora_fine;
	            _json_assistenziale.uteModifica = {id : home.baseUser.IDEN_PER, codice : null};
	            _json_assistenziale.note = "Accesso PAC chiuso in data " + moment().format("YYYYMMDDHH:mm") + " dall'utente " + home.baseUser.USERNAME + " (personale " + home.baseUser.IDEN_PER + ")";
				_json_assistenziale.codiciEsterni =  {"codice1": null, "codice2": null, "codice3": null, "contatto": null};

				var pChiudiAccesso = {"contatto" : _json_assistenziale, "hl7Event" : "Chiudi Accesso PAC","notifica" : {"show" : "S", "message" : "Chiusura Accesso PAC Avvenuta con Successo", "errorMessage" : "Errore Durante Chiusura Accesso PAC", "timeout" : 3}, "cbkSuccess" : function(){ $.dialog.hide(); NS_PAC.aggiornaPagina(); }, "cbkError" : function(){}};

				NS_CONTATTO_METHODS.upsertAccesso(pChiudiAccesso);
	        };
	        
	        $.dialog(_table, {
					buttons : 	
					[
					 	{label: "Annulla", action: function (ctx) { $.dialog.hide(); }},
				        {label : "Prosegui", action : function(){ completaChiusuraAccessoPAC(); }}
					],
					title : "Chiusura Accesso PAC " + _json_contatto.codice.codice,
		          	height : 110,
		          	width : 350
	        });
	        
	        $('#txtOraInizioAccessoPAC, #txtOraFineAccessoPAC').live().setMask("29:59").keypress(function() {
	            
	        	var currentMask = $(this).data('mask').mask;
	            var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
	             
	            if (newMask != currentMask) {
	            	$(this).setMask(newMask);
	            }
	             
	         });
	         
	         $(".trOraDialog > td").css({"padding-top":"5px"});
	    },
	    
	    annullaAccessoPAC : function(rec) 
	    {
	    	var _json_contatto = NS_CONTATTO_METHODS.getContattoById(rec.IDEN_CONTATTO);
	    	var _json_assistenziale = null;
	    	
	        for (var i = 0; i < _json_contatto.contattiAssistenziali.length; i++)
	    	{
	    		if (_json_contatto.contattiAssistenziali[i].id === rec.IDEN_ACCESSO) {
	    			_json_assistenziale = _json_contatto.contattiAssistenziali[i];
	    		}
	    	}
	        
	        var completaAnnullamentoAccessoPAC = function(){

	            _json_assistenziale.uteModifica = {id : home.baseUser.IDEN_PER, codice : null};
	            _json_assistenziale.note = "Accesso PAC annullato in data " + moment().format("YYYYMMDDHH:mm") + " dall'utente " + home.baseUser.USERNAME + " (personale " + home.baseUser.IDEN_PER + ")";
	            
				var pAnnullaAccesso = {"contatto" : _json_assistenziale, "hl7Event" : "Annulla Accesso PAC","notifica" : {"show" : "S", "message" : "Annullamento Accesso PAC Avvenuto con Successo", "errorMessage" : "Errore Durante Annullamento Accesso PAC", "timeout" : 3}, "cbkSuccess" : function(){ $.dialog.hide(); NS_PAC_WK_ACCESSI.wkAccessi.refresh();}, "cbkError" : function(){}};

				NS_CONTATTO_METHODS.annullaAccesso(pAnnullaAccesso);
	        };
	        
	        var _message = "Si conferma di annullare l'accesso previsto in data " + moment(_json_assistenziale.dataInizio,"YYYYMMDDHH:mm").format("DD/MM/YYYY") + "?";
	        
	        $.dialog(_message, {
						buttons : 	
						[
						 	{label: "Annulla", action: function (ctx) { $.dialog.hide(); }},
					        {label : "Prosegui", action : function(){ completaAnnullamentoAccessoPAC(); }}
						],
						title : "Annullamento Accesso PAC " + _json_contatto.codice.codice,
			          	height : 75,
			          	width : 350
	        });
	    }
	    
	};