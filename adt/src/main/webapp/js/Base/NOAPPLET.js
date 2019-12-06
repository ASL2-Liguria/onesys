/*
 * Javascript Work in progress per sostituire l'applet con chiamate XMLHttpRequest (di default sincrone)
 * a un servizio locale (l'applet lanciata come applicazione stand alone).
 * 
 * Verificato:
 * -hostname
 * -lista stampanti
 * -stampa
 * 
 * Mancano/da verificare:
 * -verifica che codeBase e documentBase funzionino
 * -anteprima di stampa (che sara' da fare nella finestra a parte?)
 * 
 * Richiesta applet versione 2.2.0 per modalita' NOAPPLET
 */
var APPSTAMPA = {
	
	loaded: $.Deferred(),
	
	CONFIG: {
		ACTIVEMQ: {},
		APPLET: {}, /*possibili piu' configurazioni qua dentro a seconda del KEY_LEGAME, con fallback su default*/
		GLOBAL: {},
		NOAPPLET: {}
	},
	
	parse: function(jdField) {
		var config_source = null;
		/*per debug*/
		if (typeof baseUser != "undefined" && typeof baseUser["APPSTAMPA_" + jdField] != "undefined") {
			config_source = baseUser;
		}
		/*MAIN_PAGE e ovunque su Whale/UniSys*/
		if (config_source == null && typeof baseGlobal != "undefined" && typeof baseGlobal["APPSTAMPA_" + jdField] != "undefined") {
			config_source = baseGlobal;
		}
		/*In LOGIN_PAGE non esiste baseGlobal*/
		if (config_source == null && typeof jsonData != "undefined" && typeof jsonData["APPSTAMPA_" + jdField] != "undefined") {
			config_source = jsonData;
		}
		if (config_source != null) {
			try {
				APPSTAMPA.CONFIG[jdField] = JSON.parse(config_source["APPSTAMPA_" + jdField]);
			} catch (e) {
				console.error(jdField, e);
				APPSTAMPA.CONFIG[jdField] = {};
			}
		}
	},
	
	init: function() {
		for (c in APPSTAMPA.CONFIG) {
			APPSTAMPA.parse(c);
		}
	},
	
	getAppConfig: function(modalita) {
		var app_config = APPSTAMPA.CONFIG[modalita][$("#KEY_LEGAME")];
		if (typeof app_config == "undefined") {
			app_config = APPSTAMPA.CONFIG[modalita].DEFAULT;
		}
		if (typeof session_id != "undefined") {
			app_config.session_id = session_id;
		}
		return app_config;
	},
	
	getParamSingleUse: function(options, param, def) {
		var ritorno = options[param];
		if (typeof ritorno == "undefined") {
			return def[param];
		} else {
			delete options[param];
			return ritorno;
		}
	},
	
	/**
	 * @param {type} options - Richiesto uno tra jnlp_href e archive
	 * @returns {String}
	 */
	getObjectHtml: function(options) {
		var def = {
			code: "it.elco.applet.elcoApplet",
			height: "0px",
			width: "0px",
			name: "AppStampa",
			id: "AppStampa",
			loadFirma: false,
			loadSCL: false,
			loadStampe: false,
			SCLclass: "it.elco.applet.smartCard.login.LoggedCardListener",
			ShowMediaTrays: "S"
		};
		if (typeof options == "undefined")
			options = {};
		var ritorno = '<object height="' + APPSTAMPA.getParamSingleUse(options,'height',def) + '" name="' + APPSTAMPA.getParamSingleUse(options,'name',def) + '" width="' +  APPSTAMPA.getParamSingleUse(options,'width',def) + '" type="application/x-java-applet" id="' +  APPSTAMPA.getParamSingleUse(options,'id',def) + '">';
		ritorno += '<param name="loadStampe" value="' +  APPSTAMPA.getParamSingleUse(options,'loadStampe',def) + '"/>';
		ritorno += '<param name="SCLclass" value="' + APPSTAMPA.getParamSingleUse(options,'SCLclass',def) + '"/>';
		ritorno += '<param name="code" value="' + APPSTAMPA.getParamSingleUse(options,'code',def) + '"/>';
		if (typeof options.jnlp_href == "undefined") {
			ritorno += '<param name="archive" value="app/SignedFenixApplet.jar"/>';
		} else {
			ritorno += '<param name="jnlp_href" value="' + APPSTAMPA.getParamSingleUse(options, 'jnlp_href', def) + '"/>';
		}
		ritorno += '<param name="wmode" value="transparent"/>';
		ritorno += '<param name="initial_focus" value="false"/>';
		ritorno += '<param name="loadFirma" value="' + APPSTAMPA.getParamSingleUse(options,'loadFirma',def) + '"/>';
		ritorno += '<param name="loadSCL" value="' + APPSTAMPA.getParamSingleUse(options,'loadSCL',def) + '"/>';
		ritorno += '<param name="ShowMediaTrays" value="' + APPSTAMPA.getParamSingleUse(options,'ShowMediaTrays',def) + '"/>';
		ritorno += '<param name="java_status_events" value="true"/>';
		for (var o in options) {
			ritorno += '<param name="' + o + '" value="' + options[o] + '"/>';
		};
		ritorno += '</object>';
		return ritorno;
	},
	
	getJnlpLink: function(options) {
		var a = $(document.createElement("a"));
		a.attr("href", options.jnlp_href);
		a.text("Avvia modulo di stampa");
		a.on("click", function() {
			var intervallo = window.setInterval(function() {
				AppStampa._ping({
					onload: function(){
						$("#appstampa_show_download_alert").remove();
						window.clearInterval(intervallo);
						AppStampa.init_params();
					},
					onerror: function(e){
						console.error(e);
					}
				});
			}, 3000);
		});
		var d = $(document.createElement("div"));
		d.append(a);
		d.css({
			'position': 'absolute',
			'top':'0',
			'right':'0',
			'background-color': 'white',
			'color': 'blue',
			'font-weight': 'bold',
			'padding': '0.5em'
		});
		d.attr("id", "appstampa_show_download_alert");
		return d;
	}
};

