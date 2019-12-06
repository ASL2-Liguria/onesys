var maxNrow= new Array();
maxNrow.push(0);
var pageNumber = 1;

var conf={
	idxRicercaAttiva:null,
	tipi:[],
	getWhere:function(inWhere,inTxt){
		var where = inWhere;//conf.tipi[conf.idxRicercaAttiva].where;
		where 	= where.replace(/#REPARTO#/g,document.EXTERN.reparto.value);
		where 	= where.replace(/#TIPO_TERAPIA#/g,$("span.tipiTerapie select option:selected").val());
		where 	= where.replace('#TEXT#',inTxt);
		
		return where;
	}
	
}

var keyLegame="";
var whereWk="";
var vTxt="";
var vReparto="";

function applica(){
	
    try{
        var resp = top.executeStatement("terapie.xml","set_dati_farmacie",[document.EXTERN.reparto.value]);
        //alert('resp\n'+resp)
        if (resp[0]!='OK') {
            alert(resp);					
        }
    }catch(e){
 		alert('Errore Caricamento Reparto: '+e.description);       
    }
    
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

        attesa(false);

	}catch(e){
		alert(e.description);
		attesa(false);
	}
	
}

/*function nextPage(){
	var nRecords = (typeof document.all['wkSearchFarmaci'].contentWindow.EXTERN.RECORDS=='undefined'?9:document.all['wkSearchFarmaci'].contentWindow.EXTERN.RECORDS.value);
	var myTable = document.all['wkSearchFarmaci'].contentWindow.oTable;
	if (myTable.rows.length<nRecords){	alert('Ultima pagina disponibile');	return;	}
	
	attesa(true);
	var lastNrow =document.all['wkSearchFarmaci'].contentWindow.array_nrow[document.all['wkSearchFarmaci'].contentWindow.array_nrow.length-1];
	maxNrow.push(parseInt(lastNrow));
		
	document.all['wkSearchFarmaci'].src="servletGenerator?KEY_LEGAME="+keyLegame+"&WHERE_WK="+conf.getWhere(whereWk,vTxt)+ " and  nrow>" + lastNrow;	
	
	pageNumber = pageNumber +1;
}

function previousPage(){
	
	if (pageNumber==1){alert('Prima pagina disponibile');return;}
	attesa(true);

	document.all['wkSearchFarmaci'].src="servletGenerator?KEY_LEGAME="+keyLegame+"&WHERE_WK="+conf.getWhere(whereWk,vTxt) + " and nrow>" + maxNrow[pageNumber-2] + " and nrow<=" + maxNrow[pageNumber-1];
	
	pageNumber = pageNumber -1;
}*/

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
					var resp = top.executeStatement("terapie.xml","prescrizioniStd.cancella",[arIden[i],reparto]);
					if (resp[0]!='OK') {
						alert(resp);					
					}
					
				}
				refreshWkSearchFarmaci();
			}
		},
		modifica:function(iden,descrizione) {
			//alert('prescrizioniStd.modifica iden='+iden + ' descrizione='+descrizione);
			if (iden==""){ return alert("Nessuna prescrizione selezionata");	}
			var arIden= (iden.toString()).split('*');
			if (arIden.length>1){ return alert("Selezionare una singola prescrizione"); }
//			IDEN_SCHEDA = iden;
//			var td = $("iframe#wkSearchFarmaci").contents().find("tr.sel td");
//			if (td.length==0) {return alert("Nessuna prescrizione selezionata");}
//			loadModello(td[0]);
			var url = "servletGeneric?class=cartellaclinica.gestioneTerapia.plgTerapia";
			//url+="&statoTerapia=I";
			url+="&layout=V&reparto="+document.EXTERN.reparto.value;
			url+="&idenVisita="+-1+"&idenAnag="+-1;	
			url+="&PROCEDURA="+"MODELLO";	
			url+="&idenModello="+iden;	
			url+="&descrModello="+descrizione;	
			//url+="&idenScheda="+iden;	
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
		},
		
		creaPacchetto: function(pIden) {
			
			var arIden = String(pIden).split('*');
			if (arIden.length < 2)
				return alert("Selezionare almeno 2 prescrizioni standard");
			
			var url = "servletGeneric?class=generic.ParoleChiave.SchedaCategorie" +
			"&TABELLA=CC_TERAPIE_MODELLI" +
			"&IDEN_TABELLA="+ arIden[0] +
			"&CAMPO_DESCRIZIONE=DESCRIZIONE" +
			"&VALORE_DESCRIZIONE="+
			"&CAMPO_REPARTO=CODICE_REPARTO" +
			"&VALORE_REPARTO=" +  document.EXTERN.reparto.value +
			"&AMBITI=PRESCRIZIONE_STD" +
			"&CHECK=terapie.xml:prescrizioniStd.check:Descrizione già presente per il reparto" +
			"&DELETE=S" +
			"&TYPE=RADIO"+
			"&PACCHETTO="+pIden+
			"&OnClose=parent.$.fancybox.close();";
			
			$.fancybox({
				'padding' : 3,
				'width' : 480,
				'height' : 300,
				'href' : url,
				'onCleanup' : function() {if (document.EXTERN.PROCEDURA.value=='MODELLO') {
					parent.$.fancybox.close();} else {
						refreshWkSearchFarmaci();
					}
				},
				'type' : 'iframe'
			});
			
		},
		
		cancellaPacchetto :function(iden) {
			if (iden==""){ return alert("Nessun pacchetto selezionat0");	}
			var arIden= (iden.toString()).split('*');
			var msg = "";
			if (arIden.length>1) {
				msg = "Si conferma la cancellazione dei "+arIden.length+" pacchetti selezionati?";
			} else {
				msg = "Si conferma la cancellazione del pacchetto selezionato?";
			}
			if(confirm(msg)) {
				var reparto = document.EXTERN.reparto.value;
				for (var i in arIden) { 
					var resp = top.executeStatement("terapie.xml","prescrizioniStd.cancella",[arIden[i],reparto]);
					if (resp[0]!='OK') {
						alert(resp);					
					}
					
				}
				refreshWkSearchFarmaci();
			}
		}
		
};

