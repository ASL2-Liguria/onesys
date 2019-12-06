var V_ADT_DIMI =
{
    elements:
    {
        txtDataDimi : 
        {
            status : "required",
            name : "Data dimissione",
            tab : "tabDimissione"
        },
        txtOraDimi : 
        {
            status : "required",
            name : "Ora Dimissione",
            tab : "tabDimissione"
        },
        cmbTipoDimi :
        {
            status: "required",
            name : "Tipo dimissione",
            tab : "tabDimissione",
            events:
            {
            	change:function(ctx){

            		var _sdo = typeof $("#SDO").val() == "undefined" || $("#SDO").val() == "" || $("#SDO").val() == null ? "N" : $("#SDO").val();
                    var v = $(this).find("option:selected").attr("data-codice");
                    var _tipo_personale = home.baseUser.TIPO_PERSONALE;
                    
                    $("#cmbRefAutop").val("N");
                    $("#butStampaDecesso").hide();
                    $("#cmbIstitutoTrasferimento").val("");
                    $("#cmbIstitutoTrasferimento").closest("TR").hide();
                    ctx.data.removeStatus($("#cmbRefAutop"));
                    ctx.data._attachStatus($("#txtMedicoDimi"),{"status":"required"});
                    
                    if (_tipo_personale == "M" && v == "1" && _sdo == "S")
	            	{
	            		ctx.data._attachStatus($("#cmbRefAutop"),{"status":"required"});
	            		$("#butStampaDecesso").show();
	            	}
	            	else if (v == "1" && _sdo === "N")
	            	{
	            		ctx.data.removeStatus($("#cmbRefAutop"));
	            		$("#butStampaDecesso").show();
	            	}
	            	else if (v == "5")
	            	{
	            		ctx.data.removeStatus($("#txtMedicoDimi"));
	            	}
	            	else if (v == "6")
	            	{
	            		$("#cmbIstitutoTrasferimento").closest("TR").show();
	            	}
            	}
            }
        },
        txtMedicoDimi :
        {
            status : "required",
            name : "Tipo dimissione",
            tab : "tabDimissione"
        },
        cmbRefAutop :
        {
            /* status: "required", */
            name : "Referto Autoptico",
            tab : "tabDimissione"
        },
        txtCategoriaCausaEsternaDimissione : 
        {
        	/* status: "required", */
            name : "Categoria causa esterna",
            tab : "tabDimissione"
        },
        cmbCausaEsternaDimissione : 
        {
        	/* status: "required", */
            name : "Causa esterna",
            tab :"tabDimissione"
        },
        cmbTraumatismiDimissione :
        {
            events : {
                change : function (ctx) {
                	
                	if ($(this).find("option:selected").val() != "" && $(this).find("option:selected").val() != null) 
                    {
                        ctx.data._attachStatus($("#txtCategoriaCausaEsternaDimissione"), {"status": "required"});
                        ctx.data._attachStatus($("#cmbCausaEsternaDimissione"), {"status": "required"});
                    }
                    else
                    {
                    	ctx.data.removeStatus($("#txtCategoriaCausaEsternaDimissione"), {"status": "required"});
                    	ctx.data.removeStatus($("#cmbCausaEsternaDimissione"), {"status": "required"});
                    }
                }
            }
        }
    }
};