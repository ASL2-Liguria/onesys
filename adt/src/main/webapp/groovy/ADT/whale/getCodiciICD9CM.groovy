import it.elco.json.Json;

try{


    URL whale = new URL("http://localhost:8080/whale/Action/Database/getListFromResultset/{'file_name':'ADT_integrazione.xml','statement_name':'getCodiciICD9CM',parameters:[nosologico]}")

    URLConnection connection = whale.openConnection()
    BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()))
    String inputLine
    while ((inputLine = br.readLine()) != null) {
        println inputLine;
        list_icd = Json.marshall(inputLine).get("records");
    }

    br.close();

}catch(Exception ex){
    out_success = false
    out_message = ex.getClass().getName() +"\n" + ex.getMessage()
}