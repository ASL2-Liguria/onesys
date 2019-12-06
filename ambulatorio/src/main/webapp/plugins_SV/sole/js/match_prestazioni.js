function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||"";
}
var _Model = [
    {
      display: 'Agenda CUP', name : 'AgendaCUP', width : 150, sortable : true, align: 'left'
    },
	{
		display: 'Prenota', name : 'Prenota', width : 400, sortable : true, align: 'left'
	}    
];
var v_n=0;
$(document).ready(function(){
    NS_MATCH.init();
});
var NS_MATCH = {
    ARR_PRESTAZIONI:[],
    init:function(){
        NS_MATCH.createHtml();
    },
    createHtml:function(){
           var codice_fiscale = getURLParameter("codice_fiscale");
           
           dwr.engine.setAsync(false);
           var v_descrizione="";
           var v_sql = "select ROLE_ID from ec_v_user_roles where USER_ID ='"+codice_fiscale+"'";
           //var v_sql = "select ROLE_ID from ec_v_user_roles where USER_ID ='CZZFRI93C17A026J'";
            
           var ArrayData=[];
           var arrTrAtribute=[];
           
           toolKitDB.getListResultData(v_sql,function(rs){
               
               $.each(rs,function(k,v){
                    v_n = v_n+ 1;
                    var jSonData = new Object();
                    var jSonTrAttribute = new Object();
                    jSonData.ROLE_ID=v[0];
                    jSonData.OPZIONI="";
                    ArrayData.push(jSonData);
                    jSonTrAttribute={"role_id":v[0]};
                    arrTrAtribute.push(jSonTrAttribute);
               });               
           });
           dwr.engine.setAsync(true);
             var ArrayProcessClass = [{"COLUMN":"OPZIONI","FUNCTION":NS_MATCH.processClass}];
                    var wkData =  {
                              idTable:"oTable",
                              trClass:"trTable",
                              arrayData:ArrayData,
                              arrayTrAttribute:arrTrAtribute,
                              jSonColumns:_Model,
                              arrayColumnsData:["ROLE_ID","OPZIONI"],
                              objAppend:$("#divWk"),
                              arrayProcessClass:ArrayProcessClass,
							  sortname:""
                       };
                    $.worklistDynamic(wkData);
					$("[id^='divButton']").on("click",function(){
						NS_PRENOTA.prenotaDiretto(this["ruolo"]);
					});
                    if(v_n == 1){
                        $("[id^='oTable'] .trTable").addClass("trSelected");
                        NS_PRENOTA.conferma();
                    }
    },
    processClass:function($td,jSonRow){
            var $divButton = $(document.createElement("div"));
            $divButton.attr("ruolo",jSonRow.ROLE_ID);
            $divButton.attr("id","divButton");
            $divButton.attr("title","Prenota");
            $divButton.addClass("divButton");
            $td.append($divButton);
    }
};

var NS_PRENOTA = {
    conferma:function(){
                var tipo_evento = getURLParameter("tipo_evento");
                var v_ruolo="";
				
                $.each($("[id^='oTable'] tr"),function(k,v){
                        if($(v).hasClass("trSelected")){
                                v_ruolo=$(v).attr("role_id");
                        }
                });
                try{
                opener.NS_RICETTA.callEasyCup(v_ruolo,tipo_evento);
				
                }catch(e){
                    
                }
                self.close();
    },
    prenotaDiretto:function(_type){
		var tipo_evento = getURLParameter("tipo_evento");
		opener.NS_RICETTA.callEasyCup(v_ruolo,tipo_evento);
               try{
                opener.NS_RICETTA.callEasyCup(v_ruolo,tipo_evento);
				
                }catch(e){
                    
                }
                self.close();
	
	}
};