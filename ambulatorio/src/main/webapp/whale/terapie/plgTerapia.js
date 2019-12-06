var IDEN_SCHEDA 		= null;
var IDEN_TERAPIA 		= null;
var IDEN_CONF_SCHEDA 	= null;
var PROCEDURA 			= null;
var IDEN_VISITA 		= null;
var IDEN_MODELLO 		= null;
var IDEN_CICLO 			= null;
var STATO_TERAPIA 		= null;
var IDEN_ANAG			= null;

var ID_SESSIONE = 0;

var PaginaAllerteVisualizzata = false;
var offset = 35;

function cerca_1ciclo_sostanza(iden_sostanza) {
	vTxt = iden_sostanza;
	$("#ricercaAlt").click();
}

function init() {
	utilCreaBoxAttesa();
	Events.set();

	if (typeof document.EXTERN.statoTerapia != 'undefined')
		STATO_TERAPIA = document.EXTERN.statoTerapia.value;
	if (typeof document.EXTERN.idenVisita != 'undefined')
		IDEN_VISITA = document.EXTERN.idenVisita.value;
	if (typeof document.EXTERN.idenAnag != 'undefined')
		IDEN_ANAG = document.EXTERN.idenAnag.value;		
	if (typeof document.EXTERN.idenScheda != 'undefined')
		IDEN_SCHEDA = document.EXTERN.idenScheda.value;
	if (typeof document.EXTERN.idenModello != 'undefined')
		IDEN_MODELLO = document.EXTERN.idenModello.value;
	if (typeof document.EXTERN.idenTerapia != 'undefined')
		IDEN_TERAPIA = document.EXTERN.idenTerapia.value;

	if (typeof document.EXTERN.PROCEDURA != 'undefined') {
		PROCEDURA = document.EXTERN.PROCEDURA.value;
		var descrScheda;
		switch (PROCEDURA) {
			case 'INSERIMENTO': 
				break;
			case 'MODELLO':
				descrScheda= document.EXTERN.descrModello.value;
			default:
				loadSchedaTerapia(descrScheda);
		}
		/*if (document.EXTERN.modality.value == 'I') {
			setDragDrop();
		}*/
	}
	
	if (STATO_TERAPIA == 'AMB1') {
		cerca_1ciclo_sostanza(document.EXTERN.IDEN_SOSTANZA.value);
	}
	
	if ($('div#boxTerapie').length>0){
		Events.adjustIframeHeigths();
	}
}

var Events = {
	set : function() {

		document.body.onselectstart = function() {
			return false;
		};
		document.body.onclick = function() {
			inserimento.removeMenu();
		};
		
		Events.setRadioEvents();
		Events.enableRicercaSelectStart();
		Events.setRadioConfSchedaClick();
		Events.setCmbTipoTerapia();
		Events.setApriChiudiBox();
		Events.setTipoTerapia();

	},

	setCmbTipoTerapia : function() {

		if (typeof document.EXTERN.TIPO_TERAPIA != 'undefined') {
			var val = document.EXTERN.TIPO_TERAPIA.value
			setTipoTerapia(val);
			$('span.tipiTerapie select option[value="' + val + '"]').attr("selected","selected");
		}
	},

	setRadioConfSchedaClick : function() {
		$('span.confScheda span').each(function() {
			var _this = $(this);
			_this.click(function() {
				insNuovaTerapia(_this.attr("iden_confScheda"));
			});
		});
	},

	setRadioEvents:function() {
		$("span.radio").click(function(){
			var _this = $(this);
			$("span[name="+_this.attr("name")+"]").removeClass("selected");
			_this.addClass("selected");
		});
	},

	enableRicercaSelectStart : function() {
		lst = document.all["txtRicerca"];
		if (typeof lst != 'undefined') {
			if (typeof lst.length == 'undefined') {
				lst.onselectstart = function() {
					event.cancelBubble = true;
				}
			} else {
				for ( var i = 0; i < lst.length; i++) {
					lst[i].onselectstart = function() {
						event.cancelBubble = true;
					}
				}
			}
		}
	},
	setApriChiudiBox : function() {
		$('div.toggle').click(function() {
			var span = $(this).find("span");
			if (span.hasClass("open")) {
				span.removeClass("open").addClass("close");
			} else {
				span.removeClass("close").addClass("open");
			}
			$(this).parent().find('div.inner').toggle(500, function() {
				switch(document.EXTERN.layout.value) {
				case 'V' :
					Events.adjustIframeHeigths();
					break;
				case 'O' :
					Events.adjustBoxWidths();
				}
			});
		});
	},
	adjustIframeHeigths:function() {
		var x = $('div#boxTerapie').position().top;
		var y = $('body').height();
		$('div.FramesContainer iframe').height(y - x - offset);
	},
	adjustBoxWidths:function() {
		if($('div#boxRicerca div.inner').is(":visible") && $('div#boxTerapie div.inner').is(":visible")) {
			$('div#boxTerapie').width("49.9%");
			$('div#boxRicerca').width("49.9%");
		} else if ($('div#boxRicerca div.inner').is(":visible")) {
			$('div#boxTerapie').width("10%");
			$('div#boxRicerca').width("90%");
		} else {
			$('div#boxTerapie').width("90%");
			$('div#boxRicerca').width("10%");
		}
	},
	setTipoTerapia : function() {
		$('span.tipiTerapie select').change(function() {
			$('span.confScheda span').hide();
			var tipo = $(this).find("option:selected").val();
			if(tipo!="") {
				setTipoTerapia(tipo);
			}
		});
	}
}

