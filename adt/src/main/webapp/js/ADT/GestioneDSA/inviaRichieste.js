/**
 * NS per l'inserimento e il caricamento delle variabili
 * da utilizzare nel messaggio da mandare al sender Hl7.
 * */
NS_DATI_RICHIESTE ={

		setAssigningAuthorityMittente : function(value){
			NS_DATI_RICHIESTE.AssigningAuthorityMittente = value;
		},
		getAssigningAuthorityMittente : function(){
			return NS_DATI_RICHIESTE.AssigningAuthorityMittente;
		},
		setRepartoMittente : function(value){
			NS_DATI_RICHIESTE.RepartoMittente = value;
		},
		getRepartoMittente : function(){
			return NS_DATI_RICHIESTE.RepartoMittente;
		},
		setAssigningAuthorityDestinatario:function(value){
			NS_DATI_RICHIESTE.AssigningAuthorityDestinatario = value;
		},
		getAssigningAuthorityDestinatario : function(){
			return NS_DATI_RICHIESTE.AssigningAuthorityDestinatario;
		},
		setVersione : function(value){
			NS_DATI_RICHIESTE.Versione = value;
		},
		getVersione : function(){
			return NS_DATI_RICHIESTE.Versione;
		},
		setIdenAnag : function(value){
			NS_DATI_RICHIESTE.IdenAnag = value;
		},
		getIdenAnag : function(){
			return NS_DATI_RICHIESTE.IdenAnag;
		},
		setCodiceFiscale : function(value){
			NS_DATI_RICHIESTE.CodiceFiscale = value;
		},
		getCodiceFiscale : function(){
			return NS_DATI_RICHIESTE.CodiceFiscale;
		},
		setNome : function(value){
			NS_DATI_RICHIESTE.Nome = value;
		},
		getNome : function(){
			return NS_DATI_RICHIESTE.Nome;
		},
		setCognome : function(value){
			NS_DATI_RICHIESTE.Cognome = value;
		},
		getCognome : function(){
			return NS_DATI_RICHIESTE.Cognome;
		},
		setDataNascita : function(value){
			NS_DATI_RICHIESTE.DataNascita = value;
		},
		getDataNascita : function(){
			return NS_DATI_RICHIESTE.DataNascita;
		},
		setSesso : function(value){
			NS_DATI_RICHIESTE.Sesso = value;
		},
		getSesso : function(){
			return NS_DATI_RICHIESTE.Sesso;
		},
		setIdenProvenienza : function(value){
			NS_DATI_RICHIESTE.IdenProvenienza = value;
		},
		getIdenProvenienza : function(){
			return NS_DATI_RICHIESTE.IdenProvenienza;
		},
		setNumNosologico : function(value){
			NS_DATI_RICHIESTE.NumNosologico = value;
		},
		getNumNosologico : function(){
			return NS_DATI_RICHIESTE.NumNosologico;
		},
		setUrgenza : function(value){
			NS_DATI_RICHIESTE.Urgenza = value;
		},
		getUrgenza : function(){
			return NS_DATI_RICHIESTE.Urgenza;
		},
		setUserIdenPer : function(value){
			NS_DATI_RICHIESTE.UserIdenPer = value;
		},
		getUserIdenPer : function(){
			return NS_DATI_RICHIESTE.UserIdenPer;
		},
		setDataOraMessaggio : function(){
			NS_DATI_RICHIESTE.DataOraMessaggio = moment().format("YYYYMMDDHHmmss") + ".000";
		},
		getDataOraMessaggio : function(){
			return NS_DATI_RICHIESTE.DataOraMessaggio;
		},
		setDataOraRegOrdine : function(value){
			NS_DATI_RICHIESTE.DataOraRegOrdine = value;
		},
		getDataOraRegOrdine : function(){
			return NS_DATI_RICHIESTE.DataOraRegOrdine;
		},
		setNumOrdine : function(){
			NS_DATI_RICHIESTE.NumOrdine = (moment().format("YYYYMMDDHHmmss")).toString();
		},
		getNumOrdine : function(){
			return NS_DATI_RICHIESTE.NumOrdine;
		},
		setNumRichiesta : function(){
			NS_DATI_RICHIESTE.NumRichiesta = (moment().format("YYYYMMDDHHmmss")+1).toString();
		},
		getNumRichiesta : function(){
			return NS_DATI_RICHIESTE.NumRichiesta;
		}
};

