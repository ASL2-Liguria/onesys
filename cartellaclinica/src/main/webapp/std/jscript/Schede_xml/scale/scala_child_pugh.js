var WindowCartella = null;

jQuery(document).ready(function(){
    window.WindowCartella = window;
    while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
        window.WindowCartella = window.WindowCartella.parent;
    }
    WindowCartella.utilMostraBoxAttesa(false);
	NS_SCALA_CHILD_PUGH.init();
	if (_STATO_PAGINA == 'L'){		
        document.getElementById('lblRegistra').parentElement.parentElement.style.display = 'none';
    }
    NS_SCALA_CHILD_PUGH.setEvents();
    infoScalaChildPugh.init();
});
var somma;

var NS_SCALA_CHILD_PUGH = {
		init: function(){
			setRadioResettable();
			$('#lblLegenda').parent().removeClass('classTdLabelLink').addClass('tdClass classTdLabel').append($('<div></div>').addClass('Link'));
		},
		setEvents:function(){
			$("input[name='radioEncefalopatia']").click(function(){
				NS_SCALA_CHILD_PUGH.calcolaTotale();
			});
			$("input[name='radioBilirubina']").click(function(){
				NS_SCALA_CHILD_PUGH.calcolaTotale();
			});
			$("input[name='radioAscite']").click(function(){
				NS_SCALA_CHILD_PUGH.calcolaTotale();
			});
			$("input[name='radioINR']").click(function(){
				NS_SCALA_CHILD_PUGH.calcolaTotale();
			});
			$("input[name='radioAlbumina']").click(function(){
				NS_SCALA_CHILD_PUGH.calcolaTotale();
			});
			$("#txtBilirubina").keyup(function(){
				var valore=$("#txtBilirubina").val();
				valore = valore.replace(',','.');
				var v = parseFloat(valore);			
				if (!isNaN(v)){
					if (v < 2){setCheckedCampo(document.getElementById('radioBilirubina').getAttribute("name"), 0);}
					else if ((2 <= v) && (v <= 3)){setCheckedCampo(document.getElementById('radioBilirubina').getAttribute("name"), 1);}
					else {setCheckedCampo(document.getElementById('radioBilirubina').getAttribute("name"), 2);}
				}
			});
			$("#txtAlbumina").keyup(function(){
				var valore=$("#txtAlbumina").val();
				valore = valore.replace(',','.');
				var v = parseFloat(valore);			
				if (!isNaN(v)){
					if (v > 3.5){setCheckedCampo(document.getElementById('radioAlbumina').getAttribute("name"), 0);}
					else if ((2.8 <= v) && (v <= 3.5)){setCheckedCampo(document.getElementById('radioAlbumina').getAttribute("name"), 1);}
					else {setCheckedCampo(document.getElementById('radioAlbumina').getAttribute("name"), 2);}
				}
			});
			$("#txtINR").keyup(function(){
				var valore=$("#txtINR").val();
				valore = valore.replace(',','.');
				var v = parseFloat(valore);			
				if (!isNaN(v)){
					if (v < 1.7){setCheckedCampo(document.getElementById('radioINR').getAttribute("name"), 0);}
					else if ((1.7 <= v) && (v <= 2.3)){setCheckedCampo(document.getElementById('radioINR').getAttribute("name"), 1);}
					else {setCheckedCampo(document.getElementById('radioINR').getAttribute("name"), 2);}
				}
			});
		},
		calcolaTotale: function(){
			somma=0;
			sommaRadioEncefalopatia($("input[name='radioEncefalopatia']"));
			sommaRadio($("input[name='radioAscite']"));
			sommaRadio($("input[name='radioBilirubina']"));
			sommaRadio($("input[name='radioAlbumina']"));
			sommaRadio($("input[name='radioINR']"));
			$("#txtPunteggio").val(somma);
		}
};

function sommaRadio(radio){
	//alert(radio.length);
	for (var i=0; i<radio.length; i++)
		if (radio[i].checked){
			somma +=i+1;
		};		
	}	
