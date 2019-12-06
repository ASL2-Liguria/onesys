var dialPD;

var NS_HOME_ARCHIVIO_DRG = 
{    
	    richiediAnalisiGrouper : function(rec)
	    {
	        // per ogni riga deve inserire un record sulla tabella analisi_grouper
	        // nome della function = richiedi_analisi_grouper
	        for (var i=0; i<rec.length; i++)
	        {        	
	        	var db = $.NS_DB.getTool({setup_default:{datasource : 'ADT'}});

	            db.call_procedure(
                {
                    id: "ADT_GROUPER.RICHIEDI_ANALISI_GROUPER",
                    parameter:
                    {
                        "pIdenContatto" : rec[i].IDEN_CONTATTO,
                        "pIdenPer" : home.baseUser.IDEN_PER
                    },
                    success : function(data)
                    {
                    	var message = data.p_result.split('|');
    	                
                    	if (message[0]=='OK') {
    	                    home.NOTIFICA.success({message : message[1], timeout : 3, title : 'Richiesta Andata a buon fine'});
    	                } else if (message[0]=='KO') {
    	                    home.NOTIFICA.error({message : message[1], timeout : 5, title: "Error"});
    	                }
                    },
                    error : function(data)
                    {
                        logger.error('ADT_GROUPER.RICHIEDI_ANALISI_GROUPER Error -> ' + JSON.stringify(data));
                    }

                });

	        }
	        
	        NS_HOME_ARCHIVIO_WK.wkMovimentiCartelle.refresh();
	    },
	    
	    /*setTariffa : function(rec){
	    	
	        var aIdenContatti=new Array(rec.length);
	        
	        for (var i=0; i<rec.length; i++)
	        {
	            aIdenContatti[i] = rec[i].IDEN_CONTATTO;
	        }
	        
	        var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
	        
	        var parametri = {
	            aIdenContatti : {v: aIdenContatti, t:'A'},
	            pIdenPer : {v:home.baseUser.IDEN_PER,t:'N'},
	            p_result : {t:'V',d:'O'}
	        };
	        
	        db.call_procedure(
	            {
	                id: 'ADT_GROUPER.TariffaDrgContatti',
	                parameter : parametri,
	                success : function(data)
	                {
	                    var aRisultati = new Array();
	                    var strRisultati;
	                    var flgOk = true;
	                    
	                    strRisultati = data.p_result;
	                    aRisultati = strRisultati.split('*');
	                    
	                    for (var i=0; i<aRisultati.length; i++)
	                    {
	                        if (aRisultati[i].substring(0,2)=='KO')
	                        {
	                            home.NOTIFICA.error({message:aRisultati[i],timeout: 5, title: 'Errore'});
	                            flgOk = false;
	                        }
	                    }
	                    
	                    if (flgOk)
	                    {
	                        home.NOTIFICA.success({message: 'Tariffazione eseguita correttamente', timeout: 2, title: 'Success'});
	                    }
	                    
	                    if (typeof NS_HOME_ARCHIVIO_WK !== "undefined"){
	                    	NS_HOME_ARCHIVIO_WK.wkRichiesteGrouper.refresh();
	                    } 
	                    else
	                    {
	                    	NS_ARCHIVIO_ESTRAZIONE.WK.refresh();
	                    }
	                    // x chiudere la dialog di avanzamento quando non arriva dalla Applet
						logger.debug('set tariffa completato. chiamo setPercentualeAvanzamento');
	                    home.setPercentualeAvanzamento('{"value":100, "record":'+aRisultati.length+',"elaborati":'+aRisultati.length+'}');
	                }
	            });
	    },*/
	    
	    annullaDrg : function(rec)
	    {
	        if (rec.length > 1){
	            home.NOTIFICA.error({message: "Selezionare una singola cartella" , timeout: 5, title: "Error"});
	            return;
	        }
	        
	        home.DIALOG.si_no({
	            title : "Cancellazione codice DRG",
	            msg : "Si conferma l'operazione per la cartella " + rec[0].CODICE,
	            cbkSi : function(){
	            	var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
	    	        
	    	        var parametri = {
	    	            pIdenContatto : {v : rec[0].IDEN_CONTATTO, t : 'N'},
	    	            pIdenPer : {v : home.baseUser.IDEN_PER, t : 'N'},
	    	            p_result : {t :'V', d : 'O'}
	    	        };
	    	        
	    	        db.call_procedure(
    	            {
    	                id: 'ADT_GROUPER.annulla_drg',
    	                parameter : parametri,
    	                success : function(data)
    	                {
    	                	var message = data.p_result.split('|');
    	                	
    	                    if (message[0] == "OK") 
    	                    {
    	                        home.NOTIFICA.success({message : message[1] , timeout:3, title : 'Operazione andata a buon fine'});
    	                    } 
    	                    else if (message[0] === "KO") 
    	                    {
    	                        return home.NOTIFICA.error({message: message[1], timeout: 5, title : "Error"});
    	                    }
    	                    
    	                    if (typeof NS_ARCHIVIO_ESTRAZIONE !== "undefined")
	                        {
	                        	NS_ARCHIVIO_ESTRAZIONE.WK.refresh();
		                    } 
		                    else
		                    {
		                    	NS_HOME_ARCHIVIO_WK.wkRichiesteGrouper.refresh();
		                    }
    	                }
    	            });
	            }
	        });
	    },
	    
	    annullaTariffa : function(rec)
	    {
	        if (rec.length>1){
	        	home.NOTIFICA.error({message: "Selezionare una singola cartella" , timeout: 5, title: "Error"});

	            return;
	        }
	        home.DIALOG.si_no({
	            title : "Cancellazione tariffa DRG",
	            msg : "Si conferma l'operazione per la cartella "+rec[0].CODICE,
	            cbkSi : function(){
	               
	            	var db = $.NS_DB.getTool({setup_default:{datasource : 'ADT'}});
	    	        
	    	        var parametri = {
	    	            pIdenContatto : {v : rec[0].IDEN_CONTATTO, t : 'N'},
	    	            pIdenPer : {v : home.baseUser.IDEN_PER, t : 'N'},
	    	            p_result : {t :'V', d : 'O'}
	    	        };
	    	        
	    	        db.call_procedure(
    	            {
    	                id: 'ADT_GROUPER.annulla_tariffa',
    	                parameter : parametri,
    	                success : function(data)
    	                {
    	                	var message = data.p_result.split('|');
    	                	
    	                    if (message[0] === "OK") 
    	                    {
    	                    	home.NOTIFICA.success({ message : message[1] , timeout:3, title : 'Operazione andata a buon fine' });
    	                    } 
    	                    else if (message[0] === "KO") 
    	                    {
    	                    	return home.NOTIFICA.error({message:  message[1],timeout: 5,  title: "Error"});
    	                    }
    	                    
    	                    if (typeof NS_ARCHIVIO_ESTRAZIONE !== "undefined"){
	                        	NS_ARCHIVIO_ESTRAZIONE.WK.refresh();
		                    } 
		                    else
		                    {
		                    	NS_HOME_ARCHIVIO_WK.wkRichiesteGrouper.refresh();
		                    }
    	                }
    	            });
	            }
	        });

	    },
	    
	    AnnullaDrg_e_Tariffa : function(rec)
	    {
	    	/*NS_HOME_ARCHIVIO_DRG.annullaTariffa(rec);
	    	NS_HOME_ARCHIVIO_DRG.annullaDrg(rec);  	*/
	    	 if (rec.length>1){
		        	home.NOTIFICA.error({message: "Selezionare una singola cartella" , timeout: 5, title: "Error"});

		            return;
		        }
		        home.DIALOG.si_no({
		            title : "Cancellazione tariffa e DRG",
		            msg : "Si conferma l'operazione per la cartella "+rec[0].CODICE,
		            cbkSi : function(){
		               
		            	var db = $.NS_DB.getTool({setup_default:{datasource : 'ADT'}});
		    	        
		    	        var parametri = {
		    	            pIdenContatto : {v : rec[0].IDEN_CONTATTO, t : 'N'},
		    	            pIdenPer : {v : home.baseUser.IDEN_PER, t : 'N'},
		    	            p_result : {t :'V', d : 'O'}
		    	        };
		    	        
		    	        db.call_procedure(
	    	            {
	    	                id: 'ADT_GROUPER.annulla_drg_tariffa',
	    	                parameter : parametri,
	    	                success : function(data)
	    	                {
	    	                	var message = data.p_result.split('|');
	    	                	
	    	                    if (message[0] === "OK") 
	    	                    {
	    	                    	home.NOTIFICA.success({ message : message[1] , timeout:3, title : 'Annullamento drg e tariffa eseguito con successo' });
	    	                    } 
	    	                    else if (message[0] === "KO") 
	    	                    {
	    	                    	return home.NOTIFICA.error({message:  message[1],timeout: 5,  title: "Error"});
	    	                    }
	    	                    
	    	                    if (typeof NS_ARCHIVIO_ESTRAZIONE !== "undefined"){
		                        	NS_ARCHIVIO_ESTRAZIONE.WK.refresh();
			                    } 
			                    else
			                    {
			                    	NS_HOME_ARCHIVIO_WK.wkRichiesteGrouper.refresh();
			                    }
	    	                }
	    	            });
		            }
		        });

	    },
	    
	    calcolaDRG : function(rec){

	        NS_HOME_ARCHIVIO_DRG.setProgressBarDialog();

	        var urlToCall = home.baseGlobal['URL_GENERAZIONE_FLUSSI'] + 'DRG/calcola?' ;
	        var nContatti = rec.length;
	        var idenContatti = '';

	        for(var i=0; i<rec.length; i++)
	        {
	            if (i == 0){
	            	idenContatti = rec[i].IDEN_CONTATTO;
	            } else {
	            	idenContatti += ',' + rec[i].IDEN_CONTATTO;
	            }
	        }
	        
	        var dataToSend= '::nContatti=' + nContatti + '::idenContatti=' + idenContatti + '::hostname=' + home.basePC.IP +'::user='+home.baseUser.IDEN_PER;


			logger.debug("URL PASSATA A PROXY -> CALL="+ urlToCall +"&PARAM="+dataToSend+"&METHOD=GET");

	       // alert('Inizio Procedura di Calcolo DRG');

	        jQuery.support.cors = true;

	        jQuery.ajax({
	            url : "proxy",
	            async : true,
	            data : "CALL="+ urlToCall +"&PARAM="+dataToSend+"&METHOD=GET",
	            cache : false,
	            type : "POST",
	            crossDomain : false,
	            contentType : "application/x-www-form-urlencoded",
	            success : function (resp)
	            {
					logger.debug(JSON.stringify(resp));
	                if (resp == "")
	                {
	                    home.NOTIFICA.error({message: "Error in ajax response", timeout: 5, title: "Error"});
	                    return false;
	                }
	                
	                var json = JSON.parse(resp);

	                if(json.success)
	                {
	                    home.NOTIFICA.success({message: "Calcolo DRG completato", timeout: 3, title: 'Success'});
	                    // Calcolo Tariffa
	                    //NS_HOME_ARCHIVIO_DRG.setTariffa(rec);
	                }
	                else
	                {
	                    home.NOTIFICA.error({message: "Errore nel calcolo DRG: " + json.message, timeout: 5, title: "Error"});
	                }

	            },
	            error: function (jqXHR, textStatus, errorThrown )
	            {
	            	switch (jqXHR.status)
	            	{
	            	case 404 :
	            		home.NOTIFICA.error({message: "Servizio per il calcolo del DRG temporaneamente non disponibile", timeout: 5, title: "Error"});
	            		break;
	            	default :
	            		home.NOTIFICA.error({message: "Errore nel calcolo DRG", timeout: 5, title: "Error"});
	            	}
	                
	                dialPD.close();
	            }
	        });
	    },

	    setProgressBarDialog : function(callBack)
	    {

	        var p = {'msg': "<div id='progressbar'><div id='progress-label' class='progress-label'></div></div>", 'title':'Avanzamento Calcolo DRG'};
	        dialPD = $.dialog(p.msg,
	            {
	                title: p.title,
	                showBtnClose: false,
	                showMask:true,
	                buttons: [],
	                width: 450
	            }
	        );

	        logger.debug('setProgressBarDialog -> 0');

	        $('#progressbar').css({'height' : '25px'});
	        var prgbar = $('#progressbar');
	        var progressLabel = $('.progress-label'); progressLabel.text('0%');

	        prgbar.progressbar({
	            value: 0,
	            change: function() {
	                logger.debug('setProgressBarDialog Completato ');
	                progressLabel.text( prgbar.progressbar("value") + '% (' + prgbar.progressbar('option','elaborati') +  ' di ' + prgbar.progressbar('option','record') + ')');
	            },
	            complete: function() 
	            {
	                logger.debug('setProgressBarDialog Completato ');
	                progressLabel.text("100%");
	                dialPD.close();
	                
	                if (typeof NS_HOME_ARCHIVIO_WK !== "undefined"){
						logger.debug('refresh wk drg');
                    	NS_HOME_ARCHIVIO_WK.wkRichiesteGrouper.refresh();
                    } 
                    else
                    {
                    	NS_ARCHIVIO_ESTRAZIONE.WK.refresh();
                    }
	            }
	        });

	        // Definisco Una Funzione Chiamabile dal Top In cui viene lanciato il codice JS dall APPLET
	        home.setPercentualeAvanzamento = function(p)
	        {
				
	            // L'oggetto passato ('{value : 95.0,record : 4075, elaborati : 3668}') dall'APPLET viene visto solo come STRINGA quindi lo trasformo
	            logger.debug('setProgressBarDialog from APPLET -> p ' + JSON.stringify(p));

	            var params = JSON.parse(p);
				//eval('var params = ' + p);
	            if (prgbar.progressbar("value")!=params.value){
					$("#progressbar").progressbar( "option", {record : params.record, elaborati : params.elaborati});
					$("#progressbar").progressbar({value : params.value});
				}
	        };
			home.checkErroreDRG = function(p)
			{
				// La risposta è una stringa separata da @, con lo split costruisco un oggetto e per ogni suo valore istanzio una variabile
				p = JSON.stringify(p);
				p = p.split("@");
				var errore = p[0];
				var nosologico = p[1];
				var eccezione = p[2];

				// Creo la notifica di errore con descrizione e cartella
				home.NOTIFICA.error({title: "Errore", message: errore + " per cartella " + nosologico, timeout:0});

				//Se in risposta ho ricevuto un'eccezione la loggo nella console
				if(eccezione.length > 0){
					logger.error("Errore nel calcolo DRG : "+eccezione);
				}

			};

	    },




	    calcolaDRGMese : function(rec){

	        NS_HOME_ARCHIVIO_DRG.setProgressBarDialog();

	        var urlToCall = home.baseGlobal['URL_GENERAZIONE_FLUSSI'] + 'DRG/elaboraMese?';
	        var sData = $("#txtDaDataGrouper").val();
	        var mese = sData.substring(3,5);
	        var anno = sData.substring(6);
	        
	        switch (mese)
	        {
	            case "01":
	                sMese="GEN";
	                break;
	            case "02":
	                sMese="FEB";
	                break;
	            case "03":
	                sMese="MAR";
	                break;
	            case "04":
	                sMese="APR";
	                break;
	            case "05":
	                sMese="MAG";
	                break;
	            case "06":
	                sMese="GIU";
	                break;
	            case "07":
	                sMese="LUG";
	                break;
	            case "08":
	                sMese="AGO";
	                break;
	            case "09":
	                sMese="SET";
	                break;
	            case "10":
	                sMese="OTT";
	                break;
	            case "11":
	                sMese="NOV";
	                break;
	            case "12":
	                sMese="DIC";
	                break;
	        }
	        
	        var dataToSend = '::periodo_ricerca='+ sMese + '-' + anno + '::hostname='+home.basePC.IP;
	        
	        jQuery.support.cors = true;
	        
	        // alert("CALL="+ urlToCall +"&PARAM="+dataToSend+"&METHOD=GET");

	        jQuery.ajax({
	            url: "proxy",
	            async:true,
	            timeout:300000,
	            data:"CALL="+ urlToCall +"&PARAM="+dataToSend+"&METHOD=GET",
	            cache: false,
	            type: "POST",
	            crossDomain: false,
	            contentType:"application/x-www-form-urlencoded",
	            success: function (resp)
	            {
	                if (resp==""){
	                    home.NOTIFICA.error({message: "Error in ajax response", timeout: 5, title: "Error"});
	                    return false;
	                }
	                eval('var json = ' + resp);

	                if(json.success)
	                {
	                    home.NOTIFICA.success({message: "Calcolo DRG completato", timeout: 3, title: 'Success'});
	                    // refresh worklist
	                    NS_HOME_ARCHIVIO_WK.wkRichiesteGrouper.refresh();
	                }
	                else
	                {
	                    home.NOTIFICA.error({message: "Errore nel calcolo DRG: " + json.message, timeout: 5, title: "Error"});
	                }

	            },
	            error: function (resp)
	            {
	                home.NOTIFICA.error({message: "Errore nel calcolo DRG", timeout: 5, title: "Error"});
	            }
	        });

	    }
};