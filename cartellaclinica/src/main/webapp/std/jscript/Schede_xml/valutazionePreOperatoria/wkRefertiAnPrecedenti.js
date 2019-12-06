/**
 * User: linob
 * Date: 26/05/14
 */

var WindowCartella = null;

jQuery(document).ready(function(){
    /*WindowCartella = opener.top.window;
    
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

    try{
        WindowCartella.utilMostraBoxAttesa(false);
    }catch(e)
    {}*/
    NS_WK_REFERTI_AN_PRECEDENTI.init();
    NS_WK_REFERTI_AN_PRECEDENTI.events();


});

var NS_WK_REFERTI_AN_PRECEDENTI = {

    apriPrimoCiclo:function(){


    },
    init:function(){
        if ($('#TIPO_WK_REF').val()=='PRECEDENTI')
            NS_WK_REFERTI_AN_PRECEDENTI.heightOfPrecedentiWk();
        else
            NS_WK_REFERTI_AN_PRECEDENTI.heightOfStoricoWk();
        //        NS_WK_REFERTI_AN_PRECEDENTI.setImmages();

    },
    events:function(){
        $('.classApriRefertoAn').click(function(){
            NS_WK_REFERTI_AN_PRECEDENTI.apriWorklistLettereSezioni()
        });


    },

    apriWorklistLettereSezioni:function(){
        var rowIndex = $(event.srcElement).closest('tr').prevAll().length;
        var idenVersione =array_iden_referto[rowIndex];
        var url = "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_REFERTI_AN_PRECEDENTI_SEZIONI&WHERE_WK=where IDEN_VERSIONE="+idenVersione;
        url+="&ILLUMINA=illumina(this.sectionRowIndex);";
        
        if ($('#TIPO_WK_REF').val()=='STORICO')
            parent.document.getElementById('frameRefertiStoricoPrecedentiSezioni').src = url
        else
            parent.document.getElementById('frameRefertiPrecedentiSezioni').src = url;

    },

    heightOfPrecedentiWk:function(){
        //serve per impostare l'altezza delle 2 worklist
        var counter = 3;
        var a = 10;
        var nRows = $('#oTable tbody tr').length;
        if (nRows == 0){//se la prima wk non ha righe, nascondo la seconda
            parent.$('#frameRefertiPrecedentiSezioni').hide();
            return;
        }

        $('#oTable > tbody > tr').each(function(index){
            counter+=a;
        });
        if (counter >= '30'){
            counter = '30';
        }

        var heightWkSezioni= 100 - counter - 2;
        parent.document.getElementById('frameRefertiPrecedenti').style.height = counter+'%';
        parent.document.getElementById('frameRefertiPrecedentiSezioni').style.height= heightWkSezioni+'%';
        parent.document.getElementById('frameRefertiPrecedentiSezioni').style.marginTop = "10";
    },
    
    heightOfStoricoWk:function(){
        //serve per impostare l'altezza delle 2 worklist

        var counter = 3;
        var a = 10;
        var nRows = $('#oTable tbody tr').length;
        if (nRows == 0){//se la prima wk non ha righe, nascondo la seconda
            parent.$('#frameRefertiStoricoPrecedentiSezioni').hide();            

            return;
        }

        $('#oTable > tbody > tr').each(function(index){
            counter+=a;
        });
        if (counter >= '30'){
            counter = '30';
        }

        var heightWkSezioni= 100 - counter - 2;
        
        parent.document.getElementById('frameRefertiStoricoPrecedenti').style.height = counter+'%';
        parent.document.getElementById('frameRefertiStoricoPrecedentiSezioni').style.height= heightWkSezioni+'%';
        parent.document.getElementById('frameRefertiStoricoPrecedentiSezioni').style.marginTop = "10";
    },    
    
    setImmages:function(){

        var spanImmageVisualizza = '<span class="classApriCartella"></span>';
        var spanImmagePrimoCiclo = '<span class="classApriPrimoCiclo"></span>';

        $('.classApriCartella_').each(function(){
            this.innerHTML= spanImmageVisualizza

        });
        $('.classApriPrimoCiclo_').each(function(){
            this.innerHTML= spanImmagePrimoCiclo
        })

    }
}






