jQuery(document).ready(function(){
	RICERCA_PATOLOGIE.init();
	RICERCA_PATOLOGIE.setEvents();
	applica_filtro('servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_ICD_DIAGNOSI');
	//jQuery("#oIFWk").css("width","50%")
});

var codiceGruppo=null;
var RICERCA_PATOLOGIE = {
		
	init : function(){
		setGruppo();
	},
	setEvents: function(){
		$("#chkAttivo").click( function(){
		   if( $(this).is(':checked') ) {
			   $("#hAttivo").val("'S'");
		   }
		   else {
			   $("#hAttivo").val("'N'");
		   }
	});
	}
};

function setGruppo() {
	//var sql="SELECT GRUPPI.CODICE FROM GRUPPI INNER JOIN GRUPPI_MEMBRI ON GRUPPI_MEMBRI.IDEN_GRUPPO=GRUPPI.IDEN INNER JOIN CENTRI_DI_COSTO ON GRUPPI_MEMBRI.IDEN_MEMBRO=CENTRI_DI_COSTO.IDEN WHERE GRUPPI.TIPO='DIAGNOSI' AND CENTRI_DI_COSTO.COD_CDC IN (";
	var sql ="SELECT DISTINCT COD_SPECIALITA FROM VIEW_CDC_SPECIALITA WHERE COD_CDC IN ("
	for (var i=0; i<baseUser.LISTAREPARTI.length; i++){
		if (i>0) { sql+=","; }
		sql+="'"+baseUser.LISTAREPARTI[i]+"'";
	}
	sql += ")@COD_SPECIALITA@1"; // nome del campo ritornato dalla select e tipo del campo 1 = stringa
	dwr.engine.setAsync(false);
	CJsUpdate.select(sql, leggiGruppo);
	dwr.engine.setAsync(true);
}

function leggiGruppo(codGruppo){
	var i = codGruppo.indexOf("@");
	codiceGruppo=codGruppo.substring(0,i);
	//alert('codiceGruppo='+codiceGruppo);
	$('#hCategoria').val("'"+codiceGruppo+"'");
	//alert($('#hCategoria').val());
}