
var arTerapie;
var farmaciTerapia = false;
var farmaciPrimoCiclo = false;
var WindowCartella = null;
$(document).ready(function() {

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;


    WindowCartella.utilMostraBoxAttesa(false);

     $('textarea.expand').live("click", function(event){
         $(this).TextAreaExpander();
     });

    $('input.autocomplete,textarea.autocomplete').autocomplete(frasi, {
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
 
    $("textarea[class*=expand]").TextAreaExpander();
    
    NS_TERAPIA_DOMICILIARE.setEvents();


//	$("div#tableContainer").height($(document.body).height()-50);
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
	var textarea = document.createElement('textarea');
    textarea.style.width = '95%';
    textarea.value=dose;
    textarea.className='expand';
    textarea.style.width='95%';
    textarea.style.height='20px';
    textarea.style.overflow='hidden';
	td.appendChild(textarea);
	td.align="center";
	tr.appendChild(td);
	td = document.createElement('td');
	input = document.createElement('textarea');
	input.style.width = '95%';
//	$(input).autocomplete(frasi, {
//		matchContains :true,
//		minChars : 0
//	});
    //style="PADDING-BOTTOM: 0px; WIDTH: 95%; HEIGHT: 20px; OVERFLOW: hidden; PADDING-TOP: 0px" class=expand rows=1 cols=1
    input.className='expand';
    input.style.width='95%';
    input.style.height='20px';
    input.style.overflow='hidden';
    input.value=durata;
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

function apriProntuario() {

//	nuovaTerapia("test__farmaco", 100, 'S', 100, 100, this);
	var dati = WindowCartella.getForm(document);
	var url="servletGeneric?class=cartellaclinica.gestioneTerapia.plgTerapia";
	url+= "&modality=F&layout=V&reparto="+dati.reparto;
	url+= "&idenVisita="+dati.iden_visita;
	url+= "&idenAnag="+dati.iden_anag;
	url+= "&statoTerapia=L";
//	url+="&btnTerapia=Genera::if(parent.validazione())parent.generaHtml('parent.generaPlgTerapia',true,this);";

//	this.open(url,'Prontuario','scrollbars=no,resizable=no,width=600,height=310,status=no,location=no,toolbar=no' );
	$.fancybox({
		'width'		: 600,
		'height'	: 400,//$('div#divTerapie',parent.document).height(),
		'href'		: url,
		'type'		: 'iframe'
	});
}

function generaTabTerapie() {
	top.DatiNonRegistrati.set(true);
	var frame = parent.parent.frames["frameWork"];
	var tab = document.getElementById('tabWkTerapieLettera').getElementsByTagName('tbody')[0];
	var len = tab.rows.length;
	// controllo presenza della durata della terapia in tabella (dato obbligatorio)
	for (var i = 0; i < len; i++ ) {
		if (tab.rows[i].getElementsByTagName('textarea')[1] && tab.rows[i].style.display=='') {
			/*var td_dc = tab.rows[i].getElementsByTagName('textarea')[1];
			if (!td_dc.value || td_dc.value=='') {
				return alert('Inserire la durata consigliata per tutte le terapie prima di importare');
			}*/
			var td_pc = tab.rows[i].getElementsByTagName('input')[0];
			if (td_pc.style.visibility=='' && (!td_pc.value || td_pc.value=='')) {
				return alert('Inserire il numero di scatole per i farmaci del Primo Ciclo prima di importare');
			}
		}
	}
	farmaTable = document.getElementById('tabWkTerapieLettera').outerHTML;

	arTerapie = new Array();
	var boolTerDom=false;
	var bool1Ciclo=false;
	var htmlOutTerDom='<table border=1 style="width:95%;font-size: 12px;"><tr><th>Farmaco</th><th>Posologia</th><th>Durata</th></tr>';
	var htmlOut1Ciclo='<table border=1 style="width:95%;font-size: 12px;"><tr><th>Farmaco</th><th>Posologia</th><th>Durata</th><th>Scatole</th></tr>';
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
				var arTerapia = new Array();
				var farmaco = $(this).find('td')[1].innerText;
				var iden_farmaco = $(this).find('td')[1].iden_far;
				var stato_terapia = $(this).find('td')[1].stato_ter;
				var tipo_terapia = $(this).find('td')[1].tipo_ter;
				var dose = $(this).find('td textarea')[0].value;
				var durata = $(this).find('td textarea')[1].value;
				var scatole = $(this).find('td input').val()!=''?$(this).find('td input').val():0;
				var primo_ciclo = 'X';
				htmlOutTerDom+='<tr><td style="vertical-align:top;font-weight:bold;">'+farmaco+'</td><td style="vertical-align:top;">'+dose+'</td><td style="vertical-align:top;">'+durata+'</td></tr>';

				boolTerDom=true;
				if ($(this).find('td.Spunta[checked="S"]').length==1) {
					htmlOut1Ciclo+='<tr><td style="vertical-align:top;font-weight:bold;">'+farmaco+'</td><td style="vertical-align:top;">'+dose+'</td><td style="vertical-align:top;">'+durata+'</td><td style="vertical-align:top;">'+scatole+'</td></tr>';
					bool1Ciclo=true;
					primo_ciclo='S';
				} else if ($(this).find('td.Spunta[checked="N"]').length==1) {
					primo_ciclo='N';
				}
				
				var farmaco = new Farmaco(
						iden_farmaco,
						primo_ciclo ,
						categoria ,
						stato_terapia ,
						tipo_terapia ,
						dose ,
						durata ,
						scatole 
				);
				
				
				
				
				/*arTerapia.push(primo_ciclo);
				arTerapia.push(iden_farmaco);
				arTerapia.push(stato_terapia);
				arTerapia.push(tipo_terapia);
				arTerapia.push(dose);
				arTerapia.push(durata);
				arTerapia.push(scatole);
				arTerapia.push(categoria);
				arTerapie.push(arTerapia)*/;
				arTerapie.push(farmaco);
			}
		});
	});
	htmlOutTerDom += '</table>';
	htmlOut1Ciclo += '</table>';
	if (boolTerDom) {
		frame.tinyMCE.get('idTerapiaDomiciliare').setContent(htmlOutTerDom);
		farmaciTerapia = true;
	} else {
		frame.tinyMCE.get('idTerapiaDomiciliare').setContent('Nessuna terapia domiciliare');
	}
	if (typeof frame.tinyMCE.get('idPrimoCiclo') !='undefined') {
		if(bool1Ciclo) {
			frame.tinyMCE.get('idPrimoCiclo').setContent(htmlOut1Ciclo);
			farmaciPrimoCiclo = true;
		} else {
			frame.tinyMCE.get('idPrimoCiclo').setContent('Nessuna terapia per il primo ciclo');
		}
	}
