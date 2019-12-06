function check_anag_prenotabile() {
	
	try{
		
		var iden_anag = stringa_codici(iden);
		if(iden_anag == 0)
		{
			alert(ritornaJsMsg('selezionare'));
	        return;
	    }
		if (typeof iden_anag != 'undefined' && iden_anag != '' && iden_anag != 0) {
			// aggiunto 20130802
			if (isNaN(iden_anag)){
				// 20140729 è un CF ?!?!?! provare ricavare il vero ID !!!!				
				alert("ATTENZIONE : ID anagrafico non valido. Contattare l'amministratore di sistema. ID: " + iden_anag);
				// 20140729 perchè ritorna true e NON false ?!?!?!?! con true va avanti la prenotazione!!!!
				return true;
			}
			// ****************	
			var rs;
			try{
				rs = top.executeStatement('worklist_main.xml','checkAnagPrenotabile',[iden_anag],2);
			}
			catch(e){
				// va in errore se sono da whale, quindi uso quello locale
				rs = executeStatement('worklist_main.xml','checkAnagPrenotabile',[iden_anag],2);
			}
			if (rs[0] == 'KO') { // errori database 
				// **************************					
				// modifica 18-3-15
				if (rs[1].toString().indexOf("lettura del file")>-1){
					// sono in whale 
					// uso toolkit
					//  da rivedere !!!
					/*
					var v_sql = "select tel,cell, a.* from anag a where iden = " +iden_anag;
					try{
						toolKitDB.getResultData(v_sql,function(rs){
							if (rs[0] == "" && rs[1] == ""){
								if (confirm("Il numero di telefono non e' specificato per il paziente. Apro la scheda anagrafica per compilarlo?")){
									modificaAnagLink(iden_anag);
								}
							}
						});
					}
					catch(e){alert("Errore: " + e.description);}*/
					return true;
				}
				// **************************
				alert('checkAnagPrenotabile' + rs[1]);
				alert("ATTENZIONE : ID anagrafico non valido. ID: " + iden_anag);				
				return false;
			}
			if (rs[2] == 'KO') { // errori di flusso/logica 
				if (confirm(rs[3])) {
					//apro scheda anag
					try{
						modificaAnagLink('');
					}catch(e){alert('Error: '+e.description)}
					//var w = modificaAnagLinkOrario(null, iden_anag);
				}
			}
		}
	} catch (e) {
		//alert("Errore: checkAnagPrenotabile");
	}
	return true;
}

function accetta_paziente()
{
	var iden_anag = stringa_codici(iden);

	//alert(iden + " " + iden_anag);
	if(iden_anag == 0)
	{
		alert(ritornaJsMsg('selezionare'));
        return;
    }
	// ******* 20130513
	if (!check_anag_prenotabile()) { // verifico esistenza numero di telefono eccetera
		return;
	}
	// ****************
	
	/*document.form_accetta_paziente.Hiden_anag.value = iden_anag;
	document.form_accetta_paziente.Hiden_esa.value = parent.RicPazRicercaFrame.document.form_pag_ric.Hiden_esa.value;
	document.form_accetta_paziente.Hiden_posto.value = parent.RicPazRicercaFrame.document.form_pag_ric.Hiden_posto.value;
	
    document.form_accetta_paziente.tipo_registrazione.value = 'P';
	document.form_accetta_paziente.method = 'get';
	document.form_accetta_paziente.action = 'prenotazioneRegistrazione';
    document.form_accetta_paziente.submit();*/
	
	if(parent.parent.frameDirezione)
	{
		parent.parent.document.all.frameMainPrenotazione.rows = "0,*";
	}

	
	var tipo_ricerca = document.form.ricerca_anagrafica.value;
	
	//alert('parametro iden_anag:' + iden_anag);
	//alert('baseGlobal.RICERCA_ANAGRAFICA: ' + parent.RicPazRicercaFrame.baseGlobal.RICERCA_ANAGRAFICA);
	//alert('tipo ricerca attuale ' + tipo_ricerca);
	
	if(tipo_ricerca == '2'){
		dwr.engine.setAsync(false);
		CJsGestioneAnagrafica.gestione_anagrafica(iden_anag, check_dwr);
		dwr.engine.setAsync(true);
	}
	else{
		// ************************************
		// ******** controllo readonly	
		try{
			/* modifica aldo 07-01-15 */
			if (!isPatientReadOnlyCheck(anagIden)){return;}
		}
		catch(e){;}
		// *********************************			
		parent.document.location.replace('prenotazioneRegistrazione?Hiden_anag=' + iden_anag);
	}
}

