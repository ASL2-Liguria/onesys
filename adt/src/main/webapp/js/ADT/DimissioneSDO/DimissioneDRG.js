
var DRG_FINDER = {
    
	writeXml : function(params){
    	//gli passo un json con i parametri
        var xml = null;
        var json =
        {
            "CNTRL":
            {
                "CMD":params.cmd,
                "SYS":"0",
                "PRD":"02",
                "GRPR1":"403", //codice regione, in questo caso liguria
                "AUTH":"vtkWaqw18ondshif"
            },
            "PERSON":
            {
                "AGEY":params.agey,
                "GNDR":params.gndr,
                "PID":"Prova di codici"
            },
            "ENCOUNTER":
            {
                "ADT":params.adt,
                "DSP":params.disp,
                "DDT":params.ddt,
                "CLAIM":
                {
                    "I9DXP":[
                        params.ENCOUNTER.CLAIM.I9DXP    //diagnosi principale
                    ],
                    "I9DX":[
                        //diagnosi secondarie
                    ],
                    I9PRP:[
                        params.ENCOUNTER.CLAIM.I9PRP    //intervento principale
                    ],
                    I9PR:[
                        //altri interventi
                    ]
                }
            }
        };
        
        // inserimento diagnosi secondarie
        for(var i = 0; params.ENCOUNTER.CLAIM.I9DX.length > i; i++){
            json.ENCOUNTER.CLAIM.I9DX.push({"VALUE":params.ENCOUNTER.CLAIM.I9DX[i].value});
        }
        
        // inserimento interventi secondarie
        for(i = 0; params.ENCOUNTER.CLAIM.I9PR.length > i; i++){
            json.ENCOUNTER.CLAIM.I9PR.push({"VALUE":params.ENCOUNTER.CLAIM.I9PR[i].value});
        }

        $.ajax({
            url : 'adt/sdo/WriteXmlDRG?TEMPLATE=Finder/xmlInputFinder.ftl&DATI=' + JSON.stringify(json),
            dataType: 'text',
            success : function(data){ xml = data;},
            error : function (/*jqXHR, textStatus, errorThrown*/) {
                home.NOTIFICA.error({message: "Attenzione errore nella ricerca del codice DRG", title: "Error"});
                /*alert(textStatus);
                 alert(errorThrown);
                 alert(jqXHR);  */
            },
            async:false
        });
        //alert(xml);
        return xml;
    },


    richiediAnalisiFinder:function(xml){
        //return alert(xml);
//        alert(xml);
        dwr.engine.setAsync(false);
        var $xml;
        var iframe = document.getElementById('IFRAMEFINDER').contentWindow;

        iframe.document.getElementById('URL').value = home.baseGlobal.URL_FINDER;// 'http://10.106.0.92';
        iframe.document.getElementById("TAInput").value = xml;
        var json = {"mapCodiciICD":[]};

        var diagnosi = {"key": "DIAGNOSI",
            "value": []
        };
        var interventi = { "key": "PROCEDURE",
            "value": []
        };

        iframe.btnLoadIFrame();
        setTimeout(function(){
            iframe.btnInitInstance();
            var i = setInterval(function(){
             //   alert(iframe.document.getElementById('WritePacket').getAttribute("disabled"));
                if(iframe.document.getElementById('WritePacket').getAttribute("disabled") == null || iframe.document.getElementById('WritePacket').getAttribute("disabled") == ''){
                    clearInterval(i);

                    iframe.btnWritePacket(xml);

                    var t = setInterval(function(){

                        if(iframe.document.getElementById('TAOutput').value!= ''){
                            iframe.btnReleaseInstance();

                            clearInterval(t);
                            var xml = $.parseXML(iframe.document.getElementById('TAOutput').value);
//                            alert(iframe.document.getElementById('TAOutput').value);
                            $xml = $(xml);

                            iframe.location.reload();

                            $("#txtCodDRG").val($xml.find('DRG').find('VALUE').text());
                            $("#txtDescrDRG").val($xml.find('DRG').find('TEXT').text());
                            $("#chkSdoCompleta").data("CheckBox").selectAll();
                            // alert(iframe.document.getElementById('TAOutput').value);

                            var xmlT =  $xml.find("CLAIM");
                            var vparamDiagnosi = xmlT.find("I9DXP").find("VALUE").text() +',';
                            var vparamProcedure =   xmlT.find("I9PRP").find("VALUE").text()+',';


                            xmlT.find("I9DX").each(function(i){

                                if( xmlT.find("I9DX").length == i) {
                                    vparamDiagnosi+=$(this).find("VALUE").text();
                                }else{
                                    vparamDiagnosi+=$(this).find("VALUE").text() + ',';
                                }

                            });

                            xmlT.find("I9PR").each(function(){
                                if( xmlT.find("I9PR").length == i) {
                                    vparamProcedure+=$(this).find("VALUE").text();
                                }else{
                                    vparamProcedure+=$(this).find("VALUE").text() + ',';
                                }

                            });
                            dwr.engine.setAsync(false);

                            var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
                            var xhrDiagnosi = db.call_procedure(
                                {
                                    id: 'SP_GET_CODICE_FROM_CODDEC_ICD9',
                                    parameter:
                                    {
                                        vCodIn:vparamDiagnosi,
                                        pType:"DIAGNOSI",
                                        "p_result": {d:'O',t:'V'}
                                    }

                                }
                            );

                            var xhrInterventi = db.call_procedure(
                                {
                                    id: 'SP_GET_CODICE_FROM_CODDEC_ICD9',
                                    parameter:
                                    {
                                        vCodIn:vparamProcedure,
                                        pType:"PROCEDURE",
                                        "p_result": {d:'O',t:'V'}
                                    }

                                }
                            );

                            xhrDiagnosi.done(function (data, textStatus, jqXHR) {
                                createJson(data,diagnosi);
                                json.mapCodiciICD.push(diagnosi);

                                xhrInterventi.done(function (data, textStatus, jqXHR) {

                                    createJson(data,interventi);
                                    json.mapCodiciICD.push(interventi);
                                    _JSON_CONTATTO.codiciICD = json;
                                    //devo annidare cos� � un po' + sincrono
                                    NS_DIMISSIONE_ICD.valorizeDiagnosiInterventi();
                                    NS_DIMISSIONE_ICD.setDataInterventoObbligatoria();
                                });
                            });

                            xhrDiagnosi.fail(function (jqXHR, textStatus, errorThrown) {
                                logger.error(JSON.stringify(jqXHR));
                            });
                            xhrInterventi.fail(function (jqXHR, textStatus, errorThrown) {
                                logger.error(JSON.stringify(jqXHR));
                            });

                            dwr.engine.setAsync(true);
                        }
                    },1000);
                }
            },2000);
        },3000);

        dwr.engine.setAsync(true);
    },
    
    getAllCodeDiagnosi : function(json) {
        $.each($(".diagnosiSecondarie"),function(){
            /* tira su questo
             <td class="tdAC diagnosiSecondarie">
             <input type="text" value="" id="DiagnosiICD91" autocomplete="off" data-c-codice="312.4" data-c-n_row="9" data-c-value="312.4" data-c-descr="312.4 - DISTURBI MISTI DELLA CONDOTTA E DELLE EMOZIONI">
             <input type="hidden" value="312.4" id="h-DiagnosiICD91">
             </td>
             */
            //prendo il primo input, prendo il data-value e lo butto nel json
            var codeICD9Diagnosi = $(this).find("input").first().attr("data-c-value");

            if(typeof codeICD9Diagnosi != 'undefined' && codeICD9Diagnosi != '')
            {
                codeICD9Diagnosi = codeICD9Diagnosi.replace('\.','');
                json.ENCOUNTER.CLAIM.I9DX.push({value:codeICD9Diagnosi});
            }
        });
    },
    
    getAllCodeInterventi:function(json){
        $.each($(".interventiSecondari"),function(){
            //prendo il primo input, prendo il data-value e lo butto nel json
            var codeICD9Interventi = $(this).find("input").first().attr("data-c-value");

            if(typeof codeICD9Interventi != 'undefined' && codeICD9Interventi != '')
            {
                codeICD9Interventi = codeICD9Interventi.replace('\.','');
                json.ENCOUNTER.CLAIM.I9PR.push({value:codeICD9Interventi});
            }
        });
    },
    calcolaDrgTariffa:function(idenContatto){
    	//var _JSON_GROUPER=DRG_FINDER.getJsonGrouper();
    	//alert(JSON.stringify(_JSON_GROUPER));
    	//var urlToCall =home.baseGlobal['URL_GENERAZIONE_FLUSSI'] + 'DRG/calcolaDaSdo?' ;
    	//var dataToSend= '::hostname='+home.basePC.IP+'::datiSdo='+JSON.stringify(_JSON_GROUPER);
    	var _URL_GENERAZIONE_FLUSSI = home.baseGlobal['URL_GENERAZIONE_FLUSSI'];
    	var urlToCall = _URL_GENERAZIONE_FLUSSI + 'DRG/calcola?' ;
    	var dataToSend= '::nContatti=1::idenContatti=' + idenContatto + '::hostname=' + home.basePC.IP+'::user='+home.baseUser.IDEN_PER;
    	logger.debug('Function urlToCall -> ' + urlToCall);
        logger.debug('Function Callback dataToSend -> ' + dataToSend);
        jQuery.support.cors = true;
        NS_LOADING.showLoading({"timeout" : 0});
        jQuery.ajax({
            url: "proxy",
            async:true,
            data:"CALL="+ urlToCall +"&PARAM="+dataToSend+"&METHOD=GET",
            cache: false,
            type: "POST",
            crossDomain: false,
            contentType:"application/x-www-form-urlencoded",
            success: function (resp)
            {
                logger.debug(resp);
                if (resp==""){
                    home.NOTIFICA.error({message: "Error in ajax response", timeout: 5, title: "Error"});
                    NS_LOADING.hideLoading();
                    return false;
                }
                eval('var json = ' + resp);

                if(json.success)
                {
                    home.NOTIFICA.success({message: "Calcolo DRG completato", timeout: 3, title: 'Success'});                  
                    //   calcolo tariffa
                     DRG_FINDER.calcolaTariffa(idenContatto);
                }
                else
                {
                    home.NOTIFICA.error({message: "Errore nel calcolo DRG: " + json.message, timeout: 5, title: "Error"});
                    NS_LOADING.hideLoading();
                }
            },
            error: function (resp)
            {
                home.NOTIFICA.error({message: "Errore nel calcolo DRG", timeout: 5, title: "Error"});
                dialPD.close();
            }
        });
    },
    getJsonGrouper: function(){
    	var diagnosiRico=null;
    	var diagnosiVal=new Array();
    	var procedureVal=new Array();
    	var ICD = _JSON_CONTATTO.codiciICD;
    	var diagnosi = [];
        var procedure = [];
    	for (var i=0; i<ICD.mapCodiciICD.length; i++){
    		if (ICD.mapCodiciICD[i].key == 'DIAGNOSI'){
        		diagnosi = ICD.mapCodiciICD[i].value;
        	} 
	    	if (ICD.mapCodiciICD[i].key == 'PROCEDURE'){
	    		procedure = ICD.mapCodiciICD[i].value;
	    	}
		}
    	for (i=0; i<15; i++){
    		diagnosiVal[i]=null;
    		procedureVal[i]=null;
    	}
    	for(i = 0;i < diagnosi.length ; i++)
        {
    		if (diagnosi[i]['evento'].codice =="A01"){
    			diagnosiRico=diagnosi[i].codice.replace('.','');
    			//alert('diagnosiRico='+diagnosiRico);
    		}
    		else{ // A03
    			diagnosiVal[diagnosi[i].ordine]=diagnosi[i].codice.replace('.','');    	
    			//alert('diagnosiVal['+i+']='+diagnosiVal[diagnosi[i].ordine]);
    		}
        }
    	for (i=0; i<procedure.length; i++){
    		procedureVal[procedure[i].ordine]=procedure[i].codice.replace('.','');   
    		//alert('procedureVal['+i+']='+procedureVal[procedure[i].ordine]);
    	}
    	var datiGrouper={
    			"cartella_clinica":_JSON_CONTATTO.codice.codice,
    			"codice_fiscale":_JSON_CONTATTO.anagrafica.codiceFiscale,
    			"nome_paziente":_JSON_CONTATTO.anagrafica.nome,
    			"data_ricovero": moment(_JSON_CONTATTO.dataInizio, 'YYYYMMDDHH:mm').format('MM/DD/YYYY'),
    			"data_dimissione":moment(_JSON_CONTATTO.dataFine, 'YYYYMMDDHH:mm').format('MM/DD/YYYY'),
    			"data_di_nascita":moment(_JSON_CONTATTO.anagrafica.dataNascita, 'YYYYMMDDHH:mm').format('MM/DD/YYYY'),
    			"sesso":_JSON_CONTATTO.anagrafica.sesso,
    			"modalita_dimissione":_JSON_CONTATTO.mapMetadatiCodifiche.ADT_DIMISSIONE_TIPO.codice,
    			"peso_nascita": _JSON_CONTATTO.mapMetadatiString.PESO_NEONATO==undefined ? null : _JSON_CONTATTO.mapMetadatiString.PESO_NEONATO,
    		    "diagnosi_ricovero": diagnosiRico != null ? diagnosiRico : "",
    		    "diagnosi_1":diagnosiVal[0]!=null ? diagnosiVal[0] : "",
    		    "diagnosi_2":diagnosiVal[1]!=null ? diagnosiVal[1] : "",	
    		    "diagnosi_3":diagnosiVal[2]!=null ? diagnosiVal[2] : "",
    		    "diagnosi_4":diagnosiVal[3]!=null ? diagnosiVal[3] : "",
    		    "diagnosi_5":diagnosiVal[4]!=null ? diagnosiVal[4] : "",
    		    "diagnosi_6":diagnosiVal[5]!=null ? diagnosiVal[5] : "",
    		    "diagnosi_7":diagnosiVal[6]!=null ? diagnosiVal[6] : "",
    	        "diagnosi_8":diagnosiVal[7]!=null ? diagnosiVal[7] : "",
    	    	"diagnosi_9":diagnosiVal[8]!=null ? diagnosiVal[8] : "",
    	        "diagnosi_10":diagnosiVal[9]!=null ? diagnosiVal[9] : "",
    	        "diagnosi_11":diagnosiVal[10]!=null ? diagnosiVal[10] : "",
    	        "diagnosi_12":diagnosiVal[11]!=null ? diagnosiVal[11] : "",
    	        "diagnosi_13":diagnosiVal[12]!=null ? diagnosiVal[12] : "",
    	        "diagnosi_14":diagnosiVal[13]!=null ? diagnosiVal[13] : "",			
    	        "diagnosi_15":diagnosiVal[14]!=null ? diagnosiVal[14] : "",    	        		
    	        "procedure_1":procedureVal[0]!=null ? procedureVal[0] : "",
    		    "procedure_2":procedureVal[1]!=null ? procedureVal[1] : "",	
    		    "procedure_3":procedureVal[2]!=null ? procedureVal[2] : "",
    		    "procedure_4":procedureVal[3]!=null ? procedureVal[3] : "",
    		    "procedure_5":procedureVal[4]!=null ? procedureVal[4] : "",
    		    "procedure_6":procedureVal[5]!=null ? procedureVal[5] : "",
    		    "procedure_7":procedureVal[6]!=null ? procedureVal[6] : "",
    	        "procedure_8":procedureVal[7]!=null ? procedureVal[7] : "",
    	    	"procedure_9":procedureVal[8]!=null ? procedureVal[8] : "",
    	        "procedure_10":procedureVal[9]!=null ? procedureVal[9] : "",
    	        "procedure_11":procedureVal[10]!=null ? procedureVal[10] : "",
    	        "procedure_12":procedureVal[11]!=null ? procedureVal[11] : "",
    	        "procedure_13":procedureVal[12]!=null ? procedureVal[12] : "",
    	        "procedure_14":procedureVal[13]!=null ? procedureVal[13] : "",			
    	        "procedure_15":procedureVal[14]!=null ? procedureVal[14] : "",
    	        "chiave_utente":home.baseUser.USERNAME,
    	        "tipo_ricovero":_JSON_CONTATTO.tipo.codice
    	};
    	return datiGrouper;
    },
    calcolaTariffa:function(idenContatto){
    	var db = $.NS_DB.getTool({setup_default:{datasource:'ADT'}});
        var parametri = {
            pIdenContatto:{v: idenContatto, t:'N'},
            pIdenPer:{v:home.baseUser.IDEN_PER,t:'N'},
            p_result:{t:'V',d:'O'}
        };
        db.call_procedure(
            {
                id: 'ADT_GROUPER.TARIFFA_DRG',
                parameter : parametri,
                success: function(data){
                    var aRisultati=new Array();
                    var strRisultati;
                    var flgOk=true;
                    strRisultati=data.p_result;
                    var aRisultati=(strRisultati.split('*'));
                    for (var i=0; i<aRisultati.length; i++){
                        if (aRisultati[i].substring(0,2)=='KO'){
                            home.NOTIFICA.error({message:aRisultati[i],timeout: 5, title: 'Errore'});
                            flgOk=false;
                            NS_LOADING.hideLoading();
                        }
                    }
                    if (flgOk){
                    	NS_LOADING.hideLoading();
                        home.NOTIFICA.success({message: 'Tariffazione eseguita correttamente', timeout: 2, title: 'Success'});
                        // aggiorno _JSON_CONTATTO perchè drg e importi sono stati registrati nel db
                        _JSON_CONTATTO = NS_CONTATTO_METHODS.getContattoById(_IDEN_CONTATTO);
                        $("#txtCodDRG").val(_JSON_CONTATTO.codiceDRG);
                        NS_DIMISSIONE_SDO.Setter.setCodiceDRG();
                        $("#txtImportoDRG").val(_JSON_CONTATTO.importoDRG);
                        $("#txtImportoDRGFuoriSoglia").val(_JSON_CONTATTO.importoDRGFuorisoglia);
                    }
                }
            });
    }
};
function createJson(data, type){
   if(!$.isEmptyObject(data)){
       var result = data.p_result.split('|');
       for (var i = 0; i< result.length; i++){
           var cods = result[i].split('$');

           type.value.push({
               "descrizione":cods[2],
               "evento": {
                   "id": null,
                   "codice": "A03"
               },
               "data": null,
               "ordine": i,
               "id": null,
               "codice": cods[1]
           });
       }
   }

};