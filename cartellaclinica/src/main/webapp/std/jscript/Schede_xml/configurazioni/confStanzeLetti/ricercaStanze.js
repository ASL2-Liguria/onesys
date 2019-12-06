jQuery(document).ready(function(){
	RICERCA_STANZE.init();
});



var RICERCA_STANZE = {
	//url:"servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_STANZE&ILLUMINA=illumina(this.sectionRowIndex);",
		url:"servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_GRUPPI_STANZE&ILLUMINA=illumina(this.sectionRowIndex);",	
	
	init: function(){
		
		$('INPUT[name=radSceltaRicerca][value=DESCR]').attr('checked','checked');
		$('SELECT[name=cmbStato]').val('ATT');

		$('#groupWKGruppi').append("<table cellpadding='0' cellspacing='0' class='classTabHeader'><tr><td class='classTabHeaderSx'></td><td class='classTabHeaderMiddle'>Stanze</td><td class='classTabHeaderDx'></td></tr></table>");
		$('#groupWKStanze').append("<table cellpadding='0' cellspacing='0' class='classTabHeader'><tr><td class='classTabHeaderSx'></td><td class='classTabHeaderMiddle'>Letti</td><td class='classTabHeaderDx'></td></tr></table>");

           
	},
	
	setEvents:function(){
		
	},

	
	ricerca : function() {
	var where='&WHERE_WK=WHERE ';
		
		where+=" COD_CDC='"+$('SELECT[name=cmbReparto]').val()+"'";
		$('#frameGruppi')[0].src=RICERCA_STANZE.url+where;
		$('#frameStanze')[0].src='blank';
		$('#frameLetti')[0].src='blank';
	}
	
};