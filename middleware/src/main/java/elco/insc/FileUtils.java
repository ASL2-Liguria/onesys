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
package elco.insc;

import java.io.Closeable;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Date;
import java.util.Iterator;

import javax.naming.ldap.LdapContext;

import org.apache.commons.io.IOUtils;
import org.apache.commons.net.ntp.NTPUDPClient;

/**
 * FileUtils utilities
 *
 * @author Roberto Rizzo
 */
public final class FileUtils {

	private FileUtils() {
	}

	/**
	 * Add, if necessary, a '/' at the end of the path
	 *
	 * @param path
	 * @return add '/' at the end of the path if not present
	 */
	public static String verifyPath(String path) {
		if (path.endsWith(File.separator)) {
			return path;
		}

		return path + File.separator;
	}

	/**
	 * If the file name doesn't end with a specific extension add the extension to the file name
	 *
	 * @param file
	 *            file path
	 * @param extension
	 *            extension
	 * @return file path
	 */
	public static String verifyExtension(String file, String extension) {
		String newFile = file;
		if (!newFile.toLowerCase().endsWith(extension.toLowerCase())) {
			newFile += extension;
		}

		return newFile;
	}

	/**
	 * Get absolute path of the actual directory
	 *
	 * @return absolute path of the actual directory
	 */
	public static String getAbsolutePath() {
		return verifyPath((new File("")).getAbsolutePath());
	}

	/**
	 * Save a byte[] into a file
	 *
	 * @param filePath
	 *            file path
	 * @param data
	 *            bye[] to save
	 * @throws IOException
	 */
	public static void saveByteArray(String filePath, byte[] data) throws IOException {
		try (FileOutputStream fos = new FileOutputStream(filePath);) {
			IOUtils.write(data, fos);
		}
	}

	/**
	 * Save a byte[] into a file. The parent directory will be created if it does not exist
	 *
	 * @param filePath
	 *            file path
	 * @param data
	 *            bye[] to save
	 * @throws IOException
	 */
	public static void openSaveByteArray(String filePath, byte[] data) throws IOException {
		FileOutputStream fos = null;

		try {
			fos = org.apache.commons.io.FileUtils.openOutputStream(new File(filePath));
			IOUtils.write(data, fos);
		} finally {
			IOUtils.closeQuietly(fos);
		}
	}

	/**
	 * Append a byte[] at the end of a file
	 *
	 * @param filePath
	 *            file path
	 * @param data
	 *            byte[] to save
	 * @throws IOException
	 */
	public static void appendByteArray(String filePath, byte[] data) throws IOException {
		try (FileOutputStream fos = new FileOutputStream(filePath, true);) {
			IOUtils.write(data, fos);
		}
	}

	/**
	 * Append a byte[] at the end of a file. The parent directory will be created if it does not exist
	 *
	 * @param filePath
	 *            file path
	 * @param data
	 *            string to save
	 * @throws IOException
	 */
	public static void openAppendByteArray(String filePath, String data) throws IOException {
		FileOutputStream fos = null;

		try {
			fos = org.apache.commons.io.FileUtils.openOutputStream(new File(filePath), true);
			IOUtils.write(data, fos, Constants.DEFAULT_VM_CHARSET);
		} finally {
			IOUtils.closeQuietly(fos);
		}
	}

	/**
	 * Load file content as byte[]
	 *
	 * @param filePath
	 *            file path
	 * @return content as byte[]
	 * @throws IOException
	 */
	public static byte[] loadByteArray(String filePath) throws IOException {
		byte[] read = null;

		try (FileInputStream fis = new FileInputStream(filePath);) {
			read = IOUtils.toByteArray(fis);
		}

		return read;
	}

	/**
	 * Save a String into a file. Default VM charset
	 *
	 * @param filePath
	 *            file path
	 * @param data
	 *            string to save
	 * @throws IOException
	 */
	public static void saveString(String filePath, String data) throws IOException {
		try (FileOutputStream fos = new FileOutputStream(filePath);) {
			IOUtils.write(data, fos, Constants.DEFAULT_VM_CHARSET);
		}
	}

	/**
	 * Save a String into a file. The parent directory will be created if it does not exist. Default VM charset
	 *
	 * @param filePath
	 *            file path
	 * @param data
	 *            string to save
	 * @throws IOException
	 */
	public static void openSaveString(String filePath, String data) throws IOException {
		FileOutputStream fos = null;

		try {
			fos = org.apache.commons.io.FileUtils.openOutputStream(new File(filePath));
			IOUtils.write(data, fos, Constants.DEFAULT_VM_CHARSET);
		} finally {
			IOUtils.closeQuietly(fos);
		}
	}

