$(document).ready(function(){

	if(NS_PRINT.gConfStampa === null && LIB.isValid(basePC.CONFIGURAZIONI_STAMPA_EXTRA) && ! $.isEmptyObject( JSON.parse(basePC.CONFIGURAZIONI_STAMPA_EXTRA) ) ) {
		NS_PRINT.chooseConfiguration();
	}
	
});

var NS_PRINT = {
		url:null,
		stampante:null,
		opzioni:null,
		gConfStampa:null,
		configurazione_stampa:null,
		
		init:function(param){
			
			/* Se viene passato configurazione_stampa ma non esiste la configurazione specificata, non lo imposto.
			 * Problema sorto con amministrativa a cui non servivano le configurazioni differenziate per medico, ma le
			 * configurazioni differenziate per studio (CONFIGURAZIONI_STAMPA_EXTRA), e purtroppo per le amministrative
			 * configurazioni_stampa e' sempre valorizzato con iden_per (quindi bypasserebbe la configurazione di stampa selezionata).
			 */
			if (LIB.isValid(param.configurazione_stampa) && home.basePC["CONFIGURAZIONE_STAMPANTI_" + param.configurazione_stampa] == 'S') {
				this.configurazione_stampa = param.configurazione_stampa;
			} else {
				if (LIB.isValid(NS_PRINT.gConfStampa)) {
					this.configurazione_stampa = NS_PRINT.gConfStampa;
				} else {
					this.configurazione_stampa = baseUser.IDEN_PER; /* Se un medico utilizza un pc configurato con stampanti multicassetto, automaticamente stampa sul cassetto giusto */
				}
			}
			
			if (!param.printonly) {
				if (LIB.isValid(param.url)) {
					this.url = param.url;
				} else {
					this.url = this.getUserPcGlobal("URL_PRINT","");
				}
			}
			
			if(LIB.isValid(param.report)){
				var report;
				if (LIB.isValid(param.tipo_report)) {
					report = param.tipo_report;
				} else {
					//alert(param.report);
					report = this.getTipoReport(param.report);
				}
				//alert(report);
				this.set_report(report);
				this.set_stampante(report, param.stampante);
			} else {
				if(LIB.isValid(param.path_report)){
					this.url += param.path_report;
				}
				this.set_stampante("DEFAULT", param.stampante);
			}
			/*
			 * Stampante forzata
			 */
			if(LIB.isValid(param.stampante)) {
				this.stampante = param.stampante;
			}

			/*
			 * Opzioni stampa forzate
			 */
			if(LIB.isValid(param.opzioni)) {
				this.opzioni = param.opzioni;
			}
			if(LIB.isValid(param.output)){
				this.set_output(param.output);
			} else {
				if (typeof param.url == "undefined") { 
					this.set_output("pdf");
				}
			}
			if(LIB.isValid(param.selection_formula)){
				this.set_sf(param.selection_formula);
			}
			if(LIB.isValid(param.prompt)){
				this.set_prompt(param.prompt);
			}
			if(LIB.isValid(param.prompts)){
				this.set_prompts(param.prompts);
			}
		},
		/*
		 * predefiniti e' un array di stringhe (di cui verra' fatto l'eval) di possibili valori predefiniti.
		 */
		getUserPcGlobal:function(tipo_parametro, variabile, predefiniti){
			/*
			 * Se sul PC e' impostato un parametro in base a configurazione di stampa extra o medico prescrittore
			 */
			if(this.configurazione_stampa != null && LIB.isValid(basePC[tipo_parametro + variabile + "_" + this.configurazione_stampa])) {
				return basePC[tipo_parametro + variabile + "_" + this.configurazione_stampa];
			}
			/*
			 * Non dovrebbe servire a nulla. Per ora lo mantengo.
			 */
			if(LIB.isValid(baseUser[tipo_parametro + variabile])){
				//alert("baseUser");
				return baseUser[tipo_parametro + variabile];
			}
			if(LIB.isValid(basePC[tipo_parametro + variabile])){
				//alert("basePC");
				return basePC[tipo_parametro + variabile];
			}
			if (LIB.isValid(baseGlobal[tipo_parametro + variabile])) {
				//alert("baseGlobal");
				return baseGlobal[tipo_parametro + variabile];
			}
			if (LIB.isValid(predefiniti)) {
				if (typeof predefiniti == "string") {
					return predefiniti;
				} else {
					for (var p=0; p < predefiniti.length; p++) {
						try {
							var pred = eval(predefiniti[p]);
							//alert(pred);
							return pred;
						} catch (e) {
							//nope
							alert("errore: " + predefiniti[p]);
						}
					}
				}
			}
			alert('Probabile errore di configurazione: ' + tipo_parametro + " " + variabile + " " + predefiniti);
			/*alert(tipo_parametro);
			alert(variabile);
			alert(predefiniti);*/
			return variabile;
		},
		/*
		 * Esempio: report=RICETTA_BIANCA, output puo' essere FARMACI o RICETTA_BIANCA
		 */
		getTipoReport:function(report) {
			//alert(report);
			return this.getUserPcGlobal("TIPO_REPORT_", report, ['"' + report + '"']);//"TIPO_REPORT_"+report
		},
		
		/*
		 * Esempio: report=FARMACI, output FARMACI_HQ.RPT
		 */
		getReport:function(report) {
			//alert(report);
			return this.getUserPcGlobal("REPORT_", report);
		},
		/*
		 * Esempio 
		 */
		getTipoStampante: function(report) {
			return this.getUserPcGlobal("TIPO_STAMPANTE_", report, ['"STAMPANTE_' + this.array_report_stampante[report] + '"']);
		},
		chooseConfiguration : function() {
			var vOption="<option value=''>Configurazione di default</option>";

			if(typeof basePC.CONFIGURAZIONI_STAMPA_EXTRA == 'undefined' || basePC.CONFIGURAZIONI_STAMPA_EXTRA == '{}'){
				NOTIFICA.warning({
					message:"Nelle impostazioni &egrave; presente solamente una configurazione di stampa.\nPer poter aggiungere una configurazione nuova (per aggiungere un nuovo studio, una stampante alternativa, ecc.) utilizzare il menu 'Configurazione stampanti'",
					title: "Attenzione"
				});
			}
			
			var vJson=JSON.parse(basePC.CONFIGURAZIONI_STAMPA_EXTRA);
			for (var i in vJson) {
				vOption+="<option value='"+i+"'>Configurazione "+i+"</option>";
			}
			var vContent = $("<select/>",{id:"confStampa"}).html(vOption);
			$.dialog( vContent, {

				'id'				: 'dialogWk',
				'title'				: "Scelta configurazione di stampa",
				'ESCandClose'		: true,
				'created'			: function(){ $('.dialog').focus(); },
				'showBtnClose'		: false,
				'width'				: 350,
				'buttons'			:
					[{
						'label' : 'Conferma',
						'action' : function(context)
						{

							NS_PRINT.gConfStampa = $("select#confStampa option:selected").val();
							var text = $("select#confStampa option:selected").text();
							context.data.close();
							NOTIFICA.info({
									message: (text),
									title: "Selezione effettuata"
							});
						}
					}
					]
			});
		},
		/*
		 * param:
		 * report (tipo di report, esempio "FARMACI", se gestito qui)
		 * path_report (path completo del report a partire dalla cartella dei report)
		 * selection_formula ({TABELLA.CAMPO}=124)
		 * prompt (parametro=valore&promptparametro2=valore2) -> prompt successivi vanno preceduti da "prompt"
		 * show S/N
		 * output (pdf o altro, default pdf; se vuoto avvia l'applet di crystal clear)
		 * windowname
		 * stampante -> nome della stampante da uasre in questa stampa (sovrascrive default)
		 * opzioni -> opzioni di stampa da utilizzare, sovrascrive quelle del pc e predefinite
		 * url -> se ho una url gia' printa (omettere tutti i parametri relativi ai report)
		 */
		print:function(param){
			var ritorno;
			this.init(param);
			if (LIB.isValid(param.show) && param.show == 'S') {
				ritorno = this.print_window(param);
			} else {
				if (!param.printonly) {
					if (this.url.substring(0,5) == "data:") {
						AppStampa.setSrcFromDataUrl(this.url);
					} else {
						AppStampa.setSrcFromUrl(this.url);
					}
				}
				ritorno = AppStampa.print(this.stampante, this.opzioni);
			}
			return ritorno;
		},
		
		print_window:function(param){
			/*param.path_report,param.selection_formula
			 */
			
			if(LIB.isValid(this.url)){
				var windowname = '';
				if(LIB.isValid(param.windowname)){
					windowname = param.windowname;
				} else {
					windowname = new Date().getTime();
				}
				
				window.open(this.url, windowname);
				return true;
			}else{
				alert("Not a valid JSON input param");
				return false;
			}
		},
		set_sf:function(sf){
			this.url += "&sf=" + sf;
		},
		set_prompt:function(prompt){
			this.url += "&prompt" + prompt;
		},
		set_prompts:function(prompts) {
			for (p in prompts) {
				this.set_prompt(p + "=" + prompts[p]);
			}
		},
		set_output:function(output){
			this.url += "&init=" + output;
		},
		set_report:function(report) {
			this.url += this.getReport(report);
		},
		getStampante:function(tipo_stampante, stampante) {
			if (LIB.isValid(stampante)) {
				return this.getUserPcGlobal(tipo_stampante, "", ['"' + stampante + '"']);
			} else {
				return this.getUserPcGlobal(tipo_stampante, "", ["null"]);
			}
		},
		getOpzioni:function(tipo_stampante) {
			 return this.getUserPcGlobal(tipo_stampante, "_OPZIONI", ['this.array_stampante_opzioni["' + tipo_stampante + '"]','this.array_stampante_opzioni.STAMPANTE_DEFAULT']);
		},
		set_stampante:function(report, stampante) {
			var tipo_stampante = this.getTipoStampante(report);
			this.stampante = this.getStampante(tipo_stampante, stampante);
			this.opzioni = this.getOpzioni(tipo_stampante);
		},
		
		array_report_stampante: {
			DEFAULT: "DEFAULT",
			FARMACI_DEMA: "RICETTA_DEMA",
			PRESTAZIONI_DEMA: "RICETTA_DEMA",
			FARMACI: "RICETTA_ROSSA",
			PRESTAZIONI: "RICETTA_ROSSA",
			RICETTA_BIANCA: "RICETTA_BIANCA",
			FARMACI_BIANCA: "RICETTA_BIANCA",
			PRESTAZIONI_BIANCA: "RICETTA_BIANCA"
		},
		
		array_stampante_opzioni: {
			STAMPANTE_DEFAULT: '{"methods":[{"autoRotateandCenter":[true]},{"setPageScale":[1]}]}',
			STAMPANTE_DEFAULT_A4: '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[210.0,297.0,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}',
			STAMPANTE_DEFAULT_A5: '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[148.0,210.0,4]},{"setOrientation":[1]},{"setPageScale":[0]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}',
			STAMPANTE_RICETTA_BIANCA: '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[149.0,219.0,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}',
			STAMPANTE_RICETTA_BIANCA_LANDSCAPE: '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[219.0,149.0,4]},{"setOrientation":[2]},{"setPageScale":[1]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}',
			STAMPANTE_RICETTA_BIANCA_A5: '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[148.0,210.0,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[0.5,0.5,0.5,0.5],4]}]}',
			STAMPANTE_RICETTA_BIANCA_A5_LANDSCAPE: '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[210.0,148.0,4]},{"setOrientation":[2]},{"setPageScale":[1]},{"setPageMargins":[[0.5,0.5,0.5,0.5],4]}]}',
			STAMPANTE_RICETTA_ROSSA: '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[210.0,297.0,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[11.0,0.0,13.0,150.0],4]}]}',
			STAMPANTE_RICETTA_ROSSA_LANDSCAPE: '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[210.0,297.0,4]},{"setOrientation":[2]},{"setPageScale":[1]},{"setPageMargins":[[106.0,26.5,0.0,27.0],4]}]}',
			STAMPANTE_RICETTA_ROSSA_RR: '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[196.0,152.0,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}',
			STAMPANTE_RICETTA_ROSSA_A4: '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[210.0,297.0,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[11.0,0.0,13.0,200.0],4]}]}',
			STAMPANTE_RICETTA_ROSSA_A4_LANDSCAPE: '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[210.0,297.0,4]},{"setOrientation":[2]},{"setPageScale":[1]},{"setPageMargins":[[106.0,26.5,0.0,77.0],4]}]}',
			STAMPANTE_RICETTA_DEMA: '{"methods":[{"autoRotateandCenter":[true]},{"setPageSize":[8]},{"setCustomPageDimension":[210.0,148.5,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}',
			STAMPANTE_RICETTA_DEMA_A4: '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[210.0,297.0,4]},{"setOrientation":[1]},{"setPageScale":[1]},{"setPageMargins":[[0.5,0.0,0.5,148.0],4]}]}',
			/*questa configurazione non e' ancora utilizzata ma ha due bottoni associati (e nascosti) nella pagina di configurazione. Era nata per MacOSX con java 8*/
			JOLLY: '{"methods":[{"autoRotateandCenter":[false]},{"setPageSize":[8]},{"setCustomPageDimension":[210.0,0.0,4]},{"setOrientation":[1]},{"setPageScale":[0]},{"setPageMargins":[[0.0,0.0,0.0,0.0],4]}]}'
		},
		
		getObjectHtml: function(options) {
			var def = {
					height: "800px",
					width: "800px",
					name: "AppStampa",
					id: "AppStampa",
					loadStampe: true,
					loadFirma: false,
					loadSCL: false,
					loadAQ: false,
					ShowMediaTrays: "S"
			};
			if (typeof options == "undefined")
				options = {};
			for (o in def) {
				if (typeof options[o] == "undefined") {
					options[o] = def[o];
				}
			};
			var ritorno = '<object height=' + options.height + '" name="' + options.name + '" width="' + options.width + '" type="application/x-java-applet" id="' + options.id + '">';
			ritorno += '<param name="loadStampe" value="' + options.loadStampe + '"/>';
			ritorno += '<param name="SCLclass" value="it.elco.applet.smartCard.login.LoggedCardListener"/>';
			ritorno += '<param name="code" value="it.elco.applet.elcoApplet"/>';
			if (typeof options.jnlp_href == "undefined") {
				ritorno += '<param name="archive" value="app/SignedFenixApplet.jar"/>';
			} else {
				ritorno += '<param name="jnlp_href" value="' + options.jnlp_href + '"/>';
			}
			ritorno += '<param name="wmode" value="transparent"/>';
			ritorno += '<param name="initial_focus" value="false"/>';
			ritorno += '<param name="loadFirma" value="' + options.loadFirma + '"/>';
			ritorno += '<param name="loadSCL" value="' + options.loadSCL + '"/>';
			ritorno += '<param name="loadAQ" value="' + options.loadAQ + '"/>';
			ritorno += '<param name="ShowMediaTrays" value="' + options.ShowMediaTrays + '"/>';
			ritorno += '</object>';
			return ritorno;
		}
};

