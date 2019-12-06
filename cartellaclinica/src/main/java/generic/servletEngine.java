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
package generic;

import generic.statements.StatementFromFile;
import generic.utility.controlStructure;
import imago.http.ImagoHttpException;
import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;
import imagoUtils.classJsObject;
import imago_jack.imago_function.db.functionDB;
import imago_jack.imago_function.obj.functionObj;
import imago_jack.imago_function.str.functionStr;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashSet;
import java.util.Hashtable;
import java.util.Iterator;
import java.util.Set;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.ecs.Doctype;
import org.apache.ecs.xhtml.body;
import org.directwebremoting.WebContextFactory;

import core.cache.CacheTabExtFiles;

public abstract class servletEngine extends functionObj {

	protected final functionDB fDB;
	protected final functionStr fStr;
	protected controlStructure  conStruct;
	protected Hashtable<String,String> hashRequest;
	private final ArrayList<String> lstJs=new ArrayList<String>();
	private final ArrayList<String> lstCss=new ArrayList<String>();
	protected final ElcoLoggerInterface log=new ElcoLoggerImpl(this.getClass());
	protected final Set<StatementFromFile> sSff= new HashSet<StatementFromFile>();

    protected final body BODY = new body();

    private boolean addBaseUser=false,addBasePc=false,addBaseGlobal=false,addBaseReparti=false;
    
    private boolean require_session = true;
	private String docType;
    
    protected final void setRequireSession(boolean require) {
    	this.require_session = require;
    }
    
    public final boolean getRequireSession() {
    	return require_session;
    }

    /**
     * Usare per dwr. Messo deprecato per evitare di dimenticarsi il costruttore per le servlet (in assenza, viene chiamato questo implicitamente)
     * @deprecated Usato solo per istanziazione da dwr.xml
     */
    @Deprecated
	public servletEngine() {
    	this(WebContextFactory.get().getServletContext(),WebContextFactory.get().getHttpServletRequest());
    }

    /**
     * Usare per servlet
     * @param pCont
     * @param pReq
     */
    public servletEngine(ServletContext pCont,HttpServletRequest pReq) /*throws Exception*/ {
        super(pCont, pReq, pReq.getSession(false));
        fDB = new functionDB(this);
        fStr = new functionStr();
        conStruct = new controlStructure();
        setParameter();
        this.docType =  (new Doctype.XHtml10Transitional()).toString();
        //setDocType("DEFAULT");
    }

    public final String gestione() {
        String sOut="";
        try{
        	try {
        		setLink();
        	} catch (Exception e) {
        		log.error(e);
        	}

            sOut = getDocType();

            sOut+= "<html>";

            sOut+= getHead();
            BODY.addElement(getBody());
            BODY.addElement(getFormRequest());
            BODY.addElement(getFoot());
            sOut+= BODY.toString();

            sOut+= "</html>";

        }catch(Exception e){
            sOut = getDocType() + "<html><head></head><body>"+e.getMessage()+"</body></html>";
            log.error(e);
        }finally{
            this.closeAllSff();
        }
        return sOut;
    }

    protected final StatementFromFile getStatementFromFile() throws Exception {
        StatementFromFile sff = new StatementFromFile(this.hSessione);
        this.sSff.add(sff);
        return sff;
    }

    protected final void closeAllSff(){
        Iterator<StatementFromFile> it = this.sSff.iterator();
        while(it.hasNext()){
            it.next().close();
        }
    }
    
    public final void closeSff(StatementFromFile sff) {
    	sff.close();
    	sSff.remove(sff);
    }

    protected final String getHead(){
        String head="<head>";

        for(int i=0;i<lstCss.size();i++)head+=lstCss.get(i);

        if(addBaseUser)head+=classJsObject.javaClass2jsClass(this.bUtente)+"<SCRIPT>initbaseUser();</SCRIPT>";
        if(addBaseGlobal)head+=classJsObject.javaClass2jsClass(this.bGlobale)+"<SCRIPT>initbaseGlobal();</SCRIPT>";
        if(addBasePc)head+=classJsObject.javaClass2jsClass(this.bPC)+"<SCRIPT>initbasePC();</SCRIPT>";
        if(addBaseReparti)head+=this.bReparti.getConfigurazioniReparti();
        
        try {
        	head += new classJsObject().getArrayLabel(this.getClass().getName(),this.bUtente);
        } catch (ImagoHttpException ihe) {
        	log.error(ihe);
        }

        return head+= "<title id='title'>" + getTitle() + "</title></head>";
    }

