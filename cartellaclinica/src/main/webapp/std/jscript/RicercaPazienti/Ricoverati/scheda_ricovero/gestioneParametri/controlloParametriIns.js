/**
 * @author  matteopi
 * @author  gianlucab
 * @version 1.1
 * @since   2013-04-08
 */

jQuery(document).ready(function () {
	NS_CONTROLLO_PARAMETRI_VIT.init();
	NS_CONTROLLO_PARAMETRI_VIT.event();
});

var NS_CONTROLLO_PARAMETRI_VIT = {};
(function() {
	this.init = function(){
	};

	this.event = function(){
		var callback = this.controllo;
		$('.rilevazione input').blur(function() {
			callback($(this), true /* mostra alert */);
		});
	};
	
	this.controllo = function(value, boolAlert){
		if (typeof value !== 'object') return 1;
		var cod_cdc = $('#reparto').val();
		var valore_inserito = value.val();
		if(valore_inserito == null || valore_inserito == '') {
			return 1;
		}

		if(isNaN(valore_inserito)){
			if (boolAlert) {
				value.val('');
				alert("Attenzione inserire un valore numerico");
			}
			return 1;
		}

		var iden = value.closest('.parametro').attr('iden');
		var response = parent.WindowCartella.NS_PARAMETRI.checkRange(parseInt(valore_inserito,10),cod_cdc,{iden_parametro:iden});

		if(response.lower){
			if (boolAlert)
				alert("Attenzione il valore inserito è inferiore al valore minimo previsto ");
			return 1;
		}

		if(response.higher){
			if (boolAlert)
				alert("Attenzione il valore inserito è superiore al valore massimo previsto ");
			return 1;
		}
	};
}).apply(NS_CONTROLLO_PARAMETRI_VIT);