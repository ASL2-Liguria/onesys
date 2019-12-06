
function apriProcedure() {
	
	var iden_visita = parent.document.EXTERN.IDEN_VISITA.value;
	var reparto = parent.document.EXTERN.REPARTO.value;
	var stato = 'I';
	var key_procedura = 'PT_LESDECUBITO';
	var tipo_dato = 'PT_MEDICAZIONE';

	var url = 'servletGenerator?KEY_LEGAME=PT_WRAPPER'
	+ "&IDEN_VISITA=" + iden_visita + "&STATO_PAGINA=" + stato + "&TIPO_DATO=" + tipo_dato
	+ "&KEY_PROCEDURA = " + key_procedura + "&CODICE_REPARTO=" + reparto 
	+ "&RELOAD=idWkProcedure";
	
	parent.name = 'BISOGNI';
	parent.$.fancybox({
		'padding'	: 3,
		'autoScale'	: false,
		'transitionIn'	: 'none',
		'transitionOut'	: 'none',
		'width'		: 1024,
		'height'	: 400,
		'href'		: url,
		'type'		: 'iframe'
	});
	
//	parent.document.getElementById('frameInserimento').src=url;
//	parent.document.getElementById('frameInserimento').style.display='';
}

function cancellaProcedura() {
	var iden_procedura = stringa_codici(array_iden_procedure);
	if (iden_procedura!='') {
		var sql = "{call ? := cc_procedura.eliminaProcedura(" + iden_procedura + ")}";
		top.dwr.engine.setAsync(false);
		parent.toolKitDB.executeFunctionData(sql, call_back);
		top.dwr.engine.setAsync(true);		
		
		function call_back(resp){ 
			if (resp==1) {
				alert('Eliminazione effettuata correttamente.');
				parent.document.frames('idWkProcedure').location.reload(true);
			} else {
				alert('Impossibile eliminare la procedura. Sono stati inseriti dei dettagli relativi nel piano giornaliero.');
			}
		}
	} else {
		alert('selezionare una procedura');
	}
}