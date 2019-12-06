
var WindowCartella = null;
jQuery(document).ready(function(){
        window.WindowCartella = window;
        while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
            window.WindowCartella = window.WindowCartella.parent;
        }
        
        // Gestione dell'apertura da finestra modale
        if (typeof window.dialogArguments === 'object')
        	window.WindowCartella = window.dialogArguments.top.window;
        
        try {
            WindowCartella.utilMostraBoxAttesa(false);
        } catch (e) {
            /*catch nel caso non venga aperta dalla cartella*/
        }
        
        $('#lblPercezione,#lblUmidita,#lblAttivita,#lblMobilita,#lblNutrizione,#lblPosSciv').addClass('labelClass').parent().removeClass('classTdLabelLink').addClass('tdClass classTdLabel').append($('<div></div>').addClass('Link'));
        infoBraden.init();

        if (document.EXTERN.BISOGNO.value=='N'){
            document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
        }

        if (_STATO_PAGINA == 'L'){
            document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
        }

        try{
            if(!WindowCartella.ModalitaCartella.isStampabile(document)){
                document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
            }
        }
        catch(e){}
        try{
            if(!WindowCartella.ModalitaCartella.isStampabile(document)){
                document.getElementById('lblStampa').parentElement.parentElement.style.display = 'none';
            }
        }
        catch(e){}
    }
);


var count;
var click;
function countChecked(){
    count=0;
    click='N';

    sommaBraden(document.all.chkUmidita);
    sommaBraden(document.all.chkMobilita);
    sommaBraden(document.all.chkAttivita);
    sommaBraden(document.all.chkPercezione);
    sommaBraden(document.all.chkNutrizione);

    for (i=0; i<document.all.chkPosSciv.length; i++)
        if (document.all.chkPosSciv[i].checked){
            click='S';
            if (i=='0')
                count+=3;
            else if(i=='1')
                count+=2;
            else if(i=='2')
                count+=1;
        }
    if(click=='S' || count>0){
        document.all.txtTotale.value=count;
        document.all.txtTotale.disabled=true;
    }
}

function sommaBraden(radio){
    //alert('lunghezza' + radio.length);
    for (i=0; i<radio.length; i++)
        if (radio[i].checked){
            click='S';
            if (i=='0')
                count+=4;
            else if(i=='1')
                count+=3;
            else if(i=='2')
                count+=2;
            else if(i=='3')
                count+=1;
        }

}

function chiudiBraden(){

    try{
        var opener=window.dialogArguments;


        var query = "select to_char(data_ultima_modifica,'DD/MM/YYYY') DATA_ULTIMA_MODIFICA from radsql.cc_scale where key_legame='SCALA_BRADEN' and iden_visita=" + document.EXTERN.IDEN_VISITA.value;
        query += "@DATA_ULTIMA_MODIFICA";
        query += "@1";
        dwr.engine.setAsync(false);
        CJsUpdate.select(query, gestDati);
        dwr.engine.setAsync(true);

    }
    catch (e)
    {
    }

}

function gestDati(dati){
    var array_dati=null;
    try{
        var opener=window.dialogArguments;
        array_dati = dati.split('@');
        if(array_dati[0] != "$$$$$"){
            opener.document.getElementById('txtDataBraden').value=array_dati[0];
            opener.document.getElementById('txtEsitoBraden').value=document.getElementById('txtTotale').value;
        }
    }catch (e)
    {
    }

}

