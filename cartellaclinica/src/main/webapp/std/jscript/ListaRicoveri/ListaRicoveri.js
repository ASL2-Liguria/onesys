/*

var idRemoto='';
var CodDecReparto='';
var NumNosologico='';


function apriRepositoryDoc() {

//	alert (idRemoto);
//	alert (NumNosologico);
//	alert (CodDecReparto);
	
	if (NumNosologico != ''){
		window.open ('header?idPatient='+idRemoto+'&nosologico='+NumNosologico+'&reparto='+CodDecReparto,'', "status=yes fullscreen=yes scrollbars=yes");
	
		
	}else{
	
		alert ('NESSUN RICOVERO SELEZIONATO!');
	
	}
}
*/

/*ARRY*/
function apriRepositoryDoc() {

	var CodDecReparto = stringa_codici(array_cod_dec); //cod_dec tab_pro o centri_di_costo stringa
	var idRemoto = stringa_codici(array_id_remoto); 
	var NumNosologico = stringa_codici(array_nosologico);

//	alert(CodDecReparto+idRemoto+NumNosologico);
	if (NumNosologico != ''){
		window.open ('header?idPatient='+idRemoto+'&nosologico='+NumNosologico+'&reparto='+CodDecReparto,'', "status=yes fullscreen=yes scrollbars=yes");
		
	}else{
	
		alert ('NESSUN RICOVERO SELEZIONATO!');
	
		}
	
}

function setParametri(obj){

		if (typeof obj != 'undefined'){
		
			idRemoto=obj.idRemoto;
			CodDecReparto=obj.CodDecReparto;
			NumNosologico=obj.NumNosologico;
		
		}

}

/*ARRY CON LA CONSULENZA DI FRA*/
function apriCartellaPrecedente(){

	try{
		
		switch(stringa_codici(array_accesso)){
			case '0': top.DatiCartella.loadRicovero(stringa_codici(array_iden_visita));
				break;
			case '1': top.DatiCartella.loadAccesso(stringa_codici(array_iden_visita));
				break;
		}

	}catch(e){
		alert(e.descirption);
	}
}