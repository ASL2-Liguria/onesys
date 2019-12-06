// JavaScript Document
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

function chiudi()
{
	parent.opener.parent.mainFrame.workFrame.document.location.replace("worklistInizio?msg=N");//worklistMainFrame.aggiorna();
	top.close();
}

function aggiorna()
{ 	var selCDC="";
	var atti;
	var order;
	document.formSta_Tab.SelTab.value=document.formSta_Tab.SceltaTab.value;
	//alert(document.formSta_Tab.SelAttivi.value);
	//alert(document.formSta_Tab.SelTypeOrd.value);
	for(T=0 ; T<document.formSta_Tab.elements.length ; T++)
							{	chkObj=document.formSta_Tab.elements[T];
								inputName=chkObj.name;
								if(inputName.length>8 && inputName.substr(0, 8)=='campoCDC' )
									{
										if (document.formSta_Tab.elements[T].checked)
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
	document.formSta_Tab.ArrCDC.value = selCDC;
	//document.formSta_Tab.SelTab.value=document.formSta_Tab.SceltaTab.value;
	
	atti=document.formSta_Tab.SelAttivi.value;
	order=document.formSta_Tab.SelTypeOrd.value;
	tab=document.formSta_Tab.SelTab.value;
	n_cop=document.formSta_Tab.SelTab.value

	//alert(atti);
	//alert(order);
	//alert(selCDC);
	document.formSta_Tab.submit();

	document.formSta_Tab.SelTab.value=tab
	document.formSta_Tab.SelAttivi.value=atti;
	document.formSta_Tab.SelTypeOrd.value=order;
	document.formSta_Tab.ArrCDC.value= selCDC;
	//alert(document.formSta_Tab.ArrCDC.value);
}

function changeCDC()
{	//alert()
	var numero =0;
	var cdcSel='';
	for(T=0 ; T<document.formSta_Tab.elements.length ; T++)
							{	chkObj=document.formSta_Tab.elements[T];
								inputName=chkObj.name;
								if(inputName.length>8 && inputName.substr(0, 8)=='campoCDC' )
									{
										if (document.formSta_Tab.elements[T].checked)
											{numero = numero+1
												//alert(numero);
												if (cdcSel=='')
													cdcSel=document.formSta_Tab.elements[T].value;
												 else
													cdcSel=cdcSel+','+document.formSta_Tab.elements[T].value;
											}
									}
							}
document.all.titoloCDC.title=cdcSel;
//alert(document.all.numeroCDC.value);
document.all.numeroCDC.value=numero;
document.all.numeroCDC.innerText=document.all.numeroCDC.value;
//alert(document.all.numeroCDC.value);

}

function getSeldeselCDC(check,inizio,fine)
{
	for(i=inizio; i<fine ; i++)
		{document.formSta_Tab.elements[i].checked = check;
		document.formSta_Tab.elements[i].checked;}
		
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
	righe=righe+28;
	precedente=parent.document.all.oFramesetStampaTab.rows;
	precedente=precedente.substr(0,3) 
	IntPrec=parseInt(precedente);
	
	if (sino == "no")
	{
		IntPrec=IntPrec-righe;
	
		parent.document.all.oFramesetStampaTab.rows = IntPrec+",*";
	}
	else if (sino == "si")
	{
		IntPrec=IntPrec+righe;

		parent.document.all.oFramesetStampaTab.rows = IntPrec+",*";
	}
	
}
function espandiFrameTab()
{
	
	precedente=parent.document.all.oFramesetStampaTab.rows;
	precedente=precedente.substr(0,3) 
	IntPrec=parseInt(precedente);
	//alert(precedente);
	if (IntPrec > 349)
	{
		div_cdc.style.display='none';
		parent.document.all.oFramesetStampaTab.rows = "25,*";
	}
	else 
	{
		
		div_cdc.style.display='none';
		parent.document.all.oFramesetStampaTab.rows = "360,*";
	}
	
}



function creaAnteprima()
//
{
	
		//alert(document.readyState) //== 'complete');
		//if (document.readyState !='complete' && parent.Stampa_Tab_elabStampe.document.readyState !='complete')
		
		if (document.readyState !='complete' && parent.Stampa_Tab_elabStampe.document.readyState !='complete')
		{
			return;
			//window.event.returnValue=false;//document.onreadystatechange = crea;
		}
		else 
		{
			crea();
		}
}
function crea()

	{//num_elementi = document.formSta_Tab.length ;
	
	
					//for (i=0;i<num_elementi;i++)
						//{	
							//alert(i);
							//alert(cdcSel);
							//alert(document.formSta_Tab.CDCDes.options(i).value);
							//if (cdcSel=="")
							//cdcSel=document.formSta_Tab.CDCDes.options(i).value;
						 //else
						 	//cdcSel=cdcSel+"*"+document.formSta_Tab.CDCDes.options(i).value;
						//}	
	var cdcSel="";
	var ordi="";
	num_elementiDes = document.formSta_Tab.CampiDes.length ;
	
					for (a=0;a<num_elementiDes;a++)
						{	
							
							
							if (ordi=="")
							ordi=document.formSta_Tab.CampiDes.options(a).value;
						 else
						 	ordi=ordi+"*"+document.formSta_Tab.CampiDes.options(a).value;
						}
	
	for(T=0 ; T<document.formSta_Tab.elements.length ; T++)
							{	chkObj=document.formSta_Tab.elements[T];
								inputName=chkObj.name;
								if(inputName.length>8 && inputName.substr(0, 8)=='campoCDC' )
									{
										if (document.formSta_Tab.elements[T].checked)
											{
												if (cdcSel=='')
													cdcSel=document.formSta_Tab.elements[T].value;
												 else
													cdcSel=cdcSel+'*'+document.formSta_Tab.elements[T].value;
											}
									}
							}
	if (cdcSel=="")
	{alert('Selezionare almeno un cdc');
	return;}					
	document.formNascostaStampaTab.stampaReparto.value=cdcSel;
	document.formNascostaStampaTab.stampaTabOrdin.value=ordi;
	document.formNascostaStampaTab.stampaTabN_cop.value=document.formSta_Tab.ncop.value;
	var funzStampa="";
	funzStampa="STAMPA_"+document.formSta_Tab.SelTab.value+"_STD";
	//alert(funzStampa);
	document.formNascostaStampaTab.stampaFunzioneStampa.value=funzStampa;
	if (document.formSta_Tab.SelTypeOrd.value=="S")
		document.formNascostaStampaTab.stampaTabTipoOrdin.value="A";
	else
		document.formNascostaStampaTab.stampaTabTipoOrdin.value="D";
		
	
		document.formNascostaStampaTab.stampaTabAtti.value=document.formSta_Tab.SelAttivi.value;
	
	document.formNascostaStampaTab.submit();
	
	
//}

}
