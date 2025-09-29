//.  app.js
var { convert, sizes } = require( 'image-to-pdf' ),
    Pipeline = require( 'pipeline' ),
    easyimg = require( 'easyimage' ),
    fs = require( 'fs' ),
    path = require( 'path' );
    
require( 'dotenv' ).config();

async function imgs2pdf( _pages, _size, _output_filepath ){
  return new Promise( function( resolve, reject ){
    var outputfile = fs.createWriteStream( _output_filepath );
    var pipeline = Pipeline( convert( _pages, _size ), outputfile );
    
    pipeline.pipe();
    resolve();
  });
};

async function getpages( _path ){
  return new Promise( async function( resolve, reject ){
    var pages = [];
    var files = fs.readdirSync( _path, { encoding: 'utf8' } ).sort();
    for( var i = 0; i < files.length; i ++ ){
      var filename = files[i];
      if( filename != '.' && filename != '..' ){
        var filepath = _path + path.sep + filename; 
        var filepath0 = filepath + "_0";

        var option = { src: filepath, dst: filepath0, width: IMAGE_WIDTH };
        await easyimg.resize( option );
        pages.push( filepath0 );
      }
    }

    resolve( pages );
  });
};

async function deltempimages( _path ){
  return new Promise( async function( resolve, reject ){
    var files = fs.readdirSync( _path, { encoding: 'utf8' } ).sort();
    for( var i = 0; i < files.length; i ++ ){
      var filename = files[i];
      if( filename.endsWith( '_0' )){
        var filepath0 = _path + path.sep + filename; 
        fs.unlinkSync( filepath0 );
      }
    }
    
    resolve();
  });
};

//. parameters
var IMAGEFOLDER = 'DEFAULT_IMAGEFOLDER' in process.env && process.env.DEFAULT_IMAGEFOLDER ? process.env.DEFAULT_IMAGEFOLDER.trim() : '';
var OUTPUTFILE = 'DEFAULT_OUTPUTFILE' in process.env && process.env.DEFAULT_OUTPUTFILE ? process.env.DEFAULT_OUTPUTFILE.trim() : '';
var PDF_SIZE = 'DEFAULT_PDF_SIZE' in process.env && process.env.DEFAULT_PDF_SIZE ? process.env.DEFAULT_PDF_SIZE.trim() : '';
var IMAGE_WIDTH = 'DEFAULT_IMAGE_WIDTH' in process.env && process.env.DEFAULT_IMAGE_WIDTH ? process.env.DEFAULT_IMAGE_WIDTH.trim() : '1200';
IMAGE_WIDTH = parseInt( IMAGE_WIDTH );

if( process.argv.length > 2 ) IMAGEFOLDER = process.argv[2];
if( process.argv.length > 3 ) OUTPUTFILE = process.argv[3];

if( !IMAGEFOLDER || !OUTPUTFILE ){
  console.log( 'Usage: node app [IMAGEFOLDER] [OUTPUTFILE]' );
  process.exitCode = 1;
  process.exit();
}

//. https://github.com/devicarus/image-to-pdf/blob/master/index.ts#L21
var size = sizes.A4;
switch( PDF_SIZE ){
case 'A0':
  size = sizes.A0;
  break;
case 'A1':
  size = sizes.A1;
  break;
case 'A2':
  size = sizes.A2;
  break;
case 'A3':
  size = sizes.A3;
  break;
case 'A4':
  size = sizes.A4;
  break;
case 'A5':
  size = sizes.A5;
  break;
case 'A6':
  size = sizes.A6;
  break;
case 'A7':
  size = sizes.A7;
  break;
case 'A8':
  size = sizes.A8;
  break;
case 'A9':
  size = sizes.A9;
  break;
case 'A10':
  size = sizes.A10;
  break;
case 'B0':
  size = sizes.B0;
  break;
case 'B1':
  size = sizes.B1;
  break;
case 'B2':
  size = sizes.B2;
  break;
case 'B3':
  size = sizes.B3;
  break;
case 'B4':
  size = sizes.B4;
  break;
case 'B5':
  size = sizes.B5;
  break;
case 'B6':
  size = sizes.B6;
  break;
case 'B7':
  size = sizes.B7;
  break;
case 'B8':
  size = sizes.B8;
  break;
case 'B9':
  size = sizes.B9;
  break;
case 'B10':
  size = sizes.B10;
  break;
case 'EXECUTIVE':
  size = sizes.EXECUTIVE;
  break;
case 'FOLIO':
  size = sizes.FOLIO;
  break;
case 'LEGAL':
  size = sizes.LEGAL;
  break;
case 'LETTER':
  size = sizes.LETTER;
  break;
case 'TABLOID':
  size = sizes.TABLOID;
  break;
default:
  if( PDF_SIZE.startsWith( '[' ) && PDF_SIZE.endsWith( ']' ) && PDF_SIZE.indexOf( ',' ) > 0 ){
    var tmp = PDF_SIZE.substring( 1, PDF_SIZE.length - 1 ).split( ',' );
    size = [ parseFloat( tmp[0] ), parseFloat( tmp[1] ) ];
  }
  break;
}
var output_filepath = OUTPUTFILE;

getpages( IMAGEFOLDER ).then( async function( pages ){
  imgs2pdf( pages, size, output_filepath ).then( async function(){
    await deltempimages( IMAGEFOLDER );
    console.log( "done." );
  });
});

