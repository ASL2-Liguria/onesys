var WindowCartella = null;
var primoParSel=null;
$(function(){

    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    window.baseReparti = WindowCartella.baseReparti;
    window.baseGlobal = WindowCartella.baseGlobal;
    window.basePC = WindowCartella.basePC;
    window.baseUser = WindowCartella.baseUser;

	pianificaAttivita.init();
	pianificaAttivita.setEvents();
});

var pianificaAttivita = {
    init : function(){
        /* se esiste il bisogno, quindi la cartella è stata aperta con l'iden bisogno selezionato,
         * agisco tramite javascript
         * 
         */
        if (typeof  $('#iden_bisogno_selezionato').val() =='undefined')
        {
            $('.gruppi').hide();
            $('.gruppi ul').hide();
        }
        else 
        {
            /*Bisogno già selezionato al caricamento*/
            $('#bisogni span').each(function(){
                if ($(this).attr('id') != $('#iden_bisogno_selezionato').val()){
                    $(this).hide();
                }else{
                    $(this).addClass("selected");
                }
            });            
            $('.gruppi').each(function(){
                if ($(this).attr('iden_bisogno') != $('#iden_bisogno_selezionato').val()){
                    $(this).hide();
                }
            });
            $('.gruppi ul').hide();
        }
        
    },
    
    setEvents : function(){
        $('#bisogni span').click(function(){
            if ($(this).hasClass("selected")){
                $(this).removeClass("selected");
                var iden_bisogno = $(this).attr('id');
                $('.gruppi').each(function(){
                    if ($(this).attr('iden_bisogno') == iden_bisogno){
                        $(this).hide();
                    }
                });                
                
            }else{
                $(this).addClass("selected");
                var iden_bisogno = $(this).attr('id');
                $('.gruppi').each(function(){
                    if ($(this).attr('iden_bisogno') == iden_bisogno){
                        $(this).show();
                        //$(this).addClass("selected"+cod_dec);
                    }
                });
            }

            
        });
        
        $('.gruppi').click(function(){
            if ($(this).hasClass("gruppiSelected")){
                $(this).removeClass("gruppiSelected");
                $(this).children('ul').hide();
                
            }else{
                $(this).addClass("gruppiSelected");
                $(this).children('ul').show();
            }
        });

        $('.btnAttivita').click(function(event){
            
            if ($(this).hasClass("btnAttivitaSelected")){
                $(this).removeClass("btnAttivitaSelected");
                var gruppo = $(this).attr('iden_gruppo');
                var iden_bisogno = $(this).attr('iden_bisogno');
                
            }else{
                $(this).addClass("btnAttivitaSelected");
                var gruppo = $(this).attr('iden_gruppo');
                var iden_bisogno = $(this).attr('iden_bisogno');
            }
            event.stopPropagation();
            
        });
        
        $('span#save').click(function(){
            pianificaAttivita.save();
        });

        $('span#close').click(function(){
            pianificaAttivita.close();
        });        
        
    },
    
    save : function(){
        var vDati = WindowCartella.getForm();    
        var strAttivitaSelezionate='';     
        $('.gruppi').find('.btnAttivitaSelected').each(function(){
            strAttivitaSelezionate  += $(this).attr('iden_attivita')+'|';          
        });
        var pBinds = new Array();
        pBinds.push(strAttivitaSelezionate);      
        pBinds.push(vDati.iden_ricovero);
        pBinds.push(vDati.iden_visita);
        pBinds.push(WindowCartella.baseUser.IDEN_PER);
        var resp = WindowCartella.executeStatement("attivita.xml","inserisciAttivita",pBinds);

        if(resp[0]=='OK') { 
            alert('Attivita inserita');
            try{
                parent.refreshPiano(resp[0]);}
            catch(e){}
            parent.$.fancybox.close();
        } else {
            alert('Error '+resp);
        }
    },
    
    close : function(){
        var vDati = WindowCartella.getForm();    
        var strAttivitaSelezionate='';     
        $('.gruppi').find('.btnAttivitaSelected').each(function(){
            strAttivitaSelezionate  += $(this).attr('iden_attivita')+'|';          
        });
        if (strAttivitaSelezionate.indexOf('|')>0){
            if (confirm('Esistono delle attivita selezionate non salvate. Procedere con il salvataggio?'))
            {
                var pBinds = new Array();
                pBinds.push(strAttivitaSelezionate);      
                pBinds.push(vDati.iden_ricovero);
                pBinds.push(vDati.iden_visita);
                pBinds.push(WindowCartella.baseUser.IDEN_PER);
                var resp = WindowCartella.executeStatement("attivita.xml","inserisciAttivita",pBinds);

                if(resp[0]=='OK') { 
                    try{
                        parent.refreshPiano(resp[0]);}
                    catch(e){}
                    parent.$.fancybox.close();
                } else {
                    alert('Error '+resp);
                }
            }else{
                parent.$.fancybox.close();    
            }
        }
        else{
            parent.$.fancybox.close();
        }
    }
};