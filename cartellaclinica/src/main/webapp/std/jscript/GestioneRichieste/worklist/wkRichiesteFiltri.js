var WindowCartella = null;
jQuery(document).ready(function(){
	
	 window.WindowCartella = window;
     while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
         window.WindowCartella = window.WindowCartella.parent;
     }
	
	FILTRI_WK.caricaFiltro();
	FILTRI_WK.replaceSrc("idWkRichieste",FILTRI_WK.carica());
	
	if(WindowCartella.CartellaPaziente.getAccesso('PRE_OPERATORIO')=='VAL_PREOP'){
		NOTE_VPO.carica();
	}
	
	switch (baseGlobal.SITO) {
	case 'ASL2':
		break;
	case 'VERONA':
		if (typeof WindowCartella.$("form[name=EXTERN] input#auto_login").val() === "string" && typeof WindowCartella.CartellaPaziente !== "undefined"){
			WindowCartella.CartellaPaziente.Menu.hide();
			WindowCartella.$("div.chiudi, div.info, div.patient").hide();
		}
		break;
	default:
}
});

var FILTRI_WK = {
	
	addHidWhere:function(nameParameter,newValue,url){

		//Restituisco NULL se non ci sono i parametri
		if(url.indexOf('?') < 0)
		return null;
		
		var campo = ' and SERVIZIO_DESTINATARIO IN (';
		
		var paramList = url.split("?")[1];
		
		//Recupero ogni coppia chiave/valore
		var params = paramList.split("&");
		
		var urlWk = document.EXTERN.KEY_WORKLIST.value + '?';
		
		//Scorro tutte le coppie chiave/valore e le separo
		for(var i=0; i<params.length; i++){

			var temp = params[i].split("=");
			
			if (temp[0] == nameParameter){
				urlWk += temp[0] + '=' + jQuery("#hWhereIniziale").val() + campo + newValue + ')' + '&';
			}else{
				urlWk += params[i]+'&';
			}
		}
		
		return urlWk;
	},
	
	
	addNewParameter:function(nameParameter,newValue){
		
		//Array Associativo che conterrà i parametri presenti
		//in querystring
		var allParams = new Array();
	
		//Recupero la URL visualizzata
		var url = unescape(document.getElementById("idWkRichieste").src);

		//Restituisco NULL se non ci sono i parametri
		if(url.indexOf('?') < 0)
		return null;
		
		var paramList = url.split("?")[1];
		
		//Recupero ogni coppia chiave/valore
		var params = paramList.split("&");
		
		var urlWk = document.EXTERN.KEY_WORKLIST.value + '?';
		
		//Scorro tutte le coppie chiave/valore e le separo
		for(var i=0; i<params.length; i++){

			var temp = params[i].split("=");
			
			if (temp[0] == nameParameter){
				urlWk += temp[0] + '=' + jQuery("#hWhereIniziale").val() + newValue + '&';
			}else{
				urlWk += params[i]+'&';
			}
		}
		return urlWk;
	},
	
	
	azzeraFiltro:function(){
		
		//Array Associativo che conterrà i parametri presenti
		//in querystring
		var allParams = new Array();
		
		//Recupero la URL visualizzata
		var url = unescape(document.getElementById("idWkRichieste").src);
		
		//Restituisco NULL se non ci sono i parametri
		if(url.indexOf('?') < 0)
		return null;
		
		var paramList = url.split("?")[1];
		
		//Recupero ogni coppia chiave/valore
		var params = paramList.split("&");
		
		var urlWk = document.EXTERN.KEY_WORKLIST.value + '?';
		
		//Scorro tutte le coppie chiave/valore e le separo
		for(var i=0; i<params.length; i++){

			var temp = params[i].split("=");
			
			if (temp[0] == 'hidWhere'){
				urlWk += temp[0] + '=' + jQuery("#hWhereIniziale").val() + '&';
			}else{
				urlWk += params[i]+'&';
			}
		}
		
		//alert(urlWk);
		
		jQuery('li').removeClass("pulsanteLISelezionato");
		
		FILTRI_WK.replaceSrc("idWkRichieste",urlWk);
		
	},
	

	carica:function(){
	
		var where = document.EXTERN.hidWhere.value;
		jQuery("#hWhereIniziale").val(where);
		
		var url=FILTRI_WK.getUrlWk();
		var lastValue=jQuery("#hWhereCond").val();
		
		if(lastValue != ''){
			return FILTRI_WK.addHidWhere('hidWhere',lastValue,url);
		}else{
			//alert('url: '+url);
			return url;
		}
	
	},

	
	caricaFiltro:function(){
	
		var tipoFiltro = '30';
		var webuser=baseUser.LOGIN;
		var statementFile = 'Web.xml';
		var statementName = 'getFiltriWkRichiesteSaved';
		var pBinds = new Array();
		var resp='';

		pBinds.push(tipoFiltro);
		pBinds.push(webuser);

		var vResp=WindowCartella.executeQuery(statementFile, statementName, pBinds);
		
		if (vResp.next()){
			//alert(vResp.getString("lastvaluechar"));
			resp = vResp.getString("lastvaluechar");
			jQuery("#hWhereCond").val(vResp.getString("lastvaluechar"));	
		}else{
			resp='';
		}
		
		/******* do la classe a quelli caricati *****************/
		
		if (resp != '' && resp != null){
			
			var split = resp.split(",");
			
			for (var i=0;i<split.length;i++){
				
				var str=split[i];
				var trim=str.substring(1,str.length-1);
				var id='metodica_'+trim;
				
				var _this = document.getElementById(id);
	
				if (!hasClass(_this,"pulsanteLISelezionato")){
					addClass(_this,"pulsanteLISelezionato");
				}else{
					removeClass(_this,"pulsanteLISelezionato");
				}
			}
			 
		}else{
			
			jQuery("#metodica_").addClass("pulsanteLISelezionato");
			jQuery("#metodica_null").addClass("pulsanteLISelezionato");
		}
	},
	

	compilaWhere:function(valore){
		
		valore = "'"+valore+"'";
		
		var split = document.getElementById("hWhereCond").value.split(",");
		
		for (var i=0;i<split.length;i++){
			//alert(split[i]);
			if(split[i] == valore){
				return false;
			}
		}
		
		if(document.getElementById("hWhereCond").value != ''){
			document.getElementById("hWhereCond").value = document.getElementById("hWhereCond").value + ',' + valore;
		}else{
			document.getElementById("hWhereCond").value = valore;
		}
		//alert('document.getElementById("hWhereCond").value '+document.getElementById("hWhereCond").value);
		return true;
		
	},
	
	
	getUrlWk:function(){
	
		var url = unescape(document.location);
		
		//Restituisco NULL se non ci sono i parametri
		if(url.indexOf('?') < 0){
			return null;
		}

		var urlWk = document.EXTERN.KEY_WORKLIST.value + '?';

		urlWk += url.split("?")[1].toString();
			
		
		return urlWk;
	
	},


	removeParameter:function(value){
		
		var split=document.getElementById('hWhereCond').value.split(",");
		var prima=document.getElementById('hWhereCond').value; //per il debug finale
		var whereCond='';
		var valore = "'"+value+"'";
		
		for (var i=0;i<split.length;i++){

			if (valore  != split[i]){
			
				if(whereCond != ''){
					whereCond += ",";
				}
				
				whereCond += split[i];
			}			
		}
		
		document.getElementById('hWhereCond').value = whereCond;
		//alert('prima : '+prima +'\n\ndopo: '+whereCond);
	},
	
	
	replaceSrc:function(idFrame,newUrl){
		
		var filtroSave=jQuery("#hWhereCond").val();
		var tipoFiltro = '30';
		var webuser=baseUser.LOGIN;
		var statementFile = 'Web.xml';
		var statementName = 'setFiltriWkRichiestePaziente';
		var pBinds = new Array();

		pBinds.push(tipoFiltro);
		pBinds.push(webuser);
		pBinds.push(filtroSave);
		pBinds.push(tipoFiltro);
		pBinds.push(webuser);
		//alert('filtroSave: '+filtroSave);
		 
		var vResp=WindowCartella.executeStatement(statementFile, statementName, pBinds);
		
		/*if (vResp[0]=='OK'){
			//jQuery("#hWhereCond").val(vResp[1]);	
		}else{
			alert('Errore:\n\n'+vResp[1]);
		}*/
		
		//rimpiazzo l'src del frame della wk
		setVeloNero(idFrame);
		document.getElementById(idFrame).src=newUrl;
	},
	
	
	scegliServizioDestinatari:function(value){

		var id = "metodica_"+value;
		
		//per chi dovesse parlare perchè ha la lingua in bocca, ho usato javascript perchè jQuery ha problemi con gli id con degli spazi in mezzo
		var _this = document.getElementById(id);

		if (!hasClass(_this,"pulsanteLISelezionato")){
			addClass(_this,"pulsanteLISelezionato");
		}else{
			removeClass(_this,"pulsanteLISelezionato");
			
		}

		if (value == '' || value == 'null'){
			
			jQuery("#hWhereCond").val("");
			FILTRI_WK.azzeraFiltro();
			addClass(_this,"pulsanteLISelezionato");
			return;
			
		}else{
			
			jQuery("#metodica_").removeClass("pulsanteLISelezionato");
			jQuery("#metodica_null").removeClass("pulsanteLISelezionato");
		}
		
		var campo = ' and SERVIZIO_DESTINATARIO IN (';
		
		//FILTRI_WK.compilaWhere(value);
		if(!FILTRI_WK.compilaWhere(value)){
		 	FILTRI_WK.removeParameter(value);
		}
		
		//alert('hWhereCond: '+jQuery("#hWhereCond").val());
		if (jQuery("#hWhereCond").val()==''){
			
			FILTRI_WK.azzeraFiltro();
		
		}else{
			
			var newWhere = campo + jQuery("#hWhereCond").val() + ')';
			var newUrl = FILTRI_WK.addNewParameter('hidWhere',newWhere);
		
			FILTRI_WK.replaceSrc("idWkRichieste",newUrl);
		}

	}
};

var NOTE_VPO = {
		
		carica : function(){
			
			//alert($("#frameWork").contents().find("FORM[name=dati]").height());
			$("#idWkRichieste").height(380);
			
			 $('<iframe>', {
				   src: "servletGenerator?KEY_LEGAME=WK_NOTE_VPO&WHERE_WK= where DELETED='N' AND IDEN_VISITA="+WindowCartella.getRicovero("IDEN")+" ORDER BY DATA_EVENTO DESC",
				   id:  'frameNote',
				   height:230,
				   width:'100%'
				   }).appendTo('body');
			 
			 
		}		
				
		}

