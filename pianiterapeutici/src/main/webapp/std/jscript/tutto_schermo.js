function tutto_schermo(){
	var altezza;
	var largh;
	if (top.name!='schedaRicovero'){
		altezza = screen.availHeight;
		largh = screen.availWidth;
		top.resizeTo(largh,altezza);
		top.moveTo(0,0);
	}
}