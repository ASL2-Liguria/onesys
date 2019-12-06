var WindowCartella = null;

jQuery(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }

	if(document.EXTERN.KEY_LEGAME.value.match(/BISOGNO_ALIMENTARSI.*/)){
		BISOGNI.disableStampa();
		BISOGNI.checkReadOnly();

		BISOGNO_ALIMENTARSI.init();
		BISOGNO_ALIMENTARSI.setEvents();

		try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){/*se non e aperto dalla cartella*/}
	}


});

var BISOGNO_ALIMENTARSI = {

		init : function(){

			setRadioResettable('BISOGNO_ALIMENTARSI',[
			                                          {radio:"chkDeglutizione"},
			                                          {radio:"chkDigiuno"},
			                                          {radio:"chkInappetente"},
			                                          {radio:"chkIntegratori"},
			                                          {radio:"chkAllergie"},
			                                          {radio:"chkCondizioniModulo"},
			                                          {radio:"chkNutre"},
			                                          {radio:"chkCondizioni",Function:BISOGNO_ALIMENTARSI.gestOpzioni.Protesi},									
			                                          {radio:"chkParenterale"}
			                                          ]);	

			BISOGNO_ALIMENTARSI.gestOpzioni.Protesi(); 
			BISOGNI.initChkPrincipale("BISOGNO_ALIMENTARSI");
			BISOGNI.caricaWkObiettivi('BISOGNO_ALIMENTARSI');	
			BISOGNO_ALIMENTARSI.loadPesoAltezza();
			$("#txtPeso").attr('disabled', 'disabled');
			$("#txtAltezza").attr('disabled', 'disabled');
            $('#lblAttivita').click(function(){BISOGNO_ALIMENTARSI.inserisciAttivita()});
		},

		setEvents : function(){
			//setto un attributo che verrà controllato dal salvataggio per determinare quali form siano stati modificati
			$('form[name="BISOGNO_ALIMENTARSI"]').click(function(){
				$(this).attr("edited","edited");			
			});			
		},

		gestOpzioni:{
			Protesi : function (){
				BISOGNI.gestOpzioni.set('BISOGNO_ALIMENTARSI','chkCondizioni','3',[],['chkProtesiSup','chkProtesiInf']);
			}
		},
		loadPesoAltezza: function(){
			var iden_visita = $("#IDEN_VISITA").val();
			var sql="select extractvalue(CC_SCHEDE_XML.contenuto,'//CAMPO[@KEY_CAMPO=\"txtPeso\"]') peso,extractvalue(CC_SCHEDE_XML.contenuto,'//CAMPO[@KEY_CAMPO=\"txtAltezza\"]') altezza " +
					"from CC_SCHEDE_XML where FUNZIONE='ESAME_OBIETTIVO' AND IDEN_VISITA="+iden_visita;
			dwr.engine.setAsync(false);
			toolKitDB.getListResultData(sql,compilaPesoAltezza);	
			dwr.engine.setAsync(true);
		},
        
        inserisciAttivita:function(){
            var pBinds = new Array();
            pBinds.push($('#FUNZIONE').val());
            var rs = WindowCartella.executeQuery('bisogni.xml','returnIdenBisogno',pBinds);
            while (rs.next()) {
                var url = "servletGeneric?class=cartellaclinica.pianoGiornaliero.pianificaAttivita";
                url+= typeof $('#FUNZIONE').val()=='undefined'?"":"&iden_bisogno_selezionato=" + rs.getString("iden");
                url+= "&cod_cdc=" + WindowCartella.getForm().reparto;
                $.fancybox({
                    'padding' : 3,
                    'width' : 800,
                    'height' : 540,
                    'href' : url,
                    'type' : 'iframe'
                });
            }
        }
};
function compilaPesoAltezza(resp){
	if (resp.length>0){
		if (resp[0].length>0){
			$("#txtPeso").val(resp[0][0]);
			$("#txtAltezza").val(resp[0][1]);
		}
	}
		
}