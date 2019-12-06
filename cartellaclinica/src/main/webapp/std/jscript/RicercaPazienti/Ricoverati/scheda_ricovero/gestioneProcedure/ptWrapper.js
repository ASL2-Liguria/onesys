var labelName = {'MEDICAZIONE':'Medicazione',
		'RIMOZIONE_DRENAGGI':'Rimozione Drenaggi',
		'RIMOZIONE_PUNTI':'Rimozione Punti'};
var registrazioniEseguite = 0;

$(document).ready(function() {
	switch (parent.name) { 
	case 'PIANO_GIORNALIERO':
		document.all.titlegroupMain.innerText='Gestione Presidi e Medicazioni';
		break;
	case 'BISOGNI': 
		document.all.titlegroupMain.innerText='Gestione Presidi e Medicazioni';
		$('#lblTipo').closest('table').hide();
		break;
	case 'ANAMNESI':
	case '36_SETTIMANA':
        case 'QUESTIONARIO_ANAMNESTICO':    
		document.all.titlegroupMain.innerText='Allerte';
		break;
    case 'schedaRicovero':
        document.all.titlegroupMain.innerText='Gestione allergie';
	default:
	}

	switch($('#STATO_PAGINA').val()){
		case 'L':
			$('#lblRegistra').parent().hide();
			$('#lblTipo').closest('table').hide();
			break;
		case 'E' : 
			$('#lblTipo').closest('table').hide();
			break;
		default:
	}
	if (document.EXTERN.TIPO_DATO.value!='PT_DETTAGLIO') { 
		if (document.EXTERN.KEY_PROCEDURA) { 
			var key_legame = document.EXTERN.KEY_PROCEDURA.value;
			$(":radio[value="+ key_legame +"]").attr('checked',true);
			var procedura = $(":radio[value="+ key_legame +"]").next().next().text();
			
			apriScheda(key_legame, procedura);
		}
	} else {
		$('#lblTipo').closest('table').hide();
		appendiSezioni(document.EXTERN.KEY_PROCEDURA.value);
	}

});

function appendiSezioni(key_legame) {
	$('div#Sezioni').remove();
	if (document.getElementById('SEZIONI')) {
	var divSezioni = document.createElement('div');
	divSezioni.id='Sezioni';
	var sezioni = $('#SEZIONI').val().split(',');
	var props = $('#PROPS').val().split(',');
	$.each(sezioni, function(i) { 

		var divSezione = document.createElement('div');
		divSezione.className='intestazione';
		var chk = document.createElement('input');
		chk.type='checkbox';
		chk.value=sezioni[i];
		chk.onclick=function() {javascript:
			if($('#'+ sezioni[i]).length==0) {
				var frame = creaFrame(sezioni[i],key_legame);
				$(this).closest('div').append(frame);
			} else {
				$('#'+ sezioni[i]).toggle();
			};
		};
		var label = document.createElement('label');
		label.className='intestazione';
		label.innerText=labelName[sezioni[i]];
		if (props[i]==1 || props[i]==2){
			if (props[i]==1) {
				chk.defaultChecked = true;
				label.appendChild(chk);
			}
			divSezione.appendChild(label);
			var frame = creaFrame(sezioni[i],key_legame);
			$(divSezione).append(frame);

			$(divSezioni).append(divSezione);
		} else {
			label.appendChild(chk);
			divSezione.appendChild(label);


		}
		divSezioni.appendChild(divSezione);
	});
	$('div#groupMain').append(divSezioni);
	}
}
function creaFrame(nome,key_legame) {
	var frame = document.createElement('iframe');
	frame.id=nome;
	var src= 'servletGenerator?KEY_LEGAME=PT_DETTAGLIO&TIPO='+nome+'&KEY_PROCEDURA='+key_legame;
	if (document.EXTERN.IDEN_PROCEDURA && $('iframe#scheda').length==0) {
		src+='&IDEN_PROCEDURA='+ document.EXTERN.IDEN_PROCEDURA.value +'&IDEN_SCHEDA='
		+ $('input[name=hIdenScheda]').val();
	}
	frame.src= src;
	return frame;
}

function caricaPtFrame() {
	var el = window.event.srcElement;
	var key_legame = el.tagName=='INPUT' ? el.value : el.previousSibling.previousSibling.previousSibling.value;
	var procedura = el.tagName=='LABEL' ? el.innerText : el.nextSibling.nextSibling.nextSibling.innerText;

	apriScheda(key_legame, procedura);
}


