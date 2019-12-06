/**
 * User: graziav
 * Date: 20/05/2014
 * Time: 17:00
 */

jQuery(document).ready(function () {
    NS_RICHIEDI_PREST_DSA.init();
    NS_RICHIEDI_PREST_DSA.setEvents();
});

var NS_RICHIEDI_PREST_DSA={
		metodica : null,			// metodica degli esami
		attualeCodDec : null,		// variabile usata per confronto del CodDec
		attualeMetodica : null,		// variabile usata per confronto della Metodica
		validator:null,
		init: function(){
			$("#cmbRichSel").hide();
			//alert(JSON.stringify(NS_RICHIEDI_PREST_DSA.validator));
			NS_FENIX_SCHEDA.addFieldsValidator({config:"V_DSA_INS_RICHIESTE"});
			NS_RICHIEDI_PREST_DSA.validator=V_DSA_INS_RICHIESTE.elements;
			// creazione combo list di prestazioni per cdc destinatario e metodica
			dwr.engine.setAsync(true);
			param={
					"idenContatto":$("#IDEN_CONTATTO").val(),
					"idenprov":$("#IDEN_PROVENIENZA").val()
			};
			toolKitDB.getResultDatasource("WORKLIST.WK_PRESTAZIONI_CDCDEST_DSA","WHALE",param,null,function(resp){
				logger.debug(JSON.stringify(resp));
				if(resp["result"] == 'KO'){

					home.NOTIFICA.error({message: "Attenzione errore nella creazione del combo", title: "Error"});

				}else{
					caricaCombolist(resp);
					NS_APPEND_RICHIESTE.creaIntestazioneTable();
					NS_RICHIEDI_PREST_DSA.spacchettaRichieste();
					if($("#cmbPrestNoCdc  option").length==0){
						$("#cmbPrestNoCdc").hide();
						$("#idPrestazioniDsa").hide();
					}
				}

			});
			dwr.engine.setAsync(false);


		},
		spacchettaRichieste : function() {
			var combolist = $("#cmbRichSel");
			NS_INVIA_RICHIESTE.jsonRichieste = [];
			var jsonRichieste = NS_INVIA_RICHIESTE.jsonRichieste;

			$(combolist.find("option")).each(
				function(index) {
					NS_RICHIEDI_PREST_DSA.attualeCodDec = $(this).data("coddec");
					NS_RICHIEDI_PREST_DSA.attualeMetodica = $(this).data("metodica");
					var item = {};
					// Il primo inserimento, inserisce senza controlli
						if (index == 0) {
							item["COD_DEC"] = NS_RICHIEDI_PREST_DSA.attualeCodDec;
							item["METODICA"] = NS_RICHIEDI_PREST_DSA.attualeMetodica;
							item["EROGATORE"]= $(this).data("erogatore");
							item["MULTI_EROGATORE"]=$(this).data("multierogatore");
							item["COD_CDC"] = $(this).data("cdc");
							item["QUESITO"] = $(this).data("quesito");
							item["QUADRO"] = null;
							item["NOTE"] = null;
							item["DATA_PROPOSTA"] = null;
							item["ORA_PROPOSTA"] = moment().format('HH:mm');
							item["ESAMI"] = [];
							item["ESAMI"].push({
								"IDEN_ESA" : $(this).data("iden"),
								"ESAME" : $(this).data("descr"),
								"LATERALITA" : $(this).data("lateralita")==null ? '' : $(this).data("lateralita"),
								"METODICA" : NS_RICHIEDI_PREST_DSA.attualeMetodica,
								"URGENZA" : $(this).data("urgenza"),
								"IMPEGNATIVA": $(this).data("numimpegnativa"),
								"URGENZA_IMPEGNATIVA" : $(this).data("urgimpegnativa"),
								"DATA_IMPEGNATIVA" : $(this).data("dataimpegnativa"),
								"TIPO_IMPEGNATIVA" : $(this).data("tipoimpegnativa")==null ? '' : $(this).data("tipoimpegnativa"),
								"COD_ESENZIONE" : $(this).data("codesenzione")==null ? '' : $(this).data("codesenzione"),
								"CODICE_REGIONALE":$(this).data("codice_regionale"),
								"MULTI_EROGATORE":$(this).data("multierogatore"),
								"FLAG_INVIA":true
							});
							jsonRichieste.push(item);
							/*  Per ogni altro caso successivo al 1�, controllo i cdc e le metodiche*/
						} else {

							var booleanPush = false;

							for ( var i = 0; i < jsonRichieste.length; i++) {
								/* Se esiste gi� un segmento con lo stesso cdc e
								 * la stessa metodica allora inserisco solo un nuovo esame */
								if (jsonRichieste[i].COD_DEC == NS_RICHIEDI_PREST_DSA.attualeCodDec
										&& jsonRichieste[i].METODICA == NS_RICHIEDI_PREST_DSA.attualeMetodica) {

									item["IDEN_ESA"] = $(this).data("iden");
									item["ESAME"] = $(this).data("descr");
									item["LATERALITA"] = $(this).data("lateralita")==null ? '' : $(this).data("lateralita");
									item["METODICA"] = $(this).data("metodica");
									item["URGENZA"] = $(this).data("urgenza");
									item["IMPEGNATIVA"] = $(this).data("numimpegnativa");
									item["URGENZA_IMPEGNATIVA"] = $(this).data("urgimpegnativa");
									item["DATA_IMPEGNATIVA"] = $(this).data("dataimpegnativa");
									item["TIPO_IMPEGNATIVA"] = $(this).data("tipoimpegnativa")==null ? '' : $(this).data("tipoimpegnativa");
									item["COD_ESENZIONE"] = $(this).data("codesenzione")==null ? '' : $(this).data("codesenzione"),
									item["CODICE_REGIONALE"]=$(this).data("codice_regionale");
									item["MULTI_EROGATORE"]=$(this).data("multierogatore");
									item["FLAG_INVIA"]=true;
									jsonRichieste[i].ESAMI.push(item);

									booleanPush = true;
									i = jsonRichieste.length;
									}
							}
							/* Se non esiste ancora quel cdc o quella
							   metodica inserisco un nuovo segmento */
							if (!booleanPush) {
								item["COD_DEC"] = NS_RICHIEDI_PREST_DSA.attualeCodDec;
								item["METODICA"] = NS_RICHIEDI_PREST_DSA.attualeMetodica;
								item["EROGATORE"]= $(this).data("erogatore");
								item["MULTI_EROGATORE"]=$(this).data("multierogatore");
								item["COD_CDC"] = $(this).data("cdc");
								item["QUESITO"] = $(this).data("quesito");
								item["QUADRO"] = null;
								item["NOTE"] = null;
								item["DATA_PROPOSTA"] = null;
								item["ORA_PROPOSTA"] = moment().format('HH:mm');
								item["ESAMI"] = [];
								item["ESAMI"].push({
									"IDEN_ESA" : $(this).data("iden"),
									"ESAME" : $(this).data("descr"),
									"LATERALITA" : $(this).data("lateralita")==null ? '' : $(this).data("lateralita"),
									"METODICA" : NS_RICHIEDI_PREST_DSA.attualeMetodica,
									"URGENZA" : $(this).data("urgenza"),
									"IMPEGNATIVA": $(this).data("numimpegnativa"),
									"URGENZA_IMPEGNATIVA" : $(this).data("urgimpegnativa"),
									"DATA_IMPEGNATIVA" : $(this).data("dataimpegnativa"),
									"TIPO_IMPEGNATIVA" : $(this).data("tipoimpegnativa")==null ? '' : $(this).data("tipoimpegnativa"),
									"COD_ESENZIONE" : $(this).data("codesenzione")==null ? '' : $(this).data("codesenzione"),
									"CODICE_REGIONALE":$(this).data("codice_regionale"),
									"MULTI_EROGATORE":$(this).data("multierogatore"),
									"FLAG_INVIA":true
								});
								jsonRichieste.push(item);
							}
					}
			});
			// alert("jsonRichieste:\n"+JSON.stringify(jsonRichieste));
			NS_APPEND_RICHIESTE.creaTrTable(jsonRichieste);
		},

		setEvents:function(){
			$("button.butInvia").click(function(){
				if(NS_INVIA_RICHIESTE.jsonRichieste != null){
				NS_DATI_RICHIESTE.setAssigningAuthorityMittente("FENIX-ADT");
				NS_DATI_RICHIESTE.setRepartoMittente("DSA");
				NS_DATI_RICHIESTE.setAssigningAuthorityDestinatario("WHALE");
				NS_DATI_RICHIESTE.setVersione('2.5');
				NS_DATI_RICHIESTE.setIdenAnag($("#IDEN_ANAG").val());
				NS_DATI_RICHIESTE.setCodiceFiscale($("#COD_FISC").val());
				NS_DATI_RICHIESTE.setNome($("#NOME").val());
				NS_DATI_RICHIESTE.setCognome($("#COGNOME").val());
				NS_DATI_RICHIESTE.setDataNascita($("#DATA_NASCITA").val());
				NS_DATI_RICHIESTE.setSesso($("#SESSO").val());
				NS_DATI_RICHIESTE.setIdenProvenienza($("#IDEN_PROVENIENZA").val());
				NS_DATI_RICHIESTE.setNumNosologico($("#CODICE_DSA").val());
				NS_DATI_RICHIESTE.setUrgenza('0');
				NS_DATI_RICHIESTE.setUserIdenPer($("#IDEN_MED").val());
				//NS_DATI_RICHIESTE.setQuesito($("#taQuesito").val());
				//NS_DATI_RICHIESTE.setQuadro($("#taQuadro").val());
				//NS_DATI_RICHIESTE.setDataOraEsame(moment().format("YYYYMMDDhhmmss") + ".000"); // data proposta ora proposta
				NS_DATI_RICHIESTE.setDataOraRegOrdine(moment().format("YYYYMMDDhhmmss") + ".000"); // data e ora ordine degli esami
				NS_DATI_RICHIESTE.setDataOraMessaggio();
				NS_DATI_RICHIESTE.setNumOrdine();
				NS_DATI_RICHIESTE.setNumRichiesta();
				NS_APPEND_RICHIESTE.addValueJSON();
				NS_INVIA_RICHIESTE.processaRichieste();
				AggiornaDataPrestDsa();
				var obj = top.$("#iScheda-1").contents().find("#li-tabRichiesteAccessi");
    			obj.trigger('click');
    			var params = {'refresh':true};
                NS_FENIX_SCHEDA.chiudi(params);
				}
			});
		}
}

