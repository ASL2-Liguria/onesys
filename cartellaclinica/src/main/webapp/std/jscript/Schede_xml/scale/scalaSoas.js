/**
* User: matteopi
* Date: 11/02/13
* Time: 17.56
*/

var WindowCartella = null;
jQuery(document).ready(function(){
    //standard per le dipendenze della cartella
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    try{
        WindowCartella.utilMostraBoxAttesa(false);
    }catch(e)
    {/*catch nel caso non venga aperta dalla cartella*/}

    NS_SCALA_SOAS.init();
    NS_SCALA_SOAS.events();

});

var NS_SCALA_SOAS = ({

    init:function(){
        //nasconde il tasto annulla
        $("#lblChiudi").parent().parent().hide();

        /*all'apertura della pagina controlla se i box "altro" o quelli relativi ai farmaci sono checkati
           questo per rendere i campi di testo disabled.
        */
        NS_SCALA_SOAS.controlloBox('chkAltroMezzo');
        NS_SCALA_SOAS.controlloBox('chkAltroEvento');
        NS_SCALA_SOAS.controlloBox('chkFarmaciOs');
        NS_SCALA_SOAS.controlloBox('chkFarmaciIM');
        NS_SCALA_SOAS.controlloBox('chkAssistenza');
    },
    events:function(){
        //in caso di medico la scheda è solo in visualizazione
        if(WindowCartella.ModalitaCartella.isReadonly(document)){
            $("#lblregistra").parent().parent().hide();
        }
        //al cambiamento di stato dei checkbox indicati si attiva o disattiva il disabled
        $('#chkAltroMezzo,#chkAltroEvento,#chkFarmaciOs,#chkFarmaciIM,#chkAssistenza').change(function(){
           NS_SCALA_SOAS.controlloBox($(this).attr('id'));
        });

    },

    controlloBox:function(pId){
        var Element =pId.substring(3);
        if  ($('#chk'+Element).is(':checked')){

            $('input[name=txt'+Element+']').attr('disabled',false);
        }else{

            $('input[name=txt'+Element+']').attr('disabled',true).val('');

        };
   }
});