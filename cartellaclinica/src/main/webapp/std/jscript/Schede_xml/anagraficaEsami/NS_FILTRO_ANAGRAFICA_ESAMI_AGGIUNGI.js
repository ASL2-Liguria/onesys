/**
 * @author linob
 * @data 11-02-2015
 * @page filtro wk anagrafica degli esami
 */

var WindowCartella = null;

jQuery(document).ready(function() {
	var topname = top.window.name;
    window.WindowHome = window;
    while (window.WindowHome.name != topname && window.WindowHome.parent != window.WindowHome) {
        window.WindowHome = window.WindowHome.parent;
    }
    window.baseReparti = WindowHome.baseReparti;
    window.baseGlobal = WindowHome.baseGlobal;
    window.basePC = WindowHome.basePC;
    window.baseUser = WindowHome.baseUser;

    try {
    	WindowHome.utilMostraBoxAttesa(false);
    } catch (e) {
        /*catch nel caso non venga aperta dalla cartella*/
    }

    try {
    	NS_FILTRO_ANAGRAFICA_ESAMI_AGGIUNGI.init();
    	NS_FILTRO_ANAGRAFICA_ESAMI_AGGIUNGI.setEvents();
    } catch (e) {
        alert("NAME:\n" + e.name + "\nMESSAGE:\n" + e.message + "\nNUMBER:\n" + e.number + "\nDESCRIPTION:\n" + e.description);
    }

});


var NS_FILTRO_ANAGRAFICA_ESAMI_AGGIUNGI = {
	url:"servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_ANAGRAFICA_ESAMI_AGGIUNGI&ILLUMINA=illumina_multiplo_generica(this.sectionRowIndex);",	
		
    init: function() {
    	$('form[name="EXTERN"]').append($('<input type="hidden" name = "WHERE_WK_EXTRA"/>'));
    	    	
    	$('input[name=radDescrizioneCodice][value=D]').attr('checked',true);
    	$('input[name=radAttivo][value=S]').attr('checked',true);
    },
    setEvents: function() {    	
    	$('#lblAggiorna').click(function(){
    		NS_FILTRO_ANAGRAFICA_ESAMI_AGGIUNGI.applica_filtro();
        });
        
    	$('#lblResetta').click(function(){
    		NS_FILTRO_ANAGRAFICA_ESAMI_AGGIUNGI.resetta_campi();        	
        });
    	
//    	
//    	if(window.event.keyCode==13){
//    		alert(1);
//    		NS_FILTRO_ANAGRAFICA_ESAMI.applica_filtro();
//      	}
    	$('#txtDescrizioneCodice').live("keypress",function(e) {    	
    		if(e.keyCode==13){
    			NS_FILTRO_ANAGRAFICA_ESAMI_AGGIUNGI.applica_filtro();
    			e.preventDefault();
    		}
    	});
    	
    },
    applica_filtro:function(){
    	NS_FILTRO_ANAGRAFICA_ESAMI_AGGIUNGI.generaWhere();
    	applica_filtro(NS_FILTRO_ANAGRAFICA_ESAMI_AGGIUNGI.url);    	
    },
    resetta_campi:function(){
    	$('#txtDescrizioneCodice').val('');
		$("input[name=radDescrizioneCodice]").attr("checked", false);
		$("input[name=radAttivo]").attr("checked", false);
    },
    generaWhere:function(){
    	var where = '';
    	var whereComponent = new Array();  	
    	var whereTmp;  	

    	whereComponent.push('TIPOLOGIA_RICHIESTA = '+$('form[name="EXTERN"] input#tipologia_richiesta').val())
    	var descrizione = '';
    	if ($('#txtDescrizioneCodice').val()!='' && typeof ($('input[name="radDescrizioneCodice"]:checked').val())!='undefined'){
    		if ($('input[name="radDescrizioneCodice"]:checked').val()=='D'){
    			descrizione = $("#txtDescrizioneCodice").val().toUpperCase();
    			$("#txtDescrizioneCodice").val(descrizione);
    		}
    		descrizione = descrizione.replace("'","''");
    		whereTmp = $('input[name="radDescrizioneCodice"]:checked').val()=='D'? 'DESCRIZIONE LIKE \''+descrizione+'%\'':'CODICE LIKE \''+descrizione+'%\''    		
    		whereComponent.push(whereTmp);		
    	}
    	
   	
    	if (typeof ($('input[name=radAttivo]:checked').val())!='undefined' && $('input[name=radAttivo]:checked').val()!=''){
    		whereTmp = 'ATTIVO = \''+$('input[name=radAttivo]:checked').val()+'\''; 
			whereComponent.push(whereTmp);    		
    	}    	
		
    	where = whereComponent.join(' AND ');
    	
    	
    	$('form[name="EXTERN"] input[name="WHERE_WK_EXTRA"]').val(where);
    	
    },
    
    importaEsami:function(){
    	alert('ciao')
    },
    
    chiudi:function(){
    	
    }
    
    
    

};