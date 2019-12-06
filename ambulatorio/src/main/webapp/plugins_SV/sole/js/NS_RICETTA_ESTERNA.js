var re;
var NS_RICETTA_ESTERNA ={
    OBJ_INPUT:null,
    init:function(_OBJ){
	   var codiceStrutturaMedico = "";
		// ****** aggiunto 11-5-15
	   var codAslMedico = "";
	   var pinCodeMedico = "";
	   var codRegioneMedico = "";
	   try
	   {
		   NS_RICETTA_ESTERNA.OBJ_INPUT=_OBJ;
		   re = new Object(); 
		   if(baseUser.TIPO !="M"){
			   var query= "select cod_fisc, STRUTTURA_PRESCRITTORE, COD_ASL, PINCODE, COD_REGIONE from tab_per where iden="+ _OBJ.IDEN_PER;
			   dwr.engine.setAsync(false);
			   toolKitDB.getResultData(query, function(result)
			   {
				  re.cfMedico1=result[0]; 
				  codiceStrutturaMedico = result[1]; 
				  codAslMedico = result[2]; 
				  pinCodeMedico  = result[3]; 
				  codRegioneMedico = result[4]; 
			   });
			   dwr.engine.setAsync(true);
		   }else{
			   var query= "select cod_fisc, STRUTTURA_PRESCRITTORE, COD_ASL, PINCODE, COD_REGIONE from tab_per where iden="+ baseUser.IDEN_PER;
			   dwr.engine.setAsync(false);
			   toolKitDB.getResultData(query, function(result)
			   {
				  re.cfMedico1=result[0]; 
				  codiceStrutturaMedico = result[1]; 	
				  codAslMedico = result[2]; 
				  pinCodeMedico  = result[3]; 
				  codRegioneMedico = result[4]; 				  
			   });
			   dwr.engine.setAsync(true);

		   }
		   var date = new Date();
		   date.setMinutes(date.getMinutes()-10);//per aggirare problema client
		   var pad="00";
		   var month= (pad+(date.getMonth()+1)).slice(-pad.length);
		   var hours= (pad+(date.getHours())).slice(-pad.length);
		   var minutes= (pad+(date.getMinutes())).slice(-pad.length);
		   var seconds= (pad+(date.getSeconds())).slice(-pad.length);
		   var data = date.getFullYear() + "-" + month+ '-'+ date.getDate();
		   data += ' '+hours+":"+minutes+":"+seconds;
		   
		   
		   
		   re.dataCompilazione=data;
		   re.codSpecializzazione = "H";
		   /*
			re.codRegione=DEMA_PRESCRIZIONE_SAVONA.CODICE_REGIONE_PRENOTATORE;
			re.codASLAo=DEMA_PRESCRIZIONE_SAVONA.CODICE_AZIENDA_PRENOTATORE;*/
			// ****** aggiunto 11-5-15
			re.codRegione=codRegioneMedico;
			re.codASLAo=codAslMedico;
			
			var query= "select cod_fisc from ANAG where iden="+ _OBJ.iden_anag;
//			alert("query " + query);
			   dwr.engine.setAsync(false);
			   toolKitDB.getResultData(query, function(result)
			   {
				  re.codiceAss=result[0]; 
			   });
			   dwr.engine.setAsync(true);
			
			var arr_prestazioni = new Array();
			var objPrestazioni = new Object();
			
			re.idenRicetta="1";
			re.tipoPrescrizione = "P";
			re.tipo_ricetta = "A";
			re.descrizioneDiagnosi = _OBJ.quesito_libero;
			re.classePriorita = _OBJ.urgenza;
			re.tipoVisita = "A";


			if (_OBJ.codice_esenzione != "")
				re.codEsenzione = _OBJ.codice_esenzione;
			else
				re.nonEsente="1";
			var varray= new Array();
			if(_OBJ.codice_prestazioni.indexOf(",")>-1){
				varray=_OBJ.codice_prestazioni.split(",");
			}else{
				varray.push(_OBJ.codice_prestazioni);
			}
			$.each(varray,function(key,value){
				objPrestazioni = new Object();
				objPrestazioni.quantita = "1";
				var codPrest=value.split('@')[0];
				var codMin=value.split('@')[1];
				var descr=value.split('@')[2];
				objPrestazioni.codProdPrest = codMin;
				objPrestazioni.codiceNomenclatoreRegionale = codPrest;
				objPrestazioni.descrProdPrest = descr;
				arr_prestazioni.push(objPrestazioni);
			});
			re.elencoDettagliPrescrizioni = arr_prestazioni;
			// ****** aggiunto 31-3-15
			if (codiceStrutturaMedico!="" && typeof(codiceStrutturaMedico)!="undefined"){
				re.codStruttura = codiceStrutturaMedico;
			}
			// ************************
			// ****** aggiunto 11-5-15
			if (pinCodeMedico!="" && typeof(pinCodeMedico)!="undefined"){
				re.pinCode = pinCodeMedico;
			}			
			// ************************
			
			// modifica 26-4-16 aldo
			re.testata2 = "2";
			// ***********			
			
			var objToSend = JSON.stringify(re);
			NS_RICETTA_ESTERNA.ret_cod_fisc=re.codiceAss;
//		   alert("DEMA_PRESCRIZIONE_SAVONA.URL_MIDDLEWARE\n" + DEMA_PRESCRIZIONE_SAVONA.URL_MIDDLEWARE + "\nobjToSend\n"+objToSend);
			NS_RICETTA_ESTERNA.call(DEMA_PRESCRIZIONE_SAVONA.URL_MIDDLEWARE, objToSend);
	   }
	   catch(e)
	   {
		   alert("NS_RICETTA_ESTERNA.init - error: " + e.description);
		   NS_RICETTA_ESTERNA.esito = 'KO';
	   }
    },
    /*registra:function(obj){
       dwr.engine.setAsync(false);
       var v_json = JSON.stringify(obj);
       var v_satement = "{call ricetta.SP_RR_RICETTA(?,?)}";
       toolKitDB.json2xmlProcedureDatasource(v_satement,v_json,function(resp){
           
           if(resp.result=="OK"){
              var v_json_resp =  resp.message.split("$")[1];
              var _obj = eval("(" + v_json_resp+ ")");
              $.each(_obj,function(k,v){
                    var v_xml ="";
                    var v_sql = "select ricetta.fx_satped_prestazioni("+v+") from dual";
                    toolKitDB.getResultData(v_sql,function(rs){
                        v_xml = rs[0];
                    });
                var obj;
                toolKitDB.getJSONFromXml(v_xml,function(rs){
                    obj = rs;
                });
                dwr.engine.setAsync(true);
                var _obj = $.parseJSON(obj);
                if(_obj.numero_prestazioni == 1){
                    var jobject = _obj.prestazioni;
                    _obj.prestazioni = [];
                    _obj.prestazioni.push(jobject);
                }
                if(NS_RICETTA_ESTERNA.OBJ_INPUT.nre_riferimento !=""){
                    _obj.identificativoNRERif = NS_RICETTA_ESTERNA.OBJ_INPUT.nre_riferimento;
                    _obj.codicePrescrizioneSoleRif = NS_RICETTA_ESTERNA.OBJ_INPUT.codice_sole_riferimento;                    

                }
                //var data = "INPUT="+JSON.stringify(_obj);
                var data = JSON.stringify(_obj);
                var url = RICETTA_SERVICES.URL_PRESTAZIONI;
                NS_RICETTA_ESTERNA.call(RICETTA_SERVICES.URL_PRESTAZIONI,data,v,"P"); 
              });
                if($("[name='PDF']").val()!=""){
                    try{
                        if($("[name='PDF']").val().indexOf("*")>  -1){
                            var arr = $("[name='PDF']").val().split("*");
                            for (i=0;i < arr.length;i++){
                                    document.all.prjpdfreader.LoadPdfBase64(arr[i]);        
                                    document.all.prjpdfreader.printSilently();
                            }
                        }else{
                                    document.all.prjpdfreader.LoadPdfBase64($("[name='PDF']").val()); 
                                    document.all.prjpdfreader.printSilently();                        
                        }
                    }catch(e){
                        $("[name='frmRicetta']").submit();
                    }
                }
           }
       });
    },*/
    call:function(_url,dataToSend,iden_testata,type){
			var error=false;
			jQuery.support.cors = true;
              $.ajax({
                url: "proxy",
                data:"CALL="+_url+"&PARAM=INPUT="+dataToSend,
                cache: false,
                type: "POST",
                crossDomain: false,
                dataType: 'json',
				async: false,
                timeout:15000,
                contentType:"application/x-www-form-urlencoded",
                success: function (resp)
                {   
//			alert("success\n" + JSON.stringify(resp));
				var tipoErrore="ERR";
					try{
						for(var i =0; i<resp.elencoRicette.length; i++)
						{
							for (var j=0; j<resp.elencoRicette[0].elencoErrori.length; j++)
							{
								if (resp.elencoRicette[i].elencoErrori[j].codEsito == "0000" || !resp.elencoRicette[i].elencoErrori[j].tipoErrore || (resp.elencoRicette[i].elencoErrori[j].tipoErrore && resp.elencoRicette[i].elencoErrori[j].tipoErrore!="Bloccante"))
								{
									tipoErrore = resp.elencoRicette[i].elencoErrori[j].codEsito;
									continue;
								}
								else 
								{
									error = true;
									tipoErrore = resp.elencoRicette[i].elencoErrori[j].codEsito;
								}
							}
							if(!error)
							{
								NS_RICETTA_ESTERNA.ret_autenticazione= resp.elencoRicette[i].codAutenticazione;
								NS_RICETTA_ESTERNA.ret_nre= resp.elencoRicette[i].nre;
								NS_RICETTA_ESTERNA.esito= 'OK'
							}
						}
					}
					catch(e){
						error = true;
						tipoErrore = e.description;
					}
					
					if (error || tipoErrore=="ERR")
					{
						alert("Dematerializzata non disponibile, al termine dell'inserimento della prestazione, bisogna inserire la ricetta rossa.")
						NS_RICETTA_ESTERNA.esito= 'KO';
					}
					
					NS_RICETTA_ESTERNA.logPrescrizione(NS_RICETTA_ESTERNA.OBJ_INPUT.num_pre_associato,dataToSend,JSON.stringify(resp),tipoErrore, NS_RICETTA_ESTERNA.ret_nre, NS_RICETTA_ESTERNA.OBJ_INPUT.IDEN_PER);
					
					
	
					
					/*if(resp.ROOT.esito.tipo=="AE" || resp.ROOT.esito.tipo=="AR"){


//                        alert("NODO SOLE : " + resp.ROOT.esito.codiceErrore+ " " + resp.ROOT.esito.descrizioneErrore);
                        var conf = false;
                        conf = window.confirm("Dematerializzata non disponibile, proseguire su ricetta rossa?");
                        SATPED_KO.registra("SATPED",iden_testata,type,conf);


                    }else{
                            if(resp.ROOT.esito.tipo =="EE"){
                                    var conf = window.confirm("Assenza di linea DEMATERIALIZZATA, proseguire con la ricetta informatizzata?")
                                    SATPED_KO.registra("SATPED",iden_testata,type,conf);
                            }else{
                                SATPED_OK.registra("SATPED",resp,iden_testata);
                                if($("[name='PDF']").val() ==""){
                                    $("[name='PDF']").val(resp.ROOT.pdf);
                                    $("[name='FILENAME']").val(resp.ROOT.filename);

                                }else{
                                    $("[name='PDF']").val($("[name='PDF']").val() + "*" + resp.ROOT.pdf);
                                    $("[name='FILENAME']").val($("[name='FILENAME']").val() + "_" + resp.ROOT.filename);
                                }
                            }
                    }*/
                },
                
                error: function (resp)
                {
	                   	   alert("Dematerializzata non disponibile, al termine dell'inserimento della prestazione, bisogna inserire la ricetta rossa.")
				   NS_RICETTA_ESTERNA.esito= 'KO';
				   NS_RICETTA_ESTERNA.logPrescrizione(NS_RICETTA_ESTERNA.OBJ_INPUT.num_pre_associato,dataToSend,JSON.stringify(resp),'ERR', NS_RICETTA_ESTERNA.ret_nre, NS_RICETTA_ESTERNA.OBJ_INPUT.IDEN_PER);
                }
            });
    },
	logPrescrizione: function(numPre, sendMsg, respMsg,error, NRE, UTE_INS)
	{
		// duplicare gli apici di sendMsg e respMsg
		var query= "insert into LOG_PRESCRIZIONI(NUMPRE, SENDMSG, RESPMSG, ERROR, NRE, UTE_INS) values("+numPre+",'"+sendMsg.replace(/'/g, "''")  +"','"+respMsg.replace(/'/g, "''") +"','"+error+"','"+NS_RICETTA_ESTERNA.ret_nre+"',"+UTE_INS+")";
//		alert(query);
		dwr.engine.setAsync(false);
		toolKitDB.executeQueryData(query,function(res)
		{
			if (isNaN(res))
			{
				alert("Error log prescrizione="+res);
				
			}
		})
		dwr.engine.setAsync(true);
	},
    ret_autenticazione:"",
    ret_nre:"",
	ret_cod_fisc:"",
    /*ret_codice_sole:"",*/
    esito:"",
    iden_testata:""
};

