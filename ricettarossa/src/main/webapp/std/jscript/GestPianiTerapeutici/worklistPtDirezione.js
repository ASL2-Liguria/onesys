
try{parent.removeVeloNero('oIFWk');}catch(e){alert(e.description);}


jQuery(document).ready(function() {

try{
		parent.removeVeloNero('framePT');
	}catch(e){
		//alert(e.description);	
	}
	
//	$('DIV[class="infoWk"]').css({'float':'left','background':'url(imagexPix/GestioneRichieste/btinfo.gif) no-repeat','width':'25px','height':'25px','cursor':'pointer'});
	

});

var NS_WK_PT_DIREZIONE = {
	stampaPianoSingolo:function(){
		alert(vettore_indici_sel);
	},
	stampaPianoMulti:function(){
		alert(vettore_indici_sel);
	},
	stampaWKPT:function(){

		var funzione  = 'WK_PIANI_TERAPEUTICI_ADMIN';
		var anteprima = 'S';
		var reparto   = baseGlobal.SITO;
		var sf		  = '&prompt<pIdenTestata>='+ar_iden_testata;
		var stampante = null;
		var url 	  = 'elabStampa?stampaFunzioneStampa='+funzione;
		
		url += '&stampaAnteprima='+anteprima;
		
		if(reparto!=null && reparto!='')		
			url += '&stampaReparto='+reparto;
		
		if(sf!=null && sf!='')
			url += '&stampaSelection='+sf;
		
		if(stampante!=null && stampante!='')
			url += '&stampaStampante='+stampante;	

		var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);

	},
	stampaPianiSelezionati:function(){
		var array_validita		= new Array();
		var array_iden_testata	= new Array();
		var array_firmato		= new Array();
		var string_iden_testata = stringa_codici(ar_iden_testata);
		var string_validita    	= stringa_codici(ar_validita);
		var string_firmato		= stringa_codici(ar_firmato);
		
		try{
			array_validita		= string_validita.split('*');
			array_iden_testata	= string_iden_testata.split('*');
			array_firmato		= string_firmato.split('*');
		}catch(e){
			array_validita		= new Array();
			array_iden_testata	= new Array();
			array_firmato		= new Array();
			array_validita.push(string_validita);		
			array_iden_testata.push(string_iden_testata);
			array_firmato.push(string_firmato);
		}
			
		if (array_iden_testata.lenght < 1){
			alert('Attenzione, effettuare una selezione');
			return;
		}		
		//alert(array_validita.length + ' - ' + array_iden_testata);		
		for(var i = 0; i<vettore_indici_sel.length;i++)
		{
			if(array_firmato[i] == "N"){
				alert("Piano non Firmato, selezionare solo piano firmati.");
				return;
			}
			//alert(array_iden_testata[i]+' - ' + array_validita[i]);
			if(array_validita[i] == "SCADUTO"){
				alert("Piano scaduto, impossibile stampare");
				return;
			}			
			if(array_validita[i] == "CHIUSO"){
				alert("Piano chiuso, impossibile stampare");
				return;
			}			
		}

		for(var i = 0; i<array_iden_testata.length;i++)
		{
			//alert('contatore: ' + i);
			if (array_firmato[i]=='S')
			{
				var loc 		= document.location;
				var idenPT		= array_iden_testata[i];
				var pathName 	= loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
				var progr 		= NS_WK_PT_DIREZIONE.retrieveProgressivo(idenPT,'PIANO_TERAPEUTICO');		
				var path		= loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));

				var url = "ApriPDFfromDB?AbsolutePath="+path+"&idenVersione="+idenPT+"&funzione=PIANO_TERAPEUTICO&progr="+progr;
				//alert(url);
				var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
				finestra.focus();
				
				try{
					top.opener.parent.idRicPazRicercaFrame.closeWhale.pushFinestraInArray(finestra);
			   	}catch(e){/*alert(e.description)*/}
			   	
			}
			else 
			{
				if (baseGlobal.SITO=='ASL2' || baseGlobal.SITO=='ASL1')
				{
					var funzione  = 'PIANO_TERAPEUTICO';
					var anteprima = 'S';
					var reparto   = baseGlobal.SITO;
					var sf		  = '&prompt<pIdenTestata>='+array_iden_testata[i];
					var stampante = null;
					var url 	  = 'elabStampa?stampaFunzioneStampa='+funzione;
		
					url += '&stampaAnteprima='+anteprima;
					if(reparto!=null && reparto!='')		
						url += '&stampaReparto='+reparto;
					if(sf!=null && sf!='')
						url += '&stampaSelection='+sf;
					if(stampante!=null && stampante!='')
						url += '&stampaStampante='+stampante;
					//alert(url);					
					var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
					finestra.focus();

					try{
						top.opener.parent.idRicPazRicercaFrame.closeWhale.pushFinestraInArray(finestra);
				   	}catch(e){}
				   	
				}
			}
		}

	},
	retrieveProgressivo:function(iden_testata_pt,funzione){
		
		var progressivo = '';
	 
		dwr.engine.setAsync(false); 
		toolKitDB.getResultData('select max(progr) from CC_FIRMA_PDF where iden_tab = ' + iden_testata_pt + ' and funzione = \''+funzione+'\'', resp_check);		 
		dwr.engine.setAsync(true);
		 
		 return progressivo;
		 
		 function resp_check(resp){
			 progressivo = resp;			 
		 }	
		 
	}
	
		
};




