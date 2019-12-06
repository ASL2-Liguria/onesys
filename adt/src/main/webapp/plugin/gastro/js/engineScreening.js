// JavaScript Document
var id_esame = window.location.toString().split("=")[1];
var XML_lOAD = "";

$(document).ready(function()
{

	var SQLSelect   = "";
    SQLSelect   = "SELECT IDEN,IDEN_ESAME,XML,DELETED FROM COLON_SCREENING WHERE TIPO_SCHEDA='LESIONI' AND DELETED<>'S' AND IDEN_ESAME="+ id_esame;
	//alert(SQLSelect)
    dwr.engine.setAsync(false);
    toolKitDB.getResultData(SQLSelect,resp_check_data);	
    dwr.engine.setAsync(true);
	if (resp_check_data.risposta != '0')
	{
		XML_lOAD = resp_check_data.risposta[2];
		carica(XML_lOAD);
	}
	else
	{
	document.all.txtmedico.value = opener.baseUser.DESCRIPTION;
	}

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

/*	if (iden_tab_esa != 4445 )
		{
			alert("Impossibile aprire il Completamento Scheda Screening Colon per l'esame selezionato")
			self.close();
			return;
		}
*/
	
	$("#titolo_scheda_dett").text("Screening Colonscopia: " + paziente)
	$("#txtnumero_polipi_recuperati").removeClass("ui-input-text");
	$("#txtnumero_polipi").removeClass("ui-input-text");	
	$("#txtnumero_polipi_asportati").removeClass("ui-input-text");
/*	$("#txtdimensioneendoL1").removeClass("ui-input-text");
	$("#txtdimensioneendoL2").removeClass("ui-input-text");
	$("#txtdimensioneendoL3").removeClass("ui-input-text");
	$("#txtdimensioneendoL4").removeClass("ui-input-text");
	$("#txtdimensioneendoL5").removeClass("ui-input-text");		
	$("#txttipo_istol_L2").removeClass("ui-input-text");
	$("#txttipo_istol_L3").removeClass("ui-input-text");
	$("#txttipo_istol_L4").removeClass("ui-input-text");
	$("#txttipo_istol_L5").removeClass("ui-input-text");	
	$("#txtdata_ref_isto_L1").removeClass("ui-input-text");
	$("#txtdata_ref_isto_L2").removeClass("ui-input-text");
	$("#txtdata_ref_isto_L3").removeClass("ui-input-text");
	$("#txtdata_ref_isto_L4").removeClass("ui-input-text");
	$("#txtdata_ref_isto_L5").removeClass("ui-input-text");		
	$("#txtdataconclusione").removeClass("ui-input-text");
	$("#txtfollowup").removeClass("ui-input-text");
	$("#txtmedico").removeClass("ui-input-text");*/
	
	$("input[type='checkbox']").click(function(){
		var dettaglio            = $(this);
		var idDettaglioName          = dettaglio.attr("name");   
		var idDettaglioId          = dettaglio.attr("id");   		
		$("input[type='checkbox'][name='"+ idDettaglioName +"']").attr("checked",false).checkboxradio("refresh");  
		$("input[type='checkbox'][id='"+ idDettaglioId +"']").attr("checked",true).checkboxradio("refresh");  
	});

	$('[id$="groupL1"]').mouseenter(function(){
		$("#btn1groupL1").addClass("ui-btn-active");
		$("#btn2groupL2").removeClass("ui-btn-active");
		$("#btn3groupL3").removeClass("ui-btn-active");				
		$("#btn4groupL4").removeClass("ui-btn-active");				
		$("#btn5groupL5").removeClass("ui-btn-active");								
	});	
	$('[id$="groupL2"]').mouseenter(function(){
		$("#btn1groupL1").removeClass("ui-btn-active");
		$("#btn2groupL2").addClass("ui-btn-active");
		$("#btn3groupL3").removeClass("ui-btn-active");				
		$("#btn4groupL4").removeClass("ui-btn-active");				
		$("#btn5groupL5").removeClass("ui-btn-active");										
	});		
	$('[id$="groupL3"]').mouseenter(function(){
		$("#btn1groupL1").removeClass("ui-btn-active");
		$("#btn2groupL2").removeClass("ui-btn-active");
		$("#btn3groupL3").addClass("ui-btn-active");				
		$("#btn4groupL4").removeClass("ui-btn-active");				
		$("#btn5groupL5").removeClass("ui-btn-active");										
	});	
	$('[id$="groupL4"]').mouseenter(function(){
		$("#btn1groupL1").removeClass("ui-btn-active");
		$("#btn2groupL2").removeClass("ui-btn-active");
		$("#btn3groupL3").removeClass("ui-btn-active");	
		$("#btn4groupL4").addClass("ui-btn-active");				
		$("#btn5groupL5").removeClass("ui-btn-active");													
	});	
	$('[id$="groupL5"]').mouseenter(function(){
		$("#btn1groupL1").removeClass("ui-btn-active");
		$("#btn2groupL2").removeClass("ui-btn-active");
		$("#btn3groupL3").removeClass("ui-btn-active");				
		$("#btn4groupL4").removeClass("ui-btn-active");				
		$("#btn5groupL5").addClass("ui-btn-active");										
	});			

  $(function() {
    $( "#txtdataconclusione" ).datepicker();
	$( "#txtdata_ref_isto_L1" ).datepicker();
	$( "#txtdata_ref_isto_L2" ).datepicker();
	$( "#txtdata_ref_isto_L3" ).datepicker();
	$( "#txtdata_ref_isto_L4" ).datepicker();
	$( "#txtdata_ref_isto_L5" ).datepicker();		
  });
  
	$("#txtdimensioneendoL1").keyup(function(){
		check_num("txtdimensioneendoL1")
	});
	$("#txtdimensioneendoL2").keyup(function(){
		check_num("txtdimensioneendoL2")
	});	
	$("#txtdimensioneendoL3").keyup(function(){
		check_num("txtdimensioneendoL3")
	});	
	$("#txtdimensioneendoL4").keyup(function(){
		check_num("txtdimensioneendoL4")
	});	
	$("#txtdimensioneendoL5").keyup(function(){
		check_num("txtdimensioneendoL5")
	});					
 
});

