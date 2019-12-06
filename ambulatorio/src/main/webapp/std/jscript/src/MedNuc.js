// JavaScript Document
function cal(){
	window.open("calendario.html","Calendario","WIDTH=250, HEIGHT=250");

}
function cal2(){
	window.open("calendario2.html","Calendario","WIDTH=250, HEIGHT=250");

}

function AggQuantita_reale(){
	if (document.all.quantNom.value=='' || document.all.periodoPreparatura.value=='')
		{
		return;	}
		
	else	
	{//alert((document.all.periodoPreparatura.value/109.77))
	
	document.all.quantReale.value=document.all.quantNom.value*(Math.exp(Math.LN2 * (document.all.periodoPreparatura.value/109.77)));}
}
//=C39*EXP(LN(2)*(B39-$G$38)*24*60/109,77)
function Agghiddenparz(campo,campoda2,campoda1){
	
	if (campoda1.value=='' || campoda2.value=='')
		{//alert('campo Vuoto');
		return;	}
		
	else	
{	
	var a=0;
	orada=campoda2.value.split(":");
	ora=campoda2.value.split(":");
	var minpass=0;
	minpass=orada[1];
	minpass=difOra(campoda2,oraPri);
	//alert(minpass);
	//alert(campoda2.value);
	campo.value=campoda1.value*(Math.exp(Math.LN2*(minpass/109.77)));
	//alert(campo.value);
	document.all.MBq.value=parseInt(document.all.h1.value)+parseInt(document.all.h2.value)+parseInt(document.all.h3.value)+parseInt(document.all.h4.value)+parseInt(document.all.h5.value)+parseInt(document.all.h6.value)+parseInt(document.all.h7.value)+parseInt(document.all.h8.value)+parseInt(document.all.h9.value)+parseInt(document.all.h10.value)+parseInt(document.all.h11.value)+parseInt(document.all.h12.value)+parseInt(document.all.h13.value);
	document.all.mCi.value=parseInt(document.all.MBq.value/37);
	document.all.quantNom.value=document.all.mCi.value;
	AggQuantita_reale();
	//+h2.value+h3.value+h4.value+h5.value+h6.value+h7.value+h8.value+h9.value+h10.value+h11.value+h12.value+h13.value+h14.value+h15.value+.valueh16
	}
}
function cambiaOraPrinc(){
Agghiddenparz(h1,ora1,att1);
Agghiddenparz(h2,ora12,att2);
Agghiddenparz(h3,ora3,att3);
Agghiddenparz(h4,ora4,att4);
Agghiddenparz(h5,ora5,att5);
Agghiddenparz(h6,ora6,att6);
Agghiddenparz(h7,ora7,att7);
Agghiddenparz(h8,ora8,att8);
Agghiddenparz(h9,ora9,att9);
Agghiddenparz(h10,ora10,att10);
Agghiddenparz(h11,ora11,att11);
Agghiddenparz(h12,ora12,att12);
Agghiddenparz(h13,ora13,att13);
//Agghiddenparz(h14,ora14,att14);
//Agghiddenparz(h15,ora15,att15);
//Agghiddenparz(h16,ora16,att16);
document.all.mCi.value=document.all.MBq.value/37;
}
function difOra(oraFrom,oraTo){
	//alert(oraTo.value);
	orada=oraFrom.value.split(":");
	ora=oraTo.value.split(":");
	num=(orada[0]-ora[0])*60+parseInt(orada[1]-ora[1]);
	//alert(num);
	return num;
	}
function difOra2(oraFrom,oraTo){
	//alert(oraTo.value);
	orada=oraFrom.value.split(":");
	ora=oraTo.split(":");
	num=(orada[0]-ora[0])*60+parseInt(orada[1]-ora[1]);
	//alert(num);
	return num;
	}

function ricalFirst(){

if (as1.value!=0){
	rs1.value=37;
}
if (rs1.value!=0 && as1.value!=0)
	 //G3*EXP(-LN(2)*(B5-D3)*24*60/109,77))
	 {	//alert(attIni.value);
	 	//alert(Math.exp((0-1)*(Math.LN2* (difOra(oraini1,oraPri)/109.77))));
		ad1.value=parseInt(attIni.value*Math.exp((0-1)*(Math.LN2* (difOra(oraini1,oraPri)/109.77))));		
	  ar1.value=parseInt(ad1.value-as1.value);
	  arl1.value=parseInt(as1.value*0.3);
	 
	 }
}

