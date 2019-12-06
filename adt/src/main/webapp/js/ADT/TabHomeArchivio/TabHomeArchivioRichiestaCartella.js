// stato richiesta singola cartella
var COD_RIC_CART_EFFETTUATA='01';
var COD_RIC_CART_ARRIVATA='02';

// stato richiesta
var COD_RICH_EFFETTUATA = '01';
var COD_RICH_NON_COMPLETA = '02';
var COD_RICH_COMPLETA = '03';
var COD_COPIA_FATTA_FIRMATA = '04';
var COD_COPIA_CONSEGNATA = '05';
var COD_COPIA_SPEDITA='06';
var COD_COPIA_SPEDITA_REPARTO='07';
var COD_COPIA_SPEDITA_ENTE='08';
var COD_RICH_SOSPESA='15';
var COD_RICH_ANNULLATA='16';

var NS_HOME_ARCHIVIO_RICHIESTE = 
{
	    inserisciRichiesta: function(rec)
	    {
	    	// Gestione inserimento richiesta cartella su piu' cartelle
	        var flgRichiestaOk = true;
	        var idenAnag = 0;
	        var idenContatti = "";
	        var nosologici = "";
	        
	        // Controllo che lo stato cartella sia <> persa o sequestrata
	        // Controllo che le cartelle appartengano allo stesso paziente
	        for (var i=0; i<rec.length; i++)
	        {
	            if (rec[i].CODICE_STATO_CARTELLA == cartellaPersa || rec[i].CODICE_STATO_CARTELLA == cartellaSequestrata)
	            {
	                alert('La cartella '+rec[i].CODICE+ ' risulta ' +rec[i].STATO_CARTELLA+ '. Non e\' possibile fare richieste');
	                flgRichiestaOk=false;
	            }
	            
	            if (i==0) 
	            {
	                idenAnag = rec[i].IDEN_ANAGRAFICA;
	                idenContatti += rec[i].IDEN_CONTATTO;
	                nosologici += rec[i].CARTELLA;
	            }
	            else
	            {
	                if (rec[i].IDEN_ANAGRAFICA==idenAnag){
	                    idenContatti+=','+rec[i].IDEN_CONTATTO;
	                    nosologici+=','+rec[i].CARTELLA;
	                }
	                else
	                {
	                    home.NOTIFICA.error({message: "Le cartelle selezionate non appartengono allo stesso paziente! Non e\' possibile fare richieste", timeout: 6, title: 'Error'});
	                    flgRichiestaOk = false;
	                    break;
	                }
	
	            }
	        }
	
	        if (flgRichiestaOk)
	        {
	            // Apre la pagina di inserimento richiesta
	            top.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=RICHIESTA_CARTELLA&IDEN_CONTATTI='+idenContatti+'&NOSOLOGICI='+nosologici+'&IDEN_ANAG='+rec[0].IDEN_ANAGRAFICA+'&_STATO_PAGINA=I',id:'InsRichiestaCartella',fullscreen:true});
	        }
	    },
	    
	    modificaRichiesta: function(rec)
	    {
	        var flgRichiestaOk = true;
	        var idenAnag = 0;
	        var idenContatti = "";
	        var nosologici = "";
	        var idenRichiesta = 0;
	        
	        // Verifica che le cartelle selezionate appartengano alla stessa richiesta
	        for (var i=0; i<rec.length; i++)
	        {
	            if (i == 0)
	            {
	                idenAnag = rec[i].IDEN_ANAGRAFICA;
	                idenContatti += rec[i].IDEN_CONTATTO;
	                nosologici += rec[i].CARTELLA;
	                idenRichiesta = rec[i].IDEN_RICHIESTA;
	                
	                if (idenRichiesta == null)
	                {
	                    home.NOTIFICA.error({message: "Numero richiesta non presente. Impossibile modificare", timeout: 6, title: 'Error'});
	                    flgRichiestaOk = false;
	                    break;
	                }
	            }
	            else
	            {
	                if (idenRichiesta==null)
	                {
	                    home.NOTIFICA.error({message: "Numero richiesta non presente per una o pi&ugrave; cartelle. Impossibile modificare", timeout: 6, title: 'Error'});
	                    flgRichiestaOk = false;
	                    break;
	                }
	                else if (idenRichiesta!=rec[i].IDEN_RICHIESTA)
	                {
	                    home.NOTIFICA.error({message: "Le cartelle selezionate appartengono a richieste diverse. Impossibile modificare", timeout: 6, title: 'Error'});
	                    flgRichiestaOk = false;
	                    break;
	                }
	                
	                idenContatti += ',' + rec[i].IDEN_CONTATTO;
	                nosologici += ',' + rec[i].CARTELLA;
	            }
	        }
	        
	        if (flgRichiestaOk){
	            // Apre la pagina di inserimento richiesta
	            top.NS_FENIX_TOP.apriPagina({url:'page?KEY_LEGAME=RICHIESTA_CARTELLA&IDEN_CONTATTI='+idenContatti+'&NOSOLOGICI='+nosologici+'&IDEN_ANAG='+idenAnag+'&IDEN_RICHIESTA='+rec[0].IDEN_RICHIESTA+'&_STATO_PAGINA=E',id:'ModRichiestaCartella',fullscreen:true});
	        }
	    },
	    
	    setCartellaArrivata: function(rec){
	    	
	    	var ta = $(	"<table>" +
	    					"<tr><td><div id='gestioneRichiesteCartelle'></div></td></tr>" +
	    					"<tr><td id='tdOraCartella' class='tdText oracontrol w80px'><span>Ora </span><input type='hidden' id='h-txtDataArrivoCartella'/><input type='text' id='txtOraArrivoCartella' class='tdObb' /></td></tr>" +
	    				"</table>");
	        
	    	$.dialog(ta, {
	            buttons : 	[{label: "Annulla", action: function (ctx) { $.dialog.hide(); }},
	                      	 {label : "Prosegui", action : function(){ completaArrivoCartella(rec); }}
	            			],
	            title : "Gestione richieste cartelle",
	            height:340,
	            width:250
	        });
	        
	    	var completaArrivoCartella = function(rec){
	
	        	var _ora = $('#txtOraArrivoCartella').val();
	        	var _data = $('#h-txtDataArrivoCartella').val();
	        	var dataOra = _data + ' ' + _ora;
	            var a_idenRichiesta = new Array();
	            
	            if (_data == "" || _data == null){
	            	return home.NOTIFICA.error({message: "Selezionare Data Richiesta Cartella", timeout: 3, title: 'Error'});
	            }
	            
	            if (_ora.length < 5) {
	            	return home.NOTIFICA.error({message: "Popolare Correttamente l'Ora di Arrivo Cartella", timeout: 3, title: 'Error'});
	            }
	            
	            for (var i=0; i < rec.length; i++)
	            {
	            	//if (rec[i].COD_RIC_CARTELLA == COD_RIC_CART_EFFETTUATA)
	            	//{
	            		var db = $.NS_DB.getTool({setup_default:{datasource : 'ADT'}});

			            db.call_procedure(
		                {
		                    id: "ADT_MOVIMENTI_CARTELLA.setCartellaArrivata",
		                    parameter:
		                    {
		                        "pIdenContatto" : {v:rec[i].IDEN_CONTATTO,t:'N'},
		                        "pIdenRichiesta" : {v:rec[i].IDEN_RICHIESTA,t:'N'},
		                        "pIdenPer" : {v:home.baseUser.IDEN_PER,t:'N'},
		                        "pData" : {v:dataOra,t:'V'},
		                        "p_result":{d:'O',t:'V'}
		                    },
		                    success : function(data)
		                    {
		                    	if (data.p_result == 'KO') {
		                    		home.NOTIFICA.error({message: "Attenzione errore nel salvataggio", title: "Error"});
		                        } else if (data.p_result == 'OK') {
		                        	home.NOTIFICA.success({message: 'Salvataggio effettuato correttamente', timeout: 2, title: 'Success'});
		                        	NS_HOME_ARCHIVIO_WK.wkRichiesteCartelle.refresh();
		                        } else {
		                            alert(resp.p_result);
		                        }
		                    },
		                    error : function(data)
		                    {
		                        logger.error('ADT_MOVIMENTI_CARTELLA.setCartellaArrivata Error -> ' + JSON.stringify(data));
		                    }
		
		                });
			            
		                if ($.inArray(rec[i].IDEN_RICHIESTA,a_idenRichiesta) == -1)
		                {
		                    a_idenRichiesta.push(rec[i].IDEN_RICHIESTA);
		                }
		            //}
	            }
	            
		        /*for (i=0; i<a_idenRichiesta.length; i++)
		        {
		        	var db = $.NS_DB.getTool({setup_default:{datasource : 'ADT'}});

		            db.call_procedure(
	                {
	                    id: 'ADT_MOVIMENTI_CARTELLA.setStatoRichiestaCompleta',
	                    parameter:
	                    {
	                    	"pIdenRichiesta" : {v:rec[i].IDEN_RICHIESTA,t:'N'},
	                        "pIdenPer" : {v:home.baseUser.IDEN_PER,t:'N'},
	                        "pData" : {v:dataOra,t:'V'},
	                        "p_result":{d:'O',t:'V'}
	                    },
	                    success : function(data)
	                    {
	                    	if (data.p_result == 'KO') {
	                    		home.NOTIFICA.error({message: "Attenzione errore nel salvataggio".errorSave, title: "Error"});
	                        } else if (data.p_result == 'OK') {
	                        	home.NOTIFICA.success({message: 'Salvataggio effettuato correttamente', timeout: 2, title: 'Success'});
	                        } else {
	                            alert(resp.p_result);
	                        }
	                    },
	                    error : function(data)
	                    {
	                        logger.error('ADT_MOVIMENTI_CARTELLA.setStatoRichiestaCompleta Error -> ' + JSON.stringify(data));
	                    }
	
	                });
		            
		            NS_HOME_ARCHIVIO_WK.wkRichiesteCartelle.refresh();
		        }//for*/
		        
		        $.dialog.hide();
	    	};
	    	
	        ta.Zebra_DatePicker({always_visible: $("#gestioneRichiesteCartelle"), direction: false, startWithToday: true, onSelect: function(data,dataIso) {
	        	$("#h-txtDataArrivoCartella").val(data);
	        }});
	        
	        $('#txtOraArrivoCartella').live().setMask("29:59").keypress(function() {
	            
	        	var currentMask = $(this).data('mask').mask;
	            var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
	            
	            if (newMask != currentMask) {
	                $(this).setMask(newMask);
	            }
	            
	        }).val(moment().format('HH:mm'));
	
	        
	        $("#gestioneRichiesteCartelle div.Zebra_DatePicker").css({"position":"relative"});
	        $("#tdOraCartella").css({"padding-top":"5px"});
	        
	    },
    
	    setStatoRichiestaCartella : function(rec,stato,statoDa){
	    	
	    	var ta = $(	"<table>" +
					"<tr><td><div id='gestioneRichiesteCartelle'></div></td></tr>" +
					"<tr><td id='tdOraCartella' class='tdText oracontrol w80px'><span>Ora </span><input type='hidden' id='h-txtDataStatoCartella'/><input type='text' id='txtOraStatoCartella' class='tdObb' /></td></tr>" +
				"</table>");
	
			$.dialog(ta, {
			    buttons : 	[{label: "Annulla", action: function (ctx) { $.dialog.hide(); }},
			              	 {label : "Prosegui", action : function(){ completaStatoCartella(); }}
			    			],
			    title : "Gestione richieste cartelle",
			    height:340,
			    width:250
			});
	        
			var completaStatoCartella = function(){
				
				var _ora = $('#txtOraStatoCartella').val();
	        	var _data = $('#h-txtDataStatoCartella').val();
	        	var dataOra = _data + ' ' + _ora;
	        	
	        	if (_data == "" || _data == null){
	            	return home.NOTIFICA.error({message: "Selezionare Data Richiesta Cartella", timeout: 3, title: 'Error'});
	            }
	            
	            if (_ora.length < 5) {
	            	return home.NOTIFICA.error({message: "Popolare Correttamente l'Ora di Arrivo Cartella", timeout: 3, title: 'Error'});
	            }
	            
	            for (var i=0; i < rec.length;i++)
	            {
					if (rec[i].IDEN_RICHIESTA != null) 
	            	{

	            		var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

			            db.call_procedure(
		                {
		                    id: 'ADT_MOVIMENTI_CARTELLA.setStatoRichiesta',
		                    parameter:
		                    {
		                        'pIdenRichiesta' : {"v":rec[i].IDEN_RICHIESTA,"t":"N"},
		                        'pStato' : {"v":stato,"t":"V"},
		                        'pIdenPer' : {"v":home.baseUser.IDEN_PER,"t":"N"},
		                        'pData': {"v":dataOra,"t":"V"},
								'p_result':{d:'O',t:'V'}
		                    },
		                    success: function(data){
		
		                    	if (data.p_result == 'KO') {
		                            home.NOTIFICA.error({message: "Attenzione errore in modifica stato".errorSave, title: "Error"});
		                        } else if (data.p_result == 'OK') {
		                            home.NOTIFICA.success({message: 'Modifica stato eseguita correttamente', timeout: 2, title: 'Success'});
		                        } else {
		                            alert(resp.p_result);
		                        }
		                    },
		                    error: function(data){
		                        logger.error('Non inserito COD_ENI' + JSON.stringify(data));
		                    }
		
		                });

	                }
	                else
	                {
	                    if (rec[i].IDEN_RICHIESTA == null) {
	                    	home.NOTIFICA.error({message:'Nessuna richiesta sulla cartella selezionata '+rec[i].CARTELLA,title:'Errore'});
	                    } else {
	                    	home.NOTIFICA.error({message:'La richiesta ' + rec[i].IDEN_RICHIESTA + ' non puo\' passare allo stato indicato!', title : 'Error'});
	                    }
	                }
	            }
	            
	            $.dialog.hide();
	            NS_HOME_ARCHIVIO_WK.wkRichiesteCartelle.refresh();
	            
			};
			
	        ta.Zebra_DatePicker({always_visible: $("#gestioneRichiesteCartelle"), direction: false, onSelect: function(data,dataIso) {
	        	$("#h-txtDataStatoCartella").val(data);
	        }});
	
	        $('#txtOraStatoCartella').live().setMask("29:59").keypress(function() {
	            
	        	var currentMask = $(this).data('mask').mask;
	            var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
	            
	            if (newMask != currentMask) {
	                $(this).setMask(newMask);
	            }
	            
	        }).val(moment().format('HH:mm'));
	
	        
	        $("#gestioneRichiesteCartelle div.Zebra_DatePicker").css({"position":"relative"});
	        $("#tdOraCartella").css({"padding-top":"5px"});
	    },
    
	    setColorBackground: function(data,td)
	    {
	        switch (data.COD_STATO_RICHIESTA)
	        {
	            case COD_RICH_EFFETTUATA:
	                td.addClass('clsBckWhite');
	                break;
	            case COD_RICH_NON_COMPLETA:
	                td.addClass('clsBckOrange');
	                break;
	            case  COD_RICH_COMPLETA:
	                td.addClass('clsBckPink');
	                break;
	            case COD_COPIA_FATTA_FIRMATA:
	                td.addClass('clsBckCyan');
	                break;
	            case COD_COPIA_CONSEGNATA:
	                td.addClass('clsBckBlue');
	                break;
	            case COD_COPIA_SPEDITA:
	                td.addClass('clsBckGreen');
	                break;
	            case COD_COPIA_SPEDITA_REPARTO:
	                td.addClass('clsBckYellow');
	                break;
	            case COD_COPIA_SPEDITA_ENTE:
	                td.addClass('clsBckLemmon');
	                break;
	            case COD_RICH_SOSPESA:
	                td.addClass('clsBckSilver');
	                break;
	            case COD_RICH_ANNULLATA:
	                td.addClass('clsBckBlack');
	                break;
	        }
	        return data.STATO_RICHIESTA;
	    },
	    setColorBackgStatoRichCartella:function(data,td){
	    	switch (data.COD_RIC_CARTELLA)
	        {
	            case COD_RIC_CART_EFFETTUATA:
	                td.addClass('clsBckWhite');
	                break;
	            case COD_RIC_CART_ARRIVATA:
	            	td.addClass('clsBckPink');
	            	break;
	        }
	    	return data.STATO_RIC_CARTELLA;
	    },
	    AnnullaStatoRichiestaCartella : function(rec)
	    {
	    	var db = $.NS_DB.getTool({setup_default:{datasource : 'ADT'}});

            db.call_procedure(
            {
                id: "ADT_MOVIMENTI_CARTELLA.annulla_stato_richiesta",
                parameter:
                {
                    "pIdenRichiesta" : {"v":rec[0].IDEN_RICHIESTA,"t":"N"},
                    "pIdenPer" : {"v":home.baseUser.IDEN_PER, "t":"N"},
                    "pIdenStato" : {"v":rec[0].IDEN_STATO,"t":"N"},
					"p_result":{"d":"O","t":"V"}
                },
                success : function(data)
                {
                	if (data.p_result == 'KO') {
                		home.NOTIFICA.error({message: "Attenzione errore in modifica stato", title: "Error"});
                    } else if (data.p_result == 'OK') {
                    	home.NOTIFICA.success({message: 'Modifica stato eseguita correttamente', timeout: 2, title: 'Success'});
                    } else {
                        alert(resp.p_result);
                    }
                },
                error : function(data)
                {
                    logger.error('ADT_MOVIMENTI_CARTELLA.annulla_stato_richiesta Error -> ' + JSON.stringify(data));
                }
            });
	    },
    
	    sollecitaCartelle : function(rec){
	    	
	    	var completaSollecitoCartella = function(){
	    		
	    		var _ora = $('#txtOraSollecitoCartella').val();
	        	var _data = $('#h-txtDataSollecitoCartella').val();
	        	var dataOra = _data + ' ' + _ora;
	        	
	        	if (_data == "" || _data == null){
	            	return home.NOTIFICA.error({message: "Selezionare Data Richiesta Cartella", timeout: 3, title: 'Error'});
	            }
	            
	            if (_ora.length < 5) {
	            	return home.NOTIFICA.error({message: "Popolare Correttamente l'Ora di Arrivo Cartella", timeout: 3, title: 'Error'});
	            }
	            
	    		for (var i = 0; i < rec.length; i++)
	        	{
	        		NS_CONTATTO_METHODS.getContattoById(rec[i].IDEN_CONTATTO, {
	        				
	        			cbkSuccess : function(){
	        					
	        					var _contatto = NS_CONTATTO_METHODS.contatto;
	        					_contatto.mapMetadatiString["DATA_SOLLECITO"] =  dataOra;
	        					_contatto.mapMetadatiString["UTENTE_SOLLECITO"] = home.baseUser.IDEN_PER;
	        					
	        					var pA08 = {"contatto" : _contatto, "hl7Event" : "A08", "notifica" : {"show" : "S", "timeout" : 3 ,"message" : "Sollecito Cartella " + rec[i].CARTELLA + " Avvenuto con Successo", "errorMessage" : "Errore Durante Sollecito Cartella " + rec[i].CARTELLA}, "cbkSuccess" : function(){}};
	        					
	        					// Dopo l'ultimo Update ricarico la WK
	        					if (i === rec.length - 1)
	        					{
	        						pA08.cbkSuccess = function(){
	        							$.dialog.hide();
	        							NS_HOME_ARCHIVIO_WK.wkRichiesteCartelle.refresh();
	        						};
	                    		}
	        					
	        					NS_CONTATTO_METHODS.updatePatientInformation(pA08);
	        				}
	        		});
	        	}
	    	};
	    	
	    	home.DIALOG.si_no({
	           	title : "Sollecito Cartelle",
	           	msg : "Si conferma l'operazione di SOLLECITO delle Cartelle selezionate?",
	           	cbkNo : function(){
	           		return;
	           	},
	           	cbkSi: function(){
	           		
	           		var ta = $(	"<table>" +
	        				"<tr><td><div id='gestioneRichiesteCartelle'></div></td></tr>" +
	        				"<tr><td id='tdOraCartella' class='tdText oracontrol w80px'><span>Ora </span><input type='hidden' id='h-txtDataSollecitoCartella'/><input type='text' id='txtOraSollecitoCartella' class='tdObb' /></td></tr>" +
	        			"</table>");
	           		
	                $.dialog(ta, {
	                    buttons : [{ label: "Annulla", action: function (ctx){ $.dialog.hide(); }},
	                               {label : "Prosegui", action : function(){ completaSollecitoCartella(); }}
	                    ],
	                    title : "Gestione richieste cartelle",
	                    height:340,
	                    width:250
	                });
	                
	                ta.Zebra_DatePicker(
	        		{
	        			always_visible : $("#gestioneRichiesteCartelle"), 
	        			direction : false, 
	        			onSelect : function(data, dataIso) {
	        				$("#h-txtDataSollecitoCartella").val(dataIso);
	        			}
	        		});
	                
	                $('#txtOraSollecitoCartella').live().setMask("29:59").keypress(function() {
	                    
	                	var currentMask = $(this).data('mask').mask;
	                    var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
	                    
	                    if (newMask != currentMask) {
	                        $(this).setMask(newMask);
	                    }
	                    
	                }).val(moment().format('HH:mm'));
	
	                
	                $("#gestioneRichiesteCartelle div.Zebra_DatePicker").css({"position":"relative"});
	                $("#tdOraCartella").css({"padding-top":"5px"});
	           	}
	    	});   
	    	
	    },
    
	    processDataSollecito : function(data, td){
	    
	    	if (data.DATA_SOLLECITO != null || data.DATA_SOLLECITO != "")
	    	{
	    		data.DATA_SOLLECITO = moment(data.DATA_SOLLECITO, "YYYYMMDDHH:mm").format("DD/MM/YYYY HH:mm");
	    		td.attr("title", data.DATA_SOLLECITO);
	    		td.css({"color" : "red"});
	    	}
	    	
	    	return data.DATA_SOLLECITO;
	    }
};