	/**
	 * Append a String at the end of a of file. Default VM charset
	 *
	 * @param filePath
	 *            file path
	 * @param data
	 *            string to save
	 * @throws IOException
	 */
	public static void appendString(String filePath, String data) throws IOException {
		try (FileOutputStream fos = new FileOutputStream(filePath, true);) {
			IOUtils.write(data, fos, Constants.DEFAULT_VM_CHARSET);
		}
	}

	/**
	 * Append a String at the end of a file. The parent directory will be created if it does not exist. Default VM charset
	 *
	 * @param filePath
	 *            file path
	 * @param data
	 *            string to save
	 * @throws IOException
	 */
	public static void openAppendString(String filePath, String data) throws IOException {
		FileOutputStream fos = null;

		try {
			fos = org.apache.commons.io.FileUtils.openOutputStream(new File(filePath), true);
			IOUtils.write(data, fos, Constants.DEFAULT_VM_CHARSET);
		} finally {
			IOUtils.closeQuietly(fos);
		}
	}

	/**
	 * Load file content as String
	 *
	 * @param filePath
	 *            file path
	 * @param characterset
	 *            character set
	 * @return file content as String
	 * @throws IOException
	 */
	public static String loadString(String filePath, String characterset) throws IOException {
		String read;

		try (FileInputStream fis = new FileInputStream(filePath);) {
			read = IOUtils.toString(fis, characterset);
		}

		return read;
	}

	/**
	 * Load file content as String. Default VM charset
	 *
	 * @param filePath
	 *            file path
	 * @return file content as String
	 * @throws IOException
	 */
	public static String loadString(String filePath) throws IOException {
		String read;

		try (FileInputStream fis = new FileInputStream(filePath);) {
			read = IOUtils.toString(fis, Constants.DEFAULT_VM_CHARSET);
		}

		return read;
	}

	/**
	 * Delete a file
	 *
	 * @param filePath
	 *            file path
	 * @return true if the file or directory was deleted, otherwise false
	 */
	public static boolean deleteFile(String filePath) {
		return deleteFile(new File(filePath));
	}

	/**
	 * Delete a file
	 *
	 * @param file
	 *            file to delete
	 * @return true if the file or directory was deleted, otherwise false
	 */
	public static boolean deleteFile(File file) {
		return org.apache.commons.io.FileUtils.deleteQuietly(file);
	}

	/**
	 * Tests if the specified File is newer than the specified Date.
	 *
	 * @param file
	 *            the File of which the modification date must be compared, must not be null
	 * @param date
	 *            the date reference, must not be null
	 * @return true if the File exists and has been modified after the given Date
	 * @throws IllegalArgumentException
	 *             - if the file is null
	 */
	public static boolean isFileNewer(File file, Date date) {
		return org.apache.commons.io.FileUtils.isFileNewer(file, date);
	}

	/**
	 * Tests if the specified File is newer than the specified time reference.
	 *
	 * @param file
	 *            the File of which the modification date must be compared, must not be null
	 * @param timeMillis
	 *            the time reference measured in milliseconds since the epoch (00:00:00 GMT, January 1, 1970)
	 * @return true if the File exists and has been modified after the given time reference
	 * @throws IllegalArgumentException
	 *             - if the file is null
	 */
	public static boolean isFileNewer(File file, long timeMillis) {
		return org.apache.commons.io.FileUtils.isFileNewer(file, timeMillis);
	}

	/**
	 * Tests if the specified File is older than the specified Date.
	 *
	 * @param file
	 *            the File of which the modification date must be compared, must not be null
	 * @param date
	 *            the date reference, must not be null
	 * @return true if the File exists and has been modified before the given Date
	 * @throws IllegalArgumentException
	 *             - if the file is null
	 */
	public static boolean isFileOlder(File file, Date date) {
		return org.apache.commons.io.FileUtils.isFileOlder(file, date);
	}

	/**
	 * @param file
	 *            the File of which the modification date must be compared, must not be null
	 * @param timeMillis
	 *            the time reference measured in milliseconds since the epoch (00:00:00 GMT, January 1, 1970)
	 * @return true if the File exists and has been modified before the given time reference
	 * @throws IllegalArgumentException
	 *             - if the file is null
	 */
	public static boolean isFileOlder(File file, long timeMillis) {
		return org.apache.commons.io.FileUtils.isFileOlder(file, timeMillis);
	}

	/**
	 * Return the last modification date of the specified File
	 *
	 * @param file
	 *            the File of which the modification date must be returned, must not be null
	 * @return last modification date
	 */
	public static Date lastModificationDate(File file) {
		return new Date(file.lastModified());
	}

