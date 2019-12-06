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
package test;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Scanner;


/**
 * Created by matteo.pipitone on 29/09/2015.
 */
public class  findQueryNotUsed {

    public findQueryNotUsed(){
         super();
    }

    private File webapp;
    private File Query;


    public static void listFilesForFolder(final File folder, String pathToSearch) throws FileNotFoundException {

        for (final File fileEntry : folder.listFiles()) {

            if (fileEntry.isDirectory()) {
                listFilesForFolder(fileEntry,pathToSearch  );
            } else {

                if(!fileEntry.getName().equals("query_ps.xml")
                    &&
                    !fileEntry.getName().equals("query_cce.xml")
                    &&
                    !fileEntry.getName().equals("query_config_ps.xml")
                    &&
                    !fileEntry.getName().equals("query_order_entry.xml")
                    &&
                    !fileEntry.getName().equals("query_wk_mmg.xml")
                    &&
                    !fileEntry.getName().equals("query_wk_ps.xml")
                    &&
                    !fileEntry.getName().equals("query_mmg.xml")
                ){
                    final Scanner scanner = new Scanner(fileEntry);
                    while (scanner.hasNextLine()) {
                        final String lineFromFile = scanner.nextLine();
                        if(lineFromFile.contains(pathToSearch)) {
                            System.out.println(pathToSearch + " Match in file -> " +fileEntry.getPath());
                            return;
                        }
                    }
                }
            }
        }

    }

    public void checkQuery() throws ParserConfigurationException, IOException, SAXException {
        File query_ps = this.Query;

        DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
        DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
        Document doc = dBuilder.parse(query_ps);
        doc.getDocumentElement().normalize();

        NodeList nList = doc.getElementsByTagName("QUERY");
        System.out.println("File Analizzato -> " + query_ps.getName());
        for (int temp = 0; temp < nList.getLength(); temp++) {

            Node nNode = nList.item(temp);

            if (nNode.getNodeType() == Node.ELEMENT_NODE) {
                Element eElement = (Element) nNode;
                String ID = eElement.getAttribute("id");
                System.out.println("\nCurrent Element : " + ID);
                listFilesForFolder(this.webapp, ID);
            }
        }

    }

    public static void main (String[] args) throws IOException, SAXException, ParserConfigurationException {


        findQueryNotUsed obj = new findQueryNotUsed();
        /*obj.setQuery(new File(args[0]));
        obj.setWebapp(new File(args[1]));
        obj.checkQuery();                 */
        obj.setWebapp(new File("C:\\\\Users\\\\matteopi\\\\IdeaProject\\\\fenix-web-ps\\\\src\\\\main\\\\webapp"));

        obj.setQuery(new File("src/main/webapp/config/caronte/query_cce.xml"));
        obj.checkQuery();

        obj.setQuery(new File("src/main/webapp/config/caronte/query_config_ps.xml"));
        obj.checkQuery();

        obj.setQuery(new File("src/main/webapp/config/caronte/query_mmg.xml"));
        obj.checkQuery();

        obj.setQuery(new File("src/main/webapp/config/caronte/query_order_entry.xml"));
        obj.checkQuery();

        obj.setQuery(new File("src/main/webapp/config/caronte/query_ps.xml"));
        obj.checkQuery();

        obj.setQuery(new File("src/main/webapp/config/caronte/query_wk_mmg.xml"));
        obj.checkQuery();

        obj.setQuery(new File("src/main/webapp/config/caronte/query_wk_ps.xml"));
        obj.checkQuery();

    }


    public File getWebapp() {
        return webapp;
    }

    public void setWebapp(File webapp) {
        this.webapp = webapp;
    }

    public File getQuery() {
        return Query;
    }

    public void setQuery(File query) {
        Query = query;
    }
}
