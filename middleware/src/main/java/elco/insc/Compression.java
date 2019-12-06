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

import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.zip.Deflater;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import org.apache.commons.compress.archivers.sevenz.SevenZArchiveEntry;
import org.apache.commons.compress.archivers.sevenz.SevenZOutputFile;
import org.apache.commons.compress.archivers.zip.ZipArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveOutputStream;
import org.apache.commons.io.IOUtils;

/**
 * Compression utilities
 *
 * @author Roberto Rizzo
 */
public final class Compression {

	private Compression() {
	}

	/**
	 * Zip the input array and create an Entry "content"
	 *
	 * @param input
	 * @return compressed input
	 * @throws IOException
	 */
	public static byte[] zip(byte[] input) throws IOException {
		ByteArrayOutputStream compressed = new ByteArrayOutputStream();
		ZipOutputStream zos = new ZipOutputStream(compressed);
		ZipEntry ze = new ZipEntry("content");
		zos.putNextEntry(ze);
		zos.write(input);
		zos.closeEntry();
		zos.close();

		return compressed.toByteArray();
	}

	/**
	 * UnZip the input array retrieving the first Entry
	 *
	 * @param input
	 * @return uncompressed input
	 * @throws IOException
	 */
	public static byte[] unzip(byte[] input) throws IOException {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		ZipInputStream compressed = new ZipInputStream(new ByteArrayInputStream(input));
		compressed.getNextEntry();
		int rBytes;
		byte[] read = new byte[1024];
		while ((rBytes = compressed.read(read)) > 0) {
			baos.write(read, 0, rBytes);
		}
		compressed.closeEntry();
		compressed.close();

		return baos.toByteArray();
	}

	/**
	 * UnZip a file into a directory
	 *
	 * @param zipFile
	 *            compressed file
	 * @param outputFolder
	 *            output folder
	 * @throws IOException
	 */
	public static void unZip2Dir(String zipFile, String outputFolder) throws IOException {
		byte[] buffer = new byte[1024];

		// create output directory is not exists
		File folder = new File(outputFolder);
		if (!folder.exists()) {
			folder.mkdir();
		}

		// get the zip file content
		ZipInputStream zis = new ZipInputStream(new FileInputStream(zipFile)); // NOSONAR
		// get the zipped file list entry
		ZipEntry ze = zis.getNextEntry();

		String fileName;
		File newFile;
		int len;
		while (ze != null) {
			fileName = ze.getName();
			newFile = new File(outputFolder + File.separator + fileName);

			// create all non exists folders else you will hit FileNotFoundException for compressed folder
			new File(newFile.getParent()).mkdirs();
			FileOutputStream fos = new FileOutputStream(newFile); // NOSONAR

			while ((len = zis.read(buffer)) > 0) {
				fos.write(buffer, 0, len);
			}

			fos.close();
			ze = zis.getNextEntry();
		}

		zis.closeEntry();
		zis.close();
	}

	/**
	 * <p>
	 * Convenience's function. 7Zip a directory. If it is a root directory, the path doesn't exists or isn't a directory throw an IOException
	 * </p>
	 * <p>
	 * The destination file name is created using directory name. For ex.: for directory c:\test\data will be created a file named c:\test\data.7z
	 * </p>
	 *
	 * @param dirPath
	 *            directory path
	 * @return 7z file path
	 * @throws IOException
	 */
	public static String sevenZipCompress(String dirPath) throws IOException {
		String outputFile;
		File dir = new File(dirPath);
		if (dir.isDirectory()) {
			String parent = dir.getParent();
			if (parent != null) {
				outputFile = FileUtils.verifyPath(parent) + dir.getName() + Constants.SEVENZIPFILEEXTENSION;
				sevenZipFileSystemObject(dirPath, outputFile);
			} else {
				throw new IOException("Can't compress a root directory");
			}
		} else {
			throw new IOException("The path name doesn't exists or isn't a directory");
		}

		return outputFile;
	}

	private static void sevenZipFileSystemObject(String sourcePath, String destFile) throws IOException {
		try (SevenZOutputFile zOut = new SevenZOutputFile(new File(FileUtils.verifyExtension(destFile, Constants.SEVENZIPFILEEXTENSION)));) {
			addFileToSevenZip(zOut, sourcePath, "", true);
		}
	}

