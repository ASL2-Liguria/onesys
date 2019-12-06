/**
 * User: graziav
 * Date: 25/03/2014
 * Time: 16:00
 */

jQuery(document).ready(function () {
	window.NS_FENIX_TOP = window.parent.NS_FENIX_TOP;
	window.$.NS_DB = window.parent.$.NS_DB;
	NS_RICHIESTA_CARTELLA.init();
	NS_RICHIESTA_CARTELLA.events();
	 _function = NS_FENIX_SCHEDA.registra;
});

var _function;
var _iden_richiesta;
var _IDEN_ANAGRAFICA = null;
var _STATO_PAGINA = null;
var _JSON_ANAGRAFICA = null;

var NS_RICHIESTA_CARTELLA =
{
		init:function(){

			NS_FENIX_SCHEDA.customizeParam = function(params){ params.extern=true; return params; };
			NS_FENIX_SCHEDA.addFieldsValidator({config:"V_ADT_RICHIESTA_CARTELLA"});
			_STATO_PAGINA = $('#_STATO_PAGINA').val();
            _IDEN_ANAGRAFICA = $("#IDEN_ANAG").val();

            _JSON_ANAGRAFICA = NS_ANAGRAFICA.Getter.getAnagraficaById(_IDEN_ANAGRAFICA);

            $("#txtNumNosologico").val($("#NOSOLOGICI").val());

			if (_STATO_PAGINA=='I')
			{
				// inizializzo campi data e ora richiesta, data e ora stato, combo stato
				$("#txtDataRichiesta").val(moment().format('DD/MM/YYYY'));
				$("#h-txtDataRichiesta").val(moment().format('YYYYMMDD'));
				$("#txtOraRichiesta").val(moment().format('HH:mm'));
                $("#txtDataStato").val(moment().format('DD/MM/YYYY'));
				$("#h-txtDataStato").val(moment().format('YYYYMMDD'));
				$("#txtOraStato").val(moment().format('HH:mm'));
                $("#cmbStatoRichiesta option:eq(1)").attr('selected','selected');
                $("#cmbStatoRichiesta").prop('disabled', 'disabled');
			}
			else if (_STATO_PAGINA=='E')
			{
				// modifico i dati della richiesta
				$("#txtOraRichiesta").val($("#hOraRichiesta").val());
				$("#txtOraStato").val($("#hOraStato").val());
				// nascondo la parte di gestione stato
				$("#idStatoRichiesta").hide();
				NS_RICHIESTA_CARTELLA.getCapRegioneProvincia($("#h-txtComune").val());
			}

			NS_FENIX_SCHEDA.afterSave = function() {
				var params = {'refresh':true}
                NS_FENIX_SCHEDA.chiudi(params);
	            return true;
	         };
		},
		events:function(){
			$("#cmbStatoRichiesta").change(function(){
				if (_STATO_PAGINA=='E'){
					// imposto data e ora attuali
					$("#txtDataStato").val(moment().format('DD/MM/YYYY'));
					$("#h-txtDataStato").val(moment().format('YYYYMMDD'));
					$("#txtOraStato").val(moment().format('HH:mm'));
				}
			});
            $(".butSalvaStampa").on("click",function(){
                NS_RICHIESTA_CARTELLA.stampaRichiestaDocClinica()
            });
            $("#cmbTipoRichiedente").on("change",function(){
                NS_RICHIESTA_CARTELLA.checkTipoRichiedente($(this).find("option:selected").attr("data-codice"));
            });

            $("#txtComune").change(function(){
            	// imposto automatico CAP e PROVINCIA 
				var cap = $("#txtCap");
				var provincia = $("#txtProvincia");
				
				//controllo che non sia selezionato il combo Diretto Interessato se no sovrascirve il cap.
				if($("#cmbTipoRichiedente").find("option:selected").attr("data-codice") != "01"){
				
					cap.val($("#txtComune").attr("data-c-cap"));
					provincia.val($("#txtComune").attr("data-c-provincia"));
				}

			});

		} ,
        stampaRichiestaDocClinica:function(){
            NS_FENIX_SCHEDA.successSave = NS_RICHIESTA_CARTELLA.eseguiStampa;
            _function();
        },
        eseguiStampa:function(response){

            var iden_contatti = $("#IDEN_CONTATTI").val();
            var par = {};
            par.PRINT_DIRECTORY = 'ARCHIVIOCARTELLA';
            par.PRINT_REPORT= "SUB_RICHIESTA_COPIA_DOCUMENTAZIONE_CLINICA";
            par.PRINT_PROMPT="&promptIDEN_RICHIESTA=" + response + "&promptIDEN_CONTATTI=" + iden_contatti;
            par.STAMPANTE = home.basePC.STAMPANTE_REFERTO;
            par['beforeApri'] =  home.NS_FENIX_PRINT.initStampa;

        	home.NS_FENIX_PRINT.caricaDocumento(par);
            home.NS_FENIX_PRINT.apri(par);
        },
        checkTipoRichiedente:function(obj){

        	if(obj == '01')
        	{
        		// nel caso fosse diretto interessato valorizzare i dati di spedizione
                $("#txtCo").val( _JSON_ANAGRAFICA.nome + ' ' + _JSON_ANAGRAFICA.cognome);
                $("#txtIndirizzo").val(_JSON_ANAGRAFICA.comuneResidenza.indirizzo);
                $("#acComune").data('acList').returnSelected({DESCR : _JSON_ANAGRAFICA.comuneResidenza.descrizione,VALUE : _JSON_ANAGRAFICA.comuneResidenza.id});
                $("#txtProvincia").val(_JSON_ANAGRAFICA.comuneResidenza.provincia.codice);
                $("#txtCap").val(_JSON_ANAGRAFICA.comuneResidenza.cap);
            }
        	else
        	{
                $("#txtCo").val("");
                $("#txtIndirizzo").val("");
                $("#acComune").data('acList').returnSelected({DESCR:"",VALUE:""});
                $("#txtProvincia").val("");
                $("#txtCap").val("");
            }
        },
        getCapRegioneProvincia:function(idenComune){

			// {"N_ROW":4,"VALUE":"052001","DESCR":"ABBADIA SAN SALVATORE"}
			var db = $.NS_DB.getTool({setup_default: {datasource: 'ADT'}});
			var params = {"IDEN_COMUNE" : {v:idenComune, t:'V'}};

			var xhr = db.select(
					{
						id       : 'ADT.Q_CAP_REGIONE_PROVINCIA_BY_COMUNE',
						parameter: params
					});

			xhr.done(function (data, textStatus, jqXHR) {
				if (data.result.length>0){
					var resp = data.result[0];
					$("#txtProvincia").val(resp.CODICE_PROVINCIA);

				}


			});
			xhr.fail(function (response) {
				logger.error(JSON.stringify(response));
				home.NOTIFICA.warning({title: "Attenzione", message: 'Errore nel valorizzare cap provincia e codice regione', timeout: 6});
			});
		}
};