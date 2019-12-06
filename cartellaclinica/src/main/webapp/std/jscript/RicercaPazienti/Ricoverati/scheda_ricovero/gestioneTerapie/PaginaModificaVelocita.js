$(document).ready(function() {
    try {
        //alert(parent.classMenu.idenTestata);
        //alert(parent.WindowCartella.baseUser.IDEN_PER);
        //alert(parent.WindowCartella.getRicovero("IDEN"));

        pBinds = new Array();
        pBinds.push(parent.classMenu.idenTestata);
        var isGammaKg = parent.WindowCartella.executeQuery("gamma_kg.xml", "isGammaKg", pBinds);
        if (isGammaKg.next()) {
            if (isGammaKg.getString("IS_GAMMA_KG") == 'S') {
                pBinds = new Array();
                pBinds.push(parent.classMenu.idenTestata);
                var getParametriTerapia = parent.WindowCartella.executeQuery("gamma_kg.xml", "getParametriTerapia", pBinds);
                if (getParametriTerapia.next()) {
//                    alert("CONCENTRAZIONE " + getParametriTerapia.getString("CONCENTRAZIONE") + "\nDOSE " + getParametriTerapia.getString("DOSE") + "\nDOSE FARMACO " + getParametriTerapia.getString("DOSE_FARMACO") + "\nDURATA " + getParametriTerapia.getString("DURATA") + "\nPESO " + getParametriTerapia.getString("PESO") + "\nSCALA CONCENTRAZIONE " + getParametriTerapia.getString("SCALA_CONCENTRAZIONE") + "\nSCALA DOSE " + getParametriTerapia.getString("SCALA_DOSE") + "\nVELOCITA " + getParametriTerapia.getString("VELOCITA") + "\nVOLUME TOTALE " + getParametriTerapia.getString("VOLUME_TOTALE"));                    
                    parametri = new Array();
                    parametri["CONCENTRAZIONE"] = getParametriTerapia.getString("CONCENTRAZIONE");
                    parametri["DOSE"] = getParametriTerapia.getString("DOSE");
                    parametri["DOSE_FARMACO"] = getParametriTerapia.getString("DOSE_FARMACO");
                    parametri["DURATA"] = getParametriTerapia.getString("DURATA");
                    parametri["PESO"] = getParametriTerapia.getString("PESO");
                    parametri["SCALA_CONCENTRAZIONE"] = getParametriTerapia.getString("SCALA_CONCENTRAZIONE");
                    parametri["SCALA_DOSE"] = getParametriTerapia.getString("SCALA_DOSE");
                    parametri["VELOCITA"] = getParametriTerapia.getString("VELOCITA");
                    parametri["VOLUME_TOTALE"] = getParametriTerapia.getString("VOLUME_TOTALE");

                    NS_GAMMA_KG.init(parametri);
                }        
            }
        }

    } catch (e) {
        alert(e.name + "\n" + e.message + "\n" + e.number + "\n" + e.description);
    }
});
