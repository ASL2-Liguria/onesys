var Parametri = [/*{data:'',ora:'',	appuntamento:{value:'',status:''},	accesso:{value:'',status:''}}*/];
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

	GESTIONE_ACCESSI_APPUNTAMENTI.init();
	GESTIONE_ACCESSI_APPUNTAMENTI.setEvents();
});

var GESTIONE_ACCESSI_APPUNTAMENTI = {

	init:function(){
		

		jQuery("tr").attr("id","tr0");
		jQuery("table.classDataEntryTable").attr("id","tableIns");
		jQuery("#txtNote").parent().attr("style","border-bottom:2px solid blue");
		jQuery("#lblNote").parent().attr("style","border-bottom:2px solid blue");
		$('input[name="chkAppuntamento"]').attr("rownumber","");
		
		GESTIONE_ACCESSI_APPUNTAMENTI.loadParameters();
		GESTIONE_ACCESSI_APPUNTAMENTI.creaLista();

		jQuery("#txtData").addClass("dataOra").attr("disabled","disabled");
		jQuery("#txtOra").addClass("dataOra");
		
		jQuery("#txtNote").parent().addClass("note");

	},

	setEvents:function(){
		$('#lblRegistra').click(GESTIONE_ACCESSI_APPUNTAMENTI.registra);

		$('input[name="chkAppuntamento"]').live('click',function(){

			if($(this).attr("checked")){

                if (!(top.getRicovero('TIPOLOGIA')=='PRE-DH')){
                    $('input[name="chkAccesso"]').attr("disabled","");
                }

            }else{
                $('input[name="chkAccesso"]').attr("disabled","disabled").attr("checked","");
			}
		});

		$('input[name="txtOra"]').live('keyup',function(){oraControl_onkeyup(this);})
			.live('blur',function(){ oraControl_onblur(this);});
	},

	loadParameters:function(){
		var Elements = document.EXTERN.VALORI.value.split('|');
		for(var i = 0 ; i < Elements.length ; i++ ){
			ParamIn = Elements[i].split('@');
			Parametri.push({
				data 			: MultiSubstring(ParamIn[0],[[6,8,'/'],[4,6,'/'],[0,4]]),
				ora 			: ParamIn[1],
				appuntamento	:{
					value 	: ParamIn[2],
					status 	: ParamIn[3]
				},
				accesso			:{
					value 	: ParamIn[4],
					status 	: ParamIn[5]
				},
                note:ParamIn[6]
			});
		}
	},

	registra:function(){
		
		var controllo = 0;
		$('input[name="chkAppuntamento"]').each(function(){
			
			var index=(jQuery(this).attr("rownumber")?jQuery(this).attr("rownumber"):'');
			var v_data = $("#txtData"+index).val();
			var v_ora = $("#txtOra"+index).val();
			var v_note = $("#txtNote"+index).val();
			var v_nota_breve = $("#txtNotaBreve"+index).val();
			var chk_acc = $('input[name="chkAccesso'+index+'"]');
			
			//alert(index + '\n' + v_data + '\n' + v_ora + '\n' + v_note  + '\n' + v_nota_breve + '\n' + chk_acc );
			
			if($(this).attr("checked")){
				
				APPUNTAMENTI.sql.set({
					dimesso:		'N',
					iden_ricovero:	WindowCartella.getForm(document).iden_ricovero,
					data:			MultiSubstring(v_data,[[6,10],[3,5],[0,2]]),
					ora:			v_ora,
					note:			v_note,
					nota_breve:		v_nota_breve,
					accesso:		(chk_acc.attr("checked")?'S':'N'),
					callBackOk:		controllo++,
					callBackKo:		null
				});
			}
		});
		
		if(controllo==0)return;

		top.$.fancybox.close();
		
	},

	aggiungiRiga:function(idx, tr_id){

		//alert(idx+ ' '+  tr_id);

		var riga= "<tr id='spazio' class = 'spazio'><td colspan =12 class = 'spazioTD'>&nbsp;</td>";
		riga += "</tr>";
		riga += "<tr id='tr"+idx+"'>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel'><label name='lblData"+idx+"' id='lblData"+idx+"'>"+GESTIONE_ACCESSI_APPUNTAMENTI.aggLabel('lblData')+"</label></td>";
		riga += "<td STATO_CAMPO='E' class='classTdField'><input id='txtData"+idx+"' STATO_CAMPO='E' value='' name='txtData"+idx+"' type='text'></input></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel'><label name='lblOra"+idx+"' id='lblOra"+idx+"'>"+GESTIONE_ACCESSI_APPUNTAMENTI.aggLabel('lblOra')+"</label></td>";
		riga += "<td STATO_CAMPO='E' class='classTdField'><input id='txtOra"+idx+"' STATO_CAMPO='E' value='' name='txtOra"+idx+"' type='text'></input></td>";

		riga += "<td STATO_CAMPO='E' class='classTdLabel'><label name='lblNotaBreve"+idx+"' id='lblNotaBreve"+idx+"'>"+GESTIONE_ACCESSI_APPUNTAMENTI.aggLabel('lblNotaBreve')+"</label></td>";
		riga += "<td STATO_CAMPO='E' class='classTdField'><input id='txtNotaBreve"+idx+"' STATO_CAMPO='E' value='' name='txtNotaBreve"+idx+"' type='text'></input></td>";

		riga += "<td STATO_CAMPO='E' class='classTdLabel'><label name='lblAppuntamento"+idx+"'' id='lblAppuntamento"+idx+"'>"+GESTIONE_ACCESSI_APPUNTAMENTI.aggLabel('lblAppuntamento')+"</label></td>";
		riga += "<td STATO_CAMPO='E' class='classTdField'><input STATO_CAMPO='E' value='' rownumber = '"+idx+"' name='chkAppuntamento' type='checkbox'></input></td>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel'><label name='lblAccesso"+idx+"' id='lblAccesso"+idx+"''>"+GESTIONE_ACCESSI_APPUNTAMENTI.aggLabel('lblAccesso')+"</label></td>";
		riga += "<td colspan='4' STATO_CAMPO='E' class='classTdField'><input STATO_CAMPO='E'  name='chkAccesso"+idx+"' type='checkbox'></input></td>";
		riga += "</tr>";
		riga += "<tr id='tr"+idx+"'>";
		riga += "<td STATO_CAMPO='E' class='classTdLabel' style='border-bottom:2px solid blue;' ><label name='lblNote"+idx+"' id='lblNote"+idx+"'>"+GESTIONE_ACCESSI_APPUNTAMENTI.aggLabel('lblNote')+"</label></td>";
		riga += "<td STATO_CAMPO='E' class='classTdField note bordo' colSpan=12 style='border-bottom:2px solid blue;'><input id='txtNote"+idx+"' class='note' STATO_CAMPO='E' value='' name='txtNote"+idx+"' type='text'></input></td>";
		riga += "</tr>";

		jQuery("#tableIns").append(jQuery(riga));
		
		GESTIONE_ACCESSI_APPUNTAMENTI.addEvent(idx);

	},
	
	addEvent:function(idxRiga){

		jQuery("#txtOra"+idxRiga).attr("rownumber",idxRiga); 
		jQuery("#txtData"+idxRiga).addClass("dataOra").attr("readonly",true).attr("disabled", "disabled"); 
		jQuery("#txtData"+idxRiga).attr("rownumber",idxRiga);
		
	},

	popolaRiga:function(rownum,parametri){

		var indice =(rownum!=0?rownum:'');

		jQuery("#txtData"+indice).val(parametri.data);
		jQuery("#txtOra"+indice).val(parametri.ora);

		
		jQuery("input[name='chkAppuntamento'][rownumber='"+indice+"']")
			.attr("checked",(parametri.appuntamento.value=='S'?"checked":''))
			.attr("disabled",(parametri.appuntamento.status=='L'?"disabled":''));

		jQuery("input[name='chkAccesso"+indice+"']")
			.attr("checked",(parametri.accesso.value=='S'?"checked":''))
			.attr("disabled",(parametri.accesso.status=='L'?"disabled":''));
        jQuery('#txtNote'+indice).val(parametri.note);
	},

	aggLabel:function(idLabel){

		var label='';

		for (var x=0;x<arrayLabelName.length;x++){
			if(arrayLabelName[x] == idLabel){
				label=arrayLabelValue[x];
			}
		}

		return label;
	},

	creaLista:function() {
		//alert(Parametri.length);
		for (var i=0;i<Parametri.length;i++){
			//alert('parametri: '+Parametri[i].data + ' - ' +Parametri[i].ora + ' - ' +Parametri[i].accesso.value + ' - ' +Parametri[i].appuntamento.value)
			if(i!=0){
				GESTIONE_ACCESSI_APPUNTAMENTI.aggiungiRiga(i,i-1);
			}
			GESTIONE_ACCESSI_APPUNTAMENTI.popolaRiga(i,Parametri[i]);
		}
	},

	end:function(){}

};