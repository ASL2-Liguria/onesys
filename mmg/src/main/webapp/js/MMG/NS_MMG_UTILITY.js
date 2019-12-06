$(document).ready(function() {
	NS_MMG_UTILITY.setLayout();
	$(document).on("keydown keypress",function(e) {stopDefaultBackspaceBehaviour(e);});
});

function stopDefaultBackspaceBehaviour(event) {
	/* Ispirato da http://stackoverflow.com/questions/1495219/how-can-i-prevent-the-backspace-key-from-navigating-back */
    var event = event || window.event;
    if (event.keyCode == 8) {
        var elements = "HTML, BODY, TABLE, TBODY, TR, TD, DIV";
        var d = event.srcElement || event.target;
        var regex = new RegExp(d.tagName.toUpperCase());
        if (d.contentEditable != 'true') { //it's not REALLY true, checking the boolean value (!== true) always passes, so we can use != 'true' rather than !== true/
            if (regex.test(elements)) {
                event.preventDefault ? event.preventDefault() : event.returnValue = false;
            }
        }
    }
};

var NS_MMG_UTILITY = {
		
		arrayToString:function(arr){
			
			var StringReturn = '';
			for(var i=0;i<arr.length;i++){
				
				if(StringReturn != ''){
					StringReturn += ',';
				}
				
				StringReturn += arr[i];	
			}
			
			return StringReturn;
		},
		
		buttonSelect: function(elemento, callback) {
			if (typeof callback == "object" && typeof callback.before == "function") {
				callback.before();
			}
			elemento.addClass("selected");
			if (typeof callback == "object" && typeof callback != "undefined") {
				elemento.find("span").remove();
				if (typeof callback.text != "undefined") {
					elemento.append("<span>" + callback.text + "</span>");
				}
			}
			elemento.find("i.icon-ok").remove();
			elemento.append("<i class='icon-ok' style='color:green'></i>");
			elemento.find("i.icon-cancel-1").remove();
			if (typeof callback == "object" && typeof callback.after == "function") {
				callback.after();
			}
		},
	
		buttonDeselect: function(elemento, callback) {
			if (typeof callback == "object" && typeof callback.before == "function") {
				callback.before();
			}
			elemento.removeClass("selected");
			if (typeof callback == "object" && typeof callback != "undefined") {
				elemento.find("span").remove();
				if (typeof callback.text != "undefined") {
					elemento.append("<span>" + callback.text + "</span>");
				}
			}
			elemento.find("i.icon-cancel-1").remove();
			elemento.append("<i class='icon-cancel-1' style='color:red'></i>");
			elemento.find("i.icon-ok").remove();
			if (typeof callback == "object" && typeof callback.after == "function") {
				callback.after();
			}
		},
	
		buttonSwitch: function(elemento, callback_select, callback_deselect) {
			if(elemento.hasClass("selected")) {
				NS_MMG_UTILITY.buttonDeselect(elemento, callback_deselect);
				return false;
			} else {
				NS_MMG_UTILITY.buttonSelect(elemento, callback_select);
				return true;
			}
		},
		
		calcoloBMI:function(pAltezza, pPeso){
			
			if (pAltezza == ''){return alert("Inserire l'altezza");}
			if (pPeso == ''){return alert("Inserire il peso");}
			
			var vAltezza	= ((parseFloat(pAltezza.replace(",",".")))/100);
			var vPeso		= parseFloat(pPeso.replace(",","."));

			vAltezza = vAltezza * vAltezza;
			
			var vBMI = vPeso/vAltezza;
			
			return vBMI.toFixed(2).toString().replace(".",",");	
		},
		
		isNumeric: function(value)
		{
			return new RegExp("^[0-9]*(\,)?[0-9]+$").test(value);
		},
		
		checkIsNumber:function(value){
			if(value!= '' && isNaN(value.replace(',','.'))){
				return false;
			}else{
				return true;
			}
		},

		checkPermessoSpecialista:function(arrSelector){

			if(!home.PERMESSI.consensoSpecialista()){
				
				$(arrSelector).each(function(k,v){
								
					//metto il bordo sui campi indicati nell'array dei selettori
					v.css("border","2px solid red");
					
					//aggiungo l'icona che spiega l'avviso
					var icona = NS_MMG_UTILITY.infoPopup( home.traduzione.lblDeniedSpecialista, {"color":"red", "title":home.traduzione.lblDeniedSpecialistaTitle});
					v.parent().append( icona );
				});
				
				//aggiungo la notifica in modo che l'utente venga avvisato
				 home.NOTIFICA.warning({
					title:home.traduzione.lblTitleAttenzionePrivacy,
					message:home.traduzione.lblDeniedSpecialista,
					timeout:"60"
				});
			}
		},
		
		checkPresenzaInArray:function(arrayIn, valore){
			var controllo=false;
			for(var e=0;e<arrayIn.length;e++){
				//alert(arrayIn[e] + ' ' + valore)
				if(arrayIn[e] == valore){
					controllo=true;
					break;
				}
			}
			return controllo;
		},
		
		containsCdc: function(obj, cdc) {
			return (typeof obj[cdc] != 'undefined');
		},
		
		convertData:function(obj){
			if(obj.indexOf("/") > -1){
				obj = obj.replace(/\//g,"").toString();
				return obj.substring(4,8) + obj.substring(2,4) + obj.substring(0,2);
			}else{
				return obj.substring(6,8) +  "/" + obj.substring(4,6) + "/" + obj.substring(0,4);
			}
			
		},
		
		createOption:function(valore,descrizione){
		       
			   var me=this;
		       me.opt=$("<option>");

		       me.opt.html(descrizione);
		       me.opt.val(valore);

		       return me.opt;
		},
		
		getAttr: function(element, attr, default_value) {
			var attributo;
			if (typeof element.attr == "function") {
				attributo = element.attr(attr);
			} else {
				attributo = element[attr];
			}
			if (typeof attributo != "undefined") {
				return attributo;
			} else {
				if (typeof default_value == "undefined") {
					return "";
				} else {
					return default_value;
				}
			}
		},
		
		getContext:function(){
			
			var base='http://'+document.location.host + document.location.pathname;
			
			//recupero gli indici degli slash, per poterlo spezzettare a mio piacimento
			var firstSlash	=	base.indexOf("/",0);
			var secondSlash	=	base.indexOf("/", firstSlash + 1);
			var thirdSlash	= 	base.indexOf("/", secondSlash + 1);
			var fourthSlash	=	base.indexOf("/", thirdSlash + 1);
			
			return base.substring(0,thirdSlash);
		},
		
		getDettaglioConsenso:function(){
			
			var messaggio = traduzione.lblCatConsensoNegato;
			
			$(home.PERMESSI.getPermessiNegati()).each(function(idx, value){
				
				messaggio += '\n- '+value;
			});
			
			return messaggio;
		},
		
		getHeightPercent:function(percentage){
			/*
			 * percentage in number
			 */
			var h = LIB.getHeight();
			var height = (h/100)*percentage;
			return height;
		},
		
		getWidthPercent:function(percentage){
			/*
			 * percentage in number
			 */
			var h = LIB.getWidth();
			var width = (h/100)*percentage;
			return width;
		},
		
		getLabelInformativa:function(param){

			/*  Questo è il parametro che si aspetta in entrata
			 * 	param = {
			 * 	
			 * 		id				: id della label (non obbligatoria)
			 * 		id_div			: id dell'oggetto div contenitore (non obbligatoria)
			 * 		height			: altezza della label informativa (non obbligatoria)
			 * 		width			: larghezza della label informatia (non obbligatoria)
			 *  	colSpan 		: colspan (non obbligatoria)
			 *		testo			: testo dell'informativa (obbligatorio)
			 *		button_close 	: true/false per avere o meno il tasto di chiusura (non obbligatoria)
			 *		tr				: true/false per farsi restituire il div in un tr o meno
			 *  }
			 *  
			 *  esempio di istruzione per richiamare la funzione:
			 *  $("#fldSospettoDiagnostico .campi").append(NS_MMG_UTILITY.getLabelInformativa({text : 'Prova di label'}));
			 *  
			 *  qui ad una tabella viene appesa la label; in questo caso viene restituita in un tr
			 */
			
			

			var obj = {
				id				: typeof param.id != 'undefined' ? param.id : 'lblInformativa',
				id_div			: typeof param.id_div != 'undefined' ? param.id_div : 'divInformativa',
				colSpan 		: typeof param.colSpan != 'undefined' ? param.colSpan : '8',
				text			: param.text,
				button_close 	: typeof param.button_close != 'undefined' ? param.button_close : true,
				tr			 	: typeof param.tr != 'undefined' ? param.tr : true
			}

			var tr =  $(document.createElement("tr"));
			var td =  $(document.createElement("td"));
			td.attr("colSpan", obj.colSpan);
			td.width("100%")
			var div = $(document.createElement("div"));
			div.attr({ "id" : obj.id_div, "colSpan" : obj.colSpan });
			div.addClass("informativa");
			var label = $("<label></label>");
			label.attr({"id" : obj.id});
			label.html(obj.text);
			div.append(label);
			
			if(obj.button_close){
				var iconClose = $(document.createElement("i"));
				iconClose.addClass('icon-cancel-squared').attr({'title': 'Elimina'});
				iconClose.attr("id","btClose");
				iconClose.on('click', function(){
					$("body").find("#"+obj.id_div).hide();
					$("#btClose").hide();
				});
			}
			
			if(obj.tr){
				td.append(div);
				tr.append(td);
				tr.append(iconClose);
				return tr;
			}else{			
				div.append(iconClose);
				return div;
			}
		},
		
		getObjectPropertiesAsArray: function(obj) {
			var arr = new Array();
			for (var x in obj) {
				arr.push(x);
			};
			return arr;
		},
		
		getObjectPropertiesAsString: function(obj) {
			var stringa = "";
			for (var x in obj) {
				if (stringa != "")
					stringa += ",";
				stringa += x;
			};
			return stringa;
		},
		
		getUrlParameter:function( name ){
			var regexS = "[\\?&]"+name+"=([^&#]*)";
			var regex = new RegExp( regexS );
			var tmpURL = window.location.href;
			var results = regex.exec( tmpURL );
			
			if( results == null ){ 
				return "";
			}else{
				return results[1]; 
			}
		},
		
		giorni_differenza:function(dataIso2, dataIso){

			var dataIso1 = '';
			
			if(typeof dataIso1 == 'undefined' || dataIso1 == ''){
				dataIso1 = moment().format('YYYYMMDD');				
			}else{
				dataIso1 = dataIso;
			}
			
			var anno1 = parseInt(dataIso1.substr(0, 4),10);
			var mese1 = parseInt(dataIso1.substr(4, 2),10);
			var giorno1 = parseInt(dataIso1.substr(6, 2),10);
			
			var anno2 = parseInt(dataIso2.substr(0, 4),10);
			var mese2 = parseInt(dataIso2.substr(4, 2),10);
			var giorno2 = parseInt(dataIso2.substr(6, 2),10);

		    var dataok1=new Date(anno1, mese1-1, giorno1);
			var dataok2=new Date(anno2, mese2-1, giorno2);
			
			var differenza = dataok1-dataok2; 
			var giorni_differenza = (differenza/86400000);
			
			//alert(giorni_differenza+' giorni di differenza');
			return giorni_differenza;
		},
		
		infoPopup: function(text, param, object){
			var width				= (typeof param.width == 'undefined' || param.width == '') ? 'auto' : param.width ;
			var height				= (typeof param.height == 'undefined' || param.height == '') ? 'auto' : param.height ;
			var title 				= (typeof param.title == 'undefined' || param.title == '') ? 'NOTA' : param.title ;
			var color				= (typeof param.color == 'undefined' || param.color == '') ? '#274069' : param.color ;
			var startAsVisible 		= (typeof param.startAsVisible == 'undefined' || param.startAsVisible == '') ? true : param.startAsVisible  ;
			var arrowPosition		= (typeof param.arrowPosition == 'undefined' || param.arrowPosition == '') ? 'left' : param.arrowPosition ;
			
			var id =  (typeof object != 'undefined') ? ((typeof object.attr("id") != 'undefined') ? object.attr("id") : '') : '';
			
			var iIcon = $(document.createElement("i"))
				.addClass("icon-info-circled")
				.css("color",color)
				.attr('id', id + '_Iicon')
				.on("click", function( event ){
					event.stopImmediatePropagation();
					$("div.popup.visible").hide();
					$(this).closest('td').Popup({
						width			: width,
			            height			: height,
			            title			: title,
			            content			: text,
			            startAsVisible	: startAsVisible,
			            arrowPosition	: arrowPosition,
			            mousePosition	: event
					});
			});
			if (typeof object != 'undefined'){
				object.append(iIcon);
			} else {
				return iIcon;
			}
		},
		
		insertPromemoria:function(obj,callback){
			
			/*
			 * lucas - funzione generica per inserire promemoria
			 * deve essere richiamata con un oggetto 
			 * obj = { 
			 * 	iden_anag : '',
			 * 	text : '',
			 * 	note : '',
			 * 	data_inizio : '',
			 * 	data_fine : '',
			 * 	priorita : '',
			 *  iden_riferimento : '',
			 *  tabella_riferimento : ''
			 * }
			 * 
			 * con almeno valorizzata la voce text, per il resto ci pensa la funzione in caso di mancanza di valori
			 */ 
			
			//controllo se ho una funzione di callback
			if(typeof callback == 'undefined'){
				callback = function( response ){
					//se si vuole mettere notifica di successo del salvataggio o inserire qualcosa nel logger
				};
			}
			
			//se non ho il testo della funzione che cacchio salvo a fare
			if(typeof obj.text == 'undefined' || obj.text == ''){
				return;
			}
			
			var idenAnag			= (typeof obj.iden_anag == 'undefined') ? '' : obj.iden_anag ;  
			if( idenAnag == '' )
				idenAnag = obj.iden_anagrafica;
			
			var note				= (typeof obj.note == 'undefined') ? 'Questo promemoria e\' stato inserito automaticamente' : obj.note ;
			var dataFine			= (typeof obj.data_fine == 'undefined') ? '' : obj.data_fine ; 
			var idenRiferimento 	= (typeof obj.iden_riferimento == 'undefined') ? '' : obj.iden_riferimento ;
			var tabellaRiferimento 	= (typeof obj.tabella_riferimento == 'undefined') ? '' : obj.tabella_riferimento ;
			var dataInizio			= (typeof obj.data_inizio == 'undefined' ||  obj.data_inizio == '') ? moment().format('YYYYMMDD') : obj.data_inizio;
			var priorita 			= (typeof obj.priorita == 'undefined' ||  obj.priorita == '') ? '3' : obj.priorita ;
			var sezione 			= (typeof obj.sezione == 'undefined' ||  obj.sezione == '') ? 'BACHECA_GENERICO' : obj.sezione ;
			
			var parameters = {
				
				nIdenAnagrafica 	: idenAnag,
				vDescrizione 		: obj.text, /*obbligatorio*/
				vDataInizio 		: dataInizio, 
				vDataFine 			: dataFine, 
				nPriorita 			: priorita, 
				vSezione 			: sezione, 
				vNote 				: note, 
				nIdenRiferimento	: idenRiferimento, 
				vTabellaRiferimento : tabellaRiferimento
			};
			
    		dwr.engine.setAsync(false);
			toolKitDB.executeFunction( 'SAVE_PROMEMORIA_BACHECA', parameters , callback);
			dwr.engine.setAsync(true);
			
		},
			
		outerHTML:function(obj){
	
			var div=document.createElement("DIV");
			$(div).html(obj);
			
			var outer = $(div).html();
			
			return outer;
		},
		
		//sostituisce il punto con la virgola
		removePointer:function(StrisciaId){
			
			var split = StrisciaId.split(",");
			
			for (var i=0;i<split.length;i++){
				var value = jQuery("#"+split[i]).val();
				value = value.replace(".", ",");
				jQuery("#"+split[i]).val(value);
			}
			
		},
		
		removeVeloNero:function(id) {
			if(!$.browser.msie){
				return;
			}
			$('div.velonero[name="'+id+'"]').remove();
		},
		
		replaceAll:function(find, replace, str) {
			/*find : stringa da sostituire
			 * replace : stringa che rimpiazza
			 * str : testo dove deve essere effettuato il replace
			 */
			  return str.replace(new RegExp(find, 'g'), replace);
		},
		
		setLayout:function(){
			
			var height = typeof jQuery("#HEIGHT") != 'undefined'?jQuery("#HEIGHT").val():"100%";
			var width  = typeof jQuery("#WIDTH") != 'undefined'?jQuery("#WIDTH").val():"100%";
			
			if(parent.name == 'home'){
				jQuery("body#page").css({"height":height+'px', "width":width+'px'});
			}
		},
		
		setTitleObject:function(idObj, title){
			$("#"+idObj).attr("title",title);
		},
		
		setVeloNero:function(id) {
			
			if(!$.browser.msie){
				return;
			}
			
			//alert('setVeloNero '+id);
			var obj = document.getElementById(id);
			
			var objPosition = $(obj).position();
			var objWidth = $(obj).width();
			var objHeight = $(obj).height();
			var div = document.createElement('div');
			
			div.className='velonero';
			div.name=obj.id;
			document.body.appendChild(div);
			
			$(div).css({'position':'absolute','top':objPosition.top,'left':objPosition.left});
			$(div).height(objHeight);
			$(div).width(objWidth);
		},
		
		trace_p_nome_client: null,
		
		trace:function(action, iden_anag, iden_tabella, stato, id) {
			
			if (!LIB.isValid(iden_anag))
				iden_anag = null;
			
			if (!LIB.isValid(iden_tabella))
				iden_tabella = null;
			
			if (!LIB.isValid(stato))
				stato = null;
			
			var p_nome_client;
			
			try {
				if (NS_MMG_UTILITY.trace_p_nome_client != null) {
					p_nome_client = NS_MMG_UTILITY.trace_p_nome_client;
				} else {
					p_nome_client = home.AppStampa.getSystemInfo() + "#Browser: " + navigator.userAgent;
					NS_MMG_UTILITY.trace_p_nome_client = p_nome_client;
				}
			} catch (e) {
				p_nome_client = "";
				NS_MMG_UTILITY.trace_p_nome_client = "";
			}
			
			var param = {};
			param.p_username = home.baseUser.USERNAME;
			param.p_iden_per = home.baseUser.IDEN_PER;
			param.p_ip = home.basePC.IP;
			param.p_serverweb = window.location.host;
			param.p_action = action;
			param.p_nome_client = p_nome_client;
			param.p_iden_anag = iden_anag;
			param.p_iden_esame = iden_tabella;
			param.p_iden_ref = null;
			if (!LIB.isValid(id))
				id = null;
			param.p_id = id;
			param.p_funzione = 'MMG';
			param.p_stato = stato;
			param.p_reparto = null;
			toolKitDB.executeProcedureDatasource("MMG_CONFIG.TRACE_USER_ACTION","MMG_DATI",param,function(resp){
				if (resp.result == 'KO')
					alert("Errore");
			});
		},
		infoPaziente : {
			show:function() {

				var rilevazioni = $.parseJSON(home.ASSISTITO.RILEVAZIONI);
				var peso = rilevazioni['PESO']!=null?rilevazioni['PESO']+"kg":"non rilevato";
				var altezza = rilevazioni['ALTEZZA']!=null?rilevazioni['ALTEZZA']+"cm":"non rilevata";
				var vMsg = "Peso : "+peso+"<br/>Altezza : "+altezza;
				
				NOTIFICA.info({
		            message: vMsg,
		            timeout:0
		        });
			},
			hide:function(){
				$(".ambiance-info").remove();
			}
		},
		
		parseXml:function(xml) {
			   var dom = null;
			   if (window.DOMParser) {
			      try { 
			         dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
			      } 
			      catch (e) { dom = null; }
			   }
			   else if (window.ActiveXObject) {
			      try {
			         dom = new ActiveXObject('Microsoft.XMLDOM');
			         dom.async = false;
			         if (!dom.loadXML(xml)) // parse error ..

			            window.alert(dom.parseError.reason + dom.parseError.srcText);
			      } 
			      catch (e) { dom = null; }
			   }
			   else
			      alert("cannot parse xml string!");
			   return dom;
		},
		
		stripHTML: function(html) {
			var tmp = document.createElement("DIV");
			tmp.innerHTML = html;
			return tmp.textContent || tmp.innerText || "";
		}
};

var NS_LISTBOX = {
		//ValOrText VALUE or TEXT
		Text:null,
		Values:null,
		Options:null,
		inDefault:false,
		search:function(objList,String){
			NS_LISTBOX.cache(objList);
			NS_LISTBOX.filter(objList,String);
		},
		cache:function(objList){
				NS_LISTBOX.Text = new Array();
				NS_LISTBOX.Values = new Array();
				if(!NS_LISTBOX.inDefault){
					NS_LISTBOX.Options = $("option",objList);
					NS_LISTBOX.inDefault = true;
				}
				
				var options = $("option",objList);
				NS_LISTBOX.Options.each(function(){
					NS_LISTBOX.Text.push(this.text);
					NS_LISTBOX.Values.push(this.value);
				});
		},
		getText:function(){
			return NS_LISTBOX.Text;
		},
		getValues:function(){
			return NS_LISTBOX.Values;
		},
		addItem:function(objList,text, value) {

	         var opt=$("<option>");
	         opt.html(text);
	         opt.val(value);

	         $(objList).append(opt);

	    },
	    filter:function(objList,String) {
	    	objList.empty();
	        for (var i = 0; i < NS_LISTBOX.Text.length; i++) {
	            if (NS_LISTBOX.Text[i].toUpperCase().indexOf(String.toUpperCase()) != -1) {
	            	NS_LISTBOX.addItem(objList,NS_LISTBOX.Text[i], NS_LISTBOX.Values[i]);
	            }

	        }
	    },
	    get_default:function(){
	    	return NS_LISTBOX.Options;
	    },
	    set_new_default:function(objList){
	    	NS_LISTBOX.Options = $("option",objList);
	    	NS_LISTBOX.inDefault = true;
	    	return true;
	    },
	    backDefault:function(objList){
	        if(NS_LISTBOX.Options != null){
	            objList.empty();
	            NS_LISTBOX.Options.each(function(){
	                NS_LISTBOX.addItem(objList,this.text,this.value);
	            });
	        }
	    }
};

/*
 * MMG_CHECK gestira' accesso alle funzioni, messaggi di errore, eventuale apertura in sola lettura
 */

var MMG_CHECK = {
		
		check: function(pagina, data) {
			
			if ( LIB.isValid(MMG_CHECK_CASE[pagina] )) {
				return MMG_CHECK_CASE[pagina](data);
			} else
				return MMG_CHECK.nothing();
		},
		
		nothing: function() {
			return true;
		},
		
		isAdministrator:function() {
			var bool = false;
			try {
				bool = home.basePermission.MMG.SUPER_ADMIN=="S";
			} catch (e) {
				bool = false;
			}
			if (bool) {
				home.NOTIFICA.info({
					title:"Accesso consentito",
					message:"Utente amministratore"
				});
			}
			return bool;
		},
		
		isDead:function(){
			if(home.ASSISTITO.DATA_MORTE != '' && home.ASSISTITO.DATA_MORTE != null ){
				home.NOTIFICA.error({
					title: "Attenzione",
					message: home.traduzione.lblDeniedMorte
				});
				return false;
			}else{
				return true;
			}
		},
		
		isMedico:function() {
			
			if(LIB.isValid(home.baseUser.TIPO_UTENTE) && home.baseUser.TIPO_UTENTE == 'M') {
				return true;
			}else{
				return false;
			}
		},
		
		isPediatra:function() {
			
			if(LIB.isValid(home.basePermission.MMG.PEDIATRA) && home.basePermission.MMG.PEDIATRA == 'S') {
				return true;
			}else{
				return false;
			}
		},
		
		isPediatraAmm:function() {
			
			if(home.baseUser.GRUPPO_PERMESSI.indexOf("PLS_AMM") >= 0) {
				return true;
			}else{
				return false;
			}
		},
		
		isMedicoCheck:function( params ) {
			
			var msg;
			if (LIB.isValid(params) && LIB.isValid(params.message)) {
				msg = params.message;
			} else {
				msg = "La funzionalit\u00E0 \u00E8 abilitata solamente per utenti medici";
			}
			var ttl;
			if (LIB.isValid(params) && LIB.isValid(params.title)) {
				ttl = params.title;
			} else {
				ttl = "Attenzione";
			}
			
			if(baseUser.TIPO_UTENTE == 'M') {
				return true;
			} else {
				home.NOTIFICA.error({
					title: ttl,
					message: msg
				});
				return false;
			}
		},
		
		isMedicoAssistito:function() {
			
			if(home.ASSISTITO.isAssistitoGruppo()) {
				return true;
			} else {
				home.NOTIFICA.error({
					title: "Attenzione",
					message: "Non \u00E8 permesso visualizzare dati di assistiti di altri medici."
				});
				return false;
			}
		},
		
		isAccessoSSN:function() {
			return !(home.CARTELLA.REGIME == "LP" ||  home.CARTELLA.REGIME == "AC"); 
		},
		
		isMedIniz:function(){
			
			if(home.baseUser.GRUPPO_PERMESSI.indexOf("MED_INIZ") >= 0) {
				return true;
			}else{
				return false;
			}
			
		},
		
		checkFunctionAccesso:function() {
			if(MMG_CHECK.isAccessoSSN()) {
				return true;
			} else {
				home.NOTIFICA.error({
					title: "Attenzione",
					message: "Non \u00E8 permesso visualizzare la funzione in regime " + home.CARTELLA.REGIME
				});
				return false;
			}
		},
		
		checkModuloOpen:function(iden_med_base) {
			
			if (ASSISTITO.isAssistitoGruppo(iden_med_base) || home.MMG_CHECK.isAdministrator()) {
				return true;
			} else {
				home.NOTIFICA.error( { message : 'Accesso consentito solo al medico curante del paziente, ai suoi collaboratori e associati', title : 'Accesso negato' } );
				return false;
			}
		},
		
		checkOpenPS:function(){
			if(MMG_CHECK.isMedicoAssistito() || home.MMG_CHECK.isAdministrator()) {
				return NS_MMG.apriPatientSummary();
			} else {
				return false;
			}
		},
		
		tempConsensoVisioneDatiASL:function(iden_anag) {
			if (typeof iden_anag == 'undefined') {
				iden_anag = home.ASSISTITO.IDEN_ANAG;
			}
			var controllo = typeof home.baseGlobal.IDEN_ANAG_PRIVACY != 'undefined' ? true : false;
			
			if (!controllo){return true;};
			
			var arrayPrivacy = home.baseGlobal.IDEN_ANAG_PRIVACY.split(',');
			var pReturn = NS_MMG_UTILITY.checkPresenzaInArray(arrayPrivacy,iden_anag);
			
			return !pReturn;
		},
		
		/*PRIVACY*/
		consensoVisioneDatiASL:function(iden_anag, permessi_lettura){
			var temp_consenso = MMG_CHECK.tempConsensoVisioneDatiASL(iden_anag);
			if((home.PERMESSI.visioneDatiAsl(permessi_lettura) && temp_consenso)){
				return true;
			} else {
				var message;
				if (temp_consenso) {
					message = "Dati non disponibili in quanto il paziente ha negato il consenso privacy alla creazione del proprio fascicolo sanitario su sistema Onesys, o la sua consultazione da parte dei MMG";
				} else {
					message = home.traduzione.lblDeniedVisualizzazioneDati;
				}
				home.NOTIFICA.error({
					title: "Attenzione",
					message: message
				});
			}
		},
		
		oscuramenti: function(){
			if (ASSISTITO.isMioAssistito() || home.MMG_CHECK.isAdministrator()) {
				return true;
			} else {
				home.NOTIFICA.error({
					title : 'Accesso negato',
					message : 'Accesso consentito solo al medico curante del paziente'
				});
				return false;
			}
		},
		
		checkDocumenti: function() {
			return (
					(
					MMG_CHECK.isMedicoCheck()
					&& MMG_CHECK.isMedicoAssistito()
					&& MMG_CHECK.consensoVisioneDatiASL()
					&& MMG_CHECK.checkFunctionAccesso()
					)
					|| home.MMG_CHECK.isAdministrator()
				);
		},
		
		checkOpenPT: function() {
			return MMG_CHECK.isMedicoAssistito() || home.MMG_CHECK.isAdministrator();
		},
		
		canDeleteSilent: function(iden_utente, iden_med, gruppo) {
			return home.ASSISTITO.isMioAssistito()
					|| home.baseUser.IDEN_PER == iden_utente
					|| home.baseUser.IDEN_PER == iden_med
					|| (gruppo && home.UTENTE.inMyGroup(iden_med))
					|| home.MMG_CHECK.isAdministrator();
		},
		
		canDelete: function(iden_utente, iden_med, gruppo) {
			var can = MMG_CHECK.canDeleteSilent(iden_utente, iden_med, gruppo);
			if (!can) {
				home.NOTIFICA.error({
					title: "Impossibile cancellare",
					message: "Dato non inserito dall'utente, o assistito associato ad altro medico"
				});
			}
			return can;
		},
		
		//controlla se l'assistito ha dato il consenso al trattamento dei dati o meno
		checkConsenso: function(data, vSezione){
			
			
			/*data deve essere di questo tipo
			 * 
			 * data = {
			 *  CONSENSO_PRIVACY_MMG:'',
			 *  IDEN_ANAG:'',
			 *  PERMESSI_LETTURA:''
			 * }
			 */
			
			var consenso 		= data.CONSENSO_PRIVACY_MMG;
			var controllo 		= vSezione == 'DATI_DOCUMENTI' ? home.PERMESSI.visioneDatiAsl(data.PERMESSI_LETTURA) : true;
			var idenAnag 		= data.IDEN_ANAG;
			var descrMsg 		= '';
			var ret				= {
					semaforo: $.Deferred(),
					bool: false
			};
			
			home.$.NS_DB.getTool({_logger : home.logger}).call_function({
				id:'MMG_PERMESSI.VERIFICA_VUA',
				parameter:{
					"n_iden_utente" : { v : home.baseUser.IDEN_PER, t : 'N'},
					"n_iden_anag" 	: { v : data.IDEN_ANAG, t : 'N'}
				}
			
			}).done( function(response) {
				if(consenso == 'N' || response.p_result == 0) {
					ret.bool = false;
					descrMsg = home.traduzione.lblDeniedTrattamentoDati;
				}else{
					ret.bool = controllo;
					descrMsg = home.traduzione.lblDeniedVisualizzazioneDati;
				}
				
				//controllo per utente amministratore
				if( ret.bool == false && home.MMG_CHECK.isAdministrator() ){
					home.NOTIFICA.warning({ message : 'Consenso negato, accesso consentito ad utente amminstratore', title : 'Administrator' });
					ret.bool = true;
				}
				
				if(!ret.bool){
					
					var arrayButton = 	new Array();
					
					arrayButton.push( {
						label: traduzione.butAnnulla, 
						action: function () { home.$.dialog.hide(); }
					});
					
					home.$.dialog(descrMsg,{
						'id'				: "dialog",
						'title'				: 'PRIVACY',
						'ESCandClose'		: true,
						'created'			: function(){ $('.dialog').focus(); },
						'width'				: 800,
						'showBtnClose'		: false,
						'modal'				: true,
						'movable'			: true,
						'buttons'			: arrayButton
					});
				}
				ret.semaforo.resolve();
			});
			
			return ret;
		}
};

var MMG_CHECK_CASE = {
		/*pagine:*/
		'CONSENSO_PRIVACY_MMG'								: MMG_CHECK.checkModuloOpen,
		'DATI_STRUTTURATI'									: MMG_CHECK.checkDocumenti,
		'DOCUMENTI'											: MMG_CHECK.checkDocumenti,
		'DOCUMENTI_ALLEGATI'								: MMG_CHECK.checkOpenPT,
		'DOCUMENTI_PAZIENTE'								: MMG_CHECK.checkDocumenti,
		'INSERIMENTO_RILEVAZIONI'							: MMG_CHECK.isDead,
		'MMG_INS_PIP'										: MMG_CHECK.isDead,
		'MMG_INS_PIP&ID_WK=WK_PIP' 							: MMG_CHECK.isDead,
		'MMG_INSERIMENTO_VACCINO'							: MMG_CHECK.isDead,
		'MMG_INSERIMENTO_VACCINO&TIPOLOGIA=ANTINFLUENZALE'	: MMG_CHECK.isDead,
		'MMG_MODULO_AMMISSIONE_RETE_SERVIZI'				: MMG_CHECK.isDead,
		'MMG_MODULO_DISPOSITIVI_DIABETE'					: MMG_CHECK.isDead,
		'MMG_MODULO_ELETTROMIOGRAFIA'						: MMG_CHECK.isDead,
		'MMG_MODULO_MALATTIA_INFETTIVA_NOT'					: MMG_CHECK.isDead,
		'MMG_MODULO_MALATTIA_INFETTIVA_PED'					: MMG_CHECK.isDead,
		'MMG_MODULO_PET'									: MMG_CHECK.isDead,
		'MMG_MODULO_PORTO_ARMI'								: MMG_CHECK.isDead,
		'MMG_MODULO_REAZIONE_AVVERSA'						: MMG_CHECK.isDead,
		'MMG_MODULO_RM'										: MMG_CHECK.isDead,
		'MMG_MODULO_RSA'									: MMG_CHECK.isDead,
		'MMG_MODULO_SPORT_PLS'								: MMG_CHECK.isDead,
		'MMG_MODULO_TC'										: MMG_CHECK.isDead,
		'MMG_PATIENT_SUMMARY'								: MMG_CHECK.checkOpenPS,
		'MMG_PRIORITA_CLINICA'								: MMG_CHECK.isDead,
		'MMG_SCREENING'										: MMG_CHECK.isDead,
		'MMG_WK_PT'											: MMG_CHECK.checkOpenPT,
		'MODULO_PATENTE'									: MMG_CHECK.isDead,
		'NUOVO_ACCESSO' 									: MMG_CHECK.isDead,
		'OSCURAMENTI_PAZIENTE'								: MMG_CHECK.oscuramenti,
		'RIEPILOGO'											: MMG_CHECK.checkMedPermission,
		'RILEVAZIONE_ALCOL'									: MMG_CHECK.isDead,
		'RILEVAZIONE_FUMO'									: MMG_CHECK.isDead,
		
		/*funzioni, ipotesi:*/
		'RICETTA_FARMACI_rimuoviBlocco'						: MMG_CHECK.isMedicoCheck
};