var Schede = {
	addFrame : function(pUrl, pDescrTab) {
		$('div.FramesContainer iframe').attr("id", "").hide();

		$(
				'<iframe id=\"SchedaTerapia\" src=\"' + pUrl + '&ID_SESSIONE='
						+ (++ID_SESSIONE)
						+ '\" frameBorder=\"0\" scrolling=\"yes\"></iframe>')
				.data("ID_SESSIONE", ID_SESSIONE).appendTo(
						'div.FramesContainer').height(
						$('body').height() - $('div#boxTerapie').position().top
								- offset);
		if (PROCEDURA != 'LETTURA')
			Schede.addTab(pDescrTab);
	},

	addTab : function(pDescrTab) {
		$('div.tabber div').removeClass('selected');

		var _tab = $('<div class="tab selected"><div>'
				+ (typeof pDescrTab != 'undefined' ? pDescrTab : '')
				+ '</div></div>');

		var _btn = $('<div class="btn">X</div>').click(Schede.BtnRemoveClick);

		_btn.appendTo(_tab);

		_tab.appendTo('div.tabber').click(Schede.TabClick);
	},

	TabClick : function() {
		var _this = $(this);
		$('div.tabber div').removeClass('selected');
		_this.addClass('selected');
		$('div.FramesContainer iframe').hide().attr("id", "");
		$('div.FramesContainer iframe:eq(' + _this.index('div.tab') + ')')
				.show().attr("id", "SchedaTerapia");
	},

	BtnRemoveClick : function() {
		try {
			var _idx = $(this).index('div.tab div.btn');
			var _frame = $('div.FramesContainer iframe:eq(' + _idx + ')');
			removeFromSession(_frame.data("ID_SESSIONE"));
			_frame.remove();
			$('div.tab:eq(' + _idx + ')').remove();

			$('div.tab:eq(0)').click();

			function removeFromSession(IdSessione) {
				var win = document.getElementById("SchedaTerapia").contentWindow;
				win.dwr.engine.setAsync(false);
				win.Terapia.removeSessionObject($(
						'div.FramesContainer iframe:eq(' + _idx + ')').data(
						"ID_SESSIONE"));
				win.dwr.engine.setAsync(true);
			};
		} catch (e) {
			alert(e.description);
		}
	}
}

