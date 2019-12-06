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
package unisys.layout;

import javax.servlet.ServletContext;

import org.apache.ecs.html.Body;
import org.apache.ecs.html.Head;
import org.apache.ecs.html.Html;
import org.apache.ecs.html.Meta;
import org.apache.ecs.html.Title;

/**
 * Classe per la costruzione base di una pagina
 * 
 * @author Fabrizio
 */
public class Page extends Html
{
	private static final long serialVersionUID = 1L;

	private static final String _DOCTYPE	= new String("<!DOCTYPE html>\n");
	
	private Head			pHead		= null;
    private Body			pBody		= null;
    
    private ServletContext context;
	
	/**
     * costruttore della pagina
     * @param title Titolo
     */
	public Page(String title, ServletContext context)
	{
		super();
		
		pHead = new Head();
		pHead.addElement("\n");
		pHead.addElement("\t" + new Meta().addAttribute("charset","UTF-8") + "\n");
		pHead.addElement("\t" + new Title(title) + "\n");
		
		pBody = new Body();
		
		this.context = context;
	}
	
	/**
	 * Imposta il BODY della pagina
	 * 
	 * @param body
	 */
	public void addToBody(String body)
	{
		pBody.addElement("\n" + body);
	}
	
	/**
	 * Imposta il BODY della pagina
	 * 
	 * @param body
	 */
	public void addAttrToBody(String attr, String val)
	{
		pBody.addAttribute(attr, val);
	}
	
	/**
	 * Metodo per l'aggiunta di un elemento generico all'HEAD della pagina
	 * @param content
	 */
	public void addGenericHeadPart(String content)
	{
		pHead.addElement("\n\t" + content + "\n");
	}
	
	public void addCss(String href)
	{
		pHead.addElement("\t" + new Css(href, this.context) + "\n");
	}
	
	public void addJs(String src)
	{
		pBody.addElement("\t" + new Js(src, this.context) + "\n");
	}
	
	/**
	 * Genera la pagina
	 * 
	 * @return	Tutto l'html della pagina
	 */
	public String generaPagina()
	{
		addElement("\n"+pHead);
		addElement("\n"+pBody+"\n");
		
		return _DOCTYPE + this.toString();
	}
}