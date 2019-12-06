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

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.security.KeyStore;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.neethi.builders.converters.ConverterException;
import org.dcm4che2.data.DicomObject;
import org.dcm4che2.data.Tag;
import org.dcm4che2.data.UID;
import org.dcm4che2.iod.value.Modality;
import org.dcm4che2.net.PDVInputStream;
import org.dcm4che2.util.CloseUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.Ostermiller.util.CircularByteBuffer;

import ch.qos.logback.classic.Level;
import elco.dicom.commons.TLSInterface;
import elco.dicom.converter.DICOMConverter;
import elco.dicom.objects.image.ImageInterface;
import elco.dicom.objects.image.JpegImage;
import elco.dicom.objects.image.PngImage;
import elco.dicom.sc.Dicom2CDA;
import elco.dicom.sc.Dicom2Jpeg;
import elco.dicom.sc.Dicom2Mpeg;
import elco.dicom.sc.Dicom2Pdf;
import elco.dicom.sc.ExtractEncapsulated;
import elco.dicom.utils.IOUtils;
import elco.dicom.utils.ObjectsUtils;
import elco.exceptions.DICOMException;
import elco.middleware.camel.beans.Config;
import elco.middleware.camel.beans.DICOMXMLDocument;

/**
 * DICOM utilities
 *
 * @author Roberto Rizzo
 */
public final class DICOM {

	private static final Logger logger = LoggerFactory.getLogger(DICOM.class);

	private DICOM() {
	}

	/**
	 * Convert DICOM object into an DICOMXMLDocument
	 *
	 * @param dObj
	 *            DicomObject to convert
	 * @param addComments
	 *            Add comments to XML
	 * @param characterSet
	 *            Character set to use
	 * @return DICOMXMLDocument object representing the dicom object
	 * @throws DICOMException
	 */
	public static DICOMXMLDocument dicomObject2XMLDocument(DicomObject dObj, boolean addComments, String characterSet) throws DICOMException {
		try {
			DICOMConverter dconv = new DICOMConverter(dObj, null);
			dconv.setComments(addComments);
			dconv.setEncoding(characterSet);
			return DICOMXMLDocument.getDocument(new String(dconv.convert(), characterSet), characterSet);
		} catch (Exception ex) {
			throw new DICOMException(ex);
		}
	}

	/**
	 * Convert DICOM object into an DICOMXMLDocument
	 * <p>
	 * Character set default vm
	 * </p>
	 *
	 * @param dObj
	 *            DicomObject to convert
	 * @param addComments
	 *            Add comments to XML
	 * @return DICOMXMLDocument object representing the dicom object
	 * @throws DICOMException
	 */
	public static DICOMXMLDocument dicomObject2XMLDocument(DicomObject dObj, boolean addComments) throws DICOMException {
		return dicomObject2XMLDocument(dObj, addComments, Constants.DEFAULT_VM_CHARSET);
	}

	/**
	 * Convert DICOM object into an DICOMXMLDocument. No comments are added to XML
	 * <p>
	 * Character set default vm
	 * </p>
	 *
	 * @param dObj
	 *            DicomObject to convert
	 * @return DICOMXMLDocument object representing the dicom object
	 * @throws DICOMException
	 */
	public static DICOMXMLDocument dicomObject2XMLDocument(DicomObject dObj) throws DICOMException {
		return dicomObject2XMLDocument(dObj, false);
	}

	/**
	 * Convert DICOM object into an DICOMXMLDocument excluding pixel data
	 *
	 * @param filePath
	 *            DICOM file path
	 * @param addComments
	 *            Add comments to XML
	 * @param characterSet
	 *            Character set to use
	 * @return DICOMXMLDocument object representing the dicom object
	 * @throws DICOMException
	 */
	public static DICOMXMLDocument dicomObject2XMLDocument(String filePath, boolean addComments, String characterSet) throws DICOMException {
		try {
			DicomObject dObj = DICOM.loadDicomObjectNoPixelData(filePath);
			return dicomObject2XMLDocument(dObj, addComments, characterSet);
		} catch (IOException | DICOMException ex) {
			throw new DICOMException(ex);
		}
	}

