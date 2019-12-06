/**
 * User: graziav
 * Date: 27/03/2014
 * Time: 12:00
 */

jQuery(document).ready(function () {
	window.NS_FENIX_TOP = window.parent.NS_FENIX_TOP;
	window.$.NS_DB = window.parent.$.NS_DB;
	NS_CRONOLOGIA_RICHIESTA_CARTELLA.init();
	NS_CRONOLOGIA_RICHIESTA_CARTELLA.events();
});
var NS_CRONOLOGIA_RICHIESTA_CARTELLA={
		wkCronoRichiesta:null,
		wkCronoRichiestaCartella:null,
		init:function(){
			var idenRichiesta = $('#IDEN_RICHIESTA').val();
			NS_CRONOLOGIA_RICHIESTA_CARTELLA.wkCronoRichiesta = new WK({
	            id:"ADT_WK_DATI_RICHIESTA",
	            container:"divCronoRichiesta",
	            aBind : ["idenRichiesta"],
                aVal : [idenRichiesta],
                load_callback: null,
                loadData:true
	        });
			$("div#divCronoRichiesta").height("300px").width("100%");
			NS_CRONOLOGIA_RICHIESTA_CARTELLA.wkCronoRichiesta.loadWk();
			
			NS_CRONOLOGIA_RICHIESTA_CARTELLA.wkCronoRichiestaCartella = new WK({
	            id:"ADT_WK_DATI_RICHIESTA_CARTELLA",
	            container:"divCronoRichiestaCartella",
	            aBind : ["idenRichiesta"],
                aVal : [idenRichiesta],
                load_callback: null,
                loadData:true
	        });
			$("div#divCronoRichiestaCartella").height("200px").width("100%");
			NS_CRONOLOGIA_RICHIESTA_CARTELLA.wkCronoRichiestaCartella.loadWk();
		},
		events:function(){}
		
}