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
import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Method;
import java.net.InetAddress;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.charset.Charset;
import java.security.KeyStore;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.apache.commons.io.filefilter.DirectoryFileFilter;
import org.apache.commons.io.filefilter.NotFileFilter;
import org.apache.commons.io.filefilter.TrueFileFilter;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URLEncodedUtils;
import org.apache.poi.ss.formula.functions.T;
import org.slf4j.Logger;

import com.rits.cloning.Cloner;

import elco.exceptions.ClassPathException;
import elco.exceptions.DateParseException;
import elco.exceptions.InvalidCharacterException;

/**
 * GenericUtils utilities
 *
 * @author Roberto Rizzo
 */
public final class GenericUtils {

	private GenericUtils() {
	}

	/**
	 * Verify a date using locale ITALY
	 *
	 * @param inDate
	 *            Date as a String
	 * @param before
	 *            years
	 * @param after
	 *            years
	 * @return true if inDate is a valid date and is >= (now - before) and <= (now + after)
	 */
	public static boolean isValidDate(String inDate, String format, int before, int after) {
		try {
			SimpleDateFormat dateFormat = new SimpleDateFormat(format);
			if (inDate.trim().length() != dateFormat.toPattern().length()) {
				throw new DateParseException();
			}
			dateFormat.setLenient(false);
			Date toValidate = dateFormat.parse(inDate.trim());

			Calendar calBefore = Calendar.getInstance(Locale.ITALY);
			calBefore.add(Calendar.YEAR, -before);

			Calendar calAfter = Calendar.getInstance(Locale.ITALY);
			calAfter.add(Calendar.YEAR, after);

			if (toValidate.before(calBefore.getTime())) {
				throw new DateParseException();
			}

			if (toValidate.after(calAfter.getTime())) {
				throw new DateParseException();
			}
		} catch (Exception ex) { // NOSONAR
			return false;
		}

		return true;
	}

	/**
	 * now date yyyyMMdd
	 *
	 * @return now date yyyyMMdd
	 */
	public static String getDate() {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		return sdf.format(new Date());
	}

	/**
	 * now time HH:mm
	 *
	 * @return now time HH:mm
	 */
	public static String getTime() {
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm");
		return sdf.format(new Date());
	}

	/**
	 * Convert a long to a date using locale ITALY
	 *
	 * @param dateTime
	 *            long
	 * @param format
	 *            ex. 'yyyyMMdd HH:mm'
	 * @return formatted String representing a date
	 */
	public static String longAsDate(long dateTime, String format) {
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		Calendar calendar = Calendar.getInstance(Locale.ITALY);
		calendar.setTimeInMillis(dateTime);

		return sdf.format(calendar.getTime());
	}

	/**
	 * Convert a time to a long using locale ITALY
	 *
	 * @param dateTime
	 *            'yyyyMMdd HH:mm' ex. '20121128 10:34'
	 * @return the current time as UTC milliseconds from the epoch
	 * @throws ParseException
	 */
	public static long dateAsLong(String dateTime) throws ParseException {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd HH:mm");
		Calendar calendar = Calendar.getInstance(Locale.ITALY);
		calendar.setTime(sdf.parse(dateTime));

		return calendar.getTimeInMillis();
	}

	/**
	 * Convert a time to a long using locale ITALY
	 *
	 * @param year
	 *            ex. 2012
	 * @param month
	 *            1-12 (ex. 11)
	 * @param date
	 *            1-31 (ex. 28)
	 * @param hourOfDay
	 *            0-23 (ex. 10)
	 * @param minute
	 *            0-59 (ex. 34)
	 * @return the current time as UTC milliseconds from the epoch
	 */
	public static long dateAsLong(int year, int month, int date, int hourOfDay, int minute) {
		Calendar calendar = Calendar.getInstance(Locale.ITALY);
		calendar.set(year, month - 1, date, hourOfDay, minute);

		return calendar.getTimeInMillis();
	}

