jQuery(document).ready(function(){
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }
	PARAMETRI.init();
});



var PARAMETRI = {
	
	init: function(){
		
		$('#groupFooterRegistraChiudi>table').eq(1).attr('name','tabellaParametri');
		$('#lblAggiungi').parent().attr('colspan','1').css('width','1000');
		$('SELECT[name=cmbAggiungi]').parent().css('width','10');
		PARAMETRI.creaTabella();		
	
		
	},
	
	setEvents:function(){
		
		
	},
	
	creaTabella : function(){
		var tr =
		"<TR class=\"header\">" +
			"<TD class=\"classTdLabel\"><LABEL>Parametro</LABEL></TD>"+
			"<TD class=\"classTdLabel\"><LABEL>Ordine</LABEL></TD>"+
			"<TD class=\"classTdLabel\"><LABEL>Terapia al bisogno</LABEL></TD>"+
			"<TD class=\"classTdLabel\"><LABEL>Sezione</LABEL></TD>"+
			"<TD class=\"classTdLabel\"><LABEL>Attivo</LABEL></TD>"+
			"<TD class=\"classTdLabel\"><LABEL>Critico basso</LABEL></TD>"+
			"<TD class=\"classTdLabel\"><LABEL>Allerta basso</LABEL></TD>"+
			"<TD class=\"classTdLabel\"><LABEL>Critico alto</></TD>"+
			"<TD class=\"classTdLabel\"><LABEL>Allerta alto</LABEL></TD>"+
			"<TD class=\"classTdLabel\"><LABEL>Critico basso 2</LABEL></TD>"+
			"<TD class=\"classTdLabel\"><LABEL>Allerta basso 2</LABEL></TD>"+
			"<TD class=\"classTdLabel\"><LABEL>Critico alto 2</></TD>"+
			"<TD class=\"classTdLabel\"><LABEL>Allerta alto 2</LABEL></TD>"+
		"</TR>";
		$('#groupFooterRegistraChiudi>table').eq(1).append(tr);
		
		var rs = WindowCartella.executeQuery("configurazioni/confParametri.xml","caricaParametri",[document.EXTERN.REPARTO.value]);
		if (!rs.isValid) throw new Error(rs.getError());
		while(rs.next()){
			PARAMETRI.addRow({
				descrizione:rs.getString("DESCRIZIONE"),
				iden:rs.getString("IDEN_PARAMETRO"),
				bisogno:rs.getString("TERAPIA_AL_BISOGNO"),
				sezione:rs.getString("SEZIONE"),
				ordine:rs.getString("ORDINE"),
				attivo:rs.getString("ATTIVO"),
				critico_basso:rs.getString("CRITICO_BASSO"),
				allerta_basso:rs.getString("ALLERTA_BASSO"),
				critico_alto:rs.getString("CRITICO_ALTO"),
				allerta_alto:rs.getString("ALLERTA_ALTO"),
				critico_basso2:rs.getString("CRITICO_BASSO_2"),
				allerta_basso2:rs.getString("ALLERTA_BASSO_2"),
				critico_alto2:rs.getString("CRITICO_ALTO_2"),
				allerta_alto2:rs.getString("ALLERTA_ALTO_2")
				}
			);
		}

		var tableParametri=$('table[name=tabellaParametri]').width(1000).css({'height':$('#groupFooterRegistraChiudi>table').eq(1).height()});
		var divParametri = $('<div/>').attr('id', 'divParametri').css({'overflow-x':'scroll','overflow-y':'scroll','height':'400px'}).width($(document).find('body').width());
		 tableParametri.parent().append(divParametri);
		 tableParametri.remove();
		$('#divParametri').append(tableParametri);
	
		
		PARAMETRI.setEvents();
	},
	
	addRow: function(param) {
		var tr=$("<TR class=\"parametro\" iden=\""+param.iden+"\">")
			.append($("<TD class=\"classTdField \"/>").text(param.descrizione))
			.append($("<TD class=\"classTdField\"><INPUT name=\"txtOrdine\" value=\""+param.ordine+"\"></></TD>"))
			.append($("<TD class=\"classTdField\"><SELECT name=\"cmbBisogno\"><OPTION value=S>Si</OPTION><OPTION value=N>No</OPTION></SELECT></TD>"))
			.append($("<TD class=\"classTdField\"><SELECT name=\"cmbSezione\"><OPTION value=ALTRE_PRESCRIZIONI>Altre prescrizioni</OPTION><OPTION value=PARAMETRI_VITALI>Parametri vitali</OPTION><OPTION value=ALTRE>Altre</OPTION></SELECT></TD>"))
			.append($("<TD class=\"classTdField\"><SELECT name=\"cmbAttivo\"><OPTION value=S>Si</OPTION><OPTION value=N>No</OPTION></SELECT></TD>"))
			.append($("<TD class=\"classTdField\"><INPUT name=\"txtCriticoBasso\" value=\""+param.critico_basso+"\"></></TD>"))
			.append($("<TD class=\"classTdField\"><INPUT name=\"txtAllertaBasso\" value=\""+param.allerta_basso+"\"></></TD>"))
			.append($("<TD class=\"classTdField\"><INPUT name=\"txtCriticoAlto\" value=\""+param.critico_alto+"\"></></TD>"))
			.append($("<TD class=\"classTdField\"><INPUT name=\"txtAllertaAlto\" value=\""+param.allerta_alto+"\"></></TD>"))
			.append($("<TD class=\"classTdField\"><INPUT name=\"txtCriticoBasso2\" value=\""+param.critico_basso2+"\"></></TD>"))
			.append($("<TD class=\"classTdField\"><INPUT name=\"txtAllertaBasso2\" value=\""+param.allerta_basso2+"\"></></TD>"))
			.append($("<TD class=\"classTdField\"><INPUT name=\"txtCriticoAlto2\" value=\""+param.critico_alto2+"\"></></TD>"))
			.append($("<TD class=\"classTdField\"><INPUT name=\"txtAllertaAlto2\" value=\""+param.allerta_alto2+"\"></></TD>"))
		
		$('table[name=tabellaParametri]').append(tr);
		$('TR[iden='+param.iden+']').find('SELECT[name=cmbBisogno]').val(param.bisogno);
		$('TR[iden='+param.iden+']').find('SELECT[name=cmbAttivo]').val(param.attivo);
		$('TR[iden='+param.iden+']').find('SELECT[name=cmbSezione]').val(param.sezione);
	},
	
	aggiungi: function(){
		
		var valCombo=$('SELECT[name=cmbAggiungi]').val();
		
		if(valCombo==0){
			alert('Selezionare un parametro vitale');
			return;
		}
		
		var rs = WindowCartella.executeQuery("configurazioni/confParametri.xml","caricaSingoloParametro",[valCombo]);
		$('SELECT[name=cmbAggiungi]>option[value='+valCombo+']').remove();
		if (!rs.isValid) throw new Error(rs.getError());
		while(rs.next()){
			PARAMETRI.addRow({
				descrizione:rs.getString("DESCRIZIONE"),
				iden:rs.getString("IDEN_PARAMETRO"),
				bisogno:rs.getString("TERAPIA_AL_BISOGNO"),
				sezione:rs.getString("SEZIONE"),
				ordine:rs.getString("ORDINE"),
				attivo:rs.getString("ATTIVO"),
				critico_basso:rs.getString("CRITICO_BASSO"),
				allerta_basso:rs.getString("ALLERTA_BASSO"),
				critico_alto:rs.getString("CRITICO_ALTO"),
				allerta_alto:rs.getString("ALLERTA_ALTO"),
				critico_basso2:rs.getString("CRITICO_BASSO_2"),
				allerta_basso2:rs.getString("ALLERTA_BASSO_2"),
				critico_alto2:rs.getString("CRITICO_ALTO_2"),
				allerta_alto2:rs.getString("ALLERTA_ALTO_2")
				}
			);
		}
		
	},
	
	salva: function(){
		var pBinds = new Array();
		var stringVal='';
	
		$('.parametro').each(function(i) {

           if(stringVal!=''){stringVal+='#';}			
			
			stringVal+=$(this).attr('iden');
			stringVal+='*'+$(this).find('INPUT[name=txtOrdine]').val();
			stringVal+='*'+$(this).find('SELECT[name=cmbBisogno]').val();
			stringVal+='*'+$(this).find('SELECT[name=cmbSezione]').val();
			stringVal+='*'+$(this).find('SELECT[name=cmbAttivo]').val();
			stringVal+='*'+$(this).find('INPUT[name=txtCriticoBasso]').val();
			stringVal+='*'+$(this).find('INPUT[name=txtAllertaBasso]').val();
			stringVal+='*'+$(this).find('INPUT[name=txtCriticoAlto]').val();
			stringVal+='*'+$(this).find('INPUT[name=txtAllertaAlto]').val();
			stringVal+='*'+$(this).find('INPUT[name=txtCriticoBasso2]').val();
			stringVal+='*'+$(this).find('INPUT[name=txtAllertaBasso2]').val();
			stringVal+='*'+$(this).find('INPUT[name=txtCriticoAlto2]').val();
			stringVal+='*'+$(this).find('INPUT[name=txtAllertaAlto2]').val();
			
		});
		
		
		 var resp=WindowCartella.executeStatement('configurazioni/confParametri.xml','registraParametri',[document.EXTERN.REPARTO.value,stringVal],0);
		    if (resp[0]=="OK"){
		    		PARAMETRI.chiudi();
		    	}
		    else{
		    	return alert(resp[0] +" "+ resp[1]);
		    }
	
	},
	
	chiudi: function(){
		parent.$.fancybox.close();
	}
};