function check_dwr(ret)
{
	//alert('anag.iden:' + ret);
	if(ret.indexOf('Exception') > 0 || ret == '0'){
		alert('Errore durante l\'elaborazione del paziente con la gestione remota: ' + ret);
	}
	else{
		// ************************************
		// ******** controllo readonly	
		try{
			/* modifica aldo 07-01-15 */
			if (!isPatientReadOnlyCheck(anagIden)){return;}
		}
		catch(e){;}
		// *********************************			
		parent.document.location.replace('prenotazioneRegistrazione?Hiden_anag=' + ret);
	}
}
//aggiunto per evitare l'errore quando viene richiamato da dentro whale
function executeStatement(pFileName , pStatementName , pBinds , pOutsNumber){
	var vResponse;
	
	var vBinds=$.extend(true,[],retArrayForStatement(pBinds));
	var oggettoDWR ;
	oggettoDWR = dwr.engine;
	oggettoDWR.setAsync(false);
	dwrUtility.executeStatement(pFileName,pStatementName,vBinds,(typeof pOutsNumber=='undefined'?0:pOutsNumber),callBack);
	oggettoDWR.setAsync(true);
	return vResponse;

	function callBack(resp){
		vResponse = resp;
	}
}

function executeBatchStatement(pFileName , pStatementName , pBinds , pOutsNumber){
	var vResponse;
	var vBinds=$.extend(true,[[]],retArrayForStatement(pBinds));
	
	var oggettoDWR ;
	oggettoDWR = dwr.engine;
	oggettoDWR.setAsync(false);
	dwrUtility.executeBatchStatement(pFileName,pStatementName,vBinds,(typeof pOutsNumber=='undefined'?0:pOutsNumber),callBack);
	oggettoDWR.setAsync(true);
	return vResponse;
	
	function callBack(resp){
		vResponse = resp;
	}
}

function executeQuery(pFileName , pStatementName , pBinds){

	var vResponse;
	var vBinds=$.extend(true,[],retArrayForStatement(pBinds));
	var oggettoDWR ;
	try{
		oggettoDWR = dwr.engine;
		oggettoDWR.setAsync(false);
		dwrUtility.executeQuery(pFileName,pStatementName,vBinds,callBack);
	}
	catch(e){
		alert(e.description);
	}
	finally{
		try{oggettoDWR.setAsync(true);}catch(e){;}
	}
		
	
	
	return vRs;

	function callBack(resp){
		var valid=true;
		var error='';
		var ArColumns,ArData;
		
		if(resp[0][0]=='KO'){
			isValid = false;
			error = resp[0][1];
			ArColumns =  ArData =  new Array();
		}else{
			ArColumns = resp[1];
			ArData = resp.splice(2,resp.length-1);
		}
		vRs = {
			isValid:valid,
			getError:function(){return error;},
			columns:ArColumns,
			data:ArData,
			size:ArData.length,
			current:null,
			next:function(){
				if(this.current==null && this.size>0){
					this.current = 0;
					return true;
				}else{
					return ++this.current < this.size;
				}
			},
			getString:function(pColumnName){
				return this.data[this.current][this.getColumnIndex(pColumnName)];
			},
			getInt:function(pColumnName){
				return parseInt(this.getString(pColumnName),10);
			},
			getColumnIndex:function(pColumnName){
				pColumnName = pColumnName.toUpperCase();
				for (var i = 0; i< this.columns.length;i++){
					if(this.columns[i] == pColumnName){
						return i;
					}
				}
			}
		}
	}
}

function retArrayForStatement(pBinds){
	var retArray = new Array();
	switch (typeof pBinds){
	case 'object': 
		retArray = pBinds;
		break;
	case 'undefined':
		break;
	default:     
		retArray.push(pBinds); 
	break;
	}
	return retArray;    
}