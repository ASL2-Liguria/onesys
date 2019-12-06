var NS_SIRD = {
  init:function(_obj){
    /*{cf_paziente:"",cf_richiedente:""}*/
    PAZIENTE.CF_PAZIENTE = _obj.cf_paziente;
    OPERATORE.CF_RICHIEDENTE = _obj.cf_richiedente;
    NS_SIRD.Ricerca();
    
  },
  setDati:function(){
        OPERATORE.setDati();
        PAZIENTE.setDati();
  },
  Ricerca:function(){
     $("#imgLoader").show();
    if(NS_SIRD.check()){
        var _OBJ =  NS_SIRD.initObject();       
        //var _url="http://192.168.3.222:7001/SIRD";
        var _url=SIRD_SERVICES.URL_MIDDLEWARE;
        var v_oo= JSON.stringify(_OBJ);
        var dataToSend = "INPUT="+v_oo;
        LOGGER.write(dataToSend);
        jQuery.support.cors = true;
        $.ajax({
            url: "../../proxy",
            data:"CALL="+_url+"&PARAM=userName="+opener.baseUser.LOGIN+"::"+dataToSend,
            cache: false,
            type: "POST",
            crossDomain: false,
            async:false,
            dataType: 'json',
			contentType:"application/x-www-form-urlencoded",
            success: function (resp)
            {
                    var va = JSON.stringify(resp);
                    LOGGER.write(va);
                    if(resp.LISTA_DOCUMENTI.ESITO == "OK"){    
                        HTML.reset();
                        HTML.crea(resp);    
                    }else{
                        alert(resp.LISTA_DOCUMENTI.ERRORE);
                    }
                    $("#imgLoader").hide();
            },
            error: function (resp)
            {
                    
                    alert('Impossibile scaricare dati');
                    $("#imgLoader").hide();
            }
        });
    }
    
    
  },
  check:function(){
    var v_ret = true;
    if($("#codiceFiscalePaziente").val() ==""){
        alert("Codice Fiscale Non valido!");
        v_ret =false;
    }
    return v_ret;  
  },
  initObject:function(){
        var da_data = NS_DATE.formatDB($("#oDaData").val());
        var a_data =  NS_DATE.formatDB($("#oAData").val());
        var testo = $("#txtTesto").val();
        var list_aziende="";
        $("#cmbAziendeSel option").each(function(){
           list_aziende = list_aziende + this.value + ","; 
        });
        list_aziende = list_aziende.substring(0,list_aziende.length-1);
        var tipo_documento = $("#cmbTipoRicerca").val();
        var _OBJ ={
            CF_PAZIENTE: $("#codiceFiscalePaziente").val(),
            CF_RICHIEDENTE: OPERATORE.CF_RICHIEDENTE,
            CODICE_AZIENDA_RICHIEDENTE: "080109",
            RUOLO_RICHIEDENTE: OPERATORE.RUOLO_RICHIEDENTE,
            CONTESTO_APPLICATIVO: "AP",
            TOKEN: "",
            TIPO_DOC_RICERCA: tipo_documento,
            DATA_MEM_DOC_START: "",
            DATA_MEM_DOC_END: "",
            DATA_GEN_DOC_START: da_data,
            DATA_GEN_DOC_END: a_data,
            TESTO_RICERCA: testo,
            ID_DOC: "",
            TIPO_DOC: "",
            AZIENDE: list_aziende,
            FSE: "1"
        };
    return _OBJ;
  },
  apriDocumento:function(_id_documento,_tipo_doc,diffdays){
        if(diffdays > 10){
            /*v_conf = confirm("La data di generazione del documento è > 10 giorni, continuare? Ogni operazione verrà tracciata");
            if(!v_conf){
                return;
            }*/
        }
        var _object = NS_SIRD.initObject();
        _object.ID_DOC = _id_documento;
        _object.TIPO_DOC=_tipo_doc;
        //var _url="http://192.168.3.222:7001/SIRD";
        var _url=SIRD_SERVICES.URL_MIDDLEWARE;
        var v_oo = JSON.stringify(_object);
        var dataToSend = "INPUT="+v_oo;
        LOGGER.write(dataToSend);
        window.open(_url+"?"+dataToSend,"ApplicationPDF");
  },
  Chiudi:function(){
      self.close();
  }
};