var SATPED_OK = {
    registra:function(type,_json,iden_testata){
        NS_RICETTA_ESTERNA.iden_testata=iden_testata;
        if(type=="SATPED"){
            dwr.engine.setAsync(false);
            var v_xml = "<RICETTA>";
            v_xml += "<TIPO_RICETTA>DEMATERIALIZZATA</TIPO_RICETTA>";
            v_xml += "<IDEN_TESTATA>"+iden_testata+"</IDEN_TESTATA>";
            v_xml += "<ESITO>OK</ESITO>";
            v_xml += "<AUTENTICAZIONE>"+_json.ROOT.autenticazione+"</AUTENTICAZIONE>";
            v_xml += "<CODICE_AUTENTICAZIONE_SAC>"+_json.ROOT.codiceAutenticazione+"</CODICE_AUTENTICAZIONE_SAC>";
            v_xml += "<CODICE_PRESCRIZIONE_SOLE>"+_json.ROOT.codicePrescrizioneSole+"</CODICE_PRESCRIZIONE_SOLE>";
            v_xml +="<ASSOCIATO>S</ASSOCIATO>";
            v_xml +="<NUM_PRE_ASSOCIATO>"+NS_RICETTA_ESTERNA.OBJ_INPUT.num_pre_associato+"</NUM_PRE_ASSOCIATO>";
            v_xml +="<NRE_RIFERIMENTO>"+NS_RICETTA_ESTERNA.OBJ_INPUT.nre_riferimento+"</NRE_RIFERIMENTO>";
            v_xml += "<NRE>"+_json.ROOT.identificativoNRE+"</NRE>";
            v_xml += "<DATA_COMPILAZIONE>"+_json.ROOT.dataCompilazione+"</DATA_COMPILAZIONE>";
            v_xml += "<FILENAME>"+_json.ROOT.filename+"</FILENAME>";
            v_xml += "</RICETTA>";

            NS_RICETTA_ESTERNA.ret_autenticazione = _json.ROOT.codiceAutenticazione ;
            NS_RICETTA_ESTERNA.ret_nre = _json.ROOT.identificativoNRE ;
            NS_RICETTA_ESTERNA.ret_codice_sole = _json.ROOT.codicePrescrizioneSole ;
            NS_RICETTA_ESTERNA.esito="OK";
            var v_sql="BEGIN RICETTA.SP_GESTIONE_RESPONSE('"+v_xml+"');END;";
            toolKitDB.executeQueryData(v_sql,function(rs){});
            dwr.engine.setAsync(true);   
        }
    }
};
var SATPED_KO = {
    registra:function(servizio,iden_testata,Type,flag){
        NS_RICETTA_ESTERNA.esito="RR";
        NS_RICETTA_ESTERNA.iden_testata=iden_testata;
	/*if(servizio=="SATPED"){
			dwr.engine.setAsync(false);
			var v_xml = "<SATPED>";
			v_xml += "<ESITO>KO</ESITO>";
			v_xml += "<IDEN_TESTATA>"+iden_testata+"</IDEN_TESTATA>";
			v_xml += "<TIPO_RICETTA>DEMATERIALIZZATA</TIPO_RICETTA>";
                        v_xml +="<ASSOCIATO>S</ASSOCIATO>";
                        v_xml +="<NUM_PRE_ASSOCIATO>"+NS_RICETTA_ESTERNA.OBJ_INPUT.num_pre_associato+"</NUM_PRE_ASSOCIATO>";


			v_xml += "</SATPED>";
			var v_sql="BEGIN RICETTA.SP_GESTIONE_RESPONSE('"+v_xml+"');END;";
			toolKitDB.executeQueryData(v_sql,function(rs){
			});
			dwr.engine.setAsync(true);
                         if(flag){
                                NS_STAMPA.init(Type,iden_testata);
                         }
		}*/
    }
};


