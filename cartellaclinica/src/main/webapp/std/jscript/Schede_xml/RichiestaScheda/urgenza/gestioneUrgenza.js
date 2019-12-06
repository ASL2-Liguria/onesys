//author:linob
//scope:estrazione dell'urgenza dalle schede di laboratorio
var URGENZA = {
	
	urgenzaGenerale:'',
	urgenza:'',
	restore:{},
	
	livelliUrgenza: {
					'0' : 	{
								classe		: 'routine',
								descrizione	: '    Grado Urgenza:   ROUTINE    '
							},
					'1':	{
								classe		: 'urgenzaDifferita',
								descrizione	: '    Grado Urgenza:   URGENZA DIFFERITA    '	
							},							
					'2' : 	{
								classe		: 'urgenza',
								descrizione	: '    Grado Urgenza:   URGENZA    '
							},
					'3' : 	{
								classe		: 'emergenza',
								descrizione	: '    Grado Urgenza:   EMERGENZA    '
							}		
	},
	
	resetCampiUrgenza:function(){
		URGENZA.urgenzaGenerale = URGENZA.restore["urgenzaGenerale"]; 
		URGENZA.urgenza = URGENZA.restore["urgenzaGenerale"] || URGENZA.restore["urgenza"];
		$('#hUrgenza').val(URGENZA.urgenza);
	},
	
	setCampiUrgenza:function(){
		URGENZA.restore["urgenzaGenerale"] = URGENZA.urgenzaGenerale;
		URGENZA.restore["urgenza"] = URGENZA.urgenza;
		if (URGENZA.urgenzaGenerale ==''){
			URGENZA.urgenzaGenerale=$('#hUrgenza').val();
		}
		URGENZA.urgenza = $('#hUrgenza').val();
	},

	setCampiUrgenzaModifica:function(){
		if (URGENZA.urgenzaGenerale ==''){
			URGENZA.urgenzaGenerale=$('#URGENZA').val();
		}
		URGENZA.urgenza = $('#URGENZA').val();

		$('#hUrgenza').val(URGENZA.urgenza);
		URGENZA.setLabelUrgenza(URGENZA.urgenza);		
	},

	setUrgenza:function(){
		if (_STATO_PAGINA == 'I' || _STATO_PAGINA == 'E'){
			URGENZA.setCampiUrgenza();
			if(URGENZA.getDiffUrgenza()){
				if (document.getElementById('cmbPrestRich_L').options.length>0){
					if (!confirm('Attenzione! In seguito al cambio di urgenza verranno cancellate le analisi già scelte. Procedere ugualmente?')){
						URGENZA.resetCampiUrgenza();
						return;
					}else{
						document.dati.HelencoEsami.value = '';
						svuotaListBox(document.dati.cmbPrestRich_L);
					}
				}else{
					document.dati.HelencoEsami.value = '';
					svuotaListBox(document.dati.cmbPrestRich_L);
				}
			}else{
				svuotaListBox(document.dati.cmbPrestRich_L);
			}
	
			URGENZA.setLabelUrgenza(URGENZA.urgenza);
			if (URGENZA.urgenza!='')
				apriContenitoreLabo();
		
		}else{	
			
			alert ('Impossibile modificare il grado di urgenza');	
		}			
	},
	
	setLabelUrgenza:function(urgenza){				
		switch(urgenza){
			// Non urgente
			case '0':

				URGENZA.urgenzaGenerale='0';
				$('#lblTitleUrgenza_L').text(URGENZA.livelliUrgenza[urgenza].descrizione);
				$('#lblTitleUrgenza_L').removeClass($('#lblTitleUrgenza_L').attr('class')).addClass(URGENZA.livelliUrgenza[urgenza].classe);	
				break;
			
			// Urgenza
			case '2':

				URGENZA.urgenzaGenerale='2';
				$('#lblTitleUrgenza_L').text(URGENZA.livelliUrgenza[urgenza].descrizione);
				$('#lblTitleUrgenza_L').removeClass($('#lblTitleUrgenza_L').attr('class')).addClass(URGENZA.livelliUrgenza[urgenza].classe);		
				break;
			
			// Emergenza
			case '3':

				URGENZA.urgenzaGenerale='3';
				$('#lblTitleUrgenza_L').text(URGENZA.livelliUrgenza[urgenza].descrizione);
				$('#lblTitleUrgenza_L').removeClass($('#lblTitleUrgenza_L').attr('class')).addClass(URGENZA.livelliUrgenza[urgenza].classe);					
				break;

		}
	},
	
	getDiffUrgenza:function(){
		return URGENZA.urgenzaGenerale!=URGENZA.urgenza?true:false;
	}
};