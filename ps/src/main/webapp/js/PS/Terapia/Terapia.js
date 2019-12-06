jQuery(document).ready(function() {
	TERAPIA.init();
	TERAPIA.event();
});

var TERAPIA = {
    dimensioneWk:null,

	init : function() {
        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        if($("#READONLY").val() === "S"){$("div.contentTabs").css({"background":"#CACACC"})}
        TERAPIA.calcolaDimensioneWk();
		TERAPIA.initWkTerapie();
        home.TERAPIA = this;
	},
	event : function() {

	},
    calcolaDimensioneWk : function(){
        var contentTabs = parseInt($("div.contentTabs").height());
        var margine = 65;
        TERAPIA.dimensioneWk = contentTabs  - margine;
    },
	initWkTerapie : function() {
		if (!TERAPIA.WkFarmaci) {
			$("div#divWkFarmaci").height(TERAPIA.dimensioneWk);
			TERAPIA.WkFarmaci = new WK({
				id : "TERAPIE_ASSOCIATE",
				container : "divWkFarmaci",
				aBind : [ 'iden_contatto' ],
				aVal : [ $("#IDEN_CONTATTO").val() ]
			});
			TERAPIA.WkFarmaci.loadWk();
		}  else{
            TERAPIA.WkFarmaci.refresh();
        }
	},
    duplicaTerapia : function(iden){

        var parameters = {pIdenTerapia:{v:iden, t:'N'},
            p_result:{d:'O'}
        };
        var db = $.NS_DB.getTool({setup_default:{datasource:'PS',async:false}});

        var xhr = db.call_procedure({
            id: "PS_TERAPIE.DUPLICATERAPIA",
            parameter: parameters
        });
        xhr.done(function (data, textStatus, jqXHR) {

            var resp =  data.p_result.split('|');
            if(resp[0] == 'OK'){
                home.NOTIFICA.success({message: "Duplicazione Avvenuta", timeout: 5, title: 'Success'});
                home.TERAPIA.initWkTerapie();
            }else{
                home.NOTIFICA.error({message: "Attenzione errore nella duplicazione \n"+resp[1] , title: "Error"});
                logger.error('Errore nel duplica terapia : ' + data.p_result);
            }
        });
        xhr.fail(function (jqXHR, textStatus, errorThrown) {
            home.NOTIFICA.error({message: "Attenzione errore nella chiamata PS_TERAPIE.DUPLICATERAPIA", title: "Error"});
            logger.error("Errore in PS_TERAPIE.DUPLICATERAPIA jqXHR " +  JSON.stringify(jqXHR));
        });
    },
    eliminaTerapia:function(iden){
        var params = {
            pIdenTerapia: {"v":iden, "t":'N'},
            pIdenPer: {"v":home.baseUser.IDEN_PER, "t":"N"}

        };

        var parametri = {
            "datasource": "PS",
            "id": "PS_TERAPIE.cancellaSomministrazione",
            "params": params,
            "callbackOK": callbackOk
        };


        function callbackOk(){
              home.NOTIFICA.success({message: "Terapia cancellata", timeout: 5, title: 'Success'});
              home.TERAPIA.initWkTerapie();
        }
        NS_CALL_DB.PROCEDURE(parametri);
    }
};
