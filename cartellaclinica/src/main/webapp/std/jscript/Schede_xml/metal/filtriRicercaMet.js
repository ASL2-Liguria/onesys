jQuery(document).ready(function(){

	//aggiungo l'evento onchange al combo della struttura
	document.getElementsByName('cmbStruttura')[0].onchange=function(){
		mostraReparti(profilo);
	};                  
	caricamento();
});


function caricamento(){
	
	$("#lblReparti,#lblRepartiElenco").parent().hide();
	
	applica_filtro('servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_RICERCA_METAL&WHERE_WK= where CODICE_REPARTO IN (\'\')&ILLUMINA=javascript:illumina(this.sectionRowIndex);');
	
	
	document.getElementsByName('cmbStruttura')[0].onchange=function(){
		document.getElementById('hWhereCond').value = document.getElementsByName('cmbStruttura')[0].value;
		jQuery("#lblReparti, #lblRepartiElenco").parent().show(500);
		document.getElementById('hRepartiElenco').value = '';
		$('#lblRepartiElenco').text('').attr('title','');
		document.getElementById('hStruttura').value =  "'" + document.getElementsByName('cmbStruttura')[0].value + "'";		
	};
	
	$("#txtDaData,#txtAData,txtDataNascita").keypress(function(e){
		if(e.keyCode == 13){
			registraWkMetal();
		}
	});
}


function registraWkMetal(){
	
	if(document.getElementById('hStruttura').value != ''){
		document.getElementById('hStruttura').value =  "'" + document.getElementsByName('cmbStruttura')[0].value + "'";
	}
	
	if(document.getElementsByName('cmbStruttura')[0].value == ''){
		
		jQuery("input[name=hRepartiElenco]").val('');
		document.getElementById('lblRepartiElenco').innerText = '';
		alert('Prima di proseguire scegliere una Struttura ospedaliera e i Reparti');
		return;
	}	
	
	if (jQuery("input[name=hRepartiElenco]").val() == ''){
		alert('Prima di proseguire scegliere un reparto');
		return;
	}
	
		if (($("#txtCogn").val()!='') && $("#txtCogn").val().length<2){
			alert('Inserire almeno 2 caratteri per il cognome');
			return;
		}
		if (($("#txtNome").val()!='') && $("#txtNome").val().length<2){
			alert('Inserire almeno 2 caratteri per il nome');
			return;
		}
		var cogn = $("#txtCogn").val().toUpperCase();
		var nome = $("#txtNome").val().toUpperCase();
		$("#txtCogn").val(cogn);
		$("#txtNome").val(nome);
		applica_filtro('servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_RICERCA_METAL&ILLUMINA=javascript:illumina(this.sectionRowIndex);');
	}


