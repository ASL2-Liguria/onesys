var WindowCartella = null;
$(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    NS_WK_RICERCA_MET.init();
    NS_WK_RICERCA_MET.setEvents();
});

var NS_WK_RICERCA_MET={
    init: function(){
    },
    setEvents: function(){
        righe = document.all.oTable.rows;
        for(var i=0;i<righe.length;i++){
            righe[i].ondblclick=function(){
                rigaSelezionata=this.sectionRowIndex;
                WindowCartella.NS_CARTELLA_PAZIENTE.apri({
                    index:rigaSelezionata,
                    iden_evento:array_iden_visita_reg,
                    funzione:'progettoMetal();',
                    ModalitaAccesso: 'METAL',
                    window:window
                });

            };
        }
    }
};

function aggiungi_ordinamento(campo, tipo)
{
	parent._WK_ORDINA_CAMPO = campo + ' ' + tipo;
	parent.aux_applica_filtro();
	event.returnValue = false;
}

function setManualAscOrder(campo)
{
	aggiungi_ordinamento(campo, 'asc');
}

function setManualDescOrder(campo)
{
	aggiungi_ordinamento(campo, 'desc');
}