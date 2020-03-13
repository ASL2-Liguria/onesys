var NS_FENIX_FIRMA = {
    LOGGER:null,
    init: function () {
        NS_CONSOLEJS.addLogger({name:"FIRMA",console:0});
        this.LOGGER = NS_CONSOLEJS.loggers["FIRMA"];
    },
    setEvents: function () {
        $("#butValida").on("click", function ()
        {
            FIRMA.valida();
        });
        $("#butValidaEsci").on("click", function ()
        {
            FIRMA.okAttivaVersione = function(){
                NS_FENIX_PRINT.chiudi({});
                if(home.CONSOLE)
                {
                    home.CONSOLE.chiudi();
                }
            };

            FIRMA.valida();
        });
        $("#butValidaStampaEsci").on("click", function ()
        {
            FIRMA.okAttivaVersione = function(){
                NS_FENIX_PRINT.stampa({});
                NS_FENIX_PRINT.chiudi({});
                if(home.CONSOLE)
                {
                    home.CONSOLE.chiudi();
                }

            };
            FIRMA.valida();

        });
        $("#butFirma").on("click", function ()
        {
            var pin = FIRMA.getPin();
            if (pin == "")
            {
                NOTIFICA.error({
                    message: "Inserire il PIN",
                    title: "Error!",
                    timeout: 3,
                    width: 200
                });
                return;
            }
            FIRMA.firma({'pin':pin});
        });

        $("#butFirmaAnnullativoRis").on("click", function () {
            var pin = FIRMA.getPin();
            if (pin == "") {
                NOTIFICA.error({
                    message: "Inserire il PIN",
                    title: "Error!",
                    timeout: 3,
                    width: 200
                });
                return;
            }

            var resp = window.confirm(traduzione.alertFirmaAnnullativa);
            if (resp)
                FIRMA.firmaAnnullativa({'pin': pin});

        });

        $("#butFirmaRemota").on("click", function ()
        {
            var psw = FIRMA.getPsw();
            var otp = FIRMA.getOTP();
            if (psw == "")
            {
                NOTIFICA.error({
                    message: "Inserire la Password",
                    title: "Error!",
                    timeout: 3,
                    width: 200
                });
                return;
            }
            if (otp == "")
            {
                NOTIFICA.error({
                    message: "Inserire l'OTP",
                    title: "Error!",
                    timeout: 3,
                    width: 200
                });
                return;
            }
            FIRMA.firma({'password':psw,'OTP':otp});
        });


        $("#butRichiediOTP").on("click",function(){
            var psw = FIRMA.getPsw();
            if (psw == "")
            {
                NOTIFICA.error({
                    message: "Inserire la Password",
                    title: "Error!",
                    timeout: 3,
                    width: 200
                });
                return;
            };
            FIRMA.despatchOTP({'password':psw});
        });
        $("#butFirmaStandard").on("click",function(){
            FIRMA.firma("01");
        });
        $("#butFirmaIntegrativo").on("click",function(){
            FIRMA.firma("02");
        });
        $("#butFirmaSostitutivo").on("click",function(){
            FIRMA.firma("03");
        });
        $("#butFirmaAnnullativo").on("click",function(){
            FIRMA.firma("04");
        });
        $("#butOscuramenti").on("click",function(){
            var _params ={};
            _params.left = $(this).position().left;
            _params.top = $(this).position().top;
            _params.width = $(this).parent().width();
            _params.iden_ref = FIRMA.getDati("iden_referto");

            FIRMA.openOscuramenti();
        });

    },
    obj: {
        PDF_SIGNED_EXT:".pdf",
        PDF_EXT:".pdf",
        P7M_EXT:".p7m",
        dati:null,
        init:function(){NS_FENIX_FIRMA.LOGGER.warn("Nessuna firma configurata! Sei Sicuro???")},
        setDati:function(dati){
            this.dati = dati;
            NS_FENIX_FIRMA.LOGGER.debug("Dati settati: "+JSON.stringify(this.dati));
        },
        getDati:function(nome){return (this.dati[nome])?this.dati[nome]:"";},
        getPin:function(){
            var $pin = $("#txtPin");
            return ($pin.length)?$pin.val(): "";
        },
        getPsw:function(){
            var $psw = $("#txtPassword");
            return ($psw.length)?$psw.val(): "";
        },
        beforeValida:function(param){return true;},
        initValida:function(param){return true;},
        okValida:function(){},
        koValida:function(){},
        valida: function (param) {

        },
        beforeFirma:function(param){return true;},
        firma: function (param) {
            if(!this.beforeFirma(param)){NS_FENIX_FIRMA.LOGGER.warn("beforeFirma return false");return false;}
            appletFenix.firma(param['pin'],'NS_FENIX_FIRMA.okFirma','NS_FENIX_FIRMA.koFirma');
        },
        okFirma:function(resp){},
        koFirma:function(resp){},
        firmaAnnullativa:function(params){},
        getDatiArchivia:function(resp){},
        archiviaDocumento: function (){},
        okArchiviaDocumento:function(){},
        koArchiviaDocumento:function(){},
        getDatiAttivaVersione:function(){},
        attivaVersione: function(){},
        okAttivaVersione:function(){NS_FENIX_FIRMA.LOGGER.debug("okAttivaVersione");},
        koAttivaVersione:function(){NS_FENIX_FIRMA.LOGGER.debug("koAttivaVersione");}
    },
    getInstance:function(objExtension){
        if(objExtension){
            var _objExtension = (typeof(objExtension)=="string")?eval(objExtension):objExtension;
            NS_FENIX_FIRMA.LOGGER.debug("getInstance : " + objExtension);
            return $.extend({},NS_FENIX_FIRMA.obj, _objExtension);
        }else{
            return $.extend({}, NS_FENIX_FIRMA.obj);
        }
    }

}


