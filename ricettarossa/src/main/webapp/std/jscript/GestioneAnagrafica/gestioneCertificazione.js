var myXmlHttpRequest;

function disabilitaCertificata(){
	selectValidato();
}

function setCertificato(valueCert){
	//alert(valueCert);
	if (valueCert!=null && valueCert!='null' &&  valueCert!='IN')
	{
		//document.frmDati.strPresso.disabled=true;
		document.frmDati.strPresso.value=document.frmDati.anag_cod.value;
		document.frmDati.strCogn.onchange=cambiato;
		document.frmDati.strCogn.onchange=cambiato;
		document.frmDati.strNome.onchange=cambiato;
		document.frmDati.strDataPaz.onchange=cambiato;
		document.frmDati.strLuogoNas.onchange=cambiato;
		document.frmDati.strCodiceFisc.onchange=cambiato;
		document.frmDati.strComRes.onchange=cambiato;
	}
	
	if (valueCert=='CO')
	{
		document.getElementById('LBL_Registra').parentElement.style.visibility = 'hidden' 
	}
}


function cambiato()
{
	alert('ATTENZIONE MODIFICATO DATO FONDAMENTALE DI ANGRAFICA CERTIFICATA\r\n REGISTRANDO SI INSERIRA UN NUOVO PAZIENTE')
	document.frmDati.modalita.value='I';
}


function insertVerona()
{

}

function disabilitaCampi(){
	document.frmDati.strCogn.disabled=true;
	document.frmDati.strNome.disabled=true;
	document.frmDati.strDataPaz.disabled=true;
	document.frmDati.strLuogoNas.disabled=true;
	document.frmDati.strCodiceFisc.disabled=true;
	document.frmDati.strComRes.disabled=true;
	document.getElementById('LBL_COMUNERESIDENZA').disabled=true;
	//document.getElementById('LBL_COMUNERESIDENZA').readonly=true;
}



function getHTTPObject() 
{
	 var xmlhttp
	 var ieXmlHttpVersions = new Array();
	 var i;
	 
	 ieXmlHttpVersions[ieXmlHttpVersions.length] = "MSXML2.XMLHttp.7.0";
	 ieXmlHttpVersions[ieXmlHttpVersions.length] = "MSXML2.XMLHttp.6.0";
	 ieXmlHttpVersions[ieXmlHttpVersions.length] = "MSXML2.XMLHttp.5.0";
	 ieXmlHttpVersions[ieXmlHttpVersions.length] = "MSXML2.XMLHttp.4.0";
	 ieXmlHttpVersions[ieXmlHttpVersions.length] = "MSXML2.XMLHttp.3.0";
	 ieXmlHttpVersions[ieXmlHttpVersions.length] = "MSXML2.XMLHttp";
	 ieXmlHttpVersions[ieXmlHttpVersions.length] = "Microsoft.XMLHttp";	
	 
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


function selectValidato(idenUpdate){
	var sql = "";

	try{
		
		myXmlHttpRequest=getHTTPObject();
		sql = "select * from anag where iden="+document.frmDati.anag_cod.value;

		//alert(sql);
		URL_to_call_for_xmlData='/polaris/XML2DB?conType=xml&xmlParse=yes&xmlSend='
//alert(encodeURI(URL_to_call_for_xmlData + parseSql(sql)));

		myXmlHttpRequest.open("GET", encodeURI(URL_to_call_for_xmlData + parseSql(sql)) , true);
		myXmlHttpRequest.onreadystatechange = function(){processAfterUpdate();};

		myXmlHttpRequest.send();
	}
	catch(e){
		alert("Update Medico - Error: " + e.description)
	}
}


function processAfterUpdate(){
	try{
		if (myXmlHttpRequest.readyState==4)
		{
			if (myXmlHttpRequest.status == 200){
				try{
					errorObject = myXmlHttpRequest.responseXML.getElementsByTagName("ERROR")[0];
				}
				catch(e){
					alert("Update Medico - Error: " + e.description + "\n" + myXmlHttpRequest.responseText);
				}
				bolError = xmlErrorHandler(errorObject);
				if (bolError){
					// ERRORE
					alert("ERRORE:" + errorObject);
					return;
				}
					certificata = myXmlHttpRequest.responseXML.getElementsByTagName("CERTIFICATO")[0];
					setCertificato(certificata.childNodes[0].nodeValue);
				
			}
		}
	}
	catch(e){
		alert("processAfterLoadPatient - Error: " + e.description);

	}
}



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
}



function parseSql(strSql){
	var strTmp = "";
	var regEx = /\s+/g;	
	
	strTmp = strSql.replace(regEx,"+");
//	alert("@" + strTmp + "@");
	return strTmp;		
}