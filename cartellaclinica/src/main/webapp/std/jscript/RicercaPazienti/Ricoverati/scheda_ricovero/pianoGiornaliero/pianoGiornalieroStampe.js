var pianoGiornalieroStampe = {
	
	pianoStampaGeneric : function(funzione){
            if (!WindowCartella.ModalitaCartella.isStampabile(window.vDati)){
		return alert('Stampa non abilitata');
            }
            var reparto = window.vDati.reparto;
            var sf 		= "";
            switch(funzione){
                case 'TERAPIE_MOD14':	
                case 'PROCEDURE_ASSISTENZIALI': 
                case 'LESIONI_DECUBITO':
                case 'MEDICAZIONI':    
                    sf = '&prompt<pVisita>='+window.vDati.iden_ricovero;
                    break;		
                case 'PARAMETRI_VITALI': 
		case 'PARAMETRI_VITALI_GLOBALI': 
                    sf = '&prompt<pVisita>='+window.vDati.iden_visita+'&prompt<pRicovero>='+window.vDati.iden_ricovero;
                    break;
		default : '';
            }
		
            top.confStampaReparto(funzione,sf,'S',reparto,null);	
	}
};