	private static void addFileToSevenZip(SevenZOutputFile zOut, String path, String base, boolean isBaseDir) throws IOException {
		File file = new File(path);
		String entryName = base + file.getName();

		if (file.isFile()) {
			FileInputStream fInputStream = null;
			try { // NOSONAR
				SevenZArchiveEntry zipEntry = zOut.createArchiveEntry(file, entryName);
				zOut.putArchiveEntry(zipEntry);
				fInputStream = new FileInputStream(file);
				byte[] buffer = new byte[102400];
				int len = 0;
				while ((len = fInputStream.read(buffer)) > 0) {
					zOut.write(buffer, 0, len);
				}
				zOut.closeArchiveEntry();
			} finally {
				IOUtils.closeQuietly(fInputStream);
			}
		} else {
			if (!isBaseDir) {
				SevenZArchiveEntry zipEntry = zOut.createArchiveEntry(file, entryName);
				zOut.putArchiveEntry(zipEntry);
				zOut.closeArchiveEntry();
				entryName = FileUtils.verifyPath(entryName);
			} else {
				entryName = "";
			}

			File[] children = file.listFiles();
			if (children != null) {
				for (File child : children) {
					addFileToSevenZip(zOut, child.getAbsolutePath(), entryName, false);
				}
			}
		}
	}

	/**
	 * GZip the input array
	 *
	 * @param input
	 * @return compressed input
	 * @throws IOException
	 */
	public static byte[] gzip(byte[] input) throws IOException {
		ByteArrayOutputStream compressed = new ByteArrayOutputStream();

		GZIPOutputStream gzos = new GZIPOutputStream(compressed);
		gzos.write(input);
		gzos.close();

		return compressed.toByteArray();
	}

	/**
	 * UnGzip the input array
	 *
	 * @param input
	 * @return uncompressed input
	 * @throws IOException
	 */
	public static byte[] ungzip(byte[] input) throws IOException {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		GZIPInputStream compressed = new GZIPInputStream(new ByteArrayInputStream(input));
		int rBytes;
		byte[] read = new byte[1024];
		while ((rBytes = compressed.read(read)) > 0) {
			baos.write(read, 0, rBytes);
		}
		compressed.close();

		return baos.toByteArray();
	}

	/**
	 * <p>
	 * Convenience's function. Zip a Directory and delete compressed files. If it is a root directory, the path doesn't exists or isn't a directory throw an IOException
	 * </p>
	 * <p>
	 * The destination file name is created using directory name. For ex.: for directory c:\test\data will be created a file named c:\test\data.zip
	 * </p>
	 *
	 * @param sourcePath
	 *            Source directory
	 * @param days
	 *            days. Only files with 'modification date' <= (now - _days) will be compressed
	 * @throws IOException
	 */
	public static void zipDirectory(String sourcePath, long days) throws IOException {
		File dir = new File(sourcePath);
		if (dir.isDirectory()) {
			String parent = dir.getParent();
			if (parent != null) {
				long dateCopy = System.currentTimeMillis() - (days * Constants.MILLISECONDSINDAY);
				zipFileSystemObject(sourcePath, FileUtils.verifyPath(parent) + dir.getName() + Constants.ZIPFILEEXTENSION, dateCopy, true);
			} else {
				throw new IOException("Can't compress a root directory");
			}
		} else {
			throw new IOException("The path name doesn't exists or isn't a directory");
		}
	}

	/**
	 * <p>
	 * Convenience's function. Zip a file system resource, file or directory. No filter on last modified time. No source file will be deleted.
	 * </p>
	 * <p>
	 * Destination name = 'source name' + '.zip'
	 * </p>
	 *
	 * @param sourcePath
	 *            resource to zip
	 * @throws IOException
	 */
	public static void zip(String sourcePath) throws IOException {
		zip(sourcePath, sourcePath + ".zip");
	}

	/**
	 * <p>
	 * Convenience's function. Zip a file system resource, file or directory. No filter on last modified time. No source file will be deleted
	 * </p>
	 *
	 * @param sourcePath
	 *            resource to zip
	 * @param destFile
	 *            destination File
	 * @throws IOException
	 */
	public static void zip(String sourcePath, String destFile) throws IOException {
		zipFileSystemObject(sourcePath, destFile, 0, false);
	}

