var tipoPrelievo = '';

jQuery(document).ready(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'Home' && window.WindowCartella.name != 'schedaRicovero'){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti 	= WindowCartella.baseReparti;
    window.baseGlobal	= WindowCartella.baseGlobal;
    window.basePC 		= WindowCartella.basePC;
    window.baseUser 	= WindowCartella.baseUser;

});

var OE_RICHIESTA={
	
	//funzione che esegue i controlli sui parametri delle richieste che arrivano e restituisce un oggetto
	controllaPrelievo : function(parametri){

		var erroreReturn = {
				sIdRichieste:'', 	/* sIdRichieste = iden della richiesta */
				sIdRicDaStamp:'', 	/* sIdRicDaStamp = iden della richiesta per la quale devono essere ristampate le etichette */
				sIdRicDaPrel:'',	/* sIdRicDaPrel = iden della richiesta che non è stata prelevata */
				sIdRicDH:'',		/* sIdRicDH = iden della richiesta che non è stata prelevata perchè afferente ad un DH */
				sIdNoStatoI:'',		/* sIdNoStatoI = iden della richiesta che non era in stato 'I' (inviato) */
				sIdNoPrel:'',		/* sIdNoPrel = iden della richiesta che non è stata prelevata perchè non in data odierna */
				sTipologiaRichiesta:''  /* sTipologiaRichiesta = tipologia di richiesta sbagliata */
		};

		var Sito = WindowCartella.baseReparti.getValue('','SITO');
		
		var statoRichiesta		=   parametri.statoRichiesta;
		var tipoRichiesta 		=  	parametri.tipoRichiesta;
		var dataRichiesta 		= 	parametri.dataRichiesta;
		var idRichiesta2 		=  	parametri.idRichiesta2;
		var idenTestata			= 	parametri.idenTestata;
		var tipo_ricovero_codice=	parametri.tipo_ricovero_codice;
		var prelievoEffettuato 	=	parametri.prelievoEffettuato;
		var statoEtic			=	parametri.statoEtic;
		
		/***** DEBUG *******************************************************************/
			var debug = 'DEBUG CONTROLLO:';
			debug+='\n DATA RICHIESTA: '+dataRichiesta;
			debug+='\n CONTROLLO DATA RICHIESTA: '+controllo_data(dataRichiesta).equal;
			debug+='\n TIPOLOGIA RICHIESTA: '+tipoRichiesta;
			debug+='\n PRELIEVO EFFETTUATO: '+prelievoEffettuato;
			debug+='\n ID_RICHIESTA_2: '+idRichiesta2;
			debug+='\n STATO RICHIESTA: '+statoEtic;
			debug+='\n SITO: '+ Sito;
			if(baseUser.LOGIN == 'gianluca'){
				alert(debug);
			}
		/*******************************************************************************/

		//controllo se la data della richiesta in questione è quella odierna
		if(controllo_data(dataRichiesta).equal){

			if(statoRichiesta=='I' || (statoRichiesta=='P' && tipoRichiesta=='3')){

				if(tipoRichiesta=='0' || tipoRichiesta=='3' || tipoRichiesta=='12'){

					if(prelievoEffettuato=='N'){
	
						if (idRichiesta2!='' &&  tipoRichiesta=='0'){
                                                        
							switch(Sito){
							
								//caso di SAVONA, il controllo sul PRE-DH viene effettuato
								case 'ASL2': 
									//controllo se è un PRE-DH, nel caso lo fosse nn lo prelevo
									if(tipo_ricovero_codice != 'PRE-DH'){
										erroreReturn.sIdRichieste=idenTestata;
									}else{
										erroreReturn.sIdRicDH=idenTestata;
									}
									break;
								
								//caso di GENOVA non ancora gestito
								case 'ASL3':
								
								//caso di SPEZIA, il controllo sul PRE-DH  NON  viene effettuato
								case 'ASL5':
									erroreReturn.sIdRichieste=idenTestata;
									break;
								
								default:
									null;
									break;
							}
								
							//controllo che l'etichetta non sia da ristampare in seguito alla modifica dal laboratorio
							if(statoEtic=='2'){
								erroreReturn.sIdRicDaStamp=idRichiesta2;
							}
						
						}else if(tipoRichiesta=='3'){

							switch(Sito){
							
								//caso di SAVONA, il controllo sul PRE-DH viene effettuato
								case 'ASL2': 
									//controllo se è un PRE-DH, nel caso lo fosse nn lo prelevo
									if(tipo_ricovero_codice != 'PRE-DH'){
										erroreReturn.sIdRichieste=idenTestata;
									}else{
										erroreReturn.sIdRicDH=idenTestata;
									}
									break;
								
								//caso di GENOVA non ancora gestito
								case 'ASL3':
								
								//caso di SPEZIA, il controllo sul PRE-DH  NON  viene effettuato
								case 'ASL5':									
									erroreReturn.sIdRichieste=idenTestata;
									break;
								
								default:
									null;
									break;
							}
						
						}else if(tipoRichiesta=='12'){
							erroreReturn.sIdRichieste=idenTestata;
						}else{
							
							erroreReturn.sIdRicDaPrel=idenTestata;
						}
					}
					
				}else{ 
					// Richieste Di Trasfusionale (spezia,in ASL2 per il trasfusionale la tipologia_richiesta = 0)
                                        if (Sito=='ASL5')
                                                if (tipoRichiesta=='6' || tipoRichiesta=='7' || tipoRichiesta=='8')
                                                        erroreReturn.sIdRichieste = idenTestata;
                                                else
                                                        erroreReturn.sTipologiaRichiesta = idenTestata;
                                        else
                                                erroreReturn.sTipologiaRichiesta = idenTestata;
				}

			//non è nello stato INVIATO
			}else{
				/*erroreReturn.sIdRichieste=idenTestata;*/
				erroreReturn.sIdNoStatoI=idenTestata;
			}
			
		//else del controllo data... Se non è la data odierna non posso prelevare
		}else{
			erroreReturn.sIdNoPrel=idenTestata;
		}

		return erroreReturn;
	},
	
	//funzione che gestisce il prelievo; 
	//arrivano in entrata un array di oggetti con i parametri per ogni richiesta selezionata e la funzione di callBack per la procedura DB di prelievo 
	preleva : function(arrayParametri, tipo, callBack){
		
		/* STRUTTURA degli oggetti dell'array (arrayParametri) che arriva in input *******************************************************
		 		parametri.statoRichiesta 		= stato della richiesta su INFOWEB.TESTATA_RICHIESTE.STATO_RICHIESTA
				parametri.tipoRichiesta			= tipologia della richiesta su INFOWEB.TESTATA_RICHIESTE.TIPOLOGIA_RICHIESTA
				parametri.dataRichiesta			= data della richiesta su INFOWEB.TESTATA_RICHIESTE.DATA_RICHIESTA (che per laboratorio, micro, cardio, mednucvitro è la data proposta)
				parametri.idRichiesta2			= INFOWEB.TESTATA_RICHIESTE.ID_RICHIESTA_2
				parametri.idenTestata			= iden della richiesta su INFOWEB.TESTATA_RICHIESTE.IDEN
				parametri.tipo_ricovero_codice	= tipologia del ricovero (Es: 'URG','ORD',...)
				parametri.prelievoEffettuato	= stato del prelevato su INFOWEB.TESTATA_RICHIESTE.PRELIEVO_EFFETTUATO
				parametri.statoEtic				= stato della ristampa delle etichette su INFOWEB.VIEW_RICHIESTE_WORKLIST.STATO_STAMPA_ETICHETTE
		 ****************************************************************************************/

		var risultatoErrore='';
		tipoPrelievo = tipo;

		var valoriControllo = {
				sIdRichieste:'', 	/* sIdRichieste = iden della richiesta */
				sIdRicDaStamp:'', 	/* sIdRicDaStamp = iden della richiesta per la quale devono essere ristampate le etichette */
				sIdRicDaPrel:'',	/* sIdRicDaPrel = iden della richiesta che non è stata prelevata */
				sIdRicDH:'',		/* sIdRicDH = iden della richiesta che non è stata prelevata perchè afferente ad un DH */
				sIdNoStatoI:'',		/* sIdNoStatoI = iden della richiesta che non era in stato 'I' (inviato) */
				sIdNoPrel:'',		/* sIdNoPrel = iden della richiesta che non è stata prelevata perchè non in data odierna */
				sTipologiaRichiesta:'' /* sTipologiaRichiesta = tipologia di richiesta sbagliata */
		};
		
		//ciclo l'array di oggetti che contengono i parametri
		for(var i=0;i<arrayParametri.length;i++){

			risultatoErrore=OE_RICHIESTA.controllaPrelievo(arrayParametri[i]);

			if (risultatoErrore!=''){
				if(risultatoErrore.sIdRichieste!=''){
					if (valoriControllo.sIdRichieste==""){
						valoriControllo.sIdRichieste=risultatoErrore.sIdRichieste;
					}else{
						valoriControllo.sIdRichieste += "*"+risultatoErrore.sIdRichieste;
						//valoriControllo.sIdRichieste += ","+risultatoErrore.sIdRichieste;
					}
				}
				if(risultatoErrore.sIdRicDaStamp!=''){
					if (valoriControllo.sIdRicDaStamp==""){
						valoriControllo.sIdRicDaStamp=risultatoErrore.sIdRicDaStamp;
					}else{
						valoriControllo.sIdRicDaStamp += ","+risultatoErrore.sIdRicDaStamp;
					}
				}
				if(risultatoErrore.sIdRicDaPrel!=''){
					if (valoriControllo.sIdRicDaPrel==""){
						valoriControllo.sIdRicDaPrel=risultatoErrore.sIdRicDaPrel;
					}else{
						valoriControllo.sIdRicDaPrel += ","+risultatoErrore.sIdRicDaPrel;
					}										
				}
				if(risultatoErrore.sIdRicDH!=''){
					if (valoriControllo.sIdRicDH==""){
						valoriControllo.sIdRicDH=risultatoErrore.sIdRicDH;
					}else{
						valoriControllo.sIdRicDH += ","+risultatoErrore.sIdRicDH;
					}
				}
				if(risultatoErrore.sIdNoPrel!=''){
					if (valoriControllo.sIdNoPrel==""){
						valoriControllo.sIdNoPrel=risultatoErrore.sIdNoPrel;
					}else{
						valoriControllo.sIdNoPrel += ","+risultatoErrore.sIdNoPrel;
					}
				}
				if(risultatoErrore.sIdNoStatoI!=''){
					if (valoriControllo.sIdNoStatoI==""){
						valoriControllo.sIdNoStatoI=risultatoErrore.sIdNoStatoI;
					}else{
						valoriControllo.sIdNoStatoI += ","+risultatoErrore.sIdNoStatoI;
					}
				}
				if(risultatoErrore.sTipologiaRichiesta!=''){
					if (valoriControllo.sTipologiaRichiesta==""){
						valoriControllo.sTipologiaRichiesta=risultatoErrore.sTipologiaRichiesta;
					}else{
						valoriControllo.sTipologiaRichiesta += ","+risultatoErrore.sTipologiaRichiesta;
					}
				}
                        }
		}
		
		/** DEBUG *****************************************************/
		var debug = 'DEBUG POST RISULTATO:';
		debug += '\nsIdRichieste:' + valoriControllo.sIdRichieste;
		debug += '\nsIdRicDaStamp:' + valoriControllo.sIdRicDaStamp; 	
		debug += '\nsIdRicDH:' + valoriControllo.sIdRicDH;
		debug += '\nsIdNoStatoI:' + valoriControllo.sIdNoStatoI;
		debug += '\nsIdNoPrel:' + valoriControllo.sIdNoPrel;
		debug += '\nsIdRicDaPrel:' + valoriControllo.sIdRicDaPrel;
		if(baseUser.LOGIN == 'gianluca'){
			alert(debug);
		}
		
		/**************************************************************/

		OE_RICHIESTA.preleva_msg(valoriControllo, tipoPrelievo, callBack);
	},
	

	preleva_msg : function(valoriControllo, tipo, callBack){

		var msg='Attenzione!';
		
		/*if(valoriControllo.sIdRichieste == ''){
			if(tipo=='SINGOLA'){
				msg += '\n L\'esame non è prelevabile in data odierna!';
			}else{
				msg += '\n Nessun esame prelevabile in data odierna!';
			}
			return alert(msg);
		}*/
		
		if(valoriControllo.sIdNoStatoI!=''){
			if(tipo=='SINGOLA'){
				msg+='\n Selezionare una richiesta in stato INVIATO';
			}else{
				msg+='\n Per alcune richieste non è stato effettuato l\'invio al laboratorio poichè non sono nello stato INVIATO';
			}
		}
		
		if(valoriControllo.sIdRicDH!=''){
			if(tipo=='SINGOLA'){
				msg+='\n Non è stato effettuato l\'invio al laboratorio poichè la richiesta è relativa ad un PRE-DH';
			}else{
				msg+='\n Per alcune richieste non è stato effettuato l\'invio al laboratorio poichè sono relative ad un PRE-DH';
			}
		}
		
		if(valoriControllo.sIdRicDaStamp!=''){
			if(tipo=='SINGOLA'){
				msg+='\n La richiesta necessita di ristampa etichette!';
			}else{
				msg+='\n Sono presenti richieste che necessitano di ristampa etichette!';
			}
		}
		
		if(valoriControllo.sIdNoPrel!=''){
			if(tipo=='SINGOLA'){
				msg+='\n L\'esame non è prelevabile in data odierna!';
			}else{
				msg+='\n Per alcune richieste non è stato effettuato l\'invio al laboratorio poichè non prelevabili in data odierna';
			}
		}
	
		if(valoriControllo.sIdRicDaPrel != ''){
			if(tipo=='SINGOLA'){
				msg+='\n Non è stato effettuato l\'invio al laboratorio!';
			}else{
				msg+='\n Per alcune richieste non è stato effettuato l\'invio al laboratorio!';
			}
		}

		if(valoriControllo.sTipologiaRichiesta != ''){
			if(tipo=='SINGOLA'){
				msg+='\n Richiesta di tipologia sbagliata!';
			}else{
				msg+='\n Per alcune richieste la tipologia è sbagliata!';
			}
		}            
            
		if(msg != 'Attenzione!'){
			if(tipo=='SINGOLA'){
				return alert(msg);
			}else{
				alert(msg);
			}
		}

		OE_RICHIESTA.callProcedure(valoriControllo.sIdRichieste, baseUser.IDEN_PER, callBack);
	},
	
	callProcedure:function(arrayRichieste, pIdenPer, callBack){
		
		param = "infoweb.OE_RICHIESTE.SP_LABO_PRELIEVO@"+arrayRichieste+","+pIdenPer+"@TRUE@string";
		
		if(baseUser.LOGIN == 'gianluca'){
			alert(param);
			//return;
		}
		
		dwr.engine.setAsync(false);
		CJsUpdate.call_stored_procedure(param,callBack);
		dwr.engine.setAsync(true);
		
	},
	
	annulla:function(params){//iden_richiesta,reparto_sorgente,reparto_destinatario,motivo_annullamento[,callBackOk][,callBackKo]

		if(OE_RICHIESTA.checkParameter(params,'iden_richiesta') == false){
			return alert('parametro "iden_richiesta" non valorizzato');
		}
		if(OE_RICHIESTA.checkParameter(params,'motivo_annullamento') == false){
			return alert('parametro "motivo_annullamento" non valorizzato');
		}		
		
		var annulla_prestazione = false;
				
		var conf = WindowCartella.baseReparti.getValue(params.reparto_sorgente,'OE_ASSOCIA_PRESTAZIONE');

		if(conf != null && conf != ""){
			eval("var conf = " + conf + ";");

			if(typeof conf[params.reparto_destinatario] != 'undefined'){
				annulla_prestazione = true;
			}
		}
		

                
		WindowCartella.executeAction(
			"Richieste",
			"annulla",
			{
				"iden_richiesta":params.iden_richiesta,
				"motivo_annullamento":params.motivo_annullamento,
				"iden_per":+WindowCartella.baseUser.IDEN_PER,
				"iden_med":+params.iden_med == '' ? null : params.iden_med,
				"annulla_prestazione":(annulla_prestazione ? 'S' : 'N')
			},
			function(resp){
				if(resp.success == false){
					if(typeof params.callBackKo == 'function'){
						params.callBackKo(resp);
					}
				}else{
					if(typeof params.callBackOk == 'function'){
						params.callBackOk(resp);
					}					
				}
			}
		);
		
	},
	
	checkParameter:function(obj,key){
		return typeof obj[key] != 'undefined';
	},
    callBackModifiche:function(pIden, params){//data, ora, iden_anag, cod_pro, reparto_sorgente, reparto_destinatario

        //alert(pIden+'\n' + params.data +'\n'+ params.ora + '\n' + params.iden_anag +'\n'+ params.cod_pro+'\n'+ params.reparto_sorgente+'\n'+ params.reparto_destinatario);

        var conf = WindowCartella.baseReparti.getValue(params.reparto_sorgente,'OE_ASSOCIA_PRESTAZIONE');

        if(conf != null && conf != ""){
            eval("var conf = " + conf + ";");

            if(typeof conf[params.reparto_destinatario] != 'undefined'){

            	WindowCartella.executeAction(
                    "Richieste",
                    "modificaPrestazioneAssociata",
                    {
                        iden_richiesta  : pIden,
                        data            : params.data,
                        ora             : params.ora,
                        iden_anag       : params.iden_anag,
                        cod_pro         : params.cod_pro,
                        cod_area        : conf[params.reparto_destinatario].COD_AREA
                    },
                    function(response){

                        if(!response.success){
                            alert("Sono stati riscontrati problemi durante la modifica di una o più prestazioni:\n\n"+response.message);
                        }

                    }
                );

            }
        }

    },
	
	esegui:function(param,callBack){/*
		iden_richiesta
		,iden_per
		[,data]
		[,ora]
		[,cdc_sorgente]
		[,cdc_destinatario]
		[,tipologia_richiesta]
		[,metodica]		
	*/
		var parameters = $.extend({
				cdc_sorgente :null,
				cdc_destinatario : null,
				tipologia_richiesta : null,
				metodica : null
			},
			param
		);
		
		if(typeof callBack != 'function'){
			callBack = function(response){
				if(response.message != null){
					alert(response.message);
				}	
			};
		}
		WindowCartella.executeAction(
				"Richieste",
				"esegui",
				parameters,
				callBack
		);	
	
	}
};