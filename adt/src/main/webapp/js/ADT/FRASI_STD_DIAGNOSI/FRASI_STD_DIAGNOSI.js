
$(function() {
    FRASI_STD.init();
    FRASI_STD.setEvents();
});
var ta =$("#TA").val();
var FRASI_STD = {
    wkFrasi:null,
    init : function() {
        home.FRASI_STD_REFERTAZIONE = window;
        $("input#txtGruppo").val($("input#GRUPPO").val()).addClass("mousetrap");
        $("input#txtCodDescr").addClass("mousetrap");
        FRASI_STD.initWkFrasi();
    },
    setEvents : function() {
        $(".butApplica").bind("click",function(){
            var rec=FRASI_STD.wkFrasi.getArrayRecord()[0];
            if (typeof rec=='undefined') {return alert("Selezionare una frase")}
            FRASI_STD.applica(rec.FRASE);
        });
        $(".btnCerca").bind("click",FRASI_STD.aggiorna);
        Mousetrap.bind('enter',FRASI_STD.aggiorna);

    },
    applica : function(pFrase) {
        var obj = top.$("#iScheda-1").contents().find('#'+ta);
        var testo = obj.val();
        if (testo==''){
            obj.val(pFrase);
        }
        else{
            obj.val(testo+'  '+pFrase);
        }
        NS_FENIX_SCHEDA.chiudi({});

    },
    aggiorna : function() {
        $("input#txtGruppo").val($("input#txtGruppo").val().toUpperCase());
        $("input#txtCodDescr").val($("input#txtCodDescr").val().toUpperCase());
        var vGruppo = $("input#txtGruppo").val()==''?'%25':$("input#txtGruppo").val();
        var vCodice, vDescr;
        if ($("#radCodDescr").data("RadioBox").val()=='COD') {
            vCodice = '%25'+$("input#txtCodDescr").val()+'%25';
            vDescr = '%25';
        } else {
            vCodice = '%25';
            vDescr = '%25'+$("input#txtCodDescr").val()+'%25';
        }
        FRASI_STD.wkFrasi.filter({
            aBind : ['gruppo','codice','descrizione'],
            aVal : [vGruppo, vCodice, vDescr]
        });
    },
    initWkFrasi : function() {
        if (!FRASI_STD.divWkFrasi) {
            $("div#divWkFrasi").height("300px").width('98%');
            var vGruppo = $("input#txtGruppo").val()==''?'%25':$("input#txtGruppo").val().toUpperCase();
            var vCodice = '%25'+$("input#txtCodDescr").val().toUpperCase()+'%25';
            var vDescr = '%25';
            FRASI_STD.wkFrasi = new WK({
                id : "FRASI_STD_REFERTAZIONE",
                container : "divWkFrasi",
                aBind : ['gruppo','codice','descrizione'],
                aVal : [vGruppo, vCodice, vDescr],
                loadData:true
            });
            FRASI_STD.wkFrasi.loadWk();
        }
    },
    inserisciDettaglio : function(pKeyLegame, pWk) {
        home.NS_FENIX_TOP.apriPagina({
            url : 'page?KEY_LEGAME=' + pKeyLegame+'&_STATO_PAGINA=I',
            id : 'frasi_std_inserimento',
            fullscreen : true
        });
    },
    modificaDettaglio : function(pKeyLegame, Iden, pWk) {
        home.NS_FENIX_TOP.apriPagina({
            url : 'page?KEY_LEGAME=' + pKeyLegame + '&_STATO_PAGINA=E&IDEN_FRASE='
                + Iden, id : 'frasi_std_inserimento',
            fullscreen : true});
    }
};