var NS_STAMPA={
    init:function(tipoRicetta,idenTestata){

	var reparto	= "RICETTA";//CONFIGURA_SATMPE.CDC
	var funzione	= 'RICETTA_ROSSA_PRESTAZIONI';//CONFIGURA_STAMPE.FUNZIONE_CHIAMANTE 
	var anteprima	= 'N';
	var stampante 	= "";
	var sf			= "";

	
	if (tipoRicetta==null) {return;}

		if (tipoRicetta=='P'){
			
			funzione="RR_PRESTAZIONI_STD";
			sf = '&prompt<pIdenTestata>='+idenTestata;

			/*imposto la stampante dedicata e se non c'é ne imposto la visualizzazione dell'anteprima*/
			try{
				if(typeof basePC.PRINTERNAME_RICETTA_ROSSA =='undefined'){
					anteprima	="S";
				}	
				stampante = basePC.PRINTERNAME_RICETTA_ROSSA;
			
			}catch(e){
					stampante = '';				
			}
                        //stampante = opener.basePC.PRINTERNAME_REF_CLIENT;
			NS_STAMPA.StampaRicetta(funzione,sf,anteprima,reparto,stampante);
			
		}else if (tipoRicetta== "F"){ 
			
			funzione="RR_FARMACI_STD";
			sf = '&prompt<pIdenTestata>='+idenTestata+'&prompt<pShowOriginale>=1&prompt<pPosologiaRR>=S';

			/*imposto la stampante dedicata e se non c'é ne imposto la visualizzazione dell'anteprima*/
			stampante = basePC.PRINTERNAME_RICETTA_ROSSA;
                        //stampante = opener.basePC.PRINTERNAME_REF_CLIENT;
			NS_STAMPA.StampaRicetta(funzione,sf,anteprima,reparto,stampante);
		
		}else{ 
			
			funzione="RR_BIANCA_STD";
			sf = '&prompt<pIdenTestata>='+idenTestata;

			/*imposto la stampante dedicata e se non c'é ne imposto la visualizzazione dell'anteprima*/
			stampante = basePC.PRINTERNAME_REF_CLIENT;		
			NS_STAMPA.StampaRicetta(funzione,sf,anteprima,reparto,stampante);
		}
    },
    StampaRicetta:function(funzione,sf,anteprima,reparto,stampante){	
	
	if(baseUser.LOGIN=='delgiu'){
		anteprima = 'S';
	}
	if(stampante == '' || stampante == null)
		anteprima = 'S';
	
	var url =	'elabStampa?stampaFunzioneStampa='+funzione;
	url += 		'&stampaAnteprima='+anteprima;

	if(reparto!=null && reparto!='')
		url += '&stampaReparto='+reparto;	
	if(sf!=null && sf!='')
		url += '&stampaSelection='+sf;	
	if(stampante!=null && stampante!='')
		url += '&stampaStampante='+stampante;	
	//alert(url);
	var finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
		
	if(finestra){ 
		finestra.focus(); 
	}else{ 
		finestra  = window.open(url,"","top=0,left=0,width="+screen.availWidth+",height="+screen.availHeight);
	}
    }

};

