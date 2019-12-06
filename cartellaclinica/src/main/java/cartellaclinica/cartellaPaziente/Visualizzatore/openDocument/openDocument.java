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
package cartellaclinica.cartellaPaziente.Visualizzatore.openDocument;

import imago.sql.ElcoLoggerImpl;
import imago.sql.ElcoLoggerInterface;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.Hashtable;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.bouncycastle.cms.CMSException;

import polaris.digitalsign.RetrieveSignInfo;

public class openDocument extends HttpServlet {
    private static final String CONTENT_TYPE = "text/html";
    private ServletConfig       sConfig = null;
    private ServletContext      myContext=null;
    String mimeType;
    String uri;

    private ElcoLoggerInterface logInterface =  new ElcoLoggerImpl(openDocument.class);

    //Initialize global variables
    @Override
	public void init(ServletConfig config) throws ServletException {
        super.init(config);
        sConfig = config;
        myContext = sConfig.getServletContext();
    }

    protected void processRequest(HttpServletRequest request,
                                  HttpServletResponse response) throws
            ServletException {
        response.setContentType(CONTENT_TYPE);
        String mimeType = request.getParameter("mimeType");
        String uri = request.getParameter("uri");
        String uriSS = request.getParameter("uriSS");
        String stampante = request.getParameter("stampante")==""?"":request.getParameter("stampante");
        StampaFrom stmpFrom;

        PrintWriter out = null;
        try {
            out = response.getWriter();

    //        if (request.getSession(false) != null) {

                if (mimeType.equalsIgnoreCase("application/pdf")) {
              //      CreaDocHtml Doc = new CreaDocHtml();
              //      out.println(Doc.creaDocumentoHtml(uri, "1", "S", ""));
                
                 	
					CreaDocHtml Doc = new CreaDocHtml();
//		            out.println(Doc.creaDocumentoHtml(new String(bToprint,"ISO-8859-1"), "1", "S", ""));
                    out.println(Doc.creaDocumentoHtml("http://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath()+"/openDocument?mimeType=pdfBytes&uri="+uri+"&uriSS="+uriSS, "1", "S", stampante));
					
					
                }
                //se mi arriva un mimetype del genere richiamo questa servlet con un 'requestPdfFromSS' passandogli la uri del documento (che e' in html) e la uri dei fogli di stile
                else if (mimeType.equalsIgnoreCase("text/xml_xsd")) {
                    CreaDocHtml Doc = new CreaDocHtml();
                    out.println(Doc.creaDocumentoHtml("http://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath()+"/openDocument?mimeType=requestPdfFromSS&uri="+uri+"&uriSS="+uriSS, "1", "S", ""));

                }
                else if (mimeType.equalsIgnoreCase("pdfBytes")) {
                   	byte[] docByte;
                	RetrieveSignInfo si = null;
                	byte[] bToprint = null;
                	try {
						stmpFrom=new StampaFrom(uri);
						docByte =stmpFrom.GetbyteToPrint();
						
						try {
							si = new RetrieveSignInfo();
							bToprint = Base64.base64ToByteArray(new String(si.GetPdfFromP7m(docByte),"ISO-8859-1")); // ritrova i dati senza la firma
						} catch (CMSException e) {
							// TODO Auto-generated catch block
							bToprint = docByte; // dati non firmati uso gli originali							
							e.printStackTrace();
						}
						
					} catch (StampaPdfException e) {
					
						e.printStackTrace();
					}
		            out.println(new String(bToprint,"ISO-8859-1"));
             }
                else if (mimeType.equalsIgnoreCase("requestPdfFromSS")) {

                    response.setContentType("application/pdf");

                    generatePdfengine Pdfengine = new generatePdfengine(Base64.byteArrayToBase64(uri.getBytes()),Base64.byteArrayToBase64(uriSS.getBytes()));

                    out.print(new String(Pdfengine.getPdf(),"ISO-8859-1"));

                }
                
                
                
                
                
                else {
                    if (mimeType.equalsIgnoreCase("application/octet-stream")) {
                        response.setContentType("application/msword");

                    } else {
                        response.setContentType(mimeType);
                    }

                    ServletOutputStream sOut = response.getOutputStream();

                    //            sOut.write(Qr.GetInput());

                }
     /*       }

            else {
                out.println(CSessionError.buildHTML());
            }  */

            out.close();

        } catch (IOException e) {
            out.println(e.getMessage());
            logInterface.error(e.getMessage(), e);
        }

    }
    @Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
//               System.out.println("doGet") ;
            processRequest(request, response);
    }


    @Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
//        System.out.println("doPost") ;
            processRequest(request, response);
   }

    //Clean up resources
    @Override
	public void destroy() {
    }
    public static Hashtable getObjectForm(HttpServletRequest myRequest){
    int                     i=0;
    Enumeration             paramNames =null;
    Hashtable               myHash=null;
   // log.writeInfo("Inizializzazione dei Parametri di Stampa");
    i = myRequest.getParameterMap().size();
    if (i > 0) {
        paramNames = myRequest.getParameterNames();
        myHash = new Hashtable();
        while(paramNames.hasMoreElements()) {
            String parm = (String)paramNames.nextElement();
            myHash.put(parm,myRequest.getParameter(parm));
        }
    }
    return myHash;
}





}
