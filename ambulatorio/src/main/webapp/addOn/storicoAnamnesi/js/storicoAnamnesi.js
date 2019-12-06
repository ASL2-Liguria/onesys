


// JavaScript Document
// *******************
var tipoApertura = "INSERIMENTO"; // INSERIMENTO / MODIFICA
var params;


function getParams() {
	try{
		var idx = document.URL.indexOf('?');
		if (idx != -1) {
			var tempParams =  new Hashtable();
			var pairs = document.URL.substring(idx+1,document.URL.length).split('&');
			for (var i=0; i<pairs.length; i++) {
				nameVal = pairs[i].split('=');
				tempParams.put(nameVal[0],nameVal[1]);
			}
			return tempParams;
		}
	}
	catch(e){
		alert("getParams - Error:  "+ e.description);
	}
}	
function getHomeFrame(){
	var objHomeFrame;
	
	try{
		if (params.get("sorgente")=="worklist"|| params.get("sorgente")=="scarico_prestazioni" ||
			params.get("sorgente")=="accetta_prenotato"|| params.get("sorgente")=="inserimento_esame_wkAnag" || 
			params.get("sorgente")=="worklistAnag" || params.get("sorgente")=="inserimento_esame_wk"){
			objHomeFrame = top;
		}
		else{
			objHomeFrame = parent.top.opener.top;
		}
	}
	catch(e){alert(e.description);}
	return objHomeFrame;
}

function init(){
	try{
		params = getParams();
		caricaDettaglio();

		$( '#btImporta' ).button().click(function( event ) {
			event.preventDefault();
			// carico dati  del paziente
			importaAmnesi();
		}).css("width","100%");		


	}
	catch(e){
		alert("init - Error:  "+ e.description);
	}
	finally{
		showLoader(false);
	}
}

function chiudi(){
	parent.$.fancybox.close();						
}


function showLoader(bolShow){
	if (bolShow){
		$("body").oLoader({
		  wholeWindow: true, //makes the loader fit the window size
		  lockOverflow: true, //disable scrollbar on body						  
		  backgroundColor: '#000',
		  fadeInTime: 1000,
		  fadeLevel: 0.4,
		  image: '../../std/jscript/jQueryOloader/images/ownageLoader/loader4.gif',
		  fadeOutTime: 1000,
		  fadeLevel: 0.8
		});
		
		
	}
	else{
		 $("body").oLoader('hide');		
	}
}
// *******************



// *******************

function caricaDettaglio(){
	try{
		
		// resetto variabili locali
		$("#containerTesto").empty().html("");
		$("#containerTesto").data( "idDettaglio", "" );
		$("#containerTesto").data( "testoDocumento", "" );
		$("#containerTesto").data( "testoDocumento_html", "" );		
		
	
		$("#TAB_STORICO tbody").html("");
		var tbody = "", cf ="";
		//***************
		try{var rsID1 = getHomeFrame().executeQuery('storicoAnamnesi.xml',"getAnagID1",[params.get("idenAnag")]);}catch(e){alert("Error on getAnagID1"); return false;}		
		if (rsID1.next()){
			cf = rsID1.getString("id1");
		}
		// tappullo da togliere !!!
//		cf="TRDLLD43B60I637O";
		// *****************************
		if (cf==""){
			alert("Identificativo anagrafico non valido, iden: " + params.get("idenAnag"));
			return false;
		}
		var linkOpen= "";
		var oldIdenDettaglio = ""
		try{var rs = getHomeFrame().executeQuery('storicoAnamnesi.xml',"getElencoAnamnesi",[cf]);}catch(e){alert("Error on getElencoAnamnesi" ); return false;}
		while (rs.next()){
			// controllare se è lo stesso iden_dettaglio ??
			if (oldIdenDettaglio != rs.getString("iden_dettaglio")){
				oldIdenDettaglio = rs.getString("iden_dettaglio");
				linkOpen= "onclick='javascript:apriAnamnesi(" + rs.getString("IDEN_DETTAGLIO")+ ",this);'";
//				tbody  += "<tr " + linkOpen +"><td><a href='#' onclick='javascript:apriAnamnesi(" + rs.getString("iden_dettaglio")+ ");'>Apri</a></td>";				
				tbody  += "<tr " + linkOpen +" id='TR_" + rs.getString("iden_dettaglio")+"'>";				
				//tbody += "<td>" +  rs.getString("IDEN_DETTAGLIO") + "</td>";			
				tbody += "<td>" +  rs.getString("REPARTO") + "</td>";
				tbody += "<td>" +  rs.getString("DATA_INIZIO") + "</td>";			
				tbody += "<td>" +  rs.getString("DATA_FINE") + "</td>";						
				tbody += "</tr>"	;
		 	}
			else{
				// stesso referto / lettera
				// tbd				
			}
		}
		$("#TAB_STORICO tbody").html(tbody);
	}
	catch(e){
		alert("caricaDettaglio - Error:  "+ e.description);		
	} 		
}


