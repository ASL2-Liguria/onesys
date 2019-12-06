
jQuery(document).ready(function(){
	caricamento();
});


function caricamento(){

	if (document.EXTERN.STATO.value=='VIS' || document.getElementById('hRadio').value!=''){
		document.getElementById('lblRegistra').parentElement.style.display='none';
	}

	addClass(document.getElementById('fValutazione'),"textAlignCenter");

	if(document.EXTERN.FUNZIONE.value == ''){
		jQuery("#lblBisogno").parent().addClass("classTdLabel_O").attr("STATO_CAMPO","O");
		jQuery("[name=cmbBisogno]").attr("STATO_CAMPO","O").attr("STATO_CAMPO_LABEL","lblBisogno");
	}else{
		jQuery("#lblBisogno").hide();
		jQuery("[name=cmbBisogno]").parent().hide();
	}
	
	jQuery("[name=cmbBisogno]").change(function(){
		
		var valore = jQuery(this).val().toString().replace(/\'/g, '');
		document.EXTERN.FUNZIONE.value = valore;
		
	})
	
	//maskedit
	try {
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.dati.txtDataObiettivo); 
		oDateMask.attach(document.dati.txtDataOdierna);
	}catch(e){
		//alert(e.description);
	}

}

// funzione che popola la label delle informazioni con utente inserimento e data inserimento
function popolaLabelInfo(){

	var info='';
	var data=document.getElementById('txtDataOdierna').value;
	var ora=document.getElementById('txtOraOdierna').value;
	var dataOrd='';
	var utente= document.getElementById('hUtente').value;
	var dataInserita=document.getElementById('hDataIns').value;
	var dataMod=document.getElementById('hDataMod').value;
	var spazi='\t\t\t\t\t\t\t';
	var utenteMod=document.getElementById('hUtenteMod').value;

	//data=clsDate.getData(new Date(),'YYYYMMDD'); //prendo la data odierna	
	
	if (dataInserita==''){
			
		dataOrd=data+' '+ora; // la trasformo
		
		document.getElementById('hDataIns').value=dataOrd;
		
		//info='Utente:\t\t\t '+utente+spazi+'\tData Inserimento:\t\t\t '+dataOrd;
		info='Inserimento: '+utente+spazi+dataOrd
		

	}else{
		
		//info='Utente: '+utente+spazi+'\tData Inserimento: '+dataInserita+spazi+'\tUtente modifica: '+utenteMod +spazi+'\tData ultima modifica: '+dataMod;
		info='Inserimento: \t'+utente+spazi+dataInserita+spazi+spazi+spazi+'\t\t\tUltima modifica: \t'+utenteMod +spazi+dataMod;
	
	}
	
	document.getElementById('lblInfoIns').innerText=info;

}


function registraScheda(){

	var radio=document.getElementsByName('radioValutazione');
	document.getElementById('hRadio').value='';
	maiuscolo('txtObiettivo,txtNote');
	
	for (var i=0;i<radio.length;i++){

		if(radio[i].checked && radio[i].value =='N'){
			if (document.getElementById('hRadio').value!='N'){
				document.getElementById('hRadio').value='N';
			}else{
				document.getElementById('hRadio').value='';
				radio[i].checked=false;
			}
		}else if(radio[i].checked  &&  radio[i].value =='S'){
			
			if (document.getElementById('hRadio').value!='S'){
				document.getElementById('hRadio').value='S';
			}else{
				document.getElementById('hRadio').value='';
				radio[i].checked=false;
			}
		}
	}
	// alert(document.getElementById('hRadio').value);
	registra();
}

function resetRadio(){

	var radio=document.getElementsByName('radioValutazione');
	
	for (var i=0;i<radio.length;i++){
		
		if (radio[i].checked){
			if (document.getElementById('hRadio').value!=radio[i].value || document.getElementById('hRadio').value==''){
					document.getElementById('hRadio').value=radio[i].value;
			}else{
					document.getElementById('hRadio').value='';
					radio[i].checked=false;
			}
		}
	}
}

function chiudi(tipo){
	
	if(typeof tipo == 'undefined'){
		if (document.EXTERN.STATO.value != 'VIS'){
			if (confirm('Attenzione! Le modifiche effettuate non verranno salvate.\nUscire dalla scheda?')){
				try{
					parent.$.fancybox.close();
				}catch(e){
					parent.parent.$.fancybox.close();
				}
			}
		}else{
			try{
				parent.$.fancybox.close();
			}catch(e){
				parent.parent.$.fancybox.close();
			}
		}
	}else{
		switch(tipo){
			case 'ok_registra':
			default:
				try{
					parent.$.fancybox.close();
				}catch(e){
					parent.parent.$.fancybox.close();
				}
		}
	}
}

function aggiornaOpener() {
	$('iframe#frameWkObiettivi',parent.document)[0].contentWindow.location.reload();
	parent.$.fancybox.close(); 
}

function controllaDataObiettivo(){

	//alert('entro nella funzione controlladataObiettivo');
	var dataObiettivo= document.all['txtDataObiettivo'].value;
	
	//alert('dataObiettivo: '+dataObiettivo);
	if (dataObiettivo!=''){
	
		if (dataObiettivo.length<10){
				
			alert('Inserire la data in un formato corretto (dd/MM/yyyy)');
				
			document.all['txtDataObiettivo'].value='';
			document.all['txtDataObiettivo'].focus();
		}	
		
		if(controllo_data(dataObiettivo).previous){
			
			alert('Attenzione! La data programmata è precedente alla data odierna');
			
			document.all['txtDataObiettivo'].value='';
			document.all['txtDataObiettivo'].focus();
		}
	}
}

var SCHEDA_OBIETTIVO = {
		
	chiudiScheda:function(){
		
		try{
			parent.BISOGNI.caricaWkObiettivi(document.EXTERN.FUNZIONE.value);
		}catch(e){
			parent.location.replace(parent.location);
		}
		//alert(123);
		chiudi('ok_registra');
	}
}

