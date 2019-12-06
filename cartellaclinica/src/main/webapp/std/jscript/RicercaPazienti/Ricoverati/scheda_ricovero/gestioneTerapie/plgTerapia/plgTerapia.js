var IDEN_SCHEDA 		= null;
var IDEN_TERAPIA 		= null;
var IDEN_CONF_SCHEDA 	= null;
var PROCEDURA 			= null;
var IDEN_VISITA 		= null;
var IDEN_MODELLO 		= null;
var IDEN_CICLO 			= null;
var STATO_TERAPIA 		= null;
var IDEN_ANAG			= null;
var IDEN_PARENT			= null;

var ID_SESSIONE = 0;

var PaginaAllerteVisualizzata = false;
var offset = 35;
var WindowCartella = null;

var flgDelTerapieCiclo =true; // flag per cancellare le terapie del ciclo e poi inserirle
var flgCreaPacchettoStd =false; // flag per creare un pacchetto di prescrizioni std
var NUMERO_CICLO=null;
var INTERVALLO_CICLI=null;
var GIORNO_INIZIO=null;


function init() {
	window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;
	utilCreaBoxAttesa();
	Events.set();

    var vResp = top.executeStatement("AccessiAppuntamenti.xml" , "Servizi.clean" , [top.baseUser.LOGIN],0);
    //alert(vResp[0] + '\n' +vResp[1]);


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
	if (typeof document.EXTERN.idenCiclo != 'undefined'){
		IDEN_CICLO = document.EXTERN.idenCiclo.value;
		NUMERO_CICLO = document.EXTERN.numeroCicli.value;
		INTERVALLO_CICLI = document.EXTERN.intervalloCicli.value;
		GIORNO_INIZIO = document.EXTERN.giornoInizio.value;		
	}

		
	if (typeof document.EXTERN.PROCEDURA != 'undefined') {
		PROCEDURA = document.EXTERN.PROCEDURA.value;
		var descrScheda;
		switch (PROCEDURA) {
			case 'INSERIMENTO': 
				break;
			case 'CICLO':
				//se è undefined sto inserendo un farmaco nella maschera riepilogo cicli e non devo ricaricare le schede
				if (typeof(document.EXTERN.descrModelli)!='undefined'){
				var arDescr =document.EXTERN.descrModelli.value;
				var arIdenModelli = document.EXTERN.idenModelli.value.split(',');
				arIdenModelli.sort();
					for(var i=0;i<arIdenModelli.length;i++){
						loadSchedaTerapia(arDescr,arIdenModelli[i]);
					}
				 }
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
//			var cmb = document.getElementById("cmbTipoTerapia");
			//var val = $('span.tipiTerapie select option:selected').val();
			var val = document.EXTERN.TIPO_TERAPIA.value
			setTipoTerapia(val);
			$('span.tipiTerapie select option[value="' + val + '"]').attr("selected","selected");
			/*valutare se rimettere o lasciare
			for ( var i = 0; i < cmb.options.length; i++) {
				alert(cmb.options[i].value)
				if (cmb.options[i].value == document.EXTERN.TIPO_TERAPIA.value) {
					cmb.selectedIndex = i;
					setTipoTerapia(cmb);
					break;
				}
			}*/
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
//			var span = $(this);
//			if (span.hasClass("selected")) {
//				span.removeClass("selected");
//				return;
//			}
//			span.parent().find("span").removeClass("selected");
//			span.addClass("selected");
//			setTipoTerapia(span.val());
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

function loadSchedaTerapia(pDescrTab,pIden) {
	var url = '';
	try {
		switch (PROCEDURA) {
		case 'MODIFICA':
			url = 	"SchedaTerapia?IDEN_VISITA=" + IDEN_VISITA + 
					"&IDEN_SCHEDA=" + IDEN_SCHEDA + 
					"&REPARTO=" + document.EXTERN.reparto.value +					
					"&STATO=CONFERMATA"+
                                        "&PROCEDURA=MODIFICA";
			break;
		case 'DUPLICA':
			url = 	"SchedaTerapia?IDEN_VISITA=" + IDEN_VISITA + 
					"&IDEN_SCHEDA=" + IDEN_SCHEDA + 
					"&REPARTO=" + document.EXTERN.reparto.value +					
					"&STATO=DUPLICA"+
                                        "&PROCEDURA=DUPLICA";
			IDEN_SCHEDA = null;
			IDEN_TERAPIA = null;
			break;
		case 'LETTURA':
			url = 	"SchedaTerapia?IDEN_VISITA=" + IDEN_VISITA + 
					"&IDEN_SCHEDA=" + IDEN_SCHEDA + 
					"&REPARTO=" + document.EXTERN.reparto.value +					
					"&STATO=LETTURA"+
                                        "&PROCEDURA=LETTURA";
			break;
		case 'MODELLO':
			url = 	"SchedaTerapia?IDEN_VISITA=" + IDEN_VISITA + 
					"&IDEN_MODELLO=" + IDEN_MODELLO + 
					"&REPARTO=" + document.EXTERN.reparto.value +					
					"&STATO=MODELLO"+
                                        "&PROCEDURA=MODELLO";
			break;
		case 'CICLO':
			url = "SchedaTerapia?IDEN_VISITA=" + IDEN_VISITA + "&IDEN_MODELLO="
					+ pIden + "&STATO=MODELLO"+
                                        "&PROCEDURA=CICLO";
			break;			
		case 'INSERIMENTO':
			url = 	"SchedaTerapia?IDEN_VISITA=" + IDEN_VISITA + 
					"&IDEN_CONF_SCHEDA=" + IDEN_CONF_SCHEDA + 
					"&REPARTO=" + document.EXTERN.reparto.value +					
					"&STATO=BOZZA"+
                                        "&PROCEDURA=INSERIMENTO";
			break;
		case 'ANNULLAMENTO':
			url = 	"SchedaTerapia?IDEN_VISITA=" + IDEN_VISITA + 
					"&IDEN_TERAPIA=" + IDEN_TERAPIA + 
					"&IDEN_SCHEDA=" + IDEN_SCHEDA + 
					"&REPARTO=" + document.EXTERN.reparto.value +
					"&STATO=ANNULLACONFERMA"+
                                        "&PROCEDURA=ANNULLAMENTO";

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
				
				// caricamento modelli associati (pacchetti di terapie std)
				if(wkModelli.array_associati[wkModelli.vettore_indici_sel[i]]=='') 
					continue;
				var arModelliAssociati = wkModelli.array_associati[wkModelli.vettore_indici_sel[i]].split(',');
				for (var j = 0; j < arModelliAssociati.length; j++) {
					IDEN_MODELLO = arModelliAssociati[j];
					loadSchedaTerapia(wkModelli.array_descrizione[wkModelli.vettore_indici_sel[i]]);
				}
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

/*function setDragDrop() {
	DragDrop
			.setup({
				object2disable : [ document.body ],
				targetObject : [],
				draggabledObject : [],
				classDragObj : 'objTrascinato',
				generateHtmlContent : function(obj) {

					obj.firstChild
							.setAttribute(
									"iden_farmaco",
									document.all.wkSearchFarmaci.contentWindow.array_iden_farmaco[obj.parentNode.sectionRowIndex]);
					return obj.outerHTML;

				},
				eventMouseUpInTarget : function(target) {
					var selection = {
						Text : target.innerText,
						tipo : target.nextSibling.tipo,
						Min : parseInt(target.nextSibling.minimo, 10),
						Max : parseInt(target.nextSibling.massimo, 10),
						Current : target.nextSibling.childNodes.length,
						iden_farmaco : DragDrop.dragObj.firstChild
								.getAttribute("iden_farmaco"),
						IdSessione : $('iframe#SchedaTerapia').data(
								"ID_SESSIONE")
					}
					inserimento.SchedaTerapia = document
							.getElementById("SchedaTerapia").contentWindow;
					inserimento.insert(selection);
				},
				eventMouseUpOutTarget : function(obj) {
					null;
				},
				eventMouseUpRestore : null,
				eventMouseMoveInTarget : function(target) {
					DragDrop.addClass(target, 'over');
					DragDrop.addClass(target.nextSibling, 'over');
				},
				eventMouseMoveOutTarget : function(target) {
					DragDrop.removeClass(target, 'over');
					DragDrop.removeClass(target.nextSibling, 'over');
				}
			})
}*/

/*function addOnMouseDownEvent(obj) {
	try {
		document.all['wkSearchFarmaci'].setAttribute("scrolling", "yes");

		if (typeof DragDrop == 'undefined') {
			attesa(false);
			return;
		}

		document.all.wkSearchFarmaci.contentWindow.document.body.onselectstart = function() {
			return false
		};
		//DragDrop.resetSelectedObject();

		arRow = obj.rows;
		// alert(arRow.length);
		if (arRow.length > 0) {
			// conf.tipi[conf.idxRicercaAttiva].idxKey=0;
			for ( var i = 0; i < arRow.length; i++)
				DragDrop.addSelectedObject({
					object : arRow[i].cells[2],
					gruppo : 'farmaci',
					cssObj : ''
				});
			attesa(false);
		}
	} catch (e) {
		alert(e.description);
	}
	attesa(false);
}*/

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
//			$('div.tipiTerapie span.selected').removeClass('selected');
//			$('div.confScheda span').hide();
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


function registra(pTipoRegistrazione, checkFunction){
	var obj = (typeof checkFunction == 'function' ? checkFunction(pTipoRegistrazione) : alternate.checkPreRegistrazione(pTipoRegistrazione) );
	//alert(obj.lock + '\n' + obj.confirm + '\n' + obj.message)
	if (obj.lock){
		return alert(obj.message);
	}
	
	if(obj.confirm && confirm(obj.message) == false){
		return;
	}
	performRegistrazione(pTipoRegistrazione);
	
}

function performRegistrazione(pTipoRegistrazione) {
	if (document.getElementById('SchedaTerapia') == null) {
		alert('Nessuna terapia confermabile');
		return;
	}
	var callBackOk, callBackKo;
	switch (document.EXTERN.statoTerapia.value) {
	case 'A':
		callBackKo = null;
		callBackOk = function(iden) {
			parent.NS_ANAMNESI.setWkTerapie(iden);
			alert('Terapia importata correttamente');
			$('div.selected div.btn').click();
		}
		break;
	case 'B': //bozza (pianificazione terapie)
		callBackKo = null;
		callBackOk = function(iden) {			
			$('div.selected div.btn').click();
			var vFrame = document.getElementById("SchedaTerapia");				
			if ((typeof vFrame != 'undefined') && vFrame != null) {
				performRegistrazione(pTipoRegistrazione);
			}else{
				parent.PIANIFICA_TERAPIE.refresh();
				IDEN_TERAPIA = null;
				alert('Registrazione effettuata correttamente');
			}
			
		}
		break;
	case 'P':
		callBackKo = null;
		switch (PROCEDURA) {
		case 'MODIFICA':
			callBackOk = function(iden) {
				parent.aggiornaPianoGiornaliero();
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
				
				case 'DUPLICA':IDEN_TERAPIA = null;
				
				default:
			    	callBackOk = function(iden_scheda, iden_terapia) {
						if(document.getElementById("SchedaTerapia").contentWindow.isAlternabile()){
							IDEN_TERAPIA = iden_terapia;
						}
						
						$('div.selected div.btn').click();
						var vFrame = document.getElementById("SchedaTerapia");
	
						switch(top.ModalitaCartella.getAfterSave(document)){				
							case 'checkAppuntamentiReloadPiano'	:	top.PostInserimento.CheckAppuntamento();
								break;
							default								:	
								break;
						}					

	//                    top.PostInserimento.CheckAppuntamento();
						if ((typeof vFrame != 'undefined') && vFrame != null) {
							performRegistrazione(pTipoRegistrazione);
						}else{
							IDEN_TERAPIA = null;
							alert('Registrazione effettuata correttamente');
						}
						
					};
					break;
			}
			break;

		case 'modello':
			//siamo in modifica terapia std...viene richiamata la servlet plgTerapia sopra quella presente passandogli il modello
			if (typeof document.EXTERN.idenModello != 'undefined'){
				IDEN_SCHEDA=IDEN_MODELLO; 
			}
			// IDEN_SCHEDA è ilparametro passato alla procedura di salvataggio
			callBackOk = function(pIdenScheda, pIdenTerapia) {

				if (IDEN_PARENT == null)
					IDEN_PARENT = pIdenScheda;
				$('div.selected div.btn').click();
				var vFrame = document.getElementById("SchedaTerapia");

				if (flgCreaPacchettoStd && (typeof vFrame != 'undefined') && vFrame != null) {
					performRegistrazione(pTipoRegistrazione);
				} else {
					var url = "servletGeneric?class=generic.ParoleChiave.SchedaCategorie" +
							"&TABELLA=CC_TERAPIE_MODELLI" +
							"&IDEN_TABELLA="+ IDEN_PARENT +
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
					IDEN_PARENT = null;
					IDEN_MODELLO=null;
				}
			};
			callBackKo = function(iden) {
				alert('Errore nel salvataggio del modello');
			}
			break;

		case 'ciclo':
			/*if (!cicli.checkTipoPrescrizione(pTipoRegistrazione))
				return;*/
			if (flgDelTerapieCiclo && IDEN_CICLO !=null){
				$('div.tabber div.tab:eq(0)').click();
				WindowCartella.executeQuery("terapie.xml","delTerapieCiclo",[IDEN_CICLO]);
			}
			flgDelTerapieCiclo=false;
			callBackOk = function(pIdenScheda, pIdenTerapia, pIdenCiclo) {
				IDEN_CICLO = pIdenCiclo;
				$('div.selected div.btn').click();
				var vFrame = document.getElementById("SchedaTerapia");

				if ((typeof vFrame != 'undefined') && vFrame != null) {
					performRegistrazione(pTipoRegistrazione);
				} else {
					var url = 'servletGeneric?class=generic.ParoleChiave.SchedaCategorie'
							+ '&TABELLA=CC_TERAPIE_CICLO_MODELLI&IDEN_TABELLA='+ pIdenCiclo
							+ '&CAMPO_DESCRIZIONE=DESCRIZIONE&AMBITI=&IDEN_ASSOCIATI='
							+ '&CAMPO_IMPOSTAZIONI=IMPOSTAZIONI'
							+ '&PAGE_IMPOSTAZIONI=modalUtility/ImpostazioniCiclo.html'
							+ '&SELEZIONE_OBBLIGATORIA=N';
					if (NUMERO_CICLO!=null && INTERVALLO_CICLI!=null && GIORNO_INIZIO!=null){
						url += '&NumeroCicli='+NUMERO_CICLO
						+ '&IntervalloCicli='+INTERVALLO_CICLI
						+ '&GiornoInizio='+GIORNO_INIZIO;
					}
							 
					// window.open(url);
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
		/*document.getElementById("SchedaTerapia").contentWindow.salva(
				pTipoRegistrazione, 
				IDEN_SCHEDA, 
				$('iframe#SchedaTerapia').data("ID_SESSIONE"), 
				null, 
				callBackOk, 
				callBackKo
			);*/
		document.getElementById("SchedaTerapia").contentWindow.esegui(
		{
			"PROCEDURA":pTipoRegistrazione,
			"IDEN_SCHEDA": flgCreaPacchettoStd ? null : IDEN_SCHEDA,
			"ID_SESSIONE":$('iframe#SchedaTerapia').data("ID_SESSIONE"),
			"NUMERO_CICLO":null,
			"IDEN_TERAPIA":IDEN_TERAPIA
		},
		callBackOk,
		callBackKo
	)			
	} catch (e) {
		alert(e.description);
	}
}

function refreshWkSearchFarmaci() { 
	//if ($("input#ricercaModelli:checked").length>0){
	if ($('#ricercaModelli:selected')){
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
    //alert(document.EXTERN.statoTerapia.value);
	switch (document.EXTERN.statoTerapia.value) {
	case 'L':
		parent.nuovaTerapia(wkFarmaci.array_descrizione[obj.sectionRowIndex],
				wkFarmaci.array_iden_farmaco[obj.sectionRowIndex],
				wkFarmaci.array_primo_ciclo[obj.sectionRowIndex],
				wkFarmaci.array_cod_dec[obj.sectionRowIndex],
				wkFarmaci.array_id_sos[obj.sectionRowIndex], '', '', 1, '',
				this.window);
		break;
	case 'A':
	case 'B':
	case 'I':
		switch (PROCEDURA) {
			case 'MODIFICA':
			case 'LETTURA':
				alert('Modifica non disponibile per la terapia');
				return;
				break;
			case 'CICLO':				
				inserimento.createMenu(
					wkFarmaci.array_iden_farmaco[obj.sectionRowIndex],
					wkFarmaci.event.clientX,
					wkFarmaci.event.clientY
				);				
				break;
			default:

				if (document.getElementById('SchedaTerapia') == null) {
					alert('Inserire una terapia prima di un farmaco');
					return;
				}

				inserimento.createMenu(
					wkFarmaci.array_iden_farmaco[obj.sectionRowIndex],
					wkFarmaci.event.clientX,
					wkFarmaci.event.clientY
				);			
			
				break;
		}		

		
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
			switch (PROCEDURA) {
				case 'CICLO': 
				//se IDEN_TERAPIA non è valorizzato mi trovo in modifica ciclo, altrimenti nella maschera di prescizione cicli 
				if (IDEN_TERAPIA!=null){
					parent.CicliBuilder.addedFarmaco(selection,inserimento.SchedaTerapia);
					break;
					}
				default:
					break;			
			}

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
			/*inserimento.SchedaTerapia = document
					.getElementById("SchedaTerapia").contentWindow;
			inserimento.IdSessione = $('iframe#SchedaTerapia').data(
					"ID_SESSIONE");
*/
			if (inserimento.menu != null)
				inserimento.removeMenu();

			switch (PROCEDURA) {
				case 'CICLO':
					//se IDEN_TERAPIA non è valorizzato mi trovo in modifica ciclo, altrimenti nella maschera di prescizione cicli 
					if (IDEN_TERAPIA!=null){
					inserimento.IdSessione = IDEN_TERAPIA;		
					inserimento.SchedaTerapia = parent.$('iframe[iden_modello="'+IDEN_TERAPIA+'"]')[0].contentWindow;			
					break;
					}
				default:
					inserimento.SchedaTerapia = document.getElementById("SchedaTerapia").contentWindow;
					inserimento.IdSessione = $('iframe#SchedaTerapia').data("ID_SESSIONE");	
					break;
			}
			
			

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
			
		
			
			var lst = inserimento.SchedaTerapia.farmaci.getGruppi();
			/*
			ar.push({
				Text:lst[i].previousSibling.innerText,
				tipo:lst[i].tipo,
				Min:parseInt(lst[i].minimo,10),
				Max:parseInt(lst[i].massimo,10),
				Current:lst[i].childNodes.length
				});
			*/
		} catch (e) {
			alert('Nessuna terapia disponibilie');
			return new Array();
		}
		return lst;
	},

	getIdenFarmaci : function() {
		return inserimento.SchedaTerapia.farmaci.getIdenFarmaci();
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

	checkPreRegistrazione : function(pTipoRegistrazione) {

		resp = {lock:false,confirm:false,message:null};
//		resp = true;
		try {
			$('div.FramesContainer iframe')
					.each(
							function(i) {
								if(resp.lock){
									return;
								}
								//if(!resp)return;
								if ($(this)[0].contentWindow.$('[name="TipoPrescrizione"]').attr("value") != '5'){
									//resp = false;
									resp.lock = true;									
									resp.message ='Una terapia inserita non è prescrivibile ciclicamente, impossibile procedere' ;
									$('div.tabber div.tab:eq('+i+')').click();
									return;
									//return alert('Una terapia inserita non è prescrivibile ciclicamente, impossibile procedere');
								}
								var controllo = $(this)[0].contentWindow.checkValidita(pTipoRegistrazione);
								if(!controllo.check){
									//resp = false;
									resp.lock = true;
									resp.message =controllo.msg;
									$('div.tabber div.tab:eq('+i+')').click();
									//return alert(controllo.msg);
									return;
								}
							});			
	
			
		} catch (e) {
			resp.message = e.description;
			resp.lock = false;
		}
		
		return resp;
		
	},
	
	registra:function(){
		$('div.tabber div.tab:eq(0)').click();
		registra('ciclo',cicli.checkPreRegistrazione);
	}

};

var modelli = {
		checkPreRegistrazione : function(pTipoRegistrazione) {

			resp = {lock:false,confirm:false,message:null};
//			resp = true;
			try {
				$('div.FramesContainer iframe')
						.each(
								function(i) {
									if(resp.lock){
										return;
									}
									
									var controllo = $(this)[0].contentWindow.checkValidita(pTipoRegistrazione);
									if(!controllo.check){
										//resp = false;
										resp.lock = true;
										resp.message =controllo.msg;
										$('div.tabber div.tab:eq('+i+')').click();
										//return alert(controllo.msg);
										return;
									}
								});			
		
				
			} catch (e) {
				resp.message = e.description;
				resp.lock = false;
			}
			
			return resp;
			
		},
		
		registra:function(pacchetto){
			
			if (pacchetto=='S' || ($('div.FramesContainer iframe').length>1 
					&& confirm("Sono presenti più prescrizioni, procedere alla creazione di un pacchetto?\nAnnullando verrà creata una prescrizione standard solo per la terapia in primo piano."))) {
					
				flgCreaPacchettoStd = true;
				$('div.tabber div.tab:eq(0)').click();
				registra('modello', modelli.checkPreRegistrazione);
			
			} else {
				
				flgCreaPacchettoStd = false;
				registra('modello');
			}
		}
};

var alternate = {
	
	checkPreRegistrazione:function(pTipoRegistrazione){
		
		var retvalue = {lock:false,confirm:false,message:null};
		
		var analisi = {
			UNIQUE:{count:0,objects:[]},
			PRIMARY:{count:0,object:null, index: null},
			SECONDARY:{count:0,objects:[]}
		};
		
		$('div.FramesContainer iframe').each(function(i) {
			//alert($(this)[0].contentWindow.getProperty("ALTERNABILE"))
			var tipo_alternabilita = $(this)[0].contentWindow.getProperty("ALTERNABILE");
			switch(tipo_alternabilita){
				case 'PRIMARY':
						analisi[tipo_alternabilita].count++;			
						analisi[tipo_alternabilita].object = this.contentWindow;
						analisi[tipo_alternabilita].index = i;
					break;
				default:			
						analisi[tipo_alternabilita].count++;			
						analisi[tipo_alternabilita].objects.push(this.contentWindow);
			}
		});	
		//alert(analisi.UNIQUE +'\n'+analisi.PRIMARY +'\n'+analisi.SECONDARY )

		if(analisi.UNIQUE.count > 0 && (analisi.PRIMARY.count + analisi.SECONDARY.count > 0)){

			retvalue.lock = true;
			retvalue.message = 'Attenzione!!\nTra quelle inserite vi sono alcune schede segnalate "Alternabili" ed altre "Non Alternabili".\nNon è possibile completare un\'azione di questo tipo';
			
		}else{
			
			if(analisi.PRIMARY.count + analisi.SECONDARY.count > 0){
			
				if(analisi.PRIMARY.count > 1){
					retvalue.lock = true;
					retvalue.message = 'Attenzione!!\nSono state segnalate 2 schede di tipo "PRIMARY", impossibile procedere';
				}
				if(analisi.PRIMARY.count == 0){	
					retvalue.lock = true;
					retvalue.message = 'Attenzione!!\nNon è stata segnalata nessuna scheda di tipo "PRIMARY", impossibile procedere';
				}
				
				$('div.tabber div.tab:eq('+analisi.PRIMARY.index+')').click();											

				var Timeline = [
					{
						durata:analisi.PRIMARY.object.getDurataDettaglio(),
						orari:[]
					}
				];

				var lst=analisi.PRIMARY.object.getElementsByAttributes(
					{id:'dettaglio'},
					analisi.PRIMARY.object.$('div[cls="Prescrizione"][tipo="1"]').find('#timeline')[0],'div');
				
				var min_date = null;
					
				for(var i=0;i<lst.length;i++){													
					myDate = clsDate.str2date(lst[i].getAttribute("data"),'YYYYMMDD',lst[i].getAttribute("ora"));														
					
					if(min_date == null || min_date > myDate){
						min_date = myDate;
					}
					
					Timeline[0].orari.push(myDate);	
					
				}
				

				if (lst.length>0){
					analisi.PRIMARY.object.$('input[name="OraInizio"]').val(clsDate.getOra(min_date))
				}
				
				analisi.PRIMARY.object.validita.setDataOraFine();
				analisi.PRIMARY.object.prescrizione.oraria.timeline.set();
				
				var primary_timereferences = analisi.PRIMARY.object.getTimeReferences();

				for(var i=0; i< analisi.SECONDARY.objects.length; i++){
					
					var Secondary = analisi.SECONDARY.objects[i];

					Secondary.prescrizione.oraria.timeline.removeDettagli();
					Secondary.setTimeReferences(primary_timereferences);
					Secondary.prescrizione.oraria.timeline.set();
					
					Timeline.push({durata:Secondary.getDurataDettaglio(),orari:[]});
					
					//prendo la precedente
					var durata = Timeline[i].durata;
					intero = Math.floor(durata);
					decimale = (durata - intero);
					
					totale = (intero*60) + (decimale*60);
					
					for (var j=0; j< Timeline[i].orari.length; j++){
						myDate =clsDate.dateAdd(Timeline[i].orari[j],'mi',Math.floor(totale));			
						if(myDate<Secondary.timeline.properties.dateIni){
							myDate = clsDate.dateAdd(myDate,'D',1);					
						}

						Timeline[i+1].orari.push(myDate);	
						
						if(myDate > Secondary.getTimelineProperties().dateFine){
							retvalue.lock = true;
							retvalue.message = 'Attenzione! La durata complessiva supera le 24 ore, impossibile procedere';							
						}
						Secondary.timeline.addDettaglio(Secondary.timeline.arTbody[0].obj,myDate);					

					}
				}
				
				$('div.FramesContainer iframe').each(function(i) {

					if(retvalue.lock){
						return;
					}
					var controllo = $(this)[0].contentWindow.checkValidita(pTipoRegistrazione);
					if(!controllo.check){
						retvalue.lock = true;
						retvalue.message =controllo.msg;
						$('div.tabber div.tab:eq('+i+')').click();
					}

				});

				

			}
			
		}
		
		return retvalue;
	}
	
};

function attesa(bool) {
	try {
		utilMostraBoxAttesa(bool);
	} catch (e) {/**/}
	/*try {
		utilMostraBoxAttesa(bool);
	} catch (e) {
	}*/
};



