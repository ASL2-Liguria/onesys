var contTrDet = 0;
selectPeriodi = "";
var registrato = 0;
var daFirmare = 0;
var arrTerapie = new Object();
var reparto_old;
var contrSpec=false;
var contrValid='';


jQuery(document).ready(function(){

	
	var data = new Date();
	var txtData;
	txtData = pianoTerapeutico.getData(data,'DD/MM/YYYY');

	pianoTerapeutico.init();
	pianoTerapeutico.setEvents();	

});




var pianoTerapeutico = {

		init : function(){
	pianoTerapeutico.caricaPeriodiSom();
	pianoTerapeutico.caricaReparti();
	pianoTerapeutico.caricaRepartoUte();
	
	$('#lblApriChiudi').parent().parent().hide();
    
    if (typeof document.EXTERN.IDPIANO != 'undefined'){
	   $('#lblTitleDatiPrestazioni').parent().append('<LABEL id=lblIdPiano style="BACKGROUND:#E8E6E7;margin-left:10px"> ID: '+document.EXTERN.IDPIANO.value+'</LABEL>');
    }
    	
	//modifica-chiusura
	if(document.EXTERN.STATO.value == 'MC')
	{
	    $('#lblNoteChiusura').parent().css('background','#00d235');
	}
	else if (document.EXTERN.STATO.value!='L'){
		$('#lblDataAttivazione').parent().css('background','#00d235');
		$('#lblDataScadenza').parent().css('background','#00d235');
		$('#lblReparto').parent().css('background','#00d235');
		$('#lblUnita').parent().css('background','#00d235');
		$('#lblPeriodoSom').parent().css('background','#00d235');
		
	}
	
	
	document.getElementById('lblNoteChiusura').parentElement.style.display = 'none';
	document.getElementById('txtNoteChiusura').parentElement.style.display = 'none';

	$('input[name=dataScadenza]').attr('readonly',true);
	$('input[STATO_CAMPO=L]').attr('disabled', 'disabled');
	
	if(typeof document.EXTERN.DUPLICA != 'undefined' && document.EXTERN.DUPLICA.value == 'S'){
		//caso del rinnovo di un piano
		if (typeof document.EXTERN.DATA_ATTIVAZIONE!='undefined'){
			//se la data di attivazione passata (scadenza piano da rinnovare) è precedente alla data odierna setto attivazione la data odierna altrimenti data scadenza piano da rinnovare +1
			if (clsDate.difference.day(clsDate.str2date(document.EXTERN.DATA_ATTIVAZIONE.value,'YYYYMMDD',''),new Date())<0){
				$('input[name=dataAttivazione]').val(clsDate.getData(new Date(),'DD/MM/YYYY'));
			}
			else{
				$('input[name=dataAttivazione]').val(clsDate.getData(clsDate.dateAdd(clsDate.str2date(document.EXTERN.DATA_ATTIVAZIONE.value,'YYYYMMDD',''),'D',+1),'DD/MM/YYYY'));
			}
		//	$('#dataAttivazione').attr('disabled', 'disabled');
		//	$('#dataAttivazione + img').attr('disabled', 'disabled');
			//rendo editabile solo la data di scadenza e il campo mesi	
			$("td[class=classTdLabelLink]").attr('disabled', 'disabled');
			document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';

			reparto_old=$('input[name=hReparto]').val();
			
			$('#groupDatiPrestazioni > table INPUT[name=txtDurata]').each(function(index) {
				$(this).val('');
			}); 
			
			$('input[name=dataScadenza]').val('');
			$('input[name=txtIntervalloMesi]').val('');

		}
		//se siamo nel duplica valorizzo la data di attivazione con la data odierna e calcolo la scadenza con la durata già impostata
		else{
			$('input[name=dataAttivazione]').val(clsDate.getData(new Date(),'DD/MM/YYYY'));
			pianoTerapeutico.cambiaDataScadenza();
			$('input[name=txtIntervalloMesi]').val(pianoTerapeutico.diffMesi($('input[name=dataScadenza]').val().substr(6,4)+$('input[name=dataScadenza]').val().substr(3,2)+$('input[name=dataScadenza]').val().substr(0,2),dataIn),$('input[name=dataAttivazione]').val().substr(6,4)+$('input[name=dataAttivazione]').val().substr(3,2)+$('input[name=dataAttivazione]').val().substr(0,2));
			$('#lblAggTerapia').parent().attr('disabled', 'disabled');
			document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
		}	
				 
		document.EXTERN.IDEN.value = '';
		document.EXTERN.IDEN_TESTATA.value = '';		
	}
	//se siamo in modifica-chiusura valorizzo la data di scadenza con la data odierna -1 e aggiorno la durata nel dettaglio
	if (document.EXTERN.STATO.value == 'MC'){
		var data = new Date();
		var txtData;
		//se la data di attivazione è successiva alla data odierna valorizzo la data di scadenza con la data di attivazione,altrimenti con la data odierna	
        	if(clsDate.difference.day(clsDate.str2date($('input[name=dataAttivazione]').val(),'DD/MM/YYYY',''),new Date())>0){
			$('input[name=dataScadenza]').val($('input[name=dataAttivazione]').val());
		}
			else{
			$('input[name=dataScadenza]').val(clsDate.getData(new Date(),'DD/MM/YYYY'));
		}
		
		pianoTerapeutico.cambiaDurataMesi();
	}

	if (document.EXTERN.FIRMATO.value=='N' || ( typeof document.EXTERN.SCADUTO != 'undefined' && document.EXTERN.SCADUTO.value=='S')){
		document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
	}

	if (document.EXTERN.FIRMATO.value=='S'){
		document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
	}

	if(document.EXTERN.STATO.value=='I' ){

		var data = new Date();
		var txtData;
		txtData = pianoTerapeutico.getData(data,'DD/MM/YYYY');
		$('input[name=dataAttivazione]').val(txtData);
		document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
		$('input[name=dataAttivazione]').attr('readonly',true).blur(function(){ pianoTerapeutico.controllaAttivazione(); });
	}

		//se sto modificando un piano firmato la data di attivazione deve essere quella odierna (sarà quella del piano figlio,mentre il madre prenderà come scadenza attivazione del figlio
		if (document.EXTERN.STATO.value=='M' && document.EXTERN.FIRMATO.value=='S' && typeof document.EXTERN.DUPLICA == 'undefined'){
			$('#dataAttivazione').attr('disabled', 'disabled');
			$('#dataAttivazione + img').attr('disabled', 'disabled');
			document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
			$('input[name=dataAttivazione]').attr('readonly',true).blur(function(){ pianoTerapeutico.controllaAttivazione(); });
			pianoTerapeutico.cambiaDurataMesi();
		}

	

   if( document.EXTERN.STATO.value!='L'){	
		var sql='SELECT MED.IDEN MED_IDEN, MED.CODICE_FISCALE MED_CF,  MED.COGNOME MED_COGN, MED.NOME MED_NOME FROM radsql.VIEW_RR_UTENTI MED WHERE MED.UTENTE = \''+document.EXTERN.USER_LOGIN.value+'\'';
		dwr.engine.setAsync(false);
		toolKitDB.getListResultData(sql,pianoTerapeutico.valorizzaCampiMed);
		dwr.engine.setAsync(true);	
}

	//MC è lo stato modifica-chiusura 
       if(document.EXTERN.STATO.value=='L' || document.EXTERN.STATO.value=='MC'){
    	document.getElementById('lblNoteChiusura').parentElement.style.display = 'block';
   		document.getElementById('txtNoteChiusura').parentElement.style.display = 'block';	
		document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
		document.getElementById('lblFirma').parentElement.parentElement.style.display = 'none';
		$("td[class=classTdLabelLink]").attr('disabled', 'disabled');
		$("img[class=trigger datepick-trigger]").attr('disabled', 'disabled');
		$('SELECT[name=cmbReparto]').attr('disabled','disabled');
		$('#txtDiagnosi').attr('disabled', 'disabled');
		$('#txtNote').attr('disabled', 'disabled');
		$('#txtNoteChiusura').attr('disabled', 'disabled');
		$('#txtMedTel').attr('disabled', 'disabled');
		$('#dataAttivazione').attr('disabled', 'disabled');
		$('#dataScadenza').attr('disabled', 'disabled');
		$('#txtIntervalloMesi').attr('disabled', 'disabled');
		$('#groupDatiPrestazioni > table td[name=first]').attr('disabled', 'disabled');
		$('#groupDatiPrestazioni > table INPUT[name=txtUnita]').attr('disabled', 'disabled');
		$('#groupDatiPrestazioni > table INPUT[name=txtDurata]').attr('disabled', 'disabled');
		$('#groupDatiPrestazioni > table INPUT[name=txtLitri]').attr('disabled', 'disabled');
		$('#groupDatiPrestazioni > table INPUT[name=txtOre]').attr('disabled', 'disabled');
		$('#groupDatiPrestazioni > table SELECT[name=cmbPeriodoSom]').attr('disabled','disabled');
		$('#groupDatiPrestazioni > table INPUT[name=txtPosologia]').attr('disabled', 'disabled');
		$("#linkElPiano").parent().attr('disabled', 'disabled');

	}
	else if (document.EXTERN.STATO.value=='M' && (typeof document.EXTERN.DUPLICA == 'undefined' || document.EXTERN.DUPLICA.value != 'S'))

	{
		$('#lblAggTerapia').parent().attr('disabled', 'disabled');	
	}
 
	// stato modifica-chiusura
	if(document.EXTERN.STATO.value=='MC'){
		document.getElementById('lblNoteChiusura').parentElement.style.display = 'block';
		document.getElementById('txtNoteChiusura').parentElement.style.display = 'block';
	//	$('#txtNote').removeAttr('disabled').css({"background-color":"yellow"});
		$('#txtNoteChiusura').removeAttr('disabled').focus();
		document.getElementById('lblFirma').parentElement.parentElement.style.display = 'block';
		if(document.EXTERN.FIRMATO.value!='S'){	
			document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'block';
		}
		document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
	}

	if (document.EXTERN.STATO.value!='L' && document.EXTERN.STATO.value!='MC' && typeof document.EXTERN.DATA_ATTIVAZIONE=='undefined'){
		$("#linkElPiano").live("click", function(){ pianoTerapeutico.eliminaTrDet($(this).parent().attr('contDet')); });
	}





},

setEvents: function(){
	
	$('#dataAttivazione,#dataScadenza').keydown(function() {
		if (window.event && window.event.keyCode == 8) {
			window.event.cancelBubble = true;
			window.event.returnValue = false;
		}
	});

	$(document).bind("contextmenu",function(e){
		return false;
	});



	$('select[name=cmbReparto]').change(function() {
		$('input[name=hReparto]').val($(this).val());	   
	});



	$("#txtIntervalloMesi").blur(function(){
		//se non è un numero o se supera 12
		if ($("#txtIntervalloMesi").val() != ""){
			if( ( !isNaN($("#txtIntervalloMesi").val()) ) && ( (parseInt($("#txtIntervalloMesi").val())<13) && (parseInt($("#txtIntervalloMesi").val())>0) )){
				pianoTerapeutico.calcolaDurata($("#txtIntervalloMesi").val());
				pianoTerapeutico.cambiaDurata();
			}else{
				$("#txtIntervalloMesi").val("");
				$("#dataScadenza").val("").focus();
				alert("Non è possibile inserire un intervallo di tempo superiore ai 12 mesi");
				return;
			}
		}
	});


	$('input[name=dataScadenza]').blur(function(){ pianoTerapeutico.controllaScadenza(); });
},



apriSceltaTerapie : function (){


	if ($('input[name=dataAttivazione]').val()=='' || $('input[name=dataScadenza]').val()==''){
		alert('Prego inserire sia una data di attivazione che di scadenza');
		return;	
	}
	
	if ($('SELECT[name=cmbReparto] option:selected').val()==undefined  || $('SELECT[name=cmbReparto] option:selected').val()==''){
		alert('Prego selezionare il reparto');
		return;	
	}

	url = "servletGenerator?KEY_LEGAME=PT_WK_RICERCA_TERAPIE";
	$.fancybox({
		'padding'	: 0,
		//	'width'		: $(parent).width(),
		'width'		:screen.availWidth,
		//	'height'	: 580,
		'height'	: screen.availHeight,
		'href'		: url,
		'type'		: 'iframe'
	}); 

},



caricaReparti : function (){

	if(typeof  document.EXTERN.REPARTO !='undefined' && document.EXTERN.REPARTO.value != '')
		sql="SELECT CDC.COD_CDC VALORE,TP.DESCR CAMPO  from RADSQL.CENTRI_DI_COSTO CDC,RADSQL.TAB_PRO TP where TP.COD_DEC = CDC.COD_DEC AND CDC.COD_CDC='"+document.EXTERN.REPARTO.value+"' AND CDC.COD_CDC IN (SELECT REPARTO FROM IMAGOWEB.WEB_CDC WHERE WEBUSER='"+baseUser.LOGIN+"') ";
		
		else
		sql="select VALORE,CAMPO FROM ( select '0' ORDINE, '' VALORE,'' CAMPO FROM DUAL UNION ALL SELECT  distinct '1' ORDINE, REPARTO VALORE,CDC.DESCR CAMPO from IMAGOWEB.WEB_CDC WCDC,RADSQL.CENTRI_DI_COSTO CDC,RADSQL.TAB_PRO TP where WCDC.REPARTO = CDC.COD_CDC AND TP.COD_DEC = CDC.COD_DEC AND webuser ='"+baseUser.LOGIN+"' order by ORDINE,CAMPO )";

	dwr.engine.setAsync(false);
	toolKitDB.getListResultData(sql,valorizzaReparti);
	dwr.engine.setAsync(true);		

	function valorizzaReparti(resp){
		for (i=0;i<resp.length; i++){
			$('[name=cmbReparto]')[0].options.add( new Option(resp[i][1],resp[i][0]) ) ;
		}
	}

},

caricaRepartoUte : function (){
	var combo=document.dati.cmbReparto;	
	for(var i = 0; i < combo.options.length; i++){				
		if(combo.options[i].value == $('[name=hReparto]').val()){				
			combo.options[i].selected = true;
		}			
	}	

},


chiudiPt : function (){

	parent.document.all['frameBottom'].src ='blank';
	parent.$('#frameTop').show();
	
	//se ho registrato la duplicazione di un piano proveniente da remoto risetto il tipo di ricerca iniziale
	if(typeof document.EXTERN.DUPLICA != 'undefined' && document.EXTERN.DUPLICA.value == 'S' && typeof document.EXTERN.REMOTO != 'undefined' && document.EXTERN.REMOTO.value=='S' && registrato==1)
	parent.document.all['frameTop'].contentWindow.$('input[name="radTipoRicerca"][value="'+top.configPT.RICERCA_CHECKED+'"]').attr('checked',true);
		
	//faccio il refresh della wk se si tratta di piano locale oppure se è stato registrato un piano partendo da piano remoto (duplicazione o rinnovo)
	if(typeof document.EXTERN.REMOTO=='undefined' || document.EXTERN.REMOTO.value == 'N' ||  (typeof document.EXTERN.REMOTO != 'undefined' && document.EXTERN.REMOTO.value=='S' && registrato==1))			
	parent.document.all['frameTop'].contentWindow.ricercaPT();
	
	
	parent.$('#frameBottom').hide();
	parent.document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'block';
	
},


aggiungiDettaglio : function (codT,descrPA,descrFarmaco,descrConf,descrTitle){
	$('#groupDatiPrestazioni > table > tbody').append(pianoTerapeutico.creaTrDettaglio(codT,descrPA,descrFarmaco+' - '+descrConf,descrTitle));
	$('[name=lblDetPA]').css("font-size","12px"); 
	$('[name=lblDetFarmaco]').css("font-size","12px"); 

	$('#lblAggTerapia').parent().attr('disabled', 'disabled');
	//$('#lblAggTerapia').unbind('click');

},



caricaDettaglio : function (){

	var terapieLoad=$('[name=hTerapia]').val().split('@');
	var descrPALoad=$('[name=hDescrTerapia]').val().split('@');
	var descrFarmacoLoad=$('[name=hDescrFarmaco]').val().split('@');
	var unitaLoad=$('[name=hUnita]').val().split('@');
	var durataLoad=$('[name=hDurata]').val().split('@');
	var litriLoad=$('[name=hLitri]').val().split('@');
	var oreLoad=$('[name=hOre]').val().split('@');
	var periodoSomLoad=$('[name=hPeriodoSom]').val().split('@');
	var indicazioneLigLoad=$('[name=hIndicazioneLig]').val().split('@');
	var posologiaLoad=$('[name=hPosologia]').val().split('@');


	if (terapieLoad!=""){
		$.each(terapieLoad, function(index, value) { 
			$('#groupDatiPrestazioni > table > tbody').append(pianoTerapeutico.creaTrDettaglio(value,descrPALoad[index],descrFarmacoLoad[index],indicazioneLigLoad[index],unitaLoad[index],durataLoad[index],litriLoad[index],oreLoad[index],periodoSomLoad[index],posologiaLoad[index]));
			$('[name=cmbPeriodoSom]:eq('+index+')').val(periodoSomLoad[index]);
		});

		$('[name=lblDetPA]').css("font-size","12px"); 
		$('[name=lblDetFarmaco]').css("font-size","12px"); 

	}

},

creaTrDettaglio : function (inCodTer,inDescrPA,inDescrFarmaco,descrTitle,inUnita,inDurata,inLitri,inOre,inPeriodoSom,inPosologia){

	dataIn=$('input[name=dataAttivazione]').val().substr(6,4)+$('input[name=dataAttivazione]').val().substr(3,2)+$('input[name=dataAttivazione]').val().substr(0,2);
	dataFin=$('input[name=dataScadenza]').val().substr(6,4)+$('input[name=dataScadenza]').val().substr(3,2)+$('input[name=dataScadenza]').val().substr(0,2);		
	diffDate=clsDate.difference.day(clsDate.str2date(dataFin,'YYYYMMDD',''),clsDate.str2date(dataIn,'YYYYMMDD',''))+1;


	arrTerapie[contTrDet]=inCodTer;
	var htmlTr="<tr contDet="+contTrDet+">";
	htmlTr+="<td class='classTdLabelLink' name='first' id='linkElPiano'><LABEL name=lblElimTerapia>Elimina P.A.</LABEL></td>";
	htmlTr+="<td><LABEL name=lblDetPA value="+inCodTer+" title='"+descrTitle+"'>"+inDescrPA+"</LABEL></td>";
	htmlTr+="<td><LABEL name=lblDetFarmaco value="+inCodTer+" title='"+descrTitle+"'>"+inDescrFarmaco+"</LABEL></td>";

	htmlTr+="<td class=classTdField><INPUT  name=txtUnita size='5' ";
	if (inUnita!=null){htmlTr+=" value='"+inUnita+"'";};
	if (inCodTer=='001015')
	{
		htmlTr+=" ossigeno='Y'";
	}
	else{
		htmlTr+=" ossigeno='N'";	
	}
	htmlTr+="/></td>";

	htmlTr+="<td class=classTdField>"+selectPeriodi+"</td>";


	htmlTr+="<td class=classTdField><INPUT disabled name=txtDurata size='5'  ";
	if (inDurata!=null){
		htmlTr+=" value='"+inDurata;
	}
	else
	{
		htmlTr+=" value='"+(diffDate);
	}	
	htmlTr+="'/></td>";

	htmlTr+="<td class=classTdField><INPUT name=txtPosologia ";
	if (inPosologia!=null){
		htmlTr+=" value='"+inPosologia +"'";
	}
	htmlTr+="/></td>";
	htmlTr+="<td class=classTdField><INPUT name=txtLitri size='5' ";
	if (inLitri!=null){htmlTr+=" value='"+inLitri+"'";};
	if (inCodTer!='001015'){htmlTr+=" disabled ";} else {htmlTr+=" value='' ";};
	htmlTr+="/></td>";

	htmlTr+="<td class=classTdField><INPUT name=txtOre size='5' ";
	if (inOre!=null){htmlTr+=" value='"+inOre+"'";};
	if (inCodTer!='001015'){htmlTr+=" disabled ";} else {htmlTr+=" value='' ";};
	htmlTr+="/></td>";

	htmlTr+="</tr>";
	contTrDet+=1;

	return htmlTr;	
},


eliminaTrDet : function (numTr){
	$('#groupDatiPrestazioni > table tr[contDet='+numTr+']').remove();
	delete arrTerapie[numTr];
	$('#lblAggTerapia').parent().removeAttr('disabled');
},



caricaPeriodiSom : function (){

	var sql='select codice,descrizione from radsql.pt_codifiche where tipo_codifica =\'PERIODO_SOMMINISTRAZIONE\' order by ordine';

	dwr.engine.setAsync(false);
	toolKitDB.getListResultData(sql,creaOptPeriodi);
	dwr.engine.setAsync(true);

	function creaOptPeriodi(elenco){

		selectPeriodi='<SELECT name=cmbPeriodoSom><OPTION selected value=""></OPTION>';

		for (var i=0;i<elenco.length; i++){
			selectPeriodi+='<OPTION value='+elenco[i][0]+'>'+elenco[i][1]+'</OPTION>';
		}
		selectPeriodi+='</SELECT>';

		pianoTerapeutico.caricaDettaglio();
	}

},


valorizzaCampiMed : function (res){
	if(res.length==1)	
	{
		$('input[name=hMedIden]').val(res[0][0]);
		$('#txtMedCodFisc').val(res[0][1]);
		$('#txtMedCognome').val(res[0][2]);
		$('#txtMedNome').val(res[0][3]);

	}
},

registraPiano : function (){

	var vExit=false;

	if($('[name=lblDetPA]').val()==undefined)
	{
		alert('Prego inserire almeno una terapia');
		return
	}

	if($('input[name=dataAttivazione]').val()==''){
		alert('Prego inserire la data di attivazione');
		return;
	}
	
	if($('input[name=dataScadenza]').val()==''){
		alert('Prego inserire la data di attivazione');
		return;
	}
	
	if ($('SELECT[name=cmbReparto] option:selected').val()==undefined  || $('SELECT[name=cmbReparto] option:selected').val()==''){
		alert('Prego inserire il reparto');
		return;
	}


	if( document.EXTERN.STATO.value=='MC' && $('#txtNoteChiusura').val()==''){
		alert('Per la chiusura di un piano è obbligatorio compilare il campo Note chiusura');
		$('#txtNoteChiusura').focus();
		return;
	}

	//si tratta di rinnovo: devo controllare che il reparto selezionato sia della stessa specialità del reparto per cui era stato creato il piano
	if(typeof document.EXTERN.DATA_ATTIVAZIONE !='undefined'){
		contrSpec=false;
		pianoTerapeutico.verificaSpecialitaRinnovo(reparto_old,$('SELECT[name=cmbReparto] option:selected').val()); 
		if (contrSpec==false){
			alert('Impossibile rinnovare il piano: il reparto selezionato non ha associato il principio attivo');
			return;
		}
	}
	
	//se si tratta di rinnovo o duplicazione devo controllare che la terapia sia ancora prescrivibile
     contrValid='';
	if((typeof document.EXTERN.DUPLICA != 'undefined' && document.EXTERN.DUPLICA.value == 'S') || typeof document.EXTERN.DATA_ATTIVAZIONE !='undefined'){
   	  sql="select fine_validita from pt_terapie where Codice_Terapia='"+$('LABEL[name=lblDetPA]').val()+"' and fine_validita is not null and to_date(fine_validita,'DD/MM/YYYY')<trunc(sysdate)";

   	  dwr.engine.setAsync(false);
		toolKitDB.getListResultData(sql,functionResp);
		dwr.engine.setAsync(true);		

		function functionResp(resp){
			if(typeof(resp[0])!='undefined'){
				contrValid=resp[0];
			}
		}		
	}
	if(contrValid!='')
		return alert('Attenzione: la regione ha indicato l\'impossibilità di prescrivere tale terapia dal '+contrValid);
	
	if(typeof document.EXTERN.DATA_ATTIVAZIONE !='undefined' && clsDate.difference.day(clsDate.str2date($('input[name=dataAttivazione]').val(),'DD/MM/YYYY',''),clsDate.str2date(document.EXTERN.DATA_ATTIVAZIONE.value,'YYYYMMDD',''))<=0)
	{
		alert('Attenzione, la data di attivazione inserita non è successiva alla data di scadenza del piano che si vuole rinnovare');
		return;
	}

	$('input[name=hTerapia]').val('');
	$('input[name=hDescrTerapia]').val('');
	$('input[name=hDescrFarmaco]').val('');
	$('input[name=hUnita]').val('');
	$('input[name=hDurata]').val('');
	$('input[name=hLitri]').val('');
	$('input[name=hOre]').val('');
	$('input[name=hPeriodoSom]').val('');
	$('input[name=hIndicazioneLig]').val('');
	$('input[name=hPosologia]').val('');




	$('#groupDatiPrestazioni > table LABEL[name=lblDetPA]').each(function() {
		$('input[name=hTerapia]').val()=="" ? $('input[name=hTerapia]').val($(this).val()) : $('input[name=hTerapia]').val($('input[name=hTerapia]').val()+'@'+$(this).val());			
		$('input[name=hDescrTerapia]').val()=="" ? $('input[name=hDescrTerapia]').val($(this).text()) : $('input[name=hDescrTerapia]').val($('input[name=hDescrTerapia]').val()+'@'+$(this).text());			
		$('input[name=hIndicazioneLig]').val()=="" ? $('input[name=hIndicazioneLig]').val($(this).attr('title')) : $('input[name=hIndicazioneLig]').val($('input[name=hIndicazioneLig]').val()+'@'+$(this).attr('title'));			

	}); 

	$('#groupDatiPrestazioni > table LABEL[name=lblDetFarmaco]').each(function() {
		$('input[name=hDescrFarmaco]').val()=="" ? $('input[name=hDescrFarmaco]').val($(this).text()) : $('input[name=hDescrFarmaco]').val($('input[name=hDescrFarmaco]').val()+'@'+$(this).text());					
	}); 


	$('#groupDatiPrestazioni > table INPUT[name=txtUnita]').each(function() {
		if (($(this).val()=="" &&  $(this).attr('ossigeno')=='N') || (pianoTerapeutico.controlloNumero($(this))==0 && $(this).attr('ossigeno')=='N') ){alert("Compilare correttamente il campo Posologia (numerico, per numeri decimali utilizzare il '.')");$(this).focus(); vExit=true; return false;}
		$('input[name=hUnita]').val()=="" ? $('input[name=hUnita]').val($(this).val()) : $('input[name=hUnita]').val($('input[name=hUnita]').val()+'@'+$(this).val());			
	}); 
	if (vExit==true){return;};

	$('#groupDatiPrestazioni > table INPUT[name=txtPosologia]').each(function() {
		$('input[name=hPosologia]').val()=="" ? $('input[name=hPosologia]').val($(this).val()) : $('input[name=hPosologia]').val($('input[name=hPosologia]').val()+'@'+$(this).val());			
	}); 


	$('#groupDatiPrestazioni > table SELECT[name=cmbPeriodoSom]').each(function() {
		if($(this).attr('value')==""){alert("Compilare la tipologia di somministrazione");$(this).focus(); vExit=true; return false;}
		$('input[name=hPeriodoSom]').val()=="" ? $('input[name=hPeriodoSom]').val($(this).attr('value')) : $('input[name=hPeriodoSom]').val($('input[name=hPeriodoSom]').val()+'@'+$(this).attr('value'));			
	});
	if (vExit==true){return;};

	$('#groupDatiPrestazioni > table INPUT[name=txtDurata]').each(function(index) {
		if ( (pianoTerapeutico.controlloDurata($(this))==0)){$(this).focus(); vExit=true; return false;}
		$('input[name=hDurata]').val()=="" && index==0 ? $('input[name=hDurata]').val($(this).val()) : $('input[name=hDurata]').val($('input[name=hDurata]').val()+'@'+$(this).val());			
	}); 
	if (vExit==true){return;};


	$('#groupDatiPrestazioni > table INPUT[name=txtLitri]').each(function(index) {
		if ($(this).is(':disabled') == false && ( $(this).val()==""  || (pianoTerapeutico.controlloNumero($(this))==0))){alert("Compilare correttamente il campo Litri (numerico, per numeri decimali utilizzare il '.')");$(this).focus(); vExit=true; return false;}
		$('input[name=hLitri]').val()=="" && index==0 ? $('input[name=hLitri]').val($(this).val()) : $('input[name=hLitri]').val($('input[name=hLitri]').val()+'@'+$(this).val());			
	}); 
	if (vExit==true){return;};

	$('#groupDatiPrestazioni > table INPUT[name=txtOre]').each(function(index) {
		if ($(this).is(':disabled') == false && ( $(this).val()==""  || (pianoTerapeutico.controlloNumero($(this))==0))){alert("Compilare correttamente il campo Ore (numerico)");$(this).focus(); vExit=true; return false;}
		$('input[name=hOre]').val()=="" && index==0 ? $('input[name=hOre]').val($(this).val()) : $('input[name=hOre]').val($('input[name=hOre]').val()+'@'+$(this).val());			
	}); 
	if (vExit==true){return;};

	$('[name=hReparto]').val($('SELECT[name=cmbReparto] option:selected').val());



	var stato =  document.EXTERN.STATO.value;

	if (registrato==1 && stato=='I')
	{
		stampaFirmaPiano.retrieveIdenXml();
	}
	
	// se il piano è firmato e non mi trovo nel caso della chiusura non gli passo l'iden della scheda per fargliene generare una nuova; oppure siamo in ASL1 dove deve essere generato un nuovo piano anche per modifica di non firmato
	if ((document.EXTERN.FIRMATO.value=='S' || baseGlobal.SITO=='ASL1') && document.EXTERN.STATO.value!='MC'){	
		document.EXTERN.IDEN.value='';
	}

	registra();	


},

calcolaDurata : function (input)
{
	var mesi 			= parseInt(input);
	var dataAttivazione = jQuery("#dataAttivazione").val();
	var dataAtt 		= clsDate.str2date(dataAttivazione,'DD/MM/YYYY','');
	var dataScadenza	= clsDate.dateAdd(dataAtt,'M',mesi);

	jQuery("#dataScadenza").val(clsDate.getData(dataScadenza,'DD/MM/YYYY'));

},

controllaAttivazione : function (){

	var dataAtt=jQuery("#dataAttivazione").val();

	if (dataAtt != ''){

		var giorno=dataAtt.substr(0,2);
		var mese=dataAtt.substr(3,2);
		var anno=dataAtt.substr(6,4);

		var dataControllo=anno+mese+giorno;

		if (pianoTerapeutico.controllo_data(dataControllo).previous){
			alert("Attenzione! Impossibile inserire una data antecedente alla data odierna");
			jQuery("#dataAttivazione").val("").focus(); 
		}
	}

},


//function da richiamare in questa maniera: if(controllo_data('20101216').metodo); 
//restituisce true o false per ogni metodo (previous,next,equal)
controllo_data : function (data){

	var str =data.toString();

	function cls(){
		this.previous = false;
		this.next= false;
		this.equal = false;
	}

	var data= new Date();
	var giorno= data.getDate() ;
	var mese=data.getMonth() +1;
	var anno=data.getYear();

	if (giorno.toString().length <2){
		//alert ('giorno prima della modifica: '+giorno);
		giorno = '0'+giorno;	
	}

	if (mese.toString().length <2){
		//alert ('mese prima della modifica: '+mese);
		mese = '0'+mese;
	}

	var oggi=anno.toString()+mese.toString()+giorno.toString(); //creo una variabile con la data odierna in formato yyyyMMdd
	var dataControl ='';

	var myClass = new cls();

	if (str.length>8){
		//controllo se la lunghezza è maggiore di 8(yyyyMMdd) vuol dire che la data è in formato dd/MM/yyyy. Faccio una substring in modo da trasformarla...
		dataControl=str.substr(6,4)+str.substr(3,2)+str.substr(0,2);
		//alert('data da controllare:'+dataControl+'e oggi: '+oggi);

	}else{
		dataControl=str;
		//alert(dataControl);
	}

	if(dataControl>oggi){
		//alert('next');
		myClass.previous = false;
		myClass.next=true;
		myClass.equal = false;
	}

	if(dataControl==oggi){
		//alert('equal');
		myClass.previous = false;
		myClass.next=false;
		myClass.equal = true;
	}

	if(dataControl<oggi){
		//alert('previous');
		myClass.previous = true;
		myClass.next=false;
		myClass.equal = false;
	}

	return myClass;
},

controlloDurata : function (obj){

	if (isNaN(obj.val()) || parseInt(obj.val())<0  || obj.val()=='') 
	{ 
		alert('Attenzione, inserire correttamente il campo Durata (numerico)!');
		obj.focus();
		return 0;
	}	


	if ($('input[name=dataAttivazione]').val()!='' && $('input[name=dataScadenza]').val()!='');
	{
		dataIn=$('input[name=dataAttivazione]').val().substr(6,4)+$('input[name=dataAttivazione]').val().substr(3,2)+$('input[name=dataAttivazione]').val().substr(0,2);
		dataFin=$('input[name=dataScadenza]').val().substr(6,4)+$('input[name=dataScadenza]').val().substr(3,2)+$('input[name=dataScadenza]').val().substr(0,2);	


		diffDate=clsDate.difference.day(clsDate.str2date(dataFin,'YYYYMMDD',''),clsDate.str2date(dataIn,'YYYYMMDD',''))+1;


		if (obj.val()>(diffDate)){
			if((diffDate)>0)
				alert("Attenzione, la durata inserita supera l'intervallo di giorni compreso tra data attivazione e scadenza!");
			else
			{
				alert("Attenzione, inserita una data scadenza piano antecedente alla data di attivazione");
				$('input[name=dataScadenza]').val('');
				return 0;
			}	
			obj.focus();
			return 0;	
		}
	}  


},


controlloNumero : function (obj){



	//if (isNaN(obj.val()) || parseInt(obj.val())<0  || obj.val()=='' || obj.val().indexOf('.')!=-1) 
	if (isNaN(obj.val()) || parseInt(obj.val())<0  || obj.val()=='') 
	{ 
		return 0;
	}
	return 1;
},

controllaScadenza : function (){

	var dataScad=jQuery("#dataScadenza").val();

	if (dataScad != ''){

		var giorno=dataScad.substr(0,2);
		var mese=dataScad.substr(3,2);
		var anno=dataScad.substr(6,4);

		var dataControllo=anno+mese+giorno;

		if (pianoTerapeutico.controllo_data(dataControllo).previous){
			alert("Attenzione! Impossibile inserire una data antecedente alla data odierna");
			jQuery("#dataScadenza").val("").focus(); 
		}
	}

},

getData : function (pDate,format){

	anno = pDate.getFullYear();	
	mese = '0'+(pDate.getMonth()+1);mese =  mese.substring(mese.length-2,mese.length);
	giorno = '0'+pDate.getDate();giorno =  giorno.substring(giorno.length-2,giorno.length);
	switch(format){
	case 'YYYYMMDD':	return anno+mese+giorno;
	case 'DD/MM/YYYY':	return giorno+'/'+mese+'/'+anno;		
	}
},

differenzaDate : function () {
	var dataIn=$('input[name=dataAttivazione]').val().substr(6,4)+$('input[name=dataAttivazione]').val().substr(3,2)+$('input[name=dataAttivazione]').val().substr(0,2);
	var dataFin=$('input[name=dataScadenza]').val().substr(6,4)+$('input[name=dataScadenza]').val().substr(3,2)+$('input[name=dataScadenza]').val().substr(0,2);		

	var diffDate=clsDate.difference.day(clsDate.str2date(dataFin,'YYYYMMDD',''),clsDate.str2date(dataIn,'YYYYMMDD',''))+1;
	return diffDate;

},

cambiaDurataMesi : function (){
	var dataIn=$('input[name=dataAttivazione]').val().substr(6,4)+$('input[name=dataAttivazione]').val().substr(3,2)+$('input[name=dataAttivazione]').val().substr(0,2);
	var dataFin=$('input[name=dataScadenza]').val().substr(6,4)+$('input[name=dataScadenza]').val().substr(3,2)+$('input[name=dataScadenza]').val().substr(0,2);		

	if($('input[name=dataAttivazione]').val()!=''  && $('input[name=dataScadenza]').val()!=''){
		if(pianoTerapeutico.differenzaDate()>366){
			$("#dataScadenza").val("").focus();
			alert("Non è possibile inserire un intervallo di tempo superiore ai 12 mesi");
			return;
		}
	}
	
	pianoTerapeutico.cambiaDurata();
	$('input[name=txtIntervalloMesi]').val(pianoTerapeutico.diffMesi(dataFin,dataIn));

},

cambiaDurata : function () {
	if($('input[name=dataAttivazione]').val()!=''  && $('input[name=dataScadenza]').val()!=''){
		$('input[name=txtDurata]').val(pianoTerapeutico.differenzaDate());
		}	
},

cambiaDataScadenza : function () {

	if($('input[name=dataAttivazione]').val()!=''  && $('input[name=txtDurata]').val()!=''){
		$('input[name=dataScadenza]').val(clsDate.getData(clsDate.dateAdd(clsDate.str2date($('input[name=dataAttivazione]').val(),'DD/MM/YYYY',''),'D',$('input[name=txtDurata]').val()-1),'DD/MM/YYYY'));
	}	
},

diffMesi : function (date1,date2){
	var mesi = '';
	dwr.engine.setAsync(false);	
	toolKitDB.getResultData('select round(months_between (to_date (\''+date1+'\', \'YYYYMMDD\'), to_date (\''+date2+'\', \'YYYYMMDD\') )) from dual', resp_month);
	dwr.engine.setAsync(true);
	function resp_month(resp){
		mesi=resp;
	}	
	return mesi;
},


verificaSpecialitaRinnovo : function (rep1,rep2){

	sql="select RADSQL.PT_GET_RINNOVA_PIANO('"+rep1+"','"+rep2+"') from dual";

	dwr.engine.setAsync(false);
	toolKitDB.getResultData(sql,getResSpec);
	dwr.engine.setAsync(true);		

	function getResSpec(resp){
		if(resp.toString()=='S'){
			contrSpec=true;
		}

	}
}

};

