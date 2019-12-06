/**
 * Created by alberto.mina on 06/05/2015.
 */

$(document).ready(function(){

    NS_SCHEDA_POTESTA.init();
    NS_SCHEDA_POTESTA.setEvents();

});



var NS_SCHEDA_POTESTA = {
    codice_fiscale : null,

    init: function(){
        home.PANEL.NS_REFERTO.SALVA_SCHEDA = "S";
        NS_FENIX_SCHEDA.addFieldsValidator({config:"V_PS_ANAGRAFICA"});
    },

    setEvents: function(){
        $('#txtDataNasc').on("change blur", function() {
            var clicked = '';
            NS_SCHEDA_POTESTA.checkData(clicked);


        }).on("keydown", function(e){
                if ((e.which || e.keyCode) == 9) {
                    NS_SCHEDA_POTESTA.checkData('');
                }
         });


        $("#txtCognome, #txtNome, #txtDataNasc, #h-radSesso, #txtLuogoNasc").on("blur change", NS_SCHEDA_POTESTA.gestModificaCodFisc);

        $('.butInserisci').on('click', function(){NS_SCHEDA_POTESTA.registra()});

    },

    gestisciCodiceFiscale:function(){


        $("#txtCodFisc").val(NS_SCHEDA_POTESTA.getCodiceFiscale);

    },
    getCodiceFiscale:function(){

        var cognome = document.getElementById('txtCognome').value;
        var nome = document.getElementById('txtNome').value;
        var datanascita = document.getElementById('txtDataNasc').value;
        var sesso = document.getElementById('h-radSesso').value;
        var codluogonascita = $('#hCodComNasc').val();

        if(codluogonascita == '')
        {
            //in caso di nuovo paziente hdcomnas risulta nullo, recupero valore da tag generato
            codluogonascita = $('#txtLuogoNasc').attr("data-c-codice_comune");
        }

        //alert(cognome + '\n' + nome +'\n' + datanascita + '\n' + sesso  +'\n'+ codluogonascita);

        if (cognome == '' || nome == '' || datanascita == '' || sesso == '' || codluogonascita == '')	return;

        var cod_fisc = ns_controllo_cod_fisc.calcola_cfs(cognome, nome, datanascita, sesso, codluogonascita);
        NS_SCHEDA_POTESTA.codice_fiscale = cod_fisc;
        //NS_ANAGRAFICA_SALVATAGGIO.codice_fiscale = NS_ANAGRAFICA.codice_fiscale;

        return cod_fisc;

    },

    gestModificaCodFisc:function(){

        var cognome =  $("#txtCognome").val();
        var nome =$("#txtNome").val();
        var dataNascita = $("#txtDataNasc").val();
        var sesso = $("#h-radSesso").val();
        var comune = $("#h-txtLuogoNasc").val();



        if(cognome != '' && nome != '' &&  dataNascita != '' && sesso != '' && comune!= '' ){


            NS_SCHEDA_POTESTA.gestisciCodiceFiscale();
        }


    },

    checkData : function(clicked){


        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        today = Number(yyyy + mm + dd);

        var dataNasc = $('#txtDataNasc');
        var tDD = dataNasc.val().substr(0, 2);
        var tMM = dataNasc.val().substr(3, 2);
        var tYYYY = dataNasc.val().substr(6, 4);

        var tDate = Number(tYYYY + tMM + tDD);


        if (tDate < 19000000 && tDate != 0|| tDate > today ) {
            home.NOTIFICA.error({message: "Data selezionata non corretta", title: "Error"});
            $('.butSalva').hide();
            $("#h-txtDataNasc").val("");
            NS_SCHEDA_POTESTA.alertData(dataNasc);

        }

        else {
            dataNasc.removeClass("tdError");
            dataNasc.addClass("tdObb");
            $('.butSalva').show();

        }

    },

    alertData: function (t) {
        $.dialog("Data inserita non corretta",
            {title: "Attenzione",
                buttons: [
                    {label: "OK", action: function () {

                        t.val("");
                        t.removeClass("tdObb");
                        t.addClass("tdError");
                        $.dialog.hide();
                    }}
                ]
            }
        );
    },

    hasAValue : function(value){
        return (("" !== value)&&(undefined !== value)&&(null !== value));
    },


    registra:function(){


        var metodo = NS_ANAGRAFICA.stato_pagina == 'E' ? 'MODIFICA': 'INSERIMENTO';
        var cognome = $('#txtCognome').val();
        var nome = $('#txtNome').val();
        var data =   $("#h-txtDataNasc");
        data =  NS_SCHEDA_POTESTA.hasAValue(data.val()) ? data.val() : moment().format('YYYYMMDD');
        var sesso = $("#h-radSesso").val();
        var comune_nascita = $("#h-txtLuogoNasc").val();
        var codice_fiscale = $("#txtCodFisc").val();
        var idRis = NS_ANAGRAFICA_SALVATAGGIO.IDEN_ANAGRAFICA;
        NS_ANAGRAFICA_SALVATAGGIO.callback = NS_SCHEDA_POTESTA.callback;


        var json = {
            metodo             : metodo,
            codice_fiscale     : codice_fiscale,
            cognome            : cognome,
            sesso              : sesso,
            data_nascita       : data,
            nome               : nome,
            comune_nascita     : comune_nascita,
            indirizzo_residenza: '',
            civico_residenza   : '',
            comune_residenza   : '',
            provincia_residenza: '',
            cap_residenza      : '',
            indirizzo_domicilio: '',
            civicoDomicilio    : '',
            comune_domicilio   : '',
            provincia_domicilio: '',
            cap_domicilio      : '',
            cod_reg_res        : '',
            cod_reg            : '',
            cod_asl_res        : '',
            cod_reg_dom        : '',
            cod_asl_dom        : '',
            medico_base        : '',
            cellulare          : '',
            mail               : '',
            stato_civile       : '',
            livello_istruzione : '',
            professione        : '',
            cittadinanza       : '',
            stp                : '',
            scadenzaStp        : '',
            eni                : '',
            scadenzaENI        : '',
            tessera_sanitaria  : '',
            tessera_sanitaria_scadenza : '',
            telefono_residenza : '',
            url_template       : 'js/PS/SchedaAnagrafica/XMLAnagrafica.txt'

        };
        //alert(json);
        var pinAAC = $("#hRiconosciuto").val();
        if(pinAAC != '' && pinAAC != null){
            json.identificativoRemoto = pinAAC;
        }
        if(idRis != '' && idRis != null){
            json.idRis = idRis;
        }

        NS_ANAGRAFICA_SALVATAGGIO.callback = function () {
                NS_SCHEDA_POTESTA.getDatiPotesta();
                home.NS_LOADING.hideLoading();
                NS_FENIX_SCHEDA.chiudi();

            };



        NS_ANAGRAFICA_SALVATAGGIO.registra(json);



    },



    getDatiPotesta: function(){
        var nomeCognome = $('#txtNome').val() + ' ' +$('#txtCognome').val();
        var idenAnag = NS_ANAGRAFICA_SALVATAGGIO.IDEN_ANAGRAFICA
        NS_SET_POTESTA.setPotesta(idenAnag, nomeCognome);

    }


}