function check_num(campo){
	
	//var last_char = $("#" + campo ).val().substr($("#"+ campo).val().length-1,1);
	var last_char = $("#" + campo ).val();
	if (isNaN(last_char)) {
		alert("Prego,inserire un valore numerico");
		//$("#" + campo).val($("#" + campo).val().substr(0,$("#" + campo).val().length-1));
		$("#" + campo).val("");
		$("#" + campo).focus();
		return;
	}
}

function resp_check_data(valore)
{
	if (valore != null)
		resp_check_data.risposta = valore;
	else
		resp_check_data.risposta = 0;
}

function salva() {
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
    SQL = "BEGIN GASTRO_SCREEN_SAVE('LESIONI',"+ id_esame +",to_char(sysdate,'yyyymmdd'),'"+ opener.baseUser.LOGIN +"','"+ xml_save +"');END;";
    dwr.engine.setAsync(false);        
    toolKitDB.executeQueryData(SQL, function sqlSave(result){return;});
    dwr.engine.setAsync(true);
	self.close();
}

function carica(vXML)
{
	var xmlDOM = $.parseXML(vXML);
	var items = $(xmlDOM).find("campo").each(function(index, element){
		//alert($(this).attr('key_campo'))
		$("input[type='radio'][name='"+ $(this).attr('key_campo') +"'][value='"+ $(this).text() +"']").attr("checked",true).checkboxradio("refresh");
		$("input[type='checkbox'][name='"+ $(this).attr('key_campo') +"'][value='"+ $(this).text() +"']").attr("checked",true).checkboxradio("refresh");
		$("input[type='text'][name='"+ $(this).attr('key_campo') +"']").val($(this).text());
		$("#"+$(this).attr('key_campo')).val($(this).text()).selectmenu("refresh");	
	});
}