var NS_HOME_ARCHIVIO_ESTRAZIONE_CARTELLE = 
{
		init : function(){
			NS_HOME_ARCHIVIO_ESTRAZIONE_CARTELLE.setEvents();
		},
		
		setEvents : function() {
			$('#butApriEstrazione').on("click", function(){NS_HOME_ARCHIVIO_ESTRAZIONE_CARTELLE.applicaEstrazione();});
			$('#divWk').html("");
			$(".butApplica").hide();
		},
		
		/**
		 * Alla selezione dell'estrazione e alla conseguente applicazione viene aperta la rispettiva pagina.
		 * 
		 * @author alessandro.arrighi
		 */
		applicaEstrazione : function()
		{
			var filtro = $('#cmbQueryEstrazione').find('option:selected').attr('data-parametri');
			
			if(typeof filtro !== "undefined" && filtro !== "")
    		{
    			var urlFiltro = "page?KEY_LEGAME=" + filtro.split("@")[0] + "&WK=" + filtro.split("@")[1] + "&LABEL=" + filtro.split("@")[3] + "&ID_QUERY=" + filtro.split("@")[2] +  "&USERNAME=" + home.baseUser.USERNAME + "&STATO_PAGINA=I";
    			
    			top.NS_FENIX_TOP.apriPagina({url : urlFiltro, id : 'AccRicoveroDaPre', fullscreen : true});
    		}
			else
			{
    			home.NOTIFICA.warning({message: 'Valorizzare Estrazione', timeout: 3, title: 'Warning'});
    		}
		}
};