var _IDEN_CONTATTO = null;
var _IDEN_ANAG = null;
var _STATO_PAGINA = null;
var _JSON_CONTATTO = null;
var _JSON_ANAGRAFICA = null;
var _SDO = typeof $("#SDO").val() == "undefined" || $("#SDO").val() == "" || $("#SDO").val() == null ? "N" : $("#SDO").val(); 

$(document).ready(function () {

	_STATO_PAGINA = $('#STATO_PAGINA').val();
	_IDEN_ANAG = $('#IDEN_ANAG').val();
	_IDEN_CONTATTO = $('#IDEN_CONTATTO').val();
	
	// Controllo se per il ricovero in questione sono presenti registrazioni e/o firme della SDO
	// NS_DIMISSIONE_SDO.getSDO(function(){NS_FENIX_SCHEDA.addFieldsValidator({config : "V_ADT_DIMI"});});
	
	_JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById(_IDEN_CONTATTO);
	_JSON_ANAGRAFICA = _JSON_CONTATTO.anagrafica;

	NS_DIMISSIONE_SDO.init();
    
});
