var NS_ACC_RICOVERO_CHECK =
{
		contatto : null,
		hasDatiCartella : false,
		stopRegistra : false,

    	checkDatiCartella : function(callback) {

    		var db = $.NS_DB.getTool({setup_default:{datasource:'WHALE'}});

            var xhr =  db.select(
            {
                    id: "DATI.CHECKDATICARTELLA",
                    parameter : {"NOSOLOGICO":   {t: 'V', v: _JSON_CONTATTO.codice.codice}}
            });


            xhr.done(function (data, textStatus, jqXHR) {
				//console.log("checkDatiCartella " + JSON.stringify(data));
            	if (data.result[0].NUM == null )
            	{
            		return logger.debug("CHECKDATICARTELLA = null quindi c'e' il nosologico che non corrisponde da adt a whale");
            	}

                if(data.result[0].NUM > 0 )
                {
                	NS_ACC_RICOVERO_CHECK.hasDatiCartella = true;

                	/*
               	 	if (!home.basePermission.hasOwnProperty('BACKOFFICE'))
               	 	{
               			NS_ACC_RICOVERO.Utils.disableField('cmbRegime');
                        NS_ACC_RICOVERO.Utils.disableField('cmbRepartoRico');
                        NS_ACC_RICOVERO.Utils.disableField('cmbRepartoAss');
               	 	}
               	 	else
               	 	{
               	 		home.NOTIFICA.warning({message: "Attenzione! Per Il ricovero sono gi&agrave; presenti dei dati in cartella clinica", timeout : 10, title: "Warning"});
               	 	}*/
                }

                if (typeof callback == "function")
                {
                	callback();
                }

            });

            xhr.fail(function (response) {
                logger.error("Determinazione Dinamica Presenza Dati in Cartella CLinica - Errore XHR -> " + JSON.stringify(response));
                home.NOTIFICA.error({ title: "Attenzione", message: 'Errore nella Determinazione della Presenza di Dati in Cartella Clinica', timeout : 0});
            });

    	},

    	hasContattiAperti : function() {

    		$("#trContattiAperti").remove();

	    	if ($("#CONTATTI_APERTI").val() === "S")
	    	{

	    		$("#idAssistito table").append("<tr id='trContattiAperti'><td colSpan='12' style='background-color:red; text-align:center; color:white; font-weight:bold; font-size:18px'>ATTENZIONE: sono presenti ricoveri ancora aperti per questo paziente!</td></tr>");


	    	}
    	},

    	isNeonato : function(gg){

            var dn = moment($('#txtDataNasc').val(),'DD/MM/YYYY');
            var dr = moment($('#txtDataRico').val(),'DD/MM/YYYY');

            if ((dr.diff(dn,'day') <= gg) && ($("#txtCognome").val() != 'SCONOSCIUTO'))
            {
            	NS_ACC_RICOVERO.flgNeonato = true;

                $("#chkNeonato").data("CheckBox").enable();
            	$("#chkNeonato").data("CheckBox").selectAll();
            	$("#cmbTipoNeonato").attr("disabled",false);
                $("#txtPesoNascita").attr("disabled",false);
            }
            else
            {
            	NS_ACC_RICOVERO.flgNeonato = false;

            	$("#chkNeonato").data("CheckBox").deselectAll();
            	$("#chkNeonato").data("CheckBox").disable();
            	$("#cmbTipoNeonato").attr("disabled",true);
                $("#txtPesoNascita").attr("disabled",true);
            }

            // Gestione Obbligo Campi
            if (NS_ACC_RICOVERO.flgNeonato)
            {
            	V_ADT_ACC_RICOVERO.elements.txtPesoNascita.status = "required";
            	V_ADT_ACC_RICOVERO.elements.cmbTipoNeonato.status = "required";
            	V_ADT_ACC_RICOVERO.elements.cmbTipoRico.status = "";
            	V_ADT_ACC_RICOVERO.elements.cmbProvenienza.status = "";

            	$("#chkNeonato").data("CheckBox").enable();
            	$("#chkNeonato").data("CheckBox").selectAll();

            	NS_FENIX_SCHEDA.addFieldsValidator({config:"V_ADT_ACC_RICOVERO"});
            }

            // Non mi piacciono gli IF annidati
            if (NS_ACC_RICOVERO.flgNeonato && _STATO_PAGINA === 'I')
            {

            	$("#cmbRegime").val(NS_REGIME_TIPO_MOTIVO_RICOVERO.regimeOrdinario);
             	$("#cmbRegime").trigger("change");
             	$("#cmbTipoRico").val('');

             	var _titolo_studio = $('#cmbTitoloStudio option[data-codice="1"]').attr("data-value");
             	$('#cmbTitoloStudio').val(_titolo_studio);
            }

            if (NS_ACC_RICOVERO.flgNeonato && _JSON_CONTATTO.mapMetadatiString['MADRE_CARTELLA'] != "")
            {
            	var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
            	var xhr =  db.select(
                {
					id: "ADT.Q_MADRE_CARTELLA",
					parameter : {
						"CODICE" : _JSON_CONTATTO.mapMetadatiString['MADRE_CARTELLA'],
						"ASSIGNING_AUTHORITY_AREA" : _JSON_CONTATTO.codice.assigningAuthorityArea
					}
                });

                xhr.done(function (data, textStatus, jqXHR) {
                	if (data.result.length > 0)
    	            {
                		$("#txtMadreCartella").val(data.result[0].MADRE);
                    	$("#txtMadreCartella").attr("data-c-codice", _JSON_CONTATTO.mapMetadatiString['MADRE_CARTELLA']);
                    	$("#txtMadreCartella").attr("data-c-descr", data.result[0].MADRE);
                    	$("#txtMadreCartella").attr("data-c-value", data.result[0].IDEN);
                    	$("#h-txtMadreCartella").val(data.result[0].IDEN);
    	            }
                });

            }
        },

        setAutorizzazioni : function(){

   	 		var completaAutorizzazioni = function(){

   	 			var _isUserBackoffice = home.basePermission.hasOwnProperty('BACKOFFICE');
   	 			var _isProvenienzaPS = typeof _JSON_CONTATTO.mapMetadatiString["DEA_ANNO"] !== "undefined" ? true : false;
   	 			var _datiInCartella = NS_ACC_RICOVERO_CHECK.hasDatiCartella;
				var CONTATTO = _JSON_CONTATTO;
   	 		    //console.log(" _isProvenienzaPS -> " + !_isProvenienzaPS + '\n_isUserBackoffice ->' + !_isUserBackoffice  + '\n _datiInCartella ->' + _datiInCartella);
				//se il paziente proviene da un ps e l'utente non e' di backoffice blocca tutto
   	 			if (CONTATTO.isProvenienzaPS() && !_isUserBackoffice)
   	 			{
   	 				NS_ACC_RICOVERO.Utils.DisableDatiRicovero();
   	 			}
				//se il paziente proviene da un ps e l'utente e' di backoffice lascia libero  alcuni campi
   	 			else if (CONTATTO.isProvenienzaPS() && _isUserBackoffice)
   	 			{
   	 				NS_ACC_RICOVERO.Utils.DisableDatiRicovero();
   	 				NS_ACC_RICOVERO.Utils.enableField("cmbOnere");
   	 				NS_ACC_RICOVERO.Utils.enableField("cmbSubOnere");
   	 				NS_ACC_RICOVERO.Utils.enableField("cmbTicket");
   	 				NS_ACC_RICOVERO.Utils.enableField("cmbMotivoRico");
   	 			}
				//se il paziente non è di PS e l'utente NON è backoffice e ci sono dati in cartella controllo il regime se è un DH ODS o DS
   	 			else if (!CONTATTO.isProvenienzaPS() && !_isUserBackoffice && _datiInCartella)
   	 			{
					/*
					var $regime = $("#cmbRegime");
					var regimeSel =  $regime.find("option:selected").val();
					var tipo = $("#cmbTipoRico").find("option:selected").val();
					*/
					//console.log(" regimeSel " + regimeSel + ' NS_REGIME_TIPO_MOTIVO_RICOVERO.regimeDh  '  + NS_REGIME_TIPO_MOTIVO_RICOVERO.regimeDh + ' tipo' + tipo);
					//se è regime dh  e tipo O o S si possono modificare i campi
					if(!(CONTATTO.isDayHospital() && (CONTATTO.isChirurgico()))){

						NS_ACC_RICOVERO.Utils.disableField('cmbRegime');
						NS_ACC_RICOVERO.Utils.disableField('cmbRepartoRico');
						NS_ACC_RICOVERO.Utils.disableField('cmbRepartoAss');
						home.NOTIFICA.warning({message: "Impossibile modificare Regime e Reparti. Sono presenti gi&agrave; dei dati nella cartella clinica", timeout : 10, title: "Warning"});
					}

   	 			}
   	 			else if (!_isProvenienzaPS && !_isUserBackoffice && _datiInCartella)
	 			{
   	 				home.NOTIFICA.warning({message: "Attenzione! Per Il ricovero sono gi&agrave; presenti dei dati in cartella clinica", timeout : 10, title: "Warning"});
	 			}

   	   	 		NS_ACC_RICOVERO.Setter.setButtonScheda();
   	   	 		NS_ACC_RICOVERO_CHECK.isNeonato(NS_ACC_RICOVERO.ggNeonato);
	   	   	 	if (_isUserBackoffice ){
	   	 			V_ADT_ACC_RICOVERO.elements.txtDiagnosiAcc.status = "";
	   	 			NS_FENIX_SCHEDA.addFieldsValidator({config:"V_ADT_ACC_RICOVERO"});
	   	 		}
   	   	 	};
   	 		var _STATO_PAGINA = $('#STATO_PAGINA').val();
   	 		if (_STATO_PAGINA!=='I'){
				// è già stato fatto all'init della pagina
   	 			//NS_ACC_RICOVERO_CHECK.checkDatiCartella(completaAutorizzazioni);

				//non è sincrono nel senso che prima fa la query x vedere se ci sono dati in cartella e poi dovrebbe fare completaAutorizzazioni
				setTimeout(function(){completaAutorizzazioni()},1000);
   	 		}
   	 		else{
   	 			NS_ACC_RICOVERO.Setter.setButtonScheda();
	   	 		NS_ACC_RICOVERO_CHECK.isNeonato(NS_ACC_RICOVERO.ggNeonato);
   	 		}

        },

        //FUNZIONI PER CALCOLO GIORNO FESTIVO
		easter_greg : function(year)
		{

		  var a = new Number(year % 19);
		  var b = new Number(Math.floor(year / 100));
		  var c = new Number(year % 100);
		  var d = new Number(Math.floor(b / 4));
		  var e = new Number(b % 4);
		  var f = new Number(Math.floor((b + 8) / 25));
		  var g = new Number(Math.floor((b - f + 1) / 3));
		  var h = new Number((19 * a + b - d - g +15) % 30);
		  var i = new Number(Math.floor(c / 4));
		  var k = new Number(c % 4);
		  var l = new Number((32 + 2 * e + 2 * i - h - k) % 7);
		  var m = new Number(Math.floor((a + 11 * h + 22 * l) / 451));
		  var month = new Number(Math.floor((h + l - 7 * m + 114) / 31));
		  var  day = new Number(((h + l - 7 * m + 114) % 31) + 1);
		  return ((month - 3)*31+day);
		},

		bisestile : function(anno)
		{
		if (((anno % 4 == 0) && !(anno % 100 == 0)) || (anno % 400 == 0) )
		return 1;
		else return 0;
		},

		controlladata : function(data0)
		{

		ritorno = 0;
		secolo = 0;
		sep = data0.charAt(2);

		if (parseInt(sep)>0 && parseInt(sep) <= 9) sep = data0.charAt(1);

		splitted = data0.split(sep);

		giornimese = "202121221212";

		if (splitted[0] == data0) ritorno = 1;
			else {
				for (i in splitted) {
					if (i == 0 && !(splitted[i] > 0 && splitted[i] <32)) ritorno = 1;
					if (i == 1 && (!(splitted[i] > 0 && splitted[i] < 13) || (parseInt(giornimese.charAt(splitted[1]-1))+29 < splitted[0])) ) ritorno = 1;
					if (i == 2) {
						if (splitted[i] < 100) secolo = 2000;
						if (splitted[i]+secolo < 1800 || (!(NS_ACC_RICOVERO_CHECK.bisestile(parseInt(splitted[i])+secolo)) && splitted[0]==29 && splitted[1]==2)) ritorno = 1;
					}
				}
			}

		if (ritorno == 0) {
		yy1 = Math.floor(splitted[2])+secolo;
		return (splitted[0]+"-"+splitted[1]+"-"+String(yy1));
			} else {
			if (data0 != "") alert (data0+" data non corretta");
			return -1;
			}
		},

		dec2bin : function(i)
		{
		return (i<1)?"":NS_ACC_RICOVERO_CHECK.dec2bin((i-(i%2))/2)+i%2;
		},

		bitt : function(a)
		{
		c = "0000000"+NS_ACC_RICOVERO_CHECK.dec2bin(3);
		c = c.substring(c.length-7,c.length);
		if (a == 0) a = 7;
		return parseInt(c.charAt(a-1));
		},

		lavorativi : function(aanno,amese,agiorno,daanno,damese,dagiorno)
		{

		  today = new Date(aanno,amese-1,agiorno);
		  start = new Date(daanno,damese-1,dagiorno);

		  if ((today.getTime() < start.getTime()) || aanno == 0 || amese == 0 || agiorno == 0 || daanno == 0 || damese == 0 || dagiorno == 0) {
			return ("ERRORE");
			}

		  var festivi = 0;
		  myDate = start;
		  var giorni = 0;
		var totgio = 0;
		while (1) {
		if (myDate.getTime() > today.getTime() ) break;
		        var mm = myDate.getMonth()+1;
		        var yy = myDate.getFullYear();
		        var dd = myDate.getDate();
		        var gg = myDate.getDay();

			if (NS_ACC_RICOVERO_CHECK.easter_greg(yy)>31)
			{
			var giornopasqua = NS_ACC_RICOVERO_CHECK.easter_greg(yy)-30;
			var mesepasqua = 4;
			} else if (NS_ACC_RICOVERO_CHECK.easter_greg(yy)==31) {
			var giornopasqua = 1;
			var mesepasqua = 4;
			} else {
			var giornopasqua = NS_ACC_RICOVERO_CHECK.easter_greg(yy)+1;
			var mesepasqua = 3;
			}
			if (!(!NS_ACC_RICOVERO_CHECK.bitt(gg) && !(dd == 1 && mm ==1) && !(dd == 6 && mm ==1) && !(dd == 25 && mm ==4) && !(dd == 1 && mm ==5) && !(dd == 2 && mm ==6) && !(dd == 15 && mm ==8) && !(dd == 1 && mm ==11) && !(dd == 8 && mm ==12) && !(dd == 25 && mm ==12) && !(dd == 26 && mm ==12) && !(dd == giornopasqua && mm ==mesepasqua))) festivi ++;

			giorni++;
		if ((dd == agiorno && mm == amese && yy == aanno) || (dd == 31 && mm==1) || (dd == 28 && mm==2 && NS_ACC_RICOVERO_CHECK.bisestile(yy) == 0) || (dd == 29 && mm==2 && NS_ACC_RICOVERO_CHECK.bisestile(yy) == 1) || (dd == 31 && mm==3) || (dd == 30 && mm==4) || (dd == 31 && mm==5) || (dd == 30 && mm==6) || (dd == 31 && mm==7) || (dd == 31 && mm==8) || (dd == 30 && mm==9) || (dd == 31 && mm==10) || (dd == 30 && mm==11) || (dd == 31 && mm==12)) {
		totgio=giorni-festivi;
		}
		        myDate.setDate(myDate.getDate()+1);
		  }

		//return String(giorni-festivi);
		return festivi;
		},

		differenza : function(){
		var _STATO_PAGINA = $('#STATO_PAGINA').val();
		var _datainserimento="";
		var html1 = "";

		//se in inserimento valorizzo da FORM
		if (_STATO_PAGINA == 'I')
		{
		 var datainserita = $('#txtDataRico').val();
         var orainserita = $('#txtOraRico').val();
         _datainserimento=datainserita;
         //formatto per standardizzare
         _datainserimento=_datainserimento.substring(6, 10)+""+_datainserimento.substring(3, 5)+""+_datainserimento.substring(0, 2); // YYYMMDDHH:SS
         _datainserimento=_datainserimento+orainserita;
		}

		//se in modifica valorizzo da DB
		if (_STATO_PAGINA == 'E')
		{
		_datainserimento=NS_ACC_RICOVERO_CHECK.contatto.dataInserimento;
		}

		var formattedDataInizio = _datainserimento.substring(6, 8)+"/"+_datainserimento.substring(4, 6)+"/"+_datainserimento.substring(0, 4); // DD/MM/YYYY
		var totore_men_festivi=0;

		if (_STATO_PAGINA == 'E')
		{
			var a = formattedDataInizio;
			var b = moment().format("DD/MM/YYYY");
		}

		if (_STATO_PAGINA == 'I')
		{
			var b = formattedDataInizio;
			var a = moment().format("DD/MM/YYYY");
		}

		retu = NS_ACC_RICOVERO_CHECK.controlladata(a);
		if (retu == -1) return;
		var splitted = retu.split("-");
		dd = Math.floor(splitted[0]);
		mm = Math.floor(splitted[1]);
		yy = Math.floor(splitted[2]);

		retu = NS_ACC_RICOVERO_CHECK.controlladata(b);
		if (retu == -1) return;
		var splitted = retu.split("-");
		dd1 = Math.floor(splitted[0]);
		mm1 = Math.floor(splitted[1]);
		yy1 = Math.floor(splitted[2]);

		if (a != "" && b != "") {
			html1=NS_ACC_RICOVERO_CHECK.lavorativi(yy1,mm1,dd1,yy,mm,dd);

			if (_STATO_PAGINA == 'I')
			{
				totore_men_festivi=moment().diff(moment(_datainserimento, "YYYYMMDDHH:mm"), 'hours')+(html1*24);
			}

			if (_STATO_PAGINA == 'E')
			{
				totore_men_festivi=moment().diff(moment(_datainserimento, "YYYYMMDDHH:mm"), 'hours')-(html1*24);
			}

		}

			return totore_men_festivi;
		},
        //FINE FUNZIONI CALCOLO GIORNO FESTIVO

		checkPresalvataggio : function(){

			var _pesoNeonato = $("#txtPesoNascita").val();
			var _resp = false;

			if (_pesoNeonato != null) {
				var _pattern = new RegExp("[^0-9]");
				_resp = _pattern.test(_pesoNeonato);
			}

			if (_resp){
				home.NOTIFICA.error({message: "Il peso del neonato deve essere valorizzato esclusivamente con caratteri numerici senza superare le 4 cifre", timeout : 6, title: "Avviso"});
				return false;
			}

			NS_ACC_RICOVERO.flgNeonato = true

			// la data di prenotazione deve essere inferiore alla data di inizio ricovero
			/*if (V_ADT_ACC_RICOVERO.elements.txtDataPren.status === "required")
			{
				var _dataPrenotazione = moment($("#h-txtDataPren").val(),"YYYYMMDD");
				var _datainizio = moment($("#h-txtDataRico").val(),"YYYYMMDD");

				if (!_datainizio.isAfter(_dataPrenotazione))
				{
					home.NOTIFICA.error({message: "La data di prenotazione deve essere inferiore alla data di inizio ricovero", timeout : 6, title: "Avviso"});
					return false;
				}
			}      */
			var hdataPrenotazione = $("#h-txtDataPren").val();
			var _dataPrenotazione = Number(hdataPrenotazione)+1;
			var _datainizio = $("#h-txtDataRico").val();

			if(hdataPrenotazione != '' && !NS_ACC_RICOVERO_CHECK.checkDataPren(String(_dataPrenotazione), _datainizio)){
				home.NOTIFICA.error({message: "La data di prenotazione deve essere inferiore alla data di inizio ricovero", timeout : 6, title: "Avviso"});
				return false;
			}


			return true;
		},

    	/**
    	 * Funzione che controlla se le modifiche apportate al contatto sono appropriate in base al tipo di utente.
    	 * Viene eseguita prima della registrazione e viene confrontato il contatto modificato con quello che � stato aperto.
    	 * I dettagli dell'implementazione sono definiti nella segnalazione #1061 su redmine.
    	 *
    	 * @author alessandro.arrighi
    	 */

    	checkModificaFromUtente : function(callback){

    		NS_ACC_RICOVERO_CHECK.contatto = NS_CONTATTO_METHODS.getContattoById(_IDEN_CONTATTO);

    		var _isUserBackoffice = home.basePermission.hasOwnProperty('BACKOFFICE');
    		var _isProvenienzaPS = typeof NS_ACC_RICOVERO_CHECK.contatto.mapMetadatiString["DEA_ANNO"] !== "undefined" ? true : false;

    		logger.debug("Check Before Registra Update - Contatto di PS -> " + _isProvenienzaPS);

    		var _isRepartoAChanged = NS_ACC_RICOVERO_CHECK.contatto.contattiAssistenziali[0].provenienza.id != _JSON_CONTATTO.contattiAssistenziali[0].provenienza.id;
    		var _isRepartoGChanged = NS_ACC_RICOVERO_CHECK.contatto.contattiGiuridici[0].provenienza.id != _JSON_CONTATTO.contattiGiuridici[0].provenienza.id;

    		logger.debug("Check Before Registra Update - Reparto Giuridico Changed -> " + _isRepartoGChanged + ", Reparto Assistenziale Changed -> " + _isRepartoAChanged);

    		// Controllo Modifica Reparto Giuridico e Assistenziale
    		if (!_isUserBackoffice && NS_ACC_RICOVERO_CHECK.hasDatiCartella && (_isRepartoGChanged || _isRepartoAChanged))
    		{
    			return home.NOTIFICA.error({message: "Presenti Dati in Cartella Clinica per il Ricovero " + _JSON_CONTATTO.codice.codice + ". Impossibile procedere con la modifica dei Reparti!", timeout : 0, title: "Error"});
    		}

    		var REPARTI_MODIFICA_24H = JSON.parse(home.baseGlobal.REPARTI_MODIFICA_24H);
    		var iden_cdc = $("#cmbRepartoRico option:selected").attr("data-iden_cdc");

    		var index, valorized=0;

    		for (index = 0; index < REPARTI_MODIFICA_24H.length; ++index)
    		{
    			if(iden_cdc == REPARTI_MODIFICA_24H[index])
    				valorized=1;
    		}

    		var _ora=12;
    		var _today = moment();
    		var _datainserimento=NS_ACC_RICOVERO_CHECK.contatto.dataInserimento;
    		var _dataInizio = moment(_datainserimento, "YYYYMMDDHH:mm");
    		var ore_trascorse= _today.diff(_dataInizio, 'hours')
    		var _isChangeDataInizio = NS_ACC_RICOVERO_CHECK.contatto.dataInizio !== _JSON_CONTATTO.dataInizio;

    		if(valorized==1)
    		{
    			ore_trascorse =NS_ACC_RICOVERO_CHECK.differenza(); //calcolo il n di giorni (festivi sabato e domenica) e rimuovo dal totale *24
    			_ora=24;
    		}

    		var _isInTimeForDataInizio = ore_trascorse < _ora ? true : false;
    		logger.debug("Check Before Registra Update - In tempo per modificare Data Accettazione -> " + _isInTimeForDataInizio);

    		// Controllo Se la Modifica della Data di Accettazione Avviene entro 12 Ore dalla Data di Inserimento
    		if (!_isInTimeForDataInizio && _isChangeDataInizio && !_isUserBackoffice)
    		{
    			return home.NOTIFICA.error({message: "Impossibile Modificare Data di Accettazione! Sono Trascorse pi&ugrave; di "+ _ora +" Ore!", timeout : 0, title: "Error"});
    		}

    		if (typeof callback === "function")
    		{
    			callback();
    		}
    	},

    	/**
    	 * Funzione che determina se � necessario procedere con il salvataggio del codice STP.
    	 * Se l'utente non � di BACKOFFICE ritorna false in quanto solo questa categoria pu� visualizzare la sezione dedicata a STP ed ENI.
    	 * Il codice STP e la rispettiva scadenza possono essere salvati solo in coppia per cui viene controllato che siano valorizzati entrambi.
    	 * La funzione determina inoltre se dall'apertura del ricovero il codice STP e la rispettiva scadenza sono stati cambiati.
    	 * Se cambiati occorre procedere con il salvataggio (solo utenti BACKOFFICE).
    	 *
    	 * @returns
    	 * @author alessandro.arrighi
    	 */
    	codiceSTPChanged :  function(){

    		var codiceSTP = $("#txtCodSTP").val();
            var scadenzaSTP = $("#txtScadCodSTP").val() != "" ? moment($("#txtScadCodSTP").val(),'DD/MM/YYYY').format('YYYYMMDD') + "00:00" : "";

            if (!home.basePermission.hasOwnProperty('BACKOFFICE'))
            {
            	return false;
            }

            if ((scadenzaSTP == "" && codiceSTP != "") || (scadenzaSTP != "" && codiceSTP == ""))
            {
            	NS_ACC_RICOVERO_CHECK.stopRegistra = true;
            	home.NOTIFICA.error({message: "Valorizzare Codice STP e Scadenza STP", timeout : 6, title: "Error"});
            }

            if (_JSON_ANAGRAFICA.stp.codice != codiceSTP && codiceSTP != "" && codiceSTP != null)
            {
            	return true;
            }

            if (_JSON_ANAGRAFICA.stp.scadenza != scadenzaSTP && scadenzaSTP != "" && scadenzaSTP != null)
            {
            	return true;
            }

            return false;
    	},

    	/**
    	 * Funzione che determina se � necessario procedere con il salvataggio del codice ENI.
    	 * Se l'utente non � di BACKOFFICE ritorna false in quanto solo questa categoria pu� visualizzare la sezione dedicata a STP ed ENI.
    	 * Il codice ENI e la rispettiva scadenza possono essere salvati solo in coppia per cui viene controllato che siano valorizzati entrambi.
    	 * La funzione determina inoltre se dall'apertura del ricovero il codice STP e la rispettiva scadenza sono stati cambiati.
    	 * Se cambiati occorre procedere con il salvataggio (solo utenti BACKOFFICE).
    	 *
    	 * @returns
    	 * @author alessandro.arrighi
    	 */
    	codiceENIChanged :  function(){

            var codiceENI = $("#txtCodENI").val();
            var scadenzaENI = $("#txtScadCodENI").val() != "" ? moment($("#txtScadCodENI").val(),'DD/MM/YYYY').format('YYYYMMDD') + "00:00" : "";

            if (!home.basePermission.hasOwnProperty('BACKOFFICE'))
            {
            	return false;
            }

            if ((scadenzaENI == "" && codiceENI != "") || (scadenzaENI != "" && codiceENI == ""))
            {
            	NS_ACC_RICOVERO_CHECK.stopRegistra = true;
            	home.NOTIFICA.error({message: "Valorizzare Codice ENI e Scadenza ENI", timeout : 6, title: "Error"});
            }

            if (_JSON_ANAGRAFICA.eni.codice != codiceENI && codiceENI != "" && codiceENI != null)
            {
            	return true;
            }

            if (_JSON_ANAGRAFICA.eni.dataScadenza != scadenzaENI && scadenzaENI != "" && scadenzaENI != null)
            {
            	return true;
            }

            return false;
    	},

		/**
		 * controlla se ha un valore
		 * @param value
		 * @returns {boolean}
		 */
		hasAValue: function (value) {
			return (("" !== value) && (undefined !== value) && (null !== value) && ("undefined" !== value) && ("null" !== value) && (typeof undefined !== value));
		},
		/**
		 * controlla se è un number
		 * @param value
		 * @returns {boolean}
		 */
		isANumber : function(value){
			return ( (!isNaN(value)) && (NS_ACC_RICOVERO_CHECK.hasAValue(value)) )
		},

		checkPesoNeonato : function (campo){

			var peso = campo.val();

			if( (!NS_ACC_RICOVERO_CHECK.isANumber( peso ) || peso.length > 4) && peso !== "" ){
				campo.removeClass("tdObb").addClass("tdError");
				campo.val("");
				home.NOTIFICA.error({title: "Errore", message: "Il peso del neonato deve essere valorizzato esclusivamente con caratteri numerici senza superare le 4 cifre"});

			}
			else{
				if(campo.hasClass("tdError")){
					campo.removeClass("tdError").addClass("tdObb");

				}
			}
		} ,
		/**
	 	 funzione che fa il controllo sulla data di prenotazione che sia minore della data ricovero e che sia maggiore di sysdate -5
		 * */
		checkDataPren : function (dataPren, dataAcc) {
			if(DATE_CONTROL.equalsDate(dataPren,dataAcc)){
				return false;
			}
			var range = 0;
			var date1 = new Date(new Date().setYear(new Date().getFullYear() -5));
			return DATE_CONTROL.checkBetwen3Date({date1 : dataAcc , date2 : dataPren , date3: date1 ,rangeDate : range});
		}

};