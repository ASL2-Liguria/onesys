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
package elco.manager;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import java.util.stream.Stream;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import elco.insc.FileNameUtils;
import elco.insc.GenericUtils;

/**
 * {@link ClassLoader}
 *
 * @author Roberto Rizzo
 */
public final class JarFileClassLoader extends ClassLoader {

	private static final Logger logger = LoggerFactory.getLogger(JarFileClassLoader.class);
	private static final String JARFILEEXTENSION = ".jar";
	private static final String FILETYPEEXTENSION = ".class";
	private String paths;
	private final List<File> jarFilesList = new ArrayList<>();
	private final List<File> noJarFilesList = new ArrayList<>();
	private final Map<String, String> packagesJar = new ConcurrentHashMap<>();
	private long creationTime;

	static {
		boolean result = ClassLoader.registerAsParallelCapable();
		if (!result) {
			logger.warn("JarFileClassLoader.registrationFailed");
		}
	}

	/**
	 * @param paths
	 *            Semicolon separated list of paths to directories
	 */
	public JarFileClassLoader(String paths) {
		init(paths);
	}

	/**
	 * @param paths
	 *            Semicolon separated list of paths to directories
	 * @param parent
	 *            Parent class loader
	 */
	public JarFileClassLoader(String paths, ClassLoader parent) {
		super(parent);
		init(paths);
	}

	/**
	 * @return Instance creation time
	 */
	public String getCreationTime() {
		return DateFormatUtils.ISO_8601_EXTENDED_DATETIME_FORMAT.format(creationTime);
	}

	/**
	 * @return Used paths
	 */
	public String getPaths() {
		return paths;
	}

	/**
	 * Finds the resource with the given name. A resource is some data (images, audio, text, etc) that can be accessed by class code in a way that is independent of the location of
	 * the code.<br>
	 * The name of a resource is a '/'-separated path name that identifies the resource.<br>
	 * This method will first search the path of the class loader.
	 *
	 * @param name
	 *            The resource name
	 * @return A URL object for reading the resource, or null if the resource could not be found or the invoker doesn't have adequate privileges to get the resource.
	 */
	@Override
	public URL getResource(String name) {
		URL url = findResourceLocal(name);
		if (url == null) {
			url = getParent().getResource(name);
		}
		return url;
	}

	/**
	 * Loads the class with the specified binary name. It is invoked by the Java virtual machine to resolve class references
	 *
	 * @param name
	 *            The binary name of the class
	 * @return The resulting Class object
	 */
	@Override
	public Class<?> loadClass(String name) throws ClassNotFoundException {
		synchronized (getClassLoadingLock(name)) {
			Class<?> c = findLoadedClass(name); // First, check if the class has already been loaded
			if (c == null) {
				c = findClassLocal(name);
				if (c == null) {
					c = getParent().loadClass(name);
				}
			}
			return c;
		}
	}

	private URL findResourceLocal(String name) {
		URL url = null;
		String jarPath = packagesJar.get(StringUtils.substringBeforeLast(name, "/").replace('/', '.'));
		if (jarPath != null) {
			url = GenericUtils.getURLSafe("jar:file:///" + jarPath + "!/" + name);
		}

		if (url == null) {
			Optional<File> file = noJarFilesList.stream().filter(resource -> FileNameUtils.getName(resource.getAbsolutePath()).equalsIgnoreCase(name)).findFirst();
			if (file.isPresent()) {
				url = GenericUtils.getURLSafe("file:///" + file.get().getAbsolutePath());
			}
		}

		return url;
	}

	private Class<?> findClassLocal(String name) {
		try {
			String toSearchClass = name.replace('.', '/') + FILETYPEEXTENSION;
			for (File file : jarFilesList) {
				byte[] classData = searchClassInJarFile(file, toSearchClass, name);
				if (classData != null) {
					definePackage(name, file);
					return defineClass(name, classData, 0, classData.length);
				}
			}
		} catch (Exception ex) { // NOSONAR
		}

		return null;
	}

	private void definePackage(String name, File file) {
		String packageName = StringUtils.substringBeforeLast(name, ".");
		Package pkg = getPackage(packageName);
		if (pkg == null) {
			pkg = definePackage(packageName, null, null, null, null, null, null, null);
			packagesJar.put(pkg.getName(), file.getAbsolutePath());
		}
	}

	private byte[] searchClassInJarFile(File jarFileObject, String toSearchClass, String name) throws ClassNotFoundException {
		byte[] classData = null;

		try (JarFile jarFile = new JarFile(jarFileObject);) {
			Enumeration<JarEntry> entries = jarFile.entries();
			while (entries.hasMoreElements()) {
				JarEntry je = entries.nextElement();
				if (je.getName().equals(toSearchClass)) {
					classData = loadClassDefinition(jarFile.getInputStream(je), name);
					break;
				}
			}
		} catch (Exception ex) {
			throw new ClassNotFoundException(name, ex);
		}

		return classData;
	}

	private byte[] loadClassDefinition(InputStream connection, String name) throws ClassNotFoundException {
		byte[] classData = null;

		try (ByteArrayOutputStream buffer = new ByteArrayOutputStream();) {
			IOUtils.copy(connection, buffer);
			classData = buffer.toByteArray();
		} catch (Exception ex) {
			throw new ClassNotFoundException(name, ex);
		} finally {
			IOUtils.closeQuietly(connection);
		}

		return classData;
	}

	private void init(String paths) {
		creationTime = System.currentTimeMillis();
		this.paths = paths;

		Stream.of(StringUtils.split(paths, ";")).forEach(path -> {
			Collection<File> files = FileUtils.listFiles(new File(path), null, false);
			files.forEach(file -> {
				if (StringUtils.endsWithIgnoreCase(file.getAbsolutePath(), JARFILEEXTENSION)) {
					jarFilesList.add(file);
				} else {
					noJarFilesList.add(file);
				}
			});
		});
	}
}
