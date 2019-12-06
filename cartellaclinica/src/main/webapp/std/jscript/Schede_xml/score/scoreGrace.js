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

    WindowCartella.utilMostraBoxAttesa(false);

	if (_STATO_PAGINA == 'L'){
		document.getElementById('lblRegistra').parentElement.style.display = 'none';
	}
	$('.classTdLabelLink').css('width','300px');

	// Disabilito il Totale dello Score
	document.getElementById('txtGraceProbability').disabled = true;
	document.getElementById('txtGraceScore').disabled = true;
	

	
});

var NS_CONTROLS = {
	
	checkEta:function() {

		var eta = $('#txtGraceDom4').val();
		if (isNaN(eta)){
			alert('l\'eta\' inserita non corrisponde ad un numero!');
			return false;
		}

		if(eta > 110 || eta < 1){
			alert('L\' eta inserita (' + eta + ') non e\' valida!');
			return false;
		}
		return eta;
	},
	checkBPS:function() {
		var prex = $('#txtGraceDom6').val();
		if(prex > 500 || prex < 30){
			alert('La Pressione Sistolica inserita (' + prex + ') non e\' valida!');
			return false;
		}
		else
			return prex;
	},
	checkNumber:function(param){
		if (isNaN(param))
			return false;
		else
			return param;
	}
};

