function aggiorna(){
	WK_PROBLEMI.refresh();
}
var WindowCartella = null;
$(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;

    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;
	WK_PROBLEMI.init();
	WK_PROBLEMI.setEvents();
    WindowCartella.utilMostraBoxAttesa(false);
});

var WK_PROBLEMI = {

	iden_problema:null,
	cdcReparto:null,
	idenNoso:null,
	idenPer:null,
	filtroDiagnosi:null,
	init:function(){
		$('tr').each(function(){
			var _tr = $(this);
			
			var _select = _tr.find('select[name="cmbPriorita"]');
			_select.find('option[value="'+_select.attr("prioritaOriginale")+'"]').attr("selected","selected");
			
			if(_tr.attr("deleted")=='S' || _tr.attr('risolto')=='S' || WindowCartella.ModalitaCartella.isReadonly(document)){
				_select.attr("disabled","disabled");
				
			}
			if(_tr.attr("deleted")=='S'){
				_tr.find('a').addClass("disabled");
			}
		});
		
		//WK_PROBLEMI.cdcReparto = top.frmReparto.COD_CDC.value;
		//WK_PROBLEMI.idenNoso = top.frmRicovero.IDEN.value;
		var vDati = WindowCartella.getForm(document);
		
		WK_PROBLEMI.cdcReparto = vDati.reparto;
		WK_PROBLEMI.idenNoso = vDati.iden_visita;

		WK_PROBLEMI.idenPer = WindowCartella.baseUser.IDEN_PER;
		if(WindowCartella.ModalitaCartella.isReadonly(document)){
		}
		// leggo il filtro 
		WK_PROBLEMI.filtroDiagnosi=WindowCartella.FiltroCartella.getLivelloValue();
		//alert(WindowCartella.FiltroCartella.getLivelloValue());
		
	},
	
	setEvents:function(){
		
		//$('.risoltoS , .risoltoN').click(WK_PROBLEMI.setRisolto);
		
		$('select[name="cmbPriorita"]').change(WK_PROBLEMI.setPriorita);
		
		$('tr[deleted="N"] td > a').click(WK_PROBLEMI.modifica);
		
		/*$('tr[risolto]').bind('contextmenu',function(){
			WK_PROBLEMI.iden_problema = this.id;
			$('tr.light').removeClass('light');
			$(this).addClass('light');
		});*/
		
		$('[id]').bind('contextmenu',function(){
			WK_PROBLEMI.iden_problema = this.id;
		});
		
		$('body').click(function(){
			WK_PROBLEMI.iden_problema = null;
			$('tr.light').removeClass('light');
		})
	},

	refresh:function(){
		var pDati = WindowCartella.getForm(document);
		var url = "listaProblemiRicovero";
		url += "?iden_visita=" 		+ pDati.iden_visita;
		url += "&iden_ricovero=" 	+ pDati.iden_ricovero;
		url += "&ricovero=" 		+ pDati.ricovero;		
		url += "&reparto=" 			+ pDati.reparto;	
		url += "&iden_anag=" 		+ pDati.iden_anag;				
		url += "&FiltroCartella=" 	+ WindowCartella.FiltroCartella.getLivelloValue(pDati);
		document.location.replace(url);
	},

	inserisci:function(){
		//WK_PROBLEMI.openSchedaProblema();
		if (WindowCartella.ModalitaCartella.isReadonly(document))
			alert('Cartella in sola lettura: inserimento diagnosi non possibile');
		else
			WK_PROBLEMI.openSchedaDiagnosi();
	},
	
	
	
	cancella:function(){
		
		if(WK_PROBLEMI.iden_problema == null){
			return alert("Selezionare un problema");
		}
		
		if (WindowCartella.ModalitaCartella.isReadonly(document)){
			return alert('Cartella in sola lettura: cancellazione diagnosi non possibile');	
		}
			
		if(WindowCartella.baseUser.TIPO != 'M'){
			return alert('Funzionalità riservata al personale medico');
		}		
		
		if (!confirm("Si conferma la cancellazione logica del problema selezionato?")){
			return ;
		}
		
		var vResp = WindowCartella.executeStatement("Problemi.xml","setDeleted",[
						'S',
						WK_PROBLEMI.iden_problema,
            WindowCartella.baseUser.IDEN_PER
					]);
					
		if (vResp[0]=='KO'){
			alert(vResp[1]);
		}
				
		WK_PROBLEMI.refresh();		
	},
	
	setPriorita:function(){
		var vSelect = event.srcElement;
		if(WindowCartella.baseUser.TIPO != 'M'){
			vSelect.selectedIndex = vSelect.prioritaOriginale;
			return alert('Funzionalità riservata al personale medico');
		}
		
		if (!confirm("Modificare la priorità per il problema selezionato?")){
			return vSelect.selectedIndex = vSelect.prioritaOriginale;
		}		
		
		var vResp = WindowCartella.executeStatement("Problemi.xml","setPriorita",[
						vSelect.options[vSelect.selectedIndex].value,
						WK_PROBLEMI.getRow().id,
            WindowCartella.baseUser.IDEN_PER
					]);
					
		if (vResp[0]=='KO'){
			alert(vResp[1]);
		}
				
		WK_PROBLEMI.refresh();
		
	},
	
	setRisolto:function(){

		if(WindowCartella.baseUser.TIPO != 'M'){
			return alert('Funzionalità riservata al personale medico');
		}	
	
		if (!confirm("Confermare la modifica sullo stato del problema selezionato?")){
			return;
		}		
		
		var vResp = WindowCartella.executeStatement("Problemi.xml","setRisolto",[
					(WK_PROBLEMI.getRow().getAttribute('risolto') == 'S' ? 'N' : 'S'),
					WK_PROBLEMI.getRow().id,
            WindowCartella.baseUser.IDEN_PER
				]);
				
		if (vResp[0]=='KO'){
			alert(vResp[1]);
		}		
		
		WK_PROBLEMI.refresh();		
	},
	
	getRow:function(pObj){
		pObj = (typeof pObj == 'undefined' ? event.srcElement : pObj);
		while(pObj.nodeName.toUpperCase() != 'TR'){
			pObj = pObj.parentNode;
		}
		
		return pObj;
	},
	
	openSchedaProblema:function(pIdProblema,pTipoICD){
		if(WindowCartella.baseUser.TIPO != 'M'){
			return alert('Funzionalità riservata al personale medico');
		}
		var url = "schedaProblema?";
		url += "idProblema="+(typeof pIdProblema=='undefined'?'':pIdProblema);
		url += "&idenVisita="+ $('input[name="idenVisita"]').val();
		url += "&tipoICD="+ (typeof pTipoICD=='undefined' ? WindowCartella.baseReparti.getValue(WindowCartella.getForm(document).reparto,"PROBLEMI_TIPOICD") : pTipoICD);
		$.fancybox({
			'padding'	: 2,
			'width'		: document.body.offsetWidth/10*9,
			'height'	: document.body.offsetHeight/10*9,
			'href'		: url,
			'type'		: 'iframe',
			'hideOnOverlayClick':false,
		    'hideOnContentClick':false
		});				
		//window.open(url,'schedaProblema', 'fullscreen=yes, status=no ,scrollbars=yes');
	},	
	
	openSchedaDiagnosi: function(){
		if(WindowCartella.baseUser.TIPO != 'M'){
			return alert('Funzionalità riservata al personale medico');
		}
		var url = "servletGenerator?KEY_LEGAME=SCHEDA_DIAGNOSI&KEY_ID=0&status=yes fullscreen=yes";
		$.fancybox({
			'padding'	: 3,
			'width'		: 1024,
			'height'	: 580,
			'href'		: url,
			'type'		: 'iframe'
		});
	}
	

};

function aggiornaOpener(){}