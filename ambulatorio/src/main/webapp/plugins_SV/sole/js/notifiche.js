$(document).ready(function(){
   $("#oIFWk").attr("src","servletGenerator?KEY_LEGAME=NOTIFICHE_SOLE_WK&WHERE_WK=");
});

function aggiorna_notifiche(){
    var v_where="";
    if($("#TxtDaData").val()!=""){
        if(convertData($("#TxtDaData").val())=="KO"){
            alert("Inserire una data valida!");    
            return;
        }
        v_where = "DATA_INS >='"+convertData($("#TxtDaData").val())+"'";
        if($("#TxtAData").val()!=""){
            v_where += " AND DATA_INS <='"+convertData($("#TxtAData").val())+"'";    
           
        }
    }else{
        alert("Inserire le date nei filtri");
        return;
    }

    if($("#TxtCogn").val()!=""){
	$("#TxtCogn").val($("#TxtCogn").val().toUpperCase());
	v_where += " AND COGN LIKE '%"+$("#TxtCogn").val()+"%'";  
    }

     if($("#TxTNome").val()!=""){
	$("#TxTNome").val($("#TxTNome").val().toUpperCase());
	v_where += " AND NOME LIKE '%"+$("#TxTNome").val()+"%'";  
    }


    $("#oIFWk").attr("src","servletGenerator?KEY_LEGAME=NOTIFICHE_SOLE_WK&WHERE_WK="+encodeURI(v_where));

        
}

function convertData(field){
	a = field.indexOf('/');
	if(a != -1){
                Giorno = field.substring(0,2);
                Mese = field.substring(3,5);
                Anno = field.substring(6,10);
                return Anno+Mese+Giorno;
        }else{
                return 'KO';
        }
}
        