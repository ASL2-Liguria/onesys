var NS_STATISTICA = {

    init : function(){

        home.NS_CONSOLEJS.addLogger({name:'Statistica',console:0});
        window.logger = home.NS_CONSOLEJS.loggers['Statistica'];

        NS_STATISTICA.loadConfigurazione(NS_FILTRI_STATISTICHE.init);
    },

    loadConfigurazione : function(callback){

        var _file = $("#FILE").val();

        $.ajax({
            type: "GET",
            url: _file,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(json) {

                NS_STATISTICA.config = json;

                $.ajax({
                    url: NS_STATISTICA["config"]["GRID"]["FORMATTER_EXTENSION"],
                    dataType: "script",
                    success: function(){
                        $.extend(JQGridFormatter, JQGridFormatterExtension);
                    }
                });

                if (typeof callback == "function"){
                    callback();
                }
            },
            error: function( jqXHR, textStatus, errorThrown) {
                alert("The JSON File could not be processed correctly." + "\ntextStatus -> " + textStatus + "\nerrorThrown -> " + errorThrown);
            }
        });

    },

    config : {}
};