	/**
	 * Return new Exception object
	 *
	 * @param object
	 *            Exception or other object type like String, int, etc.
	 * @return new Exception object
	 */
	public static Exception getException(Object object) {
		if (object instanceof Throwable) {
			return new Exception((Throwable) object);
		}

		return new Exception(String.valueOf(object));
	}

	/**
	 * Return input parameters as an array of objects
	 *
	 * @param values
	 *            values separated by ','
	 * @return array of objects
	 */
	public static Object[] getArray(Object... values) {
		return values;
	}

	/**
	 * Print application class path URIs if the log level is set to DEBUG
	 *
	 * @param logger
	 *            slf4j logger to use
	 */
	public static void printClassPath(Logger logger) {
		if (logger.isDebugEnabled()) {
			logger.debug("Classpath urls");

			ClassLoader sysClassLoader = ClassLoader.getSystemClassLoader();
			URL[] urls = ((URLClassLoader) sysClassLoader).getURLs();

			for (URL url : urls) {
				logger.debug(url.getFile());
			}
		}
	}

	/**
	 * Deep clone an Object
	 *
	 * @param source
	 *            Object to clone
	 * @return a deep clone of the source
	 */
	@SuppressWarnings("hiding")
	public static <T> T cloneObject(final T source) {
		Cloner cloner = new Cloner();
		return cloner.deepClone(source);
	}

	/**
	 * Return an InputStream for read a resource
	 *
	 * @param resourcePath
	 *            path to the resource
	 * @return an InputStream for read the resource
	 */
	public static InputStream getResourceAsStream(String resourcePath) {
		return GenericUtils.class.getClassLoader().getResourceAsStream(resourcePath);
	}

	/**
	 * Return a URL to the resource
	 *
	 * @param resourcePath
	 *            path to the resource
	 * @return a URL to the resource
	 */
	public static URL getResourceURL(String resourcePath) {
		return GenericUtils.class.getClassLoader().getResource(resourcePath);
	}

	/**
	 * Add a directory to classpath
	 *
	 * @param dir
	 *            directory to add
	 * @throws ClassPathException
	 */
	public static void addDir2ClassPath(File dir) throws ClassPathException {
		try {
			URL url = dir.toURI().toURL();
			URLClassLoader urlClassLoader = (URLClassLoader) ClassLoader.getSystemClassLoader();
			Method method = URLClassLoader.class.getDeclaredMethod("addURL", new Class[] { URL.class });
			method.setAccessible(true);
			method.invoke(urlClassLoader, new Object[] { url });
		} catch (Exception ex) {
			throw new ClassPathException(ex);
		}
	}

	/**
	 * Add a directory to classpath
	 *
	 * @param path
	 *            directory path
	 * @throws ClassPathException
	 */
	public static void addDir2ClassPath(String path) throws ClassPathException {
		addDir2ClassPath(new File(path));
	}

	/**
	 * Add a directory and its subdirectories to classpath
	 *
	 * @param path
	 *            directory path
	 * @throws ClassPathException
	 */
	public static void addSubDirs2ClassPath(String path) throws ClassPathException {
		Collection<File> dirs = org.apache.commons.io.FileUtils.listFilesAndDirs(new File(path), new NotFileFilter(TrueFileFilter.TRUE), DirectoryFileFilter.DIRECTORY);
		Iterator<File> it = dirs.iterator();
		while (it.hasNext()) {
			addDir2ClassPath(it.next());
		}
	}

	/**
	 * <p>
	 * Causes the currently executing thread to sleep (temporarily cease execution) for the specified number of milliseconds, subject to the precision and accuracy of system timers
	 * and schedulers. The thread does not lose ownership of any monitors.
	 * </p>
	 *
	 * @param millis
	 *            - the length of time to sleep in milliseconds
	 */
	public static void threadSleep(long millis) {
		try {
			Thread.sleep(millis);
		} catch (Exception ex) { // NOSONAR
		}
	}

	/**
	 * <p>
	 * Default locale: Locale.ITALY <br>
	 * Default descriptions: milliseconds/seconds/minutes/hours/days
	 * </p>
	 *
	 * @param time
	 *            time in milliseconds
	 * @return String representing: milliseconds/seconds/minutes/hours/days depending on input value
	 */
	public static String timeAsString(String time) {
		String[] descriptions = { " millisecond(s)", " second(s)", " minute(s)", " hour(s)", " day(s)" };
		return timeAsString(time, descriptions);
	}

