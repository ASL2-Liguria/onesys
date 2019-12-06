/**
 * User: graziav
 *
 * 20141009 - alessandro.arrighi - Correzione Modifica Accesso con Data Null e valorizzazione Utente Inserimento e Modifica.
 * 20141215 - alessandro.arrighi - Invocazione Metodi Controller Tramite NS_CONTATTO_METHODS.
 */

var _IDEN_CONTATTO_GIURIDICO;
var _IDEN_CONTATTO_ASSISTENZIALE;
var _IDEN_CONTATTO = $('#IDEN_CONTATTO').val();
var _STATO_PAGINA = $("#_STATO_PAGINA").val();
var _JSON_CONTATTO;
var _JSON_ASSISTENZIALE_NEW;


$(document).ready(function () {

	window.NS_FENIX_TOP = window.parent.NS_FENIX_TOP;
	window.$.NS_DB = window.parent.$.NS_DB;

	// Setto Il Logger della CONSOLE JS
	home.NS_CONSOLEJS.addLogger({name:'AccessiDH',console:0});
    window.logger = home.NS_CONSOLEJS.loggers['AccessiDH'];
    NS_WK_ACCESSI_DH.init();
	NS_ACCESSO_DH.init();
	NS_ACCESSO_DH.setEvents();
    NS_FENIX_SCHEDA.registra = NS_ACCESSO_DH.registra;

});

