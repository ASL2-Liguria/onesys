var vIdenSchedaDaImportare = null;

window.onload = function() {
    try {
        document.getElementById("frameSorgente").setAttribute("height", "100%");
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }
};

function annulla() {

    self.close();
}

//function registra(){
//        
//	if(vIdenSchedaDaImportare==null){
//		alert('Selezionare una scheda');
//		return;
//	}
//	
//	getCampiChecked();
//	
//	dwr.engine.setAsync(false);
//	
//	/*dwrUtility.impSchedaXml(
//		document.EXTERN.FUNZIONE.value,
//		parseInt(document.EXTERN.IDEN_VISITA.value,10),
//		parseInt(document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,10),		
//		vIdenSchedaDaImportare,
//		document.EXTERN.REPARTO.value,
//		getCampiChecked()
//		,callBack
//	);*/
//    
//	dwrUtility.executeStatement(
//		"cartellaPaziente.xml",
//		"impSchedaXml",
//		[
//			document.EXTERN.FUNZIONE.value,
//			document.EXTERN.IDEN_VISITA.value,
//			document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,
//			vIdenSchedaDaImportare + "",
//			document.EXTERN.IDEN_PER.value,
//			document.EXTERN.REPARTO.value,
//			getCampiHiddenValue()
//		],
//		0,
//		callBack
//	);
//	dwr.engine.setAsync(true);
//	
//	function callBack(resp){
//		if(resp[0]=='KO'){
//			alert(resp[1]);
//		}else{
//			self.close();
//		}
//	}
//}

function registra(idenSchedaDaImportare) {
    try {  
        if (idenSchedaDaImportare == null) {
            alert('Selezionare una scheda');
            return;
        }
        
        getCampiChecked();
        dwr.engine.setAsync(false);
        dwrUtility.executeStatement(
                "cartellaPaziente.xml",
                "impSchedaXml",
                [
                    document.EXTERN.FUNZIONE.value,
                    document.EXTERN.IDEN_VISITA.value,
                    document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,
                    idenSchedaDaImportare + "",
                    document.EXTERN.IDEN_PER.value,
                    document.EXTERN.REPARTO.value,
                    getCampiHiddenValue()
                ],
                0,
                callBack
                );
        dwr.engine.setAsync(true);

        function callBack(resp) {
            if (resp[0] == 'KO') {
                alert(resp[1]);
            } else {
                // modal dialog                
//                self.close();

                // fancybox
                parent.$.fancybox.close();
                parent.top.refreshPage();
            }
        }
  
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }    
}

function abilitaGruppo(obj) {

    var divGruppo = obj.parentNode.parentNode;

    var lstCheck = divGruppo.getElementsByTagName('input');
    for (var i = 0; i < lstCheck.length; i++)
        lstCheck[i].checked = obj.checked;

}

function getCampiChecked() {

    //var arKeyCampo = new Array();	
    var StrKeys = "";

    var lstCheck = document.getElementsByTagName('input');
    for (var i = 0; i < lstCheck.length; i++) {
        if (lstCheck[i].checked && lstCheck[i].parentNode.className == 'campo') {
            //arKeyCampo.push(lstCheck[i].id);
            StrKeys += lstCheck[i].id + ","
        }
    }
    //return arKeyCampo;
    return StrKeys.substring(0, StrKeys.length - 1);
}

function visualizzaScheda(url) {
    window.open(url, '', 'fullscreen=yes scrollbars=yes');
}

function getCampiHiddenValue() {
    var hiddenKeysValue = "";
    hiddenKeysValue = "OPERAZIONE|IMPORT_RICOVERO_PRECEDENTE";
    // modal dialog
//    hiddenKeysValue += ",PC_ID|" + window.dialogArguments.WindowCartella.basePC.NOME_HOST;
//    hiddenKeysValue += ",USER_ID|" + window.dialogArguments.WindowCartella.baseUser.IDEN_PER;
//    hiddenKeysValue += ",USER_LOGIN|" + window.dialogArguments.WindowCartella.baseUser.LOGIN;
    
    // fancybox
    hiddenKeysValue += ",PC_ID|" + parent.WindowCartella.basePC.NOME_HOST;
    hiddenKeysValue += ",USER_ID|" + parent.WindowCartella.baseUser.IDEN_PER;
    hiddenKeysValue += ",USER_LOGIN|" + parent.WindowCartella.baseUser.LOGIN;

    return hiddenKeysValue;
}

function setRiga(obj) {
    while (obj.nodeName != 'TR') {
        obj = obj.parentNode;
    }
    return obj.sectionRowIndex;
}
