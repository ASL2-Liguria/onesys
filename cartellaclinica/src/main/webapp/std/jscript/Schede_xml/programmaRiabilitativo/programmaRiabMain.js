
var WindowCartella = null;
jQuery(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    

    $('#divWrapper').css({'height' : $(window.parent).height() - 140 });
    $('#divStorico').css({'height' : $(window.parent).height() - 180});
    NS_PRM.caricaSchede();
    
});

var NS_PRM={
		
		caricaSchede:function(){
			NS_PRM.creaStorico(); 
			setTimeout(
					  function() 
					  {
							NS_PRM.creaFramePrimario();
					  },1000);
	     
	         
		},
	     creaFramePrimario:function(idenScheda){
	    	    var idenSchedaPr='0';
	    	    var datiPostConvalida='N';
	    	    var src='';
		        var rs = WindowCartella.executeQuery(
		        		'programmaRiabilitativo.xml', 
		        		'getScheda', 
		        		[WindowCartella.getRicovero("IDEN")]);
		        
		        while (rs.next()) {
		        	idenSchedaPr=rs.getString("IDEN");  
		        	datiPostConvalida=rs.getString("CONVALIDATO");
		        } 
		        src= 'servletGenerator?KEY_LEGAME=PROGRAMMA_RIABILITATIVO&FUNZIONE=PROGRAMMA_RIABILITATIVO&SITO=LOAD&IDEN_VISITA='+WindowCartella.getRicovero("IDEN")+'&IDEN_VISITA_REGISTRAZIONE='+WindowCartella.getAccesso("IDEN")+'&KEY_ID='+idenSchedaPr+'&DATI_POST_CONVALIDA='+datiPostConvalida;
		        if(WindowCartella.ModalitaCartella.isReadonly(document)) src+='&READONLY=true';
		        $('<iframe />', {
	    		    name: 'framePrimario',
	    		    id:   'framePrimario',
	    		    src:  src,
	    		    width:'100%',
	    		    height: ($(window.parent).height() - 160)+'px',
	    		    frameborder:'0'
	    		}).appendTo('#divPrimario');
	    	 
	     },
	     
	     creaStorico:function(){
	    	    var cont=0;
		        var rs = WindowCartella.executeQuery(
		        		'programmaRiabilitativo.xml', 
		        		'getSchedeConvalidate', 
		        		[WindowCartella.getRicovero("IDEN")]);
		        
		        while (rs.next()) {
		         cont+=1;
		    	 $('<iframe />', {
		    		    name: 'frame'+rs.getString("IDEN"),
		    		    id:   'frame'+rs.getString("IDEN"),
		    		    src:  'servletGenerator?KEY_LEGAME=PROGRAMMA_RIABILITATIVO&FUNZIONE=PROGRAMMA_RIABILITATIVO&SITO=LOAD&IDEN_VISITA='+WindowCartella.getRicovero("IDEN")+'&KEY_ID='+rs.getString("IDEN")+'&DATA_CONVALIDA='+rs.getString("DATA_CONVALIDA")+'&READONLY=true',
		    		    width:'460px',
		    		    scrolling:'no',
		    		    height:($(window.parent).height() - 160)+'px'
		    		}).appendTo('#divStorico');	    	
		        }
		        $('#divStorico').css({'width' : 470*cont});
	     }
		
		
		
		
};

var gestBloccoAree = {
        lock : function(pArea){
       	var vResp = WindowCartella.executeStatement('programmaRiabilitativo.xml','gestBloccoAree',[WindowCartella.getRicovero("IDEN"),pArea,WindowCartella.baseUser.IDEN_PER,WindowCartella.basePC.IP,WindowCartella.basePC.NOME_HOST],2);
   	    if(vResp[0]=='KO'){
   	        return alert('Errore gestBloccoAree:\n'+vResp[1]);
   	    }
   	    else{
   	    	if(vResp[2]=='N'){
           		return true;
           	}
           	else{
           		alert(vResp[3].replace(/\\n/g, '\n'));
           		return false;
           	}
   	      }
       },
       unlock : function(){
			var vResp = WindowCartella.executeStatement('programmaRiabilitativo.xml','sbloccaAree',[WindowCartella.getRicovero("IDEN"),WindowCartella.baseUser.IDEN_PER],0);
   	    if(vResp[0]=='KO'){
   	        return alert('Errore gestBloccoAree:\n'+vResp[1]);
   	    }
		}
};
