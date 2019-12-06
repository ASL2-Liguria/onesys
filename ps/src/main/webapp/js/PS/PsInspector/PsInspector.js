



$("document").ready(function(){
    PS_WK_INSPECTOR.init();
});

var PS_WK_INSPECTOR = {

    tabs:null,
    init:function(){

        home.PS_WK_INSPECTOR = this;
        PS_WK_INSPECTOR.caricaWkAperti();
        PS_WK_INSPECTOR.setEvents();
    },

    setEvents: function(){

        $(".ulTabs").find("li").on("click", function(){PS_WK_INSPECTOR.selezionaWk($(this))});


    },

    refreshWk: function() {
        NS_FENIX_WK.aggiornaWk();
    },



    events : {

        keyupDescr: function () {

            PS_WK_INSPECTOR.descrizione.val(PS_WK_INSPECTOR.descrizione.val().toUpperCase());

        }
    },

    caricaWkAperti: function(){
        var params = {
            "id"    : "PS_WK_INSPECTOR"
        }

        this.wk = new WK(params);
        this.wk.loadWk();
    },

    caricaWkChiusi: function(){
        var params = {
            "id"    : "PS_WK_INSPECTOR_CHIUSI"
        }

        this.wk = new WK(params);
        this.wk.loadWk();
    },

    selezionaWk: function(elem){
        if(elem.attr("id") == "li-lblcontattiAperti"){
            PS_WK_INSPECTOR.caricaWkAperti();

        }
        else{
            PS_WK_INSPECTOR.caricaWkChiusi();
        }

    }


};
