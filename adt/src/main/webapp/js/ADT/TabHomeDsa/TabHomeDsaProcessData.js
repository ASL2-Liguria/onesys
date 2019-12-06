var NS_HOME_DSA_PROCESS_DATA = {
		
		setColorBackground : function(data,td)
		{
	    	if (data.GIORNI_APERTURA > NS_HOME_DSA.GG_DSA_ALERT)
	    	{
	    		td.css({'background-color':'#FF4500'}); 
	    	}	 
	    	
	    	return data.GIORNI_APERTURA;  	
	    },
	    
	    setColorBackgroundChiusi : function(data,td)
	    {
	    	if (data.GIORNI_APERTURA > NS_HOME_DSA.GG_DSA){
	    		td.css({'background-color':'#FF4500'}); 
	    	}
	    	
	    	return data.GIORNI_APERTURA;  	
	    },
	    
	    setColorBackgroundAccessi : function(data,td)
	    {
	    	if (data.N_ACCESSI > NS_HOME_DSA.ACCESSI_DSA){
	    		td.css({'background-color':'#FF4500'});   
	    	}
	    	
	    	return data.N_ACCESSI;
	    },
	    
	    processApriCartella : function(data, wk)
	    {
	    	var url = "javascript:NS_HOME_DSA.getUrlCartellaPaziente('" + data.CODICE + "')";
	        return $(document.createElement('a')).attr('href', url).html("<i class='icon-folder-open icoPaz' title='Apri cartella paziente'>");
	    },
	    
	    processDatiAnag : function (IDEN_ANAG, ASSISTITO) 
	    {
	        var $a = $(document.createElement('a')).text(ASSISTITO);
	        
	        $a.on('click',function(){
	            top.NS_FENIX_TOP.apriPagina({'url':'page?KEY_LEGAME=SCHEDA_ANAGRAFICA&PAZ_SCONOSCIUTO=N&STATO_PAGINA=E&IDEN_ANAG='+ IDEN_ANAG,'id':'datiAnag','fullscreen':true});
	        });
	        
	        return $a;
	    }
};