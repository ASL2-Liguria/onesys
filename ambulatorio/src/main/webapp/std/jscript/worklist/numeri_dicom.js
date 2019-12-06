function numeri_dicom(){
	var iden_anag = '';
	var iden_esame = '';
	
	iden_anag = stringa_codici(array_iden_anag);
	if (conta_esami_sel()== 0){
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	if (conta_esami_sel() > 1){
		alert(ritornaJsMsg("jsmsgSoloUnEsame"));
		return;
	}
	
	
	iden_esame = stringa_codici(array_iden_esame);

    var finestra = finestra = window.open("SL_Message?operazione=num_dicom&iden_esame="+iden_esame+"&iden_anag="+iden_anag+"","","top=0,left=100000");
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open("SL_Message?operazione=num_dicom&iden_esame="+iden_esame+"&iden_anag="+iden_anag+"","","top=0,left=100000");
	}
}