var NS_INVIA_RICHIESTE = {

	booleanControl : null,
	jsonRichieste : null,

	getJSONRichieste: function(){
		return NS_INVIA_RICHIESTE.jsonRichieste;
	},
	/**
	 * Per ogni segmento del JSON appena creato (jsonRichieste) lo ciclo e
	 * faccio una chiamata ajax. Utilizzo come discriminante il cod_dec e la
	 * metodica. Esempio del JSON : [{"COD_DEC": 900770,"COD_CDC": "PS_SV","METODICA": "P","ESAMI":
	 * [{"IDEN_ESA": 19498,"IMPEGNATIVA": null,"URGENZA_IMPEGNATIVA" : null,"DATA_IMPEGNATIVA" : null,"TIPO_IMPEGNATIVA": null},
	 * {"IDEN_ESA": 19362,"IMPEGNATIVA": null,"URGENZA_IMPEGNATIVA" : null,"DATA_IMPEGNATIVA" : null,"TIPO_IMPEGNATIVA": null}]}]
	 *
	 * Posso fare iterazioni successive alla prima solo se la variabile di controllo ? true,
	 * questa viene messa a true solo alla fine della chiamata ajax.
	 */
	processaRichieste : function(){
		var iden_esa;
		NS_INVIA_RICHIESTE.booleanControl = false;
		for ( var i = 0; i < NS_INVIA_RICHIESTE.jsonRichieste.length; i++) {
			var jsonSegRich = NS_INVIA_RICHIESTE.jsonRichieste[i];
			for (k=0; k<jsonSegRich.ESAMI.length; k++){
					if (jsonSegRich.ESAMI[k].MULTI_EROGATORE){
						iden_esa=$("#cmbEsa_"+jsonSegRich.ESAMI[k].CODICE_REGIONALE+ " option:selected").val();
						if (jsonSegRich.ESAMI[k].IDEN_ESA==iden_esa){
							jsonSegRich.ESAMI[k].FLAG_INVIA=true;
						}
						else{
							jsonSegRich.ESAMI[k].FLAG_INVIA=false;
						}
					}
					else{
						jsonSegRich.ESAMI[0].FLAG_INVIA=true;
					}
			} // for k
			if (document.getElementById("chkOE"+i).checked){
				NS_INVIA_RICHIESTE.creaJsonHl7(jsonSegRich);
			}

			/*if (i == 0) {
				NS_INVIA_RICHIESTE.creaJsonHl7(jsonSegRich);
			} else {
				if (NS_INVIA_RICHIESTE.booleanControl == true) {
					NS_INVIA_RICHIESTE.booleanControl = false;
					NS_INVIA_RICHIESTE.creaJsonHl7(jsonSegRich);
				}
			}*/
		}
	},
	/**
	 * Funzione che crea il segmento principale del JSON da passare al client HL7.
	 * Poi per ogni prestazione, e quindi per ogni option presente nel combo_list,
	 * chiamo la funzione che crea un segmento del JSON e lo inserisco nel campo ORDER.
	 * Infine chiamo la funzione che f? la chiamata HL7 con il messaggio completo.
	 */
	creaJsonHl7 : function(jsonSegRich) {
		//alert("creaJsonHl7 : \n" + JSON.stringify(jsonSegRich));
		var msg = {
			"MESSAGE" : [ {
				"NAME" : "OMG_O19",
				"VALUE" : {
					"MSH" : {
						"MSH.1" : "|",
						"MSH.2" : "^~\\&",
						"MSH.3" : {
							"HD.1" : NS_DATI_RICHIESTE.getAssigningAuthorityMittente()
						},
						"MSH.4" : {
							"HD.1" : NS_DATI_RICHIESTE.getRepartoMittente()
						},
						"MSH.5" : {
							"HD.1" : NS_DATI_RICHIESTE.getAssigningAuthorityDestinatario()
						},
						"MSH.6" : {
							"HD.1" : (jsonSegRich.COD_DEC).toString()
						},
						"MSH.7" : {
							"TS.1"  : NS_DATI_RICHIESTE.getDataOraMessaggio()
						},
						"MSH.9" : {
							"MSG.1" : "OMG",
							"MSG.2" : "O19",
							"MSG.3" : "OMG_O19"
						},
						"MSH.10" : NS_DATI_RICHIESTE.getDataOraMessaggio(),
						"MSH.11" : {
							"PT.1" : "T" //T sta per test, P per produzione
						},
						"MSH.12" : {
							"VID.1" : NS_DATI_RICHIESTE.getVersione()
						}
					},
					"PATIENT" : {
						"PID" : {
							"PID.3" : [ {
								"CX.1" : NS_DATI_RICHIESTE.getIdenAnag(),
								"CX.3" : NS_DATI_RICHIESTE.getAssigningAuthorityDestinatario(),
								"CX.5" : "PK"
							}, {
								"CX.1" : NS_DATI_RICHIESTE.getCodiceFiscale(),
								"CX.3" : NS_DATI_RICHIESTE.getAssigningAuthorityDestinatario(),
								"CX.5" : "CF"
							} ],
							"PID.5" : {
								"XPN.1" : {
									"FN.1" : NS_DATI_RICHIESTE.getCognome()
								},
								"XPN.2" : NS_DATI_RICHIESTE.getNome()
							},
							"PID.7" : {
								"TS.1" : NS_DATI_RICHIESTE.getDataNascita()
							},
							"PID.8" : NS_DATI_RICHIESTE.getSesso()
						},
						"PATIENT_VISIT" : {
							"PV1" : {
								"PV1.1" : "1",
								"PV1.2" : "I", //classe paziente
								"PV1.3" : {
									"PL.1" : NS_DATI_RICHIESTE.getIdenProvenienza()
								},
								"PV1.19" : {
									"CX.1" : (NS_DATI_RICHIESTE.getNumNosologico()).toString()
								}
							}
						}
					},
					"ORDER" : []
				}
			} ]
		};
		/**
		 * Ciclo per ogni esame nella richiesta
		 * */
		for ( var i = 0; i < jsonSegRich.ESAMI.length; i++) {
			//alert(i+' ' +jsonSegRich.ESAMI[i].FLAG_INVIA);
			if (jsonSegRich.ESAMI[i].FLAG_INVIA){
				var segORC = NS_INVIA_RICHIESTE.setSegORC(i, jsonSegRich.ESAMI[i], jsonSegRich.QUESITO, jsonSegRich.QUADRO,jsonSegRich.DATA_PROPOSTA,jsonSegRich.ORA_PROPOSTA);
				msg.MESSAGE[0].VALUE.ORDER.push(segORC);
			}
		}
		//alert("JSON MSG HL7 : \n" + JSON.stringify(msg));
		NS_INVIA_RICHIESTE.chiamataHL7(msg);
	},
	/**
	 * Funzione che crea un segmento ORC+OBR per ogni prestazione,
	 * ogni segmento sar? poi inserito nel JSON principale.
	 */
	setSegORC : function(i, jsonSegRichEsame, quesito, quadro,data_proposta,ora_proposta) {
		var segORC = {
			"ORC" : {
				"ORC.1" : "NW",
				"ORC.2" : {
					"EI.1" : NS_DATI_RICHIESTE.getNumOrdine()
				},
				"ORC.4" : {
					"EI.1" : NS_DATI_RICHIESTE.getNumRichiesta()
				},
				"ORC.7" : {
					"TQ.1" : {
						"CQ.1" : data_proposta + ora_proposta
					},
					"TQ.6" : NS_DATI_RICHIESTE.getUrgenza()
				},
				"ORC.8" : {
					"EIP.1" : {
						"EI.1" : jsonSegRichEsame.IMPEGNATIVA ? jsonSegRichEsame.IMPEGNATIVA.toString() : null
					}
				},
				"ORC.9" : {
					"TS.1" :  jsonSegRichEsame.DATA_IMPEGNATIVA ? jsonSegRichEsame.DATA_IMPEGNATIVA.toString() : null
				},
				"ORC.12" : {
					"XCN.1" : NS_DATI_RICHIESTE.getUserIdenPer()
				},
				"ORC.21" : {
					"XON.1" : NS_DATI_RICHIESTE.getAssigningAuthorityMittente()
				}
			},
			"OBSERVATION_REQUEST" : {
				"OBR" : {
					"OBR.1" : (i + 1).toString(),
					"OBR.2" : {
						"EI.1" : (jsonSegRichEsame.IDEN_ESA + 1).toString()
					},
					"OBR.4" : {
						"CE.1" : (jsonSegRichEsame.IDEN_ESA).toString(),
						"CE.2" : jsonSegRichEsame.ESAME,
						"CE.3":  jsonSegRichEsame.LATERALITA
					},
					"OBR.7" : {
						"TS.1" : NS_DATI_RICHIESTE.getDataOraRegOrdine()
					},
					"OBR.13" : quadro,
					"OBR.23": {
						"MOC.2": {
							"CE.1": (jsonSegRichEsame.COD_ESENZIONE).toString()
						}
					},
					"OBR.27" : {
						"TQ.1" : {
							"CQ.1" : data_proposta + ora_proposta
							}
					},
					"OBR.31" : {
						"CE.2" : quesito
					},
					"OBR.39" : {
						"CE.1": jsonSegRichEsame.TIPO_IMPEGNATIVA ? jsonSegRichEsame.TIPO_IMPEGNATIVA.toString() : null
					}
				}
			}
		};
		// alert(segORC);
		return segORC;
	},
	/**
	 * Chiamata Ajax al server HL7 al Client.java
	 */
	chiamataHL7 : function(msg) {
		//console.log(JSON.stringify(msg));
		logger.debug(JSON.stringify(msg));
		$.ajax({
			type : 'POST',
			url : 'adt/Client/json',
			dataType : 'text',
			data :JSON.stringify(msg),
			async : false,
			error : function(data) {
				//alert('error');
				home.NOTIFICA.error({
					message : "Invio del messaggio non riuscito"
							+ JSON.stringify(data),
					timeout : 10,
					title : "Error"
				});
				return false;
			},
			success : function(data, status) {
				    var JSONdata = $.parseJSON(data);
					
					if (JSONdata.STATO=='KO'){
						home.NOTIFICA.error({
							message : JSONdata.MESSAGGIO,
							timeout : 0,
							title : 'Errore inserimento richieste'
						});
						return false;
					}
					else{
						home.NOTIFICA.success({
							message : JSONdata.MESSAGGIO,
							timeout : 10,
							title : 'Success'
						});
						return true;
					}



			}
		});
		NS_INVIA_RICHIESTE.booleanControl = true;
	}
};