function sommaRadioEncefalopatia(radio){
	for (var i=0; i<radio.length; i++){
		if (radio[i].checked){
			if (i==0) {somma +=1;}
			else if (i==1 || i==2){somma +=2;}
			else {somma+=3;}
		};	
	}
}
var infoScalaChildPugh = {
	init: function(){
		$('.Link').live('click',function(){
			infoScalaChildPugh.open();			
	})
	},
	
	open: function(){
		var paramObj = {
				obj:null,
				title:null,
				width:530,
				height:380
		};
		var testoInfo="";
		/*testoInfo += "<b><i>Encefalopatia</b></i><br>No: <span style='color:blue'>1 punto</span> , Grado 1 e 2: <span style='color:blue'>2 punti</span> , Grado 3 e 4: <span style='color:blue'>3 punti</span><br>";
		testoInfo += "<b><i>Ascite</b></i><br>Assente: <span style='color:blue'>1 punto</span>, Lieve: <span style='color:blue'>2 punti</span>, Moderata: <span style='color:blue'>3 punti</span><br>";
		testoInfo += "<b><i>Bilirubina tot.</b></i><br>    <2mg/dl:<span style='color:blue'> 1 punto</span>, 2-3 mg/dl: <span style='color:blue'>2 punti</span>, >3 mg/dl: <span style='color:blue'>3 punti</span><br>";
		testoInfo += "<b><i>Albumina</b></i><br>    >3.5 g/dl :1 punto, 2.8-3.5 g/dl :2 punti, <2.8 g/dl :3 punti<br>"; 
		testoInfo += "<b><i>INR</b></i><br>  <1.7 :1 punto, 1.7-2.3 :2 punti, >2.3 :3 punti<br>";*/
		testoInfo +="<table id='tableInfoChildPugh'>";
		testoInfo +="<tr><td>Encefalopatia</td><td>No: 1 punto</td><td>Grado 1 e 2: 2 punti</td><td>Grado 3 e 4: 3 punti</td></tr>";
		testoInfo +="<tr><td>Ascite</td><td>Assente: 1 punto</td><td>Lieve: 2 punti</td><td>Moderata: 3 punti</td></tr>";
		testoInfo +="<tr><td>Bilirubina tot</td><td><2mg/dl: 1 punto</td><td>2-3 mg/dl: 2 punti</td><td>>3 mg/dl: 3 punti</td></tr>";
		testoInfo +="<tr><td>Albumina</td><td>>3.5 g/dl: 1 punto</td><td>2.8-3.5 g/dl: 2 punti</td><td><2.8 g/dl: 3 punti</td></tr>";
		testoInfo +="<tr><td>INR</td><td><1.7 : 1 punto</td><td>1.7-2.3 : 2 punti</td><td>>2.3 :3 punti</td></tr>";
		testoInfo +="</table>";
		paramObj.obj = $("<p>"+testoInfo+"</p>");
		paramObj.title="Punteggio dell'insufficienza epatica secondo Child-Pugh";
		
		popupinfoScalaChildPugh.append({
				obj:paramObj.obj,
				title:paramObj.title,
				width:paramObj.width,
				height:paramObj.height
			});
		}	
};
var popupinfoScalaChildPugh ={
		append:function(pParam){
			popupinfoScalaChildPugh.remove();
			
			pParam.header = (typeof pParam.header != 'undefined' 	? pParam.header : null);
			pParam.footer = (typeof pParam.footer != 'undefined' 	? pParam.footer : null);
			pParam.title = 	(typeof pParam.title != 'undefined' 	? pParam.title 	: "");
			pParam.width = 	(typeof pParam.width != 'undefined' 	? pParam.width 	: 500);
			pParam.height = (typeof pParam.height != 'undefined' 	? pParam.height : 300);				
			$("body").append(
				$("<div id='divPopUpinfoScalaChildPugh'></div>")
					.css("font-size","12px")
					.append(pParam.header)
					.append(pParam.obj)
					.append(pParam.footer)
					.attr("title",pParam.title)
			);
			
			$("#divPopUpinfoScalaChildPugh").dialog({
				position:	[event.clientX,event.clientY],
				width:		pParam.width,
				height:		pParam.height
			});
	
			popupinfoScalaChildPugh.setRemoveEvents();

		},
	
	remove:function(){
		$('#divPopUpinfoScalaChildPugh').remove();
	},
	
	setRemoveEvents:function(){
		$("body").click(popupinfoScalaChildPugh.remove);
	}
}

