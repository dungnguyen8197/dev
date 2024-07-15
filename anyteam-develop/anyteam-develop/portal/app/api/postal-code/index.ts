import jsonp from 'jsonp';
import { AddressResponse } from '~/interfaces/response/address';

export const getAddressByPostalCode = async (postalCode: string) => {
  const url = `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`;

  return new Promise<AddressResponse>((resolve, reject) => {
    jsonp(url, {}, (err, data: AddressResponse) => {
      if (err || data.status !== 200 || !data.results) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}