function loadSchedaTerapia(pDescrTab) {

	var url = '';
	try {
		switch (PROCEDURA) {
		case 'MODIFICA':
			url = "SchedaTerapia?IDEN_VISITA=" + IDEN_VISITA + "&IDEN_SCHEDA="
					+ IDEN_SCHEDA + "&STATO=CONFERMATA";
			break;
		case 'DUPLICA':
			url = "SchedaTerapia?IDEN_VISITA=" + IDEN_VISITA + "&IDEN_SCHEDA="
					+ IDEN_SCHEDA + "&STATO=DUPLICA";
			IDEN_SCHEDA = null;
			break;
		case 'LETTURA':
			url = "SchedaTerapia?IDEN_VISITA=" + IDEN_VISITA + "&IDEN_SCHEDA="
					+ IDEN_SCHEDA + "&STATO=LETTURA";
			break;
		case 'MODELLO':
			url = "SchedaTerapia?IDEN_VISITA=" + IDEN_VISITA + "&IDEN_MODELLO="
					+ IDEN_MODELLO + "&STATO=MODELLO";
			break;
		case 'INSERIMENTO':
			url = "SchedaTerapia?IDEN_VISITA=" + IDEN_VISITA
					+ "&IDEN_CONF_SCHEDA=" + IDEN_CONF_SCHEDA + "&STATO=BOZZA";
			break;
		case 'ANNULLAMENTO':
			url = "SchedaTerapia?IDEN_VISITA=" + IDEN_VISITA + "&IDEN_TERAPIA="
					+ IDEN_TERAPIA + "&IDEN_SCHEDA=" + IDEN_SCHEDA
					+ "&STATO=ANNULLACONFERMA";
			break;
		default:
			return;
			break;
		}

		Schede.addFrame(url, pDescrTab);

	} catch (e) {
		alert(e.description);
	}
}

function loadCiclo(obj) {

	var wkCicli = document.getElementById("wkSearchFarmaci").contentWindow;
	do {
		obj = obj.parentNode;
	} while (obj.nodeName != 'TR' && obj.nodeName != 'tr')
	var idx = obj = obj.sectionRowIndex;

	if (checkAllerte()) {

		top.utilMostraBoxAttesa(true);

		var url = 'servletGeneric?class=cartellaclinica.gestioneTerapia.CicloTerapia';
		url += '&Procedura=INSERIMENTO';
		url += '&IDEN_CICLO=' + wkCicli.array_iden[idx];
		url += '&idenAnag=' + IDEN_ANAG;
		url += '&idenVisita=' + IDEN_VISITA;		
		url += '&reparto=' + document.EXTERN.reparto.value;
		
		document.location.replace(url);
	}
}

function loadModello(obj) {
	try {
		var wkModelli = document.getElementById("wkSearchFarmaci").contentWindow;

		wkModelli.event.cancelBubble = true;

		do {
			obj = obj.parentNode;
		} while (obj.nodeName != 'TR' && obj.nodeName != 'tr')
		var idx = obj = obj.sectionRowIndex;
		var bool = false;

		for ( var i = 0; i < wkModelli.vettore_indici_sel.length; i++) {
			if (wkModelli.vettore_indici_sel[i] == idx) {
				bool = true;
				break;
			}
		}
		if (!bool) {
			wkModelli.illumina_multiplo_generica(idx);
		}

		if (wkModelli.vettore_indici_sel.length == 0) {
			alert('Effettuare una selezione');
			return;
		}

		if (checkAllerte()) {
			for ( var i = 0; i < wkModelli.vettore_indici_sel.length; i++) {
				IDEN_MODELLO = wkModelli.array_iden[wkModelli.vettore_indici_sel[i]];
				PROCEDURA = 'MODELLO';
				// alert(i + '\n' + IDEN_MODELLO + '\n'
				// +wkModelli.array_descrizione[wkModelli.vettore_indici_sel[i]]
				// )
				loadSchedaTerapia(wkModelli.array_descrizione[wkModelli.vettore_indici_sel[i]]);
			}
		}

		for ( var i = 0; i < wkModelli.vettore_indici_sel.length; i++) {
			wkModelli
					.illumina_multiplo_generica(wkModelli.vettore_indici_sel[i]);
		}

	} catch (e) {
		alert(e.description);
	}
}


function insNuovaTerapia(iden_confScheda) {
	try {
		var DescrTab = $('span.tipiTerapie option:selected').text()
				+ $('label[for=' + iden_confScheda + ']').text();
		attesa(true);
		var allerte;

		if (PaginaAllerteVisualizzata) {
			allerte = "S";
		} else {

			var url = "avviso?";
			url += "nomeSP=CC_AVVISI_PRE_TERAPIA";
			url += "&origine=AVVISI_PRE_TERAPIA";
			url += "&1=NUMBER@" + IDEN_ANAG//document.EXTERN.idenAnag.value;
			allerte = window.showModalDialog(url, null,
					"dialogHeight:500px;dialogWidth:800px");

			PaginaAllerteVisualizzata = true;
		}

		// if (allerte =='S')
		if (checkAllerte()) {
			PROCEDURA = 'INSERIMENTO';
			IDEN_VISITA = document.EXTERN.idenVisita.value;
			IDEN_CONF_SCHEDA = iden_confScheda;
			loadSchedaTerapia(DescrTab);
		} else {
			attesa(false);
		}
	} catch (e) {
		alert(e.description);
	}
}

