$(document).ready(function(){
	NS_VPO.init();
	NS_VPO.setEvents();
});

var NS_VPO={
    url: "",
	
    init: function(){
    	$('form[name="EXTERN"]').append($('<input type="hidden" name = "WHERE_WK_EXTRA"/>')); 
		$('#txtDaData').val(parent.clsDate.getData(new Date(),'DD/MM/YYYY'));
    	
    	NS_VPO.setView();    
		NS_VPO.applica_filtro_vpo(NS_VPO.url);
	
		var oDateMask = new MaskEdit("dd/mm/yyyy", "date");
		oDateMask.attach(document.dati.txtDataNascita);
		oDateMask.attach(document.dati.txtDaData);
		oDateMask.attach(document.dati.txtAData);
		
	},
	resettaCampi: function(){
		$("#txtCogn,#txtNumNoso,#txtNome,#txtDataNascita,#txtDaData,#txtAData").val('');
	},
	setEvents: function(){
		$("#txtCogn,#txtNome,#txtNumNoso,#txtDataNascita,#txtDaData,#txtAData").keypress(function(e){
			if(e.keyCode == 13){
				NS_VPO.applica_filtro_vpo();
			}
		});
		
	},
	
    setView : function() {
    	
    	
        //anestesista
    	if (baseUser.TIPO == 'M' && baseUser.TIPO_MED == 'A') {
    		NS_VPO.url= "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_RICERCA_VPO&ILLUMINA=illumina(this.sectionRowIndex);";    	    
        }
    	//specialista
    	else {
    		NS_VPO.url= "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_NOTE_VPO&ILLUMINA=illumina(this.sectionRowIndex);";
    		$('form[name="EXTERN"] input[name="WHERE_WK_EXTRA"]').val("COD_ESA='VPO_VC' ");
    	} 
    },
    
    applica_filtro_vpo : function(url) {
    	
    	// controllo campi obbligatori
    	if ($("#lblElencoReparti").val()==''){
    		alert("Scegliere il reparto");
    		return;
    	}

	
		if ($('#txtDaData').val()=='' && ($('#txtCogn').val()=='' || $('#txtCogn').val().length<2))
	            {
	                return alert('Attenzione, inserire un intervallo di tempo inferiore a 20 giorni o valorizzare il campo "Cognome" (almeno i due caratteri iniziali)');
	            }

		if ($('#txtCogn').val()=='' || $('#txtCogn').val().length<2){
			if(clsDate.difference.day($('#txtAData').val()!=''?clsDate.str2date($('#txtAData').val(),'DD/MM/YYYY'):new Date(),clsDate.str2date($('#txtDaData').val(),'DD/MM/YYYY'))>20){
				alert('Attenzione, inserire un intervallo di tempo inferiore a 20 giorni o valorizzare il campo "Cognome" (almeno i due caratteri iniziali)');	
				return;
			}
		}
		
    	var cogn = $("#txtCogn").val().toUpperCase();
    	var nome = $("#txtNome").val().toUpperCase();
    	$("#txtCogn").val(cogn);
    	$("#txtNome").val(nome);

        if (typeof url == 'undefined') {
            applica_filtro();
        } else {
        	applica_filtro(url);
        }
    }
};
