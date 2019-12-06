function visualizza_ticket1(){
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

    var finestra = finestra = window.open("SL_VisTicket?str_esami="+iden_esame+"","","top=1000000,left=1000000");
	if (finestra){
		finestra.focus();
	}
	else{
		finestra = window.open("SL_VisTicket?str_esami="+iden_esame+"","","top=1000000,left=1000000");
	}
}

function visualizza_ticket()
{
if (conta_esami_sel()== 0){
		alert(ritornaJsMsg("jsmsg1"));
		return;
	}
	if (conta_esami_sel() > 1){
		alert(ritornaJsMsg("jsmsgSoloUnEsame"));
		return;
	}
	var num_pre_tic = stringa_codici(array_num_pre);
		var sql  = "{call ? := GET_TICK('" + num_pre_tic+ "')}";
	dwr.engine.setAsync(false);
		toolKitDB.executeFunctionData(sql, call_back_tick);
		dwr.engine.setAsync(true);
}
function call_back_tick(msg)
{
alert(msg);
}


