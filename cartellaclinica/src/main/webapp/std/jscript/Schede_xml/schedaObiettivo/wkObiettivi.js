var idenVisita = parent.document.EXTERN.IDEN_VISITA.value;
var idenAnag = top.getForm(document).iden_anag;
var funzione = '';
	
jQuery(document).ready(function(){
	try{
		parent.removeVeloNero('oIFWk');
	}catch(e){}
	

	if(typeof parent.document.EXTERN.FUNZIONE != 'undefined'){
		funzione = parent.document.EXTERN.FUNZIONE.value;
	}
	//alert(funzione);
});


function visualizzaObiettivo(){

	var idenOb = stringa_codici(array_iden_obiettivo);
	funzione = stringa_codici(array_funzione);
	if (idenOb==''){

		alert('Selezionare una riga');

	}else{

		try{
			var url = 'servletGenerator?KEY_LEGAME=SCHEDA_OBIETTIVO&IDEN_VISITA='+idenVisita
				+'&STATO=VIS&IDEN_ANAG='+idenAnag+'&IDEN='+idenOb+'&FUNZIONE='+funzione;
			parent.$.fancybox({
				'padding'	: 3,
				'autoScale'	: false,
				'transitionIn'	: 'none',
				'transitionOut'	: 'none',
				'width'		: 1024,
				'height'	: 580,
				'href'		: url,
				'type'		: 'iframe'
			});
		}catch(e){
			window.open('servletGenerator?KEY_LEGAME=SCHEDA_OBIETTIVO&IDEN_VISITA='+idenVisita+'&STATO=VIS&IDEN_ANAG='+idenAnag+'&IDEN='+idenOb+'&FUNZIONE='+funzione,"schedaObiettivo","height=390 widht=700 scrollbars=no status=no")
		}
	}
}


function inserisciObiettivo(){

	try{
		var url = 'servletGenerator?KEY_LEGAME=SCHEDA_OBIETTIVO&IDEN_VISITA='+idenVisita+'&STATO=INS&IDEN_ANAG='+idenAnag+'&IDEN=&FUNZIONE='+funzione;
		parent.$.fancybox({
			'padding'	: 3,
			'autoScale'	: false,
			'transitionIn'	: 'none',
			'transitionOut'	: 'none',
			'width'		: 1024,
			'height'	: 580,
			'href'		: url,
			'type'		: 'iframe'
		});
	}catch(e){
		window.open('servletGenerator?KEY_LEGAME=SCHEDA_OBIETTIVO&IDEN_VISITA='+idenVisita+'&STATO=INS&IDEN_ANAG='+idenAnag+'&IDEN=&FUNZIONE='+funzione,"schedaObiettivo","height=390 widht=700 scrollbars=no status=no")
	}
}

function ValutaObiettivo(){

	var idenOb = stringa_codici(array_iden_obiettivo);
	funzione = stringa_codici(array_funzione);
	
	if (idenOb==''){

		alert('Selezionare una riga');

	}else{

		try{
			var url = 'servletGenerator?KEY_LEGAME=SCHEDA_OBIETTIVO&IDEN_VISITA='+idenVisita+'&STATO=VAL&IDEN_ANAG='+idenAnag+'&IDEN='+idenOb+'&FUNZIONE='+funzione;
			parent.$.fancybox({
				'padding'	: 3,
				'autoScale'	: false,
				'transitionIn'	: 'none',
				'transitionOut'	: 'none',
				'width'		: 1024,
				'height'	: 580,
				'href'		: url,
				'type'		: 'iframe'
			});
		}catch(e){
			window.open('servletGenerator?KEY_LEGAME=SCHEDA_OBIETTIVO&IDEN_VISITA='+idenVisita+'&STATO=VAL&IDEN_ANAG='+idenAnag+'&IDEN='+idenOb+'&FUNZIONE='+funzione,"schedaObiettivo","height=390 widht=700 scrollbars=no status=no")
		}
	}
}

function cancellaObiettivo(){
	
	var key_legame = document.EXTERN.KEY_LEGAME.value ;
	var tipo_wk = '';
	var funzione = stringa_codici(array_funzione);
	var idenOb = stringa_codici(array_iden_obiettivo);
	
	if(typeof document.EXTERN.TIPO_WK != 'undefined'){
		tipo_wk=document.EXTERN.TIPO_WK.value;
	}else{
		tipo_wk=document.EXTERN.KEY_LEGAME.value;
		key_legame="WORKLIST";
	}

	
	if (confirm('Cancellare la riga selezionata?')){
		top.executeStatement("obiettivi.xml",'remove',[idenOb]);

		url =  "servletGenerator?KEY_LEGAME="+key_legame;
		url	+= "&TIPO_WK="+tipo_wk;
		url += "&WHERE_WK=where iden_visita = "+parent.document.EXTERN.IDEN_VISITA.value;
	
		if(typeof parent.document.EXTERN.FUNZIONE != 'undefined'){
			url += " and funzione='"+parent.document.EXTERN.FUNZIONE.value+"'";
		}

		if(top.ModalitaCartella.isReadonly(document)){
			url+="&CONTEXT_MENU=WK_OBIETTIVI_BISOGNI_LETTURA";
		}

		location.replace(url);
	}
}
