gy-downloader - Fastest method to download videos from youtube.com or google.com/drive.

## Features

1. **Fastest and multithreaded:** In a conventional single threaded download you might experience poor performance due to network lags etc. So you don't completely utilize your bandwidth. With multi threads there is always one thread which is getting data thus minimizing the wait period between data packets.
2. **Stop and start from the last downloaded byte:** You don't have to worry about internet getting disconnected or your computer shutting down while downloading. You can quite easily start from the last byte that was downloaded.
3. **Video quality and format:** you can specify quaility of video and format. supports 3gp, flv, mp4 and webm formats.

## Installation

The conventional npm installation process needs to be followed.

```
$ npm install @jasmedia/gy-downloader
```

## Download

When you want to start a new vidoe download you just need to provide a download url, a download path, video format, file name and call the download method.

```javascript
// Importing gy-downloader
const downloader = require('@jasmedia/gy-downloader');

// Required parameters
const url = 'https://www.youtube.com/watch?v=LAXA9mhkEtc';
const videoFormat = 'mp4';
const downloadPath = '/Users/jaseem/Desktop/gdrive-downloader';
const fileName = 'test-vedio';

// Call download deom gy-downloader
downloader.download(url, videoFormat, downloadPath, fileName, function() {
  console.log('Done.');
});
```

## Contribution

Any feedback, pull request or issue is welcome.

## LICENSE

MIT
