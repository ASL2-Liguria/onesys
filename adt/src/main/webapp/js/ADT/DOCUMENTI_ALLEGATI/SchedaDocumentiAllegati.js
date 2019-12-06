$(document).ready(function(){

    DOCUMENTI_ALLEGATI.init();
    DOCUMENTI_ALLEGATI.setEvents();

    NS_FENIX_SCHEDA.customizeJson = DOCUMENTI_ALLEGATI.myCustomizeJson;
//    $("#lblTitolo").html($("#lblTitolo").html() + "  -  " + $("#h-paziente").val());


});


var DOCUMENTI_ALLEGATI = {

    LOGGER : null,
    IDEN_ANAG : null,
    IDEN_TESTATA: null,
    extensions : [ "pdf", "xls", "xlsx", "png", "jpeg", "jpg", "gif", "doc", "bmp", "docx", "avi","txt" ],
    fileServerPath : null,
    extension : null,
    mymetype : null,
    cryptedPath : null,
    tab_sel: null,

    init : function(){

        home.NS_CONSOLEJS.addLogger( { name : "DOCUMENTI_ALLEGATI", console : 0  } );
        DOCUMENTI_ALLEGATI.LOGGER = home.NS_CONSOLEJS.loggers["DOCUMENTI_ALLEGATI"];

        DOCUMENTI_ALLEGATI.IDEN_ANAG    = $("input#IDEN_ANAG").val();
        DOCUMENTI_ALLEGATI.IDEN_TESTATA = $("input#IDEN_TESTATA").val();
        DOCUMENTI_ALLEGATI.fileServerPath = home.baseGlobal.PERCORSO_FILE_SERVER_UPLOAD_ALLEGATI;

        //alert( home.baseGlobal.PERCORSO_FILE_SERVER_UPLOAD_ALLEGATI);

        if( ! LIB.isValid(DOCUMENTI_ALLEGATI.IDEN_ANAG ) ) {

            DOCUMENTI_ALLEGATI.LOGGER.error("IDEN_ANAG non ricevuto in GET.");

            return;

        }
        $("#txtNomeAllegato").focus();

    },
    setEvents : function(){

        $("button.butImporta").on("click", function()
        {
            if(DOCUMENTI_ALLEGATI.checkField())
            {
                DOCUMENTI_ALLEGATI.beforeSave();
            }
        });

        $("button.butAcquisisci").on("click",function()
        {
            if(DOCUMENTI_ALLEGATI.checkField())
            {
                $("#lblAllegaFile").parent().hide();
                $("button.butAcquisisci").append($("<i>",{"id":"icon-scan-load"}).addClass("icon-spin3 animate-spin"));

                setTimeout(DOCUMENTI_ALLEGATI.scannerizza,1000);
            }


        });

        $("#AllegaFile").on("change",function(){

            $("#txtNomeAllegato").val( ( $(this).val().split("\\") )[ $(this).val().split("\\").length - 1 ].toString() );

        });

//        $()
        $('#tabs-SchedaDocumentiAllegati').children().click(function(){
            DOCUMENTI_ALLEGATI.tab_sel = $(this).attr('data-tab');
            DOCUMENTI_ALLEGATI.caricaWk();
        });

    },
    caricaWk:function(){

        switch  (DOCUMENTI_ALLEGATI.tab_sel) {
            case 'tabStorico' :
                $("#divWkdocumenti").height("300");
                DOCUMENTI_ALLEGATI.caricaWkStorico();
                break;
            case 'tabdati':
                         null;
                break;
            default:
                logger.error("tabulatore non riconosciuto " +DOCUMENTI_ALLEGATI.tab_sel );

        }
    },

    caricaWkStorico:function(){


        var wk =  new WK({
            id : "DOCUMENTI_ALLEGATI",
            container : "divWkdocumenti",
            aBind : ["iden_anagrafica"],
            aVal : [$("#IDEN_ANAG").val()]
        });

        wk.loadWk();


    },
    checkField:function()
    {
        var nomefile                = $("#txtNomeAllegato").val();
        //var allegaPazienteEpisodio  = $("#radAllegaPazienteEpisodio").data("RadioBox").val();

        if( ! LIB.isValid( nomefile ) || nomefile === "" ){

            home.NOTIFICA.warning({

                message: "Specificare un nome per il file da caricare",
                title: "Attenzione"

            });

            return false;

        }

       /* if( allegaPazienteEpisodio === "" ) {

            home.NOTIFICA.warning({

                message: "Occorre selezionare se allegare il file alla prestazione o al paziente.",
                title: "Attenzione"

            });

            return false;

        }

        if( allegaPazienteEpisodio == "P" ) {

            this.IDEN_TESTATA   = "";

        } */

        return true;
    },

    beforeSave : function(){

        var file = $("#AllegaFile").val();

        if( this.checkExtension( file ) == -1 ) {

            home.NOTIFICA.warning({

                message: "L'estensione del file che si sta tentando di caricare non e' supportata! <br>Le estensioni ammesse sono:<br> " + this.extensions.join(", "),
                title: "Attenzione"

            });

            return false;

        }
        $("input#IDEN_ANAG").clone().appendTo("form#dati");

        this.saveFile();

        return true;

    },

    checkExtension : function( file ){

        var ext         = file.split(".");
        ext             = ext[ ext.length -1 ].toString().toLowerCase();

        return $.inArray( ext, this.extensions );

    },
    saveScan:function(b64){
        DOCUMENTI_ALLEGATI.LOGGER.info ('Scan Finisched');
        if( b64 == null || b64.length==0)
        {
            DOCUMENTI_ALLEGATI.LOGGER.error ('Document non Found');
            home.NOTIFICA.error({
                message: "Si e' verificato un errore: Documento non presente",
                title: "Errore"
            });
            return;
        }

        var nome_file = $("#cmbTipologia option:selected").val()+"_"+$("#txtNomeAllegato").val();
        $.support.cors = true;
        $.ajax({
            url: DOCUMENTI_ALLEGATI.fileServerPath,
            data: {"IDEN_ANAG":DOCUMENTI_ALLEGATI.IDEN_ANAG,"txtNomeAllegato":nome_file,"FileBase64":b64},
            dataType : "json",
            type : "POST",
            error: function ()
            {
                DOCUMENTI_ALLEGATI.LOGGER.error("Errore comunicazione con FileServer.");
                NOTIFICA.error({
                    message: "Errore nel salvataggio del referto",
                    title: "Error!",
                    timeout: 0,
                    width: 300
                })
            }
        }).done(function(r) {
                if( r.status === "OK" )
                {

                    home.NOTIFICA.success({

                        message: "Il file e' stato  caricato correttamente.",
                        title: "Success!"

                    });

                    var nomefile = $("#txtNomeAllegato").val();
                    DOCUMENTI_ALLEGATI.LOGGER.info ('Nome file Da Archiviare:' + nomefile);
                    var extension = 'pdf'
                    DOCUMENTI_ALLEGATI.LOGGER.info('Estensione file Da Archiviare:' + nomefile);
                    DOCUMENTI_ALLEGATI.cryptedPath = r.message;
                    DOCUMENTI_ALLEGATI.LOGGER.info('Path Cryptato file Da Archiviare:' + nomefile);
                    DOCUMENTI_ALLEGATI.mymetype = LIB.getMymeType( extension );


                    DOCUMENTI_ALLEGATI.savePath();
                }
                else
                {
                    home.NOTIFICA.error({

                        message: "Si e' verificato un errore durante il caricamento del file",
                        title: "Errore"

                    });
                }
            });
    },
    saveFile : function(){

        $.support.cors = true;

        home.NS_LOADING.showLoading();

        $("form#dati").attr( { "enctype" : "multipart/form-data" , "action" : this.fileServerPath, "method" : "POST" } );

        $("form#dati").ajaxForm({

            url : DOCUMENTI_ALLEGATI.fileServerPath+"?IDEN_ANAG="+ this.IDEN_ANAG,
            crossDomain : true ,
            dataType : "json",
            type : "POST"

        }).ajaxSubmit({

                success : function( response ){

                    home.NS_LOADING.hideLoading();

                    response   = $.parseJSON( response );


                    if( response.status === "OK" ) {

                        home.NOTIFICA.success({

                            message: "Il file e' stato caricato correttamente.",
                            title: "Success!"

                        });

                        var extension                      = ( $("#AllegaFile").val().split(".") )[ $("#AllegaFile").val().split(".").length -1 ].toString();
                        DOCUMENTI_ALLEGATI.cryptedPath     = response.message;
                        DOCUMENTI_ALLEGATI.mymetype        = LIB.getMymeType( extension );
                        DOCUMENTI_ALLEGATI.savePath();


                    } else if( response.status === "KO" ) {

                        home.NOTIFICA.error({

                            message: "Si e' verificato un errore durante il caricamento del file",
                            title: "Errore"

                        });

                        DOCUMENTI_ALLEGATI.LOGGER.error ( response.message );

                    } else if( response.status === "WARN" ) {

                        home.NOTIFICA.warning({

                            message: response.message,
                            title: "Attenzione"

                        });

                        DOCUMENTI_ALLEGATI.LOGGER.error ( response.message );

                    }

                }

            });

    },
    savePath : function() {

        DOCUMENTI_ALLEGATI.LOGGER.info ('Richiamata   NS_FENIX_SCHEDA.registra');
        NS_FENIX_SCHEDA.registra();      //{"close":true}
    },
    scannerizza:function(){
      /* DOCUMENTI_ALLEGATI.saveScan(home.AppStampa.scan(home.basePC.SCANNER,"","")); */

        var res = home.AppStampa.scan(home.basePC.SCANNER,"","",DOCUMENTI_ALLEGATI.fileServerPath,$("#txtNomeAllegato").val(),DOCUMENTI_ALLEGATI.IDEN_ANAG);
        eval("var r = "+res);
        DOCUMENTI_ALLEGATI.LOGGER.debug ('risposta scansione:' + r);
        $("#icon-scan-load").remove();

        if(r==null){
            DOCUMENTI_ALLEGATI.LOGGER.error('Errore Scansione PD');
            return;
        }

        if( r.status === "OK" )
        {

            home.NOTIFICA.success({
                message: "Il file e' stato  caricato correttamente.",
                title: "Success!"
            });

            var nomefile = $("#txtNomeAllegato").val();
            var extension = 'pdf'
            DOCUMENTI_ALLEGATI.cryptedPath = r.message;
            DOCUMENTI_ALLEGATI.mymetype = LIB.getMymeType( extension );
            DOCUMENTI_ALLEGATI.savePath();
        }
        else
        {
            DOCUMENTI_ALLEGATI.LOGGER.error('Errore Salvataggio File:' + r.message);
            home.NOTIFICA.error({

                message: "Si e' verificato un errore durante il caricamento del file",
                title: "Errore"

            });
        }
    },

    myCustomizeJson : function( json ) {

        json.campo.push(

            {
                "id" :"mimetype",
                "col":"MIME_TYPE",
                "val": DOCUMENTI_ALLEGATI.mymetype
            },
            {
                "id" : "path",
                "col": "URL_DOCUMENTO",
                "val": DOCUMENTI_ALLEGATI.cryptedPath
            },
            {
                "id" :"IDEN_ANAG",
                "col":"IDEN_ANAGRAFICA",
                "val": DOCUMENTI_ALLEGATI.IDEN_ANAG
            },
            {
                "id" : "IDEN_TESTATA",
                "col": "IDEN_ESAMI_TESTATA",
                "val": DOCUMENTI_ALLEGATI.IDEN_TESTATA
            },
            {
                "id" : "UTENTE_INSERIMENTO",
                "col": "UTENTE_INSERIMENTO",
                "val": home.baseUser.IDEN_PER
            }

        );

        return json;

    }

}
var  NS_WK = {


    apriDocumentoAllegato:function(url,mime_type,nome_file)
    {
        if(mime_type=='application/pdf')
        {
        	_par = {"URL":home.baseGlobal.PERCORSO_FILE_SERVER_DOCUMENTI + url }
        	_par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;
        	
        	home.NS_FENIX_PRINT.caricaDocumento(_par);            
            home.NS_FENIX_PRINT.apri(_par);
        }
        else if(mime_type=='audio/wav')
        {

            if(LIB.isValid( home.SPEECHMAGIC))
            {
                home.SPEECHMAGIC.loadAudio(url);
            }
        }
        else
        {
        window.open(home.baseGlobal.PERCORSO_FILE_SERVER_DOCUMENTI + url + "&MIME_TYPE="+mime_type + "&NOME_FILE=" +nome_file);
        // home.NS_FENIX_TOP.apriPagina({url: home.baseGlobal.PERCORSO_FILE_SERVER_DOCUMENTI + url + "&MIME_TYPE="+mime_type + "&NOME_FILE=" +nome_file,id:'doc',fullscreen:true,showloading:false})
        }
    },
    apriDocumentoAllegato:function(url,mime_type,nome_file)
    {
        if(mime_type=='application/pdf')
        {
        	_par = {"URL":home.baseGlobal.PERCORSO_FILE_SERVER_DOCUMENTI + url }
        	_par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;
        	
        	home.NS_FENIX_PRINT.caricaDocumento(_par);            
            home.NS_FENIX_PRINT.apri(_par);
        }
        else if(mime_type=='audio/wav')
        {

            if(LIB.isValid( home.SPEECHMAGIC))
            {
                home.SPEECHMAGIC.loadAudio(url);
            }
        }
        else
        {
            window.open(home.baseGlobal.PERCORSO_FILE_SERVER_DOCUMENTI + url + "&MIME_TYPE="+mime_type + "&NOME_FILE=" +nome_file);
        }
    },
    cancella:function(url,mime_type,nome_file)
    {
        if(mime_type=='application/pdf')
        {
        	_par = {"URL":home.baseGlobal.PERCORSO_FILE_SERVER_DOCUMENTI + url }
        	_par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;
        	
        	home.NS_FENIX_PRINT.caricaDocumento(_par);            
            home.NS_FENIX_PRINT.apri(_par);
        }
        else if(mime_type=='audio/wav')
        {

            if(LIB.isValid( home.SPEECHMAGIC))
            {
                home.SPEECHMAGIC.loadAudio(url);
            }
        }
        else
        {
            window.open(home.baseGlobal.PERCORSO_FILE_SERVER_DOCUMENTI + url + "&MIME_TYPE="+mime_type + "&NOME_FILE=" +nome_file);
            // home.NS_FENIX_TOP.apriPagina({url: home.baseGlobal.PERCORSO_FILE_SERVER_DOCUMENTI + url + "&MIME_TYPE="+mime_type + "&NOME_FILE=" +nome_file,id:'doc',fullscreen:true,showloading:false})
        }
    }
}