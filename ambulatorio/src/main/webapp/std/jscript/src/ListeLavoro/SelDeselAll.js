// JavaScript Document
function chiudi()
{
	//parent.parent.
	//parent.window.close();
	//parent.opener.document.location.replace("worklistInizio");

	parent.opener.aggiorna();
	top.close();
}
function frameiniziali()
{
ncdc=document.formLL.CdcTOT.value;
nsale=document.formLL.AreTOT.value;
restocdc=ncdc%3;
	righecdc=(ncdc-restocdc)/3;
	if (restocdc!=0)
	{righecdc=righecdc+1;}
	righecdc=righecdc*26;
	restosale=nsale%3;
	righesale=(nsale-restosale)/3;
	if (restosale!=0)
	{righesale=righesale+1;}
	righesale=righesale*26;
	dimensione=300+righecdc;//+righesale+righecdc;
	//alert(dimensione)
parent.document.all.oFramesetLL.rows = dimensione+",*";

}
function apri_chiudiFrame()
{


if (parent.document.all.oFramesetLL.rows!="*,0")
{
	document.all.openclose.value=parent.document.all.oFramesetLL.rows;
	parent.document.all.oFramesetLL.rows = "*,0";
	//alert("OK")
}
else
{
parent.document.all.oFramesetLL.rows=document.all.openclose.value;

}
//alert(document.all.openclose.value)
}
function aggiorna()
{}
function getSeldeselCDC(check,inizio,fine)
{
	for(i=inizio; i<fine ; i++)
		{document.formLL.elements[i].checked = check;
		document.formLL.elements[i].checked;}
		applicaLLCDC(fine);
}
function ApriChiudi (valore,numerosel){
	if (valore==""){return;}
	objectNode = document.getElementById(valore);

	if (objectNode){
		if (objectNode.style.display=='block'){
			objectNode.style.display='none';
			espandiFrame(numerosel,"no",0);
		}
		else if(objectNode.style.display =="none"){
			objectNode.style.display='block';
			espandiFrame(numerosel,"si");
		}
		else if(objectNode.style.display ==""){
			objectNode.style.display='none';
			espandiFrame(numerosel,"no",0);
		}
	}
}

function espandiFrame(numeroselezionati,sino)
{
	var resto=0;
	var righe=0;
	var precedente="";
	var IntPrec=0;
	resto=numeroselezionati%3;
	righe=(numeroselezionati-resto)/3;
	if (resto!=0)
	{righe=righe+1;}
	righe=righe*26;
	righe=righe+28
	precedente=parent.document.all.oFramesetLL.rows;
	precedente=precedente.substr(0,3)
	IntPrec=parseInt(precedente);

	if (sino == "no")
	{
		IntPrec=IntPrec-righe;

		parent.document.all.oFramesetLL.rows = IntPrec+",*";
	}
	else if (sino == "si")
	{
		IntPrec=IntPrec+righe;

		parent.document.all.oFramesetLL.rows = IntPrec+",*";
	}

}
function getSeldeselAree(check,inizio,fine)
{
	var numero=0;
	var sala='';
	for(T=0 ; T<document.formLL.elements.length ; T++)
		{
			chkObj=document.formLL.elements[T];
			inputName=chkObj.name;
			if(inputName.length>8 && inputName.substr(0, 8)=='campoSal' )
				{
					document.formLL.elements[T].checked = check;
					 numero=numero+1;
						if (sala=='')
						sala=document.formLL.elements[T].value;
						else
						sala=sala+','+document.formLL.elements[T].value;
				}
		}
			if (check)
				{
					document.all.labelNumero.innerText=numero;
				    document.all.titoloAree.title=sala;
				}
			else
				{
					document.all.labelNumero.innerText=0;
				 	document.all.titoloAree.title='';
				}
}

function aggNsale(inizio,fine)
{
var nsale=0;
var sala='';
for(T=0 ; T<document.formLL.elements.length ; T++)
		{	chkObj=document.formLL.elements[T];
			inputName=chkObj.name;
			if(inputName.length>8 && inputName.substr(0, 8)=='campoSal' )
				{
					if (document.formLL.elements[T].checked)
						{
				 			nsale=nsale+1;
							if (sala=='')
								sala=document.formLL.elements[T-1].value;
							 else
								sala=sala+','+document.formLL.elements[T-1].value;
						}
				}
		}
		document.all.labelNumero.innerText=nsale;
		document.all.titoloAree.title=sala;

}


