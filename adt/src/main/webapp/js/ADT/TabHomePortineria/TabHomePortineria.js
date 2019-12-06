/**
 * User: matteopi
 * Date: 16/06/14
 * Time: 11.21
 */

jQuery(document).ready(function () {

    NS_HOME_PORTINERIA.init();
});

var NS_HOME_PORTINERIA = 
{
		tab_sel:null,
		wk_pazienti_ricoverati:null,

		init : function () {
			NS_HOME_PORTINERIA.caricaWkPortineria();
	    },
	    
	    caricaWkPortineria:function(){
	
            var nome =  $('#txtNome').val();
            var cognome = $('#txtCognome').val();
            var comuneresidenza =  $("#txtComuneResidenza").val();
            var dataNascita = $("#h-txtDataNascita").val();

	        NS_HOME_PORTINERIA.wk_pazienti_ricoverati= new WK({
	                id : "WK_PORTINERIA",
	                container : "divWk",
	                aBind : ["nome","cognome","comune_residenza","data_nascita","username"],
	                aVal : [nome, cognome, comuneresidenza, dataNascita, home.baseUser.IDEN_PER],
	                loadData : false
	            });
	
	        NS_HOME_PORTINERIA.wk_pazienti_ricoverati.loadWk();
	
	    }
};


