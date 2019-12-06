$(function() {
	SCADENZARIO_BACHECA.init();
});

var SCADENZARIO_BACHECA = {
		
		objWk: null,
		
		init: function() 
		{
			home.SCADENZARIO_BACHECA = this;
			
			home.RIEPILOGO.setLayout( $('#IDFRAME').val(), 'SCADENZARIO_BACHECA' );

			SCADENZARIO_BACHECA.initWk();
			
			home.RIEPILOGO.toggleButtons( $('#IDFRAME').val() );
		},
		
		initWk: function() 
		{
			var h = $('.contentTabs').innerHeight() - 20;
			$("#divWk").height( h );
			
			this.objWk = new WK({
				"id" 	:	"SCADENZARIO_BACHECA",
				"aBind"	:	["iden_anag","iden_med","mostra_completati"],
				"aVal"	:	[home.ASSISTITO.IDEN_ANAG, home.baseUser.IDEN_PER,"N"]	
			});
			
			this.objWk.loadWk();
		},
		
		processInfo: function( data, wk )
		{
			var icon_class = '', title = '';

	        if (data.ESEGUITO == 'S')
	        	icon_class	= 'icon-ok', title		= 'Eseguito'; // icon-alert //icon-attention
	        else  if ( data.RITARDO > 0 && data.RITARDO < 30)
	        	icon_class	= 'icon-attention', title		= 'Ritardo entro i 30 giorni';
	        else  if ( data.RITARDO > 30)
	        	icon_class	= 'icon-alert', title		= 'Ritardo superiore a 30 giorni';
	        else
	        	icon_class	= 'icon-calendar', title		= 'Scadenza programmata';

	        return $('<i>', { 'class' : icon_class + ' worklist-icon', 'title' : title });
		},
		
		processRitardo: function( data, wk )
		{
			var vAnni, vMesi, vGiorni, vRitardo, vSign = 'Scad. da ';
			
			if (data.ESEGUITO == 'S')
	        	return ' - ';
	        else 
	        {
	        	if ( (vRitardo = data.RITARDO) < 0)
	        		vRitardo = Math.abs(vRitardo), vSign = 'Progr. tra ';
	        	vAnni = Math.floor( vRitardo / 365 );
	        	vMesi = Math.floor(( vRitardo % 365 ) / 30);
	        	vGiorni = ( vRitardo % 365 ) % 30;
	        	
	        	return vSign + (vAnni > 0 ? vAnni + "A " : '' ) + (vMesi > 0 ? vMesi + "M " : '') + vGiorni + "G";
	        }
		},
		
		setStato: function (row, stato)
		{
			home.$.NS_DB.getTool({_logger : home.logger}).call_procedure({
	            id:'SET_STATO_SCADENZA',
	            parameter:
	            {
	            	"pIdenPer" 		: { v : home.baseUser.IDEN_PER, t : 'N'},
					"pIdenAnag"		: { v : home.ASSISTITO.IDEN_ANAG, t : 'N'},
					"pIdenScadenza"	: { v : row.IDEN, t : 'N'},
					"pStato" 		: { v : stato, t : 'V' }
	            }
			}).done( function() {
				SCADENZARIO_BACHECA.objWk.refresh();
			});
		},
		
		mostraCompletati: function(pVal)
		{
			SCADENZARIO_BACHECA.objWk.filter({
				"aBind"	:	["iden_anag","iden_med","mostra_completati"],
				"aVal"	:	[home.ASSISTITO.IDEN_ANAG, home.baseUser.IDEN_PER,pVal]	
			});
		}
};