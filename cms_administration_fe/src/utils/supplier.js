import { getListMenuItem } from '@/api/user'
import { setTokenListMenuItem } from '@/utils/auth'
const supplierListMenu = (userInfo) => {
  return new Promise((resolve, reject) => {
    getListMenuItem({ email: userInfo.email, name: userInfo.name, phone: userInfo.phone })
      .then((res) => {
        if (res.error === 0) {
          setTokenListMenuItem(res.token)
        }
        resolve(res.data)
      })
      .catch((error) => {
        console.log('list supplier menu error: ', error)
        resolve(null)
      })
  })
}

export default supplierListMenu
