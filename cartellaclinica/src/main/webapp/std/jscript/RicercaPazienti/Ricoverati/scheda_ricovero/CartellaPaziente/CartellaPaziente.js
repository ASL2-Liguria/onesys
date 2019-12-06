var CartellaPaziente = {
	/**
	 * Funzione eseguita dopo che la cartella è stata caricata.
	 */
	ready:function(){
		// Propone l'associazione del ricovero attuale con i pre-ricoveri
		checkPrericoveri();
		
		// Mostra/Nasconde il menu contenente le schede di Day Surgery
		checkDaySurgery();
	},
	
	RiferimentiAttivi:{},
	
	setData:function(){
		// SecurityError
		try { var name = window.opener.name; } catch(e) { window.opener = {}; }
	
		window.name = 'schedaRicovero';
		
		
		window.getRiferimenti	= CartellaPaziente.getRiferimenti;
		
		window.getPaziente 		= CartellaPaziente.getPaziente;
		window.getAccesso 		= CartellaPaziente.getAccesso;
		window.getRicovero 		= CartellaPaziente.getRicovero;
		window.getPrericovero 	= CartellaPaziente.getPrericovero;		
		window.getReparto 		= CartellaPaziente.getReparto;		
		window.getModalita 		= CartellaPaziente.getModalita;
		window.getFunzione 		= CartellaPaziente.getFunzione;

		initbaseUser();
		initbasePC();
		initbaseGlobal();

		NS_CONSOLEJS.init();
		NS_CONSOLEJS.addLogger({name:'DatiCartella',db:3,console:0});
		NS_CONSOLEJS.addLogger({name:'FunzioniCartella',db:3,console:0});
		NS_CONSOLEJS.addLogger({name:'FiltroCartella',db:3,console:0});
		NS_CONSOLEJS.addLogger({name:'Statements',db:3,console:0});
		NS_CONSOLEJS.addLogger({name:'ConfigurazioneSchede',db:3,console:2});
		NS_CONSOLEJS.addLogger({name:'Terapie',db:4,console:2});
		NS_CONSOLEJS.addLogger({name:'ModalitaCartella',db:3,console:0});
		
		DatiCartella.logger 		= NS_CONSOLEJS.loggers['DatiCartella'];
		FunzioniCartella.logger  	= NS_CONSOLEJS.loggers['FunzioniCartella'];
		FiltroCartella.logger  		= NS_CONSOLEJS.loggers['FiltroCartella'];	
		Statements.logger 			= NS_CONSOLEJS.loggers['Statements'];
		ConfigurazioneSchede.logger = NS_CONSOLEJS.loggers['ConfigurazioneSchede'];
		Terapie.logger				= NS_CONSOLEJS.loggers['Terapie'];
		ModalitaCartella.logger		= NS_CONSOLEJS.loggers['ModalitaCartella'];

		CartellaPaziente.RiferimentiAttivi['LEFT'] = new clsRiferimenti();
		CartellaPaziente.RiferimentiAttivi['RIGHT'] = new clsRiferimenti();		
		
		function clsRiferimenti(){
			this.funzione 			= null;
			this.iden_anag 			= null;
			this.iden_accesso 		= null;
			this.iden_ricovero 		= null;
			this.iden_prericovero 	= null;
			this.cod_cdc 			= null;
			
			this.clean = function(){
				this.funzione = this.iden_anag = this.iden_accesso = this.iden_ricovero = this.iden_prericovero = this.cod_cdc = null;
			}
			
			this.setIniziale = function(fnc){
				this.funzione 			= CartellaPaziente.getFunzione();
				this.iden_anag 			= CartellaPaziente.getPaziente("IDEN");
				this.iden_accesso 		= CartellaPaziente.getAccesso("IDEN");
				this.iden_ricovero 		= CartellaPaziente.getRicovero("IDEN");
				this.iden_prericovero 	= CartellaPaziente.getPrericovero("IDEN");	
				this.cod_cdc 			= CartellaPaziente.getReparto("COD_CDC");
				
				if (typeof fnc === 'function') {
					fnc();
				}
			}
		};		

//		var repartoPar= CartellaPaziente.getReparto("COD_CDC")!=''? CartellaPaziente.getReparto("COD_CDC"):baseUser.LISTAREPARTI[0];
		eval('privacy = ' + baseReparti.getValue(baseUser.LISTAREPARTI[0],'ATTIVA_PRIVACY'));
		
		
		loadCartella();

		InfoRegistrazione.init();
		FiltroCartella.init();

		CartellaPaziente.RiferimentiAttivi['INIZIALE'] 					= new clsRiferimenti();
		CartellaPaziente.RiferimentiAttivi['INIZIALE'].setIniziale(CartellaPaziente.ready);

		try{
        	eval(document.EXTERN.funzione.value);
		}catch(e){
            apriDefault();
		}	
		


	},
	
	setEvents:function(){
		
		//document.body.onselectstart = function(){return false;};
		document.body.onbeforeunload = function(){gestTrace();};
				
		$('.refreshPage').click(function(){refreshPage();});

		try {
			if(opener != null && typeof opener != 'undefined' && typeof opener.NS_CARTELLA_PAZIENTE != 'undefined' && typeof opener.NS_CARTELLA_PAZIENTE != 'unknown'){

				if(opener.NS_CARTELLA_PAZIENTE.size != null){
					$('.btn.previous').click(function(){
						try {
							if(!DatiNonRegistrati.check())
								return;	
							$('div#infoPopup').remove();
							utilMostraBoxAttesa(true);
							setTimeout(function(){
								opener.NS_CARTELLA_PAZIENTE.previous();	
								CartellaPaziente.LoadFromOpener();
							},50);
						} catch(e) {
							alert(e.message);
						}
					});
					
					$('.btn.next').click(function(){
						try {
							if(!DatiNonRegistrati.check())
								return;
							$('div#infoPopup').remove();
							utilMostraBoxAttesa(true);
							setTimeout(function(){
								opener.NS_CARTELLA_PAZIENTE.next();
								CartellaPaziente.LoadFromOpener();
							},50);
						} catch(e) {
							alert(e.message);
						}
					});	
				}else{
					$('.btn.previous , .btn.next').hide();
				}

				$('.btn.refresh').click(function(){
					if(!DatiNonRegistrati.check())
						return;		
					$('div#infoPopup').remove();
					utilMostraBoxAttesa(true);
					setTimeout(function(){
						CartellaPaziente.LoadFromOpener();
					},50);
				});
				
			}else{
				$('.btn.previous , .btn.next , .btn.refresh').hide();
			}
		} catch(e) {
			alert(e.message);
		}
		
		$('.btn.chiudi').click(function(){
			try{
				if(!DatiNonRegistrati.check())
					return;	
				opener.NS_CARTELLA_PAZIENTE.refreshCaller();
			}catch(e){/*alert(e.description);*/}
			self.close();
		});
				
		$('.btn.patient').click(apriAnagrafica);
		
		$('.btn.info , div.intestazioneCartella').click(apriChiudiInfo);
		
		$('#AlberoConsultazioneLEFT , #slideMenuVersioniLEFT')
			.on("mousemove",function(){sezioneAttiva ='LEFT';});
			
		$('#AlberoConsultazioneRIGHT , #slideMenuVersioniRIGHT')
			.on("mousemove",function(){sezioneAttiva ='RIGHT';});			
			
		$('div.btnMenuVersioni').click(openMenuVersioni);
		
		$('#lblFiltro').addClass("Link").click(function(e){MappaRicovero.build();e.stopPropagation();});
			
	},
	
	checkPrivacy : function(funzione) {
		if(privacy[funzione].ATTIVA=='S')
			return true;
		else
			return false;

	},
	
	
	clean:{
		All:function(){
			
			if(getPaziente() == null){
				Labels.setIntestazione("");
			}
			
			CartellaPaziente.clean.avvertenze.paziente();
			CartellaPaziente.clean.avvertenze.cartella();//da implementare
			CartellaPaziente.clean.frames();
			CartellaPaziente.clean.labels();
			CartellaPaziente.clean.menu();
			CartellaPaziente.clean.menuConfronto();//da implementare			
		},
		
		avvertenze:{
			paziente:function(){$('div.header .divButtonWk').remove();},
			cartella:function(){}			
		},
		
		frames:function(){Frames.remove();},		
		labels:function(){Labels.svuotaAll();},
		menu:function(){document.all['slideMenu'+sezioneAttiva].innerHTML ="";},
		menuConfronto:function(){}
	},
	
	refresh:{
		
		All:function(){
			//alert('RefreshAll');
			CartellaPaziente.refresh.avvertenze.paziente();
			CartellaPaziente.refresh.avvertenze.cartella();//da implementare
			CartellaPaziente.refresh.frames();
			CartellaPaziente.refresh.labels();
			CartellaPaziente.refresh.menu();
			CartellaPaziente.refresh.menuConfronto();//da implementare
		},
		
		avvertenze:{
						
			paziente:function(){
	
				CartellaPaziente.clean.avvertenze.paziente();		
				var rs = executeQuery("cartellaPaziente.xml","getAvvertenzaPaziente",[
										   getReparto("COD_CDC"),
										   getPaziente("IDEN"),
										   getAccesso("IDEN")==null ? -1 : getAccesso("IDEN"),
										   getRicovero("IDEN")==null ? -1 : getRicovero("IDEN"),
										   getRicovero("NUM_NOSOLOGICO"),
										   getPaziente("ID_REMOTO")]);
				if( rs.next()){
					$('div.header').prepend($(rs.getString("AVVERTENZE")));			
				}

				    if(!CartellaPaziente.checkPrivacy('AVVERTENZE_CARTELLA')){
		            	$('div.consensoPazienteAssenteInfoCartella,div.consensoPazienteKOInfoCartella,div.consensoPazienteOKInfoCartella,div.consensoEventoOKInfoCartella,div.consensoEventoKOInfoCartella,div.consensoEventoAssenteInfoCartella,div.emergenzaMedicaFalse').hide();
		            }
				
				CartellaPaziente.createLogButton();
								
			},
			cartella:function(){}
		},
		
		frames:function(){
			Frames.refresh();
		},
		
		labels:function(){

			Labels.setValoriPaziente();

			if(CartellaPaziente.getRicovero() != null){
				Labels.setValoriRicovero();
			}else{
				Labels.svuotaValoriRicovero();
			}

			if(CartellaPaziente.getAccesso() != null){
				Labels.setValoriAccesso();
			}else{
				Labels.svuotaValoriAccesso();
			}

			Labels.setValue('lblReparto',CartellaPaziente.getReparto("DESCR"));
		},
		
		menu:function(pSezione){
			try{
				pSezione = typeof pSezione == 'undefined' ? 'LEFT' : pSezione;
				
				var vDati = {
					leftRight 		: ( pSezione == 'LEFT' ? 'Left' : 'Right'),
					iden_anag 		: CartellaPaziente.getPaziente("IDEN"),
					reparto   		: CartellaPaziente.getReparto("COD_CDC"),
					iden_ricovero           : CartellaPaziente.getRicovero("IDEN"),
					ricovero		: CartellaPaziente.getRicovero("NUM_NOSOLOGICO"),
					iden_visita		: CartellaPaziente.getAccesso("IDEN"),
					modalita		: CartellaPaziente.getReparto().Modalita[CartellaPaziente.getAccesso("CODICE_MODALITA_CARTELLA")]
				};
				
				reloadMenu(vDati);
			}catch(e){
				alert(e.description);
			}
		},
		
		menuConfronto:function(){}
		
	},
	
	setIdenAnag:function(pValue){
		CartellaPaziente.RiferimentiAttivi[sezioneAttiva]['iden_anag'] 		 = pValue;
	},
	
	setIdenAccesso:function(pValue){
		FiltroCartella.reset();		
		CartellaPaziente.RiferimentiAttivi[sezioneAttiva]['iden_accesso'] 	 = pValue;
	},
	
	setIdenRicovero:function(pValue){
		CartellaPaziente.RiferimentiAttivi[sezioneAttiva]['iden_ricovero'] 	 = pValue;
	},
	
	setIdenPrericovero:function(pValue){
		CartellaPaziente.RiferimentiAttivi[sezioneAttiva]['iden_prericovero'] = pValue;
	},
	
	setReparto:function(pValue){
		CartellaPaziente.RiferimentiAttivi[sezioneAttiva]['cod_cdc'] 		  = pValue;
	},
	
	setModalita:function(pValue){
		CartellaPaziente.RiferimentiAttivi[sezioneAttiva]['modalita']         = CartellaPaziente.getReparto().Modalita[pValue]
	},
	
	setFunzione:function(pValue){
		CartellaPaziente.RiferimentiAttivi[sezioneAttiva]['funzione']			= pValue;
	},
	
	getRiferimenti:function(pKeyCampo){
		if(pKeyCampo == null){
			return CartellaPaziente.RiferimentiAttivi[sezioneAttiva];
		}else{		
			if(typeof CartellaPaziente.RiferimentiAttivi[sezioneAttiva][pKeyCampo] == 'undefined')
				return null;
			return CartellaPaziente.RiferimentiAttivi[sezioneAttiva][pKeyCampo];
		}
	},
	
	getObject:function(pRiferimento,pCodKeyRiferimento,pKeyCampo){
		var vKeyRiferimento = CartellaPaziente.RiferimentiAttivi[sezioneAttiva][pCodKeyRiferimento]
		if(vKeyRiferimento == null)
			return null;
		
		if(typeof pRiferimento[vKeyRiferimento] == 'undefined')
			return null;
					
		if(pKeyCampo == null){
			return pRiferimento[vKeyRiferimento];
		}else{		
			if(typeof pRiferimento[vKeyRiferimento][pKeyCampo] == 'undefined')
				return null;
			return pRiferimento[vKeyRiferimento][pKeyCampo];
		}
	},
	
	getPaziente:function(pKeyCampo){
		return CartellaPaziente.getObject(
			DatiCartella.Pazienti,
			'iden_anag',
			(typeof pKeyCampo == 'undefined' ? null : pKeyCampo)
		);
	},
	
	getReparto:function(pKeyCampo){
		return CartellaPaziente.getObject(
			DatiCartella.Reparti,
			'cod_cdc',
			(typeof pKeyCampo == 'undefined' ? null : pKeyCampo)
		);				
	},
	
	getAccesso:function(pKeyCampo){
		return CartellaPaziente.getObject(
			DatiCartella.Accessi,
			'iden_accesso',
			(typeof pKeyCampo == 'undefined' ? null : pKeyCampo)
		);			
	},
	
	getRicovero:function(pKeyCampo){
		return CartellaPaziente.getObject(
			DatiCartella.Ricoveri,
			'iden_ricovero',
			(typeof pKeyCampo == 'undefined' ? null : pKeyCampo)
		);				
	},
	
	getPrericovero:function(pKeyCampo){		
		return CartellaPaziente.getObject(
			DatiCartella.Prericoveri,
			'iden_prericovero',
			(typeof pKeyCampo == 'undefined' ? null : pKeyCampo)
		);		
	},
	
	getModalita:function(){
		return CartellaPaziente.RiferimentiAttivi[sezioneAttiva]['modalita'];
	},

	getFunzione:function(){
		return CartellaPaziente.RiferimentiAttivi[sezioneAttiva]['funzione'];
	},
	
	getRiferimentiAmbulatorio:function(param){
		var cod_dec_reparto = '';
		if (typeof(param)=='object' && (typeof param.cod_dec === 'string')){
			cod_dec_reparto = param.cod_dec;
		}else{
			cod_dec_reparto = getReparto("COD_DEC");
		}
		
		var resp = executeStatement("PST_Prenotazione.xml","getIdentificativiAmbulatorio",[
										getPaziente("IDEN"),
										cod_dec_reparto
									],2);
		
		return {
			success:resp[0],
			message:resp[1],
			iden_anag:resp.length < 4 ? null : resp[2],
			iden_pro:resp.length < 4 ? null : resp[3]
		}
	},
	
	LoadFromOpener:function(){
		
		//DatiCartella.logger.clean();			
		
		if(CartellaPaziente.getFunzione()=='ERRORE')
			refreshPage = apriVuota;
		
		for(var i in CartellaPaziente.RiferimentiAttivi)
			CartellaPaziente.RiferimentiAttivi[i].clean();	
			
		var data = opener.NS_CARTELLA_PAZIENTE.getData();

		if(data.iden_evento != ""){

			if(typeof DatiCartella.Eventi[data.iden_evento] == 'undefined'){

				DatiCartella.loadEvento(DatiCartella.Eventi,data.iden_evento);

				if(DatiCartella.Eventi[data.iden_evento]["ACCESSO"] == "0"){
					DatiCartella.Ricoveri[data.iden_evento] = DatiCartella.Eventi[data.iden_evento];
				}else{
					DatiCartella.Accessi[data.iden_evento] = DatiCartella.Eventi[data.iden_evento];
				}
			}
			

			if(DatiCartella.Eventi[data.iden_evento]["ACCESSO"] == "0")
				DatiCartella.loadAccesso(DatiCartella.Eventi[data.iden_evento]["LINK_ACCESSO"]);
			else
				DatiCartella.loadAccesso(DatiCartella.Eventi[data.iden_evento]["IDEN"]);
									
		}else{//caso di iden_anag[,cod_cdc] da implementare
			document.location.replace(document.location);
		}
		
		CartellaPaziente.RiferimentiAttivi["INIZIALE"].setIniziale(CartellaPaziente.ready);
		
		FiltroCartella.reset();
		
		refreshPage();		
	},
	
	createLogButton:function(){
		if(baseUser.LIVELLO=='0')
			$('div.header').prepend(
				$('<div title="apri riferimenti attivi"></div>')
					.addClass("divButtonWk")
					.addClass("log")
					.click(CartellaPaziente.openRiferimentiAttivi)						
			);	
	},
	
	openRiferimentiAttivi:function(){
		
		event.cancelBubble = true;
	
		var modalitaAccesso; try { modalitaAccesso = document.EXTERN.ModalitaAccesso.value; } catch(e) { modalitaAccesso = baseUser.MODALITA_ACCESSO || 'REPARTO'; }
		
		var _tableRiferimenti = $('<table></table>')
						.append(getRow('Accesso',CartellaPaziente.getAccesso("IDEN")))
						.append(getRow('Ricovero',CartellaPaziente.getRicovero("IDEN")))	
						.append(getRow('Prericovero',CartellaPaziente.getRicovero("IDEN_PRERICOVERO")))	
						.append(getRow('Paziente',CartellaPaziente.getPaziente("IDEN")))
						.append(getRow('Reparto',CartellaPaziente.getReparto("COD_CDC")))			
						.append(getRow('Modalita\'',CartellaPaziente.getAccesso("CODICE_MODALITA_CARTELLA")))
						.append(getRow('Modalita Accesso' ,modalitaAccesso))
                        .append(getRow('Readonly',ModalitaCartella.isReadonly()))
						.append(getRow('Stampabile',ModalitaCartella.isStampabile()));									
																	
		Popup.append({
			title:'Riferimenti attivi',
			obj:_tableRiferimenti,	
			height:200
		});
		
		function getRow(pLabel,pValue){
			return 	$('<tr></tr>')
					.append($('<td>'+pLabel+'</td>'))
					.append($('<td>:</td>'))
					.append($('<td>'+pValue+'</td>'));
		}
	},
	
	Menu:{
		
		hide:function(){
			$('#AlberoConsultazione').hide();
		},
		
		show:function(){
			$('#AlberoConsultazione').show();
		}
		
	},

	/**
	 * Controlla se l'identificativo di accesso del paziente, contenuto nel frame superiore, corrisponde a quello
	 * contenuto nel frame più interno passato come	parametro. In caso negativo provvede a ricaricare il frame.
	 * 
	 * @author  gianlucab
	 * @version 1.0
	 * @since   2014-10-03
	 * @param   strIdenAccesso (string)
	 */   
	controllaPaziente:function(strIdenAccesso){		
		var idenAccessoTop = parseInt(CartellaPaziente.getAccesso('IDEN'));		
		var idenAccesso = parseInt(strIdenAccesso);
		
		if (!isNaN(idenAccessoTop) && !isNaN(idenAccesso) && idenAccessoTop != idenAccesso) {
			CartellaPaziente.LoadFromOpener();
		}
	},

	/**
	 * Modifica il footer della pagina aggiungendo il gruppo di pulsanti passati in chiamata.
	 * 
	 * @author  gianlucab
	 * @version 1.0
	 * @since   2015-07-30
	 * @param   args (object)
	 */
	footerPagina:function(args) {
		args = typeof args === 'object' && args != null ? args : new Object();
		
		// Obbligatori
		args.wnd     = typeof args.wnd === 'object' && args.wnd != null ? args.wnd : new Object();
		args.config  = typeof args.config === 'string' ? args.config : '';
		
		// Opzionali
		args.bFooter = typeof args.bFooter === 'boolean' ? args.bFooter : false;
		
		var json = null;
		try {
			eval("json="+window.baseReparti.getValue(window.getReparto("COD_CDC"),args.config));
		} catch(e) {}
		if (typeof json === 'object' && json != null) {
			if (args.bFooter) {
				// Aggiunge il footer in automatico
				args.wnd.$('form[name=dati]').append('<TABLE class=classTabHeader cellSpacing=0 cellPadding=0 sizset="0" sizcache="7"><TBODY sizset="0" sizcache="7"><TR sizset="0" sizcache="7"><TD class=classTabFooterSx></TD><TD class=classTabHeaderMiddle>&nbsp;</TD><TD class=classTabFooterDx></TD></TR></TBODY></TABLE>');
			}
			for (var prop in json) {
				$a = $('<a/>').text(prop);
				for (var attr in json[prop]) {
					$a.attr(attr, json[prop][attr]);
				}
				args.wnd.$("td.classTabFooterDx").last().before($("<td class=classButtonHeader/>").append($("<div style=\"\" class=\"pulsante\"/>").append($a)));
			}
		}
	}
};
