//parent.parent.utilMostraBoxAttesa(false);
var arTerapie;

function setTerapie(arr) {
	arTerapie = $.extend(true,[],arr);
}

$(document).ready(function() {
	$('input.autocomplete').autocomplete(frasi, { 
		matchContains :true,
		minChars : 0	
	}).each(function(){
		if($(this).val()=='') {
			$(this).val(frasi[0]);
		}
	});
	$('select.selCategoria').each(function(){
		setSelCategoria($(this));
	});
//	$("div#tableContainer").height($(document.body).height()-50);
//	alert(opener.arTerapie.length);
	for (var x = 0; x < opener.arTerapie.length; x++) {
		var arr = opener.arTerapie;
		nuovaTerapia(
				arr[x]["FARMACO"],
				arr[x]["IDEN_FARMACO"],
				arr[x]["PRIMO_CICLO"],
				arr[x]["COD_DEC"],
				arr[x]["IDEN_SOSTANZA"],
				arr[x]["DOSE"],
				arr[x]["DURATA"],
				arr[x]["NUM_SCATOLE"],
				arr[x]["CATEGORIA"],
				null
				)
	}
});

function setSelCategoria(obj, categoria) {
	if (typeof categoria=='undefined'){
		var categoria = $(obj).find('option:first').text();
	} else {
		pushCategoria(categoria);
	}
	$(obj).html($('select#prototype').html()).find('option').each(function() {
		if ($(this).text().replace(/&amp;apos;/g, "_")==categoria.replace(/&amp;apos;/g, "_")){
			$(this).attr("selected",true);
		}
	});
}

function nuovaTerapia(farmaco, iden, pCiclo, cod_dec, id_sos, dose, durata, scatole, categoria, prontuario) {
	var table = document.getElementById('tabWkTerapieLettera');
	var tBody = table.getElementsByTagName('tbody')[0];
	var n = tBody.rows.length;
	var lastRow;
	for (var i = 1; i < n-1; i++) {
		lastRow = tBody.getElementsByTagName('tr')[i];
		if(lastRow.getElementsByTagName('td')[1].cod_dec) {
			var cod_far = lastRow.getElementsByTagName('td')[1].cod_dec;
			if (cod_far==cod_dec) {
				prontuario.alert('Impossibile aggiungere '+ farmaco+', il farmaco è già inserito');
				return;
			}
		}
	}
//	lastRow = tBody.getElementsByTagName('tr')[n-1];
	var tr = document.createElement('tr');
	tr.className='terapia';
	var td = document.createElement('td');
	if (pCiclo=='S') {
		td.className= 'Spunta';
		td.onclick=function(){javascript:spunta(this);};
		td.checked='S';		
	} else if (pCiclo=='N') {
		td.className= 'Spunta';
		td.onclick=function(){javascript:spunta(this);};
		td.checked='N';
	} else {
		td.className= 'NoSpunta';
		td.onclick=function(){javascript:apriAltriFarmaci();};
	}
	tr.appendChild(td);
	td = document.createElement('td');
	td.innerText = farmaco;
	td.iden_far = iden;
	td.cod_dec = cod_dec;
	td.id_sos = id_sos;
	td.stato_ter = 'L';
	td.tipo_ter = '7';
	tr.appendChild(td);
	td = document.createElement('td');
	var input = document.createElement('input');
	input.style.width = '95%';
	input.value=dose;
	td.appendChild(input);
	td.align="center";
	tr.appendChild(td);
	td = document.createElement('td');
	input = document.createElement('input');
	input.style.width = '95%'; 
	$(input).autocomplete(frasi, { 
		matchContains :true,
		minChars : 0	
	});
	input.value=durata!=''?durata:frasi[0];
	td.appendChild(input);
	td.align="center";
	tr.appendChild(td);
	td = document.createElement('td');
	input = document.createElement('input');
	input.maxlength='2';
	input.onblur=function(){javascript:isNumber(this);};
	input.style.width = '20px'; 
	if (pCiclo!='S') 
		input.style.visibility = 'hidden';
	input.value=scatole;
	td.appendChild(input);
	td.align="center";
	tr.appendChild(td);
	td = document.createElement('td');
	var select=document.createElement('select');
	select.className='selCategoria';
	setSelCategoria(select,categoria);
	td.appendChild(select);
	tr.appendChild(td);
	td = document.createElement('td');
	td.className= 'canc';
	td.onclick=function(){javascript:deleteRow(this);};
	tr.appendChild(td);
	tBody.appendChild(tr);
	
}

