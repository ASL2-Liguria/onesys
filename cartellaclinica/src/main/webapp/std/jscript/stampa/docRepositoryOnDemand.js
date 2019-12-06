// da copiare in libs/whaletest/std/jscript/stampa
var requestAnteprima = 'N';
var n_copie = '1';
var OffsTop = '0';
var OffsLeft = '0';
var Rotation = '0';
var selezionaStampante = ''; //basePC.PRINTERNAME_REF_CLIENT;
var StampaSu = 'N';
var doc_array =null;
var fs_array= null;
var prov_array=null;
var parent_array=null;

// Creo un riferimento a array_iden_richiesta (necessario per la funzione mostraInfoRichiesta)
$(window).load(function(){
	if (typeof array_iden === 'undefined' && typeof array_iden_richiesta === 'object') { 
		window.array_iden = array_iden_richiesta;
	}
});

// Stampa i documenti selezionati
function recuperaUID(){
	var TRiden = null;
	var TRiden_array = null;
	var filtroStampa = null;
	var daStampare = null;
	var filtroStatoRichieste = null;
	
	//alert('cmbStatoReferti='+ parent.document.all.cmbStatoReferti.value);
	filtroStampa =  $("select[name='cmbStatoReferti']",parent.document).val() || "0,1"; // leggo il filtro di stampa impostato nella pagina superiore dei filtri
	filtroStatoRichieste = $("select[name='cmbStatoRichieste']",parent.document).val() || " NULL";
	
	//alert('cmbStatoRichieste='+filtroStatoRichieste);
	if (filtroStampa == '0' || filtroStampa=='0,1')
		daStampare ='S';
	else
		daStampare ='N';
	
	//se aperto da wk_richieste
	if(typeof array_iden!='undefined'){
		TRiden = String(stringa_codici(array_iden));
	}
	//se aperto da stampa on demand
	else
	{
		TRiden = String(stringa_codici(array_iden_richiesta));
	}
	
	if (typeof array_stato!='undefined'){
		var a =stringa_codici(array_stato).split('*');
		if(($.inArray('I', a) > -1) || ($.inArray('E', a) > -1) || ($.inArray('X', a) > -1) || ($.inArray('A', a) > -1) || ($.inArray('P', a) > -1)){
			alert('Selezionare soltanto richieste refertate');
			return;
		}
	}

	if (TRiden == '')
		alert('Attenzione! Nessuna richiesta selezionata!');
	else
	{
		TRiden_array = TRiden.split('*');
		//alert('TRiden=' + TRiden);
		doc_array = new Array();
		fs_array = new Array();
		prov_array = new Array();
		parent_array = new Array();
		//alert('dwr.engine.setAsync(false)');
		dwr.engine.setAsync(false);
		//alert('chiamata CJsUpdate.stampaOnDemand con ' + TRiden + ' ' + daStampare); 
		CJsUpdate.stampaOnDemand(TRiden, 'N', compilaArrayDoc);
		dwr.engine.setAsync(true);	
		// stampa dei documenti
	// alert('Length: '+doc_array.length);
		for (var i=0; i < doc_array.length; i++)
		{
			stampaDocRepository(doc_array[i],fs_array[i]);
		}
		// update testata_richieste
		//aggiorno solo nel caso di chiamata da stampa on demand o da wk richieste
		
		if ((daStampare =='S' && filtroStampa!='undefined') || (typeof array_stato!='undefined') ) {
			if (doc_array.length >0)
			{
				for (var j=0; j < TRiden_array.length; j++)
				{
					
					if (filtroStatoRichieste == ' NULL' || (typeof array_stato!='undefined' && a[j]=='R')) // referto_parziale is null, cioè richieste refertate -> stampato=2 oppure da wk richieste array_stato='R'
							sqlUpdate = "2@update infoweb.testata_richieste set stampato=2 where IDEN =" + TRiden_array[j];
					else // referto_parziale not null, cioè richieste parzialmente refertate-> stampato=1
							sqlUpdate = "2@update infoweb.testata_richieste set stampato=1 where IDEN =" + TRiden_array[j];
					//alert('sqlUpdate='+sqlUpdate);
					dwr.engine.setAsync(false);
					CJsUpdate.insert_update(sqlUpdate, cbk_update);
					dwr.engine.setAsync(true);
				}
				CJsUpdate = null;
			}
		}
		
		
		
		//riapplico il filtro della wk
		try{
			parent.applica_filtro();
		}catch(e){
			parent.$('#idWkRichieste').attr('src',parent.$('#idWkRichieste').attr('src'));
		}
	}
}

function compilaArrayDoc(pdfPosition)
{
	var pdfResult;
	var pdfPos=null;
	
	//alert('callback: ' + pdfPosition);
	//pdfResult = pdfPosition.split('$');
	//pdfPos = pdfResult[0].split('@');
	pdfPos = pdfPosition.split('@');
	//alert('pdfPos.length='+pdfPos.length);
	if (pdfPos.length > 1) {
		for (var i=0; i< pdfPos.length-1; i+=2)
		{
			if (pdfPos[i]!= '')
			{
				doc_array.push(pdfPos[i]);
				if (pdfPos[i+1] != '') 
					fs_array.push(pdfPos[i+1]);
				else
					fs_array.push(null);	
			}
			else
				alert('Documento non presente');
		}
	}
	else
		alert('Documento non presente');
}

/*
function recuperaUID(){
	stampaDocRepository('http://192.168.1.31:80/repository/getDocument.php?token=514208');
	stampaDocRepository('http://192.168.1.31:80/repository/getDocument.php?token=514208');
}
*/


