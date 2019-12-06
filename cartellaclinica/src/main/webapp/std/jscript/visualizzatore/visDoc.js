
$(document).ready(function()
{
	
	window.WindowRiferimento = window;	
	try {
		while((window.WindowRiferimento.name != 'Home' || window.WindowRiferimento.name != 'schedaRicovero') && window.WindowRiferimento.parent != window.WindowRiferimento){
			var name = window.WindowRiferimento.parent.name; // SecurityError Test
			window.WindowRiferimento = window.WindowRiferimento.parent;
		}
	} catch(e) {}

	
	switch(WindowRiferimento.name){
		case 'Home':
		    window.baseReparti 	= WindowRiferimento.baseReparti;
		    window.baseGlobal 	= WindowRiferimento.baseGlobal;
		    window.basePC 		= WindowRiferimento.basePC;
		    window.baseUser 	= WindowRiferimento.baseUser;
		    break;
		case 'schedaRicovero':
		    window.baseReparti 	= WindowRiferimento.baseReparti;
		    window.baseGlobal 	= WindowRiferimento.baseGlobal;
		    window.basePC 		= WindowRiferimento.basePC;
		    window.baseUser 	= WindowRiferimento.baseUser;
		    break;
		default:
		try{
		    window.baseReparti 	= opener.top.baseReparti;
	    	window.baseGlobal 	= opener.top.baseGlobal;
	    	window.basePC 		= opener.top.basePC;
	    	window.baseUser 	= opener.top.baseUser;
			}catch(e){
		    window.baseReparti 	= WindowRiferimento.baseReparti;
	    	window.baseGlobal 	= WindowRiferimento.baseGlobal;
	    	window.basePC 		= WindowRiferimento.basePC;
	    	window.baseUser 	= WindowRiferimento.baseUser;				
			}			
	}
	
	
	VISDOC.init();
	
});

var idDocOpen='';

var VISDOC = {
	init:function()
	{	
		codCdcReparto='';
		nameParam='VISDOC';

		if (typeof (document.EXTERN.PROV) !='undefined' && document.EXTERN.PROV.value =='MMG'){
			$('body').addClass('bodyMMG');
		}
				
		if (typeof (document.EXTERN.identificativoEsterno) !='undefined' || typeof (document.EXTERN.idDocumento) !='undefined'){
			$('#groupFiltri').hide();
		}
		
		if (typeof (document.EXTERN.reparto) !='undefined'){
			codCdcReparto=VISDOC.setCdcReparto(document.EXTERN.reparto.value);
		}
		
		if(typeof(document.EXTERN.TIPO)!='undefined' && document.EXTERN.TIPO.value=='EXT'){
			nameParam='VISDOC_EXT';
		}
		eval('confBase =' + window.baseReparti.getValue(codCdcReparto,nameParam+'_CONF_BASE'));
		eval('confFiltri =' + window.baseReparti.getValue(codCdcReparto,nameParam+'_FILTRI'));
		
		
		$('#lblChiudiDoc').parent().width('140').parent().hide();
		
		//il pulsante chiudi serve solo quando il visdoc viene aperto dalla wk richieste...
		if ((typeof (document.EXTERN.identificativoEsterno) =='undefined' || (typeof (document.EXTERN.identificativoEsterno) !='undefined' && top.name == 'schedaRicovero')) && (typeof (document.EXTERN.btnChiudi) =='undefined' || document.EXTERN.btnChiudi.value=='N') ){
	    	$('#lblChiudi').parent().parent().hide();
		}
		
		$('#frameFiltri').attr('src','servletGenerator?KEY_LEGAME=VISDOC_FILTRI&REPARTO='+codCdcReparto);
		$('#frameDoc').hide();
	},
	
	chiudiDoc:function(){

		if (confBase.TRACE=='S'){
			dwr.engine.setAsync(false);
			dwrTraceUserAction.callTraceUserAction('','CHIUDI','','VISUALIZZATORE');
			dwr.engine.setAsync(true);
		}

		//se è aperto per richiesta e c'è solo un documento al chiudi chiudo tutto
		if ((typeof (document.EXTERN.identificativoEsterno) !='undefined' || typeof (document.EXTERN.idDocumento) !='undefined') && $("#frameWkDoc").contents().find('#oTable tr').length==1){
			self.close();
		}
		
		$('#frameDoc').attr('src','blank').hide();
		$('#frameWkDoc').show();
		$('#lblChiudiDoc').parent().parent().hide();
		//se il visualiz viene aperto con l'iden richiesta i filtri non vengono fatti vedere
		if (typeof (document.EXTERN.identificativoEsterno) =='undefined' || typeof (document.EXTERN.idDocumento) !='undefined'){
			$('#frameFiltri').show();
		}

	},

	setCdcReparto : function (repartoIn){
		top.dwr.engine.setAsync(false);
		top.dwrUtility.executeQuery("visualizzatore.xml","getCodCdc",[repartoIn],callBackCdc);
		top.dwr.engine.setAsync(true);
		return rep;
	  function	callBackCdc(resp){
		  if(resp[0]=='KO'){
			}
		  else
			  {
			  rep=resp[2].toString();
			  }
		}
	}
		
};