	/**
	 * Convert DICOM object into an DICOMXMLDocument excluding pixel data
	 * <p>
	 * Character set default vm
	 * </p>
	 *
	 * @param filePath
	 *            DICOM file path
	 * @param addComments
	 *            Add comments to XML
	 * @return DICOMXMLDocument object representing the dicom object
	 * @throws DICOMException
	 */
	public static DICOMXMLDocument dicomObject2XMLDocument(String filePath, boolean addComments) throws DICOMException {
		return dicomObject2XMLDocument(filePath, addComments, Constants.DEFAULT_VM_CHARSET);
	}

	/**
	 * Convert DICOM object into an DICOMXMLDocument excluding pixel data. No comments are added to XML
	 * <p>
	 * Character set default vm
	 * </p>
	 *
	 * @param filePath
	 *            DICOM file path
	 * @return DICOMXMLDocument object representing the dicom object
	 * @throws DICOMException
	 */
	public static DICOMXMLDocument dicomObject2XMLDocument(String filePath) throws DICOMException {
		return dicomObject2XMLDocument(filePath, false);
	}

	/**
	 * Convert DICOM object into an XML String excluding pixel data
	 * <p>
	 * Character set default vm
	 * </p>
	 *
	 * @param dObj
	 *            DicomObject to convert
	 * @param addComments
	 *            Add comments to XML
	 * @return String object representing the dicom object
	 * @throws DICOMException
	 */
	public static String dicomObject2XMLString(DicomObject dObj, boolean addComments) throws DICOMException {
		return dicomObject2XMLDocument(dObj, addComments).toString();
	}

	/**
	 * Convert DICOM object into an XML String excluding pixel data. No comments are added to XML
	 * <p>
	 * Character set default vm
	 * </p>
	 *
	 * @param dObj
	 *            DicomObject to convert
	 * @return String object representing the dicom object
	 * @throws DICOMException
	 */
	public static String dicomObject2XMLString(DicomObject dObj) throws DICOMException {
		return dicomObject2XMLString(dObj, false);
	}

	/**
	 * Download and remove PixelData from a DicomObject
	 *
	 * @param remoteAET
	 *            remote AETitle
	 * @param affectedSOPClassUID
	 *            SOPClassUID
	 * @param affectedSOPInstanceUID
	 *            SOPInstanceUID
	 * @param tsuid
	 *            TransferSyntaxUID
	 * @param dataStream
	 *            Object stream
	 * @param inMemory
	 *            true operation is done in memory - false original DICOM object is saved to disk
	 * @param removeOriginal
	 *            true remove downloaded object, false leaves object on disk. Used only if _inMemory == false
	 * @return DicomObject without PixelData
	 * @throws DICOMException
	 */
	public static DicomObject getDicomObjectWithoutPixelData(String remoteAET, String affectedSOPClassUID, String affectedSOPInstanceUID, String tsuid, PDVInputStream dataStream,
			boolean inMemory, boolean removeOriginal) throws DICOMException {
		DicomObject dObj = null;
		OutputStream os = null;
		InputStream is = null;
		CircularByteBuffer cbb = null;
		String filePath = null;

		try {
			if (inMemory) {
				cbb = new CircularByteBuffer(CircularByteBuffer.INFINITE_SIZE);
				os = cbb.getOutputStream();
				is = cbb.getInputStream();
			} else {
				filePath = Constants.dicomDownloads + remoteAET + "_" + tsuid + "_" + affectedSOPClassUID + "_" + affectedSOPInstanceUID + Constants.dicomFileExtension;
				os = org.apache.commons.io.FileUtils.openOutputStream(new File(filePath));
				is = new FileInputStream(filePath);
			}

			IOUtils.pdvInputStream2OutputStream(dataStream, affectedSOPClassUID, affectedSOPInstanceUID, tsuid, os);
			CloseUtils.safeClose(os);

			dObj = IOUtils.loadDicomObjectNoPixelData(is);
			CloseUtils.safeClose(is);
		} catch (Exception ex) {
			throw new DICOMException(ex);
		} finally {
			CloseUtils.safeClose(os);
			CloseUtils.safeClose(is);

			if (inMemory) {
				if (cbb != null) {
					cbb.clear();
				}
			} else {
				if (removeOriginal) {
					elco.insc.FileUtils.deleteFile(filePath);
				}
			}
		}

		return dObj;
	}

