import * as FormData from 'form-data';

import { CustomLogger } from 'src/logger/logger.service';
import { ErrorGMOResponse } from './dto/error';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { PaymentGMOResponse } from './dto/payment';
import { RegisterGMOResponse } from './dto/register';
import { SaveCardGMOResponse } from './dto/save-card';
import { SaveMemberGMOResponse } from './dto/save-member';
import {
  ValidateCardGMOResponse,
  PurchaseValidateCardGMOResponse,
} from './dto/validate-card';
import { UpdateWalletRequest } from 'src/users/dto/wallet';

export const GMO_METHOD = 1;
export const GMO_CARD_SEQ = 0;
export const GMO_JOB_CD_CHECK = 'CHECK';
export const GMO_JOB_CD_CAPTURE = 'CAPTURE';

@Injectable()
export class GmoService {
  constructor(private httpService: HttpService, private logger: CustomLogger) {}

  async GMOPaymentGeteway(
    req: UpdateWalletRequest,
    OrderID: string,
    WalletID: number,
    checkHasWallet: boolean,
  ): Promise<PaymentGMOResponse> {
    // 4. GMOPG APIで取引登録を行う
    const registerGMOResponse = await this.registerTransactionGMO(OrderID);
    const ErrorGMO: ErrorGMOResponse = { ErrInfo: '', ErrCode: '' };
    const IsSuccess = true;

    if (registerGMOResponse['ErrInfo']) {
      return await this.errorGMO(registerGMOResponse);
    }

    const AccessID = registerGMOResponse['AccessID'];
    const AccessPass = registerGMOResponse['AccessPass'];

    // 5. GMOPG APIでクレジット決済の有効性チェックする
    const validateCardResponse = await this.validateCreditCardGMO(
      AccessID,
      AccessPass,
      OrderID,
      req.exec_tran_token,
      WalletID,
    );
    if (validateCardResponse['ErrCode']) {
      return await this.errorGMO(validateCardResponse);
    }

    const Approve = validateCardResponse['Approve'];
    const TranID = validateCardResponse['TranID'];
    const TranDate = validateCardResponse['TranDate'];

    // 6. GMOPG APIでGMO会員登録する
    const saveMemberResponse = await this.saveMemberGMO(WalletID);

    if (
      saveMemberResponse['ErrCode'] &&
      saveMemberResponse['ErrCode'] !== 'E01' &&
      saveMemberResponse['ErrInfo'] !== 'E01390010' // Check error member id already exist
    ) {
      return await this.errorGMO(saveMemberResponse);
    }

    // 7. GMOPG APIで登録されたGMO会員情報にクレジットカード情報を追加する
    const saveCardResponse = await this.saveCardGMO(
      WalletID,
      req.save_card_token,
      checkHasWallet,
    );
    const Forward = saveCardResponse['Forward'];

    if (saveCardResponse['ErrCode']) {
      return await this.errorGMO(saveCardResponse);
    }
    return new PaymentGMOResponse(
      IsSuccess,
      ErrorGMO,
      AccessID,
      AccessPass,
      Approve,
      TranID,
      TranDate,
      Forward,
    );
  }

  async errorGMO(errorGMOResponse) {
    const ErrorGMO = {
      ErrInfo: errorGMOResponse['ErrInfo'],
      ErrCode: errorGMOResponse['ErrCode'],
    };
    const IsSuccess = false;
    return new PaymentGMOResponse(IsSuccess, ErrorGMO);
  }

  async registerTransactionGMO(
    OrderID: string,
    amount = 0,
  ): Promise<RegisterGMOResponse | ErrorGMOResponse> {
    const bodyFormData = new FormData();
    bodyFormData.append('ShopID', process.env.SHOP_ID);
    bodyFormData.append('ShopPass', process.env.SHOP_PASS);
    bodyFormData.append('OrderID', OrderID);
    bodyFormData.append('Amount', amount);
    if (amount > 0) {
      bodyFormData.append('JobCd', GMO_JOB_CD_CAPTURE);
    } else {
      bodyFormData.append('JobCd', GMO_JOB_CD_CHECK);
    }
    const response = await this.httpService.post(
      process.env.GMO_API_ENDPOINT + `/payment/EntryTran.idPass`,
      bodyFormData,
      { headers: bodyFormData.getHeaders() },
    );

    return response.toPromise().then(async (response) => {
      Logger.log(`Register Transaction GMO : ${response.data}`);
      const result = await this.convertDataResponseGMO(response.data);
      if (result['ErrCode']) {
        const ErrCode = result['ErrCode'];
        const ErrInfo = result['ErrInfo'];
        return new ErrorGMOResponse(ErrCode, ErrInfo);
      }
      const AccessID = result['AccessID'];
      const AccessPass = result['AccessPass'];
      return new RegisterGMOResponse(AccessID, AccessPass);
    });
  }

