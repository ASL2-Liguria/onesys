jQuery(document).ready(function(){
//	var opener=window.dialogArguments;		
	document.getElementById('hFam').value=parent.document.getElementById('hFam').value;
	document.getElementById('hGenerali').value=parent.document.getElementById('hGenerali').value;		
});

function aggiornaInputValueFam(id_sorgente,id_destinazione)
{

	campo_hidden_destinazione = document.all[id_destinazione];
	elemento_sorgente = document.all[id_sorgente];
	campo_hidden_destinazione.value="";
	for (var i=0;i<elemento_sorgente.length;i++){
	//	alert(elemento_sorgente.options[i].value);
		campo_hidden_destinazione.value+=""+elemento_sorgente.options[i].value+",";
		
	}
	campo_hidden_destinazione.value=campo_hidden_destinazione.value.substring(0,campo_hidden_destinazione.value.length-1);

}


function add_selected_elements_anam(elementoOrigine, elementoDestinazione,elementoOrigineFam,elementoDestinazioneFam, rimozione){
	
	var objectSource;
	var objectTarget;
	var objectSourceFam;
	var objectTargetFam;
	var num_elementi=0;
	var i=0;
	

	var valore_iden, valore_descr;
	var count;
	
	try{
		objectSource = document.getElementById(elementoOrigine);
		objectTarget = document.getElementById(elementoDestinazione);
		objectSourceFam = document.getElementById(elementoOrigineFam);
		objectTargetFam = document.getElementById(elementoDestinazioneFam);
		
	
		if ((objectSource)&&(objectTarget)){
			num_elementi = objectSource.length ;
			//controllo che sia selezionata una sola voce generale
			count=0;
			for (i=0;i<num_elementi;i++)
			{
			if (objectSource[i].selected)
			count+=1;
			}
			if (count>1){
			alert('Selezionare un solo familiare');
			return;
			}
			if(count==0){
			alert('Selezionare un familiare');	
			return
			}
			
			//controllo se è stata selezionata almeno una patologia
			 numElFam=objectSourceFam.length;
			 countFam=0;
			 for (i=0;i<numElFam;i++)
				{
				if (objectSourceFam[i].selected)
				countFam+=1;
				}
			   if (countFam==0){
				alert('Selezionare almeno una patologia');
				return
			   }
			
			
			
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
					
			//aggiunta elemento select fam destinazione	
					//alert('aggiunta select fam salvati');
					num_elementiFam = objectSourceFam.length ;
					var valore_fam='';
					var valore_fam_iden='$';
					for (f=0;f<num_elementiFam;f++)
					{
					//	alert('for..'+f);
						if (objectSourceFam[f].selected)
						{
					if(valore_fam=='')	{	
					valore_fam=objectSourceFam.options(f).text;	
					valore_fam_iden=objectSourceFam.options(f).value;	
					}
					else
					{
					valore_fam+=', '+objectSourceFam.options(f).text;		
					valore_fam_iden+='@'+objectSourceFam.options(f).value;
					}
					
					
						}
					}
					
					
					var oOption = document.createElement("Option");
					oOption.text = valore_fam;
				//	oOption.value = valore_iden+'#'+valore_fam_iden+'@';
					oOption.value = valore_fam_iden;
					objectTargetFam.add(oOption);
					
					
					// rimuovo elemento
					if (rimozione==true){
						remove_elem_by_id(elementoOrigine,i);
						i--;
						num_elementi--;
					}
				}
			}
			
			//deseleziono tutti gli elementi di select fam
			for (f=0;f<num_elementiFam;f++)
			objectSourceFam.options[f].selected=false;	
			
		}
	}
	catch(e){
		alert("add_selected_elements - Error: " + e.description);
	}
}



function getOptionFam(){
	var i;
	var object;
	var outString = "";	
	
	objectFam = document.getElementById('elencoFamSel');
	objectGenerali = document.getElementById('elencoGenSel');


		for (i=0;i<objectFam.length;i++){
			if (outString==""){
					outString = objectFam.options(i).text;
			}
			else{
					outString = outString + ' - ' +objectFam.options(i).text;					
			}
			
			outString = outString + ':' + objectGenerali.options(i).text;
			
		
		}
	
//alert(outString);	
	
	return outString;
}




function registraFam(){
	parent.document.getElementById('hFam').value=document.getElementById('hFam').value;
	parent.document.getElementById('hGenerali').value=document.getElementById('hGenerali').value;
	parent.document.getElementById('txtFamiliare').innerText=getOptionFam();
	chiudiScheda();
}


function remove_selected_elements_anam(elementoOrigine, elementoDestinazione,elementoOrigineFam, rimozione){
	
	var objectSource;
	var objectTarget;
	var objectSourceFam;
	var num_elementi=0;
	var i=0;
	

	var valore_iden, valore_descr;

	//alert('try');
	try{
		objectSource = document.getElementById(elementoOrigine);
		objectTarget = document.getElementById(elementoDestinazione);
		objectSourceFam = document.getElementById(elementoOrigineFam);
		
	
		if ((objectSource)&&(objectTarget)){
			num_elementi = objectSource.length ;
			
			for (i=0;i<num_elementi;i++)
			{
				if (objectSource[i].selected)
				{
		//			alert('selezionato');
					valore_iden = objectSource.options(i).value;
					valore_descr = objectSource.options(i).text;
					var oOption = document.createElement("Option");
					oOption.text = valore_descr;
					oOption.value = valore_iden;
				//	objectTarget.add(oOption);
					
					
					// rimuovo elemento
					if (rimozione==true){
		//				alert('rimozione');
						remove_elem_by_id(elementoOrigine,i);
						remove_elem_by_id(elementoOrigineFam,i);
						i--;
						num_elementi--;
					}
				}
			}
			
			
		}
	}
	catch(e){
		alert("add_selected_elements - Error: " + e.description);
	}
}

function chiudiScheda() {
	parent.$.fancybox.close(); 
}



