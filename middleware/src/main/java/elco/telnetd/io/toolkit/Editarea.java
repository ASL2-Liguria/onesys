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
package elco.telnetd.io.toolkit;

import java.io.IOException;
import java.util.ArrayList;

import elco.telnetd.io.BasicTerminalIO;

/**
 * Class that implements an Editarea.
 */
public class Editarea extends ActiveComponent {

	// Members
	private int mRowCursor = 0;
	private int mRows = 0;
	private boolean mFirstrun = true;
	private int mFirstVisibleRow = 0;
	private String mHardwrap = "\n";
	private String mSoftwrap = " ";

	// Associations
	private final ArrayList<Editline> lines;
	private Editline line;

	public Editarea(BasicTerminalIO io, String name, int rowheight, int maxrows) {
		super(io, name);
		lines = new ArrayList<>();
		mRows = maxrows;
		mFirstrun = true;
		mFirstVisibleRow = 0;
		setDimension(new Dimension(mIO.getColumns(), rowheight));
	}// constructor

	/**
	 * Accessor method for field buffer size.
	 *
	 * @return int that represents the number of chars in the fields buffer.
	 */
	public int getSize() {
		int size = 0;
		// iterate over buffers and accumulate size
		// think of solution for hardwraps
		return size;
	}// getSize

	public void setHardwrapString(String str) {
		mHardwrap = str;
	}// setHardwrapString

	public String getHardwrapString() {
		return mHardwrap;
	}// getHardwrapString

	public void setSoftwrapString(String str) {
		mSoftwrap = str;
	}// setSoftwrapString

	public String getSoftwrapString() {
		return mSoftwrap;
	}// getSoftwrapString

	public String getValue() {
		StringBuilder sbuf = new StringBuilder();
		// iterate over buffers and accumulate size
		Editline el;
		for (int i = 0; i < lines.size(); i++) {
			el = getLine(i);
			sbuf.append(el.getValue()).append(el.isHardwrapped() ? mHardwrap : mSoftwrap);
		}
		return sbuf.toString();
	}// getValue

	public void setValue(String str) {
		// buffers
		lines.clear();
		// cursor
		mRowCursor = 0;
		// think of a buffer filling strategy
	}// setValue

	public void clear() throws IOException {
		// Buffers
		lines.clear();
		// Cursor
		mRowCursor = 0;
		// Screen
		draw();
	}// clear

	@Override
	public void run() throws IOException {
		boolean done = false;
		mIO.setAutoflushing(false);
		// check flag
		if (mFirstrun) {
			// reset flag
			mFirstrun = false;
			// make a new editline
			line = createLine();
			appendLine(line);
		}

		do {
			// switch return of a line
			switch (line.run()) {
			case BasicTerminalIO.UP:
				if (mRowCursor > 0) {
					if (mFirstVisibleRow == mRowCursor) {
						scrollUp();
					} else {
						cursorUp();
					}
				} else {
					mIO.bell();
				}
				break;
			case BasicTerminalIO.DOWN:
				if (mRowCursor < (lines.size() - 1)) {
					if (mRowCursor == mFirstVisibleRow + (mDim.getHeight() - 1)) {
						scrollDown();
					} else {
						cursorDown();
					}
				} else {
					mIO.bell();
				}
				break;
			case BasicTerminalIO.ENTER:
				// ensure exit on maxrows line
				if (mRowCursor == (mRows - 1)) {
					done = true;
				} else {
					if (!hasLineSpace()) {
						mIO.bell();
					} else {
						String wrap = line.getHardwrap();
						line.setHardwrapped(true);

						if (mRowCursor == (lines.size() - 1)) {
							appendNewLine();
						} else {
							insertNewLine();
						}
						// cursor
						mRowCursor++;
						// activate new row
						activateLine(mRowCursor);
						// set value of new row
						try {
							line.setValue(wrap);
							line.setCursorPosition(0);
							mIO.moveLeft(line.size());
						} catch (Exception ex) {
						}
					}
				}
				break;
			case BasicTerminalIO.TABULATOR:
				// set cursor to end of field?

				done = true;
				break;

			case BasicTerminalIO.LEFT:
				if (mRowCursor > 0) {
					if (mFirstVisibleRow == mRowCursor) {
						scrollUp();
						line.setCursorPosition(line.size());
						mIO.moveRight(line.size());
					} else {
						// Cursor
						mRowCursor--;
						// buffer
						activateLine(mRowCursor);
						line.setCursorPosition(line.size());

						// screen
						mIO.moveUp(1);
						mIO.moveRight(line.size());
					}
				} else {
					mIO.bell();
				}
				break;
			case BasicTerminalIO.RIGHT:
				if (mRowCursor < (lines.size() - 1)) {
					if (mRowCursor == mFirstVisibleRow + (mDim.getHeight() - 1)) {
						line.setCursorPosition(0);
						mIO.moveLeft(line.size());
						scrollDown();
					} else {
						// Cursor
						mRowCursor++;
						// screen horizontal
						mIO.moveLeft(line.size());
						// buffer
						activateLine(mRowCursor);
						line.setCursorPosition(0);
						// screen
						mIO.moveDown(1);
					}
				} else {
					mIO.bell();
				}
				break;
			case BasicTerminalIO.BACKSPACE:
				if (mRowCursor == 0 || line.size() != 0 || mRowCursor == mFirstVisibleRow) {
					mIO.bell();
				} else {
					// take line from buffer
					// and draw update all below
					removeLine();
				}
				break;
			default:
				if (!hasLineSpace()) {
					mIO.bell();
				} else {
					String wrap = line.getSoftwrap();
					line.setHardwrapped(false);

					if (mRowCursor == (lines.size() - 1)) {
						appendNewLine();
					} else {
						insertNewLine();
					}
					// cursor
					mRowCursor++;
					// activate new row
					activateLine(mRowCursor);
					// set value of new row
					try {
						line.setValue(wrap);
					} catch (Exception ex) {
					}
				}

			}
			mIO.flush();
		} while (!done);
	}// run

