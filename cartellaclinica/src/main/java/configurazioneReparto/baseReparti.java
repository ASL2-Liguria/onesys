/* Copyright (c) 2018, EL.CO. SRL.  All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following
 * disclaimer in the documentation and/or other materials provided
 * with the distribution.
 * THIS SOFTWARE IS PROVIDED FREE OF CHARGE AND ON AN "AS IS" BASIS,
 * WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED INCLUDING
 * WITHOUT LIMITATION THE WARRANTIES THAT IT IS FREE OF DEFECTS, MERCHANTABLE,
 * FIT FOR A PARTICULAR PURPOSE OR NON-INFRINGING. THE ENTIRE RISK
 * AS TO THE QUALITY AND PERFORMANCE OF THE SOFTWARE IS WITH YOU.
 * SHOULD THE SOFTWARE PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL
 * NECESSARY SERVICING, REPAIR, OR CORRECTION.
 * IN NO EVENT SHALL ELCO SRL BE LIABLE TO YOU FOR DAMAGES, INCLUDING
 * ANY GENERAL, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING
 * OUT OF THE USE OR INABILITY TO USE THE SOFTWARE (INCLUDING, BUT NOT
 * LIMITED TO, LOSS OF DATA, DATA BEING RENDERED INACCURATE, LOSS OF
 * BUSINESS PROFITS, LOSS OF BUSINESS INFORMATION, BUSINESS INTERRUPTIONS,
 * LOSS SUSTAINED BY YOU OR THIRD PARTIES, OR A FAILURE OF THE SOFTWARE
 * TO OPERATE WITH ANY OTHER SOFTWARE) EVEN IF ELCO SRL HAS BEEN ADVISED
 * OF THE POSSIBILITY OF SUCH DAMAGES.
 */
package configurazioneReparto;

import imago.http.baseClass.baseUser;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;

import javax.servlet.http.HttpSession;

import core.Global;
import core.cache.CacheManager;

public class baseReparti implements Serializable {
    
    private static final long serialVersionUID = 1000L;
    private HashMap<String,ibaseReparto> hashConfigurazioni;
    private baseUser bUtente;
    private transient ElcoLoggerInterface log = null;

    public baseReparti(){
    }

    public baseReparti(HttpSession Sess) {
        bUtente= Global.getUser(Sess);
        hashConfigurazioni = new HashMap<String,ibaseReparto>();
        HashMap<String,ibaseReparto> hashTempConfigurazioni = new HashMap<String,ibaseReparto>();
        log=new ElcoLoggerImpl(this.getClass());
        CacheManager cache = null;
        try{
        	cache = new CacheManager("baseReparti");
    		String cachestring = "baseReparti@" + getOrderedStringReparti(bUtente.listaReparti);
    		hashTempConfigurazioni = (HashMap<String, ibaseReparto>) cache.getObject(cachestring);
    		if (hashTempConfigurazioni==null) {
    			//Se non trovo un baseReparti in cache, lo vado a ricreare andando a recuperare i reparti dagli oggetti baseReparto in cache
                for(int i=0;i<bUtente.listaReparti.size();i++) {
                    setConfigurazione(bUtente.listaReparti.get(i));
                }
    			cache.setObject(cachestring, hashConfigurazioni);
    		}else{
    			if (!hashTempConfigurazioni.isEmpty()){    				
        			hashConfigurazioni = hashTempConfigurazioni;
    			}
    		}
        }catch(Exception e){
            log.error(e);
        }
    }

	private void setConfigurazione(String pReparto) throws Exception  {
    	CacheManager cache = new CacheManager("baseReparto");
		String cachestring = "baseReparto@" + pReparto ;
		ibaseReparto bp = (ibaseReparto) cache.getObject(cachestring);
		if (bp == null) {
			bp =baseRepartoFactory.make(pReparto,bUtente.db);
			cache.setObject(cachestring, bp);
		}
		hashConfigurazioni.put(pReparto,bp);
	}

	public ibaseReparto getConfigurazione(String pReparto) throws Exception{
        if(!hashConfigurazioni.containsKey(pReparto)) {
            setConfigurazione(pReparto);
        }
        return hashConfigurazioni.get(pReparto);		
	}

	private void readObject(ObjectInputStream aInputStream) throws ClassNotFoundException, IOException {
        // inizializzo tutte le variabili non transient e non static
        aInputStream.defaultReadObject();

        // inizializzo le variabili transient e static necessarie
        if (this.log == null) {
            this.log = new ElcoLoggerImpl(aInputStream.getClass());
        }
    }

    public String getValue(String pReparto, String key) throws Exception{
    	return getValue(pReparto,key,"");
    }
    
    public String getValue(String pReparto,String key, String ricovero) throws Exception{
        if(!hashConfigurazioni.containsKey(pReparto)) {
            setConfigurazione(pReparto);
        }
        return hashConfigurazioni.get(pReparto).getParam(key,ricovero);
    }

    public StringBuilder getConfigurazioniReparti(){
        String key;
        StringBuilder sb = new StringBuilder("<script>\nvar baseReparti={\n");

        Iterator<String> it = hashConfigurazioni.keySet().iterator();
        while (it.hasNext()) {
            key = it.next();
            sb.append("    \"");
            sb.append(key);
            sb.append("\":");
            sb.append(hashConfigurazioni.get(key).object2js());
            sb.append(",\n");

        }
        sb.append(this.getValueJs());
        sb.append("}\n</script>\n");

        return sb;
    }

    private StringBuilder getValueJs() {
    	return new StringBuilder("getValue:function(reparto,key,ricovero){return configurazioneReparto.getValue(reparto,key,ricovero);}");
	}

//	private String getValue(){
//        StringBuilder sb = new StringBuilder();
//
//        sb.append("        getValue:function(reparto,key){");
//        sb.append("            try{");
//        sb.append("                    dwr.engine.setAsync(false);");
//        sb.append("                    if(typeof baseReparti[reparto] == 'undefined'){dwrUtility.getConfigurazioneReparto(reparto,function(resp){if(resp[0]=='OK')eval('baseReparti[reparto]='+resp[1]);else alert(resp[1]);});}");
//        sb.append("                    if(typeof baseReparti[reparto][key] == 'undefined'){dwrUtility.executeStatement('configurazioni.xml','getValueCdc',[reparto,key],1,function(resp){if(resp[0]=='OK')baseReparti[reparto][key]=resp[2];else alert(resp[1]);});}");
//        sb.append("                    dwr.engine.setAsync(true);");
//        sb.append("                    return baseReparti[reparto][key];");
//        sb.append("            }catch(e){return null;}");
//        sb.append("    }");
//
//        return sb.toString();
//    }
	
	
	private String getOrderedStringReparti(ArrayList<String> reparti){
    	Collections.sort(reparti, String.CASE_INSENSITIVE_ORDER);
    	
    	StringBuilder sb = new StringBuilder();
    	for (String s : reparti)
    	{
    	    sb.append(s);
    	    sb.append("\t");
    	}
    	
    	return sb.toString();
	}
}
