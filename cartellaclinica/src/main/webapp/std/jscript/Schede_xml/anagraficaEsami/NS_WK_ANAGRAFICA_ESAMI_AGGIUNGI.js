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
});


var NS_WK_ANAGRAFICA_ESAMI_AGGIUNGI = {
    importa:function(tipo){
    	var arrayToImport=[];
    	var wndConfigura = parent.parent.window;
    	for (var i=0;i<=vettore_indici_sel.length-1;i++){
    		var indice = vettore_indici_sel[i];
//    		alert(vettore_indici_sel[i] +' '+array_descrizione[vettore_indici_sel[i]] +'/n' + i +' '+array_descrizione[i] )
    		var esame_tab_esa_reparto = new wndConfigura.esameTabEsaReparto(
    				array_iden[indice],
    				array_descrizione[indice],
    				parent.$('#destinatario').val(),//destinatario
    				array_tipologia_richiesta[indice],
    				'',
    				'',
    				'',
    				parent.$('#urgenza').val(),
    				'S'
    		);
    		arrayToImport.push(esame_tab_esa_reparto);
    	}
    	
    	wndConfigura.NS_CONFIGURA_TAB_ESA_REPARTO.importaEsame(arrayToImport);
    	
    	self.close();
    	
	}
};