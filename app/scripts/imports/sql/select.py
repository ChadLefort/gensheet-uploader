def getHullList(curOne):
	curOne.execute('SELECT * FROM hulls ORDER BY timestamp DESC LIMIT 1')