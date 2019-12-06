var Labels = {
	
	svuotaAll:function(){
		$('label.data').text("");
	},
	
	setIntestazione:function(pValue){
		$('div.intestazioneCartella').text(pValue);
	},
	
	setValues:function(pParam){
		for(var i in pParam){
			Labels.setValue(i,pParam[i]);
		}		
	},
	
	setValue:function(pLabelName,pLabelText){
		$('#AlberoConsultazione' + sezioneAttiva + ' label#' + pLabelName)
			.text(pLabelText);
	},
	
	setValueHeader:function(pLabelName,pLabelText){
		$('.header label#' + pLabelName)
			.text(pLabelText)
			.show().prev().show();
	},	
	
	setUbicazione:function(){
		
		Labels.svuotaUbicazione();
		
		var Ubicazione = CartellaPaziente.getAccesso("Ubicazione");

		if(Ubicazione == null){
			return;
		}
		
		if(Ubicazione.LETTO)
			Labels.setValueHeader('lblLetto',Ubicazione.LETTO);
		
		/*if(Ubicazione.STANZA)
			Labels.setValueHeader('lblStanza',Ubicazione.STANZA);*/
		
		if(Ubicazione.COD_CDC && Ubicazione.COD_CDC != CartellaPaziente.getAccesso("COD_CDC")){
			Labels.setValueHeader('lblRepartoUbicazione',Ubicazione.REPARTO);
		}		
	},
	
	setValoriPaziente:function(){
		Labels.setIntestazione(CartellaPaziente.getPaziente("INTESTAZIONE"));
	},
	
	setValoriAccesso:function(){
		Labels.setDataAccesso();
		Labels.setDataFineAccesso();
		Labels.setDurataAccesso();	
		Labels.setUbicazione();	
	},
			
	svuotaValoriAccesso:function(){
		Labels.setValues({'lblDataInizio':'','lblDataFine':'','lblGiorni':''});
		Labels.svuotaUbicazione();
	},
	
	svuotaUbicazione:function(){
		Labels.setValueHeader('lblLetto',"");
		Labels.setValueHeader('lblStanza',"");
		Labels.setValueHeader('lblRepartoUbicazione',"");
		$('.header label.head').hide().next().hide();
	},
	
	setValoriRicovero:function(){
		Labels.setValue('lblCartella',CartellaPaziente.getRicovero("NUM_NOSOLOGICO"));
		Labels.setDataRicovero();
		Labels.setDataFineRicovero();
		Labels.setDurataRicovero();
	},
	
	svuotaValoriRicovero:function(){
		Labels.setValues({'lblDataInizioRicovero':'','lblDataFineRicovero':'','lblGiorniRicovero':''});
	},	
	
	setFunzione:function(pLabelText){
		Labels.setValue('lblFunzione' , pLabelText);
	},
	
	setDataRicovero:function(){
		var Data = CartellaPaziente.getRicovero("DATA_ORA_INIZIO");
		
		Labels.setValue(
			'lblDataInizioRicovero' ,
			Data == null ? "" : MultiSubstring(Data,[[6,8,'/'],[4,6,'/'],[0,4]])
		);
	},
	
	setDataFineRicovero:function(){
		var Data = CartellaPaziente.getRicovero("DATA_ORA_FINE");
		
		Labels.setValue(
			'lblDataFineRicovero' ,
			Data == null ? "" : MultiSubstring(Data,[[6,8,'/'],[4,6,'/'],[0,4]])
		);		
	},
	
	setDurataRicovero:function(){
		var Durata = CartellaPaziente.getRicovero("DURATA");
		
		Labels.setValue(
			'lblGiorniRicovero' ,
			Durata == null ? '' : Durata
		);			
	},

	setDataAccesso:function(){
		var Data = CartellaPaziente.getAccesso("DATA_ORA_INIZIO");
		
		Labels.setValue(
			'lblDataInizio' ,
			Data == null ? "" : MultiSubstring(Data,[[6,8,'/'],[4,6,'/'],[0,4]])
		);		
	},
	
	setDataFineAccesso:function(){
		var Data = CartellaPaziente.getAccesso("DATA_ORA_FINE");
		
		Labels.setValue(
			'lblDataFine' ,
			Data == null ? "" : MultiSubstring(Data,[[6,8,'/'],[4,6,'/'],[0,4]])
		);		
	},

	setDurataAccesso:function(){
		var Durata = CartellaPaziente.getAccesso("DURATA");
		
		Labels.setValue(
			'lblGiorni' ,
			Durata == null ? '' : Durata
		);			
	},
	
	setEmergenzaMedica:function(){
		Labels.setValueHeader('lblEmergenzaMedica','EMERGENZA MEDICA');
	},
	
	svuotaEmergenzaMedica:function(){
		Labels.setValueHeader('lblEmergenzaMedica','');
	}

};

