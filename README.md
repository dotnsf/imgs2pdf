# imgs2pdf

## Overview

Sample Node.js application which simply load images and generate one PDF file.


## Pre-requisite

- Image Magick
  - `$ sudo apt install imagemagick` for Linux
  - `https://imagemagick.org/` for Windows


## Environment variables

https://github.com/devicarus/image-to-pdf/blob/master/index.ts#L2

- DEFAULT_PDF_SIZE
  - Size of generated PDF
  - https://github.com/devicarus/image-to-pdf/blob/master/index.ts#L21
  - default: A4
- DEFAULT_IMAGE_WIDTH
  - Resize image with this width
  - default: 1200
- DEFAULT_IMAGEFOLDER
  - Folder name of target image files
  - default: images
- DEFAULT_OUTPUTFILE
  - Output PDF file name
  - default: output.pdf


## License

This code is licensed under MIT.


## Copyright

2025 [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.
