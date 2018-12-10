import * as express from "express";
import uniqid from 'uniqid';
import * as aws from 'aws-sdk'

export type SignResult = {
    publicUrl: string,
    signedUrl: string,
    publicUrl1200: string,
    publicUrl500: string,
    publicUrl100: string,
    filename: string,
};

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    aws.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
}

const UPLOAD_IMG_S3_BUCKET: string = 'graphql-api-bucket';
const UPLOAD_IMG_S3_REGION: string = 'us-east-1';
// const UPLOAD_IMG_S3_BUCKET: string = process.env.UPLOAD_IMG_S3_BUCKET || '';
// const UPLOAD_IMG_S3_REGION: string = process.env.UPLOAD_IMG_S3_REGION || '';

const s3Options = {
    region: UPLOAD_IMG_S3_REGION,
    signatureVersion: 'v4',
    authType: 'REST-QUERY-STRING',
};

const getUploadRouter = () => {
    const router = express.Router();

    router.get('/sign', (req: any, res: any) => {
        const ext = req.query.ext || 'jpg';
        const date = new Date();
        const folder = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/`;
        const filename = `${folder}${uniqid()}.${ext}`;

        const s3 = new aws.S3(s3Options);
        const params = {
            Bucket: UPLOAD_IMG_S3_BUCKET,
            Key: filename,
            Expires: 60,
            ContentType: req.query.contentType,
            ACL: 'public-read', // 'private',
            Metadata: {
                'cabinet-id': req.cabinet ? req.cabinet.getId() : '',
            },
        };

        s3.getSignedUrl('putObject', params, (err, data) => {
            if (err) {
                req.raven.captureError(err, {
                    tags: {aws: 's3upload'},
                    extra: params,
                });
                res.status(500).send('Cannot create S3 signed URL');
                return;
            }
            const bucketUrl = `https://s3-${UPLOAD_IMG_S3_REGION}.amazonaws.com/${UPLOAD_IMG_S3_BUCKET}`;
            const result: SignResult = {
                signedUrl: data,
                publicUrl: `${bucketUrl}/${filename}`,
                publicUrl1200: `${bucketUrl}-1200/${filename}`,
                publicUrl500: `${bucketUrl}-500/${filename}`,
                publicUrl100: `${bucketUrl}-100/${filename}`,
                filename,
            };
            res.json(result);
        });
    });

    return router;
}

export default getUploadRouter