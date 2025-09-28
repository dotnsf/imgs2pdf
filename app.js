//.  app.js
var { convert, sizes } = require( 'image-to-pdf' ),
    Pipeline = require( 'pipeline' ),
    easyimg = require( 'easyimage' ),
    fs = require( 'fs' );
    
require( 'dotenv' ).config();

async function imgs2pdf( _pages, _size, _output_filepath ){
  return new Promise( function( resolve, reject ){
    var outputfile = fs.createWriteStream( _output_filepath );
    var pipeline = Pipeline( convert( _pages, _size ), outputfile );
    
    pipeline.pipe();
    resolve();
  });
};

async function getpages( _path, _filenum ){
  return new Promise( async function( resolve, reject ){
    var pages = [];
    for( var i = 1; i <= _filenum; i ++ ){
      var n = i;
      if( i < 100 ) n = '0' + n;
      if( i < 10 ) n = '0' + n;
      
      var page = _path + n + ".jpg";
      var page0 = page + "0";
      var option = { src: page, dst: page0, width: 1200 };
      await easyimg.resize( option );
      pages.push( page0 );
    }

    resolve( pages );
  });
};

async function deltempimages( _path, _filenum ){
  return new Promise( async function( resolve, reject ){
    for( var i = 1; i <= _filenum; i ++ ){
      var n = i;
      if( i < 100 ) n = '0' + n;
      if( i < 10 ) n = '0' + n;
      
      var page = _path + n + ".jpg";
      var page0 = page + "0";
      fs.unlinkSync( page0 );
    }
    
    resolve();
  });
};

//. parameters
var IMAGEFOLDER = DEFAULT_IMAGEFOLDER in process.env && process.env.DEFAULT_IMAGEFOLDER ? process.env.DEFAULT_IMAGEFOLDER : '';
var OUTPUTFILE = DEFAULT_OUTPUTFILE in process.env && process.env.DEFAULT_OUTPUTFILE ? process.env.DEFAULT_OUTPUTFILE : '';

if( process.argv.length > 2 ) IMAGEFOLDER = process.argv[2];
if( process.argv.length > 3 ) OUTPUTFILE = process.argv[3];

if( !IMAGEFOLDER || !OUTPUTFILE ){
  console.log( 'Usage: node app [IMAGEFOLDER] [OUTPUTFILE]' );
  process.exitCode = 1;
  process.exit();
}

var size = sizes.A4;
switch( process.env.PDF_SIZE ){
case 'A4':
  size = sizes.A4;
  break;
}
var output_filepath = OUTPUTFILE;

getpages( path, filenum ).then( async function( pages ){
  imgs2pdf( pages, size, output_filepath ).then( async function(){
    await deltempimages( path, filenum );
    console.log( "done." );
  });
});

