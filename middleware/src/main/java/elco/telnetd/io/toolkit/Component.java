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
package elco.telnetd.io.toolkit;import java.io.IOException;import elco.telnetd.io.BasicTerminalIO;/** * Class that represents an abstract toolkit component. */public abstract class Component {	protected String mName;	protected BasicTerminalIO mIO;	protected Point mPosition;	protected Dimension mDim;	/**	 * Constructor for an abstract toolkit component.	 *	 * @param io	 *            Instance of a class implementing the BasicTerminalIO.	 * @param name	 *            String that represents the components name.	 */	public Component(BasicTerminalIO io, String name) {		mIO = io;		mName = name;	}// constructor	/**	 * Method that draws the component.	 */	public abstract void draw() throws IOException;	/**	 * Accessor method for the name property of a component.	 *	 * @return String that represents the components name.	 */	public String getName() {		return mName;	}// getName	/**	 * Accessor method for a components location.	 *	 * @return Point that encapsulates the location.	 */	public Point getLocation() {		return mPosition;	}// getLocation	/**	 * Mutator method for a components location.	 *	 * @param pos	 *            Point that encapsulates the (new) Location.	 */	public void setLocation(Point pos) {		mPosition = pos;	}// setLocation	/**	 * Convenience mutator method for a components location.	 *	 * @param col	 *            int that represents a column coordinate.	 * @param row	 *            int that represents a row coordinate.	 */	public void setLocation(int col, int row) {		if (mPosition != null) {			mPosition.setColumn(col);			mPosition.setRow(row);		} else {			mPosition = new Point(col, row);		}	}// set Location	/**	 * Accessor method for a components dimension.	 *	 * @return Dimension that encapsulates the dimension in cols and rows.	 */	public Dimension getDimension() {		return mDim;	}// getDimension	/**	 * Mutator method for a components dimension.	 *	 * @param dim	 *            Dimension that encapsulates the dimension in cols and rows.	 */	protected void setDimension(Dimension dim) {		mDim = dim;	}// setDimension}