    protected abstract String getBody();
    
    protected abstract String getTitle();

    
    protected final String getFoot() throws Exception{
        String foot="";
        for(int i=0;i<lstJs.size();i++)foot+=lstJs.get(i);
        return foot+getBottomScript();
    }

    protected abstract String getBottomScript() throws Exception;

    protected final void setLink()throws Exception {
		String servletName = this.getClass().getName();
		String done = (String) CacheTabExtFiles.getObject(servletName);
		if (done == null) {
			StatementFromFile sff = getStatementFromFile();
			ResultSet rs = sff.executeQuery("configurazioni.xml","getTabExtFilesNoDefault",new String[]{servletName});
			while(rs.next()) {
				if (rs.getString("PATH_FILE").substring(rs.getString("PATH_FILE").length()-2,rs.getString("PATH_FILE").length()).equals("js"))
					lstJs.add("<script type='text/javascript' src='" + CacheTabExtFiles.addTimestamp(rs.getString("PATH_FILE")) + "' language='JavaScript'></script>\n");
				else
					lstCss.add("<link href='" + CacheTabExtFiles.addTimestamp(rs.getString("PATH_FILE")) + "' type='text/css' rel='stylesheet'>");
			}
			closeSff(sff);
			CacheTabExtFiles.setObject(servletName, "done");
			CacheTabExtFiles.setObject(servletName, "js", this.lstJs);
			CacheTabExtFiles.setObject(servletName, "css", this.lstCss);
		} else {
			ArrayList<String> js = (ArrayList<String>) CacheTabExtFiles.getObject(servletName, "js");
			if (js != null) {
				this.lstJs.addAll(js);
			}
			ArrayList<String> css = (ArrayList<String>) CacheTabExtFiles.getObject(servletName, "css");
			if (css != null) {
				this.lstCss.addAll(css);
			}
		}
    }
    
    protected final void setParameter(){
        String key;
        hashRequest = new Hashtable<String,String>();
        Enumeration e=hRequest.getParameterNames();
        while(e.hasMoreElements()){
            key =(String) e.nextElement();
            hashRequest.put(key,hRequest.getParameter(key));
        }

    }
    
    protected final String getFormRequest(){
        String key, form="<form id=\"EXTERN\" name=\"EXTERN\" method=\"POST\" action=\"servletGeneric\" target=\"_self\">\n";
        Enumeration e=hashRequest.keys();
        while(e.hasMoreElements()){
            key =(String) e.nextElement();
            form += "<input type=\"hidden\" id=\""+key+"\" name=\""+key+"\" value=\""+param(key)+"\"/>\n";
        }
        return form+="</form>\n";
    }
    
    protected final String param(String key){return(hashRequest.get(key)==null?"":hashRequest.get(key));}
    protected final String chkNull(String in){return(in==null? "":in);}

    protected final void setBaseObject(boolean enableBaseUser,boolean enableBaseGlobal,boolean enableBasePc,boolean enableBaseReparti ){
        setBaseUser(enableBaseUser);
        setBasePc(enableBasePc);
        setBaseGlobal(enableBaseGlobal);
        setBaseReparti(enableBaseReparti);

    }
    protected final void setBaseUser(boolean enable){this.addBaseUser=enable;}
    protected final void setBasePc(boolean enable){this.addBasePc=enable;}
    protected final void setBaseGlobal(boolean enable){this.addBaseGlobal=enable;}
    protected final void setBaseReparti(boolean enable){this.addBaseReparti=enable;}

	protected void setDocType(Class< ? extends Doctype> docType) throws InstantiationException, IllegalAccessException {
				
		if (docType != null){
			this.docType = docType.newInstance().toString();
		}else{
			this.docType = "";
		}
					
	}

	protected String getDocType(){
		return this.docType;
	}
}
