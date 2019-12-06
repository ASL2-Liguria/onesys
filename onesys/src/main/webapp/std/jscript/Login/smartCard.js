$(document).ready(function() 
{	
	$("#butSmart").click(function()
	{
		eseguiLoginSmartcard();
	});
});

function eseguiLoginSmartcard()
{
	dgst		= new ActiveXObject("CCypher.Digest");
	risposta	= dgst.GetSmartCardProperty(16);
	
	var qs = "codFisc=" + risposta;
		
	$.ajax({
        url: "AuthenticationSiss", 
        type: "POST",
        data: qs,     
        cache: false,
        dataType:"text",
         
        success: function (response) 
        {       
			var resp 	= response.toString().split("$")[0];
			var msg		= response.toString().split("$")[1];
			
			$("#errorMsg").show();
			
			switch(resp)
			{
				//	Accesso negato
				case 'KO':
					$("#errorMsg").html(msg);
					break;
				
				//	Login corretto, redirect alla url ricevuta
				case 'OK':
					$("#errorMsg").hide();
					
					var webuser	= msg.split("#")[0];
					var psw		= msg.split("#")[1];
					
					//alert("webuser = " + webuser + "\nPassword = " + psw);
					$("#username").val(webuser);
					$("#password").val(psw);
					
					//aux_login();
					
					break;
				default:
					$("#errorMsg").html("Errore: " + msg);
			}
			
        },
        
        error:function()
        {
            $("#errorMsg").html("AJAX communication error.");
        }
	});
		
}