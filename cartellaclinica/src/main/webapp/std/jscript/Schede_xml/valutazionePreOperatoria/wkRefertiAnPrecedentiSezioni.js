/**
 * User: linob
 * Date: 26/05/14
 */

var WindowCartella = null;

jQuery(document).ready(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;
    try{
        WindowCartella.utilMostraBoxAttesa(false);
    }catch(e)
    {/*catch nel caso non venga aperta dalla cartella*/}

    NS_WK_REFERTI_AN_PRECEDENTI_SEZIONI.init();
    NS_WK_REFERTI_AN_PRECEDENTI_SEZIONI.events();
});

var NS_WK_REFERTI_AN_PRECEDENTI_SEZIONI = {
    init:function(){
        //NS_WK_REFERTI_AN_PRECEDENTI_SEZIONI.setImmages();
    },
    events:function(){
        /*$('#txtInterventoChirurgico').css('width','95%');
        $('#txtEsameDiagnostico').css('width','95%');*/
        $('.classDatiTabella').find('div.divXmlObject').find('label').each(function(){
            $(this).hide()
        })
        $('.classCopiaDati').click(NS_WK_REFERTI_AN_PRECEDENTI_SEZIONI.copia);
    }/*,
    setImmages:function(){ //funzione per impostare le immagini e centrare il testo

        var spanImmageCopia = '<span class="classCopiaDati"></span>';

        $('.classCopiaDati_').each(function(){
        	var img = $(this);

        	$(this).closest('tr').children().each(function(i){
        		if(i==0){
                    var titleTd = $(this).text();
                    if(titleTd!="Terapia domiciliare" && titleTd!= "Primo Ciclo" && titleTd!="Accertamenti Eseguiti" && titleTd!='Farmaci da ritirare in farmacia'){
                        var _testCopia   = img.closest('tr').height();
                        img.html('<span class="classCopiaDati"></span>');
                        img.parent().css({'display':'inline-block','vertical-align':'middle','margin-top':(_testCopia/2)+'px'});
                    }
        		}
        	});
 
            //centrare la label
            var _test   = $(this).closest('tr').height();
            $(this).closest('tr').find('td:first-child').css({'display':'inline-block','vertical-align':'middle','margin-top':(_test/2)+'px'})
        });

    },
    copia:function(){
        var arConvertito = new Array();
        var str;
        var rs = WindowCartella.executeQuery("lettere.xml",'getHtmlSezione',[array_iden_versione[$(this).closest('tr').index()],array_id_elemento[$(this).closest('tr').index()]]);
        if (rs.next()){
            //tapullo per la gestione dei caratteri accentati.
            str =  rs.getString('TESTO_HTML');
            var regex = /(<([^>]+)>)/ig;
            str = str.replace(regex, "");
            window.clipboardData.setData("Text",str );
            parent.strutturaDaIncollare = str;
            alert('Testo del referto copiato negli appunti');
        } else {
            alert('Referto non presente');
        }

    }*/

};
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


