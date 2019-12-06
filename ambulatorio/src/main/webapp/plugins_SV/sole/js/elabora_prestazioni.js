$(document).ready(function(){
   NS_ELABORA.init(); 
});

var _Model = [
   
    {
      display: 'Cod Min', name : 'CodMin', width : 80, sortable : true, align: 'left'
    },
	{
      display: 'Cod Reg', name : 'cur', width : 80, sortable : true, align: 'left'
    },
    {
      display: 'Codice CUP', name : 'CodEsa', width : 200, sortable : true, align: 'left'
    },
    {
      display: 'Descrizione', name : 'Descrizione', width : 400, sortable : true, align: 'left'
    }
    
];

var NS_ELABORA = {
	COD_REG:"",
    COD_MIN:"",
    PROGRESSIVO_PRESTAZIONE:"",
    OFFLINE:"",
	DESCRIZIONE_PRESTAZIONE:"",
    init:function(){
        $("#DescrPrestazione").focus();
        $("#DescrPrestazione").keypress(function(e){
            if(e.which==13){
                NS_ELABORA.Ricerca();
                return false;
            }
            
        });
        NS_ELABORA.COD_MIN = getURLParameter("COD_MIN");
		NS_ELABORA.COD_REG = getURLParameter("COD_REG");
        NS_ELABORA.PROGRESSIVO_PRESTAZIONE = getURLParameter("PROGRESSIVO_PRESTAZIONE");
        NS_ELABORA.OFFLINE=getURLParameter("OFFLINE");
        NS_ELABORA.DESCRIZIONE_PRESTAZIONE=getURLParameter("DESCRIZIONE_PRESTAZIONE");
        $("#sostituzione").html($("#sostituzione").html() + " - " + NS_ELABORA.DESCRIZIONE_PRESTAZIONE);
        if(NS_ELABORA.OFFLINE !="S"){
            /*dwr.engine.setAsync(false);
			var v_sql  ="WITH REP AS(select to_char(regexp_substr(x, '[^,]+', 1, level)) ID ";
            v_sql +="  from(select '"+opener.opener.baseUser.LISTAREPARTI+"' x from dual) connect by level <= length(x) - length(replace(x, ',')) + 1) ";
            v_sql +=" SELECT TE.IDEN,COD_MIN,COD_ESA,TE.DESCR FROM VIEW_SCHEDA_ESAME_SAL_MAC  VM INNER JOIN TAB_ESA TE ON TE.IDEN=VM.IDEN ";
			v_sql +=" inner join REP on (VM.REPARTO = REP.ID)";
            toolKitDB.getListResultData(v_sql,function(resp){
                    if(resp!=""){
                        NS_ELABORA.creaHtml(resp);    
                    }

            });
            dwr.engine.setAsync(true);*/
        }
		NS_ELABORA.Ricerca();
    },
    importa:function(){
        if(NS_ELABORA.OFFLINE != "S"){
            var _obj = new Object();
            _obj.LISTA_PRESTAZIONI_AGGIUNTE = new Array();
            $.each($("#oTablePrestazioni tr"),function(k,v){
                if($(v).hasClass("trSelected")){
                    var PRESTAZIONE = new Object();
                    PRESTAZIONE.IDEN_ESA=$(v).attr("iden");
                    PRESTAZIONE.DESCRIZIONE=$(v).attr("descr");
                    PRESTAZIONE.DESCRIZIONE_RIS=$(v).attr("descr");
                    PRESTAZIONE.CODICE_SOLE=$(v).attr("codEsa");
                    _obj.LISTA_PRESTAZIONI_AGGIUNTE.push(PRESTAZIONE);
                }
            });        
            opener.NS_SARPED.sostituisci(NS_ELABORA.PROGRESSIVO_PRESTAZIONE,_obj);
            self.close();
        }else{
            $("#divWkOffline").show();
            $.each($("#oTablePrestazioni tr"),function(k,v){
                if($(v).hasClass("trSelected")){
                    var len = $("#tblPrestazioniOffline tr").length;
                    $("#tblPrestazioniOffline tr").each(function(k1,v1){
                        if(k1 == (len - 1)){
                            var $tr = $(document.createElement("tr")).addClass("trTableImport");
                            $tr.attr("descr",$(v).attr("descr"));
                            $tr.attr("iden",$(v).attr("iden"));
                            $tr.attr("codEsa",$(v).attr("codEsa"));
                            $tr.attr("progressivo",parseInt(k1) + 1);
                            var $td = $(document.createElement("td")).html(k1 + 1);
                            var $td2 = $(document.createElement("td")).html($(v).attr("descr"));
                            var $elem = $tr.append($td).append($td2);
                            $("#tblPrestazioniOffline").append($elem);
                        }
                    });
                }
            });
 
        }
    },
    creaHtml:function(rs){
        var arrayTrAttribute=new Array();
        var ArrayData=new Array();
        var jSonData=new Object();
        var jSonTrAttribute=new Object();
        $.each(rs,function(k,v){
            jSonData=new Object();
            jSonTrAttribute=new Object();
            jSonData.COD_MIN = v[1];
			jSonData.IDEN = v[4];
            jSonData.COD_ESA = v[2];
            jSonData.DESCR = v[3];
            jSonTrAttribute = {"iden":v[0],"cod_esa":v[2],"descr":v[3]};
            arrayTrAttribute.push(jSonTrAttribute);
            ArrayData.push(jSonData);
        });
        var wkData =  {
                  idTable:"oTablePrestazioni",
                  trClass:"trTable",
                  arrayData:ArrayData,
                  arrayTrAttribute:arrayTrAttribute,
                  jSonColumns:_Model,
                  arrayColumnsData:["IDEN","COD_MIN","COD_ESA","DESCR"],
                  objAppend:$("#divWk"),
				  singleSelect:true
           };
        $.worklistDynamic(wkData);
    },
     Ricerca : function(){
        var v_testo  = $("#DescrPrestazione").val().toUpperCase();//UPPER
        if(v_testo.length != 0){
          v_testo=v_testo+"%";
        }
		
		dwr.engine.setAsync(false);
		//var v_sql = "SELECT TE.IDEN,COD_MIN,COD_ESA,TE.DESCR FROM VIEW_SCHEDA_ESAME_SAL_MAC  VM INNER JOIN TAB_ESA TE ON TE.IDEN=VM.IDEN  WHERE te.descr like '%"+v_testo+"%' and REPARTO IN (SELECT COLUMN_VALUE FROM TABLE(SPLIT('"+opener.opener.baseUser.LISTAREPARTI+"',','))) order by te.descr"
		var v_sql  ="WITH REP AS(select to_char(regexp_substr(x, '[^,]+', 1, level)) ID ";
		v_sql +="  from(select '"+opener.opener.baseUser.LISTAREPARTI+"' x from dual) connect by level <= length(x) - length(replace(x, ',')) + 1) ";
		v_sql +=" SELECT DISTINCT TE.IDEN,COD_MIN,COD_ESA,TE.DESCR,CETE.COD1 FROM VIEW_SCHEDA_ESAME_SAL_MAC  VM INNER JOIN TAB_ESA TE ON TE.IDEN=VM.IDEN ";
		v_sql +=" inner join REP on (VM.REPARTO = REP.ID) ";
		v_sql +=" inner join cod_est_tab_esa cete on (cete.iden_esa = te.iden) where te.descr like '%"+v_testo+"' and ( cete.cod2='"+NS_ELABORA.COD_MIN+"' OR cete.cod1='"+NS_ELABORA.COD_REG+"')";
		
		toolKitDB.getListResultData(v_sql,function(resp){
			$(".flexigrid").remove();
			NS_ELABORA.creaHtml(resp);
		});
		dwr.engine.setAsync(true);
    },
    conferma:function(){
            var _obj = new Object();
            _obj.LISTA_PRESTAZIONI_AGGIUNTE = new Array();
            $.each($("#tblPrestazioniOffline .trTableImport"),function(k,v){
                    var PRESTAZIONE = new Object();
                    PRESTAZIONE.IDEN_ESA=$(v).attr("iden");
                    PRESTAZIONE.DESCRIZIONE=$(v).attr("descr");
                    PRESTAZIONE.DESCRIZIONE_RIS=$(v).attr("descr");
                    PRESTAZIONE.CODICE_SOLE=$(v).attr("codEsa");
                    PRESTAZIONE.PROGRESSIVO_PRESTAZIONE=$(v).attr("progressivo");
                    _obj.LISTA_PRESTAZIONI_AGGIUNTE.push(PRESTAZIONE);
            });       
            opener.NS_SARPED.inserisci(_obj);
            self.close();
    }
};


function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||"";
}