  async validateCreditCardGMO(
    AccessID: string,
    AccessPass: string,
    OrderID: string,
    Token: string,
    ClientField1: number,
  ): Promise<ValidateCardGMOResponse | ErrorGMOResponse> {
    const bodyFormData = new FormData();
    bodyFormData.append('AccessID', AccessID);
    bodyFormData.append('AccessPass', AccessPass);
    bodyFormData.append('OrderID', OrderID);
    bodyFormData.append('Token', Token);
    bodyFormData.append('ClientField1', ClientField1);
    const response = await this.httpService.post(
      process.env.GMO_API_ENDPOINT + `/payment/ExecTran.idPass`,
      bodyFormData,
      { headers: bodyFormData.getHeaders() },
    );

    return response.toPromise().then(async (response) => {
      Logger.log(`Validate Credit Card GMO : ${response.data}`);
      const result = await this.convertDataResponseGMO(response.data);
      if (result['ErrCode']) {
        const ErrCode = result['ErrCode'];
        const ErrInfo = result['ErrInfo'];
        return new ErrorGMOResponse(ErrCode, ErrInfo);
      }
      const OrderID = result['OrderID'];
      const Approve = result['Approve'];
      const TranID = result['TranID'];
      const TranDate = result['TranDate'];
      return new ValidateCardGMOResponse(OrderID, Approve, TranID, TranDate);
    });
  }

  async purchaseValidateCreditCardGMO(
    AccessID: string,
    AccessPass: string,
    OrderID: string,
    WalletID: number,
  ): Promise<PurchaseValidateCardGMOResponse | ErrorGMOResponse> {
    const bodyFormData = new FormData();
    bodyFormData.append('AccessID', AccessID);
    bodyFormData.append('AccessPass', AccessPass);
    bodyFormData.append('SiteID', process.env.SITE_ID);
    bodyFormData.append('SitePass', process.env.SITE_PASS);
    bodyFormData.append('OrderID', OrderID);
    bodyFormData.append('MemberID', WalletID);
    bodyFormData.append('Method', GMO_METHOD);
    bodyFormData.append('CardSeq', GMO_CARD_SEQ);
    bodyFormData.append('ClientField1', WalletID);
    const response = await this.httpService.post(
      process.env.GMO_API_ENDPOINT + `/payment/ExecTran.idPass`,
      bodyFormData,
      { headers: bodyFormData.getHeaders() },
    );

    return response.toPromise().then(async (response) => {
      Logger.log(`Validate Credit Card GMO : ${response.data}`);
      const result = await this.convertDataResponseGMO(response.data);
      if (result['ErrCode']) {
        const ErrCode = result['ErrCode'];
        const ErrInfo = result['ErrInfo'];
        return new ErrorGMOResponse(ErrCode, ErrInfo);
      }
      const Approve = result['Approve'];
      const Forward = result['Forward'];
      const TranID = result['TranID'];
      const TranDate = result['TranDate'];
      return new PurchaseValidateCardGMOResponse(
        Approve,
        Forward,
        TranID,
        TranDate,
      );
    });
  }

  async saveMemberGMO(
    WalletID: number,
  ): Promise<SaveMemberGMOResponse | ErrorGMOResponse> {
    const bodyFormData = new FormData();
    bodyFormData.append('SiteID', process.env.SITE_ID);
    bodyFormData.append('SitePass', process.env.SITE_PASS);
    bodyFormData.append('MemberID', WalletID);
    const response = await this.httpService.post(
      process.env.GMO_API_ENDPOINT + `/payment/SaveMember.idPass`,
      bodyFormData,
      { headers: bodyFormData.getHeaders() },
    );

    return response.toPromise().then(async (response) => {
      Logger.log(`Save Member GMO : ${response.data}`);
      const result = await this.convertDataResponseGMO(response.data);

      if (result['ErrCode']) {
        const ErrCode = result['ErrCode'];
        const ErrInfo = result['ErrInfo'];
        return new ErrorGMOResponse(ErrCode, ErrInfo);
      }
      const MemberID = result['MemberID'];
      return new SaveMemberGMOResponse(MemberID);
    });
  }

  async saveCardGMO(
    WalletID: number,
    SaveCardToken: string,
    checkHasWallet: boolean,
  ): Promise<SaveCardGMOResponse | ErrorGMOResponse> {
    const bodyFormData = new FormData();
    bodyFormData.append('SiteID', process.env.SITE_ID);
    bodyFormData.append('SitePass', process.env.SITE_PASS);
    bodyFormData.append('MemberID', WalletID);
    bodyFormData.append('Token', SaveCardToken);
    if (checkHasWallet) {
      bodyFormData.append('CardSeq', GMO_CARD_SEQ); // Default card sequence is 0
    }
    console.log(bodyFormData);
    const response = await this.httpService.post(
      process.env.GMO_API_ENDPOINT + `/payment/SaveCard.idPass`,
      bodyFormData,
      { headers: bodyFormData.getHeaders() },
    );

    return response.toPromise().then(async (response) => {
      Logger.log(`Save Card GMO : ${response.data}`);
      const result = await this.convertDataResponseGMO(response.data);

      if (result['ErrCode']) {
        const ErrCode = result['ErrCode'];
        const ErrInfo = result['ErrInfo'];
        return new ErrorGMOResponse(ErrCode, ErrInfo);
      }
      const CardNo = result['CardNo'];
      const Forward = result['Forward'];
      return new SaveCardGMOResponse(CardNo, Forward);
    });
  }

  async convertDataResponseGMO(data: string) {
    const result = [];
    data.split('&').map((item) => {
      const [key, value] = item.split('=');
      result[key] = value;
    });
    return result;
  }
}