function apriProntuario(statoTerapia, url_extra) {

	if (typeof(statoTerapia)=='undefined') {
		statoTerapia = 'AMB';
	}
	
//	nuovaTerapia("test__farmaco", 100, 'S', 100, 100, this);
	var dati = document.getElementById('EXTERN');
	var url="servletGeneric?class=whale.cartellaclinica.gestioneTerapia.plgTerapia";
	url+= "&modality=F&layout=V&reparto="+dati.reparto.value;
/*	url+= "&idenVisita="+dati.idenVisita.value;
	url+= "&idenAnag="+dati.idenAnag.value;*/
	url+= "&statoTerapia=" + statoTerapia;
//	url+="&btnTerapia=Genera::if(parent.validazione())parent.generaHtml('parent.generaPlgTerapia',true,this);";
	
	if (typeof url_extra != 'undefined') {
		url += url_extra;
	}

//	this.open(url,'Prontuario','scrollbars=no,resizable=no,width=600,height=310,status=no,location=no,toolbar=no' );
	$.fancybox({
		'width'		: (screen.availWidth - 150),
		'height'	: (screen.availHeight - 100), //$('div#divTerapie',parent.document).height()
		'href'		: url,
		'type'		: 'iframe'
	});
}

function getSezioneReferto(id) {
	return opener.document.getElementById(id);
//	return parent.parent.frames["frameWork"].tinyMCE.get(id);
}

function setContentSezioneReferto(id, contenuto) {
	getSezioneReferto(id).value = contenuto;
//	getSezioneReferto(id).setContent(contenuto);
}

function copia (oggetto, iden) {
	var vResponse;
	dwr.engine.setAsync(false);
	DataDistribution.check_then_copy(oggetto,iden,callback_copia);
	dwr.engine.setAsync(true);
	return vResponse;
	
	function callback_copia(resp){
		vResponse = resp;
	}
}