	/**
	 * Download and remove PixelData from a DicomObject
	 *
	 * @param headers
	 *            Camel headers
	 * @param dataStream
	 *            Object stream
	 * @param inMemory
	 *            true operation is done in memory - false original DICOM object is saved to disk
	 * @param removeOriginal
	 *            true remove downloaded object, false leaves object on disk. Used only if inMemory == false
	 * @return DicomObject without PixelData
	 * @throws DICOMException
	 */
	public static DicomObject getDicomObjectWithoutPixelData(Map<String, Object> headers, PDVInputStream dataStream, boolean inMemory, boolean removeOriginal)
			throws DICOMException {
		String remoteAET = (String) headers.get("remoteAET");
		String affectedSOPClassUID = (String) headers.get("affectedSOPClassUID");
		String affectedSOPInstanceUID = (String) headers.get("affectedSOPInstanceUID");
		String tsuid = (String) headers.get("tsuid");

		return getDicomObjectWithoutPixelData(remoteAET, affectedSOPClassUID, affectedSOPInstanceUID, tsuid, dataStream, inMemory, removeOriginal);
	}

	/**
	 * Copy a PDV input stream to an output stream
	 *
	 * @param dataStream
	 *            Object stream
	 * @param outputStream
	 *            destination stream
	 * @param headers
	 *            DICOM headers
	 * @throws IOException
	 */
	public static void pdvInputStream2OutputStream(PDVInputStream dataStream, OutputStream outputStream, Map<String, Object> headers) throws IOException {
		IOUtils.pdvInputStream2OutputStream(dataStream, (String) headers.get("affectedSOPClassUID"), (String) headers.get("affectedSOPInstanceUID"), (String) headers.get("tsuid"),
				outputStream);
	}

	/**
	 * Create a DicomObject from a PDV input stream
	 *
	 * @param dataStream
	 *            Object stream
	 * @param affectedSOPClassUID
	 *            SOPClassUID
	 * @param affectedSOPInstanceUID
	 *            SOPInstanceUID
	 * @param tsuid
	 *            TransferSyntaxUID
	 * @return DICOM object
	 * @throws IOException
	 */
	public static DicomObject toDicomObject(PDVInputStream dataStream, String affectedSOPClassUID, String affectedSOPInstanceUID, String tsuid) throws IOException {
		return ObjectsUtils.toDicomObject(dataStream, affectedSOPClassUID, affectedSOPInstanceUID, tsuid);
	}

	/**
	 * Create a DicomObject from a PDV input stream
	 *
	 * @param dataStream
	 *            Object stream
	 * @param headers
	 *            Camel headers
	 * @return DICOM object
	 * @throws IOException
	 */
	public static DicomObject toDicomObject(PDVInputStream dataStream, Map<String, Object> headers) throws IOException {
		return toDicomObject(dataStream, (String) headers.get("affectedSOPClassUID"), (String) headers.get("affectedSOPInstanceUID"), (String) headers.get("tsuid"));
	}

	/**
	 * Copy a PDV input stream to a file
	 *
	 * @param dataStream
	 *            Object stream
	 * @param filePath
	 *            Destination file path
	 * @param headers
	 *            DICOM headers
	 * @throws IOException
	 */
	public static void pdvInputStream2File(PDVInputStream dataStream, String filePath, Map<String, Object> headers) throws IOException {
		FileOutputStream fos = null;
		try {
			fos = FileUtils.openOutputStream(new File(filePath));
			pdvInputStream2OutputStream(dataStream, fos, headers);
		} finally {
			elco.insc.FileUtils.safeClose(fos);
		}
	}

