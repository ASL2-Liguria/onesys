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
package elco.telnetd.io.toolkit;/** * Class that represents a point on the terminal. Respectively it specifies a character cell, encapsulating column and row coordinates. */public class Point {	// Members	private int mRow;	private int mCol;	/**	 * Constructs an instance with its coordinates set to the origin (0/0).	 */	public Point() {		mCol = 0;		mRow = 0;	}// constructor	/**	 * Constructs an instance with given coordinates.	 *	 * @param col	 *            Integer that represents a column position.	 * @param row	 *            Integer that represents a row position	 */	public Point(int col, int row) {		mCol = col;		mRow = row;	}// constructor	/**	 * Mutator method to set the points coordinate at once.	 *	 * @param col	 *            Integer that represents a column position.	 * @param row	 *            Integer that represents a row position	 */	public void setLocation(int col, int row) {		mCol = col;		mRow = row;	}// setLocation	/**	 * Convenience method to set the points coordinates.	 *	 * @param col	 *            Integer that represents a column position.	 * @param row	 *            Integer that represents a row position	 */	public void move(int col, int row) {		mCol = col;		mRow = row;	}// move	/**	 * Accessor method for the column coordinate.	 *	 * @return int that represents the cells column coordinate.	 */	public int getColumn() {		return mCol;	}// getColumn	/**	 * Mutator method for the column coordinate of this Cell.	 *	 * @param col	 *            Integer that represents a column position.	 */	public void setColumn(int col) {		mCol = col;	}// setColumn	/**	 * Accessor method for the row coordinate.	 *	 * @return int that represents the cells row coordinate.	 */	public int getRow() {		return mRow;	}// getRow	/**	 * Mutator method for the row coordinate of this Cell.	 *	 * @param row	 *            Integer that represents a row position.	 */	public void setRow(int row) {		mRow = row;	}// setRow}