function ricalOther(num,doc){
//(campooi,campooi0,campoad,campoas,campoar,campoar0,campoarl,campoarl0,campors,campors0){
//oraini2,oraini1,ad2,as2,ar2,ar1,arl2,arl1,rs2,rs1
//oraini2,oraini1,ad2,as2,ar2,ar1,arl2,arl1,rs2,rs1

//(num);
//alert(doc);
campooi=document.getElementById("oraini"+num);
//alert("oraini"+num);
campooi0=document.getElementById("oraini"+(num-1));                  
campoad=document.getElementById("ad"+num);
cippa=document.getElementById("as"+num);
campoas=document.getElementById("as"+num);
campoar=document.getElementById("ar"+num);
campoar0=document.getElementById("ar"+(num-1));
campoarl=document.getElementById("arl"+num);
campoarl0=document.getElementById("arl"+(num-1));
campors=document.getElementById("rs"+num);
campors0=document.getElementById("rs"+(num-1));

if (campooi.value!=0 ){
	campors.value=parseInt(campors0.value*Math.exp((0-1)*(Math.LN2* (difOra(campooi,campooi0)/109.77))))+38;	
}
if (campors.value!=0 && campoas.value!=0)
	 //F5*EXP(-LN(2)*24*60*(B6-B5)/109,77)+D6*0,3)
	 {	//alert(campooi.value);
	 //alert(campooi0.value);
	 //alert(campoar0.value);
	 	//alert(Math.exp((0-1)*(Math.LN2* (difOra(oraini1,oraPri)/109.77))));
		campoad.value=parseInt(campoar0.value*Math.exp((0-1)*(Math.LN2* (difOra(campooi,campooi0)/109.77))));		
	  campoar.value=parseInt(campoad.value-campoas.value);
	  if (campoar.value<0)
	  {campoar.value=0;}
	  //alert(campoarl0.value*Math.exp((0-1)*Math.LN2* (difOra(campooi,campooi0)/109.77))+campoas.value*0.3);
	  campoarl.value=parseInt(campoarl0.value*Math.exp((0-1)*Math.LN2* (difOra(campooi,campooi0)/109.77))+campoas.value*0.3);
	 
	 }
}

function ricalAll(doc){
ricalFirst();
for (i=2; i<=13; i++){
ricalOther(i,doc);
} 
}
function findMax(campo){
myMax=document.getElementById(campo+"1").value;

for (i=2; i<=13; i++){
	cam=document.getElementById(campo+i);
	a=parseInt(cam.value);
	if (a>myMax){
		myMax=a;
	}
}
return myMax;
} 

function findMaxOra(campo){
myMax=document.getElementById(campo+"1").value;

for (i=2; i<=13; i++){
	if (document.getElementById(campo+i).value>myMax){
		myMax=document.getElementById(campo+i).value;
	}
}
return myMax;
} 


function findMin(campo){
	myMin=document.getElementById(campo+"1").value;
	i=0;
	for (i=2; i<=13; i++)
	{//alert("a"+document.getElementById("as1").value1);
		as=document.getElementById("as"+i);
		cam=document.getElementById(campo+i);
		a=parseInt(as.value);
		if (a>1){
			if (cam.value<myMin){
				myMin=cam.value;
			}
		}
	}
	//alert("b"+myMin);}}
	return myMin;
} 
//=SE(B29;(MAX(G5:G24)+MIN(E5:E24))*EXP(-LN(2)*24*60*(B29-(MAX(B5:B24)))/109,77);" ")
//;MAX(F5:F24)*EXP(-LN(2)*24*60*(B29-(MAX(B5:B24)))/109,77)
function AggCalcRif(){
//alert(oraRit.value);
if (oraRit.value!='')
{oraMax=findMaxOra("oraini");
//alert(findMax("rs")+findMin("ar"));
//alert(Math.exp( (0-1) * Math.LN2 * ((difOra2(oraRit,oraMax))/109.77) ));
residSol.value=parseInt((parseInt(findMax("rs"))+parseInt(findMin("ar"))) * Math.exp( (0-1) * Math.LN2 * ((difOra2(oraRit,oraMax))/109.77) ));
residLiq.value=parseInt(parseInt(findMax("arl")) * Math.exp( (0-1) * Math.LN2 * ((difOra2(oraRit,oraMax))/109.77) ));}
else 
{return;}
} 