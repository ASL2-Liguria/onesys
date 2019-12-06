var WindowCartella = null;
jQuery(document).ready(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    
    try {
        WindowCartella.utilMostraBoxAttesa(false);
    } catch (e) {
        /*catch nel caso non venga aperta dalla cartella*/
    }
    
    if (typeof (document.EXTERN.OPEN_FROM_OS) == 'undefined' || document.EXTERN.OPEN_FROM_OS.value=='N'){
        document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
    }


	NS_SCALA_NIH_STROKE.init();
	if (_STATO_PAGINA == 'L'){
        document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
    }
	NS_SCALA_NIH_STROKE.setEvents();
});

var somma=0;

var NS_SCALA_NIH_STROKE = {
	init:function(){
	$("#lblOrienta").parent().attr('colspan', '3');
	$("#lblEseOrdini").parent().attr('colspan', '3');
	setRadioResettable();
	},
		setEvents: function(){
		$("input[name='radLivello']").click(function(){
			NS_SCALA_NIH_STROKE.calcolaTotale();
		});
		$("input[name='radOrienta']").click(function(){
			NS_SCALA_NIH_STROKE.calcolaTotale();
		});
		$("input[name='radEseOrdini']").click(function(){
			NS_SCALA_NIH_STROKE.calcolaTotale();
		});
		$("input[name='radMotOcu']").click(function(){
			NS_SCALA_NIH_STROKE.calcolaTotale();
		});
		$("input[name='radCampoVis']").click(function(){
			NS_SCALA_NIH_STROKE.calcolaTotale();
		});
		$("input[name='radParaFaccia']").click(function(){
			NS_SCALA_NIH_STROKE.calcolaTotale();
		});
		$("input[name='radMotArtoSupDx']").click(function(){
			NS_SCALA_NIH_STROKE.calcolaTotale();
		});
		$("input[name='radMotArtoSupSx']").click(function(){
			NS_SCALA_NIH_STROKE.calcolaTotale();
		});
		$("input[name='radMotArtoInfDx']").click(function(){
			NS_SCALA_NIH_STROKE.calcolaTotale();
		});
		$("input[name='radMotArtoInfSx']").click(function(){
			NS_SCALA_NIH_STROKE.calcolaTotale();
		});
		$("input[name='radAtassia']").click(function(){
			NS_SCALA_NIH_STROKE.calcolaTotale();
		});
		$("input[name='radSens']").click(function(){
			NS_SCALA_NIH_STROKE.calcolaTotale();
		});
		$("input[name='radLinguaggio']").click(function(){
			NS_SCALA_NIH_STROKE.calcolaTotale();
		});
		$("input[name='radDisart']").click(function(){
			NS_SCALA_NIH_STROKE.calcolaTotale();
		});
		$("input[name='radNeglect']").click(function(){
			NS_SCALA_NIH_STROKE.calcolaTotale();
		});
	},
	calcolaTotale: function(){
		somma=0;
		sommaRadio($("input[name='radLivello']"));
		sommaRadio($("input[name='radOrienta']"));
		sommaRadio($("input[name='radEseOrdini']"));
		sommaRadio($("input[name='radMotOcu']"));
		sommaRadio($("input[name='radCampoVis']"));
		sommaRadio($("input[name='radParaFaccia']"));
		sommaRadio($("input[name='radMotArtoSupDx']"));
		sommaRadio($("input[name='radMotArtoSupSx']"));
		sommaRadio($("input[name='radMotArtoInfDx']"));
		sommaRadio($("input[name='radMotArtoInfSx']"));
		sommaRadio($("input[name='radAtassia']"));
		sommaRadio($("input[name='radSens']"));
		sommaRadio($("input[name='radLinguaggio']"));
		sommaRadio($("input[name='radDisart']"));
		sommaRadio($("input[name='radNeglect']"));
		$("#txtTotale").val(somma);
	}
		
};


function sommaRadio(radio){
	//alert(radio.length);
	for (i=0; i<radio.length; i++)
		if (radio[i].checked){
			somma +=i;
		};		
	}	

function chiudiNih(){

    try{
        var opener=window.dialogArguments;

        var query = "select to_char(data_ultima_modifica,'DD/MM/YYYY') DATA_ULTIMA_MODIFICA from radsql.cc_scale where key_legame='SCALA_NIH_STROKE' and iden_visita=" + document.EXTERN.IDEN_VISITA.value;
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
            opener.document.getElementById('txtDataNihss').value=array_dati[0];
            opener.document.getElementById('txtScalaNihss').value=document.getElementById('txtTotale').value;
        }
    }catch (e)
    {
    }

}