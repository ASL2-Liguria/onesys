//Override
NS_FENIX_FILTRI.applicaFiltri = function ()
{
    $(".toUpper","#filtri").each(function(k,v){$(v).val($(v).val().toUpperCase());});
    NS_FENIX_WK.aggiornaWk();
};
//Override
NS_FENIX_WK.aggiornaWk= function ()
{
    var paramsWk = NS_FENIX_FILTRI.leggiFiltriDaBindare();
    var Bind=paramsWk.aBind;
    var Value=paramsWk.aVal;

    if(Value[Bind.indexOf("campo")]=="CODICE"){
        Bind.push("codice");
        Value.push(Value[Bind.indexOf("ricerca")]+"%25");
        Bind.push("descr");
        Value.push("%25");
    }else{
        Bind.push("descr");
        Value.push(Value[Bind.indexOf("ricerca")]+"%25");
        Bind.push("codice");
        Value.push("%25");
    }

    Bind.push("iden_per");
    Value.push(home.baseUser.IDEN_PER);
    GESTIONE_MEDICI.wk.filter({"aBind":paramsWk.aBind,"aVal":paramsWk.aVal})

};



$("document").ready(function(){

    home.NS_FENIX_TOP.aggiorna=NS_FENIX_WK.aggiornaWk;
    GESTIONE_MEDICI.init();
    $(".butChiudi").off("click");
    $(".butChiudi").on("click",home.NS_FENIX_TOP.chiudiUltima);


});

var GESTIONE_MEDICI={
    wk:null,
    init:function()
    {
        $(".tabActive").text($("#TABELLA").val());
        $("#divWk").height("500px");

        var params = {
            "id"    : $("#ID_WK").val(),
            "aBind" : ["codice","descr","iden_per"],
            "aVal"  : ["%25","%25",home.baseUser.IDEN_PER],
            "container":"divWk"

        }
        this.wk = new WK(params);
        this.wk.loadWk();

    },
    apri:function(rec){
        var iden="";

        if(typeof  rec  == undefined ){
            return;
        }else{
            iden = rec[0].IDEN_PER;
        }
        urlFinale = "page?KEY_LEGAME=ASSOCIAZIONE_AREA_AGENDA&IDEN="+iden;
        home.NS_FENIX_TOP.apriPagina({url:urlFinale,fullscreen:true,showloading:false});
    },
    
    inserisciAgenda: function(rec)
    {
    	
    	url = "page?KEY_LEGAME=SCHEDA_AGENDA&IDEN=&IDEN_PER="+rec[0]['IDEN_PER'];
        home.NS_FENIX_TOP.apriPagina({url:url,fullscreen:true,showloading:false});
    	
    }
}

var WK_MODIFICATORI = {
		
		divWk : 	null,
		dialog : 	null,
		openWk : function(pIdenAgendaConfigurata) {
			if( this.dialog == null)
			{

				var wkparameters    =
				{
						'id' :              'AGENDA_MODIFICATORI',
						'container' :       'divWkModificatori',
						'loadData' :        true,
						'aBind' :           ['iden_agenda_configurata'],
						'aVal' : 			[pIdenAgendaConfigurata],
						load_callback : {
							after: function() {
								$("#MENU_WK_AGENDA_MODIFICATORI").parent().css({"z-index":"1000"});
							}
						}
				};
				alert('MOD')
				
				var divWk 				= $('<div>', { 'id' : 'divWkModificatori', 'width' : 800, 'height' : 500 });
				var dialogContent		= $('<div>', { 'id' : 'dialogContent' } );
				dialogContent.append(divWk);
				
				this.dialog =

					$.dialog( dialogContent, {

						'id'				: 'dialogWk',
						'title'				: 'Modificatori',
						'showBtnClose'		: false,
						'content'			: dialogContent,
						'ESCandClose'		: true,
						'created'			: function(){ $('.dialog').focus(); },
						'buttons':
							[
								{
									'label' : 'Chiudi',
									'action' : function(context)
									{
										context.data.close();
									}
								}
							]
					});

				this.objWk = new WK( wkparameters );
				this.objWk.loadWk();
				
			} 
			else 
			{
				this.dialog.open();
				this.objWk.filter( 
					{ 
						'aBind' :           ['iden_agenda_configurata'],
						'aVal' : 			[pIdenAgendaConfigurata]
					});
			}
		},
		modifica:function(rec) {
			home.activeWk = WK_MODIFICATORI.objWk;
			home.NS_FENIX_TOP.apriPagina({
				url:'page?KEY_LEGAME=AGENDA_MODIFICATORE&IDEN_AGENDA_CONFIGURATA='+ rec[0]['IDEN_AGENDA_CONFIGURATA']+'&IDEN='+rec[0]['IDEN'],
				fullscreen:true
			});
		},
		duplica:function(rec) {
			home.activeWk = WK_MODIFICATORI.objWk;
			home.NS_FENIX_TOP.apriPagina({
				url:'page?KEY_LEGAME=AGENDA_MODIFICATORE&OPERATION=DUPLICA&IDEN_AGENDA_CONFIGURATA='+ rec[0]['IDEN_AGENDA_CONFIGURATA']+'&IDEN='+rec[0]['IDEN'],
				fullscreen:true
			});
		}
};

