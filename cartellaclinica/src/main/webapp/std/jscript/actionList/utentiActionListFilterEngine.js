// JavaScript Document
// funzione
// di startup


function initGlobalObject(){
	fillLabels(arrayLabelName,arrayLabelValue);
	// inizializzare con data odierna
	initFilterDate();
}


// funzione
// che inizializza il campo data
function initFilterDate(){
	if (defaultFromDate==""){
		defaultFromDate = getToday();
	}
	if (defaultToDate==""){
		defaultToDate = getToday();
	}	
	document.frmMain.txtDaData.value=defaultFromDate;
	document.frmMain.txtAData.value=defaultToDate;
	
}


// ritorna la data
// odierna nel formato dd/mm/yyyy
function getToday(){
	var dd="";
	var mm="";
	var yyyy="";
	var DataOdierna = "";
	var d = new Date();                           //Crea oggetto Date.
	
	
	dd = ("00" + d.getDate().toString());
	dd = dd.substr((-dd.length%2)+2,2);
	mm = ("00" + (parseInt(d.getMonth() +1)).toString());
	mm = mm.substr((-mm.length%2)+2,2);
	yyyy = d.getYear().toString();       
	DataOdierna = dd + "/"  + mm + "/" + yyyy
	return 	DataOdierna ;
}


// effettua
// la ricerca
function applica(){
	var utente = "";
	var strWhere = "";
	var da_data = "";
	var a_data = "";
	
	utente = getValue("idSelUser");
	da_data = document.frmMain.txtDaData.value;
	da_data = da_data.substr(6,4) + da_data.substr(3,2) + da_data.substr(0,2);
	a_data = document.frmMain.txtAData.value;
	a_data = a_data.substr(6,4) + a_data.substr(3,2) + a_data.substr(0,2);
	if (utente!=""){
		strWhere = " webuser='" + utente +"'";
	}
	if ((da_data!="")&&(a_data!="")){
		if (strWhere==""){
			strWhere = " (ACTION_DATE_ISO>='" + da_data +"' AND ACTION_DATE_ISO<='" + a_data +"')";
		}
		else{
			strWhere = strWhere + " AND " + " (ACTION_DATE_ISO>='" + da_data +"' AND ACTION_DATE_ISO<='" + a_data +"')";
		}
	}
	document.frmMain.hidWhere.value = " WHERE " + strWhere;
	document.frmMain.hidOrder.value = " order by webuser";
	document.frmMain.hidUser.value = utente;	
	document.frmMain.submit();
}