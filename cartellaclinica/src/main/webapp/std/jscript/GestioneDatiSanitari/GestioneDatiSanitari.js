var WindowCartella = null;
$(document).ready(function() {

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    WindowCartella.utilMostraBoxAttesa(false);

	$('.divElencoDati').children().click(NS_GESTIONE_DATI_SANITARI.ricarica);

});


$('li.LiconSpaneUl .ulConLiDati').sortable({
	
	start: function(event, ui) {
//		$(ui.helper).addClass("sortable-drag-clone");
	},
	stop: function(event, ui) {
//		$(ui.helper).removeClass("sortable-drag-clone");
	},
	receive: function( event, ui ) {
		var b = true;
		var a = "";
		if($("ul").data("funzione")=="SchedaXml"){
			if($("li",this).length>1){
				b = false;
				alert("Impossibile associare più elementi di questo tipo in un ricovero");
				$(ui.sender).sortable("cancel");
			}else if (confirm("Vuoi spostare l'elemento selezionato?")) {	
				var a = WindowCartella.executeStatement("AssociazioneDatiAccesso.xml", ui.item.data("funzione"), [ui.item.data("iden"),$(this).closest("li").data("iden_evento"),WindowCartella.baseUser.IDEN_PER]);
//				alert(a);
			}

			if (a[0]=="KO"){
				alert(a[1]);
			}else if (b){
				alert("insert eseguita con successo");
			}
		} else	if (confirm("Vuoi spostare l'elemento selezionato?")) { 
			var a = WindowCartella.executeStatement("AssociazioneDatiAccesso.xml", ui.item.data("funzione"), [ui.item.data("iden"),$(this).closest("li").data("iden_evento"),WindowCartella.baseUser.IDEN_PER]);
			if (a[0]=="KO"){
				alert(a[1]);
			}else if (b){
				alert("insert eseguita con successo");
			}
		}else {
			$(ui.sender).sortable("cancel");
			alert('annullato!');

		}
	},


	tolerance: "pointer",
	connectWith: ".ulConLiDati"
}).disableSelection();

//alert(typeof $('li.LiconSpaneUl .ulConLiDati') +"\n " + $('li.LiconSpaneUl .ulConLiDati').length);
//$('li.LiconSpaneUl .ulConLiDati').sortable({connectWith: ".ulConLiDati"}).disableSelection();

var NS_GESTIONE_DATI_SANITARI = {

		ricarica:function(){

			document.location.replace("servletGeneric?class="+$('input[name=class]').attr('value')+"&statementname="+$(this).data("statement")+"&IdenRicovero="+$('input[name=IdenRicovero]').val()+"&IdenAnag="+$('input[name=IdenAnag]').attr('value')+"&funzione_collegata="+$(this).data("funzionecollegata"));

		}
}