	/**
	 * Copy a PDV input stream to Middleware default location (dicomDownloads/)
	 *
	 * @param dataStream
	 * @param headers
	 * @return File path
	 * @throws IOException
	 */
	public static String pdvInputStream2File(PDVInputStream dataStream, Map<String, Object> headers) throws IOException {
		String threadID = String.valueOf(Thread.currentThread().getId());
		String remoteAET = (String) headers.get("remoteAET");
		String affectedSOPInstanceUID = (String) headers.get("affectedSOPInstanceUID");
		String filePath = Constants.dicomDownloads + threadID + "_" + remoteAET + "_" + affectedSOPInstanceUID + "_" + System.currentTimeMillis() + Constants.dicomFileExtension;

		pdvInputStream2File(dataStream, filePath, headers);

		return filePath;
	}

	/**
	 * Load a DicomObject removing pixel data
	 *
	 * @param filePath
	 *            File path
	 * @return DicomObject
	 * @throws IOException
	 */
	public static DicomObject loadDicomObjectNoPixelData(String filePath) throws IOException {
		return IOUtils.loadDicomObjectNoPixelData(filePath);
	}

	/**
	 * Load a DicomObject from a byte[]
	 *
	 * @param dicomObject
	 * @return DicomObject
	 * @throws IOException
	 */
	public static DicomObject loadDicomObjectNoPixelData(byte[] dicomObject) throws IOException {
		return IOUtils.loadDicomObjectNoPixelData(dicomObject);
	}

	/**
	 * Convert a dicom object image to a png. Hide any exception
	 *
	 * @param dicomObject
	 *            DicomObject to convert
	 * @param prState
	 *            DicomObject presentation state to use during conversion (can be NULL)
	 * @return ImageInterface
	 */
	public static ImageInterface toPngSafe(DicomObject dicomObject, DicomObject prState) {
		PngImage png = null;

		try {
			png = new PngImage(dicomObject, prState, false);
			png.create();
		} catch (Exception ex) {
			png = null;
			logger.debug("toPngSafe", ex);
		}

		return png;
	}

	/**
	 * Convert a dicom object image to a png. Hide any exception
	 *
	 * @param dicomObject
	 *            DicomObject to convert
	 * @param prState
	 *            DicomObject presentation state to use during conversion (can be NULL)
	 * @param width
	 *            New image width
	 * @param height
	 *            New image height
	 * @param mantainRatio
	 *            Mantain ratio
	 * @return ImageInterface
	 */
	public static ImageInterface toPngSafe(DicomObject dicomObject, DicomObject prState, int width, int height, boolean mantainRatio) {
		PngImage png = null;

		try {
			png = new PngImage(dicomObject, prState, false);
			png.setImageSize(width, height);
			png.setImageMantainRatio(mantainRatio);
			png.create();
		} catch (Exception ex) {
			png = null;
			logger.debug("toPngSafe", ex);
		}

		return png;
	}

	/**
	 * Convert a dicom object image to a png. Hide any exception
	 *
	 * @param filePath
	 *            path to dicom object file
	 * @return ImageInterface
	 */
	public static ImageInterface toPngSafe(String filePath) {
		DicomObject dObj = null;

		try {
			dObj = loadDicomObject(filePath);
		} catch (Exception ex) {
			logger.debug("toPngSafe", ex);
		}

		return toPngSafe(dObj, null);
	}

