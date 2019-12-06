jQuery(document).ready(function() {	
try{
	document.getElementById('lblApriChiudi').parentElement.style.display='none';
}catch(e){alert(e.description);}	
	var id_remoto=document.EXTERN.PATID.value;
	var nome=document.EXTERN.NAME.value;
	var cognome=document.EXTERN.SUR.value;
	var dataNascita=document.EXTERN.DATEBIRTH.value;
	var sesso=document.EXTERN.GENDER.value;
	var  codFisc=document.EXTERN.FISCCODE.value;
	
	//alert(id_remoto + ' ' + nome  + ' ' + cognome + ' ' + dataNascita + ' ' + sesso + ' ' + codFisc );

	//controllo se abbiamo una corrispondenza sul nostro db. Se i campi sono vuoti, lancio la funzione di inserimento anagrafica
	if (jQuery('#txtNome').val()=='' && jQuery('#txtCognome').val()==''){
		
		var sql = "{call ? := RADSQL.CREA_ANAG_PAZIENTE('" + id_remoto+ "', '"+nome+"','"+cognome+"','"+codFisc+"', '"+dataNascita+"','"+sesso+"')}";
			
		dwr.engine.setAsync(false);
		toolKitDB.executeFunctionData(sql, callResp);
		dwr.engine.setAsync(true);
	}
	
	function callResp(resp){
		if (resp=='OK'){
			//alert('Anagrafica inserita');
		}else{
			alert(resp);
		}
	}

});


function stampaPatientHistory(){
	
	
	var funzione	='PATIENT_HISTORY';
	var reparto		='DEAROMA';
	var anteprima	='S';
	var patId		= document.EXTERN.PATID.value;
	var sf			= "{PATIENT_HISTORY.PATID}='"+patId+"'";
	var stampante = null;
	
	var url =  'elabStampa?stampaFunzioneStampa='+funzione;
	url += '&stampaAnteprima='+anteprima;

	if(reparto!=null && reparto!='')
		url += '&stampaReparto='+reparto;	
	if(sf!=null && sf!='')
		url += '&stampaSelection='+sf;	
	if(stampante!=null && stampante!='')
		url += '&stampaStampante='+stampante;	
	//http://172.16.60.71:8082/PatientHistory/	
	//alert ('controllo l\' url che è: \n'+ url);
	
	var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		
	if(finestra){ 
		finestra.focus();}
    else{
		var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	}
}

function firmaPH(){

	var user=document.EXTERN.USER.value;
	var ip=document.EXTERN.IP.value;
	var patid=document.EXTERN.PATID.value;
	
	var url="http://172.16.60.71:8082/PatientHistory/autoLogin?KEY=FIRMA&USER="+user+"&IP="+ip+"&PATID="+patid+"&FIRMAURL=S";
	window.open(url,'','fullscreen=yes resizable=yes status=yes scrollbars=yes');

}
