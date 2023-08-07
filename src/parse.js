const
    util       = require('@nrd/fua.core.util'),
    path       = require('path'),
    fs         = require('fs/promises'),
    rdf        = require('@nrd/fua.module.rdf'),
    dataParser = require('./parser.js'),
    inputFile  = path.join(__dirname, '../data/planets.csv'),
    outputFile = path.join(__dirname, '../data/planets.ttl');

fs.readFile(inputFile, 'utf-8')
    .then(dataParser)
    .then(dataset => rdf.serializeDataset(dataset, 'text/turtle'))
    .then(output => fs.writeFile(outputFile, output))
    .then(util.logDone)
    .catch(util.logError);