function checkAllerte() {
	var allerte;

	if (PaginaAllerteVisualizzata)
		return true;

	var url = "avviso?";
	url += "nomeSP=CC_AVVISI_PRE_TERAPIA";
	url += "&origine=AVVISI_PRE_TERAPIA";
	url += "&1=NUMBER@" + IDEN_ANAG//document.EXTERN.idenAnag.value;
	allerte = window.showModalDialog(url, null,
			"dialogHeight:500px;dialogWidth:800px")

	PaginaAllerteVisualizzata = true;

	return (allerte == 'S');
}

function registra(pTipoRegistrazione) {

	if (document.getElementById('SchedaTerapia') == null) {
		alert('Nessuna terapia confermabile');
		return;
	}

	var callBackOk, callBackKo;

	switch (document.EXTERN.statoTerapia.value) {
	case 'A':
		callBackKo = null;
		callBackOk = function(iden) {
			parent.ANAMNESI.setWkTerapie(iden);
			alert('Terapia importata correttamente');
			$('div.selected div.btn').click();
		}
		break;
	case 'P':
		callBackKo = null;
		switch (PROCEDURA) {
		case 'MODIFICA':
			callBackOk = function(iden) {
				parent.aggiornaPianoGiornaliero(0);
				chiudi();
			};
			break;
		}
		break;
	case 'I':
		callBackKo = null;

		switch (pTipoRegistrazione) {
		case 'conferma':

			switch (PROCEDURA) {
			default:
				callBackOk = function(iden) {
					$('div.selected div.btn').click();
					var vFrame = document.getElementById("SchedaTerapia");

					if ((typeof vFrame != 'undefined') && vFrame != null) {
						registra(pTipoRegistrazione);
					}
				};
				break;
			}
			break;

		case 'modello':

			callBackOk = function(iden) {
				var url = "servletGeneric?class=generic.ParoleChiave.SchedaCategorie" +
						"&TABELLA=CC_TERAPIE_MODELLI" +
						"&IDEN_TABELLA="+ iden +
						"&CAMPO_DESCRIZIONE=DESCRIZIONE" +
						"&VALORE_DESCRIZIONE=" + $("div.tab.selected div:first").text() +
						"&CAMPO_REPARTO=CODICE_REPARTO" +
						"&VALORE_REPARTO=" +  document.EXTERN.reparto.value +
						"&AMBITI=PRESCRIZIONE_STD" +
						"&CHECK=terapie.xml:prescrizioniStd.check:Descrizione già presente per il reparto" +
						"&DELETE=S" +
						"&TYPE=RADIO";
				$.fancybox({
					'padding' : 3,
					'width' : 480,
					'height' : 300,
					'href' : url,
					'onCleanup' : function() {if (document.EXTERN.PROCEDURA.value=='MODELLO') {
						parent.$.fancybox.close();} else {
							refreshWkSearchFarmaci();
						}
					},
					'type' : 'iframe'
				});
			}
			callBackKo = function(iden) {
				alert('Errore nel salvataggio del modello');
			}
			break;

		case 'ciclo':
			/*if (!cicli.checkTipoPrescrizione(pTipoRegistrazione))
				return;*/

			callBackOk = function(pIdenScheda, pIdenTerapia, pIdenCiclo) {
				IDEN_CICLO = pIdenCiclo;
				$('div.selected div.btn').click();
				var vFrame = document.getElementById("SchedaTerapia");

				if ((typeof vFrame != 'undefined') && vFrame != null) {
					registra(pTipoRegistrazione);
				} else {
					var url = 'servletGeneric?class=generic.ParoleChiave.SchedaCategorie'
							+ '&TABELLA=CC_TERAPIE_CICLO_MODELLI&IDEN_TABELLA='+ pIdenCiclo
							+ '&CAMPO_DESCRIZIONE=DESCRIZIONE&AMBITI=&IDEN_ASSOCIATI='
							+ '&CAMPO_IMPOSTAZIONI=IMPOSTAZIONI'
							+ '&PAGE_IMPOSTAZIONI=modalUtility/ImpostazioniCiclo.html'
							+ '&SELEZIONE_OBBLIGATORIA=N';
					$.fancybox({
						'padding' : 3,
						'width' : '75%',
						'height' : 300,
						'href' : url,
						'type' : 'iframe'
					});
				}
			};
			callBackKo = function(iden, iden_ciclo) {
				alert('Errore nel salvataggio del ciclo');
			}
			break;
		default:
			callBackOk = null;
			break;
		}

		break;
	default:
		break;
	}
	try {
		document.getElementById("SchedaTerapia").contentWindow.salva(
				pTipoRegistrazione, IDEN_SCHEDA, $('iframe#SchedaTerapia')
						.data("ID_SESSIONE"), null, callBackOk, callBackKo);
	} catch (e) {
		alert(e.description);
	}
}