var NS_LISTBOX = {
  spostaElemento:function(father,son){
        var $to = $("[name='"+son+"']");
        var $from = $("[name='"+father+"']");
        var valore = $("option:selected",$from).val();
        var testo = $("option:selected",$from).text();
        var $opt = $(document.createElement("option"));
        if(typeof valore != 'undefined'){
            $opt.val(valore);
            $opt.text(testo);
            $to.append($opt);
            $("option:selected",$from).remove();
        }
  }
};
var OPERATORE = {
    CF_RICHIEDENTE:"",
    RUOLO_RICHIEDENTE:"",
    setDati:function(){
        OPERATORE.CF_RICHIEDENTE = opener.baseUser.COD_FISC;
        OPERATORE.RUOLO_RICHIEDENTE = "MS";
    }
};

var PAZIENTE = {
    CF_PAZIENTE:"",
    setDati:function(){
        var v_cf="";
        if(typeof opener.codice_fiscale !='undefined'){
             v_cf = opener.stringa_codici(opener.codice_fiscale);     
        }else{
			var v_iden = opener.globalIdenAnag;
			if(typeof v_iden == 'undefined'){
				v_iden = opener.stringa_codici(opener.array_iden_anag);
			}
            //aperto da consolle
            dwr.engine.setAsync(false);
            var v_sql ="select cod_fisc from anag where iden = " + v_iden;
            toolKitDB.getResultData(v_sql,function(rs){
                v_cf=rs[0];
            });
            dwr.engine.setAsync(true);
            
        }
        $("#codiceFiscalePaziente").val(v_cf);
        PAZIENTE.CF_PAZIENTE = v_cf ;  
    }
};

var _Model = [
    {
      display: 'Paziente', name : 'Paziente', width : 200, sortable : true, align: 'left'
    },
    {
      display: 'Tipo Documento', name : 'TipoDocumento', width : 200, sortable : true, align: 'left'
    },
    {
      display: 'Azienda Erogante', name : 'AziendaErogante', width : 150, sortable : true, align: 'left'
    },
    {
      display: 'Data Documento', name : 'DataDocumento', width : 100, sortable : true, align: 'left'
    },
    {
      display: 'Operazioni', name : 'Operazioni', width : 180, sortable : true, align: 'left'
    },
    {
      display: 'Id Documento', name : 'IdDocumento', width : 250, sortable : true, align: 'left'
    },
    {
      display: 'Type', name : 'Type', width : 1, sortable : true, align: 'left'
    }
    
];

