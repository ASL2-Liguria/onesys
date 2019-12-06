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

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.nio.ByteBuffer;

import javax.servlet.http.HttpServletResponse;

import matteos.utils.xml.Xsl;
import cartellaclinica.cartellaPaziente.Visualizzatore.polaris.utils.StyleSheetUtils;
import org.apache.commons.io.IOUtils;

public class generatePdfengine {

    private String encodeUrlStyleSheet ;
    private String encodeUrlDocument;
    private String decodeUrlStyleSheet;
    private String decodeUrlDocument;
    private HttpServletResponse response;

    private ElcoLoggerInterface logInterface =  new ElcoLoggerImpl(generatePdfengine.class);


    public generatePdfengine (String b64UrlDocument,String b64UrlStyleSheet){
        this.encodeUrlDocument = b64UrlDocument;
        this.encodeUrlStyleSheet = b64UrlStyleSheet;

    }
    public byte[] getPdf() throws IOException {

        byte[]  result =null;
        byte[] ss = null;
        byte[] doc = null;
        byte[] pdf = null;
        try{

            this.decodeUrlDocument = new String(Base64.base64ToByteArray(this.encodeUrlDocument));
            this.decodeUrlStyleSheet = new String(Base64.base64ToByteArray(this.encodeUrlStyleSheet));

            //this.decodeUrlStyleSheet ="http://localhost:8080/whale/ss.ss";

            doc= StyleSheetUtils.getDocumentByURI(this.decodeUrlDocument);
            ss= StyleSheetUtils.getDocumentByURI(this.decodeUrlStyleSheet);

            pdf = Xsl.xml2pdf(doc, ss);
            result=pdf;

           // FileOutputStream fos = new FileOutputStream(new File("C:/Documents and Settings/francescog.ELCO2009/Desktop/prova.pdf"));
            //fos.write(pdf);


        }/*catch (PolarisUtilsXmlException ex){
        	logInterface.error(ex.getMessage(), ex);
        }
        catch (IOException ex){
        	logInterface.error(ex.getMessage(), ex);
        }*/
        catch (Exception ex){
        	logInterface.error(ex.getMessage(), ex);
        }

        return result;
    }

    private  byte[] getByteArray(String strUrl) throws IOException {
        URL url = new URL(strUrl);
        ByteArrayOutputStream tmpOut = new ByteArrayOutputStream();
        URLConnection connection = url.openConnection();
        int contentLength = connection.getContentLength();
        InputStream in = url.openStream();
        byte[] buf = new byte[512];
        int len;
        while (true) {
            len = in.read(buf);
            if (len == -1) {
                break;
            }
            tmpOut.write(buf, 0, len);
        }
        tmpOut.close();
        IOUtils.closeQuietly(in);
        ByteBuffer bb = ByteBuffer.wrap(tmpOut.toByteArray(), 0,tmpOut.size());
        //Lines below used to test if file is corrupt        //FileOutputStream fos = new FileOutputStream("C:\\abc.pdf");
        //fos.write(tmpOut.toByteArray());

        return bb.array();
    }
}