	/**
	 * Return the last modification date of the specified File <br>
	 * Since 6.0.5
	 *
	 * @param path
	 *            path to the file of which the modification date must be returned, must not be null
	 * @return last modification date
	 */
	public static Date lastModificationDate(String path) {
		return lastModificationDate(new File(path));
	}

	/**
	 * Copy a file (over 2GB)
	 *
	 * @param sourceFile
	 *            source file path
	 * @param destFile
	 *            destination file path
	 * @throws IOException
	 */
	public static void copyFile(String sourceFile, String destFile) throws IOException {
		try (FileInputStream fis = new FileInputStream(sourceFile); FileOutputStream fos = new FileOutputStream(destFile);) {
			copyStream(fis, fos);
		}
	}

	/**
	 * Copy a file (over 2GB)
	 *
	 * @param sourceFile
	 *            source file path
	 * @param destFile
	 *            destination file path
	 * @return true if success, false in any other case
	 */
	public static boolean copyFileQuietly(String sourceFile, String destFile) {
		boolean result = false;

		try (FileInputStream fis = new FileInputStream(sourceFile); FileOutputStream fos = new FileOutputStream(destFile);) {
			copyStream(fis, fos);
			result = true;
		} catch (Exception ex) { // NOSONAR
		}

		return result;
	}

	/**
	 * Copy a file (over 2GB)
	 *
	 * @param sourceStream
	 *            source stream
	 * @param destStream
	 *            destination stream
	 * @throws IOException
	 */
	public static void copyStream(InputStream sourceStream, OutputStream destStream) throws IOException {
		IOUtils.copyLarge(sourceStream, destStream);
	}

	/**
	 * Move a file (over 2GB)
	 *
	 * @param sourceFile
	 *            source file path
	 * @param destFile
	 *            destination file path
	 * @throws IOException
	 */
	public static void moveFile(String sourceFile, String destFile) throws IOException {
		copyFile(sourceFile, destFile);
		deleteFile(sourceFile);
	}

	/**
	 * Implements the same behavior as the "touch" utility on Unix
	 *
	 * @param file
	 *            file to "touch"
	 * @throws IOException
	 */
	public static void touch(String file) throws IOException {
		org.apache.commons.io.FileUtils.touch(new File(file));
	}

	/**
	 * Tests whether the file or directory denoted by this abstract pathname exists
	 *
	 * @param filePath
	 *            path to file
	 * @return true if and only if the file or directory denoted by this abstract pathname exists; false otherwise
	 */
	public static boolean exists(String filePath) {
		return (new File(filePath)).exists();
	}

	/**
	 * Tests whether the application can read the file denoted by this abstract pathname
	 *
	 * @param filePath
	 *            path to file
	 * @return true if and only if the file specified by this abstract pathname exists and can be read by the application; false otherwise
	 */
	public static boolean canRead(String filePath) {
		return (new File(filePath)).canRead();
	}

	/**
	 * Tests whether the application can modify the file denoted by this abstract pathname
	 *
	 * @param filePath
	 *            path to file
	 * @return true if and only if the file system actually contains a file denoted by this abstract pathname and the application is allowed to write to the file; false otherwise
	 */
	public static boolean canWrite(String filePath) {
		return (new File(filePath)).canWrite();
	}

	/**
	 * <p>
	 * Makes a directory, including any necessary but nonexistent parent directories. If a file already exists with specified name but it is not a directory then an IOException is
	 * thrown. If the directory cannot be created then an IOException is thrown.
	 * </p>
	 *
	 * @param directory
	 *            directory to create, must not be null
	 * @throws IOException
	 *             if the directory cannot be created or the file already exists but is not a directory
	 */
	public static void mkDir(String directory) throws IOException {
		org.apache.commons.io.FileUtils.forceMkdir(new File(directory));
	}

	/**
	 * <p>
	 * Makes a directory, including any necessary but nonexistent parent directories. If a file already exists with specified name but it is not a directory then an IOException is
	 * thrown. If the directory cannot be created then an IOException is thrown.
	 * </p>
	 *
	 * @param directory
	 *            directory to create, must not be null
	 * @return true if the directory was created, false in any other case
	 */
	public static boolean mkDirQuietly(String directory) {
		boolean retValue = false;

		try {
			mkDir(directory);
			retValue = true;
		} catch (Exception ex) { // NOSONAR
		}

		return retValue;
	}

	/**
	 * <p>
	 * Allows iteration over the files in a given directory (and optionally its subdirectories) which match an array of extensions.
	 * </p>
	 *
	 * @param directory
	 *            the directory to search in
	 * @param recursive
	 *            if true all subdirectories are searched as well
	 * @param extensions
	 *            a list of extensions, ex. "java","xml". If this parameter is null, all files are returned
	 * @return an iterator of java.io.File with the matching files
	 */
	public static Iterator<File> iterateFiles(String directory, boolean recursive, String... extensions) {
		return iterateFiles(new File(directory), recursive, extensions);
	}