	/**
	 * <p>
	 * Zip a file system resource, file or directory
	 * </p>
	 * <p>
	 * If _dateCopy is NULL zip all files never mind modification date. Else zip all files newer or equal _dateCopy
	 * </p>
	 * <p>
	 * If _deleteFiles is true source file/s will be deleted. If the resource is a file it will be deleted. If the resource is a directory all files in it will be deleted
	 * </p>
	 *
	 * @param sourcePath
	 *            resource to zip
	 * @param destFile
	 *            destination File
	 * @param dateCopy
	 *            'yyyyMMdd HH:mm' ex. '20121128 10:34'. NULL to disable time filter
	 * @param deleteFiles
	 *            delete source file/s
	 * @throws IOException
	 */
	public static void zip(String sourcePath, String destFile, String dateCopy, boolean deleteFiles) throws IOException {
		try {
			long dateCopyLong = 0L;
			if (dateCopy != null) {
				dateCopyLong = GenericUtils.dateAsLong(dateCopy);
			}
			zipFileSystemObject(sourcePath, destFile, dateCopyLong, deleteFiles);
		} catch (Exception ex) {
			throw new IOException(ex);
		}
	}

	/**
	 * <p>
	 * Zip a file system resource, file or directory
	 * </p>
	 * <p>
	 * Only files with 'modification date' <= (now - _days) will be compressed
	 * </p>
	 * <p>
	 * If _deleteFiles is true source file/s will be deleted. If the resource is a file it will be deleted. If the resource is a directory all files in it will be deleted
	 * </p>
	 *
	 * @param sourcePath
	 *            resource to zip
	 * @param destFile
	 *            destination File
	 * @param days
	 *            days. Only files with 'modification date' <= (now - _days) will be compressed
	 * @param deleteFiles
	 *            delete source file/s
	 * @throws IOException
	 */
	public static void zip(String sourcePath, String destFile, long days, boolean deleteFiles) throws IOException {
		zipFileSystemObject(sourcePath, destFile, System.currentTimeMillis() - (days * Constants.MILLISECONDSINDAY), deleteFiles);
	}

	private static void zipFileSystemObject(String sourcePath, String destFile, long dateCopy, boolean deleteFiles) throws IOException {
		long dateCopyUsed = System.currentTimeMillis();
		if (dateCopy > 0) {
			dateCopyUsed = dateCopy;
		}

		try (FileOutputStream fOut = new FileOutputStream(new File(FileUtils.verifyExtension(destFile, Constants.ZIPFILEEXTENSION)));
				BufferedOutputStream bOut = new BufferedOutputStream(fOut);
				ZipArchiveOutputStream zOut = new ZipArchiveOutputStream(bOut);) {
			zOut.setLevel(Deflater.BEST_COMPRESSION);
			addFileToZip(zOut, sourcePath, "", dateCopyUsed, deleteFiles);
		}
	}

	private static void addFileToZip(ZipArchiveOutputStream zOut, String path, String base, long dateCopy, boolean deleteFiles) throws IOException {
		File file = new File(path);
		String entryName = base + file.getName();

		if (file.isFile()) {
			if (file.lastModified() <= dateCopy) {
				FileInputStream fInputStream = null;
				try { // NOSONAR
					ZipArchiveEntry zipEntry = new ZipArchiveEntry(file, entryName);
					zOut.putArchiveEntry(zipEntry);
					fInputStream = new FileInputStream(file);
					IOUtils.copy(fInputStream, zOut);
					zOut.closeArchiveEntry();
				} finally {
					IOUtils.closeQuietly(fInputStream);
				}
				if (deleteFiles) {
					file.delete();
				}
			}
		} else {
			ZipArchiveEntry zipEntry = new ZipArchiveEntry(file, entryName);
			zOut.putArchiveEntry(zipEntry);
			zOut.closeArchiveEntry();

			File[] children = file.listFiles();
			if (children != null) {
				for (File child : children) {
					addFileToZip(zOut, child.getAbsolutePath(), FileUtils.verifyPath(entryName), dateCopy, deleteFiles);
				}
			}
		}
	}
}
