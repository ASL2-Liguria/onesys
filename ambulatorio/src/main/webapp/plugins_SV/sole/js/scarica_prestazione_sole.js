//LAGOSANTO 
var NS_SARPED = {
	getParam:null,
    varJSON:null,
    varJSONPAZIENTE:null,
    IDEN_PRESTAZIONI_RIS:"",
	statoEsame:"",
	nPrestazioni:"",
	procedi:false,
    init:function(){
        PAZIENTE.init();
        OPERATORE.init();
        NS_SARPED.varJSON=null;
        NS_SARPED.varJSONPAZIENTE=null;
        NS_SARPED.load();
    },
	parseGetVars: function()
	{
	  // creo una array
	  var args = new Array();
	  // individuo la query (cioè tutto quello che sta a destra del ?)
	  // per farlo uso il metodo substring della proprietà search
	  // dell'oggetto location
	  var query = window.location.search.substring(1);
	  // se c'è una querystring procedo alla sua analisi
	  if (query)
	  {
		// divido la querystring in blocchi sulla base del carattere &
		// (il carattere & è usato per concatenare i diversi parametri della URL)
		var strList = query.split('&');
		// faccio un ciclo per leggere i blocchi individuati nella querystring
		for(str in strList)
		{
		  // divido ogni blocco mediante il simbolo uguale
		  // (uguale è usato per l'assegnazione del valore)
		  var parts = strList[str].split('=');
		  // inserisco nella array args l'accoppiata nome = valore di ciascun
		  // parametro presente nella querystring
		  args[unescape(parts[0])] = unescape(parts[1]);
		}
	  }
	  return args;
	},
    load:function(){
		getParam=NS_SARPED.parseGetVars();
        var v_cod_fisc ="";
        var v_iden_anag ="";
		var bolSorgenteWkAnag = false;
		try{
			if (typeof (opener.array_iden_anag) =='undefined') { 
				bolSorgenteWkAnag = true;
			}
			if (bolSorgenteWkAnag){
				if(typeof opener.codice_fiscale !='undefined'){
					v_cod_fisc = opener.stringa_codici(opener.codice_fiscale).toString().split('*')[0];
					v_iden_anag = opener.stringa_codici(opener.iden).toString().split('*')[0];
				}else{
					v_cod_fisc = opener.stringa_codici(opener.array_cod_fisc).toString().split('*')[0];
					v_iden_anag = opener.stringa_codici(opener.iden).toString().split('*')[0];            
				}
			}
			else{
				v_cod_fisc = opener.stringa_codici(opener.array_cod_fisc).toString().split('*')[0];
				v_iden_anag = opener.stringa_codici(opener.array_iden_anag).toString().split('*')[0];            			
			}
		}
		catch(e){
			// arrivo da da wk principale o da wk_esa_x_paz
			alert("Error in loading " + e.description );
		}
		PAZIENTE.CODICE_FISCALE=v_cod_fisc.toUpperCase();
		try{	$("#codiceFiscalePaziente").focus();}catch(e){;}
		if(PAZIENTE.CODICE_FISCALE!="")
		{
			$("#codiceFiscalePaziente").val(PAZIENTE.CODICE_FISCALE);	
			PAZIENTE.IDEN_ANAG=v_iden_anag;
		}
		OPERATORE.getDatiOperatore();      
        $("#NRE").on("keypress",function(){
            $(this).val($(this).val().toUpperCase());
        });
		
		// 
		/*
		$("#NRE").keypress(function(e) {
			if(e.which == 13 || e.which == 10) {
				NS_SARPED.ScaricaPrescrizione('I');
			}
		});*/
		$("#btPrenota").hide();
		$("#poligrafico,#lblPoligrafico").hide();
		if (!getParam['idenEsami'])
		{
			$("#TipoRossaManuale").attr('disabled', true);
			$("#TipoRossaManuale,#lblTipoRossaManuale").hide();
		}
		else
		{
			$("#TipoRossaInfo").attr('disabled', true);
			$("#TipoRossaInfo,#lblTipoRossaInfo").hide();
		}
		$("input[name='tipoRicetta']").change(function()
		{
			if($("input[name='tipoRicetta']:checked").val()=="MANUALE")
			{
				$("#btScarica").text("Modifica")//$("#datiRicettaManuale").show();
				$("#lblNRE").text("Codice Ricetta - Poligrafico");
			}
			else if($("input[name='tipoRicetta']:checked").val()=="INFO")
			{
				//$("#btScarica").text("Modifica")//$("#datiRicettaManuale").show();
				//$("#lblNRE").text("Codice Ricetta - Poligrafico");
				$("#poligrafico,#lblPoligrafico").show();
			}
			else{
				$("#btScarica").text("Scarica")//$("#datiRicettaManuale").hide();
				$("#lblNRE").text("Codice Ricetta - NRE");
				$("#poligrafico,#lblPoligrafico").hide();
			}
		});

    },
	AnnullaScarico:function(param)
	{
		if(param=='UNLOAD') 
		{
			$("#btClose").attr("disabled",true);
		}
		if ((param!='UNLOAD' || (param=='UNLOAD' && !NS_SARPED.procedi)) && !NS_SARPED.checkAccettato())
		{
			if(NS_SARPED.varJSON != null && NS_SARPED.varJSON.NRE)
			{
				NS_SARPED.ScaricaPrescrizione('A');
			}
		}
						
	},
	checkAccettato: function()
	{
		var ret = false;
		try
		{
			if (NS_SARPED.varJSON.LISTA_PRESTAZIONI)
			{
				$.each(NS_SARPED.varJSON.LISTA_PRESTAZIONI,function(k1,v1){
					if (v1.EROGABILE=='A' || v1.EROGABILE == 'N')
					{
						ret=true;
					}
				});
			}
		}
		catch(e)
		{
			ret=false;
		}
		return ret;
	},
    ScaricaPrescrizione:function(parametro){
		if($('input[name=tipoRicetta]:checked').size()==0)
		{
			alert("selezionare una tipologia di ricetta");
			return;
		}
		if($("#NRE").val()=="")
		{
			alert("Inserire il codice ricetta - "+($('input[name=tipoRicetta]:checked').val()=='MANUALE'?"Poligrafico":"NRE"));
			return;
		}
		if ($('input[name=tipoRicetta]:checked').val()=='INFO')
		{
			if($("#poligrafico").val()==""){
				alert("Inserire il codice ricetta - Poligrafico");
				return;
			}
			if (!NS_SARPED.verificaPoligrafico($("#poligrafico").val()))
			{
				// modifica 14-6-16
				$("#poligrafico").focus().val("");
				alert("Il codice poligrafico della ricetta inserito non \u00E8 corretto. Impossibile continuare");
				return;
				//if (!confirm("il codice poligrafico della ricetta inserito non è corretto. Siete sicuri di associare come impegnativa questo codice?")) return;
				// *************************
			}
		}
		if (parametro=='I') NS_SARPED.AnnullaScarico('NUOVO');//prima annullo la presa in carico precedente se presente

		NS_SARPED.statoEsame = getParam["stato"];
		
		if ($('input[name=tipoRicetta]:checked').val()=='MANUALE')
		{
			if (!NS_SARPED.verificaPoligrafico($("#NRE").val()))
			{
				// modifica 14-6-16
				$("#NRE").focus().val("");
				alert("Il codice poligrafico della ricetta inserito non \u00E8 corretto. Impossibile continuare");
				return;
				//if (!confirm("il codice poligrafico della ricetta inserito non è corretto. Siete sicuri di associare come impegnativa questo codice?")) return;
				// *************************				
			}
			var doc=document.form_accetta_paziente;
			doc.Hiden_esame.value = getParam['idenEsami'].toString();	
			doc.Hiden_anag.value = "";
			doc.tipo_registrazione.value = (getParam["stato"]=="E"?"E":"M");	
			doc.target="_self";
			doc.extra_db.value = "<MANUALE>"+$("#NRE").val()+"</MANUALE><STATO>"+NS_SARPED.statoEsame+"</STATO>";
			doc.action = "../../schedaEsame";	
			// ***
			doc.Hservlet_succ.value = "javascript:opener.worklist_esami(" + PAZIENTE.IDEN_ANAG + ");self.close();";

			// modifica 31-8-16
			if (getParam['idenEsamiOrigin'].toString() != getParam['idenEsami'].toString()){
				alert("Attenzione: verr\u00E0 associato il numero poligrafico alle sole prestazioni ove mancava, solamente queste cambieranno di stato.\nVerificare che il cambio di stato venga effettuato su tutte le prestazioni selezionate.\nAltrimenti procedere manualmente al cambio di stato desiderato.");
			}		
			// **************

			doc.submit();
			return;

			/*var risultato=false;
			var query = "update esami set numimp_numrich='"+$("#NRE").val()+"', data_rice='"+$("#DataRicettaManuale").val()+"',IDEN_MEDI='"+($("#MedicoPrescrittoreManuale").val() != "" ? $("#hMedicoPrescrittoreManuale").val() : "" )+"'  where iden in("+getParam['idenEsami'].toString().replace(/\g,',')+")";
			dwr.engine.setAsync(false);
			toolKitDB.executeQueryData(query,function(res){
				if (isNaN(res)) alert(res);
				else{
					alert ("aggiornamento impegnativa completato con successo.");
					risultato = true;
				} 
			});
			dwr.engine.setAsync(true);
			if (risultato){
				opener.aggiornaDema();
				self.close();
			}
			return;*/
			
		}
		
		if(parametro=='I' && $("#NRE").val()=="" && $("#codiceSole").val()=="")
        {	
           alert("Impossibile continuare inserire NRE e Codice Fiscale valido");
           return;
        }
		if ($("#codiceFiscalePaziente").val()=="" || typeof ($("#codiceFiscalePaziente").val()) == "undefined"){
			alert("Impossibile continuare. Inserire un codice fiscale valido per l'anagrafica.");
			self.close();
			return;
		}		
        var dataToSend;
		var tipoOperazione;
		var NRE;
		if (parametro=='I')
		{
			tipoOperazione='1';
			NRE=$("#NRE").val();
		}
		else if (parametro=='A') 
		{
			tipoOperazione='3';
			NRE=NS_SARPED.varJSON.NRE;
		}
			
        if(NRE!=""){

			// modifica 31-8-16
			dataToSend={
				"NRE":NRE,
				"CODFISC_PAZ":$("#codiceFiscalePaziente").val(),
				"TIPOOPERAZIONE":tipoOperazione,
				"UTENTE":"AMBU_SCARICO"
			};
			// **************

			if ($('input[name=tipoRicetta]:checked').val()=='INFO' && parametro=='I') dataToSend.FLAGRICETTAROSSA=1;
			OPERATORE.generaDatiOperatoreAsl();    
            LOGGER.write("Ricetta Dematerializzata");
		}
		
        $("#imgLoader").show();
        var _url=DEMA_SAVONA.URL_MIDDLEWARE+"&INPUT=";
        LOGGER.write(_url + JSON.stringify(dataToSend));
        jQuery.support.cors = true;
        $.ajax({
            url: "../../proxy",
			data:"CALL="+_url+"&PARAM=INPUT="+JSON.stringify(dataToSend),
            cache: false,
            type: "POST",
            crossDomain: false,
			async:parametro=='I'?true:false,
            dataType: 'json',
            contentType:"application/x-www-form-urlencoded",
            success: function (resp)
            {
				var esito_annullamento="";
				var errore="";
                    if (parametro=='I')
					{
						NS_SARPED.varJSON=resp;
						NS_SARPED.varJSONPAZIENTE=NS_SARPED.varJSON.PAZIENTE;
						var _re = JSON.stringify(NS_SARPED.varJSON);
						LOGGER.write(_re);
						NS_SARPED.elaboraDati(parametro);
						$("#imgLoader").hide();
					}
					else if(parametro=='A')
					{
						if(!resp.ERRORE_APPLICATIVO)
						{
							esito_annullamento="OK";
						}
						else
						{
							esito_annullamento="KO";
							errore=resp.ERRORE_APPLICATIVO[0].CODESITO;
						}
						NS_SARPED.logAnnullamento(JSON.stringify(dataToSend),JSON.stringify(resp),errore,esito_annullamento,NRE,  getHomeFrame().baseUser.IDEN_PER);
					}
					
            },
            timeout:150000,
            error: function (resp)
            {
                    $("#imgLoader").hide();
                    alert('Impossibile scaricare dati');
					NS_SARPED.logAnnullamento(JSON.stringify(dataToSend),JSON.stringify(resp),'','KO',NRE,  getHomeFrame().baseUser.IDEN_PER);
                    //$("#btSarpedOffline").show();
                    //$("#btAccetta").show();
                    //$("#btPrenota").show();
            }
        });
       
    },
	verificaPoligrafico : function(impegnativa)
	{
		
		var query = "{call ? := VERIFICA_IMPEGNATIVA_DD('" + impegnativa + "','I')}";
		var ritorno = true;	
		dwr.engine.setAsync(false);	
		toolKitDB.executeFunctionData(query,  function(data){	
			risp=data;
			if(risp == 1) {
				ritorno = false;
			}	
		});
		dwr.engine.setAsync(true);
		
		return ritorno;
	},
	
	logAnnullamento: function(sendMsg, respMsg, error,errorMessage, NRE, UTE_INS)
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
    elaboraDati:function(tipo){
        if(NS_SARPED.varJSON.TIPOLOGIA_PRESCRIZIONE != "INFORMATIZZATA"){
            if(NS_SARPED.varJSON.ERRORE_APPLICATIVO || NS_SARPED.varJSON.TIPO_DOCUMENTO=="")
            {
                var stringaError=""
				for(var i = 0; i<NS_SARPED.varJSON.ERRORE_APPLICATIVO.length;i++)
				{
					stringaError+="Errore " + NS_SARPED.varJSON.ERRORE_APPLICATIVO[i].TIPOERRORE + "\r\n" + NS_SARPED.varJSON
.ERRORE_APPLICATIVO[i].ESITO + "\r\n" +"\r\n";
				}
				alert(stringaError);
				NS_SARPED.varJSON.NRE="";
                //$("#btSarpedOffline").show();
                //$("#btAccetta").show();
                //$("#btPrenota").hide();
                return;
            }
            
        }
        if(NS_SARPED.varJSON.ERRORE)
        {
				var stringaError=""
				for(var i = 0; i<NS_SARPED.varJSON.ERRORE.length;i++)
				{
					if(NS_SARPED.varJSON.ERRORE[i].CODESITO = "0000") continue;
					stringaError+="Errore" + NS_SARPED.varJSON.ERRORE[i].TIPOERRORE + "\r\n" + NS_SARPED.varJSON.ERRORE[i].ESITO + "\r\n" +"\r\n";
				}
				if (stringaError!="")
				{
					var continueErrore= confirm("Attenzione :" + stringaError + "\r\nContinuare?")
					if(!continueErrore)
					{
							NS_SARPED.varJSON.NRE = "";
							return;
					}
				}
        }
        //Gestione Paziente
        /*if(PAZIENTE.IDEN_ANAG=="")
        {
                PAZIENTE.IDEN_ANAG=PAZIENTE.ricercaAnagrafica();
        }*/
        
		PAZIENTE.IDEN_ANAG=PAZIENTE.ricercaAnagrafica();
               //Controllo se per i miei cdc posso erogare la perstazione o le prestazioni.
        dwr.engine.setAsync(false);
        var v_cdc_associati =  getHomeFrame().baseUser.LISTAREPARTI;
        var stato_prescrizione = NS_SARPED.varJSON.STATO_PRESCRIZIONE;
        var vTipoPrescrizione = NS_SARPED.varJSON.TIPOLOGIA_PRESCRIZIONE;
        var v_sql;
		NS_SARPED.nPrestazioni=0;
            $.each(NS_SARPED.varJSON.LISTA_PRESTAZIONI,function(k1,v1){
				if( NS_SARPED.varJSON.TIPOLOGIA_PRESCRIZIONE != "INFORMATIZZATA"){
					v_sql = "select IDEN,EROGABILE,DESCRIZIONE_RIS from table(get_prestazioni_ambulatorio_dd('"+v_cdc_associati+
"','"+v1.CODICE_PRESTAZIONE_DMR+"','"+v1.CODICENOMENCLATOREREGIONALE+"','"+stato_prescrizione+"','"+v1.
STATO_PRESTAZIONE+"','"+vTipoPrescrizione+"','"+(v1.CODICE_PRENOTAZIONE?v1.CODICE_PRENOTAZIONE:'')+"','"+
v1.PROGRESSIVO_PRESTAZIONE+"','"+NS_SARPED.varJSON.CODICE_AUTENTICAZIONE_SAC+"'))";
				}else{
					
					v_sql = "select IDEN,EROGABILE,DESCRIZIONE_RIS from table(get_prestazioni_ambulatorio_dd('"+v_cdc_associati+
"','"+v1.CODICE_PRESTAZIONE_DMR+"','"+v1.CODICENOMENCLATOREREGIONALE+"','"+stato_prescrizione+"','"+v1.
STATO_PRESTAZIONE+"','"+vTipoPrescrizione+"','"+v1.CODICE_PRESCRIZIONE+"',null,null))";
				}
                toolKitDB.getResultData(v_sql,function(resp){
                    v1.IDEN_ESA=resp[0];
                    v1.EROGABILE=resp[1];
                    v1.DESCRIZIONE_RIS=resp[2];
                });
				NS_SARPED.nPrestazioni++;
            });
        
        if(NS_SARPED.varJSON.CODICE_ESENZIONE_PATOLOGIA && NS_SARPED.varJSON.CODICE_ESENZIONE_PATOLOGIA != "N"){
            v_sql ="select FNC_SOLE_GET_ESENZIONE('"+NS_SARPED.varJSON.CODICE_ESENZIONE_PATOLOGIA+"') as v_iden_esenzione from dual";
            toolKitDB.getResultData(v_sql,function(rs){
                if(rs[0] !="-1"){
                    NS_SARPED.varJSON.IDEN_ESENZIONE_PATOLOGIA = rs[0];     
                }
            });
        }
        if(NS_SARPED.varJSON.CODICE_TICKET){
            v_sql ="select FNC_SOLE_GET_TICKET('"+NS_SARPED.varJSON.CODICE_TICKET+"') as v_iden_tick from dual";
//alert(v_sql);
            toolKitDB.getResultData(v_sql,function(rs){
                if(rs[0] != "-1"){
                    NS_SARPED.varJSON.IDEN_TICK = rs[0];
                }
                    
            });   
        }
		if(NS_SARPED.varJSON.CODICE_ESENZIONE_PATOLOGIA && NS_SARPED.varJSON.CODICE_ESENZIONE_PATOLOGIA !="N" && NS_SARPED.varJSON.CODICE_ESENZIONE_PATOLOGIA!=""){
			// valore cablato
			// esenzione totale
			NS_SARPED.varJSON.IDEN_TICK = 87;
		}
		else
		{
			// valore cablato
			// ticket
			NS_SARPED.varJSON.IDEN_TICK = 6;
		}
        v_sql = "select (sysdate - to_date('"+NS_SARPED.varJSON.DATA_RICETTA+"','yyyy-MM-dd HH24:mi:ss') ) from dual";
        toolKitDB.getResultData(v_sql,function(rs){
            if(rs!=null){
                if(rs > 10000){
                    NS_SARPED.varJSON.SCADUTA ="S";
                }
            }
        });
		if(NS_SARPED.varJSON.CODICE_MEDICO){
            v_sql ="SELECT IDEN FROM TAB_PER WHERE COD_FISC='"+NS_SARPED.varJSON.CODICE_MEDICO+"' and tipo ='M'";
            toolKitDB.getResultData(v_sql,function(rs){
                try{
                    NS_SARPED.varJSON.IDEN_MEDICO = rs[0];
                }catch(e){
					//se il medico non è presente nella base dati non memorizzare nessun medico					
//					NS_SARPED.varJSON.IDEN_MEDICO = "6636";
					// NS_SARPED.varJSON.IDEN_MEDICO = "4134";
				}
            }); 
		}
		if (getParam['idenEsami'])
		{
			var arrayIdenEsami=getParam['idenEsami'].toString().split('*');
			// modifica 31-8-16
			var arrayIdenEsamiOrigin=getParam['idenEsamiOrigin'].toString().split('*');
			// *************
			var aler = "";
			var nonaler = "";
			var array_progressivo_prestazione = new Array();
			var arrayIdenEsamiSel = new Array();
			$.each(NS_SARPED.varJSON.LISTA_PRESTAZIONI,function(k1,v1){
			
				if (arrayIdenEsami.length!=0 && (v1.EROGABILE=='S' || v1.EROGABILE=='K'))
				{
					var query = "select te.descr, datetimeconverter(e.dat_esa, 'yyyymmdd', 'dd/mm/yyyy') || ' ' || e.ora_esa, e.iden, e.iden_esa from esami e inner join tab_esa te on e.iden_esa = te.iden where e.iden in (" + arrayIdenEsami.toString() + ") and exists (select * from cod_est_tab_esa cete where cete.iden_esa = e.iden_esa and cete.cod1 = '" + v1.CODICENOMENCLATOREREGIONALE + "')";
					toolKitDB.getResultData(query, function(result){
						if(result)
						{
							aler += "è presente l'esame "+ result[0] + " previsto in data " + result[1] + " associabile alla prestazione " + v1.DESCRIZIONE_PRESTAZIONE + " della ricetta;\n";
							array_progressivo_prestazione.push(v1.PROGRESSIVO_PRESTAZIONE);
							arrayIdenEsamiSel.push(result[2]);
							for(var i = arrayIdenEsami.length - 1; i >= 0; i--) {
								if(arrayIdenEsami[i] === result[2]) {
								   arrayIdenEsami.splice(i, 1);
								   v1.IDEN_ESA = result[3];
								   break;
								}
							}
						}
						else
						{
							noaler = "invece non è stato possibile trovare l'esame da associare alla prestazione "+ v1.DESCRIZIONE_PRESTAZIONE + " della ricetta";
						}
					});
				}
			});
			if (aler== "") alert("Non è stato trovato nessun esame delle ricetta associabile agli esami selezionati");
			else
			{
				aler = "Attenzione, per il numero di ricetta " + NS_SARPED.varJSON.NRE + " del paziente " + PAZIENTE.COGNOME + " " + PAZIENTE.NOME + ",\n" + aler + "Si vuole associare tali prestazioni?";
				// modifica 31-8-16
				var arrayIdenEsami = NS_SARPED.removeElementArray(arrayIdenEsamiOrigin,getParam['idenEsami'].toString().split('*')).concat(arrayIdenEsamiSel);
				if (confirm(aler)) NS_SARPED.associazioneRicetta(array_progressivo_prestazione, arrayIdenEsamiSel,arrayIdenEsami);
				// **********
			}
			self.close();
			return;
		}
        dwr.engine.setAsync(true);
        /*COSTRUISCO HTML*/
        HTML.reset();
        HTML.creaWk();
        
        $("#btAccetta").show();
        $("#btPrenota").show();
    },
	// modifica 31-8-16
	removeElementArray: function(arrayOrigin, arrayToRemove)
	{
		for( var i=arrayOrigin.length - 1; i>=0; i--){
			for( var j=0; j<arrayToRemove.length; j++){
				if(arrayOrigin[i] && (arrayOrigin[i] === arrayToRemove[j])){
					arrayOrigin.splice(i, 1);
				}
			}
		}
		return arrayOrigin;
	},
	associazioneRicetta: function(array_progressivo_prestazione, arrayIdenEsamiSel,arrayIdenEsami)
	{
		var vUrgenza="";
        var v_data_ricetta = "";
		var idenEsenzionePatologia = "";
		var idenTick = "";
		var quadro_clinico="";
		var quesito = "";
		var extra_db = "";
		var impegnativa = "";
		var idenModPrescr = "";
        if(NS_SARPED.varJSON.DATA_RICETTA!=""){
            v_data_ricetta = NS_SARPED.varJSON.DATA_RICETTA.substring(0,4)+NS_SARPED.varJSON.DATA_RICETTA.substring(5,7)+
NS_SARPED.varJSON.DATA_RICETTA.substring(8,10);
        }
		if(NS_SARPED.varJSON.IDEN_ESENZIONE_PATOLOGIA) idenEsenzionePatologia = NS_SARPED.varJSON.IDEN_ESENZIONE_PATOLOGIA;
		else idenEsenzionePatologia = "";
        if(NS_SARPED.varJSON.IDEN_TICK) idenTick = NS_SARPED.varJSON.IDEN_TICK;
        else idenTick = "";
		if(NS_SARPED.varJSON.LISTA_PRESTAZIONI[0].QUADRO_CLINICO) quadro_clinico= NS_SARPED.varJSON.LISTA_PRESTAZIONI[0].QUADRO_CLINICO;
		else quadro_clinico= "";
        if(NS_SARPED.varJSON.LISTA_PRESTAZIONI[0].QUESITO) quesito= NS_SARPED.varJSON.LISTA_PRESTAZIONI[0].QUESITO;
		else quesito = "";
		EXTRA_DB.gesXmlAssocia(array_progressivo_prestazione);
        //if (EXTRA_DB.XML != null) doc.extra_db.value=EXTRA_DB.XML;
        impegnativa=NS_SARPED.varJSON.NRE;
		var v_medico="";
		if(typeof NS_SARPED.varJSON.IDEN_MEDICO == 'undefined'){
				v_medico="";
		}else{
				v_medico=NS_SARPED.varJSON.IDEN_MEDICO ;
		}
		//doc.Hiden_pro.value="4462";
		// DA RIVEDERE CABLAGGI
		idenModPrescr="161";
		var vmod_acc = "";
		if(NS_SARPED.varJSON.TIPOLOGIA_PRESCRIZIONE == "INFORMATIZZATA"){
			switch(NS_SARPED.varJSON.LISTA_PRESTAZIONI[0].URGENZA){
					case "S":
							vUrgenza="U";
							vmod_acc="3";
							break;
					case "A":
							vUrgenza="B";
							vmod_acc="2";
							break;
					case "R":
							vUrgenza="D";
							vmod_acc="4";
							break;
					case "C":
							vmod_acc="1";
							vUrgenza="P";
							break;
					default:
							vmod_acc="";
							vUrgenza="";
							break;
			}
		}else{
			vUrgenza = NS_SARPED.varJSON.LISTA_PRESTAZIONI[0].URGENZA;
				switch(vUrgenza){
					case "U":{
							vmod_acc="3";
							break;
					}
					case "B":{
							vmod_acc="2";
							break;
					}
					case "D":{
							vmod_acc="4";
							break;
					}
					case "P":{
							vmod_acc="1";
							break;
					}
					default:
							vmod_acc="";
							vUrgenza="";
							break;					
				}
		}
		/*if(NS_SARPED.varJSON.LISTA_PRESTAZIONI[0].URGENZA)
		{
			doc.Hiden_mod_acc.value=vmod_acc;
			doc.Hcodice_lea.value=vUrgenza;
		}*/
        //doc.txtCodEsterno6.value=NS_SARPED.varJSON.LISTA_PRESTAZIONI[0].CODICE_PRESCRIZIONE_SOLE;
        /*var v_sql = "select get_progressivoaccettazione() from dual";
        var num_pre ="";
        dwr.engine.setAsync(false);
        toolKitDB.getResultData(v_sql,function(rs){
            num_pre = rs[0];
        });
		doc.Hnum_pre.value =num_pre;*/
        
		//aggiornamento esami
		var query = "";
		query="data_rice = '"+v_data_ricetta+"'";
		if (vUrgenza) query += ", LEA_CLASSE_PRIORITA ='" + vUrgenza + "'";
		query += ", IDEN_ESENZIONE_PATOLOGIA = '" + idenEsenzionePatologia + "'";
		query += ", IDEN_TICK = '" + idenTick + "'";
		if (quadro_clinico != "") query += ", QUADRO_CLI = '"+quadro_clinico+"'";
		query += ", QUESITO = '" + quesito + "'";
		query += ", NUMIMP_NUMRICH = '" + impegnativa + "'";
		if (v_medico != "") query += ", IDEN_MEDI = " + v_medico;
		
		//query += ", IDEN_MOD_PRESCRITTIVA = '" + idenModPrescr + "'";
		//query += ", IDEN_MOD_ACCESSO = '" + idenModPrescr + "'";
		query = "update esami set " + query + " where iden in ("+arrayIdenEsamiSel.toString()+")";
		toolKitDB.executeQueryData(query, function(result)
		{
			if(isNaN(result)) alert(result);
			else
			{
				var queryExtraDB = "BEGIN sp_extra_esami('" + EXTRA_DB.XML + "','','','" + arrayIdenEsamiSel.toString() + "'); END;";
				toolKitDB.executeQueryData(queryExtraDB, function(res)
				{
					if(isNaN(res)) alert(res);
					else
					{
						// modifica 31-8-16						
						if(NS_SARPED.statoEsame == "A")
						{
							window.opener.accettaEsameNew(arrayIdenEsami.toString().replace(/\,/g,'*'));
							// window.opener.accettaEsameNew(getParam['idenEsami'].toString());
						}
						else if(NS_SARPED.statoEsame == "E")
						{
							window.opener.esegui4(arrayIdenEsami);
							//window.opener.esegui4();
						}
						// **********
						NS_SARPED.procedi=true;
					}
				});
			}
		});
		dwr.engine.setAsync(true);
	},
    gestioneApertura:function()
    {
        
        var iden_prest = "";
        var arr_progressivo ="";
        var v_no_erog_selected=false;
        $.each($("#oTablePresc tr"),function(k,v){
                if($(v).hasClass("trSelected")){
                        if($(v).attr("erogabile") != "S"){
                                v_no_erog_selected = true;
                        }else{

                                iden_prest += $(v).attr("iden_esa") +"*";
                                arr_progressivo += $(v).attr("progressivo") +"*";
                        }
                }
        });

        NS_SARPED.IDEN_PRESTAZIONI_RIS = iden_prest.substring(0,iden_prest.length - 1);
        NS_SARPED.PROGRESSIVO_PRESTAZIONI_RIS = arr_progressivo.substring(0,arr_progressivo.length - 1);
        if(NS_SARPED.check()){
            if (NS_SARPED.varJSON.CODICE_AUTENTICAZIONE_SAC) EXTRA_DB.gesXml();
            var v_conf ;
            if(v_no_erog_selected){
                alert("Attenzione! Sono state selezionate prestazioni non erogabili o già presenti");
                return false;
            }else{
                return true;
            }
        }else{
            return false;
        }  
    },
    Accetta:function(){
        var gest = NS_SARPED.gestioneApertura();
        if(gest){
            NS_SARPED.apriSchedaEsameAcc();    
        }    
    },
    apriSchedaEsameAcc:function(){
        NS_SARPED.inserimentoEsameSole("I");        
    },
    inserimentoEsameSole:function(_tipo){
	var bolSorgenteWkAnag = false;
        var doc=document.form_accetta_paziente;
        var ticket="";
        var esenzione="";
        var vUrgenza="";
        var v_data_ricetta = "";
	if (typeof (opener.array_iden_anag) =='undefined') { 
		bolSorgenteWkAnag = true;
	}

        if(NS_SARPED.varJSON.DATA_RICETTA!=""){
            v_data_ricetta = NS_SARPED.varJSON.DATA_RICETTA.substring(0,4)+NS_SARPED.varJSON.DATA_RICETTA.substring(5,7)+
NS_SARPED.varJSON.DATA_RICETTA.substring(8,10);
        }
        doc.Hiden_esa.value=NS_SARPED.IDEN_PRESTAZIONI_RIS;
        doc.Hiden_anag.value=PAZIENTE.IDEN_ANAG;
		if(NS_SARPED.varJSON.IDEN_ESENZIONE_PATOLOGIA){
			if (NS_SARPED.varJSON.IDEN_ESENZIONE_PATOLOGIA!="undefined" && typeof(NS_SARPED.varJSON.IDEN_ESENZIONE_PATOLOGIA)!="undefined"){
				doc.Hiden_esenzione.value = NS_SARPED.varJSON.IDEN_ESENZIONE_PATOLOGIA;
			}
			else{
				doc.Hiden_esenzione.value = "";
			}	 
		}
		else{
			doc.Hiden_esenzione.value = "";
		}
        if(NS_SARPED.varJSON.IDEN_TICK) doc.Hiden_tick.value = NS_SARPED.varJSON.IDEN_TICK;
	        else doc.Hiden_tick.value = "";
		if(NS_SARPED.varJSON.LISTA_PRESTAZIONI[0].QUADRO_CLINICO) doc.txtQuadroClinico.value= NS_SARPED.varJSON.LISTA_PRESTAZIONI[0].QUADRO_CLINICO;
		else doc.txtQuadroClinico.value= "";
        if(NS_SARPED.varJSON.LISTA_PRESTAZIONI[0].QUESITO) doc.txtQuesitoClinico.value= NS_SARPED.varJSON.LISTA_PRESTAZIONI[0].QUESITO;
		else doc.txtQuesitoClinico.value = "";
        doc.tipo_registrazione.value='I';
        if (EXTRA_DB.XML != null)
		{
			doc.extra_db.value=EXTRA_DB.XML;
			doc.impegnativa.value=NS_SARPED.varJSON.NRE;
		}
		else
		{
			doc.impegnativa.value=$("#poligrafico").val()
		}
        doc.dataricetta.value=v_data_ricetta;
		var v_medico="";
		if(typeof NS_SARPED.varJSON.IDEN_MEDICO == 'undefined'){
				v_medico="";
		}else{
				v_medico=NS_SARPED.varJSON.IDEN_MEDICO ;
		}
		doc.Hiden_medi.value=v_medico;
		// *********** modifica DEMA
		// attenzione : da cambiare !!!
		doc.Hiden_pro.value="2346";
		//doc.Hiden_pro.value="1554";
		// select * from radsql.tab_tipo_mod_med where tipo ='P'
		// prendo uno a caso per test
		doc.Hiden_mod_prescr.value="103";
		// *****
		var vmod_acc = "";
		if(NS_SARPED.varJSON.TIPOLOGIA_PRESCRIZIONE == "INFORMATIZZATA"){
			switch(NS_SARPED.varJSON.LISTA_PRESTAZIONI[0].URGENZA){
					case "S":
							vUrgenza="U";
							vmod_acc="3";
							break;
					case "A":
							vUrgenza="B";
							vmod_acc="2";
							break;
					case "R":
							vUrgenza="D";
							vmod_acc="4";
							break;
					case "C":
							vmod_acc="1";
							vUrgenza="P";
							break;
					default:
							vmod_acc="";
							vUrgenza="";
							break;					
			}
		}else{
			vUrgenza = NS_SARPED.varJSON.LISTA_PRESTAZIONI[0].URGENZA;
                    switch(vUrgenza){
                        case "U":{
                                vmod_acc="3";
                                break;
                        }
                        case "B":{
                                vmod_acc="2";
                                break;
                        }
                        case "D":{
                                vmod_acc="4";
                                break;
                        }
                        case "P":{
                                vmod_acc="1";
                                break;
                        }
						default:
							vmod_acc="";
							break;							
                    }
		}
		if(NS_SARPED.varJSON.LISTA_PRESTAZIONI[0].URGENZA)
		{
			doc.Hiden_mod_acc.value=vmod_acc;
			doc.Hcodice_lea.value=vUrgenza;
		}
        //doc.txtCodEsterno6.value=NS_SARPED.varJSON.LISTA_PRESTAZIONI[0].CODICE_PRESCRIZIONE_SOLE;
        var v_sql = "select get_progressivoaccettazione() from dual";
        var num_pre ="";
        dwr.engine.setAsync(false);
        toolKitDB.getResultData(v_sql,function(rs){
            num_pre = rs[0];
        });
		doc.Hnum_pre.value =num_pre;
        dwr.engine.setAsync(true);
        doc.target="_self";
        doc.method="POST";
	 doc.dema.value="A";

        if(_tipo=='I')
        {
			try{
				if (bolSorgenteWkAnag){
					doc.Hservlet_succ.value = "javascript:opener.worklist_esami(" + PAZIENTE.IDEN_ANAG + ");self.close();";
				}
				else{
					doc.Hservlet_succ.value = "javascript:opener.aggiorna();self.close();";
				}
				doc.action = '../../schedaEsame';
			}catch(e){alert(e.description +"##");}
			NS_SARPED.procedi=true;			
			doc.submit();
        }
        else
        {
				// modifica 29-6-16
//				var quesitoQuadroDefault = "PROC. DI PREVENZIONE";
				var quesitoQuadroDefault = doc.txtQuesitoClinico.value;
				var quadroDefault = doc.txtQuadroClinico.value;
				if ( (typeof(vUrgenza)=="undefined") || (vUrgenza=="undefined")){
					vUrgenza = "";
				}
				//***************************
                doc.servlet.value = "schedaEsame?tipo_registrazione=P&Hnum_pre="+num_pre+"&Hiden_anag=" + PAZIENTE.IDEN_ANAG + "&Hiden_esa=" + NS_SARPED.IDEN_PRESTAZIONI_RIS + "&Hiden_esenzione=" + doc.Hiden_esenzione.value + 
							"&Hiden_medi="+v_medico+
							// gli passo anche la provenienza cablata ?????
							// o sblocco il campo successivamente ???
							"&Hiden_pro=2346" +
							//"&Hiden_pro=1554" +
							// ***************
							
							// modifica 29-6-16
                            "&Hiden_tick=" + NS_SARPED.varJSON.IDEN_TICK + "&Hiden_mod_acc="+vmod_acc+"&Hcodice_lea="+ vUrgenza+"&dataricetta="+v_data_ricetta+"&extra_db=" + EXTRA_DB.XML + "&impegnativa="+NS_SARPED.varJSON.NRE+                            
"&js_after_load=document.gestione_esame.txtQuadroClinico.value%3D'" + quadroDefault +"';document.gestione_esame.txtQuesitoClinico.value%3D'" + quesitoQuadroDefault +"'";
				// attenzione verificare che sia ancora corretto l'iframe
			 	doc.target = "iframe_main";
		                doc.action = '../../prenotazioneFrame?visual_bt_direzione=N';
				NS_SARPED.procedi=true;						
				doc.submit();				
				self.close();
        }


    },
    apriSostituzione:function(v_cod_min,v_progressivo_prestazione,v_stato_prescrizione,v_descrizione, v_cod_reg){
        if(v_stato_prescrizione == "CA"){
                alert("Prescrizione in stato CANCELLATA, non è possibile apportare alcuna modifica");
                return;
        }
        if(v_stato_prescrizione == "ER"){
                alert("Prescrizione in stato EROGATA, non è possibile apportare alcuna modifica");
                return;
        }
        window.open('prestazioniCodMin.html?COD_MIN='+v_cod_min+"&PROGRESSIVO_PRESTAZIONE="+v_progressivo_prestazione+
"&OFFLINE=N&DESCRIZIONE_PRESTAZIONE="+v_descrizione+"&COD_REG="+v_cod_reg,'',
'center:1;height:100%;width:100%;status:0');
    },
    sostituisci:function(vProgrSole,vObjPrestazioni){
        $.each(vObjPrestazioni.LISTA_PRESTAZIONI_AGGIUNTE,function(k,v){
                if(k==0){ //la prima la sostituisco
                    $.each(NS_SARPED.varJSON.LISTA_PRESTAZIONI,function(k1,v1){
                         if(v1.PROGRESSIVO_PRESTAZIONE == vProgrSole){
                            v1.DESCRIZIONE_PRESTAZIONE_SOLE = v.DESCRIZIONE;
							v1.DESCRIZIONE_RIS = v.DESCRIZIONE;
                            v1.CODICE_PRESTAZIONE = v.CODICE_SOLE;
                            v1.EROGABILE = "S";
                            v1.IDEN_ESA = v.IDEN_ESA;
                        }
                    });
                }else{//le altre le aggiungo
                    var vObject=new Object();
                    vObject.DESCRIZIONE_PRESTAZIONE_SOLE = v.DESCRIZIONE;
                    vObject.DATA_APP_EROGAZIONE = "";
		    vObject.DESCRIZIONE_RIS = v.DESCRIZIONE;
                    vObject.CODICE_PRESTAZIONE = v.CODICE_SOLE;
                    vObject.EROGABILE = "S";
                    vObject.IDEN_ESA = v.IDEN_ESA;
                    NS_SARPED.varJSON.LISTA_PRESTAZIONI.push(vObject);                
                }                
        });
        HTML.reset();
        HTML.creaWk();
    },
    inserisci:function(vObjPrestazioni){
        NS_SARPED.varJSON=new Object();
        NS_SARPED.varJSON.LISTA_PRESTAZIONI = new Array();
        NS_SARPED.varJSONPAZIENTE=new Object();
        NS_SARPED.varJSONPAZIENTE.CODICE_ENI = "";
        NS_SARPED.varJSONPAZIENTE.CODICE_STP = "";
        NS_SARPED.varJSONPAZIENTE.CODICE_FISCALE = $("#codiceFiscalePaziente").val();
        NS_SARPED.varJSON.IDEN_TICK ="";
        NS_SARPED.varJSON.IDEN_ESENZIONE_PATOLOGIA ="";
        NS_SARPED.varJSON.CODICE_AUTENTICAZIONE_SAC="";
        NS_SARPED.varJSON.DATA_RICETTA ="";
        NS_SARPED.varJSON.NRE ="";
        NS_SARPED.varJSON.TIPOLOGIA_PRESCRIZIONE="DEMATERIALIZZATA";
        PAZIENTE.ricercaAnagrafica();
        NS_SARPED.varJSONPAZIENTE.COGNOME = PAZIENTE.COGNOME;
        NS_SARPED.varJSONPAZIENTE.NOME = PAZIENTE.NOME;
        NS_SARPED.varJSON.STATO_PRESCRIZIONE="IM";
        NS_SARPED.varJSON.CODICE_AUTENTICAZIONE_SAC="";
       $.each(vObjPrestazioni.LISTA_PRESTAZIONI_AGGIUNTE,function(k,v){
                var vObject=new Object();
                vObject.DESCRIZIONE_PRESTAZIONE = v.DESCRIZIONE;
                vObject.DATA_APP_EROGAZIONE = "";
                vObject.DESCRIZIONE_RIS = v.DESCRIZIONE;
                vObject.CODICE_PRESTAZIONE = v.CODICE_SOLE;
                vObject.EROGABILE = "S";
                vObject.IDEN_ESA = v.IDEN_ESA;
                vObject.URGENZA ="";
                vObject.QUADRO_CLINICO ="";
                vObject.QUESITO ="";
                vObject.IDEN_ESENZIONE_PATOLOGIA ="";
                vObject.URGENZA ="";
                vObject.PROGRESSIVO_PRESTAZIONE = v.PROGRESSIVO_PRESTAZIONE;
                vObject.CODICE_STRUTTURA_PRENOTANTE = "";
                vObject.CODICE_PRESCRIZIONE_SOLE = "";
                vObject.STATO_PRESTAZIONE = "";
                vObject.STATO_PROCESSO = "";
                NS_SARPED.varJSON.LISTA_PRESTAZIONI.push(vObject);
        });
        HTML.reset();
        HTML.creaWk();
    },
    Prenota:function(){
        var gest = NS_SARPED.gestioneApertura();
        if(gest){
            NS_SARPED.inserimentoEsameSole("P");    
        }
    },
    check:function(){

       var v_check = true;
       if(NS_SARPED.varJSON.SCADUTA == "S"){
            alert("La Ricetta Risulta Scaduta!");
            v_check = false;
            return v_check;
        }
        switch(NS_SARPED.varJSON.STATO_PRESCRIZIONE)
        {
            case "ER":{
                alert("Ricetta Erogata! Impossibile continuare!");
                v_check = false;
                return v_check;
                break;
				}
            case "CA":{
                alert("Ricetta Cancellata! Impossibile continuare!");
                v_check = false;
                return v_check;
                break;
				}
        };
        switch(NS_SARPED.varJSON.LISTA_PRESTAZIONI[0].STATO_PRESTAZIONE)
        {
            case "ER":{
                alert("Ricetta Erogata! Impossibile continuare!");
                v_check = false;
                return v_check;
                break;
				}
            case "CA":{
                alert("Ricetta Cancellata! Impossibile continuare!");
                v_check = false;
                return v_check;
                break;
				}
            case "DC":{
                alert("Ricetta Invalida! Impossibile continuare!");
                v_check = false;
                return v_check;
                break;
				}
        };

        /*Modifiche per la gestione easycup*/
        var magg_2_pren = false;
        var min_2_pren = false;
        var magg_2_erog = false;
        var ris_presente=false;
        var daydiff_app_pren= 0;
        var flag_selected = false;
		// modifica 14-6-16
		var nPrestSelezionate = 0;
		// *******
        //var daydiff_erog= 0;
        //gestione date
        $.each($("#oTablePresc tr"),function(k,v){
            magg_2_pren = false;
            min_2_pren = false;
            magg_2_erog = false;
            var nrec_ris =0;
            if($(v).hasClass("trSelected")){
				// modifica 14-6-16
				nPrestSelezionate++;
				// *******
				flag_selected = true;
                if(NS_SARPED.varJSON.STATO_PRESCRIZIONE == "PA" && $(v).attr("iden_esa")!= ''){
                        dwr.engine.setAsync(false);	
                        var v_sql = "SELECT count(*) as num FROM COD_EST_ESAMI ce inner join esami e on e.iden = ce.iden_esame where (codice_autenticazione_sac ='"+NS_SARPED.varJSON.CODICE_AUTENTICAZIONE_SAC+"' or numimp_numrich ='"+NS_SARPED.varJSON.NRE+"') and E.DELETED='N' and iden_esa = "+$(v).attr("iden_esa")
 +" and progressivo_prestazione ='" + $(v).attr("progressivo") +"'";
                        toolKitDB.getResultData(v_sql,function(rs){
                                nrec_ris	= parseInt(nrec_ris) + parseInt(rs[0]);
                        });
                        dwr.engine.setAsync(true);
                        if(nrec_ris == 0){
                                /*var v_dt_pren = $(v).attr("data_prenotazione");
                                var v_dt_erog = $(v).attr("data_erogazione");
                                dwr.engine.setAsync(false);
                                var v_sql = "select (to_date('"+v_dt_erog+"','yyyyMMdd HH24:mi:ss') - sysdate ) from dual";
                                toolKitDB.getResultData(v_sql,function(rs){
                                        if(rs !=null){
                                                daydiff_app_pren = rs[0];
                                                //daydiff_erog = rs[1];
                                        }
                                });
                                dwr.engine.setAsync(true);
                                if(daydiff_app_pren > 2 && magg_2_pren != true && v_dt_erog !=""){
                                        magg_2_pren = true;
                                        return;
                                }else if(daydiff_app_pren < 2 && magg_2_pren != true && v_dt_erog !=""){
                                                min_2_pren = true;
                                                return;
                                }*/
                        }else{
                               ris_presente=true;

                        }
		
                }
            }
        });
        var luogo_data_ora = "";
        if(NS_SARPED.varJSON.LISTA_PRESTAZIONI[0].STRUTTURA_EROGANTE !=""){
        try{
                $.each(JSON_AZIENDE,function(k,v){
                        if(k == NS_SARPED.varJSON.LISTA_PRESTAZIONI[0].STRUTTURA_EROGANTE.substring(0,6)){
                                luogo_data_ora = " presso  " + v; /*+ " alle " + 
DATE.formatVisualeDT(NS_SARPED.varJSON.LISTA_PRESTAZIONI[0].DATA_APP_EROGAZIONE);*/
                        }

                });
                }catch(e){
                }
        }
        /*DA CONTROLLARE BENE COSA SI INTENDE  < >*/
        if(magg_2_pren){alert("Le prenotazioni associate alla ricetta sono in stato PA "+ luogo_data_ora +", creando una nuova accettazione, la precedente prenotazione sarà annullata");};
        if(min_2_pren){alert("La ricetta non è prenotabile/accettabile, data di prenotazione < 2 giorni " + luogo_data_ora);
  v_check =false; return v_check;};
        if(magg_2_erog){alert("La ricetta non è prenotabile/accettabile, data di prenotazione <= 2 giorni"); v_check =false; 
return v_check; }
        if(ris_presente){alert("Prescrizione già presente, è possibile solamente cancellarla e modificarla"); v_check=false; 
return v_check;}
		// modifica 14-6-16
		if(!flag_selected){
			alert("Attenzione! Selezionare almeno una prestazione!");v_check=false;
		}else{
			// controllo se le ha selezionate tutte
			if (nPrestSelezionate==NS_SARPED.varJSON.LISTA_PRESTAZIONI.length){
				v_check=true;
			}else{
				if (confirm("Attenzione: non sono state selezionate tutte le prestazioni, continuare ugualmente?")){
					v_check=true;
				}else{
					v_check=false;}
			}
		}
		// *********
		
        return v_check;
    },
    Offline:function(){
        window.open("prestazioniCodMin.html?COD_MIN=&PROGRESSIVO_PRESTAZIONE=&OFFLINE=S","",
"center:1;height:100%;width:100%;status:0");
    }
    
};

