var WK_DOC_ALLEGATI = {
	
	apriDocumento : function (){
		var iden=stringa_codici(array_iden);
		var url ='SrvVisualizzaDoc?iden='+iden;
		window.open(url,"","resizable=yes, height=" + screen.availHeight + ", width=" + screen.availWidth +",top=0,left=0,status=yes");		
	},
	
	cancellaDocumento: function(){

		var pBinds = new Array();
		var iden=stringa_codici(array_iden);

		pBinds.push(iden);

		top.dwr.engine.setAsync(false);
		top.dwrUtility.executeStatement('visualizzatore.xml','cancellaDocumentoAllegato',pBinds,0,callBack);
		top.dwr.engine.setAsync(true);

		function callBack(resp){
			if(resp[0]=='KO'){
				alert(resp[1]);
			}
			else
			{
				document.location.reload();
			}

		}
	}


};