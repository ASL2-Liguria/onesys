$(document).ready(function(){
	NS_RICERCA_DIMESSI.init();
	NS_RICERCA_DIMESSI.setEvents();
});

var NS_RICERCA_DIMESSI={
	init: function(){
		applica_filtro('servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_RICERCA_DIMESSI&WHERE_WK= where COD_CDC IN (\'\')');
	},
	resettaCampi: function(){
		$("#txtCogn").val('');
		$("#txtNumNoso").val('');
		$("#txtNome").val('');
		$("#txtDataNascita").val('');
		$("#txtDaData").val('');
		$("#txtAData").val('');
	},
	setEvents: function(){
		$("#txtCogn").keypress(function(e){
			if(e.keyCode == 13){
				aux_applica_filtro();
			}
		});
		$("#txtNome").keypress(function(e){
			if(e.keyCode == 13){
				aux_applica_filtro();
			}
		});
		$("#txtNumNoso").keypress(function(e){
			if(e.keyCode == 13){
				aux_applica_filtro();
			}
		});
		$("#txtDataNascita").keypress(function(e){
			if(e.keyCode == 13){
				aux_applica_filtro();
			}
		});
		$("#txtDaData").keypress(function(e){
			if(e.keyCode == 13){
				aux_applica_filtro();
			}
		});
		$("#txtAData").keypress(function(e){
			if(e.keyCode == 13){
				aux_applica_filtro();
			}
		});
	}
};

function aux_applica_filtro(){
	// controllo campi obbligatori
	if ($("#lblElencoReparti").val()==''){
		alert("Scegliere il reparto");
		return;
	}
	if (($("#txtCogn").val()=='') && ($("#txtNumNoso").val()=='') && ($("#txtDaData").val()=='') ){
		alert("Compilare il cognome o il numero nosologico o la data di inizio periodo");
		return;
	}
	if (($("#txtCogn").val()!='') && $("#txtCogn").val().length<2){
		alert('Inserire almeno 2 caratteri per il cognome');
		return;
	}
	var cogn = $("#txtCogn").val().toUpperCase();
	var nome = $("#txtNome").val().toUpperCase();
	$("#txtCogn").val(cogn);
	$("#txtNome").val(nome);
	applica_filtro('servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_RICERCA_DIMESSI');
}