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
package elco.telnetd.io.toolkit;/** * Class that represents a components dimension on the terminal, it therefore encapsulates the coordinates given by columns(width) and rows(height). */public class Dimension {	// Members	private int mHeight;	private int mWidth;	/**	 * Constructs an instance with zero width and zero height.	 */	public Dimension() {		mHeight = 0;		mWidth = 0;	}// constructor	/**	 * Constructs an instance with width and height.	 *	 * @param width	 *            Integer that represents a width in amount of columns.	 * @param height	 *            Integer that represents a height in amount of rows.	 */	public Dimension(int width, int height) {		mHeight = height;		mWidth = width;	}// constructor	/**	 * Accessor method for the width.	 *	 * @return int that represents the width in number of columns.	 */	public int getWidth() {		return mWidth;	}// getWidth	/**	 * Mutator method for the width.	 *	 * @param width	 *            Integer that represents a width in numbers of columns.	 */	public void setWidth(int width) {		mWidth = width;	}// setWidth	/**	 * Accessor method for the height.	 *	 * @return int that represents the height in number of rows.	 */	public int getHeight() {		return mHeight;	}// getHeight	/**	 * Mutator method for the height.	 *	 * @param height	 *            Integer that represents a height in numer of rows.	 */	public void setHeight(int height) {		mHeight = height;	}// setHeight}