function apriScheda(key_legame, procedura) {
	
	var iden_visita = document.EXTERN.IDEN_VISITA.value;
	
	var url = 'servletGenerator?KEY_LEGAME=' + key_legame
	+ "&IDEN_VISITA=" + iden_visita + "&PROCEDURA=" + procedura+"&STATO_PAGINA="+document.EXTERN.STATO_PAGINA.value;
	if (document.EXTERN.IDEN_PROCEDURA) {
		//alert('esiste iden_procedura');
		var iden_procedura = document.EXTERN.IDEN_PROCEDURA.value;
		var iden_scheda = document.EXTERN.IDEN_SCHEDA ? document.EXTERN.IDEN_SCHEDA.value : document.getElementById('hIdenScheda').value;
		url += "&IDEN_PROCEDURA=" + iden_procedura + "&IDEN_SCHEDA=" + iden_scheda 
		+ "&SITO=LOAD";
	} else {
		url += "&SITO=ALL";
	}
	if (document.EXTERN.GUARIGIONE) {
		url+= "&GUARIGIONE=S";
	} 
	$('#scheda').remove();
	$('#lblTipo').closest('table').after(
			'<iframe id="scheda" style="width=100%;" src="'
			+ url + '"></iframe>'
	);
	appendiSezioni(key_legame);
	$('#scheda').focus();
}

function registraProcedura() {
	
	if (controllaObbligatori()==false){return;}

	if ($('#scheda').length!=0){
        $('#scheda')[0].contentWindow.registraScheda();  //fa registra();

//        .registraScheda(); //registraDettagli viene qui richiamata nella callback, (html_eventi:ok registra)
	} else {
		registraDettagli(); //lancia subito la registrazione dei dettagli
	}
}

function registraDettagli() {

	if ($('#MEDICAZIONE').is(':visible')) {
//		alert('registro med');
		$('#MEDICAZIONE ')[0].contentWindow.registra();
	}
	if ($('#RIMOZIONE_PUNTI').is(':visible')) {
//		alert('registro punti');
		$('#RIMOZIONE_PUNTI ')[0].contentWindow.registra();
	}
	if ($('#RIMOZIONE_DRENAGGI').is(':visible')) {
//		alert('registro dre');
		$('#RIMOZIONE_DRENAGGI')[0].contentWindow.registra();
	}
}

function chiudiProcedura() {
    switch (parent.name){
        case 'ANAMNESI':
        case '36_SETTIMANA':
        case 'QUESTIONARIO_ANAMNESTICO':
//            top.apriInserimentoAllergie();
            break;
        default:

            break;
    }
    parent.$.fancybox.close();
}

function aggiornaOpener(){ 
	switch (parent.name){
		case 'PIANO_GIORNALIERO':
			registrazioniEseguite++;
			if (registrazioniEseguite==$('iframe:visible').length) { 
				parent.refreshPiano('OK');
				chiudiProcedura();
			}
			break;
		case 'BISOGNI': 
//			$('iframe#idWkProcedure',parent.document)[0].contentWindow.location.reload();
			parent.BISOGNO_MOVIMENTO.caricaWkProcedure();
			chiudiProcedura();
			break;
//		case 'ANAMNESI': 
//			$('iframe#frameWkAllerte',parent.document)[0].contentWindow.location.reload();
//			chiudiProcedura();
//			break;
		default:
			if (document.EXTERN.RELOAD){
				var openerToReload = document.EXTERN.RELOAD.value;


//                ($('#'+openerToReload).parent.document)[0].contentWindow.location.reload();
			}
			chiudiProcedura();

			break;
	}
}

function controllaObbligatori() {
	var obbligatoriMancantiLbl = new Array();
	var frames = $('iframe:visible');
	$.each(frames, function(i) {
		var campiObbligatori = $(frames[i]).contents().find('input[STATO_CAMPO="O"][type!="radio"],textarea[STATO_CAMPO="O"],select[STATO_CAMPO="O"]');
		$.each(campiObbligatori, function(j){
			if (campiObbligatori[j].value==''){ 
				var lblCampo = $('#'+campiObbligatori[j].STATO_CAMPO_LABEL, $(frames[i]).contents()).text(); 
				obbligatoriMancantiLbl.push(lblCampo);
			}
		});
	}); 
	if (obbligatoriMancantiLbl.length!=0) {
		var msg = 'Prego compilare i seguenti campi prima di effettuare\nla registrazione:\n';
		$(obbligatoriMancantiLbl).each(function(i){
			msg +='\t- '+obbligatoriMancantiLbl[i]+'\n';
		});
		alert(msg);
		return false;
	} else{
		return true;
	}
}