// JavaScript Document
// *******************
var params;
var tipoApertura = "INSERIMENTO"; // INSERIMENTO / MODIFICA


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
/*
		$( '#btRicerca' ).button().click(function( event ) {
			event.preventDefault();
			// carico dati  del paziente
			caricaDettaglio();
		}).css("width","100%");*/
		$( '#btImporta' ).button().click(function( event ) {
			event.preventDefault();
			// carico dati  del paziente
			importaReferto();
		}).css("width","100%");		


	}
	catch(e){
		alert("init - Error:  "+ e.description);
	}
	finally{
		showLoader(false);
	}
}

//@DEPRECATED
function initInfoAnag(){
	
	try{
		// PERFERZIONARE: fare una sola query per estrarre dati anagrafici!
		var idenAnag = params.get("idenAnag");
		var rs = getHomeFrame(params.get("sorgente")).executeQuery('consolle.xml','getInfoAnagInConsolle',[idenAnag]);
		var strInfoPaziente = "";

		if (rs.next()){
				// carico info paziente				
				// controllare se esistono info, in caso contrario NON mettere nulla
				strInfoPaziente += rs.getString("COGN") +  " "+ rs.getString("NOME") +"["+ rs.getString("SESSO") +"] Nato il: " + rs.getString("data_nascita") ;
				if(rs.getString("comune_nasc")!=""){
					strInfoPaziente += " a: " + rs.getString("comune_nasc") ;
				}
				if (rs.getString("COD_FISC")!=""){
					strInfoPaziente += " CF:" + rs.getString("COD_FISC") ;
				}
				if (rs.getString("tel")!=""){				
					strInfoPaziente += " Tel." + rs.getString("tel") ;
				}
				if ((rs.getString("INDIRIZZO_PAZIENTE")!="") || (rs.getString("comune_res")!="")){					
					strInfoPaziente += " Indirizzo: "+ rs.getString("INDIRIZZO_PAZIENTE") + " - " + rs.getString("comune_res") ;
				}
		}
		$("#lblPaziente").html(strInfoPaziente) ;				
	}
	catch(e){
		alert("initInfoAnag - Error:  "+ e.description);
	}
}