function refreshWkSearchFarmaci() { 
	if ($("input#ricercaModelli:checked").length>0){
		$('iframe#wkSearchFarmaci').attr("src",$('iframe#wkSearchFarmaci').attr("src"));
	} 
}

function chiudi() {

	switch (document.EXTERN.statoTerapia.value) {
	case 'I':
		switch (PROCEDURA) {
		case 'LETTURA':
		case 'MODIFICA':
			break;
		case 'INSERIMENTO':
		case 'DUPLICA':
			try {
				parent.chiudiPlgTerapia();
			} catch (e) {/* in anamnesi non deve fare nulla */
			}
			break;
		default:
		}
		break;
	case 'R':
		parent.document.getElementById('frameFarmaci').style.display = 'none';
		parent.parent.document.getElementById('scheda').height = parent.parent.document
				.getElementById('scheda').height
				- parent.document.getElementById('frameFarmaci').height;

		break;
	default:
		self.close();
		break;
	}
	parent.$.fancybox.close();
}

function aggiungiFarmaco(obj) {

	var wkFarmaci = document.getElementById("wkSearchFarmaci").contentWindow;

	while (obj.nodeName != 'TR' && obj.nodeName != 'tr') {
		obj = obj.parentNode;
	}

	switch (document.EXTERN.statoTerapia.value) {
	case 'L':
	case 'AMB':
		parent.nuovaTerapia(wkFarmaci.array_descrizione[obj.sectionRowIndex],
				wkFarmaci.array_iden_farmaco[obj.sectionRowIndex],
				wkFarmaci.array_primo_ciclo[obj.sectionRowIndex],
				wkFarmaci.array_cod_dec[obj.sectionRowIndex],
				wkFarmaci.array_id_sos[obj.sectionRowIndex], '', '', 1, '',
				this.window);
		break;
	case 'AMB1':
		parent.sostituisciFarmaco(
				wkFarmaci.array_descrizione[obj.sectionRowIndex],
				wkFarmaci.array_iden_farmaco[obj.sectionRowIndex],
				wkFarmaci.array_cod_dec[obj.sectionRowIndex]
		);
		break;
	case 'A':
	case 'I':
		switch (PROCEDURA) {
		case 'MODIFICA':
		case 'LETTURA':
			alert('Modifica non disponibile per la terapia');
			return;
			break;
		default:
			break;
		}
		if (document.getElementById('SchedaTerapia') == null) {
			alert('Inserire una terapia prima di un farmaco');
			return;
		}
		inserimento.createMenu(
				wkFarmaci.array_iden_farmaco[obj.sectionRowIndex],
				wkFarmaci.event.clientX, wkFarmaci.event.clientY);
		break;

	case 'R':
		var oOption = document.createElement("Option");
		oOption.text = wkFarmaci.array_descrizione[obj.sectionRowIndex];
		oOption.value = wkFarmaci.array_iden_farmaco[obj.sectionRowIndex];
		parent.document.all['elencoFarmaci'].add(oOption);
		parent.aggiornaInputValue('elencoFarmaci', 'hFarmaci');
		break;
	}
}