	/**
	 * <p>
	 * Allows iteration over the files in a given directory (and optionally its subdirectories) which match an array of extensions.
	 * </p>
	 *
	 * @param directory
	 *            the directory to search in
	 * @param recursive
	 *            if true all subdirectories are searched as well
	 * @param extensions
	 *            a list of extensions, ex. "java","xml". If this parameter is null, all files are returned
	 * @return an iterator of java.io.File with the matching files
	 */
	public static Iterator<File> iterateFiles(File directory, boolean recursive, String... extensions) {
		return org.apache.commons.io.FileUtils.iterateFiles(directory, extensions, recursive);
	}

	/**
	 * Unconditionally close an NTPUDPClient. Equivalent to NTPUDPClient.close(), except any exceptions will be ignored. This is typically used in finally blocks.
	 *
	 * @param client
	 */
	public static void safeClose(NTPUDPClient client) {
		try {
			client.close();
		} catch (Exception ex) { // NOSONAR
		}
	}

	/**
	 * Unconditionally close an InputStream. Equivalent to InputStream.close(), except any exceptions will be ignored. This is typically used in finally blocks.
	 *
	 * @param inputStream
	 */
	public static void safeClose(InputStream inputStream) {
		org.apache.commons.io.IOUtils.closeQuietly(inputStream);
	}

	/**
	 * Unconditionally close an OutputStream. Equivalent to OutputStream.close(), except any exceptions will be ignored. This is typically used in finally blocks.
	 *
	 * @param outputStream
	 */
	public static void safeClose(OutputStream outputStream) {
		org.apache.commons.io.IOUtils.closeQuietly(outputStream);
	}

	/**
	 * Unconditionally close a Closeable. Equivalent to Closeable.close(), except any exceptions will be ignored. This is typically used in finally blocks.
	 *
	 * @param closeable
	 */
	public static void safeClose(Closeable closeable) {
		org.apache.commons.io.IOUtils.closeQuietly(closeable);
	}

	/**
	 * Unconditionally close a LdapContext. Equivalent to LdapContext.close(), except any exceptions will be ignored. This is typically used in finally blocks.
	 *
	 * @param context
	 */
	public static void safeClose(LdapContext context) {
		try {
			context.close();
		} catch (Exception ex) { // NOSONAR
		}
	}

	/**
	 * Returns the size of the specified file or directory. If the provided File is a regular file, then the file's length is returned. If the argument is a directory, then the
	 * size of the directory is calculated recursively. If a directory or subdirectory is security restricted, its size will not be included.
	 *
	 * @param filePath
	 *            the regular file or directory to return the size of (must not be null).
	 * @return the length of the file, or recursive size of the directory, provided (in bytes).
	 * @throws NullPointerException
	 *             - if the file is null
	 * @throws IllegalArgumentException
	 *             - if the file does not exist.
	 */
	public static long sizeOf(String filePath) {
		return org.apache.commons.io.FileUtils.sizeOf(new File(filePath));
	}

	/**
	 * Counts the size of a directory recursively (sum of the length of all files).
	 *
	 * @param directoryPath
	 *            directory to inspect, must not be null
	 * @return size of directory in bytes, 0 if directory is security restricted, a negative number when the real total is greater than Long.MAX_VALUE.
	 * @throws NullPointerException
	 *             - if the directory is null
	 */
	public static long sizeOfDirectory(String directoryPath) {
		return org.apache.commons.io.FileUtils.sizeOfDirectory(new File(directoryPath));
	}

	/**
	 * Append a file to another
	 *
	 * @param sourcePath
	 *            file to append
	 * @param destPath
	 *            file to append to
	 * @throws IOException
	 */
	public static void openAppendFile(String sourcePath, String destPath) throws IOException {
		FileInputStream fis = null;
		FileOutputStream fos = null;

		try {
			fis = org.apache.commons.io.FileUtils.openInputStream(new File(sourcePath));
			fos = org.apache.commons.io.FileUtils.openOutputStream(new File(destPath), true);
			IOUtils.copyLarge(fis, fos);
		} finally {
			IOUtils.closeQuietly(fos);
			IOUtils.closeQuietly(fis);
		}
	}

	/**
	 * Return last modification time of a file
	 *
	 * @param filePath
	 * @return Date
	 */
	public static Date getLastModificationTime(String filePath) {
		return getLastModificationTime(new File(filePath));
	}

	/**
	 * Return last modification time of a file
	 *
	 * @param file
	 * @return Date
	 */
	public static Date getLastModificationTime(File file) {
		return new Date(file.lastModified());
	}
}
