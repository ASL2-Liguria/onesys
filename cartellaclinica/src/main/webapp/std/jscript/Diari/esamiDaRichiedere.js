var WindowCartella = null;

$(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }


	$('#txtEsami').focus();
	

	if(_STATO_PAGINA == 'L'){
		document.getElementById('lblRegistra').parentElement.style.display = 'none';
	}
	caricamentoPagina();
	
});


function caricamentoPagina(){
	if(_STATO_PAGINA == 'I')
		document.all.divGroupInfo.style.display='none';
}



/**
 */
function chiudi(){
	$('iframe#frameDiari',parent.document)[0].contentWindow.location.reload();
		parent.$.fancybox.close();
}


function chiudiEsamiDaRichiedere() {

	if (document.getElementById('txtEsami').value!='' && _STATO_PAGINA!='L') {
		if (confirm("Attenzione: sono presenti dati non salvati, si vuol procedere al salvataggio?")){
		registraEsamiDaRichiedere();
		}
		else
			parent.$.fancybox.close(); 
	} else {
		parent.$.fancybox.close(); 
	}
}

function registraEsamiDaRichiedere(){
	registra();	
}