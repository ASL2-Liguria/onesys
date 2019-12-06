function calcolaDurata(tipo){
	
	var controllo=false;
	var oraIni=0;
	var oraFine=0;
	var minutiIni=0;
	var minutiFine=0;
	var destinazione='';
	var oraDiff=0;
	var minutiDiff=0;
	
	if (tipo=='1'){
		oraIni=parseInt(document.all['txtOraIngresso'].value.substring(0,2),10);		
		oraFine=parseInt(document.all['txtOraUscita'].value.substring(0,2),10);		
		minutiIni=parseInt(document.all['txtOraIngresso'].value.substring(3,5),10);		
		minutiFine=parseInt(document.all['txtOraUscita'].value.substring(3,5),10);		
		controllo=		IsNumber(document.all['txtOraIngresso'].value.substring(0,2)) &&
						IsNumber(document.all['txtOraIngresso'].value.substring(3,5)) &&
						IsNumber(document.all['txtOraUscita'].value.substring(0,2)) &&
						IsNumber(document.all['txtOraUscita'].value.substring(3,5));
		destinazione='txtDurata';
	}
	if (tipo=='2'){
		oraIni=parseInt(document.all['txtOraInizioAnest'].value.substring(0,2),10);
		oraFine=parseInt(document.all['txtOraFineAnest'].value.substring(0,2),10);
		minutiIni=parseInt(document.all['txtOraInizioAnest'].value.substring(3,5),10);
		minutiFine=parseInt(document.all['txtOraFineAnest'].value.substring(3,5),10);		
		controllo=		IsNumber(document.all['txtOraInizioAnest'].value.substring(0,2)) &&
						IsNumber(document.all['txtOraInizioAnest'].value.substring(3,5)) &&
						IsNumber(document.all['txtOraFineAnest'].value.substring(0,2)) &&
						IsNumber(document.all['txtOraFineAnest'].value.substring(3,5));
		destinazione='txtDurataAnest';		
	}
	if (tipo=='3'){
		oraIni=parseInt(document.all['txtOraInizioIntervento'].value.substring(0,2),10);
		oraFine=parseInt(document.all['txtOraFineIntervento'].value.substring(0,2),10);
		minutiIni=parseInt(document.all['txtOraInizioIntervento'].value.substring(3,5),10);
		minutiFine=parseInt(document.all['txtOraFineIntervento'].value.substring(3,5),10);		
		controllo=		IsNumber(document.all['txtOraInizioIntervento'].value.substring(0,2)) &&
						IsNumber(document.all['txtOraInizioIntervento'].value.substring(3,5)) &&
						IsNumber(document.all['txtOraFineIntervento'].value.substring(0,2)) &&
						IsNumber(document.all['txtOraFineIntervento'].value.substring(3,5));
		destinazione='txtDurataOperaz';		
	}
	if (controllo){
		
		if (oraIni==oraFine && minutiIni>minutiFine)
		{
			minutiDiff= 60 - (minutiIni - minutiFine);
			oraDiff =23;
		}
		else if (oraIni>oraFine){
			if (minutiIni>minutiFine){
				minutiDiff= 60 - minutiIni + minutiFine;
				oraDiff=24-oraIni + oraFine -1;
			}else{
				minutiDiff=minutiFine-minutiIni;
				oraDiff=24-oraIni + oraFine;
			}
		}else{
			if (minutiIni>minutiFine){
				minutiDiff= 60 - minutiIni + minutiFine
				oraDiff=oraFine-oraIni-1;
			}	else{
				minutiDiff=minutiFine-minutiIni;
				oraDiff= oraFine-oraIni;
			}
		}
		StrOra=('0' + oraDiff).substring(('0' + oraDiff).length-2,('0' + oraDiff).length);
		StrMinuti=('0' + minutiDiff).substring(('0' + minutiDiff).length-2,('0' + minutiDiff).length);
		document.all[destinazione].value=StrOra + ':' + StrMinuti;
	}
}

