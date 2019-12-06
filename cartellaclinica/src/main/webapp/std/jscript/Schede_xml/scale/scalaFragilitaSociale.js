var WindowCartella = null;
jQuery(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
	
    window.baseReparti 	= WindowCartella.baseReparti;
    window.baseGlobal 	= WindowCartella.baseGlobal;
    window.basePC 		= WindowCartella.basePC;
    window.baseUser 	= WindowCartella.baseUser;  
    
	if (typeof(document.EXTERN.BISOGNO)=='undefined' || document.EXTERN.BISOGNO.value=='N'){
		document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
	}
	if (_STATO_PAGINA == 'L'){
		document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';

	}

		FRAGILITA_SOCIALE.init();
		FRAGILITA_SOCIALE.setEvents();
		
		try{
            WindowCartella.utilMostraBoxAttesa(false);
		}
		catch(e){}
		
});

var FRAGILITA_SOCIALE = {

		init : function(){
	
	$('input[name="txtTotale"]').attr("disabled","disabled");
    $('input[name="chkCaregiver"]').parent().parent().attr("disabled","disabled");
	
			setRadioResettable('dati',[
                                        {radio:"chkCaregiver"},
                                        {radio:"chkCondizioni"},
                                        {radio:"chkDinamiche"},
                                        {radio:"chkEconomica"},
                                        {radio:"chkGenitori"},
                                        {radio:"chkReteFam"},
                                        {radio:"chkSolitudine"}			                        
                                        ]);

		},

		setEvents : function(){			
			$('input[name="chkSolitudine"]').click(FRAGILITA_SOCIALE.setCaregiver);
			$('input[name="chkCaregiver"]').click(FRAGILITA_SOCIALE.setGenitori);
			$('input[name="chkCaregiver"],input[name="chkCondizioni"],input[name="chkDinamiche"],input[name="chkEconomica"],input[name="chkGenitori"],input[name="chkReteFam"],input[name="chkSolitudine"]').click(FRAGILITA_SOCIALE.calcolaTotale);
			
		},
		
		calcolaTotale : function() {
			var tot=0;
		/* tot=parseInt(($('input[name="chkCaregiver"]:checked').val()==undefined)?0:$('input[name="chkCaregiver"]:checked').val());
		 tot+=parseInt(($('input[name="chkCondizioni"]:checked').val()==undefined)?0:$('input[name="chkCondizioni"]:checked').val());
		 tot+=parseInt(($('input[name="chkDinamiche"]:checked').val()==undefined)?0:$('input[name="chkDinamiche"]:checked').val());
		 tot+=parseInt(($('input[name="chkEconomica"]:checked').val()==undefined)?0:$('input[name="chkEconomica"]:checked').val());
		 tot+=parseInt(($('input[name="chkGenitori"]:checked').val()==undefined)?0:$('input[name="chkGenitori"]:checked').val().substring(0,1));
		 tot+=parseInt(($('input[name="chkReteFam"]:checked').val()==undefined)?0:$('input[name="chkReteFam"]:checked').val());
		 tot+=parseInt(($('input[name="chkSolitudine"]:checked').val()==undefined)?0:$('input[name="chkSolitudine"]:checked').val());
		 */
			
		switch($('input[name="chkSolitudine"]:checked').index('input[name="chkSolitudine"]')){
		case 1	: tot+=1; break;
		case 2	: tot+=2; break;
		case 3	: tot+=3; break;
		default :
			}
		switch($('input[name="chkCaregiver"]:checked').index('input[name="chkCaregiver"]')){
		case 1	: tot+=2; break;
		default :
			}
		switch($('input[name="chkGenitori"]:checked').index('input[name="chkGenitori"]')){
		case 0	: tot+=3; break;
		case 1	: tot+=3; break;
		default :
			}
		switch($('input[name="chkReteFam"]:checked').index('input[name="chkReteFam"]')){
		case 1	: tot+=1; break;
		default :
			}
		switch($('input[name="chkDinamiche"]:checked').index('input[name="chkDinamiche"]')){
		case 1	: tot+=1; break;
		default :
			}
		switch($('input[name="chkCondizioni"]:checked').index('input[name="chkCondizioni"]')){
		case 1	: tot+=1; break;
		default :
			}
		switch($('input[name="chkEconomica"]:checked').index('input[name="chkEconomica"]')){
		case 1	: tot+=2; break;
		default :
			}
			
		 $('input[name="txtTotale"]').val(tot);
			
		},
		
		chiudiScala : function(){
			try{
				var opener=window.dialogArguments;
				opener.document.getElementById('txtEsitoScalaFragilita').value=document.getElementById('txtTotale').value;	
			}
			catch (e)
			{
			}
			self.close();

		},

		
		setCaregiver : function() {
			
			if ($('input[name="chkSolitudine"]:checked').index('input[name="chkSolitudine"]')==0)
				$('input[name="chkCaregiver"]').parent().parent().removeAttr("disabled");	
			else{
				$('input[name="chkCaregiver"]').attr('checked', false).parent().parent().attr("disabled","disabled");	
				$('input[name="chkGenitori"]').parent().parent().removeAttr("disabled");
			}
			},
		setGenitori : function() {
			
			if ($('input[name="chkCaregiver"]:checked').index('input[name="chkCaregiver"]')==1)
				$('input[name="chkGenitori"]').attr('checked', false).parent().parent().attr("disabled","disabled");	
			else
				$('input[name="chkGenitori"]').parent().parent().removeAttr("disabled");	
		},
		stampaScala:function(){

			var iden_ricovero	= WindowCartella.getRicovero("IDEN");
			var funzione		= 'SCALA_FRAGILITA';
			var reparto			= WindowCartella.getReparto("COD_CDC");
			var anteprima		= 'S';
			var sf				= '&prompt<pVisita>=' + iden_ricovero;
			
            WindowCartella.confStampaReparto(funzione,sf,anteprima,reparto,basePC.PRINTERNAME_REF_CLIENT);
		}
};


		
