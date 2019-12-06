$(document).ready(function() {
	NS_FENIX_SCHEDA.customizeJson = NS_FENIX_SCHEDA_MMG.customizeJson;
});

var NS_FENIX_SCHEDA_MMG = {
	
	customizeJson: function (jsonSave) {
		jsonSave.campo.push({
			"id": "hInfoAccesso",
			"IDEN_ANAG": home.ASSISTITO.IDEN_ANAG || '',
			"IDEN_MED_BASE": home.ASSISTITO.IDEN_MED_BASE || '',
			"ID_REMOTO": home.ASSISTITO.ID_REMOTO || '',
			"COD_CDC": home.ASSISTITO.COD_CDC || '',
			"IDEN_ACCESSO": home.ASSISTITO.IDEN_ACCESSO || '',
			"IDEN_PROBLEMA": home.ASSISTITO.IDEN_PROBLEMA || '',
			"IDEN_MED_PRESCR": home.CARTELLA.getMedPrescr() || '',
			"IDEN_PER": home.baseUser.IDEN_PER || ''
		});

		jsonSave.campo.push({
			"id": "hInfoUtente",
			"IDEN_UTENTE": home.baseUser.IDEN_PER || '',
			"WEBUSER": home.baseUser.USERNAME || '',
			"PC": home.basePC.IP || ''
		});
		return jsonSave;
	},
	
	getScrollParameters: function () {
		var scrollParameters;
		switch ($("#KEY_LEGAME").val()) {
			case "OFFLINE":
				scrollParameters = {
					'autoReinitialise': (home == home_offline),
					'showArrows': true,
					'mouseWheelSpeed': 50
				};
				break;
			case "TAB_RR_FARMACI":
			case "TAB_RR_ACCERTAMENTI":
				scrollParameters = {
					'autoReinitialise': true,
					'showArrows': true,
					'mouseWheelSpeed': 50,
					'enableKeyboardNavigation': false
				};
				break;
			default:
				scrollParameters = {
					'autoReinitialise': true,
					'showArrows': true,
					'mouseWheelSpeed': 50
				};
		}
		return scrollParameters;
	},
	
	addIcons: function () {

		var headerTabs = $('.headerTabs');
		var iconContainer = $(document.createElement('div')).addClass('iconContainer');
		var iconReload = $(document.createElement('i')).addClass('icon-spin3').attr('title', 'Ricarica la pagina');
		//var iconHelp		= $(document.createElement('i')).addClass('icon-lamp').attr('title', 'Mostra aiuto');
		var iconManual = $(document.createElement('i')).addClass('icon-help-circled').attr('title', 'Vai al manuale');
		var iconClose = $(document.createElement('i')).addClass('icon-cancel-squared').attr('title', 'Chiudi').css({"color": "#ce2c1a"});

		/*iconHelp.on('click', function(){ home.NS_INFORMATIONS.init(); });*/
		if ($("#N_SCHEDA").length > 0) {
			var iconMin = $(document.createElement('i')).addClass('icon-down').attr('title', 'Riduci a icona');
			iconMin.on('click', function () {
				var descrizione = $("h2#lblTitolo").text();
				if (!LIB.isValid(descrizione)) {
					descrizione = $("li.tabActive").text();
				}
				var descrizione_esistente = false;
				home.$(".scheda-min").each(function() {
					if ($(this).text() == descrizione) {
						descrizione_esistente = true;
					}
				});
				if (descrizione_esistente) {
					home.NOTIFICA.warning({
						title: "Attenzione",
						message: "Scheda gia' ridotta ad icona. E' possibile solo chiuderla."
					});
				} else {
					var n_scheda = $("#N_SCHEDA").val();
					var id_scheda = "#iScheda-" + n_scheda;
					home.$(id_scheda).hide();
					var button = $("<button/>");
					button.attr("id", id_scheda + "min");
					button.attr("scheda", id_scheda);
					button.addClass("scheda-min");
					button.text(descrizione);
					button.on("click",function() {
						var th = $(this);
						home.$(th.attr("scheda")).show();
						th.remove();
					});
					home.$("#statDx").append(button);
				}
			});
			iconContainer.append(iconMin);
		}

		iconReload.on('click', function () {
			window.frameElement.contentWindow.location.reload();
		});

		iconManual.on('click', function () {
			home.MANUALE.open($('#KEY_LEGAME').val());
		});

		iconClose.on('click', function () {
			var n_scheda = $("#N_SCHEDA").val();
			home.NS_FENIX_TOP.chiudiScheda({'n_scheda': n_scheda});
		});

		iconContainer.append(iconManual, /*iconHelp,*/ iconReload, iconClose).appendTo(headerTabs);

		if (LIB.getParamUserGlobal("ICONE_BUTTONS", "N") == 'S') {

			$(".butChiudi").prepend($(document.createElement('i')).addClass('icon-cancel-squared').attr('title', 'Chiudi').css({"color": "#ce2c1a", "font-size": "14px"}));
			$(".butRegistra, .butSalva, .butSalvataggio").prepend($(document.createElement('i')).addClass('icon-floppy').attr('title', 'Chiudi').css({"color": "#333", "font-size": "14px"}));
			$(".butStampa, .butSalvaStampa").prepend($(document.createElement('i')).addClass('icon-print').attr('title', 'Chiudi').css({"color": "#07149e", "font-size": "14px"}));
			//se rompe gli zebedei commentare. Con questo i button sono allineati, senza i button senza icona sono più bassi di pochissimo
			$("button").not('.butStampa, .butSalvaStampa, .butRegistra, .butSalva, .butSalvataggio, .butChiudi').prepend($(document.createElement('i')).css({"font-size": "14px"}));
		}
	}
};

