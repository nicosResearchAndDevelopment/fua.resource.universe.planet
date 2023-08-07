const
    persist    = require('@nrd/fua.module.persistence'),
    dfc        = require('@nrd/fua.module.dfc'),
    context    = require('../data/context.json'),
    factory    = new persist.TermFactory(context),
    dataParser = new dfc.CSVTransformer({
        id:        'planets-parser',
        delimiter: ';',
        comments:  '//',
        stripBom:  true,
        headers:   true,
        trim:      true
    }),
    rowParser  = new dfc.Transformer('planets-parser');

dataParser.use(function (source, output, next) {
    output.dataset = new persist.Dataset(null, factory);
    output.dataset.add(factory.quad(
        factory.namedNode(context.fua_planet),
        factory.namedNode(context.rdf + 'type'),
        factory.namedNode(context.ldp + 'Container')
    ));
    next();
});

dataParser.use(async function (source, output, next) {
    try {
        for (let row of output.rows) {
            if (!row['Identifier']) continue;
            const rowParam = {
                Identifier:  row['Identifier'].toLowerCase(),
                EnglishName: row['Planet Name'],
                Mass:        row['Planet Mass [Earth mass]'],
                Radius:      row['Planet Radius [Earth radii]'],
                Discovery:   row['Year of Discovery']
            };
            await rowParser(rowParam, output.dataset);
        }
        next();
    } catch (err) {
        next(err);
    }
});

dataParser.use(function (source, output, next) {
    next(null, output.dataset);
});

rowParser.use(function (source, output, next) {
    output.add(factory.quad(
        factory.namedNode(context.fua_planet + source.Identifier),
        factory.namedNode(context.rdf + 'type'),
        factory.namedNode(context.ldp + 'RDFSource')
    ));
    next();
});

rowParser.use(function (source, output, next) {
    output.add(factory.quad(
        factory.namedNode(context.fua_planet),
        factory.namedNode(context.ldp + 'contains'),
        factory.namedNode(context.fua_planet + source.Identifier)
    ));
    next();
});

rowParser.use(function (source, output, next) {
    if (source.EnglishName) output.add(factory.quad(
        factory.namedNode(context.fua_planet + source.Identifier),
        factory.namedNode(context.rdfs + 'label'),
        factory.literal(source.EnglishName, 'en')
    ));
    next();
});

rowParser.lock();
module.exports = dataParser.lock();
