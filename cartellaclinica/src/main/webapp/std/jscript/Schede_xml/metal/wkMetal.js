/**
 * File JavaScript in uso dalla worklist Progetto METal.
 * 
 * @author	gianlucab
 * @version	1.0
 * @since	2015-07-29
 */

jQuery(document).ready(function() {
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    WK_PROGETTO_METAL.init();
});

var WK_PROGETTO_METAL = {};
(function() {
	var _this = this;
	
	this.init = function(){
		try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){}
	};
		
	this.inserisci = function(){
	    WindowCartella.apriScheda('SCHEDA_MET', 'Scheda M.E.T.al', {
	    	key_legame:'SCHEDA_MET',
	    	KEY_TABULATORE:'SCHEDA_MET.tabulatore'
	    }, {
	    	RefreshFunction: WindowCartella.progettoMetal,
	    	InfoRegistrazione: false
	    });
	};
		
	this.modifica = function() {
		var iden = stringa_codici(array_iden);
		var data_ins = stringa_codici(array_data_ins);
		if(iden == ''){
			return alert('Attenzione: nessuna scheda selezionata');
		}
		
		if (stringa_codici(array_stampa_ccor) != 'S') {
			var data = WindowCartella.clsDate.str2date(data_ins.substr(0, 10),'DD/MM/YYYY',data_ins.substr(11, 5));
			var range = {down: 24 /* ore */, top: null /* disabilitato */};
			var check = WindowCartella.clsDate.dateCompare(data, new Date(), range);
			switch(check) {
			    case 1:
			    	alert("Attenzione: operazione non consentita poiché mancano ancora più di "+range.top+" ore alla data di inserimento del cartellino.");
					return false;
			    case -1:
			    	alert("Attenzione: operazione non consentita poiché sono trascorse più di "+range.down+" ore dalla data di inserimento del cartellino.");
			    	return false;
			    case 0: default: // data valida
			}
		}
		
	   	WindowCartella.apriScheda('SCHEDA_MET', 'Scheda M.E.T.al', {
	   		key_legame:'SCHEDA_MET',
	   		MODIFICA:'S',
	   		IDEN_SCHEDA: iden,
	   		KEY_TABULATORE:'SCHEDA_MET.tabulatore'
	   	}, {
	   		RefreshFunction: WindowCartella.progettoMetal,
	   		InfoRegistrazione: false
	   	});
	};
		
	this.visualizza = function(){
		var iden = stringa_codici(array_iden);
		if(iden == ''){
			return alert('Attenzione: nessuna scheda selezionata');
		}
	    WindowCartella.apriScheda('SCHEDA_MET', 'Scheda M.E.T.al', {
	    	key_legame:'SCHEDA_MET',
	    	LETTURA:'S',
	    	IDEN_SCHEDA: iden,
	    	KEY_TABULATORE:'SCHEDA_MET.tabulatore'
	    }, {
	    	RefreshFunction: WindowCartella.progettoMetal,
	    	InfoRegistrazione: false
	    });
	};
		
	this.stampa = function(){
		var vDati = WindowCartella.getForm();
		var iden_scheda_metal = stringa_codici(array_iden);
		var stampa_ccor = stringa_codici(array_stampa_ccor);
        var funzione = 'STAMPA_GLOBALE_METAL';

		if(iden_scheda_metal == ''){
			return alert('Attenzione: nessuna scheda selezionata');
		}
		
        WindowCartella.utilMostraBoxAttesa(true);


        var vResp = WindowCartella.executeStatement('stampe.xml','StampaGlobale.Esegui',[
            vDati.iden_ricovero,
            funzione,
            top.baseReparti.getValue('','SITO')/* sito */,
            ''/* struttura */,
            vDati.reparto,
            'FUNZIONE'/* tipoFunz */,
            'PARAMETER'/* tipoParam */,
            'PDF_FIRMATO'/* isFirmato */,
            vDati.TipoRicovero
        ],7);

        if(vResp[0]=='KO'){
            return alert('Stampa in errore:\n'+vResp[1]);
        }

        var arrayFunction 	= vResp[2].split(';');
        var arrayParameters = vResp[3].split(';');
        var arrayNomeReport = vResp[4].split(';');
        var arrayFirmato    = vResp[5].split(';');

        var nomeCompleto	= '';
        var parametriRep	= '';
        var funzioni		= '';
        var isFirm			= '';
        
        for (var i=0;i<arrayParameters.length-1;i++){
        	if ((/SCHEDA_OUTREACH/gi).test(arrayFunction[i]) && stampa_ccor != 'S') continue;
        	
            funzioni	 = funzioni		+ arrayFunction[i] + ';';
            nomeCompleto = nomeCompleto + arrayNomeReport[i] + ';';
            parametriRep = parametriRep + eval(arrayParameters[i]) + ';';
            isFirm		 = isFirm		+ arrayFirmato[i] + ';';
        }
		//alert(funzioni+'\n'+nomeCompleto+'\n'+parametriRep);
        var vRespParam = WindowCartella.executeStatement('stampe.xml','StampaGlobale.setParametriStampaGlobale',[
              baseUser.LOGIN,
              vDati.iden_ricovero,
              "PARAMETRI_STAMPA_GLOBALE",
              funzioni,
              nomeCompleto,
              parametriRep,
              isFirm
              ]);
        if (vRespParam[0]=='KO'){
        	return alert("Errore nel salvataggio sul db dei parametri di stampa della cartella" + vRespParam[1]);
        }
        
        var url =  'elabStampaMulti?';
                
        $('body').append('<form id="stampaGlobaleMetal" />');
        $("form#stampaGlobaleMetal").append('<input type="hidden" name="stampaAnteprima" id="stampaAnteprima"/>');
        $("form#stampaGlobaleMetal input#stampaAnteprima").val("S");
        $("form#stampaGlobaleMetal").append('<input type="hidden" name="numCopie" id="numCopie"/>');
        $("form#stampaGlobaleMetal input#numCopie").val("1");
        $("form#stampaGlobaleMetal").append('<input type="hidden" name="idenRicovero" id="idenRicovero"/>');
        $("form#stampaGlobaleMetal input#idenRicovero").val(vDati.iden_ricovero);    
        
        var finestra_stampaglobale = window.open("","stampa_globale","fullscreen=yes scrollbars=no");
    	$("form#stampaGlobaleMetal").attr('target','stampa_globale');
    	$("form#stampaGlobaleMetal").attr('action',url);
        $("form#stampaGlobaleMetal").attr('method','POST');
        $("form#stampaGlobaleMetal").submit();
       	
     
        /*var url =  'elabStampaMulti?&allFunction='+funzioni;
        url += '&allNameReport='+nomeCompleto;
        url += '&allParamReport='+parametriRep;
        url += '&allFirmato='+isFirm;
        url += '&stampaAnteprima=S';
        url += '&numCopie=1';
        WindowCartella.utilMostraBoxAttesa(false);
        var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);

        if(finestra){
            finestra.focus();
        }else{
            finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
        }*/
        WindowCartella.utilMostraBoxAttesa(false);
        try{
            opener.top.closeWhale.pushFinestraInArray(finestra_stampaglobale);
            }
        catch(e){}
	};
}).apply(WK_PROGETTO_METAL);