var inserimento = {

	menu : null,
	SchedaTerapia : null,
	IdSessione : null,

	autoInsert : function() {
		inserimento.createMenu();

		for ( var i = 0; i < inserimento.menu.childNodes.length; i++) {
			if (inserimento.check(inserimento.menu.childNodes[i])) {
				inserimento.doInsert();
				return;
			}
		}
	},

	insert : function(selection) {
		if (inserimento.check(selection)) {
			inserimento.doInsert(selection);
		}
		inserimento.removeMenu();
	},

	doInsert : function(selection) {
		inserimento.SchedaTerapia.farmaci.setFarmaco(selection);
		inserimento.removeMenu();
	},

	createMenu : function(pIdenFarmaco, x, y) {
		try {
			// if(inserimento.SchedaTerapia==null)
			inserimento.SchedaTerapia = document
					.getElementById("SchedaTerapia").contentWindow;
			inserimento.IdSessione = $('iframe#SchedaTerapia').data(
					"ID_SESSIONE");

			if (inserimento.menu != null)
				inserimento.removeMenu();

			var lst = inserimento.getLstGruppiFarmaci();

			inserimento.menu = document.createElement('div');
			inserimento.menu.className = "menu";

			var voce;
			for ( var i = 0; i < lst.length; i++) {
				voce = document.createElement('div');
				voce.innerText = lst[i].Text;

				voce.tipo = lst[i].tipo;
				voce.Min = lst[i].Min;
				voce.Max = lst[i].Max;
				voce.Current = lst[i].Current;

				voce.iden_farmaco = pIdenFarmaco;
				voce.IdSessione = inserimento.IdSessione;

				voce.onclick = function() {
					inserimento.insert(this);
				}

				inserimento.menu.appendChild(voce);

				if (lst.length == 1) {
					inserimento.insert(voce);
					return;
				}
			}

			if (lst.length > 0) {
				inserimento.menu.style.position = 'absolute';
				inserimento.menu.style.zIndex = '99';
				document.body.appendChild(inserimento.menu);

				inserimento.menu.style.top = (y + 75) + 'px';
				inserimento.menu.style.left = (x + 10) + 'px';
			}

		} catch (e) {
			alert(e.description);
		}

	},

	getLstGruppiFarmaci : function() {
		try {
			var lst = SchedaTerapia.farmaci.getGruppi();
		} catch (e) {
			alert('Nessuna terapia disponibilie');
			return new Array();
		}
		return lst;
	},

	getIdenFarmaci : function() {
		return SchedaTerapia.farmaci.getIdenFarmaci();
	},

	check : function(selection) {
		if (selection.Current >= selection.Max) {
			alert('Impossibile aggiungere un ulteriore farmaco');
			return false;
		}

		var lst = inserimento.getIdenFarmaci();

		for (i = 0; i < lst.length; i++) {

			if (selection.iden_farmaco == lst[i]) {
				alert('Farmaco già aggiunto alla terapia');
				return false;
			}

		}

		return true;

	},

	removeMenu : function() {
		if (inserimento.menu != null)
			inserimento.menu.removeNode(true);
	}
}

var cicli = {

	checkPreRegistrazione : function() {

		resp = true;
		try {
			$('div.FramesContainer iframe')
					.each(
							function(i) {
								if(!resp)return;
								//alert(i)
								if ($(this)[0].contentWindow.$(
										'[name="TipoPrescrizione"]').attr(
										"value") != '5'){
									resp = false;
									$('div.tabber div.tab:eq('+i+')').click();
									return alert('Una terapia inserita non è prescrivibile ciclicamente, impossibile procedere');
								}
								
								var controllo = $(this)[0].contentWindow.checkValidita('ciclo');
								if(!controllo.check){
									resp = false;
									$('div.tabber div.tab:eq('+i+')').click();
									return alert(controllo.msg);
								}
							});			

			return resp;
		} catch (e) {
			alert(e.description);
			return false;
		}
	},
	
	registra:function(){
		if(cicli.checkPreRegistrazione()){
			$('div.tabber div.tab:eq(0)').click();
			registra('ciclo');
		}
	}

};

function attesa(bool) {
	try {
		utilMostraBoxAttesa(false);
	} catch (e) {/**/
	}
}