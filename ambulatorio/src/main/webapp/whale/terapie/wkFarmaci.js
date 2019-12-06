var maxNrow= new Array();
maxNrow.push(0);
var pageNumber = 1;

var conf={
	idxRicercaAttiva:null,
	tipi:[],
	getWhere:function(inWhere,inTxt){
		var where = inWhere;//conf.tipi[conf.idxRicercaAttiva].where;
		where = where.replace(/#REPARTO#/g,document.EXTERN.reparto.value);
		where = where.replace(/#TIPO_TERAPIA#/g,$("span.tipiTerapie select option:selected").val());
		where = where.replace('#TEXT#',inTxt);
		
		return where;
	}
	
}

var keyLegame="";
var whereWk="";
var vTxt="";
var vReparto="";

function applica(){
	
	try{
		attesa(true);
		
		var strWhere = "";
		maxNrow= new Array();
		maxNrow.push(0);
		pageNumber = 1;

		if(whereWk=='' || keyLegame=='' ){
			alert('Compilare i criteri di ricerca');
			attesa(false);
			return;
		}

		document.all['wkSearchFarmaci'].src="servletGenerator?KEY_LEGAME="+keyLegame+"&WHERE_WK="+conf.getWhere(whereWk,vTxt);

		
	}catch(e){
		alert(e.description);
		attesa(false);
	}
	
}


function setTipoTerapia(idenTerapia){

	var filteredSpan=$('span.confScheda span[tipo_terapia='+idenTerapia+']');
	if (filteredSpan.length==0) {
		return alert('Nessuna selezione disponibile in questo ambito');
	} else if (filteredSpan.length==1){
		filteredSpan.click();
	} //else {
		filteredSpan.show();
	//};

	if(conf.idxRicercaAttiva==null || conf.tipi[conf.idxRicercaAttiva].abilitaTxt)return;
	document.all['wkSearchFarmaci'].src="servletGenerator?KEY_LEGAME="+conf.tipi[conf.idxRicercaAttiva].keys[0]+"&WHERE_WK="+conf.getWhere();
	
}


var prescrizioniStd = {
		visualizza:function(iden) {
			if (iden==""){ return alert("Nessuna prescrizione selezionata");	}
			var arIden= (iden.toString()).split('*');
			if (arIden.length>1){ return alert("Selezionare una singola prescrizione"); }

			var url = "SchedaTerapia?IDEN_VISITA="+IDEN_VISITA+"&IDEN_MODELLO="+arIden[0]+"&STATO=MODELLO&ID_SESSIONE=1";
			$.fancybox({
				'padding'	: 3,
				'width'		: 680,
				'height'	: $('body').height(),
				'href'		: url,
				'type'		: 'iframe'
			});
		},
		cancella:function(iden) {
			if (iden==""){ return alert("Nessuna prescrizione selezionata");	}
			var arIden= (iden.toString()).split('*');
			var msg = "";
			if (arIden.length>1) {
				msg = "Si conferma la cancellazione delle "+arIden.length+" prescrizioni standard selezionate?";
			} else {
				msg = "Si conferma la cancellazione della prescrizione standard selezionata?";
			}
			if(confirm(msg)) {
				var reparto = document.EXTERN.reparto.value;
				for (var i in arIden) { 
					alert(arIden[i] + ":" + reparto);
					var resp = top.executeStatement("terapie.xml","prescrizioniStd.cancella",[arIden[i],reparto]);
					if (resp[0]!='OK') {
						alert(resp);
					}
				}
				refreshWkSearchFarmaci();
			}
		},
		modifica:function(iden,descrizione) {
			if (iden==""){ return alert("Nessuna prescrizione selezionata");	}
			var arIden= (iden.toString()).split('*');
			if (arIden.length>1){ return alert("Selezionare una singola prescrizione"); }
			var url = "servletGeneric?class=cartellaclinica.gestioneTerapia.plgTerapia";
			url+="&layout=V&reparto="+document.EXTERN.reparto.value;
			url+="&idenVisita="+-1+"&idenAnag="+-1;	
			url+="&PROCEDURA="+"MODELLO";	
			url+="&idenModello="+iden;	
			url+="&descrModello="+descrizione;	
			url+="&idenScheda="+iden;	
			url+="&modality="+"I";	
			url+="&btnGenerali="+"Salva Std::registra('modello');";	
			$.fancybox({
				'padding'	: 3,
				'width'		: $(document.body).width(),
				'height'	: $(document.body).height(),
				'onCleanup' : refreshWkSearchFarmaci,
				'href'		: url,
				'type'		: 'iframe'
			});
		},
		associa:function(iden) {
			if (iden==""){ return alert("Nessuna prescrizione selezionata");	}
			var arIden= (iden.toString()).split('*');
			if (arIden.length>1){ return alert("Selezionare una singola prescrizione"); }
			
			var url = "servletGeneric?class=cartellaclinica.gestioneTerapia.associaRepartiModelli&iden_modello="+arIden[0];
			$.fancybox({
				'padding'	: 3,
				'width'		: 680,
				'height'	: 300,
				'href'		: url,
				'type'		: 'iframe'
			});
		}
}

function setRicerca(obj,where){
	
	for(var i=0;i<document.getElementById("divContenitoreRicerche").childNodes.length;i++)
		document.getElementById("divContenitoreRicerche").childNodes[i].style.display = "none";
		
	var divRicerca = document.getElementById("div"+obj.id);
	divRicerca.style.display = "block";

	$(divRicerca).find("input#txtRicerca").focus();
		
	whereWk = where;
	keyLegame ="";
//	vTxt='';

	$(divRicerca).find("span[name=radioKeyLegame]:first").click();
	
}

function setKeyLegame(key,tipoWk,where){
	keyLegame = key;
	
	if(tipoWk!='')
		keyLegame += "&TIPO_WK="+tipoWk;
		
	if(where!='')
		whereWk =  where;

	if(vTxt!='' || $("div#divContenitoreRicerche input:visible").length==0)
		applica();
}

function setTxt(txt){
	vTxt = txt.toUpperCase();
}

function cerca(){
	applica();
}

function intercetta(txt){
	vTxt = txt.toUpperCase();
	if(event.keyCode==13){
		applica();
	}
}