function generaTabTerapie() {
//	top.DatiNonRegistrati.set(true);
//	var frame = parent.parent.frames["frameWork"];
	var tab = document.getElementById('tabWkTerapieLettera').getElementsByTagName('tbody')[0];
	var len = tab.rows.length;
	// controllo presenza della durata della terapia in tabella (dato obbligatorio)
	for (var i = 0; i < len; i++ ) {
		if (tab.rows[i].getElementsByTagName('input')[1] && tab.rows[i].style.display=='') {
			var td_pos = tab.rows[i].getElementsByTagName('input')[0];
			if (!td_pos.value || td_pos.value=='') {
				return alert('Inserire la posologia per tutte le terapie prima di importare');
			}
			var td_dc = tab.rows[i].getElementsByTagName('input')[1];
			if (!td_dc.value || td_dc.value=='') {
				return alert('Inserire la durata consigliata per tutte le terapie prima di importare');
			}
			var td_pc = tab.rows[i].getElementsByTagName('input')[2];
			if (td_pc.style.visibility=='' && (!td_pc.value || td_pc.value=='')) {
				return alert('Inserire il numero di scatole per i farmaci del Primo Ciclo prima di importare');
			}
		}
	}
	
	arTerapie = new Array();
	var boolTerDom=false;
	var bool1Ciclo=false;
	var htmlOutTerDom='<table border=1 style="width:95%;font-size: 12px;">';
	var htmlOut1Ciclo='<table border=1 style="width:95%;font-size: 12px;"><tr><th>Farmaco</th><th>Posologia</th><th>Durata</th><th>Scatole</th></tr>';
	var txtOutTerDom = '';
	var txtOut1Ciclo = '';
	$('select.selCategoria:first option').each(function() {
		var categoriaPrec='';
		var categoria = $(this).text();
		$(document.all.tabWkTerapieLettera).find('tr.terapia').each(function(){
			if ($(this).find('select.selCategoria option:selected').text()==categoria) {
				if (categoria!=categoriaPrec) {
					/*htmlOutTerDom += '<table border=1 style="width:95%;font-size: 12px;">';*/
					htmlOutTerDom += '<tr><th colspan=3>'+ categoria +'</th></tr>';
					categoriaPrec=categoria;
				}
				var arTerapia = new Object();
				var farmaco = $(this).find('td')[1].innerText;
				var iden_farmaco = $(this).find('td')[1].iden_far;
				var stato_terapia = $(this).find('td')[1].stato_ter;
				var tipo_terapia = $(this).find('td')[1].tipo_ter;
				var dose = $(this).find('td input')[0].value;
				var durata = $(this).find('td input')[1].value;
				var scatole = $(this).find('td input')[2].value!=''?$(this).find('td input')[2].value:0;
				var primo_ciclo = 'X';
				//aggiunte:
				var id_sos = $(this).find('td')[1].id_sos;
				var cod_dec = $(this).find('td')[1].cod_dec;
				htmlOutTerDom+='<tr><td style="vertical-align:top;font-weight:bold;">'+farmaco+'</td><td style="vertical-align:top;">'+dose+'</td><td style="vertical-align:top;">'+durata+'</td></tr>';
				txtOutTerDom += farmaco + ': ' + dose + ', ' + durata + '.\n';
				boolTerDom=true;
				if ($(this).find('td.Spunta[checked="S"]').length==1) {
					htmlOut1Ciclo+='<tr><td style="vertical-align:top;font-weight:bold;">'+farmaco+'</td><td style="vertical-align:top;">'+scatole + (scatole == 1 ? ' scatola' : ' scatole') + '</td></tr>';
					txtOut1Ciclo += farmaco + ': ' + scatole + (scatole == 1 ? ' scatola\n' : ' scatole\n');
					bool1Ciclo=true;
					primo_ciclo='S';
				} else if ($(this).find('td.Spunta[checked="N"]').length==1) {
					primo_ciclo='N';
				}
/*				arTerapia.push(primo_ciclo); 
				arTerapia.push(iden_farmaco); 
				arTerapia.push(stato_terapia); 
				arTerapia.push(tipo_terapia); 
				arTerapia.push(dose); 
				arTerapia.push(durata); 
				arTerapia.push(scatole); 
				arTerapia.push(categoria);*/
				arTerapia["PRIMO_CICLO"]=primo_ciclo;
				arTerapia["IDEN_FARMACO"]=iden_farmaco;
				arTerapia["STATO_TERAPIA"]=stato_terapia;
				arTerapia["TIPO_TERAPIA"]=tipo_terapia;
				arTerapia["DOSE"]=dose;
				arTerapia["DURATA"]=durata;
				arTerapia["NUM_SCATOLE"]=scatole;
				arTerapia["CATEGORIA"]=categoria;
				arTerapia["PRIMO_CICLO"]=primo_ciclo;
				arTerapia["FARMACO"]=farmaco;
				arTerapia["IDEN_SOSTANZA"]=id_sos;
				arTerapia["COD_DEC"]=id_sos;
				arTerapie.push(arTerapia);
				
				copia('farmaci',[iden_farmaco]);
				copia('sostanze',[id_sos]);
			}
		});
	});
	htmlOutTerDom += '</table>';
	htmlOut1Ciclo += '</table>';
	if (boolTerDom) {
		setContentSezioneReferto('TERAPIE_DOMICILIARI', txtOutTerDom); // ex idTerapiaDomiciliare
	} else {
		setContentSezioneReferto('TERAPIE_DOMICILIARI', 'Nessuna terapia domiciliare');
	}
	if (typeof getSezioneReferto('TERAPIE_DOMICILIARI_1CICLO') !='undefined') { // ex idPrimoCiclo
		if(bool1Ciclo) {
			setContentSezioneReferto('TERAPIE_DOMICILIARI_1CICLO', txtOut1Ciclo);
		} else {
			setContentSezioneReferto('TERAPIE_DOMICILIARI_1CICLO', 'Nessun farmaco dispensabile per il primo ciclo');
		}
	}
//	alert('Farmaci importati correttamente in Terapia Domiciliare e Primo Ciclo');
	opener.setTerapie(arTerapie);
	chiudiTerapie();	
}

function chiudiTerapie() {
	self.close();
}

function reloadTerapie() {
	
//	parent.parent.utilMostraBoxAttesa(true);
	window.location.reload();
}

function spunta(control) {
	if (control.checked == 'S'){
		control.checked = 'N';
		control.innerHTML="";
		control.parentNode.getElementsByTagName('input')[2].style.visibility = 'hidden';
	} 
	else {
		control.checked = 'S';
		control.innerHTML="";
		control.parentNode.getElementsByTagName('input')[2].style.visibility = '';
	}
}

function deleteRow(cell) {
	var i=cell.parentNode.rowIndex;
	document.getElementById('tabWkTerapieLettera').deleteRow(i);
}

