/**
 * File: gy-downloader.js
 * Project: gy-video-downloader
 * File Created: Thursday, 19th September 2019 4:32:52 pm
 * Author: Jaseem Jas (jasmedia.jas@gmail.com)
 * -----
 * Last Modified: Thursday, 19th September 2019 9:56:03 pm
 * Modified By: Jaseem Jas (jasmedia.jas@gmail.com)
 * -----
 * Copyright 2019 - 2019 Mi Technica
 */

// core modules
const youtubedl = require('youtube-dl');
const __ = require('lodash');
const mtd = require('@jasmedia/mt-downloader');
const async = require('async');

/**
 *  Get info about different vedio format.
 * @method fetchVideoFormatInfo
 * @param  {String}             url  main url
 * @return {Array}                 list of formats.
 */
function fetchVideoFormatInfo(url) {
    return new Promise(function(resolve, reject) {
        youtubedl.getInfo(url, function(err, info) {
            if (err) {
                console.log('[ERROR]:', err);
                reject(err);
            }
            var video_formats_list = info.formats;
            var formats = __.reduce(
                video_formats_list,
                function(obj, format) {
                    obj[format.format_id] = format;
                    return obj;
                }, {}
            );
            resolve(formats);
        });
    });
}

/**
 *  Select format
 * @method selectFormat
 * @param  {String}     ext     extension
 * @param  {Array}     formats formats list.
 * @return {Object}             best format Object
 */
function selectFormat(ext, formats) {
    var q_formats = ['3gp', 'flv', 'mp4', 'webm', 'mkv'];
    var exts = {
        '3gp': ['36', '17', '13'],
        flv: ['35', '34', '6', '5'],
        mp4: ['38', '37', '22', '59', '18'],
        webm: ['43', '44', '45', '46'],
        mkv: ['1']
    };
    // select best quality from dict.
    if (__.has(exts, ext)) {
        var qlts = exts[ext];
        var arr_list = [];
        __.forEach(qlts, function(quality) {
            if (__.has(formats, quality)) {
                arr_list.push(formats[quality]);
            }
        });
        if (arr_list.length) {
            return arr_list[0];
        }
        return false;
    }
}

function download(url, headers, filename, folder_name, cb) {
    var options = {
        count: 20, //(Default: 2)
        headers: headers,
        timeout: 5, //(Default: 5 seconds)
        range: '0-100', //(Default: '0-100')
        onStart: function(meta) {
            console.log('Downloading initiated..');
        },
        onEnd: function(err, result) {
            if (err) console.error(err);
            else console.log('Downloaded');
            cb();
        }
    };
    var file_name = filename;
    if (folder_name) {
        file_name = folder_name + '/' + filename;
    }

    var downloader = new mtd(file_name, url, options);
    downloader.start();
}

/**
 *  bulk downloads for all the available formats
 * @method bulk_download
 * @param  {Array}      formats     all formats related data
 * @param  {String}      filename    filename prefix
 * @param  {String}      folder_path Folder path.
 * @param  {Function}    cb          [description]
 * @return {[type]}                  [description]
 */
function bulk_download(formats, filename, folder_path, cb) {
    var downloads_q = async.queue(function(item, callback) {
        download(
            item.url,
            item.http_headers,
            item.file_name,
            item.folder_path,
            function() {
                callback();
            }
        );
    }, 100); // cuncurrency 100 now. we can increase it based on load.

    // assign a callback
    downloads_q.drain = function() {
        // console.log('all items have been downloaded.!!!');
        cb();
    };

    __.forEach(formats, function(value, key) {
        var file_name = filename + '-' + value.format_id + '.' + value.ext;
        downloads_q.push({
                url: value.url,
                http_headers: value.http_headers,
                file_name: file_name,
                folder_path: folder_path
            },
            function(err) {
                console.log('queued downloading', value.url);
            }
        );
    });
}

// Extract all formats,
// Select high quality format if specified in arg.
// download all qualities.
function downloader(url, format, folder_path, filename, cb) {
    fetchVideoFormatInfo(url)
        .then(function(formats) {
            // download specified format, else download all.
            if (format) {
                var selected_format_data = selectFormat(format, formats);

                var vedio_url = selected_format_data.url;
                var http_headers = selected_format_data.http_headers;
                var ext = selected_format_data.ext;
                var format_id = selected_format_data.format_id;
                var file_name = filename + '-' + format_id + '.' + ext;
                download(vedio_url, http_headers, file_name, folder_path, function() {
                    cb();
                });
            } else {
                var all_formats = formats;
                bulk_download(all_formats, filename, folder_path, function() {
                    cb();
                });
            }
        })
        .catch(function(err) {
            console.log('ERROR', err);
            cb();
        });
}

module.exports = {
    getInfo: fetchVideoFormatInfo,
    selectFormat: selectFormat,
    download: downloader
};