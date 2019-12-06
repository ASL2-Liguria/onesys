var WindowCartella = null;
$(document).ready(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'Home' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    NS_WK_VPO.init();
    NS_WK_VPO.setEvents();
});

var NS_WK_VPO={
    init: function(){
    },
    setEvents: function(){
        righe = document.all.oTable.rows;
        for(var i=0;i<righe.length;i++){
            righe[i].ondblclick=function(){
                rigaSelezionata=this.sectionRowIndex;
                var iden_testata = stringa_codici(array_iden_testata);
                var iden_ref = stringa_codici(array_iden_ref);
                WindowCartella.NS_CARTELLA_PAZIENTE.apri({
                    index:rigaSelezionata,
                    iden_evento:array_iden_esami[rigaSelezionata],
                    funzione:'apriRefertoVisitaAnestesiologica('+array_iden_testata[rigaSelezionata]+','+array_iden_ref[rigaSelezionata]+');',
                    window:window
                });

            };
        }
    }
    
    /*apriConsolleVisitaAnestesiologica:function(){

        var funzione    = 'VISITA_ANESTESIOLOGICA';
        var idenTes 	= stringa_codici(array_iden_testata);
        var tabPerTipo	= baseUser.TIPO;
        var datiPaz 	= stringa_codici(array_paziente);
        var repProv		= stringa_codici(array_cdc_rep_prov);
        var idenVis 	= stringa_codici(array_iden_esami);
        var idenAna 	= stringa_codici(array_iden_anag);
        var nosolog 	= stringa_codici(array_num_nosologico);
        var idenRef 	= stringa_codici(array_iden_ref);
        var repDest 	= stringa_codici(array_cdc_rep_prov);
        var idRemoto	= stringa_codici(array_id_remoto);

        //var url = 'srvRefConsulenze?paziente='+datiPaz+
        var url = 	'servletGeneric?class=refertazioneConsulenze.refertazioneAnestesiologicaEngine'+
                    '&paziente='+datiPaz+
                    '&reparto='+repProv+
                    '&repartoDest='+repProv+
                    '&idenVisita='+idenVis+
                    '&idenAnag='+idenAna+
                    '&ricovero='+nosolog+
                    '&funzione='+funzione+
                    '&idenReferto='+idenRef+
                    '&idenTes='+idenTes+
                    '&idRemoto='+idRemoto+
                    '&tabPerTipo='+tabPerTipo;

        var finestra = window.open(url,'','fullscreen=yes');

        try{
            top.closeWhale.pushFinestraInArray(finestra);
        }catch(e){}
    }*/
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

function retrieveNumNosologico(idenVisita){
	var statementFile 	= "OE_Consulenza.xml";
	var statementName 	= "consulenze.retrieveNumNosologico";	
	var parameters 		= [idenVisita];
	
	var vResp = top.executeStatement(statementFile,statementName,parameters,1);
	if (vResp[0]=='OK'){
		return vResp[2];
	}else{
		var msg = 'Errore nel recupero del nosologico';
		return '';
	}
	return;	
}