var NOAPPLET = false;
APPSTAMPA.init();
var session_id = $("#AppStampa param[name=session_id]").val();
switch (APPSTAMPA.CONFIG.GLOBAL.MODALITA) {
case "NOAPPLET":
	NOAPPLET = true;
	AppStampa = {
		_last_response: null,
		_last_response_json: null,
		_websocket: null,
		_initialized: false,
		
		init_params: function() {
			if (!AppStampa._initialized) {
				for (var par in AppStampa._config) {
					AppStampa._setParameter(par, AppStampa._config[par]);
				}
				AppStampa._start();
				AppStampa._initialized = true;
			}
		},
		
		init_websocket: function(service_url) {
			if (this._websocket == null) {
				this._websocket = new WebSocket(service_url);
				this._websocket.onerror = this._show_download_alert;
				this._websocket.onmessage = function(msg) {
					console.log("onmessage", msg); /*TODO*/
				};
			}
		},
		
		_show_download_alert: function() {
			if ($("#appstampa_show_download_alert").length == 0) {
				$("body").append(APPSTAMPA.getJnlpLink(APPSTAMPA.getAppConfig("NOAPPLET")));
			}
		},
		
		_ping: function(callback) {
			var service_url = "127.0.0.1:" + AppStampa._config["noapplet.server_port"];
			switch(AppStampa._config["noapplet.modalita"]) {
			case "websocket":
				this.init_websocket("ws://" + service_url);
				break;
			case "http":
				var xhr = new XMLHttpRequest();
				xhr.open("GET","http://" + service_url, false);
				xhr.setRequestHeader("Content-Type","text/plain");
				try {
					xhr.onerror = callback.onerror;
					xhr.onload = callback.onload;
					xhr.send();
				} catch(e) {
					console.error(e);
					callback.onerror();
				}
			}
		},

		_call: function(metodo, parametri, async, applet) {
			if (typeof async == "undefined") {
				async = false;
			}
			if (typeof applet == "undefined") {
				applet = true;
			}
			var service_url = "127.0.0.1:" + AppStampa._config["noapplet.server_port"];
			var call = this._getCallHttp(metodo, parametri, applet);;
			switch(AppStampa._config["noapplet.modalita"]) {
			case "websocket":
				this.init_websocket("ws://" + service_url);
				this._websocket.send(call);
				break;
			case "http":
			default:
				var xhr = new XMLHttpRequest();
				xhr.open("GET", "http://" + service_url + "/?" + call, async);
				xhr.setRequestHeader("Content-Type","text/plain");
				try {
					xhr.send();
					this._last_response = xhr.responseText;
					this._last_response_json = JSON.parse(this._last_response)[0][metodo];
				} catch (e) {
					console.error(e);
					AppStampa._ping({
						onerror: AppStampa._show_download_alert,
						onload: AppStampa._init_params
					});
				}
				break;
			}
			return this._last_response_json;
		},

		_getCallHttp: function (metodo, parametri, applet) {
			if (typeof applet == "undefined") {
				applet = true;
			}
			var parametri_str = "";
			for (var i=0; i< parametri.length; i++) {
				if (parametri_str.length > 0) {
					parametri_str += ",";
				}
				switch (typeof parametri[i]) {
				case "boolean":
				case "number":
					parametri_str += encodeURIComponent(parametri[i]);
					break;
				case "object":
					parametri_str += encodeURIComponent(JSON.stringify(parametri[i]));
					break;
				case "string":
				default:
					parametri_str += '\'' + encodeURIComponent(parametri[i]) + '\'';
					break;
				}
			}
			var call = '{"methods":[{"' + metodo + '":[' + parametri_str + ']}]}';
			if (applet) {
				return "call=" + call;
			} else {
				return "call_noapplet=" + call;
			}
		},

		_setVisible: function(boo) {
			this._call("setVisibleAOT", [boo], true, false);
		},

		_setBounds: function(pox_x, pox_y, size_x, size_y) {
			this._call("setBounds", [pox_x, pox_y, size_x, size_y], true, false);
		},
		
		_setParameter: function(parametro, valore) {
			this._call("setParameter", [parametro, valore], true, false);
		},
		
		_start: function() {
			this._call("start", [], false, false);
		},

		AMQReceive: function(_topic, _filter, _clientId) {
			this._call("AMQReceive", [_topic, _filter, _clientId], true);
		},

		clearDirectory: function(path) {
			this._call("clearDirectory", [path]);
		},

		executeProgram: function(path, application) {
			return this._call("executeProgram", [path, application]);
		},

		/*int*/
		executeSound: function(track) {
			this._call("executeSound", [track]);
		},

		/*JSONObject*/
		FirmaP7m: function(pin) {
			return this._call("FirmaP7m",[pin]);
		},

		FirmaPdf: function(pin) {
			this._call("FirmaPdf",[pin]);
		},

		FirmaXml: function(pin) {
			this._call("FirmaXml",[pin]);
		},

		getBase64_Documento: function() {
			return this._call("getBase64_Documento", []);
		},

		getBase64fromFile: function(PathFile) {
			return this._call("getBase64fromFile", [PathFile]);
		},

		/*byte[]*/
		getByteArray_Documento: function() {
			return this._call("getByteArray_Documento", []);
		},

		GetCanonicalHostname: function() {
			return this._call("GetCanonicalHostname", []);
		},

		getDefaultPrinterName: function() {
			return this._call("getDefaultPrinterName", []);
		},

		/*byte[]*/
		getDocument: function() {
			return this._call("getDocument", []);
		},
		
		getDocumentPlainText: function() {
			return this._call("getDocumentPlainText", []);
		},

		/*JSONObject*/
		getInfoPdfFirmato: function() {
			return this._call("getInfoPdfFirmato",[]);
		},

		/*JSONObject*/
		getJSONMsgProp: function(_proprieta, _coda, _clientID, _filter) {
			return this._call("getJSONMsgProp",[_proprieta, _coda, _clientID, _filter]);
		},

		GetLocalHostname: function() {
			return this._call("GetLocalHostname",[]);
		},

		GetLocalIp: function() {
			return this._call("GetLocalIp",[]);
		},

		getMD5_Documento: function() {
			return this._call("getMD5_Documento",[]);
		},

		getMD5fromFile: function(PathFile) {
			return this._call("getMD5fromFile",[PathFile]);
		},

		getNPagine: function() {
			return this._call("getNPagine",[]);
		},

		/*int*/
		getPageCount: function() {
			return this._call("getPageCount",[]);
		},

		getPrinterList: function() {
			return this._call("getPrinterList", []);
		},

		getScannerList: function(dllPath) {
			return this._call("getScannerList", [dllPath]);
		},

		getScreenResolution: function() {
			return this._call("getScreenResolution", []);
		},

		getSmartCardID: function(provider_path) {
			return this._call("getSmartCardID", [provider_path]);
		},

		getSystemInfo: function() {
			return this._call("getSystemInfo", []);
		},

		getTmpPath: function() {
			return this._call("getTmpPath", []);
		},

		imageCapture: function(setPartImage, addImage, maxWidth, maxHeight) {
			if (typeof maxWidth == "undefined" || maxWidth == null) {
				maxWidth = "";
			}
			if (typeof maxHeight == "undefined" || maxHeight == null) {
				maxHeight = "";
			}
			this._call("imageCapture", [setPartImage, addImage, maxWidth, maxHeight]);
		},

		InviaMessaggio: function(_coda, _messaggio, _ttl, _priority, _properties) {
			this._call("InviaMessaggio", [_coda, _messaggio, _ttl, _priority, _properties], true);
		},

		PageDown: function() {
			this._call("PageDown", []);
		},

		PageUp: function() {
			this._call("PageUp", []);
		},

		/*Ha senso passare dall'applet?*/
		postCall: function(url, content_type, body) {
			return this._call("postCall", [url, content_type, body]);
		},

		PrimaPagina: function() {
			this._call("PrimaPagina", []);
		},

		print: function(stampante, opzioni) {
			return this._call("print",[stampante, opzioni]);
		},

		printOn: function(param, nativo) {
			this._call("printOn",[param, nativo]);
		},

		reportError: function(_message, _priority) {
			this._call("reportError",[_message, _priority]);
		},

		/*qualche dubbio che funzioni*/
		runThread: function(metodo, parametri) {
			this._call("runThread",[metodo, parametri]);
		},

		RuotaAntiOrario: function() {
			this._call("RuotaAntiOrario", []);
		},

		RuotaOrario: function() {
			this._call("RuotaOrario", []);
		},

		/*JSONObject*/
		salvaSuFile: function(defaultFilename) {
			return this._call("salvaSuFile",[defaultFilename]);
		},

		scan: function(Scanner, dllPath, param, url, fileName, IdenAnag) {
			return this._call("scan",[Scanner, dllPath, param, url, fileName, IdenAnag]);
		},
		
		scanAndReturn: function(scanner, dllPath, methods) {
			return this._call("scanAndReturn",[scanner, dllPath, methods]);
		},

		scanGeneric: function(scanner, dllPath, url, postParams, methods) {
			return this._call("scanGeneric",[scanner, dllPath, url, postParams, methods]);
		},

		setLogDebug: function() {
			this._call("setLogDebug", []);
		},

		setLogError: function() {
			this._call("setLogError", []);
		},

		setLogInfo: function() {
			this._call("setLogInfo", []);
		},

		/*qualche dubbio che funzioni*/
		setMQPdf: function(pdf) {
			this._call("setMQPdf", [pdf]);
		},

		setNCopie: function(n_copie) {
			this._call("setNCopie", [n_copie]);
		},

		setPagina: function(nPagina) {
			this._call("setPagina", [nPagina]);
		},

		setSrcFromDataUrl: function (url) {
			this._call("setSrcFromDataUrl",[url]);
		},

		setSrcFromFile: function (PathFile) {
			this._call("setSrcFromFile",[PathFile]);
		},

		setSrcFromUrl: function(url) {
			return this._call("setSrcFromUrl",[url]);
		},

		SetTimeoutDownloadPdf: function (TimeOutDownPdf) {
			return this._call("SetTimeoutDownloadPdf",[TimeOutDownPdf]);
		},

		setZoom: function(inZoom) {
			if (typeof inZoom == "undefined" || inZoom == null) {
				inZoom = 100.0;
			}
			this._call("setZoom",[inZoom]);
		},

		UltimaPagina: function() {
			this._call("UltimaPagina",[]);
		},

		ZoomIn: function(inZoom) {
			if (typeof inZoom == "undefined" || inZoom == null) {
				inZoom = 10.0;
			}
			this._call("ZoomIn",[inZoom]);
		},

		ZoomOut: function(OutZoom) {
			if (typeof OutZoom == "undefined" || OutZoom == null) {
				OutZoom = 10.0;
			}
			this._call("ZoomOut",[OutZoom]);
		}

	};
	
	AppStampa._config = APPSTAMPA.getAppConfig("NOAPPLET");
	AppStampa._ping({
		onerror: AppStampa._show_download_alert,
		onload: AppStampa._init_params
	});
	APPSTAMPA.loaded.resolve();
	break;
case "APPLET":
default:
	var app_config = APPSTAMPA.getAppConfig("APPLET");
	//window.setTimeout(function() {
	$("#AppStampa").replaceWith(APPSTAMPA.getObjectHtml(app_config));
	//}, 0);
	if (typeof AppStampa.status != "undefined") { /*Java >= 7*/
		AppStampa.onLoad(function() {
			APPSTAMPA.loaded.resolve();
		});
	} else { /* Java 6 */
		APPSTAMPA.loaded.resolve();
	}
	break;
}
