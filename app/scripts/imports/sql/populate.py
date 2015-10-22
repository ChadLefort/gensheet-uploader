import MySQLdb

def populateTables(hullNumberDb, curTwo, hullNumber, filepath, filename, table):
	try:
		curTwo.execute('''LOAD DATA LOCAL INFILE '%s/public/uploads/convert_to_csv/%s/%s' into table %s
			         	  FIELDS TERMINATED BY ','
			         	  ENCLOSED BY '"'
				          LINES TERMINATED BY '\r\n'
				          IGNORE 3 LINES;
		           	  ''' % (filepath, hullNumber, filename, table))
		hullNumberDb.commit()
		# shutil.rmtree(directory)
	except MySQLdb.IntegrityError:
		logging.warm("Failed to insert data!")
