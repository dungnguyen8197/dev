import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FilesService {
  S3_CONFIG = {
    accessKeyId: process.env.AWS_CREDENTIALS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_CREDENTIALS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
  };
  // Todo : upload to S3
  async uploadPublicFile(
    dataBuffer: Buffer,
    filename: string,
    folder: string,
    contentType: string,
  ): Promise<string> {
    const fileUpload = `${uuid()}-${filename}`;
    const s3 = new S3(this.S3_CONFIG);
    await s3
      .upload({
        Bucket: process.env.AWS_BUCKET,
        Body: dataBuffer,
        Key: folder + fileUpload,
        ContentType: contentType,
      })
      .promise();
    return fileUpload;
  }

  async getSignedUrlS3(filename: string, folder: string): Promise<any> {
    const s3 = new S3(this.S3_CONFIG);

    const getParams = {
      Bucket: process.env.AWS_BUCKET,
      Key: folder + filename,
      Expires: 1000,
    };

    const s3Url = await new Promise((resolve, reject) => {
      s3.getSignedUrl('getObject', getParams, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
    return s3Url;
  }

  async deleteFileS3(filename: string, folder: string): Promise<boolean> {
    const s3 = new S3(this.S3_CONFIG);

    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: folder + filename,
    };
    await new Promise((resolve, reject) => {
      s3.deleteObject(params, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
    return true;
  }
}
