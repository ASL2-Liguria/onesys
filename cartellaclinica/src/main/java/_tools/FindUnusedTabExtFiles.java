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
package _tools;

import java.io.File;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import matteos.database.DbUtils;

public class FindUnusedTabExtFiles {
	
	public static enum Modes {
		files,db_path_file,db_origine;
	}

	/**
	 * @param args
	 * @throws SQLException 
	 */
	public static void main(String[] args) throws SQLException {

		if (args.length < 3) {
			usage();
			System.exit(1);
		}
		
		String connstring = args[1];
		String basepath = args[2];
		
		Connection conn = null;
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			conn = DbUtils.getConnection(connstring, "oracle.jdbc.OracleDriver");
			
			switch(Modes.valueOf(args[0])) {
			case files:
				ps = conn.prepareStatement("select count(*) from TAB_EXT_FILES where PATH_FILE=:path_file and DELETED='N'");
				System.out.println("### File senza occorrenze in TAB_EXT_FILES ###");
				String[] folders = {"std/jscript", "std/css"};
				for (int j = 0; j < folders.length; j++) {
					fromfsScanDir(basepath, folders[j], ps);
				}
				break;
			case db_path_file:
				System.out.println("### Record in TAB_EXT_FILES senza corrispondenze su filesystem ###");
				ps = conn.prepareStatement("select distinct PATH_FILE from TAB_EXT_FILES where DELETED='N' order by PATH_FILE");
				try {
					rs = ps.executeQuery();
					System.out.println("### PATH_FILE non trovati ###");
					while (rs.next()) {
						String path_file = rs.getString("PATH_FILE");
						if (!path_file.matches("^dwr.*$")) {
							String fullpath = basepath + "/" + path_file;
							File file = new File (fullpath);
							if (!file.exists()) {
								System.out.println(path_file);
							}
						}
					}
				} finally {
					DbUtils.close(rs);
					rs = null;
				}
				break;
			case db_origine: //Non sembra funzionare molto bene :(
				System.out.println("### Record in TAB_EXT_FILES senza corrispondenze su filesystem ###");
				ps = conn.prepareStatement("select distinct ORIGINE from TAB_EXT_FILES where DELETED='N' order by ORIGINE");
				try {
					rs = ps.executeQuery();
					System.out.println("### ORIGINE non trovati ###");
					while (rs.next()) {
						
						String origine = rs.getString("ORIGINE");
						if (!origine.toUpperCase().equals(origine)) {
							try {
								Class.forName(origine, false, null);
							} catch (ClassNotFoundException cnfe) {
								System.out.println(origine);
							}
						}
					}
				} finally {
					DbUtils.close(rs);
					rs = null;
				}
				break;
			default:
				System.out.println("Modo " + args[0] + " non riconosciuto.");
				usage();
				System.exit(2);
			}
		} finally {
			DbUtils.close(ps);
			DbUtils.close(conn);
		}
	}
	
	private static void fromfsScanDir(String basepath, String folder, PreparedStatement ps) throws SQLException {
		ResultSet rs = null;
		File dir = new File(basepath + "/" + folder);
		if (!dir.isDirectory())
			return;
		String[] files = dir.list();
		for (int i=0; i < files.length; i++) {
			String path_file = folder + "/" + files[i];
			String fullpath = basepath + "/" + path_file;
			File file = new File (fullpath);
			if (file.isDirectory()) {
				fromfsScanDir(basepath, path_file, ps);
			} else {
				try {
					ps.setString(1, path_file);
					rs = ps.executeQuery();
					if (rs.next() && rs.getInt(1) == 0 && notPicture(path_file)) {
						System.out.println(path_file);
					}
				} finally {
					DbUtils.close(rs);
					rs = null;
				}
			}
		}
	}
	
	private static boolean notPicture(String path_file) {
		return !(path_file.matches("([^.]+(\\.(?i)(jpg|png|gif|bmp))$)"));
	}

	private static void usage() {
		System.out.println("Usage: FindUnusedTabExtFiles <fromfs/fromdb> <connstring> <basepath>");
		System.out.println("	files: cerca ogni file su filesystem se è presente in TAB_EXT_FILES.PATH_FILE");
		System.out.println("	db_path_file: cerca in TAB_EXT_FILES dei PATH_FILE non piu' esistenti");
		System.out.println("	db_origine: cerca in TAB_EXT_FILES gli ORIGINE che non corrispondono a una classe");
	}
}