var NS_CALCOLO_GRACE = {
	
	calcolaScore:function(){
		var globalScore;
		var probability;
		var eta			= NS_CALCOLO_GRACE.getEtaPoints();
		var pulsazioni 	= NS_CALCOLO_GRACE.getPulsazioniPoints();
		var bps			= NS_CALCOLO_GRACE.getPSistolicaPoints();
		var creatinina	= NS_CALCOLO_GRACE.getCreatininaPoints();
		var killipClass	= NS_CALCOLO_GRACE.getKillipClassPoints();
		var arrestoCard	= NS_CALCOLO_GRACE.getArrestoCardiacoPoints();
		var enzimi		= NS_CALCOLO_GRACE.getEnzimiPoints();
		var ekg			= NS_CALCOLO_GRACE.getEKGPoints();
		if(baseUser.LOGIN == 'usrradiologi' || baseUser.LOGIN == 'arry'){
			alert('ALERT SOLO PER AMMINISTRATORI! \n- USER: '+ baseUser.LOGIN + '\n- ETA: ' + eta + '\n - PULSAZIONI: ' + pulsazioni + '\n - BPS: ' + bps + '\n - CREATININA: ' + creatinina + '\n  - KILLIP CLASS: ' +	killipClass + '\n - ARRESTO CARDIACO: ' + arrestoCard + '\n - ENZIMI: ' + enzimi + '\n - EKG: ' + ekg + '\n - TOTALE: ' + (killipClass + bps + pulsazioni + eta + creatinina + ekg + enzimi + arrestoCard));
		}
		globalScore		= killipClass + bps + pulsazioni + eta + creatinina + (17*ekg) + (13*enzimi) + (30*arrestoCard);
		globalScore	= (Math.round(globalScore*100)/100);
		//alert('SCORE TOTALE: ' + globalScore);
		probability		= NS_CALCOLO_GRACE.getProbabilityOfDeath(globalScore)
		//alert('PROBABILITA: ' + probability + '%');
		$('#txtGraceScore').val(globalScore);
		$('#txtGraceProbability').val(probability+'%');
	},
	getEtaPoints:function(){
		var eta 	= NS_CONTROLS.checkEta();
		if (!eta)
			return false;
		
		eta			= parseInt(eta);
		var etaPt	= 0;
		
		if (eta > 0 && eta < 35)
			etaPt	= 0;
		else if (eta >= 35 && eta < 45)
			etaPt	= 0 + (eta-35)*(1.8);
		else if(eta >= 45 && eta < 55)
			etaPt	= 18 + (eta-45)*(1.8);
		else if(eta >= 55 && eta < 65)
			etaPt	= 36 + (eta-55)*(1.8);
		else if(eta >= 65 && eta < 75)
			etaPt	= 54 + (eta-65)*(1.9);
		else if(eta >= 75 && eta < 85)
			etaPt	= 73 + (eta-75)*(1.8);
		else if(eta >= 85 && eta < 90)
			etaPt	= 91 + (eta-85)*(1.8);
		else if(eta >= 90)
			etaPt	= 100;
		
		etaPt	= (Math.round(etaPt*100)/100);
		//alert('ETA: ' + etaPt);
		return etaPt;
		
	},
	getPulsazioniPoints:function(){
		var pulse	= $('#txtGraceDom5').val();
		var pulsePt	= 0;
		pulse		= NS_CONTROLS.checkNumber(pulse);
		
		if (!pulse)
			return false;
		
		pulse		= parseInt(pulse);
		
		if (pulse < 70)
			pulsePt = 0;
		else if (pulse >= 70 && pulse < 80)
			pulsePt	= 0 + (pulse-70); 
		else if (pulse >= 80 && pulse < 90)
			pulsePt	= 3 + (pulse-80);
		else if (pulse >= 90 && pulse < 100)
			pulsePt	= 5 + (pulse-90);
		else if (pulse >= 100 && pulse < 110)
			pulsePt	= 8 + (pulse-100);
		else if (pulse >= 110 && pulse < 150)
			pulsePt	= 10 + (pulse-110);
		else if (pulse >= 150 && pulse < 200)
			pulsePt	= 22 + (pulse-150);
		else if (pulse >= 200)
			pulsePt	= 34;
		
		pulsePt	= (Math.round(pulsePt*100)/100);
		
		//alert('PULSAZIONI: ' + pulsePt)
		return pulsePt;
		
	},
	getPSistolicaPoints:function(){	
		
		var BPS		= NS_CONTROLS.checkBPS();
		var BPSPt	= 0;
		
		if (!BPS)
			return false;
		
		BPS		= parseInt(BPS);

		if(BPS >= 0 && BPS < 80){
			BPSPt	= 40;
		}else if (BPS >= 80 && BPS < 100){
			BPSPt	= 40 - (BPS - 80)*0.3;
		}else if(BPS >= 100 && BPS < 110){
			BPSPt	= 34 - (BPS - 100)*0.3;
		}else if(BPS >= 110 && BPS < 120){
			BPSPt	= 31 - (BPS - 110)*0.4;
		}else if(BPS >= 120 && BPS < 130){
			BPSPt	= 27 - (BPS - 120)*0.3;
		}else if(BPS >= 130 && BPS < 140){
			BPSPt	= 24 - (BPS - 130)*0.3;
		}else if(BPS >= 140 && BPS < 150){
			BPSPt	= 20 - (BPS - 140)*0.4;
		}else if(BPS >= 150 && BPS < 160){
			BPSPt	= 17 - (BPS - 150)*0.3;
		}else if(BPS >= 160 && BPS < 180){
			BPSPt	= 14 - (BPS - 160)*0.3;
		}else if(BPS >= 180 && BPS < 200){
			BPSPt	= 8 - (BPS - 180)*0.4;
		}else if(BPS >= 200){
			BPSPt	= 0;
		}
		BPSPt	= (Math.round(BPSPt*100)/100);
		//alert('SISTOLICA: ' + BPSPt);
		return BPSPt;
		
	},
	getCreatininaPoints:function(){
		var creat	= $('#txtGraceDom7').val();
		var creatPt	= 0;

		creat		= NS_CONTROLS.checkNumber(creat);
		
		if (!creat)
			return false;

		if (creat < 0.2)
			creatPt = 0 + (creat-0)*(1/0.2);
		else if (creat >= 0.2 && creat < 0.4)
			creatPt = 1 + (creat-0.2)*(2/0.2); 
		else if (creat >= 0.4 && creat < 0.6)
			creatPt = 3 + (creat-0.4)*(1/0.2);
		else if (creat >= 0.6 && creat < 0.8)
			creatPt = 4 + (creat-0.6)*(2/0.2);
		else if (creat >= 0.8 && creat < 1.0)
			creatPt = 6 + (creat-0.8)*(1/0.2);
		else if (creat >= 1 && creat < 1.2)
			creatPt = 7 + (creat-1.0)*(1/0.2);			
		else if (creat >= 1.2 && creat < 1.4)
			creatPt = 8 + (creat-1.2)*(2/0.2);
		else if (creat >= 1.4 && creat < 1.6)
			creatPt = 10 + (creat-1.4)*(1/0.2);
		else if (creat >= 1.6 && creat < 1.8)
			creatPt = 11 + (creat-1.6)*(2/0.2);
		else if (creat >= 1.8 && creat < 2.0)
			creatPt = 13 + (creat-1.8)*(1/0.2);
		else if (creat >= 2.0 && creat < 3.0)
			creatPt = 14 + (creat-2.0)*(7/1);
		else if (creat >= 3.0 && creat < 4.0)
			creatPt = 21 + (creat-3.0)*(7/1);
		else if (creat >= 4.0)
			creatPt = 28;
		
		creatPt	= (Math.round(creatPt*100)/100);
		//alert('CREATININA: '+ (Math.round(creatPt*100)/100));
		
		return creatPt;
	},
	getKillipClassPoints:function(){
		var radKillipClass	= document.getElementsByName('chkGraceDom8');
		var codKillipClass	= '';
		var killipClassPt	= 0;
		for (var i = 0; i < 4; i++)
		{
			if (radKillipClass[i].checked)
				codKillipClass	= radKillipClass[i].value; 
		}
		codKillipClass	= codKillipClass.substring(2, 3);

		switch (codKillipClass){
		case '1' :
			killipClassPt	= 0;
			break;
		case '2' :
			killipClassPt	= 15;
			break;
		case '3' :
			killipClassPt	= 29;
			break;
		case '4' :
			killipClassPt	= 44;
			break;
		}
		//alert('KILLIP CLASS: '+ killipClassPt);		
		return killipClassPt;
	},
	getArrestoCardiacoPoints:function(){
		var radArrCardiaco	= document.getElementsByName('chkGraceDom1');
		var arrCardiacoPt	= 0;
		for (var i = 0; i < 2; i++)
		{
			if (radArrCardiaco[i].checked)
			{
				if(radArrCardiaco[i].value == 621){
					arrCardiacoPt	= 1;
				}
			}
		}
		//alert('ARRESTO CARDIACO: ' + arrCardiacoPt);
		return arrCardiacoPt;
	},
	getEnzimiPoints:function(){
		var radEnzimi	= document.getElementsByName('chkGraceDom3');
		var enzimiPt	= 0;
		for (var i = 0; i < 2; i++)
		{
			if (radEnzimi[i].checked)
			{
				if(radEnzimi[i].value == 621){
					enzimiPt	= 1;
				}
			}
		}
		//alert('ENZIMI CARDIACI: ' + enzimiPt);
		return enzimiPt;
	},
	getEKGPoints:function(){
		var radEKG	= document.getElementsByName('chkGraceDom2');
		var EKGPt	= 0;
		for (var i = 0; i < 2; i++)
		{
			if (radEKG[i].checked)
			{
				if(radEKG[i].value == 621){
					EKGPt	= 1;
				}
			}
		}
		//alert('EKG: ' + EKGPt);
		return EKGPt;
	},
	getProbabilityOfDeath:function(score){
		var percentuale 	= 0;
		if(score >= 6 && score < 27){
			percentuale 	= 0.2;
		}else if(score >= 27 && score < 39){
			percentuale 	= 0.4;
		}else if(score >= 39 && score < 48){
			percentuale 	= 0.6;
		}else if(score >= 48 && score < 55){
			percentuale 	= 0.8;
		}else if(score >= 55 && score < 60){
			percentuale 	= 1.;
		}else if(score >= 60 && score < 65){
			percentuale 	= 1.2;
		}else if(score >= 65 && score < 69){
			percentuale 	= 1.4;
		}else if(score >= 69 && score < 73){
			percentuale 	= 1.6;
		}else if(score >= 73 && score < 76){	
			percentuale 	= 1.8;
		}else if(score >= 76 && score < 88){
			percentuale 	= 2;
		}else if(score >= 88 && score < 97){
			percentuale 	= 3;
		}else if(score >= 97 && score < 104){
			percentuale 	= 4;
		}else if(score >= 104 && score < 110){
			percentuale 	= 5;
		}else if(score >= 110 && score < 115){	
			percentuale 	= 6;
		}else if(score >= 115 && score < 119){
			percentuale 	= 7;
		}else if(score >= 119 && score < 123){
			percentuale 	= 8;
		}else if(score >= 123 && score < 126){
			percentuale 	= 9;
		}else if(score >= 126 && score < 129){
			percentuale 	= 10;
		}else if(score >= 129 && score < 132){	
			percentuale 	= 11;
		}else if(score >= 132 && score < 134){
			percentuale 	= 12;
		}else if(score >= 134 && score < 137){
			percentuale 	= 13;
		}else if(score >= 137 && score < 139){
			percentuale 	= 14;
		}else if(score >= 139 && score < 141){	
			percentuale 	= 15;
		}else if(score >= 141 && score < 143){
			percentuale 	= 16;
		}else if(score >= 143 && score < 145){
			percentuale 	= 17;
		}else if(score >= 145 && score < 147){
			percentuale 	= 18;
		}else if(score >= 147 && score < 149){
			percentuale 	= 19;
		}else if(score >= 149 && score < 150){
			percentuale 	= 20;
		}else if(score >= 150 && score < 152){
			percentuale 	= 21;
		}else if(score >= 152 && score < 153){
			percentuale 	= 22;
		}else if(score >= 153 && score < 155){
			percentuale 	= 23;
		}else if(score >= 155 && score < 156){
			percentuale 	= 24;
		}else if(score >= 156 && score < 158){
			percentuale 	= 25;
		}else if(score >= 158 && score < 159){
			percentuale 	= 26;
		}else if(score >= 159 && score < 160){
			percentuale 	= 27;
		}else if(score >= 160 && score < 162){
			percentuale 	= 28;
		}else if(score >= 162 && score < 163){
			percentuale 	= 29;
		}else if(score >= 163 && score < 174){
			percentuale 	= 30;
		}else if(score >= 174 && score < 183){
			percentuale 	= 40;
		}else if(score >= 183 && score < 191){
			percentuale 	= 50;
		}else if(score >= 191 && score < 200){
			percentuale 	= 60;
		}else if(score >= 200 && score < 208){
			percentuale 	= 70;
		}else if(score >= 208 && score < 219){
			percentuale 	= 80;
		}else if(score >= 219 && score < 285){
			percentuale 	= 90;
		}else if(score >= 285){
			percentuale 	= 99;
		}			
			
			return percentuale;		
	}

};