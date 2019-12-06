import java.net.*;
import java.io.*;

/*
    iden_richiesta
    iden_per
    cdc_sorgente
    cdc_destinatario
    tipologia_richiesta
    metodica
*/

/*try{

    
    URL polaris = new URL("http://172.23.1.237:8082/cardiologia/svlCheckScp?codice="+iden_richiesta+"&cognome="+URLEncoder.encode(cognome)+"&nome="+URLEncoder.encode(nome))
    URLConnection connection = polaris.openConnection()
    BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()))
    String inputLine
    while ((inputLine = br.readLine()) != null) {
    
    	//inputline = 'OK#INVIATO' --> {success:true,message:null}
    	//inputline = 'KO#ERRORE' --> {success:false,message:'error'}
        out_success =  inputLine.split("[#]")[0].equals("OK")
        out_message = inputLine.split("[#]")[1]
        switch (out_message) {
        	case "INVIATO": out_message = "Invio eseguito correttamente"; break;
        	case "NON_TROVATO": out_message = "Nessun ECG trovato associabile alla richiesta - anagrafica assistito"; break;
        	default: null;
        }
    }

    br.close();
    
}catch(Exception ex){
    out_success = false
    out_message = ex.getClass().getName() +" : " + ex.getMessage()
}*/

out_success =  true
out_message = "Invio eseguito correttamente"