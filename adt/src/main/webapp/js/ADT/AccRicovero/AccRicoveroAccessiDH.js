var NS_ACCESSI_DH = {

		oraChiusuraDefaultDH : "14:00",
		oraChiusuraDefaultDS : "20:00",
		oraChiusuraDefaultODS : "14:00",

		wkAccessiDh : null,
        wkTrasferimentiAccesso : null,

		init: function(){

			NS_ACCESSI_DH.Setter.setButtonScheda();
			$("div#divAccessiDh").height($(".contentTabs").innerHeight() - 85);

            if (!NS_ACCESSI_DH.wkAccessiDh)   {

                NS_ACCESSI_DH.wkAccessiDh = new WK({
                    id : 'ADT_WK_ACCESSI_DH',
                    container : "divAccessiDh",
                    aBind : ["idenContatto"],
                    aVal : [$('#IDEN_CONTATTO').val()],
                    load_callback: function(){ _JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById(_IDEN_CONTATTO);},
                    loadData : true
                });

                NS_ACCESSI_DH.wkAccessiDh.loadWk();
            }
            else{
                NS_ACCESSI_DH.wkAccessiDh.loadWk();
            }

		},

		hideShowDatiPrimoAccessoDh : function(visua){

			if (!visua){
				$("#txtOraFineAccesso").val("");
	    		$("#txtDataFineAccesso").val("");
	    		NS_ACC_RICOVERO.Utils.disableField("txtDataFineAccesso");
	    		NS_ACC_RICOVERO.Utils.disableField("txtOraFineAccesso");
			}
			else
			{
				var dataFineAccesso;
				var dataFineAccessoh;
				if (!$("#txtDataRico").val()==''){
					dataFineAccesso=$("#txtDataRico").val();
					dataFineAccessoh=$("#h-txtDataRico").val();
				}
				else
				{
					dataFineAccesso=moment().format('DD/MM/YYYY');
					dataFineAccessoh=moment().format('YYYYMMDD');
				}

				NS_ACC_RICOVERO.Utils.enableField("txtDataFineAccesso");
	    		NS_ACC_RICOVERO.Utils.enableField("txtOraFineAccesso");

				var motivoDh =$("#cmbMotivoRico option:selected ").val();

				if (motivoDh === "1" || motivoDh === "2" || motivoDh === "3" || motivoDh === "4")
				{
					$("#txtDataFineAccesso").val(dataFineAccesso);
					$("#h-txtDataFineAccesso").val(dataFineAccessoh);
					$("#txtOraFineAccesso").val(NS_ACCESSI_DH.oraChiusuraDefaultDH);
				}
				else if (motivoDh === "S")
				{
					$("#txtDataFineAccesso").val(dataFineAccesso);
					$("#h-txtDataFineAccesso").val(dataFineAccessoh);
					$("#txtOraFineAccesso").val(NS_ACCESSI_DH.oraChiusuraDefaultDS);
				}
				else if (motivoDh === "O")
				{
					var dataFineAccesso1=moment(dataFineAccessoh,"YYYYMMDD").add('d',1).format('DD/MM/YYYY');
					var dataFineAccessoh1=moment(dataFineAccessoh,"YYYYMMDD").add('d',1).format('YYYYMMDD');
					$("#txtDataFineAccesso").val(dataFineAccesso1);
					$("#h-txtDataFineAccesso").val(dataFineAccessoh1);
					$("#txtOraFineAccesso").val(NS_ACCESSI_DH.oraChiusuraDefaultODS);
				}
			}
		},

		CancAccessoDh : function(rec) {

			var db = $.NS_DB.getTool({setup_default:{datasource : 'WHALE'}});

            var xhr =  db.select(
            {
                    id: 'DATI.CHECKDATICARTELLA',
                    parameter : {"NOSOLOGICO":   {t: 'V', v: _JSON_CONTATTO.codice.codice}}
            });

            xhr.done(function (data, textStatus, jqXHR) {

            	if (data.result.num == null ){
					logger.info("Cancellazione Accesso DH - CHECKDATICARTELLA = null quindi c'e' il nosologico che non corrisponde da adt a whale");
		       	}

            	if(data.result.num == null || data.result.num == 0 )
		       	{
		        	home.DIALOG.si_no({
			           	title : "Cancellazione accesso Dh",
			           	msg : "Si conferma l'operazione di ANNULLAMENTO dell'accesso Dh selezionato?",
			           	cbkNo : function(){
			           		return;
			           	},
			           	cbkSi: function(){

			           		var _json_accesso = {};

			           		for (var i = 0; i < _JSON_CONTATTO.contattiAssistenziali.length; i++)
			           		{
			           			if (_JSON_CONTATTO.contattiAssistenziali[i].id == rec.IDEN_CONTATTO_ASSISTENZIALE)
			           			{
			           				_json_accesso = _JSON_CONTATTO.contattiAssistenziali[i];
			           			}
			           		}

	        				var pAnnullaAccesso = {"contatto" : _json_accesso, "hl7Event" : "A02 Accesso Assistenziale", "notifica" : {"show" : "S", "message" : "Annullamento Accesso Avvenuto con Successo", "errorMessage" : "Errore Durante Annullamento Accesso", "timeout" : 3}, "cbkSuccess" : function(){NS_ACCESSI_DH.wkAccessiDh.refresh();}, "cbkError" : function(){}};

	        				NS_CONTATTO_METHODS.annullaAccesso(pAnnullaAccesso);
			           	}
		        	});

		       	}
		       	else
		       	{
		       		logger.error("Cancellazione Accesso DH - Impossibile Cancellare Accessocon ID " + _json_accesso.id + ". Presenti dati Clinici Associati");
		       		home.NOTIFICA.error({message: "Attenzione Presenti Dati in Cartella. Impossibile Annullare l'accesso" , timeout: 0, title: "Error"});
		       	}

            });

            xhr.fail(function (response) {
                logger.error("Cancellazione Accesso DH  - XHR Error -> " + JSON.stringify(response));
                home.NOTIFICA.error({message: "Errore nella Determinazione dell Presenza di Dati in Cartella Clinica" , timeout: 0, title: "Error"});
            });

		},

        chiudiAccessoDH : function(rec){

           logger.debug("chiudi accesso dh - rec: " + JSON.stringify(rec));

           _JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById(_JSON_CONTATTO.id);
            var accesso = _JSON_CONTATTO.getAccessoAssistenzialeFromId(rec.IDEN_CONTATTO_ASSISTENZIALE);

            var chiudi = function(){

                var oraChiusura = $("#txtOraChiusuraAccesso").val();
                var hDataChiusura =     $("#h-txtDataChiusuraAccesso").val();
                var dataFine = hDataChiusura + oraChiusura;

                //var accesso = _JSON_CONTATTO.getAccessoAssistenzialeFromId(rec.IDEN_CONTATTO_ASSISTENZIALE);
                accesso.stato = {id : null, codice : 'DISCHARGED'};
                accesso.setDataFine(dataFine);
                accesso.attivo =  false;
                accesso.codiciEsterni =  {"codice1": null, "codice2": null, "codice3": null, "contatto": null};
                var pUpsertAccesso = {"contatto" : accesso, "hl7Event" : "A02 Accesso Assistenziale", "notifica" : {"show" : "S", "message" : "Chiusura accesso DH effettuata correttamente", "errorMessage" : "Errore Durante Chiusura accesso DH", "timeout" : 3}, "cbkSuccess" : function(){$.dialog.hide(); NS_ACCESSI_DH.wkAccessiDh.refresh();}, "cbkError" : function(){}};

                NS_CONTATTO_METHODS.upsertAccesso(pUpsertAccesso);

            };

            var data_fine_moment, ora_fine, data_fine_format, data_fine;

            if(rec.DATA_FINE != '' && rec.DATA_FINE != null)
            {
                data_fine_moment = moment(rec.DATA_FINE,'DD/MM/YYYY HH:mm');
                ora_fine = data_fine_moment.format('HH:mm');
                data_fine_format = data_fine_moment.format('DD/MM/YYYY');
                data_fine =  data_fine_moment.format('YYYYMMDD');
            }
            else
            {
                ora_fine = moment().format('HH:mm');
                data_fine_format = moment().format('DD/MM/YYYY');
                data_fine = moment().format('YYYYMMDD');
            }

            var tbl = "<table border='2' style='width:450px;font-size:14px;'>";

            tbl += "<tr style='height:25px'>";
            tbl += "<td>Data Chiusura Accesso</td>" +
                "<td class='tdData' id ='tdTest'>" +
                "<input type='text' id='txtDataChiusuraAccesso' class='tdObb' />" + //DD/MM/YYYY
                "<input name='h-txtDataChiusuraAccesso' type='hidden' data-col-save='DATA_ARRIVO_PZ' id='h-txtDataChiusuraAccesso' value='' />" +    //YYYYMMDD
                "</td>";

            tbl += "<td>Ora</td><td class='tdText oracontrol w80px'><input type='text' id='txtOraChiusuraAccesso' class='tdObb'></td>";   //HH:MM
            tbl += "</tr>";

            tbl += "</table>";

            $.dialog(tbl, {
                buttons : 	[
                    {
                        label: "Annulla",
                        action: function (ctx){ $.dialog.hide(); }
                    },
                    {
                        label: "Conferma",
                        action: function (ctx) { chiudi(); }
                    }
                ],
                title : "Chiusura Accesso DH",
                height : 125,
                width : 500
            });
            var txtDataChiusuraAccesso= $('#txtDataChiusuraAccesso');
            var txtOraChiusuraAccesso = $("#txtOraChiusuraAccesso");
            txtDataChiusuraAccesso.Zebra_DatePicker({readonly_element: false, format: 'd/m/Y', view: 'month',months:(traduzione.Mesi).split(','),days:(traduzione.Giorni).split(',')});
            var dateDataMask = txtDataChiusuraAccesso.maskData({separatorIn: '/',separatorOut: '/',formatIn: 'd m Y', formatOut: 'd m Y',disabled:false});

            txtDataChiusuraAccesso.val(data_fine_format);
                $("#h-txtDataChiusuraAccesso").val(data_fine);

            txtOraChiusuraAccesso
                    .live()
                    .setMask("29:59")
                    .keypress(function() {
                        var currentMask = $(this).data('mask').mask;
                        var newMask = $(this).val().match(/^2.*/) ? "23:59" : "29:59";
                        if (newMask != currentMask) {
                            $(this).setMask(newMask);
                        }
                    }).val(ora_fine);




            txtDataChiusuraAccesso.on("change blur",function(){
                var oraChiusuraAccesso =  $("#txtOraChiusuraAccesso");
                var hTxtDataChiusuraAccesso = $("#h-txtDataChiusuraAccesso");
                var TxtDataChiusuraAccesso = $("#txtDataChiusuraAccesso");
                if(hTxtDataChiusuraAccesso.val() != '' && oraChiusuraAccesso.val() != '' ){
                    try {
                        accesso.setDataFine(hTxtDataChiusuraAccesso.val()+oraChiusuraAccesso.val());
                    }catch(e){
                        TxtDataChiusuraAccesso.val("");
                        hTxtDataChiusuraAccesso.val("");
                        oraChiusuraAccesso.val("");
                        logger.error(e.code  + ' - '+ e.message );
                        home.NOTIFICA.error({ title: "Attenzione", message: e.message, timeout : 0});
                    }
                }


            });
            txtOraChiusuraAccesso.on("change blur",function(){
                var oraChiusuraAccesso =  $("#txtOraChiusuraAccesso");
                var hTxtDataChiusuraAccesso = $("#h-txtDataChiusuraAccesso");
                var TxtDataChiusuraAccesso = $("#txtDataChiusuraAccesso");

                if(hTxtDataChiusuraAccesso.val() != '' && oraChiusuraAccesso.val() != '' ){
                    try {
                        accesso.setDataFine(hTxtDataChiusuraAccesso.val()+oraChiusuraAccesso.val());
                    }catch(e){
                        /*TxtDataChiusuraAccesso.val("");
                        hTxtDataChiusuraAccesso.val("");*/
                        oraChiusuraAccesso.val("");
                        logger.error(e.code  + ' - '+ e.message );
                        home.NOTIFICA.error({ title: "Attenzione", message: e.message, timeout : 0});
                    }
                }
            });

        },


        caricaWKTrasferimentiAccesso : function(rec){

            var w = $.managerWhere();
            w.set('',
                new Array("IDEN_CONTATTO","IDEN_PARENT"),
                new Array(rec.IDEN_CONTATTO.toString(),rec.IDEN_CONTATTO_ASSISTENZIALE.toString())
            );
            return w;
        },

        cancellaTrasferimentoODS : function(rec){
            home.DIALOG.si_no({
                title : "Cancellazione Trasferimento ODS",
                msg : "Si conferma l'operazione di ANNULLAMENTO del trasferimento ODS selezionato?",
                cbkNo : function(){
                    return;
                },
                cbkSi: function(){

                    var _json_accesso = {};

                    for (var i = 0; i < _JSON_CONTATTO.contattiAssistenziali.length; i++)
                    {
                        if (_JSON_CONTATTO.contattiAssistenziali[i].id == rec.IDEN_CONTATTO_ASSISTENZIALE)
                        {
                            _json_accesso = _JSON_CONTATTO.contattiAssistenziali[i];
                        }
                    }

                    var pAnnullaAccesso = {"contatto" : _json_accesso, "hl7Event" : "A02 Trasferimento ODS", "notifica" : {"show" : "S", "message" : "Annullamento Trasferimento ODS Avvenuto con Successo", "errorMessage" : "Errore Durante Annullamento Trasferimento ODS", "timeout" : 3}, "cbkSuccess" : function(){NS_ACCESSI_DH.wkAccessiDh.refresh();}, "cbkError" : function(){}};

                    NS_CONTATTO_METHODS.annullaAccesso(pAnnullaAccesso);
                }
            });
        },

		Setter : {

			setButtonScheda : function() {
                $(".butChiudi").show();


	   	 		if (!(_STATO_PAGINA === 'L')) {
	   	 			$(".butSalva").show();
	   	 		}
			}

		}

};