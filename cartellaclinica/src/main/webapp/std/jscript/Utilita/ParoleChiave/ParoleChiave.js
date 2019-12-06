$(document).ready(function(){
	PAROLE_CHIAVE.init();
	PAROLE_CHIAVE.setEvents();
});

var PAROLE_CHIAVE ={
	
	selezioneObbligatoria:true,
		
	init : function() {
		try{
			if(typeof document.EXTERN.CAMPO_DESCRIZIONE != 'undefined' ){
				if(typeof document.EXTERN.VALORE_DESCRIZIONE != 'undefined')
					$('input#txtDescrizione').val(document.EXTERN.VALORE_DESCRIZIONE.value);
			} else {
				$('input#txtDescrizione').hide();
			}
			if(typeof document.EXTERN.CAMPO_REPARTO != 'undefined'){
				$('select#cmbReparto option[value='+document.EXTERN.VALORE_REPARTO.value+']').attr('selected',true);
			} else {
				$('select#cmbReparto').parent().hide();
			}
			
			if(typeof document.EXTERN.SELEZIONE_OBBLIGATORIA != 'undefined'){
				PAROLE_CHIAVE.selezioneObbligatoria = (document.EXTERN.SELEZIONE_OBBLIGATORIA.value == "S");
			}
			if (typeof document.EXTERN.NumeroCicli !='undefined' && typeof document.EXTERN.IntervalloCicli!='undefined'){
				document.getElementById('frmImpostazioni').contentWindow.setImpostazioni(document.EXTERN.NumeroCicli.value,document.EXTERN.IntervalloCicli.value,document.EXTERN.GiornoInizio.value);
			}
		}catch(e){
			alert(e.description);
		}

	},	
		
	setEvents : function(){
		$('div.registra').click(PAROLE_CHIAVE.registra);
//		$('div.chiudi').click(PAROLE_CHIAVE.annulla);		
	},	
	
	registra : function (){
		try{
			var selKeyword = $('input.Keyword:checked');
			
			if(PAROLE_CHIAVE.selezioneObbligatoria && selKeyword.length==0) {
				return alert("Selezionare una categoria");
			}
			var ArIden = "";
			selKeyword.each(function(){ArIden+=$(this).attr("id") + ',';});
			if (typeof(document.EXTERN.PACCHETTO)!='undefined')
				{
			//se sto creando un pacchetto
				var pBinds = [];
				pBinds.push(document.EXTERN.PACCHETTO.value);
				var resp = top.executeStatement("terapie.xml","prescrizioniStd.creaPacchetto",pBinds,1);

	            document.EXTERN.IDEN_TABELLA.value=resp[2];
				}

			var vBinds = new Array();

			vBinds.push(document.EXTERN.IDEN_TABELLA.value);
			vBinds.push(document.EXTERN.TABELLA.value);
			vBinds.push(ArIden==""?"":ArIden.substring(0,ArIden.length-1));
			vBinds.push('S');
//			vBinds.push(document.EXTERN.DELETE.value);

			if(typeof document.EXTERN.CAMPO_DESCRIZIONE != 'undefined'){
				
				if ($('input#txtDescrizione').val()=='') {
					return alert('Inserire una descrizione per procedere con l\'associazione');
				}
				vBinds.push(document.EXTERN.CAMPO_DESCRIZIONE.value);
				vBinds.push($('input#txtDescrizione').val().toUpperCase());
			}else{
				vBinds.push('');
				vBinds.push('');			
			}

			if(typeof document.EXTERN.CAMPO_IMPOSTAZIONI != 'undefined'){
				vBinds.push(document.EXTERN.CAMPO_IMPOSTAZIONI.value);
				vBinds.push(document.getElementById('frmImpostazioni').contentWindow.getImpostazioni());
			}else{
				vBinds.push('');
				vBinds.push('');
			}
			
			if(typeof document.EXTERN.CAMPO_REPARTO != 'undefined'){
				var reparto;
				if ((reparto = $('select#cmbReparto option:selected').val())=='') {
					return alert('Selezionare il reparto per procedere con l\'associazione');
				}
				vBinds.push(document.EXTERN.CAMPO_REPARTO.value);
				vBinds.push(reparto);
			}else{
				vBinds.push('');
				vBinds.push('');
			}

			if (typeof document.EXTERN.CHECK != 'undefined') {
				var stm = (document.EXTERN.CHECK.value).split(":");
				var check = top.executeStatement(stm[0],stm[1],vBinds,1);
				if (check[2]>0 /*&& !confirm("Descrizione già presente per il reparto selezionato, confermando verrà sovrascritta")*/){
					return alert(stm[2]);
				}
			}
			var resp = top.executeStatement("paroleChiave.xml","setKeyWords",vBinds);
			if(resp[0]=='KO'){
				alert(resp[1]);
			}else{
				PAROLE_CHIAVE.annulla();
			}

		}catch(e){
			alert(e.description);
		}	
	},

	annulla : function (){
		try{
			eval(document.EXTERN.OnClose.value);
		}catch(e){
			try{
				parent.$.fancybox.close();
				if (parent.name!='PIANO_GIORNALIERO'){
					//parent.parent.$.fancybox.close();
					parent.parent.cerca();
				}				
			}catch(e){
				self.close();
			}
		}
	}
};