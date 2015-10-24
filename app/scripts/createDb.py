import MySQLdb
import os
import os.path
import shutil
import glob
from imports.convert import breakIntoCSV
from imports.sql.select import getHullList
from imports.sql.create import createTable
from imports.sql.populate import populateTables

# Database connection to get hull numbers.
host = os.environ.get('PROD_DB_HOST')
port = int(os.environ.get('PROD_DB_PORT'))
user = os.environ.get('PROD_DB_USER')
passwd = os.environ.get('PROD_DB_PASSWORD')
db = os.environ.get('PROD_DB_DATABASE')

hullsDb = MySQLdb.connect(host = host, port = port, user = user,  passwd = passwd, db = db, local_infile = 1)
curOne = hullsDb.cursor()

# Get hull list data.
getHullList(curOne)

for row in curOne.fetchall() :
    hullNumber = row[1]
    gensheet = row [3]

# Create directory based on hull number.
filepath = os.environ.get('PY_SCRIPT_FILE_PATH')
directory = 'public/uploads/convert_to_csv/' + str(hullNumber)

if not os.path.exists(directory):
    os.makedirs(directory)

# Convert excel workbook into seperate CSV files.
breakIntoCSV(directory, 'public/uploads/' + gensheet)

# Database connection to create new database.
hullNumberDb = MySQLdb.connect(host = host, port = port, user = user,  passwd = passwd, local_infile = 1)
curTwo = hullNumberDb.cursor()

query = 'CREATE DATABASE IF NOT EXISTS `%s`;'
curTwo.execute(query, hullNumber)
hullNumberDb.commit()

# Remove these files if they exist because they casue nothing but trouble for creating tables!
if os.path.isfile(directory + '/$Config.csv') and os.access(directory + '/$Config.csv', os.R_OK):
    os.remove(directory + '/$Config.csv')

if os.path.isfile(directory + '/$Sheetlist.csv') and os.access(directory + '/$Sheetlist.csv', os.R_OK):
    os.remove(directory + '/$Sheetlist.csv')

# # Creates all tables for the gensheet.
path = directory + '/*.csv'

for fname in glob.glob(path):
    dirname, filename = os.path.split(fname)
    table = filename.replace('.csv', '')
    query = createTable(directory + '/' + filename, table)

    query = 'USE `%s`;'
    curTwo.execute(query, hullNumber)
    hullNumberDb.commit()

    query = createTable(directory + '/' + filename, table)
    curTwo.execute(query)
    hullNumberDb.commit()

    # Populate the tables with corresponding CSV file.
    populateTables(hullNumberDb, curTwo, hullNumber, filepath, filename, table)

# Close the database connection.
curTwo.close()
hullNumberDb.close()