var PAZIENTE = {
    CODICE_ANAGRAFICO:null,
    CODICE_FISCALE : null,
    IDEN_ANAG : null,
    COGNOME:null,
    NOME:null,
    init:function(){
      PAZIENTE.CODICE_FISCALE ="";
      PAZIENTE.IDEN_ANAG =0;
      PAZIENTE.CODICE_ANAGRAFICO = "";
    },
    ricercaAnagrafica:function(){
		var v_codice="";
		var v_sql="";
                dwr.engine.setAsync(false);
		if(NS_SARPED.varJSONPAZIENTE.CODICE_FISCALE !=""){
			v_codice = NS_SARPED.varJSONPAZIENTE.CODICE_FISCALE;
		}
		else if(NS_SARPED.varJSONPAZIENTE.CODICE_STP !=""){
			v_codice = NS_SARPED.varJSONPAZIENTE.CODICE_STP;
		}
		else if(NS_SARPED.varJSONPAZIENTE.CODICE_ENI !=""){
			v_codice = NS_SARPED.varJSONPAZIENTE.CODICE_ENI;
		}
                
        if(v_codice!=""){
			/*v_sql = "select iden,id1,cogn,nome from anag a inner join cod_est_anag cea on cea.iden_anag = a.iden where 
deleted='N' and readonly='N' and cod_fisc='" + v_codice  + "' order by iden desc"*/
			v_sql = "select iden,id1,cogn,nome from anag a inner join cod_est_anag cea on cea.iden_anag = a.iden where deleted='N' and readonly='N' and A.IDEN=" + PAZIENTE.IDEN_ANAG  + " order by iden desc";
		}else{
			v_sql = "select iden,id1,cogn,nome from anag a inner join cod_est_anag cea on cea.iden_anag = a.iden where deleted='N' and readonly='N' and cogn='" + NS_SARPED.varJSONPAZIENTE.COGNOME  + "'  and nome = '"+NS_SARPED.varJSONPAZIENTE.NOME+"' and data = '"+NS_SARPED.varJSONPAZIENTE.DATA_NASCITA+"' and com_nasc = '"+NS_SARPED.
varJSONPAZIENTE.INDIRIZZI.NASCITA.COD_ISTAT_COMUNE+"'  order by iden desc"
		}
        toolKitDB.getResultData(v_sql, function(resRicerca){   
            if(resRicerca==null) 
            {
                LOGGER.write("##Anagrafica non trovata##");
                LOGGER.write(NS_SARPED.varJSONPAZIENTE);
               var insertAnag= confirm("Si sta per inserire il Paziente " + NS_SARPED.varJSONPAZIENTE.COGNOME + " " + 
NS_SARPED.varJSONPAZIENTE.NOME + "\r\n con il codice fiscale: " + NS_SARPED.varJSONPAZIENTE.CODICE_FISCALE );
               if(insertAnag)
               {
                   if(NS_SARPED.varJSONPAZIENTE.SESSO=='1'){
                       NS_SARPED.varJSONPAZIENTE.SESSO="M";
                   }else if(NS_SARPED.varJSONPAZIENTE.SESSO=='2'){
                       NS_SARPED.varJSONPAZIENTE.SESSO="F";
                   }
                   PAZIENTE.inserisciAnagrafica(NS_SARPED.varJSONPAZIENTE);
               }else{
                   PAZIENTE.IDEN_ANAG= 0;
                   PAZIENTE.CODICE_ANAGRAFICO= "";
               }
                
           }else{

                PAZIENTE.IDEN_ANAG= resRicerca[0];
                PAZIENTE.CODICE_ANAGRAFICO= resRicerca[1];
                PAZIENTE.COGNOME= resRicerca[2];
                PAZIENTE.NOME= resRicerca[3];
				//PAZIENTE.aggiornaAnagrafica(NS_SARPED.varJSONPAZIENTE,PAZIENTE.IDEN_ANAG);
           }
        });
        dwr.engine.setAsync(true);
        return PAZIENTE.IDEN_ANAG;
    },
	aggiornaAnagrafica:function(_obj,iden_anag){
				v_xml = "<PAZIENTE>";
				v_xml +="<COGNOME>"+_obj.COGNOME+"</COGNOME>";
				v_xml +="<NOME>"+_obj.NOME+"</NOME>";
				v_xml +="<DATA_NASCITA>"+_obj.DATA_NASCITA+"</DATA_NASCITA>";
				v_xml +="<CODICE_FISCALE>"+_obj.CODICE_FISCALE+"</CODICE_FISCALE>";
				v_xml +="<CODICE_STP>"+_obj.CODICE_STP+"</CODICE_STP>";
				v_xml +="<CODICE_AUSL_STP>"+_obj.CODICE_AUSL_STP+"</CODICE_AUSL_STP>";
				v_xml +="<CODICE_ENI>"+_obj.CODICE_ENI+"</CODICE_ENI>";
				v_xml +="<CODICE_AUSL_ENI>"+_obj.CODICE_AUSL_ENI+"</CODICE_AUSL_ENI>";
				v_xml +="<CODICE_TEAM>"+_obj.CODICE_TEAM+"</CODICE_TEAM>";
				v_xml +="</PAZIENTE>";
				var sql = "{call ? := AGGIORNA_anagrafica_sole('"+v_xml+"','"+iden_anag+"')}";
				toolKitDB.executeFunctionData(sql, function(r1){
				});
	},
    inserisciAnagrafica:function(_obj){
        var v_xml = "<PAZIENTE>";
            v_xml +="<COGNOME>"+_obj.COGNOME+"</COGNOME>";
            v_xml +="<NOME>"+_obj.NOME+"</NOME>";
            v_xml +="<DATA_NASCITA>"+_obj.DATA_NASCITA+"</DATA_NASCITA>";
            v_xml +="<CODICE_FISCALE>"+_obj.CODICE_FISCALE+"</CODICE_FISCALE>";
            v_xml +="<CODICE_STP>"+_obj.CODICE_STP+"</CODICE_STP>";
            v_xml +="<CODICE_AUSL_STP>"+_obj.CODICE_AUSL_STP+"</CODICE_AUSL_STP>";
            v_xml +="<CODICE_ENI>"+_obj.CODICE_ENI+"</CODICE_ENI>";
            v_xml +="<CODICE_AUSL_ENI>"+_obj.CODICE_AUSL_ENI+"</CODICE_AUSL_ENI>";
            v_xml +="<CODICE_TEAM>"+_obj.CODICE_TEAM+"</CODICE_TEAM>";
            v_xml +="<SESSO>"+_obj.SESSO+"</SESSO>";
            v_xml +="<TELEFONO>"+_obj.TELEFONO+"</TELEFONO>";
            v_xml +="<EMAIL>"+_obj.EMAIL+"</EMAIL>";
            v_xml +="<ASL_ASSISTENZA>"+_obj.ASL_ASSISTENZA+"</ASL_ASSISTENZA>";
            v_xml +="<ASL_RESIDENZA>"+_obj.ASL_RESIDENZA+"</ASL_RESIDENZA>";
            v_xml +="<DATI_OSCURATI>"+_obj.DATI_OSCURATI+"</DATI_OSCURATI>";
            v_xml +="<COD_ISTAT_CITTADINANZA>"+_obj.COD_ISTAT_CITTADINANZA+"</COD_ISTAT_CITTADINANZA>";
            $.each(_obj.INDIRIZZI,function(ind,val){
                    v_xml +="<"+ind+">";
                    v_xml +="<INDIRIZZO>" +val.INDIRIZZO+ "</INDIRIZZO>";
                    v_xml +="<COD_ISTAT_COMUNE>" +val.COD_ISTAT_COMUNE+ "</COD_ISTAT_COMUNE>";                    
                    v_xml +="</"+ind+">";
            });
            v_xml += "</PAZIENTE>";

			var string = v_xml.replace(/\'/g,"''");
            var sql = "{call ? := inserisci_anagrafica_sole('"+string+"')}";
            toolKitDB.executeFunctionData(sql, function(r1){
                   PAZIENTE.IDEN_ANAG=r1;
            });
    }
};

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
    getDatiOperatore:function ()
    {
	dwr.engine.setAsync(false);
	toolKitDB.getResultData("select cod_fisc,indirizzo3,cod_dec,cognome,nome from tab_per where iden=" +  getHomeFrame().baseUser.IDEN_PER, function(r){
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
	return "::CODFISC_OP=" + OPERATORE.CODICE_FISCALE + "::CODOP=" + OPERATORE.CODICE + "::CODAUSL_OP=" + OPERATORE.
CODICE_REGIONALE;
    }
};

var larghezza=screen.availWidth;
var larghezza_paziente=(larghezza*20.6)/100;
var larghezza_stato=(larghezza*10.3)/100;
var larghezza_descrizione_sole=(larghezza*18.6)/100;
var larghezza_descrizione_ris=(larghezza*18.6)/100;
var larghezza_data=(larghezza*15.5)/100;
var larghezza_erogabile=(larghezza*8.2)/100;
var larghezza_operazione=(larghezza*8.2)/100;
var _Model = [
    {
      display: 'Paziente', name : 'Paziente', width : larghezza_paziente, sortable : true, align: 'left'
    },
	/*
    {
      display: 'Stato Prescrizione', name : 'StatoPrescrizione', width : larghezza_stato, sortable : true, align: 'left'
    },*/
    {
      display: 'Descrizione', name : 'DescrizioneSole', width : larghezza_descrizione_sole, sortable : true, align: 'left'
    },
    {
      display: 'Descrizione Ambulatoriale', name : 'DescrizioneRis', width : larghezza_descrizione_ris, sortable : true, align: 'left'
    },
    {
      display: 'Data Ricetta', name : 'DataRicetta', width : larghezza_data, sortable : true, align: 'left'
    },
    //{
    //  display: 'Codice Prescrizione Sole', name : 'CodicePrescrSole', width : 150, sortable : true, align: 'left'
    //},
    {
      display: 'Erogabile', name : 'Erogabile', width : larghezza_erogabile, sortable : true, align: 'left'
    },
    {
      display: 'Operazione', name : 'Operazione', width : larghezza_operazione, sortable : true, align: 'left'
    }
];



var HTML = {
    reset:function(){
        $(".flexigrid").remove();
    },
    creaWk: function(){
        var ArrayData = [];
        var arrTrAtribute = [];
        var jSonTrAttribute = {};
        var jSonData  = {};
        var ArrayProcessClass = [{"COLUMN":"OPZIONI","FUNCTION":HTML.processClass}];
        var v_datetm_ricetta = DATE.formatVisualeDT(NS_SARPED.varJSON.DATA_RICETTA);
        $.each(NS_SARPED.varJSON.LISTA_PRESTAZIONI,function(k,v){
            jSonData = new Object();
            jSonTrAttribute = new Object();
            jSonData.PAZIENTE = PAZIENTE.COGNOME + " " + PAZIENTE.NOME;
/*			if(NS_SARPED.varJSON.TIPOLOGIA_PRESCRIZIONE=="DEMATERIALIZZATA"){
				jSonData.STATO_PRESCRIZIONE = NS_SARPED.varJSON.STATO_PRESCRIZIONE;
			}else{
				vStato ="";
				switch(v.STATO_PRESTAZIONE){
					case "SC" :{
						vStato = "Prenotata";
						break;
					}
					case "DC" :{
						vStato = "Invalida";
						break;
					}
					case "CA" :{
						vStato = "Annullata";
						break;
					}
					case "CS" :{
						vStato = "Non Prenotata";
						break;
					}	
					case "CM" : {
						vStato = "Completata";
						break;
					}
					case "SG" : {
						vStato = "Segnalata";
						break;
					}
				}
				jSonData.STATO_PRESCRIZIONE = vStato;
			}*/
            if(v.DESCRIZIONE_PRESTAZIONE != ""){
                jSonData.DESCRIZIONE_PRESTAZIONE = v.DESCRIZIONE_PRESTAZIONE;
            }else{
                jSonData.DESCRIZIONE_PRESTAZIONE = v.DESCRIZIONE_PRESTAZIONE_DMR;
            }
            jSonData.DESCRIZIONE_RIS = v.DESCRIZIONE_RIS;
            jSonData.DATA_RICETTA = v_datetm_ricetta;
            /*jSonData.CODICE_PRESCRIZIONE_SOLE = v.CODICE_PRESCRIZIONE_SOLE;*/
            jSonData.EROGABILE = v.EROGABILE;
            jSonData.OPZIONI="";
            jSonData.CODICE_PRESTAZIONE_DMR = v.CODICE_PRESTAZIONE_DMR;
			jSonData.CODICENOMENCLATOREREGIONALE = v.CODICENOMENCLATOREREGIONALE;
            jSonData.PROGRESSIVO_PRESTAZIONE = v.PROGRESSIVO_PRESTAZIONE;
            
jSonTrAttribute={"iden_esa":v.IDEN_ESA,"erogabile":v.EROGABILE,"stato_prestazione":v.STATO_PRESTAZIONE,"data_prenotazione":v.DATA_PRENOTAZIONE,"data_erogazione":v.DATA_APP_EROGAZIONE,"progressivo":v.PROGRESSIVO_PRESTAZIONE};
            arrTrAtribute.push(jSonTrAttribute);
            ArrayData.push(jSonData);
        });
         var wkData =  {
                   idTable:"oTablePresc",
                   trClass:"trTable",
                   arrayData:ArrayData,
                   arrayTrAttribute:arrTrAtribute,
                   jSonColumns:_Model,
                   
arrayColumnsData:["PAZIENTE","STATO_PRESCRIZIONE","DESCRIZIONE_PRESTAZIONE","DESCRIZIONE_RIS","DATA_RICETTA",/*"CODICE_PRESCRIZIONE_SOLE",*/"EROGABILE","OPZIONI"],
                   objAppend:$("#formVisuale"),
                   arrayProcessClass:ArrayProcessClass
            };
          $.worklistDynamic(wkData);
          $("[id^='divButton']").click(function(){
               
NS_SARPED.apriSostituzione(this["cod_min"],this["progressivo_prestazione"],this["stato_prescrizione"],this["descrizione_prestazione"],this["cod_reg"]);
           });
    },
    processClass:function($td,jSonRow){
        if(jSonRow.EROGABILE !='A' && jSonRow.EROGABILE !='Z'){
            var $divButton = $(document.createElement("div"));
            $divButton.attr("cod_min",jSonRow.CODICE_PRESTAZIONE_DMR);
			$divButton.attr("cod_reg",jSonRow.CODICENOMENCLATOREREGIONALE);
            $divButton.attr("progressivo_prestazione",jSonRow.PROGRESSIVO_PRESTAZIONE);
            $divButton.attr("id","divButton" + jSonRow.PROGRESSIVO_PRESTAZIONE);
         //   $divButton.attr("stato_prescrizione",NS_SARPED.varJSON.STATO_PRESCRIZIONE);
			$divButton.attr("descrizione_prestazione",jSonRow.DESCRIZIONE_PRESTAZIONE);
            $divButton.attr("title","Sostituisci");
            $divButton.addClass("divButton");
            $td.append($divButton);
        }
    }
};

function deb(TIPO)
{
    if(TIPO == "DEMA"){
        //MULTIPRESTAZIONE SSSMNN75B01F257L,080A03000910163 prestazioni di laboratorio ^o^
        $("#codiceFiscalePaziente").val("FBNFBA62S28H501F");

        $("#NRE").val("080A03000908644");        
    }else if(TIPO=="INF"){
        $("#codiceFiscalePaziente").val("PAZCOL01A50A111A");
        $("#codiceSole").val("1105099926301136"); 
    }

}	

var EXTRA_DB = {
  XML : null,
  gesXml:function(){
      var flag_selected = false;
      EXTRA_DB.XML = "<ED><NRE>"+NS_SARPED.varJSON.NRE+"</NRE><CAS>"+NS_SARPED.varJSON.CODICE_AUTENTICAZIONE_SAC+"</CAS>";
      EXTRA_DB.XML += "<PC>"+getHomeFrame().basePC.NOME_HOST.substring(0,20)+"</PC>";
      EXTRA_DB.XML += "<SP>" + NS_SARPED.varJSON.STATO_PRESCRIZIONE + "</SP>";
      EXTRA_DB.XML += "<TP>" + NS_SARPED.varJSON.TIPOLOGIA_PRESCRIZIONE + "</TP>";
	  EXTRA_DB.XML += "<TT>" + NS_SARPED.nPrestazioni + "</TT>";
      EXTRA_DB.XML += "<LP>";
      
      $.each(NS_SARPED.varJSON.LISTA_PRESTAZIONI,function(k,v){
          $.each(NS_SARPED.IDEN_PRESTAZIONI_RIS.split("*"),function(k1,v1){
              if(v.IDEN_ESA ==v1 && v.PROGRESSIVO_PRESTAZIONE == NS_SARPED.PROGRESSIVO_PRESTAZIONI_RIS.split("*")[k1]){
                  flag_selected = true;
              }
          });
          if(NS_SARPED.IDEN_PRESTAZIONI_RIS.indexOf("*") == -1){
              if(v.IDEN_ESA ==NS_SARPED.IDEN_PRESTAZIONI_RIS && v.PROGRESSIVO_PRESTAZIONE == 
NS_SARPED.PROGRESSIVO_PRESTAZIONI_RIS){
                  flag_selected = true;
              }
          }
          if(flag_selected){
            EXTRA_DB.XML+="<PR>";
            EXTRA_DB.XML+="<PP>"+v.PROGRESSIVO_PRESTAZIONE+"</PP>";
            //EXTRA_DB.XML+= "<CSP>" + v.CODICE_STRUTTURA_PRENOTANTE + "</CSP>";
            //EXTRA_DB.XML+="<SP>"+v.STATO_PROCESSO+"</SP>";
            EXTRA_DB.XML+="<STP>"+v.STATO_PRESTAZIONE+"</STP>";
            //EXTRA_DB.XML+="<CPS>"+v.CODICE_PRESCRIZIONE_SOLE+"</CPS>";
			EXTRA_DB.XML += "<CMM>" + v.CODICE_PRESTAZIONE_DMR+"</CMM>";
			EXTRA_DB.XML+="<CUR>"+v.CODICENOMENCLATOREREGIONALE+"</CUR>";
            EXTRA_DB.XML+="<IE>"+v.IDEN_ESA+"</IE>";
			// modifica 20-5-16
			// campo legato alle prestazioni
			EXTRA_DB.XML+="<DESCRTESTOLIBERONOTE>"+v.descrTestoLiberoNote+"</DESCRTESTOLIBERONOTE>";
			// *******
            EXTRA_DB.XML+="</PR>";   
          }
          flag_selected = false;
      });
      EXTRA_DB.XML += "</LP>";
      EXTRA_DB.XML+="</ED>";
    },
   gesXmlAssocia:function(array_progressivo_prestazione){
      var flag_selected = false;
      EXTRA_DB.XML = "<ED><NRE>"+NS_SARPED.varJSON.NRE+"</NRE><CAS>"+NS_SARPED.varJSON.CODICE_AUTENTICAZIONE_SAC+"</CAS>";
      EXTRA_DB.XML += "<PC>"+getHomeFrame().basePC.NOME_HOST.substring(0,20)+"</PC>";
      EXTRA_DB.XML += "<SP>" + NS_SARPED.varJSON.STATO_PRESCRIZIONE + "</SP>";
      EXTRA_DB.XML += "<TP>" + NS_SARPED.varJSON.TIPOLOGIA_PRESCRIZIONE + "</TP>";
	  EXTRA_DB.XML += "<TT>" + NS_SARPED.nPrestazioni + "</TT>";
      EXTRA_DB.XML += "<LP>";
      
      $.each(NS_SARPED.varJSON.LISTA_PRESTAZIONI,function(k,v){
          $.each(array_progressivo_prestazione,function(k1,v1){
              if(/*v.IDEN_ESA ==v1 &&*/ v.PROGRESSIVO_PRESTAZIONE == array_progressivo_prestazione[k1]){
                  flag_selected = true;
              }
          });
          /*if(NS_SARPED.IDEN_PRESTAZIONI_RIS.indexOf("*") == -1){
              if(v.IDEN_ESA ==NS_SARPED.IDEN_PRESTAZIONI_RIS && v.PROGRESSIVO_PRESTAZIONE == 
NS_SARPED.PROGRESSIVO_PRESTAZIONI_RIS){
                  flag_selected = true;
              }
          }*/
          if(flag_selected){
            EXTRA_DB.XML+="<PR>";
            EXTRA_DB.XML+="<PP>"+v.PROGRESSIVO_PRESTAZIONE+"</PP>";
            //EXTRA_DB.XML+= "<CSP>" + v.CODICE_STRUTTURA_PRENOTANTE + "</CSP>";
            //EXTRA_DB.XML+="<SP>"+v.STATO_PROCESSO+"</SP>";
            EXTRA_DB.XML+="<STP>"+v.STATO_PRESTAZIONE+"</STP>";
            //EXTRA_DB.XML+="<CPS>"+v.CODICE_PRESCRIZIONE_SOLE+"</CPS>";
			EXTRA_DB.XML += "<CMM>" + v.CODICE_PRESTAZIONE_DMR+"</CMM>";
			EXTRA_DB.XML+="<CUR>"+v.CODICENOMENCLATOREREGIONALE+"</CUR>";
            EXTRA_DB.XML+="<IE>"+v.IDEN_ESA+"</IE>";
			// modifica 20-5-16
			// campo legato alle prestazioni
			EXTRA_DB.XML+="<DESCRTESTOLIBERONOTE>"+v.descrTestoLiberoNote+"</DESCRTESTOLIBERONOTE>";
			// *******			
            EXTRA_DB.XML+="</PR>";   
          }
          flag_selected = false;
      });
      EXTRA_DB.XML += "</LP>";
      EXTRA_DB.XML+="</ED>";
  }

};

var DATE ={
    formatVisualeDT :function(val){

        if(val!="" && val != null)
            return val.substring(8,10) + "/" + val.substring(5,7) + "/" + val.substring(0,4) + " " + val.substring(11,13) + 
":" + val.substring(14,16) + ":" +val.substring(17,19) ;
    }
};

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + 
'([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||"";
}

//  aldo - aggiunto x modifica DEMA
function getHomeFrame(){
	var objFrame;
	try{
		objFrame = opener.top;
	}
	catch(e){
		alert("getHomeFrame - Error: "  + e.description);
	}
	return objFrame;		
}