var Frames = {
	
	loaded:false,
	opened:false,

	refresh:function(){
		Frames.remove();
		Frames.load();
		if(Frames.opened)
			Frames.show();
		setDimensioniFrameWork();
	},

	remove:function(){
		$('.classIFrame').remove();
		Frames.loaded = false;
	},
	
	show:function(){
		Frames.setSrc();
		$(".classIFrame").show();
	},
	
	hide:function(){
		$(".classIFrame").hide();		
	},
	
	toggle:function(){
		//alert('Loaded=' + Frames.loaded +'\nOpened=' + Frames.opened);
		if(getFunzione()=='ERRORE')return ;
		
		if(!Frames.loaded){
			NS_APPLICATIONS.performLogin('AMBULATORIO');
			Frames.load();
		}			
		
		if(Frames.opened){
			Frames.hide();
		}else{
			Frames.show();
		}
		Frames.opened = !Frames.opened;
	},

	load:function(){
		var modalitaAccesso; try { modalitaAccesso = document.EXTERN.ModalitaAccesso.value; } catch(e) { modalitaAccesso = baseUser.MODALITA_ACCESSO || 'REPARTO'; }
		
		var  rs = executeQuery("configurazioni.xml","getConfigMenuReparto",
									["cartellaPaziente",
								   baseReparti.getValue(getReparto("COD_CDC"),"cartellaPaziente"),
								   baseUser.TIPO]
		);
		
		while(rs.next()){
							
			var url= rs.getString("FUNZIONE")
							.replace(/#IDEN_VISITA#/g		, getAccesso("IDEN"))
							.replace(/#IDEN_RICOVERO#/g		, getRicovero("IDEN"))
							.replace(/#IDEN_ANAG#/g			, getPaziente("IDEN"))
							.replace(/#NUM_NOSOLOGICO#/g	, getRicovero("NUM_NOSOLOGICO"))
							.replace(/#CODICE_REPARTO#/g	, getReparto("COD_CDC"))
							.replace(/#IDEN_PER#/g			, baseUser.IDEN_PER);	
			
			 if(rs.getString("LABEL")=='frameWorklist' && CartellaPaziente.checkPrivacy('WK_RICHIESTE')){

				    url += "&COD_DEC="+baseUser.COD_DEC;
			        url += "&COD_FISC="+$("form[name='frmPaziente'] input[name='COD_FISC']").val();
			        url += "&PREDICATE_FACTORY=" + encodeURIComponent(privacy.WK_RICHIESTE.PREDICATE_FACTORY);
			        url += "&BUILDER=" + encodeURIComponent(privacy.WK_RICHIESTE.BUILDER);
			        url += "&SET_EMERGENZA_MEDICA="+getPaziente("EMERGENZA_MEDICA");
			        url += "&ID_REMOTO="+getPaziente("ID_REMOTO");        
			        url += "&QUERY=getListDocumentPatient";
			        url += "&TIPOLOGIA_ACCESSO="+modalitaAccesso;
			        url += "&EVENTO_CORRENTE="+getRicovero("NUM_NOSOLOGICO");
			 }
			
	        
			
			$('#AlberoConsultazione').before(
				$('<iframe></iframe>')
					.attr({
						"url":url,
						"src":"blank.htm",
						"id":rs.getString("LABEL"),
						"frameborder":0,
						"scroll":"yes",
						"style":rs.getString("RIFERIMENTI")
					})
					.addClass("classIFrame")
			);
		}
		
		Frames.loaded = true;			
	},
		
	setSrc:function(){
		$('.classIFrame[src="blank.htm"]').each(function(){
			var _this = $(this);
			_this.attr("src",_this.attr("url"));
		});
	}
		
};



var InfoRegistrazione = {

	init:function(){//da chiamare all'apertura per crearlo
		$('#lblFunzione.Link').live('click',InfoRegistrazione.open);
	},

	open:function(){

		var StatementName;
		var pBinds = new Array();
		var idenRif;
		var pDati = getForm();
		var funzione = '';

		switch(FiltroCartella.getLivelloValue(pDati)){
			case 'IDEN_VISITA':  idenRif=pDati.iden_visita; break;
			case 'NUM_NOSOLOGICO': idenRif=pDati.iden_ricovero; break;
			default: idenRif = '0';
		}

		//funzione = pDati.funzioneAttiva;
		funzione = CartellaPaziente.getFunzione();
		//alert(funzione);
		switch(funzione){
			case 'DATI_GENERALI':
			case 'DATI_GENERALI_DS':
			case 'ANAMNESI':
			case 'ANAMNESI_AN':
			case 'ESAME_OBIETTIVO':
			case 'ESAME_OBIETTIVO_AN':
			case 'ESAME_OBIETTIVO_SPECIALISTICO':
			case 'ESAME_OBIETTIVO_USCITA':
			case 'ESAME_OBIETTIVO_DS':
			case 'SETTIMANA36':
			case 'MONITORAGGIO':
			case 'TRIAGE':
			case 'PARTOGRAMMA_PARTO':
			case 'ACCERTAMENTO_INFERMIERISTICO':
			case 'QUESTIONARIO_ANAMNESTICO':
			case 'VALUTAZIONE_DIMISSIBILITA':
			case 'DOLORE_POST_OPERATORIO':
			case 'INTERVISTA_TELEFONICA':
			case 'ANESTESIOLOGICA':
			case 'DECORSO_INTRAOPERATORIO':
			case 'CHECK_LIST_PRE_INTERVENTO':
			case 'CHECK_LIST_INTERVENTO':
			case 'CHECK_LIST_POST_INTERVENTO':
			case 'SCHEDA_IVG':
				StatementName = 'infoSchedeXml';
				pBinds.push(funzione);
				pBinds.push(idenRif);
				break;
			case 'SCHEDA_PROGETTO_RIABILITATIVO':
				StatementName = 'infoSchedeXml.getSchedaByIden';
				pBinds.push(funzione);
				pBinds.push(idenRif);
				pBinds.push(pDati.iden_scheda);
				break;
			case 'BISOGNI_SINTESI':
				StatementName = 'infoBisogniSintesi';
				pBinds.push(funzione);
				pBinds.push(idenRif);
				pBinds.push(CartellaPaziente.getReparto("COD_CDC")/*datiIniziali.reparto*/);
				pBinds.push(CartellaPaziente.getPaziente("IDEN")/*datiIniziali.iden_anag*/);
				break;
			case 'BISOGNO_AMBIENTE_SICURO':
			case 'BISOGNO_CARDIOCIRCOLATORIA':
			case 'BISOGNO_COMUNICARE':
			case 'BISOGNO_ELIMINAZIONE_URINARIA':
			case 'BISOGNO_IGIENE':
			case 'BISOGNO_MOVIMENTO':
			case 'BISOGNO_RESPIRARE':
			case 'BISOGNO_RIPOSO':
			case 'BISOGNO_ALIMENTARSI':
				StatementName = 'infoBisogni';
				pBinds.push(funzione);
				pBinds.push(idenRif);
				document.getElementById("frameWork").contentWindow.document.getElementsByName("frameTopBisogni")[0].contentWindow.document.body.onclick=function(){$('#divPopUpInfo').remove();};
				document.getElementById("frameWork").contentWindow.document.getElementsByName("frameBottomBisogni")[0].contentWindow.document.body.onclick=function(){$('#divPopUpInfo').remove();};
				break;
			case 'SCALA_CONLEY':
			case 'SCALA_BRADEN':
			case 'SCORE_PADUA_BLEEDING_RISK':
			case 'SCORE_MEWS':
			case 'SCORE_RAY':
			case 'SCORE_HAS_BLED':
			case 'SCORE_CHADS2_VASC':
			case 'SCORE_WELLS':
			case 'SCORE_PORT_PSI':
			case 'SCORE_GRACE':
			case 'RISCHIO_TROMBOTICO_INDIVIDUALE':
			case 'SCALA_GENEVA':
			case 'SCALA_FACE':
			case 'SCALA_SOAS':
			case 'SCALA_GLASGOW':
			case 'SCALA_NIH_STROKE':
			case 'SCALA_MMSE':
			case 'SCALA_RANKIN':
			case 'SCALA_CHILD_PUGH':
			case 'SCALA_MELD':
			case 'SCALA_MGAPS':
			case 'SCALA_NAFLD':
			case 'SCALA_APRI':
			case 'SCALA_TEGNER':
			case 'SCALA_HARRIS':
			case 'SCALA_OXFORD_KNEE':
			case 'SCALA_OXFORD_HIP':
			case 'SCALA_VALUTAZIONE_FUNZIONALE':
			case 'SCALA_BARTHEL':
			case 'SCALA_BBS':
			case 'SCALA_DGI':
			case 'SCALA_TIS':
			case 'SCALA_FM':
			case 'SCALA_HPT':
			case 'SCALA_FAC':
			case 'SCALA_TUG':
			case 'SCALA_10MWT':
			case 'SCALA_6MWT':
			case 'SCALA_MOTRICITY_INDEX':
			case 'SCALA_TCT':
			case 'SCALA_TINETTI':
			case 'SCALA_ASHA':
			case 'SCALA_DOSS':
			case 'SCHEDA_OUTREACH':
				StatementName = 'infoScale';
				pBinds.push(funzione);
				pBinds.push(idenRif);
			break;
			case 'LETTERA_PRIMO_CICLO'	:
			case 'LETTERA_AL_CURANTE'	:
			case 'LETTERA_TRASFERIMENTO':
            case 'LETTERA_FARMACIA'		: 	
            case 'LETTERA_PROSECUZIONE'	:
            case 'SEGNALAZIONE_DECESSO'	:
				StatementName = 'infoLettera';
				pBinds.push(funzione);
				pBinds.push(idenRif);
			break;
            case 'LETTERA_DIMISSIONI':
				if (pDati.TipoRicovero == 'DH'){
					funzione = 'LETTERA_DIMISSIONI_DH';
				}else{
					funzione = 'LETTERA_STANDARD';
				}
				StatementName = 'infoLettera';
				pBinds.push(funzione);
				pBinds.push(idenRif);
			break;
			default:
				MsgBox("INFORMAZIONI UTENTI", "Informazioni non disponibili per questa funzione.");
				return;
		}
		dwr.engine.setAsync(false);
		dwrUtility.executeStatement("infoRegistrazione.xml",StatementName,pBinds,4,callBack);
		dwr.engine.setAsync(true);
		
		function callBack(resp)
		{
			if(resp[0]=='KO')
			{
				alert(resp[1]);
			}
			else
			{
				MsgBox("INFORMAZIONI UTENTI", {"Utente inserimento:": resp[2], "Data inserimento:": resp[3], "Utente modifica:": resp[4], "Data modifica:": resp[5]});
			}
		}
		
		function MsgBox(title, message) {
			Popup.remove();
			
			var vObj = $('<table/>');//.css("font-size","12px")
			
			if (typeof message === 'string') {
				vObj = vObj.append($('<tr/>').append($('<td/>').text(message)));
			} else if (typeof message === 'object') { 
				for (var m in message) {
					vObj = vObj.append($('<tr/>')
						.append($('<td/>').text(m))
						.append($('<td/>').text(message[m]))
					);
				}
			}

			Popup.append({
				obj:vObj,
				title: title
			});
		}
	},

	show:function(){
		$('#lblFunzione').addClass('Link');
	},

	hide:function(){
		$('#lblFunzione').removeClass('Link');
	}
};

function Logger(pParam){
		/*{
			[name]		Nome del logger
			[,level] 	Livello di log per write
			[,db]		Livello di log su db
			[,alert]	Livello di log su alert
			[,console] 	Livello di log su console
			[,cosoleId] ID dell'elemento console a cui appendere i messaggi
		}*/

		if(typeof pParam == 'string')
			pParam = {name:pParam};
		
		function checkParameter(pValue,pDefault){return typeof pValue =='undefined' ? pDefault : pValue;}
		function checkLevel(pParameter,pLevel){return pParameter != null && pParameter <= pLevel;};
		
		this.name 	= checkParameter(pParam.name	 	, 'Elements.Logger.js');
		this.level 	= checkParameter(pParam.level	 	, 3);
		this.db 	= checkParameter(pParam.db		 	, null);
		this.alert  = checkParameter(pParam.alert	 	, null);
		this.console  = checkParameter(pParam.console	, null);
		this.consoleId  = checkParameter(pParam.consoleId	, null);		

		this.levels = {DEBUG:0,INFO:1,WARN:2,ERROR:3};
		this.msg = new Array();		
		
		this.clean = function(){
			this.msg = new Array();
			$('#' + this.consoleId + ' li.' + this.name).remove();
		};
		
		this.write = function(pText,pLevel){

			var vLevel = typeof pLevel == 'undefined' ? 'ERROR' : pLevel;
			
			if(checkLevel(this.level,this.levels[pLevel])){			
				this.msg.push({text:pText,level:vLevel,time:new Date()});
			}

			if(checkLevel(this.alert,this.levels[pLevel])){
				alert(pText);
			}

			if(checkLevel(this.db,this.levels[pLevel])){
				executeStatement("Logger.xml","GEST_LOGS.LOG",[this.name,pText,vLevel]);
			}
			
			if(checkLevel(this.console,this.levels[pLevel])){				
				$('#' + this.consoleId).append(pText);
			}			
				
		};

		this.debug = function(pText){this.write(pText,'DEBUG');};
		this.info = function(pText){this.write(pText,'INFO');};
		this.warn = function(pText){this.write(pText,'WARN');};
		this.error = function(pText){this.write(pText,'ERROR');};				
		
		this.setLogOnDb		= function(pLevel){this.db 		= pLevel;};
		this.setLogOnAlert 	= function(pLevel){this.alert 	= pLevel;};
		
		
};

var ConfigurazioneSchede = {
	logger:null
};

var Terapie = {
	logger:null
};