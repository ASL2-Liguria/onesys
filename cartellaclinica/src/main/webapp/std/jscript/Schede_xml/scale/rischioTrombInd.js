
var WindowCartella = null;
jQuery(document).ready(function(){
        window.WindowCartella = window;
        while(window.WindowCartella.name != 'schedaRicovero' && window.WindowCartella.parent != window.WindowCartella){
            window.WindowCartella = window.WindowCartella.parent;
        }


        WindowCartella.utilMostraBoxAttesa(false);
	
	$('#lblLegenda').html('STRATIFICAZIONE DEL RISCHIO/PROFILASSI CONSIGLIABILE <br/> < 2,5 =  BASSO RISCHIO  ->  Nessuna profilassi <br/> > 2,5= ALTO RISCHIO ->  EBPM o FONDAPARIMUX 2,5 mg <br/> >= 4=   -> Considerare l\' aggiunta di MEZZI FISICI (calze antitrombo)');	
//	$('#lblAsterischi').html('* Difetto di antitrombina, proteina C, proteina S, omozigoti per fattore V Leiden o protrombina G20210A o doppia eterozigosi <br/>** Eterozigosi per fattore V Leiden o protrombina G20210A <br/>*** Ventilazione Meccanica Non Invasiva');	
//	$('#lblTrombDom2').html('Trombofilia congenita*');
//	$('#lblTrombDom9').html('Trombofilia congenita eterozigote**');
//	$('#lblTrombDom16').html('Insufficienza respiratoria con NIV***');
	countChecked();	
	
	
	
	initHiddenIndex(document.all.hTrombDom1,document.all.chkTrombDom1);	
	initHiddenIndex(document.all.hTrombDom2,document.all.chkTrombDom2);
	initHiddenIndex(document.all.hTrombDom3,document.all.chkTrombDom3);
	initHiddenIndex(document.all.hTrombDom4,document.all.chkTrombDom4);
	initHiddenIndex(document.all.hTrombDom5,document.all.chkTrombDom5);
	initHiddenIndex(document.all.hTrombDom6,document.all.chkTrombDom6);
	initHiddenIndex(document.all.hTrombDom7,document.all.chkTrombDom7);
	initHiddenIndex(document.all.hTrombDom8,document.all.chkTrombDom8);
	initHiddenIndex(document.all.hTrombDom9,document.all.chkTrombDom9);
	initHiddenIndex(document.all.hTrombDom10,document.all.chkTrombDom10);
	initHiddenIndex(document.all.hTrombDom11,document.all.chkTrombDom11);
	initHiddenIndex(document.all.hTrombDom12,document.all.chkTrombDom12);
	initHiddenIndex(document.all.hTrombDom13,document.all.chkTrombDom13);
	initHiddenIndex(document.all.hTrombDom14,document.all.chkTrombDom14);
	initHiddenIndex(document.all.hTrombDom15,document.all.chkTrombDom15);
	initHiddenIndex(document.all.hTrombDom16,document.all.chkTrombDom16);
	initHiddenIndex(document.all.hTrombDom17,document.all.chkTrombDom17);
	initHiddenIndex(document.all.hTrombDom18,document.all.chkTrombDom18);
	initHiddenIndex(document.all.hTrombDom19,document.all.chkTrombDom19);
	initHiddenIndex(document.all.hTrombDom20,document.all.chkTrombDom20);
	initHiddenIndex(document.all.hTrombDom21,document.all.chkTrombDom21);
	initHiddenIndex(document.all.hTrombDom22,document.all.chkTrombDom22);
		
	$('[name="chkTrombDom1"]').bind('click',function(){
		resetRadio(document.all.hTrombDom1,document.all.chkTrombDom1);
//		countChecked();
		});	
	$('[name="chkTrombDom2"]').bind('click',function(){
		resetRadio(document.all.hTrombDom2,document.all.chkTrombDom2);
		});
	$('[name="chkTrombDom3"]').bind('click',function(){
		resetRadio(document.all.hTrombDom3,document.all.chkTrombDom3);
		});
	$('[name="chkTrombDom4"]').bind('click',function(){
		resetRadio(document.all.hTrombDom4,document.all.chkTrombDom4);
		});
	$('[name="chkTrombDom5"]').bind('click',function(){
		resetRadio(document.all.hTrombDom5,document.all.chkTrombDom5);
		});
	$('[name="chkTrombDom6"]').bind('click',function(){
		resetRadio(document.all.hTrombDom6,document.all.chkTrombDom6);
		});
	$('[name="chkTrombDom7"]').bind('click',function(){
		resetRadio(document.all.hTrombDom7,document.all.chkTrombDom7);
		});
	$('[name="chkTrombDom8"]').bind('click',function(){
		resetRadio(document.all.hTrombDom8,document.all.chkTrombDom8);
		});
	$('[name="chkTrombDom9"]').bind('click',function(){
		resetRadio(document.all.hTrombDom9,document.all.chkTrombDom9);
		});
	$('[name="chkTrombDom10"]').bind('click',function(){
		resetRadio(document.all.hTrombDom10,document.all.chkTrombDom10);
		});
	$('[name="chkTrombDom11"]').bind('click',function(){
		resetRadio(document.all.hTrombDom11,document.all.chkTrombDom11);
		});
	$('[name="chkTrombDom12"]').bind('click',function(){
		resetRadio(document.all.hTrombDom12,document.all.chkTrombDom12);
		});
	$('[name="chkTrombDom13"]').bind('click',function(){
		resetRadio(document.all.hTrombDom13,document.all.chkTrombDom13);
		});
	$('[name="chkTrombDom14"]').bind('click',function(){
		resetRadio(document.all.hTrombDom14,document.all.chkTrombDom14);
		});
	$('[name="chkTrombDom15"]').bind('click',function(){
		resetRadio(document.all.hTrombDom15,document.all.chkTrombDom15);
		});
	$('[name="chkTrombDom16"]').bind('click',function(){
		resetRadio(document.all.hTrombDom16,document.all.chkTrombDom16);
		});
	$('[name="chkTrombDom17"]').bind('click',function(){
		resetRadio(document.all.hTrombDom17,document.all.chkTrombDom17);
		});
	$('[name="chkTrombDom18"]').bind('click',function(){
		resetRadio(document.all.hTrombDom18,document.all.chkTrombDom18);
		});
	$('[name="chkTrombDom19"]').bind('click',function(){
		resetRadio(document.all.hTrombDom19,document.all.chkTrombDom19);
		});
	$('[name="chkTrombDom20"]').bind('click',function(){
		resetRadio(document.all.hTrombDom20,document.all.chkTrombDom20);
		});
	$('[name="chkTrombDom21"]').bind('click',function(){
		resetRadio(document.all.hTrombDom21,document.all.chkTrombDom21);
		});
	$('[name="chkTrombDom22"]').bind('click',function(){
		resetRadio(document.all.hTrombDom22,document.all.chkTrombDom22);
		});
	
	$(':radio').bind('click', function() {
		countChecked();
		}
		);
	

	if (_STATO_PAGINA == 'L'){
		document.getElementById('lblRegistra').parentElement.style.display = 'none';
		document.getElementById('lblChiudi').parentElement.parentElement.style.display = 'none';
	}
	
		}
);


