jQuery(document).ready(function($){

	//	Al click di un tab, visualizza il divtab relativo
	jQuery("ul#nav li").click(function(){
		jQuery("ul#nav li").attr("id","");
		jQuery(this).attr("id","active");
		
		var divtab = jQuery(this).attr("tab");

		jQuery(".divtab").addClass("tabhide");
		jQuery("#"+divtab).removeClass("tabhide");
	});
	
	//	Calcoli per dimensionamento divtab
	var viewportwidth;
	var viewportheight;

	if (typeof window.innerWidth != 'undefined'){
		viewportwidth = window.innerWidth,
		viewportheight = window.innerHeight;
	}else if (typeof document.documentElement != 'undefined'
	 && typeof document.documentElement.clientWidth !=
	 'undefined' && document.documentElement.clientWidth != 0){
	   viewportwidth = document.documentElement.clientWidth,
	   viewportheight = document.documentElement.clientHeight;
	}else{
	   viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
	   viewportheight = document.getElementsByTagName('body')[0].clientHeight;
	}
	
	//	Dimensionamento dei divtab
	var hDivTab = jQuery("#container").height();
	jQuery(".divtab").height(viewportheight - 72);
	var wDivTabIframe = jQuery(".divtab").width();
	var hDivTabIframe = jQuery(".divtab").height();
	jQuery(".divtab iframe").width(wDivTabIframe);
	jQuery(".divtab iframe").height(hDivTabIframe);
});

//faccio partire nei vari frames la funzione ricordaEsami();
	var divs=document.frames;
	//alert(divtabs[0].arrayEsami);
	//for(i = 1; i <= divtabs.length; i++){
	for(var i = 0; i < divs.length; i++){		
		//alert(divtabs[i].id);
		divtabs[i].ricordaEsami();
		
	}
	
// pulsante CONTINUA
// funzione che crea due array con id e valore degli esami con il check
function arrayEsami(){
	
	//var STATO_CAMPO = window.opener.document.all.cmbPrestRich_L.STATO_CAMPO;
	
	var STATO_CAMPO = opener.document.all.cmbPrestRich_L.STATO_CAMPO;
	window.opener.document.all.HelencoEsami.value='';
	window.opener.document.all.Hmateriali.value='';
	
	//	Crea un listbox e un input al quale appendere gli esami selezionati
	jQuery("#container").append("<select STATO_CAMPO='"+STATO_CAMPO+"' multiple style='width:100%;display:none;' name='cmb'></select>");
	jQuery("#container").append("<input STATO_CAMPO='"+STATO_CAMPO+"' value='' name='HelencoEsami' type='hidden'>");
		
	//	Esegue la funzione arrayEsami() di ogni iFrame	
	//var divtabs = document.getElementsByAttribute("DIV","class","divtab");

	var divtabs =document.frames;

	//alert(divtabs[0].arrayEsami);
	//alert(divtabs.length);
	//for(i = 1; i <= divtabs.length; i++){
	for(i = 0; i < divtabs.length; i++){		
		if(divtabs[i].arrayEsami){
			divtabs[i].arrayEsami(i, STATO_CAMPO);
		}
		//document.all['iFrame-'+i].contentWindow.arrayEsami(i, STATO_CAMPO);
	}
	 
	//	Hack per listbox (manca un <OPTION> all'inizio)
	
	var cmb = document.all['cmb'].options.innerHTML;	
	
	
	//cmb = "<OPTION>"+cmb;
	//alert(cmb);
	
	//	Valorizza il campo input hidden HelencoEsami dell'opener
	window.opener.document.all.HelencoEsami.value = document.all.HelencoEsami.value;
	
	//	Valorizza la ListBox dell'opener
	//alert('HelencoEsami: '+document.all['HelencoEsami'].value);
	//alert('CmbPrestRich OuterHTML:'+ window.opener.document.all['cmbPrestRich_L'].options.outerHTML );
	
	window.opener.document.all['cmbPrestRich_L'].options.outerHTML = 
		window.opener.document.all['cmbPrestRich_L'].options.outerHTML = window.opener.document.all['cmbPrestRich_L'].options.outerHTML.substr(0, 
			window.opener.document.all['cmbPrestRich_L'].options.outerHTML.toUpperCase().indexOf('<OPTION') > 0 
			? window.opener.document.all['cmbPrestRich_L'].options.outerHTML.toUpperCase().indexOf('<OPTION')
			:window.opener.document.all['cmbPrestRich_L'].options.outerHTML.toUpperCase().indexOf('</SELECT')) + cmb + '</SELECT>';
			
			//alert (window.opener.document.all['cmbPrestRich_L'].options.outerHTML);
	
	self.close();
}

//	Pulsante DESEL TUTTO
//	Per ogni frame, esegue la funzione DeselezionaTutto()
function DeselezionaTutto(){
	
	//var divtabs = document.getElementsByAttribute("div","class","divtab");      questo per IE > 6
	var divtabs = document.frames;
	
	for(i = 0; i < divtabs.length; i++){
	//document.all['iFrame-'+i].contentWindow.DeselezionaTutto();    questo per IE > 6
		divtabs[i].DeselezionaTutto();
	}
}