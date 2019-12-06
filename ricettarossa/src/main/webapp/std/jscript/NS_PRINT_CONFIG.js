/**
 * @author Lino 28/10/2014
 */
$(document).ready(function() {
	NS_PRINT_CONFIG.init();
});
/**
 * NameSpace per il caricamento dell'html di configurazione
 */

var NS_PRINT_CONFIG = {
	wnd : '',
	ip : '',
	fileStatement : 'appletStampa.xml',
	stampanteSelezionata : '',

	init : function() {

		// Cerco nel dom l'iframe da caricare con le configurazioni di default +
		// le stampanti rilevate dal pc

		this.wnd = window.parent;
		this.ip = this.wnd.basePC.IP;

	},
	/**
	 * Comportamento Combo e Button
	 */
	setEvents : function() {
		// Combo Stampante, caricata tramite la funzione getPrinterList
		// dell'applet
		NS_PRINT_CONFIG.getPrinterList($('select#stampante'));
		$('select#stampante').click(function () {
			$("select#stampante option:selected").each(function() {
				NS_PRINT_CONFIG.stampanteSelezionata = $(this).val();
			});
		});

		// Combo Configurazione
		NS_PRINT_CONFIG.getConfDefault($('select#configurazione'),NS_PRINT_CONFIG.array_stampante_opzioni);
		$('select#configurazione').change(function() {
			$("select#configurazione option:selected").each(function() {
				$('#configurazione_selezionata').val($(this).val());
			});
		});

		// Button
		$('#salva').click(function() {
			if (NS_PRINT_CONFIG.stampanteSelezionata == "") {
				return alert('Selezionare una stampante')
			}

			if ($('#configurazione_selezionata').val() == "") {
				return alert('Selezionare una configurazione')
			}
			NS_PRINT_CONFIG.saveConfigurazione();
		})

		$('#carica').click(function() {
			
			NS_PRINT_CONFIG.getConfStampante();
			
		})

	},
	/**
	 * Caricamento combo delle stampanti
	 * 
	 * @param obj
	 */
	getPrinterList : function(obj) {
		var stampanti = JSON.parse(NS_PRINT_CONFIG.wnd.AppStampa.getPrinterList());
		var $optionVuoto = jQuery('<option/>', {
			value : '',
			text : ''
		});
		obj.append($optionVuoto);
		
		for (var i = 0; i < stampanti.printers.length; i++) {
			if (stampanti.printers[i].toUpperCase().indexOf('FAX') === -1) {
				var $option = jQuery('<option/>', {
					value : stampanti.printers[i],
					text : stampanti.printers[i]
				});
				obj.append($option);
			}
		}

	},
	/**
	 * Caricamento configurazione dal campo option, caricato da db se
	 * configurazione presente
	 */
	getConfStampante : function() {
		if (this.wnd.NS_PRINT.getOption() == "") {
			return alert('Configurazione sul db mancante')
		}
		$('#configurazione_selezionata').val(this.wnd.NS_PRINT.getOption());
	},
	/**
	 * Array Configurazioni di default
	 */
	array_stampante_opzioni : {
		// Configurazione Di Default
		STAMPANTE_DEFAULT : '{"methods":[{"autoRotateandCenter":[true]},{"setPageScale":[1]}]}',
		// Configurazione Stampa Ricetta Orizzontale
		RICETTA_ROSSA : '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[210.0,297.0,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[11.0,0.0,13.0,150.0],4]}]}',
		// Configurazione Stampa Ricetta Verticale
		RICETTA_ROSSA_LANDSCAPE : '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[210.0,297.0,4]},{"setOrientation":[2]},{"setPageScale":[1]},{"setPageMargins":[[56.0,26.5,0.0,77.0],4]}]}',
		// Configurazione di prova per le stampanti samsung ML-3310ND
		RICETTA_ROSSA_SAMSUNG : '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[210.0,297.0,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[11.0,0.0,12.0,150.0],4]}]}',
		// Configurazione etichette
		ETICHETTA_VITRO :'{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[50,30,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}'	
			
			
	},
	/**
	 * Caricamento combo con configurazioni di default
	 * 
	 * @param objToLoad ->
	 *            oggetto da caricare
	 * @param confDefault ->
	 *            configurazioni da caricare
	 */
	getConfDefault : function(objToLoad, confDefault) {
		var $optionVuoto = jQuery('<option/>', {
			value : '',
			text : ''
		});
		objToLoad.append($optionVuoto);
		for ( var i in confDefault) {
			var $option = jQuery('<option/>', {
				value : confDefault[i],
				text : i
			});
			objToLoad.append($option);
		}
	},
	/**
	 * Procedura di salvataggio sul db della configurazione
	 */
	saveConfigurazione : function() {
		var statement = 'save';
		var pBinds = new Array();
		pBinds.push($('#configurazione_selezionata').val());
		pBinds.push(NS_PRINT_CONFIG.stampanteSelezionata);
		pBinds.push(this.ip);
		var rs = NS_PRINT_CONFIG.wnd.executeStatement(this.fileStatement,
				statement, pBinds);
		if (rs[0] == 'KO')
			alert(rs[1]);
		else
			alert('Salvataggio configurazione avvenuto con successo');
		// dopo aver salvato sul db la configurazione, la imposto come opzioni
		// per potr testarla successivamente
		this.wnd.NS_PRINT.setOption($('#configurazione_selezionata').val());
		this.wnd.NS_PRINT.setPrinter(NS_PRINT_CONFIG.stampanteSelezionata);

	}
};