var NS_ACCESSO_DH =
{
		init : function() {

			_JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById(_IDEN_CONTATTO);
			_IDEN_CONTATTO_GIURIDICO = _JSON_CONTATTO.contattiGiuridici[0].id;

			NS_FENIX_SCHEDA.addFieldsValidator({config:"V_ADT_ACCESSO_DH"});

			$("#txtNumNosologico").val(_JSON_CONTATTO.codice.codice);

			// Reparto Giuridico (NON Cambia)
			$("#h-repartoGiuridico").val(_JSON_CONTATTO.contattiGiuridici[0].provenienza.id);
			$("#repartoGiuridico").val(_JSON_CONTATTO.contattiGiuridici[0].provenienza.descrizione).attr("disabled","disabled");

			// Reparto Assistenziale
			$("#h-repartoAssistenziale").val(_JSON_CONTATTO.contattiAssistenziali[0].provenienza.id);
			$("#repartoAssistenziale").val(_JSON_CONTATTO.contattiAssistenziali[0].provenienza.descrizione);

			if (_STATO_PAGINA == 'I')
			{
				_JSON_ASSISTENZIALE_NEW = _JSON_CONTATTO.getLastAccessoAssistenziale().clone();
				_JSON_ASSISTENZIALE_NEW.dataInizio = null;
				_JSON_ASSISTENZIALE_NEW.dataFine = null;

				$("#txtDataInizio").val(moment().format('DD/MM/YYYY'));
				$("#h-txtDataInizio").val(moment().format('YYYYMMDD'));
			}
			else
			{
				_IDEN_CONTATTO_ASSISTENZIALE = $("#IDEN_CONTATTO_ASSISTENZIALE").val();
				_JSON_ASSISTENZIALE_NEW = ContattoAssistenziale.extend(_JSON_CONTATTO.contattiAssistenziali[ _JSON_CONTATTO.contattiAssistenziali.length-1], _JSON_CONTATTO);


				for (var i=0; i< _JSON_CONTATTO.contattiAssistenziali.length; i++)
				{
					if (_JSON_CONTATTO.contattiAssistenziali[i].id == _IDEN_CONTATTO_ASSISTENZIALE)
					{
						$("#h-txtDataInizio").val(_JSON_CONTATTO.contattiAssistenziali[i].dataInizio.substring(0,8));
						$("#txtDataInizio").val(moment(_JSON_CONTATTO.contattiAssistenziali[i].dataInizio,"YYYYMMDDHH:mm").format('DD/MM/YYYY'));
						$("#txtOraInizio").val(moment(_JSON_CONTATTO.contattiAssistenziali[i].dataInizio,"YYYYMMDDHH:mm").format('HH:mm'));

				        if (_JSON_CONTATTO.contattiAssistenziali[i].dataFine!=null) {
				        	$("#txtOraFine").val(moment(_JSON_CONTATTO.contattiAssistenziali[i].dataFine,"YYYYMMDDHH:mm").format('HH:mm'));
				        }

					}
				}
				//se la data di ricovero corrisponde alla data di accesso bloccare la modifica della data di accesso
				if(moment(_JSON_CONTATTO.contattiAssistenziali[0].dataInizio,"YYYYMMDDHH:mm").diff(moment(_JSON_CONTATTO.dataInizio,'YYYYMMDDHH:mm'), 'days') == 0){

					$("#txtDataInizio, #txtOraInizio").attr("readonly","readonly");
					$(".Zebra_DatePicker_Icon").unbind("click");

				}

			}




		},

        setEvents : function() {

            $("#txtDataInizio").on({"change blur" : function(){
				var $oraInizio = $("#txtOraInizio");
				var $hDataInizio = $("#h-txtDataInizio");
				if(this.value != '' && $oraInizio.val() != '' && $hDataInizio.val() != ''){
					try{
						_JSON_ASSISTENZIALE_NEW.setDataInizio($hDataInizio.val()+$oraInizio.val());
					}catch(e){
						logger.error(e.code  + ' - '+ e.message );
						home.NOTIFICA.error({ title: "Attenzione", message: e.message, timeout : 0});
						this.value = '';
						$oraInizio.val("");
						$hDataInizio.val("");
					}

				}

			}});
			$("#txtOraInizio").on({"change blur" : function(){
				var $txtDataInizio = $("#txtDataInizio");
				var $htxtDataInizio = $("#h-txtDataInizio");

				if(this.value != '' && $txtDataInizio.val() != '' && $htxtDataInizio != ''){
					try{
						_JSON_ASSISTENZIALE_NEW.setDataInizio($htxtDataInizio.val() + this.value);
					}catch(e){
						logger.error(e.code  + ' - '+ e.message );
						home.NOTIFICA.error({ title: "Attenzione", message: e.message, timeout : 0});
						this.value = '';
						$txtDataInizio.val("");
						$htxtDataInizio.val("");
					}

				}
			}});

			$("#txtOraFine").on({"change blur" : function(){
				var $txtDataInizio = $("#txtDataInizio");
				var $htxtDataInizio = $("#h-txtDataInizio");

				if(this.value != '' && $txtDataInizio.val() != '' && $htxtDataInizio != ''){
					try{
						_JSON_ASSISTENZIALE_NEW.setDataFine($htxtDataInizio.val() + this.value);
					}catch(e){
						logger.error(e.code  + ' - '+ e.message );
						home.NOTIFICA.error({ title: "Attenzione", message: e.message, timeout : 0});
						this.value = '';
					}

				}
			}});


			// Button in alto a destra per il print degli errori della pagina
			$("#butPrintVideata").remove();
			$(".headerTabs").append($("<button></button>").attr("id","butPrintVideata").attr("class","btn").html(traduzione.butPrintVideata).css({"float":"right"}).on("mousedown",function(){window.print();}));
			$("#lblTitolo").css({"width":"80%","display":"inline"});

			$(".butChiudiAccesso").on({"click":function(){
                NS_ACCESSO_DH.registra('','DISCHARGED');
            }});
        },

		registra : function(params, stato) {

			// Campi Obbligatori
            if(!NS_FENIX_SCHEDA.validateFields())
            {
                return false;
            }

			/*
			// Controllo Formato ORA
			var ora =$("#txtOraInizio").val();
			if (ora.indexOf(":")!=2){
				ora ="0"+ora;
				$("#txtOraInizio").val(ora);
			}

			ora = $("#txtOraFine").val();
			if (ora.indexOf(":") !== 2 && ora.indexOf(":") >= 0){
				ora ="0"+ora;
				$("#txtOraFine").val(ora);
			}
            */

            var _json_accesso = _JSON_ASSISTENZIALE_NEW;

            var attivo = true;

            if (_STATO_PAGINA == 'I' && typeof stato == 'undefined')
            {
                stato = 'ADMITTED';
            }
            else if(typeof stato == 'undefined' && _STATO_PAGINA == 'E')
            {
                stato =  _json_accesso.stato.codice;
            }

            if(stato == 'DISCHARGED' || stato == 'NULLIFIED'){
                attivo = false;
            }

            _json_accesso.stato = {"id":null, "codice":stato};

				var hDataInizio = $("#h-txtDataInizio");
				var dataInizio = $("#txtDataInizio");
				var oraInizio = $("#txtOraInizio");
				var oraFine =  $("#txtOraFine");
			    try {
					_json_accesso.setDataInizio(hDataInizio.val()+oraInizio.val());

					if (oraFine.val() != null && oraFine.val() !== "") {
						_json_accesso.setDataFine(hDataInizio.val() + oraFine.val());
					}

					_json_accesso.id = _STATO_PAGINA == 'I' ? null : _IDEN_CONTATTO_ASSISTENZIALE;
					_json_accesso.attivo = attivo;
					_json_accesso.accesso =  true;
					_json_accesso.contatto = {"id" : _JSON_CONTATTO.id};
					_json_accesso.contattoGiuridico = {"id":_IDEN_CONTATTO_GIURIDICO};
					/*
					_json_accesso.dataInizio = $("#h-txtDataInizio").val() + $("#txtOraInizio").val();
					_json_accesso.dataFine = $("#txtOraFine").val() == '' || $("#txtOraFine").val() == null ? null : $("#h-txtDataInizio").val() + $("#txtOraFine").val();
					*/
					_json_accesso.provenienza = {"id": $("#h-repartoAssistenziale").val(), "idCentroDiCosto" : null, "codice" : null, "descrizione" : null};
					_json_accesso.cdc = {"id": null, "idCentroDiCosto" : null, "codice" : null, "descrizione" : null};
					_json_accesso.uteModifica = _STATO_PAGINA == 'E' ? {"id" : home.baseUser.IDEN_PER} : {"id":null};
					_json_accesso.uteInserimento = _STATO_PAGINA == 'I' ? {"id":home.baseUser.IDEN_PER} : {"id": _json_accesso.uteInserimento.id};

					_json_accesso.codiciEsterni =  {"codice1": null, "codice2": null, "codice3": null, "contatto": null};


					var pUpsertAccesso = {"contatto" : _json_accesso, "hl7Event" : "Upsert Accesso Assistenziale", "notifica" : {"show" : "S", "message" : "", "errorMessage" : "", "timeout" : 3}, "cbkSuccess" : function(){var obj = top.$("#iScheda-1").contents().find("#li-tabAccessiDh"); obj.trigger('click'); NS_FENIX_SCHEDA.chiudi({"refresh" : true});}, "cbkError" : function(){}};

					pUpsertAccesso.notifica.message = _STATO_PAGINA == 'I' ? "Inserimento Accesso DH effettuato Correttamente" : "Chiusura Accesso DH effettuata Correttamente";
					pUpsertAccesso.notifica.errorMessage = _STATO_PAGINA == 'I' ? "Errore Durante Inserimento accesso DH" : "Errore Durante Chiusura accesso DH";

					NS_CONTATTO_METHODS.upsertAccesso(pUpsertAccesso);
				} catch (e){
					logger.error(e.code  + ' - '+ e.message );
					home.NOTIFICA.error({ title: "Attenzione", message: e.message, timeout : 0});
				}

		},

		Check : {

		    checkDataAccesso : function() {
		    	var hDataInizio = $("#h-txtDataInizio");
				var dataInizio = $("#txtDataInizio");
				var oraInizio = $("#txtOraInizio");
				var oraFine =  $("#txtOraFine");

				_JSON_CONTATTO.getLastAccessoAssistenziale().setDataInizio(hDataInizio+oraInizio);
				if (oraFine != null && oraFine !== ""){
					_JSON_CONTATTO.getLastAccessoAssistenziale().setDataFine(hDataInizio+oraFine);
				}

				//_JSON_CONTATTO.getAccessoAssistenziale();
		    	if (moment(hDataInizio.val() ,'YYYYMMDD')< moment(_JSON_CONTATTO.dataInizio,'YYYYMMDD'))
		    	{
		    		logger.error("NS_ACCESSO_DH.Check.checkDataAccesso - input -> " + hDataInizio.val() + $('#txtOraInizio').val() + ", Data Inizio Contatto -> " + _JSON_CONTATTO.dataInizio);
		    		home.NOTIFICA.error({message: "Attenzione data accesso precedente alla data inizio del DH " + moment(_JSON_CONTATTO.dataInizio, 'YYYYMMDDHH:mm').format('DD/MM/YYYY'), title: "Error"});
					dataInizio.focus();
		            return false;
		        }
		    	else
		    	{
		        	var accessiDH = _JSON_CONTATTO.contattiAssistenziali;

					for (var i=0; i<accessiDH.length; i++)
					{
						if (accessiDH[i].id != _IDEN_CONTATTO_ASSISTENZIALE)
						{
							 if (accessiDH[i].dataInizio.substring(0,8) == hDataInizio.val() )
							 {
								 home.NOTIFICA.error({message: "Attenzione: accesso DH già presente in questa data" , title: "Error"});
								 return false;
							 }
						 }
					}
					var dataFine = "";

					if( _JSON_CONTATTO.dataFine == null || _JSON_CONTATTO.dataFine == ""){
						if(oraFine.val() != ''){
							dataFine = oraFine.val()+ ' ' +dataInizio.val();
						}else{
							dataFine =  '23:59 ' + dataInizio.val() ;
						}
					}else{
						dataFine = _JSON_CONTATTO.dataFine;
					}

					if(oraInizio.val() != '' && !DATE_CONTROL.checkBetwen2Date({date1 : dataFine, date2 : oraInizio.val()+ ' ' +dataInizio.val()})){
						home.NOTIFICA.error({message: "Attenzione: accesso DH sucessivo alla data dimissione" , title: "Error", timeout: 15});
						return false;
					}

					if( moment(_JSON_CONTATTO.dataInizio,'YYYYMMDD').format('YYYY') != moment(dataInizio.val(),'DD/MM/YYYY').format('YYYY') ){
						home.NOTIFICA.error({message: "Attenzione: e' possibile inserire un accesso sono nell'anno di apertura del ricovero" , title: "Error", timeout: 15});
						return false;

					}
		            return true;
		        }
		    }
		}
};

var NS_WK_ACCESSI_DH = {

		wkAccessiDH : null,

		init : function(){

			if (!NS_WK_ACCESSI_DH.wkAccessiDH)
			{
	            var params = {
	            	container : "divWkAccessiDH",
		    		id : 'ADT_WK_ACCESSI_DH',
	                aBind : ['idenContatto'],
	                aVal : [_IDEN_CONTATTO],
	                load_callback: NS_WK_ACCESSI_DH.CallBack.after
	            };
	            $("div#divWkAccessiDH").height("300px");
	            NS_WK_ACCESSI_DH.wkAccessiDH = new WK(params);
	            NS_WK_ACCESSI_DH.wkAccessiDH.loadWk();

	        }
	    },

		CallBack : {

			after : function(){
				var wkt = NS_WK_ACCESSI_DH.wkAccessiDH.getRows();
				$("#repartoGiuridico").val(wkt[wkt.length-1].REP_GIU);
				$("#repartoAssistenziale").val(wkt[wkt.length-1].REP_ASS);
			}
		}
};