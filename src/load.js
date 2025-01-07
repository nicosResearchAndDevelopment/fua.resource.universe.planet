module.exports = {
    '@context':        'fua.load.rdf',
    'dct:identifier':  __filename,
    'dct:format':      'application/fua.load+js',
    'dct:title':       'load',
    'dct:alternative': '@fua/resource.universe.planet',
    'dct:requires':    [{
        'dct:identifier': '../data/planets.ttl',
        'dct:format':     'text/turtle'
    }]
};
