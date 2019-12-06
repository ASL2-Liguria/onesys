/*
 *
 *	Tabulazione
 *	Author: Fabriziod
 *
 *	Si basa su una struttura del tipo:
 *	<div id="tab1"></div>
 *	<div id="tab2"></div>
 *	.....................
 *	<div id="tabN"></div>
 *
 *	Per attivare:
 *	var lista = ['NomeTab1','NomeTab2','NomeTab3'];
 *	var tabApertoDefault = 1;
 *	attivaTab(lista, tabApertoDefault);
 *
 */
function attivaTab(lista, attivo){

	//	Crea i tab e li inserisce nella pagina
	var htmlTAB = "<ul id='nav'>\n";
	$.each(lista, function(index, element){
		htmlTAB += "<li tab='tab"+(index+1)+"' ";
		if((index+1) == attivo) htmlTAB += "id=\"active\"";
		htmlTAB += " ><a href='#'><span>"+element+"</span></a></li>\n";
	});
	htmlTAB += "</ul>";
	jQuery("#tab1").parent().prepend(htmlTAB);
	
	
	//	Nasconde tutti i tab tranne quello attivo
	$('div[id^="tab"]').addClass("tab").hide();
	$('#tab'+attivo).show();
	
	//	Al click di un tab, visualizza il divtab relativo
	jQuery("ul#nav li").click(function(){
		jQuery("ul#nav li").attr("id","");
		jQuery(this).attr("id","active");
		
		var divtab = jQuery(this).attr("tab");

		jQuery(".tab").hide();
		jQuery("#"+divtab).show();
	});
}
