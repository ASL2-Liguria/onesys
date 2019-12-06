
var numeroRiga=0;
	
jQuery(document).ready(function(){

	//ONBLUR  txtOraProposta
	jQuery("#txtOraProposta").blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta')); });
			
	//ONKEYUP  txtOraProposta
	jQuery("#txtOraProposta").keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta')); });
			
	//ONBLUR  txtDataProposta
	jQuery("#txtDataProposta").blur(function(){	controllaDataProposta(); });
	
	DATA_PROPOSTA.addEvent();

});



var DATA_PROPOSTA = {
	
	aggiungiRiga:function(){
		
		var prec = (numeroRiga = 0 ? '' : numeroRiga);
		numeroRiga++;

		var html= "<TR><TD class=classTdLabelLink_O STATO_CAMPO=\"O\"><LABEL id=lblDataProposta"+numeroRiga+" onclick=\"javascript:if(_STATO_PAGINA != 'L' &amp;&amp; _STATO_PAGINA !='E' ){document.getElementById('txtDataProposta').value=getToday();}\" name=\"lblDataProposta\">Data programmata prelievo</LABEL></TD>"+
			"<TD class=classTdField_O_O STATO_CAMPO=\"O\" STATO_CAMPO_LABEL=\"lblDataProposta\"><INPUT id=txtDataProposta"+numeroRiga+" class=hasDatepick maxLength=10 size=10 name=txtDataProposta"+numeroRiga+" STATO_CAMPO=\"O\" STATO_CAMPO_LABEL=\"lblDataProposta\" length=\"10\" max_length=\"10\" jQuery1341932397154=\"4\">"+
			"<IMG class=\"trigger datepick-trigger\" src=\"http://localhost:8080/whale/imagexPix/calendario/cal20x20.gif\" jQuery1341932397154=\"5\"></IMG class=datepick-trigger jQuery1341932397154=\"6\"> </INPUT></TD>" +
			"<TD class=classTdLabel_O_O STATO_CAMPO=\"O\"><LABEL id=lblOraProposta"+numeroRiga+" name=\"lblOraProposta"+numeroRiga+"\">Orario programmato prelievo</LABEL></TD>"+
			"<TD class=classTdField_O_O STATO_CAMPO=\"O\" STATO_CAMPO_LABEL=\"lblOraProposta\"><INPUT id=txtOraProposta"+numeroRiga+" name=txtOraProposta"+numeroRiga+" STATO_CAMPO=\"O\" STATO_CAMPO_LABEL=\"lblOraProposta\" jQuery1341932397154=\"20\"> </INPUT></TD>"+
			"<TD style=\"WIDTH: auto\" class=\"classTdLabel btPlus\" colSpan=9 STATO_CAMPO=\"E\"><LABEL id=btPlus"+numeroRiga+" name=\"btPlus\">&nbsp;</LABEL></TD></TR>";

		jQuery("#divGroupDatiRichiestaLabo").find('table').append(html);
		
		jQuery("#btPlus"+prec).parent().removeClass("btPlus");
		jQuery("#btPlus"+numeroRiga).parent().click(function(){DATA_PROPOSTA.aggiungiRiga();});
		
		//ONBLUR  txtOraProposta
		jQuery("#txtOraProposta"+numeroRiga).blur(function(){ oraControl_onblur(document.getElementById('txtOraProposta'+numeroRiga)); });
		
		//ONKEYUP  txtOraProposta
		jQuery("#txtOraProposta"+numeroRiga).keyup(function(){ oraControl_onkeyup(document.getElementById('txtOraProposta'+numeroRiga)); });
		
		//ONBLUR  txtDataProposta
		jQuery("#txtDataProposta"+numeroRiga).blur(function(){controllaDataProposta(numeroRiga); });
		
	},
	
	addEvent:function(){
		
		indice = (numeroRiga = '0' ? '':numeroRiga);
		
		jQuery("#btPlus"+indice).parent().addClass("btPlus")
		jQuery("#btPlus"+indice).parent().click(function(){DATA_PROPOSTA.aggiungiRiga();});
	}
}