function apriAltriFarmaci() {
	this.evt_farmaco = window.event.srcElement;
	var id_sostanza = evt_farmaco.parentNode.getElementsByTagName('td')[1].id_sos;
	if (typeof id_sostanza == 'undefined' || id_sostanza=='' || id_sostanza == -1) {
		alert('Impossibile ricercare farmaco alternativo. Sostanza non presente');
		return;
	}
	apriProntuario('AMB1','&IDEN_SOSTANZA=' + id_sostanza);
	/*
	var url = "servletGenerator?KEY_LEGAME=WK_FARMACI&WHERE_WK=WHERE ID_SOSTANZA='"
		+ id_sostanza+ "' and PRIMO_CICLO ='S'";//"'&ORDER_FIELD_CAMPO=";
	$.fancybox({
		'width'		: 600,
		'height'	: 300,
		'href'		: url,
		'type'		: 'iframe'
	});*/
//	window.open(src,'Prontuario','scrollbars=yes,resizable=no,width=600,height=310,status=no,location=no,toolbar=no');
}

function sostituisciFarmaco(farmaco, iden, cod_dec) {
//	document.getElementById(id_riga_farma).parentNode.getElementsByTagName('td')[1].innerText=farmaco;
	var td = evt_farmaco.parentNode.getElementsByTagName('td')[0];
	td.className= 'Spunta';
	td.onclick=function(){javascript:spunta(this);};
	td.checked='S';

	td = evt_farmaco.parentNode.getElementsByTagName('td')[1];
	td.innerText=farmaco;
	td.iden_far=iden;
	td.cod_dec=cod_dec;
	
	td = evt_farmaco.parentNode.getElementsByTagName('td')[4];
	td.getElementsByTagName('input')[0].style.visibility='visible';
}

function filtraTabFarmaci(radio) {
	var tab = document.all.tabWkTerapieLettera;
	var n = tab.rows.length;
	var gruppoHeader = null;
	var hideGruppoHeader = false;
	for (var i = 1; i < n; i++) {  
		if (tab.rows[i].className=='gruppoTerapia') {
			if (hideGruppoHeader) {
				gruppoHeader.style.display = 'none';
			} else {
				if (gruppoHeader)
					gruppoHeader.style.display = '';
			}
			gruppoHeader = tab.rows[i]; 
			hideGruppoHeader = true;
		}
		else if (tab.rows[i].cells[1].stato_ter) {
			if (radio.value =='T' || tab.rows[i].cells[1].stato_ter == radio.value) {
				tab.rows[i].style.display = '';
				hideGruppoHeader = false;
			} else {
				tab.rows[i].style.display = 'none';
			}
		}
	}
}

function deleteGruppo(cell) {
	var nextRow = cell.parentNode.nextSibling;
	var deleteGruppoTitolo = true;
	while (nextRow.cells[1].stato_ter) { 
		newRow = nextRow.nextSibling; 
		if (nextRow.style.display=='') {
			deleteRow(nextRow.cells[1]);
		} else {
			deleteGruppoTitolo = false;
		}
		nextRow = newRow;
	}
	cell.parentNode.style.display='none';
	if (deleteGruppoTitolo) {
		deleteRow(cell);
	}
}

function isNumber(input) {
	var text = input.value;
	var ValidChars = "0123456789";
	var Char;
	if (text=='')
		return;

	for (var i = 0; i < text.length; i++) 
	{ 
		Char = text.charAt(i); 
		if (ValidChars.indexOf(Char) == -1) {
			alert('Inserire un valore numerico');
			input.value='';
			return;
		}
	}
}

function apriLetterePrecedenti() {
//	var dati = top.getForm(document);
	var dati = document.getElementById('EXTERN');
	var url="servletGeneric?class=whale.cartellaclinica.lettera.pckInfo.sTerapieLettere";
/*	url+= "&idenVisita="+dati.idenVisita.value; */
	url+= "&idenAnag="+dati.idenAnag.value;
	url+= "&reparto="+dati.reparto.value;
/*	url+= "&nosologico="+dati.ricovero;*/
	$.fancybox({
	'padding'	: 3,
	'width'		: $(parent.document).width(),
	'height'	: $(parent.document).height(),
	'href'		: url,
	'type'		: 'iframe'
	});
}

function aggiungiCategoria(n) {
	if (n==0) {
		$('div#addCategoria').toggle().find('input').focus().val('');
	} else {
		var categoria = $('input#categoria').val();
		if (categoria=='') 
			return alert('inserire una categoria');
		if (pushCategoria(categoria)) {
			$('div#addCategoria').hide().find('input').val('');
		} else {
			alert('categoria già presente');
		}
	}
}

function pushCategoria(categoria) {
	var exists = false; 
	$('select#prototype option').each(function(){
		if($(this).text()==categoria)
			exists = true;
	});
	if (exists) {
		return false;
	} else {
		$('select.selCategoria').append('<option>'+categoria+'</option>');
		return true;
	}
}