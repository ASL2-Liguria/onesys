var WindowCartella 	= null;
var _V_DATI			= null;

$(function() {
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }

	NS_WKBILANCIO.init();
	NS_WKBILANCIO.setEvents();
	
});

var NS_WKBILANCIO = {
		
		init : function() {
            
			_V_DATI = WindowCartella.getForm();
			WindowCartella.utilMostraBoxAttesa(false);
            if(WindowCartella.ModalitaCartella.isReadonly(document))
            	$('.pulsante').hide();
			NS_WKBILANCIO.loadWk();
			
			
			setTimeout(function(){
				var w = $('#WkBilancio').contents().find('[name="wk_bilancio_note"]').width();
				$('#WkBilancio').contents().find('[name="wk_bilancio_note"] > div').removeClass('classDatiTabella').css({/*'white-space':'normal',*/'display':'block','width':w});
			},250);
			
		},
		
		setEvents : function () {

		},
		
		inserisci : function(pTipoBilancio) {
			
			var tipo	= typeof pTipoBilancio == 'undefined' ? 'STANDARD' : pTipoBilancio ;		    
			var url = "servletGenerator?KEY_LEGAME=BILANCIO_IDRICO&idenVisita="+WindowCartella.getAccesso("IDEN")
			+"&STATO_PAGINA=I"
			+"&REPARTO="+WindowCartella.getAccesso("COD_CDC")
			+"&KEY_ORARIO=BILANCIO_IDRICO_ORARIO"
			+"&TIPO_BILANCIO=" + tipo;

			openFancybox(url);
		},
		
		modifica : function (iden, dataBilancio) {
			
			if (iden=='') return alert("Selezionare una riga");
			
			var vDataBilancio	= dataBilancio.split(' ');
			vDataBilancio		= new Date(vDataBilancio[0].split('/')[2], vDataBilancio[0].split('/')[1]-1, vDataBilancio[0].split('/')[0], vDataBilancio[1].split(':')[0], vDataBilancio[1].split(':')[1], vDataBilancio[1].split(':')[2])			
			vDataBilancio 		= (new Date() - vDataBilancio)/(3600*1000);
			
			// [1] Controllo Inserimento < 24 h Precedenti
			if (vDataBilancio > 24){ 
				alert('Sono Trascorse oltre 24 h pertanto il bilancio verrà aperto in Sola Lettura');			
				NS_WKBILANCIO.visualizza(iden);
				return;
			}			
			
			var url = "servletGenerator?KEY_LEGAME=BILANCIO_IDRICO&STATO_PAGINA=E&iden="+iden;
			openFancybox(url);
		},
		
		visualizza : function (iden) {
			
			if (iden=='') return alert("Selezionare una riga");
			var url = "servletGenerator?KEY_LEGAME=BILANCIO_IDRICO&STATO_PAGINA=L&iden="+iden;
			openFancybox(url);
		},
		
		cancella : function (iden, dataBilancio) {
			
			if (iden=='') return alert("Selezionare una riga");
			
			var vDataBilancio	= dataBilancio.split(' ');
			vDataBilancio		= new Date(vDataBilancio[0].split('/')[2], vDataBilancio[0].split('/')[1]-1, vDataBilancio[0].split('/')[0], vDataBilancio[1].split(':')[0], vDataBilancio[1].split(':')[1], vDataBilancio[1].split(':')[2])			
			vDataBilancio 		= (new Date() - vDataBilancio)/(3600*1000);
			
			// [1] Controllo Inserimento < 24 h Precedenti
			if (vDataBilancio > 24){ 
				alert('Sono Trascorse oltre 24 h pertanto il bilancio NON può Essere Cancellato');
				return;
			}

			if (confirm("Si vuole procedere alla cancellazione del bilancio selezionato?")) {
                WindowCartella.executeStatement("terapie.xml","bilancio.cancella",[iden]);
				var framework = WindowCartella.$("iframe#frameWork");
				framework.attr("src",framework.attr("src"));
			}
		},
		
		loadWk : function() {
			
			var url	= "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_BILANCIO_IDRICO&ILLUMINA=javascript:illumina(this.sectionRowIndex);";
			// "WHERE_WK=WHERE IDEN_VISITA="+WindowCartella.getAccesso("IDEN")+"&amp;ORDER_FIELD_CAMPO=";
			
			switch(WindowCartella.FiltroCartella.getLivelloValue()){
	            case 'IDEN_VISITA':		
	            	url += "&WHERE_WK=WHERE IDEN_VISITA =" + _V_DATI.iden_visita;
	                break;
	                
	            case 'NUM_NOSOLOGICO':
	               
	            	if(_V_DATI.iden_prericovero == "")
	                	url += "&WHERE_WK=WHERE NUM_NOSOLOGICO ='" + _V_DATI.ricovero + "' and IDEN_VISITA is not null";
	                else
	                	url += "&WHERE_WK=WHERE NUM_NOSOLOGICO in ('" + _V_DATI.ricovero + "','" + _V_DATI.prericovero + "') and IDEN_VISITA is not null";
	            	
	                break;
	                
	            case 'ANAG_REPARTO':	
	            	url += "&WHERE_WK=WHERE IDEN_ANAG =" + _V_DATI.iden_anag + " and codice_reparto_prov='" + _V_DATI.reparto + "'";
	                break;
	                
	            default:
	            	vWhere += "&WHERE_WK=WHERE IDEN_ANAG =" + _V_DATI.iden_anag ;
	                break;
			}
			
			if(WindowCartella.ModalitaCartella.isReadonly(document))
				url += "&CONTEXT_MENU=WK_BILANCIO_IDRICO_LETTURA";
			
			$("iframe#WkBilancio").attr("src",url);
		},
		
		stampa : function(iden){
			var vDati=WindowCartella.getForm(document);
			if(!WindowCartella.ModalitaCartella.isStampabile(vDati))return;

			var funzione	= 'BILANCIO_IDRICO';
			var anteprima	= 'S';
			var reparto		= vDati.reparto;
			var sf			= '&prompt<pIdenBilancio>='+iden+'&prompt<pVisita>='+vDati.iden_ricovero;

            WindowCartella.confStampaReparto(funzione, sf, anteprima, reparto, WindowCartella.basePC.PRINTERNAME_REF_CLIENT);
		}
}; 

function openFancybox(url){
	$.fancybox({
		'padding'	: 3,
		'width'		: document.body.offsetWidth/10*9,
		'height'	: document.body.offsetHeight/10*9,
		'href'		: url,
		'type'		: 'iframe'
	});
}