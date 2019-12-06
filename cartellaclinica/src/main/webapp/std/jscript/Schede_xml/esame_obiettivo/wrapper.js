$(function(){
	NS_ESAME_OBIETTIVO.init();
	NS_ESAME_OBIETTIVO.setEvents();
	
	top.utilMostraBoxAttesa(false);
});

var NS_ESAME_OBIETTIVO = {
	
	init:function(){

		if(top.ModalitaCartella.isReadonly(document))
			$('#btnRegistra').hide();

		if(!top.ModalitaCartella.isStampabile(document))
			$('#btnStampa').hide();
		
		$('#contentTabs').height(document.body.offsetHeight - $('#contentTabs').position().top - $('#footerTabs').height());
		
		$('iframe[name="GENERALE"]').height($('#contentTabs').height()).attr("src",NS_ESAME_OBIETTIVO.getUrlGenerale());
		
		$('iframe[name!="GENERALE"]').attr("src",function(){
			var _iframe = $(this)
			return NS_ESAME_OBIETTIVO.getUrlSpecialita({
				key_legame:_iframe.attr("KEY_LEGAME"),
				iden_visita:_iframe.attr("IDEN_VISITA"),
				sito:_iframe.attr("SITO"),
				versione:_iframe.attr("VERSIONE")
			});
		});

		if($('#divEsamiSpecialistici iframe[IDEN_VISITA="'+top.getForm(document).iden_visita+'"]').length == 0){

			$('#divEsamiSpecialistici').append(
				$('<fieldset></fieldset>')
					.append(
						$('<legend></legend>').text(top.DatiCartella.Reparti[top.getForm(document).reparto].COD_CDC)
					)
					.append(
						$('<div></div>')
							.append(
								$('<iframe></iframe>')
								.attr({
										"src":NS_ESAME_OBIETTIVO.getUrlSpecialita({
												key_legame:'EO_SP_OSTET',
												iden_visita:top.getForm(document).iden_visita
											}),
										"KEY_LEGAME":"EO_SP_OSTET",
										"IDEN_VISITA":top.getForm(document).iden_visita							
									})							
							)
					)
				
			)
		}
		
		
	},
	
	setEvents:function(){
		
		$('#btnRegistra').click(NS_ESAME_OBIETTIVO.registra);
		$('#btnStampa').click(NS_ESAME_OBIETTIVO.stampa);		
		
		tabs.init();
		tabs.setEvents();
	
	},
	
	getUrlGenerale:function(){
		var vDati = top.getForm(document);
		var confScheda = top.getConfScheda('ESAME_OBIETTIVO',vDati);
		var url = "servletGenerator?KEY_LEGAME=" 	+ confScheda.KEY_LEGAME;
		url += "&FUNZIONE="							+ vDati.funzioneAttiva;
		url += "&REPARTO="							+ vDati.reparto;
		url += '&READONLY=' 						+ top.ModalitaCartella.isReadonly(vDati);
		url += "&IDEN_VISITA="						+ vDati.iden_ricovero//top.FiltroCartella.getIdenRiferimento(vDati);

		if(confScheda.SITO != null && confScheda.SITO !=''){url+="&SITO="+confScheda.SITO}
		if(confScheda.VERSIONE != null && confScheda.VERSIONE !=''){url+="&VERSIONE="+confScheda.VERSIONE}	
		
		return url;	
	},
	
	getUrlSpecialita:function(pParametri){//key_legame,iden_visita[,sito][,versione]
		try{
			var url = "servletGenerator?KEY_LEGAME=" + pParametri.key_legame
					+ "&IDEN_VISITA=" + pParametri.iden_visita
					+ "&FUNZIONE=ESAME_OBIETTIVO_SPECIALISTICO" 
					+ "&STATO_PAGINA=" + (
											top.ModalitaCartella.isReadonly(document) 
											|| 
											pParametri.iden_visita != top.getForm(document).iden_visita
											? 'L': 'I'
										)
			if(typeof pParametri.sito != 'undefined' && pParametri.sito != null && pParametri.sito != '')
				url += "&SITO=" + pParametri.sito;
			if(typeof pParametri.versione != 'undefined' && pParametri.versione != null && pParametri.versione != '')
				url += "&VERSIONE=" + pParametri.versione;			
			
			return url;
		}catch(e){
			alert(e.description)
		}
	},
	
	checkSalvataggio:{
		
		check:function(pReadonly){
			if(!pReadonly)
				NS_ESAME_OBIETTIVO.checkSalvataggio.show();							
		},
		
		show:function(){
			$('#headerTabs h2').addClass('Alert').text('La scheda è stata modificata ma non è ancora stata salvata');
		},
		
		hide:function(){
			$('#headerTabs h2').removeClass('Alert').text('');
		}
		
	},
	
	registra:function(){
		
		top.utilMostraBoxAttesa(true);
		
		try{
			$('iframe').each(function(){
				if(this.contentWindow._STATO_PAGINA != 'L'){
					alert('si');
					this.contentWindow.registra();
				}else{
					alert('no')
				}
			});
			
			NS_ESAME_OBIETTIVO.checkSalvataggio.hide();		
		}catch(e){
			alert(e.description);
		}
		
		top.utilMostraBoxAttesa(false);
		
	},
	
	stampa:function(){
		alert('da fare');
	}
	
};

var tabs = {

	init:function(){
		/*$('#contentTabs > *').hide();
		
		$('ul.ulTabs li:eq(0)').addClass("tabActive");
		$('#contentTabs > *:eq(0)').show();*/
		
		
	},

	setEvents:function(){
		$('ul.ulTabs li').click(function(){
			
			$('ul.ulTabs li').removeClass("tabActive");
			$('#contentTabs > *').hide();
			
			$('#contentTabs > *:eq('+$(this)
				.addClass("tabActive").index()+')')
				.show()
				.find('iframe').each(function(){
					this.contentWindow.NS_EO_SPECIALISTICO.setHeight();
				});

		});
	}
}