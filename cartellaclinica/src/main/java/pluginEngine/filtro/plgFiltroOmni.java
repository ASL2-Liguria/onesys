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
/*
    File: plgFiltroOmni.java
    Autore: Jack
*/

package pluginEngine.filtro;

import generatoreEngine.html.generate_html.attribute.PATH_ENGINE;
import generatoreEngine.html.generate_html.attribute.baseAttributeEngine;
import imago.http.classDivHtmlObject;
import imago.http.classImgHtmlObject;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;


public class plgFiltroOmni extends baseAttributeEngine
{
    private static String SRC_IMAGE  = "imagexPix/img_esame/omni.jpg";
    private static String ID_DEFAULT = "body_omni";
    private static String JS_DEFAULT = "set_parte_corpo";

    private static String[] A_ZONA = {"F",
                                      "G",
                                      "B",
                                      "A",
                                      "C",
                                      "N",
                                      "L",
                                      "E",
                                      "D",
                                      "O",
                                      "M",
                                      "I",
                                      "H",
                                      "Q",
                                      "P",
                                      "S",
                                      "R",
                                      "T",
                                      "U",
                                      "V",
                                      "W",
                                      "X",
                                      "Y"};
    private static String[] A_AREA = {"82,106,113,106,113,79,102,82,89,88,82,101",
                                      "173,81,173,105,205,105,194,87,174,79",
                                      "117,76,128,63,156,63,161,72,172,79,116,79",
                                      "128,61,119,28,124,10,134,0,152,0,162,11,166,33,156,61",
                                      "105,109,105,149,180,149,180,107,170,107,170,81,116,81,116,109",
                                      "73,146,93,159,102,144,102,109,81,109,81,126",
                                      "62,172,80,185,90,161,71,150,68,162",
                                      "104,194,179,194,177,175,181,152,104,152,107,174,107,184",
                                      "98,247,183,247,182,223,178,197,104,197,99,222",
                                      "206,127,212,147,193,159,184,136,184,108,204,108",
                                      "203,184,220,172,216,162,214,150,195,162,200,173",
                                      "227,226,241,219,222,174,204,187,213,206",
                                      "44,217,53,225,78,189,60,174",
                                      "234,276,247,280,258,280,274,270,270,253,279,244,250,231,242,221,228,230,234,248",
                                      "17,247,10,265,20,273,32,275,47,271,50,241,52,228,43,221,31,229,6,239",
                                      "98,271,106,304,132,304,138,251,98,250",
                                      "145,250,150,304,176,304,184,272,183,250",
                                      "107,326,105,341,131,341,130,327,133,308,107,308,107,315",
                                      "150,325,155,341,179,341,177,322,175,307,150,307",
                                      "104,360,116,415,129,415,135,361,132,344,105,344",
                                      "152,364,155,415,167,415,181,367,179,344,155,344",
                                      "97,450,109,457,120,458,126,445,129,418,116,418,109,435",
                                      "155,418,155,437,151,460,168,458,179,454,172,435,167,418"};

    private String             src     = null;
    private String             id_div  = null;
    private String             js_call = null;
    private classDivHtmlObject cDivRet = null;

    public plgFiltroOmni()
    {
    }

    public Object get_attribute_engine()
    {
        return this.cDivRet;
    }

    public void getValueContainer(String nome)
    {
    }

    public void init(ServletContext context, HttpServletRequest request)
    {
        super.set_percorso_engine(PATH_ENGINE.GROUP_LAYER);

        this.src     = SRC_IMAGE;
        this.js_call = JS_DEFAULT;
        this.id_div  = ID_DEFAULT;

        this.cDivRet = new classDivHtmlObject();
    }

    public void setJsCall(String js)
    {
        if(js != null && !js.trim().equals(""))
            this.js_call = js.trim();
        else
            this.js_call = JS_DEFAULT;
    }

    public void setIdDiv(String id)
    {
        if(id != null && !id.trim().equals(""))
            this.id_div = id.trim();
        else
            this.id_div = ID_DEFAULT;
    }


    public void setSrcImage(String path)
    {
        if(path != null && !path.trim().equals(""))
            this.src = path.trim();
        else
            this.src = SRC_IMAGE;
    }

    public void draw()
    {
        String             map = new String("<map name='map_ominde'>");
        classImgHtmlObject img = new classImgHtmlObject(this.src, "", 1);

        for(int idx = 0; idx < A_AREA.length; idx++)
        {
            map += "<area shape='POLY' coords='" + A_AREA[idx] + "' onclick='" + this.js_call + "(\"" + A_ZONA[idx] + "\");' data-zone='" + A_ZONA[idx] + "' href='javascript:void(0);' alt=''>"; // id='areaOmino" + String.valueOf(idx) + "'
        }

        map += "</map>";

        img.addAttribute("id", "ominde");
        img.addAttribute("usemap", "#map_ominde");
        img.addAttribute("class", "mapper noborder iradius16 iopacity50 icolor00cc00");
        img.addAttribute("ondblclick", "javascript:ripristina_parte_corpo();");

        this.cDivRet.addAttribute("id", this.id_div);
        this.cDivRet.appendSome(img);
        this.cDivRet.appendSome(map);
    }
}