// value true	forzato da utente
// value false	da codice, dopo registrazione
function chiudi(){
	parent.j$.fancybox.close();						
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

function caricaDettaglio(value){
	try{
		
		// per i test con polaris PRVPNT12T01D969V		PROVA	PAZIENTE	M	20121201
		// per i testo con whale FRNLRN26M63G693F
		
		// DATA_DOCUMENTO: per polaris versioni_referti.DATA_ORA_FIRMA
		// per whale data_fine_ricovero
		
		// PRESTAZIONE: per polaris tab_esa.descr
		// per whale tipologia
		
		var stmName = "";
		// resetto variabili locali
		$("#containerTesto").empty().html("");
		$("#containerTesto").data( "idDettaglio", "" );
		$("#containerTesto").data( "testoDocumento", "" );
		$("#containerTesto").data( "testoDocumento_html", "" );		
		
//		var tipoFiltro = getValue("TIPOLOGIA");
		if (value ==""){return false;}
		
		stmName = "getDocumenti_" + value;
		$("#TAB_STORICO tbody").html("");
		var tbody = "", cf ="";
		//***************
		try{var rsID1 = getHomeFrame().executeQuery('storicoPaziente.xml',"getAnagID1",[params.get("idenAnag")]);}catch(e){alert("Error on getAnagID1"); return false;}		
		if (rsID1.next()){
			cf = rsID1.getString("id1");
		}
		// tappullo da togliere !!!
		//if (value =="RADIO"){cf="PRVPNT12T01D969V";}
		//if (value =="LETTERE"){cf="FRNLRN26M63G693F";}	
		// *****************************
		if (cf==""){
			alert("Identificativo anagrafico non valido, iden: " + params.get("idenAnag"));
			return false;
		}
		var linkOpen= "";
		var oldIdenDettaglio = ""
		try{var rs = getHomeFrame().executeQuery('storicoPaziente.xml',stmName,[cf]);}catch(e){alert("Error on " + stmName); return false;}
		while (rs.next()){
			// controllare se è lo stesso iden_dettaglio ??
			if (oldIdenDettaglio != rs.getString("iden_dettaglio")){
				oldIdenDettaglio = rs.getString("iden_dettaglio");
				linkOpen= "onclick='javascript:apriReferto(\""+ value +"\"," + rs.getString("iden_dettaglio")+ ",this);'";
//				tbody  += "<tr " + linkOpen +"><td><a href='#' onclick='javascript:apriReferto(\""+ value +"\"," + rs.getString("iden_dettaglio")+ ");'>Apri</a></td>";				
				tbody  += "<tr " + linkOpen +" id='TR_" + rs.getString("iden_dettaglio")+"'>";				
				//tbody += "<td>" +  rs.getString("IDEN_DETTAGLIO") + "</td>";			
				tbody += "<td>" +  rs.getString("DATA_DOCUMENTO") + "</td>";
				tbody += "<td>" +  rs.getString("PRESTAZIONE") + "</td>";			
				tbody += "<td>" +  rs.getString("REPARTO") + "</td>";						
				tbody += "<td>" +  rs.getString("REFERTANTE") + "</td>";
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


function apriReferto(tipo,idDettaglio,oggetto){
	var testo="";
	var testo_html = "";
	try{
		if ((idDettaglio=="")||(tipo=="")){
			alert("Errore grave, dati non validi");
			return;
		}
		var stmName = "getReferto_" + tipo;
		$("#containerTesto").empty();
		
		try{var rs = getHomeFrame().executeQuery('storicoPaziente.xml',stmName,[idDettaglio]);}catch(e){alert("Error on " + stmName); return false;}
		switch (tipo){
			case "RADIO":
				if (rs.next()){		
					testo = rs.getString("TESTO");
					testo_html = rs.getString("TESTO_HTML");
				}			
				break;
			case "LETTERE":
				// 				labelarea, testo_piano, testo_html
				while (rs.next()){
					if (rs.getString("testo_piano")!=""){
						testo += "\n" + rs.getString("labelarea") +"\n" + rs.getString("testo_piano");
					}
					if ((rs.getString("testo_html")!="")&&(rs.getString("testo_html")!="<p><strong></strong></p>")){
						testo_html += "<br/>" + rs.getString("labelarea") +"<br/>" + rs.getString("testo_html");
					}
				}
				break;
			default:
				break;
		}

		if ((testo_html!="") && (testo_html.toUpperCase()!="<HTML></HTML>")){
			$("#containerTesto").html(testo_html);
		}
		else{
			$("#containerTesto").html(testo);
		}
		$("#containerTesto").data( "idDettaglio", idDettaglio );
		$("#containerTesto").data( "testoDocumento", testo );
		$("#containerTesto").data( "testoDocumento_html", testo_html );		
		// iden_dettaglio sarà:
		// iden_ref nel caso di polaris
		// IDEN_LETTERA nel caso di whale
		/*
		var htmlToShow="<span style='display:inline-block;'><a class='button-secondary pure-button-fullWidth' href='javascript:importaReferto();'>Importa referto</a></span><div id='idDivTesto' style='overflow:scroll; height:400px;'><h1>Testo referto</h1><div>";
		 $.fancybox({
            'content' : htmlToShow,
			'width':400,
			'height'	: document.documentElement.offsetHeight/10*5,
			'autoSize' : false	,		
			'autoScale'     	: false,
			'transitionIn'	:	'elastic',
			'transitionOut'	:	'elastic',
			'scrolling'   		: 'yes',
			'showCloseButton'	: true,
			'onComplete': function() {
			}					
        });		*/
		 $("#TAB_STORICO tr").each(function() {
			$(this).removeClass("rigaEvidenziata");
          });
		 $("#" + oggetto.id).addClass("rigaEvidenziata");
		
	}
	catch(e){
		alert("apriReferto - Error:  "+ e.description);		
	} 		
}

var testoHtmlConverted = "";
function importaReferto(){
	try{
		testoHtmlConverted = "";
		var idDettaglio = $("#containerTesto").data( "idDettaglio");
		var testoDocumento = $("#containerTesto").data( "testoDocumento" );
		var testoDocumento_html = $("#containerTesto").data( "testoDocumento_html");	

		// metodo alternativo		
//		ajaxFormatConverter.convertHtmlToText(testoDocumento_html.toString().replaceAll("&nbsp;",""),replyAjaxConverter);
//		parent.window.frames[parent.reportControlID].importaRefertoSelezionato(txtConverted);

		if ((testoDocumento_html!="") && (testoDocumento_html!="undefined")&&(typeof(testoDocumento_html)!="undefined")){
			var tmp = document.createElement("DIV");
			tmp.innerHTML = testoDocumento_html;
			parent.window.frames[parent.reportControlID].importaRefertoSelezionato(tmp.textContent||tmp.innerText);		
		 }
		 else{
	 		if ((testoDocumento!="") && (testoDocumento!="undefined")&&(typeof(testoDocumento)!="undefined")){
				 parent.window.frames[parent.reportControlID].importaRefertoSelezionato(testoDocumento);		
			 }
		 }
		
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



/*

if(window.clipboardData) {
            window.clipboardData.setData('Text', $('textarea').val() + new Date);        
        } else if(ev.originalEvent.clipboardData) {
            ev.originalEvent.clipboardData.setData('text/plain', $('textarea').val() + new Date);      
        } else {
            alert('Clipboard Data are not supported in this browser. Sorry.');
        }

*/