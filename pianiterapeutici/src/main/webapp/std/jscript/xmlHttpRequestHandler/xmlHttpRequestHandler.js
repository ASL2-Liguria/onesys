// JavaScript Document
// passo in ingresso
// la url per la servlet che manda in output
// i dati che ci servono
// e la sql di cosa vogliamo filtrare (DEVE essere presente sempre
// la clausola where)
var httpRequestObject
var URL_to_call_for_xmlData = "XML2DB?conType=xml&xmlParse=yes&xmlSend="
var myCallBackFunctionToCall = "";

function getHTTPObject() {

	 var xmlhttp
	 var ieXmlHttpVersions = new Array();
	 ieXmlHttpVersions[ieXmlHttpVersions.length] = "MSXML2.XMLHttp.7.0";
	 ieXmlHttpVersions[ieXmlHttpVersions.length] = "MSXML2.XMLHttp.6.0";
	 ieXmlHttpVersions[ieXmlHttpVersions.length] = "MSXML2.XMLHttp.5.0";
	 ieXmlHttpVersions[ieXmlHttpVersions.length] = "MSXML2.XMLHttp.4.0";
	 ieXmlHttpVersions[ieXmlHttpVersions.length] = "MSXML2.XMLHttp.3.0";
	 ieXmlHttpVersions[ieXmlHttpVersions.length] = "MSXML2.XMLHttp";
	 ieXmlHttpVersions[ieXmlHttpVersions.length] = "Microsoft.XMLHttp";
	
	 var i;
	 for (i=0; i < ieXmlHttpVersions.length; i++){
		  try{
			   xmlhttp = new ActiveXObject(ieXmlHttpVersions[i]);
			   break;
		  }
		  catch (exc){
		   //alert(ieXmlHttpVersions[i] + " not supported.");
		  }
	 }
	
	 if (typeof xmlhttp == "undefined"){
	  xmlhttp = false;
	}

    return xmlhttp;
}


function getXMLData(xmlServletUrl, sql, callBackFunction){

	var internalUrl

	try{
		if (xmlServletUrl==""){
			// uso quella di default
			internalUrl = URL_to_call_for_xmlData;
		}
		else{
			internalUrl = xmlServletUrl;
		}
		myCallBackFunctionToCall = callBackFunction;
		if (httpRequestObject){
		}
		else{
			httpRequestObject = getHTTPObject();
		}
		//alert(encodeURI(internalUrl + parseSql(sql))  );
		httpRequestObject.open("GET", encodeURI(internalUrl + parseSql(sql)) , true);
		httpRequestObject.onreadystatechange = function(){processRequestAfterXmlRequest();};
		httpRequestObject.send(null);
	}
	catch(e){
		alert("getXMLData " + e.description);
	}
}


// questa è la chiamata di callback
// se la chiamata è completata allora readystate = 4
// e se la trasmissione http è terminata con sussesso lo status = 200
// quindi posso far proseguire il flusso di lavoro
function processRequestAfterXmlRequest(){
	
	var bolError = false;
	var errorObject
	var xmlDoc 
	
	try{
		if (httpRequestObject.readyState==4){
			if (httpRequestObject.status == 200){
				// QUESTO è OK
//				var objXml = httpRequestObject.responseXML;
//				alert(objXml.getElementsByTagName("CODE")[0].childNodes[0].nodeValue);
				
				try{
					errorObject = httpRequestObject.responseXML.getElementsByTagName("ERROR")[0];
				}
				catch(e){
					alert("processRequestAfterXmlRequest - Error getting documentElement: " + e.description + "\n" + httpRequestObject.responseText);					
				}
				bolError = xmlErrorHandler(errorObject);
				if (bolError){
					// ERRORE
					return;
				}
				else{
					// nessun errore, quindi continuo
					if (myCallBackFunctionToCall!=""){
						try{
							// OK
//							alert(httpRequestObject.responseText);
							eval(myCallBackFunctionToCall+"(httpRequestObject.responseXML)");
						}
						catch(e){
							alert("processRequestAfterXmlRequest - " + e.description);
							myCallBackFunctionToCall ="";
						}
					}
				}
				
			}
			else{
				alert("Error loading page \n " + httpRequestObject.status + ":" + httpRequestObject.statusText);
			}
		}
	}
	catch(e){
		alert("processRequestAfterXmlRequest" + e.description);
	}
}


// funzione che elabora l'errore
function xmlErrorHandler(errObj){
	
	var errCodeObj
	var errCodeValue
	var errDescriptionObj
	var errDescriptionValue
	
	var bolOutput =false;
	
	try{
		if (errObj){
			errCodeObj = errObj.getElementsByTagName("CODE")[0];
			errCodeValue = errCodeObj.childNodes[0].nodeValue;
			if (errCodeValue.toString() != "0"){
				errDescriptionObj = errObj.getElementsByTagName("DESCR")[0];
				errDescriptionValue = errDescriptionObj.childNodes[0].nodeValue;
				// errore
				alert("Xml Error: "+ errDescriptionValue);
				bolOutput = true;
			}
			else{
				// OK
				bolOutput = false;
			}
		}
		else{
			;
		}
	}
	catch(e){
		alert("xmlErrorHandler " + e.description);
		bolOutput = true;
	}
	return bolOutput;
//	getElementsByTagName('assignment")[
	
}

function parseSql(strSql){

	var strTmp = "";
	var regEx = /\s+/g
	
	
	strTmp = strSql.replace(regEx,"+");
//	alert("@" + strTmp + "@");
	return strTmp;
		
}


// funzione che passatole
// l'oggetto xml e il nome del tag
// ne ritorna il valore
// *** ATTENZIONE viene preso solo il PRIMO valore del primo tag
// trovato !!!
function getTagXmlValue(xmlDoc, nomeTag){
	var chiaveTagObj
	var strOutput = "";
	
	try{
		if (xmlDoc){
			chiaveTagObj = xmlDoc.getElementsByTagName(nomeTag)[0];
			if (chiaveTagObj){
				strOutput = chiaveTagObj.childNodes[0].nodeValue;	
			}
		}
	}
	catch(e){
		//alert("getTagXmlValue " + e.description);
	}
	return strOutput;
	
}