function IsNumber(sText)

{
   var ValidChars = "0123456789.";
   var IsNumber=true;
   var Char;

 	if (sText=='')
		IsNumber=false;
 
   for (i = 0; i < sText.length && IsNumber == true; i++) 
      { 
      Char = sText.charAt(i); 
      if (ValidChars.indexOf(Char) == -1) 
         {
         IsNumber = false;
         }
      }
   return IsNumber;
   
   }
   
function beforeSave() {       

//funzione per comtrollare l'inserimento di tutti i dati necessari al salvataggio corretto della scheda intervento
/*	  
	if (document.all.inValChir.value == ""){
		
		alert ('Campo non compilato: inserire OPERATORE prima di continuare');
		return;
		}

	if (document.all.inValAne.value == ""){
		alert ('Campo non compilato: inserire ANESTESISTA prima di continuare');
		return;
		}
		
	if (document.all.inValInf.value == ""){
		alert ('Campo non compilato: inserire INFERMIERE prima di continuare');
		return;
		}
		
	if (document.all.inValAss.value == ""){
		alert ('Campo non compilato: inserire ASSISTENTE prima di continuare');
		return;
		}
	if (document.all.txtPresidi.value == ""){
		alert ('Campo non compilato: inserire PRESIDI UTILIZZATI prima di continuare');
		return;
		}
		
	if (document.all.txtTerapie.value == ""){
		alert ('Campo non compilato: inserire TERAPIE PRATICATE prima di continuare');
		return;
		}
		
	if (document.all.DateInizioIntervento.value == ""){
		alert ('Campo non compilato: inserire DATA INIZIO INTERVENTO prima di continuare');
		return;
		}
		
	if (document.all.txtCodiceICD.value == ""){
		alert ('Campo non compilato: inserire CODICE INTERVENTO prima di continuare');
		return;
		}
		
	if (document.all.txtOraIngresso.value == ""){
		alert ('Campo non compilato: inserire ORA INGRESSO SALA prima di continuare');
		return;
		}
		
	if (document.all.txtOraUscita.value == ""){
		alert ('Campo non compilato: inserire ORA USCITA SALA prima di continuare');
		return;
		}
		
	if (document.all.txtDurata.value == ""){
		alert ('Campo non compilato: inserire DURATA COMPLESSIVA prima di continuare');
		return;
		}
	
	if (document.all.txtOraInizioAnest.value == ""){
		alert ('Campo non compilato: inserire ORA INIZIO ANESTESIA prima di continuare');
		return;
		}
		
	if (document.all.txtOraFineAnest.value == ""){
		alert ('Campo non compilato: inserire ORA FINE ANESTESIA prima di continuare');
		return;
		}
		
	if (document.all.txtDurataAnest.value == ""){
		alert('Campo non compilato: inserire DURATA ATTO ANESTESIOLOGICO prima di continuare');
		return;
		}
		
	if (document.all.txtOraInizioIntervento.value == ""){
		alert ('Campo non compilato: inserire ORA INIZIO INTERVENTO prima di continuare');
		return;
		}
		
	if (document.all.txtOraFineIntervento.value == ""){
		alert ('Campo non compilato: inserire ORA FINE INTERVENTO prima di continuare');
		return;
		}
		
	if (document.all.txtDurataOperaz.value == ""){
		alert ('Campo non compilato: inserire DURATA ATTO CHIRURGICO prima di continuare');
		return;
		}
*/		
		registra ();
		
	}

	
//funzione che controlla il formato dell'ora inserita da inserire su evento onblur del campo.Nel caso sia minore del dovuto cancella il campo e sposta il focus sul campo stesso.
function controllaFormatoOra(oggetto){

	if (oggetto.value != ''){
		
		if (oggetto.value.toString().length < 4) {
		
			alert (' Formato ora errato \n\n Inserire l\'ora nel formato HH:MM'); 
			oggetto.value = '';
			oggetto.focus();
			
		}
	}
}	
	
	
// JavaScript Document


