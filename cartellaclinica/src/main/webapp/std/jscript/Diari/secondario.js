/**
 * Javascript in uso dalla pagina SCHEDA_EPICRISI. 
 */
//var opener=window.dialogArguments.WINDOW;
//var thisOpener=window.dialogArguments.DOCUMENT;

$(function() {
	
	try {
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.dati.txtData);
	}catch(e){
		//alert(e.description);
	}
	
	if(_STATO_PAGINA != 'I' || parent.frameSecondario.array_testo.length==0)
		document.getElementById('lblImporta').parentElement.parentElement.style.display = 'none';
	
	$('#txtDiario').focus();
	$('input[name=txtOra]').bind('keyup', function(){ oraControl_onkeyup(document.getElementById('txtOra'));});
	$('input[name=txtOra]').bind('blur', function(){ oraControl_onblur(document.getElementById('txtOra'));});
	$('input[name=txtData]').bind('blur', function(){if($('input[name=txtData]').val().substr(5,1)!='/' || $('input[name=txtData]').val().length!=10 ) {alert('Inserire la data nel formato corretto'); $('input[name=txtData]').focus();}});
	$("input[name=txtOra]").css({float:'left'}).parent().append($('<div></div>').addClass('classDivTestiStd').attr("title","Testi Standard").click(function(){apriTestiStandard('txtDiario');}));

});


function  apriTestiStandard(targetOut){

	if(_STATO_PAGINA == 'L'){return;}
	
	var url='servletGenerator?KEY_LEGAME=SCHEDA_TESTI_STD&TARGET='+targetOut+'&PROV='+document.EXTERN.FUNZIONE.value;
	$.fancybox({
		'padding'	: 3,
		'width'		: 1024,
		'height'	: 580,
		'href'		: url,
		'type'		: 'iframe'
	});
}


function caricamentoPagina(){
	if(_STATO_PAGINA == 'I')
		document.all.divGroupInfo.style.display='none';
	//document.dati.txtDiario.focus();
}

function chiudi(){
	$('iframe#frameSecondario',parent.document)[0].contentWindow.location.reload();
	parent.$.fancybox.close(); 	
}

function chiudiScheda(){
	
	if (document.getElementById('txtDiario').value!='' && _STATO_PAGINA!='L') {
		if (confirm("Attenzione: salvare le modifiche effettuate?")){
		registra();
		}
		else{
			parent.$.fancybox.close(); 
		}
	} else {
		parent.$.fancybox.close();
	}
}

function importaUltimoTesto(){
	var testo = '';
	try {
		var tipoDiario = parent.$('form[name=EXTERN] input[name=KEY_TIPO_DIARIO]').val() || '';
		var btnSelezionato = parent.config.tipi[tipoDiario].pulsanti[0];
		var tipoEpicrisi = parent.NS_DIARIO_GENERICO.getFiltroPulsante(btnSelezionato)[1].toString();
		if(parent.frameSecondario.array_testo.length>0 && parent.frameSecondario.array_tipo_diario.length==parent.frameSecondario.array_testo.length  && typeof tipoDiario != '') {
			for (var i=0, length=parent.frameSecondario.array_testo.length; i<length; i++) {
				if (parent.frameSecondario.array_tipo_diario[i] == tipoEpicrisi) {
					testo = parent.frameSecondario.array_testo[i];
					break;
				}
			}
		}
	} catch(e) {
		if(parent.frameSecondario.array_testo.length>0) {
			testo = parent.frameSecondario.array_testo[0];
		}
	}
	document.getElementById('txtDiario').value+=testo;
}

function registraEpicrisi(){	
	var data = clsDate.str2date($("INPUT[name='txtData']").val(),'DD/MM/YYYY',$("INPUT[name='txtOra']").val());
	var range;
	try {
		range = parent.config.tipi[parent.document.EXTERN.KEY_TIPO_DIARIO.value].inserimento;
		if (typeof range['range'] === 'object') range = range['range'];
		else throw new Error();
	} catch(e) {
		range = {down: null, top: null}; // controllo sulla data disabilitato
	}
	
    var check = clsDate.dateCompare(data, new Date(), range);
    switch(check) {
    	case 1:
			if(confirm("Non è possibile inserire una nota di diario con data ed ora superiori" + (range.top ? "a "+range.top+" ore rispetto" : "") + " a quelle attuali, si desidera reimpostare data/ora?")) {
				$("INPUT[name='txtData']").val(clsDate.getData(new Date(),'DD/MM/YYYY'));
				$("INPUT[name='txtOra']").val(clsDate.getOra(new Date()));
			}
			return;
    	case -1:
    		if(confirm("Non è possibile inserire una nota di diario con data ed ora inferiori" + (range.down ? "a "+range.down+" ore rispetto" : "") + " a quelle attuali, si desidera reimpostare data/ora?")) {
    			$("INPUT[name='txtData']").val(clsDate.getData(new Date(),'DD/MM/YYYY'));
    			$("INPUT[name='txtOra']").val(clsDate.getOra(new Date()));
    		}
    		return;
    	case 0: default: // data valida
    }
	registra();	
}