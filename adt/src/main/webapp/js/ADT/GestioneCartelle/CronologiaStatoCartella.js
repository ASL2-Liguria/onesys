/**
 * User: graziav
 * Date: 28/03/2014
 * Time: 11:30
 */

jQuery(document).ready(function () {
	window.NS_FENIX_TOP = window.parent.NS_FENIX_TOP;
	window.$.NS_DB = window.parent.$.NS_DB;
	NS_CRONOLOGIA_STATO_CARTELLA.init();
	NS_CRONOLOGIA_STATO_CARTELLA.events();
});
var NS_CRONOLOGIA_STATO_CARTELLA={
		wkCronoStato:null,
		init:function(){
			NS_CRONOLOGIA_STATO_CARTELLA.wkCronoStato=new WK({
	            id:"ADT_WK_STATO_CARTELLA",
	            container:"divCronoStato",
	            aBind : ["IDEN_CONTATTO"],
                aVal : [$('#IDEN_CONTATTO').val()],
                load_callback: null,
                loadData:true
	        });
			$("div#divCronoStato").height("400px").width("100%");
			NS_CRONOLOGIA_STATO_CARTELLA.wkCronoStato.loadWk();	
		},
		events:function(){}
		
}