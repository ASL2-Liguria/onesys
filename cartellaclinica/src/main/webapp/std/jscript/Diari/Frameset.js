var WindowCartella = null;
$(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    eval(window.baseReparti.getValue(WindowCartella.getAccesso("COD_CDC"),'DIARI_CONTROLLI_JS'));
    
    var title = 'DIARIO';

    switch(document.EXTERN.KEY_TIPO_DIARIO.value){
        case 'MEDICO':
            title+=' MEDICO';
            IFRAMESET_DIARIO_MEDICO.loadWkEpicrisi();
            IFRAMESET_DIARIO_MEDICO.loadWkDiari();
            break;
        case 'INFERMIERE':
            title+=' INFERMIERISTICO';
//			IFRAMESET_DIARIO_MEDICO.loadWkDieta(); 
            IFRAMESET_DIARIO_MEDICO.hideFrameSecondario();
            IFRAMESET_DIARIO_MEDICO.loadWkDiari();
            break;
        case 'DIETA':
            title ='STORICO DIETA';
            IFRAMESET_DIARIO_MEDICO.loadWkDieta();
            IFRAMESET_DIARIO_MEDICO.hideFrameSecondario();
            break;
        case 'ESAMI_DA_RICHIEDERE':
            title ='ESAMI DA RICHIEDERE';
            IFRAMESET_DIARIO_MEDICO.loadWkEsamiRic();
            IFRAMESET_DIARIO_MEDICO.hideFrameSecondario();
            break;
        case 'SOCIALE':
            title +=' SOCIALE';
            IFRAMESET_DIARIO_MEDICO.hideFrameSecondario();
            IFRAMESET_DIARIO_MEDICO.loadWkDiari();
            break;
    }
    document.all['nomelblTitoloDiario'].innerText= title;
    /*document.all['frameDiari'].src = 'servletGenerator?KEY_LEGAME=IFRAME_DIARIO_MEDICO_WORKLIST&WHERE_WK=WHERE+N_RICOVERO%3D\'' + document.EXTERN.KEY_NOSOLOGICO.value + '\' and TIPO_DIARIO=\'' + document.EXTERN.KEY_TIPO_DIARIO.value + '\'&CONTEXT_MENU='+document.EXTERN.CONTEXT_MENU.value ;  */

    try{WindowCartella.utilMostraBoxAttesa(false);}catch(e){} ;

});