var stampaFirmaPiano = {


		prepara_firma_piano : function ()
		{
	daFirmare = 1;
	pianoTerapeutico.registraPiano();
		},


		stampa_piano : function()
		{
			var idenTestataPT='';
			if (document.EXTERN.IDEN_TESTATA.value=='') 
				idenTestataPT = stampaFirmaPiano.retrieveIdenTestata();
			else
				idenTestataPT = document.EXTERN.IDEN_TESTATA.value;	
			/*se lo stato=F apertura da db*/
			var stato = stampaFirmaPiano.retrieveFirmato(idenTestataPT);
			if (stato == null)
			{
				alert('Prego, effettuare almeno una registrazione');
				return;
			}		
			else if (stato=='F')
			{
				var progr = stampaFirmaPiano.retrieveProgressivo(idenTestataPT,'PIANO_TERAPEUTICO');
				var url = "ApriPDFfromDB?AbsolutePath="+stampaFirmaPiano.getAbsolutePath()+"&idenVersione="+idenTestataPT+"&funzione=PIANO_TERAPEUTICO&progr="+progr;
				var finestra = window.open(url,"finestra","fullscreen=yes scrollbars=no");
			try{
					top.opener.closeWhale.pushFinestraInArray(finestra);
				   	}catch(e){}
			}	
			else
			{
				var funzione  = 'PIANO_TERAPEUTICO';
				var anteprima = 'S';
				var reparto   = baseGlobal.SITO;
				var sf		  = '&prompt<pIdenTestata>='+idenTestataPT;
				var stampante = null;
				var url 	  = 'elabStampa?stampaFunzioneStampa='+funzione;

				url += '&stampaAnteprima='+anteprima;

				if(reparto!=null && reparto!='')		
					url += '&stampaReparto='+reparto;

				if(sf!=null && sf!='')
					url += '&stampaSelection='+sf;	

				if(stampante!=null && stampante!='')
					url += '&stampaStampante='+stampante;	

				var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);

				if(finestra)
				{	
					finestra.focus();
				}
				else
				{
					var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
				}
				try{
					top.opener.closeWhale.pushFinestraInArray(finestra);
				   	}catch(e){}
			}
		},

		retrieveFirmato : function (iden_testata_pt)
		{
			var firmato = '';

			dwr.engine.setAsync(false);	
			toolKitDB.getResultData('select stato from PT_TESTATA where iden = \'' + iden_testata_pt + '\'', resp_check);
			dwr.engine.setAsync(true);

			function resp_check(resp){
				firmato=resp;
			}
			return firmato;
		},


		/**
		 * funzione che recupera l'iden testata tramite query sulla tabella PT_TESTATA per quel determinato user_login
		 * */
		retrieveIdenTestata : function ()
		{
			var idenTestata='';

			dwr.engine.setAsync(false);	
			toolKitDB.getResultData('select iden from (select iden from PT_TESTATA where user_login = \'' + baseUser.LOGIN + '\' ORDER BY IDEN DESC)where rownum=1', resp_check);
			dwr.engine.setAsync(true);

			function resp_check(resp){
				idenTestata=resp;
			}
			return idenTestata;
		},

		/**
		 * funzione che recupera l'iden testata tramite query sulla tabella PT_TESTATA per quel determinato user_login
		 * */
		retrieveIdenXml : function()
		{
			var idenXml='';
			var idenTestata='';
			dwr.engine.setAsync(false);	
			toolKitDB.getResultData('select iden_xml,iden from (select iden_xml,iden from PT_TESTATA where user_login = \'' + baseUser.LOGIN + '\' ORDER BY IDEN DESC)where rownum=1', resp_check);
			dwr.engine.setAsync(true);

			function resp_check(resp){
				document.EXTERN.IDEN.value = resp[0];
				document.EXTERN.IDEN_TESTATA.value = resp[1];
			}
		},


		/**
		 * funzione che recupera l'iden testata tramite query sulla tabella PT_TESTATA per quel determinato user_login
		 * */
		retrieveProgressivo : function(iden_testata_pt,funzione)
		{
			var progressivo = '';
			dwr.engine.setAsync(false);	
			toolKitDB.getResultData('select max(progr) from CC_FIRMA_PDF where iden_tab = ' + iden_testata_pt + ' and funzione = \''+funzione+'\' and deleted=\'N\'', resp_check);
			dwr.engine.setAsync(true);
			function resp_check(resp){
				progressivo=resp;
			}
			return progressivo;
		},


		okRegistraPt : function ()
		{
			registrato = 1;
			if (daFirmare == 1)
			{
				//se si stratta di modifica di un piano firmato ma non di un rinnovo
				if (document.EXTERN.FIRMATO.value=='S' && document.EXTERN.STATO.value=='M' && typeof document.EXTERN.DUPLICA == 'undefined')
				{			
					//	alert('generaPianoNonFirmato');
					stampaFirmaPiano.generaPdfNonFirmato();
				}
				stampaFirmaPiano.firma_piano();
			}
			else
				pianoTerapeutico.chiudiPt();
		},

		firma_piano : function ()
		{
			var idenTestataPT	= ''; 
			var idenXml			= ''; 
			var idRemoto		= '';
			if(document.EXTERN.STATO.value!='MC'){
			stampaFirmaPiano.retrieveIdenXml();
			}
			/*if ((document.EXTERN.IDEN_TESTATA.value=='') || (document.EXTERN.FIRMATO.value=='S' && document.EXTERN.STATO.value=='M'))
					idenTestataPT = retrieveIdenTestata();
				else
					idenTestataPT = document.EXTERN.IDEN_TESTATA.value;	*/
			idenTestataPT 	= document.EXTERN.IDEN_TESTATA.value;
			idenXml			= document.EXTERN.IDEN.value; 
			idRemoto		= document.EXTERN.idRemoto.value; 	
			var url = "SrvFirmaPdfGenerica?typeFirma=PIANO_TERAPEUTICO&tabella=PT_TESTATA&idenTestataPT="+idenTestataPT+'&reparto='+baseGlobal.SITO+'&iden_per='+baseUser.IDEN_PER+'&idRemoto='+idRemoto+'&idenXml='+idenXml;
			var finestra = window.open(url,"finestra","fullscreen=yes scrollbars=no");
			try{
				top.opener.closeWhale.pushFinestraInArray(finestra);
			   	}catch(e){}
			
			/*var idenTestataPT=''; 

			if ((document.EXTERN.IDEN_TESTATA.value=='') || (document.EXTERN.FIRMATO.value=='S' && document.EXTERN.STATO.value=='M'))
				idenTestataPT = stampaFirmaPiano.retrieveIdenTestata();
			else
				idenTestataPT = document.EXTERN.IDEN_TESTATA.value;	
			var url = "SrvFirmaPdfGenerica?typeFirma=PIANO_TERAPEUTICO&tabella=PT_TESTATA&idenTestataPT="+idenTestataPT+'&reparto='+baseGlobal.SITO+'&iden_per='+baseUser.IDEN_PER;
			var finestra = window.open(url,"finestra","fullscreen=yes scrollbars=no");*/
		},


		generaPdfNonFirmato : function (){
			/*form creato dinamicamente*/
			var subForm=document.createElement("form");
			subForm.setAttribute("id", "pdfForm");
			subForm.setAttribute("action", "SrvCreaPdfNonFirmato");
			subForm.setAttribute("method", "POST");

			var iden_testata_old = document.EXTERN.IDEN_TESTATA.value;

			if (baseGlobal.SITO=='ASL1' || baseGlobal.SITO=='ASL5')
			{
				subForm.appendChild(stampaFirmaPiano.appendiInput("report","hidden",baseGlobal.SITO+"/PIANO_TERAPEUTICO.RPT"));
				subForm.appendChild(stampaFirmaPiano.appendiInput("ReportPath","hidden",""));		
				subForm.appendChild(stampaFirmaPiano.appendiInput("pIdenTestata","hidden",iden_testata_old));
				subForm.appendChild(stampaFirmaPiano.appendiInput("pEnte","hidden","EnteTest"));
				subForm.appendChild(stampaFirmaPiano.appendiInput("pCognMedico","hidden","CognomeProva"));
				subForm.appendChild(stampaFirmaPiano.appendiInput("pNomeMedico","hidden","NomeProva"));
				subForm.appendChild(stampaFirmaPiano.appendiInput("pCert","hidden","CertificatoProva"));
				subForm.appendChild(stampaFirmaPiano.appendiInput("pNotaInFondo","hidden","N"));
			}else if (baseGlobal.SITO=='ASL2'){
				//ASL2
				subForm.appendChild(stampaFirmaPiano.appendiInput("report","hidden",baseGlobal.SITO+"/PIANO_TERAPEUTICO.RPT"));
				subForm.appendChild(stampaFirmaPiano.appendiInput("ReportPath","hidden",""));		
				subForm.appendChild(stampaFirmaPiano.appendiInput("pIdenTestata","hidden",iden_testata_old));
				subForm.appendChild(stampaFirmaPiano.appendiInput("pNotaInFondo","hidden","N"));
			}
			$('#body').append(subForm);	
			stampaFirmaPiano.submitData(iden_testata_old);
		},


		appendiInput : function (name,tipo,valore){
			var inputTestata = document.createElement("input");
			inputTestata.setAttribute("name",name);
			inputTestata.setAttribute("type",tipo);
			inputTestata.setAttribute("value",valore);
			return inputTestata;
		},



		submitData : function (valore)
		{
			var qs = $("form#pdfForm").serialize();

			$.ajax({
				url: "SrvCreaPdfNonFirmato", 
				type: "POST",
				data: qs,     
				cache: false,
				dataType:"text",

				success: function (response) 
				{       
					var resp 	= response.toString().split("$")[0];
					var msg		= response.toString().split("$")[1];
					if (resp=='KO')
					{
						alert(msg);
					}else
					{
						stampaFirmaPiano.generaTabEventi(valore);
					}
				},

				error:function(response)
				{
					$("#errorMsg").html("AJAX communication error.");
				}
			});
		},


		getAbsolutePath : function ()
		{
			var loc = window.location;
			var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
			return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
		},

		generaTabEventi : function (v_iden_testata){

			dwr.engine.setAsync(false);
			toolKitDB.executeQueryData("CALL RADSQL.PT_INSERT_TAB_EVENTI("+v_iden_testata+",'N','S')");	
			dwr.engine.setAsync(true);	


		}

};