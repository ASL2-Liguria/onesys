var WindowHome = null;

jQuery(document).ready(function() {
	window.WindowHome = window;
	while ((window.WindowHome.name != 'Home' || window.WindowHome.name != 'schedaRicovero') && window.WindowHome.parent != window.WindowHome) {
		window.WindowHome = window.WindowHome.parent;
	}

	window.baseReparti 	= WindowHome.baseReparti;
	window.baseGlobal 	= WindowHome.baseGlobal;
	window.basePC 		= WindowHome.basePC;
	window.baseUser 	= WindowHome.baseUser;

	NS_GESTIONE_MAGAZZINO.init();
	NS_GESTIONE_MAGAZZINO.event();
});

var NS_GESTIONE_MAGAZZINO = {
	init : function() {
		var iden_farmaco 								= document.getElementById("IDEN_FARMACO").value;
		var descr_farmaco 								= document.getElementById("DESCR").value;
		document.getElementById("txtFarmaci").value 	= descr_farmaco;
		document.getElementById("hIdenFarmaco").value 	= iden_farmaco;

		$('#txtFarmaci').blur(function() {$('#lblFarmaci').trigger("click");}).css({'width' : '400'});

		// calcolo del giorno
		var objToday = new Date(), curHour = objToday.getHours() < 10 ? "0"
				+ objToday.getHours() : objToday.getHours(), curMinute = objToday
				.getMinutes() < 10 ? "0" + objToday.getMinutes() : objToday
				.getMinutes(), curSeconds = objToday.getSeconds() < 10 ? "0"
				+ objToday.getSeconds() : objToday.getSeconds();

		document.getElementById("txtOra").value = curHour + ':' + curMinute;
		$('#date').val(clsDate.getData(new Date(), 'DD/MM/YYYY')).focus();

		NS_GESTIONE_MAGAZZINO.controlloOra();
		$('#txtUnitaDisp').attr('readonly', true);
	},

	event : function() {
		$('#date, #txtOra').blur(function() {NS_GESTIONE_MAGAZZINO.gestioneOraData();});
	},

	controlloOra : function() {
		$('#txtOra').keyup(function() {oraControl_onkeyup(document.getElementById('txtOra'));});
		$('#txtOra').blur(function() {oraControl_onblur(document.getElementById('txtOra'));});
	},

	gestioneOraData : function() {
		// valorizzo l'input nascosto da passare poi al db
		var data = clsDate.str2str($('#date').val(), 'DD/MM/YYYY', 'YYYYMMDD');
		var ora = $('#txtOra').val();

		var dataora = data + ora;
		$('#hDataOra').val(dataora);
	},
	
	conversioneInUnita : function(idenFarmaco) {
	    var getUnita = WindowHome.executeStatement("Magazzino.xml", "CONVERSIONE_IN_UNITA", [idenFarmaco], 1);
	    if (getUnita[0] == 'KO') return ["KO", getUnita[1]];
	    //alert("Convesione in unità: " + getUnita[2]);
	    return ["OK", "Conversione avvenuta con successo", ""+getUnita[2]+""];	
	},
	
	ctrlInputData : function(action) {
	    if (document.getElementById('hIdenFarmaco').value == '') 
	    	return ["KO", "ATTENZIONE: nessun farmaco selezionato"];
	    if (document.getElementById('hIdenMagazzino').value == '')
	    	return ["KO", "ATTENZIONE: nessun magazzino destinazione selezionato"];
	    if ($('[name="cmbRepartoProvenienza"]').find('option:selected').val() == '') 	
	    	return ["KO", "ATTENZIONE: nessun magazzino provenienza selezionato"];
	    if (isNaN(document.getElementById('txtUnita').value)) 
	    	return ["KO", "ATTENZIONE: inserire un formato numerico per le confezioni"];
	    if (document.getElementById('txtUnita').value == '') 
	    	return ["KO", "ATTENZIONE: il campo confezioni non può essere vuoto"];
	    if (isNaN(document.getElementById('txtUnitaplus').value)) 
	    	return ["KO", "ATTENZIONE: inserire un formato numerico per le unità"];
	    if (document.getElementById('txtUnita').value == 0 && (document.getElementById('txtUnitaplus').value == '' || document.getElementById('txtUnitaplus').value == ''))
	    	return ["KO", "ATTENZIONE: nessuna unità caricata/scaricata"];
	    if (action == 'CARICO') {
		    if (document.getElementById('hIdenMagazzino').value ==  $('[name="cmbRepartoProvenienza"]').find('option:selected').val()) 
		    	return ["KO", 'ATTENZIONE: selezionare magazzino destinazione e magazzino provenienza differenti'];
		    if (isNaN(document.getElementById('txtGiacenzaMin').value)) 
		    	return ["KO", "ATTENZIONE: inserire un formato numerico per la giacenza minima"];
		    if (document.getElementById('txtGiacenzaMin').value <= 0) 
		    	return ["KO", "ATTENZIONE: non puoi impostare la giacenza minima minore o uguale a 0"];
	    }
	    return ["OK", "CORRECT"];
	},
	
	PreSalvataggio : function (action) {
		if (action != 'CARICO' && action != 'SCARICO') return ["KO", "ATTENZIONE: azione non conosciuta"];
		
		// Verifico i dati di input
		var ctrlInput = NS_GESTIONE_MAGAZZINO.ctrlInputData(action);
		if (ctrlInput[0] == 'KO') return alert(ctrlInput[1]);
		
	    var iden_farmaco 		= document.getElementById('hIdenFarmaco').value;
	    var oldDisponibilita 	= 0; var oldGiacenzaMin = 0;
	    var newDisponibilita	= 0; var newGiacenzaMin	= 0;
	    var iden_magazzino_dest = document.getElementById('hIdenMagazzino').value;
	    var conversione			= NS_GESTIONE_MAGAZZINO.conversioneInUnita(iden_farmaco);
	    if (conversione[0] == 'KO') return alert(conversione[1]);
	    var confezioni		 	= conversione[2]*document.getElementById('txtUnita').value;
	    var unita	 			= (document.getElementById('txtUnitaplus').value == '') ? 0 : document.getElementById('txtUnitaplus').value;
	    
	    var addRemoveUnita 		= parseInt(confezioni) + parseInt(unita);
	    //alert("Unit da aggiungere/rimuovere: " + addRemoveUnita);

	    /* Controllo giacenza minima */
		var getOldDispGiac 	= WindowHome.executeStatement("Magazzino.xml", "GET_OLD_DISP_GIAC", [iden_farmaco, iden_magazzino_dest], 2);
		if (getOldDispGiac[0] == 'KO') return alert(getOldDispGiac[1]);
		oldDisponibilita 	= parseInt(getOldDispGiac[2]);
		oldGiacenzaMin 		= parseInt(getOldDispGiac[3]);
		
		var iden_magazzino_prov = 0;
	    if (action == 'CARICO') {
	    	iden_magazzino_prov = $('[name="cmbRepartoProvenienza"]').find('option:selected').val();
	    	newGiacenzaMin 		= document.getElementById('txtGiacenzaMin').value;
	    	newDisponibilita 	= oldDisponibilita + addRemoveUnita;
	    } else if (action == 'SCARICO') {
	    	iden_magazzino_prov = iden_magazzino_dest;
	    	newGiacenzaMin		= oldGiacenzaMin;
	    	newDisponibilita 	= oldDisponibilita - addRemoveUnita;
	    }
	    //alert("IDEN_MAGAZZINO_PROV: " + iden_magazzino_prov);
		    
		if (oldGiacenzaMin != newGiacenzaMin)
		  	if (!confirm("ATTENZIONE: Confermi la modifica della giacenza minima?")) 	newGiacenzaMin = oldGiacenzaMin;
		if (newGiacenzaMin > newDisponibilita) 											alert("ATTENZIONE: Soglia giacenza minima superata");
		else if (newGiacenzaMin == newDisponibilita) 									alert("ATTENZIONE: Soglia giacenza minima raggiunta");
		//alert("OLD disp: " + oldDisponibilita + "\nOLD giac: " + oldGiacenzaMin + "\nNEW disp: " + newDisponibilita + "\nNEW giac: " + newGiacenzaMin);
		
	    var vResp = WindowHome.executeStatement("Magazzino.xml", "CONTROLLOGIACENZA", [iden_farmaco, iden_magazzino_prov, addRemoveUnita], 2);

	    if (vResp[0] == 'KO') return alert(vResp[1]);
	    else if (vResp[2]=='KO') {
	        if (confirm(vResp[3])) {
	            registra();
	            alert("Trasferimento Effettuato");
	            document.location.replace(document.location);
	            parent.$.fancybox.close();
	        }
	    } else if(vResp[2]=='OK') {
	        registra();
	        alert("Trasferimento Effettuato");
	        document.location.replace(document.location);
	        parent.$.fancybox.close();
	    }
	},
	
	unitaCaricoScarico : function(action) {
		var iden_farmaco = document.getElementById("IDEN_FARMACO").value;

		var iden_magazzino_dest = $('#IDEN_MAGAZZINO').val();
		var iden_magazzino_prov = '';
		if (action == 'CARICO') 		iden_magazzino_prov = $('[name="cmbRepartoProvenienza"]').find('option:selected').val();
		else if (action == 'SCARICO') 	iden_magazzino_prov = iden_magazzino_dest;
		else 							return alert("ATTENZIONE: azione non conosciuta");

		var getDisponibilita 	= WindowHome.executeStatement("Magazzino.xml", "GET_DISPONIBILITA", [iden_farmaco, iden_magazzino_prov], 1);
		var getGiacenzaMin 		= WindowHome.executeStatement("Magazzino.xml", "GET_GIACENZA_MIN", [iden_farmaco, iden_magazzino_dest], 1);

		if (getDisponibilita[0] == 'KO') 	return alert(getDisponibilita[1]);
		if (getGiacenzaMin[0] == 'KO') 		return alert(getGiacenzaMin[1]);

		$('#txtUnitaDisp').val(getDisponibilita[2]);
		$('#txtGiacenzaMin').val(getGiacenzaMin[2]);
	}
};

function trim(str) {
	str = str.replace(/^\s+/, '');
	
	for ( var i = str.length - 1; i >= 0; i--) {
		if (/\S/.test(str.charAt(i))) {
			str = str.substring(0, i + 1);
			break;
		}
	}
	
	return str;
}
