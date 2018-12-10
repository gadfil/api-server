'use strict';

const async = require('async');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();
const gm = require('gm').subClass({
    imageMagick: true,
});

const sizeConfigs = [
    { dstBucketPostfix: '-1200', width: 1200 },
    { dstBucketPostfix: '-500', width: 500 },
    { dstBucketPostfix: '-100', width: 100 },
];

exports.handler = (event, context, done) => {
    console.time('totalExecutionTime');
    const srcBucket = event.Records[0].s3.bucket.name;
    const srcKey = event.Records[0].s3.object.key;
    const elements = srcKey.split('.');
    const dstFolderName = elements[0];
    const ext = elements[1] || 'jpg';

    if (dstFolderName === null) {
        context.fail();
        return;
    }

    const typeMatch = srcKey.match(/\.([^.]*)$/);
    if (!typeMatch) {
        console.error(`unable to infer image type for key ${srcKey}`);
        context.fail();
        return;
    }

    const imageType = typeMatch[1].toLowerCase();
    if (imageType !== 'jpg' && imageType !== 'jpeg' && imageType !== 'png') {
        console.log(`skipping non-image ${srcKey}`);
        context.fail();
        return;
    }

    async.waterfall(
        [
            function download(next) {
                console.time('downloadImage');
                s3.getObject({ Bucket: srcBucket, Key: srcKey }, (err, response) => {
                    console.timeEnd('downloadImage');
                next(err, response);
            });
            },
            function convert(response, next) {
                console.time('convertImage');
                gm(response.Body)
                    .density(300)
                    .noProfile()
                    .autoOrient()
                    .toBuffer('jpg', (err, buffer) => {
                    if (err) {
                        next(err);
                    } else {
                        console.timeEnd('convertImage');
                next(null, buffer);
            }
            });
            },
            function resizeUpToDown(buffer, next) {
                let lastBuffer = buffer;

                async.mapSeries(
                    sizeConfigs,
                    (config, callback) => {
                    console.time(`resize ${config.width}`);
                gm(lastBuffer)
                    .resize(config.width, null, '>')
                    .quality(95)
                    .toBuffer('jpg', (err, resizedBuffer) => {
                    console.timeEnd(`resize ${config.width}`);

                if (err) {
                    console.error(err);
                    callback(err);
                } else {
                    lastBuffer = resizedBuffer;
                    const obj = config;
                    obj.contentType = 'image/jpg';
                    obj.data = resizedBuffer;
                    obj.dstKey = `${dstFolderName}.${ext}`;
                    callback(null, obj);
                }
            });
            },
                (err, items) => {
                    next(err, items);
                }
            );
            },
            function upload(items, next) {
                console.time('totalUpload');
                async.each(
                    items,
                    (item, callback) => {
                    const tMsg = `  asyncUpload ${item.width} ${parseInt(item.data.length / 1024, 10)}kb`;
                console.time(tMsg);

                const dstBucket = event.Records[0].s3.bucket.name + item.dstBucketPostfix;
                if (srcBucket === dstBucket) {
                    console.error('Destination bucket must not match source bucket.');
                    context.fail();
                    return;
                }

                s3.putObject(
                    {
                        Bucket: dstBucket,
                        Key: item.dstKey,
                        Body: item.data,
                        ContentType: item.contentType,
                        ACL: 'public-read',
                        CacheControl: 'max-age=2592000,public',
                    },
                    err => {
                    console.timeEnd(tMsg);
                if (err) {
                    console.error(`Unable putObject to ${dstBucket} ${item.dstKey} ${err}`);
                }
                callback(err);
            }
            );
            },
                err => {
                    console.timeEnd('totalUpload');
                    next(err, items);
                }
            );
            },
        ],
        err => {
        console.timeEnd('totalExecutionTime');
    console.log('');

    if (err) {
        console.error(`Unable to resize [${srcBucket}]/${srcKey} due to an error: ${err}`);
        context.fail(err);
    } else {
        console.log(`Successfully resized ${srcBucket} ${srcKey}`);
    }
}
);
};