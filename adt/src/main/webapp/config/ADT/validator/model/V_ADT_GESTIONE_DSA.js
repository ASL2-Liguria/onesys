var V_ADT_GESTIONE_DSA ={
		elements:{
			txtDataAperturaDSA:{
		            status: "required",
		            name: "Data di apertura DSA",
		            tab:"tabDSA"
		        },
		    cmbReparto:	{
			    	status: "required",
		            name: "Reparto che apre il DSA",
		            tab:"tabDSA"
		    	},
		    /*"h-radTipoDSA":{
		    	status: "required",
	            name: "Tipo DSA",
	            tab:"tabDSA"
		    },*/
			cmbTipologiaDSA:{
		    	status: "required",
	            name: "Tipologia DSA",
	            tab:"tabDSA"
		    },
		    txtCaseManager:{
		    	status: "required",
	            name: "Case Manager (Medico responsabile del DSA)",
	            tab:"tabDSA"
		    },
		    txtDataRiceIniDSA:{
		    	status: "required",
		    	name: "Data ricetta iniziale",
	            tab:"tabDSA"
		    },
		    txtCodiceRiceIniDSA:{
		    	status: "required",
		    	name: "N. ricetta iniziale",
	            tab:"tabDSA"
		    },
		    txtSospettoDia:{
		    	status: "required",
	            name: "Sospetto diagnostico",
	            tab:"tabDSA"
		    },
		    txtDataChiusuraDSA:{
		    	name:"Data chiusura DSA",
		    	tab:"tabChiusuraDSA"
		    },
		    txtDiagnosiPrinc:{
		    	name:"Diagnosi finale DSA",
		    	tab:"tabChiusuraDSA"
		    },
		    "h-txtDiagnosiPrinc":{
		    	name:"Codice Diagnosi finale DSA",
		    	tab:"tabChiusuraDSA"
		    }
		    /*txtAnamnesi:{
		    	name : "txtAnamnesi",
		    	tab : "tabDSA",
		    	events:{
		    		blur:function(ctx){
		    			ctx.data.attachStatus($("#txtDataRiceIniDSA"),{"status":"required"});;
		    			ctx.data.attachStatus($("#txtCodiceRiceIniDSA"),{"status":"required"});
		    		}
		    	}
		    }*/
		}
}