	/**
	 * Convert a dicom object image to a png. Hide any exception
	 *
	 * @param filePath
	 *            path to dicom object file
	 * @param width
	 *            New image width
	 * @param height
	 *            New image height
	 * @param mantainRatio
	 *            Mantain ratio
	 * @return ImageInterface
	 */
	public static ImageInterface toPngSafe(String filePath, int width, int height, boolean mantainRatio) {
		DicomObject dObj = null;

		try {
			dObj = loadDicomObject(filePath);
		} catch (Exception ex) {
			logger.debug("toPngSafe", ex);
		}

		return toPngSafe(dObj, null, width, height, mantainRatio);
	}

	/**
	 * Convert a dicom object image to a jpeg. Hide any exception
	 *
	 * @param dicomObject
	 *            DicomObject to convert
	 * @param prState
	 *            DicomObject presentation state to use during conversion (can be NULL)
	 * @param createThumbnail
	 *            Create thumbnail
	 * @return ImageInterface
	 */
	public static ImageInterface toJpegSafe(DicomObject dicomObject, DicomObject prState, boolean createThumbnail) {
		JpegImage jpg = null;

		try {
			jpg = new JpegImage(dicomObject, prState, createThumbnail);
			jpg.create();
		} catch (Exception ex) {
			jpg = null;
			logger.debug("toJpegSafe", ex);
		}

		return jpg;
	}

	/**
	 * Convert a dicom object image to a jpeg. Hide any exception
	 *
	 * @param dicomObject
	 *            DicomObject to convert
	 * @param prState
	 *            DicomObject presentation state to use during conversion (can be NULL)
	 * @return ImageInterface
	 */
	public static ImageInterface toJpegSafe(DicomObject dicomObject, DicomObject prState) {
		return toJpegSafe(dicomObject, prState, false);
	}

	/**
	 * Convert a dicom object image to a jpeg. Hide any exception
	 *
	 * @param dicomObject
	 *            DicomObject to convert
	 * @param prState
	 *            DicomObject presentation state to use during conversion (can be NULL)
	 * @param width
	 *            New image width
	 * @param height
	 *            New image height
	 * @param mantainRatio
	 *            Mantain ratio
	 * @param createThumbnail
	 *            Create thumbnail
	 * @return ImageInterface
	 */
	public static ImageInterface toJpegSafe(DicomObject dicomObject, DicomObject prState, int width, int height, boolean mantainRatio, boolean createThumbnail) {
		JpegImage jpg = null;

		try {
			jpg = new JpegImage(dicomObject, prState, createThumbnail);
			jpg.setImageSize(width, height);
			jpg.setImageMantainRatio(mantainRatio);
			jpg.create();
		} catch (Exception ex) {
			jpg = null;
			logger.debug("toJpegSafe", ex);
		}

		return jpg;
	}

	/**
	 * Convert a dicom object image to a jpeg. Hide any exception
	 *
	 * @param dicomObject
	 *            DicomObject to convert
	 * @param prState
	 *            DicomObject presentation state to use during conversion (can be NULL)
	 * @param width
	 *            New image width
	 * @param height
	 *            New image height
	 * @param mantainRatio
	 *            Mantain ratio
	 * @return ImageInterface
	 */
	public static ImageInterface toJpegSafe(DicomObject dicomObject, DicomObject prState, int width, int height, boolean mantainRatio) {
		return toJpegSafe(dicomObject, prState, width, height, mantainRatio, false);
	}

	/**
	 * Convert a dicom object image to a jpeg. Hide any exception
	 *
	 * @param filePath
	 *            path to dicom object file
	 * @return ImageInterface
	 */
	public static ImageInterface toJpegSafe(String filePath) {
		DicomObject dObj = null;

		try {
			dObj = loadDicomObject(filePath);
		} catch (Exception ex) {
			logger.debug("toJpegSafe", ex);
		}

		return toJpegSafe(dObj, null);
	}

	/**
	 * Convert a dicom object image to a jpeg. Hide any exception
	 *
	 * @param filePath
	 *            path to dicom object file
	 * @param createThumbnail
	 *            thumbnail
	 * @return ImageInterface
	 */
	public static ImageInterface toJpegSafe(String filePath, boolean createThumbnail) {
		DicomObject dObj = null;

		try {
			dObj = loadDicomObject(filePath);
		} catch (Exception ex) {
			logger.debug("toJpegSafe", ex);
		}

		return toJpegSafe(dObj, null, createThumbnail);
	}

