var NS_REPARTI =
{
	Giuridici : {

		/**
    	 * Valorizza la combo dei reparti giuridici in base al Regime Selezionato.
    	 * Tutto questo tramite l'esecuzione di query differenti in base al regime (ORD, DH, ALL).
    	 */

		setReparto : function(r, cbk) {

			var regimeSelezionato = typeof r == 'undefined' ? $("#cmbRegime").val() : r;
			var regimeQuery ='ALL';

			regimeQuery = regimeSelezionato == NS_REGIME_TIPO_MOTIVO_RICOVERO.regimeOrdinario ? "ORD" : regimeQuery;
			regimeQuery = regimeSelezionato == NS_REGIME_TIPO_MOTIVO_RICOVERO.regimeDH ? "DH" : regimeQuery;

			var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

            var xhr =  db.select(
            {
                    id: "ADT.Q_REPARTI_PERSONALE_" + regimeQuery,
                    parameter : {
                    	"webuser":   {t: 'V', v: home.baseUser.USERNAME},
                    	"idenPer":   {t: 'V', v: ""}
                    }
            });

            xhr.done(function (data, textStatus, jqXHR) {
				//salvo il vecchio reparto in una variabile nel caso serva successivamente
                var $cmbReparto = $("#cmbRepartoRico");
				var reparto = $cmbReparto.find("option:selected").attr("data-value");
				var $cmbRepartoAss = $("#cmbRepartoAss");
				var repartoAss = $cmbRepartoAss.find("option:selected").attr("data-value");

				$cmbReparto.empty();
				$cmbReparto.append("<option value=''></option>");

				for(var i=0; i< data.result.length; i++)
				{
					$cmbReparto.append("<option data-sub_codice_struttura='" + data.result[i].SUB_CODICE_STRUTTURA +
							"' data-value='"+data.result[i].VALUE+"' data-descr='"+data.result[i].DESCR+
							"' data-codice_struttura='"+data.result[i].CODICE_STRUTTURA+
							"' data-abilita_ordinario='"+data.result[i].ABILITA_ORDINARIO+
							"' data-abilita_day_hospital='"+data.result[i].ABILITA_DAY_HOSPITAL+
							"' data-iden_cdc='" + data.result[i].IDEN_CDC+
							"' value='"+data.result[i].VALUE+"' id='cmbRepartoRico_"+data.result[i].VALUE+"'>"
							+ data.result[i].DESCR+"</option>");
				}

				//se è proveniente da lista attesa bisogna rivalorizzare i vecchi reparti che c'erano
				if (typeof $('#IDEN_LISTA').val() != 'undefined') {

					$cmbReparto.find("option[data-value=\""+reparto+"\"]").attr("selected","selected");
					$cmbRepartoAss.find("option:first-child").attr("selected","selected");

					if($cmbReparto.val() !== ''){
						$cmbRepartoAss.find("option[data-value=\""+repartoAss+"\"]").attr("selected","selected");
					}
				}else{
					$cmbRepartoAss.empty();
				}

	            if (typeof cbk === "function"){
	            	cbk();
	            }

            });

            xhr.fail(function (response) {
                logger.error("Valorizzazione Dinamica Reparti - Errore XHR -> " + JSON.stringify(response));
                home.NOTIFICA.error({ title: "Attenzione", message: 'Errore nella Valorizzazione Dinamica dei Reparti' });
            });

		},

		/**
		 * In fase di Caricamento valorizza la combo con il reparto salvato.
		 * Serve per valorizzare il reparto di accettazione anche se il contatto ha subito trasferimenti.
		 * Se il reparto di accettazione non e' tra quelli dell'utente viene caricato dinamicamente e disabilitati tutti i campi.
		 */

		loadReparto : function(idProv, cbk) {

			var flgok = false;
			var a = $("#cmbRepartoRico > option");

			for (var i=0; i < a.length; i++)
			{
				if (a[i].value==idProv)
				{
					$("#cmbRepartoRico").val(idProv);
					flgok = true;
				}
			}

			if (!flgok)
			{
				var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

	            var xhr =  db.select(
	            {
	                    id: "ADT.Q_REPARTO",
	                    parameter : {
	                    	"idenProvenienza":   {t: 'N', v: idProv}
	                    }
	            });

	            xhr.done(function (data, textStatus, jqXHR) {

	            	for(var i=0; i<data.result.length; i++)
					{
						$("#cmbRepartoRico").append("<option data-sub_codice_struttura='" + data.result[i].SUB_CODICE_STRUTTURA +
								"' data-value='" + data.result[i].VALUE+"' data-descr='" + data.result[i].DESCR +
								"' data-codice_struttura='" + data.result[i].CODICE_STRUTTURA +
								"' data-abilita_ordinario='" + data.result[i].ABILITA_ORDINARIO +
								"' data-abilita_day_hospital='" + data.result[i].ABILITA_DAY_HOSPITAL +
								"' data-iden_cdc='" + data.result[i].IDEN_CDC +
								"' value='" + data.result[i].VALUE + "' id='cmbRepartoRico_" + data.result[i].VALUE + "'>" + data.result[i].DESCR+"</option>"
							);
					}

	            	$("#cmbRepartoRico").val(idProv);

					// Disabilito i Dati del Ricovero Iniziale
					logger.debug("NS_REPARTI.Giuridici.loadReparto - Non Trovato Reparto con ID_PROVENIENZA = " + idProv + " - Procedo DISABILITANDO Tutto! (Probabile Paziente Trasferito da altro reparto)");
					NS_ACC_RICOVERO.Utils.DisableDatiRicovero();

					if (typeof cbk === "function"){
		            	cbk();
		            }

	            });

	            xhr.fail(function (response) {
	                logger.error("Valorizzazione Dinamica Reparti - Errore XHR -> " + JSON.stringify(response));
	                home.NOTIFICA.error({title: "Error", message: 'Errore nella Valorizzazione Dinamica del Reparto Giuridico' });
	            });

			}
			else
			{
				if (typeof cbk === "function"){
	            	cbk();
	            }
			}
		}
	},

	Assistenziali : {

		/**
		 * Funzione che valorizza la COMBO dei reparti Assistenziali in base al sub-codice-struttura del reparto Giuridico
		 */

		setReparto : function(){

			// Recupero il Sub-Codice della Struttura del reparto giuridico per filtrare i reparti assistenziali
			var CodiceStruttura = $("#cmbRepartoRico option:selected").attr('data-codice_struttura');
			NS_REPARTI.Assistenziali.loadReparti(CodiceStruttura, function(){

				// Di default viene impostato il reparto assistenziale Uguale al giuridico
				$("#cmbRepartoAss").val($("#cmbRepartoRico").val());

				var abilita_ord = $("#cmbRepartoRico option:selected").attr('data-abilita_ordinario');
	            // var abilitaOridnarioBoolean = abilita_ord=='S';

	            // $("#cmbRegime").val(abilitaOridnarioBoolean ? NS_REGIME_TIPO_MOTIVO_RICOVERO.regimeOrdinario : NS_REGIME_TIPO_MOTIVO_RICOVERO.regimeDH);

	            // NS_REGIME_TIPO_MOTIVO_RICOVERO.setTipoMotivoFromRegime(abilitaOridnarioBoolean ? NS_REGIME_TIPO_MOTIVO_RICOVERO.regimeOrdinario : NS_REGIME_TIPO_MOTIVO_RICOVERO.regimeDH);
			});

		},

		/**
		 * Valorizza COMBO reparti Assistenziali in base a sub-codice-struttura del reparto GIURIDICO.
		 * La funzione Valorizza le option della COMBO.
		 * Ne imposta il valore solo se _STATO_PAGINA = E || _STATO_PAGINA = L.
		 */

		loadReparti : function(CodiceStruttura, cbk) {

			var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

            var xhr =  db.select(
            {
                    id: "ADT.Q_REPARTI_ASSISTENZIALI",
                    parameter : {
                    	"CodiceStruttura":   {t: 'V', v: CodiceStruttura}
                    }
            });

            xhr.done(function (data, textStatus, jqXHR) {

            	$("#cmbRepartoAss").empty();
				$("#cmbRepartoAss").append("<option value=''></option>");

				for(var i=0; i < data.result.length; i++)
				{
					$("#cmbRepartoAss").append("<option data-sub_codice_struttura='" + data.result[i].SUB_CODICE_STRUTTURA +
							"' data-value='" + data.result[i].VALUE + "' data-descr='" + data.result[i].DESCR +
							"' data-codice_struttura='" + data.result[i].CODICE_STRUTTURA +
							"' value='" + data.result[i].VALUE + "' id='cmbRepartoAss_" + data.result[i].VALUE + "'>" + data.result[i].DESCR+"</option>"
						);
				}

				if (_STATO_PAGINA !== "I") {
					$("select[name='cmbRepartoAss']").val(_JSON_CONTATTO.contattiAssistenziali[0].provenienza.id);
				}

				if (typeof cbk === "function"){
	            	cbk();
	            }

            });

            xhr.fail(function (response) {
                logger.error("Valorizzazione Dinamica Combo Reparti Assistenziali - Errore XHR -> " + JSON.stringify(response));
                home.NOTIFICA.error({title: "Error", message: 'Errore nella Valorizzazione Dinamica del combo dei Reparti Assistenziali' });
            });

		}
	}

};