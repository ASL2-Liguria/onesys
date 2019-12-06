var WindowCartella = null;
$(function() {
	window.WindowCartella = window;
	while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
		window.WindowCartella = window.WindowCartella.parent;
	}
    baseReparti = WindowCartella.baseReparti;
    baseGlobal = WindowCartella.baseGlobal;
    basePC = WindowCartella.basePC;
    baseUser = WindowCartella.baseUser;


	try {
		WindowCartella.utilMostraBoxAttesa(false);
	} catch (e) {
		/*catch nel caso non venga aperta dalla cartella*/
	}

	try {
		EOS_NEUROLOGIA.init();
		EOS_NEUROLOGIA.setEvents();
	} catch (e) {
		alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
	}
});

var EOS_NEUROLOGIA = {
		init: function() {

			try {
				eval(baseReparti.getValue(top.getForm(document).reparto, 'ESAME_OBIETTIVO_SPECIALISTICO'));
			} catch (e) {
				alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
			}

			//NS_FUNCTIONS.hideRecordsPrint('lblregistra', 'lblstampa');

			if(_STATO_PAGINA == 'L'){

				$("#lblregistra").parent().parent().hide();
				$("td[class=classTdLabelLink]").attr('disabled', 'disabled');
			}
			if (!top.ModalitaCartella.isStampabile(document)) {
				document.getElementById('lblstampa').parentElement.parentElement.style.display = 'none';
			}
			
			$("input[name='chkNormale']").click(function() {
				if (window.event.srcElement.checked) {
			 for(var key in datiNormali){
		            $("#"+key).val(datiNormali[key]);
		        }
			 jQuery("textarea[class*=expand]").TextAreaExpander();
				}
			});
			

		},
		setEvents: function() {
			var maxLength = 4000;
			var msg = 'Attenzione: il testo inserito supera la lunghezza massima consentita.\n\nPremendo ok il sistema troncherà il testo in eccesso. Procedere?';
			jQuery("#txtArtInf,#txtArtSup,#txtCamVis,#txtCoo,#txtEquStaEreDea,#txtFun,#txtFunSim,#txtMovPat,#txtNerCra,#txtPup,#txtRifPro,#txtRifSup,#txtSegIrrMenRad,#txtSenOggPro,#txtSenOggSup,#txtSenSog,#txtSenSpe,#txtSfi,#txtStaCos").addClass("expand").attr("maxlength", String(maxLength)).blur(function(e) {
				maxlength(this, maxLength, msg);
			});

			jQuery("textarea[class*=expand]").TextAreaExpander();
			if(_STATO_PAGINA != 'L'){
				$('#lblScalaMrs').click(EOS_NEUROLOGIA.apriMRS);
				$('#lblScalaNihss').click(EOS_NEUROLOGIA.apriNIHSS);
			}
		},

		registraEsameObiettivoSpecialistico: function() {
			//alert("registraEsameObiettivoSpecialistico");
			NS_FUNCTIONS.records();
		},
		stampaEsameObiettivoSpecialistico: function() {
			//alert("stampaEsameObiettivoSpecialistico");
			NS_FUNCTIONS.print('ESAME_OBIETTIVO_SPECIALISTICO', 'S');
		},

		apriMRS : function(){
			window.showModalDialog("servletGenerator?KEY_LEGAME=SCALA_RANKIN&FUNZIONE=SCALA_RANKIN&OPEN_FROM_OS=S&IDEN_VISITA=" + document.EXTERN.IDEN_VISITA.value + "&IDEN_VISITA_REGISTRAZIONE="+document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,window,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px');
		},
		apriNIHSS : function(){
			window.showModalDialog("servletGenerator?KEY_LEGAME=SCALA_NIH_STROKE&FUNZIONE=SCALA_NIH_STROKE&OPEN_FROM_OS=S&IDEN_VISITA=" + document.EXTERN.IDEN_VISITA.value + "&IDEN_VISITA_REGISTRAZIONE="+document.EXTERN.IDEN_VISITA_REGISTRAZIONE.value,window,'dialogHeight:'+screen.availHeight+'px;dialogWidth:'+screen.availWidth+'px');

		}
						
}

var  datiNormali= {
		"txtStaCos":"Vigile, cosciente, collaborante, orientato nello spazio e nel tempo",
		"txtFunSim":"Nella norma",
		"txtFun":"Nella norma",
		"txtCamVis":"Non disturbi campimetrici al confronto",
		"txtNerCra":"Come di norma",
		"txtPup":"Isocoriche, isocicliche, reagenti al fotostimolo",
		"txtSenSpe":"Come di norma",
		"txtArtSup":"Mobilità attiva e passiva, globale, segmentaria e fine: come di norma. Tono e trofismo: come di norma. Forza muscolare: comedi norma. Prove antigravitarie: come di norma alla prova di Mingazzini",
		"txtArtInf":"Mobilità attiva e passiva, globale, segmentaria e fine: come di norma. Tono e trofismo: come di norma. Forza muscolare: comedi norma. Prove antigravitarie: come di norma alla prova di Mingazzini",
		"txtCoo":"Come di norma",
		"txtEquStaEreDea":"Come di norma la manovra di Romberg. Stazione eretta e deambulazione in ordine. Deambulazione sui talloni e sulle punte senza assimetrie",
		"txtSenSog":"Nulla da segnalare",
		"txtSenOggSup":"Nella norma",
		"txtSenOggPro":"Come di norma",
		"txtRifSup":"Corneali presenti bilateralmente. Hoffmann negativo. Addominali presenti normoevocabili. Cutaneo-plantare: in flessione bilateralmente",
		"txtRifPro":"Normoelicitabili e simmetrici",
		"txtMovPat":"Assenti",
		"txtSegIrrMenRad":"Assenti",
		"txtSfi":"continenti"
	}	
