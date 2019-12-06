var WindowCartella = null;
$(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

	associaRepartiModelli.init();
	associaRepartiModelli.setEvents();
});

var associaRepartiModelli = {
		init:function() {
			$("span#associa").click(associaRepartiModelli.salva);
		},
		setEvents:function(){

		},
		salva:function(){
			if (associaRepartiModelli.check()) {
				var iden_modello = $("input#iden_modello").val();
				var reparti = new Array();
				$("input:checked").each(function(){
					reparti.push($(this).val());
				});
				var resp = WindowCartella.executeStatement("terapie.xml","prescrizioniStd.setRepartiAssocia",[iden_modello,reparti.join(",")]);
				if (resp[0]=='OK') {
					alert("Associazione salvata correttamente");
					parent.refreshWkSearchFarmaci();
					parent.$.fancybox.close();
				} else {
					alert(resp);
				}
			}
		},
		check:function(){
			if ($("input:checked").length<1) {
				alert("Impossibile non associare nessun reparto");
				return false;
			} else {
				return true;
			}
		}
}