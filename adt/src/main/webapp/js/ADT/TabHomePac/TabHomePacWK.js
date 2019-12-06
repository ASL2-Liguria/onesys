var NS_HOME_PAC_WK = {

		wkPACAperti : null,
		wkPACChiusi : null,

	    beforeApplica : function()
	    {
	        if (NS_HOME_PAC.tab_sel == "filtroPACChiusi")
	        {
	        	return NS_HOME_PAC_WK.definisciQueryPACChiusi().SUCCESS;
	        }
	        else
	    	{
	        	return true;
	    	}
	    },

	    caricaWk : function(){

	        switch  (NS_HOME_PAC.tab_sel)
	        {
	            case 'filtroPACAperti':
	                NS_HOME_PAC_WK.caricaWkPACAperti();
	                break;
	            case 'filtroPACChiusi' :
	                NS_HOME_PAC_WK.caricaWkPACChiusi();
	                break;
	            default :
					logger.error("Tabulatore non riconosciuto " + NS_HOME_PAC.tab_sel);
	        }
	    },

	    caricaWkPACAperti : function(){

	        $('#txtNomePACAperti, #txtCognomePACAperti').each(function (k,v){
	            var $v = $(v);
	            $v.val($.trim($v.val().toUpperCase()));
	        });

	        var nome =  $('#txtNomePACAperti').val() == '' ? '%25': $('#txtNomePACAperti').val() +'%25';
	        var cognome =   $('#txtCognomePACAperti').val() == '' ? '%25': $('#txtCognomePACAperti').val() + '%25';
	        var cartella =   $('#txtCartellaPACAperti').val();

	        NS_HOME_PAC_WK.wkPACAperti= new WK({
	            id : "WK_PAC_APERTI",
	            container : "divWk",
	            aBind : ["nome","cognome","cartella","username"],
	            aVal : [nome,cognome,cartella,$('#USERNAME').val()]
	        });

	        NS_HOME_PAC_WK.wkPACAperti.loadWk();
	    },

	    definisciQueryPACChiusi : function(){

	        var daData = $("#txtDaDataPACChiusi").val().length > 0 ? moment($("#txtDaDataPACChiusi").val(),"DD/MM/YYYY").format("YYYYMMDD") : moment().subtract(365,"day").format("YYYYMMDD");
	        $("#h-txtDaDataPACChiusi").val(daData);

	        var aData = $("#h-txtADataPACChiusi").val().length > 0 ? moment($("#txtADataPACChiusi").val(),"DD/MM/YYYY").format("YYYYMMDD") : moment().add(1,"day").format("YYYYMMDD");
	        $("#h-txtADataPACChiusi").val(aData);

	    	var p = {
        		"SUCCESS" : true,
        		"QUERY" : ""
	        };

	    	p.QUERY = $("#txtCartellaPACChiusi").val().length > 0 ? "WORKLIST.WK_PAC_CHIUSI_BY_CARTELLA" : "WORKLIST.WK_PAC_CHIUSI_BY_DATA_RANGE";

	    	logger.debug("WK PAC Chiusi con query -> " + p.QUERY);

	    	$("#divWk").worklist().config.structure.id_query = p.QUERY;

	    	return p;
	    },

	    caricaWkPACChiusi : function(){

	        if(!NS_HOME_PAC_WK.wkPACChiusi)
	        {
	            var daData = $("#txtDaDataPACChiusi" ).data('Zebra_DatePicker');
	            daData.setDataIso(moment().add(-10,"days").format('YYYYMMDD'));

	            var aData = $("#txtADataPACChiusi" ).data('Zebra_DatePicker');
	            aData.setDataIso(moment().format('YYYYMMDD'));
	        }

	        NS_HOME_PAC_WK.wkPACChiusi= new WK({
	            id : "WK_PAC_CHIUSI",
	            container : "divWk",
	            aBind : [],
	            aVal : [],
	            loadData : false
	        });

	        NS_HOME_PAC_WK.wkPACChiusi.loadWk();
	    }
};