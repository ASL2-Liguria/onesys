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
package generic.utility;

import java.util.Calendar;
import java.util.GregorianCalendar;

public class conversionDatePercent {

    private GregorianCalendar dateIni;
    private GregorianCalendar dateFine;

    private GregorianCalendar dateRichiesta;

    private long millis_ini;
    private long millis_fine;
    private long millis_diff;

    public String anno;
    public String mese;
    public String giorno;
    public String ora;
    public String minuto;

    public final int AnnoMeseGiorno=0;
    public final int AnnoMeseGiornoOreMinuti=1;
    public final int GiornoMeseAnno=2;
    public final int GiornoMeseAnnoOreMinuti=3;
    public final int OreMinuti=4;

    public conversionDatePercent(String dataIni,String oraIni,String dataFine,String oraFine) {

        dateIni       =new GregorianCalendar(getYear(dataIni),getMonth(dataIni),getDay(dataIni),getHour(oraIni),getMinute(oraIni));
        dateFine      =new GregorianCalendar(getYear(dataFine),getMonth(dataFine),getDay(dataFine),getHour(oraFine),getMinute(oraFine));
        dateRichiesta =new GregorianCalendar();

        millis_ini=dateIni.getTimeInMillis();
        millis_fine=dateFine.getTimeInMillis();
        millis_diff = millis_fine- millis_ini;
    }
    public conversionDatePercent(String dataIni,String dataFine) {
        this(dataIni,"00:00",dataFine,"00:00");
    }

    private int getYear(String inData){return Integer.valueOf(inData.substring(0,4));}
    private int getMonth(String inData){return Integer.valueOf(inData.substring(4,6))-1;}
    private int getDay(String inData){return Integer.valueOf(inData.substring(6,8));}
    private int getHour(String inOra){return Integer.valueOf(inOra.substring(0,2));}
    private int getMinute(String inOra){return Integer.valueOf(inOra.substring(3,5));}

    private void setVaslues(){
        anno=String.valueOf(dateRichiesta.get(Calendar.YEAR));
        mese=fill(dateRichiesta.get(Calendar.MONTH)+1);
        giorno=fill(dateRichiesta.get(Calendar.DAY_OF_MONTH));
        ora=fill(dateRichiesta.get(Calendar.HOUR_OF_DAY));
        minuto=fill(dateRichiesta.get(Calendar.MINUTE));
    }

    private String fill(int value){
        String str="00"+String.valueOf(value);
        return str.substring(str.length()-2,str.length());
    }
    private String get(int format) throws Exception {
        switch (format){
            case AnnoMeseGiorno          :return anno+mese+giorno;
            case AnnoMeseGiornoOreMinuti :return anno+mese+giorno+ora+":"+minuto;
            case GiornoMeseAnno          :return giorno+"/"+mese+"/"+anno;
            case GiornoMeseAnnoOreMinuti :return giorno+"/"+mese+"/"+anno+" "+ora+":"+minuto;
            case OreMinuti               :return ora+":"+minuto;
            default:throw new Exception("Formato non riconosciuto");
        }
    }

    public String getDataFromPercent(int percent,int format) throws Exception {
        long millis=millis_ini+(millis_diff*percent/100);

        dateRichiesta.setTimeInMillis(millis);
        setVaslues();
        return get(format);
    }
    public long getPercentFromData(String data,String ora){
        long millis,percent;
        dateRichiesta =new GregorianCalendar(getYear(data),getMonth(data),getDay(data),getHour(ora),getMinute(ora));
        millis = dateRichiesta.getTimeInMillis();
        percent = 100*(millis-millis_ini)/millis_diff;
        setVaslues();
        return percent;
    }
}
