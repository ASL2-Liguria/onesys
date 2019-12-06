/**
 * Created by matteo.pipitone on 06/03/2015.
 */



$(document).ready(function(){
    home.document.title = 'Onesys';

   /* var myEvent = home.window.attachEvent || home.window.addEventListener;
    var chkevent = home.window.attachEvent ? 'onbeforeunload' : 'beforeunload'; /// make IE7, IE8 compitable

            myEvent(chkevent, function(e) { // For >=IE7, Chrome, Firefox
                    var confirmationMessage = "Vuoi uscire dall'applicativo?";  // a space
                   (e || home.window.event).returnValue = confirmationMessage;
                    return confirmationMessage;
                });*/



});
var NS_FENIX_PS ={
    init:function(){
        logger.debug("home.NS_FENIX_PRINT prima");
        home.NS_FENIX_PRINT = $.extend({},NS_FENIX_PRINT, NS_PS_PRINT);
        logger.debug("home.NS_FENIX_PRINT dopo");
        logger.debug("home.NS_FENIX_PRINT nuovo setevents -> " + NS_PS_PRINT.setEvents);
        home.NS_FENIX_FIRMA = NS_FENIX_FIRMA;
        try{
            home.FIRMA = NS_FENIX_FIRMA.getInstance(FIRMA_PS);
        }catch(e){

        }
        home.NS_FENIX_PS = this;

      //  NS_FENIX_PRINT.getDefaultParams = NS_FENIX_PS.getDefaultParams;

    },
    setEvents:function(){
       /* home.$("#butInvia").on("click", function(){

            NS_LOADING.showLoading({"timeout": "0", "testo": "INVIO MODULO", "loadingclick": function () {
                NS_LOADING.hideLoading();
            }});

            logger.debug("INVIO MODULO CON IDEN_SCHEDA -> " + home.NS_FENIX_PS.IDEN_SCHEDA);


            home.NS_MODULISTICA_FUNZIONI_COMUNI.insertDataInvio({
                IDEN_SCHEDA: home.NS_FENIX_PS.IDEN_SCHEDA,
                callback : function(){
                    home.$("#butChiudi").off("click").on("click",function(){ home.FIRMA.chiudi(); });

                    home.NOTIFICA.success({message: "Documento inviato correttamente", timeout: 4, title: 'Success',width : 220});
                    home.NS_LOADING.hideLoading();
                }

            });

        });  */
    }
     /*
      ,

      getDefaultParams : function(){

      var param = $.extend({},{},NS_FENIX_PRINT.config);

      logger.debug("NS_FENIX_PRINT.getDefaultParams param -> " + JSON.stringify(param));

      if(LIB.isValid(basePC.STAMPANTE_CONFIGURAZIONE)){
      param['CONFIG'] = baseGlobal.STAMPANTE_CONFIGURAZIONE;
      }

      NS_FENIX_PRINT.config = null;

      logger.debug("NS_FENIX_PRINT.config controllo di averlo svuotato -> " + JSON.stringify(NS_FENIX_PRINT.config) + "\n param dovrebbe essere rimasto a posto -> " + JSON.stringify(param));

      return param;

      }
      */
};

var NS_PENTAHO = {
    apriPentaho: function(username,password){

        $('<form>', {
            "id": "apriPentaho",
            "method": "POST",
            "html": '<input type="text" id="userid" name="userid" value="' + username + '" /><input type="text" id="password" name="password" value="' + password + '" />',
            "action": 'http://10.106.0.128:8082/pentaho/Home?',
            "target": '_blank'
        }).appendTo(document.body).submit();


    }
}