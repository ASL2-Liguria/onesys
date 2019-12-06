jg_ora = null;
jg_minuto = null;
moveOre =true;
moveMinuti = false;

function setOra(isOra,id,lunghezza,colore,spessore,step)
{
	if (isOra){if (jg_ora==null)jg_ora = new jsGraphics("orologio");else jg_ora.clear();}
	else{if (jg_minuto==null)jg_minuto = new jsGraphics("orologio");else jg_minuto.clear();}	



	Cx = event.clientX - document.all.orologioContent.offsetLeft -50 - document.body.scrollLeft;  //cateto in ascissa
	Cy = 50-(event.clientY-document.all.orologioContent.offsetTop )- document.body.scrollTop;  //cateto in ordinata
	
	I = Math.sqrt((Cx*Cx)+(Cy*Cy)); //ipotenusa
	rapporto_cateto_ipotenusa=Cx/I;
	
	if (Cx>=0 && Cy>=0)
		angolo=Math.asin(rapporto_cateto_ipotenusa); //angolo al centro rispetto alla verticale;
	else if (Cx>=0 && Cy<0)
		angolo=(Math.PI/2) + Math.acos(rapporto_cateto_ipotenusa);
	else if (Cx<0 && Cy<0)
		angolo=(Math.PI/2) + Math.acos(rapporto_cateto_ipotenusa);	
	else if (Cx<0 && Cy>=0)
		angolo=(2*Math.PI) + Math.asin(rapporto_cateto_ipotenusa);		

	angolo_gradi = angolo*360/(2*Math.PI);
	
	if(isOra)jg_ora.setColor(colore);else jg_minuto.setColor(colore);
	if(isOra)jg_ora.setStroke(spessore);else jg_minuto.setStroke(spessore);
	if(isOra)jg_ora.drawLine(50, 50, 50+(Math.sin(angolo)*lunghezza),50-(Math.cos(angolo)*lunghezza)); else jg_minuto.drawLine(50, 50, 50+(Math.sin(angolo)*lunghezza),50-(Math.cos(angolo)*lunghezza));
	if(isOra)jg_ora.paint();else jg_minuto.paint();

	ora =0;
	ora_descr ='00';

		for (i=15;i<=345;i=i+30)
		{
			ora_descr = '0' + ora;
			ora_descr= ora_descr.substring(ora_descr.length-2,ora_descr.length);
			if(angolo_gradi>345){document.all[id].innerText = ora_descr;return;}
			if (angolo_gradi<i){document.all[id].innerText = ora_descr;return;}
			ora=ora+step;
		}

//document.all.ora2set.innerText =Cx;
//document.all.minuto2set.innerText = Cy;
}
function apriOrologio(myId){
	if (jg_ora!=null)jg_ora.clear();if (jg_minuto!=null)jg_minuto.clear();		
	moveOre=true;moveMinuti=false;	
	
	document.all.ora2set.innerText='00';
	document.all.minuto2set.innerText='00';
	
	document.all.orologio.id2set=myId;
	document.all.orologio.onmousemove= function(){setOra(true,'ora2set',30,'black',3,1);};
	
	
	
	if (event.clientY+document.all.orologioContent.scrollHeight-5<= document.body.offsetHeight)
		document.all.orologioContent.style.top=event.clientY-5+document.body.scrollTop;
	else
		document.all.orologioContent.style.top=document.body.offsetHeight-document.all.orologioContent.scrollHeight+document.body.scrollTop-5;
	
	if (event.clientX+document.all.orologioContent.scrollWidth-5<= document.body.offsetWidth)
		document.all.orologioContent.style.left=event.clientX-5;
	else
		document.all.orologioContent.style.left=document.body.offsetWidth-document.all.orologioContent.scrollWidth+document.body.scrollLeft-5;
	//alert(document.body.offsetHeight);
	//alert(event.clientY+document.all.orologioContent.scrollHeight-5);	
	document.all.orologioContent.style.display='block';
}
function removeMove(){
	if (moveOre)
	{
		document.all.orologio.onmousemove= function(){setOra(false,'minuto2set',40,'black',2,5);};
		moveOre=false;
		moveMinuti=true;		
		return;
	}
	if (moveMinuti)
	{	
		document.all.orologio.onmousemove= function(){};
		moveOre=false;
		moveMinuti=false;
		return;
	}	
	if (!moveOre && !moveMinuti)
	{
		document.all.orologio.onmousemove= function(){setOra(true,'ora2set',30,'black',3,1);};
		moveOre=true;
		moveMinuti=false;
		return;		
	}
}
function imposta(offSet){
	result = '0' + (parseInt(document.all.ora2set.innerText, 10)+offSet) + ':' + document.all.minuto2set.innerText;
	result= result.substring(result.length-5,result.length);
	document.all[document.all.orologio.id2set].value=result;
	document.all[document.all.orologio.id2set].focus();
	document.all[document.all.orologio.id2set].blur();
	document.all.orologioContent.style.display='none';
}
function chiudi_orologio()
{
	document.all.orologioContent.style.display='none';
}
function creaOrologio(){
	var divContenitore = document.createElement("div");
	divContenitore.id = "orologioContent";
	
		var divOrologio = document.createElement("div");
		divOrologio.id = "orologio";
		divOrologio.onclick = function(){removeMove();};
		divOrologio.ondblclick = function(){imposta(0);};
		divOrologio.oncontextmenu = function(){imposta(12);return false;};
		
	divContenitore.appendChild(divOrologio);
	
		var divButton = document.createElement("div");
		
			var lblOra = document.createElement("label");
			lblOra.id = "ora2set";
	
		divButton.appendChild(lblOra);
		
			var lblDivisore = document.createElement("label");
			lblDivisore.id = "divisione";
			lblDivisore.innerText = ":";
			
		divButton.appendChild(lblDivisore);			
		
			var lblMinuti = document.createElement("label");
			lblMinuti.id = "minuto2set";
			
		divButton.appendChild(lblMinuti);
		
			var buttonAM = document.createElement("label");
			buttonAM.id = "AM";
			buttonAM.innerText = "AM";
			buttonAM.onclick = function(){imposta(0);};
			
		divButton.appendChild(buttonAM);			
			
			var buttonPM = document.createElement("label");			
			buttonPM.id = "PM";
			buttonPM.innerText = "PM";			
			buttonPM.onclick = function(){imposta(12);};
			
		divButton.appendChild(buttonPM);	
	
	divContenitore.appendChild(divButton);
	
	document.body.appendChild(divContenitore);
}

function controllaOra(){
	
	var ora=document.getElementById('txtProva').value;
	
	if (ora.substring(0,2)){
		
		
	
	}
	
}