var NuovoCodicePato='';

function InserisciPatologia(){
	var categoria = stringa_codici(array_categoria);
	
	if (categoria=='') {
		categoria=parent.$("#hCategoria").val();
		categoria=categoria.replace(/'/g,"");
	}
	getMaxCodDec(categoria);
	
	var url="servletGenerator?KEY_LEGAME=SCHEDA_PATOLOGIA_REPARTO&KEY_ID=0&CATEGORIA="+categoria+"&COD_DEC="+ NuovoCodicePato +"&status=yes fullscreen=yes";
	parent.$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 580,
		'href'		: url,
		'type'		: 'iframe'
	});
}

function ModificaPatologia(){
	var iden = stringa_codici(array_iden);
	var categoria = stringa_codici(array_categoria);
	if (iden=='') {
		alert("selezionare una patologia!");
		return;
		}
		
	var codice = stringa_codici(array_cod_dec);
	var descr = stringa_codici(array_descrizione);
	var url="servletGenerator?KEY_LEGAME=SCHEDA_PATOLOGIA_REPARTO&KEY_ID=" + iden + "&CATEGORIA="+categoria+"&COD_DEC=" + codice +"&DESCR=" + descr +" &status=yes fullscreen=yes";
	parent.$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 580,
		'href'		: url,
		'type'		: 'iframe'
	});
}

function CancellaPatologia(){
	var iden = stringa_codici(array_iden);
	if (iden=='') {
		alert("selezionare una patologia!");
		return;
		}
	sql="2@UPDATE CC_ICD SET ATTIVO='N' WHERE IDEN=" + iden;
	dwr.engine.setAsync(false);
	CJsUpdate.insert_update(sql, cbk_attivo);
	dwr.engine.setAsync(true);
}

function cbk_attivo(message){
	if(message != ''){
		alert('cbk_attivo: ' + message);
		return;
		}	
	applica_filtro();
}

function getMaxCodDec(cat){
	var sql="SELECT MAX(TO_NUMBER(COD_DEC)) MAX_CODE FROM CC_ICD WHERE CATEGORIA='" + cat + "'";
	sql += "@MAX_CODE@2"; // nome del campo ritornato dalla select e tipo del campo 2 = integer
	dwr.engine.setAsync(false);
	CJsUpdate.select(sql, leggiMaxCode);
	dwr.engine.setAsync(true);
}

function leggiMaxCode(queryResult){
	var sNum;
	var pos1 = queryResult.indexOf("$");
	var pos2 = queryResult.indexOf("*");
	if (pos1>=0 && pos2>=0 && pos2>pos1){
		sNum=queryResult.substring(pos1+1,pos2);
		var n = Number(sNum);
		n +=1;
	}
	else {
		n=1;
	}
	sNum="000"+n.toString();
	var iLen = String(sNum).length;
	sNum= sNum.substring(iLen-3, iLen );
	NuovoCodicePato=sNum;
}