//	alert('Farmaci importati correttamente in Terapia Domiciliare e Primo Ciclo');
	if (typeof (parent.NS_LOAD_TERAPIA_DOMICILIARE)!='undefined'){
		parent.NS_LOAD_TERAPIA_DOMICILIARE.idenTerapiaDomiciliare = 0;		
	}
	parent.chiudiTerapie();
}

function chiudiTerapie() {
	parent.chiudiTerapie();
}

function reloadTerapie() {

	parent.parent.utilMostraBoxAttesa(true);
	window.location.reload();
}

function spunta(control) {
	if (control.checked == 'S'){
		control.checked = 'N';
		control.innerHTML="";
		control.parentNode.getElementsByTagName('input')[0].style.visibility = 'hidden';
	}
	else {
		control.checked = 'S';
		control.innerHTML="";
		control.parentNode.getElementsByTagName('input')[0].style.visibility = '';
	}
}

function deleteRow(cell) {
	var i=cell.parentNode.rowIndex;
	document.getElementById('tabWkTerapieLettera').deleteRow(i);
}

function apriAltriFarmaci() {
	this.evt_farmaco = window.event.srcElement;
	var id_sostanza = evt_farmaco.parentNode.getElementsByTagName('td')[1].id_sos;
	if (id_sostanza=='') {
		alert('Impossibile ricercare farmaco alternativo. Sostanza non presente');
		return;
	}
	var url = "servletGenerator?KEY_LEGAME=WK_PRONTUARIO&WHERE_WK=WHERE ID_SOSTANZA='"
		+ id_sostanza+ "' and PRIMO_CICLO ='S'";//"'&ORDER_FIELD_CAMPO=";
	$.fancybox({
		'width'		: 600,
		'height'	: 300,
		'href'		: url,
		'type'		: 'iframe'
	});
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
	var dati = WindowCartella.getForm(document);
	var url="servletGeneric?class=cartellaclinica.lettera.pckInfo.sTerapieLettere";
	url+= "&idenVisita="+dati.iden_visita;
	url+= "&idenAnag="+dati.iden_anag;
	url+= "&reparto="+dati.reparto;
	url+= "&nosologico="+dati.ricovero;
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


var NS_TERAPIA_DOMICILIARE = {
		
	init:function(){
		
	},
	setEvents:function(){
        $('span#btnCancel').click(function(){
        	chiudiTerapie();
        });
        $('span#btnGeneraTerapie').click(function(){
        	generaTabTerapie();
        });
        $('span#btnReload').click(function(){
        	reloadTerapie();
        });
        $('span#btnLetterePre').click(function(){
        	apriLetterePrecedenti();
        });
        $('span#btnProntuario').click(function(){
        	apriProntuario();
        });
//        if ($('#stato').val()=='F'){
//        	$('span#btnRegistraTerapiaDomiciliare').hide();
//        }else{
//	        $('span#btnRegistraTerapiaDomiciliare').click(function(){
//	        	NS_FIRMA_TERAPIA_DOMICILIARE.registra();
//	        });
//        }
//        $('span#btnFirmaTerapiaDomiciliare').click(function(){
//        	NS_FIRMA_TERAPIA_DOMICILIARE.firma();
//        });
//        $('span#btnTerapiePre').click(function(){
//        	alert('Funzionalità non disponibile.')
//        });

	}
}

//var NS_FIRMA_TERAPIA_DOMICILIARE = {
//	
//	salvaFarmaci:function(param){
//
//		var tab = document.getElementById('tabWkTerapieLettera').getElementsByTagName('tbody')[0];
//		var len = tab.rows.length;
//		if (len==2){
//			return {
//				valore 	: 'KO',
//				messaggio:'Inserire almeno una terapia'
//			}
//		}
//		// controllo presenza della durata della terapia in tabella (dato obbligatorio)
//		for (var i = 0; i < len; i++ ) {
//			if (tab.rows[i].getElementsByTagName('textarea')[1] && tab.rows[i].style.display=='') {
//				var td_dc = tab.rows[i].getElementsByTagName('textarea')[1];
//				if (!td_dc.value || td_dc.value=='') {
//					return alert('Inserire la durata consigliata per tutte le terapie prima di salvare');
//				}
//				var td_pc = tab.rows[i].getElementsByTagName('input')[0];
//				if (td_pc.style.visibility=='' && (!td_pc.value || td_pc.value=='')) {
//					return alert('Inserire il numero di scatole per i farmaci del Primo Ciclo prima di salvare');
//				}
//			}
//		}
//
//		farmaTable = document.getElementById('tabWkTerapieLettera').outerHTML;
//
//		var boolTerDom=false;
//		var bool1Ciclo=false;
//		var htmlOutTerDom='<table border=1 style="width:95%;font-size: 12px;"><tr><th>Farmaco</th><th>Posologia</th><th>Durata</th></tr>';
//		var htmlOut1Ciclo='<table border=1 style="width:95%;font-size: 12px;"><tr><th>Farmaco</th><th>Posologia</th><th>Durata</th><th>Scatole</th></tr>';
//		var farmaco  		= ''; var strfarmaco = '';
//		var iden_farmaco	= ''; var striden_farmaco	= '';		
//		var stato_terapia	= ''; var strstato_terapia	= '';
//		var tipo_terapia	= ''; var strtipo_terapia	= '';
//		var dose			= ''; var strdose	= '';
//		var durata			= ''; var strdurata	= '';
//		var scatole			= ''; var strscatole	= '';
//		var primo_ciclo		= ''; var strprimo_ciclo	= '';
//		var strcategoria	= '';
//		$('select.selCategoria:first option').each(function() {
//			var categoriaPrec='';
//			var categoria = $(this).text();
//
//			$(document.all.tabWkTerapieLettera).find('tr.terapia').each(function(){
//				if ($(this).find('select.selCategoria option:selected').text()==categoria) {
//					if (categoria!=categoriaPrec) {
//						htmlOutTerDom += '<tr><th colspan=3>'+ categoria +'</th></tr>';
//						categoriaPrec=categoria;
//					}
//					var arTerapia = new Array();
//					farmaco 		= $(this).find('td')[1].innerText;
//					iden_farmaco 	= $(this).find('td')[1].iden_far;
//					stato_terapia 	= $(this).find('td')[1].stato_ter;
//					tipo_terapia 	= $(this).find('td')[1].tipo_ter;
//					dose 			= $(this).find('td textarea')[0].value;
//					durata 			= $(this).find('td textarea')[1].value;
//					scatole 		= $(this).find('td input').val()!=''?$(this).find('td input').val():0;
//					primo_ciclo		= 'X';
//					htmlOutTerDom	+='<tr><td style="vertical-align:top;font-weight:bold;">'+farmaco+'</td><td style="vertical-align:top;">'+dose+'</td><td style="vertical-align:top;">'+durata+'</td></tr>';
//
//					boolTerDom=true;
//					if ($(this).find('td.Spunta[checked="S"]').length==1) {
//						htmlOut1Ciclo+='<tr><td style="vertical-align:top;font-weight:bold;">'+farmaco+'</td><td style="vertical-align:top;">'+dose+'</td><td style="vertical-align:top;">'+durata+'</td><td style="vertical-align:top;">'+scatole+'</td></tr>';
//						bool1Ciclo=true;
//						primo_ciclo = 'S' ;
//					} else if ($(this).find('td.Spunta[checked="N"]').length==1) {
//						primo_ciclo = 'N' ;
//					}
//					
//					strfarmaco 		+= farmaco + '|';
//					striden_farmaco	+= iden_farmaco + '|';		
//					strstato_terapia+= stato_terapia + '|';
//					strtipo_terapia	+= tipo_terapia + '|';
//					strdose			+= dose + '|';
//					strdurata		+= durata + '|';
//					strscatole		+= scatole + '|';
//					strprimo_ciclo	+= primo_ciclo + '|';
//					strcategoria  	+= categoria+ '|';
//
//				}
//			});
//		});
//		htmlOutTerDom += '</table>';
//		htmlOut1Ciclo += '</table>';
//		
//		var primoCicloSez = '';
//		var terapieSez = '';		
//		if (boolTerDom) {
//			terapieSez='idTerapiaDomiciliare|'+htmlOutTerDom;
//		} else {
//			terapieSez='idTerapiaDomiciliare|Nessuna terapia domiciliare';
//		}
//		if(bool1Ciclo) {
//			primoCicloSez = 'idPrimoCiclo|'+htmlOut1Ciclo;
//		} else {
//			primoCicloSez = 'idPrimoCiclo|Nessuna terapia per il primo ciclo';
//		}
//		
//		var pBinds = new Array();
//		pBinds.push(param.funzione);
//		pBinds.push(param.iden_visita);
//		pBinds.push(param.iden_visita_registrazione);
//		pBinds.push(param.iden_per);
//		pBinds.push(param.firma);
//		pBinds.push(striden_farmaco);
//		pBinds.push(strscatole);
//		pBinds.push(strprimo_ciclo);
//		pBinds.push(strdose);
//		pBinds.push(strdurata);
//		pBinds.push(strtipo_terapia);
//		pBinds.push(strstato_terapia);
//		pBinds.push(strcategoria);
//		pBinds.push(terapieSez);
//		pBinds.push(primoCicloSez);
//
//		
//		var resp = WindowCartella.executeStatement('terapia_domiciliare.xml','salva_terapia_domiciliare',pBinds,1)
//		if (resp[0]=='OK'){
//			return {
//				valore 	: 'OK',
//				messaggio:resp[2]
//			}
//		}else{
//			return {
//				valore 	: 'KO',
//				messaggio:resp[1]				
//			}
//		};
//	},	
//	
//	registra:function(){
//		var ret = NS_FIRMA_TERAPIA_DOMICILIARE.salvaFarmaci({
//			funzione:'TERAPIA_DOMICILIARE',
//			iden_visita :WindowCartella.getForm(document).iden_ricovero,
//			iden_visita_registrazione:WindowCartella.getForm(document).iden_visita,
//			iden_per:WindowCartella.baseUser.IDEN_PER,
//			firma:'N'
//		});
//		
//		if (ret.valore=='KO'){
//			alert('Salvataggio Terapia Domiciliare non riuscito\n'+ret.messaggio)
//		}else{
//			WindowCartella.utilMostraBoxAttesa(true);
//			alert('Registrazione Effettuata Con Successo');
//			WindowCartella.apriTerapiaDomiciliare();
//		}
//	},
//		
//	firma:function(){
//		
//		var ret = NS_FIRMA_TERAPIA_DOMICILIARE.salvaFarmaci({
//			funzione:'TERAPIA_DOMICILIARE',
//			iden_visita :WindowCartella.getForm(document).iden_ricovero,
//			iden_visita_registrazione:WindowCartella.getForm(document).iden_visita,
//			iden_per:WindowCartella.baseUser.IDEN_PER,
//			firma:'S'
//		});
//		alert(ret.valore+'\n'+ret.messaggio)
//		if (ret.valore=='KO'){
//			alert('Salvataggio Terapia Domiciliare non riuscito\n'+ret.messaggio)
//		}else{
//			var myForm = window.document.frmFirmaTerapiaDomiciliare;
//			$('form[name=frmFirmaTerapiaDomiciliare] input[name=idenVersione]').val(ret.messaggio);
//			var finestra = window.open("", "finestra",
//					"fullscreen=yes scrollbars=no");
//			myForm.target = 'finestra';
//			myForm.action = 'servletGeneric?class=firma.SrvFirmaPdfMultipla';
//			myForm.submit();
//			WindowCartella.opener.top.closeWhale.pushFinestraInArray(finestra);		
//		}
//	}	
//};
//	
//
//
