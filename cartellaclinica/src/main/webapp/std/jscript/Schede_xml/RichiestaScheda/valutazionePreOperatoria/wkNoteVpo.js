
jQuery(document).ready(function(){

    NS_WK_NOTE_VPO.init();
    NS_WK_NOTE_VPO.setEvents();
	if (_STATO_PAGINA == 'L'){
        document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
    }

});

var NS_WK_NOTE_VPO = {

		init: function(){	
			null;
		},
		
	    setEvents: function(){

	    //se siamo nella wk esterna alla cartella
	    if (document.EXTERN.KEY_LEGAME.value=='WORKLIST'){	
	        righe = document.all.oTable.rows;
	        for(var i=0;i<righe.length;i++){
	            righe[i].ondblclick=function(){
	                rigaSelezionata=this.sectionRowIndex;
	                top.NS_CARTELLA_PAZIENTE.apri({
	                    index:rigaSelezionata,
	                    iden_evento:array_iden_esami[rigaSelezionata],
	                    funzione:'apriVuota();',
	                    window:window
	                });

	            };
	        }
	    }
	    },

		modifica : function (){

			var iden= stringa_codici(array_iden);
			if(iden == ''){ return alert('Attenzione: effettuare una selezione');}

			var url = "servletGenerator?KEY_LEGAME=INSERIMENTO_NOTE_VPO&READONLY=false&STATO_PAGINA=E&reparto="+top.getRicovero("COD_CDC")+"&KEY_ID="+iden;

			parent.$.fancybox({
				'padding'	: 3,
				'width'		: 1024,
				'height'	: 400,
				'href'		: url,
				'type'		: 'iframe',
				'showCloseButton':false
			});
		},

		visualizza : function (){

			var iden= stringa_codici(array_iden);
			if(iden == ''){ return alert('Attenzione: effettuare una selezione');}

			var url = "servletGenerator?KEY_LEGAME=INSERIMENTO_NOTE_VPO&READONLY=true&KEY_ID="+iden;

			parent.$.fancybox({
				'padding'	: 3,
				'width'		: 1024,
				'height'	: 400,
				'href'		: url,
				'type'		: 'iframe',
				'showCloseButton':false
			});
		},
		
		cancella : function (){
			var pBinds = new Array();
			var iden = stringa_codici(array_iden);
		        
		            if(iden == ''){
		                    return alert('Attenzione:effettuare una selezione');
		            }
		            
		            if (!confirm("Confermare la cancellazione dell'appuntamento?"))
		              return;		
		  
		        	pBinds.push(iden);
		            top.dwr.engine.setAsync(false);
		            top.dwrUtility.executeStatement('OE_Richiesta.xml','cancellaAppVpo',pBinds,0,callBack);
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

}