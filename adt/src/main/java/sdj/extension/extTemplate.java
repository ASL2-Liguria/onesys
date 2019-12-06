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
package sdj.extension;

import freemarker.core.InvalidReferenceException;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import generatoreEngine.components.extension.exception.extensionExceptionEnd;
import generatoreEngine.components.extension.exception.extensionExceptionInit;
import generatoreEngine.components.html.ibase.iHtmlTagBase;
import it.elco.baseObj.factory.baseFactory;
import it.elco.baseObj.iBase.iBaseGlobal;
import it.elco.cache.CacheManager;
import it.elco.listener.ElcoContextInfo;
import it.elco.util.SeralizatorObject;
import it.elco.util.freemarker.ConfigurationManager;
import sdj.extension.extra.BaseData;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.HashMap;
import java.util.Map;

public class extTemplate extends BaseData
{
    private static final long serialVersionUID = 6328379233040142852L;

    private ServletContext sContext = null;
    private HttpServletRequest sRequest = null;
    private HttpSession session  = null;

    protected iBaseGlobal global = null;

    protected transient Template tpl = null;
    private Map<String, Object> data_model =null;

    @Override
    public void init(Object[] param) throws extensionExceptionInit
    {
        sContext = (ServletContext) param[0];
        sRequest = (HttpServletRequest) param[1];
        sito = super.getSito();
        session = sRequest.getSession(false);
        global = baseFactory.getBaseGlobal(super.getSito(),super.getVersione());
        data_model = new HashMap<String, Object>();
    }

    @Override
    public void end() throws extensionExceptionEnd
    {
        ;
    }

    public void process(String template) throws IOException, TemplateException
    {
        Configuration cfg = ConfigurationManager.getConfiguration(getTemplatesPath(),super.getSito(),super.getVersione());

        template = ((template != null) && !template.equalsIgnoreCase("")) ? template : getTemplateFromDb();

        Writer out = new StringWriter();

        CacheManager cache = new CacheManager("TEMPLATES");
        String sKey = template;

        SeralizatorObject<Template> tplSerialized = (SeralizatorObject<Template>) cache.getObject(sKey);

        try
        {
            if (tplSerialized == null)
            {
                tpl = cfg.getTemplate(template);
                cache.setObject(sKey, new SeralizatorObject<Template>(tpl));
            }
            else
                tpl = tplSerialized.getObject();
            getDataModel(); //da chiamare fuori!!!
            tpl.process(data_model, out);
        }
        catch (FileNotFoundException e)
        {
            out.write(super.getTranslator().getHtmlTranslatorText("lblNoTemplate"));
        }
        catch (InvalidReferenceException e)
        {
            out.write("InvalidReferenceException");
        }

        iHtmlTagBase container = super.getHtmlWork();
        container.addAttribute("data-template", template);
        container.setTagValue(out.toString());
    }

    private String getTemplatesPath()
    {
        return ElcoContextInfo.getContextPath(null, "config", super.getSito(), super.getVersione()) + "templates";
    }

    private String getTemplateFromDb()
    {
        return super.getLoaderData().getDataRecord().get("TEMPLATE").getValue();
    }

    public void getDataModel()
    {
        data_model.put("traduzione", super.getTranslator().getHtmlTranslatorData());
        data_model.put("dati", super.getLoaderData().getDataRecord());
        data_model.put("dati_salvati", super.getLoaderData().getData());
    }
    public void addToDataModel(String id,Object obj)
    {
        data_model.put(id, obj);
    }
}
