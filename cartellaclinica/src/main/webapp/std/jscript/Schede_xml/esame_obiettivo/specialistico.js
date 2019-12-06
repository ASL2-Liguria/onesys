$(function(){
	NS_EO_SPECIALISTICO.init();
	NS_EO_SPECIALISTICO.setEvents();
});

var NS_EO_SPECIALISTICO = {

	init:function(){
		
		switch(_STATO_PAGINA){
			case 'L' :
				$('textarea, input[type="text"]').css("background-color","#CCC");
				break;
			default:
				break;
		}		
		
	},
	
	setEvents:function(){},
	
	setHeight:function(){
		parent.$('iframe[IDEN_VISITA="'+document.EXTERN.IDEN_VISITA.value+'"]')
			.height(
				$('form[name="dati"]').height() + 5
			);
	}

};