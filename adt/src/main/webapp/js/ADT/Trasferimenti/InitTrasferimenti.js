var _IDEN_CONTATTO = null;
var _IDEN_ANAG = null;
var _STATO_PAGINA = null;
var _JSON_CONTATTO = null;
var _JSON_ANAGRAFICA = null;

jQuery(document).ready(function () {

	_STATO_PAGINA = $('#STATO_PAGINA').val();
	_IDEN_ANAG = $('#IDEN_ANAG').val();
	_IDEN_CONTATTO = $('#IDEN_CONTATTO').val();
	
	_JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById(_IDEN_CONTATTO);
	_JSON_ANAGRAFICA = _JSON_CONTATTO.anagrafica;

    NS_RICH_TRASF_GIURIDICO.init();
    NS_RICH_TRASF_GIURIDICO.Setter.setIntestazione();

    _IDEN_ANAG = _JSON_CONTATTO.anagrafica.id;
    
    $('#acRepGiu').data('acList').changeBindValue({"iden_contatto": _IDEN_CONTATTO});

});