var NS_FORM = {
    initPDF:function(){
       var $form = $(document.createElement("form"));
       $form.attr("id","frmRicetta");
       $form.attr("method","post");
       $form.attr("name","frmRicetta");
       $form.attr("action","srvOpenRicettaRossa");
       $form.attr("target","frmRRAssociata");
       var $v = $(document.createElement("input"));
       $v.attr("name","PDF");
       $v.attr("type","hidden");
       $v.attr("value","");
       var $v1 = $(document.createElement("input"));
       $v1.attr("name","FILENAME");
       $v1.attr("value","pdfFilename");
       $v1.attr("type","hidden");
       $v1.attr("value","");
       $form.append($v);
       $form.append($v1);
       try{
            var $OBJ = $(document.createElement("object"));
            var attr={"id":"prjpdfreader","classid":"clsid:969CB476-504B-41CF-B082-1B8CDD18323A"};
            $OBJ.attr(attr);
            $OBJ.css({"width":"1px","height":"1px"});
            $form.append($OBJ);
        }catch(e){
             alert("Error in append " + e);
        }
       $("body").append($form);
    }
};


var E_DB = {
  XML : null,
  gesXml:function(_OBJ){
      /*{NRE:"080A030112333","CODICE_AUTENTICAZIONE_SAC":"1234567898754",PC:"NB_LUCAD","IDEN_PRESTAZIONI":"123456,456879","CODICE_SOLE":"Y030AKKLASD","IDEN_ANAG":"12345","IDEN_PER":"12345"}*/

      E_DB.XML = "<ED><NRE>"+_OBJ.NRE+"</NRE><CAS>"+_OBJ.CODICE_AUTENTICAZIONE_SAC+"</CAS>";
      E_DB.XML += "<PC>"+_OBJ.PC+"</PC>";
      E_DB.XML += "<SP>VA</SP>";
	  E_DB.XML +="<TT>"+_OBJ.IDEN_PRESTAZIONI.length+"</TT>"
      E_DB.XML += "<TP>DEMATERIALIZZATA</TP>";
      E_DB.XML += "<LP>";
	  // modifica 10-5-16
	  var arrprestazioni = _OBJ.IDEN_PRESTAZIONI;
	  // ****
      var i = 0;
      $.each(_OBJ.LISTA_PRESTAZIONI,function(k,v){
			// modifica 10-5-16
			v_sql = "select te.iden from tab_esa te inner join cod_est_tab_esa ce on ce.iden_esa = te.iden where attivo ='S' and ce.cod2 ='"+v.CODICE_PRESTAZIONE_DMR+"' and ce.cod1='"+v.CODICENOMENCLATOREREGIONALE+"' and iden_esa in (select column_value from table(split('"+arrprestazioni.toString()+"')))";											 //******
			//v_sql = "select te.iden from tab_esa te inner join cod_est_tab_esa ce on ce.iden_esa = te.iden where attivo ='S' and ce.cod2 ='"+v.CODICE_PRESTAZIONE_DMR+"' and ce.cod1='"+v.CODICENOMENCLATOREREGIONALE+"' and iden_esa ="+_OBJ.IDEN_PRESTAZIONI[i];
//			alert("v_sql "  + v_sql);
			var iden_esa = "";
			dwr.engine.setAsync(false);
			toolKitDB.getResultData(v_sql,function(rs){
	                if(rs[0] != "-1"){
                    		iden_esa = rs[0];
                	  }
			  else{
				alert("Attenzione, verificare validita': " +  v_sql);
			  }			
            }); 
			dwr.engine.setAsync(true);

            E_DB.XML+="<PR>";
            E_DB.XML+="<PP>"+v.PROGRESSIVO_PRESTAZIONE+"</PP>";
//            E_DB.XML+= "<CODICE_STRUTTURA_PRENOTANTE>999910</CODICE_STRUTTURA_PRENOTANTE>";
            //E_DB.XML+="<STATO_PROCESSO>IP</STATO_PROCESSO>";
            E_DB.XML+="<STP>VA</STP>";
            E_DB.XML+="<CMM>"+v.CODICE_PRESTAZIONE_DMR+"</CMM>";
			E_DB.XML+="<CUR>"+v.CODICENOMENCLATOREREGIONALE+"</CUR>";
            E_DB.XML+="<IE>"+iden_esa+"</IE>";
            E_DB.XML+="</PR>";
			// 10-5-2016
			var index = $.inArray(iden_esa,arrprestazioni);
			arrprestazioni.splice(index,1);			
			// ***********			
			i++;
      });
      E_DB.XML += "</LP>";
      E_DB.XML+="</ED>";
      return E_DB.XML;
  }
};

