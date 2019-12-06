var NS_FENIX_MMG = {
	init: function() {
		NS_MESSAGGI.getCountMessaggi();
	},
	setEvents: function() {}
};

NS_FENIX_TOP.configLayout = function () {
	var hBrowser = LIB.getHeight();
	var wBrowser = LIB.getWidth();

	var hMenuBar 		= $("#menuBar").outerHeight(true);
	var hStatBar 		= $("#statusBar").outerHeight(true);
	var hdivInfo		= $("#divInfo").outerHeight(true) > 0 ? $("#divInfo").outerHeight(true) : 30;
	var hContent 		= hBrowser - hMenuBar - hStatBar - hdivInfo + 8;

	$("#content > iframe").height(hContent).attr("h", hContent).width(wBrowser);
};

NS_FENIX_TOP.attivaMenu = function () {
	$slidemenu.buildmenuClick("menuCartella");
	$slidemenu.buildmenuClick("menuEsterno");
};

NS_FENIX_MINI_MENU.cambiaLogin = function () {
	var dialog = home.$.dialog(
		traduzione.lblCambiaLogin, {
			id 				: "dialogConfirmLogOut",
			title 			: traduzione.lblConfermaCambioLogin,
			ESCandClose		: true,
			created			: function(){ $('.dialog').focus(); },
			width 			: 350,
			showBtnClose 	: false,
			modal 			: true,
			movable 		: true,
			buttons 		: [ {
				label : traduzione.lblSi,
				action : function(ctx) {
					dialog.close();
					try {
						logout = true;
						var baseurl = home.baseGlobal.URL_HOME_LOGIN;
						home.location.replace(baseurl);
					}
					catch(e)
					{}
					//NS_FENIX_TOP.logout('CHANGELOGIN');
				},
				keycode:"13",
				'classe': "butVerde"
			}, {
				label : traduzione.lblNo,
				action : function(ctx) {
					dialog.close();
				}
			} ]
		}
	);
};

NS_FENIX_MINI_MENU.logout = function () {
	var dialog = home.$.dialog(
		traduzione.lblLogout, {
			id 				: "dialogConfirmLogOut",
			title 			: traduzione.lblConfermaLogout,
			ESCandClose		: true,
			created			: function(){ $('.dialog').focus(); },
			width 			: 350,
			showBtnClose 	: false,
			modal 			: true,
			movable 		: true,
			buttons 		: [ {
				label : traduzione.lblSi,
				action : function(ctx) {
					dialog.close();
					NS_FENIX_TOP.logout();
					home.self.close(); //TODO: da capire perchè cavolo non si chiude richiamando la pagina di logout(), chrome di mer..
				},
				keycode:"13",
				'classe': "butVerde"
			}, {
				label : traduzione.lblNo,
				action : function(ctx) {
					home.$.dialog.hide();
				}
			} ]
		}
	);
};

appletFenix.print=function (stampante,parametri) {
	NS_PRINT.print({
		stampante: stampante,
		opzioni: parametri,
		printonly: true
	});
};

NS_FENIX_PRINT.okCaricaDocumento=function() {
	NS_FENIX_PRINT.apri({});
};

var NS_MESSAGGI = {
	
	conteggio: 0,

	ricevi: function(iden_messaggio) {
		NS_MESSAGGI.conteggio++;
		NS_MESSAGGI.setNotificaNumber();
		/*TODO: gestire il messaggio specifico, magari in base alla priorita*/
	},
	
	getCountMessaggi:function(){

		home.$.NS_DB.getTool({_logger : home.logger}).select({
			id: 'MESSAGGISTICA.MESSAGGI_UTENTE_DA_LEGGERE_COUNT',
			datasource: 'CONFIG_WEB',
			parameter: {
				username	:   { v : home.baseUser.USERNAME, t : 'V'},
				sito		:	{ v : home.NS_FENIX_TOP.sito, t : 'V'}
			}
		}).done(function(resp) {
			NS_MESSAGGI.setNotificaNumber(resp.result[0].CONTEGGIO);
		});
	},

	setNotificaNumber:function(vNumber) {
		
		if (typeof vNumber == "undefined") {
			vNumber = NS_MESSAGGI.conteggio;
		}

		$("#numMessaggiDaLeggere").remove();
		if (vNumber > 0) {
			var iconaNumber = $( document.createElement('div') );
			iconaNumber.attr( {
				'id' : 'numMessaggiDaLeggere', 
				'title' : 'Ci sono '+ vNumber + ' messaggi da leggere', 
				'class' : 'notificaApice' 
			});
			iconaNumber.text( vNumber);
			iconaNumber.appendTo('#linkMessaggi');
		}
	}

};

NS_SESSION_CONTROL.checkSession = function () {return true;};
NS_SESSION_CONTROL.INTERVAL_CHECK_SESSION = 10000000;
NS_SESSION_CONTROL.openDialogErrorSession = function() {/*INUTILE, posso al limite provare a loggare per capire perche' succede*/};
