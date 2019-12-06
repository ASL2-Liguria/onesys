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
package cartellaclinica.cartellaPaziente.Visualizzatore.polaris.utils;

//import org.apache.http.client.HttpClient;
import java.io.IOException;

import org.apache.commons.httpclient.DefaultHttpMethodRetryHandler;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpMethod;
import org.apache.commons.httpclient.URI;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.apache.http.HttpStatus;
import org.apache.http.client.ClientProtocolException;



/**
 * Classe contenente funzioni per la gestione dei fogli di stile sul repository
 *
 * @author robertor
 */
public class StyleSheetUtils {

	/**
	 * Script per la gestione dell'upload di un foglio di stile
	 */
	public static String	phpFileUpload	= "uploadStyleSheet.php";

	/**
	 * Script per la verifica dell'esistenza di un foglio di stile tramite hash
	 */
	public static String	phpFileVerify	= "existsStyleSheetFile.php?hash=";

	/**
	 * Script per il recupero di un foglio di stile tramite hash
	 */
	public static String	phpFileByHash	= "getStyleSheetByHash.php?hash=";

	/**
	 * URI del registry dove si trovano gli script di gestione
	 */
	public static String	baseURI			= null;

	/**
	 * Invia il foglio di stile sul registry
	 *
	 * @param data
	 *            - bytes foglio di stile
	 * @return - URI al foglio di stile inviato od un'eccezione se fallisse
	 * @throws ClientProtocolException
	 * @throws IOException
	 */
	/*public static synchronized String sendStyleSheet(byte[] data) throws ClientProtocolException, IOException {
		String result = null;
		HttpClient httpclient = null;

		try {
			httpclient = new DefaultHttpClient();
			httpclient.getParams().setParameter(CoreProtocolPNames.PROTOCOL_VERSION, HttpVersion.HTTP_1_1);

			MultipartEntity mpEntity = new MultipartEntity();
			InputStreamBody isb = new InputStreamBody(new ByteArrayInputStream(data), "text/xml");
			mpEntity.addPart("styleSheetFile", isb);

			HttpPost httppost = new HttpPost(baseURI + phpFileUpload);

			httppost.setEntity(mpEntity);
			HttpResponse response = httpclient.execute(httppost);
			StatusLine statusLine = response.getStatusLine();
			int statusCode = statusLine.getStatusCode();
			if (statusCode == HttpStatus.SC_OK) {
				HttpEntity resEntity = response.getEntity();
				if (resEntity != null) {
					result = EntityUtils.toString(resEntity);
					resEntity.consumeContent();
				} else {
					throw (new IOException("Can't get response"));
				}
			} else {
				throw (new IOException("Error: " + statusCode + " --> " + statusLine.getReasonPhrase()));
			}
		} catch (IOException ex) {
			throw (ex);
		} finally {
			if (httpclient != null) httpclient.getConnectionManager().shutdown();
		}

		return result;
	}*/

	/**
	 * Verifica se il foglio di stile esiste gia' sul registry utilizzando il suo hash
	 *
	 * @param hash
	 *            - hash del foglio di stile da ricercare
	 * @return - URI al foglio di stile ricercato od una eccezione nel caso il file non esistesse
	 * @throws ClientProtocolException
	 * @throws IOException
	 */
	public static synchronized String existsStyleSheet(String hash) throws ClientProtocolException, IOException {
		byte[] resultByte = executeURI(baseURI + phpFileVerify + hash);

		return (new String(resultByte));
	}

	/**
	 * Recupera un foglio di stile
	 *
	 * @param URI
	 *            - URI al foglio di stile da recuperare
	 * @return - foglio di stile come array di byte od una eccezione nel caso il file non esistesse
	 * @throws IOException
	 */
	public static synchronized byte[] getDocumentByURI(String URI) throws IOException {
		byte[] result = executeURI(URI);

		return result;
	}

	/**
	 * Recupera un foglio di stile partendo da un hash
	 *
	 * @param hash
	 *            - hash del foglio di stile da recuperare
	 * @return - foglio di stile come array di byte od una eccezione nel caso il file non esistesse
	 * @throws IOException
	 */
	public static synchronized byte[] getDocumentByHash(String hash) throws IOException {
		byte[] result = executeURI(baseURI + phpFileByHash + hash);

		return result;
	}

	/**
	 * Recupera un documento
	 *
	 * @param URI
	 *            - URI al documento da recuperare
	 * @return - documento come array di byte
	 * @throws IOException
	 */
	private static synchronized byte[] executeURI(String URI) throws IOException {
		byte[] result = null;
		HttpClient httpclient = null;

		try {
			httpclient = new HttpClient();

                        HttpMethod method = new GetMethod(URI);
                        method.getParams().setParameter(HttpMethodParams.RETRY_HANDLER,
                                                        new DefaultHttpMethodRetryHandler(3, true));

                        method.setFollowRedirects(true);

                        int statusCode = httpclient.executeMethod(method);
                        if (statusCode == HttpStatus.SC_MOVED_TEMPORARILY){
                            method.setURI(new URI(method.getURI().getScheme(),method.getURI().getUserinfo(),method.getURI().getHost(),method.getURI().getPort(),method.getResponseHeaders(
                                    "Location")[0].getValue()));

                            statusCode = httpclient.executeMethod(method);
                        }

			if (statusCode == HttpStatus.SC_OK) {
                            result =method.getResponseBody();
			} else{
                                throw (new IOException("Error: " + statusCode + " --> " + method.getStatusLine()));


			}
                    } catch (HttpException e) {
                        e.printStackTrace();
                        throw e;
                    } catch (IOException e) {
                        e.printStackTrace();
                        throw e;
                    } finally {
                        if (httpclient != null) httpclient.getHttpConnectionManager().closeIdleConnections(0);

		}

		return result;
	}
}
