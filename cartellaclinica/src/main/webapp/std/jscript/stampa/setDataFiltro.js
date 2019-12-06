function setDateFilter(){	
	var tDay = new Date();
	//var sDate;
	//sDate = clsDate.getData(tDay,'DD/MM/YYYY');
	//alert(sDate);
	var tMonth = tDay.getMonth()+1;
	var tDate = tDay.getDate();
	if ( tMonth < 10) tMonth = "0"+tMonth;
	if ( tDate < 10) tDate = "0"+tDate;
	//alert( tDate+"/"+tMonth+"/"+tDay.getFullYear());
	document.all['txtDaData'].value = tDate+"/"+tMonth+"/"+tDay.getFullYear();
	document.all['txtAData'].value = tDate+"/"+tMonth+"/"+tDay.getFullYear();
	//document.all['txtDaData'].value = sDate;
	//document.all['txtAData'].value = sDate;
}