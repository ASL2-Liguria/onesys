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
package paginaTab;

import java.util.Hashtable;
import java.util.Iterator;
import java.util.Set;


public class datiSezioni  {
	private Hashtable<String,String> hSezioni=new Hashtable<String,String>();
   private String valDatiSezioni=""; 
   Iterator<String> itr;

    public void valDatiSezioni() {
    }

    public void addSezione(String idSezione,Hashtable<String,String> val){
    	String str;
    	String temp="\""+idSezione+"\":{";
    	String[] temp2;
    	Set<String> set = val.keySet();
    	itr = set.iterator();
    	int i=0;
    	while (itr.hasNext()) {
    		str = itr.next();
    		if (i>0){
    			temp+=",";
    		}	
    		if(str.equals("ARGOMENTO")){
    			temp2=val.get(str).split(",");
    			for(int p=0; p<temp2.length; p++){
    				if (p==0){
    					temp+="\""+str+"\":[\""+temp2[p]+"\"";
    				}
    				else{
    					temp+=",\""+temp2[p]+"\"";
    				}

    			}
    			temp+="]";
    		}

    		else{
    			temp+="\""+str+"\":\""+val.get(str)+"\"";
    		}
    		i+=1;
    	}
    	temp+="}";
    	hSezioni.put(idSezione, temp);	
    }
    
    public String getSezione(String idSezione){
	return hSezioni.get(idSezione);	
    }
    
 
    
    public String getValDatiSezioni(String idTab){
    	String str;
    	valDatiSezioni="";
    	valDatiSezioni+="datiTabulatori."+idTab+"={";

    	Set<String> set = hSezioni.keySet();
    	itr = set.iterator();
    	int i = 0;
    	while (itr.hasNext()) {
    		if(i!=0){
    			valDatiSezioni+=",";	   		
    		}
    		str = itr.next();
    		valDatiSezioni+=hSezioni.get(str);
    		i+=1;	
    	}
    	valDatiSezioni+="}\n";
    	
       return valDatiSezioni;
    }
   
}
