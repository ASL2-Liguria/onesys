// Class: Dump
// Author: Shuns (www.netgrow.com.au/files)
// Last Updated: 10/10/06
// Version: 1.1

dump=function(object, showTypes){var dump='';var st=typeof showTypes=='undefined' ? true : showTypes;var winName='dumpWin';var browser=_dumpIdentifyBrowser();var w=760;var h=500;var leftPos=screen.width ?(screen.width-w)/ 2 : 0;var topPos=screen.height ?(screen.height-h)/ 2 : 0;var settings='height='+h+',width='+w+',top='+topPos+',left='+leftPos+',scrollbars=yes,menubar=yes,status=yes,resizable=yes';var title='Dump';var script='function tRow(s){t=s.parentNode.lastChild;tTarget(t, tSource(s));}function tTable(s){var switchToState=tSource(s);var table=s.parentNode.parentNode;for(var i=1;i < table.childNodes.length;i++){t=table.childNodes[i];if(t.style){tTarget(t, switchToState);}}}function tSource(s){if(s.style.fontStyle=="italic"||s.style.fontStyle==null){s.style.fontStyle="normal";s.title="click to collapse";return "open";}else{s.style.fontStyle="italic";s.title="click to expand";return "closed";}}function tTarget(t, switchToState){if(switchToState=="open"){t.style.display="";}else{t.style.display="none";}}';dump+=(/string|number|undefined|boolean/.test(typeof(object))||object==null)? object : recurse(object, typeof object);winName=window.open('', winName, settings);if(browser.indexOf('ie')!=-1||browser=='opera'||browser=='ie5mac'||browser=='safari'){winName.document.write('<html><head><title> '+title+' </title><script type="text/javascript">'+script+'</script><head>');winName.document.write('<body>'+dump+'</body></html>');}else{winName.document.body.innerHTML=dump;winName.document.title=title;var ffs=winName.document.createElement('script');ffs.setAttribute('type', 'text/javascript');ffs.appendChild(document.createTextNode(script));winName.document.getElementsByTagName('head')[0].appendChild(ffs);}winName.focus();function recurse(o, type){var i;var j=0;var r='';type=_dumpType(o);switch(type){case 'regexp':var t=type;r+='<table'+_dumpStyles(t,'table')+'><tr><th colspan="2"'+_dumpStyles(t,'th')+'>'+t+'</th></tr>';r+='<tr><td colspan="2"'+_dumpStyles(t,'td-value')+'><table'+_dumpStyles('arguments','table')+'><tr><td'+_dumpStyles('arguments','td-key')+'><i>RegExp: </i></td><td'+_dumpStyles(type,'td-value')+'>'+o+'</td></tr></table>';j++;break;case 'date':var t=type;r+='<table'+_dumpStyles(t,'table')+'><tr><th colspan="2"'+_dumpStyles(t,'th')+'>'+t+'</th></tr>';r+='<tr><td colspan="2"'+_dumpStyles(t,'td-value')+'><table'+_dumpStyles('arguments','table')+'><tr><td'+_dumpStyles('arguments','td-key')+'><i>Date: </i></td><td'+_dumpStyles(type,'td-value')+'>'+o+'</td></tr></table>';j++;break;case 'function':var t=type;var a=o.toString().match(/^.*function.*?\((.*?)\)/im);var args=(a==null||typeof a[1]=='undefined'||a[1]=='')? 'none' : a[1];r+='<table'+_dumpStyles(t,'table')+'><tr><th colspan="2"'+_dumpStyles(t,'th')+'>'+t+'</th></tr>';r+='<tr><td colspan="2"'+_dumpStyles(t,'td-value')+'><table'+_dumpStyles('arguments','table')+'><tr><td'+_dumpStyles('arguments','td-key')+'><i>Arguments: </i></td><td'+_dumpStyles(type,'td-value')+'>'+args+'</td></tr><tr><td'+_dumpStyles('arguments','td-key')+'><i>Function: </i></td><td'+_dumpStyles(type,'td-value')+'>'+o+'</td></tr></table>';j++;break;case 'domelement':var t=type;r+='<table'+_dumpStyles(t,'table')+'><tr><th colspan="2"'+_dumpStyles(t,'th')+'>'+t+'</th></tr>';r+='<tr><td'+_dumpStyles(t,'td-key')+'><i>Node Name: </i></td><td'+_dumpStyles(type,'td-value')+'>'+o.nodeName.toLowerCase()+'</td></tr>';r+='<tr><td'+_dumpStyles(t,'td-key')+'><i>Node Type: </i></td><td'+_dumpStyles(type,'td-value')+'>'+o.nodeType+'</td></tr>';r+='<tr><td'+_dumpStyles(t,'td-key')+'><i>Node Value: </i></td><td'+_dumpStyles(type,'td-value')+'>'+o.nodeValue+'</td></tr>';r+='<tr><td'+_dumpStyles(t,'td-key')+'><i>innerHTML: </i></td><td'+_dumpStyles(type,'td-value')+'>'+o.innerHTML+'</td></tr>';j++;break;}if(/object|array/.test(type)){for(i in o){var t=_dumpType(o[i]);if(j < 1){r+='<table'+_dumpStyles(type,'table')+'><tr><th colspan="2"'+_dumpStyles(type,'th')+'>'+type+'</th></tr>';j++;}if(typeof o[i]=='object' && o[i]!=null){r+='<tr><td'+_dumpStyles(type,'td-key')+'>'+i+(st ? ' ['+t+']' : '')+'</td><td'+_dumpStyles(type,'td-value')+'>'+recurse(o[i], t)+'</td></tr>';}else if(typeof o[i]=='function'){r+='<tr><td'+_dumpStyles(type ,'td-key')+'>'+i+(st ? ' ['+t+']' : '')+'</td><td'+_dumpStyles(type,'td-value')+'>'+recurse(o[i], t)+'</td></tr>';}else{r+='<tr><td'+_dumpStyles(type,'td-key')+'>'+i+(st ? ' ['+t+']' : '')+'</td><td'+_dumpStyles(type,'td-value')+'>'+o[i]+'</td></tr>';}}}if(j==0){r+='<table'+_dumpStyles(type,'table')+'><tr><th colspan="2"'+_dumpStyles(type,'th')+'>'+type+' [empty]</th></tr>';}r+='</table>';return r;};};_dumpStyles=function(type, use){var r='';var table='font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;cell-spacing:2px;';var th='font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;text-align:left;color: white;padding: 5px;vertical-align :top;cursor:hand;cursor:pointer;';var td='font-size:xx-small;font-family:verdana,arial,helvetica,sans-serif;vertical-align:top;padding:3px;';var thScript='onClick="tTable(this);" title="click to collapse"';var tdScript='onClick="tRow(this);" title="click to collapse"';switch(type){case 'string':case 'number':case 'boolean':case 'undefined':case 'object':switch(use){case 'table':r=' style="'+table+'background-color:#0000cc;"';break;case 'th':r=' style="'+th+'background-color:#4444cc;"'+thScript;break;case 'td-key':r=' style="'+td+'background-color:#ccddff;cursor:hand;cursor:pointer;"'+tdScript;break;case 'td-value':r=' style="'+td+'background-color:#fff;"';break;}break;case 'array':switch(use){case 'table':r=' style="'+table+'background-color:#006600;"';break;case 'th':r=' style="'+th+'background-color:#009900;"'+thScript;break;case 'td-key':r=' style="'+td+'background-color:#ccffcc;cursor:hand;cursor:pointer;"'+tdScript;break;case 'td-value':r=' style="'+td+'background-color:#fff;"';break;}break;case 'function':switch(use){case 'table':r=' style="'+table+'background-color:#aa4400;"';break;case 'th':r=' style="'+th+'background-color:#cc6600;"'+thScript;break;case 'td-key':r=' style="'+td+'background-color:#fff;cursor:hand;cursor:pointer;"'+tdScript;break;case 'td-value':r=' style="'+td+'background-color:#fff;"';break;}break;case 'arguments':switch(use){case 'table':r=' style="'+table+'background-color:#dddddd;cell-spacing:3;"';break;case 'td-key':r=' style="'+th+'background-color:#eeeeee;color:#000000;cursor:hand;cursor:pointer;"'+tdScript;break;}break;case 'regexp':switch(use){case 'table':r=' style="'+table+'background-color:#CC0000;cell-spacing:3;"';break;case 'th':r=' style="'+th+'background-color:#FF0000;"'+thScript;break;case 'td-key':r=' style="'+th+'background-color:#FF5757;color:#000000;cursor:hand;cursor:pointer;"'+tdScript;break;case 'td-value':r=' style="'+td+'background-color:#fff;"';break;}break;case 'date':switch(use){case 'table':r=' style="'+table+'background-color:#663399;cell-spacing:3;"';break;case 'th':r=' style="'+th+'background-color:#9966CC;"'+thScript;break;case 'td-key':r=' style="'+th+'background-color:#B266FF;color:#000000;cursor:hand;cursor:pointer;"'+tdScript;break;case 'td-value':r=' style="'+td+'background-color:#fff;"';break;}break;case 'domelement':switch(use){case 'table':r=' style="'+table+'background-color:#FFCC33;cell-spacing:3;"';break;case 'th':r=' style="'+th+'background-color:#FFD966;"'+thScript;break;case 'td-key':r=' style="'+th+'background-color:#FFF2CC;color:#000000;cursor:hand;cursor:pointer;"'+tdScript;break;case 'td-value':r=' style="'+td+'background-color:#fff;"';break;}break;}return r;};_dumpIdentifyBrowser=function(){var agent=navigator.userAgent.toLowerCase();if (typeof window.opera != 'undefined'){return 'opera';} else if (typeof document.all != 'undefined'){if (typeof document.getElementById != 'undefined'){var browser = agent.replace(/.*ms(ie[\/ ][^ $]+).*/, '$1').replace(/ /, '');if(typeof document.uniqueID != 'undefined') {if (browser.indexOf('5.5') != -1){return browser.replace(/(.*5\.5).*/, '$1');}else{return browser.replace(/(.*)\..*/, '$1');}}else{return 'ie5mac';}}}else if(typeof document.getElementById != 'undefined'){if (navigator.vendor.indexOf('Apple Computer, Inc.')!=-1) {return 'safari';}else if(agent.indexOf('gecko')!=-1) {return 'mozilla';}}return false;};_dumpType=function(obj){var t=typeof(obj);if(t=='function'){var f=obj.toString();if((/^\/.*\/[gi]??[gi]??$/).test(f)){return 'regexp';}else if((/^\[object.*\]$/i).test(f)){t='object'}}if(t !='object'){return t;}switch(obj){case null:return 'null';case window:return 'window';case document:return document;case window.event:return 'event';}if(window.event &&(event.type==obj.type)){return 'event';}var c=obj.constructor;if(c !=null){switch(c){case Array:t='array';break;case Date:return 'date';case RegExp:return 'regexp';case Object:t='object';break;case ReferenceError:return 'error';default:var sc=c.toString();var m=sc.match(/\s*function(.*)\(/);if(m !=null){return 'object';}}}var nt=obj.nodeType;if(nt !=null){switch(nt){case 1:if(obj.item==null){return 'domelement';}break;case 3:return 'string';}}if(obj.toString !=null){var ex=obj.toString();var am=ex.match(/^\[object(.*)\]$/i);if(am !=null){var am=am[1];switch(am.toLowerCase()){case 'event':return 'event';case 'nodelist':case 'htmlcollection':case 'elementarray':return 'array';case 'htmldocument':return 'htmldocument';}}}return t;};


//JavaScript Document
var lastIndexToProcess = 0;
var params;

// colore per indicare sezione con predenti NON letti
var highlightSectionColor = "#FF6633";

// parametri presi da console

var gbl_idenRef = "", gbl_idenEsa = "", gbl_callbackOnClose = "", gbl_callbackOnSave = "", gbl_tipoInserimento = "", gbl_webuser="";
var gbl_idenAnag = "";

// elenco che conterrà *tutti*
// gli esami.iden che si stanno refertando
// ATTENZIONE che si potranno escludere !!!!
// inibire tale funzionalità ?
var listaIdenEsame ;
var listaIdenEsameUnSplitted = "";
// indica il modulo corrente
var gbl_modulo= "";
// indica il valore stringa dei dati salvati
var gbl_strDatiXml = "";
var gbl_XmlDoc ;
// indica i dati già trasformati tramite xslt
var gbl_strDatiHtmlFormatted = "";




//dal momento che viene usata una vecchia versione di jquery
//per compatibilità col plugin di multi accordion
//uso un modo diverso per fare chiamate ajax
function ajaxRequest(){
	var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"]
	if (window.ActiveXObject){ 
		for (var i=0; i<activexmodes.length; i++){
			try{
				return new ActiveXObject(activexmodes[i])
			}
			catch(e){
			}
		}
	}
	else if (window.XMLHttpRequest)
		return new XMLHttpRequest()
	else
		return false
}

//parametri:
//iden_scheda
//scheda
//iden_esame
//iden_anag
//iden_ref
//ute_mod
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

// ******************************************************
Array.prototype.diff =
	  function() {
	    var a1 = this;
	    var a = a2 = null;
	    var n = 0;
	    while(n < arguments.length) {
	      a = [];
	      a2 = arguments[n];
	      var l = a1.length;
	      var l2 = a2.length;
	      var diff = true;
	      for(var i=0; i<l; i++) {
	        for(var j=0; j<l2; j++) {
	          if (a1[i] === a2[j]) {
	            diff = false;
	            break;
	          }
	        }
	        diff ? a.push(a1[i]) : diff = true;
	      }
	      a1 = a;
	      n++;
	    }
	    return a.unique();
	  };

	// Return new array with duplicate values removed
	Array.prototype.unique =
	  function() {
	    var a = [];
	    var l = this.length;
	    for(var i=0; i<l; i++) {
	      for(var j=i+1; j<l; j++) {
	        // If this[i] is found later in the array
	        if (this[i] === this[j])
	          j = ++i;
	      }
	      a.push(this[i]);
	    }
	    return a;
	  };



// ******************************************************

// metodo che deve essere chiamato per
// "popolare ed attivare" il modulo
// da implementare sempre


// ********* ATTENZIONE **********
// diversamente dalle schede di Cardio di Lagosanto
// nei moduli dell'ambulatorio viene chiamata questa funzione
// dalla console (consolleRptCtlUtil_moduloConsole) per 
// inizializzare gli oggetti !!
var idUltimoControlloSelezionato ="";
function initModuloConsole (idenAnag, idenRef, idenEsa, callbackOnClose, callbackOnSave, tipoModalita, modulo, webuser){
	try{
		// leggo dalla console i valori iniziali
		//alert(" chiamato initModuloConsole!!!!!!!!!!");
		gbl_idenAnag = idenAnag;
		gbl_tipoInserimento = tipoModalita;
		gbl_idenRef = idenRef;
		// sarà sempre  e solo un esame per modulo !!
		// ATTENZIONE CAMBIARE !!!!
		// NON sarà più un valore solo ma possono essere
		// multipli 
		listaIdenEsameUnSplitted = idenEsa ;
		listaIdenEsame = idenEsa.toString().split("*");
		// setto SEMPRE e comunque il primo
		// solo in fase di salvataggio andrò a
		// spalmare i dati su tutti fli esami
			// inserendo n record in dett_esami
		if (listaIdenEsame.lenght==0){
			alert("Errore grave: elenco iden esami vuoto"); return;
		}
		gbl_idenEsa = listaIdenEsame[0]; 
		// array_iden_esame
		// array_id_esame_dicom
		gbl_callbackOnClose = ""; // todo
		gbl_callbackOnSave = ""; // todo
		gbl_modulo = modulo;
		gbl_webuser = webuser;
//		alert(gbl_tipoInserimento + " " + gbl_idenRef + " " + gbl_idenEsa + " " + gbl_webuser + " " + gbl_idenAnag);
		try{document.getElementById("PRESTAZIONI_REFERTATE").value = getDescrPrestazioni(parent.array_descr_esame);}catch(e){;}
		// passo la palla al js specifico
		// del modulo ove DEVE essere implementato
		// la funzione loadInitValue
		loadInitValue();
		// marca i campi obbligatori
		try{highlightMandatoryFields(array_descrizione_gruppi[0]);}catch(e){;}
		// **************** nuova gestione referti standard
		try{
			// aggancio a tutti i textbox e textarea
			// la gestione dell'ultimo id selezionato
			$('input[type="text"][gruppo="' + array_descrizione_gruppi[0] +'"], textarea[gruppo="' + array_descrizione_gruppi[0] +'"]').each(function(i){
				$(this).focus(function(){
					idUltimoControlloSelezionato = $(this).attr("id"); 
				});
			});
		}
		catch(e){
			alert("Error init focus manage " + e.description);
		}
		// *******************
		// modifica 21-8-15
		var valoreAnonimo = "";
		var strToAppend = "";
		try{
			try{var rsTmp = parent.executeQuery('gestione_anonimato.xml','getCognome_Anonimo',[gbl_idenAnag,parent.baseUser.LISTAREPARTI[0]]);}catch(e){alert("Errore: getCognome_Anonimo");}
			if (rsTmp.next()){
				valoreAnonimo = rsTmp.getString("cognome");
			}		
			if ($("#ANONIMATO").length == 0){
				strToAppend = "<input type ='hidden' gruppo='" +  array_descrizione_gruppi[0] +"' id='ANONIMATO' value ='" + valoreAnonimo +"' />";
				$("form").first().append(strToAppend);
			}
			else{
				// sovrascrivo con ultimo valore !!
				$("#ANONIMATO").val(valoreAnonimo);
			}
		}catch(e){;}
		// *********************
		
		// *********************		
		// modifica 21-9-15
		try{
			if ((gbl_tipoInserimento=="INSERIMENTO")&&(parent.parent.opener.top.home.getConfigParam("SITO")=="SAVONA")){
				// importo la diagnosi
				// pensare di sostituitere il giro con una funzione
				// o procedura SQL
				var rs = parent.executeQuery('info_repository.xml','getIdenRemoto',[gbl_idenAnag]);
				if (rs.next()){
					var idenAnagRemoto = rs.getString("ID_REMOTO");
				}
				if (idenAnagRemoto==""){alert("Errore: idenAnagRemoto nullo");return;	}
				// DA TOGLIERE, usato per i test !!
				// idenAnagRemoto="SCCLCU84D23I480Q";
				// **************
				var rsDiagnosi =  parent.executeQuery('rrf_query.xml','ultimoICD_da_Ricetta',[idenAnagRemoto]);
				if (rsDiagnosi.next()){
					if (rsDiagnosi.getString("iden_icd")!=""){
						var rsICD =  parent.executeQuery('rrf_query.xml','getICD9byIden',[rsDiagnosi.getString("iden_icd")]);
						if (rsICD.next()){
							// switch su console
							switch (gbl_modulo){
								case "CAIRO_RRF":
									jsonDiagnosiAttuale.lista[0].descrizione = rsICD.getString("descrizione");
									jsonDiagnosiAttuale.lista[0].codice = rsICD.getString("cod_dec");
									jsonDiagnosiAttuale.lista[0].iden = rsICD.getString("iden");
									$("#COD_DIAGNOSI").val(jsonDiagnosiAttuale.lista[0].codice);
									$("#DIAGNOSI").val(jsonDiagnosiAttuale.lista[0].descrizione);							
									break;
								default:
									break;
							}
						}
						else{
							// errore 
							//alert ("ERRORE grave: tabelle non allineate.\nContattare l'amministratore di sistema"); return;
						}
					}
					else{
						// ICD NON compilato
						// uso il semplice campo quesito 
						switch (gbl_modulo){
							case "CAIRO_RRF":
								$("#NOTE_DIAGNOSI").val(rsDiagnosi.getString("quesito"));
								break;
							default:
								break;
						}
						
					}
				}
				else{
					// nessuna ricetta
					// TBD
				}
			}
		}catch(e){
			//alert(e.description);
		}
		// ********************* FINE modifica 21-9-15		
	}
	catch(e){
		alert("initModuloConsole - Error: "+ e.description);
	}
}


function getDescrPrestazioni(lista){
	var strOutput = "";
	for (var k=0; k<lista.length;k++){
		if (k==0){
			strOutput = lista[k];
		}
		else{
			strOutput += ", " + lista[k];
		}
	}
	return strOutput ;
}


// NB per ora supporto SOLO textbox e textarea
function highlightMandatoryFields(gruppo){
	try{
		$("input[gruppo='" + gruppo +"'][obbligatorio='S'], textarea[gruppo='" + gruppo +"'][obbligatorio='S'], select[gruppo='" + gruppo +"'][obbligatorio='S']").each(function(){		
			$(this).addClass("campoObbl");
		});																																   
	}
	catch(e){
		alert("highlightMandatoryFields - Error: "+ e.description);
	}		
}


// controlla semplicemente se è obbligatorio ed è vuoto
// NB per ora supporto SOLO textbox e textarea
function checkMandatoryFields(gruppo){
	var bolEsito = true;
	var strSelector = "";
	try{
		strSelector = "input[gruppo='" + gruppo +"'][obbligatorio='S'], textarea[gruppo='" + gruppo +"'][obbligatorio='S']";
		$(strSelector).each(function(){													   
			if($(this).val()=="" || $(this).val() == "undefined")
			{
				alert("Il campo "+ $(this).attr("id") + " deve essere compilato");
				bolEsito = false;
				return false;
			}
			else{
				bolEsito = true;
			}
		});		
		return bolEsito;
	}
	catch(e){
		alert("checkMandatoryFields - Error: "+ e.description);
	}	
}



// xsltField indica il campo 
// della tabella MODULI_CONSOLE
// al quale attingere per 
// caricare il pattern xslt per la conversione
function getDatiHtmlFormatted(xsltField, modulo){
	var campoXslt = "";
	try{
		//alert("sono qui");
		if ((xsltField=="") || (typeof(xsltField) == "undefined")){
			// imposto il default
			campoXslt = "XSLT_4_WRITING";
		} 
		else{
			campoXslt = xsltField;
		}
		try{
			xmlOutput = getFormValueInXml();
//			alert("xmlOutput: "+ xmlOutput);
			parent.dwr.engine.setAsync(false);
			
			if (parent.parent.opener.top.home.getConfigParam("SITO")=="FERRARA"){
				parent.ajaxQueryCommand.getHtmlModuloConsole(gbl_idenEsa, xmlOutput, campoXslt , modulo, true, function(value){
					try{
						gbl_strDatiHtmlFormatted = value;
					}
					catch(e){
						alert(e.description);
					}
				});				
			}
			else{
				// caso classico, passo comunque il modulo di refertazione MA passo false per 
				// forzare la NON considerazione
				parent.ajaxQueryCommand.getHtmlModuloConsole(gbl_idenEsa, xmlOutput, campoXslt , function(value){
					try{
						gbl_strDatiHtmlFormatted = value;
					}
					catch(e){
						alert(e.description);
					}
				});
				
			}
			bolEsito = true;
		}
		catch(e){
			alert("getDatiHtmlFormatted first part - Error: "+ e.description);
		}
		finally{
			parent.dwr.engine.setAsync(true);
		}		
		return gbl_strDatiHtmlFormatted;
	}
	catch(e){
		alert("getDatiHtmlFormatted - Error: "+ e.description);
	}
}

//***************************************************************
//****** modifica x diabetologia ma valida per ogni modulo ******
//***************************************************************
var CALLBACK_MODULE ={
	callbackFunctionToExecute: {},
	resetCallBackFunction: function(){
		callbackFunctionToExecute: {}
	},
	getCallBackFunction: function(){
		return this.callbackFunctionToExecute;
	},
	setCallBackFunction: function(value){
		try{
			this.callbackFunctionToExecute = value;
		}
		catch(e){
			alert("setCallBackFunction - Error: " + e.description);
		}
	}
}
//***************************************************************



// funzione che ritornerà
// i dati xml del modulo della 
// console
// il parametro todoNext può assumere 2 valori: BOZZA, DEFINITIVO
// la chiamata tipicamente arriva da globalConsoleEngine.js 
function getDatiXmlAndSave(todoNext, modulo){
	var bolEsito = false;
	var xmlOutput = "";
	try{
		// aggiunto 20140407
		if (!checkMandatoryFields(array_descrizione_gruppi[0])){
		   return false;
		}
		// attenzione RECUPERARE dati in 
		xmlOutput = getFormValueInXml();
		// modifica del 27-4-15
		try{
			if (!String.prototype.trim) {
			  (function() {
				// Make sure we trim BOM and NBSP
				var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
				String.prototype.trim = function() {
				  return this.replace(rtrim, '');
				};
			  })();
			}		
			if (xmlOutput.toString().trim()==""){
				alert("ERRORE GRAVE: dati vuoti. Contattare l'amministratore di sistema");
				return false;
			}
		}
		catch(e){}
		// **************
		// da togliere
//		alert(xmlOutput);
		parent.dwr.engine.setAsync(false);
		// cambiare flusso, la procedura per salvare gli eventuali
		// dati su whale la eseguo tramite gli statement definiti in xml
		//parent.ajaxQueryCommand.saveModuloConsole(gbl_idenEsa, xmlOutput , "nomeProc", function(value){
		parent.ajaxQueryCommand.saveModuloConsole(listaIdenEsameUnSplitted, xmlOutput , modulo, function(value){
			try{
				// controllo eventuali errori
				if (value.substr(0,2).toUpperCase()=="KO"){
					alert("Errore nel salvataggio\n" + value.split("*")[1]);
					// modificaa del 19-2-2015
					// IMPORTANTE, se da errore DEVE uscire e ritornare
					// false per inibire la prosecuzione del flusso di registrazione referto
					return false;
				}
				else{
					// rimappo variabile definita in consolleRptCtlUtil
					//alert("##" + value);
					parent.reportHtmlOriginal = value; 
				}
			}
			catch(e){
				alert(e.description);
			}
		});
		bolEsito = true;
	}
	catch(e){
		alert("getDatiXmlAndSave first part - Error: "+ e.description);
	}
	finally{
		parent.dwr.engine.setAsync(true);
	}
	try{
		// su whale viene salvato l'esame obiettivo
		// nel caso di Toniutti valutare se eseguire
		// la chiamata solo per il modulo di RICCIO
		
		//alert("Salva ok");
		//chiamata ajax per salvare su Whale
		//parent.dwr.engine.setAsync(false);
		var save_action;
		if (todoNext == 'DEFINITIVO') {
			save_action = 'SIGN';
		} else {
			save_action = 'SAVE';
		}
		var urlSnodoAssoluta = window.location.protocol+ "//" + window.location.host + "/" + window.location.pathname.split("/")[1] + "/Snodo";
		$.ajax({
			url: urlSnodoAssoluta,
			data: {"azione": "Cartella","IDEN_ESAME": gbl_idenEsa, "DO": save_action},
			dataType: "text",
			type: "GET",
			cache: false,
		    success : function (data,stato) {
		    	//alert(data + ", "+ stato);
		    	// me ne sto, soddisfatto di aver salvato
		    },
		    error : function (richiesta,stato,errori) {
		        alert("Errore. stato chiamata: "+stato);
		    },
		    async : false
		});
		
		// ************************ 
		// modifica x diabetologia
		// ************************ 		
		try{
			// esempio chiamata callback
			if (CALLBACK_MODULE.getCallBackFunction()!="undefined"){
				CALLBACK_MODULE.callbackFunctionToExecute.call({"nomeParametro":"valore"},"")
			}
			// *************************
		}
		catch(e){
			// se va in errore vuol dire che non è definito !
//			alert("getDatiXmlAndSave - modulo callBack Error: " +  e.description);
		}
		
		
	}
	catch(e){
		alert("getDatiXmlAndSave - second part Error: "+ e.description);
	}
	finally{
		//parent.dwr.engine.setAsync(true);
	}
	return bolEsito;
}


function initGlobalObject(){
	try{
		utilCreaBoxAttesa();
		utilMostraBoxAttesa(true, "Operazione in corso...");
		
		/*
		params = getParams();
		initPaziente();
		initEsame();
		initAll();
		// controllo se sono in reading mode
		checkReadingMode();*/
	}
	catch(e){
		alert("initGlobalObject - error: " + e.description);
	}	
}

//funzione che caricherà tutte le info
//della scheda richiesta
// funziona ancora ?
// DEPRECATA !!!
function initAll(){


	var patID = "";

	try{
		patID = params.get("iden_anag");
		//idScheda = params.get("iden_scheda");
		// inizializzo i campi iden_esame e iden_ref
		document.getElementById("IDEN_ESAME").value = params.get("iden_esame");
		document.getElementById("IDEN_REF").value = params.get("iden_ref");		
		// carico dati paziente	
		initPatientInfoByIdenEsa(params.get("iden_esame"));
		// controlla tipo inserimento 
		// per eventualmente caricare i dati 
		caricaDatiTabulatore(params.get("scheda"), params.get("iden_scheda"), params.get("iden_esame"));
		// inizializza combo
		indexToProcess = 0;
		
		loadAllCombo(indexToProcess, "TAB_CARDIO_CODIFICHE", "");
		// *****************************
		// set css per obblitorietà
		settaObbligatorietaCampi();
	}
	catch(e){
		alert("initAll - Error: " + e.description);
	}
}


function udpdateLocalIdenScheda(valore){
	try{
		if (params.containsKey("iden_scheda")){
			params.remove("iden_scheda");
		}
		params.put("iden_scheda", valore);
	}
	catch(e){
		alert("" + e.description);
	}
}



function calcoloSupCorp(AltezzaCM, weight){
	var AreaSupCorporea = 0;
	var AltezzaMetri;
	try{
		AltezzaMetri = AltezzaCM/100;
		//b3^0,425*e3^0,725*0,007184
		AreaSupCorporea = 0.20247 * Math.pow(AltezzaMetri,0.725) * Math.pow(weight,0.425);
//		AreaSupCorporea = 0.007184 * Math.pow(AltezzaMetri,0.425) * Math.pow(weight,0.425);
	}
	catch(e){
		alert("calcoloSupCorp - Error: " + e.description);
	}
	return AreaSupCorporea;
}

function rounding(number,decimal) 
{
	try{
		multiplier = Math.pow(10,decimal);
		number = Math.round(number * multiplier) / multiplier;
		return number;
	}
	catch(e){
		alert("rounding - Error: " + e.description);
	}
}


function checkReadingMode(){
	var reading_mode = "";
	var listaObj;
	
	try{
		reading_mode = params.get("reading_mode");
		if (reading_mode == "S"){
			// faccio sparire le barre del titolo 
			document.getElementById("headerFirstLayout").style.visibility = "hidden";
			document.getElementById("headerFirstLayout").style.display = "none";
			document.getElementById("footerConsolle").style.visibility = "hidden";
			// nascondo listbox ingombranti e inutili
			listaObj = getElementsByAttribute(document.body, "*", "attributo", "4HIDE");
			//alert("#" + listaObj.length + "#");
			for (var i =0;i< listaObj.length;i++){
				listaObj[i].style.visibility = "hidden";
				listaObj[i].style.display = "none";
				// disabilitare anche link ondblclick 
				// su listbox target
			}
			// faccio sostituzione se e solo se stiamo lavorando su più esami !
			var timer = window.setTimeout("try{fixCssStyleForReading();}catch(e){;}",500);
			// ****
			var timer2 = window.setTimeout("try{copyPasteInfoTitle();}catch(e){;}",500);
		}
	}
	catch(e){
		alert("checkReadingMode - Error: " + e.description);
	}
}


function fixCssStyleForReading(){
	var listaObj;
	try{
		if (parent.isDoubleIFrame()){
			listaObj = getElementsByAttribute(document.body, "*", "class", "classTdField");
			//alert("#" + listaObj.length + "#");
			for (var i =0;i< listaObj.length;i++){
				listaObj[i].className = "classTdFieldReadOnly";	
			}
		}		
	}
	catch(e){
		alert("checkReadingMode - Error: " + e.description);
	}	
}
// funzione che copia l'innerHtml del tabHeader
// nel caso di visualizzazione in sola lettura
function copyPasteInfoTitle(){
	var strTmp = "";
	try{
		document.getElementById("idTitleForTab").style.visibility = "visible";
		document.getElementById("idTitleForTab").style.display = "block";
		strTmp = document.getElementById("paziente_" + params.get("scheda")).innerHTML;
		document.getElementById("idTitleForTab").innerHTML = strTmp;
		
	}
	catch(e){
		alert("copyPasteInfoTitle - Error: " + e.description);
	}
}



function setInitValueOfField(id,value,nodoXML){
	var oggetto ;
	var nodeType="";
	
	try{
		if (id==""){return;}

		oggetto = document.getElementById(id);
		if (oggetto){
			nodeTag = oggetto.nodeName.toString().toUpperCase();
			switch (nodeTag){
			case "LABEL":
				oggetto.innerText = formatValue(oggetto,value);
				break;
			case "INPUT":
				nodeType = oggetto.type.toString().toLowerCase();
				switch (nodeType){
				case "checkbox":
					if (typeof(nodoXML)!="undefined"){
						if (nodoXML.getAttribute("checked")){
							oggetto.checked  = (value=="S");
					}}
					break;
				case "text":
					oggetto.value = formatValue(oggetto,value);
					break;
				case "hidden":
					oggetto.value = value;
					break;
				case "radio":
					if (typeof(nodoXML)!="undefined"){
//						alert(nodoXML.getAttribute("checked"));
						if (nodoXML.getAttribute("checked")==true || nodoXML.getAttribute("checked")=="checked"){
//							alert("seleziono id" + id);
							$("#"+ id ).click();
						}
					}				
//					alert(id + ", "+ value);
	//				$("input:radio[name='" + id + "'][value='" + value + "']").click(); 
					break;
				default:
					oNewText=document.createTextNode(value);
					oggetto.appendChild(oNewText);
				}
				break;
			case "TEXTAREA":
				oggetto.value = value;
				break;
			case "SELECT":
				// combo classico
				try{
				if (typeof(nodoXML)!="undefined"){
					if (nodoXML.getAttribute("iden")){
						// setto per iden
						//alert(nodoXML.getAttribute("iden"));
						selectOptionByValue(oggetto.id,nodoXML.getAttribute("iden"), ",");
					}
				}
				else{
					//setto per testo
					if(value!=""){selectOptionByText(oggetto.id,value, ",");}
				}
				}
				catch(e){
					// setto di default per testo
					try{if(value!=""){selectOptionByText(oggetto.id,value, ",");}}catch(e){;}
				}
				
				break;
			default:
				break;
			}// fine switch	
		}
	}
	catch(e){
		alert("setInitValueOfField - error: " + e.description);
	}
}





//**********************************
//**********************************
//******* gestione history *********
//**********************************

function checkTab(){
	var lista = $('#multiAccordion-diagnosi').multiAccordion('getActiveTabs');
	for (var i=0;i<lista.length;i++){
		alert(lista[i]);
	}
}

var globalHistoryType = "";
function initHistorySections(historyType){
	try{
		// tengo traccia della prima
		// modalità di chiamata, per poi
		// sfruttarla quando viene fatto cambio
		// di stato letto/non letto e successivo refresh
		globalHistoryType = historyType;
		// ************************ HISTORY delle sezioni
		// faccio il caricamento solo ondemand
		// per velocizzare caricamento !
		// contro: ho problemi a notificare subito lo stato
		// delle sezioni lette
//		$('a[id^="historySez_"]').each(function(){
		$('h3[id^="h3_history_"]').each(function(){		
			//alert(jQuery(this).siblings().get(0).tagName);
			updateHistorySectionHeader(jQuery(this).attr("id"));
			jQuery(this).bind('click', function() {
				loadHistorySection(jQuery(this).attr("id"), historyType);
			});						 
		});
		// aggiusto colore header per info su 
		// sezioni lette o meno
		/*$('h3[id^="h3_history_"]').each(function(){
			updateHistorySectionHeader(jQuery(this).attr("id"));
		});*/
		// *******************************************
	}
	catch(e){
		alert("initHistorySections - Error: " + e.description);
	}
}

//il link sul cambio stato letto/ non letto
//lo metterò sull'icona stessa dato che
//mostrerò nella riga il testo completo
//lasciando quindi all'utente la possibilità
//se aver sempre una sezione "obbligatoriamente"
//da vedere perchè non letta (magari sono info 
//importanti)
function loadHistorySection(id, historyType){
	var myLista = new Array();
	var rs;
	var tipoSezione = "";
	var strStatoLetto = "";
	var strImportaTesto = "";
	var indiceRiga = 0;
	var bolRecordInDettEsami = false;
	var listaIdenDettEsami = new Array();
	
	
	function arr_diff (a1, a2) {

		var a = [], diff = [];
	
		for (var i = 0; i < a1.length; i++) {
			a[a1[i]] = true;
		}
	
		for (var i = 0; i < a2.length; i++) {
			if (a[a2[i]]) {
				delete a[a2[i]];
			} else {
				a[a2[i]] = true;
			}
		}
	
		for (var k in a) {
			diff.push(k);
		}
	
		return diff;
	}; 
	
	
	try{
		//alert("loadHistorySection "+ id);
		tipoSezione = id.substr((new String("historySez_")).length);
		// controlla che se apro faccio la query 
		// altrimenti se chiudo NO
		//alert(id +"##" + tipoSezione);
		
		// commentato ma non so perchè
		// fosse stato messo
		/*if($("#h3_history_" + tipoSezione).hasClass("ui-state-active")){
			return;
		}*/
		
		//gbl_idenAnag
		/*
		myLista.push("//" + tipoSezione);
		myLista.push(gbl_idenEsa);
		myLista.push(gbl_idenEsa);
		myLista.push(gbl_idenEsa);
		if (gbl_idenEsa==""){alert("Errore: codice esame nullo!!"); return;}
		try{rs = parent.executeQuery('pat_infettive.xml',"getHistorySection",myLista);}catch(e){alert("Errore: getHistorySection");return;}
		*/
		
		// valido per precedente query
		// myLista.push(gbl_idenEsa);
		// ******
		myLista.push(array_descrizione_gruppi[0]);
		myLista.push(gbl_idenAnag);
		myLista.push(gbl_idenEsa);
		// baseUser.LISTAREPARTI 
		// aggiungere filtro per cdc dell'utente !!		
		var strListaReparti = "";
		for (var k=0;k<parent.baseUser.LISTAREPARTI.length;k++){
			if (strListaReparti==""){
				strListaReparti =parent.baseUser.LISTAREPARTI[k];
			}
			else{
				strListaReparti +="," +parent.baseUser.LISTAREPARTI[k];
			}
		}
		myLista.push(strListaReparti);

		//alert(array_descrizione_gruppi[0] + ", "+ gbl_idenAnag + ", "+ gbl_idenEsa);
		if (gbl_idenEsa==""){alert("Errore: codice esame nullo!!"); return;}
		try{rs = parent.executeQuery('pat_infettive.xml',"getHistorySection1",myLista);}catch(e){alert("Errore: getHistorySection1");return;}
		var strIden = "";
		while (rs.next()){
			if (strIden==""){strIden=rs.getString("iden");}
			else{strIden+="," + rs.getString("iden");}
		}
		//alert(strIden+"@@");
		if (strIden==""){return;}
		myLista = new Array();
		myLista.push("//" + tipoSezione);
		myLista.push(strIden);
		myLista.push(gbl_webuser);
//		alert("//" + tipoSezione + "  " + strIden + "  " + gbl_webuser);
		try{rs = parent.executeQuery('pat_infettive.xml',"getHistorySection2",myLista);}catch(e){alert("Errore: getHistorySection2");return;}
		var oTable = $('#TAB_HISTORY_' + tipoSezione).dataTable();
		// pulisco tutto
		oTable.fnClearTable();	
		// modifica 21-12-15
		var strProcessedText="", strGenericProcessedText = "";
		// ****
		while (rs.next()){
			bolRecordInDettEsami = true;
			//alert(rs.getString("letto")+","+ tipoSezione + ","+ strIden);
			listaIdenDettEsami.push(rs.getString("iden"));
			if (rs.getString("letto")=="S"){
				strStatoLetto = "<span class='docRead' title='" + tipoSezione +" letto/a' onclick='javascript:changeHistorySectionStatus(" + rs.getString("iden") +", \"UNREAD\", \""+ tipoSezione +"\", \"" + id + "\");'>&nbsp;</span>";				
			}
			else{
				strStatoLetto = "<span class='docUnread' title='" + tipoSezione +" non letto/a' onclick='javascript:changeHistorySectionStatus(" + rs.getString("iden") +", \"READ\", \""+ tipoSezione + "\", \"" + id + "\");'>&nbsp;</span>";		
			}
			strImportaTesto = "<span class='txtImport' title='Importa testo' onclick='javascript:importPreviousText(\"" + tipoSezione +"\", "+ indiceRiga + ");'>&nbsp;</span>";
			// modifica 21-12-15
			strProcessedText  = (rs.getString("campo_interesse")).toString().replaceAll("\n","<br/>");
			//	.replace(/(\r\n|\n|\r)/g,"<br />");
			//***
			
			// aggiungo campo iden per ordinamento
			try{
				oTable.fnAddData( [rs.getString("dataesameiso"),
								   rs.getString("Dataesame"),
								   rs.getString("descr_esame"),
								   strProcessedText,
								   strStatoLetto,
								   strImportaTesto], false);
			}
			catch(e){
//				alert("Attenzione: manca campo per ordinamento history");
				oTable.fnAddData( [rs.getString("Dataesame"),
								   rs.getString("descr_esame"),
								   strProcessedText,
								   strStatoLetto,
								   strImportaTesto], false);				
				
			}
			
			indiceRiga ++;
		}
		// ********** pezzo nuovo
		if (historyType=="GENERICA"){
			listaIdenGlobale = strIden.split(",");
			//alert("listaIdenGlobale " + listaIdenGlobale);
			//alert("listaIdenDettEsami " + listaIdenDettEsami);
			// modifica 20-1-16			
			var listaIdenRimanenti = new Array() ;
			if (listaIdenDettEsami.length==0){
				listaIdenRimanenti = listaIdenGlobale;
			}
			else{
				// modifica 12-2-16 , cambio approcio
				// x retro compatibilita
//				listaIdenRimanenti = listaIdenGlobale.diff(listaIdenDettEsami);
				listaIdenRimanenti  = arr_diff(listaIdenDettEsami,listaIdenGlobale);
			}
			// fine modifica 20-1-16
		
			if (listaIdenRimanenti.length>0){
				var listaIdenRimanenti = listaIdenRimanenti.toString();
//				alert(listaIdenRimanenti);
				// provo strada alternativa
				// per tirar su anche gli esami pregressati
				// come suggerito da MarcoV
				myLista = new Array();
				myLista.push(listaIdenRimanenti);
				myLista.push(gbl_webuser);		
				// non aggiungo filtro per cdc dell'utente perchè già filtrati
				// all'origine: strIden è già filtrato per cdc
				// *********
				try{rs = parent.executeQuery('pat_infettive.xml',"getHistorySectionByRefTxt",myLista);}catch(e){alert("Errore: getHistorySectionByRefTxt");return;}
				while (rs.next()){
					if (rs.getString("letto")=="S"){
						strStatoLetto = "<span class='docRead' title='" + tipoSezione +" letto/a' onclick='javascript:changeHistorySectionStatus(" + rs.getString("iden") +", \"UNREAD\", \""+ tipoSezione +"\", \"" + id + "\");'>&nbsp;</span>";				
					}
					else{
						strStatoLetto = "<span class='docUnread' title='" + tipoSezione +" non letto/a' onclick='javascript:changeHistorySectionStatus(" + rs.getString("iden") +", \"READ\", \""+ tipoSezione + "\", \"" + id + "\");'>&nbsp;</span>";		
					}
					strImportaTesto = "<span class='txtImport' title='Importa testo' onclick='javascript:importPreviousText(\"" + tipoSezione +"\", "+ indiceRiga + ");'>&nbsp;</span>";
					// modifica 21-12-15
					strGenericProcessedText  = (rs.getString("campo_interesse")).toString().replaceAll("\n","<br/>");
					//***					
					try{
						oTable.fnAddData( [rs.getString("dataesameiso"),
										   rs.getString("Dataesame"),
										   rs.getString("descr_esame"),
										   strGenericProcessedText,
										   strStatoLetto,
										   strImportaTesto], false
						);
					}
					catch(e){
//						alert("Attenzione: manca campo per ordinamento history");
						oTable.fnAddData( [rs.getString("Dataesame"),
										   rs.getString("descr_esame"),
										   strGenericProcessedText,
										   strStatoLetto,
										   strImportaTesto], false
						);
						
					}
					indiceRiga ++;
				}
			}
		}
		// aggiunto fnDraw
		try{oTable.fnDraw();		}catch(e){}
		setTimeout(function (){oTable.fnAdjustColumnSizing();}, 10 );
		// ********************************
		// ordino sempre per data!!!! Prima colonna
		setTimeout(function (){oTable.fnSort( [ [0,'desc'] ] );},1000);
		// ********************************
		
	}
	catch(e){
		alert("loadHistorySection - Error: " + e.description);
	}
}



//funzione che va a modificare il colore
//delle sezioni cui ci sono news NON lette
//questa DEVE essere chiamata anche quando
//viene fato un update dello stato
function updateHistorySectionHeader(id){
	var myLista = new Array();
	var rs;
	
	var tipoSezione = "";
	var strStatoLetto = "";
	var strImportaTesto = "";
	var indiceRiga = 0;
	var bolUnread = false;
	try{
//		alert("updateHistorySectionHeader "+ id);
		tipoSezione = id.substr((new String("historySez_")).length);
		myLista.push("//" + tipoSezione);
		myLista.push(array_descrizione_gruppi[0]);
		myLista.push(gbl_idenAnag);
		myLista.push(gbl_idenEsa);
		//alert("updateHistorySectionHeader "+ tipoSezione + "," + array_descrizione_gruppi[0] +","  + gbl_idenAnag + "," + gbl_idenEsa);
		try{rs = parent.executeQuery('pat_infettive.xml',"getHistorySection",myLista);}catch(e){alert("Errore: getHistorySection");return;}
		/*while (rs.next()){
			//alert(rs.getString("iden") + "#");
			if (rs.getString("letto")=="N"){
				bolUnread = true;
				break;
			}
			indiceRiga ++;
		}*/
		if (rs.next()){
			// esistono record NON letti
			try{if (parseInt(rs.getString("nrecord"))>0){ 
				bolUnread = true;
			}}catch(e){bolUnread = false;}
		}
		else{
			bolUnread = false;
		}
		//alert("bolUnread:" + bolUnread);
		// *****
		// pezzo nuovo
		// chiamata a funzione specifica
		if (!bolUnread){
			myLista = new Array();
			myLista.push(array_descrizione_gruppi[0]);
			myLista.push(gbl_idenEsa);
			myLista.push(gbl_idenAnag);
			myLista.push(gbl_webuser);
			try{rs = parent.executeQuery('pat_infettive.xml',"getHistoryInfoFromDBFunction",myLista);}catch(e){alert("Errore: getHistoryInfoFromDBFunction");return;}
			try{
				if (rs.next()){
					//alert(rs.getString("nrecord"));
					try{if (parseInt(rs.getString("nrecord"))>0){ 
						bolUnread = true;
					}}catch(e){bolUnread = false;}
				}
			}catch(e){;}
		}
		//alert("bolUnread:" + bolUnread);
		// ***********
		if (bolUnread){
			$("#h3_history_" + tipoSezione).attr('style','background:' + highlightSectionColor);
		}
		else{
			$("#h3_history_" + tipoSezione).attr('style','');
		}

	}
	catch(e){
		alert("updateHistorySectionHeader - Error: " + e.description);
	}
}

function importPreviousText(tipoSezione, rowIndex){
	var rows ;
	var value = "";
	try{
		rows = $("#TAB_HISTORY_" + tipoSezione).dataTable().fnGetNodes();
		value = $(rows[rowIndex]).find("td:eq(2)").html();
		//value = value.toString().replaceAll("<BR>","\n");
		value = value.toString().replaceAll("<BR>","###");
		value = htmlDecode(value);
		value = value.replaceAll("###","\n");
		$("#" + tipoSezione).val(value);
	}
	catch(e){
		alert("importPreviousText - Error: " + e.description);
	}
}
function htmlEncode(value){
  return $('<div/>').text(value).html();
}

function htmlDecode(value){
  return $('<div/>').html(value).text();
}

/**
* 
* @param idenEsame
* @param finalStatus
* @param sezione
*/
function changeHistorySectionStatus(idenEsame, finalStatus, sezione, id){
	var myLista = new Array();
	var rs;
	var stato = "";
	try{
		//alert(idenEsame + " " + finalStatus + " " + sezione + " " + id );
		// gbl_webuser
		// TAB_HISTORY_ + sezione
		var myLista = new Array();
		myLista.push(gbl_webuser);			
		myLista.push(idenEsame);
		myLista.push(sezione);
		if (finalStatus=="UNREAD"){	stato = "N";	}
		else{stato = "S";}
		myLista.push(stato);
		//alert(idenEsame + " " + finalStatus + " " + sezione + " " + stato + " " + id );
		
		var stm = parent.executeStatement('pat_infettive.xml','changeHistorySectionStatus',myLista,0);
		if (stm[0]!="OK"){
			alert("Errore: problemi nel salvataggio della data ultima visualizzazione Doc");
		}
		else{
			//alert("tutto ok");
		}
		//alert("aggiorno stato id: " + id + "#" +idenEsame + " " + finalStatus + " " + sezione );
		loadHistorySection(id, globalHistoryType);
		// aggiorno stato (colore) delle sezioni che
		// hanno una history (precedenti) collegati
		updateHistorySectionHeader(id);
	}
	catch(e){
		alert("changeHistorySectionStatus - Error: " + e.description);
	}
}

//************************* fine gestione history !! ****************
//*******************************************************************

function cambiaStileTextArea(oggetto, classe) {
	try{
//		oggetto.setAttribute("class", classe);
		if (classe=="ON"){
			$(oggetto).removeClass("OFF");
			$(oggetto).addClass(classe);			
		}
		else if (classe =="OFF"){
			$(oggetto).removeClass("ON");
			$(oggetto).addClass(classe);			
		}
	}
	catch(e){
		alert("cambiaStileTextArea - error: " + e.description);
	}
}

// ********************************************
// *************** gestione editing tabella ***
//********************************************
// da implementare nel js apposito del
// modulo
/*function updateRelatedArray(tableId, rowIndex, sVal){
	try{
		alert("updateRelatedArray\n" + tableId + ", " +  rowIndex + ", " + sVal);
	}
	catch(e){
		alert("updateRelatedArray - Error: " + e.description);
	}
}*/

// funzione che si occupa
// di attaccare la gestione degli 
// eventi di editing della tabella
// 
function attachEditPlugin(tableId){
	var arrayEditableColIndex = new Array();
	var k =0;
	var tipoEditing = "";
	try{
		//alert("attachEditPlugin "+ tableId);
		try{
			var keys = new KeyTable({
				"table": document.getElementById(tableId)
			});
		}
		catch(e){
			alert("attachEditPlugin - Error: " + e.description + ", attach KeyTable plugin");
		}
		
		if (hashEditableTable.containsKey(tableId)){
			// si contiene
			arrayEditableColIndex = hashEditableTable.get(tableId);
		}
		else{
			//alert("Attenzione: Non definito elenco colonne editabili");return;
		}
		
		for (k=0;k<arrayEditableColIndex.length;k++){

			keys.event.action(arrayEditableColIndex[k], null, function (nCell, x, y) {
				/* Block KeyTable from performing any events while jEditable is in edit mode */
				//alert(x + ", " + y);
				keys.block = true;
				// da togliere
				//dump(nCell, true);
				// ***************
				/* Initialise the Editable instance for this table */
				
				// in base al tipo:
				// chiamo  il costruttore
				// editable opportuno
				//alert("attr: " + $(nCell).attr("tipoEdit"));
				tipoEditing = $(nCell).attr("tipoEdit");
				$(nCell).attr("editabile","S");
				switch(tipoEditing){
					case "combo_singolo":
						//alert("aho so' combo");
						$(nCell).editable(function (sVal){
							keys.block = false;
							var coords = keys.fnGetCurrentPosition();
							//alert( "coords are: " + coords[0] + ", " + coords[1] + "\nx:" + x +", y:" + y + "\n" + sVal);
							updateRelatedArray(tableId, x,y, sVal);							
							//return sVal;
							return getTextByValue("IDEN_" + $(nCell).attr("tipoComboCollegato"), sVal);
						}, { 
						    data   : getDataForEditableObj(tableId, $(nCell).attr("tipoComboCollegato")),
						    type   : "select",
						    submit : "OK",
						    style  : "inherit",
								"onblur": 'submit', 
								"onreset": function(){ 
									/* Unblock KeyTable, but only after this 'esc' key event has finished. Otherwise
									 * it will 'esc' KeyTable as well
									 */
									setTimeout( function () {keys.block = false;}, 0); 
								}
							} );						
		
						break;
					case "scelta_data":

						//$(nCell).delegate('focus', 'dblclick', function () {
							$(nCell).editable(
							    function( sVal, settings ) {
							    	keys.block = false;
							    	var coords = keys.fnGetCurrentPosition();
							    	updateRelatedArray(tableId, x,y, sVal);
							    	//alert(sVal);
							    	//date.html( sVal );
							    	//alert( "coords are: " + coords[0] + ", " + coords[1] + "\nx:" + x +", y:" + y + "\n" + sVal);
							    	return sVal;
							    },
							    {
							      "type": 'datepicker',
							      "submit": 'OK',
							      "onblur": 'submit', 
								  "onreset": function(){ 
										/* Unblock KeyTable, but only after this 'esc' key event has finished. Otherwise
										 * it will 'esc' KeyTable as well
										 */
										setTimeout( function () {keys.block = false;}, 0); 
								  }							      
							    }
							  ); // fine editable
						//}); // fine delegate
						break;
					default:
						$(nCell).editable( function (sVal) {
							/* Submit function (local only) - unblock KeyTable */
							keys.block = false;
							var coords = keys.fnGetCurrentPosition();
							// fare update degli array collegati
								// 
							updateRelatedArray(tableId, x,y, sVal);
							//alert( "coords are: " + coords[0] + ", " + coords[1] + "\nx:" + x +", y:" + y + "\n" + sVal);
			/*			alert("fnGetCurrentData(): " + keys.fnGetCurrentData()+ "###") ;
						alert("fnGetCurrentTD(): " + keys.fnGetCurrentTD()) +"###";					*/
							return sVal;
						}, { 
							"onblur": 'submit', 
							"onreset": function(){ 
								/* Unblock KeyTable, but only after this 'esc' key event has finished. Otherwise
								 * it will 'esc' KeyTable as well
								 */
								setTimeout( function () {keys.block = false;}, 0); 
							}
						} ); // fine editable
						break;
				} // fine switch;
				/* Dispatch click event to go into edit mode - Saf 4 needs a timeout... */
				setTimeout( function () { $(nCell).click(); }, 0 );
				
			} ); // fine keys.event.action
		} // fine for
		
		/*$('table tr td[tipoEdit="combo_singolo"]').dblclick(function() {
			try{
				
				
				var e = jQuery.Event("keypress");
			    e.which = 13;
			    e.keyCode = 13;
			    $(this).trigger(e);
			    //$(this).dblclick();
		    }catch(ex){alert(ex.description);}
		});*/
		
	}
	catch(e){
		alert("attachEditPlugin - Error: " + e.description);
	}
}

//*************************
//funzione SPECIFICA per ogni modulo
//che accetta in ingresso il 
//testo che deve essere "incollato"
//in un campo del modulo
//*****
//il nome del campo ove viene incollato
//è definito in descGruppi.js di ogni modulo
//e si chiama idWherePasteStdReport
function importaRefertoSelezionato(value){
	try{
		/*
		if(testoReferto.substr(0, 2) == '&#'){
			document.frmMain.txtRefStd.innerHTML = testoReferto.toString().replace(regex,"#CRLF#");
			document.frmMain.txtRefStd.value = document.frmMain.txtRefStd.value.toString().replace(new RegExp("#CRLF#" , "g"),"\r\n"); 
		}
		else{
			try{
				document.frmMain.txtRefStd.value = decodeURI(testoReferto);
			}
			catch(e){
				document.frmMain.txtRefStd.value = testoReferto;
			}
		}
*/		
		var idWherePaste = "";
				
		if (idUltimoControlloSelezionato==""){
			idWherePaste = idWherePasteStdReport;
		}
		else{
			idWherePaste = idUltimoControlloSelezionato;
		}
		try{if (idWherePaste==""){return;}}catch(e){return;}
		if ($("#"+ idWherePaste).val()==""){
			$("#"+ idWherePaste).val(value); 
		}
		else{
			// appendo
			$("#"+ idWherePaste).val(			$("#"+ idWherePaste).val() +"\n" + value ); 						
			// questo solo se il controllo è html
//			$("#"+ idWherePasteStdReport).append("<BR/>" + value.toString().replaceAll("\\n","<BR/>").replaceAll("\\r","<BR/>"));
		}
		
	}
	catch(e){
		alert("importaRefertoSelezionato - Error: " + e.description);
	}
}


// ************** nuovo **************
// indica quali campi escludere dal caricamento
var listaCampiDaEscludere = {"DIABETOLOGIA":["DIARIO_DATA","DIARIO_ORA","OCCHIO_DATA","OCCHIO_ORA","RENE_DATA","RENE_ORA","CUORE_DATA","CUORE_ORA","VASIPER_DATA","VASIPER_ORA","NERVI_DATA","NERVI_ORA","PIEDE_DATA","PIEDE_ORA","VASICER_DATA","VASICER_ORA","DIETA_DATA","DIETA_ORA","STILE_DATA","STILE_ORA","ALTRO_DATA","ALTRO_ORA"]};
function importaRefertoPrecedente(idenEsamePrecedente){
	try{
		// *********** ATTENZIONE *******
		// decidere se gestirlo in questo modo
		// aggiungendo le personalizzazioni per ogni scheda
		// o modificare OGNI loadInitValue di OGNI modulo
		// aggiungendo il parametro iden in ingresso
		// ***********
		
		// ********
		// controllare che se hanno moduli differenti
		// posso importare direttamente reftxt.testo !!!
		// ********
		
		if (idenEsamePrecedente=="" || isNaN(idenEsamePrecedente)){return;}
		var tipoModuloRefertazione = array_descrizione_gruppi[0];		
		try{var rsTmp = parent.executeQuery('generica.xml','infoDettEsami',[idenEsamePrecedente]);}catch(e){alert("Errore: infoDettEsami");}
		if (rsTmp.next()){
			var tmp_strDatiXml = rsTmp.getString("xml_module_output");
			var tmp_XmlDoc = getXmlDocFromXmlString(tmp_strDatiXml);
			var tmp_nodoRow = tmp_XmlDoc.getElementsByTagName("ROW")[0];
			var tmp_nodifigli;
			var bolEscludo = false;
			if (tmp_nodoRow){
				tmp_nodifigli = tmp_nodoRow.childNodes;
				for (k=0;k<tmp_nodifigli.length;k++)
				{
					bolEscludo = false;
					if(tmp_nodifigli[k].childNodes[0]){
						// attenzione 
						// controllare se presenti in listaCampiDaEscludere!!!
						if(typeof(listaCampiDaEscludere[tipoModuloRefertazione])=="object"){
							if ($.inArray(tmp_nodifigli[k].nodeName,listaCampiDaEscludere[tipoModuloRefertazione])>-1){
								bolEscludo = true;
							}
						}
						if (!bolEscludo){
							setInitValueOfField(tmp_nodifigli[k].nodeName, tmp_nodifigli[k].childNodes[0].nodeValue, tmp_nodifigli[k]);
						}
					}
				}			
			}
		}
		// aggiungere le personalizzazioni in base al tipo di modulo
		// modifica 29-6-15

		switch (tipoModuloRefertazione){
			case "CAIRO_RRF":
				if (($("#ICD_DIAGNOSI_JSON").val()=="")||($("#ICD_DIAGNOSI_JSON").val()=="{\"lista\":[]}")){
					jsonDiagnosiAttuale = {"lista":[]};
					jsonDiagnosiAttuale.lista.push({"descrizione":"", "codice":"", "iden":""});
				}
				else{
					jsonDiagnosiAttuale = JSON.parse($("#ICD_DIAGNOSI_JSON").val());
					$("#COD_DIAGNOSI").val(jsonDiagnosiAttuale.lista[0].codice);
					$("#DIAGNOSI").val(jsonDiagnosiAttuale.lista[0].descrizione);					
				}	
				break;
			case "DIABETOLOGIA":
				// attenzione!!
				// per la diabetologia DEVO escludere le date e ore evento !!
				if (($("#ICD_DIAGNOSI_JSON").val()=="")||($("#ICD_DIAGNOSI_JSON").val()=="{\"lista\":[]}")){
					jsonDiagnosiAttuale = {"lista":[]};
				}
				else{
					jsonDiagnosiAttuale = JSON.parse($("#ICD_DIAGNOSI_JSON").val());
					for (var z=0;z<jsonDiagnosiAttuale.lista.length;z++){
						$("#COD_DIAGNOSI_" + jsonDiagnosiAttuale.lista[z].panatomica).val(jsonDiagnosiAttuale.lista[z].codice);
						$("#DIAGNOSI_" + jsonDiagnosiAttuale.lista[z].panatomica).val(jsonDiagnosiAttuale.lista[z].descrizione);
					}
				}
				
				var strFarmaci = tmp_XmlDoc.selectNodes("/ROW/FARMACO_ATT_TERAPIA")[0].childNodes[0].nodeValue;
				if (strFarmaci!=""){
					jsonArrayFarmaciAttuali = JSON.parse(strFarmaci);
					fillFarmaciTable("FARMACO_ATT_");
				}
				break;
			default:
				break;
		}		
		
	}
	catch(e){
		alert("importaRefertoPrecedente - Error: "+ e.exception); 
	}
}


// *********** nuovo 28-1-15
function commonSetFocusOnFirstField (){
	try{
		// idFirstField DEVE essere definito in descrGruppo del moduloconsole
		if (idFirstField!=""){
			setTimeout("$('#" + idFirstField +"').focus()",1500 );
		}
	}
	catch(e){;}
}

// ********************************



//********************************* jsHashTable ***************
function Hashtable(){
    this.clear = hashtable_clear;
    this.containsKey = hashtable_containsKey;
    this.containsValue = hashtable_containsValue;
    this.get = hashtable_get;
    this.isEmpty = hashtable_isEmpty;
    this.keys = hashtable_keys;
    this.put = hashtable_put;
    this.remove = hashtable_remove;
    this.size = hashtable_size;
    this.toString = hashtable_toString;
    this.values = hashtable_values;
    this.hashtable = new Array();
}

/*=======Private methods for internal use only========*/

function hashtable_clear(){
    this.hashtable = new Array();
}

function hashtable_containsKey(key){
    var exists = false;
    for (var i in this.hashtable) {
        if (i == key && this.hashtable[i] != null) {
            exists = true;
            break;
        }
    }
    return exists;
}

function hashtable_containsValue(value){
    var contains = false;
    if (value != null) {
        for (var i in this.hashtable) {
            if (this.hashtable[i] == value) {
                contains = true;
                break;
            }
        }
    }
    return contains;
}


// **** fine jsHashtable ****************
function hashtable_get(key){
    return this.hashtable[key];
}

function hashtable_isEmpty(){
    return (parseInt(this.size()) == 0) ? true : false;
}

function hashtable_keys(){
    var keys = new Array();
    for (var i in this.hashtable) {
        if (this.hashtable[i] != null) 
            keys.push(i);
    }
    return keys;
}

function hashtable_put(key, value){
    if (key == null || value == null) {
        throw "NullPointerException {" + key + "},{" + value + "}";
    }else{
        this.hashtable[key] = value;
    }
}

function hashtable_remove(key){
    var rtn = this.hashtable[key];
    this.hashtable[key] = null;
    return rtn;
}

function hashtable_size(){
    var size = 0;
    for (var i in this.hashtable) {
        if (this.hashtable[i] != null) 
            size ++;
    }
    return size;
}

function hashtable_toString(){
    var result = "";
    for (var i in this.hashtable)
    {      
        if (this.hashtable[i] != null) 
            result += "{" + i + "},{" + this.hashtable[i] + "}\n";   
    }
    return result;
}

function hashtable_values(){
    var values = new Array();
    for (var i in this.hashtable) {
        if (this.hashtable[i] != null) 
            values.push(this.hashtable[i]);
    }
    return values;
}
// ************************************************************


// ****************************
// ******** MED INIZIATIVA
// ****************************
// modifica 11-6-15
var medIniz_gruppi =["MMG"];
// NOTA BENE ci DEVE sempre essere corrispondenza lunghezza liste 
// Nomi Campi  e  Label Campi
var medIniz_listaSezioni={"MMG":["MMGFARMACI","MMGACCERTAMENTI","MMGPROBLEMI","MMGDIARIO"]};
var campiDB_sezioni ={
	"MMGFARMACI":{"nomi":["DATA_ISO","FARMACO","QUANTITA","POSOLOGIA","MEDICO"],"funcProcData":["FORMAT_MMG_DATA.formattaDate","","","",""],"valoriResultSet":[],"visibili":["S","S","S","S","S"]},
	"MMGACCERTAMENTI":{"nomi":["DATA_ISO","ACCERTAMENTO","MEDICO"],"funcProcData":["FORMAT_MMG_DATA.formattaDate","",""],"valoriResultSet":[],"visibili":["S","S","S"]},
	"MMGPROBLEMI":{"nomi":["DATA_ISO","PROBLEMA_COMPLETO","CHIUSO_DESCR","DESCR_MED"],"funcProcData":["FORMAT_MMG_DATA.formattaDate","","",""],"valoriResultSet":[],"visibili":["S","S","S","S"]},
		"MMGDIARIO":{"nomi":["IDEN","DATA_ISO","TIPO_NOTE","NOTA","MEDICO","TIPO_NOTE","IDEN_MED"],"funcProcData":["","FORMAT_MMG_DATA.formattaDate","","","","FORMAT_MMG_DATA.formattaNotaUrl"],"valoriResultSet":[],"visibili":["N","S","S","S","S","S","N"]}	};
var labelCampiDB_sezioni ={"MMGFARMACI":["DATA","FARMACO","QUANTITA'","POSOLOGIA","MED.PRESCRITTORE"],
"MMGACCERTAMENTI":["DATA ACCERTAMENTO","ACCERTAMENTO","MED.PRESCRITTORE"],
"MMGPROBLEMI":["DATA INIZIO","PROBLEMA","CHIUSO","MEDICO"],
"MMGDIARIO":["IDEN","DATA","TIPO NOTA","NOTA","MEDICO","DOCUMENTO","IDEN_MED"]
};
var h3_sezioni ={"MMGFARMACI":"Prescrizione Farmaci","MMGACCERTAMENTI":"Prescrizione Accertamenti", "MMGPROBLEMI":"Problemi e Diagnosi","MMGDIARIO":"Note Diario e visite"};

function initMedInizSection(){
	var objHome ;
	try{
		if (typeof(getHomeFrame)=="undefined"){
			// sembra non andare...
//			objHome = parent.getHomeFrame();
			objHome = parent.parent.top.opener.top;
		}
		else{
			objHome = getHomeFrame();
		}
		// mega tappullo per problemi 
		// sulla webapp 121:8081
		if (!objHome.home){
			objHome  = top.opener.top;
		}		
		//********
		// da cambiare DEVE essere == "S"
		// controllare che l'anagrafica sia
		// sotto med. d'inziativa
		// magari mediante funzione PCK_NOTIFICHE.isPercorsoIniziativa
		// per ora evitare transcodifica id di riferimento
		if (parent.glbMedIniziativa){
			// appendo al body un nuovo multiAccordion
			// medicina iniziativa
			
			var srcIframe = "";
			// /ambulatorio/moduloConsole/moduloConsole/MMG_MED_INIZIATIVA.html
			/*
			srcIframe = "moduloConsole/MMG_MED_INIZIATIVA.html?sorgente=consolle&idenAnag=" + gbl_idenAnag;
			var iFrameMedIniz = "<iframe width='100%' src='"+ srcIframe +"' id ='iMedIniz'></iframe>";*/
			// loop
			// attenzione: in base a medIniz_gruppi
			// farei un fieldset per ogni elemento
			// per evidenziare che in futuro oltre che da MMG
			// potrebbero arrivare anche da altri attori delle info 
			var strAccordion = "";
			var strTmp = "";
			var nomeSezione = "";
			for (var k=0;k<medIniz_gruppi.length;k++){
				strTmp = "";
				var lista = eval("medIniz_listaSezioni." + medIniz_gruppi[k]);				
				for (var z=0;z<lista.length;z++){
					strTmp += getMedInizAccordion(medIniz_gruppi[k],lista[z]);
				}
				strAccordion +=  "<div id='multiAccordion_mediniz_" + medIniz_gruppi[k]+ "'>" + strTmp +"</div>";				
			}
			// ***********
			$("form").first().append(strAccordion);			
			$('div[id^="multiAccordion_mediniz_"]').each(function(i){
				jQuery(this).multiAccordion();
				jQuery(this).multiAccordion("option",{ "active":"none"});			
			});

			$('h3[id^="h3_MEDINIZ_"]').each(function(){		
				//alert(jQuery(this).siblings().get(0).tagName);
				updateMedInizSectionHeader(jQuery(this).attr("id"));
				jQuery(this).bind('click', function() {
					loadMedInizSection(jQuery(this).attr("gruppo"),jQuery(this).attr("id"), jQuery(this).attr("id").split("_")[jQuery(this).attr("id").split("_").length-1]);
				});						 
			});
			
			// modifica 29-7-15
			// appendo pulsante
			// uso tag A e non button perchè nel modulo UVA
			// viene malamente chiamato il costruttuore button per tutti i button !
			// verrebbero quindi chiamate + funzioni
			$("form").first().append("<hr/><a id='btCreaMessaggioMedIniz'>Invia messagio a MMG per il paziente</a>");
			$( '#btCreaMessaggioMedIniz' ).button().click(function( event ) {
   				event.preventDefault();
				parent.creaNuovaNotificaSuPaziente(parent.globalIdenAnag);
			}).css('width','98%').css('margin-top','5px');			

		}
	}
	catch(e){
		alert("initMedInizSection - Error: " + e.description);
	}
}

function getMedInizAccordion(gruppo,tipo){
	var strAccordion = "", strTmp = "";
	try{
		strAccordion = "";
		strAccordion +=  "<h3 id='h3_MEDINIZ_"+ tipo+"' gruppo='"+ gruppo +"' ><a href='#' id='SEZ_MEDINIZ_"+ tipo +"'>";
		strAccordion +=  eval ("h3_sezioni." + tipo) +"</a></h3>";

		strAccordion += "<div> <table cellpadding='0' cellspacing='0' border='0' gruppo='"+ gruppo +"' class='display' id='TAB_MEDINIZ_" + tipo + "' width='100%'><thead><tr>";
		// loop su campi
		var listaLabel = eval("labelCampiDB_sezioni." + tipo);
		var listaCampi = eval("campiDB_sezioni." + tipo);
		for (var z=0;z<listaLabel.length;z++){
			if (listaCampi.visibili[z]=="S"){
				strAccordion += "<th>" + listaLabel[z] +"</th>";
			}
		}
		// aggiungo in cosa un campo per importazione testo
		// successivamente migliorare la gestione
		strAccordion += "<th>&nbsp;</th>";
		// ***************************************************
		
		strAccordion += "</tr></thead><tbody></tbody></table></div>";
		return strAccordion;
		}
	catch(e){
		alert("getMedInizAccordion - Error: " + e.description);
		
	}
}

function loadMedInizSection(gruppo,id, tipo){
	var highLightColor = "yellow";
	try{
//		alert(id +"\n" + tipo);
		$('table[id="TAB_MEDINIZ_' + tipo +'"]').each(function(){
			jQuery(this).dataTable({
				"fnDrawCallback": function(){
					  $('#TAB_MEDINIZ_' + tipo+' td').bind('mouseenter', function () { $(this).parent().children().each(function(){$(this).addClass('datatablerowhighlight');}); });
					  $('#TAB_MEDINIZ_' + tipo+' td').bind('mouseleave', function () { $(this).parent().children().each(function(){$(this).removeClass('datatablerowhighlight');}); });
				},								   
				"bPaginate": false,
				"bLengthChange": true,
				"bFilter": false,
				"bSort": false,
				"bInfo": false,
				"bAutoWidth": true,
				"bJQueryUI": true,
				"bRetrieve": true,
				"oLanguage": {
						"sZeroRecords": "Nessun elemento"
					}	
				}
			);	
		});	
		
		// ******** da togliere !!!!
		// ed usare solo gbl_idenAnag
		var idenAnag ;
		/*
		switch (tipo){
			case "MMGFARMACI":
				idenAnag = 667572; //paziente "luca sacco" in ufficio
				break;
			case "MMGACCERTAMENTI":
				idenAnag = 667572; //paziente "luca sacco" in ufficio
				break;
			case "MMGPROBLEMI":
				idenAnag = 635403; //paziente "RICETTAROSSA	RICETTAROSSA" in ufficio			
				break;
			case "MMGDIARIO":
				idenAnag = 667572; //paziente "luca sacco" in ufficio
				break;
			
			default:
				return;
		}*/
		// a regime decommentare riga sottostante
		// e commentare lo switch sopra
		idenAnag = gbl_idenAnag;
		
		var idenRemoto = "";
		var rsRemoto = parent.executeQuery('info_repository.xml','getIdenRemoto',[idenAnag]);
		if (rsRemoto.next()){
			idenRemoto = rsRemoto.getString("ID_REMOTO");
		}
		if (idenRemoto==""){alert("Errore: idenRemoto nullo");return;	}	
		
		
		// **********************************
		
//		try{var rs = parent.executeQuery('med_iniziativa.xml',"get_" + tipo,[idenAnag]);}catch(e){alert("Errore: get_" + tipo);return;}
		try{var rs = parent.executeQuery('med_iniziativa.xml',"get_" + tipo,[idenRemoto]);}catch(e){alert("Errore: get_" + tipo);return;}
		var oTable = $('#TAB_MEDINIZ_' + tipo).dataTable();
		
		// pulisco tutto
		oTable.fnClearTable();	
		var indiceRiga = 0;
		var strImportaTesto= "";
		var listaValoreCampiProcessati =[];
		var listaValoreCampiOriginali =[];
		var listaNomeCampi =[];
		
		var listaValoriRiga ;
		
		while (rs.next()){
			//bolRecordInDettEsami = true;
			//alert(rs.getString("letto")+","+ tipoSezione + ","+ strIden);
			strImportaTesto = "<span class='txtImport' title='Importa testo' onclick='javascript:importMedInizText(\""+ gruppo +"\",\"" + tipo +"\", "+ indiceRiga + ");'>&nbsp;</span>";
			// aggiungo campo iden per ordinamento
			try{
//				campiDB_sezioni.  tipo . nome [i]
//				"FARMACO","POSOLOGIA","PIANO_TERAPEUTICO","DATA_INIZIO","DATA_FINE"
				listaNomeCampi = eval("campiDB_sezioni." + tipo +".nomi");
				var modificatore = "";
				listaValoreCampiProcessati = []; listaValoreCampiOriginali = [];
				for (var z=0;z<listaNomeCampi.length;z++){
					if (eval("campiDB_sezioni." + tipo +".visibili")[z]=="S"){
						modificatore = (eval("campiDB_sezioni." + tipo +".funcProcData"))[z];
						if (modificatore!="" && rs.getString(listaNomeCampi[z])!=""){
							//alert(modificatore + "(\"" + rs.getString(listaNomeCampi[z])+ "\")");
	//						alert(modificatore + "(\"" + rs.getString(listaNomeCampi[z])+ "\",\""+tipo +"\"," + z +")");
							listaValoreCampiProcessati.push(eval(modificatore + "(\"" + rs.getString(listaNomeCampi[z])+ "\",\""+tipo +"\"," + indiceRiga +")"));						
						}
						else{
							listaValoreCampiProcessati.push(rs.getString(listaNomeCampi[z]));
						}
					}
					// indipendentemente che siano visibili o no SALVO TUTTI 
					//  i valori
					listaValoreCampiOriginali.push(rs.getString(listaNomeCampi[z]));
				}
				// salvo i valori
				// passo l'array per valore (uso metodo slice)
				// perchè l'array originale viene manipolato ulteriormente
				eval("campiDB_sezioni." + tipo +".valoriResultSet.push(listaValoreCampiOriginali.slice());");
				// ***********
				// ultima colonna contiene icona per import testo
				listaValoreCampiProcessati.push(strImportaTesto);
				oTable.fnAddData( listaValoreCampiProcessati, false);
			}
			catch(e){
				alert("Attenzione: manca campo per ordinamento history");
			}
			
			indiceRiga ++;
		} // fine ciclo
		
		// aggiunto fnDraw
		try{oTable.fnDraw();		}catch(e){}
		setTimeout(function (){oTable.fnAdjustColumnSizing();}, 10 );
		// ********************************
		// ordino sempre per data!!!! Prima colonna
//		setTimeout(function (){oTable.fnSort( [ [0,'desc'] ] );},1000);		

	}
	catch(e){
		//alert("loadMedInizSection - Error: " + e.description);
	}	
}


//funzione che va a modificare il colore
//delle sezioni cui ci sono news NON lette
//questa DEVE essere chiamata anche quando
//viene fato un update dello stato
// al momento NON gestito
function updateMedInizSectionHeader(id){
	var myLista = new Array();
	var rs;
	
	var tipoSezione = "";
	var strStatoLetto = "";
	var strImportaTesto = "";
	var indiceRiga = 0;
	var bolUnread = false;
	
	return;
	
	try{
		
		
		
//		alert("updateHistorySectionHeader "+ id);
		tipoSezione = id.substr((new String("SEZ_MEDINIZ_")).length);
		myLista.push("//" + tipoSezione);
		myLista.push(array_descrizione_gruppi[0]);
		myLista.push(gbl_idenAnag);
		myLista.push(gbl_idenEsa);
		// ***********
		if (bolUnread){
			$("#h3_MEDINIZ_" + tipoSezione).attr('style','background:' + highlightSectionColor);
		}
		else{
			$("#h3_MEDINIZ_" + tipoSezione).attr('style','');
		}

	}
	catch(e){
		alert("updateHistorySectionHeader - Error: " + e.description);
	}
}

function importMedInizText(gruppo,tipoSezione, rowIndex){
	var rows ;
	var value = "";
	try{
		rows = $("#TAB_MEDINIZ_" + tipoSezione).dataTable().fnGetNodes();
		value = $(rows[rowIndex]).find("td:eq(1)").html();
		//value = value.toString().replaceAll("<BR>","\n");
		value = value.toString().replaceAll("<BR>","###");
		value = htmlDecode(value);
		value = value.replaceAll("###","\n");
		alert("Importa testo:\n" + value );
		// l'idea è quella di demandare la compilazione ai
		// singoli moduli di refertazione
		// passando una struttura json specifica
		// indicante: il tipo, quindi medIniz_gruppi[i]
		// e la struttura dati 
		var listaDati =[], listaColonne=[];
		listaDati =eval("campiDB_sezioni." + tipoSezione +".valoriResultSet[rowIndex]");
//		alert(listaDati);
		// costruisco il pacchetto json
		var objJson ={"gruppo":gruppo,"sezione":tipoSezione, "dati":{}};
		// loop su nome campi
//		labelCampiDB_sezioni
		listaColonne = eval("campiDB_sezioni." + tipoSezione + ".nomi");
		for (var z=0;z<listaColonne.length;z++){
			eval("objJson.dati." + listaColonne[z] +"=\""+ listaDati[z] +"\"");
		}

		// NB la funzione handleImportedText DEVE essere implementata
		// in tutti moduli console specifici , con le proprie logiche di gestione
		try{
			handleImportedText (objJson);
		}
		catch(e){
			alert("Attenzione: funzionalita' non gestita");
		}

	}
	catch(e){
		alert("importMedInizText - Error: " + e.description);
	}
}

var FORMAT_MMG_DATA ={
	formattaDate : function (value,tipo,indice){
		try{
			if (value!=""){
				return (new String(value)).toItalianDateFormat();
			}
		}
		catch(e){
			alert("formattaDate - Error: " + e.description);
		}			
	},
	formattaPianoTer : function (value,tipo,indice){
		try{
			if (value=="S")
				return "Relativo a piano terapeutico";
			else
				return "NON collegato a piano terapeutico";
				
		}
		catch(e){
			alert("formattaPianoTer - Error: " + e.description);
		}		
	},
	formattaNotaUrl : function (value,tipo,indice){
		var strOutput ="";
		// in ingresso arriva TIPO_NOTE
		try{
			if (value=="VISITE"){
				strOutput = "<a href='#' onclick='javascript:MMG_FUNCTIONS.openMMGReport(\""+ tipo +"\"," + indice + ");return false;'>Apri documento</a>";
			}
			return strOutput;
		}
		catch(e){
			alert("formattaNotaUrl - Error: " + e.description);
		}		
	}
}



var MMG_FUNCTIONS ={
	// cambiare affinchè in ingresso ci siano già le info di MMG
	// cioè iden, iden_med, tipo_note
	openMMGReport : function(tipo, indice){
		try{
			var strIdenMed ="";
			var strIden = "";
			var listaDati =[], listaColonne=[];
			var strNomeReport = "";
			var urlMMGreport = "";
			
			
			listaDati =eval("campiDB_sezioni." + tipo +".valoriResultSet[indice]");

			var objJson ={"dati":{}};
			// loop su nome campi
			//		labelCampiDB_sezioni
			listaColonne = eval("campiDB_sezioni." + tipo + ".nomi");
			for (var z=0;z<listaColonne.length;z++){
				eval("objJson.dati." + listaColonne[z] +"=\""+ listaDati[z] +"\"");
			}
			strIden = objJson.dati.IDEN ;
			strIdenMed = objJson.dati.IDEN_MED ;
			strNomeReport = objJson.dati.TIPO_NOTE ;
			urlMMGreport = parent.getHomeFrame().home.getConfigParam("MMG_URL_REPORT");

			if (strIden=="" || typeof(strIden)=="undefined" || strIdenMed=="" || typeof(strIdenMed)=="undefined"){
				alert("Identificativi non validi, impossibile aprire il documento.");
				return;
			}
			// esempio http://192.168.3.34:8082/crystal/?report=/usr/local/report/MMG/DEFAULT/VISITE.RPT&init=pdf&promptpIden=79702&promptpIdenMed=25907			
			urlMMGreport += "?report=/usr/local/report/MMG/DEFAULT/" + strNomeReport +".RPT&init=pdf&promptpIden=" + strIden +"&promptpIdenMed=" + strIdenMed;
//			alert(urlMMGreport);
			window.open(urlMMGreport,"","top=0, left=0,width="+ screen.availWidth + ", height="+ screen.availHeight);
			/*
			
			urlMMGreport = "http://192.168.3.34:8082/crystal/?report=/usr/local/report/MMG/DEFAULT/VISITE.RPT&init=pdf&promptpIden=79702&promptpIdenMed=25907";
			$.fancybox({
				'href'			: urlMMGreport,
				'width'				: 630,
				'height'			: 540,
				'autoScale'     	: false,
				'transitionIn'	:	'elastic',
				'transitionOut'	:	'elastic',
				'type'				: 'iframe',
				'showCloseButton'	: false,
				'iframe': {
					preload: false // fixes issue with iframe and IE
				},
				'scrolling'   		: 'no'
			});
			*/

		}
		catch(e){
			alert("openMMGReport - Error: " + e.description);
		}		
	}
	
}
