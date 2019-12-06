function formatta(campo, label_alert){
data=campo.value;
if (data=="")
	return;	
data1="";
if ((data.substr(1,1)=="/") || (data.substr(1,1)==".") || (data.substr(1,1)=="-") || (data.substr(1,1)==" "))
		data1="0"+data.substr(0,1)+"/";
else
	if ((data.substr(2,1)=="/") || (data.substr(2,1)==".") || (data.substr(2,1)=="-") || (data.substr(2,1)==" "))
			data1=data.substr(0,2)+"/";
    else
		{
			alert(ritornaJsMsg(label_alert));//"Data non riconosciuta"
			campo.value = '';
			campo.focus();
		    return;
		}		
if ((data.substr(3,1)=="/")||(data.substr(3,1)==".") || (data.substr(3,1)=="-") || (data.substr(3,1)==" ")||(data.substr(3,1)==""))
{
	data1=data1+"0"+data.substr(2,1)+"/";
    data=data.substr(4,data.length-4);
	}	
else
	if ((data.substr(4,1)=="/")||(data.substr(4,1)==".") || (data.substr(4,1)=="-") || (data.substr(4,1)==" ")||(data.substr(4,1)==""))				   {
		if((data.substr(2,1)=="/") || (data.substr(2,1)==".") || (data.substr(2,1)=="-") || (data.substr(2,1)==" "))
		{
			data1=data1+"0"+data.substr(3,1)+"/";
	    	data=data.substr(5,data.length-5);
		}
		else
			{
				data1=data1+data.substr(2,2)+"/";
		  	    data=data.substr(5,data.length-5);
			}
	}
	else
		if ((data.substr(5,1)=="/")||(data.substr(5,1)==".") || (data.substr(5,1)=="-") || (data.substr(5,1)==" ")||(data.substr(5,1)==""))
		{
			data1=data1+data.substr(3,2)+"/";
			data=data.substr(6,data.length-6);
		}
		else
			{
				alert(ritornaJsMsg(label_alert));//"Data non riconosciuta"
				campo.value = '';
				campo.focus();
				return;
			}
		d=new Date();
		if ((isNaN(data))||(data.length==3))
			{
				alert(ritornaJsMsg(label_alert));//"Data non riconosciuta"
				campo.value = '';
				campo.focus();
				return;
			}
		if (data.length==4)
				data1=data1+data;
	    else		
			if (data=="")
				data1=data1+d.getFullYear() ;
			else
				if (data>9)
					data1=data1+"19"+data;
				else
					if (data<10)
						{
							da=d.getFullYear() ;
							data1=data1+da;
							if (data.length==2)
								data=data.substr(1,1);
							data1=data1.substr(0,9)+data;
						}
			data=data1;
			strLength1=data.length;
    		if (strLength1 == 10)
			   {
   			      var data1=new Date(data.substring(6,10),data.substring(3,5)-1,data.substring(0,2));
  	        	  var strData1=data1.getDate()+"/"+(parseInt(data1.getMonth())+1)+"/"+data1.getFullYear();
			      if (data1.getDate()!=data.substring(0,2)||(parseInt(data1.getMonth())+1)!=data.substring(3,5))
			         {
			            alert(ritornaJsMsg(label_alert));//"Data Errata"
						campo.value = '';
				    	campo.focus();
			            return;
			         }
			    }
			  else
			    {
					alert(ritornaJsMsg(label_alert));//"Data Errata"
					campo.value = '';
					campo.focus();
			        return;
			    }
	    	campo.value=data;
            return(data);
}
