# Gensheet-uploader #

A simple application that allows users to add gensheets, view it's data, and generate other sheets based on gensheet data.

### How do I get set up? ###

* Have the following installed:
  * Node.js & NPM
  * Python 2.7.10
  * MySQL
* Run the db.sql in your MySQL server
* Open up your terminal to where you want it installed and use npm to install all of the dependencies:

```
npm install
pip install -r requirements.txt
```

* Navigate to the directory which you cloned this repo to and start the app with:

```
sudo node app.js
```

### What is a gensheet? ###

* A gensheet is an excel workbook that contains the data to generate the configuration for ABB PLCs.
