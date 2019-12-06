var _CHIUSURA_DSA=null;

$(document).ready(function () {
    
	_STATO_PAGINA = $('#STATO_PAGINA').val();
	home.GESTIONE_DSA = window;
	NS_SCHEDA_DSA.setFunzioneScheda();
	NS_GESTIONE_DSA.init();
	NS_GESTIONE_DSA.Style.showHideTabDimissione();
	window.NS_FENIX_TOP = window.parent.NS_FENIX_TOP;
	window.$.NS_DB = window.parent.$.NS_DB;
	
    NS_GESTIONE_DSA.Events.setEvents();
    NS_FENIX_SCHEDA.registra = NS_REGISTRA_FIRMA.Registra.registra; 
    
    $('#tabs-GESTIONE_DSA').click(function(){
    	NS_SCHEDA_DSA.setFunzioneScheda();
    	NS_REGISTRA_FIRMA.Lettera.getLetteraCorrente();
    	NS_REGISTRA_FIRMA.Lettera.getLetteraFirmata();
    	NS_GESTIONE_DSA.Style.showHideButtonFirma();
		NS_GESTIONE_DSA.Style.showHideButtonSalva();
    });

    _CHIUSURA_DSA=$("#CHIUSURA_DSA").val();
    if ( _CHIUSURA_DSA=='S') {
        // tab chiusura attivo
        $('#li-tabChiusuraDSA').trigger('click');
        _FUNZIONE_ATTIVA = 'LetteraChiusuraDSA';
    }
});

var NS_SCHEDA_DSA = {
		
		setFunzioneScheda : function(){

			var tabAcctive = $('li.tabActive').attr('data-tab');
			switch  (tabAcctive) {
	            case 'tabDSA': 
	            	_FUNZIONE_ATTIVA = 'LetteraAperturaDSA';
	            	V_ADT_GESTIONE_DSA.elements.txtDataChiusuraDSA.status = "";
					V_ADT_GESTIONE_DSA.elements.txtDiagnosiPrinc.status = "";
					V_ADT_GESTIONE_DSA.elements["h-txtDiagnosiPrinc"].status ="";
		            NS_FENIX_SCHEDA.addFieldsValidator({config:"V_ADT_GESTIONE_DSA"});
	                break;
	            case 'tabChiusuraDSA':
	            	_FUNZIONE_ATTIVA = 'LetteraChiusuraDSA';
	            	V_ADT_GESTIONE_DSA.elements.txtDataChiusuraDSA.status = "required";
					V_ADT_GESTIONE_DSA.elements.txtDiagnosiPrinc.status = "required";
					V_ADT_GESTIONE_DSA.elements["h-txtDiagnosiPrinc"].status = "required";
		            NS_FENIX_SCHEDA.addFieldsValidator({config:"V_ADT_GESTIONE_DSA"});
                    NS_GESTIONE_DSA.getWkEsamiStrumentali();
	                break;
	            default :
	            	V_ADT_GESTIONE_DSA.elements.txtDataChiusuraDSA.status = "";
					V_ADT_GESTIONE_DSA.elements.txtDiagnosiPrinc.status = "";
					V_ADT_GESTIONE_DSA.elements["h-txtDiagnosiPrinc"].status ="";
					NS_FENIX_SCHEDA.addFieldsValidator({config:"V_ADT_GESTIONE_DSA"});
	            	return;
			}
			
		}
};