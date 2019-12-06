var oldIden;
var WindowCartella = null;

jQuery(document).ready(function() {
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;
    
//	oldIden=$('input#IDEN').val();
//	$('input#IDEN').val(''); 
	$('input[name="txtAnno"]').blur(function() {controllaAnno();});
	$('input[name=txtMese]').blur(function() {controllaMese();});
	$('input[name=txtGiorno]').blur(function() {controllaGiorno();});
	if (_STATO_PAGINA == 'L'){
		document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
	}
	
});

function callbackregistrazione(){
    switch(parent.name) {
        case 'ANAMNESI': case '36_SETTIMANA':
            var idenIntervento= '';
            var iden_visita = WindowCartella.getAccesso("IDEN");
            var rs = WindowCartella.executeStatement('anamnesi.xml','getIdenInterventoInserito',[baseUser.IDEN_PER, iden_visita],1);
            if(rs[0]=='KO'){
                return alert(rs[0] + '\n' + rs[1]);
            }else{
            	idenIntervento  = rs[2];
            }
        	
            var iden_anag = WindowCartella.getPaziente("IDEN");
            if (parent["NS_"+parent.name].importaInterventiIdenPaziente === Number(iden_anag)) {
                rs = WindowCartella.executeStatement('anamnesi.xml','duplicaInterventi',[idenIntervento, baseUser.IDEN_PER, iden_visita, iden_anag],0);
                if(rs[0]=='KO'){
                    return alert(rs[0] + '\n' + rs[1]);
                }
                parent["NS_"+parent.name].importaInterventiIdenPaziente = null;
			}
            parent.dataRiferimentoWkInt=clsDate.getData(new Date(), 'YYYYMMDDHH:mm:ss');
            break;
        default:
    }
}

function controllaAnno() {

	var anno = document.all['txtAnno'].value;

	if (anno!=''){
		if (!IsNumeric(anno) || anno.length!= 4){

			alert('Inserire l\'anno in formato corretto (YYYY)');

			document.all['txtAnno'].value='';
			document.all['txtAnno'].focus();
		} 
	}
}

function controllaMese() {

	var mese = document.all['txtMese'].value;

	if (mese!=''){

		if (!IsNumeric(mese) || parseInt(mese) > 12){

			alert('Inserire il mese in formato corretto (<=12)');

			document.all['txtMese'].value='';
			document.all['txtMese'].focus();
		} else {
			if (mese.length == 1) {
				document.all['txtMese'].value = '0' + mese;
			}
		}
	}
}

function controllaGiorno() {

	var giorno = document.all['txtGiorno'].value;

	if (giorno!=''){

		if (!IsNumeric(giorno) || parseInt(giorno) > 31) {

			alert('Inserire il giorno in formato corretto (<=31)');

			document.all['txtGiorno'].value='';
			document.all['txtGiorno'].focus();
		} else {
			if (giorno.length == 1) {
				document.all['txtGiorno'].value = '0' + giorno;
			}
		}

	}
}

function chiudiScheda(){
	parent.$.fancybox.close();
}

function registraScheda(){

	maiuscolo('txtDescrizione') ;

	if(document.all.txtCodiceICD.value=='' && document.all.txtDescrizione.value=='') {
		var anno = document.all.txtAnno.value=='' ? "\n\t- Anno" : "";
		alert("Prego compilare i seguenti campi prima di effettuare" 
				+ "\nla registrazione:" 
				+ anno
				+ "\n\t- Campi ICD o Descrizione Intervento o entrambi");
	}
	else	
		registra();
}

//funzione che controlla l'inserimento corretto della data dell'intervento
function controllaDataIntervento(){

	var data= document.all['txtData'].value;
	//alert('data Intervento: '+data);

	if (data!=''){
		if (data.length<10){

			alert('Inserire la data in un formato corretto (dd/MM/yyyy)');
			document.all['txtData'].value='';
			document.all['txtData'].focus();
		}	
		if(controllo_data(data).next){

			alert('Attenzione! La data programmata per il prelievo è posteriore alla data odierna');
			document.all['txtData'].value='';
			document.all['txtData'].focus();
		}
	}
}

function IsNumeric(sText){
	var ValidChars = "0123456789.";var IsNumber=true;var Char;
	for (var i = 0; i < sText.length && IsNumber == true; i++){ 
		Char = sText.charAt(i); 
		if (ValidChars.indexOf(Char) == -1){IsNumber = false;}
	}
	return IsNumber;
}
