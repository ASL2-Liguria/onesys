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
package cartellaclinica.gestioneAppuntamenti.components;

import java.io.Serializable;
import java.util.HashMap;

/**
 * <p>Title: </p>
 *
 * <p>Description: </p>
 *
 * <p>Copyright: Copyright (c) 2011</p>
 *
 * <p>Company: </p>
 *
 * @author not attributable
 * @version 1.0
 */
public class ColumnHeader implements Serializable{

    private static final long serialVersionUID = 1000L;
    private String Scope,Label,Width;
    private HashMap<String,String> htCampi;
  
    public ColumnHeader(String pScope,String pLabel,String pWidth,String pRiferimenti) {

        this.Scope = pScope;
        this.Label = pLabel;
        this.Width = pWidth;

        this.htCampi = new HashMap<String,String>();

        if(!pRiferimenti.equals("")){
            String[] ArCoppie = pRiferimenti.split("[|]");
            for(int i=0;i<ArCoppie.length;i++){
                String CampoHeader, CampoDetail = "";
                CampoHeader = ArCoppie[i].split(":")[0];
                if(ArCoppie[i].split(":").length>=2) {
                    CampoDetail = ArCoppie[i].split(":")[1];
                }
                htCampi.put(CampoHeader,CampoDetail);
            }
        }

    }

    public String getScope(){
        return this.Scope;
    }

    public String getLabel(){
        return this.Label;
    }

    public String getWidth(){
        return this.Width;
    }

    public HashMap<String,String> getCampi(){
        return this.htCampi;
    }
}
