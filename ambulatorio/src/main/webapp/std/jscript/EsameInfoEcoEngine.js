function initGlobalObject(){
	/*
	fillLabels(arrayLabelName,arrayLabelValue);
	initbaseGlobal();
	initbaseUser();
	initbasePC();	
	*/
}

function apriGrafici(valore){
	
	var finestra;
	
	if (valore ==""){
		return;
	}
	finestra = open("grafico" + valore +".html","","status=yes,top=0,left=0,width="+ screen.availWidth +", height=" + screen.availHeight+",scrollbars=yes");
}


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
			if(anno<100) anno=eval(parseInt(anno, 10)+2000);
			if(parseInt(anno)>9999) anno=parseInt(dataO.getFullYear());
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

	if(anno<100) anno=anno+2000;
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