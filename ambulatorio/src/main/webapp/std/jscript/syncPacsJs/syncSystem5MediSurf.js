/*attiva_sinc_medisurf = trim(rs_glo("attiva_sinc_medisurf")) & ""
server_medisurf = trim(rs_glo("server_medisurf")) & ""
parametri_medisurf = trim(rs_glo("parametri_medisurf")) & ""
archivio_medisurf = trim(rs_glo("archivio_medisurf")) & ""
 */

function actionMediSurf(azione, objUtente, objStudio, additionalParameters, pacsType){
	var strAccessionNumber = "";
	var patientId = "";
	var regEx = /\*/g;	

	alert("azione: " + azione + " additionalParameters: " + additionalParameters);

	try{
		if((additionalParameters=="")||(azione=="")){
			return;
		}

		// accession number selezionati
		strAccessionNumber = objStudio.ACCNUM.replace(regEx,"\\");
		strAetitle = objStudio.AETITLE.split("*")[0];
		// prendo la prima anagrafica
		patientId = objStudio.PATID.split("*")[0];
		if (azione!="SHOWSTUDY"){
			return;
		}
		switch (additionalParameters){
		case "PATIENT":
			//syncPatientToPacs(pacsType,additionalParameters);
			sendToWebPacs("SHOWSTUDY_PATIENT", objUtente, objStudio, additionalParameters);
			break;	
		case "STUDY":
			//syncStudyToPacs(pacsType,additionalParameters);
			sendToWebPacs("SHOWSTUDY_STUDY", objUtente, objStudio, additionalParameters);
			break;
		default:
			break;
		}
	}
	catch(e){
		alert("actionMediSurf  - Error: " + e.description);
	}
}



/*
function medisurf_patient(idenAnag)
{
	var lunghezza=screen.width;
	var altezza=screen.height;
	var url_activation = "";

	try{
		alert(" baseGlobal.SERVER_MEDISURF: " +  baseGlobal.SERVER_MEDISURF);
		if (idenAnag=="") 
		{
			alert(ritornaJsMsg("jsmsgAnagNotValid"));
			return;
		}
		url_activation = baseGlobal.SERVER_MEDISURF ;
		url_activation = url_activation + "&user_name=" + baseUser.LOGIN;
		url_activation = url_activation + "&password=" + pwdDecrypted;
		url_activation = url_activation + "&patient_id=" + idenAnag
		url_activation = url_activation + "&on_exit_url=javascript:self.close();"
		wnd_medisurf = window.open(url_activation,"wnd_medisurf","fullscreen");
	}
	catch(e){
		alert("actionMediSurf  - Error: " + e.description);
	}
}

function medisurf_study(idenAnag, AccNum)
{
	var lunghezza=screen.width
	var altezza=screen.height
	var url_activation = ""

	try{
		if (idenAnag=="")
		{
			alert(ritornaJsMsg("jsmsgAnagNotValid"));
			return;
		}
		if (AccNum=="")
		{
			alert(ritornaJsMsg("jsmsgAccNumNotValid"));
			return;
		}
		url_activation = baseGlobal.SERVER_MEDISURF ;
		url_activation = url_activation + "&user_name="+baseUser.LOGIN;
		url_activation = url_activation + "&password=" + pwdDecrypted;
		url_activation = url_activation + "&patient_id=" + idenAnag;
		url_activation = url_activation + "&accession_number=" + AccNum;
		url_activation = url_activation + "&on_exit_url=javascript:self.close();"	
		wnd_medisurf = window.open(url_activation,"wnd_medisurf","fullscreen");
		
	}
	catch(e){
		alert("actionMediSurf  - Error: " + e.description);
	}
}
*/

