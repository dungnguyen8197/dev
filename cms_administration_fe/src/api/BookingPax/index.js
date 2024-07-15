import Resource from '@/api/resource'
import request from '@/utils/request'
const baseURL = process.env.VUE_APP_BASE_API
const URL_API_CARD_STB = 'https://parter_dev.vcallid.com/api/v1/cms-stb'
const URL_API_PAYMENT_HUB = process.env.VUE_APP_URL_API_PAYMENT_HUB
console.log('URL_API_PAYMENT_HUB_________', URL_API_PAYMENT_HUB)

class BookingPaxResource extends Resource {
  constructor() {
    super('booking-pax')
  }

  listBill(data) {
    return request({
      url: baseURL + `/${this.uri}/list-bill`,
      method: 'post',
      data: data
    })
  }
  detailBill(data) {
    return request({
      url: baseURL + `/${this.uri}/detail-bill`,
      method: 'post',
      data: data
    })
  }
  searchTeeTime(data) {
    return request({
      url: baseURL + `/${this.uri}/search-tee`,
      method: 'post',
      data: data
    })
  }
  listTeeTime(data) {
    return request({
      url: baseURL + `/${this.uri}/list-tee`,
      method: 'post',
      data: data
    })
  }
  createBooking(data) {
    return request({
      url: baseURL + `/${this.uri}/create-booking`,
      method: 'post',
      data: data
    })
  }
  updateBooking(data) {
    return request({
      url: baseURL + `/${this.uri}/update-bill`,
      method: 'post',
      data: data
    })
  }
  removeBooking(data) {
    return request({
      url: baseURL + `/${this.uri}/remove-bill`,
      method: 'post',
      data: data
    })
  }
  updateLockPax(data) {
    return request({
      url: baseURL + `/${this.uri}/update-lock-pax`,
      method: 'post',
      data: data
    })
  }
  updateLockPaxMultiple(data) {
    return request({
      url: baseURL + `/${this.uri}/updateLockPaxMultiple`,
      method: 'post',
      data: data
    })
  }
  searchOtherService(query) {
    return request({
      url: baseURL + `/${this.uri}/search-product`,
      method: 'get',
      params: query
    })
  }

  detailProduct(query) {
    return request({
      url: baseURL + `/${this.uri}/detail-product`,
      method: 'get',
      params: query
    })
  }

  searchInsurance(query) {
    return request({
      url: baseURL + `/${this.uri}/get-list-insurance`,
      method: 'get',
      params: query

    })
  }
  checkTimeMoneyInsurance(data) {
    return request({
      url: baseURL + `/${this.uri}/check-time-money-insurance`,
      method: 'post',
      data: data

    })
  }

  billConfirm(data) {
    return request({
      url: baseURL + `/${this.uri}/confirm-bill`,
      method: 'post',
      data: data
    })
  }

  mapUserByPhone(data) {
    return request({
      url: baseURL + `/${this.uri}/map-user-by-phone`,
      method: 'post',
      data: data
    })
  }

  createMiSaVoucher(data) {
    return request({
      url: baseURL + `/${this.uri}/create-misa-voucher`,
      method: 'post',
      data: data
    })
  }

  confirmPaymentBill(data) {
    return request({
      url: baseURL + `/${this.uri}/comfirm-payment-general-bill`,
      method: 'post',
      data: data
    })
  }

  updatePricePax(data) {
    return request({
      url: baseURL + `/${this.uri}/sale-pax`,
      method: 'post',
      data: data
    })
  }

  getCardByUser(data) {
    return request({
      url: baseURL + `/${this.uri}/get-card-by-user`,
      method: 'post',
      data: data
    })
  }

  getBookingDayDebt(data) {
    return request({
      url: baseURL + `/${this.uri}/check-day-debt-by-admin`,
      method: 'post',
      data: data
    })
  }
  getWarningBookingDayDebt(data) {
    return request({
      url: baseURL + `/${this.uri}/warning-day-debt-by-admin`,
      method: 'post',
      data: data
    })
  }
  updateAccountant(data) {
    return request({
      url: baseURL + `/${this.uri}/update-accountant`,
      method: 'post',
      data: data
    })
  }

  sendMailFacility(data) {
    return request({
      url: baseURL + `/${this.uri}/send-mail-facility`,
      method: 'post',
      data: data
    })
  }