function applicaLLCDC(inizio)
{

	if (controllo==true)
	{
		alert('Dammi il Tempo di aggiornare la Pagina')
		return;

	}
	else
	{
		var selCDC='';
		var selFil='';
		for(T=0 ; T<document.formLL.elements.length ; T++)
			{	chkObj=document.formLL.elements[T];
				inputName=chkObj.name;
				if(inputName.length>8 && inputName.substr(0, 8)=='campoCDC' )
					{
						if (document.formLL.elements[T].checked)
						{
							if (selCDC == '')
								selCDC = '1';
							else
								selCDC = selCDC+','+'1';
						}
						else
						{
							if (selCDC == '')
								selCDC = '0';
							else
								selCDC = selCDC + ',' + '0';
						}
					}
			}

		if(document.formLL.campoFiltri0.checked)
		selFil='1';
		else
		selFil='0';
		if(document.formLL.campoFiltri1.checked)
		selFil=selFil+',1';
		else
		selFil=selFil+',0';
		if(document.formLL.campoFiltri2.checked)
		selFil=selFil+',1';
		else
		selFil=selFil+',0';
		if(document.formLL.campoFiltri3.checked)
		selFil=selFil+',1';
		else
		selFil=selFil+',0';
		if(document.formLL.campoFiltri4.checked)
		selFil=selFil+',1';
		else
		selFil=selFil+',0';


		document.formLL.ArrCDC.value = selCDC;
		document.formLL.ArrFil.value = selFil;
		document.formLL.statOld.value = creaStringaStato();
		document.formLL.submit();

	}
}

function applicaLLFiltri(inizio,fine)
{
	if (controllo==true)
	return;
else
{
	var tot=parseInt(inizio)+parseInt(fine)
	var iniziosale=parseInt(inizio)+1

	var selCDC='';
	var selFil='';
	var selAre='';
	var nsale=0;
	for(T=0 ; T<document.formLL.elements.length ; T++)
		{chkObj=document.formLL.elements[T];
		inputName=chkObj.name;
		if(inputName.length>8 && inputName.substr(0, 8)=='campoCDC' )
		{//alert(i);
			if (document.formLL.elements[T].checked)
				{//alert(document.formLL.elements[i].checked);

					if (selCDC == '')
						selCDC = '1';
					else
						selCDC = selCDC+','+'1';

				}
			else
			{
				if (selCDC == '')
					selCDC = '0';
				else
					selCDC = selCDC + ',' + '0';
			}
		}}
	//alert(selCDC);
	for(a=0 ; a<document.formLL.elements.length ; a++)
		{chkObj=document.formLL.elements[a];
		inputName=chkObj.name;
		if(inputName.length>8 && inputName.substr(0, 8)=='campoSal' )
		{//alert(a);
			if (document.formLL.elements[a].checked)
				{	//alert(document.formLL.elements[a].name);
					nsale=nsale+1;
					if (selAre == '')
						selAre = '1';
					else
						selAre = selAre+','+'1';
				}
			else
			{ //alert(document.formLL.elements[a].name);
				if (selAre == '')
					selAre = '0';
				else
					selAre = selAre + ',' + '0';
			}
		} }

	//alert(nsale);
	document.all.labelNumero.innerText=nsale;
	if(document.formLL.campoFiltri0.checked)
	selFil='1';
	else
	selFil='0';
	if(document.formLL.campoFiltri1.checked)
	selFil=selFil+',1';
	else
	selFil=selFil+',0';
	if(document.formLL.campoFiltri2.checked)
	selFil=selFil+',1';
	else
	selFil=selFil+',0';
	if(document.formLL.campoFiltri3.checked)
	selFil=selFil+',1';
	else
	selFil=selFil+',0';
	if(document.formLL.campoFiltri4.checked)
	selFil=selFil+',1';
	else
	selFil=selFil+',0';


	document.formLL.ArrCDC.value = selCDC;
	document.formLL.ArrFil.value = selFil;
	document.formLL.ArrAre.value = selAre;
	document.formLL.statOld.value = creaStringaStato();
	//alert(creaStringaStato());
	document.formLL.submit();
	document.all.labelNumero.innerText=nsale;
}
}

function add_list_elements(elementoOrigine, elementoDestinazione){

	var objectSource;
	var objectTarget;
	var num_elementi=0;
	var i=0;

	var valore_iden, valore_descr;

	objectSource = document.getElementById(elementoOrigine);
	objectTarget = document.getElementById(elementoDestinazione);

	if ((objectSource)&&(objectTarget)){
		num_elementi = objectSource.length ;
		for (i=0;i<num_elementi;i++)
		{
			if (objectSource[i].selected)
			{
				valore_iden = objectSource.options(i).value;
				valore_descr = objectSource.options(i).text;
				var oOption = document.createElement("Option");
				oOption.text = valore_descr;
				oOption.value = valore_iden;
				objectTarget.add(oOption);
				remove_elem_by_id(elementoOrigine,i);
					i--;
					num_elementi--;
				// rimuovo elemento


			}
		}
	}
}
function remove_elem_by_id(elemento, indice){

	var object;

	object = document.getElementById(elemento);

	if (object){
		if (!isNaN(indice)){
			if (indice>-1){
				object.options.remove(indice)
			}
		}
	}
}

