/**
 * author: Matteop
 * Js del pop-up della scelta medica nel passaggio di consegne
 * gestisce  passaggio di consegne
 * */
$(function() {
    SCELTA_MEDICA.init();
    SCELTA_MEDICA.setEvents();
    NS_FENIX_SCHEDA.registra = SCELTA_MEDICA.registra;
});

var SCELTA_MEDICA = {

    //validator : home.NS_FENIX_SCHEDA.addFieldsValidator({config: "V_SCELTA_MEDICO"}),
    validator : null,

    init : function() {
        NS_FENIX_SCHEDA.customizeParam = function(params){ params.extern = true; return params; };
        $(".contentTabs").css({"height":"300px"});
        SCELTA_MEDICA.validator = NS_FENIX_SCHEDA.addFieldsValidator({config: "V_SCELTA_MEDICO"});

        var type = $("#TYPE").val();

        if(type == "PASSAGGIO_DI_CONSEGNE_LISTA_APERTI" || type == "PASSAGGIO_DI_CONSEGNE_LISTA_OBI"){
            $("#cmbAreaPS").closest("tr").show();
            $("#cmbUbicazione").closest("tr").show();
        }else{
            $("#cmbAreaPS").closest("tr").hide();
            $("#cmbUbicazione").closest("tr").hide();
        }
        //$('#acSceltaMedico').data('acList').changeBindValue({"iden_cdc": Number(home.baseUserLocation.iden)});
    },

    setEvents : function() {

        $("#cmbAreaPS").on("change", function(){
            SCELTA_MEDICA.valorizeUbicazione();
        });

    },

    registra:function(){
        var medico =  $('#h-txtSceltaMedico').val();

        if(NS_FENIX_SCHEDA.validateFields() &&  medico != ''){
            var cmbArea = $("#cmbAreaPS");
            var param = null;
            if(cmbArea.isVisible()){
                var optAreaSel = cmbArea.find("option:selected");
                var idenCdc =  optAreaSel.data("iden_cdc");
                var idenArea = optAreaSel.val();
                var ubicazione = $("#cmbUbicazione").find("option:selected").val();
                if(idenCdc != '' && LIB.isValid(idenCdc)&& idenArea != '' && LIB.isValid(idenArea)&& ubicazione != '' && LIB.isValid(ubicazione)) {
                    param = {
                        iden_cdc : idenCdc,
                        iden_area : idenArea ,
                        ubicazione : ubicazione
                    } ;
                }
            }
            home.NS_WK_PS.passaggioDiConsegne(medico, null, 'PASSAGGIO_DI_CONSEGNE_LISTA_APERTI',param);
            return NS_FENIX_SCHEDA.chiudi();
        }
    },

    valorizeUbicazione : function() {

        var id = $("#cmbAreaPS").find("option:selected").data("iden_cdc");
        var db = $.NS_DB.getTool();
        var dbParams = {"iden_cdc": {v: id, t: "N"}};

        var xhr = db.select({
            datasource: "PS",
            id        : "PS.Q_UBICAZIONE",
            parameter : dbParams
        });

        xhr.done(function (response) {
            var ubicazione = $("#cmbUbicazione");

            ubicazione.find("option").remove();

            var option = document.createElement("option");
            document.getElementById('cmbUbicazione').appendChild(option);

            for(var i = 0; i < response.result.length; i++) {
                var opt = document.createElement('option');
                opt.setAttribute('data-descr', response.result[i].DESCR);
                opt.setAttribute('data-value', response.result[i].VALUE);
                opt.setAttribute('data-codice_decodifica', response.result[i].CODICE_DECODIFICA);
                opt.value = response.result[i].VALUE;
                opt.setAttribute('id', 'cmbUbicazione_' + response.result[i].VALUE);
                var isFirefox = typeof InstallTrigger !== 'undefined';

                if(isFirefox) {
                    opt.textContent = response.result[i].DESCR;
                }
                else {
                    opt.innerText = response.result[i].DESCR;
                }

                document.getElementById('cmbUbicazione').appendChild(opt);
            }

            if(id != '' && typeof id != 'undefined'){
                SCELTA_MEDICA.validator._attachStatus(ubicazione, {"status": "required"});
            }else{

                SCELTA_MEDICA.validator.removeStatus(ubicazione);
            }

            // ubicazione.find("option[value=" + hUbicazione + "]").attr("selected", "selected");

        });
    },

    valorizeArea : function (param) {
        var db = $.NS_DB.getTool();
        var dbParams = {"iden_per": {v: param.VALUE, t: "N"}};

        var xhr = db.select({
            datasource: "PS",
            id        : "PS.Q_AREE_UTENTE",
            parameter : dbParams
        });

        xhr.done(function (response) {
            var area = $("#cmbAreaPS");

            area.find("option").remove();

            var option = document.createElement("option");
            document.getElementById('cmbAreaPS').appendChild(option);

            for(var i = 0; i < response.result.length; i++) {
                var opt = document.createElement('option');
                /*
                 iden_cdc : optAreaSel.data("iden_cdc"),
                 iden_provenienza : optAreaSel.data("iden_provenienza"),
                 iden_area : optAreaSel.val() ,
                 */
                opt.setAttribute('data-iden_cdc', response.result[i].IDEN_CDC);
                opt.value = response.result[i].VALUE;
                opt.setAttribute('id', 'cmbUbicazione_' + response.result[i].VALUE);
                var isFirefox = typeof InstallTrigger !== 'undefined';
                if(isFirefox) {
                    opt.textContent = response.result[i].DESCR;
                }
                else {
                    opt.innerText = response.result[i].DESCR;
                }

                document.getElementById('cmbAreaPS').appendChild(opt);
            }

        });
    }
};