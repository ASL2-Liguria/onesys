<?php
	/* Libchart - PHP chart library
	 * Copyright (C) 2005-2008 Jean-Marc Trémeaux (jm.tremeaux at gmail.com)
	 * 
	 * This program is free software: you can redistribute it and/or modify
	 * it under the terms of the GNU General Public License as published by
	 * the Free Software Foundation, either version 3 of the License, or
	 * (at your option) any later version.
	 * 
	 * This program is distributed in the hope that it will be useful,
	 * but WITHOUT ANY WARRANTY; without even the implied warranty of
	 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
	 * GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License
	 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
	 * 
	 */
	
	/**
	 * This dataset comprises several series of points and is used to plot multiple lines charts.
	 * Each serie is a XYDataSet.
	 *
	 * @author Jean-Marc Trémeaux (jm.tremeaux at gmail.com)
	 * Created on 20 july 2007
	 */
	class XYSeriesDataSet extends DataSet {
		/**
		 * List of titles
		 */
		private $titleList;
	
		/**
		 * List of XYDataSet.
		 */
		private $serieList;

		/**
		* List of Color.
		*/
		private $colorsList; // Roberto
		
		/**
		* List of size.
		*/
		private $sizeList; // Roberto

		/**
		 * Constructor of XYSeriesDataSet.
		 *
		 */
		public function XYSeriesDataSet() {
			$this->titleList = array();
			$this->serieList = array();
			$this->colorsList = array(); // Roberto
			$this->sizeList = array(); // Roberto
		}
	
		/**
		 * Add a new serie to the dataset.
		 *
		 * @param string Title (label) of the serie.
		 * @param XYDataSet Serie of points to add
		 */
		public function addSerie($title, $serie) {
			array_push($this->titleList, $title);
			array_push($this->serieList, $serie);
			array_push($this->colorsList, new Color(rand(0, 255), rand(0, 255), rand(0, 255))); // Roberto
			array_push($this->sizeList, 1); // Roberto
		}

		public function addSerieColor($title, $serie, $color, $size = 1) { // Roberto
			array_push($this->titleList, $title); // Roberto
			array_push($this->serieList, $serie); // Roberto
			array_push($this->colorsList, $color); // Roberto
			array_push($this->sizeList, $size); // Roberto
		} // Roberto
		
		/**
		 * Getter of titleList.
		 *
		 * @return List of titles.
		 */
		public function getTitleList() {
			return $this->titleList;
		}

		/**
		 * Getter of serieList.
		 *
		 * @return List of series.
		 */
		public function getSerieList() {
			return $this->serieList;
		}

		public function getColorsList() { // Roberto
			return $this->colorsList; // Roberto
		} // Roberto

		public function getSizeList() { // Roberto
			return $this->sizeList; // Roberto
		} // Roberto
	}
?>