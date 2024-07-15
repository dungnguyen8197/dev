const { VietQR } = require('vietqr')

const vietQR = new VietQR({
  clientID: '60f41ee0-fe93-4778-978e-75c7bf53e643',
  apiKey: '4d4e5294-e3a6-4a9c-9fa2-fc92cc47dd2b'
})
// create QR code from data
async function genQrCode({ bank, accountName, accountNumber, amount, memo, template }) {
  if (!template) template = 'compact'
  console.log('INFO', JSON.stringify({
    bank,
    accountName,
    accountNumber,
    amount,
    memo,
    template
  }))
  const result = await vietQR.genQRCodeBase64({
    bank,
    accountName,
    accountNumber,
    amount,
    memo,
    template
  })
  if (result && result.data && result.data.code === '00') {
    return {
      error_code: 0,
      result: result.data.data.qrDataURL
    }
  } else {
    return {
      error_code: 1,
      error_info: result
    }
  }
}

module.exports = {
  genQrCode
}