/**/
function stampaDocRepository(pdf,fss){
	var pdfResult;
	var pdfPos=null;
	var url;
	var i;
	
	
//	alert('stampaDocRepository pdf= ' + pdf);
//	alert('stampaDocRepository fss=' + fss);

	


	url = getUrl();
	if (fss) { // c'è il foglio di stile 
		//alert('report con foglio di stile');
		initMainObject(url +"openDocument?mimeType=requestPdfFromSS&uri="+pdf+"&uriSS="+fss);
		}
	else // non c'è il foglo di stile
	{
	//	alert('ultimaAA:'+url +"openDocument?mimeType=pdfBytes&uri="+pdf+"&uriSS=")
		initMainObject(url +"openDocument?mimeType=pdfBytes&uri="+pdf+"&uriSS=");
	}


		//alert('report senza foglio di stile');
		//initMainObject(pdf);

	
		
}


function initMainObject(pdfPosition){
	//alert(document.frmFrom);
	var contatore=0;
	//tutto_schermo();
	/*if (pdfPosition=='noRef'){
		alert("Esame non ancora Refertato");
		self.close();
	}*/
	//alert('initMainObject : pdfPosition=' +pdfPosition);
	//Url=pdfPosition.split('<!!>');
	//alert('Url='+Url);
	UrlImago="";
	altezza = screen.height-60;
	largh = screen.width-25;
	//alert(typeof (document.all.pdfReader));
	 if (requestAnteprima=='N'){
		altezza="0";
		largh="0";
	}
	if (n_copie=='0')	 {
		n_copie=window.showModalDialog('n_copie.html','','center:1;dialogHeight:110px;dialogWidth:480px;status:0');
	}
	if (typeof document.all.pdfReader=='undefined'){	 
		document.write('<object CLASSID="clsid:969CB476-504B-41CF-B082-1B8CDD18323A" CODEBASE="cab/pdfControl/prjXPdfReader.CAB#version=2,0,0,0"  id="pdfReader">');
		document.write('<param name="width" value="'+largh+'">');	
		document.write('<param name="height" value="'+altezza+'">');	
		document.write('<param name="top" value="0">');	
		document.write('<param name="left" value="0">');	
		document.write('<param name="preview" value="N">');	
		document.write('<param name="PDFurl" value="'+UrlImago+'">');		
		document.write('<param name="OffTop" value="'+OffsTop+'">');
		document.write('<param name="OffLeft" value="'+OffsLeft+'">');
		document.write('<param name="Rotate" value="'+Rotation+'">');
		document.write('<param name="trace" value="S">');	
		document.write('<param name="numCopy" value="'+n_copie+'">');		
		document.write('<param name="zoomFactor" value="75">');				
		document.write('<param name="zoomFit" value="">');
		document.write('<param name="printerName" value="'+selezionaStampante+'">');		
		document.write('<param name="driverName" value="">');		
		document.write('<param name="portName" value="">');						
		document.write('</object>');
	}
	//alert('eseguito document.write');
	//alert('Url.length='+Url.length);
	//for (contatore = 0; contatore < Url.length ; contatore++){	
		document.all.pdfReader.trace='S';
		document.all.pdfReader.PDFurl = pdfPosition; //Url[contatore];	
		//document.all.pdfReader.printAll();
		//alert ('printALL eseguito');
		//alert('Url[0]='+Url[contatore]);
		//alert('requestAnteprima:'+requestAnteprima);
		if (requestAnteprima=='N'){
			if (StampaSu=='N')
			{
				document.all.pdfReader.stampa_silenziosa();

			}
			else
			{	
				document.all.pdfReader.printWithDialog();
				top.close();		
			}
		}
	//}	
}
function getUrl()
{
	var aTmp = document.location.href.split('/');
	var sRet = '';
	for(var idx = 0; idx < aTmp.length - 1; sRet += aTmp[idx++] + "/");
	
	return sRet;
}

function cbk_insert(message)
{
	if(message != '')
	{
		alert(message);
		return;
	}
	else
	{
		//CJsUpdate = null;
	}
}

function cbk_update(message)
{
	if(message != '')
	{
		alert(message);
		return;
	}
	else
	{
		//CJsUpdate = null;
	}
}

function selezionaTutti()
{
	//alert('seleziona tutti');
	//alert('array_iden_richiesta.length='+array_iden_richiesta.length);

	
		for(var k=0; k < array_iden_richiesta.length; k++)
		{
			//alert('chiamo illumina_sempre con k='+k);
			illumina_sempre(k);
		}
}

function selezionaStampaRefertati()
{
	for(var k=0; k < array_stato.length; k++)
		{
		
		  if(array_stato[k]=='R' || array_stato[k]=='RP'){
			illumina_sempre(k);
		  }
		}
	recuperaUID();
}

function illumina_sempre(indice){

	//if (hasClass(document.all.oTable.rows(indice), "sel") != null){
	/*if (document.all.oTable.rows(indice).style.backgroundColor == sel){
		// deseleziona
		//removeClass(document.all.oTable.rows(indice), "sel");
		//rimuovi_indice(indice);
		//alert('riga già selezionata '+indice);
	}		
	else{
		// seleziona
		//addClass(document.all.oTable.rows(indice), "sel");
		document.all.oTable.rows(indice).style.backgroundColor = sel;
		//alert('riga da selezionare '+indice);
		nuovo_indice_sel(indice);
		}*/
		
	addClass(document.all.oTable.rows(indice), "sel");
	nuovo_indice_sel(indice);
	
}

function aux_applica_filtro(){
	//TODO
}
