NS_SATAPP = {
    //url:"http://192.168.3.222:7001/SATAPP",
    url:SATAPP_SERVICES.URL_MIDDLEWARE,
    esito_operazione:"",
	esito_annullamento:"",
    init:function(_operazione,v_iden_anag,v_num_pre,v_extradb,v_reparto,_idendett){
        var _OBJ = new Object();
        //_OBJ.CODICE_AZIENDA_PRENOTATORE = "105";
        //_OBJ.CODICE_REGIONE_PRENOTATORE = "080";
        _OBJ.CODICE_AZIENDA_PRENOTATORE = SATAPP_SERVICES.CODICE_AZIENDA_PRENOTATORE;
        _OBJ.CODICE_REGIONE_PRENOTATORE = SATAPP_SERVICES.CODICE_REGIONE_PRENOTATORE;
        _OBJ.CODICE_POSTAZIONE = "NB_LUCAD";
        
        
        //_OBJ.DATA_PRENOTAZIONE = document.gestione_esame.dat_pre.value.toString() +  document.gestione_esame.ora_pre.value.replace(":","");
        dwr.engine.setAsync(false);
		if(v_iden_anag!=""){
			var v_sql= "select cogn,nome,cod_fisc,id10 from anag a inner join cod_est_anag cea on cea.iden_anag = a.iden where iden = " + v_iden_anag;
			toolKitDB.getResultData(v_sql,function(rs){
				   if(rs!=null) {
					   _OBJ.COGNOME_PAZIENTE = rs[0];
					   _OBJ.NOME_PAZIENTE = rs[1];
					   var $RE = /^(\d{13}|\s*)?$/;
					   var ts = false;
					   var tg="";
					   if(rs[2].indexOf("STP") > -1){
							$RE.constructor.toString();
							tg = rs[2].substring(3,16);
							ts = $RE.test(tg);
							if(ts){
								_OBJ.CF_PAZIENTE = "";
								_OBJ.STP_PAZIENTE = rs[2];
								_OBJ.CODICE_AUSL_STP = rs[3];
							}
					   }else if(rs[2].indexOf("ENI")> -1){
							$RE.constructor.toString();
							tg = rs[2].substring(3,16);
							ts = $RE.test(tg);
							if(ts){
								_OBJ.CF_PAZIENTE = "";
								_OBJ.ENI_PAZIENTE = rs[2];
								_OBJ.CODICE_AUSL_ENI = rs[3];
							}
					   }else{
							_OBJ.CF_PAZIENTE = rs[2];
					   }	   
				   }
			});
		}

        switch(_operazione){
            case "I":
                _OBJ.TIPO_CHIAMATA ="INS";
                _OBJ.TIPO_INSERIMENTO ="AD";
                v_sql = "select progressivo_prestazione,codice_nre,codice_ministeriale,codice_struttura_erogante,data_appuntamento,codice_autenticazione_sac from table(get_satapp_dati('"+v_extradb+"','"+v_reparto+"','I',null))";
                break;
            case "P":
                _OBJ.TIPO_CHIAMATA ="INS";
                _OBJ.TIPO_INSERIMENTO ="P";
                v_sql = "select progressivo_prestazione,codice_nre,codice_ministeriale,codice_struttura_erogante,data_appuntamento,codice_autenticazione_sac from table(get_satapp_dati('"+v_extradb+"','"+v_reparto+"','P','"+_idendett+"'))";
                break;
            case "M":
                v_sql = "select progressivo_prestazione,nre,cod_min,codice_struttura,to_char(to_date('"+$("#data_ese").val()+"','dd/mm/yyyy'),'yyyymmdd')||replace('"+$("[name='ora_ese']").val()+"',':','') as data_app,codice_autenticazione_sac from view_satapp_dati where num_pre = " + v_num_pre;
                _OBJ.TIPO_CHIAMATA ="UPD";
                _OBJ.TIPO_INSERIMENTO ="AD";
                break;
            case "MP":
                //v_sql = "select progressivo_prestazione,nre,cod_min,codice_struttura,to_char(to_date('"+$("#data_ese").val()+"','dd/mm/yyyy'),'yyyymmdd')||replace('"+$("[name='ora_ese']").val()+"',':','') as data_app,codice_autenticazione_sac from view_satapp_dati where num_pre = " + v_num_pre;
				var data="";
				var ora="";
				var v_sql1="select data,ora from view_prenotazione_orario where iden_dettaglio=" + _idendett;
				toolKitDB.getResultData(v_sql1,function(rs){
					data = rs[0];
					ora = rs[1];
				});
				toolKitDB.getResultData("select num_pre,iden_anag from esami where iden = " + v_num_pre,function(rs1){
					v_num_pre = rs1[0];
					v_iden_anag= rs1[1];
				});
				var v_num_per_num_pre =0;
				var v_sql4 = "select count(*) as num from esami where num_pre = " + v_num_pre + " and deleted='N'"
				toolKitDB.getResultData(v_sql4,function(rs){
					v_num_per_num_pre = rs[0];
				});
				if(v_num_per_num_pre > 1){
					NS_SATAPP.esito_operazione = "KO";
					dwr.engine.setAsync(true);
					alert("Impossibile spostare una prestazione di una ricetta contenente più prestazioni! E' possibile solamente cancellare e riprenotare la prescrizione")
					return false;
					break;
				}
				var v_sql3= "select cogn,nome,cod_fisc,id10 from anag A INNER JOIN COD_EST_ANAG CEA ON CEA.IDEN_ANAG = A.IDEN where iden = " + v_iden_anag;
				toolKitDB.getResultData(v_sql3,function(rs3){
				   if(rs3!=null) {
					   _OBJ.COGNOME_PAZIENTE = rs3[0];
					   _OBJ.NOME_PAZIENTE = rs3[1];
						var $RE = /^(\d{13}|\s*)?$/;
						var ts = false;
						var tg="";
					   if(rs3[2].indexOf("STP") > -1){
							$RE.constructor.toString();
							tg = rs3[2].substring(3,16);
							ts = $RE.test(tg);
							if(ts){
								_OBJ.CF_PAZIENTE = "";
								_OBJ.STP_PAZIENTE = rs3[2];
								_OBJ.CODICE_AUSL_STP = rs3[3];
							}
					   }else if(rs3[2].indexOf("ENI")> -1){
							$RE.constructor.toString();
							tg = rs3[2].substring(3,16);
							ts = $RE.test(tg);
							if(ts){
								_OBJ.CF_PAZIENTE = "";
								_OBJ.ENI_PAZIENTE = rs3[2];
								_OBJ.CODICE_AUSL_ENI = rs3[3];
							}
					   }else{
							_OBJ.CF_PAZIENTE = rs3[2];
					   }
				   }
				});
				v_sql = "select progressivo_prestazione,nre,cod_min,codice_struttura,'"+data+"'||replace('"+ora+"',':','') as data_app,codice_autenticazione_sac from view_satapp_dati where num_pre = " + v_num_pre;
                _OBJ.TIPO_CHIAMATA ="UPD";
                _OBJ.TIPO_INSERIMENTO ="P";
                break;
            case "C":
                v_sql = "select progressivo_prestazione,nre,cod_min,codice_struttura,data_appuntamento,codice_autenticazione_sac from view_satapp_dati where num_pre = " + v_num_pre;
                _OBJ.TIPO_CHIAMATA ="DEL";
                break;
        }

        toolKitDB.getListResultData(v_sql,function(resp){
           _OBJ.LISTA_PRESTAZIONI = [];
           $.each(resp,function(k,v){
              var LIST_PREST = new Object();
              LIST_PREST.PROGRESSIVO_PRESTAZIONE = v[0];
              LIST_PREST.CODICE_NRE = v[1];
              LIST_PREST.CODICE_MINISTERIALE= v[2];
              LIST_PREST.CODICE_STRUTTURA_EROGANTE = v[3];
			  if(_operazione =="C" || _operazione =="P"){
				LIST_PREST.DATA_APPUNTAMENTO = v[4].substring(0,8)+'0800';
			  }else{
				LIST_PREST.DATA_APPUNTAMENTO = v[4];

			  }		
              _OBJ.CODICE_STRUTTURA_PRENOTANTE  = v[3];
              _OBJ.LISTA_PRESTAZIONI.push(LIST_PREST);
			  if(_operazione =="C" || _operazione =="P"){
				_OBJ.DATA_PRENOTAZIONE = v[4].substring(0,8)+'0800';
			  }else{
				_OBJ.DATA_PRENOTAZIONE = v[4];
			  }

              _OBJ.NUM_PRE=v_num_pre;
           });
        });
        dwr.engine.setAsync(false);
        NS_SATAPP.send(_OBJ);
        if(NS_SATAPP.esito_operazione == "TM"){
            NS_SATAPP.eventoErrore(_operazione,v_num_pre);

        }
        return NS_SATAPP.esito_operazione;

    },send:function(OBJ){
        var v_oo= JSON.stringify(OBJ);
        var dataToSend = "INPUT="+v_oo;
        jQuery.support.cors = true;
        $.ajax({
            url: "proxy",
            data:"CALL="+NS_SATAPP.url+"&PARAM="+dataToSend,
			timeout:1000,
            cache: false,
            type: "POST",
            crossDomain: false,
            async:false,
            dataType: 'json',
            contentType:"application/x-www-form-urlencoded",
            success: function (resp)
            {   
                if(resp.RESPONSE.ESITO == "KO" || resp.RESPONSE.ESITO =="TM"){
                    alert(resp.RESPONSE.ERRORE);    
                }
                NS_SATAPP.esito_operazione = resp.RESPONSE.ESITO;
            },
            error: function (resp)
            {   
                alert("Impossibile comunicare l'operazione al servizio!");
                NS_SATAPP.esito_operazione  =  "KO";
            }
        });        
    },
	AnnullaBlocco:function(_extra_db,v_iden_anag)
	{
		var cod_fisc;
		var v_sql3= "select cod_fisc from anag  where iden = " + v_iden_anag;
		dwr.engine.setAsync(false);
		toolKitDB.getResultData(v_sql3,function(rs3){
			cod_fisc=rs3[0];
		})
		dwr.engine.setAsync(true);
		var nre = GetTag(_extra_db,"NRE");
		if (nre!="")
		{

			// modifica 31-8-16
			dataToSend={
				"NRE":nre,
				"CODFISC_PAZ":cod_fisc,
				"TIPOOPERAZIONE":'3',
				"UTENTE":"AMBU_SCH_ESAME"
			};
			// **************

			var errore="";
			var message="";
			var _url=DEMA_SAVONA.URL_MIDDLEWARE
			jQuery.support.cors = true;
			$.ajax({
				url: "proxy",
				data:"CALL="+_url+"&PARAM=INPUT="+JSON.stringify(dataToSend),
				cache: false,
				type: "POST",
				crossDomain: false,
				async:false,
				dataType: 'json',
				contentType:"application/x-www-form-urlencoded",
				success: function (resp)
				{
					message=JSON.stringify(resp);
					if(!resp.ERRORE_APPLICATIVO)
					{
						NS_SATAPP.esito_annullamento="OK";
					}
					else
					{
						NS_SATAPP.esito_annullamento="KO";
						
						errore=resp.ERRORE_APPLICATIVO[0].CODESITO;
					}
					
				},
				timeout:150000,
				error: function (resp)
				{
					
					NS_SATAPP.esito_annullamento="KO";
				}
			});
			NS_SATAPP.logAnnullamento(JSON.stringify(dataToSend),message, errore,NS_SATAPP.esito_annullamento,nre, top.baseUser.IDEN_PER);
		}
	},
	logAnnullamento: function(sendMsg, respMsg, error, errorMessage, NRE, UTE_INS)
	{
		var query= "insert into LOG_ANNULLASCARICO(SENDMSG, RESPMSG, ERROR, RES, NRE, UTE_INS) values('"+sendMsg+"','"+respMsg+"','"+error+"','"+errorMessage+"','"+NRE+"',"+UTE_INS+")";
		//alert(query);
		dwr.engine.setAsync(false);
		toolKitDB.executeQueryData(query,function(res)
		{
			if (isNaN(res))
			{
				alert("Error log annulla scarico dematerializzata="+res);
				
			}
		})
		dwr.engine.setAsync(true);
	},
    eventoErrore:function(v_type,v_num_pre){
        var v_sql;
        switch(v_type){
            case "I":
                v_sql = "insert into TAB_EVENTI_POLARIS (TIPO_EVENTO,DESCR_EVENTO,DATI_EVENTO_1) values ('SI','ACCETTAZIONE PRENOTAZIONE DEMA',to_char("+v_num_pre+"))";
                break;
            case "P":
                v_sql = "insert into TAB_EVENTI_POLARIS (TIPO_EVENTO,DESCR_EVENTO,DATI_EVENTO_1) values ('SI','ACCETTAZIONE PRENOTAZIONE DEMA',"+v_num_pre+")";
                break;
            case "M":
                v_sql = "insert into TAB_EVENTI_POLARIS (TIPO_EVENTO,DESCR_EVENTO,DATI_EVENTO_1) values ('SM','MODIFICA ACCETTAZIONE PRENOTAZIONE DEMA',to_char("+v_num_pre+"))";
                break;
            case "MP":
                v_sql = "insert into TAB_EVENTI_POLARIS (TIPO_EVENTO,DESCR_EVENTO,DATI_EVENTO_1) values ('SM','MODIFICA ACCETTAZIONE PRENOTAZIONE DEMA',"+v_num_pre+")";
                break;
            case "C":
                v_sql = "insert into TAB_EVENTI_POLARIS (TIPO_EVENTO,DESCR_EVENTO,DATI_EVENTO_1) values ('SC','CANCELLAZIONE DEMA',to_char("+v_num_pre+"))";
                break;   
        }
        dwr.engine.setAsync(false);
        toolKitDB.executeQueryData(v_sql,function(resp){
            
        });
        dwr.engine.setAsync(true);
    },
    checkSatapp:function(_extra_db,_operazione,v_num_pre){
		if(v_num_pre=="") return false;
		if(_operazione.indexOf("*") > - 1){
			var arr_operazione = _operazione.split("*");
			if(arr_operazione[0] == "E"){
				return false;
			}
		}else{
			if(_operazione == "E") {
				return false;
			}
		}
		if(_operazione == "I" || _operazione == "P"||_operazione == "IA"){
			var cod_aut_sac = GetTag(_extra_db,"CAS");
			if(cod_aut_sac !=""){
				return true;
			}else{
				return false;
			}
		}else{
			var v_sql = "select count(*) as num from view_satapp_dati where num_pre = " + v_num_pre +" and (codice_autenticazione_sac is not null or tipo_ricetta ='DEMATERIALIZZATA')";
			var v_num=0;
			dwr.engine.setAsync(false);
			toolKitDB.getResultData(v_sql,function(rs){
				v_num = rs[0];
			});
			dwr.engine.setAsync(true);
			if(v_num > 0) {
				return true;
			}else{
				return false;
			}
		}


    },
	isDema : function(iden_esami)
	{
		var nEsami = -1;
		var query = "select count(*) from cod_est_esami where codice_autenticazione_sac is not null and iden_esame in ("+iden_esami.toString().replace(/\*/g,',')+")";
		toolKitDB.getResultData(query,function(rs){
			nEsami = rs[0];
		});
		dwr.engine.setAsync(true);
		return nEsami > 0;
		
	},
	checkDema : function()
	{
		var attiva_dema = "";
		var query = "select attiva_dema from tab_per where iden ="+ baseUser.IDEN_PER;
		dwr.engine.setAsync(false);
		toolKitDB.getResultData(query,function(rs){
			attiva_dema = rs[0];
		});
		dwr.engine.setAsync(true);
		return attiva_dema == "S";
	},
	checkInformatizzata : function (_extra_db){
		var tipo_ricetta = GetTag(_extra_db,"TP");
		if(tipo_ricetta == "INFORMATIZZATA"){
			return true;
		}else{
			return false;
		}
        
    },
	checkManuale: function (_extra_db){
		var manuale= GetTag(_extra_db,"MANUALE");
		if(manuale != ""){
			return true;
		}else{
			return false;
		}
        
    },
    checkSatappCancellazione:function(v_num_pre,v_num_esami_sel){
		var v_sql = "select count(*) as num from view_satapp_dati where num_pre = " + v_num_pre +" and (codice_autenticazione_sac is not null or tipo_ricetta ='DEMATERIALIZZATA')";
		var v_num=0;
		dwr.engine.setAsync(false);
		toolKitDB.getResultData(v_sql,function(rs){
			v_num = rs[0];
		});
                dwr.engine.setAsync(true);
		if(v_num > 0) {
                        if(v_num <= v_num_esami_sel){
                            return true;   
                        }else{
                            alert("Numero di esami selezionati inferiore al numero degli esami presenti sulla ricetta dematerializzata, cancellare tutto il pacchetto");
                            return false;

                        }
		}else{
			var v_sql = "select count(*) as num from view_satapp_dati where num_pre = " + v_num_pre +" and tipo_ricetta ='INFORMATIZZATA'";
			var v_num=0;
			dwr.engine.setAsync(false);
			toolKitDB.getResultData(v_sql,function(rs){
				v_num = rs[0];
			});
			if(v_num > 0){
				var v_sql_2 = "insert into tab_eventi_polaris(tipo_evento,dati_evento_1,descr_evento) values('AC',"+v_num_pre+",'CANCELLAZIONE INFO')"
				toolKitDB.executeQueryData(v_sql_2,function(rs){});
			}
			dwr.engine.setAsync(true);
			return false;
		}
		
	},
	getPrenotazioneReparto:function(iden_dettaglio){
		
		if(iden_dettaglio.indexOf("*")> -1){
			iden_dettaglio = iden_dettaglio.split("*")[0];
		}
		var reparto ="";
		dwr.engine.setAsync(false);
		v_sql = "select reparto from view_dettaglio_posto where iden = " + iden_dettaglio;
		toolKitDB.getResultData(v_sql,function(rs){
			reparto = rs[0];
		});
		dwr.engine.setAsync(true);
		return reparto;
	},
	checkSatappSpostaPrenotazione:function(v_iden_esame){
		var v_sql = "select count(*) as num from view_satapp_dati where iden_esame = " + v_iden_esame +" and (codice_autenticazione_sac is not null or tipo_ricetta ='DEMATERIALIZZATA')";
		var v_num=0;
		dwr.engine.setAsync(false);
		toolKitDB.getResultData(v_sql,function(rs){
				v_num = rs[0];
		});

		dwr.engine.setAsync(true);
		if(v_num > 0){
			return true;
		}else{
			return false;    

		}  
	},
	aggiornaRicetta:function(_type,v_nre){
		var v_sql = "BEGIN RICETTA.SP_AGGIORNA_RICETTA('"+_type+"','"+v_nre+"');END;";
		dwr.engine.setAsync(false);
		toolKitDB.executeQueryData(v_sql,function(resp){
		});
		dwr.engine.setAsync(true);
	}

};

function GetTag(xml,NomeTag){
	var Valore = '';
	try{
	XmlStr = xml.toString();
	OpenTag = '<'+NomeTag+'>';
	CloseTag = '</'+NomeTag+'>';
	var nOpen = XmlStr.indexOf(OpenTag);
	if(nOpen !=-1){
		var nClose = XmlStr.indexOf(CloseTag);
		LenOpenTag= OpenTag.length;
		Start  = nOpen + LenOpenTag;
		End = nClose ;
		return XmlStr.substring(nOpen + OpenTag.length,XmlStr.indexOf(CloseTag));
	}else{
		return "";
	}
	}catch(e){alert("GetTag- Error: " + e.description + "\n" + NomeTag);}
}