	/**
	 * Convert a dicom object image to a jpeg. Hide any exception
	 *
	 * @param filePath
	 *            path to dicom object file
	 * @param width
	 *            New image width
	 * @param height
	 *            New image height
	 * @param mantainRatio
	 *            Mantain ratio
	 * @return ImageInterface
	 */
	public static ImageInterface toJpegSafe(String filePath, int width, int height, boolean mantainRatio) {
		DicomObject dObj = null;

		try {
			dObj = loadDicomObject(filePath);
		} catch (Exception ex) {
			logger.debug("toJpegSafe", ex);
		}

		return toJpegSafe(dObj, null, width, height, mantainRatio);
	}

	/**
	 * Load a DicomObject from a file
	 *
	 * @param filePath
	 *            path to the file
	 * @return DicomObject
	 * @throws IOException
	 */
	public static DicomObject loadDicomObject(String filePath) throws IOException {
		return IOUtils.loadDicomObject(filePath);
	}

	/**
	 * Save an array of bytes to file system
	 *
	 * @param filePath
	 *            path to the file
	 * @param array
	 *            array of bytes
	 */
	public static void saveByteArraySafe(String filePath, byte[] array) {
		try {
			IOUtils.saveByteArray(filePath, array);
		} catch (IOException ex) {
			logger.debug("saveByteArraySafe", ex);
		}
	}

	/**
	 * Convert the DICOM object read from the file into a jpeg image and save it. Save thumbnail too
	 *
	 * @param filePath
	 *            DICOM object file path
	 * @throws IOException
	 */
	public static void convertAndSaveImageAsJpeg(String filePath) throws IOException {
		ImageInterface image = null;

		try {
			image = DICOM.toJpegSafe(filePath);

			if (image == null) {
				throw new ConverterException("DICOM.convertAndSaveImageAsJpeg: Can't convert DICOM object to jpeg");
			}

			String imagePath = FileNameUtils.getFullPathWithoutExtension(filePath) + "." + image.getImageType();
			String thumbnailPath = FileNameUtils.getFullPathWithoutExtension(filePath) + "_thumbnail" + "." + image.getImageType();

			DICOM.saveByteArraySafe(imagePath, image.getImage());
			DICOM.saveByteArraySafe(thumbnailPath, image.getThumbnail());
		} finally {
			if (image != null) {
				image.freeResources();
			}
		}
	}

	/*
	 * extract encapsulated object
	 */
	private static String extractEncapsulated(String filePath, String extension, ExtractEncapsulated ee) throws IOException {
		String destFilePath = FileNameUtils.getFullPathWithoutExtension(filePath) + extension;
		FileOutputStream fos = null;

		try {
			fos = new FileOutputStream(destFilePath);
			IOUtils.InputStream2OutputStream(ee.getInputStream(), fos);
		} finally {
			if (ee != null) {
				ee.closeStreams();
			}
			CloseUtils.safeClose(fos);
		}

		return destFilePath;
	}

	/**
	 * Extract an encapsulated mpeg to a file
	 *
	 * @param filePath
	 *            DICOM file path
	 * @param oUID
	 *            SOPClass
	 * @return mpeg file path
	 * @throws IOException
	 */
	public static String extractMpeg(String filePath, String oUID) throws IOException {
		return extractEncapsulated(filePath, ".mpg", new Dicom2Mpeg(filePath, oUID));
	}

	/**
	 * Extract an encapsulated jpeg to a file
	 *
	 * @param filePath
	 *            DICOM file path
	 * @param oUID
	 *            SOPClass
	 * @return jpeg file path
	 * @throws IOException
	 */
	public static String extractJpeg(String filePath, String oUID) throws IOException {
		return extractEncapsulated(filePath, ".jpg", new Dicom2Jpeg(filePath, oUID));
	}