	private void scrollUp() throws IOException {
		int horizontalpos = line.getCursorPosition();
		// Cursors
		mFirstVisibleRow--;
		mRowCursor--;

		// buffer
		activateLine(mRowCursor);
		line.setCursorPosition(horizontalpos);

		// screen
		// horizontal

		// content:
		int lasthorizontal = horizontalpos;
		int count = 0;
		for (int i = mFirstVisibleRow; i < (mFirstVisibleRow + mDim.getHeight()) && i < lines.size(); i++) {
			mIO.moveLeft(lasthorizontal);
			Editline lin = lines.get(i);
			lasthorizontal = lin.size();
			mIO.eraseToEndOfLine();
			mIO.write(lin.getValue());
			mIO.moveDown(1);
			count++;
		}
		// vertical:
		mIO.moveUp(count);
		// horizontal:
		if (lasthorizontal > horizontalpos) {
			mIO.moveLeft(lasthorizontal - horizontalpos);
		} else if (lasthorizontal < horizontalpos) {
			mIO.moveRight(horizontalpos - lasthorizontal);
		}

		if (horizontalpos > line.getCursorPosition()) {
			mIO.moveLeft(horizontalpos - line.getCursorPosition());
		}
	}// scrollUp

	private void cursorUp() throws IOException {
		int horizontalpos = line.getCursorPosition();
		// Cursor
		mRowCursor--;
		// buffer
		activateLine(mRowCursor);
		line.setCursorPosition(horizontalpos);
		// screen
		// vertical
		mIO.moveUp(1);
		// horizontal
		if (horizontalpos > line.getCursorPosition()) {
			mIO.moveLeft(horizontalpos - line.getCursorPosition());
		}
	}// cursorUp

	private void scrollDown() throws IOException {
		int horizontalpos = line.getCursorPosition();

		// Cursors
		mFirstVisibleRow++;
		mRowCursor++;

		// buffer
		activateLine(mRowCursor);
		line.setCursorPosition(horizontalpos);

		// screen
		// vertical:
		mIO.moveUp(mDim.getHeight() - 1);
		// content:
		int lasthorizontal = horizontalpos;
		for (int i = mFirstVisibleRow; i < (mFirstVisibleRow + mDim.getHeight()); i++) {
			mIO.moveLeft(lasthorizontal);
			Editline lin = lines.get(i);
			lasthorizontal = lin.size();

			mIO.eraseToEndOfLine();
			mIO.write(lin.getValue());
			mIO.moveDown(1);
		}
		// correct move down and last write
		mIO.moveUp(1);
		// horizontal:
		if (lasthorizontal > horizontalpos) {
			mIO.moveLeft(lasthorizontal - horizontalpos);
		} else if (lasthorizontal < horizontalpos) {
			mIO.moveRight(horizontalpos - lasthorizontal);
		}

		if (horizontalpos > line.getCursorPosition()) {
			mIO.moveLeft(horizontalpos - line.getCursorPosition());
		}
	}// scrollDown

	private void cursorDown() throws IOException {
		int horizontalpos = line.getCursorPosition();
		// Cursor
		mRowCursor++;
		// buffer
		activateLine(mRowCursor);
		line.setCursorPosition(horizontalpos);
		// screen
		mIO.moveDown(1);
		if (horizontalpos > line.getCursorPosition()) {
			mIO.moveLeft(horizontalpos - line.getCursorPosition());
		}
	}// cursorDown

