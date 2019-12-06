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

	try {
		WindowCartella.utilMostraBoxAttesa(false);
	} catch (e) {
		/*catch nel caso non venga aperta dalla cartella*/
	}

    
    
    if (typeof (document.EXTERN.OPEN_FROM_OS) == 'undefined' || document.EXTERN.OPEN_FROM_OS.value=='N'){
        document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
    }


	NS_SCALA_RANKIN.init();
	if (_STATO_PAGINA == 'L'){
        document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
    }
	NS_SCALA_RANKIN.setEvents();
});
var NS_SCALA_RANKIN={
	init: function(){	
		setRadioResettable();
	},
	setEvents:function(){
		$("#chk0").click(function(){
			NS_SCALA_RANKIN.calcolaPunteggio();
		});
		$("#chk1").click(function(){
			NS_SCALA_RANKIN.calcolaPunteggio();
		});
		$("#chk2").click(function(){
			NS_SCALA_RANKIN.calcolaPunteggio();
		});
		$("#chk3").click(function(){
			NS_SCALA_RANKIN.calcolaPunteggio();
		});
		$("#chk4").click(function(){
			NS_SCALA_RANKIN.calcolaPunteggio();
		});
		$("#chk5").click(function(){
			NS_SCALA_RANKIN.calcolaPunteggio();
		});
	},
	calcolaPunteggio: function(){
		var punti=0;
		var radioB=$("input[name='chkRakin']");
		for (i=0; i<radioB.length; i++){
			if (radioB[i].checked){
				punti = i;
			};
		}						
		$("#txtPunteggio").val(punti);
	}
	
};

function chiudiRankin(){

    try{
        var opener=window.dialogArguments;

       
        var query = "select to_char(data_ultima_modifica,'DD/MM/YYYY') DATA_ULTIMA_MODIFICA from radsql.cc_scale where key_legame='SCALA_RANKIN' and iden_visita=" + document.EXTERN.IDEN_VISITA.value;
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
            opener.document.getElementById('txtDataMrs').value=array_dati[0];
            opener.document.getElementById('txtScalaMrs').value=document.getElementById('txtPunteggio').value;
        }
    }catch (e)
    {
    }

}