  sendMailSacombank(data) {
    return request({
      url: baseURL + `/${this.uri}/send-mail-sacombank`,
      method: 'post',
      data: data
    })
  }

  exportBill(data) {
    return request({
      url: baseURL + `/${this.uri}/export-bill`,
      method: 'post',
      data: data
    })
  }

  getDetailCodePaymentBooking(data) {
    return request({
      url: 'https://api-other-services.vcallid.com/api/v1/other_services/list_transaction_booking_by_pax',
      method: 'post',
      data: data
    })
  }

  createCodePaymentBooking(data, params) {
    return request({
      url: 'https://api-booking-v2.vcallid.com/api/v1/payment_booking/create_payment_booking_for_cms?' + params,
      method: 'post',
      data: data
    })
  }
  listCategory(query) {
    return request({
      url: `${this.uri}/list-category`,
      method: 'get',
      params: query
    })
  }

  updateCategory(data, id) {
    return request({
      url: `${this.uri}/update-category/${id}`,
      method: 'post',
      data: data
    })
  }

  createCategory(data) {
    return request({
      url: `${this.uri}/create-category`,
      method: 'post',
      data: data
    })
  }
  listDataUser(query) {
    return request({
      url: `${this.uri}/list-data-user`,
      method: 'get',
      params: query
    })
  }
  listRequestOrder(query) {
    return request({
      url: `${this.uri}/list-request-order`,
      method: 'get',
      params: query
    })
  }

  updateStatusConfirmRequest(data, id) {
    return request({
      url: `${this.uri}/update-status-confirm-request/${id}`,
      method: 'post',
      data: data
    })
  }

  listHistoryLog(query) {
    return request({
      url: `${this.uri}/list-history-log`,
      method: 'get',
      params: query
    })
  }
  detailHistoryLog(query) {
    return request({
      url: `${this.uri}/detail-history-log`,
      method: 'get',
      params: query
    })
  }

  listPaymentPoint(data) {
    return request({
      url: `${this.uri}/list-payment-point`,
      method: 'post',
      data: data
    })
  }

  updateStatisticBill(resource) {
    return request({
      url: baseURL + `/${this.uri}/update-statistic-bill`,
      method: 'post',
      data: resource
    })
  }

  updateBookedSurchargeEntryPrice(resource) {
    return request({
      url: baseURL + `/${this.uri}/update-booked-surcharge-entry-price`,
      method: 'post',
      data: resource
    })
  }

  updateSuplierBill(resource) {
    return request({
      url: baseURL + `/${this.uri}/update-supplier-bill`,
      method: 'post',
      data: resource
    })
  }

  confirmExpense(resource) {
    return request({
      url: baseURL + `/${this.uri}/confirm-expense`,
      method: 'post',
      data: resource
    })
  }

  updatePaymentServiceChildStatistic(resource) {
    return request({
      url: baseURL + `/${this.uri}/update-payment-service-child-statistic`,
      method: 'post',
      data: resource
    })
  }

  updatePaymentBillCodePaymnet(resource) {
    return request({
      url: baseURL + `/${this.uri}/update-payment-bill-code-payment`,
      method: 'post',
      data: resource
    })
  }

  updateDataJson(resource) {
    return request({
      url: baseURL + `/${this.uri}/update-data-json`,
      method: 'post',
      data: resource
    })
  }
  searchAgentNew(query) {
    return request({
      url: `${this.uri}/search-agent`,
      method: 'get',
      params: query
    })
  }
  createInsurance(data) {
    return request({
      url: `${this.uri}/create-insurance`,
      method: 'post',
      data: data
    })
  }

  getFacilityCanBuyInsurance(query) {
    return request({
      url: `${this.uri}/get-facility-can-buy-insurance`,
      method: 'get',
      params: query
    })
  }

  getListsPriceByHoleInsurance(query) {
    return request({
      url: `${this.uri}/get-list-price-by-hole-insurance`,
      method: 'get',
      params: query
    })
  }

  getGolferByIdInsurance(query) {
    return request({
      url: `${this.uri}/get-golfer-by-id-insurance`,
      method: 'get',
      params: query
    })
  }

