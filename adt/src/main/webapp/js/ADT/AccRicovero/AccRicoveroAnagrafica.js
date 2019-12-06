/*
 *  modulo gestione anagrafica in accettazione ricovero per legare i dati anagrafici al contatto
 *  autore: graziav
 *  data: 16/03/2015
 */
/* global _JSON_ANAGRAFICA */

var _STATO_PAGINA;
var _IDEN_ANAG;
var _PAZ_SCONOSCIUTO=false;

var NS_ACC_RICOVERO_ANAGRAFICA={

		cittadinanza:null,

		init:function(){


			_STATO_PAGINA = $('#STATO_PAGINA').val();
			_IDEN_ANAG=$("#IDEN_ANAG").val();
			NS_ACC_RICOVERO_ANAGRAFICA.getDatiComuni();
			NS_FENIX_SCHEDA.addFieldsValidator({config:"V_ADT_ACC_RICOVERO_ANAG"});
			if (_STATO_PAGINA=='I'){
				// carico i dati da _JSON_ANAGRAFICA
				NS_ACC_RICOVERO_ANAGRAFICA.getAnagrafica();
				NS_ACC_RICOVERO_ANAGRAFICA.gestPazSconosciuto();
				if (_PAZ_SCONOSCIUTO == false){


	            	if (!NS_FENIX_SCHEDA.validateFields()) {
	            		$('#tabs-ACC_RICOVERO').find('li[data-tab="tabAnagrafica"]').trigger('click');
	    	        }
	            	else{
	            		NS_FENIX_SCHEDA.addFieldsValidator({config:"V_ADT_ACC_RICOVERO"});
	            	}
				}
				else{ // paziente sconosciuto
					//$("#txtAnagCognome").trigger('change'); // disabilita i campi anagrafici obbligatori
					NS_FENIX_SCHEDA.addFieldsValidator({config:"V_ADT_ACC_RICOVERO"});
					V_ADT_ACC_RICOVERO.elements.txtLuogoNasc.status='';
					V_ADT_ACC_RICOVERO.elements['h-txtLuogoNasc'].status='';
					V_ADT_ACC_RICOVERO.elements.txtStatoCivile.status='';
					V_ADT_ACC_RICOVERO.elements['h-txtStatoCivile'].status='';
					V_ADT_ACC_RICOVERO.elements.txtTitoloStudio.status='';
					V_ADT_ACC_RICOVERO.elements['h-txtTitoloStudio'].status='';
					V_ADT_ACC_RICOVERO.elements.txtComuneRes.status='';
					V_ADT_ACC_RICOVERO.elements['h-txtComuneRes'].status='';
					V_ADT_ACC_RICOVERO.elements.txtIndRes.status='';
					V_ADT_ACC_RICOVERO.elements.txtCAPRes.status='';
					V_ADT_ACC_RICOVERO.elements.txtCodiceRegioneRes.status='';
					V_ADT_ACC_RICOVERO.elements.txtASLResidenza.status='';
					V_ADT_ACC_RICOVERO.elements['h-txtASLResidenza'].status='';
					V_ADT_ACC_RICOVERO.elements.txtCitt0.status='';
					V_ADT_ACC_RICOVERO.elements['h-txtCitt0'].status='';
					NS_FENIX_SCHEDA.addFieldsValidator({config:"V_ADT_ACC_RICOVERO"});
				}
			}
			else{
				// carico i dati anagrafici dai metadati del contatto
				if (_JSON_CONTATTO.mapMetadatiString['ANAG_COGNOME'] != undefined){
					NS_ACC_RICOVERO_ANAGRAFICA.getMetadatiAnag();
				}
				else{
					// carico i dati da _JSON_ANAGRAFICA
					NS_ACC_RICOVERO_ANAGRAFICA.getAnagrafica();
				}
				NS_ACC_RICOVERO_ANAGRAFICA.gestPazSconosciuto();
			}

			NS_ACC_RICOVERO_ANAGRAFICA.getPinAAC(); // se anagrafica pinnata, i 6 dati fondamentali sono bloccati
			NS_ACC_RICOVERO_ANAGRAFICA.hideCodSTP($("#h-radSTP").val());
			NS_ACC_RICOVERO_ANAGRAFICA.hideCodENI($("#h-radENI").val());
			NS_ACC_RICOVERO_ANAGRAFICA.hideCodGIU($("#h-radGIU").val());
			NS_ACC_RICOVERO_ANAGRAFICA.events();
			NS_SCHEDA.resetAllButton();
			NS_ACC_RICOVERO_ANAGRAFICA.Setter.setButtonScheda();
		},
		Setter :  {
	   	 	setButtonScheda : function() {

				$(".butChiudi").show();

	   	 		if (!("IT" == NS_ACC_RICOVERO_ANAGRAFICA.cittadinanza ||NS_ACC_RICOVERO_ANAGRAFICA.cittadinanza =="" || NS_ACC_RICOVERO_ANAGRAFICA.cittadinanza ==null )){
	   	 			$('.butStampaSTP, .butStampaENI, .butStampaTesseraENI').show();
	   	 		}
	   	 	}
		},

		getCittadinanza:function(codice,i){
			//da fare sparire prima o poi
			var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});

            var xhr =  db.select(
            {
                    id: "SDJ.Q_CITTADINANZA",
                    parameter : {"idCittadinanza":   {t: 'N', v: codice}}
            });
            xhr.done(function (data, textStatus, jqXHR) {
            	if (data.result.length>0){
            		$("#txtCitt"+i).val(data.result[0].DESCR).attr({
                        "data-c-value":data.result[0].IDEN,
                        "data-c-descr":data.result[0].DESCR,
                        "data-c-cod":data.result[0].COD
                    });
                    $("#h-txtCitt"+i).val(data.result[0].IDEN);
                    NS_ACC_RICOVERO_ANAGRAFICA.cittadinanza=data.result[0].COD;
                    if ("IT" == NS_ACC_RICOVERO_ANAGRAFICA.cittadinanza){
    	   	 			$('.butStampaSTP, .butStampaENI, .butStampaTesseraENI').hide();
    	   	 		}
                    else{
                    	$('.butStampaSTP, .butStampaENI, .butStampaTesseraENI').show();
                    }
            	}
            });

		},
		hideCittadinanzaInit:function(){

			var bool = false;
			$(".AUTOCOMPLETECITTADINANZA").each(function(i){
				var td = $(this);
				var tr = td.closest("tr");
				var value = td.find('input[type="text"]').val();
				if(i != 0 && bool){
					tr.hide();
				}else if(value == '' && i != 0){
					bool = true;
					tr.hide();
				}else {
					tr.show();

				}
			});
		},
		getPinAAC:function(){

			if (jsonData.PINAAC != '' ) { // anagrafica pinnata
				// blocco dati sensibili se ricovero aperto oppure chiuso ed utente non backoffice
				if ( _JSON_CONTATTO.stato.codice == 'ADMITTED' || (_JSON_CONTATTO.stato.codice == 'DISCHARGED' && !home.basePermission.hasOwnProperty('BACKOFFICE')) ){
					$("#txtAnagCognome").attr("disabled","disabled");
					$("#txtAnagNome").attr("disabled","disabled");
					$("#txtAnagDataNasc").attr("disabled","disabled");
					$("#radAnagSesso").data("RadioBox").disable();
					$("#txtLuogoNasc").attr("disabled","disabled");
					$("#txtAnagCodFisc").attr("disabled","disabled");
				}
			}


		},
		gestPazSconosciuto:function(){
			var cogn  = $("#txtAnagCognome");
			if (cogn.val()=='SCONOSCIUTO'){
				// blocca campi anagrafici minimi
				cogn.attr("disabled","disabled");
				$("#txtAnagNome").attr("disabled","disabled");
				$("#txtAnagDataNasc").attr("disabled","disabled");
				$("#radAnagSesso").data("RadioBox").disable();
				$("#txtLuogoNasc").attr("disabled","disabled");
				$("#txtAnagCodFisc").attr("disabled","disabled");
				_PAZ_SCONOSCIUTO=true;
			}
		},
		getAnagrafica:function(){
			logger.debug('NS_ACC_RICOVERO_ANAGRAFICA.getAnagrafica : carico i dati da anagrafica');
			// carico i dati da _JSON_ANAGRAFICA
			$("#txtAnagCognome").val(_JSON_ANAGRAFICA.cognome);
			$("#txtAnagNome").val(_JSON_ANAGRAFICA.nome);
			$("#h-radAnagSesso").val(_JSON_ANAGRAFICA.sesso);
			$("#radAnagSesso").data("RadioBox").selectByValue(_JSON_ANAGRAFICA.sesso);
			$("#txtAnagCodFisc").val(_JSON_ANAGRAFICA.codiceFiscale);
			$('#txtLuogoNasc').val(_JSON_ANAGRAFICA.comuneNascita.descrizione).attr({
                'data-c-descr':_JSON_ANAGRAFICA.comuneNascita.descrizione,
			    'data-c-cap':_JSON_ANAGRAFICA.comuneNascita.cap,
			    'data-c-value':_JSON_ANAGRAFICA.comuneNascita.id,
			    'data-c-codice_regione':_JSON_ANAGRAFICA.comuneNascita.regione.codice,
			    'data-c-codice_usl':_JSON_ANAGRAFICA.comuneNascita.asl.codice,
			    'data-c-codice_comune':_JSON_ANAGRAFICA.comuneNascita.codice,
			    'data-c-provincia':_JSON_ANAGRAFICA.comuneNascita.provincia.codice
            });
			$('#h-txtLuogoNasc').val(_JSON_ANAGRAFICA.comuneNascita.id);
			$("#h-txtAnagDataNasc").val(_JSON_ANAGRAFICA.dataNascita.substr(0,8));
			$("#txtAnagDataNasc").val(_JSON_ANAGRAFICA.dataNascita.substr(6,2)+'/'+_JSON_ANAGRAFICA.dataNascita.substr(4,2)+'/'+_JSON_ANAGRAFICA.dataNascita.substr(0,4));
			if (_JSON_ANAGRAFICA.stp.codice!=null){
				$("#radSTP").data("RadioBox").selectByValue('S');
				$("#txtCodSTP").val(_JSON_ANAGRAFICA.stp.codice);
				$("#txtScadCodSTP").val(_JSON_ANAGRAFICA.stp.dataScadenza.substr(6,2)+'/'+_JSON_ANAGRAFICA.stp.dataScadenza.substr(4,2)+'/'+_JSON_ANAGRAFICA.stp.dataScadenza.substr(0,4));
				$("#h-txtScadCodSTP").val(_JSON_ANAGRAFICA.stp.dataScadenza.substr(0,8));
			}

			if (_JSON_ANAGRAFICA.eni.codice!=null){
				$("#radENI").data("RadioBox").selectByValue('S');
				$("#txtCodENI").val(_JSON_ANAGRAFICA.eni.codice);
				$("#txtScadCodENI").val(_JSON_ANAGRAFICA.eni.dataScadenza.substr(6,2)+'/'+_JSON_ANAGRAFICA.eni.dataScadenza.substr(4,2)+'/'+_JSON_ANAGRAFICA.eni.dataScadenza.substr(0,4));
				$("#h-txtScadCodENI").val(_JSON_ANAGRAFICA.eni.dataScadenza.substr(0,8));
			}

			if (_JSON_ANAGRAFICA.tesseraSanitaria!=undefined){
				$("#txtTessera").val(_JSON_ANAGRAFICA.tesseraSanitaria);
			}
			if (_JSON_ANAGRAFICA.tesseraSanitariaScadenza!=undefined){
				$("#h-txtScadenzaTessera").val(_JSON_ANAGRAFICA.tesseraSanitariaScadenza.substr(0,8));
				$("#txtScadenzaTessera").val(_JSON_ANAGRAFICA.tesseraSanitariaScadenza.substr(6,2)+'/'+_JSON_ANAGRAFICA.tesseraSanitariaScadenza.substr(4,2)+'/'+_JSON_ANAGRAFICA.tesseraSanitariaScadenza.substr(0,4))
			}
			// cittadinanza
			if (_JSON_ANAGRAFICA.cittadinanze.length>0){
				for (var i=0; i<_JSON_ANAGRAFICA.cittadinanze.length; i++){
					$("#txtCitt"+i).val(_JSON_ANAGRAFICA.cittadinanze[i].id);
					$("#h-txtCitt"+i).val(_JSON_ANAGRAFICA.cittadinanze[i].id);
					NS_ACC_RICOVERO_ANAGRAFICA.getCittadinanza(_JSON_ANAGRAFICA.cittadinanze[i].id,i);
				}
			}
			else{ // prendo la nazionalita'
				if (_JSON_ANAGRAFICA.nazionalita.id!=null && _JSON_ANAGRAFICA.nazionalita.id>0){
					$("#h-txtCitt0").val(_JSON_ANAGRAFICA.nazionalita.id);

					$("#txtCitt0").val(jsonData.NAZIONE_DESCR).attr({
						"data-c-value":_JSON_ANAGRAFICA.nazionalita.id,
						"data-c-descr":jsonData.NAZIONE_DESCR,
						"data-c-cod":jsonData.NAZIONE_COD
					});
				}
			}

			NS_ACC_RICOVERO_ANAGRAFICA.hideCittadinanzaInit();
			$("#txtTelRes").val(_JSON_ANAGRAFICA.telefono);

			var datiRes=_JSON_ANAGRAFICA.comuneResidenza;
            if (datiRes.id!=null) {
            	$("#txtComuneRes").attr({
                    "data-c-value":datiRes.id,
                    "data-c-codice_regione":datiRes.regione.codice,
                    "data-c-codice_usl":datiRes.asl.codice,
                    "data-c-descr":datiRes.descrizione,
                    "data-c-cap":datiRes.cap
                })
                .val(datiRes.descrizione);
            	$("#h-txtComuneRes").val(datiRes.id);
            	$("#txtProvRes").val(datiRes.provincia.codice);
            }
        	$("#txtIndRes").val(datiRes.indirizzo);
        	$("#txtCAPRes").val(datiRes.cap);
        	$("#txtCodiceRegioneRes").val(datiRes.regione.codice);
        	$("#txtASLResidenza").attr("data-c-value",datiRes.asl.codice).val(datiRes.asl.descrizione);
        	$("#h-txtASLResidenza").val(datiRes.asl.codice);

		},
		getMetadatiAnag:function(){
			logger.debug('NS_ACC_RICOVERO_ANAGRAFICA.getMetadatiAnagrafica: carico dati anagrafici dai metadati di contatti');
			$("#txtAnagCognome").val(_JSON_CONTATTO.mapMetadatiString['ANAG_COGNOME']);
			$("#txtAnagNome").val(_JSON_CONTATTO.mapMetadatiString['ANAG_NOME']);
			$("#h-radAnagSesso").val(_JSON_CONTATTO.mapMetadatiString['ANAG_SESSO']);
			$("#radAnagSesso").data("RadioBox").selectByValue(_JSON_CONTATTO.mapMetadatiString['ANAG_SESSO']);
			$("#txtAnagCodFisc").val(_JSON_CONTATTO.mapMetadatiString['ANAG_COD_FISC']);

			$('#txtLuogoNasc').attr({
                'data-c-value':_JSON_CONTATTO.mapMetadatiString['ANAG_COMUNE_NASC'],
			    'data-c-codice_comune':_JSON_CONTATTO.mapMetadatiString['ANAG_COMUNE_NASC']
            }).val(jsonData.COMUNE_NASCITA);
			$('#h-txtLuogoNasc').val(_JSON_CONTATTO.mapMetadatiString['ANAG_COMUNE_NASC']);
			$("#h-txtAnagDataNasc").val(_JSON_CONTATTO.mapMetadatiString['ANAG_DATA_NASCITA']);
			$("#txtAnagDataNasc").val(_JSON_CONTATTO.mapMetadatiString['ANAG_DATA_NASCITA'].substr(6,2)+'/'+_JSON_CONTATTO.mapMetadatiString['ANAG_DATA_NASCITA'].substr(4,2)+'/'+_JSON_CONTATTO.mapMetadatiString['ANAG_DATA_NASCITA'].substr(0,4));

			if (_JSON_CONTATTO.mapMetadatiString['GIUBILEO']!= undefined && _JSON_CONTATTO.mapMetadatiString['GIUBILEO']!=''  && _JSON_CONTATTO.mapMetadatiString['SCADENZA_GIUBILEO']!=''  && _JSON_CONTATTO.mapMetadatiString['SCADENZA_GIUBILEO']!=undefined){
				$("#radGIU").data("RadioBox").selectByValue('S');
				$("#txtCodGIU").val(_JSON_CONTATTO.mapMetadatiString['GIUBILEO']);
				$("#txtScadCodGIU").val(_JSON_CONTATTO.mapMetadatiString['SCADENZA_GIUBILEO']);
				$("#h-txtScadCodGIU").val(moment(_JSON_CONTATTO.mapMetadatiString['SCADENZA_GIUBILEO'],'DD/MM/YYYY').format('YYYYMMDD'));
			}

			if (_JSON_CONTATTO.mapMetadatiString['STP']!=undefined && _JSON_CONTATTO.mapMetadatiString['STP']!=''){
				$("#radSTP").data("RadioBox").selectByValue('S');
				$("#txtCodSTP").val(_JSON_CONTATTO.mapMetadatiString['STP']);
			}
			if ( _JSON_CONTATTO.mapMetadatiString['SCADENZA_STP']!=undefined && _JSON_CONTATTO.mapMetadatiString['SCADENZA_STP']!=''){
				$("#txtScadCodSTP").val(_JSON_CONTATTO.mapMetadatiString['SCADENZA_STP']);
				$("#h-txtScadCodSTP").val(moment(_JSON_CONTATTO.mapMetadatiString['SCADENZA_STP'],'DD/MM/YYYY').format('YYYYMMDD'));
			}
			if (_JSON_CONTATTO.mapMetadatiString['ENI']!=undefined && _JSON_CONTATTO.mapMetadatiString['ENI']!=''){
				$("#radENI").data("RadioBox").selectByValue('S');
				$("#txtCodENI").val(_JSON_CONTATTO.mapMetadatiString['ENI']);
			}
			if (_JSON_CONTATTO.mapMetadatiString['SCADENZA_ENI']!=undefined && _JSON_CONTATTO.mapMetadatiString['SCADENZA_ENI']!=''){
				$("#txtScadCodENI").val(_JSON_CONTATTO.mapMetadatiString['SCADENZA_ENI']);
				$("#h-txtScadCodENI").val(moment(_JSON_CONTATTO.mapMetadatiString['SCADENZA_ENI'],'DD/MM/YYYY').format('YYYYMMDD'));
			}
			if (_JSON_CONTATTO.mapMetadatiString['ANAG_TESSERA_SANITARIA']!=''){
				$("#txtTessera").val(_JSON_CONTATTO.mapMetadatiString['ANAG_TESSERA_SANITARIA']);
			}
			if (_JSON_CONTATTO.mapMetadatiString['ANAG_TESSERA_SANITARIA_SCADENZA']!=undefined && _JSON_CONTATTO.mapMetadatiString['ANAG_TESSERA_SANITARIA_SCADENZA']!=''){
				$("#h-txtScadenzaTessera").val(_JSON_CONTATTO.mapMetadatiString['ANAG_TESSERA_SANITARIA_SCADENZA']);
				$("#txtScadenzaTessera").val(_JSON_CONTATTO.mapMetadatiString['ANAG_TESSERA_SANITARIA_SCADENZA'].substr(6,2)+'/'+_JSON_CONTATTO.mapMetadatiString['ANAG_TESSERA_SANITARIA_SCADENZA'].substr(4,2)+'/'+_JSON_CONTATTO.mapMetadatiString['ANAG_TESSERA_SANITARIA_SCADENZA'].substr(0,4))
			}
			// nazionalita'
			if (_JSON_CONTATTO.mapMetadatiString['ANAG_CITTADINANZA_ID']!=''){

				$("#txtCitt0").val(jsonData.NAZIONE_DESCR).attr({
					"data-c-value":_JSON_CONTATTO.mapMetadatiString['ANAG_CITTADINANZA_ID'],
					"data-c-descr":jsonData.NAZIONE_DESCR,
					"data-c-cod":jsonData.NAZIONE_COD
				});
				$("#h-txtCitt0").val(_JSON_CONTATTO.mapMetadatiString['ANAG_CITTADINANZA_ID']);
				if ("IT" == jsonData.NAZIONE_COD){
					$('.butStampaSTP, .butStampaENI, .butStampaTesseraENI').hide();
				}
				else{
					$('.butStampaSTP, .butStampaENI, .butStampaTesseraENI').show();
				}

			}
			NS_ACC_RICOVERO_ANAGRAFICA.hideCittadinanzaInit();
			$("#txtTelRes").val(_JSON_CONTATTO.mapMetadatiString['ANAG_TELEFONO']);
        	$("#txtComuneRes").attr({
                "data-c-value":_JSON_CONTATTO.mapMetadatiString['ANAG_RES_CODICE_ISTAT'],
                "data-c-codice_regione":_JSON_CONTATTO.mapMetadatiString['ANAG_RES_REGIONE'],
                "data-c-codice_usl":_JSON_CONTATTO.mapMetadatiString['ANAG_RES_ASL'],
                "data-c-cap":_JSON_CONTATTO.mapMetadatiString['ANAG_RES_CAP']
            }).val(jsonData.COMUNE_RESIDENZA);
        	$("#h-txtComuneRes").val(_JSON_CONTATTO.mapMetadatiString['ANAG_RES_CODICE_ISTAT']);
        	$("#txtIndRes").val(_JSON_CONTATTO.mapMetadatiString['ANAG_RES_INDIRIZZO']);
			$("#txtCAPRes").val(_JSON_CONTATTO.mapMetadatiString['ANAG_RES_CAP']);
        	$("#txtProvRes").val(_JSON_CONTATTO.mapMetadatiString['ANAG_RES_PROV'] );
        	$("#txtCodiceRegioneRes").val(_JSON_CONTATTO.mapMetadatiString['ANAG_RES_REGIONE']);
        	$("#txtASLResidenza").attr("data-c-value",_JSON_CONTATTO.mapMetadatiString['ANAG_RES_ASL']).val(jsonData.ASL_RESIDENZA_DESCR);
        	$("#h-txtASLResidenza").val(_JSON_CONTATTO.mapMetadatiString['ANAG_RES_ASL']);
		},
	/**
	 * nel file di data vengono caricate 2 query, in ogni caso i campi valorizzati sono gli stessi quindi qui verrano messi i campi che vengono valorizzati in ogni caso nello stesso modo
	 * */
		getDatiComuni : function () {

		if (jsonData.STATO_CIVILE != null && jsonData.STATO_CIVILE != '' && jsonData.IDEN_STATO_CIVILE != ''){
			//if (_JSON_ANAGRAFICA.statoCivile.id>6) {
			$("#txtStatoCivile").val(jsonData.STATO_CIVILE).attr({"data-c-descr":jsonData.STATO_CIVILE,"data-c-value":jsonData.IDEN_STATO_CIVILE });
			$("#h-txtStatoCivile").val(jsonData.IDEN_STATO_CIVILE);
			//}
		}

		if (jsonData.IDEN_LIVELLO_ISTRUZIONE != null && jsonData.DESCR_ISTRUZIONE != null && jsonData.IDEN_LIVELLO_ISTRUZIONE != '' && jsonData.DESCR_ISTRUZIONE != '' ){
			//if (_JSON_ANAGRAFICA.titoloStudio.id>5){
			$("#h-txtTitoloStudio").val(jsonData.IDEN_LIVELLO_ISTRUZIONE);
			$("#txtTitoloStudio").val(jsonData.DESCR_ISTRUZIONE).attr({"data-c-descr":jsonData.DESCR_ISTRUZIONE,"data-c-value":jsonData.IDEN_LIVELLO_ISTRUZIONE});
			//}
		}

		},
		valorizeCapRegioneProvinciaResidenza:function(data,flgDaAC){
			//aggiungo il .trigger("change") perchè il validator se lo valorizzi così nn vede il change
			if (flgDaAC) { // da Autocomplete
				$("#txtCAPRes").val(data.CAP).trigger("change");
				$("#txtProvRes").val(data.PROVINCIA).trigger("change");
				$("#txtCodiceRegioneRes").val(data.CODICE_REGIONE).trigger("change");
				if (data.CODICE_USL==null){
					$("#txtASLResidenza").attr("data-c-value",'').val('');
				}
				else{
					$("#txtASLResidenza").val(data.ASL_DESCR).attr("data-c-value",data.CODICE_USL).trigger("change");
					$("#h-txtASLResidenza").val(data.CODICE_USL).trigger("change");
				}
			}
			else{ // da metadati
				$("#txtComuneRes").val(data.DESCRIZIONE).attr("data-c-descr",data.DESCRIZIONE);
			}
		},

		setMetadatiAnagrafica:function(_json){
			_json.mapMetadatiString['ANAG_COGNOME'] = $("#txtAnagCognome").val();
			_json.mapMetadatiString['ANAG_NOME'] = $("#txtAnagNome").val();
			_json.mapMetadatiString['ANAG_SESSO'] = $("#h-radAnagSesso").val();
			_json.mapMetadatiString['ANAG_DATA_NASCITA'] = $("#h-txtAnagDataNasc").val();
			_json.mapMetadatiString['ANAG_COMUNE_NASC'] = $('#h-txtLuogoNasc').val();

			_json.mapMetadatiString['ANAG_COD_FISC'] = $("#txtAnagCodFisc").val();
			var cod_stp = $("#txtCodSTP").val();
			var cod_eni = $("#txtCodENI").val();
			if (cod_stp!=''){
				_json.mapMetadatiString['STP'] = cod_stp;
				_json.mapMetadatiString['SCADENZA_STP'] = $("#txtScadCodSTP").val();
			}
			else{
				_json.mapMetadatiString['STP'] = '';
				_json.mapMetadatiString['SCADENZA_STP'] = '';
			}
			if (cod_eni!=''){
				_json.mapMetadatiString['ENI'] = cod_eni;
				_json.mapMetadatiString['SCADENZA_ENI'] = $("#txtScadCodENI").val();
			}
			else{
				_json.mapMetadatiString['ENI'] = '';
				_json.mapMetadatiString['SCADENZA_ENI'] = '';
			}
			var giubileo =$("#txtCodGIU").val();
			if (giubileo!=''){
				_json.mapMetadatiString['GIUBILEO'] = giubileo;
				_json.mapMetadatiString['SCADENZA_GIUBILEO'] = $("#txtScadCodGIU").val();
			}
			else{
				_json.mapMetadatiString['GIUBILEO'] = '';
				_json.mapMetadatiString['SCADENZA_GIUBILEO'] = '';
			}
			_json.mapMetadatiCodifiche['STATO_CIVILE']= {codice:null,id: $("#h-txtStatoCivile").val()};
			 _json.mapMetadatiCodifiche['ADT_ACC_RICOVERO_TITOLO_STUDIO']= {codice:null,id: $("#h-txtTitoloStudio").val()};
			 // cittadinanze
			/* for (var i=0; i<4; i++){
				 if ($("#txtCitt"+i).val()!=''){
					 _json.mapMetadatiString['ANAG_CITT'+i] = $("#txtCitt"+i).val();
				 }*
			 }*/
			 _json.mapMetadatiString['ANAG_CITTADINANZA_ID'] =$("#h-txtCitt0").val();
			 _json.mapMetadatiString['ANAG_CITTADINANZA_DESCR'] =$("#txtCitt0").val();
			 _json.mapMetadatiString['ANAG_TESSERA_SANITARIA'] =$("#txtTessera").val();
			 _json.mapMetadatiString['ANAG_TESSERA_SANITARIA_SCADENZA'] =$("#h-txtScadenzaTessera").val();
			 // residenza
			 _json.mapMetadatiString['ANAG_RES_CODICE_ISTAT'] =$("#h-txtComuneRes").val();
			 _json.mapMetadatiString['ANAG_RES_REGIONE'] =$("#txtCodiceRegioneRes").val();
			 _json.mapMetadatiString['ANAG_RES_ASL'] =$("#h-txtASLResidenza").val();
			 _json.mapMetadatiString['ANAG_RES_CAP'] =$("#txtCAPRes").val();
			 _json.mapMetadatiString['ANAG_RES_PROV'] =$("#txtProvRes").val();
			 _json.mapMetadatiString['ANAG_RES_INDIRIZZO'] =$("#txtIndRes").val();
			 _json.mapMetadatiString['ANAG_TELEFONO'] =$("#txtTelRes").val();

			_json.mapMetadatiString['CIVICO'] =$("#txtCivRes").val();


			//alert(JSON.stringify(_json));
			 return _json;
		},
		salvaAnagrafica:function(cbk){
			NS_LOADING.showLoading({"timeout" : 0});
			if(typeof cbk !== 'function'){
				cbk = function(){};
			}

			var codice_fiscale = $("#txtAnagCodFisc").val();



				/* gestione cittadinanza */
				var XML = NS_NODE.createSimpleNode("prova");
				var cittadinanza = NS_NODE.createSimpleNode("CITTADINANZA");
				var dati = NS_NODE.createSimpleNode("DATI");

				$(".AUTOCOMPLETECITTADINANZA").each(function () {
					var value = $(this).find('input[type="text"]').val();
					value = value.replace("'", "\'");

					if(value != '') {
						dati.appendChild(NS_NODE.createNode("ITEM", $(this).find('input[type="text"]').attr("data-c-value"), "DESCR", value))
					}
				});

				cittadinanza.appendChild(dati);

				var REQUEST = NS_NODE.createSimpleNode("REQUEST");

				var sesso = $("#h-radAnagSesso").val();
				sesso = sesso == 'U' ? 'X' : sesso;
				var data = $("#h-txtAnagDataNasc").val() != '' ? $("#h-txtAnagDataNasc").val() : moment().format('YYYYMMDD');
				var nome = $('#txtAnagNome').val();
				var cognome = $('#txtAnagCognome').val();
				var comune_nascita = $("#h-txtLuogoNasc").val();

				REQUEST.appendChild(NS_NODE.createNodeWithText("MANAGE_DELETED", "S"));
				REQUEST.appendChild(NS_NODE.createSimpleNode("MITTENTE"));
				REQUEST.appendChild(NS_NODE.createNodeWithText("DATI_SENS", "S"));

				REQUEST.appendChild(NS_NODE.createNodeWithText("METODO", "MODIFICA"));

				var src = NS_NODE.createNodeWithAttr("SEARCH_KEY_LIST", "max_iden", "true");

				src.appendChild(NS_NODE.createNode("SEARCH_KEY", codice_fiscale, "key", "COD_FISC"));
				src.appendChild(NS_NODE.createNode("SEARCH_KEY", sesso, "key", "SESSO"));
				src.appendChild(NS_NODE.createNode("SEARCH_KEY", data, "key", "DATA"));
				src.appendChild(NS_NODE.createNode("SEARCH_KEY", cognome, "key", "COGN"));
				src.appendChild(NS_NODE.createNode("SEARCH_KEY", nome, "key", "NOME"));

				REQUEST.appendChild(src);

				var src2 = NS_NODE.createNodeWithAttr("SEARCH_KEY_LIST", "max_iden", "true");

				src2.appendChild(NS_NODE.createNode("SEARCH_KEY", codice_fiscale, "key", "COD_FISC"));
				src2.appendChild(NS_NODE.createNode("SEARCH_KEY", data, "key", "DATA"));
				src2.appendChild(NS_NODE.createNode("SEARCH_KEY", cognome, "key", "COGN"));
				src2.appendChild(NS_NODE.createNode("SEARCH_KEY", nome, "key", "NOME"));

				REQUEST.appendChild(src2);

				var paziente = NS_NODE.createSimpleNode("PAZIENTE");
				paziente.appendChild(cittadinanza);
				paziente.appendChild(NS_NODE.createNodeWithText("LIVELLO_ISTRUZIONE", $("#h-txtTitoloStudio").val()))

				var identificativiRemoti = NS_NODE.createSimpleNode("IDENTIFICATIVI_REMOTI");

				paziente.appendChild(identificativiRemoti);

				paziente.appendChild(NS_NODE.createNodeWithText("STATO_CIVILE", $("#h-txtStatoCivile").val()));

				paziente.appendChild(NS_NODE.createNodeWithText("ID_RIS", _IDEN_ANAG));

				paziente.appendChild(NS_NODE.createSimpleNode("ID_PAZ_DICOM"));
				paziente.appendChild(NS_NODE.createNodeWithText("COGNOME", cognome));
				paziente.appendChild(NS_NODE.createNodeWithText("NOME", nome));
				paziente.appendChild(NS_NODE.createNodeWithText("SESSO", sesso));
				paziente.appendChild(NS_NODE.createNodeWithText("DATA_NASCITA", data));
				paziente.appendChild(NS_NODE.createNodeWithText("COMUNE_NASCITA", comune_nascita));
				paziente.appendChild(NS_NODE.createNodeWithText("CODICE_FISCALE", codice_fiscale));

				//parte relativa alla residenza
				var residenza = NS_NODE.createSimpleNode("RESIDENZA");

				residenza.appendChild(NS_NODE.createNodeWithText("INDIRIZZO", $("#txtIndRes").val()));
				residenza.appendChild(NS_NODE.createNodeWithText("CIVICO", $("#txtCivRes").val()));
				residenza.appendChild(NS_NODE.createNodeWithText("COMUNE", $("#h-txtComuneRes").val()));
				residenza.appendChild(NS_NODE.createNodeWithText("PROVINCIA", $("#txtProvRes").val()));
				residenza.appendChild(NS_NODE.createNodeWithText("CAP", $("#txtCAPRes").val()));
				residenza.appendChild(NS_NODE.createNodeWithText("TELEFONO", $("#txtTelRes").val()));
				paziente.appendChild(residenza);

				//parte tessera sanitaria
				var tessera_sanitaria = NS_NODE.createSimpleNode("TESSERA_SANITARIA");
				tessera_sanitaria.appendChild(NS_NODE.createNodeWithText("NUMERO", $("#txtTessera").val()));
				tessera_sanitaria.appendChild(NS_NODE.createSimpleNode("CODICE_REGIONE"));
				tessera_sanitaria.appendChild(NS_NODE.createNodeWithText("SCADENZA", $("#h-txtScadenzaTessera").val()));
				paziente.appendChild(tessera_sanitaria);

				paziente.appendChild(NS_NODE.createNodeWithText("CUSL_RES", $("#h-txtASLResidenza").val()));
				paziente.appendChild(NS_NODE.createNodeWithText("CODICE_REGIONALE_RES", $("#txtCodiceRegioneRes").val()));

				paziente.appendChild(NS_NODE.createSimpleNode("CONSENSO"));

				REQUEST.appendChild(paziente);
				XML.appendChild(REQUEST);

//			new XMLSerializer().serializeToString(XML)// mi ritorna un xml che non va bene allora devo fare sti tapulli qui
				//alert(serializeXmlNode(XML));
//			var xmlString = '<?xml version="1.0" encoding="ISO-8859-1"?>' + XML.innerHTML.toUpperCase().toString();

				var xmlString = serializeXmlNode(XML);
				xmlString = xmlString.replace(/TRUE/g, "true");
				xmlString = xmlString.replace(/FALSE/g, "false");
				xmlString = xmlString.replace(/ KEY/g, " key");
				xmlString = xmlString.replace(/ MAX_IDEN/g, " max_iden");
				xmlString = xmlString.replace(/ POSITION/g, " position");
				xmlString = xmlString.replace(/ SEARCH_ORDER/g, " search_order");
				xmlString = xmlString.replace(/ UPDATE/g, " update");
				xmlString = xmlString.replace(/ SEARCH/g, " search");
				/*non dico la mia vergogna a scrivere le due righe sucessive di codice, all'origine era fatto in maniera umana ma internet explorer ti obbliga a fare del male*/
				xmlString = xmlString.replace("<CITTADINANZA>", "<CITTADINANZA><![CDATA[");
				xmlString = xmlString.replace("</CITTADINANZA>", "]]></CITTADINANZA>");
				//doppio spazio fa l'encoding
				xmlString = xmlString.split("&nbsp;").join(" ");
				xmlString = xmlString.split("&NBSP;").join(" ");

				var STP = $("#txtCodSTP").val();
				var scadenzaSTP = $("#h-txtScadCodSTP").val();
				var ENI = $("#txtCodENI").val();
				var scadenzaENI = $("#h-txtScadCodENI").val();
				var GIUBILEO = $("#txtCodGIU").val();
				var scadenzaGIUBILEO = $("#h-txtScadCodGIU").val();

				var checkENI = new RegExp("^ENI[0-9]{13}$").test(ENI);
				var checkSTP = new RegExp("^STP[0-9]{13}$").test(STP);
				var checkGIU = new RegExp("^GIU[0-9]{13}$").test(GIUBILEO);

				if(STP !== "" && (scadenzaSTP == "" || scadenzaSTP == null)) {
					return home.NOTIFICA.error({
						message: "Valorizzare la Data di Scadenza del Codice STP",
						timeout: 0,
						title  : "Error"
					});
				}
				if(!(checkSTP || STP == '')) {
					return home.NOTIFICA.error({
						message: "Valorizzare correttamente il Codice STP",
						timeout: 0,
						title  : "Error"
					});
				}

				if(ENI !== "" && (scadenzaENI == "" || scadenzaENI == null)) {
					return home.NOTIFICA.error({
						message: "Valorizzare la Data di Scadenza del Codice ENI",
						timeout: 0,
						title  : "Error"
					});
				}

				if(!(checkENI || ENI == '')) {
					return home.NOTIFICA.error({
						message: "Valorizzare correttamente il Codice ENI",
						timeout: 0,
						title  : "Error"
					});

				}

				if(GIUBILEO !== "" && (scadenzaGIUBILEO == "" || scadenzaGIUBILEO == null)) {
					return home.NOTIFICA.error({
						message: "Valorizzare la Data di Scadenza del Codice GIUBILEO",
						timeout: 0,
						title  : "Error"
					});
				}
				if(!(checkGIU || GIUBILEO == '')) {
					return home.NOTIFICA.error({
						message: "Valorizzare correttamente il Codice GIUBILEO",
						timeout: 0,
						title  : "Error"
					});

				}

				//alert(xmlString);
				// logger.debug(xmlString);
//			console.log(xmlString);
				$.NS_DB
					.getTool({setup_default: {datasource: 'WHALE'}})
					.call_procedure(
					{
						id       : 'ANAGRAFICA_FROM_FENIX.CALL_ANAG_START_FROM_FENIX',
						parameter: {
							"vXML"             : {t: 'C', v: xmlString},
							p_result           : {t: 'V', d: 'O'},
							'STP'              : {t: 'V', v: STP},
							'SCADENZA_STP'     : {t: 'V', v: scadenzaSTP},
							'ENI'              : {t: 'V', v: ENI},
							'SCADENZA_ENI'     : {t: 'V', v: scadenzaENI},
							'GIUBILEO'         : {t: 'V', v: GIUBILEO},
							'SCADENZA_GIUBILEO': {t: 'V', v: scadenzaGIUBILEO}

						}

					})
					.done(function (data) {
//						alert(data.p_result);
						NS_LOADING.hideLoading();
						var xmlResponse = $.parseXML(data.p_result);
						var $xmlResponse = $(xmlResponse);
						var err = $xmlResponse.find("WARNING").find("DESCRIZIONE").text();

						if(err != '') {
							logger.error($xmlResponse.find("WARNING").has("DESCRIZIONE").text());

							home.NOTIFICA.error({message: err, timeout: 0, title: "Error"});
						} else {
							if($xmlResponse.find("ID_RIS").text() != '') {
								cbk();
								return home.NOTIFICA.success({
									message: 'Paziente inserito/modificato in anagrafica',
									timeout: 4,
									title  : 'Success'
								});

							}
						}
					})
					.fail(function (a) {
						logger.error(JSON.stringify(a));
						home.NOTIFICA.error({
							message: 'Errore nel salvataggio anagrafica controllare la console',
							timeout: 6,
							title  : "Error"
						});
					});

		},
		hideCodSTP:function(v){
			var $txtScadSTP = $("#txtScadCodSTP");
			var $txtSTP = $("#txtCodSTP");
			var tr = $("#lblcodSTP").closest('tr');
			var trScadenza = $txtScadSTP.closest("tr");

			if(v == 'S' ){
				tr.show();
				trScadenza.show();
				$('.butStampaSTP').show();
			}else {
				$txtSTP.val("");
				$txtScadSTP.val("");
				tr.hide();
				trScadenza.hide();
				$('.butStampaSTP').hide();
			}
		},

		hideCodENI:function(v){

		   	var $txtCodENI = $("#txtCodENI");
			var $txtScadCodENI = $("#txtScadCodENI");
			var tr = $("#lblcodENI").closest('tr');
			var trScadenza = $txtScadCodENI.closest("tr");

			if(v == 'S' ){
				tr.show();
				trScadenza.show();
				$('.butStampaENI, .butStampaTesseraENI').show();
			}else {
				$txtCodENI.val("");
				$txtScadCodENI.val("");
				tr.hide();
				trScadenza.hide();
				$('.butStampaENI, .butStampaTesseraENI').hide();
			}
		},
		hideCodGIU : function (v) {

			var $txtCodGIU = $("#txtCodGIU");
			var $txtScadCodGIU = $("#txtScadCodGIU");
			var tr = $("#lblcodGIU").closest('tr');
			var trScadenza = $txtScadCodGIU.closest("tr");

			if(v == 'S' ){
				tr.show();
				trScadenza.show();
			}else {
				$txtCodGIU.val("");
				$txtScadCodGIU.val("");
				tr.hide();
				trScadenza.hide();
			}
		},
		events:function(){
			$(document).on("change","#h-radSTP", function (e) {
				NS_ACC_RICOVERO_ANAGRAFICA.hideCodSTP(this.value);
			});
			$(document).on("change","#h-radENI", function (e) {
				NS_ACC_RICOVERO_ANAGRAFICA.hideCodENI(this.value);
			});
			$(document).on("change","#h-radGIU", function (e) {
				NS_ACC_RICOVERO_ANAGRAFICA.hideCodGIU(this.value);
			});
			/*$("#txtCodiceRegioneRes").on("change", function(){

				if(new RegExp("^[9-9]{3}").test(this.value)){
					var cmbOnere = $("#cmbOnere");
					var codice =  cmbOnere.find("option:selected").attr("data-CODICE");
					//onere 1 = SSN
					if(codice == '1'){
						cmbOnere.val("");
					}
				}
			});  */

		}
};

var  NS_NODE = {
		createNodeWithAttr:function(name,attr,value){
			return NS_NODE.createNode(name,null,attr,value);
		},
		createNodeWithText:function(name,text){
			return NS_NODE.createNode(name,text,null,null);
		},
		createSimpleNode:function(name){
			return NS_NODE.createNode(name,null,null,null)
		},

		createNode:function(name,text,attr,value){
			var node =  document.createElement(name.toUpperCase());
			if(text!=null){node.innerText = text;}
			if(attr!=null){node.setAttribute(attr,value)}
			return node;
		}
};

function serializeXmlNode(xmlNode) {

	if (typeof window.XMLSerializer != "undefined") {
		//IE 9 > , mozzilla, chrome
		return '<?xml version="1.0" encoding="ISO-8859-1"?>' + xmlNode.innerHTML.toUpperCase().toString();
	} else {
		return $(xmlNode).html();

	}
}