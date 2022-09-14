const express = require('express');
let csvToJson = require('convert-csv-to-json');
var path = require('path');
var mime = require('mime');
var fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

let booksCollection, magazinesCollections,authorsCollections;

const getCsvData = () => {
    if(!booksCollection) {
        booksCollection = csvToJson.getJsonFromCsv("./data/Books.csv");
    }
    if(!magazinesCollections){
        magazinesCollections = csvToJson.getJsonFromCsv("./data/Magazines.csv")
    }
    if(!authorsCollections){
        authorsCollections = csvToJson.getJsonFromCsv("./data/Authors.csv");
    }
    return [booksCollection, magazinesCollections, authorsCollections];
};

app.get('/',(req, res) => {
    res.json({hello:'Hello world!'})
})

app.get('/books', (req, res) =>{
    const isbnNumber = req.query.isbn;
    const [booksCollection] = getCsvData();
    const bookData =  isbnNumber ? booksCollection.filter(book => book.isbn === isbnNumber)
        : booksCollection;
    
    res.json(bookData);
})

app.get('/magazines', (req, res) =>{
    const isbnNumber = req.query.isbn;
    const [,magazinesCollections,] = getCsvData();
    const magazineData =  isbnNumber ? magazinesCollections.filter(magazine => magazine.isbn === isbnNumber)
        : magazinesCollections;
    
    res.json(magazineData);
})

app.get('/authors', (req, res) =>{
    const [,,authorsCollections] = getCsvData();
    res.json(authorsCollections);
})

app.get('/author/:email', (req, res) =>{
    const emailId = req.params.email;
    const [booksCollection, magazinesCollections] = getCsvData();
    const authorsMagazines = magazinesCollections.filter(magazine => magazine.authors.includes(emailId))
    const authorsBook = booksCollection.filter(book => book.authors.includes(emailId));

    const authorDetails = [...authorsBook, ...authorsMagazines];

    const sortedData = authorDetails.sort((first,second)=> first.title.localeCompare(second.title) )
    res.json(sortedData);
})

app.get('/export', function(req, res, next){

    const { book, megazine } = req.query;

    let fileName;

    if(book){
        fileName = 'Books.csv';
    }
    if(megazine){
        fileName = 'Magazines.csv';
    }

    var options = {
        root: path.join(__dirname, './data'),
        dotfiles: 'deny',
        headers: {
          'x-timestamp': Date().toLocaleString(),
          'x-sent': true
        }
      }
    
      res.sendFile(fileName, options, (err) => {
        if (err) {
          next(err)
        } else {
          console.log('Sent:', fileName)
        }
      })
  });

app.listen(port, () => {
    console.log(`Server Started on PORT: ${port}`);
})