function caricaCombolist(recPrest){
	var priorita;
    var aCdcDest=new Array();
    var aDestinatari=new Array();
    var flagCdc;
    var option;
    var multiesame;
    var multierogatore;
    for (var i=0; i<recPrest.length; i++){
    	priorita='0';
    	switch (recPrest[i].CLASSE_PRIORITA){
		case 'P' :
			priorita='0';
			break;
		case 'D' :
			priorita='1';
			break;
		case 'B':
			priorita='2';
			break;
		case 'U':
			priorita='3';
			break;
		}
    	if (recPrest[i].CDC_DESTINATARIO!=null){
    		aDestinatari=recPrest[i].CDC_DESTINATARIO.split('*');
    		for (j=0; j<aDestinatari.length; j++){
    			aCdcDest = aDestinatari[j].split('@');
    			flagCdc=true;
    			/**
    	    	 * rec : {"COD_DEC":"LABO","URGENZA":"0","N_ROW":1,"DATA_INS":null,"BRANCA":"L","METODICA":"L",
    	    	 * "REPARTO_DESTINAZIONE":"LABO","IDEN":17701,"DESCR":"BMP-FVLEIDEN TEST GEN. TROMBOFILIA", "DESCR_REPARTO":"LABORATORIO"}
    	    	 * Dove => IDEN = iden dell'esame di tab_esa, METODICA = metodica di tab_esa, URGENZA = sempre urgente tab_esa_reparto,
    	    	 * DESCR = descrizione dell'esame su tab_esa, REPARTO_DESTINAZIONE = su tab_esa_reparto,
    	    	 * DESCR_REPARTO = descrizione di centri_di_costo, COD_DEC = su centri_di_costo.
    	    	 */
    	    	// creazione option
    	    	option = document.createElement("option");
    			option.className = "optionRow";
    			option.innerHTML = aCdcDest[3]+ "\t-\t"+recPrest[i].NUMERO_POLIGRAFO+"\t-\t"+recPrest[i].DATA_RIC+"\t-\t" +aCdcDest[1] +"\t-\t" +aCdcDest[0];
    			//option.setAttribute("data-iden", recPrest[i].CODICE_ISES);
    			option.setAttribute("data-iden", aCdcDest[0]);  //  iden_esa invece di codice ises
    			option.setAttribute("data-urgenza", priorita);
    			//option.setAttribute("data-descr", recPrest[i].PRESTAZIONE);
    			option.setAttribute("data-descr", aCdcDest[1]);
    			option.setAttribute("data-metodica", aCdcDest[4]);
    			option.setAttribute("data-coddec", aCdcDest[2]);
    			option.setAttribute("data-cdc", aCdcDest[2]);
    			option.setAttribute("data-erogatore", aCdcDest[3]);
    			option.setAttribute("data-numimpegnativa",recPrest[i].NUMERO_POLIGRAFO);
    			option.setAttribute("data-dataimpegnativa",recPrest[i].DATA_RIC);
    			option.setAttribute("data-lateralita",recPrest[i].LATERALITA);
    			option.setAttribute("data-codEsenzione",recPrest[i].COD_ESENZIONE);
    			option.setAttribute("data-tipoimpegnativa",null);
    			option.setAttribute("data-urgimpegnativa",priorita);
    			option.setAttribute("data-quesito",recPrest[i].QUESITO);
    			option.setAttribute("data-codice_regionale",recPrest[i].CODICE);
    			if (aDestinatari.length>1) {
    				option.setAttribute('data-multierogatore','true');
    			}
    			else{
    				option.setAttribute('data-multierogatore','false');
    			}
    			$("#cmbRichSel").append(option);
    		} // for j

    	}
    	else{
    		aCdcDest=["","","cdc non trovato",""];
    		option = document.createElement("option");
			option.className = "optionRow";
			option.innerHTML = aCdcDest[2]+ "\t-\t"+recPrest[i].NUMERO_POLIGRAFO+"\t-\t"+recPrest[i].DATA_RIC+"\t-\t" +recPrest[i].PRESTAZIONE ;
			option.setAttribute("data-iden", recPrest[i].CODICE_ISES);
			option.setAttribute("data-urgenza", priorita);
			option.setAttribute("data-descr", recPrest[i].PRESTAZIONE);
			option.setAttribute("data-metodica", aCdcDest[3]);
			option.setAttribute("data-coddec", aCdcDest[1]);
			option.setAttribute("data-cdc", aCdcDest[1]);
			option.setAttribute("data-erogatore", aCdcDest[2]);
			option.setAttribute("data-numimpegnativa",recPrest[i].NUMERO_POLIGRAFO);
			option.setAttribute("data-dataimpegnativa",recPrest[i].DATA_RIC);
			option.setAttribute("data-lateralita",recPrest[i].LATERALITA);
			option.setAttribute("data-codEsenzione",recPrest[i].COD_ESENZIONE);
			option.setAttribute("data-tipoimpegnativa",null);
			option.setAttribute("data-urgimpegnativa",priorita);
			option.setAttribute("data-quesito",recPrest[i].QUESITO);
    		flagCdc=false;
    		$("#cmbPrestNoCdc").append(option);
    	}
    }
}
function AggiornaDataPrestDsa(){
	var procedura;
    var params = {};
	//procedura = 'ADT_AGGIORNA_DATA_PREST_DSA';
    procedura='ADT_SET_DATA_PREST_DSA';
    params = {
    		'pCodice' : $("#CODICE_DSA").val(),
    		'pIdenContatto' : $("#IDEN_CONTATTO").val()
    		};
    //alert(JSON.stringify(params));
    dwr.engine.setAsync(false);
    toolKitDB.executeProcedureDatasource(procedura,"WHALE",params,function(resp){

		if (resp.p_result=="OK") {
			home.NOTIFICA.success({message: 'update data esecuzione prestazioni', timeout: 5, title: 'Success'});
			// refresh wk prestazioni dsa
			top.$("#iScheda-1").contents().find("#li-tabPrestDSA").trigger('click');
		}else{
			logger.error(JSON.stringify(resp));
			home.NOTIFICA.error({message: "Attenzione errore in aggiornamento data di esecuzione".errorSave, title: "Error"});

		}

    });
    dwr.engine.setAsync(true);
}