NS_FENIX_SCHEDA.setRegistraEvent = function () {
	$('.butLoading').removeClass("butLoading");
	
	$(".butRegistra").off('click');
	$(".butRegistra").one('click', function () {
		NS_FENIX_SCHEDA.registra({close: false});
		setTimeout("NS_FENIX_SCHEDA.setRegistraEvent();", 1000);
	});
	
	$(".butSalva").off('click');
	$(".butSalva").addClass('butVerde').one('click', function () {
		NS_FENIX_SCHEDA.registra({close: false});
		setTimeout("NS_FENIX_SCHEDA.setRegistraEvent();", 1000);
	});
	
	$(".butSalvaChiudi").off('click');
	$(".butSalvaChiudi").one('click', function () {
		NS_FENIX_SCHEDA.registra({close: true});
		setTimeout("NS_FENIX_SCHEDA.setRegistraEvent();", 1000);
	});
};

NS_FENIX_SCHEDA.checkValore = function (val, up) {
	
	var upperCaseGlobal = typeof home.baseGlobal.INPUT_TO_UPPER != 'undefined' && home.baseGlobal.INPUT_TO_UPPER == 'N' ? false : true;
	var valore = $.trim(LIB.isValid(val) ? val : '');
	var up = (up != 'undefined') ? up : true;

	if (upperCaseGlobal) {
		return (valore) ? (up) ? valore.toUpperCase() : valore : '';
	}else{
		return (valore);
	}
};

NS_FENIX_SCHEDA.adattaLayout = function () {
	
	var hWin = LIB.getHeight();
	var body = $("body");
	var paddingBody = body.pixels("paddingTop") + body.pixels("paddingBottom");
	var hInfoPaz = home.$("#divInfo").outerHeight(true); //serve per calcolare anche l'altezza del div delle info paziente
	var height = hWin - $(".ulTabs", ".tabs").outerHeight(true) - $(".headerTabs", ".tabs").outerHeight(true) - $(".footerTabs", ".tabs").outerHeight(true) - paddingBody - hInfoPaz;

	NS_FENIX_SCHEDA.content.height(height).jScrollPane(NS_FENIX_SCHEDA_MMG.getScrollParameters());
	NS_FENIX_SCHEDA_MMG.addIcons();
};
