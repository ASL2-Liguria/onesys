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

import java.lang.reflect.Field;
import java.lang.reflect.Method;

import javax.management.ReflectionException;

import org.apache.camel.CamelContext;

/**
 * @author Roberto Rizzo
 */
public final class Reflection {

	private Class<?> object = null;

	/**
	 * @param classLoader
	 *            ClassLoader to use
	 * @param className
	 *            name of the class
	 * @throws ReflectionException
	 */
	public Reflection(ClassLoader classLoader, String className) throws ReflectionException {
		try {
			object = classLoader.loadClass(className);
		} catch (Exception ex) {
			throw new ReflectionException(ex);
		}
	}

	/**
	 * @param camelContext
	 *            CamelContext containing the ClassLoader to use
	 * @param className
	 *            name of the class
	 * @throws ReflectionException
	 */
	public Reflection(CamelContext camelContext, String className) throws ReflectionException {
		this(camelContext.getApplicationContextClassLoader(), className);
	}

	/**
	 * @param parameters
	 *            array of objects to be passed as arguments to the constructor call; values of primitive types are wrapped in a wrapper object of the appropriate type (e.g. a
	 *            float in a Float)
	 * @return instance of class className
	 * @throws ReflectionException
	 */
	public Object newInstance(Object... parameters) throws ReflectionException {
		try {
			Class<?>[] arrayClassTypes = new Class<?>[parameters.length];
			for (int index = 0; index < parameters.length; index++) {
				arrayClassTypes[index] = parameters[index].getClass();
			}

			return object.getDeclaredConstructor(arrayClassTypes).newInstance(parameters);
		} catch (Exception ex) {
			throw new ReflectionException(ex);
		}
	}

	/**
	 * Convenience's static method
	 *
	 * @param camelContext
	 *            CamelContext containing the ClassLoader to use
	 * @param className
	 *            name of the class
	 * @param parameters
	 *            array of objects to be passed as arguments to the constructor call; values of primitive types are wrapped in a wrapper object of the appropriate type (e.g. a
	 *            float in a Float)
	 * @return instance of class className
	 * @throws ReflectionException
	 */
	public static Object newInstance(CamelContext camelContext, String className, Object... parameters) throws ReflectionException {
		try {
			Class<?> object = camelContext.getApplicationContextClassLoader().loadClass(className);
			Class<?>[] arrayClassTypes = new Class<?>[parameters.length];
			for (int index = 0; index < parameters.length; index++) {
				arrayClassTypes[index] = parameters[index].getClass();
			}

			return object.getDeclaredConstructor(arrayClassTypes).newInstance(parameters);
		} catch (Exception ex) {
			throw new ReflectionException(ex);
		}
	}

	/**
	 * Determines the interfaces implemented by the class
	 *
	 * @return supported interfaces
	 */
	public Class<?>[] getSupportedInterfaces() {
		return object.getInterfaces();
	}

	/**
	 * Returns an array containing Method objects reflecting all the public member methods of the class or interface represented by this Class object, including those declared by
	 * the class or interface and those inherited from superclasses and superinterfaces. Array classes return all the (public) member methods inherited from the Object class. The
	 * elements in the array returned are not sorted and are not in any particular order. This method returns an array of length 0 if this Class object represents a class or
	 * interface that has no public member methods, or if this Class object represents a primitive type or void. The class initialization method <clinit> is not included in the
	 * returned array. If the class declares multiple public member methods with the same parameter types, they are all included in the returned array.
	 *
	 * @return the array of Method objects representing the public methods of this class
	 * @throws ReflectionException
	 */
	public Method[] getPublicMethods() throws ReflectionException {
		try {
			return object.getMethods();
		} catch (Exception ex) {
			throw new ReflectionException(ex);
		}
	}

	/**
	 * Returns a Field object that reflects the specified public member field of the class or interface represented by this Class object. The name parameter is a String specifying
	 * the simple name of the desired field. The field to be reflected is determined by the algorithm that follows. Let C be the class represented by this object: 1. If C declares
	 * a public field with the name specified, that is the field to be reflected.<br>
	 * 2. If no field was found in step 1 above, this algorithm is applied recursively to each direct superinterface of C. The direct superinterfaces are searched in the order they
	 * were declared.<br>
	 * 3. If no field was found in steps 1 and 2 above, and C has a superclass S, then this algorithm is invoked recursively upon S. If C has no superclass, then a
	 * NoSuchFieldException is thrown.
	 *
	 * @param name
	 *            the field name
	 * @return the Field object of this class specified by name
	 * @throws ReflectionException
	 */
	public Field getPublicField(String name) throws ReflectionException {
		try {
			return object.getField(name);
		} catch (Exception ex) {
			throw new ReflectionException(ex);
		}
	}

	/**
	 * Returns an array containing Field objects reflecting all the accessible public fields of the class or interface represented by this Class object. The elements in the array
	 * returned are not sorted and are not in any particular order. This method returns an array of length 0 if the class or interface has no accessible public fields, or if it
	 * represents an array class, a primitive type, or void. Specifically, if this Class object represents a class, this method returns the public fields of this class and of all
	 * its superclasses. If this Class object represents an interface, this method returns the fields of this interface and of all its superinterfaces. The implicit length field
	 * for array class is not reflected by this method. User code should use the methods of class Array to manipulate arrays.
	 *
	 * @return the array of Field objects representing the public fields
	 */
	public Field[] getPublicFields() {
		return object.getFields();
	}
}
