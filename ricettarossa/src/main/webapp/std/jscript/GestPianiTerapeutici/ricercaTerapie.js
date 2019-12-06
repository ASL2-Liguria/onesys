
filtroCodTer="";

jQuery(document).ready(function() {
	
	ricercaTerapie.init();
});


var ricercaTerapie = {

	init : function() {

	$(document).bind("contextmenu",function(e){
		return false;
	});

	$.each(parent.arrTerapie, function(name, value) {	
		if (filtroCodTer == "")
			filtroCodTer="'"+value+"'";
		else
			filtroCodTer+=",'"+value+"'";	

	}
	);


	$('#txtPA').bind('keypress', function(e) {
		if(e.keyCode==13){
			ricercaTerapie.ricercaTerapie();
		}
	});

	$('#hPA').parent().hide();

	$('#frameWKPA').hide();
	$('#frameWKFarmaci').hide();
	$('#frameWKIndicazioni').hide();

	$('#groupWKPA').text('Scelta principio attivo').parent().parent().hide();
	$('#groupWKFarmaci').text('Scelta farmaco').parent().parent().hide();
	$('#groupWKIndicazioni').text('Scelta indicazione terapeutica').parent().parent().hide();
	$('#lblInserisci').parent().parent().parent().hide();

	if(parent.parent.configPT.RICERCA_TERAPIE_AUTO=='S')
		ricercaTerapie.ricercaTerapie();

},


ricercaTerapie : function(){

	var doc = document.dati;
	var whereCond="";
	if (parent.$('SELECT[name=cmbReparto] option:selected').val()!=undefined)
		whereCond=" WHERE COD_REPARTO='"+parent.$('SELECT[name=cmbReparto] option:selected').val()+"' ";
	else
		whereCond="WHERE COD_REPARTO='EXTRA_REG'";	


	$('#frameWKPA').hide();
	$('#frameWKFarmaci').hide();
	$('#frameWKIndicazioni').hide();

	$('#groupWKPA').text('Scelta principio attivo').parent().parent().hide();
	$('#groupWKFarmaci').text('Scelta farmaco').parent().parent().hide();
	$('#groupWKIndicazioni').text('Scelta indicazione terapeutica').parent().parent().hide();
	$('#lblInserisci').parent().parent().parent().hide();

	if($('#txtPA').val()!='') {
		if(whereCond!=''){whereCond+=' AND ';}	
		whereCond=whereCond+" DESCRIZIONE like '"+$('#txtPA').val().toUpperCase().replace('+','%2B')+"%25'";}
	//if(whereCond!=''){whereCond=' WHERE '+whereCond;}
	$('#frameWKPA').show();
	$('#frameWKFarmaci').hide();
	$('#frameWK').hide();
	document.all['frameWKPA'].src = "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_PT_SCELTA_PA&ILLUMINA=javascript:illumina(this.sectionRowIndex);parent.ricercaTerapie.sceltaFiltriWK('WK_PT_SCELTA_PA');&WHERE_WK= "+whereCond;	

	$('#groupWKPA').parent().parent().show();

},

inserisciTerapia : function (){

	var codTerapia=			document.all['frameWKIndicazioni'].contentWindow.stringa_codici(document.all['frameWKIndicazioni'].contentWindow.ar_codice_terapia);
	var dataIniVal=			document.all['frameWKIndicazioni'].contentWindow.stringa_codici(document.all['frameWKIndicazioni'].contentWindow.ar_data_ini_val);
	var dataFineVal=		document.all['frameWKIndicazioni'].contentWindow.stringa_codici(document.all['frameWKIndicazioni'].contentWindow.ar_data_fine_val);
	var farmaco=			document.all['frameWKFarmaci'].contentWindow.stringa_codici(document.all['frameWKFarmaci'].contentWindow.ar_descr_farmaco);
	var descrPa=			document.all['frameWKPA'].contentWindow.stringa_codici(document.all['frameWKPA'].contentWindow.ar_descrizione);
	var confezione=			document.all['frameWKFarmaci'].contentWindow.stringa_codici(document.all['frameWKFarmaci'].contentWindow.ar_confezione);
	var indicazione_lig=	document.all['frameWKIndicazioni'].contentWindow.stringa_codici(document.all['frameWKIndicazioni'].contentWindow.ar_indicazione_lig);
	indicazione_lig=indicazione_lig.replace(/</g, "&lt;");
	indicazione_lig=indicazione_lig.replace(/>/g, "&gt;");
	indicazione_lig=indicazione_lig.replace(/"/g, "&quot;");
	indicazione_lig=indicazione_lig.replace(/'/g, "&#039;");

	if (codTerapia==''){alert('Selezionare una terapia'); return;}
	

	if ((dataFineVal!='' && clsDate.difference.day(clsDate.str2date(dataFineVal,'DD/MM/YYYY',''),new Date())<0) || (dataIniVal!='' && clsDate.difference.day(clsDate.str2date(dataIniVal,'DD/MM/YYYY',''),new Date())>0)){
		alert('Attenzione, indicazione terapeutica non attiva');
		return;
	}
	
//	parent.aggiungiDettaglio(codTerapia,farmaco+' - '+ descrPa + ' - '+confezione,indicazione_lig);	
	parent.pianoTerapeutico.aggiungiDettaglio(codTerapia,descrPa,farmaco,confezione,indicazione_lig);	


	ricercaTerapie.chiudiScheda();

},


chiudiScheda : function(){

	parent.$.fancybox.close(); 
},


sceltaFiltriWK : function (tipoWK){

	if (tipoWK=='WK_PT_SCELTA_PA') {
		var codPA=document.all['frameWKPA'].contentWindow.stringa_codici(document.all['frameWKPA'].contentWindow.ar_codice);
		whereCond="  WHERE COD_PA='" + codPA+"'";
		$('#frameWKFarmaci').show();
		$('#frameWKPA').hide();
		document.all['frameWKFarmaci'].src = "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_PT_SCELTA_FARMACI&ILLUMINA=javascript:illumina(this.sectionRowIndex);parent.ricercaTerapie.sceltaFiltriWK('WK_PT_SCELTA_FARMACI');&WHERE_WK= "+whereCond;	
		$('#groupWKPA').text('Principio attivo : '+document.all['frameWKPA'].contentWindow.stringa_codici(document.all['frameWKPA'].contentWindow.ar_descrizione));
		$('#groupWKFarmaci').parent().parent().show();
	}	
	else if(tipoWK=='WK_PT_SCELTA_FARMACI'){

		var minsan10=document.all['frameWKFarmaci'].contentWindow.stringa_codici(document.all['frameWKFarmaci'].contentWindow.ar_minsan10);		
		whereCond="  WHERE CODICE_FARMACO='" + minsan10 +"'";
		$('#frameWKFarmaci').hide();
		$('#frameWKIndicazioni').show();

		document.all['frameWKIndicazioni'].src = "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_PT_SCELTA_IND_LIG&ILLUMINA=javascript:illumina(this.sectionRowIndex);&WHERE_WK= "+whereCond;	
		$('#groupWKFarmaci').text('Farmaco : '+document.all['frameWKFarmaci'].contentWindow.stringa_codici(document.all['frameWKFarmaci'].contentWindow.ar_descr_farmaco));
		$('#groupWKIndicazioni').parent().parent().show();
		$('#lblInserisci').parent().parent().parent().show();

	}


}
};