/* {"setPageMargins":[[3,3,3,3],4]},
 * Costanti PdfPrinter:
 * SUBSET_NONE = 0;
 * SUBSET_EVEN_ONLY = 1;
 * SUBSET_ODD_ONLY = 2;
 * SCALE_NONE = 0;
 * SCALE_FIT_TO_PRINTER_MARGINS = 1;
 * SCALE_REDUCE_TO_PRINTER_MARGINS = 2;
 * Orientation_PORTRAIT = 1;
 * Orientation_LANDSCAPE = 2;
 * MU_MM = 4;
 * MU_INCHES = 3;
 * MU_POINTS = 1;
 * 
 * setPageMargins: left, top, right and bottom margins
 */
/*
if (funzioneStampa=='RICETTA_ROSSA_FARMACI' || funzioneStampa=='RICETTA_ROSSA_PRESTAZIONI')
{
	if 	(stampante.indexOf('ML-331x')>-1){
		OffsTop	 = "290";
		OffsLeft = "90";
	}
	if 	(stampante.indexOf('SCX-483x')>-1){
		OffsTop	 = "295";
		OffsLeft = "85";
	}	
}
*/
var NS_PRINT_CONFIG = {
		
		/*
		 * Da usare nella pagina di configurazione stampanti
		 */
		array_stampanti: {
			STAMPANTE_DEFAULT: "Stampante predefinita",
			STAMPANTE_RICETTA_BIANCA: "Stampante per le ricette bianche",
			STAMPANTE_RICETTA_ROSSA: "Stampante per le ricette rosse"
		},
		
		checkAttribute: function(attr, predefinito, checker_function) {
			if (LIB.isValid(attr) && attr != '') {
				if (LIB.isValid(checker_function)) {
					return checker_function(attr);
				} else {
					return attr;
				}
			} else {
				return predefinito;
			}
		},
		
		/*
		 * voglio che in questa stringa ci sia un numero nella forma '1234.0'. Quindi non virgole, e punto forzato anche senza decimali.
		 */
		checkDouble: function(str_double) {
			var output = "" + str_double;
			output = output.replace(",", ".");
			if (output.indexOf(".") < 0) {
				output += ".0";
			}
			return output;
		},
		
		checkOrientation: function(orientation) {
			switch(orientation) {
			case '2':
			case 'landscape':
				return '2';
			case '1':
			case 'portrait':
			default:
				return '1';
			}
		},
		
		getOpzioniStringa: function(param) {

			var autoRotateandCenter = this.checkAttribute(param.autoRotateandCenter, 'false');
			var pageWidth = this.checkAttribute(param.pageWidth, '196.0', this.checkDouble);
			var pageHeight = this.checkAttribute(param.pageHeight, '152.0', this.checkDouble);
			var pageOrientation = this.checkAttribute(param.pageOrientation,'1', this.checkOrientation);
			var pageScale = this.checkAttribute(param.pageScale,'1');
			var marginLeft = this.checkAttribute(param.marginLeft, '0.0', this.checkDouble);
			var marginTop = this.checkAttribute(param.marginTop, '0.0', this.checkDouble);
			var marginRight = this.checkAttribute(param.marginRight, '0.0', this.checkDouble);
			var marginBottom = this.checkAttribute(param.marginBottom, '0.0', this.checkDouble);
			
			var output = '{"methods":['
				+ '{"autoRotateandCenter":[' + autoRotateandCenter + ']}'
				+ ','
				+ '{"setPageSize":[8]}'
				+ ','
				+ '{"setCustomPageDimension":[' + pageWidth + ',' + pageHeight + ',4]}'
				+ ','
				+ '{"setOrientation":[' + pageOrientation +']}'
				+ ',{"setPageScale":[' + pageScale + ']}'
				+ ',{"setPageMargins":[[' + marginLeft + ',' + marginTop + ',' + marginRight + ',' + marginBottom + '],4]}'
				+ ']}';
			return output;
		},
		
		getOpzioniParam: function(stringa) {
			var param = {};
			var rx = new RegExp(
					'.*autoRotateandCenter":\\[([^\\]]+)'
					+'.*setCustomPageDimension":\\[([^,]+),([^,]+)'
					+'.*setOrientation":\\[([^\\]]+)'
					+'.*setPageScale":\\[([^\\]]+)'
					+'.*setPageMargins":\\[\\[([^,]+),([^,]+),([^,]+),([^\\]]+)'
					+'.*'
					,'');
			var array_rx = rx.exec(stringa);
			param.autoRotateAndCenter = array_rx[1];
			param.pageWidth = array_rx[2];
			param.pageHeight = array_rx[3];
			param.pageOrientation = array_rx[4];
			param.pageScale = array_rx[5];
			param.marginLeft = array_rx[6];
			param.marginTop = array_rx[7];
			param.marginRight = array_rx[8];
			param.marginBottom = array_rx[9];
			return param;
		},
		
		getPrinterList: function() {
			return JSON.parse(AppStampa.getPrinterList());
		},
		
		testStampa: function(stampante, opzioni, configurazione_stampa, report, tipo_report) {
			var prompts = {};
    		prompts.pIdenTestata = '0';
    		if (LIB.isValid(baseUser.SHOW_FARMACO_ORIGINALE)) {
    			prompts.pShowOriginale=baseUser.SHOW_FARMACO_ORIGINALE;
    		} else {
    			prompts.pShowOriginale = '1';
    		}
    		if (LIB.isValid(baseUser.POSOLOGIA_RR)) {
				prompts.pPosologiaRR = baseUser.POSOLOGIA_RR;
			} else {
				prompts.pPosologiaRR = 'N';
			}
    		if (typeof configurazione_stampa == 'undefined')
    			configurazione_stampa = null;
    		var obj_print = {
				report: report,
				tipo_report: tipo_report,
				prompts: prompts,
				show: "N",
				output: "pdf",
				stampante: stampante,
				opzioni: opzioni,
				configurazione_stampa: configurazione_stampa
			};
			NS_PRINT.print(obj_print);
		},
		
		testStampaRR: function(stampante, opzioni, configurazione_stampa) {
			this.testStampa(stampante, opzioni, configurazione_stampa, 'FARMACI');
		},
		
		testStampaDema: function(stampante, opzioni) {
			this.testStampa(stampante, opzioni, null, 'FARMACI_DEMA');
		},
		
		/*testStampaRB: function(stampante, opzioni, configurazione_stampa, tipo_report) {
			if (!LIB.isValid(tipo_report)) {
				tipo_report = 'RICETTA_BIANCA';
			}
			this.testStampa(stampante, opzioni, configurazione_stampa, tipo_report);
		}*/
		testStampaRB: function(stampante, opzioni, configurazione_stampa, tipo_report, stampanteRR, parametriRR) {
			if (tipo_report == 'FARMACI'){
				this.testStampa(stampanteRR, parametriRR, configurazione_stampa, 'FARMACI');
			}else{
				this.testStampa(stampante, opzioni, configurazione_stampa, tipo_report);
			}
		}
};

