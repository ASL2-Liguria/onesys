function registra(){
	var doc = document.form;
	var query = '';
	var query_finale = '';
	var array_esami = null;
	var elenco_esami = null;
	
	/*alert(doc.provenienza.value);
	alert(doc.iden_esame.value);
	alert(doc.iden_anag.value);
	alert(doc.iden_per.value);*/
	
	if(doc.esito[0].checked)
		doc.hesito.value = doc.esito[0].value;
	else
		if(doc.esito[1].checked)
			doc.hesito.value = doc.esito[1].value;
		else
			if(doc.esito[2].checked)
				doc.hesito.value = doc.esito[2].value;
				
	if(doc.caso_interessante.checked)
		doc.hcaso_interessante.value = 'S';
	else	
		doc.hcaso_interessante.value = 'N';		
		
	if(doc.hesito.value == ''){
		alert(ritornaJsMsg('a_inserimento'));
		return;
	}	

	if(doc.tipo_operazione.value == 'INS'){
		elenco_esami = doc.iden_esame.value;
		if(elenco_esami.indexOf('*') != -1){
			array_esami = elenco_esami.split('*');
			for(i = 0; i < array_esami.length; i++){
				query += 'insert into MN_APPROPRIATEZZA (iden_esame, esito, caso_interessante, ute_ins) ';
				query += "values (" + array_esami[i] + ", '" + doc.hesito.value + "', '";
				query += doc.hcaso_interessante.value + "', ";
				query += baseUser.IDEN_PER + ")@";
			}
		}
		else{
			query = 'insert into MN_APPROPRIATEZZA (iden_esame, esito, caso_interessante, ute_ins) ';
			query += "values (" + elenco_esami + ", '" + doc.hesito.value + "', '";
			query += doc.hcaso_interessante.value + "', ";
			query += baseUser.IDEN_PER + ")@";
		}
		query_finale = '1@'+query.substring(0, query.length-1);
	}
	else{
		elenco_esami = doc.iden_esame.value;
		if(elenco_esami.indexOf('*') != -1){
			elenco_esami = doc.iden_esame.value.replace(/\*/g, ",");
		}

		query = "update MN_APPROPRIATEZZA set esito = '" + doc.hesito.value + "', ";
		query += "caso_interessante = '" + doc.hcaso_interessante.value + "', ute_mod = " + baseUser.IDEN_PER;
		query += " where iden_esame in (" + elenco_esami + ")@";
		
		query_finale = '2@'+query.substring(0, query.length-1);
		
	}
	dwr.engine.setAsync(false);
	CJsUpdate.ripeti_operazione(query_finale, cbk_registra);
	dwr.engine.setAsync(true);
}


function cbk_registra(message){
	if(message != ''){
		alert('ERRORE DWR: ' + message);	
		return;
	}
	chiudi();
}





function after_update(){
	chiudi();
}


function chiudi(){
	self.close();
}