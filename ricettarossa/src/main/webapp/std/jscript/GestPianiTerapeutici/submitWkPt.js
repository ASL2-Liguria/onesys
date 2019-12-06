var specialita='';

jQuery(document).ready(function() {

	
	$(document).bind("contextmenu",function(e){
		return false;
	});
	
	$('input[name=radTipoRicerca]').change(function(){ 
		if ($('input[name=radTipoRicerca]:checked').val()=='RICREM')
		{
			$('#lblStatoElenco').attr('disabled', 'disabled');
			$('#lblStato').parent().attr('disabled', 'disabled');

		}
		else
		{
			$('#lblStatoElenco').removeAttr('disabled');
			$('#lblStato').parent().removeAttr('disabled');

		}
	}
	); 
	
	$('body').css('overflow','hidden');
	
	if ( typeof parent.EXTERN.daData !='undefined' && parent.EXTERN.daData.value.length==8){
		document.dati.txtDaData.value = parent.EXTERN.daData.value.substr(6,2)+'/'+parent.EXTERN.daData.value.substr(4,2)+'/'+parent.EXTERN.daData.value.substr(0,4);
	}
	else{
		document.dati.txtDaData.value = getData(clsDate.dateAdd(new Date(),'Y',-1),'DD/MM/YYYY');			
	}
	if ( typeof parent.EXTERN.aData !='undefined' && parent.EXTERN.aData.value.length==8){
		document.dati.txtAData.value = parent.EXTERN.aData.value.substr(6,2)+'/'+parent.EXTERN.aData.value.substr(4,2)+'/'+parent.EXTERN.aData.value.substr(0,4);
	}
	else{
		document.dati.txtAData.value = getData(clsDate.dateAdd(new Date(),'Y',+1),'DD/MM/YYYY');
	}
	
	
		
		$('input[name="radTipoRicerca"][value="'+parent.configPT.RICERCA_CHECKED+'"]').attr('checked',true);

	ricercaPT();
		
});

function getData(pDate,format){
	anno = pDate.getFullYear();	
	mese = '0'+(pDate.getMonth()+1);mese =  mese.substring(mese.length-2,mese.length);
	giorno = '0'+pDate.getDate();giorno =  giorno.substring(giorno.length-2,giorno.length);
	switch(format){
		case 'YYYYMMDD':	return anno+mese+giorno;
		case 'DD/MM/YYYY':	return giorno+'/'+mese+'/'+anno;		
	}
}


function ricercaPT(){

	
	setVeloNero('framePT');
	if($('input[name="radTipoRicerca"]:checked').val()=='RICLOCMEDICO') { //RICERCA LOCALE MEDICO AUTENTICATO
		ricercaLocale('RICLOCMEDICO');
	}
	else if($('input[name="radTipoRicerca"]:checked').val()=='RICLOCSPECIALITA') { //RICERCA LOCALE SPECIALITA
		ricercaLocale('RICLOCSPECIALITA');	
	} 
	else if($('input[name="radTipoRicerca"]:checked').val()=='RICLOCTUTTI') { //RICERCA LOCALE SENZA FILTRI
		ricercaLocale('RICLOCTUTTI');	
	}
	else if($('input[name="radTipoRicerca"]:checked').val()=='RICLOCPACOMP') { //RICERCA LOCALE PER I PA ASSOCIATI ALLA SPECIALITA DEL REPARTO IN INGRESS
		ricercaLocale('RICLOCPACOMP');	
	}
	else { // RICERCA REMOTA
		var codFisc;
		
		if (top.document.EXTERN.codfisc==undefined)
			codFisc=top.codFisc;
		else
			codFisc=top.document.EXTERN.codfisc.value;

		daData=$('input[name=txtDaData]').val().substr(6,4)+$('input[name=txtDaData]').val().substr(3,2)+$('input[name=txtDaData]').val().substr(0,2);
		aData=$('input[name=txtAData]').val().substr(6,4)+$('input[name=txtAData]').val().substr(3,2)+$('input[name=txtAData]').val().substr(0,2);

		
		
		ricercaRemota("ricercaPerCodFiscAssData",new Array(codFisc,daData,aData));
	}
	
	
}	
	

