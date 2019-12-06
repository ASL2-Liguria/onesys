// TIPI where TIPO='ADT_STATO_CARTELLA'
var cartellaIncompleta = '00';
var cartellaCompleta = '01';
var cartellaInviataInArchivio = '02';
var cartellaRicevutaInArchivio = '03';
var cartellaArchiviata = '04';
var cartellaReinviataInReparto = '05';
var cartellaPersa = '06';
var cartellaSequestrata = '07';

var NS_HOME_ARCHIVIO_CARTELLE = {
		
		setMovimentoCartella: function(idenContatto,codStato,idenArchivio,dataEvento,idenAutoritaSeq)
		{
	       	var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
	       	var parametri = {
	            pStato : {v : codStato, t : 'V'},
	            pIdenContatto : {v : idenContatto, t : 'N'},
	            pIdenPer : {v : home.baseUser.IDEN_PER, t : 'N'},
	            pArchivio : {v : idenArchivio, t : 'N'},
	            pData : {v : dataEvento, t : 'V'},
	            pAutoritaSeq : {v : idenAutoritaSeq, t:'N'},
	            p_result : {t : 'V', d : 'O'}
	        };
	       
	        db.call_procedure(
	            {
	                id: 'ADT_MOVIMENTI_CARTELLA.insert_movimento_cartella',
	                parameter : parametri,
	                success: function(data){
	                	home.NOTIFICA.success({message: 'Stato cartella aggiornato', timeout: 2, title: 'Success'});
	                    NS_HOME_ARCHIVIO_WK.refreshWk();
	                },
	                error:function(data){
	                	alert(data);
	                }
	            });
	    },
	    
		RiceviInArchivio : function(rec){
	    	
	        var ta = $(	"<table>" +
	        		"<tr><td><input id='txtArchivio' type=hidden value='" + IDEN_ARCHIVIO + "'></input>" + ARCHIVIO + "</td></tr>" + 
					"<tr><td><div id='gestioneRichiesteCartelle'></div></td></tr>" +
					"<tr><td id='tdOraCartella' class='tdText oracontrol w80px'><span>Ora </span><input type='hidden' id='h-txtDataRicezioneCartella'/><input type='text' id='txtOraRicezioneCartella' class='tdObb' /></td></tr>" +
				"</table>");

	        $.dialog(ta, {
						buttons : 	[
						          	 {label: "Annulla", action: function (ctx) { $.dialog.hide(); }},
						          	 {label : "Prosegui", action : function(){ completaRicezioneCartella(); }}
						          	 ],
						          	 title : "Archiviazione Cartelle",
						          	 height:340,
						          	 width:250
	        });
	        
	        var completaRicezioneCartella = function(){
	        	
	        	var _ora = $('#txtOraRicezioneCartella').val();
	         	var _data = $('#h-txtDataRicezioneCartella').val();
	         	var dataOra = _data + ' ' + _ora;
	             
	             if (_data == "" || _data == null){
	             	return home.NOTIFICA.error({message: "Selezionare Data Richiesta Cartella", timeout: 3, title: 'Error'});
	             }
	             
	             if (_ora.length < 5) {
	             	return home.NOTIFICA.error({message: "Popolare Correttamente l'Ora di Arrivo Cartella", timeout: 3, title: 'Error'});
	             }
	             
	             var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
	             var aIdenContatti = new Array(rec.length);
	             var aIdenCdc = new Array(rec.length);
	             
	             for (var i=0; i < rec.length; i++)
	             {
	                 aIdenContatti[i]=rec[i].IDEN_CONTATTO;
	                 aIdenCdc[i]=IDEN_ARCHIVIO;
	             }
	             
	             var parametri = {
	                 pStato : {v:cartellaRicevutaInArchivio, t:'V'},
	                 aIdenContatti : {v : aIdenContatti, t:'A'},
	                 pIdenPer : {v : home.baseUser.IDEN_PER, t : 'N'},
	                 aArchivi : {v : aIdenCdc, t : 'A'},
	                 pData : {v : dataOra, t : 'V'},
	                 p_result : {t : 'V', d : 'O'}
	             };
	             
	             db.call_procedure(
	             {
	                 id: 'ADT_MOVIMENTI_CARTELLA.insert_movimenti_cartelle',
	                 parameter : parametri,
	                 success: function(data){
	                     home.NOTIFICA.success({message: 'Movimento cartelle eseguito correttamente', timeout: 2, title: 'Success'});
	                     NS_HOME_ARCHIVIO_WK.refreshWk();
	                 }
	             });
	             
	             $.dialog.hide();
	            
	        };
	        
	        ta.Zebra_DatePicker({always_visible: $("#gestioneRichiesteCartelle"), direction: false, onSelect: function(data,dataIso) {
	        	$("#h-txtDataRicezioneCartella").val(data);
	        }});
	        
	        $('#txtOraRicezioneCartella').live().setMask("29:59").keypress(function() {
	            
	        	var currentMask = $(this).data('mask').mask;
	            var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
	             
	            if (newMask != currentMask) {
	            	$(this).setMask(newMask);
	            }
	             
	         }).val(moment().format('HH:mm'));
	         
	         $("#gestioneRichiesteCartelle div.Zebra_DatePicker").css({"position":"relative"});
	         $("#tdOraCartella").css({"padding-top":"5px"});
	    },
	    
	   
	    setStatoCartellaArchiviata:function(rec){
	    	
	    	var ta = $(	"<table>" +
	        		"<tr><td><input id='txtArchivio' type=hidden value='" + IDEN_ARCHIVIO + "'></input>" + ARCHIVIO + "</td></tr>" + 
					"<tr><td><div id='gestioneRichiesteCartelle'></div></td></tr>" +
					"<tr><td id='tdOraCartella' class='tdText oracontrol w80px'><span>Ora </span><input type='hidden' id='h-txtDataArchiviazioneCartella'/><input type='text' id='txtOraArchiviazioneCartella' class='tdObb' /></td></tr>" +
				"</table>");

	    	$.dialog(ta, {
						buttons : 	[
						          	 {label: "Annulla", action: function (ctx) { $.dialog.hide(); }},
						          	 {label : "Prosegui", action : function(){ completaArchiviazioneCartella(); }}
						          	 ],
						          	 title : "Archiviazione Cartelle",
						          	 height:340,
						          	 width:250
	        });
	    	
	        var completaArchiviazioneCartella = function(){
	        	
	        	var _ora = $('#txtOraArchiviazioneCartella').val();
	         	var _data = $('#h-txtDataArchiviazioneCartella').val();
	         	var dataOra = _data + ' ' + _ora;
	             
	            if (_data == "" || _data == null){
	            	return home.NOTIFICA.error({message: "Selezionare Data Richiesta Cartella", timeout: 3, title: 'Error'});
	            }
	             
	            if (_ora.length < 5) {
	            	return home.NOTIFICA.error({message: "Popolare Correttamente l'Ora di Arrivo Cartella", timeout: 3, title: 'Error'});
	            }
	             
	            var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
	            var aIdenContatti = new Array(rec.length);
	            var aIdenCdc = new Array(rec.length);
	            
	            for (var i=0; i<rec.length; i++)
	            {
	            	aIdenContatti[i]=rec[i].IDEN_CONTATTO;
	                aIdenCdc[i]=IDEN_ARCHIVIO;
	            }
	             
	            var parametri = {
	                pStato : {v:cartellaArchiviata, t:'V'},
	                aIdenContatti : {v: aIdenContatti, t:'A'},
	                pIdenPer : {v:home.baseUser.IDEN_PER,t:'N'},
	                aArchivi : {v:aIdenCdc, t:'A'},
	                pData : {v:dataOra,t:'V'},
	                p_result : {t:'V',d:'O'}
	            };
	             
	            db.call_procedure(
	            {
	            	id : 'ADT_MOVIMENTI_CARTELLA.insert_movimenti_cartelle',
	                parameter : parametri,
	                success : function(data){
	                    home.NOTIFICA.success({message: 'Movimento cartelle eseguito correttamente', timeout: 2, title: 'Success'});
	                    NS_HOME_ARCHIVIO_WK.refreshWk();
	                }
	             });
	             
	             $.dialog.hide();
	             
	        };
	        
	        ta.Zebra_DatePicker({always_visible: $("#gestioneRichiesteCartelle"), direction: false, onSelect: function(data,dataIso) {
	        	$("#h-txtDataArchiviazioneCartella").val(data);
	        }});
	        
	        $('#txtOraArchiviazioneCartella').live().setMask("29:59").keypress(function() {
	            
	        	var currentMask = $(this).data('mask').mask;
	            var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
	             
	            if (newMask != currentMask) {
	            	$(this).setMask(newMask);
	            }
	             
	         }).val(moment().format('HH:mm'));
	         
	         $("#gestioneRichiesteCartelle div.Zebra_DatePicker").css({"position":"relative"});
	         $("#tdOraCartella").css({"padding-top":"5px"});
	    },
	    
	    setStatoCartellaSequestrata:function(rec){
	    	
	    	var cmbAutorita;
	        
	    	if (rec.length>1){
	    		return home.NOTIFICA.error({message: "Selezionare una singola cartella", title: "Error"});
	        }
	        else if (rec[0].CODICE_STATO_CARTELLA==cartellaSequestrata)
	        {
	        	return home.NOTIFICA.error({message: "La cartella e' gia' in stato di SEQUESTRATA" , timeout: 5, title: "Error"});
	        }
	    	
	    	var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

            var xhr =  db.select(
            {
                    id: "ADT.Q_AUTORITA_CARTELLA_SEQ",
                    parameter : {}
            });
    		
            xhr.done(function (data, textStatus, jqXHR) {

            	if (data.result.length > 0)
	            {
	                cmbAutorita = "<table style='height:50px;'><tr><td class='tdLbl'>Autorita giudiziaria <select id='cmbAutorita'><option value='0'></option>";
	                
	                for (var i=0; i<data.result.length; i++)
	                {
	                    cmbAutorita+="<option value='"+data.result[i].VALUE+"'>"+data.result[i].DESCR+"</option>";
	                }
	                
	                cmbAutorita += "</select></td></tr><tr><td><div id='gestioneRichiesteCartelle'></div></td></tr><tr><td id='tdOraCartella' class='tdText oracontrol w80px'><span>Ora </span><input type='hidden' id='h-txtDataSequestroCartella'/><input type='text' id='txtOraSequestroCartella' class='tdObb' /></td></tr></table>";
	                cmbAutorita = $(cmbAutorita);
	                
	                $.dialog(cmbAutorita, {
		                buttons : [
		                           { label: "Annulla", action: function (ctx){ $.dialog.hide(); }},
		                           {label : "Prosegui", action : function(){ completaSequestroCartella(rec); }}
		                          ],
		                           
		                title : "Gestione cartella Sequestrata",
		                height:350,
		                width:250
		            });
		        
	                cmbAutorita.Zebra_DatePicker({always_visible: $("#gestioneRichiesteCartelle"), direction: false, onSelect: function(data,dataIso) {
	                	$("#h-txtDataSequestroCartella").val(data);
	                }}); 
		        
	                $('#txtOraSequestroCartella').live().setMask("29:59").keypress(function() {
		            
	                	var currentMask = $(this).data('mask').mask;
	                	var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
		             
	                	if (newMask != currentMask) {
	                		$(this).setMask(newMask);
	                	}
		             
	                }).val(moment().format('HH:mm'));

		         
	                $("#gestioneRichiesteCartelle div.Zebra_DatePicker").css({"position":"relative"});
	                $("#tdOraCartella, #gestioneRichiesteCartelle").css({"padding-top":"5px"});
		         
	            }
            });
            
	        var completaSequestroCartella = function(rec){
	    		
	    		var _ora = $('#txtOraSequestroCartella').val();
	        	var _data = $('#h-txtDataSequestroCartella').val();
	        	var dataOra = _data + ' ' + _ora;
	        	
	        	if (_data == "" || _data == null){
	        		return home.NOTIFICA.error({message: "Selezionare Data Richiesta Cartella", timeout: 3, title: 'Error'});
	        	}
	              
	            if (_ora.length < 5) {
	            	return home.NOTIFICA.error({message: "Popolare Correttamente l'Ora di Arrivo Cartella", timeout: 3, title: 'Error'});
	            }

	            NS_HOME_ARCHIVIO_CARTELLE.setMovimentoCartella(rec[0].IDEN_CONTATTO,cartellaSequestrata,IDEN_ARCHIVIO,dataOra,$("#cmbAutorita option:selected").val());
	            $.dialog.hide();
	            
	    	};
	            
	    },
	    
	    setStatoCartellaReinviata:function(rec){

	    	if (rec.length>1){
	    		return home.NOTIFICA.error({message: "Selezionare una singola cartella", title: "Error"});
	        }
	    	var ta = $(	"<table>" +
						"<tr><td><div id='gestioneRichiesteCartelle'></div></td></tr>" +
						"<tr><td id='tdOraCartella' class='tdText oracontrol w80px'><span>Ora </span><input type='hidden' id='h-txtDataReinvioCartella'/><input type='text' id='txtOraReinvioCartella' class='tdObb' /></td></tr>" +
					"</table>");
	 
	    	$.dialog(ta, {
	    		buttons :
	    			[
	    			 	{label: "Annulla", action: function (ctx) { $.dialog.hide(); }},
	    			 	{label : "Prosegui", action : function(){ completaReinvioCartella(rec); }}
	     			],
	     			title : "Reinvio Cartella",
	     			height:340,
	     			width:250
	    	});
		
	    	var completaReinvioCartella = function(rec){
	    		var _ora = $('#txtOraReinvioCartella').val();
	         	var _data = $('#h-txtDataReinvioCartella').val();
	         	var dataOra = _data + ' ' + _ora;
	         	
	         	if (_data == "" || _data == null){
	             	return home.NOTIFICA.error({message: "Selezionare Data Richiesta Cartella", timeout: 3, title: 'Error'});
	            }
	             
	            if (_ora.length < 5) {
	            	return home.NOTIFICA.error({message: "Popolare Correttamente l'Ora di Arrivo Cartella", timeout: 3, title: 'Error'});
	            }
	             
	    		NS_HOME_ARCHIVIO_CARTELLE.setMovimentoCartella(rec[0].IDEN_CONTATTO,cartellaReinviataInReparto,rec[0].IDEN_CDC,dataOra,0);
	            $.dialog.hide();
	    	};
	    	
	        ta.Zebra_DatePicker(
	        {
	        	always_visible : $("#gestioneRichiesteCartelle"), 
	        	direction : false, 
	        	onSelect : function(data,dataIso) {
	        		$("#h-txtDataReinvioCartella").val(data);
	        	}
	        });
	        
	        $('#txtOraReinvioCartella').live().setMask("29:59").keypress(function() {
	            
	         	var currentMask = $(this).data('mask').mask;
	         	var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
	             
	            if (newMask != currentMask) {
	            	$(this).setMask(newMask);
	            }
	             
	         }).val(moment().format('HH:mm'));
	         
	         $("#gestioneRichiesteCartelle div.Zebra_DatePicker").css({"position":"relative"});
	         $("#tdOraCartella").css({"padding-top":"5px"});
	    },
	    
	    resetStatoCartella: function(rec){
	    	
	    	if (rec.length>1){
	            home.NOTIFICA.error({message: "Selezionare una singola cartella", title: "Error"});
	            return;
	        }
	    	home.DIALOG.si_no({
	             title: "Conferma annullamento stato attuale cartella",
	             cbkSi:function(){
	            	 
	            	 var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
	            	 var parametri = {
	            			 pIdenContatto : {v : rec[0].IDEN_CONTATTO, t : 'N'},
	            	         pIdenPer : {v : home.baseUser.IDEN_PER, t : 'N'},
	            	         p_result : {t : 'V', d : 'O'}
	            	 };
	            	 
	            	 db.call_procedure(
	                 {
	                	 id: 'ADT_MOVIMENTI_CARTELLA.annulla_movimento_cartella',
	                	 parameter : parametri,
	                	 success : function(data){
	                		 home.NOTIFICA.success({message: 'Stato cartella annullato', timeout: 2, title: 'Success'});
	                		 NS_HOME_ARCHIVIO_WK.refreshWk();
	                	 },
	                	 error:function(data){
    	                	alert(data);
	                	 }
	                 });
	             }
	         });
	    },
	    
	    setStatoCartellaPersa:function(rec){
	        
	    	if (rec.length > 1) {
	    		return home.NOTIFICA.error({message: "Selezionare una singola cartella", title: "Error"});            
	        }
	    	
	    	var completaPerditaCartella = function(rec){
	    		
	    		var _ora = $('#txtOraPerditaCartella').val();
	        	var _data = $('#h-txtDataPerditaCartella').val();
	        	var dataOra = _data + ' ' + _ora;
	        	
	        	if (_data == "" || _data == null){
	        		return home.NOTIFICA.error({message: "Selezionare Data Richiesta Cartella", timeout: 3, title: 'Error'});
	        	}
	              
	            if (_ora.length < 5) {
	            	return home.NOTIFICA.error({message: "Popolare Correttamente l'Ora di Arrivo Cartella", timeout: 3, title: 'Error'});
	            }

	    		NS_HOME_ARCHIVIO_CARTELLE.setMovimentoCartella(rec[0].IDEN_CONTATTO,cartellaPersa,IDEN_ARCHIVIO,dataOra,0);
	            $.dialog.hide();
	            
	    	};

	    	var ta = $("<table>" +
					"<tr><td><div id='gestioneRichiesteCartelle'></div></td></tr>" +
					"<tr><td id='tdOraCartella' class='tdText oracontrol w80px'><span>Ora </span><input type='hidden' id='h-txtDataPerditaCartella'/><input type='text' id='txtOraPerditaCartella' class='tdObb' /></td></tr>" +
				"</table>");
	        
	    	$.dialog(ta, {
	            buttons : 	[{label: "Annulla", action: function (ctx) { $.dialog.hide(); }},
	                      	 {label : "Prosegui", action : function(){ completaPerditaCartella(rec); }}
	            			],
	            title : "Gestione Cartelle",
	            height:340,
	            width:250
	        });
	    	
	    	ta.Zebra_DatePicker({always_visible: $("#gestioneRichiesteCartelle"), direction: false, startWithToday: true, onSelect: function(data,dataIso) {
	    		$("#h-txtDataPerditaCartella").val(data);
	        }});
	    	
	    	$('#txtOraPerditaCartella').live().setMask("29:59").keypress(function() {
	            
	        	var currentMask = $(this).data('mask').mask;
	            var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
	            
	            if (newMask != currentMask) {
	                $(this).setMask(newMask);
	            }
	            
	        }).val(moment().format('HH:mm'));
	        
	        $("#gestioneRichiesteCartelle div.Zebra_DatePicker").css({"position":"relative"});
	        $("#tdOraCartella").css({"padding-top":"5px"});
	    }
};