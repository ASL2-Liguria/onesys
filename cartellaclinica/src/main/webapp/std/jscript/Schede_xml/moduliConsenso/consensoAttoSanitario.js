var WindowCartella = null;

jQuery(document).ready(function() {

    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }

    CONSENSO_ATTO_MEDICO.init();
    CONSENSO_ATTO_MEDICO.setEvents();

    try {
    	WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {
    }
});

jQuery(window).load(function() {
if (typeof(document.EXTERN.APERTURA)!='undefined' && document.EXTERN.APERTURA.value=='LETTERA'){
	$('#lblRegistra').text('Registra/Stampa');
}
});

var CONSENSO_ATTO_MEDICO = {
    init: function() {
        document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
        if (_STATO_PAGINA == 'L') {
            document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
            /*		document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';*/
            jQuery('#lblMedPrescr').parent().attr('disabled', 'disabled');
        }
    
        CONSENSO_ATTO_MEDICO.valorizzaMed();

        if (!$('input[name=chkAtto]').is(':checked')) {
            $('input[name=chkAtto][value=1]').attr('checked', true);
        }
        jQuery('#txtGenitori,#txtRappresentante,#txtMadre,#txtPadre,#txtSituazione,#txtOsservazioni,#txtAlternativa,#txtVantaggi,#txtRischi,#txtRevoca,#txtAffettoDa').addClass("expand");

        $('#lblPadre,#lblMadre').parent().parent().hide();

        $('#groupCondizioni').hide();
        $('#lblPaceMaker,input[name=chkPaceMaker],#lblCoagulazione,input[name=chkCoagulazione],#lblAllergico,#txtAllergico,input[name=chkAllergico],#lblGlaucoma,input[name=chkGlaucoma],#lblEmorragie,input[name=chkEmorragie],#lblAntiaggreganti,input[name=chkAntiaggreganti]').parent().hide();
        $('input[name=chkAtto],#txtAtto,#lblEsameDiagnostico,#txtEsameDiagnostico,#chkBiopsiaOsteo,#chkAspirato').parent().hide();
        $('#lblTrasfusione,input[name=chkSangue],input[name=chkPlasma],input[name=chkPiastrine]').parent().hide();
        $('#lblTerapiaMedica,#lblIntervento,#lblSomministrazione').parent().parent().hide();
        $('#lblProspettiva,input[name=chkProspettiva]').parent().hide();
        $('#lblAlternativa,#txtAlternativa,#lblVantaggi,#txtVantaggi,#lblRischi,#txtRischi').parent().hide();
        $('#lblAsa,#lblRischio,#lblProcedure,#lblAltraAn,#lblComplicanze,#lblRischiAgg,#lblDopoInterChir,#lblConsensoTrasf,#lblConsensoAnalgesia').parent().parent().hide();

        if (document.EXTERN.REVOCA.value == 'N') {
            $('#groupRevoca').hide();
        }
        switch (document.EXTERN.TIPO.value) {
            case 'ATTO_MEDICO':
                $('#lblEsameDiagnostico,#txtEsameDiagnostico').parent().show();
                $('#lblTerapiaMedica,#lblIntervento').parent().parent().show();
                break;
            case 'PROCEDURE_ANEST':
                $('#lblEsameDiagnostico,#txtEsameDiagnostico').parent().show();
                $('#lblIntervento').parent().parent().show();
                $('#lblAsa,#lblRischio,#lblProcedure,#lblAltraAn,#lblComplicanze,#lblRischiAgg,#lblDopoInterChir,#lblConsensoTrasf,#lblConsensoAnalgesia').parent().parent().show();
				$('#lblOsservazioni').parent().parent().hide();
				
                 $('select[name=cmbAnalgesia]').attr('id', 'cmbAnalgesia');
                NS_FUNCTIONS.moveLeftField({name: 'cmbAnalgesia', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
                
                $('#lblMedPrescr,#txtMedPrescr').attr('SCANDB_PROC','MEDICO_ANESTESISTA')
                
                 if(document.EXTERN.KEY_ID.value==0){
                    var rs = WindowCartella.executeQuery('moduliConsenso.xml', 'getDatiLetteraAn', [document.EXTERN.IDEN_VISITA.value]);
                 	while (rs.next()) {
                		
                	//	if(confirm("Vuoi importare i dati dalla visita anestesiologica refertata?")){
                		
                		$('#txtSituazione').val(rs.getString("problematiche"));
                		$('#txtIntervento').val(rs.getString("intervento_esame"));
                		$('SELECT[name=cmbAsa]').val(rs.getString("AsaRadio"));
                		if(rs.getString("AnestesiaProposta1")=='S'){$('#chkAnLoc').attr('checked',true)}
                		if(rs.getString("AnestesiaProposta2")=='S'){$('#chkAnLocSed').attr('checked',true)}
                		if(rs.getString("AnestesiaProposta3")=='S'){$('#chkAnLocReg').attr('checked',true)}
                		if(rs.getString("AnestesiaProposta4")=='S'){$('#chkAnGen').attr('checked',true)}
                		if(rs.getString("AnestesiaProposta5")=='S'){$('#chkPosCat').attr('checked',true)}
                		if(rs.getString("AnestesiaProposta7")=='S'){$('#chkIncan').attr('checked',true)}
                	//	}
                     }	                	 
                 }


                break;
            case 'BIOPSIA_OSTEO':
            	$('#lblIntervento').parent().parent().show();
            	$('#lblIntervento,#txtIntervento').parent().hide();
                $('#chkBiopsiaOsteo,#chkAspirato').parent().show();
                break;
            case 'ESOFAGOGASTRO':
            case 'INFLIXIMAB':
            case 'PEG':
            case 'PROPYL':
            case 'INDAGINE_ENDO':
                $('input[name=chkAtto],#txtAtto').parent().show();
                break;
            case 'COLONSCOPIA':
                $('input[name=chkAtto],#txtAtto').parent().show();
                $('#lblPaceMaker,input[name=chkPaceMaker],#lblCoagulazione,input[name=chkCoagulazione]').parent().show();

                break;
            case 'COLANGIO':
                $('input[name=chkAtto],#txtAtto').parent().show();
                $('#lblAllergico,#txtAllergico,input[name=chkAllergico],#lblGlaucoma,input[name=chkGlaucoma],#lblEmorragie,input[name=chkEmorragie],#lblAntiaggreganti,input[name=chkAntiaggreganti]').parent().show();

                break;
            case 'CATETERE_TORACICO':
                $('input[name=chkAtto],#txtAtto').parent().show();
                $('#groupCondizioni').show();
                $('#lblProspettiva,input[name=chkProspettiva]').parent().show();
                $('#lblAlternativa,#txtAlternativa,#lblVantaggi,#txtVantaggi,#lblRischi,#txtRischi').parent().show();

                break;
            case 'PARACENTESI':
                $('input[name=chkAtto],#txtAtto').parent().show();
                $('#groupCondizioni').show();
                break;
            case 'TORACENTESI':
                $('input[name=chkAtto],#txtAtto').parent().show();
                $('#groupCondizioni').show();
                $('#lblAlternativa,#txtAlternativa,#lblVantaggi,#txtVantaggi,#lblRischi,#txtRischi').parent().show();
                break;
//	case 'TRASFUSIONE':
//		$('#lblGenitori').parent().parent().hide();
//		$('#lblPadre,#lblMadre').parent().parent().show();
//		$('#lblTrasfusione,input[name=chkSangue],input[name=chkPlasma],input[name=chkPiastrine]').parent().show();
//		$('#lblSomministrazione').parent().parent().show();
//		break;
        }

        /*		$('body').keydown(function() {
         if (window.event && window.event.keyCode == 8) {
         window.event.cancelBubble = true;
         window.event.returnValue = false;
         }
         });*/

        var rs = WindowCartella.executeQuery('moduliConsenso.xml', 'getDescrModulo', [document.EXTERN.TIPO.value]);
        if (rs.next()) {
            $('#lblTitle').text('CONSENSO - ' + rs.getString("DESCRIZIONE"));
        }


        //	$('input[name=txtMedico]').attr('disabled', 'disabled');
        //se il campo medico è già stato salvato non lo sovrascrivo
        if ($('input[name=txtMedico]').val() == '') {
            $('input[name=txtMedico]').val(WindowCartella.baseUser.DESCRIPTION);
        }
		
		NS_FUNCTIONS.moveLeftField({name: 'chkAnLocSed', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'chkAnLocReg', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'chkAnGen', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'chkPosCat', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'chkIncan', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});

		NS_FUNCTIONS.moveLeftField({name: 'chkComplRenale', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'chkComplResp', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'chkComplNeuro', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'chkComplMeta', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'chkComplAltro', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'txtComplAltro', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});

		NS_FUNCTIONS.moveLeftField({name: 'chkAnalgesiaOS', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'chkAnalgesiaRet', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'chkAnalgesiaIntra', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'chkAnalgesiaEndo', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'chkAnalgesiaPerid', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});
		NS_FUNCTIONS.moveLeftField({name: 'chkAnalgesiaPerin', colspan: 1, space: '&nbsp;&nbsp;&nbsp;'});

        $('input[name=txtNome]').attr('disabled', 'disabled');
        $('input[name=txtCogn]').attr('disabled', 'disabled');
        $('input[name=txtDataNascita]').attr('disabled', 'disabled');

        $('input[name=chkAcc]').parent().css({'background': 'orange', 'text-align': 'center'});
        $('input[name=chkRevoca]').parent().css('text-align', 'center');
        $('#txtOsservazioni').parent().css('width', '90%');
        $('#txtAllergico').parent().attr('colSpan', '1');
        $('#txtOsservazioni,input[name=chkPaceMaker],input[name=chkCoagulazione],input[name=chkGlaucoma],input[name=chkEmorragie],input[name=chkAntiaggreganti],#txtAlternativa,#txtVantaggi,#txtRischi,select[name=cmbAsa],select[name=cmbRischio],input[name=chkIncan],#txtAltraAn,input[name=chkComplCardio],#txtRischiAgg,#txtComplAltro,input[name=radDopoInterChir],input[name=radConsensoTrasf],input[name=chkAnalgesiaPerin],input[name=radConsensoAnalgesia],input[name=chkProspettiva]').parent().attr('colSpan', '2');
        $('input[name=chkAcc]').parent().attr('colSpan', '3');
    },
    chiudiModulo: function() {
        WindowCartella.$.fancybox.close();
    },
    regOK: function() {
    	if (typeof(document.EXTERN.APERTURA)!='undefined' && document.EXTERN.APERTURA.value=='LETTERA'){
    		
    	   var rs = WindowCartella.executeQuery('moduliConsenso.xml', 'getIdenRegistrazione', [document.EXTERN.IDEN_VISITA.value]);
          	while (rs.next()) {  
            WindowCartella.confStampaReparto('PROCEDURE_ANEST', '&prompt<pVisita>=' + WindowCartella.getRicovero("IDEN")+'&prompt<pIden>='+rs.getString("IDEN"), 'S', WindowCartella.getAccesso("COD_CDC"), WindowCartella.basePC.PRINTERNAME_REF_CLIENT);
          	}
    	}
    	else{
    		 $('iframe#frameWork', parent.document)[0].contentWindow.$('iframe#oIFWk')[0].contentWindow.location.reload();	
    	}
    	      
        CONSENSO_ATTO_MEDICO.chiudiModulo();
    },
    
    
    stampaModulo: function() {
        var funzione = document.EXTERN.TIPO.value;
        var anteprima = 'S';
        var reparto = WindowCartella.getAccesso("COD_CDC");
        var sf = '&prompt<pVisita>=' + WindowCartella.getRicovero("IDEN");
        WindowCartella.confStampaReparto(funzione, sf, anteprima, reparto, WindowCartella.basePC.PRINTERNAME_REF_CLIENT);
    },
    setEvents: function() {
    },
    valorizzaMed: function() {

        if (WindowCartella.baseUser.TIPO == 'M') {
            if (_STATO_PAGINA != 'L') {
                document.dati.Hiden_MedPrescr.value = WindowCartella.baseUser.IDEN_PER;
                document.dati.txtMedPrescr.value = WindowCartella.baseUser.DESCRIPTION;
            }
            jQuery('#lblMedPrescr').parent().attr('disabled', 'disabled');
        }
        jQuery('#txtMedPrescr').attr('disabled', 'disabled');

    }


};
