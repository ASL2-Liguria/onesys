var UTENTE = {

		IDEN_MEDICI_GRUPPO: [],
		
		init: function(obj) {
			this.obj = obj;
			var ar = obj.MEDICI_GRUPPO.split(",");
			for (var i=0; i<ar.length; i++) {
				if (this.IDEN_MEDICI_GRUPPO.indexOf(ar[i]) < 0)
					this.IDEN_MEDICI_GRUPPO[this.IDEN_MEDICI_GRUPPO.length]=ar[i];
			}
		},
	
		inMyGroup: function(iden_per) {
			for (var u=0; u < this.IDEN_MEDICI_GRUPPO.length; u++) {
				if (this.IDEN_MEDICI_GRUPPO[u]==iden_per) {
					return true;
				}
			};
			return false;
		}
};

/*non serve*/
if (typeof home == "undefined" || home == null) {
	home = window;
};

if (typeof applicationCache != "undefined") {
	
	applicationCache.addEventListener("downloading", function(e){
		console.log("scarico aggiornamenti dell'applicazione");
	}, false);
	
	applicationCache.addEventListener("updateready", function(e){
		console.log("aggiornamento disponibile, ricarico la pagina");
		location.reload();
		return;
	}, false);

	try {
		applicationCache.update();
	} catch(e) {
		console.log(e);
		console.log("applicationCache.status=" + applicationCache.status);
	}
};

$(function() {
	$.when(NS_OFFLINE.semaforo_parametri).then(function() {
		NS_OFFLINE_TOP.init();
	});
});

if (typeof home.NS_FENIX_TOP == "undefined") {
	home.NS_FENIX_TOP = {
			chiudiUltima: function ()
			{
				var n_scheda = ($(".iScheda", "body").length);
				NS_FENIX_TOP.chiudiScheda({'n_scheda': n_scheda});
			},

			chiudiScheda: function (params)
			{
				$('#iScheda-' + params.n_scheda, "body").remove();
			},
			
			handlerExpiredSession: function() {
			}
	};
};

var NS_OFFLINE_TOP = {
	
		init: function() {
			document.title += " - " + baseUser.USERNAME;
	
			NS_CONSOLEJS.addLogger({ name : 'OFFLINE', console : 0 });

			NS_OFFLINE_AUTH.init();

			/*NS_OFFLINE.init puo' funzionare in background nel frattempo*/
			NS_OFFLINE_AUTH.check();

			/*
			if (typeof home.AppStampa == "undefined") {
				var jnlp_href;
				if (typeof localStorage["AppStampa_jnlp_href"] != "undefined") {
					jnlp_href=localStorage["AppStampa_jnlp_href"];
				} else {
					jnlp_href="AppStampaEager.jnlp";
				}
				$("#stampa").append(NS_PRINT.getObjectHtml({jnlp_href: jnlp_href}));
			} else {
				NS_OFFLINE.setLocalStorage("AppStampa_jnlp_href", $("param[name=jnlp_href]", home.AppStampa).val());
			}
			*/
		},

		apri: function( key_legame , parametri_url) {
			
			key_legame || '';
			
			var 
				n_scheda	= ( $('.iScheda', 'body').length + 1 ),
				scheda		= $( document.createElement('iframe') ),
				height		= LIB.getHeight() - $("#divInfo").height();
			var  url = 'page?KEY_LEGAME=' + key_legame + "&UTENTE=" + baseUser.USERNAME + '#N_SCHEDA=' + n_scheda;
			if (LIB.isValid(parametri_url))
				url += "&" + parametri_url;
					
	        scheda.attr(
	    		 {
	    			'id':					'iScheda-' + n_scheda,
	    			'src':					url,
	    			'height':				height, /*non funziona, il css prende il sopravvento*/
	    			'allowTransparency':	'true'
	    		 }).addClass('iScheda').appendTo( 'body' );
	        
	        scheda.css({'height': height});
	                
	        NS_LOADING.showLoading();
			
		},
		
		confirm: function( msg, ifTrue, ifFalse ) {
			
			var defaults =  {
				'width':			'50%',
				'id': 				'dialogConfirm',
				'title':			'Richiesta di conferma',
				'showButtonClose':	false
			};
			
			var dialog = $.dialog( msg,
				$.extend( defaults, {
					'content': msg,
					'buttons': [{ 
						'label' : 'Si',
						'keycode' : "13",
						'classe'  : "butVerde",
						'action': function() {
							
							$.dialog.hide();
							
							if (typeof ifTrue === 'function')
								ifTrue();
							
							dialog.destroy();
						}
					}, { 
						'label' : 'No', 
						'action': function() {
							
							$.dialog.hide();
							
							if (typeof ifFalse === 'function')
								ifFalse();
							
							dialog.destroy();
						}
					}
					]
				})
			);
			
		}
};

