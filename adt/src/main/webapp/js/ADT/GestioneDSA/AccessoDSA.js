/**
 * User: graziav
 * Date: 25/09/2013
 * Time: 11:00
 */

jQuery(document).ready(function () {
    NS_ACCESSO_DSA.init();
    NS_ACCESSO_DSA.setEvents();
    NS_FENIX_SCHEDA.registra=NS_ACCESSO_DSA.registra;
});
var _IDEN_ACCESSO=null;
var _IDEN_CONTATTO=null;
var _IDEN_CONTATTO_GIURIDICO=null;
var _STATO_PAGINA = null;
var MAX_ACCESSI_DSA=3;
var NS_ACCESSO_DSA = {
		percorsoCure:null,
		provenienza:null,
		dataIniGiuridico:null,
		tipo:null,
		regime:null,
		uteInsGiu:null,
		iden:null,
        jsonPaziente:null,
        dataini:null,
        datainiconv:null,
		init: function(){
			NS_FENIX_SCHEDA.addFieldsValidator({config:"V_ADT_ACCESSO_DSA"});
			_IDEN_ACCESSO=$("#IDEN_ACCESSO").val();
			_IDEN_CONTATTO=$("#IDEN_CONTATTO").val();
			_IDEN_CONTATTO_GIURIDICO=$("#IDEN_CONTATTO_GIURIDICO").val();
			_STATO_PAGINA = $("#STATO_PAGINA").val();
			if ( _IDEN_ACCESSO==null){ // inserimento accesso
				$("#txtDataAccesso").val(moment().format('DD/MM/YYYY'));
				$("#h-txtDataAccesso").val(moment().format('YYYYMMDD'));
				$("#txtOraIniAccesso").val(moment().format('HH:mm'));
				$("#h-txtOraIniAccesso").val(moment().format('HH:mm'));
				NS_ACCESSO_DSA.testNumeroAccessi();
			}
					
			// carico i dati del contatto DSA
			var jsonDati = NS_CONTATTO_METHODS.getContattoById(_IDEN_CONTATTO);
            NS_ACCESSO_DSA.dataini  =  jsonDati.dataInizio.substring(0,8);
            NS_ACCESSO_DSA.datainiconv =   moment(NS_ACCESSO_DSA.dataini,'YYYYMMDD').format('DD/MM/YYYY');
            NS_ACCESSO_DSA.jsonPaziente = jsonDati;
			NS_ACCESSO_DSA.aggiornaPagina(jsonDati);			
			
			
		},
		
		setEvents: function(){
            $("#txtDataAccesso")
                .on(
                    {
                        /*"blur":function(){
                                if(!NS_ACCESSO_DSA.checkdataAppuntamento()){
                                    alert('Attenzione data appuntamento precedenze alla data di inizio DSA '+ NS_ACCESSO_DSA.datainiconv)
                                    $("#txtDataAccesso").focus();
                                }
                    },     */
                        "change" :function(){
                            if(!NS_ACCESSO_DSA.checkdataAppuntamento()){
                                alert('Attenzione data appuntamento precedenze alla data di inizio DSA '+ NS_ACCESSO_DSA.datainiconv);
                                $("#txtDataAccesso").focus();
                            }

                        }
                    }
                )
        },

		
		aggiornaPagina: function(dati){
			NS_ACCESSO_DSA.percorsoCure=dati.contattiGiuridici[0].percorsoCure.id;
			NS_ACCESSO_DSA.provenienza=dati.contattiGiuridici[0].provenienza.id;
			NS_ACCESSO_DSA.dataIniGiuridico=dati.contattiGiuridici[0].dataInizio;
			NS_ACCESSO_DSA.tipo=dati.contattiGiuridici[0].tipo.codice;
			NS_ACCESSO_DSA.uteInsGiu=dati.contattiGiuridici[0].uteInserimento.id;
			NS_ACCESSO_DSA.regime=dati.regime.id;
			if ( _IDEN_ACCESSO!=null){
				NS_ACCESSO_DSA.iden=_IDEN_ACCESSO;
				for (var i=0; i<dati.contattiAssistenziali.length; i++){
					if (dati.contattiAssistenziali[i].id==_IDEN_ACCESSO){
						var data_ini=dati.contattiAssistenziali[i].dataInizio;
						var data_fine = dati.contattiAssistenziali[i].dataFine;
						$("#h-txtDataAccesso").val(dati.contattiAssistenziali[i].dataInizio.substring(0,8));
				        $("#txtDataAccesso").val(dati.contattiAssistenziali[i].dataInizio.substring(6,8)+'/'+dati.contattiAssistenziali[i].dataInizio.substring(4,6)+'/'+dati.contattiAssistenziali[i].dataInizio.substring(0,4));
				        $("#txtOraIniAccesso").val(dati.contattiAssistenziali[i].dataInizio.substring(8,13));
				        if (dati.contattiAssistenziali[i].dataFine!=null) {$("#txtOraFineAccesso").val(dati.contattiAssistenziali[i].dataFine.substring(8,13));}
				        $("#txtNote").val(dati.contattiAssistenziali[i].note);
					}
				}	
			}			
		},
		testNumeroAccessi : function(){
    	    var param = {"idenContatto":_IDEN_CONTATTO};
    	    toolKitDB.getResultDatasource("ADT.Q_NUM_ACCESSI_ASS","ADT",param,null,function(resp){
    	    	if (parseInt((resp[0].NACCESSI))>=MAX_ACCESSI_DSA){
    	    		$("#idDatiAccessoDSA table").append("<tr><td colSpan='12' style='background-color:red; text-align:center; color:white; font-weight:bold; font-size:18px'>ATTENZIONE: si sta superando il numero massimo di " + MAX_ACCESSI_DSA +" accessi per il DSA!</td></tr>");
    	    	}	
    	    });
    	},
		registra: function(params){
			// validazione campi obbligatori
            if(!NS_FENIX_SCHEDA.validateFields()){
                return false;
            }
			// controllo formato ora
			var ora =$("#txtOraIniAccesso").val();
			if (ora.indexOf(":")!=2){
				ora ="0"+ora;
				$("#txtOraIniAccesso").val(ora);
			}
			ora =$("#txtOraFineAccesso").val();
			if (!ora=="") {
				if (ora.indexOf(":")!=2){
					ora ="0"+ora;
					$("#txtOraFineAccesso").val(ora);
				}
			}
			
			// compilazione json
			/*var jsonDatiAccessoDSA={
					"id":NS_ACCESSO_DSA.iden,
					"stato":{"codice":"ADMITTED"},
					"contatto":{"id":IDEN_CONTATTO},				
					"contattoGiuridico":{
						"id":IDEN_CONTATTO_GIURIDICO,
						"percorsoCure": {"id":NS_ACCESSO_DSA.percorsoCure },
						"provenienza":{"id": NS_ACCESSO_DSA.provenienza},
						"dataInizio":NS_ACCESSO_DSA.dataIniGiuridico,
						"tipo":{"id":NS_ACCESSO_DSA.tipo},
						"uteInserimento":{"id":NS_ACCESSO_DSA.uteInsGiu},
						"regime":{"id":NS_ACCESSO_DSA.regime}
					},
					"dataFine": $("#h-txtDataAccesso").val() + $("#txtOraFineAccesso").val(),
					"provenienza":{"id": NS_ACCESSO_DSA.provenienza},
					"dataInizio":$("#h-txtDataAccesso").val() + $("#txtOraIniAccesso").val(),
					"uteInserimento":{"id":home.baseUser.IDEN_PER},
					"note":$("#txtNote").val()					
			};*/
			var _json_accesso = NS_ACCESSO_DSA.jsonPaziente.contattiAssistenziali[NS_ACCESSO_DSA.jsonPaziente.contattiAssistenziali.length - 1];
			
			_json_accesso.id = _STATO_PAGINA == 'I' ? null : _IDEN_ACCESSO;
			_json_accesso.stato = {"id":null, "codice":"ADMITTED"};
			_json_accesso.contatto = {"id" : NS_ACCESSO_DSA.jsonPaziente.id};
			_json_accesso.contattoGiuridico = {"id":_IDEN_CONTATTO_GIURIDICO};
			_json_accesso.dataInizio = $("#h-txtDataAccesso").val() + $("#txtOraIniAccesso").val();
			_json_accesso.dataFine = $("#txtOraFineAccesso").val() == '' || $("#txtOraFineAccesso").val() == null ? null : $("#h-txtDataAccesso").val() + $("#txtOraFineAccesso").val();
			_json_accesso.provenienza = {"id": NS_ACCESSO_DSA.provenienza};
			_json_accesso.cdc = {"id": null, "idCentroDiCosto" : null, "codice" : null, "descrizione" : null};
			_json_accesso.uteModifica = _STATO_PAGINA == 'E' ? {"id" : home.baseUser.IDEN_PER} : {"id":null};
			_json_accesso.uteInserimento = _STATO_PAGINA == 'I' ? {"id":home.baseUser.IDEN_PER} : {"id": _json_accesso.uteInserimento.id};
			_json_accesso.note=$("#txtNote").val();
			//alert(JSON.stringify(_json_accesso));
			
			if(NS_ACCESSO_DSA.checkdataAppuntamento())  {
					
                    $.ajax({
                        url: 'adt/UpsertContattoAssistenziale/json/'+JSON.stringify(_json_accesso),
                        dataType: 'json',
                        error: function( data ) {
                        	//alert(data);
                            logger.error(JSON.stringify(data));
                            //alert(JSON.stringify(data.responseText));
                            NS_FENIX_SCHEDA.koSalva(params, data);
                            return false;
                        },
                        success:function(data,status){
                        	//alert(data);
                            if(data.success){
                                home.NOTIFICA.success({message: 'Salvataggio effettuato correttamente', timeout: 2, title: 'Success'});
                                var obj = top.$("#iScheda-1").contents().find("#li-tabRichiesteAccessi");
                                obj.trigger('click');
                                var params = {'refresh':true}
                                NS_FENIX_SCHEDA.chiudi(params);
                                //alert(data);
                                return true;
                            }else{
                                home.NOTIFICA.error({message: "Attenzione errore nel salvataggio", title: "Error"});
                                logger.error(JSON.stringify(data));
                                return false;
                            }
                        }
                });
            }else{
                home.NOTIFICA.error({message: "Attenzione errore la data dell'appuntamento e' precedente alla data di inizio " + NS_ACCESSO_DSA.datainiconv, title: "Error"});
                return false;

            }
	},
    checkdataAppuntamento:function(){
        if($("#h-txtDataAccesso").val() < NS_ACCESSO_DSA.dataini )  {
            return false;
        }else {
            return true;
        }
    }
		
}