function creaAnteprima(){
	var DataDa='';
	var objectSource;
	var DataA='';
	var AnnoDa=0;
	var DayDa=0;
	var MeseDa=0;

	var provenienza='';
	var sala='';
	var cdc='';
	var num_elementi=0;
	DataDa=document.formLL.txtDaData.value;
	DataA=document.formLL.txtAData.value;
	AnnoDa=parseInt(DataDa.substr(6));
	DayDa=parseInt(DataDa.substr(0,2));
	MeseDa=parseInt(DataDa.substr(4,2));
	AnnoA=parseInt(DataA.substr(6));
	DayA=parseInt(DataA.substr(0,2));
	MeseA=parseInt(DataA.substr(4,2));

	if (DataDa=="" || DataA=="")
	{alert(ritornaJsMsg("dataMancante"));
	return;}

	if (AnnoDa>AnnoA)
		{ 	alert(ritornaJsMsg("dataAMaggioreDataA"));
			return;}
	else
		if (MeseDa>MeseA & AnnoDa==AnnoA)
			{ 	alert(ritornaJsMsg("dataAMaggioreDataA"));
			return;}
		else
			if (DayDa>DayA & MeseDa==MeseA & AnnoDa==AnnoA)
				{ 	alert(ritornaJsMsg("dataAMaggioreDataA"));
				return;}
			else
				{	for(T=0 ; T<document.formLL.elements.length ; T++)
							{	chkObj=document.formLL.elements[T];
								inputName=chkObj.name;
								if(inputName.length>8 && inputName.substr(0, 8)=='campoSal' )
									{
										if (document.formLL.elements[T].checked)
											{
												if (sala=='')
													sala=document.formLL.elements[T].value;
												 else
													sala=sala+','+document.formLL.elements[T].value;
											}
									}
								if(inputName.length>8 && inputName.substr(0, 8)=='campoCDC' )
									{
										if (document.formLL.elements[T].checked)
											{
												if (cdc=='')
													cdc=document.formLL.elements[T].value;
												 else
													cdc=cdc+'","'+document.formLL.elements[T].value;
											}
									}

							}

					num_elementi = document.formLL.Prova.length ;
					for (i=0;i<num_elementi;i++)
						{if (provenienza=="")
							provenienza=document.formLL.Prova.options(i).value;
						 else
						 	provenienza=provenienza+","+document.formLL.Prova.options(i).value;
						}

					if (document.formLL.stampaFunzioneStampa.value=='')
						document.formLL.stampaFunzioneStampa.value='LL_PROV_STD'
					if (cdc=="")
						{alert(ritornaJsMsg("selezionaReparto"));
						return;}

						//var newPage=open("","wndOpen","ciao");
					document.formNascostaStampa.Provenienza.value=provenienza;
                                        alert(document.formNascostaStampa.Provenienza.value);
					document.formNascostaStampa.stampaFunzioneStampa.value=document.formLL.stampaFunzioneStampa.value;
					document.formNascostaStampa.DataDa.value=document.formLL.txtDaData.value;
					document.formNascostaStampa.DataA.value=document.formLL.txtAData.value;
				//	document.formNascostaStampa.stampaReparto.value=cdc;
					document.formNascostaStampa.idenSal.value=sala;
					document.formNascostaStampa.NoPulsante.value="S";

					document.formNascostaStampa.stampaStato.value=creaStringaStato();
document.formNascostaStampa.stampaStato.value
					document.formNascostaStampa.submit();
				}
}

function creaStringaStato() {

	var stringaStato="_____________%";
	//alert(stringaStato);
	if (document.formLL.chkALL.checked)
	stringaStato="%%";
	else
	{
	if (document.formLL.campoStatoEnt[0].checked)
		{stringaStato="P"+stringaStato.substring(1);}
	else
		{stringaStato=" "+stringaStato.substring(1);}
	if (document.formLL.campoStatoEnt[1].checked)
		{stringaStato=stringaStato.substring(1,2)+"A"+stringaStato.substring(3);}
	else
		{stringaStato=stringaStato.substring(1,2)+" "+stringaStato.substring(3);}
	if (document.formLL.campoStatoEnt[2].checked)
		{stringaStato="__"+stringaStato.substring(2);}



	if (!document.formLL.chkEse.checked)
	{stringaStato=stringaStato.substring(0,2)+" %"//+stringaStato.substring(4);

		return stringaStato;}
	else
	{
		stringaStato=stringaStato.substring(0,2)+"E"+stringaStato.substring(4);

		if (document.formLL.chkCon.checked)
		{stringaStato=stringaStato.substring(0,8)+"K"+stringaStato.substring(9);}
		else
		{stringaStato=stringaStato.substring(0,8)+" "+stringaStato.substring(9);}
		if (document.formLL.chkRef.checked)
		{stringaStato=stringaStato.substring(0,9)+"R"+stringaStato.substring(10);}
		else
		{stringaStato=stringaStato.substring(0,9)+" "+stringaStato.substring(10);}
		if (document.formLL.chkFir.checked)
		{stringaStato=stringaStato.substring(0,12)+"F"+stringaStato.substring(12);}
		else
		{stringaStato=stringaStato.substring(0,12)+" "+stringaStato.substring(12);}
		}


	}
return stringaStato;
	}

function sel_des(elenco, valore)
{
	if(elenco != null && valore != null)
	{
		var i;
		for(i = 0; i < elenco.length; i++)
		{
			elenco[i].selected = valore;
		}
	}
}