var NS_OFFLINE_AUTH = {
		
		logged_in: false,
		
		init: function() {
			/*
			 * Non mi piace tantissimo 'sta cosa che abbiamo la password in chiaro nella pagina, spero cambi in futuro -.-
			 */
			NS_OFFLINE_AUTH.setUserPassword(baseUser.USERNAME, baseUser.PASSWORD);
			NS_OFFLINE_AUTH.addAvailableUser(baseUser.USERNAME);
		},
		
		getAvailableUsers: function() {
			var ar;
			try {
				ar = JSON.parse(localStorage["fenixMMG_availableUsers"]);
			} catch (e) {
				ar = {};
			}
			return ar;
		},
		
		addAvailableUser: function(user) {
			var au = NS_OFFLINE_AUTH.getAvailableUsers();
			au[user]=new Date().getTime();
			NS_OFFLINE.setLocalStorage("fenixMMG_availableUsers", JSON.stringify(au));
		},
		
		getUserPage: function(user) {
			return "page?KEY_LEGAME=OFFLINE&UTENTE=" + user;
		},
		
		getUserPageWithPasswordHash: function(user) {
			return NS_OFFLINE_AUTH.getUserPage(user) + "#" + NS_OFFLINE_AUTH.getUserPassword(user);
		},
		
		check_ok:function(){
			location.hash = "";
			console.log("login effettuato");
			NS_OFFLINE_AUTH.logged_in = true;
		},
		
		check_ko:function(){
			location.hash = "";
			home.NOTIFICA.error({
				message: ("Verificare i dati inseriti"),
				title: "Errore di autenticazione"
			});
			if ($("#dialogLogin").length == 0) {
				NS_OFFLINE_AUTH.check_showLogin();
			}
		},
		
		check_showLogin:function(){
			
			var utenti = "<label for='utentiOffline'>Scegli un utente:</label><select id='utentiOffline'>";
			for (u in NS_OFFLINE_AUTH.getAvailableUsers()) {
				utenti += "<option value='"+u+"' " + (u==baseUser.USERNAME ? "selected=true" : "") + ">" + u + "</option>";
			}
			utenti += "</select>";
			
			var input = "<label for='password'>Inserisci la password:</label><input name='password' id='password' type='password' />";
			
			var div = $("<div id='login_dialog' />").html(utenti + input);
			
			var dialog = $.dialog( div, {
				'id':               'dialogLogin',
				'title':            "Effettuare la login",
				'showBtnClose':     false,
				'width'	: 350,
				'buttons': [{
						'label' : 'Login',
						'keycode' : "13",
						'classe'  : "butVerde",
						'action' : function(context) {
							var user = $("select#utentiOffline option:selected").val();
							var password = $("input#password").val();
							if (NS_OFFLINE_AUTH.checkLogin(user, password)) {
								if (user==baseUser.USERNAME) {
									NS_OFFLINE_AUTH.check_ok();
									context.data.close();
									context.data.destroy();
								} else {
									location.replace(NS_OFFLINE_AUTH.getUserPageWithPasswordHash(user));
								}
								dialog.destroy();
							} else {
								NS_OFFLINE_AUTH.check_ko();
								dialog.destroy();
								dialog.init();
							}
						}
					}
				]
			});

			$('#password').on( 'keyup', function( event ) {
				if (event.keyCode == '13') {
					$("#dialog-btn_Login").click();
				}
			});
			
			$("#dialog-mask").css("opacity", "1");
		},
		
		check: function(){
			/*Richiesta autenticazione utente*/
			if (location.hash != "" && location.hash != "#") {
				if (location.hash == "#" + NS_OFFLINE_AUTH.getUserPassword(baseUser.USERNAME)) {
					NS_OFFLINE_AUTH.check_ok();
				} else {
					NS_OFFLINE_AUTH.check_ko();
				}
				return;
			}
			NS_OFFLINE_AUTH.check_showLogin();
		},
		
		setUserPassword:function(user, password) {
			NS_OFFLINE.setLocalStorage(user + "_PASSWORD_HASH",new String(CryptoJS.MD5(password)).toUpperCase());
		},
		
		getUserPassword:function(user) {
			return localStorage[user + "_PASSWORD_HASH"];
		},
		
		checkLogin: function(user, password) {
			return NS_OFFLINE_AUTH.getUserPassword(user) == new String(CryptoJS.MD5(password)).toUpperCase();
		}
};