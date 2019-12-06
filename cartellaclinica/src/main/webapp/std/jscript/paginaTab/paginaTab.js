
var arrayIdTab =new Array;
var WindowCartella = null;
jQuery(document).ready(function()
		{
            window.WindowCartella = window;
            while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
                window.WindowCartella = window.WindowCartella.parent;
            }
            window.baseReparti = WindowCartella.baseReparti;
            window.baseGlobal = WindowCartella.baseGlobal;
            window.basePC = WindowCartella.basePC;
            window.baseUser = WindowCartella.baseUser;

	PAGINA_TAB.init();
	
	
	$('.divTable  th').each(function(index) {
		$(this).html($(this).html().replace('_',' '));
	});
		});


var PAGINA_TAB = {

	init: function(){
	try{WindowCartella.utilMostraBoxAttesa(false);
	}catch(e){}
	//inserisco nell'array il tabulatore selezionato (caricato)	
	arrayIdTab.push($('a[class=selTab]').attr('id'));
	
	//fisso l'altezza dei frame interni ai div per i quali è stato settato oferflowY scroll
	$('div.overflowY > IFRAME').each(function(index) {
			$(this).height($(this).parent().height()-20);
			$(this).css('overflow-x','scroll');
	});

	//fisso l'altezza del div interno se ho settato il div esterno overflowY scroll 
	$('div.divTable').each(function(index) {
		if($(this).parent().hasClass('overflowY'))
			$(this).height($(this).parent().height()-20);
	});


//	fisso l'altezza degli IFrame come l'altezza del div a cui appartengono 
	$('IFRAME').each(function(index) {
		$(this).height($(this).parent().height());
	});
},

caricaTab: function(idTab){

//	verifico che il tabulatore selezionato sia già stato caricato	
	//se è già stato caricato in precedenza
	if($.inArray(idTab, arrayIdTab) > -1){
		$('#navTab > li > a').addClass("deselTab").removeClass("selTab");
		$('#'+idTab).addClass("selTab").removeClass("deselTab");
		//visualizzo il div relativo e nascondo gli altri
		$('#divContainer > div').hide();
		$('#div'+idTab).show();
	}
	//se non è mai stato caricato	
	else{
		dwr.engine.setAsync(false);	
		paginaTab.getTab(idTab,document.EXTERN.procedura.value,document.EXTERN.tipoUtente.value,document.EXTERN.reparto.value,document.EXTERN.iden_visita.value,respPTab);
		dwr.engine.setAsync(true);

	}

	function respPTab(resp)
	{

		$('#div'+resp[1]).html(resp[0]);
		eval(resp[2]);

		//seleziono il tabulatore
		$('#navTab > li > a').addClass("deselTab").removeClass("selTab");
		$('#'+resp[1]).addClass("selTab").removeClass("deselTab");

		//visualizzo il div relativo e nascondo gli altri
		$('#divContainer > div').hide();
		$('#div'+resp[1]).show();

		//aggiungo l'id del tab all'array dei tabulatori caricati
		arrayIdTab.push(resp[1]);

		//fisso l'altezza dei frame interni ai div per i quali è stato settato oferflowY scroll
		$('div.overflowY > IFRAME').each(function(index) {
				$(this).height($(this).parent().height()-20);
		});
		
		$('div.divTable').each(function(index) {
			if($(this).parent().hasClass('overflowY'))
				$(this).height($(this).parent().height()-20);
		});

	}

},

ricaricaSezione: function(idTabulatore,idSezione){
	//se la sezione fa parte di un tabulatore già caricato
	if(typeof datiTabulatori[idTabulatore][idSezione]!='undefined')
	{
		//se div getDatiFromSql, se iframe getframe, se class getDivFromClass
		switch (datiTabulatori[idTabulatore][idSezione].TIPO_DATO){
		case 'DIV':
			dwr.engine.setAsync(false);	
			paginaTab.getDatiFromSql(datiTabulatori[idTabulatore][idSezione].QUERY,datiTabulatori[idTabulatore][idSezione].GRUPPO,idSezione,datiTabulatori[idTabulatore][idSezione].CLASS,datiTabulatori[idTabulatore][idSezione].LABEL,datiTabulatori[idTabulatore][idSezione].DIMENSION,document.EXTERN.iden_visita.value,document.EXTERN.ricovero.value,document.EXTERN.reparto.value,document.EXTERN.USER_ID.value,document.EXTERN.iden_anag.value,respRicSez);
			dwr.engine.setAsync(true);
			break;
		case 'IFRAME':
		//	paginaTab.getFrame(datiTabulatori[idTabulatore][idSezione].SRC,idSezione,datiTabulatori[idTabulatore][idSezione].CLASS,datiTabulatori[idTabulatore][idSezione].LABEL,datiTabulatori[idTabulatore][idSezione].DIMENSION,document.EXTERN.iden_visita.value,document.EXTERN.ricovero.value,document.EXTERN.reparto.value,document.EXTERN.USER_ID.value,document.EXTERN.iden_anag.value,respRicSez);
			  $('#'+idSezione +'> IFRAME').attr("src", $('#'+idSezione +'> IFRAME').attr("src")); 
			break;
		case 'CLASS':
			alert('CLASS');
			break;
		}

		function respRicSez(resp)
		{
			$('#'+resp[1]).replaceWith(resp[0]);
		}
	}


},

ricaricaArgomento: function(pArgomento){

	for (var idTab in datiTabulatori){
		res=PAGINA_TAB.checkArgomento(pArgomento,idTab);

		for (var i in res){
			PAGINA_TAB.ricaricaSezione(idTab,res[i]);		
		}
	} 

},


checkArgomento: function (pArgomento,nomeTab){

	var refs = [];

	for (var i in datiTabulatori[nomeTab]){
		for (var j =0; j< datiTabulatori[nomeTab][i].ARGOMENTO.length ; j++){
			if(datiTabulatori[nomeTab][i].ARGOMENTO[j] == pArgomento){
				refs.push(i);
			}

		}
	}
	return refs;
}
};