var infoBraden = {

    init:function(){//da chiamare all'apertura per crearlo
        $('.Link').live('click',function(){
            infoBraden.open($(this).parent().find('label').attr('id'));
        });
    },

    open:function(id){

        popupBraden.remove();

        var paramObj = {
            obj:null,
            title:null,
            width:800,
            height:400
        };


        paramObj.vObj = $('<table id=tableInfoBraden></table>')
        ;
        switch(id){
            case 'lblPercezione':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(4) NON LIMITATA'))
                            .append($('<td></td>').text('(3) LEGGERMENTE LIMITATA'))
                            .append($('<td></td>').text('(2) MOLTO LIMITATA'))
                            .append($('<td></td>').text('(1) TOTALMENTE LIMITATA'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('Risponde agli ordini verbali. Non ha deficit sensoriale che limiti la capacità di sentire ed esprimere il dolore o il disagio.'))
                            .append($('<td></td>').text('Risponde agli ordini verbali, ma non riesce a comunicare sempre il disagio o il bisogno di cambiare posizione. Ha limitata capacità di percepire il dolore o il disagio in 1 o 2 estremità.'))
                            .append($('<td></td>').text('Risponde solo agli stimoli dolorosi. Non può comunicare il proprio disagio se non gemendo o agitandosi. Il deficit sensoriale limita la percezione del dolore/disagio almeno per la metà del corpo.'))
                            .append($('<td></td>').text('Assenza di risposta agli stimoli dolorosi a causa del diminuito livello di coscienza o a sedazione o a limitata capacità di avvertire gli stimoli in molte zone del corpo.'))
                    )
                ;
                paramObj.title="PERCEZIONE SENSORIALE (capacità di rispondere consapevolmente alla sensazione di disagio dovuto all'aumento della pressione)";
                break;
            case 'lblUmidita':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(4) RARAMENTE BAGNATO'))
                            .append($('<td></td>').text('(3) OCCASIONALMENTE BAGNATO'))
                            .append($('<td></td>').text('(2) SPESSO BAGNATO'))
                            .append($('<td></td>').text('(1) COSTANTEMENTE BAGNATO'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('La cute è abitualmente asciutta. Le lenzuola sono cambiate ad intervalli regolari.'))
                            .append($('<td></td>').text('La cute è occasionalmente umida. Richiede un cambio di lenzuola extra 1 volta al giorno.'))
                            .append($('<td></td>').text('Cute sovente, ma non sempre umida. Le lenzuola devono essere cambiate almeno 3 volte al giorno o 1 volta per turno.'))
                            .append($('<td></td>').text('Cute costantemente umida a causa della traspirazione, da incontinenza o altro. L\'umidità viene riscontrata ogni qualvolta il pz si muove o si ruota.'))
                    )
                ;
                paramObj.title="UMIDITA' (grado di esposizione della cute all'umidità)";
                break;
            case 'lblAttivita':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(4) CAMMINA FREQUENTEMENTE'))
                            .append($('<td></td>').text('(3) CAMMINA OCCASIONALMENTE'))
                            .append($('<td></td>').text('(2) IN POLTRONA'))
                            .append($('<td></td>').text('(1) ALLETTATO'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('Cammina al di fuori della camera almeno 2 volte al giorno e dentro la camera 1 volta ogni 2 ore durante le ore diurne.'))
                            .append($('<td></td>').text('Cammina occasionalmente durante il giorno, ma per brevi distanze con o senza aiuto. Trascorre la maggior parte di ogni turno a letto o sulla sedia.'))
                            .append($('<td></td>').text('Capacità di camminare severamente limitata o inesistente. Non mantiene la posizione eretta e/o deve essere assistito nello spostamento in poltrona o sulla comoda.'))
                            .append($('<td></td>').text('Confinato a letto e non può fare alcun cambio di posizione senza assistenza.'))
                    )
                ;
                paramObj.title="ATTIVITA' (grado di attività fisica)";
                break;
            case 'lblMobilita':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(4) LIMITAZIONI ASSENTI'))
                            .append($('<td></td>').text('(3) PARZIALMENTE LIMITATA'))
                            .append($('<td></td>').text('(2) MOLTO LIMITATA'))
                            .append($('<td></td>').text('(1) IMMOBILE'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('Si sposta frequentemente e senza assistenza.'))
                            .append($('<td></td>').text('Cambia frequentemente la posizione con minimi spostamenti del corpo.'))
                            .append($('<td></td>').text('Cambia occasionalmente posizione del corpo e delle estremità, ma è incapace di eseguire frequenti e significativi cambiamenti di posizione indipendentemente.'))
                            .append($('<td></td>').text('Non può fare alcun cambiamento di posizione senza assistenza.'))
                    )
                ;
                paramObj.title="MOBILITA' (capacità di cambiare e controllare le posizioni del corpo)";
                break;
            case 'lblNutrizione':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(4) ECCELLENTE'))
                            .append($('<td></td>').text('(3) ADEGUATA'))
                            .append($('<td></td>').text('(2) PROBABILMENTE INADEGUATA'))
                            .append($('<td></td>').text('(1) MOLTO POVERA'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('Mangia la maggior parte del cibo. Non rifiuta mai un pasto. Talvolta mangia tra i pasti. Non necessita di integratori'))
                            .append($('<td></td>').text('Mangia più della metà dei pasti. Abitualmente assume integratori o si alimenta artificialmente con NPT/NE assumendo il quantitativo nutrizionale necessario.'))
                            .append($('<td></td>').text('Raramente mangia un pasto completo; di solito mangia la metà dei cibi offerti. A volte assume integratori. Riceve meno della quantità nutrizionale necessaria. '))
                            .append($('<td></td>').text('Non mangia pasti completi. Di rado mangia più di 1/3 del cibo. Assume pochi liquidi e nessun integratore. E\' digiuno o sostenuto con fleboclisi o a dieta idrica per più di 5 giorni.'))
                    )
                ;
                paramObj.title="NUTRIZIONE (assunzione usuale di cibo)";
                break;
            case 'lblPosSciv':
                $(paramObj.vObj).append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('(3) SENZA PROBLEMI APPARENTI'))
                            .append($('<td></td>').text('(2) PROBLEMA POTENZIALE'))
                            .append($('<td></td>').text('(1) PROBLEMA'))
                    )
                    .append(
                        $('<tr></tr>')
                            .append($('<td></td>').text('Si sposta nel letto e sulla sedia in modo autonomo e ha sufficiente forza muscolare per sollevarsi completamente durante i movimenti.'))
                            .append($('<td></td>').text('Si muove poco e necessita di assistenza minima. Durante lo spostamento la cute fa attrito con le lenzuola o con il piano della poltrona; occasionalmente può slittare.'))
                            .append($('<td></td>').text('Richiede da moderata a completa assistenza nei movimenti. Scivola nel letto o nella poltrona e richiede riposizionamento con assistenza. Sono presenti staticità, contratture, agitazione che causano attrito contro il piano del letto o della poltrona.'))
                    )
                ;
                paramObj.title="FRIZIONE E SCIVOLAMENTO (tendenza a scivolare nel letto o sulla carrozzina)";
                break;
        }


        popupBraden.append({
            obj:paramObj.vObj,
            title:paramObj.title,
            width:paramObj.width,
            height:paramObj.height
        });


    },

    show:function(){
        $('#lblFunzione').addClass('Link');
    },

    hide:function(){
        $('#lblFunzione').removeClass('Link');
    }
};


var popupBraden = {

    append:function(pParam){

        popupBraden.remove();

        pParam.header = (typeof pParam.header != 'undefined' 	? pParam.header : null);
        pParam.footer = (typeof pParam.footer != 'undefined' 	? pParam.footer : null);
        pParam.title = 	(typeof pParam.title != 'undefined' 	? pParam.title 	: "");
        pParam.width = 	(typeof pParam.width != 'undefined' 	? pParam.width 	: 500);
        pParam.height = (typeof pParam.height != 'undefined' 	? pParam.height : 300);


        $('body').append(
            $('<div id="divPopUpInfoBraden"></div>')
                .css("font-size","12px")
                .append(pParam.header)
                .append(pParam.obj)
                .append(pParam.footer)
                .attr("title",pParam.title)
        );

        $('#divPopUpInfoBraden').dialog({
            position:	[event.clientX,event.clientY],
            width:		pParam.width,
            height:		pParam.height
        });

        popupBraden.setRemoveEvents();

    },

    remove:function(){
        $('#divPopUpInfoBraden').remove();
    },

    setRemoveEvents:function(){
        $("body").click(popupBraden.remove);
    }

};