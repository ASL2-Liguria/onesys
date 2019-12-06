var gestioneNotifiche = {
	codiceSorgenteInviante: "AMB",
	tooltipIconaWk: "Paziente sottoposto a percorso di Med.di iniziativa",
	msgCondivisioneNotifica: "Condividi col percorso di Medicina d'Iniziativa",
	getBasePath: function(){
		var sito ="";
		var retPath = "";
		sito = home.getConfigParam("SITO");
		switch(sito){
			case "":
				retPath = "notificheSistema";
				break;
			case "SAVONA":
				retPath = "notificheSistema_SV";			
				break;
			default:
				retPath = "notificheSistema_SV";			
		}
		return retPath;
	},
	getXmlStatement:function(){
		switch(home.getConfigParam("SITO")){
			case "":
				return "notificheSistema.xml";
				break;
			case "SAVONA":
				return "notificheSistema_SV.xml";			
				break;
			default:
				return "notificheSistema.xml";
		}		
	},
	buildNewMsgIcon:function(){
		$("#menuBar ul").prepend("<li id='liCreaNuovoMsg' title='Crea nuovo messaggio'><img src='imagexPix/button/mini/newMsg.png'><a href='#' onClick='javascript:apri(\"creaNotificheSistema\");return false;'>Crea Messaggio</a></li>");		
	},
	check : function(codiceUtente){
		// $('#mylist li:eq(0)').before("<li>first</li>");
		var rs;
		try{rs =  executeQuery(this.getXmlStatement(),'countMyMessages',[codiceUtente]);}catch(e){alert("error on countMyMessages " + e.description);}
		if(rs.next()){	
			try{
				$("#liNotificaSistema").remove();									
				if (typeof(rs.getString("nmsg"))!="undefined" && rs.getString("nmsg")!= "" && rs.getString("nmsg")!= "0"){
					// dal momento che posso controllare più volte se esiste un msg da leggere
					// controllo se è già presente una bustina
//					if ($("#liNotificaSistema").length == 0){
					$("#menuBar ul").prepend("<li id='liNotificaSistema' title='N.Notifiche non lette: " + rs.getString("nmsg") +"'><img src='imagexPix/button/mini/notificaMsg.gif'><a href='#' onClick='javascript:gestioneNotifiche.open();return false;'>Nuovo Msg</a></li>");			
				}
				else{
					// lascio link per le notifiche
					$("#menuBar ul").prepend("<li id='liNotificaSistema' title='Controlla nuove notifiche'><img src='imagexPix/button/mini/spostatamini.png'><a href='#' onClick='javascript:gestioneNotifiche.open();return false;'>Miei Messaggi</a></li>");						
				}
			}catch(e){alert("gestioneNotifiche.check error: " + e.description);}
		}
		else{
			try{
				$("#liNotificaSistema").hide();
			}catch(e){
			}
		}
		// controllo se esiste msg per utente

	}
	,
	setRead : function(idenNotifica){
		try{
			var stm;
//			alert(this.getXmlStatement()+","+idenNotifica+","+baseUser.COD_DEC_PERSONALE);
			try{stm = executeStatement(this.getXmlStatement(),'updStatoNotifica',[idenNotifica, baseUser.COD_DEC_PERSONALE],0);}catch(e){alert("error on updStatoNotifica " + e.description);}
			if (stm[0]!="OK"){
				alert("Errore: problemi nel cambio stato lettura\n" + stm[0]);
			}
			else{
				// alla fine faccio refresh 
				this.check(baseUser.COD_DEC_PERSONALE);
			}
		}
		catch(e){
			alert("setRead - error: " + e.description);
		}
			
	}
	,
	// funzione che apre TUTTE le notifiche che
	// riguardano l'utente
	open : function(){
		var url= "";
		try{
			url = this.getBasePath() +"/elencoNotificheSistema.html?codUtente=" + baseUser.COD_DEC_PERSONALE;
			loadInFancybox({'url':url,'onClosed':function(){
			  // ricontrollo
		  }});			
		}
		catch(e){
			alert("open - error: " + e.description);
		}		
	}
	,
	// modifica 29-7-15
	//@param	value : anag.iden
	// nuova funzione ad hoc x la console
	getUrlNotificaToOpen:function(value){
		var strUrl="";
		var idenRemoto = "";
		var rs = top.executeQuery('info_repository.xml','getIdenRemoto',[value]);
		if (rs.next()){
			idenRemoto = rs.getString("ID_REMOTO");
		}
		if (idenRemoto==""){return "";	}			
		strUrl = this.getBasePath() +"/elencoNotificheSistema.html?codUtente=" + baseUser.COD_DEC_PERSONALE+"&idRemoto="+idenRemoto;
		return strUrl ;
	},
	getUrlCreateMsgOnAnag:function(value){
		var strUrl="";
		var idenRemoto = "";
		try{
			var rs = top.executeQuery('info_repository.xml','getIdenRemoto',[value]);
			if (rs.next()){
				idenRemoto = rs.getString("ID_REMOTO");
			}		
			if (idenRemoto==""){return "";	}			
			strUrl = this.getBasePath() +"/gestioneNotificheSistema.html?codUtente=" + baseUser.COD_DEC_PERSONALE + "&idRemoto=" + idenRemoto;
		}
		catch(e){
			alert(e.description);
		}
		return strUrl ;
	}	
	,
	//********************
	// funzione appositamente 
	// duplicata per savona, per tenere separata gestione
	//  da altro sito
	openByIdenAnag : function(value){
		var url= "";
		var idenRemoto = "";
		try{
			var rs = top.executeQuery('info_repository.xml','getIdenRemoto',[value]);
			if (rs.next()){
				idenRemoto = rs.getString("ID_REMOTO");
			}
			if (idenRemoto==""){alert("Errore: idenRemoto nullo");return;	}			
			// modifica 29-7-15
			url = this.getBasePath() +"/elencoNotificheSistema.html?codUtente=" + baseUser.COD_DEC_PERSONALE+"&idRemoto="+idenRemoto+"&sorgente=home";
			// ***********
			loadInFancybox({'url':url,'onClosed':function(){}});			
			
		}
		catch(e){
			alert("open - error: " + e.description);
		}		
	},
	create : function(){
		var url= "";
		try{
			url = this.getBasePath() +"/gestioneNotificheSistema.html?codUtente=" + baseUser.COD_DEC_PERSONALE;
			loadInFancybox({'url':url,'onClosed':function(){
		  }});	
		}
		catch(e){
			alert("open - error: " + e.description);
		}				
	},
	createMsgOnAnag : function(idRemoto){
		// idRemoto = CF
		var url= "";
		try{
			url = this.getBasePath() +"/gestioneNotificheSistema.html?codUtente=" + baseUser.COD_DEC_PERSONALE + "&idRemoto=" + idRemoto;
			loadInFancybox({'url':url,'onClosed':function(){
		  }});	
		}
		catch(e){
			alert("open - error: " + e.description);
		}				
	},	
	replyToMsg : function(idMsg){
		var url= "";
		try{
			url = this.getBasePath() +"/gestioneNotificheSistema.html?codUtente=" + baseUser.COD_DEC_PERSONALE + "&idMsg=" + idMsg +"&reply=S";
			loadInFancybox({'url':url,'onClosed':function(){
		  }});	
		}
		catch(e){
			alert("open - error: " + e.description);
		}			
	},
	isAnagMedIniziativa:function(idenAnag){
		try{
			if (idenAnag==""){return false;}
			var rs = top.executeQuery(this.getXmlStatement(),'isAnagMedIniziativa',[idenAnag]);
			if (rs.next()){
				return rs.getString("esito")=="S";
			}
			else{
				return false;
			}
		}catch(e){;}
	},
	sendMessage:function(targetSystem,jsonObjData){
		// da definire
		// la struttura di jsonData potrebbe essere
		// {"iden_anag":"","iden_med_base":"","data_nota":"","nota":""}
		try{
			switch(targetSystem){
				case "MMG":
						switch (jsonObjData.TIPOLOGIA){
							case "NOTA":
							// ATTENZIONE verificare funzioanlità con testi > 40000 caratteri
								// DA TOGLIERE !!!!
								
								var idenRemoto = "";
								var rs = top.executeQuery('info_repository.xml','getIdenRemoto',[jsonObjData.IDEN_ANAG]);
								if (rs.next()){
									idenRemoto = rs.getString("ID_REMOTO");
								}
								if (idenRemoto==""){
									//alert("Errore: idenRemoto nullo " + jsonObjData.IDEN_ANAG);
									// tappullo che in produzione , a db pulito,
									// non servirebbe a nulla
									rs = top.executeQuery('consolle.xml','getInfoAnagInConsolle',[jsonObjData.IDEN_ANAG]);
									if (rs.next()){
										idenRemoto = rs.getString("COD_FISC");
									}
									// solo per debug
									/*
									if (idenRemoto=="" || typeof(idenRemoto)=="undefined" || idenRemoto=="undefined"){
										idenRemoto="SCCLCU84D23I480Q";
									}
									*/
									
								}	
								try{var stm = executeStatement(this.getXmlStatement(),targetSystem + "_creaNota",[idenRemoto,jsonObjData.IDEN_MED_BASE,jsonObjData.IDEN_MED_BASE,jsonObjData.DATA_NOTA,jsonObjData.NOTA],1);}								

								catch(e){alert("error on _creaNotifica " + e.description);}
								if (stm[0]!="OK"){
									alert("Errore nella creazione della nota\n" + stm[0]);
								}
								else{
		//							alert("ok");
									return;
								}							
								break;
							case "MSG_PVT":
								try{
									
//									alert("salvo su sistema remoto");

									// da togliere !!!
									var parsedXmlText = "";
									var xmlDoc = jQuery.parseXML(jsonObjData.XML_DATA);
									var x=xmlDoc.getElementsByTagName("TESTO")[0].childNodes[0];
									x.nodeValue=   x.nodeValue.toString().replace( /\n/g, '<br \\>' );
									if (window.ActiveXObject){
										parsedXmlText = xmlDoc.xml;
									}
									// code for Mozilla, Firefox, Opera, etc.
									else{
										parsedXmlText = (new XMLSerializer()).serializeToString(xmlDoc);
									}
//									alert(parsedXmlText);
//									var stm = executeStatement("notificheSistema_SV.xml",targetSystem + '_creaMsgPackage',[jsonObjData.XML_DATA, jsonObjData.COD_DEC_TARGET_LIST],0);						
									var stm = executeStatement("notificheSistema_SV.xml",targetSystem + '_creaMsgPackage',[parsedXmlText, jsonObjData.COD_DEC_TARGET_LIST],0);						
									if (stm[0]!="OK"){
										alert("Errore di comunicazione con il sistema remoto. Riprovare." );
										throw(e);
									}
								}catch(e){
/*									alert(jsonObjData.XML_DATA);
									alert(jsonObjData.COD_DEC_TARGET_LIST);
									alert("Error sending msg to " + targetSystem +"!\n" + e.description);*/
//									alert("Errore di comunicazione con il sistema remoto.  Riprovare." );		
									throw (e);
								}

								
								// lo mando anche localmente per tenerne traccia
								// eventualmente filtrare per sorgente
								try{
//									alert("salvo copia locale");
									var stmAMB = executeStatement("notificheSistema_SV.xml",'AMB_creaMsgPackage',[jsonObjData.XML_DATA, jsonObjData.COD_DEC_TARGET_LIST],0);						
									if (stmAMB[0]!="OK"){
										alert("Errore: problemi nella salvataggio\n" + stmAMB[1] );
										throw(e);										
									}
									else{
										// alla fine faccio refresh 
										return true;
									}		
								}catch(e){
									alert("Error sending msg to AMB!!\n" + e.description);
									throw (e);
								}
								break;
							default:
								break;
						}
					break;
				case "AMB":
					switch (jsonObjData.TIPOLOGIA){
						case "MSG_PVT":
							/*var stm = executeStatement("notificheSistema_SV.xml",'creaNotificaPerCodDec',[jsonObjData.DATI_JSON.oggetto,jsonObjData.DATI_JSON.messaggio , jsonObjData.COD_DEC_SOURCE, jsonObjData.COD_DEC_TARGET_LIST, JSON.stringify(jsonObjData.DATI_JSON.proprieta)],0);						
							if (stm[0]!="OK"){
								alert("Errore: problemi nella salvataggio\n" + stm[1] );
							}
							else{
								// alla fine faccio refresh 
								return true;
							}*/
							try{
									var strTmp ;
								try{
									strTmp = jsonObjData.COD_DEC_TARGET_LIST;
								}
								catch(e){
									alert("Error parsing COD_DEC_TARGET_LIST");
								}
								try{
									strTmp = jsonObjData.XML_DATA;
								}
								catch(e){
									alert("Error parsing jsonObjData.XML_DATA");
								}								
								
								var stm = executeStatement("notificheSistema_SV.xml",targetSystem + '_creaMsgPackage',[jsonObjData.XML_DATA, jsonObjData.COD_DEC_TARGET_LIST],0);						
								if (stm[0]!="OK"){
									alert("Errore: problemi nella salvataggio\n" + stm[1] );
								}
								else{
									// alla fine faccio refresh 
									return true;
								}		
							}catch(e){
								alert("Error sending msg to " + targetSystem +"\n" + e.description+"\n"+jsonObjData.XML_DATA+"\n"+jsonObjData.COD_DEC_TARGET_LIST);
								throw (e);
							}
							break;
						default:
							return;
					}

					break;
				default:
					return;
			}
		}
		catch(e){
			alert("Errore di comunicazione, sistema occupato. Riprovare in un secondo momento." );
//			alert("sendMessage - error: " + e.description);
			throw (e);
		}
	}
}
	
