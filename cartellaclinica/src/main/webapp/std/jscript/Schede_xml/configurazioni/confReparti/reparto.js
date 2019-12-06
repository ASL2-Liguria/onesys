jQuery(document).ready(function(){
    window.WindowCartella = window;
    while (window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella) {
        window.WindowCartella = window.WindowCartella.parent;
    }

	REPARTO.init();
});



var REPARTO = {
	
	init: function(){

		REPARTO.setEvents();
			

		//modifica
		if (typeof(document.EXTERN.REPARTO)!='undefined'){
			$('INPUT,SELECT').attr('disabled',true);
			$('INPUT[name=radAttivo]').attr('disabled',false);
			$('INPUT[name=radAbilitaCons]').attr('disabled',false);
			$('INPUT[name=txtDescr]').attr('disabled',false);

			var rs = WindowCartella.executeQuery('configurazioni/confReparto.xml','caricaReparto',[document.EXTERN.REPARTO.value]);
			var tipoRic;
			if(rs.next()){
				$('SELECT[name=cmbStruttura]').val(rs.getString("struttura"));
				$('SELECT[name=cmbCodStruttura]').val(rs.getString("codice_struttura"));
				$("#txtCodPresidio").val(rs.getString("codice_presidio"));
				$("#txtSubCodStruttura").val(rs.getString("sub_codice_struttura"));
				$("#txtCodSezione").val(rs.getString("codice_sezione"));
				$("#txtSubCodSezione").val(rs.getString("sub_codice_sezione"));
				$("#txtCodProgressivo").val(rs.getString("codice_progressivo"));
				$("#txtCodInterno").val(document.EXTERN.REPARTO.value);
				$("#txtDescr").val(rs.getString("descr"));
				$("#txtCodLabo").val(rs.getString("cod_pro"));
				$("#txtCodFarma").val(rs.getString("codice_esterno_1"));
				$("#txtCodParifica").val(rs.getString("codice_ccd"));
				$("#txtCodSts11").val(rs.getString("codice_sts11"));
				$("INPUT[name=radAttivo][value="+rs.getString("attivo")+"]").attr('checked','checked');
				$("INPUT[name=radAbilitaCons][value="+rs.getString("consulenze")+"]").attr('checked','checked');
				$('SELECT[name=cmbCodAreaFunz]').val(rs.getString("codice_afo"));
				
				if (rs.getString("abilita_ordinario")=='S'){
					tipoRic='ORD';
				}
				else if (rs.getString("abilita_day_hospital")=='S'){
					tipoRic='DH';
				}
				else if (rs.getString("abilita_ambulatoriale")=='S'){
					tipoRic='AMB';
				}
				$('SELECT[name=cmbTipologia]').val(tipoRic);
				
			}
		}
		//inserimento
		else{
			$('INPUT[name=txtCodPresidio]').attr('disabled',true);
			$('INPUT[name=txtSubCodStruttura]').attr('disabled',true);
			$('SELECT[name=cmbCodStruttura]').attr('disabled',true);
			$('INPUT[name=radAttivo][value=S]').attr('checked',true);
			$('INPUT[name=radAbilitaCons][value=N]').attr('checked',true);
		}
		
	},
	
	setEvents:function(){
		
		$('SELECT[name=cmbStruttura]').change(function () {
		     switch($(this).val()){
		     case 'ALBENGA': 
		    	 $('#txtSubCodStruttura').val('01');
		    	 $('SELECT[name=cmbCodStruttura]').val('9');
		    	 $('#txtCodPresidio').val('070212');
		    	 break;
		     case 'CAIRO': 
		    	 $('#txtSubCodStruttura').val('03');
		    	 $('SELECT[name=cmbCodStruttura]').val('8');
		    	 $('#txtCodPresidio').val('070211');
		    	 break;
		     case 'PIETRA_LIGURE': 
		    	 $('#txtSubCodStruttura').val('02');
		    	 $('SELECT[name=cmbCodStruttura]').val('9');
		    	 $('#txtCodPresidio').val('070212');
		    	 break;
		     case 'SAVONA': 
		    	 $('#txtSubCodStruttura').val('04');
		    	 $('SELECT[name=cmbCodStruttura]').val('8'); 
		    	 $('#txtCodPresidio').val('070211');
		    	 break;
		     default:  $('#txtSubCodStruttura').val('');
		     }
		 });
		
		$("#txtCodParifica").attr('maxlength','4');
		$("#txtCodInterno").attr('maxlength','10');
		$("#txtCodSezione").attr('maxlength','4');
		$("#txtCodProgressivo").attr('maxlength','10');
		$("#txtCodSts11").attr('maxlength','6');
		
	},
	
	salva: function(){
		var pBinds = new Array();
		var statement;
		
		//modifica
		if (typeof(document.EXTERN.REPARTO)!='undefined'){
			
			statement='modificaReparto';
			
			pBinds.push($('#txtCodInterno').val());
			pBinds.push($('#txtDescr').val());
			pBinds.push($('INPUT[name=radAttivo]:checked').val());
			pBinds.push($('INPUT[name=radAbilitaCons]:checked').val());
		}
		//inserimento
		else{
			
			statement='inserisciReparto';
		
			pBinds.push($('SELECT[name=cmbStruttura]').val());
			pBinds.push($('SELECT[name=cmbCodStruttura]').val());
			pBinds.push($('#txtCodPresidio').val());
			pBinds.push($('#txtSubCodStruttura').val())
			pBinds.push($('SELECT[name=cmbTipologia]').val());
			pBinds.push($('#txtCodSezione').val());
			pBinds.push($('#txtSubCodSezione').val());
			pBinds.push($('#txtCodProgressivo').val());
			pBinds.push($('#txtCodInterno').val());
			pBinds.push($('#txtDescr').val());
			pBinds.push($('INPUT[name=radAttivo]:checked').val());
			pBinds.push($('INPUT[name=radAbilitaCons]:checked').val());
			pBinds.push($('#txtCodLabo').val());
			pBinds.push($('#txtCodFarma').val());
			pBinds.push($('#txtCodParifica').val());
			pBinds.push($('SELECT[name=cmbCodAreaFunz]').val());
			pBinds.push($('#txtCodSts11').val());
		
		}
		
		for (var i in pBinds) {
			if(pBinds[i]==''){
				return alert('Attenzione, compilare tutti i campi');
			}
		}
		
	    var resp=WindowCartella.executeStatement('configurazioni/confReparto.xml',statement,pBinds,1);

	    if (resp[0]=="OK"){
	    	if(resp[2]!=' '){
	    		alert(resp[2]);
	    	}
	    	else{
	    		REPARTO.chiudi();
	    		$('iframe#oIFWk',parent.document)[0].contentWindow.location.reload();
	    	}
	    } else{
	    	return alert(resp[0] +" "+ resp[1]);
	    }
	
	},
	
	chiudi: function(){
		parent.$.fancybox.close();
	}
};