	private void appendNewLine() throws IOException {
		// buffer
		appendLine(createLine());

		if (mRowCursor == mFirstVisibleRow + (mDim.getHeight() - 1)) {
			// this will "scroll"
			mFirstVisibleRow++;
			// vertical
			mIO.moveUp(mDim.getHeight() - 1);
			mIO.moveLeft(line.getCursorPosition());
			// content
			for (int i = mFirstVisibleRow; i < (mFirstVisibleRow + mDim.getHeight()); i++) {
				Editline lin = lines.get(i);
				mIO.eraseToEndOfLine();
				mIO.write(lin.getValue());
				mIO.moveLeft(lin.size());
				mIO.moveDown(1);
			}
			// correct the move to down in last place
			mIO.moveUp(1);

		} else {
			// this wont need a scroll redraw
			mIO.moveLeft(line.getCursorPosition());
			mIO.moveDown(1);
		}
	}// appendNewLine

	private void insertNewLine() throws IOException {
		// buffer
		insertLine(mRowCursor + 1, createLine());

		if (mRowCursor == mFirstVisibleRow + (mDim.getHeight() - 1)) {
			// this will "scroll"
			mFirstVisibleRow++;
			// vertical
			mIO.moveUp(mDim.getHeight() - 1);
			// content
			int lasthorizontal = line.getCursorPosition();
			for (int i = mFirstVisibleRow; i < (mFirstVisibleRow + mDim.getHeight()); i++) {
				mIO.moveLeft(lasthorizontal);
				Editline lin = lines.get(i);
				lasthorizontal = lin.size();
				mIO.eraseToEndOfLine();
				mIO.write(lin.getValue());
				mIO.moveDown(1);

			}
			// correct the move to down in last place
			mIO.moveUp(1);

		} else {
			// we have to redraw any line below rowCursor+1 anyway
			mIO.moveDown(1);
			mIO.moveLeft(line.getCursorPosition());

			int count = 0;
			for (int i = mRowCursor + 1; i < (mFirstVisibleRow + mDim.getHeight()) && i < lines.size(); i++) {
				mIO.eraseToEndOfLine();
				Editline lin = lines.get(i);
				mIO.write(lin.getValue());
				mIO.moveLeft(lin.size());
				mIO.moveDown(1);
				count++;
			}
			mIO.moveUp(count);
		}
	}// insertNewLine

	private void removeLine() throws IOException {
		// buffer
		deleteLine(mRowCursor);
		activateLine(mRowCursor - 1);
		// Cursor
		mRowCursor--;

		// Screen
		// content redraw
		int count = 0;
		for (int i = mRowCursor + 1; i < (mFirstVisibleRow + mDim.getHeight()); i++) {
			if (i < lines.size()) {
				mIO.eraseToEndOfLine();
				Editline lin = lines.get(i);
				mIO.write(lin.getValue());
				mIO.moveLeft(lin.size());
				mIO.moveDown(1);
				count++;
			} else {
				mIO.eraseToEndOfLine();
				mIO.moveDown(1);
				count++;
			}
		}
		// cursor readjustment
		// vertical
		mIO.moveUp(count + 1);
		// horizontal

		line.setCursorPosition(line.size());
		mIO.moveRight(line.size());
	}// removeLine

	@Override
	public void draw() throws IOException {
		if (mPosition != null) {
			mIO.setCursor(mPosition.getRow(), mPosition.getColumn());
			int count = 0;
			for (int i = mFirstVisibleRow; i < (mFirstVisibleRow + mDim.getHeight()) && i < lines.size(); i++) {
				mIO.eraseToEndOfLine();
				Editline lin = lines.get(i);
				mIO.write(lin.getValue());
				mIO.moveLeft(lin.size());
				mIO.moveDown(1);
				count++;
			}
			int corr = (mFirstVisibleRow + count) - mRowCursor;
			if (corr > 0) {
				mIO.moveUp(corr);
			}
		}
		mIO.flush();
	}// draw

	private void activateLine(int pos) {
		line = getLine(pos);
	}// activateLine

	private boolean hasLineSpace() {
		return lines.size() < mRows;
	}// hasLineSpace

	private Editline createLine() {
		return new Editline(mIO);
	}// newLine

	private void deleteLine(int pos) {
		lines.remove(pos);
	}// deleteLine

	private void insertLine(int pos, Editline el) {
		lines.add(pos, el);
	}// insertLine

	private void appendLine(Editline el) {
		lines.add(el);
	}// appendLine

	private Editline getLine(int pos) {
		return lines.get(pos);
	}// getLine
}
