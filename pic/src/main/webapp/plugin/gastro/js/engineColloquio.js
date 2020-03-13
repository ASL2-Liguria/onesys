// JavaScript Document
var id_esame = window.location.toString().split("=")[1];
var XML_lOAD = "";
var paziente = "";
var iden_tab_esa

$(document).ready(function()
{
	var SQLSelect   = "";
    SQLSelect   = "SELECT cogn || ' ' || nome || ' ' || DATETIMECONVERTER(data,'YYYYMMDD','DD/MM/YYYY') as paziente,esami.iden_esa from anag,esami where esami.iden_anag=anag.iden and esami.iden="+ id_esame;
    dwr.engine.setAsync(false);
    toolKitDB.getResultData(SQLSelect,resp_check_data);	
    dwr.engine.setAsync(true);
	if (resp_check_data.risposta != '0')
	{
		//alert(resp_check_data.risposta[2])
		paziente = resp_check_data.risposta[0];
		iden_tab_esa = resp_check_data.risposta[1];
	}

	/*if (iden_tab_esa != 6460 )
		{
			alert("Impossibile aprire il Colooquio infermieristico per l'esame selezionato!")
			self.close();
			return;
		}*/
	
	var SQLSelect   = "";
    SQLSelect   = "SELECT IDEN,IDEN_ESAME,XML,DELETED FROM COLON_SCREENING WHERE TIPO_SCHEDA='COLLOQUIO' AND DELETED<>'S' AND IDEN_ESAME="+ id_esame;
    dwr.engine.setAsync(false);
    toolKitDB.getResultData(SQLSelect,resp_check_data);	
    dwr.engine.setAsync(true);
	if (resp_check_data.risposta != '0')
	{
		//alert(resp_check_data.risposta[2])
		XML_lOAD = resp_check_data.risposta[2];
		carica(XML_lOAD);
	}	

	$("#txtdata_RecVal").hide();
	$("#lblData_RecVal").hide();
	$("#txtdata_disp").removeClass("ui-input-text");	
	$("#txtdata_exe").removeClass("ui-input-text");	
	$("#txtdata_RecVal").removeClass("ui-input-text");	
	$("#txtnote").removeClass("ui-input-text");
	$("#txtnote").width('99%')
	
	$("input[type='checkbox']").click(function(){
		var dettaglio            = $(this);
		var idDettaglioName          = dettaglio.attr("name");   
		var idDettaglioId          = dettaglio.attr("id");   		
		$("input[type='checkbox'][name='"+ idDettaglioName +"']").attr("checked",false).checkboxradio("refresh");  
		$("input[type='checkbox'][id='"+ idDettaglioId +"']").attr("checked",true).checkboxradio("refresh");
		
		
		if ($("[id='chkRif7']:checked").val() != "07"){
			$("#txtdata_RecVal").hide();
			$("#lblData_RecVal").hide();}
		else{
			$("#txtdata_RecVal").show();
			$("#lblData_RecVal").show();}
		
		if (dettaglio.attr("id")=="txtdata_RecVal") $("input[type='checkbox'][name='motivo_rif']").attr("checked",false).checkboxradio("refresh");  
		
		if (dettaglio.attr("id")=="chkAdesioneS") $("input[type='checkbox'][name='motivo_rif']").attr("checked",false).checkboxradio("refresh");  
		if (dettaglio.attr("name")=="motivo_rif") {
			$("#chkAdesioneN").attr("checked",true).checkboxradio("refresh");  
			$("#chkAdesioneS").attr("checked",false).checkboxradio("refresh");  			
		}
	});

  $(function() {
	$( "#txtdata_disp" ).datepicker();	
	$( "#txtdata_exe" ).datepicker();	
	$( "#txtdata_RecVal" ).datepicker();	
  });	

  $(function() {
    $( document ).tooltip({
      position: {
        my: "center bottom-20",
        at: "center top",
        using: function( position, feedback ) {
          $( this ).css( position );
          $( "<div>" )
            .addClass( "arrow" )
            .addClass( feedback.vertical )
            .addClass( feedback.horizontal )
            .appendTo( this );
        }
      }
    });
  });
//alert(paziente)
$("#titolo_scheda_dett").text(paziente)
if ($("[id='chkRif7']:checked").val() != "07"){
	$("#txtdata_RecVal").hide();
	$("#lblData_RecVal").hide();}
else{
	$("#txtdata_RecVal").show();
	$("#lblData_RecVal").show();}
});

function resp_check_data(valore)
{
	if (valore != null)
		resp_check_data.risposta = valore;
	else
		resp_check_data.risposta = 0;
}

function salva() {

	if (($("[name='abilita_adesione']:checked").val()!="S")&&($("[name='abilita_adesione']:checked").val()!="N"))
	{
		alert("Selezionare se il paziente ha aderito.")
		return;
	}
	if (($("[name='abilita_adesione']:checked").val()=="N")&&($("[name='motivo_rif']:checked").val()==undefined))
	{
			alert("Selezionare il motivo di non adesione")
			return;
	}
	if (($("[id='chkRif7']:checked").val() == "07")&&($("[name='txtdata_RecVal']").val()==""))
	{
			alert("Inserire la data della recente Endoscopia validata!")
			return;
	}
	
	//if (($("[name='abilita_adesione']:checked").val()=="N")&&($("[name='motivo_rif']:checked").val()!=""))
	
	var str = $("form").serialize();
	var xml_save = "";
	
	var obj = str.split("&");
	
	for( i = 0; i < obj.length; i++)
	{
		var obj_val = obj[i].split("=");
		if (obj_val[1]!="") xml_save = xml_save + "<campo key_campo='"+ obj_val[0] +"'>"+ decodeURIComponent(obj_val[1]).replace(/\+/g, " ") +"</campo>";
		//alert("<campo key_campo='"+ obj_val[0] +"'>"+ decodeURIComponent(obj_val[1]) +"</campo>");
	}	
	xml_save = "<?xml version='1.0' encoding='ISO-8859-1'?><colonscopia xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>" + xml_save + "</colonscopia>"
	xml_save   =  xml_save.replace(/\'/g, "''");
    SQL = "BEGIN GASTRO_SCREEN_SAVE('COLLOQUIO',"+ id_esame +",to_char(sysdate,'yyyymmdd'),'"+ opener.baseUser.LOGIN +"','"+ xml_save +"');END;";
	//alert(SQL)
    dwr.engine.setAsync(false);        
    toolKitDB.executeQueryData(SQL, function sqlSave(result){return;});
    dwr.engine.setAsync(true);
	self.close();
}

function carica(vXML)
{
	var xmlDOM = $.parseXML(vXML);
	var items = $(xmlDOM).find("campo").each(function(index, element){
		//alert($(this).attr('key_campo') + '-' + $(this).text())
		$("input[type='radio'][name='"+ $(this).attr('key_campo') +"'][value='"+ $(this).text() +"']").attr("checked",true).checkboxradio("refresh");
		$("input[type='checkbox'][name='"+ $(this).attr('key_campo') +"'][value='"+ $(this).text() +"']").attr("checked",true).checkboxradio("refresh");
		$("input[type='text'][name='"+ $(this).attr('key_campo') +"']").val($(this).text());
		$("#" + $(this).attr('key_campo')).val($(this).text())


		if (($(this).text()=='07')&&($(this).attr('key_campo')=="motivo_rif"))
		{
			$("#txtdata_RecVal").show();
			$("#lblData_RecVal").show();
			}
	});

}