  onCheckGolferId(data) {
    return request({
      url: `${this.uri}/check-golfer-id-cms`,
      method: 'post',
      data: data
    })
  }

  onCheckGolferPassport(data) {
    return request({
      url: `${this.uri}/check-golfer-passport-cms`,
      method: 'post',
      data: data
    })
  }

  onCheckGolferSoldInsurance(data) {
    return request({
      url: `${this.uri}/check-golfer-sold-insurance`,
      method: 'post',
      data: data
    })
  }
  getListsOptionsMember(query) {
    return request({
      url: `${this.uri}/get-list-option-member`,
      method: 'get',
      params: query
    })
  }

  getDetailInsurance(query) {
    return request({
      url: `${this.uri}/get-detail-insurance-cms`,
      method: 'get',
      params: query
    })
  }

  onGetHoleSelectInsurance(query) {
    return request({
      url: `${this.uri}/get-hole-insurance-cms`,
      method: 'get',
      params: query
    })
  }
  onUpdateOrCreateMember(data) {
    return request({
      url: `${this.uri}/create-member-insurance-cms`,
      method: 'post',
      data: data
    })
  }
  onDeleteMemberInsurance(data) {
    return request({
      url: `${this.uri}/delete-member-insurance-cms`,
      method: 'post',
      data: data
    })
  }
  onCreateUserNameInsuranceOut(data) {
    return request({
      url: `${this.uri}/create-member-insurance-out-cms`,
      method: 'post',
      data: data
    })
  }
  onGetMemberInsurance(query) {
    return request({
      url: `${this.uri}/get-member-insurance-cms`,
      method: 'get',
      params: query
    })
  }

  updateInsurance(data) {
    return request({
      url: `${this.uri}/update-insurance`,
      method: 'post',
      data: data
    })
  }

  viewCertificateInsurance(query) {
    return request({
      url: `${this.uri}/get-certificate-cms`,
      method: 'get',
      params: query
    })
  }

  getDetailBillCore(query) {
    return request({
      url: `${this.uri}/get-detail-bill-core`,
      method: 'get',
      params: query
    })
  }
  getCardByUserSTB(query) {
    return request({
      url: `${URL_API_CARD_STB}/get_list_free_golf`,
      method: 'get',
      params: query
    })
  }

  createCodePaymentGeneralBill(data) {
    return request({
      url: `${this.uri}/create-code-payment-general-bill`,
      method: 'post',
      data: data
    })
  }

  getDetailCodePaymentGeneralBill(data) {
    return request({
      url: 'https://api-payment-prod.vcallid.com/api/v1/paymenthub/get_code_payment_by_bill',
      method: 'post',
      data: data
    })
  }
  getFacilitySTB(query) {
    return request({
      url: `${URL_API_CARD_STB}/get_location_id`,
      method: 'get',
      params: query
    })
  }

  listBillSearchArrayGB(data) {
    return request({
      url: `${this.uri}/list-bill-search-array-GB`,
      method: 'post',
      data: data
    })
  }

  addProviderToTransactionMoneyIn(data) {
    return request({
      url: `${this.uri}/add-provider-to-transaction-money-in`,
      method: 'post',
      data: data
    })
  }
  clearCodePaymentStatus(data) {
    return request({
      url: baseURL + `/${this.uri}/clear-code-payment-status`,
      method: 'post',
      data: data
    })
  }
  getRevenueBillBySale(data) {
    return request({
      url: URL_API_PAYMENT_HUB + `/get_revenue_bill`,
      method: 'post',
      data: data
    })
  }
  getDataCompanyByTaxCode(data) {
    return request({
      url: `https://api-payment-prod.vcallid.com/api/v1/misa/get_data_company_by_tax_code`,
      method: 'post',
      data: data
    })
  }
  get_account_object(data) {
    return request({
      url: `https://api-payment-prod.vcallid.com/api/v1/misa/get_account_object`,
      method: 'post',
      data: data
    })
  }
  warningTeetimeByAdmin(data) {
    return request({
      url: baseURL + `/${this.uri}/warning-teetime-by-admin`,
      method: 'post',
      data: data
    })
  }
  updateDateDebt(resource) {
    return request({
      url: baseURL + `/${this.uri}/update_date_debt`,
      method: 'post',
      data: resource
    })
  }
}
export { BookingPaxResource as default }
