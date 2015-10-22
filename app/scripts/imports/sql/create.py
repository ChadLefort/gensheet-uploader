class CsvFile(object):
    def __init__(self, name):
        self.name = name
        self.data = []
        self.columns = []
    def __str__(self):
        return self.name

    def empty(self):
        self.data = []

    def fill(self):
        import csv
        self.data = csv.reader(open(self.name))
        self.columns = self.data.next()


def createTable(csvObject, tableName = 'sample'):
  csvObject = CsvFile(csvObject)
  csvObject.fill()
  data = csvObject.data
  columns = csvObject.columns
  
  seen = set()
  x = 1
  y = 2
  sql = 'CREATE TABLE ' + '`' + str(tableName) + '`' + '\n' + '('
  for i in columns:
    # Checks for null and duplicate columns
    if i:
      if i not in seen:
        seen.add(i)
        sql += '\n' + '`' + i + '`' + ' VARCHAR(100) DEFAULT NULL' + ','
      else:
        sql += '\n' + '`' + i + str(y) + '`' + ' VARCHAR(100) DEFAULT NULL' + ','
        y += 1
    else:
      sql += '\n' + '`Null' + str(x) + '`' + ' VARCHAR(100) DEFAULT NULL' + ','
      x += 1

  sql = sql[:-1]
  sql += '\n' + ')' + '\n' + 'ENGINE = InnoDB DEFAULT CHARSET = utf8;'

  return sql