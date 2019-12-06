var _JSON_CONTATTO={};
var _IDEN_CONTATTO=$('#IDEN_CONTATTO').val();
var _STATO_PAGINA='';
$(document).ready(function () {
	_JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById(_IDEN_CONTATTO);
	NS_ACCESSI_DH.init();
	NS_RIEPILOGO_ACCESSI_DH.setEvents();
});

var NS_RIEPILOGO_ACCESSI_DH = {
		
		setEvents:function(){
			$("#li-tabAccessiDh").click(function(){
				NS_ACCESSI_DH.wkAccessiDh.refresh();
			})
		}

};