var cicliTerapia = {
	modifica:function(idenCiclo,idens,descrizioni,numeroCiclo,intervalloCiclo,giornoInizio) {
		var arIden= (idenCiclo.toString()).split('*');
		if (arIden.length=0){ return alert("Nessun ciclo selezionato");	}
		if (arIden.length>1){ return alert("Selezionare un singolo ciclo"); }

		var url = "servletGeneric?class=cartellaclinica.gestioneTerapia.plgTerapia";
		url+="&layout=V&reparto="+document.EXTERN.reparto.value;
		url+="&idenVisita=-1&idenAnag=-1";	
		url+="&PROCEDURA=CICLO";	
		url+="&idenModelli="+idens;	
		url+="&descrModelli="+descrizioni;
		url+="&numeroCicli="+numeroCiclo;
		url+="&intervalloCicli="+intervalloCiclo;
		url+="&giornoInizio="+giornoInizio;
		//url+="&idenScheda="+iden;	
		url+="&modality=I";	
		url+="&idenCiclo="+idenCiclo;
		url+="&btnGenerali="+"Salva Ciclo::registra('ciclo');";
		//alert(url);
		$.fancybox({
			'padding'	: 3,
			'width'		: $(document.body).width(),
			'height'	: $(document.body).height(),
			'onCleanup' : refreshWkSearchFarmaci,
			'href'		: url,
			'type'		: 'iframe'
		});
	},
	cancella: function(idenCiclo,descrCiclo){
		if (confirm('Si conferma la cancellazione del ciclo '+descrCiclo+' ?')){
			WindowCartella.executeQuery("terapie.xml","delTerapieCiclo",[idenCiclo]);
			WindowCartella.executeQuery("terapie.xml","delCiclo",[idenCiclo]);
		}	
		cerca(); // refresh worklist e cancellazione del menu dd
	},
    visualizza: function(idenCiclo,idens,descrizioni,numeroCiclo,intervalloCiclo,giornoInizio){

            var arIden= (idenCiclo.toString()).split('*');
            if (arIden.length=0){ return alert("Nessun ciclo selezionato");	}
            if (arIden.length>1){ return alert("Selezionare un singolo ciclo"); }

            var url = "servletGeneric?class=cartellaclinica.gestioneTerapia.plgTerapia";
            url+="&layout=V&reparto="+document.EXTERN.reparto.value;
            url+="&idenVisita=-1&idenAnag=-1";
            url+="&PROCEDURA=CICLO";
            url+="&idenModelli="+idens;
            url+="&descrModelli="+descrizioni;
            url+="&numeroCicli="+numeroCiclo;
            url+="&intervalloCicli="+intervalloCiclo;
            url+="&giornoInizio="+giornoInizio;
            //url+="&idenScheda="+iden;
            url+="&modality=Vis";
            url+="&idenCiclo="+idenCiclo;
            url+="&btnGenerali=\"\"";

            //alert(url);
            $.fancybox({
               // 'padding'	: 3,
                'width'		: $(document.body).width(),
                'height'	: $(document.body).height(),
                'scrolling'    : 'yes',
                'onCleanup' : refreshWkSearchFarmaci,
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
	vTxt='';

//	try{
//		divRicerca.all["radioKeyLegame"].click();
//		divRicerca.all["btnCerca"].click();
//	}catch(e){
//		try{
//			divRicerca.all["radioKeyLegame"][0].click();
//		}catch(e){
//		}
//	}
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

