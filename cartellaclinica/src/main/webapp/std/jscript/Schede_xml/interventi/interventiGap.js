/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var WindowCartella = null;
jQuery(document).ready(function(){
        window.WindowCartella = window;
        while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
            window.WindowCartella = window.WindowCartella.parent;
        }
    });



var WK_INTERVENTI_GAP = {
    url_gap: 'http://' + window.location.host + '/fenix-ambu/Autologin?',
    
    apriGapIntervento: function() {
		WK_INTERVENTI_GAP.apriGap('INTERVENTO');
	},
	
	apriGapCartella: function() {
		WK_INTERVENTI_GAP.apriGap('SCHEDA');
	},
	
	apriGap:function(type){
        var iden_intervento = stringa_codici(array_iden);
        var cod_intervento = stringa_codici(array_key_cod_icd);
        var url = 'username=alessandroc&nomeHost=NB_ALESSANDROC-HP';
        url+='&SITO=GAP';        
        url+='&scheda='+WK_INTERVENTI_GAP.getScheda(cod_intervento, type, iden_intervento); 

        window.open(WK_INTERVENTI_GAP.url_gap + url,'','fullscreen=yes');
    },
    
    getScheda:function(cod_intervento,type,iden_intervento){
        var url = '';
		switch(cod_intervento){
            case '8121': url = type + '_ANCA';
                        break;
            case '8026': url = type + '_GINOCCHIO';
                        break;
            default: throw 'Intervento non GAP';
        }
		url += "%26SITO%3DGAP%26IDEN_INTERVENTO%3D"+iden_intervento;
		return url;
    }
};