	/**
	 * Extract an encapsulated pdf to a file
	 *
	 * @param filePath
	 *            DICOM file path
	 * @param oUID
	 *            SOPClass
	 * @return pdf file path
	 * @throws IOException
	 */
	public static String extractPdf(String filePath, String oUID) throws IOException {
		return extractEncapsulated(filePath, ".pdf", new Dicom2Pdf(filePath, oUID));
	}

	/**
	 * Extract an encapsulated CDA to a file
	 *
	 * @param filePath
	 *            DICOM file path
	 * @param oUID
	 *            SOPClass
	 * @return CDA file path
	 * @throws IOException
	 */
	public static String extractCDA(String filePath, String oUID) throws IOException {
		return extractEncapsulated(filePath, ".xml", new Dicom2CDA(filePath, oUID));
	}

	/**
	 * Supported transfer syntax
	 * <p>
	 * MPEG2<br>
	 * MPEG2MainProfileHighLevel<br>
	 * MPEG4AVCH264BDCompatibleHighProfileLevel41<br>
	 * MPEG4AVCH264HighProfileLevel41<br>
	 * </p>
	 *
	 * @param tsuid
	 *            Transfer Syntax UID
	 * @return true if it is an encapsulated Mpeg
	 */
	public static boolean isEncapsulatedMpeg(String tsuid) {
		if (tsuid.equals(UID.MPEG2) || tsuid.equals(UID.MPEG2MainProfileHighLevel) || tsuid.equals(UID.MPEG4AVCH264BDCompatibleHighProfileLevel41)
				|| tsuid.equals(UID.MPEG4AVCH264HighProfileLevel41)) {
			return true;
		}

		return false;
	}

	/**
	 * Supported transfer syntax
	 * <p>
	 * JPEG2000<br>
	 * JPEG2000LosslessOnly<br>
	 * JPEG2000Part2MultiComponent<br>
	 * JPEG2000Part2MultiComponentLosslessOnly<br>
	 * JPEGBaseline1<br>
	 * JPEGLossless<br>
	 * JPEGLSLossyNearLossless<br>
	 * </p>
	 *
	 * @param tsuid
	 *            Transfer Syntax UID
	 * @return true if it is an encapsulated Jpeg
	 */
	public static boolean isEncapsulatedJpeg(String tsuid) {
		if (tsuid.equals(UID.JPEG2000) || tsuid.equals(UID.JPEG2000LosslessOnly) || tsuid.equals(UID.JPEG2000Part2MultiComponent) // NOSONAR
				|| tsuid.equals(UID.JPEG2000Part2MultiComponentLosslessOnly) || tsuid.equals(UID.JPEGBaseline1) || tsuid.equals(UID.JPEGLossless) // NOSONAR
				|| tsuid.equals(UID.JPEGLSLossyNearLossless)) { // NOSONAR
			return true;
		}

		return false;
	}

	/**
	 * Supported transfer syntax
	 * <p>
	 * EncapsulatedCDAStorage<br>
	 * </p>
	 *
	 * @param tsuid
	 *            Transfer Syntax UID
	 * @return true if it is an encapsulated CDC
	 */
	public static boolean isEncapsulatedCDA(String tsuid) {
		if (tsuid.equals(UID.EncapsulatedCDAStorage)) {
			return true;
		}

		return false;
	}

	/**
	 * Supported transfer syntax
	 * <p>
	 * EncapsulatedPDFStorage<br>
	 * </p>
	 *
	 * @param tsuid
	 *            Transfer Syntax UID
	 * @return true if it is an encapsulated PDF
	 */
	public static boolean isEncapsulatedPdf(String tsuid) {
		if (tsuid.equals(UID.EncapsulatedPDFStorage)) {
			return true;
		}

		return false;
	}

