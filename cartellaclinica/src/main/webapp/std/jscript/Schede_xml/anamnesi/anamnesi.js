var WindowCartella = null;

jQuery(document).ready(function() {
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    try {
        NS_ANAMNESI.init();
        NS_ANAMNESI.setEvents();
        NS_ANAMNESI.caricaNoteRicovero();
        NS_ANAMNESI.caricaAddendum([
            /* Tab 1 */ {sezione:'Familiare',key_campo:'txtNote'},{sezione:'Fisiologica',key_campo:'txtNoteFisiologica'},{sezione:'AbitudiniDiVita',key_campo:'txtAbitudini'},{sezione:'AnamnesiProf',key_campo:'txtAnamnesiProf'},{sezione:'PatoRemota',key_campo:'txtNoteRemote'},{sezione:'Diabetologica',key_campo:'txtNoteAnamnesiDiabetologica'}
            /* Tab 2 */,{sezione:'AnamPatoPross',key_campo:'txtPatologicaProssima'},{sezione:'Terapie',key_campo:'txtNoteTerapia'}
            /* Tab 3 */,{sezione:'Ostetrica',key_campo:'txtNoteOste'}
        ]);
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }

    try {
        WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {
        /*catch nel caso non venga aperta dalla cartella*/
    }
});

// Aggiunge il controllo della presenza di dati non registrati sul click del menu contestuale delle worklist delle terapie (che registrano ancora sull'anamnesi) 
jQuery(window).load(function(){
	$('iframe#frameWkTerapie').each(function(){
		var wnd = $(this)[0].contentWindow;
		
		jQuery(wnd).load(function(){
			WindowCartella.DatiNonRegistrati.init(wnd, {'td.ContextMenuNormal': 'click'});
			/*
			$(this)[0].$('td.ContextMenuNormal').each(function(){
				alert($(this).text());
			});*/
		});
	});
});

function setDimensioniPagina() {
    $('div.tab').height(document.body.offsetHeight - $('div.tab').position().top - 50);
}

var NS_ANAMNESI = {
    editabile: true, // i raccordi sono editabili fino a 30 giorni dalla dimissione del paziente, anche se l'anamnesi è in sola lettura

    salvata: false,

    init: function() {
        var lista = new Array();
        
        var iden_scheda = parseInt($('form[name=EXTERN] input[name=IDEN_SCHEDA]').val(),10);
        NS_ANAMNESI.editabile = (!(/DIMESSO/gi).test(WindowCartella.getAccesso("CODICE_MODALITA_CARTELLA")) && baseUser.TIPO == 'M' && $.inArray("READONLY",baseUser.ATTRIBUTI)==-1);
        NS_ANAMNESI.salvata = !isNaN(iden_scheda);
        
        window.name = 'ANAMNESI';

        /* differenze per pagina */
        switch (document.EXTERN.KEY_LEGAME.value) {
            case 'ANAMNESI_ASL2_OSTE':
                NS_ANAMNESI.tableAnamnesiOstetrica('APPEND');
                lista.push('Anamnesi clinica 1', 'Anamnesi clinica 2', 'Anamnesi clinica 3');
                
                NS_FUNCTIONS.moveLeftField({name: 'txtRischioGravidanza', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
                $('#txtRischioGravidanza').parent().attr('colspan', 20);
                $('#txtRischioGravidanza').css('width', '100%');

                // gianlucab
            	// Aggiunta attributo "for" per le label accanto i radio input
            	$("input:radio").each(function() {
            		var label = $(this).next().next();
            		if (label.attr("tagName").toUpperCase() == 'LABEL') {
            			var idname = $(this).attr('name') + '_' + $(this).val();
            			$(this).attr("id", idname);
                		label.attr("for", idname);
            		}
                });
                
                $('input[name=radRischioGravidanza]:radio').click(function() {
                	if ($(this).val() == '1' || $(this).val() == '2') {
                		$('#txtRischioGravidanza').focus();
                	} 
                });
                
                attivaTab(lista, 1);
                break;
            case 'ANAMNESI_ASL2_PEDI':

            	// Aggiunta attributo "id" per le select
        		$("select").each(function() {
        			$(this).attr("id", $(this).attr('name'));
        		});
            	
        		// Aggiunta attributo "id" per le option delle select
        		$("option").each(function() {
        			var id = $(this).parent().attr('name') + '_' + $(this).text();
        			$(this).attr("id", id);
        		});
            	
            	NS_FUNCTIONS.moveLeftField({element: $('select[name=cmbDistocico]'), space: '&nbsp;&nbsp;&nbsp;'});
            	NS_FUNCTIONS.enableDisable($('select[name="cmbParto"]'), [$('#cmbParto_Distocico').attr('value')], ['cmbDistocico']);
            	
                lista.push('Anamnesi clinica 1', 'Anamnesi clinica 2');
                attivaTab(lista, 1);
                break;
            case 'ANAMNESI_ASL2_AMB_DIA':
				NS_FUNCTIONS.moveLeftField({name: 'txtVoid', colspan: 12});
				$('#txtVoid').css('visibility', 'hidden');
				NS_FUNCTIONS.moveLeftField({name: 'txtVoid2', colspan: 12});
				$('#txtVoid2').css('visibility', 'hidden');
			
                lista.push('Anamnesi clinica');
                attivaTab(lista, 1);
                break;
            default:
                lista.push('Anamnesi clinica 1', 'Anamnesi clinica 2');
                attivaTab(lista, 1);
                break;
        }

        /* differenze per reparto */
        switch(document.EXTERN.REPARTO.value) {
            case 'ATS_CAR_SV': case 'UTIC_SV': case 'DH_CARD_SV':
   
            	 
        		// Campi obbligatori: anamnesi familiare, abitudini di vita, riferite allergie, alimentazione
        		
        		NS_FUNCTIONS.setCampoStato('txtFamiliare','lblLinkFamiliare','O'); 
        		NS_FUNCTIONS.setCampoStato('chkFumo','lblFumo','O');
        		NS_FUNCTIONS.setCampoStato('chkAllergieAnamnesi','lblAllergie','O');
        		NS_FUNCTIONS.setCampoStato('rdoAlimentazione','lblAlimentazione','O');
        		
        		$('#lblLinkFamiliare').parent().removeClass('classTdLabel_O').addClass('classTdLabelLink').css('backgroundColor','#00d235');        	
        		 jQuery("#txtAllergieAnamnesi").parent().attr('colspan',1).css('width','80%');
        		 
        		 if($('#chkFamiliare').is(":checked")) {
 		        	NS_FUNCTIONS.setCampoStato('txtFamiliare','lblLinkFamiliare','E');
 		           	$('#lblLinkFamiliare').parent().removeClass('classTdLabel').addClass('classTdLabelLink').css('backgroundColor','#daf5fe'); 
 		        }
        		 
        		 $('#chkFamiliare').change(function() {
        		        if($(this).is(":checked")) {
        		        	NS_FUNCTIONS.setCampoStato('txtFamiliare','lblLinkFamiliare','E');
        		           	$('#lblLinkFamiliare').parent().removeClass('classTdLabel').addClass('classTdLabelLink').css('backgroundColor','#daf5fe'); 
        		        }
        		        else{
        		        	NS_FUNCTIONS.setCampoStato('txtFamiliare','lblLinkFamiliare','O');
        		        	$('#lblLinkFamiliare').parent().removeClass('classTdLabel_O').addClass('classTdLabelLink').css('backgroundColor','#00d235'); 
        		        }    
        		    });
        		break;
        	default:
        }

        if (WindowCartella.ModalitaCartella.isReadonly(document)) {
            $("#lblregistra").parent().parent().hide();
            $("td[class=classTdLabelLink]").attr('disabled', 'disabled');
        }

        if (!WindowCartella.ModalitaCartella.isStampabile(document)) {
            $("#lblstampa").parent().parent().hide();
        }

        /*campi popolati da link*/
        $('#txtFamiliare').attr('disabled', 'disabled');
        $('#txtVaccinazioniSelez').attr('disabled', 'disabled');
        $('#txtPositivitaSelez').attr('disabled', 'disabled');
        $('#txtPatologieSelez').attr('disabled', 'disabled');

        /*aggiusto colspan campi*/
        $('select[name=cmbParto]').parent().attr('colspan', '2');
        $('input[name=txtMenoEta]').parent().attr('colspan', '2');
        $('input[name=txtSviluppo]').parent().attr('colspan', '1');

        /*carico wk positività, patologie, interventi e allergie */
        $('#txtPositivitaSelez').hide().parent().append('<IFRAME id=frameWkPositivita width=100% height=140px src="' + NS_ANAMNESI.getUrlWkPositivita() + '"></IFRAME>');
        $('#txtPatologie').hide().parent().append('<IFRAME id=frameWkPatologie width=100% height=140px src="' + NS_ANAMNESI.getUrlWkPatologie() + '"></IFRAME>');
        $('#divInterventi').append('<IFRAME id=frameWkInterventi width=100% height=140px src="' + NS_ANAMNESI.getUrlWkInterventi() + '"></IFRAME>');
        $('#divAllergie').append('<IFRAME id=frameWkAllerte width=100% height=140px src="' + NS_ANAMNESI.getUrlWkAllerte() + '"></IFRAME>');

        /*carico wk terapie*/
        NS_ANAMNESI.setWkTerapie();
        NS_ANAMNESI.controllaSesso();

        /*imposta i radio come resettabili*/
        setRadioResettable();
        setDimensioniPagina();
    },
    getUrlWkGenerica: function(strWorklistName, sqlQuery, boolForceCheck) {
    	var whereAgg = '';
		var pBinds = new Array(
			WindowCartella.getPaziente("IDEN"),
			WindowCartella.getRicovero("IDEN"),
			WindowCartella.getAccesso("IDEN")
		);
		
		var boolRicoveriPrecedenti = true;
		if (!boolForceCheck && NS_ANAMNESI.salvata) {
			// Se l'anamnesi è già stata registrata, assumo che le righe della worklist siano già state importate
			boolRicoveriPrecedenti = false;
		} else {
			var vResp = WindowCartella.executeStatement("anamnesi.xml", sqlQuery, pBinds, 1);
			if(vResp[0]=='KO'){
				alert(vResp[1]);
			}
			// Se non ci sono righe già salvate per il presente ricovero, importo tutti i record attivi del paziente
			var numRighe = Number(vResp[2]);
			boolRicoveriPrecedenti = !isNaN(numRighe) && numRighe > 0 ? false : true;
		}
		
		var strImportaPaziente = '';
		switch (strWorklistName) {
		case 'WK_ALLERTE':
			whereAgg = " AND TIPO IN ('ALLERGIA','INTOLLERANZA','REAZIONE_AVVERSA') AND " + (boolRicoveriPrecedenti ? "(VISUALIZZA_IN_ALTRI_RICOVERI = 'S' AND DELETED='N')" : "(IDEN_RICOVERO = :IDEN_VISITA OR IDEN_VISITA = :IDEN_ACCESSO)");
			strImportaPaziente = "importaAllergieIdenPaziente";
			break;
		case 'WK_INTERVENTI_ANAMNESI':
			whereAgg = " AND (";
			whereAgg+= "(ARRIVATO_DA = 'INTERFACCIA' AND " + (boolRicoveriPrecedenti ? "(VISUALIZZA_IN_ALTRI_RICOVERI = 'S' AND DELETED='N')" : "(IDEN_RICOVERO = :IDEN_VISITA OR IDEN_VISITA = :IDEN_ACCESSO)");
			whereAgg+= " OR ";
			whereAgg+= "(ARRIVATO_DA <> 'INTERFACCIA' AND DATA_INSERIMENTO <= to_date('" + document.EXTERN.DATA_ULTIMA_MODIFICA.value + "', 'yyyyMMddhh24:mi:ss') AND IDEN_RICOVERO <> :IDEN_VISITA AND IDEN_VISITA <> :IDEN_ACCESSO))";
			whereAgg+=")";
			strImportaPaziente = "importaInterventiIdenPaziente";
			break;
		case 'WK_PATOLOGIE':
			whereAgg = " AND " + (boolRicoveriPrecedenti ? "(VISUALIZZA_IN_ALTRI_RICOVERI = 'S' AND DELETED='N')" : "(IDEN_RICOVERO = :IDEN_VISITA OR IDEN_VISITA = :IDEN_ACCESSO)");
			strImportaPaziente = "importaPatologieIdenPaziente";
			break;
		case 'WK_POSITIVITA':
			whereAgg = " AND " + (boolRicoveriPrecedenti ? "(VISUALIZZA_IN_ALTRI_RICOVERI = 'S' AND DELETED='N')" : "(IDEN_RICOVERO = :IDEN_VISITA OR IDEN_VISITA = :IDEN_ACCESSO)");
			strImportaPaziente = "importaPositivitaIdenPaziente";
			break;
		default:
		}
		
		if (boolRicoveriPrecedenti) {
			NS_ANAMNESI[strImportaPaziente] = isNaN(Number(pBinds[0])) ? null : Number(pBinds[0]);
		} else {
			NS_ANAMNESI[strImportaPaziente] = null;
		}
		
    	whereAgg = whereAgg
    		.replace(/(:iden_anag)/gi,    String(pBinds[0]))
    		.replace(/(:iden_visita)/gi,  String(pBinds[1]))
    		.replace(/(:iden_accesso)/gi, String(pBinds[2]));
    	var orderBy = " ORDER BY iden asc";
    	
        var url = "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK="+strWorklistName+"&WHERE_WK=" + encodeURIComponent(" where IDEN_ANAG=" + pBinds[0] + whereAgg + orderBy).replace(/([\'\(\)\=])/g, function(match, capture) { return "%"+("0"+capture.charCodeAt(0).toString(16)).slice(-2); } );
        //if (WindowCartella.ModalitaCartella.isReadonly(document)) {
        if (!NS_ANAMNESI.editabile) {
            url += "&CONTEXT_MENU="+strWorklistName+"_LETTURA";
        }
        url += "&ILLUMINA=illumina(this.sectionRowIndex)";
        
        //alert(decodeURIComponent(url));
        return url;
    },
    getUrlWkAllerte: function() {
        return NS_ANAMNESI.getUrlWkGenerica("WK_ALLERTE", "contaAllerte");
    },
    getUrlWkInterventi: function() {
        return NS_ANAMNESI.getUrlWkGenerica("WK_INTERVENTI_ANAMNESI", "contaInterventi", true /* esegue sempre il calcolo degli interventi associati a ricoveri precedenti */);
    },
    getUrlWkPatologie: function() {
    	return NS_ANAMNESI.getUrlWkGenerica("WK_PATOLOGIE", "contaPatologie");
    },
    getUrlWkPositivita: function() {
    	return NS_ANAMNESI.getUrlWkGenerica("WK_POSITIVITA", "contaPositivita");
    },
    setEvents: function() {
        //setto un attributo che verrà controllato dal salvataggio per determinare quali form siano stati modificati
        $('form[name="ANAMNESI"]').click(function() {
            $(this).attr("edited", "edited");
        });

        $("[name='lblLinkFamiliare']").click(NS_ANAMNESI.apriAnamnesiFam);
        $("[name='lblPatologieLink']").click(NS_ANAMNESI.InserisciPatologia);
        $("[name='lblPositivitaLink']").click(NS_ANAMNESI.InserisciPositivita);
        $("[name='lblVaccinazioniLink']").click(function() {
            NS_ANAMNESI.apriSceltaDoppia('hVaccinazioni', 'txtVaccinazioniSelez', 'Vaccinazioni', 'VACCINAZIONE');
        });
        $("[name='chkMestrua']").click(function() {
            if (document.all.chkMestrua[0].checked) {
                document.getElementById('cmbMestrua').disabled = false;
            }
            else {
                document.getElementById('cmbMestrua').disabled = true;
                document.getElementById('cmbMestrua').selectedIndex = 0;
            }
        });
        
        $('select[name="cmbParto"]').change(function() {
        	NS_FUNCTIONS.enableDisable($('select[name="cmbParto"]'), [$('#cmbParto_Distocico').attr('value')], ['cmbDistocico'], true);	
        });
        
        var maxLength = 32767;
        var msg = 'Attenzione: il testo inserito supera la lunghezza massima consentita.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?';
        jQuery('#txtNoteFisiologica,#txtNote,#txtPatologicaProssima,#txtAllergieAnamnesi,#txtNoteRicovero,#txtAnamnesiProf,#txtAllergie,#txtNoteTerapia,#txtNoteRemote,#txtAbitudini,#txtNotePatologie,#txtAttivitaExtra,#txtRischioGravidanza,#txtDescrizione,#txtDescrizionePatologia,#txtNoteAnamnesiDiabetologica').addClass("expand").attr("maxlength", String(maxLength)).blur(function(e) {
            maxlength(this, maxLength, msg);
        });
        
        jQuery("textarea.expand").each(function(){
        	var id = $(this).attr("id");
            $(this)
	            .TextAreaExpander(20)
	            
	            /* aggiunta icona testi standard a testarea */
	            .css({width: '95%', float: 'left'}).parent().append($('<div></div>').addClass('classDivTestiStd').attr("title", "Testi Standard").click(function() {
	            	NS_ANAMNESI.apriTestiStandard(id);
	            }));
        });
        
        try{
        	$('.hasDatepick').each(function(){
				var id = $(this).attr("id");
				NS_FUNCTIONS.controlloData(id);
			});
			
        	/*data presunta parto */
            $('#txtUM').focusout(function() {
                $(this).val() != null && $(this).val() != '' ? $('#txtDPP').val(
                	WindowCartella.clsDate.dateAddStr($(this).val(), "DD/MM/YYYY", "00:00", "D", "280")
                ): $('#txtDPP').val('');
            });
        }
        catch(e){}
        
    	if (NS_ANAMNESI.editabile) $('#lblPositivitaLink, #lblPatologieLink').parent().attr("disabled", false);
    },
    apriAnamnesiFam: function() {
        var url = "servletGenerator?KEY_LEGAME=ANAMNESI_FAMILIARE&HFAM=" + document.getElementById('hFam').value + "&HGENERALI=" + document.getElementById('hGenerali').value+"&CODICE_REPARTO=" + document.EXTERN.REPARTO.value;
        $.fancybox({
            'padding': 3,
            'width': 1024,
            'height': 580,
            'href': url,
            'type': 'iframe'
        });
    },
    apriSceltaDoppia: function(pName, pNameTxt, pTitle, pTipoDato) {
        var pValore = $("[name='" + pName + "']").val();
        var url = "servletGenerator?KEY_LEGAME=SCELTA_LISTA_DOPPIA" +
                "&HIDDEN_VALORE=" + pValore +
                "&HIDDEN_CAMPO=" + pName +
                "&TEXT_CAMPO=" + pNameTxt +
                "&TITLE=" + pTitle +
                "&TIPO_DATO=" + pTipoDato;
        $.fancybox({
            'padding': 3,
            'width': 1024,
            'height': 580,
            'href': url,
            'type': 'iframe'
        });
    },
    apriTestiStandard: function(targetOut) {
        if (_STATO_PAGINA == 'L') {
            return;
        }

        var url = 'servletGenerator?funzione=LETTERA_STANDARD&KEY_LEGAME=SCHEDA_TESTI_STD&TARGET=' + targetOut + '&PROV=' + document.EXTERN.FUNZIONE.value;
        $.fancybox({
            'padding': 3,
            'width': 1024,
            'height': 580,
            'href': url,
            'type': 'iframe'
        });
    },
    controllaSesso: function() {
        var query = "select sesso as SESSO from anag where iden=" + document.EXTERN.IDEN_ANAG.value;
        query += "@SESSO";
        query += "@1";
        dwr.engine.setAsync(false);
        CJsUpdate.select(query, gestDati);
        dwr.engine.setAsync(true);

        function gestDati(dati) {
            var array_dati = null;
            array_dati = dati.split('@');
            if (array_dati[0] == 'M') {
                try{document.getElementById('txtMenarca').disabled = true;}catch(e){}
                try{document.all.chkMestrua[0].disabled = true;}catch(e){}
                try{document.all.chkMestrua[1].disabled = true;}catch(e){}
                try{document.getElementById('cmbMestrua').disabled = true;}catch(e){}
                try{document.all.chkMeno[0].disabled = true;}catch(e){}
                try{document.all.chkMeno[1].disabled = true;}catch(e){}
                try{document.getElementById('txtMenoEta').disabled = true;}catch(e){}
                try{document.getElementById('txtEtaGestazionale').disabled = true;}catch(e){}
                try{document.getElementById('dateMestruaUltima').disabled = true;}catch(e){}
                try{document.getElementById('txtUM').disabled = true;}catch(e){}
                try{document.getElementById('txtDPP').disabled = true;}catch(e){}
                try{document.getElementById('txtDPPeco').disabled = true;}catch(e){}
                $("#dateMestruaUltima, #txtUM, #txtDPP, #txtDPPeco").parent().find("img.trigger").hide();
            }
        }
    },
    loadPlgTerapia: function(pProcedura, pIdenTerapia, pIdenScheda) {
        var url = "servletGeneric?class=cartellaclinica.gestioneTerapia.plgTerapia";
        url += "&modality=I&layout=O&reparto=" + document.EXTERN.REPARTO.value;
        url += "&idenAnag=" + document.EXTERN.IDEN_ANAG.value;
        url += "&idenVisita=" + WindowCartella.FiltroCartella.getIdenRiferimentoInserimento(WindowCartella.getForm(document));
        switch (pProcedura) {
            case 'INSERIMENTO':
                url += "&statoTerapia=A";
                url += "&btnGenerali=";
                url += "Importa::registra('anamnesi');";
//			url+="@Pianifica::registra('conferma');";	
//			url+="@Chiudi::chiudi();";	
                break;
            case 'DUPLICA':
                if (pIdenTerapia == '' || pIdenScheda == '' || (pIdenTerapia.toString().split("*").length > 1))
                    return alert('Selezionare una singola terapia da pianificare');
                url += "&statoTerapia=I";
                url += "&idenTerapia=" + pIdenTerapia;
                url += "&idenScheda=" + pIdenScheda;
                url += "&btnGenerali=";
                url += "Pianifica::registra('conferma');";
//			url+="@Chiudi::chiudi();";	
                break;
        }

        url += "&PROCEDURA=" + pProcedura;

        $.fancybox({
            'padding': 3,
            'width': screen.availWidth,
            'height': 800,
            'href': url,
            'type': 'iframe'
        });

    },
    rimuoviTerapia: function(pIden) {
        if (typeof pIden == 'undefined' || pIden == null || pIden == '') {
            return alert('Effettuare una selezione');
        }

        var arSelIden = pIden.toString().split("*");
        if (!confirm(
                "Si conferma la rimozione " + (arSelIden.length > 1
                ? "delle " + arSelIden.length + " terapie selezionate" : "della terapia selezionata")
                + " dall'elenco?"))
            return;

        var input = document.getElementById('hIdenSchede');
        var arIden = input.value.split(',');
        for (var i = 0; i < arIden.length; i++) {
            for (var j = 0; j < arSelIden.length; j++) {
                if (arIden[i] == arSelIden[j]) {
                    arIden.splice(i, 1);
                    arSelIden.splice(j, 1);
                    j = -1;
                }
            }
        }
        input.value = arIden;
        document.getElementById('frameWkTerapie').src = "servletGenerator?KEY_LEGAME=WK_TERAPIE_ANAMNESI&WHERE_WK=%20where%20iden_scheda%20in%20(" + (arIden == '' ? -1 : arIden) + ")%20";
    },
    setWkTerapie: function(pIden) {
        var input = document.getElementById('hIdenSchede');
        if (!input) { return; }
        var arIden;
        (input.value == '') ? arIden = new Array() : arIden = input.value.split(',');

        var newWhere = input.value;

        if (typeof pIden != 'undefined' && pIden != null) {
            arIden.push(pIden);
            newWhere = arIden;
            input.value = arIden;
        } else {
            if (input.value == '')
                newWhere = '-1';
            else
                newWhere = input.value;
        }

        url = "servletGenerator?KEY_LEGAME=WK_TERAPIE_ANAMNESI&WHERE_WK=%20where%20iden_scheda%20in%20(" + newWhere + ")%20";
        url += "&ILLUMINA=javascript:illumina_multiplo_generica(this.sectionRowIndex);";
        if (_STATO_PAGINA == 'L') {
            url += '&CONTEXT_MENU=WK_TERAPIE_ANAMNESI_LETTURA';
        }
        
        /*//document.getElementById('frameWkTerapie').src=url;
         $('#divTerapie').prepend('<IFRAME id=frameWkTerapie width=100% height=120px src="'+url+'"></IFRAME>');
         */

        //document.getElementById('frameWkTerapie').src=url;
        if ($('#frameWkTerapie').length == 0) {
            $('#divTerapie').prepend('<IFRAME id=frameWkTerapie width=100% height=120px src="' + url + '"></IFRAME>');
        }
        else {
        	document.getElementById('frameWkTerapie').src = url;
        }
    },
    registraAnamnesi: function() {
        /*FIXME: lanciare dwr per update stato 'deleted' per le terapie
         * var sqlBinds=new Array();
         * sqlBinds.push($(input[name="hIdenInterventi"]).val());
         * sqlBinds.push();
         * sqlBinds.push();
         * top.executeStatement("anamnesi.xml","updateDeleted",sqlBinds,0);
         * */

        if (document.EXTERN.KEY_LEGAME.value=='ANAMNESI_ASL2_OSTE'){
        	$('#hAnamnesiOste').val($('input[name=txtAnamnesiOstetricaGravida]').val()+'@'+$('input[name=txtAnamnesiOstetricaPara]').val()+'@'+$('input[name=txtAnamnesiOstetricaAborti]').val()+'@'+$('input[name=txtAnamnesiOstetricaIVG]').val()+'@'+$('input[name=txtAnamnesiOstetricaFigliViventi]').val());
    	
        	$('#hOstetricaAnno,#hOstetricaParto,#hOstetricaSett,#hOstetricaPeso,#hOstetricaSesso,#hOstetricaAllatt').val('');
        	
        	$('tr[class=trAnamnesiOstetrica_2]').each(function(index) {
      
        		index==0?$('#hOstetricaAnno').val($(this).find('td:eq(1)').find('input').val()):$('#hOstetricaAnno').val($('#hOstetricaAnno').val()+'@'+$(this).find('td:eq(1)').find('input').val());
        		index==0?$('#hOstetricaParto').val($(this).find('td:eq(2)').find('input').val()):$('#hOstetricaParto').val($('#hOstetricaParto').val()+'@'+$(this).find('td:eq(2)').find('input').val());
        		index==0?$('#hOstetricaSett').val($(this).find('td:eq(3)').find('input').val()):$('#hOstetricaSett').val($('#hOstetricaSett').val()+'@'+$(this).find('td:eq(3)').find('input').val());
        		index==0?$('#hOstetricaPeso').val($(this).find('td:eq(4)').find('input').val()):$('#hOstetricaPeso').val($('#hOstetricaPeso').val()+'@'+$(this).find('td:eq(4)').find('input').val());
        		index==0?$('#hOstetricaSesso').val($(this).find('td:eq(5)').find('input').val()):$('#hOstetricaSesso').val($('#hOstetricaSesso').val()+'@'+$(this).find('td:eq(5)').find('input').val());
        		index==0?$('#hOstetricaAllatt').val($(this).find('td:eq(6)').find('input').val()):$('#hOstetricaAllatt').val($('#hOstetricaAllatt').val()+'@'+$(this).find('td:eq(6)').find('input').val());
        		
        	});
    	
	    	// Controllo rischio gravidanza
	    	var value = $('input[name=radRischioGravidanza]:radio:checked').val();
	    	if (value == '1' || value == '2') {
	    		if ($('#txtRischioGravidanza').val().replace(/^\s+|\s+$/, '') == '') {
	    			alert('Attenzione: il campo note è obbligatorio se il rischio di gravidanza non è basso');
	    			return;
	    		}
	    	}
        }
        
        try {
			NS_ANAMNESI.CheckAllerte();
        } catch(e) {
        	alert(e.message);
        	return;
        }
        
        registra();
    },
    okRegistra: function() {
      try {
     	 NS_ANAMNESI.salvata=true;
    	 WindowCartella.CartellaPaziente.refresh.avvertenze.paziente();
         
         // Importa gli elementi presenti nelle worklist
         NS_ANAMNESI.ImportaWorklist("duplicaAllerte", "importaAllergieIdenPaziente");
         NS_ANAMNESI.ImportaWorklist("duplicaInterventi", "importaInterventiIdenPaziente");
         NS_ANAMNESI.ImportaWorklist("duplicaPatologie", "importaPatologieIdenPaziente");
         NS_ANAMNESI.ImportaWorklist("duplicaPositivita", "importaPositivitaIdenPaziente");
      }	
      catch(e) {}
    },
    stampaAnamnesi: function() {
        var vDati = WindowCartella.getForm(document);

        if (!WindowCartella.ModalitaCartella.isStampabile(vDati))
            return;
        /*Configurazione per recuperare la stampa anamnesi normale o la stampa dell'ostetricia(composta da anamnesi normale+anamnesi 3)*/
        var funzione = baseReparti.getValue(vDati.reparto,'CONFIGURA_STAMPA_ANAMNESI');	
        if (funzione=='STAMPA_GLOBALE_ANAMNESI'){
        	NS_ANAMNESI.stampaGlobaleAnamnesi();
        }
        else{
            /*Riassegno la funzione per la gestione stampa anamnesi amnestesiologica o non amnestesiologica*/    
            funzione = document.EXTERN.FUNZIONE.value;
            var anteprima = 'S';
            var reparto = vDati.reparto;
            var sf = '&prompt<pVisita>=' + document.EXTERN.IDEN_VISITA.value+'&prompt<pFunzione>='+funzione;
            WindowCartella.confStampaReparto(funzione, sf, anteprima, reparto, WindowCartella.basePC.PRINTERNAME_REF_CLIENT);
        }
    },
    /**
     * @deprecata
     */
    creaTabellaPato: function(modo) {
        // tabella patologie
        var table = "<table id='tablePato' width='100%'>";
        table += "<tr id='primariga' height:10 px >";
        table += "<td STATO_CAMPO='E' class='classTdLabelLink aggiungi' STYLE='BORDER-BOTTOM: #00ba19 3px solid; BACKGROUND: #d6ffdc; width=5%'>" +
                "<label title='Aggiungi Patologia' name='lblAggiungiPato' id='lblAggiungiPato'>Aggiungi Patologia</label>" +
                "</td>";
        table += "<td STATO_CAMPO='E' class='classTdLabel PatoIntestaz' STYLE='BORDER-BOTTOM: #00ba19 3px solid; BACKGROUND: #d6ffdc; width=40%'>" +
                "<label name='lblPatoIntestaz' id='lblPatoIntestaz'>Patologia</label>" +
                "</td>";
        table += "<td STATO_CAMPO='E' class='classTdLabel PatoAnnoIntestaz' style='width:5%; BORDER-BOTTOM: #00ba19 3px solid; BACKGROUND: #d6ffdc;'>" +
                "<label name='lblPatoAnnoIntestaz' id='lblPatoAnnoIntestaz'>Anno</label>" +
                "</td>";
        table += "<td STATO_CAMPO='E' class='classTdLabel PatoNoteIntestaz' style='width:40%; BORDER-BOTTOM: #00ba19 3px solid; BACKGROUND: #d6ffdc;'>" +
                "<label name='lblPatoNoteIntestaz' id='lblPatoNoteIntestaz'>Note</label>" +
                "</td>";
        table += "</tr></table>";

        switch (modo) {
            case 'APPEND':
                jQuery("#tablePato").remove();
                jQuery("#divPatoRemota").append(table);
                break;
        }
        if (WindowCartella.ModalitaCartella.isReadonly(document)) {
            $('#lblAggiungiPato').attr('disabled', 'disabled');
        } else {
	        $("#lblAggiungiPato").parent().click(function() {
	            var url = "servletGenerator?KEY_LEGAME=SCELTA_PATOLOGIE&status=yes fullscreen=yes";
	            $.fancybox({
	                'padding': 3,
	                'width': 1024,
	                'height': 580,
	                'href': url,
	                'type': 'iframe'
	            });
        });
        }
    },
    /**
     * @deprecata
     */
    aggiungiRigaPato: function(i, valore, testo, anno, nota) {
        //alert('i='+i+' valore='+valore+' testo='+testo);
        riga = "<tr id='tr_" + i + "' valore=" + valore + "  class = 'trPato' >";
        riga += "<td STATO_CAMPO='E' class='classTdLabel butt_elimina' style='border-left:1px solid red; BORDER-BOTTOM:3PX SOLID RED'><label class='butt_elimina' title='Elimina' name='lblElimina" + i + "' id='lblElimina" + i + "'> X </label></td>";
        riga += "<td STATO_CAMPO='E' class='classTdLabel patoScelte' style='BORDER-BOTTOM:3PX SOLID RED'><label indice = " + i + " valore='" + valore + "' class='patologieScelte' name='lblPatoScelte" + i + "' id='lblPatoScelte" + i + "'>" + testo + "</label></td>";
        riga += "<td STATO_CAMPO='E' class='classTdField' style='BORDER-BOTTOM:3PX SOLID RED'><input class='annoPato' id='txtAnno" + i + "' STATO_CAMPO='E' value='" + anno + "' name='txtAnno" + i + "' type='text'></input></td>";
        riga += "<td STATO_CAMPO='E' class='classTdField' style='BORDER-BOTTOM:3PX SOLID RED'><input class='notePato' id='txtNote" + i + "' STATO_CAMPO='E' value='" + nota + "' name='txtNote" + i + "' type='text'></input></td>";
        riga += "</tr><TR id='tr_2" + i + "' style='line-height:35px; margin-bottom:200px'></TR>";

        //alert(riga);
        jQuery("#tablePato").append(riga);
        jQuery("#lblElimina" + i).click(function() {
        	NS_ANAMNESI.eliminaRigaPato(i);
        });
    },
    /**
     * @deprecata
     */
    eliminaRigaPato: function(i) {
        jQuery("#tr_" + i).remove();
        jQuery("#tr_2" + i).remove();
    },
    /**
     * @deprecata
     */
    SalvaPato: function() { // salva le patologie nel campo nascosto txtPatologieSelez
        var elenco = "";
        var elencoPato = jQuery(".patologieScelte");
        var elencoAnno = jQuery(".annoPato");
        var elencoNote = jQuery(".notePato");

        elencoPato.each(function(index) {
            var testo = jQuery(this).text();
            var valore = jQuery(this).attr("valore");
            //alert(valore+"$"+testo + "$"+jQuery(elencoAnno[index]).val()+"$"+jQuery(elencoNote[index]).val());
            if (elenco != '') {
                elenco += ',';
            }
            elenco += valore + "$" + testo.replace(/\,/gi, " ") + "$" + jQuery(elencoAnno[index]).val() + "$" + jQuery(elencoNote[index]).val().replace(/\,/gi, " ");
        });
        jQuery("#txtPatologieSelez").val(elenco);
    },
    /**
     * @deprecata
     */
    CaricaPato: function() { // carica le patologie da txtPatologieSelez
        var elencoPato = jQuery("#txtPatologieSelez").val();
        var aElencoPato = elencoPato.split(",");
        //alert("aElencoPato.length="+aElencoPato.length);
        if (aElencoPato != "") {
            for (var i = 0; i < aElencoPato.length; i++) {
                var pato = aElencoPato[i].split("$");
                //alert(pato[0]+" "+pato[1]+" "+pato[2]+" "+pato[3]);
                if (typeof pato[1] == "undefined") {
                	NS_ANAMNESI.aggiungiRigaPato(i, "", pato[0], "", "");
                } else {
                	NS_ANAMNESI.aggiungiRigaPato(i, pato[0], pato[1], pato[2], pato[3]);
                }

            }
            if (WindowCartella.ModalitaCartella.isReadonly(document)) {
                $('LABEL[name^="lblElimina"]').attr('disabled', 'disabled');
                $('INPUT[name^="txtAnno"]').attr('disabled', 'disabled');
                $('INPUT[name^="txtNote"]').attr('disabled', 'disabled');
            }
        }
    },
    
    caricaNoteRicovero : function(){

    	if ($("#txtNoteRicovero").text()=='' && _STATO_PAGINA != 'L'){
    	    var rs = WindowCartella.executeQuery('anamnesi.xml','getNoteNosologico',[document.EXTERN.IDEN_VISITA.value]);
    	    while(rs.next()){
    	    	$("#txtNoteRicovero").text(rs.getString('NOTE')); 
    	    }
    	}
    	
    },
    
    tableAnamnesiOstetrica: function(modo) {
        function tdAnamnesiOstetricaLabel(className, labelTitle, labelName, width) {
            return "<TD STATO_CAMPO='E' class='classTdLabel " + className + "' style='width:" + width + "%;'><LABEL name='" + labelName + "' id='" + labelName + "'>" + labelTitle + "</LABEL></TD>";
        }

        function tdAnamnesiOstetricaInput(inputName, value) {
            return "<TD STATO_CAMPO='E'><INPUT id='" + inputName + "' name='" + inputName + "' value='"+value+"' STATO_CAMPO='E' style='width:100%'></TD>";
        }

        function tdAnamnesiOstetricaLink(className, labelTitle, labelName, width) {
            return "<TD STATO_CAMPO='E' class='classTdLabelLink " + className + "' style='width:" + width + "%;'><LABEL title='" + labelTitle + "' name='" + labelName + "' id='" + labelName + "'>" + labelTitle + "</LABEL></TD>";
        }
        
        
        function addRowAnamnesiOstetrica(i,pAnno,pParto,pSett,pPeso,pSesso,pAllatt) {
            function addTdAnamnesiOstetricaInput(className, idName, index, value) {
            	var str="<TD STATO_CAMPO='E' class='classTdField' style='border-bottom:3px solid red;'><INPUT class='" + className + "' id='" + idName + "_" + index + "' STATO_CAMPO='E' name='" + idName + "_" + index + "'";
            	if(value!=undefined){
            	str+=" value='"+value+"' ";
            	}
            	
            	str+="type='text' style='width:100%;' ></INPUT></TD>";
                return str;
            }
            
            function addTdAnamnesiOstetricaLabel(className, labelTitle, labelName, index) {
                return "<TD STATO_CAMPO='E' class='classTdLabel " + className + "' style='border-left:1px solid red; border-bottom:3px solid red;'><LABEL class='" + className + "' title='" + labelTitle + "' name='" + labelName + "_" + index + "' id='" + labelName + "_" + index + "'> X </LABEL></TD>";
            }
            
            function removeRowAnamnesiOstetrica(index) {
                $("#trAnamnesiOstetrica_2_" + index).remove();
            }
            
            var row = "<TR id='trAnamnesiOstetrica_2_" + i + "' class='trAnamnesiOstetrica_2' >" +
                    // Setto un TD LABEL
                    addTdAnamnesiOstetricaLabel('butt_elimina', 'Elimina', 'lblEliminaAnamnesiOstetrica_2', i) +
                    // Setto un TD INPUT
                    addTdAnamnesiOstetricaInput('AnamnesiOstetricaAnno', 'txtAnamnesiOstetricaAnno', i, pAnno) +
                    addTdAnamnesiOstetricaInput('AnamnesiOstetricaParto', 'txtAnamnesiOstetricaParto', i, pParto) +
                    addTdAnamnesiOstetricaInput('AnamnesiOstetricaSettimane', 'txtAnamnesiOstetricaSettimane', i, pSett) +
                    addTdAnamnesiOstetricaInput('AnamnesiOstetricaPeso', 'txtAnamnesiOstetricaPeso', i , pPeso) +
                    addTdAnamnesiOstetricaInput('AnamnesiOstetricaSesso', 'txtAnamnesiOstetricaSesso', i, pSesso) +
                    addTdAnamnesiOstetricaInput('AnamnesiOstetricaAllattamento', 'txtAnamnesiOstetricaAllattamento', i, pAllatt) +
                    "</TR>";
            $("#tableAnamnesiOstetrica_2").append(row);
            $("#lblEliminaAnamnesiOstetrica_2_" + i).click(function() {
                // Rimuovo la riga dalla tabella
                removeRowAnamnesiOstetrica(i);
            });        
        }        

        var hAnamnesiOste=($('[name=hAnamnesiOste]').val()!=''? $('[name=hAnamnesiOste]').val().split('@') : '@@@@'.split('@'));
        // Creo la tabella 1 con le colonne di intestazione
        var table = "<TABLE id='tableAnamnesiOstetrica_1' width='100%'><TR id='primariga' height='10px'>" +
                // Setto un TD LABEL
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaGravida', 'GRAVIDA', 'lblAnamnesiOstetricaGravida', 20) +
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaPara', 'PARA', 'lblAnamnesiOstetricaPara', 20) +
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaAborti', 'ABORTI', 'lblAnamnesiOstetricaAborti', 20) +
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaIVG', 'IVG', 'lblAnamnesiOstetricaIVG', 20) +
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaFigliViventi', 'FIGLI VIVENTI', 'lblAnamnesiOstetricaFigliViventi', 20) +
                "</TR><TR>" +
                // Setto un TD INPUT
                tdAnamnesiOstetricaInput('txtAnamnesiOstetricaGravida',hAnamnesiOste[0]) +
                tdAnamnesiOstetricaInput('txtAnamnesiOstetricaPara',hAnamnesiOste[1]) +
                tdAnamnesiOstetricaInput('txtAnamnesiOstetricaAborti',hAnamnesiOste[2]) +
                tdAnamnesiOstetricaInput('txtAnamnesiOstetricaIVG',hAnamnesiOste[3]) +
                tdAnamnesiOstetricaInput('txtAnamnesiOstetricaFigliViventi',hAnamnesiOste[4]) +
                "</TR></TABLE><BR/>";

        // Creo la tabella 2 con le colonne di intestazione
        table += "<TABLE id='tableAnamnesiOstetrica_2' width='100%'><TR id='primariga' height='10px'>" +
                // Setto un TD LINK
                tdAnamnesiOstetricaLink('aggiungiInt', 'Aggiungi', 'lblAddAnamnesiOstetricaInt', 5) +
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaAnnoInt', 'ANNO', 'lblAnamnesiOstetricaAnnoInt', 10) +
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaPartoInt', 'PARTO', 'lblAnamnesiOstetricaPartoInt', 10) +
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaSettimaneInt', 'SETTIMANE', 'lblAnamnesiOstetricaSettimaneInt', 10) +
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaPesoInt', 'PESO', 'lblAnamnesiOstetricaPesoInt', 10) +
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaSessoInt', 'SESSO', 'lblAnamnesiOstetricaSessoInt', 10) +
                tdAnamnesiOstetricaLabel('AnamnesiOstetricaAllattamentoInt', 'ALLATTAMENTO', 'lblAnamnesiOstetricaAllattamentoInt', 10) +
                "</TR></TABLE><BR/>";
        //alert(table);
      
        switch (modo) {
            case 'APPEND':
                $("#tableAnamnesiOstetrica_1").remove();
                $("#tableAnamnesiOstetrica_2").remove();
                $("#divOstetrica").prepend(table);
                break;
        }
    
     	var hOstetricaAllatt=$('#hOstetricaAllatt').val().split('@');
       	var hOstetricaAnno=$('#hOstetricaAnno').val().split('@');
       	var hOstetricaPeso=$('#hOstetricaPeso').val().split('@');
       	var hOstetricaParto=$('#hOstetricaParto').val().split('@');
       	var hOstetricaSesso=$('#hOstetricaSesso').val().split('@');
       	var hOstetricaSett=$('#hOstetricaSett').val().split('@');

       	 for (var i = 0; i < hOstetricaAnno.length; i++) {
       		 addRowAnamnesiOstetrica(i,hOstetricaAnno[i],hOstetricaParto[i],hOstetricaSett[i],hOstetricaPeso[i],hOstetricaSesso[i],hOstetricaAllatt[i]); 
       	 }
        
        if (WindowCartella.ModalitaCartella.isReadonly(document)) {
            $('#lblAddAnamnesiOstetricaInt').attr('disabled', 'disabled');
        }

        var i = 0;
        $("#lblAddAnamnesiOstetricaInt").parent().click(function() {
            try {
                // Aggiungo una riga alla tabella 2
                addRowAnamnesiOstetrica(i);
            } catch(e) {
                alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
            }
            i++;
        });
    },
    
    stampaGlobaleAnamnesi:function(){
        /* CONFIGURAZIONE DEL REPARTO FATTA DA DENTRO ALL'XML */
        var vDati = WindowCartella.getForm();

        var funzione = 'STAMPA_GLOBALE_ANAMNESI';

        WindowCartella.utilMostraBoxAttesa(true);


        var vResp = WindowCartella.executeStatement('stampe.xml','StampaGlobale.Esegui',[
            vDati.iden_ricovero,
            funzione,
            top.baseReparti.getValue('','SITO')/* sito */,
            ''/* struttura */,
            vDati.reparto,
            'FUNZIONE'/* tipoFunz */,
            'PARAMETER'/* tipoParam */,
            'PDF_FIRMATO'/* isFirmato */,
            vDati.TipoRicovero
        ],7);

        if(vResp[0]=='KO'){
            return alert('Stampa in errore:\n'+vResp[1]);
        }

        var arrayFunction 	= vResp[2].split(';');
        var arrayParameters = vResp[3].split(';');
        var arrayNomeReport = vResp[4].split(';');
        var arrayFirmato    = vResp[5].split(';');

        var nomeCompleto	= '';
        var parametriRep	= '';
        var funzioni		= '';
        var isFirm			= '';
        for (var i=0;i<arrayParameters.length-1;i++){
            funzioni	 = funzioni		+ arrayFunction[i] + ';';
            nomeCompleto = nomeCompleto + arrayNomeReport[i] + ';';
            parametriRep = parametriRep + eval(arrayParameters[i]) + ';';
            isFirm		 = isFirm		+ arrayFirmato[i] + ';';
        }

        var vRespParam = WindowCartella.executeStatement('stampe.xml','StampaGlobale.setParametriStampaGlobale',[
              baseUser.LOGIN,
              vDati.iden_ricovero,
              "PARAMETRI_STAMPA_GLOBALE",
              funzioni,
              nomeCompleto,
              parametriRep,
              isFirm
              ]);
        if (vRespParam[0]=='KO'){
        	return alert("Errore nel salvataggio sul db dei parametri di stampa della cartella" + vRespParam[1])
        }
        
        var url =  'elabStampaMulti?';
                
        $('body').append('<form id="stampaGlobaleAnamnesi" />');
        $("form#stampaGlobaleAnamnesi").append('<input type="hidden" name="stampaAnteprima" id="stampaAnteprima"/>');
        $("form#stampaGlobaleAnamnesi input#stampaAnteprima").val("S");
        $("form#stampaGlobaleAnamnesi").append('<input type="hidden" name="numCopie" id="numCopie"/>');
        $("form#stampaGlobaleAnamnesi input#numCopie").val("1");
        $("form#stampaGlobaleAnamnesi").append('<input type="hidden" name="idenRicovero" id="idenRicovero"/>');
        $("form#stampaGlobaleAnamnesi input#idenRicovero").val(vDati.iden_ricovero);    
        
        var finestra_stampaglobale = window.open("","stampa_anamnesi","fullscreen=yes scrollbars=no");
    	$("form#stampaGlobaleAnamnesi").attr('target','stampa_anamnesi');
    	$("form#stampaGlobaleAnamnesi").attr('action',url);
        $("form#stampaGlobaleAnamnesi").attr('method','POST');
        $("form#stampaGlobaleAnamnesi").submit();         
       	
     
        /*var url =  'elabStampaMulti?&allFunction='+funzioni;
        url += '&allNameReport='+nomeCompleto;
        url += '&allParamReport='+parametriRep;
        url += '&allFirmato='+isFirm;
        url += '&stampaAnteprima=S';
        url += '&numCopie=1';
        WindowCartella.utilMostraBoxAttesa(false);
        var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);

        if(finestra){
            finestra.focus();
        }else{
            finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
        }*/
        WindowCartella.utilMostraBoxAttesa(false);
        try{
            opener.top.closeWhale.pushFinestraInArray(finestra_stampaglobale);
            }
        catch(e){}
    },

    InserisciPositivita: function() {
    	var obj = document.getElementById('frameWkPositivita').contentWindow.inserisciPositivita;
    	return obj.apply(obj, arguments);
    },
    
    InserisciPatologia: function() {
    	var obj = document.getElementById('frameWkPatologie').contentWindow.inserisciPatologia;
    	return obj.apply(obj, arguments);
    },
    
    /**
     * Controlla la presenza di allergie.
     * 
     * throws {Error}
     */
    CheckAllerte: function() {
        if (!document.getElementById('divAllergie')) { return; }
        
        // Controllo uniformità allergie. Se la wk è compilata...
        var idxRowAllergie = $('#frameWkAllerte').contents().find('#oTable tr[data-deleted=N]').length;

        // 623 --> NO - 621 --> SI
        var chkRiferiteAllergie = $('input[name=chkAllergieAnamnesi][value=621]').is(':checked');
        switch (document.EXTERN.REPARTO.value) {
        case 'ATS_CAR_SV': case 'UTIC_SV': case 'DH_CARD_SV':
        	if(chkRiferiteAllergie == true && $('#txtAllergieAnamnesi').text()==''){
        		throw new Error('E\' stata segnalata la presenza di allergie nonostante l\'effettiva assenza. Prego ricontrollare.');
        	} else if(chkRiferiteAllergie == false && $('#txtAllergieAnamnesi').text()!=''){
        		throw new Error('E\' stata segnalata l\'assenza di allergie nonostante l\'effettiva presenza. Prego ricontrollare.');
        	}
        	break;
        default:
        	if (chkRiferiteAllergie == true && idxRowAllergie <= 0) {
        		throw new Error('E\' stata segnalata la presenza di allergie nonostante l\'effettiva assenza. Prego ricontrollare.');
        	} else if (chkRiferiteAllergie == false && idxRowAllergie > 0) {
        		throw new Error('E\' stata segnalata l\'assenza di allergie nonostante l\'effettiva presenza. Prego ricontrollare.');
        	}
        }
        
        //@deprecated
        // Salvataggio allergie in campo nascosto hArrayAllergie (inutilizzato)
        $('#hArrayAllergie').val(document.getElementById('frameWkAllerte').contentWindow['array_iden'].join(","));
    },
    
    ImportaWorklist: function(sqlQuery, strImportaPaziente) {
        var iden_anag = WindowCartella.getPaziente("IDEN");
        var iden_visita = WindowCartella.getAccesso("IDEN");
        if (NS_ANAMNESI[strImportaPaziente] === Number(iden_anag)) {
            var rs = WindowCartella.executeStatement('anamnesi.xml',sqlQuery,["0", baseUser.IDEN_PER, iden_visita, iden_anag],0);
            if(rs[0]=='KO'){
                return alert(rs[0] + '\n' + rs[1]);
            }
            NS_ANAMNESI[strImportaPaziente] = null;
		}
    },
    
    importaAllergieIdenPaziente: null,
    importaInterventiIdenPaziente: null,
    importaPositivitaIdenPaziente: null,
    importaPatologieIdenPaziente: null,
    
    caricaAddendum: function(obj) {
    	NS_ADDENDUM.init(obj);
    }
};

/**
 * Libreria per l'apertura di un popup.
 */
var POPUP = (function(param){
	param = typeof param === 'object' ? param : {'url': "", 'width': 720, 'height': 200, 'mode': "openFancyboxDialog"};
	
	var _this = this;
	var _mode = new Function();
	switch(param.mode) {
	    case "openModalDialog":    _mode = openModalDialog; break;
	    case "openJQueryDialog":   _mode = openJQueryDialog; break;
		case "openFancyboxDialog":
		default:                   _mode = openFancyboxDialog; break;
		                         
	}
	
	//openJQueryDialog
	
	this.openDialog = function() {
		return _mode.apply(_this, arguments);
	};
	
	function openFancyboxDialog() {
		var callback = arguments[0];
		var args = Array.prototype.slice.call(arguments, 1);
		window.dialogArguments = args;
		window.returnValue = null;
		window.$.fancybox({
	        'padding'           : 3,
	        'width'             : param.width,
	        'height'            : param.height,
	        'href'              : param.url,
	        'type'              : 'iframe',
	        'scrolling'         : 'no',
			'onClosed': function() {
				if (typeof callback === 'function') {
					callback(window.returnValue);
				}
			}
	    });
	}
	
	function openModalDialog() {
		var callback = arguments[0];
		var args = Array.prototype.slice.call(arguments, 1);
		var ret = window.showModalDialog(param.url,args,"dialogWidth: "+param.width+"px; dialogHeight: "+param.height+"px; scroll: no ; status:no");
		callback(ret);
	}
	
	function openJQueryDialog() {
		var callback = arguments[0];
		var args = Array.prototype.slice.call(arguments, 1);
		WindowCartella.$('#dialog-box').remove();
    	WindowCartella.$('body').append(
    		$('<div id="dialog-box"/>').append(
    			$("<p><textarea id=\"content\" style=\"width:100%\" rows=\"8\"></textarea></p>")
    		).css({overflow:"hidden"})
    	);
		WindowCartella.$('#dialog-box').dialog({
            modal: true,
            resizable: false,
            draggable: false,
            width: 600,
            height: 250,
            title: args[0],
			autoOpen: false,
			buttons: {
			  "Registra": function() {
				  WindowCartella.$(this).dialog("close");
				  callback(WindowCartella.$('#dialog-box textarea#content').text());
				  
			  },
			  "Chiudi": function() {
				  WindowCartella.$(this).dialog("close");
			  }
			}
		});
		WindowCartella.$('#dialog-box textarea#content').text(args[2]);
		WindowCartella.$('#dialog-box').dialog('open');
	}
});

var NS_ADDENDUM = new Function();
(function() {
	var _this = this;
	var _conf = [];
	var _funzione = $('form[name=EXTERN] input[name=FUNZIONE]').val();
	var _popup = new POPUP({'url': "modalUtility/ModificaTextarea.html", 'width': 720, 'height': 300/*, 'mode': "openModalDialog"*/}); 
	
	this.init = function(param) {
		try {
			var campi = new Array();
			var pBinds = new Array();
	
			$.each(param, function(i, val) {
		        if (typeof _conf[val.key_campo] === "undefined") {
		        	_conf[val.key_campo] = {"rows": 0, "sezione": val.sezione || ''};
		        }
				_this.creaTabella(val.sezione, val.key_campo);
				campi.push(val.key_campo);
			});
			pBinds.push(_funzione);
			pBinds.push(document.EXTERN.IDEN_VISITA.value);
			pBinds.push(campi.toString());
			var rs = WindowCartella.executeQuery("addendumSezioni.xml","caricaDati",pBinds);
			if (!rs.isValid) throw new Error(rs.getError());
			while(rs.next()){
				addRow({
					sezione:rs.getString("sezione"),
					key_campo:rs.getString("key_campo"),
					testo:rs.getString("testo"),
					uteIns:rs.getString("uteIns"),
					descrUteIns:rs.getString("descrUteIns"),
					dataMod:rs.getString("dataMod"),
					dataIns:rs.getString("dataIns"),
					deleted:rs.getString("deleted"),
					iden:rs.getString("iden")
					}
				);
			}
		} catch(e) {
			alert(e.message);
		}
	};
		
	this.creaTabella = function(sezione, key_campo){
		var tr =
		"<TR class=\"header raccordoAn\" key_campo=\""+key_campo+"\" sezione=\""+sezione+"\">" +
			"<TD class=\"classTdLabelLink\"><LABEL"+(!NS_ANAMNESI.editabile ? " disabled=\"disabled\"" : " onclick=\"NS_ADDENDUM.inserisci('"+key_campo+"');")+"\">Raccordo anamnestico</LABEL></TD>"+
			"<TD class=\"classTdLabel\"><LABEL>Testo</LABEL></TD>"+
			"<TD class=\"classTdLabel\"><LABEL>Utente</LABEL></TD>"+
			"<TD class=\"classTdLabel\" colspan=\"12\"><LABEL>Data ultima modifica</LABEL></TD>" +
		"</TR>";
        
		$("tr[key_campo="+key_campo+"]").remove();
		appendAddendum(key_campo, tr);
	};
	
	this.inserisci = function(key_campo) {
		try {
			if (!NS_ANAMNESI.salvata) {
				alert("Prima di inserire o modificare un addendum è necessario registrare l'anamnesi.");
				return -1;
			}
			
			var callback = function (testo) {
				if (testo != null && typeof testo == "string") {
					var pBinds = [
						_funzione,
						_conf[key_campo].sezione,
						key_campo,
						document.EXTERN.IDEN_VISITA.value,
						testo,
						baseUser.IDEN_PER
					];
					var rs = WindowCartella.executeStatement("addendumSezioni.xml","inserisci",pBinds,0);
					if (rs[0]=='KO') throw new Error(rs[1]);
					_this.init(new Array({"sezione":_conf[key_campo].sezione,"key_campo":key_campo}));
				}
			};
			
			_popup.openDialog(callback, 'Raccordo anamnestico', 'I', '');
		} catch(e) {
			alert(e.message);
		}
		return -1;
	};
	
	this.modifica = function(iden){
		try {
			if (!NS_ANAMNESI.salvata) {
				alert("Prima di inserire o modificare un addendum è necessario registrare l'anamnesi.");
				return -1;
			}
			var row = $("tr[iden="+iden+"]");
			if (row.attr("ute_ins")!=baseUser.IDEN_PER) {
				alert("La modifica è consentita soltanto all'utente che ha inserito la nota.");
				return -1;
			}
			var data = clsDate.str2date(row.attr("data_ins").substr(0,10),'DD/MM/YYYY',row.attr("data_ins").substr(11,5));
			if (clsDate.dateCompare(data, new Date(), {down:12}) < 0) {
				alert("Attenzione: operazione non consentita poiché sono trascorse più di 12 ore dalla data di inserimento.");
				return -1;
			}

			var callback = function(testo) {
				if (testo != null && typeof testo == "string") {
					if  (testo != "") {
						var rs = WindowCartella.executeStatement("addendumSezioni.xml","modifica",[testo, iden]);
						if (rs[0]=='KO') throw new Error(rs[1]);
						var key_campo = row.attr("key_campo");
						_this.init(new Array({"sezione":_conf[key_campo].sezione,"key_campo":key_campo}));
						return 0;
					} else {
						if (_this.elimina(iden) < 0) return _this.modifica(iden);
					}
				}
			};
			
			_popup.openDialog(callback, 'Raccordo anamnestico', 'E', $.data(row[0], "plain"));
		} catch(e) {
			alert(e.message);
		}
		return -1;
	};
	
	this.elimina = function(iden){
		try {
			if (!NS_ANAMNESI.salvata) {
				alert("Prima di inserire o modificare un addendum è necessario registrare l'anamnesi.");
				return -1;
			}
			var row = $("tr[iden="+iden+"]");
			if (row.attr("ute_ins")!=baseUser.IDEN_PER) {
				alert("La cancellazione è consentita soltanto all'utente che ha inserito la nota.");
				return -1;
			}
			var text = row.find("td.content").html().replace(/(<br\/?>)/gi, '\n');
			if (confirm('Eliminare la nota?\n\n'+text.substr2(0, 100))) {
				var rs = WindowCartella.executeStatement("addendumSezioni.xml","elimina",[iden],0);
				if (rs[0]=='KO') throw new Error(rs[1]);
				var key_campo = row.attr("key_campo");
				_this.init(new Array({"sezione":_conf[key_campo].sezione,"key_campo":key_campo}));
				return 0;
			}
		} catch(e) {
			alert(e.message);
		}
		return -1;
	};
	
	function addRow(param) {
		(_conf[param.key_campo].rows)++;
		var testo = $("<div/>").text(param.testo.replace(/\r\n?/g, '<br/>')).html().replace(/(&lt;br\/&gt;)/gi, '<br/>');
		var tr=$("<TR key_campo=\""+param.key_campo+"\" sezione=\""+_conf[param.key_campo].sezione+"\" class=\"raccordoAn"+(param.deleted == 'N' ? '' : ' deleted')+ "\" riga=\""+_conf[param.key_campo].rows+"\" ute_ins=\""+param.uteIns+"\" iden=\""+param.iden+"\" data_ins=\""+param.dataIns+"\">")
			.append($("<TD class=\"classTdField centrato\">"+(param.deleted == 'N' && NS_ANAMNESI.editabile ? "<LABEL class=\"labelBtn\" onclick=\"NS_ADDENDUM.modifica('"+param.iden+"');\">Modifica</LABEL>&nbsp;<LABEL class=\"labelBtn\" onclick=\"NS_ADDENDUM.elimina('"+param.iden+"');\">Elimina</LABEL>" : "&nbsp;")+"</TD>"))
			.append($("<TD class=\"classTdField content\"/>").html(testo))
			.append($("<TD class=\"classTdField\">"+param.descrUteIns +"</TD>"))
			.append($("<TD class=\"classTdField\" colspan=\"12\">"+param.dataMod + "</TD>"));
		$('tr[key_campo='+param.key_campo+'].header').after(tr);
		
		$.data(tr[0], "plain", param.testo); // contenuto originale
	};
	
	function appendAddendum(key_campo, tr) {
		//$("#div"+_conf[key_campo].sezione+" table.classDataEntryTable").last().append(tr);
		$('#'+key_campo).parent().parent().after(tr);
	}
}).apply(NS_ADDENDUM);

/**
 *  Get the substring of a string and add ellipsis
 *  @param  {integer}  start   where to start the substring
 *  @param  {integer}  length  how many characters to return
 *  @return {string}
 */
String.prototype.substr2 = function(substr) {
  return function(start, length) {
    // did we get a negative start, calculate how much it is
    // from the beginning of the string
    if (start < 0) {
      start = this.length + start;
    }

    // call the original function
    return substr.call(this, start, length)+(this.length > length ? String.fromCharCode(8230) : '');
  };
}(String.prototype.substr);