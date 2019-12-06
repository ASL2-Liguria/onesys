jQuery(document).ready(function(){
	RICERCA_REPARTI.init();
	RICERCA_REPARTI.setEvents();
});

var RICERCA_REPARTI = {
	url:"servletGenerator?KEY_LEGAME=WORKLIST&TIPO_WK=WK_REPARTI&ILLUMINA=illumina(this.sectionRowIndex);",
	
	init: function(){
		
		$('INPUT[name=radSceltaRicerca][value=DESCR]').attr('checked','checked');
		$('SELECT[name=cmbStato]').val('ATT');
		
           
	},
	
	setEvents:function(){
		$("input[name='txtTesto']").keyup(function() {
			this.value = this.value.toUpperCase();
			if (window.event.keyCode == 13) {
				RICERCA_REPARTI.ricerca();
			}
		});
		
	},
	
	ricerca : function() {
		var where='&WHERE_WK=WHERE ';
		
		testo=$('#txtTesto').val();
	
		if (testo==''){
		  return alert('Attenzione, inserire un testo da ricercare');	
		}
		
		if ($('INPUT[name=radSceltaRicerca]:checked').val()=='DESCR'){
			where+= " DESCR LIKE '"+testo+"%25' ";
		}
		else{
			where+= " COD_DEC LIKE '"+testo+"%25' ";
		}
		
		if ($('SELECT[name=cmbStato]').val()=='ATT'){
			where+= " AND ATTIVO='S'";
		}
		else if ($('SELECT[name=cmbStato]').val()=='NON_ATT'){
			where+= " AND ATTIVO='N'";
		}
		
		
	//	$('#oIFWk')[0].src=RICERCA_REPARTI.url+where;
		$('#oIFWk').attr('src',RICERCA_REPARTI.url+where);
	}
	
};