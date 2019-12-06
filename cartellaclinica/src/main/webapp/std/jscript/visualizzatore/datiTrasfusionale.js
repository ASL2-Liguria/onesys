

jQuery(document).ready(function()
{
	 $("td[class~='tdIntAltriRep']").css("position","relative");
	 $("td[class~='tdIntAltriRep']").each(function(){
		 $(this).append("<div title='"+$(this).attr('DESCRPROV')+"' style='position:absolute;top:-0px;right:-0px' class='triangoloNote'></div>");
	 });
});

try{top.utilMostraBoxAttesa(false)}catch(e){}

function calcolaDimensioni()
{	
//se viene aperta dentro la cartella paziente	
if(parent.document.all.frameWork!=undefined){
divMain.style.width=parent.document.all.frameWork.offsetWidth-10+'px';
divInt.style.width=parent.document.all.frameWork.offsetWidth-422 +'px';
divDati.style.width=parent.document.all.frameWork.offsetWidth-405 +'px';
divDati.style.height=parent.document.all.frameWork.offsetHeight-90 +'px';
divLeft.style.height=parent.document.all.frameWork.offsetHeight-107 +'px';
}
else{	
divMain.style.width=screen.availWidth-10+'px';
divInt.style.width=screen.availWidth-425 +'px';
divDati.style.width=screen.availWidth-408 +'px';
divDati.style.height=screen.availHeight-65 +'px';
divLeft.style.height=screen.availHeight-82 +'px';	
}
}


function disabilitaTastoDx(){
if (document.layers){
document.captureEvents(Event.MOUSEDOWN);
document.onmousedown=nrcNS;
}else{document.onmouseup=nrcNS;
document.oncontextmenu=nrcIE;}
document.oncontextmenu=new Function("return false");
}


