import xlrd
import csv

def breakIntoCSV(directory, excelFile):
    workbook = xlrd.open_workbook(excelFile)
    allWorksheets = workbook.sheet_names()

    for worksheetName in allWorksheets:
        worksheet = workbook.sheet_by_name(worksheetName)
        csvFile = open(''.join([directory, '/', worksheetName,'.csv']), 'wb')
        wr = csv.writer(csvFile, quoting=csv.QUOTE_ALL)

        for rownum in xrange(worksheet.nrows):
            wr.writerow([unicode(entry).encode("utf-8") for entry in worksheet.row_values(rownum)])
        csvFile.close()