function ricercaLocale(tipo) {

	var whereWk= " where ID_REMOTO='"+document.EXTERN.idRemoto.value+"'";

	//ricerca per medico autenticato
	if (tipo=='RICLOCMEDICO'){
		whereWk+="  and (MEDICO_IDEN IS NULL OR MEDICO_IDEN="+baseUser.IDEN_PER+")";
	}
	else if	(tipo=='RICLOCSPECIALITA'){
		if (( typeof top.EXTERN.reparto !='undefined')){
		setSpecialita(top.EXTERN.reparto.value);		
		}
		whereWk+="  and  SPECIALITA='"+specialita+"' ";
		
	}
	else if(tipo=='RICLOCPACOMP'){
		if (( typeof top.EXTERN.reparto !='undefined')){
			setSpecialita(top.EXTERN.reparto.value);		
			}
		whereWk+=" 	and cod_principio_attivo in ( select CAMPO2 from pt_associazioni where tipo='SPECIALITA_PA' AND CAMPO1='"+specialita+"') ";
				

	}

	if ($('#txtDaData').val()!='')
		
		whereWk+=" AND DATA_ATTIVAZIONE>='"+$('input[name=txtDaData]').val().substr(6,4)+$('input[name=txtDaData]').val().substr(3,2)+$('input[name=txtDaData]').val().substr(0,2)+"'";

	
	if ($('#txtAData').val()!='')
		whereWk+=" AND DATA_ATTIVAZIONE<='"+$('input[name=txtAData]').val().substr(6,4)+$('input[name=txtAData]').val().substr(3,2)+$('input[name=txtAData]').val().substr(0,2)+"'";
	
	var stati = (document.all['hStatoElenco'].value).split(",");
	var whereStati='';

	//se sono selezionate le 3 voci non aggiungo niente alla where condition per prendere tutto lo stesso
	if(stati!='' && stati.length<3 && stati.length>0){	
	
		for (var indice=0; indice<stati.length; indice++) {		
			if(trim(stati[indice])=="'ATTIVI'"){
				if(whereStati!=''){
					whereStati+=" OR ";
				}
				whereStati+=" VALIDITA NOT IN ('SCADUTO','CHIUSO') ";
			}	


			else if(trim(stati[indice])=="'SCADUTI'"){
				if(whereStati!=''){
					whereStati+=" OR ";
				}
				whereStati+=" VALIDITA='SCADUTO' ";
			}
			else if(trim(stati[indice])=="'CHIUSI'"){
				if(whereStati!=''){
					whereStati+=" OR ";
				}
				whereStati+=" VALIDITA='CHIUSO' ";
			}	
	
		}
		whereWk+=" AND ("+whereStati+") ";
	}		
	var a_filtri = document.getElementsByAttribute('*', 'FILTRO_CAMPO_DESCRIZIONE');
	for(var idx_filtri = 0; idx_filtri < a_filtri.length; idx_filtri++)
	{	// Salvo il filtro!
		risp = salva_filtro(a_filtri[idx_filtri]);
	}
	
	urlWk="servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_PT&ILLUMINA=javascript:illumina(this.sectionRowIndex);&WHERE_WK="+whereWk;
	if ( typeof parent.EXTERN.CONTEXT_MENU !='undefined'){
		urlWk+="&CONTEXT_MENU="+parent.EXTERN.CONTEXT_MENU.value;
	}
	document.all['framePT'].src = urlWk;
	
}

function ricercaRemota(tipoRic,value){	

//	dwr.engine.setAsync(false);
	dwrPianiTerapeutici.getPT(tipoRic,value,resp); 
//	dwrPianiTerapeutici.getPT('ricercaPerNumSAL','2074',resp); 
//	dwr.engine.setAsync(true);


}



function resp(res){

//	alert(res[0]);
//	alert(res[1]);


	if (res[0]=='KO'){
		alert('Ricerca non andata a buon fine');
		removeVeloNero('framePT');
	}
	else{
		//trovati metadati
		if (res[0]=='0'){
			alert("Troppi dati trovati: selezionare un singolo piano da importare");
			document.all['framePT'].src = "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_PT_REMOTI&ILLUMINA=javascript:illumina(this.sectionRowIndex);&WHERE_WK= WHERE REMOTE_USER='"+res[1]+"'";	
		}
		else if (res[1]=='-1'){
			alert("Nessun risultato trovato");	
			document.all['framePT'].src = "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_PT&ILLUMINA=javascript:illumina(this.sectionRowIndex);&WHERE_WK= WHERE IDEN_REMOTE='0'";
			
		}
		//trovati piani in remoto (sia importati che già in locale)
		else{
			document.all['framePT'].src = "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_PT&ILLUMINA=javascript:illumina(this.sectionRowIndex);&WHERE_WK= WHERE IDEN_REMOTE IN ("+res[1]+")";
		}

	}
}

function cancellaMetadati(){
	dwr.engine.setAsync(false);
	dwrPianiTerapeutici.cancellaMetadati(); 
	dwr.engine.setAsync(true);	
}


function setSpecialita(rep){
	
	var sql="SELECT CAMPO1 FROM RADSQL.PT_ASSOCIAZIONI WHERE  CAMPO2='"+rep+"' AND TIPO='SPECIALITA_REPARTO'";

	dwr.engine.setAsync(false);
	toolKitDB.getListResultData(sql,respSetSpecialita);
	dwr.engine.setAsync(true);		

}

function respSetSpecialita(res){
	
	if(res.length!=0){
     specialita=res[0][0];
	}
	
	
}