var IFRAMESET_DIARIO_MEDICO = {

    loadWkDiari : function(){
        setVeloNero('frameDiari');

        var vWhere;
        var vDati = WindowCartella.getForm(document);
        switch(WindowCartella.FiltroCartella.getLivelloValue(vDati)){
            case 'IDEN_VISITA':		vWhere= " where iden_visita =" + vDati.iden_visita;
                break;
            case 'NUM_NOSOLOGICO':	
                if(vDati.iden_prericovero == ""){
                	vWhere= " where (iden_visita =" + vDati.iden_ricovero + " or parent = "+ vDati.iden_ricovero +")";
                }else{
                    vWhere = " where  (iden_visita in (" + vDati.iden_ricovero + ","+vDati.iden_prericovero+") or parent in ("+ vDati.iden_ricovero +","+vDati.iden_prericovero+"))";
                }		
                break;
            default:			vWhere= " where iden_anag =" + vDati.iden_anag ;
                break;
        }

        vWhere += " and TIPO_DIARIO='" + document.EXTERN.KEY_TIPO_DIARIO.value + "'";
        
        var url = 'servletGenerator?KEY_LEGAME=WORKLIST';
        if (document.EXTERN.KEY_TIPO_DIARIO.value=='MEDICO'){
        	url    += '&TIPO_WK=DIARIO_MEDICO';	
        	 url += "&CONTEXT_MENU="	+ (document.EXTERN.CONTEXT_MENU.value=='LETTURA' || baseUser.TIPO=='I' ?"WK_DM_DATA_LETTURA":"");
             
        }
        else if (document.EXTERN.KEY_TIPO_DIARIO.value=='SOCIALE'){
        	url    += '&TIPO_WK=DIARIO_MEDICO';	
        	 url += "&CONTEXT_MENU="	+ (document.EXTERN.CONTEXT_MENU.value=='LETTURA' || baseUser.TIPO!='AS' ?"WK_DM_DATA_LETTURA":"DIARIO_INFERMIERISTICO");
             
        }
        else{
        	url    += '&TIPO_WK=DIARIO_INFERMIERISTICO';
        	url += "&CONTEXT_MENU="	+ (document.EXTERN.CONTEXT_MENU.value=='LETTURA' || baseUser.TIPO=='M' ?"WK_DM_DATA_LETTURA":"");
        }

        url    += '&WHERE_WK=' + vWhere;
        url += "&ILLUMINA=javascript:illumina(this.sectionRowIndex);";

        document.all['frameDiari'].src = url;
    },

    loadWkEpicrisi : function(){

        document.all['lblWkSecondaria'].innerText= "EPICRISI";
        setVeloNero('frameSecondario');
        var vWhere;
        var vDati = WindowCartella.getForm(document);
        switch(WindowCartella.FiltroCartella.getLivelloValue(vDati)){
            case 'IDEN_VISITA':		vWhere= " where iden_visita =" + vDati.iden_visita;
                break;
            case 'NUM_NOSOLOGICO':	
                if(vDati.iden_prericovero == ""){
                	vWhere= " where (iden_visita =" + vDati.iden_ricovero + " or parent = "+ vDati.iden_ricovero +")";
                }else{
                    vWhere = " where  (iden_visita in (" + vDati.iden_ricovero + ","+vDati.iden_prericovero+") or parent in ("+ vDati.iden_ricovero +","+vDati.iden_prericovero+"))";
                }		
                break;
                break;
            default:			vWhere= " where iden_anag =" + vDati.iden_anag ;
                break;
        }

        var url = 'servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_EPICRISI&ILLUMINA=javascript:illumina(this.sectionRowIndex);';
        url    += '&WHERE_WK=' + vWhere;
        url += "&CONTEXT_MENU="	+ (document.EXTERN.CONTEXT_MENU.value=='LETTURA'?"WK_EPICRISI_LETTURA":"");

        document.all['frameSecondario'].src = url;
    },

    loadWkDieta : function(){
    	var vDati = WindowCartella.getForm(document);
        var url = 'servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_DIETA&ILLUMINA=javascript:illumina(this.sectionRowIndex);';
        if(document.EXTERN.CONTEXT_MENU.value=='LETTURA')
        	url += "&CONTEXT_MENU=LETTURA";
    	
    	 if(vDati.iden_prericovero == ""){
    		 url+='&WHERE_WK= where CONTENUTO IS NOT NULL and iden_ricovero = '+vDati.iden_ricovero;
         }else{
        	 url+='&WHERE_WK= where CONTENUTO IS NOT NULL and (iden_ricovero = '+vDati.iden_ricovero+' or iden_ricovero='+vDati.iden_prericovero+')';
         }

         $('#frameDiari').attr("src", url);

    },
    loadWkEsamiRic : function(){
    	 var vDati = top.getForm(document);
    	 var vWhere= " where iden_visita =" + vDati.iden_visita;
               
        var url = 'servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_ESAMI_DA_RICHIEDERE&ILLUMINA=javascript:illumina(this.sectionRowIndex)';
        url    += '&WHERE_WK=' + vWhere;
        url += "&CONTEXT_MENU="	+ ((document.EXTERN.CONTEXT_MENU.value=='LETTURA' || baseUser.TIPO=='I' )?"WK_ESAMI_DA_RICHIEDERE_LETTURA":"");
        $('#frameDiari').attr("src", url);

    },

    hideFrameSecondario : function() {
        $("label#lblWkSecondaria").parent().parent().hide();
        $("iframe#frameSecondario").hide();
        $("iframe#frameDiari").height('90%');
    }
};