var NS_RE_SARPED = {
	IDEN_PRESTAZIONI:null,
	PC:null,
	XML:null,
	init:function(_obj){
		$("[name='Hiden_medi']").val(_obj.IDEN_PER);
		/*{NRE:"080A030112333","CODICE_AUTENTICAZIONE_SAC":"1234567898754",PC:"NB_LUCAD","IDEN_PRESTAZIONI":"123456,456879","CODICE_SOLE":"Y030AKKLASD","IDEN_ANAG":"12345","IDEN_PER":"12345"}*/
		
		NS_RE_SARPED.IDEN_PRESTAZIONI = _obj.IDEN_PRESTAZIONI;
		NS_RE_SARPED.PC = _obj.PC;
		OPERATORE.getDatiOperatore(_obj);
	       var _url=DEMA_SAVONA.URL_MIDDLEWARE;
		v_sql ="select COD_FISC FROM ANAG WHERE IDEN = " + _obj.IDEN_ANAG;
		var cod_fisc ="";
		dwr.engine.setAsync(false);
		toolKitDB.getResultData(v_sql,function(rs){
				cod_fisc = rs[0];  
		});
		dwr.engine.setAsync(true);
		var dataToSend={
				"NRE":_obj.NRE,
				"CODFISC_PAZ":cod_fisc,
				"TIPOOPERAZIONE":'1'
			};   
        jQuery.support.cors = true;
        $.ajax({
            url: "proxy",
            data:"CALL="+_url+"&PARAM=INPUT="+JSON.stringify(dataToSend),
            type: "POST",
            dataType: 'json',
			async:false,
            contentType:"application/x-www-form-urlencoded",
            success: function (resp)
            {
				var obj = resp;
				obj.IDEN_PRESTAZIONI = NS_RE_SARPED.IDEN_PRESTAZIONI;
				obj.PC = NS_RE_SARPED.PC;
				NS_RE_SARPED.elabora(obj);
            },
            timeout:40000,
            error: function (resp)
            {
		alert("errore " + resp);
            }
        });
		return NS_RE_SARPED.XML;
	},
	elabora:function(resp){
		dwr.engine.setAsync(false);
        if(resp.CODICE_ESENZIONE_PATOLOGIA && resp.CODICE_ESENZIONE_PATOLOGIA != "N"){
            v_sql ="select FNC_SOLE_GET_ESENZIONE('"+resp.CODICE_ESENZIONE_PATOLOGIA+"') as v_iden_esenzione from dual";
            toolKitDB.getResultData(v_sql,function(rs){
                if(rs[0] !="-1"){
                    resp.IDEN_ESENZIONE_PATOLOGIA = rs[0];  
                }
            });
        }
		$("[name='Hiden_esenzione']").val(resp.IDEN_ESENZIONE_PATOLOGIA);
        if(resp.CODICE_TICKET && resp.CODICE_TICKET != ""){
            v_sql ="select FNC_SOLE_GET_TICKET('"+resp.CODICE_TICKET+"') as v_iden_tick from dual";
            toolKitDB.getResultData(v_sql,function(rs){
                if(rs[0] != "-1"){
                    resp.IDEN_TICK = rs[0];
                }
            });   
        }
		if(resp.CODICE_ESENZIONE_PATOLOGIA && resp.CODICE_ESENZIONE_PATOLOGIA !="N" && resp.CODICE_ESENZIONE_PATOLOGIA!=""){
			resp.IDEN_TICK = 87;
		}
		else
		{
			resp.IDEN_TICK = 6;
		}
		if(resp.CODICE_MEDICO !=""){
            v_sql ="SELECT IDEN FROM TAB_PER WHERE COD_FISC='"+resp.CODICE_MEDICO+"'";
            toolKitDB.getResultData(v_sql,function(rs){
                try{
                    resp.IDEN_MEDICO = rs[0];
                }catch(e){
					resp.IDEN_MEDICO = "6636";
				}
            }); 
		}
		dwr.engine.setAsync(true);
		$("[name='Hiden_medi']").val(resp.IDEN_MEDICO);
		$("[name='selTicket']").val(resp.IDEN_TICK.toString().trim());
		$("[name='Hiden_tick']").val(resp.IDEN_TICK.toString().trim());
		$("[name='dataricetta']").val(DATE.formatVisualeDT(resp.DATA_RICETTA));
		NS_RE_SARPED.XML = E_DB.gesXml(resp);
	}
}

