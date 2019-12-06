

jQuery(document).ready(function(){
	
	TAB.init();
	
});

var TAB = {
		
		init:function(){
			
			window.name = 'SINTESI BISOGNI';
			
			/*attivo il tabulatore*/
			var lista = ['Sintesi Bisogni','Worklist Obiettivi'];
			attivaTab(lista,1);
			
			var url=top.apriSintesiBisogni();
			
			var urlWk='servletGenerator?KEY_LEGAME=WK_OBIETTIVI_BISOGNI';
			urlWk+='&REPARTO='+document.EXTERN.REPARTO.value;
			urlWk+='&IDEN_VISITA='+document.EXTERN.IDEN_VISITA.value;
			urlWk+='&IDEN_VISITA_REGISTRAZIONE'+document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value;
			
			document.getElementById("frameSintesi").src=url;
			document.getElementById("frameWk").src=urlWk;
			
		}
}