function apriAnamnesi(idDettaglio,oggetto){
	var testo_html = "";
	try{
		if (idDettaglio==""){
			alert("Errore grave, dati non validi");
			return;
		}
		$("#containerTesto").empty();
		try{var rs = getHomeFrame().executeQuery('storicoAnamnesi.xml',"getAnamnesi",[idDettaglio]);}catch(e){alert("Error on getAnamnesi" ); return false;}
		if (rs.next()){		
		
			//PATOLOGIE,  POSITIVITA,  PAT_REMOTA,  RACCORDO_PAT_REMOTA
			if (rs.getString("PATOLOGIE")!=""){
				testo_html += "<p><b>Patologie</b></p><br/>";
				testo_html += rs.getString("PATOLOGIE");				
			}
			if (rs.getString("POSITIVITA")!=""){
				testo_html += (testo_html==""?"<p><b>Positivit&agrave;</b></p><br/>":"<br/><b><p>Positivit&agrave;</b></p><br/>");
				testo_html += rs.getString("POSITIVITA");				
			}		
			if (rs.getString("PAT_REMOTA")!=""){
				testo_html += (testo_html==""?"<p><b>Patologia remota</b></p><br/>":"<br/><p><b>Patologia remota</b></p><br/>");
				testo_html += rs.getString("PAT_REMOTA");				
			}		
			if (rs.getString("RACCORDO_PAT_REMOTA")!=""){
				testo_html += (testo_html==""?"<p><b>Raccordo patologia remota</b></p><br/>":"<br/><p><b>Raccordo patologia remota</b></p><br/>");
				testo_html += rs.getString("RACCORDO_PAT_REMOTA");				
			}					
		}			

		if ((testo_html!="") && (testo_html.toUpperCase()!="<HTML></HTML>")){
			$("#containerTesto").html(testo_html);
		}
		$("#containerTesto").data( "idDettaglio", idDettaglio );
		$("#containerTesto").data( "testoDocumento_html", testo_html );		
		 $("#TAB_STORICO tr").each(function() {
			$(this).removeClass("rigaEvidenziata");
          });
		 $("#" + oggetto.id).addClass("rigaEvidenziata");		
	
	}
	catch(e){
		alert("apriAnamnesi - Error:  "+ e.description);		
	} 		
}

var testoHtmlConverted = "";
function importaAmnesi(){
	try{
		testoHtmlConverted = "";
		var idDettaglio = $("#containerTesto").data( "idDettaglio");
		var testoDocumento_html = $("#containerTesto").data( "testoDocumento_html");	

		// metodo alternativo		
//		ajaxFormatConverter.convertHtmlToText(testoDocumento_html.toString().replaceAll("&nbsp;",""),replyAjaxConverter);
//		parent.window.frames[parent.reportControlID].importaRefertoSelezionato(txtConverted);
		var tmp = document.createElement("DIV");
	   	tmp.innerHTML = testoDocumento_html;
//		parent.window.frames[parent.reportControlID].importaRefertoSelezionato(testoDocumento);		

		parent.$("#ANAMNESI_REMOTA").val(tmp.textContent||tmp.innerText);
		
	}
	catch(e){
		alert("importaReferto - Error:  "+ e.description);		
	} 	
	finally{
		chiudi();
	}
}

//@DEPRECATED
var replyAjaxConverter = function(returnValue){
	testoHtmlConverted = returnValue;
}


// *******************
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid.toUpperCase();
}
