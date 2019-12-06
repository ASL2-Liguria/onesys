$(document).ready(function(){
	gestioneDao.init();
	gestioneDao.setEvents();
});


var gestioneDao = {
	
	objQuery:opener.opener.opener.top,

	init:function(){
		alert($('#idenReferto').val());
		var rs = gestioneDao.objQuery.executeQuery('firmaSiss.xml','siss.getOscuramentoAutorizzazioneNote',[$('#idenReferto').val()],1);
		if( rs.next()){
			rs.getString("AUTORIZZAZIONE")=='1'?$('input[name="Autorizzazione"]').attr('checked', true):$('input[name="Autorizzazione"]').attr('checked', false);  			
			rs.getString("OSCURAMENTO1")=='1'?$('input[name="oscCitta"]').attr('checked', true):$('input[name="oscCitta"]').attr('checked', false);  			
			rs.getString("OSCURAMENTO2")=='1'?$('input[name="oscHIV"]').attr('checked', true):$('input[name="oscHIV"]').attr('checked', false);  			
			rs.getString("OSCURAMENTO3")=='1'?$('input[name="oscVio"]').attr('checked', true):$('input[name="oscVio"]').attr('checked', false);  			
			rs.getString("OSCURAMENTO4")=='1'?$('input[name="oscGra"]').attr('checked', true):$('input[name="oscGra"]').attr('checked', false);    		
			rs.getString("OSCURAMENTO5")=='1'?$('input[name="oscTos"]').attr('checked', true):$('input[name="oscTos"]').attr('checked', false);    		
			rs.getString("NOTE_REPERIBILITA")==''?$('input[name="txtArea"]').text(''):$('input[name="txtArea"]').text(rs.getString("NOTE_REPERIBILITA")); 
		}		
	},
	
	setEvents:function(){
		$('#btRegistra').click(function() { 
			gestioneDao.registraDao(); 
		});
		$('#btChiudi').click(function() { 
			gestioneDao.closeDao(); 
		});
	},
	
	registraDao:function(){
					
		var arrayOscuramento = new Array;
		arrayOscuramento.push($('input[name="oscCitta"]').is(':checked')==true?'1':'0');
		arrayOscuramento.push($('input[name="oscHIV"]').is(':checked')==true?'1':'0');
		arrayOscuramento.push($('input[name="oscVio"]').is(':checked')==true?'1':'0');
		arrayOscuramento.push($('input[name="oscGra"]').is(':checked')==true?'1':'0');
		arrayOscuramento.push($('input[name="oscTos"]').is(':checked')==true?'1':'0');
		arrayOscuramento.push($('input[name="Autorizzazione"]').is(':checked')==true?'1':'0');
		arrayOscuramento.push($('input[name="txtArea"]').text());
		arrayOscuramento.push($('#idenReferto').val());	
		
		var rs = gestioneDao.objQuery.executeStatement('firmaSiss.xml','siss.setOscuramentoAutorizzazioneNote',arrayOscuramento,0);
		if (rs[0]=='OK')
		{
			alert('Registrazione DAO effettuata con successo');
		}else{
			alert('Registrazione DAO non avvenuta:'+rs[1]);
		}
	
	
	},
	
	closeDao:function(){
		self.close();	
	}
}