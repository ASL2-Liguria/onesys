var WindowCartella = null;
$(function() {

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

	NS_IMPORTA_TERAPIE.init();
	NS_IMPORTA_TERAPIE.setEvents();
});

var NS_IMPORTA_TERAPIE = {
		
	init : function() {
		if($("td[name=seleziona]").length<1) {
			alert("Nessuna terapia disponibile per l'importazione");
			parent.$.fancybox.close();
		};
		cIdenRegistrazione = document.EXTERN.idenRegistrazione.value;
		cIdenAnag = WindowCartella.getPaziente("IDEN");
		cCDC = WindowCartella.getAccesso("COD_CDC");
		cDataCur = WindowCartella.clsDate.getData(new Date(),'DD/MM/YYYY');
		salvate=0;
	},
	setEvents : function () {
		$("span#import").click(function(){
			numImportazioni = $("td[name=seleziona] input:checked").length;
			if (numImportazioni<1) {
				return alert("Nessuna terapia selezionata per l\'importazione");
			} 
			NS_IMPORTA_TERAPIE.esegui();
		});
		$("input[class=data]").focus(function(){$(this).blur();})
			.val(cDataCur)
			.datepick(
				{
//					minDate:new Date(),
					onClose: function(){},
					showOnFocus: false, 
					showTrigger: '<img class=\"trigger\" src=\"imagexPix/calendario/cal20x20.gif\" class=\"trigger\"></img>'
				}
		);	
		$("input[class=ora]").val(WindowCartella.clsDate.getOra(new Date())).each(function() {
			_this=$(this);
			_this.bind('keyup', function(){ oraControl_onkeyup();});
			_this.bind('blur', function(){ oraControl_onblur();});
		});
		$("td[name=terapia]").click(function() {
			var idenScheda = $(this).closest("tr").attr("iden_scheda");
			NS_IMPORTA_TERAPIE.vediScheda(idenScheda);
		});
		$("th[name=seleziona] input").click(function() { 
			var iden_visita=$(this).closest("tr").attr("iden_visita");
			var chk = $(this).is(":checked");
			$("tr[iden_visita="+iden_visita+"] td[name=seleziona] input").attr("checked",chk);
		});
		$("input[name=nodatafine]").click(function() { 
			var chk = $(this).is(":checked");
			$(this).closest("td").find("input[name=giorni]").attr("disabled",chk).val('');
		});
		$("input[name=giorni]").blur(function() {
			if(!IsNaturalNumber($(this).val())) {
				alert("Valore immesso non corretto"); $(this).val("").focus();
			};
		});
	},
	esegui : function() {
		var arIdenScheda = new Array();
		var arLstXpath = new Array();
		var arLstValue = new Array();
		
		try {
		$("td[name=seleziona] input:checked").each(function() {
			var tr = $(this).closest("tr");
			var idenScheda = tr.attr("iden_scheda");
			var data_ini = tr.find("td[name=data_ini] input.data").val();
			var ora_ini=tr.find("td[name=data_ini] input.ora").val();
			var nodatafine=tr.find("input[name=nodatafine]").is(":checked")?"S":"";
			var nGiorni=tr.find("td[name=durata] input").val();
			var data_fine = "";
			if (nodatafine=="S") {
				nGiorni="-1";
			} else {
				if (nGiorni=='') {
					throw {message:"Impossibile procedere : settare la durata di tutte le terapie selezionate (o numero giorni o fino a fine ricovero)"};
				}
				data_fine=WindowCartella.clsDate.dateAddStr(data_ini,'DD/MM/YYYY',ora_ini,'D',nGiorni);
			}
			var lstXpath=[
			              "/Terapia/GruppoPrescrizioni/Riga/UserInput[@name='DataInizio']/@value",
			              "/Terapia/GruppoPrescrizioni/Riga/UserInput[@name='OraInizio']/@value",
			              "/Terapia/GruppoPrescrizioni/Riga/UserInput[@name='chkNoDataFine']/@value",
			              "/Terapia/GruppoPrescrizioni/Riga/UserInput[@name='NumeroGiorni']/@value",
			              "/Terapia/GruppoPrescrizioni/Riga/UserInput[@name='DataFine']/@value",
			              "/Terapia/GruppoPrescrizioni/Riga/UserInput[@name='OraFine']/@value",
			              "/Terapia/Setting/Riga/UserInput[@name='uteIns']/@value",
			              "/Terapia/Setting/Riga/UserInput[@name='dtaIns']/@value",
			              "/Terapia/Setting/Riga/UserInput[@name='oraIns']/@value",
			              "/Terapia/Setting/Riga/UserInput[@name='uteChiusa']/@value",
			              "/Terapia/Setting/Riga/UserInput[@name='dtaChiusa']/@value",
			              "/Terapia/Setting/Riga/UserInput[@name='oraChiusa']/@value",
			              "/Terapia/Setting/Riga/UserInput[@name='motChiusa']/@value"
			              ];
			var lstValue=[
			              data_ini,
			              ora_ini,
			              nodatafine,
			              nGiorni,
			              data_fine,
			              ora_ini,
                          WindowCartella.baseUser.DESCRIPTION,
                          WindowCartella.clsDate.getData(new Date(),'DD/MM/YYYY'),
                          WindowCartella.clsDate.getOra(new Date()),
			              "",
			              "",
			              "",
			              ""
			              ];
			arIdenScheda.push(idenScheda);
			arLstXpath.push(lstXpath);
			arLstValue.push(lstValue);
		});
		NS_IMPORTA_TERAPIE.importa(arIdenScheda,arLstXpath,arLstValue);
		} catch (e) {
			alert(e.message);
		}
	},
	importa : function(arIdenScheda,arLstXpath,arLstValue) {
		dwr.engine.setAsync(false);
		for (var i =0; i<arIdenScheda.length;i++) {
			Terapia.setInSessionAndSaveByIdenScheda(
					'conferma', 
					arLstXpath[i], 
					arLstValue[i], 
					cIdenRegistrazione,
					arIdenScheda[i],
					cCDC,
					arIdenScheda[i],
					"P",
					null,
					null,
					callBack
			);		
		}
		dwr.engine.setAsync(true);
		function callBack(resp) {
			salvate++;
			if (resp.success=='OK') {
				if (salvate == numImportazioni) {
					try {
						parent.aggiornaPianoGiornaliero();
					} catch(e){}
					alert("Terapia importata correttamente");
					parent.$.fancybox.close();
				}
			} else {
				alert("Errore : Terapia non importata correttamente --> " +  resp.message);
			}
		}
	},
	vediScheda : function(idenScheda) {
		var url = "servletGeneric?class=cartellaclinica.gestioneTerapia.plgTerapia";
		// url+="&statoTerapia=I";
		url += "&layout=O";
		url += "&PROCEDURA=LETTURA";
		url += "&modality=V";
		url += "&btnGenerali=";
		url += "&idenScheda="+idenScheda;
		url += "&reparto="+cCDC;
		

		$.fancybox({
			'padding' : 3,
			'width' : $(document).width(),
			'height' : $(document).height(),
			'href' : url,
			'type' : 'iframe'
		});
	}
};