function countChecked(){	
var count=0;
/*var click='N';
if (document.all.chkTrombDom1(1).checked || document.all.chkTrombDom2(1).checked || document.all.chkTrombDom3(1).checked || document.all.chkTrombDom4(1).checked || document.all.chkTrombDom5(1).checked || document.all.chkTrombDom6(1).checked || document.all.chkTrombDom7(1).checked || document.all.chkTrombDom8(1).checked || document.all.chkTrombDom9(1).checked || document.all.chkTrombDom10(1).checked || document.all.chkTrombDom11(1).checked || document.all.chkTrombDom12(1).checked || document.all.chkTrombDom13(1).checked || document.all.chkTrombDom14(1).checked || document.all.chkTrombDom15(1).checked || document.all.chkTrombDom16(1).checked || document.all.chkTrombDom17(1).checked || document.all.chkTrombDom18(1).checked || document.all.chkTrombDom19(1).checked || document.all.chkTrombDom20(1).checked || document.all.chkTrombDom21(1).checked)
	click='S';
*/
		if (document.all.chkTrombDom1(0).checked)
			count+=2;
		if (document.all.chkTrombDom2(0).checked)
			count+=2;
		if (document.all.chkTrombDom3(0).checked)
			count+=2;
		if (document.all.chkTrombDom4(0).checked)
			count+=1.5;
		if (document.all.chkTrombDom5(0).checked)
			count+=1.5;
		if (document.all.chkTrombDom6(0).checked)
			count+=1;
		if (document.all.chkTrombDom7(0).checked)
			count+=1;
		if (document.all.chkTrombDom8(0).checked)
			count+=1;
		if (document.all.chkTrombDom9(0).checked)
			count+=1;
		if (document.all.chkTrombDom10(0).checked)
			count+=1;
		if (document.all.chkTrombDom11(0).checked)
			count+=1;
		if (document.all.chkTrombDom12(0).checked)
			count+=1;
		if (document.all.chkTrombDom13(0).checked)
			count+=0.5;
		if (document.all.chkTrombDom14(0).checked)
			count+=2;
		if (document.all.chkTrombDom15(0).checked)
			count+=2;
		if (document.all.chkTrombDom16(0).checked)
			count+=2;
		if (document.all.chkTrombDom17(0).checked)
			count+=2;
		if (document.all.chkTrombDom18(0).checked)
			count+=2;
		if (document.all.chkTrombDom19(0).checked)
			count+=2;
		if (document.all.chkTrombDom20(0).checked)
			count+=1;
		if (document.all.chkTrombDom21(0).checked)
			count+=1;
		if (document.all.chkTrombDom22(0).checked)
			count+=1;

	
document.all.txtTotale.value=count;	
document.all.txtTotale.disabled=true;
}
