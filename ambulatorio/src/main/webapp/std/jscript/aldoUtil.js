// JavaScript Document

// accetta la data in formato 
// dd/mm/yyyy
// ritorna GLI ANNI 
function retrieveAge(data){

 var bD;
 var strOutput = "";
	
 now = new Date()
 bD = data.split('/');
 
 if(bD.length==3){
   born = new Date(bD[2], bD[1]*1-1, bD[0]);
   years = Math.floor((now.getTime() - born.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
   strOutput = years;
 }
 return strOutput;
}



var startyear = "1950";
var endyear = "2010";
var dat = new Date();
var curday = dat.getDate();
var curmon = dat.getMonth()+1;
var curyear = dat.getFullYear();
function checkleapyear(datea)
{
	if(datea.getYear()%4 == 0)
	{
		if(datea.getYear()% 10 != 0)
		{
			return true;
		}
		else
		{
			if(datea.getYear()% 400 == 0)
				return true;
			else
				return false;
		}
	}
return false;
}
function DaysInMonth(Y, M) {
    with (new Date(Y, M, 1, 12)) {
        setDate(0);
        return getDate();
    }
}
function datediff(date1, date2) {
    var y1 = date1.getFullYear(), m1 = date1.getMonth(), d1 = date1.getDate(),
	 y2 = date2.getFullYear(), m2 = date2.getMonth(), d2 = date2.getDate();

    if (d1 < d2) {
        m1--;
        d1 += DaysInMonth(y2, m2);
    }
    if (m1 < m2) {
        y1--;
        m1 += 12;
    }
    return [y1 - y2, m1 - m2, d1 - d2];
}

// ritorna la l'età in giorni*mesi*anni
function calage(giorno, mese, anno)
{
	var calday = giorno;
	var calmon = mese;
	var calyear = anno;

	var curd = new Date(curyear,curmon-1,curday);
	var cald = new Date(calyear,calmon-1,calday);

	var diff =  Date.UTC(curyear,curmon,curday,0,0,0) - Date.UTC(calyear,calmon,calday,0,0,0);

	var dife = datediff(curd,cald);
//		alert(curd + "@" + cald + "@" + diff + "@" + dife);
	return dife[2] +"*" + dife[1] + "*" + dife[0];
	/*
	document.birthday.age.value=dife[0]+" years, "+dife[1]+" months, and "+dife[2]+" days";
	var monleft = (dife[0]*12)+dife[1];
	var secleft = diff/1000/60;
	var hrsleft = secleft/60;
	var daysleft = hrsleft/24;
	document.birthday.months.value=monleft+" Month since your birth";	
	document.birthday.daa.value=daysleft+" days since your birth";	
	document.birthday.hours.value=hrsleft+" hours since your birth";
	document.birthday.min.value=secleft+" minutes since your birth";


	var as = parseInt(calyear)+dife[0]+1;
	var diff =  Date.UTC(as,calmon,calday,0,0,0) - Date.UTC(curyear,curmon,curday,0,0,0);
	var datee = diff/1000/60/60/24;
	document.birthday.nbday.value=datee+" days left for your next birthday";	
	*/

}






