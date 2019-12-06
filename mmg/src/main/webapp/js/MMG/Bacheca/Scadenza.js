$(function(){
	SCADENZA.init();
	NS_FENIX_SCHEDA.beforeSave = SCADENZA.beforeSave;
	NS_FENIX_SCHEDA.afterSave = SCADENZA.afterSave;
});

var SCADENZA = {
		
		init: function() 
		{
			SCADENZA.setEvents();
			
			SCADENZA.setLayout();
			
			SCADENZA.setGiorni();
			
			SCADENZA.checkRicorrente();
			
			NS_FENIX_SCHEDA.addFieldsValidator({config:"VALIDATOR"});
		},
		
		setEvents: function() 
		{
			// rimosso provvisoriamente evento ricorrente
			$("#radRicorrente").closest("tr").hide();
			
			$("#radRicorrente").on("click", SCADENZA.checkRicorrente );
                        
                        $("#txtAnniPaz, #txtMesiPaz, #txtGiorniPaz").on("blur",function(){
                            if(	!$.isNumeric($(this).val())){
                                $(this).val("");
                                $(this).focus();
                                home.NOTIFICA.warning({
                                    message: 'Il valore inserito non \u00E8 numerico!',
                                    title: "Attenzione"
                                });
                            }
                        });
		},
		
		checkRicorrente: function() 
		{
			if(radRicorrente.val()=="S")
			{
				$("#txtAnniPaz,#txtMesiPaz,#txtGiorniPaz").closest("tr").hide();
				$("#txtGiorniOgni,#txtAnniDa,#txtMesiDa,#txtGiorniDa,#txtAnniA,#txtMesiA,#txtGiorniA").closest("tr").show();
			} 
			else 
			{
				$("#txtAnniPaz,#txtMesiPaz,#txtGiorniPaz").closest("tr").show();
				$("#txtGiorniOgni,#txtAnniDa,#txtMesiDa,#txtGiorniDa,#txtAnniA,#txtMesiA,#txtGiorniA").closest("tr").hide();
			}
		},
		
		setGiorni: function()
		{
			if ($("#hGiorniScadenza").val()!="") 
			{
				if(radRicorrente.val()!="S") 
					convertiInAnniMesiGiorni($("#hGiorniScadenza"),$("#txtAnniPaz"),$("#txtMesiPaz"),$("#txtGiorniPaz"));
				else 
				{
					$("#txtGiorniOgni").val($("#hGiorniScadenza").val());
					convertiInAnniMesiGiorni($("#hGiorniDa"),$("#txtAnniDa"),$("#txtMesiDa"),$("#txtGiorniDa"));
					convertiInAnniMesiGiorni($("#hGiorniA"),$("#txtAnniA"),$("#txtMesiA"),$("#txtGiorniA"));
				}
			} 
		},
		
		setLayout: function() 
		{
			if ($("#IDEN").length==0)
				$("#radAttivo").closest("tr").hide();
			
			$("#txtDescrizione").closest("td").attr("colspan","5");
		},
		
		afterSave: function()
		{
			home.SCADENZARIO_MEDICO.objWk.refresh();
			NS_FENIX_SCHEDA.chiudi();
		},
		
		beforeSave: function() 
		{
			if(radRicorrente.val()=="N") 
			{
				convertiInGiorni($("#txtAnniPaz"),$("#txtMesiPaz"),$("#txtGiorniPaz"),$("#hGiorniScadenza"));
				$("#hGiorniDa,#hGiorniA").val("");
			}
			else 
			{
				$("#hGiorniScadenza").val($("#txtGiorniOgni").val());
				convertiInGiorni($("#txtAnniDa"),$("#txtMesiDa"),$("#txtGiorniDa"),$("#hGiorniDa"));
				convertiInGiorni($("#txtAnniA"),$("#txtMesiA"),$("#txtGiorniA"),$("#hGiorniA"));
			}

			$("#hIdenMed").val($("#UTE_INS").val());
			
			return true;
		}
};

function convertiInGiorni(pInAnni, pInMesi, pInGiorni, pOutGiorni) 
{
	vGiorni = Number( pInAnni.val() * 365 ) + Number( pInMesi.val() * 30 ) + Number(pInGiorni.val());
	pOutGiorni.val(vGiorni);
}

function convertiInAnniMesiGiorni(pInGiorni, pOutAnni, pOutMesi, pOutGiorni) 
{
	var vAnni, vMesi, vGiorni;
	vAnni = Math.floor( pInGiorni.val() / 365 );
	vMesi = Math.floor(( pInGiorni.val() % 365 ) / 30);
	vGiorni = (( pInGiorni.val() % 365 ) % 30);
	
	pOutAnni.val(vAnni);
	pOutMesi.val(vMesi);
	pOutGiorni.val(vGiorni);
}

var VALIDATOR = {
		   elements:
		    {
			   	/*"hGiorniScadenza":
		        {
		            status: "required",
		            name: "Scadenza",
		            rules: { min : 1 }
		        },*/
		        "txtDescrizione":
		        {
		        	status: "required",
		        	name: "Evento"
		        }
		    }
};