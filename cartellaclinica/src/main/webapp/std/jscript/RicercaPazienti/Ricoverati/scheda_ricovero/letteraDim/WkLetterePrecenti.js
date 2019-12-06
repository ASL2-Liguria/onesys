/**
 * User: matteopi
 * Date: 26/02/13
 * Time: 10.40
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

    NS_WK_LETTERE.init();
    NS_WK_LETTERE.events();


});

var NS_WK_LETTERE = {

    apriPrimoCiclo:function(){


    },
    init:function(){
        NS_WK_LETTERE.heightOfWk();
        NS_WK_LETTERE.setImmages();

    },
    events:function(){

        if(WindowCartella.ModalitaCartella.isReadonly(document)){
            $('.classApriPrimoCiclo').click(function(){
                alert('Attenzione lettera in sola lettura');
            });
        } else{
            $('.classApriPrimoCiclo').click(function(){
                var rowIndex = $(event.srcElement).closest('tr').prevAll().length;
                var idenVersionePrimociclo =array_iden_lettera[rowIndex];
                var idenTerapiaAssociata =array_iden_terapia[rowIndex];
                parent.apriPrimoCicloSel(idenVersionePrimociclo,idenTerapiaAssociata);
            });
        }
        $('.classApriCartella').click(NS_WK_LETTERE.apriWorklistLettereSezioni);


    },

    apriWorklistLettereSezioni:function(){

        var rowIndex = $(event.srcElement).closest('tr').prevAll().length;
        var idenVersione =array_iden_lettera[rowIndex];
        var url = "servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_LETTERE_PRECEDENTI_SEZIONI&WHERE_WK=where IDEN_VERSIONE="+idenVersione;
        url+="&ILLUMINA=illumina(this.sectionRowIndex);";
        parent.document.getElementById('frameLetterePrecedentiSezioni').src = url;

    },

    heightOfWk:function(){
        //serve per impostare l'altezza delle 2 worklist
        var counter = 3;
        var a = 10;
        var nRows = $('#oTable tbody tr').length;

        if (nRows == 0){//se la prima wk non ha righe, nascondo la seconda
            parent.$('#frameLetterePrecedentiSezioni').hide();
            return;
        }

        $('#oTable > tbody > tr').each(function(index){
            counter+=a;
        });
        
        if (counter >= '30'){
            counter = '30';
        }

        var heightWkSezioni= 100 - counter - 2;
        parent.document.getElementById('frameLetterePrecedenti').style.height = counter+'%';
        parent.document.getElementById('frameLetterePrecedentiSezioni').style.height= heightWkSezioni+'%';
        parent.document.getElementById('frameLetterePrecedentiSezioni').style.marginTop = "10";
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