var OPERATORE = {
    CODICE_FISCALE:"",
    CODICE_REGIONALE:"",
    CODICE:"",
    COGNOME:"",
    NOME:"",
    init:function(){
        OPERATORE.CODICE_FISCALE="";
        OPERATORE.CODICE_REGIONALE="";
        OPERATORE.CODICE="";
        OPERATORE.COGNOME="";
        OPERATORE.NOME="";
    },
    getDatiOperatore:function (_obj)
    {
	dwr.engine.setAsync(false);
	toolKitDB.getResultData("select cod_fisc,indirizzo3,cod_dec,cognome,nome from tab_per where iden=" + _obj.IDEN_PER, function(r){
            OPERATORE.CODICE_FISCALE=r[0];
            OPERATORE.CODICE_REGIONALE=r[1];
            OPERATORE.CODICE=r[2];
            OPERATORE.COGNOME=r[3];
            OPERATORE.NOME=r[4];
        });
	dwr.engine.setAsync(true);
    },
    generaDatiOperatoreAsl:function()
    {
	return "::CODFISC_OP=" + OPERATORE.CODICE_FISCALE + "::CODOP=" + OPERATORE.CODICE + "::CODAUSL_OP=" + OPERATORE.CODICE_REGIONALE;
    }
};

var DATE ={
    formatVisualeDT :function(val){

        if(val!="" && val != null)
            return val.substring(8,10) + "/" + val.substring(5,7) + "/" + val.substring(0,4); //+ " " + val.substring(11,13) + ":" + val.substring(14,16) + ":" +val.substring(17,19) ;
    }
};