	/**
	 * @param timeS
	 *            time in milliseconds
	 * @param descriptions
	 *            descriptions to use
	 * @return String representing: milliseconds/seconds/minutes/hours/days depending on input value
	 */
	public static String timeAsString(String timeS, String[] descriptions) {
		String retValue = "";
		double time = Double.parseDouble(timeS);
		int seconds = (int) (time / 1000) % 60;
		int minutes = (int) ((time / (1000 * 60)) % 60);
		int hours = (int) ((time / (1000 * 60 * 60)) % 24);
		int days = (int) ((time / (1000 * 60 * 60)) / 24);

		if (time <= 1000) {
			retValue = String.valueOf((long) time) + descriptions[0];
		} else if (time > 1000 && time <= 60000) {
			retValue = String.valueOf(seconds) + descriptions[1] + " " + (int) (time - (seconds * 1000)) + descriptions[0];
		} else if (time > 60000 && time < 3600000) {
			retValue = String.valueOf(minutes) + descriptions[2] + " " + seconds + descriptions[1];
		} else if (time > 3600000 && time <= 86400000) {
			retValue = String.valueOf(hours) + descriptions[3] + " " + minutes + descriptions[2];
		} else if (time > 86400000) {
			retValue = String.valueOf(days) + descriptions[4] + " " + hours + descriptions[3] + " " + minutes + descriptions[2];
		}

		return retValue;
	}

	/**
	 * @param date
	 *            Date to format
	 * @param format
	 *            format type
	 * @return formatted Date as String
	 */
	public static String formatDate(Date date, String format) {
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		return sdf.format(date);
	}

	/**
	 * <p>
	 * Create an HashMap of parameters from a String
	 * </p>
	 *
	 * @param parameters
	 *            Parameters in the form "par1=val1&par2=val2&par3=val3"
	 * @param charset
	 *            Encoding to use when decoding the parameters
	 * @return parameters as HashMap<String, String>
	 */
	public static Map<String, String> parameters2HashMap(String parameters, Charset charset) {
		List<NameValuePair> params = URLEncodedUtils.parse(parameters, charset);
		HashMap<String, String> htParameters = new HashMap<>(params.size());
		for (NameValuePair param : params) {
			htParameters.put(param.getName(), param.getValue());
		}

		return htParameters;
	}

	/**
	 * <p>
	 * Create an HashMap of parameters from a String<br>
	 * Use java virtual machine default charset<br>
	 * </p>
	 *
	 * @param parameters
	 *            Parameters in the form "par1=val1&par2=val2&par3=val3"
	 * @return parameters as HashMap<String, String>
	 */
	public static Map<String, String> parameters2HashMap(String parameters) { // NOSONAR
		return parameters2HashMap(parameters, Charset.defaultCharset());
	}

	/**
	 * Try to cast an Object to the specified Class. NULL if the Object can't be cast
	 *
	 * @param obj
	 *            object to cast
	 * @param type
	 *            used Class to cast Object
	 * @return cast object or NULL
	 */
	public static <S> S castTo(Object obj, Class<S> type) {
		S retValue = null;

		if (type.isInstance(obj)) {
			retValue = type.cast(obj);
		}

		return retValue;
	}

	/**
	 * @return the IP address of the local host.
	 */
	public static String getIpAddress() {
		String ip = "UNKNOWN";

		try {
			ip = InetAddress.getLocalHost().getHostAddress();
		} catch (Exception ex) { // NOSONAR
		}

		return ip;
	}

	/**
	 * Transform an array of type T into a fully modifiable ArrayList of type T
	 *
	 * @param array
	 *            of type T
	 * @return ArrayList of type T
	 */
	public static List<T> toArrayList(T[] array) {
		return new ArrayList<>(Arrays.asList(array));
	}

