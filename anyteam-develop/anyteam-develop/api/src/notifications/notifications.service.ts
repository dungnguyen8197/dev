import * as aws from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entity/user.entity';
import { CustomLogger } from 'src/logger/logger.service';

type PasswordOmitUser = Omit<User, 'password'>;

@Injectable()
export class NotificationsService {
  constructor(
    private readonly configService: ConfigService,
    private logger: CustomLogger
  ) {}

  async findByUser(user: any) {
    const client = new aws.DynamoDB.DocumentClient({
      region: this.configService.get('AWS_DEFAULT_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_CREDENTIALS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_CREDENTIALS_SECRET_ACCESS_KEY')
      },
      endpoint: this.configService.get('DYNAMODB_HOST')
    });

    const user_id = user.userId;

    const params = {
      TableName: 'ReadNotification',
      KeyConditionExpression: 'UserId = :user_id',
      ExpressionAttributeValues: {
        ':user_id': user_id
      }
    }
    return await client.query(params, (err, data) => {
      if (err) {
        this.logger.error(JSON.stringify(err, null, 2));
      } else {
        this.logger.error(JSON.stringify(data, null, 2));
        return data;
      }
    }).promise();
  }

  async create(notification_id: number, user: any) {
    const client = new aws.DynamoDB.DocumentClient({
      region: this.configService.get('AWS_DEFAULT_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_CREDENTIALS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_CREDENTIALS_SECRET_ACCESS_KEY')
      },
      endpoint: this.configService.get('DYNAMODB_HOST')
    })

    const user_id = user.userId;

    const params = {
      TableName: 'ReadNotification',
      Item: {
        'UserId': user_id,
        'NotificationId': notification_id
      }
    }
    return await client.put(params, (err, data) => {
      if (err) {
        this.logger.error(JSON.stringify(err, null, 2));
      } else {
        this.logger.error(JSON.stringify(data, null, 2));
        return data;
      }
    }).promise();
  }
}
