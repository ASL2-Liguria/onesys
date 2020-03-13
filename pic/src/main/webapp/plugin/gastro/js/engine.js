// JavaScript Document
var id_esame = window.location.toString().split("=")[1];
var XML_lOAD = "";

$(document).ready(function()
{
	var SQLSelect   = "";
    SQLSelect   = "SELECT IDEN,IDEN_ESAME,XML,DELETED FROM COLON_SCREENING WHERE DELETED<>'S' AND IDEN_ESAME="+ id_esame;
    dwr.engine.setAsync(false);
    toolKitDB.getResultData(SQLSelect, function resp_check_data(valore){resp_check_data.risposta = valore;});	
    dwr.engine.setAsync(true);
	if (resp_check_data.risposta != '0')
	{
		XML_lOAD = resp_check_data.risposta[2];
		carica(XML_lOAD);
	}	
	//$("#txtdimensioneendoL1").removeClass("ui-input-text ui-body-c ui-corner-all ui-shadow-inset");
	$("#txtdimensioneendoL1").removeClass("ui-input-text");
	$("#txtdimensioneendoL2").removeClass("ui-input-text");
	$("#txtdimensioneendoL3").removeClass("ui-input-text");
	$("#txttipo_istol_L1").removeClass("ui-input-text");
	$("#txttipo_istol_L2").removeClass("ui-input-text");
	$("#txttipo_istol_L3").removeClass("ui-input-text");
	$("#txtdata_ref_isto_L1").removeClass("ui-input-text");
	$("#txtdata_ref_isto_L2").removeClass("ui-input-text");
	$("#txtdata_ref_isto_L3").removeClass("ui-input-text");
	$("#txtdataconclusione").removeClass("ui-input-text");
	$("#txtfollowup").removeClass("ui-input-text");
	$("#txtmedico").removeClass("ui-input-text");	

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
	});	
	$('[id$="groupL2"]').mouseenter(function(){
		$("#btn1groupL1").removeClass("ui-btn-active");
		$("#btn2groupL2").addClass("ui-btn-active");
		$("#btn3groupL3").removeClass("ui-btn-active");				
	});		
	$('[id$="groupL3"]').mouseenter(function(){
		$("#btn1groupL1").removeClass("ui-btn-active");
		$("#btn2groupL2").removeClass("ui-btn-active");
		$("#btn3groupL3").addClass("ui-btn-active");				
	});	
		
});

function salva() {
	var str = $("form").serialize();
	var xml_save = "";
	var obj = str.split("&");
	for( i = 0; i < obj.length; i++)
	{
		var obj_val = obj[i].split("=");
		if (obj_val[1]!="") xml_save = xml_save + "<campo key_campo='"+ obj_val[0] +"'>"+ decodeURIComponent(obj_val[1]) +"</campo>";
	}	
	alert(xml_save)
	xml_save = "<?xml version='1.0' encoding='ISO-8859-1'?><colonscopia xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'>" + xml_save + "</colonscopia>"
	xml_save   =  xml_save.replace(/\'/g, "''");
    SQL = "BEGIN GASTRO_SCREEN_SAVE("+ id_esame +",to_char(sysdate,'yyyymmdd'),'"+ opener.baseUser.LOGIN +"','"+ xml_save +"');END;";
	//alert(SQL)
    dwr.engine.setAsync(false);        
    toolKitDB.executeQueryData(SQL, function sqlSave(result){return;});
    dwr.engine.setAsync(true);
	self.close();
}

function carica(vXML)
{
		//var vXML = "<?xml version='1.0' encoding='ISO-8859-1'?><colonscopia xmlns:xsi='http://www.w3.org/2001/XMLSchema-instance'><campo key_campo='descrizione_endoscopica_L1'>01</campo><campo key_campo='descrizione_endoscopica_L1'>03</campo><campo key_campo='dimensione_endoscopicaL1'>365</campo><campo key_campo='sede_L1'>C18.3</campo><campo key_campo='sede_L1'>C18.6</campo><campo key_campo='sede_L1'>C21.1</campo><campo key_campo='data_ref_isto_L1'>25%25252525252F12%25252525252F2012</campo><campo key_campo='descrizione_endoscopica_L2'>05</campo><campo key_campo='compl_tard'>00</campo><campo key_campo='compl_tard'>01</campo><campo key_campo='compl_tard'>02</campo><campo key_campo='compl_tard'>03</campo><campo key_campo='compl_tard'>09</campo></colonscopia>"

	var xmlDOM = $.parseXML(vXML);
	var items = $(xmlDOM).find("campo").each(function(index, element){
		//alert($(this).attr('key_campo'))
		$("input[type='radio'][name='"+ $(this).attr('key_campo') +"'][value='"+ $(this).text() +"']").attr("checked",true).checkboxradio("refresh");
		$("input[type='checkbox'][name='"+ $(this).attr('key_campo') +"'][value='"+ $(this).text() +"']").attr("checked",true).checkboxradio("refresh");
		$("input[type='text'][name='"+ $(this).attr('key_campo') +"']").val($(this).text());
	});

}