	/**
	 * Verify Italian fiscal code for natural persons
	 *
	 * @param fiscalCode
	 * @throws InvalidCharacterException
	 */
	public static void verifyItalianFiscalCodeNaturalPersons(String fiscalCode) throws InvalidCharacterException { // NOSONAR
		int length = fiscalCode.length();
		if (length != 16) {
			throw new InvalidCharacterException("Length must be 16");
		}

		String cfUpper = fiscalCode.toUpperCase();
		int[] setdisp = { 1, 0, 5, 7, 9, 13, 15, 17, 19, 21, 2, 4, 18, 20, 11, 3, 6, 8, 12, 14, 16, 10, 22, 25, 24, 23 };
		for (int index = 0; index < length; index++) {
			int character = cfUpper.charAt(index);
			if (!(character >= '0' && character <= '9' || character >= 'A' && character <= 'Z')) {
				throw new InvalidCharacterException("Invalid character");
			}
		}

		int summ = 0;
		for (int index = 1; index <= 13; index += 2) {
			int character = cfUpper.charAt(index);
			if (character >= '0' && character <= '9') {
				summ = summ + character - '0';
			} else {
				summ = summ + character - 'A';
			}
		}
		for (int index = 0; index <= 14; index += 2) {
			int character = cfUpper.charAt(index);
			if (character >= '0' && character <= '9') {
				character = character - '0' + 'A';
			}
			summ = summ + setdisp[character - 'A'];
		}

		if (summ % 26 + 'A' != cfUpper.charAt(15)) {
			throw new InvalidCharacterException("Invalid control code");
		}
	}

	/**
	 * Verify Italian fiscal code for legal persons
	 *
	 * @param fiscalCode
	 * @throws InvalidCharacterException
	 */
	public static void verifyItalianFiscalCodeLegalPersons(String fiscalCode) throws InvalidCharacterException { // NOSONAR
		if (fiscalCode.length() != 11) {
			throw new InvalidCharacterException("Length must be 11");
		}

		for (int index = 0; index < 11; index++) {
			if (fiscalCode.charAt(index) < '0' || fiscalCode.charAt(index) > '9') {
				throw new InvalidCharacterException("Invalid character");
			}
		}

		int summ = 0;
		for (int index = 0; index <= 8; index += 2) {
			summ += fiscalCode.charAt(index) - '0';
		}
		for (int index = 1; index <= 9; index += 2) {
			int character = 2 * (fiscalCode.charAt(index) - '0');
			if (character > 9) {
				character = character - 9;
			}
			summ += character;
		}

		if ((10 - summ % 10) % 10 != fiscalCode.charAt(10) - '0') {
			throw new InvalidCharacterException("Invalid control code");
		}
	}

	/**
	 * Convert a Date to String
	 *
	 * @param date
	 *            Date to convert
	 * @return empty String if date is NULL. date.toString() in any other case
	 */
	public static String dateToString(Date date) {
		if (date == null) {
			return "";
		}

		return date.toString();
	}

	/**
	 * Creates a URL object from the String representation
	 *
	 * @param spec
	 *            the String to parse as a URL
	 * @return an URL object or NULL if any error occur
	 */
	public static URL getURLSafe(String spec) {
		URL url = null;

		try {
			url = new URL(spec);
		} catch (Exception ex) { // NOSONAR
		}

		return url;
	}

	/**
	 * Load a key store and return a KeyStore object
	 *
	 * @param url
	 *            KeyStore URL (es. file:///path_to_key_store)
	 * @param password
	 *            KeyStore password
	 * @return KeyStore object
	 * @throws IOException
	 */
	public static KeyStore loadKeyStore(String url, String password)
			throws IOException {
		InputStream in = null;
		KeyStore keyStore;

		try {
			String storeType = StringUtils.endsWithIgnoreCase(url, ".P12") ? "PKCS12" : "JKS";
			keyStore = KeyStore.getInstance(storeType);
			in = new URL(url).openStream();
			keyStore.load(in, password.toCharArray());
		} catch (Exception ex) {
			throw new IOException(ex);
		} finally {
			IOUtils.closeQuietly(in);
		}

		return keyStore;
	}
}