	/**
	 * Convert a tag name (integer value) to its hexadecimal representation
	 *
	 * @param tag
	 *            Tag name (ex. Tag.AccessionNumber)
	 * @return hexadecimal representation (ex. 00080050)
	 */
	public static String tagName2HexValue(int tag) {
		return StringUtils.leftPad(Integer.toHexString(tag), 8, '0');
	}

	/**
	 * Set level for DICOM loggers ('elco.dicom', 'org.dcm4che2')
	 */
	public static void setDICOMLoggersLevel(Level level) {
		if (!LogbackUtils.getLoggerEffectiveLevel("elco.dicom").equals(level)) {
			LogbackUtils.setLoggerLevel("elco.dicom", level);
		}

		if (!LogbackUtils.getLoggerEffectiveLevel("org.dcm4che2").equals(level)) {
			LogbackUtils.setLoggerLevel("org.dcm4che2", level);
		}
	}

	/**
	 * @param dObject
	 *            DicomObject
	 * @return true if the dObject is a DICOM PR
	 */
	public static boolean isDicomPR(DicomObject dObject) {
		return dObject.getString(Tag.Modality).equalsIgnoreCase(Modality.PR);
	}

	/**
	 * Get DICOM PR ReferencedImageStudyUID
	 *
	 * @param dObject
	 *            DicomObject
	 * @return ReferencedImageStudyUID
	 */
	public static String getPRReferencedImageStudyUID(DicomObject dObject) {
		return ObjectsUtils.getPRReferencedImageStudyUID(dObject);
	}

	/**
	 * Get DICOM PR ReferencedImageSeriesUID
	 *
	 * @param dObject
	 *            DicomObject
	 * @return ReferencedImageSeriesUID
	 */
	public static String getPRReferencedImageSeriesUID(DicomObject dObject) {
		return ObjectsUtils.getPRReferencedImageSeriesUID(dObject);
	}

	/**
	 * Get DICOM PR ReferencedSOPInstanceUID
	 *
	 * @param dObject
	 *            DicomObject
	 * @return ReferencedSOPInstanceUID
	 */
	public static String getPRReferencedSOPInstanceUID(DicomObject dObject) {
		return ObjectsUtils.getPRReferencedImageUID(dObject);
	}

	/**
	 * TLS configuration utility
	 *
	 * @param tls
	 *            Object supporting TLSInterface
	 * @param config
	 *            Config object
	 */
	public static void tlsConfiguration(TLSInterface tls, Config config) { // NOSONAR
		try {
			if (config != null) {
				String chiper = config.getStringQuietly("chiper");
				if (chiper != null) {
					if ("NULL".equals(chiper)) { // NOSONAR
						tls.setTlsWithoutEncyrption();
					} else if ("3DES".equals(chiper)) {
						tls.setTls3DES_EDE_CBC();
					} else if ("AES".equals(chiper)) {
						tls.setTlsAES_128_CBC();
					}
				}

				String protocol = config.getStringQuietly("protocol");
				if (protocol != null) {
					tls.setTlsProtocol(StringUtils.split(protocol, ","));
				}

				String clientauth = config.getStringQuietly("clientauth");
				if (clientauth != null) {
					tls.setTlsNeedClientAuth(Boolean.parseBoolean(clientauth));
				}

				String keystore = config.getStringQuietly("keystore");
				String keystorepwd = config.getStringQuietly("keystorepwd");

				String keypwd = config.getStringQuietly("keypwd");

				String truststore = config.getStringQuietly("truststore");
				String truststorepwd = config.getStringQuietly("truststorepwd");

				if (keystore != null && keystorepwd != null && truststore != null && truststorepwd != null) {
					KeyStore keyStore = GenericUtils.loadKeyStore(keystore, keystorepwd);
					KeyStore trustStore = GenericUtils.loadKeyStore(truststore, truststorepwd);
					tls.initDeviceTLS(keyStore, keypwd != null ? keypwd.toCharArray() : keystorepwd.toCharArray(), trustStore);
				}
			}
		} catch (Exception ex) {
			logger.error("", ex);
		}
	}
}
