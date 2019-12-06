function checkDate(valoreData)
{
	var T=0;
	var stato=0;
	var mioChar=0;
	var anno="";
	var mese="";
	var giorno="";
	var dataO=new Date();
	var dataTmp;
	var dataRet=formatDateEx(dataO.getFullYear(), dataO.getMonth()+1, dataO.getDate());

	if(valoreData.length>0)
	{
		for(T=0 ; T<valoreData.length ; T++)
		{
			mioChar=valoreData.charAt(T);
			switch(stato)
			{
				case(0):
				if(mioChar>='0' && mioChar<='9')
				{
					giorno=giorno+mioChar;
				}
				else
				{
					stato=1;
				}
				break;
				case(1):
				if(mioChar>='0' && mioChar<='9')
				{
					mese=mese+mioChar;
					stato=2;
				}
				break;
				case(2):
				if(mioChar>='0' && mioChar<='9')
				{
					mese=mese+mioChar;
				}
				else
				{
					stato=3;
				}
				break;
				case(3):
				if(mioChar>='0' && mioChar<='9')
				{
					anno=anno+mioChar;
					stato=4;
				}
				break;
				case(4):
				if(mioChar>='0' && mioChar<='9')
				{
					anno=anno+mioChar;
				}
				else
				{
					stato=5;
				}
				break;
				default:
				break;
			}//switch(stato)
		}//for(T=0 ; T<valoreData.lenght ; T++)

		if(anno.length!=0 && mese.length!=0 && giorno.length!=0)
		{
			if(anno<100){ anno=eval(parseInt(anno, 10)+2000);}
			if(parseInt(anno)>9999){ anno=parseInt(dataO.getFullYear());}
			dataTmp=new Date(parseInt(anno, 10), parseInt(mese, 10)-1, parseInt(giorno, 10));
			dataRet=formatDateEx(dataTmp.getFullYear(), dataTmp.getMonth()+1, dataTmp.getDate());
		}
	}

	else
	{
		dataRet="";
	}

	return dataRet;
}

function formatDateEx(anno, mese, giorno)
{
	var strTmp="";

	if(anno<100){ anno=anno+2000;}
	if(giorno<10)
	{
		strTmp=strTmp+"0";
	}
	strTmp=strTmp+giorno+"/";
	if(mese<10)
	{
		strTmp=strTmp+"0";
	}
	strTmp=strTmp+mese+"/"+anno;

	return strTmp;
}


function getAge(dataNascita)
{
	dat=new Date();
	year=dat.getYear();
	month=dat.getMonth()+1;
	day=dat.getDate();
	if(year<100){
		year+=1900;
	}
	if(isNaN(dataNascita))
	{
		mese=dataNascita.substr(3, 2);
		if(mese.substr(0,1)=="0"){
			mese=parseInt(mese.substr(1, 1));
		}else{
			mese=parseInt(mese);
		}
		dataNascitaInt=new Date(dataNascita.substr(6, 4), mese-1, dataNascita.substr(0, 2));
	}
	else
	{
		mese=dataNascita.substr(4, 2);
		if(mese.substr(0,1)=="0"){
			mese=parseInt(mese.substr(1, 1));
		}else{
			mese=parseInt(mese);
		}
		dataNascitaInt=new Date(dataNascita.substr(0, 4), mese-1, dataNascita.substr(6, 2));
	}
	annoNascita=dataNascitaInt.getYear();
	meseNascita=dataNascitaInt.getMonth()+1;
	giornoNascita=dataNascitaInt.getDate();
	if(annoNascita<100){
		annoNascita+=1900;
	}
	eta=year-annoNascita;
	if(meseNascita*100+giornoNascita>month*100+day){ eta-=1;}

	if(isNaN(eta)){ eta=0;}

	return eta;
}


function getToday(){
	var dd="";
	var mm="";
	var yyyy="";
	var DataOdierna = "";
	var d = new Date();                           //Crea oggetto Date.	
	
	dd = ("00" + d.getDate().toString());
	dd = dd.substr((-dd.length%2)+2,2);
	mm = ("00" + (parseInt(d.getMonth() +1)).toString());
	mm = mm.substr((-mm.length%2)+2,2);
	yyyy = d.getYear().toString();       
	DataOdierna = dd + "/"  + mm + "/" + yyyy;
	return 	DataOdierna ;
}



function getAgeMesi(dataNascita)
{
	var mesi = 0;
	var anni = 0;
	var dataOggi = new Date();           
	
	if(isNaN(dataNascita))
	{
		mese=dataNascita.substr(3, 2);
		if(mese.substr(0,1)=="0"){
			mese=parseInt(mese.substr(1, 1));
		}else{
			mese=parseInt(mese);
		}
		dataNascitaInt=new Date(dataNascita.substr(6, 4), mese-1, dataNascita.substr(0, 2));
		annoNascita = dataNascita.substr(6, 4);
	}
	else
	{
		mese=dataNascita.substr(4, 2);
		if(mese.substr(0,1)=="0"){
			mese=parseInt(mese.substr(1, 1));
		}else{
			mese=parseInt(mese);
		}
		dataNascitaInt=new Date(dataNascita.substr(0, 4), mese-1, dataNascita.substr(6, 2));
		annoNascita = dataNascita.substr(0, 4);
	}

	meseNascita = dataNascitaInt.getMonth()+1;
	//annoNascita = dataNascitaInt.getYear();
	
	mm = ("00" + (parseInt(dataOggi.getMonth() +1)).toString());
	mm = mm.substr((-mm.length%2)+2,2);
	yyyy = dataOggi.getYear().toString();      
	
	anni = parseInt(yyyy) - parseInt(annoNascita);
	mesi = parseInt(mm) - parseInt(meseNascita);
	
	//alert('ANNI: ' + yyyy + ' - ' + annoNascita);
	//alert('MESI: ' + mesi);
	
	if(anni > 0){
		mesi = (parseInt(anni)*12) + parseInt(mesi);
	}
	
	if(isNaN(mesi)){
		mesi = 0;
	}

	return mesi;
}


/** Metodo Statico pubblico per la compilazione della funzione JavaScript
     * <B>formatDate</B>. La funzione <B>Java Script</B> riceve in ingresso un parametro contenente
     * l' informazione del giorno del quale si vuole formattare la data; le informazioni
     * del mese e dell' Anno sono prese dalla variabile <B>dataCal</B> del codice <B>Java
     * Script</B>; la funzione <B>Java Script</B> ritornerà la data, eventualmente
     * corretta, in formato <B>GG/MM/AAAA</B>
     * @return Ritorna una stringa contenente il codice della funzione Java Script <B>formatDate</B>
	 
	 public static String getFormatDate()
     */    
function formatDate(giorno)
{
	return formatDateEx(dataCal.getFullYear(), dataCal.getMonth()+1, giorno);
}   

/**
	@dataDaFormattare data nel formato gg/mm/aaaa
	return data nel formato            aaaammgg
*/
function formatDateToQyery(dataDaFormattare){
	var dataFormattata = null;
	
	dataFormattata = dataDaFormattare.substring(6,10)+dataDaFormattare.substring(3,5)+dataDaFormattare.substring(0,2);		
	
	return dataFormattata;
}