function grafLabWhale(obj){
	
	     	function setParam(){
			this.pCodiceEsame=obj.codiceEsame;
		    this.pNosologico=obj.elencoNosologici;
		    this.pIdenRichiesta=obj.idenRichiesta;
		    this.pIdPaziente=obj.idPaziente;
		    this.pMateriale=obj.materiale;
		    this.pDataAcc=document.formDati.dataMinima.value;
		    this.pCodProRep=document.formDati.codProRep.value;
		    
		    //passo questi parametri solo nel caso ci siano gli esami di ps
		    if(document.formDati.datiPs.value=='S' && obj.idenRichiesta==''){
		    this.pCognome=document.formDati.cognome.value;
		    this.pNome=document.formDati.nome.value;
		    this.pSesso=document.formDati.sesso.value;
		    this.pCodFisc=document.formDati.codfisc.value;
		    this.pDataNasc=document.formDati.datanasc.value;
		    }
		}
		var param = new setParam();
		

	var resp = window.showModalDialog('modalUtility/grafici/chartContainerLaboWhale.html',param,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px');

	}
	

function nrcIE(){
if (document.all){return false;}}


function nrcNS(e){
if(document.layers||(document.getElementById&&!document.all)){
if (e.which==2||e.which==3){
return false;}}}

function setAltezzaCol(){


//alert('setAltezzaCol');



//setto l'altezza del div di intestaione sinistra con quello di destra



//alert(document.all.tabellaBloc.rows[0].offsetHeight);
document.all.tabellaBloc.rows[0].style.height=(document.all.tabellaInt.rows[0].offsetHeight-4)+'px';
//alert(document.all.tabellaInt.rows[0].offsetHeight);
//alert(document.all.tabellaBloc.rows[0].offsetHeight);

//per certe versioni di ie8 il padding viene considerato
if(document.all.tabellaBloc.rows[0].offsetHeight<document.all.tabellaInt.rows[0].offsetHeight){
document.all.tabellaBloc.rows[0].style.height=(document.all.tabellaInt.rows[0].offsetHeight)+'px';
//alert('dopo' + document.all.tabellaInt.rows[0].offsetHeight);
//alert('dopo'+document.all.tabellaBloc.rows[0].offsetHeight);
}



//risetto la larghezza delle  colonne di sinistra


for (i=0;i<document.all.tabellaBloc.rows[0].cells.length;i++){
//alert('sopra:'+document.all.tabellaBloc.rows[0].cells[i].offsetWidth);
//alert('sotto:'+document.all.tabellaLeft.rows[1].cells[i].offsetWidth);
document.all.tabellaBloc.rows[0].cells[i].style.width=(document.all.tabellaLeft.rows[1].cells[i].offsetWidth-5)+'px';		
//alert('sopra dopo:'+document.all.tabellaBloc.rows[0].cells[i].offsetWidth);	  
}



//risetto la larghezza delle  colonne di destra


for (i=0;i<document.all.tabellaInt.rows[0].cells.length;i++){
document.all.tabellaInt.rows[0].cells[i].style.width=(document.all.datiTable.rows[1].cells[i].offsetWidth-5)+'px';		  
}



//risetto l'altezza delle  righe
var cont=0;
for (i=0;i<document.all.tabellaLeft.rows.length;i++)
	  {	
	  cont=cont+1;

//	  alert(document.all.tabellaLeft.rows[i].offsetHeight);
  //   alert(document.all.datiTable.rows[i].offsetHeight);

	  
	  if(document.all.tabellaLeft.rows[i].offsetHeight>25){
		  		   
document.all.datiTable.rows[i].style.height=(document.all.tabellaLeft.rows[i].offsetHeight-5)+'px';

//per certe versioni di ie8 il padding viene considerato
if(document.all.datiTable.rows[i].offsetHeight<document.all.tabellaLeft.rows[i].offsetHeight){
	
document.all.datiTable.rows[i].style.height=(document.all.tabellaLeft.rows[i].offsetHeight)+'px';
}


	  }
//alert('dopo');
	//  alert(document.all.tabellaLeft.rows[i].offsetHeight);
	  //   alert(document.all.datiTable.rows[i].offsetHeight);

	  

   
if(document.all.datiTable.rows[i].offsetHeight>25){

document.all.tabellaLeft.rows[i].style.height=(document.all.datiTable.rows[i].offsetHeight-5)+'px';

//alert(document.all.tabellaLeft.rows[i].offsetHeight);
//alert(document.all.datiTable.rows[i].offsetHeight);
//per certe versioni di ie8 il padding viene considerato
if(document.all.tabellaLeft.rows[i].offsetHeight<document.all.datiTable.rows[i].offsetHeight){
	//alert(document.all.tabellaLeft.rows[i].offsetHeight);
//	alert(document.all.datiTable.rows[i].offsetHeight);
document.all.tabellaLeft.rows[i].style.height=(document.all.datiTable.rows[i].offsetHeight)+'px';
//alert(document.all.tabellaLeft.rows[i].offsetHeight);
//alert(document.all.datiTable.rows[i].offsetHeight);
}


	  }	  
	  
	  }
  
//alert('fineSetAltezzaCol');	  
	  
}

function apriReferto(idRichiesta){
	var url = "header?filtriAggiuntivi=identificativoEsterno~WHALE"+idRichiesta;
	window.open (url,'','fullscreen=yes');	
	
}


function AutomateExcel()
{
	
   // Start Excel and get Application object.
      var oXL = new ActiveXObject("Excel.Application");
       
      oXL.Visible = true;
      
   // Get a new workbook.
      var oWB = oXL.Workbooks.Add();
      var oSheet = oWB.ActiveSheet;
       
      // dati anagrafici
      if(document.all.formDati.cognome!=undefined){
      oSheet.Cells(1, 1).Value = "COGNOME:";
      oSheet.Cells(1, 1).Font.Bold=true;
      oSheet.Cells(2, 1).Value = "NOME:";
      oSheet.Cells(2, 1).Font.Bold=true;
      oSheet.Cells(3, 1).Value = "DATA DI NASCITA:";
      oSheet.Cells(3, 1).Font.Bold=true;
      oSheet.Cells(4, 1).Value = "CODICE FISCALE:";
      oSheet.Cells(4, 1).Font.Bold=true;
      oSheet.Cells(1, 2).Value = document.all.formDati.cognome.value;
      oSheet.Cells(1, 2).HorizontalAlignment = -4108;
      oSheet.Cells(2, 2).Value = document.all.formDati.nome.value;
      oSheet.Cells(2, 2).HorizontalAlignment = -4108;
      oSheet.Cells(3, 2).Value = document.all.formDati.datanasc.value.substring(6,8)+"/"+document.all.formDati.datanasc.value.substring(4,6)+"/"+document.all.formDati.datanasc.value.substring(0,4);
      oSheet.Cells(3, 2).HorizontalAlignment = -4108;
      oSheet.Cells(4, 2).Value = document.all.formDati.codfisc.value;
      oSheet.Cells(4, 2).HorizontalAlignment = -4108;
      }
      
     //INTESTAZIONE DI SINISTRA
  
    //prima riga
//	 for(j=1;j<document.all.tabellaBloc.rows[0].cells.length;j++){
		 for(j=0;j<document.all.tabellaBloc.rows[0].cells.length;j++){	
     oSheet.Cells(6, j+1).Value = document.all.tabellaBloc.rows[0].cells[j].innerHTML.replace("<BR>"," ").replace("&nbsp;","");
     oSheet.Cells(6, j+1).Font.Bold=true;
     oSheet.Cells(6, j+1).HorizontalAlignment = -4108;
     oSheet.Cells(6, j+1).Borders.LineStyle = 1;
     oSheet.Cells(6, j+1).Borders.Weight = 2;
	 }
	 
	
	//INTESTAZIONE DI DESTRA
	 
	  for(h=0;h<document.all.tabellaInt.rows[0].cells.length;h++){
	
	 oSheet.Cells(6, h+j+1).Value = document.all.tabellaInt.rows[0].cells[h].innerHTML.replace("<BR>"," ").replace("&nbsp;","").substr(0,2)+'.'+document.all.tabellaInt.rows[0].cells[h].innerHTML.replace("<BR>"," ").replace("&nbsp;","").substr(3,2)+'.'+document.all.tabellaInt.rows[0].cells[h].innerHTML.replace("<BR>"," ").replace("&nbsp;","").substr(6,10);
     oSheet.Cells(6, h+j+1).Font.Bold=true;
     oSheet.Cells(6, h+j+1).HorizontalAlignment = -4108;
     oSheet.Cells(6, h+j+1).Borders.LineStyle = 1;
     oSheet.Cells(6, h+j+1).Borders.Weight = 2;
	 }
	

	//DATI TABELLE
	//altre righe
	
	  for (i=0;i<document.all.tabellaLeft.rows.length;i++)
  {
	 // se si tratta di una riga di intestazione gruppo (quindi è una riga con una sola cella)
	  if( document.all.tabellaLeft.rows[i].cells.length==1){
	  oSheet.Cells(i+7, 1).Value = document.all.tabellaLeft.rows[i].cells[0].innerHTML.replace("<BR>"," ").replace("&nbsp;","");
	  oSheet.Cells(i+7, 1).Font.Bold=true;
	  oSheet.Cells(i+7, 1).HorizontalAlignment = -4108;
	  oSheet.Cells(i+7, 1).Borders.LineStyle = 1;
      oSheet.Cells(i+7, 1).Borders.Weight = 2;
	  }
	  else{
		  
		  //TABELLA SINISTRA
    //  for(j=1;j<document.all.tabellaLeft.rows[i].cells.length;j++){
		for(j=0;j<document.all.tabellaLeft.rows[i].cells.length;j++){  
      oSheet.Cells(i+7, j+1).Value = document.all.tabellaLeft.rows[i].cells[j].innerHTML.replace("<BR>"," ").replace("&nbsp;","");
      oSheet.Cells(i+7, j+1).HorizontalAlignment = -4108;   
      oSheet.Cells(i+7, j+1).Borders.LineStyle = 1;
      oSheet.Cells(i+7, j+1).Borders.Weight = 2;
	  }
      //TABELLA DESTRA
	  for(h=0;h<document.all.datiTable.rows[i].cells.length;h++){
      oSheet.Cells(i+7, h+j+1).Value = document.all.datiTable.rows[i].cells[h].innerHTML.replace("<BR>"," ").replace("&nbsp;","");
      oSheet.Cells(i+7, h+j+1).HorizontalAlignment = -4108;
      oSheet.Cells(i+7, h+j+1).Borders.LineStyle = 1;
      oSheet.Cells(i+7, h+j+1).Borders.Weight = 2;
	  }
	  
    }
  }
  
//	  oSheet.Range("A1:J10").Borders.LineStyle = 1;
//	  oSheet.Range("A1:J10").Borders.Weight = 2;

  
  
    oSheet.columns.autofit;
	
	  
	  
        
   // Make sure Excel is visible and give the user control
   // of Excel's lifetime.
	  oXL.Visible = true;
	  oXL.Visible = false;
      oXL.Visible = true;
      oXL.UserControl = true;
}
	  
	  