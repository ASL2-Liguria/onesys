//JavaScript Document
var mySel;
function allegafile() {

	var url_send = 'SrvScanFrameset?all_iden_esa=' + stringa_codici(array_iden_esame) + '&all_iden_anag=' + stringa_codici(array_iden_anag);
	// test
	// attenzione : da rimuovere
	//url_send += "&default_descr_doc=testoDiProva";
	//url_send += "&iden_nosologico=123456789";
	// *******
	// appendere gli altri parametri
	// doc_attach_to valori possibili ANAG, ESA
	// readonly_attach_to valori possibili S, N
	// default_descr_doc  default per descrizione
	try{
		var num_esami_selezionati = conta_esami_sel();
		if (conta_esami_sel()==0){
			alert(ritornaJsMsg("jsmsg1"));
			return;
		}
		// nel caso ci siano +
		// record selezionati verifico che non siano
		// pazienti differenti
		if (num_esami_selezionati>1){
			alert("Prego selezionare un solo esame");
			return;
		}

		var wndScan = window.open(url_send,"wndScan","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
		if(wndScan)
		{

			wndScan.focus();
		}
		else
		{
			wndScan = window.open(url_send,"wndScan","top=0,left=0,width=800,height=600,status=yes,scrollbars=yes");
		}
	}
	catch(e){
		alert("allegafile - Error: "+ e.description);
	}
}

function espandiFrameTab()
{
	//alert(precedente);
	if (parent.document.all.oFramesetAccMultipla.rows=="360,*")
	{

		parent.document.all.oFramesetAccMultipla.rows = "25,*";
	}
	else 
	{
		parent.document.all.oFramesetAccMultipla.rows = "360,*";
	}
}

function valorizzaSel()
{
	try{
		for (i=0;i<array_iden.length;i++)
		{
			if (array_iden[i]==document.form_stampa.iden.value)
				mySel = i+1;
		}
		visualizzaDocumento(mySel-1);
	}
	catch(e){
		alert("valorizzaSel - Error: "+ e.description);
	}
}


function docPrec()
{
	if (mySel==0)
	{
		return;
	}
	mySel=mySel-1;
	visualizzaDocumento(mySel);
}

function docSucc()
{
	if (mySel>=array_iden.length-1)
	{
		return;
	}
	mySel=mySel+1;
	visualizzaDocumento(mySel);
}

function visualizzaDocumento(varia)
{

	try{
		mySel=varia;
		illumina(varia)
		document.form_stampa.iden.value=stringa_codici(array_iden) ;
		document.form_stampa.submit();
	}
	catch(e){
		alert("visualizzaDocumento - Error: "+ e.description);
	}
}

function illumina_visualizza(varia)
{

	mySel=varia;
	illumina(varia)
	document.form_stampa.iden.value=stringa_codici(array_iden) ;

	document.form_stampa.submit();
}


function chiudi(){
	try{top.close()}catch(e){;}
}