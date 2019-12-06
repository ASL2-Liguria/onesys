/**
 * @author linob
 * @data 11-02-2015
 * @page filtro wk anagrafica degli esami
 */

var WindowCartella = null;

jQuery(document).ready(function() {
	var topname = top.window.name;
    window.WindowHome = window;
    while (window.WindowHome.name != topname && window.WindowHome.parent != window.WindowHome) {
        window.WindowHome = window.WindowHome.parent;
    }
    window.baseReparti = WindowHome.baseReparti;
    window.baseGlobal = WindowHome.baseGlobal;
    window.basePC = WindowHome.basePC;
    window.baseUser = WindowHome.baseUser;

    try {
    	WindowHome.utilMostraBoxAttesa(false);
    } catch (e) {
        /*catch nel caso non venga aperta dalla cartella*/
    }

//    try {
//    	NS_WK_ANAGRAFICA_ESAMI.init();
//    	NS_WK_ANAGRAFICA_ESAMI.setEvents();
//    } catch (e) {
//        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
//    }

});


var NS_WK_ANAGRAFICA_ESAMI = {
	url:"servletGenerator?KEY_LEGAME=GESTIONE_ANAGRAFICA_ESAMI&ILLUMINA=illumina(this.sectionRowIndex);",
	urlConf:"servletGenerator?KEY_LEGAME=CONFIGURA_TAB_ESA_REPARTO&ILLUMINA=illumina(this.sectionRowIndex);",
//	init: function() {},
//    setEvents: function() {},
    apri:function(tipo){   		
		var url = NS_WK_ANAGRAFICA_ESAMI.url+'&operazione='+tipo;
	
		url = url + NS_WK_ANAGRAFICA_ESAMI.recuperaDatiUrl();

        var finestra = window.open(url,'Esami','fullscreen=yes,scrollbars=yes');

        try{
        	WindowHome.closeWhale.pushFinestraInArray(finestra);
        }catch(e){
            //alert(e.description);
        }
	},
	configura:function(tipo){
			
		var url = NS_WK_ANAGRAFICA_ESAMI.urlConf;
		
		url = url + NS_WK_ANAGRAFICA_ESAMI.recuperaDatiUrl();

		var urlTmp = stringa_codici(array_tipologia_richiesta)=='5'?'&TIPO=C':'&TIPO=R' 
		url = url + urlTmp;

		
	    var finestra = window.open(url,'Esami','fullscreen=yes,scrollbars=yes');
	
	    try{
	    	WindowHome.closeWhale.pushFinestraInArray(finestra);
	    }catch(e){
	        //alert(e.description);
	    }
	},
	
	recuperaDatiUrl:function(){
		var urlTmp = '';
		urlTmp = urlTmp + "&iden="+stringa_codici(array_iden);	
		urlTmp = urlTmp + "&cod_dec="+stringa_codici(array_cod_dec);
		urlTmp = urlTmp + "&cod_esa="+stringa_codici(array_cod_esa);
		urlTmp = urlTmp + "&metodica_radiologica="+stringa_codici(array_metodica_radiologica);
		urlTmp = urlTmp + "&tipologia_richiesta="+stringa_codici(array_tipologia_richiesta);
		urlTmp = urlTmp + "&attivo="+stringa_codici(array_attivo);
		urlTmp = urlTmp + "&cod_min="+stringa_codici(array_cod_min);
		urlTmp = urlTmp + "&descrizione="+stringa_codici(array_descrizione);
		urlTmp = urlTmp + "&parti_corpo="+stringa_codici(array_parti_corpo);
		urlTmp = urlTmp + "&desc_sirm="+stringa_codici(array_desc_sirm);
		
		return urlTmp;
	}

};