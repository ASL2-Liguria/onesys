function visualizza_operatori(){
	if (conta_esami_sel()== 0){
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	if (conta_esami_sel() > 1){
		alert(ritornaJsMsg("jsmsgSoloUnEsame"));
		return;
	}
	
	
	var iden_esame = stringa_codici(array_iden_esame);
	
	//alert(iden_esame);

    var finestra = finestra = window.open("SL_GestOperatori?esame="+iden_esame+"", "", "status=yes,scrollbars=no,height=600,width=800, top=10, left=10")
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open("SL_GestOperatori?esame="+iden_esame+"","","status=yes,scrollbars=no,height=600,width=800, top=10, left=10")
	}
	
}
