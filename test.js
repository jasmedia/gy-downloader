/**
 * File: index.js
 * Project: gy-video-downloader
 * File Created: Thursday, 19th September 2019 4:32:52 pm
 * Author: Jaseem Jas (jasmedia.jas@gmail.com)
 * -----
 * Last Modified: Thursday, 19th September 2019 9:56:14 pm
 * Modified By: Jaseem Jas (jasmedia.jas@gmail.com)
 * -----
 * Copyright 2019 - 2019 Mi Technica
 */

const gdrive = require('./index.js');

var url = 'https://drive.google.com/file/d/1EBXhF6liCBF9tgpGsGA6Mez33Z21bAs9';
// url = 'https://drive.google.com/file/d/1QQB0ASEsaR1_5x2bzVL3cP9UQuymw5IB';
// url = 'https://www.youtube.com/watch?v=LAXA9mhkEtc';
// gdrive.getInfo(url).then(function(formats) {
//     console.log(formats);
// });

//  console.log(gdrive.selectFormat('mp4', formats));

// NOTE:
// This is the format to use this module.

//  folder_path like: /Users/jaseem/Desktop/gdrive-downloader
//   downloader(url, format, folder_path, filename, cb)
console.time('download');
gdrive.download(
    url,
    'mp4',
    '/Users/jaseem/Desktop/gdrive-downloader',
    'kuttimama',
    function() {
        console.log('All downloaded are done.');
        console.timeEnd('download');
    }
);