var HTML = {
     reset:function(){
        $(".flexigrid").remove();
    },
    crea:function(_object){
        var ArrayData = [];
        var Arraytratt =[];
        var json = new Object();
        var jsontr  = {};
        
        //alert(JSON.stringify(_object))
		//se ce n'è solo uno non lo sto manco ad ordinare altrimenti lo elaboro
        if(_object.LISTA_DOCUMENTI.NUMERO_DOCUMENTI < 2){
            $.each(_object.LISTA_DOCUMENTI,function(k,v){
                    if(k=="DOCUMENTO"){
					    var booleanDocument =false;
						var v_descrizione ="";
						var tipo_open_documento="";
                        $.each(JSON_DOCUMENTI,function(k2,v2){
                            if(k2==v.TIPO_DOC){
                                booleanDocument=true;
								v_descrizione = v2;
								tipo_open_documento = v.TIPO_DOC;
                            }
                        });
						if(booleanDocument){
							var v_data =NS_DATE.formatVisualeDate(v.DATA_DOC);
							jsontr = new Object();
							json = new Object();
							json.PAZIENTE=v.COGNOME_PAZIENTE + " " + v.NOME_PAZIENTE;
							json.TIPO_DOC=v_descrizione;
							$.each(JSON_AZIENDE,function(k1,v1){
							   if(k1==v.AZIENDA_EROGANTE){
								   json.AZIENDA_EROGANTE = v1;
							   } 
							});
	//                        json.AZIENDA_EROGANTE=v.AZIENDA_EROGANTE;
							json.DATA_DOC=v_data;
							json.OPZIONI="";
							json.ID_DOC=v.ID_DOC;
							json.TYPE = tipo_open_documento;
							jsontr={"id_doc":v.ID_DOC};
							ArrayData.push(json);
							Arraytratt.push(jsontr);
						}
                    }
            });
        }else{
		    var arr_ordered = NS_ORDER.order(_object.LISTA_DOCUMENTI.DOCUMENTO,"DATA_DOC");
            $.each(arr_ordered,function(k,v){
					var booleanDocument =false;
					var v_descrizione ="";
					var tipo_open_documento="";
					$.each(JSON_DOCUMENTI,function(k2,v2){
						if(k2==v.TIPO_DOC){
							booleanDocument=true;
							v_descrizione = v2;
							tipo_open_documento = v.TIPO_DOC;
						}
					});
					if(booleanDocument){
						var v_data =NS_DATE.formatVisualeDate(v.DATA_DOC);
						jsontr = new Object();
						json = new Object();
						json.PAZIENTE=v.COGNOME_PAZIENTE + " " + v.NOME_PAZIENTE;
						json.TIPO_DOC=v_descrizione;
						$.each(JSON_AZIENDE,function(k1,v1){
						   if(k1==v.AZIENDA_EROGANTE){
							   json.AZIENDA_EROGANTE = v1;
						   } 
						});
						json.DATA_DOC=v_data;
						json.OPZIONI="";
						json.ID_DOC=v.ID_DOC;
						json.TYPE = tipo_open_documento;
						jsontr={"id_doc":v.ID_DOC};
						ArrayData.push(json);
						Arraytratt.push(jsontr);
					}
            });
        }
        var ArrayProcessClass = [{"COLUMN":"OPZIONI","FUNCTION":HTML.processClass}];
        var wkData =  {
          idTable:"oTablePdf",
          trClass:"trTable",
          arrayData:ArrayData,
          arrayTrAttribute:Arraytratt,
          jSonColumns:_Model,
          arrayColumnsData:["PAZIENTE","TIPO_DOC","AZIENDA_EROGANTE","DATA_DOC","OPZIONI","DATA_ISO","ID_DOC","TYPE"],
          objAppend:$("#formVisuale"),
          arrayProcessClass:ArrayProcessClass,
		  sortname:"DataIso"
        };
        $.worklistDynamic(wkData);   
        $("[id^='divButton']").click(function(){
            NS_SIRD.apriDocumento(this["id_doc"],this["tipo_doc"],this["diffdays"]);
        }); 
    },
    processClass:function($td,jSonRow){
        var $divButton = $(document.createElement("div"));
        $divButton.attr("title","visualizza");
        $divButton.attr("id","divButton" + jSonRow.ID_DOC);
        $divButton.attr("id_doc",jSonRow.ID_DOC);
        $divButton.attr("tipo_doc",jSonRow.TYPE);
        var v_diff = "";
        dwr.engine.setAsync(false);
        var v_sql = "select (sysdate - to_date('"+jSonRow.DATA_DOC+"','dd/MM/yyyy')) from dual";
        toolKitDB.getResultData(v_sql,function(resp){
            v_diff = resp[0];
        });
        dwr.engine.setAsync(true);
        $divButton.attr("diffdays",v_diff);
        $divButton.addClass("divButton");
        $td.append($divButton);
    }
};

var NS_DATE ={
    formatVisualeDT :function(val){
        if(val!="")
            return val.substring(6,8) + "/" + val.substring(4,6) + "/" + val.substring(0,4) + " " + val.substring(8,10) + ":" + val.substring(10,12) + ":" +val.substring(12,14) ;
    },
    formatVisualeDate:function(val){
        if(val!="")
            return val.substring(6,8) + "/" + val.substring(4,6) + "/" + val.substring(0,4) ;
    },
    formatDB: function(val){
        if(val!=""){
            return val.substring(6,10).toString()+ val.substring(3,5).toString()+ val.substring(0,2).toString() ;
        }else{
            return "";
        }
    }
};

var NS_ORDER = {
    order : function(array,key){
           return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x > y) ? -1 : ((x < y) ? 1 : 0));
        });
    }
};