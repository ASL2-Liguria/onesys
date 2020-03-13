// JavaScript Document
var id_esame = window.location.toString().split("=")[1];
var XML_lOAD = "";
var paziente = "";
var iden_tab_esa

$(document).ready(function()
{
    var SQLSelect   = "SELECT cogn || ' ' || nome || ' ' || DATETIMECONVERTER(data,'YYYYMMDD','DD/MM/YYYY') as paziente,esami.iden_esa from anag,esami where esami.iden_anag=anag.iden and esami.iden="+ id_esame;
    dwr.engine.setAsync(false);
    toolKitDB.getResultData(SQLSelect,resp_check_data);	
    dwr.engine.setAsync(true);
	if (resp_check_data.risposta != '0')
	{
		paziente = resp_check_data.risposta[0];
		iden_tab_esa = resp_check_data.risposta[1];
	}
	if ((iden_tab_esa != 4819)&&(iden_tab_esa != 4826))
		{
			alert("Impossibile aprire la valutazione per l'esame selezionato!")
			self.close();
			return;
		}
	
	var SQLSelect   = "";
    SQLSelect   = "SELECT IDEN,IDEN_ESAME,XML,DELETED FROM COLON_SCREENING WHERE TIPO_SCHEDA='VALUTAZIONE' AND DELETED<>'S' AND IDEN_ESAME="+ id_esame;
    dwr.engine.setAsync(false);
    toolKitDB.getResultData(SQLSelect,resp_check_data);	
    dwr.engine.setAsync(true);
	if (resp_check_data.risposta != '0')
	{
		XML_lOAD = resp_check_data.risposta[2];
		carica(XML_lOAD);
	}	

	//$("#txtnoteAmm").removeClass("ui-input-text");	
	//$("#txtnoteDim").removeClass("ui-input-text");
	
	$("input[type='checkbox']").click(function(){
		var dettaglio            = $(this);
		var idDettaglioName          = dettaglio.attr("name");   
		var idDettaglioId          = dettaglio.attr("id");   		
		$("input[type='checkbox'][name='"+ idDettaglioName +"']").attr("checked",false).checkboxradio("refresh");  
		$("input[type='checkbox'][id='"+ idDettaglioId +"']").attr("checked",true).checkboxradio("refresh");
  });

$("#titolo_scheda_dett").text(paziente)

});

function resp_check_data(valore)
{
	if (valore != null)
		resp_check_data.risposta = valore;
	else
		resp_check_data.risposta = 0;
}

function salva() {
	if (($("[name='idoneo']:checked").val()!="S")&&($("[name='idoneo']:checked").val()!="N"))
	{
		alert("Selezionare se il paziente è Idoneo!")
		return;
	}
	else
	{
		var vIdoneo = $("[name='idoneo']:checked").val();
	}
	var str = $("form").serialize();
	var xml_save = "";
	var obj = str.split("&");
	for( i = 0; i < obj.length; i++)
	{
		var obj_val = obj[i].split("=");
		if (obj_val[1]!="") xml_save = xml_save + "<campo key_campo='"+ obj_val[0] +"'>"+ decodeURIComponent(obj_val[1]).replace(/\+/g, " ") +"</campo>";
	}	
	xml_save = "<?xml version='1.0' encoding='ISO-8859-1'?><colonscopia xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>" + xml_save + "</colonscopia>"
	xml_save   =  xml_save.replace(/\'/g, "''");
    SQL = "BEGIN GASTRO_SCREEN_SAVE('VALUTAZIONE',"+ id_esame +",to_char(sysdate,'yyyymmdd'),'"+ opener.baseUser.LOGIN +"','"+ xml_save +"','"+ vIdoneo +"');END;";
    dwr.engine.setAsync(false);        
    toolKitDB.executeQueryData(SQL, function sqlSave(result){return;});
    dwr.engine.setAsync(true);
	self.close();
}

function carica(vXML)
{
	var xmlDOM = $.parseXML(vXML);
	var items = $(xmlDOM).find("campo").each(function(index, element){
		$("input[type='radio'][name='"+ $(this).attr('key_campo') +"'][value='"+ $(this).text() +"']").attr("checked",true).checkboxradio("refresh");
		$("input[type='checkbox'][name='"+ $(this).attr('key_campo') +"'][value='"+ $(this).text() +"']").attr("checked",true).checkboxradio("refresh");
		$("input[type='text'][name='"+ $(this).attr('key_campo') +"']").val($(this).text());
		$("#" + $(this).attr('key_campo')).val($(this).text())
	});
}