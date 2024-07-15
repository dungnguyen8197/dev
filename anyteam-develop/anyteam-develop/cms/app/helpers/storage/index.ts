const ACCESS_TOKEN = 'auth._token.local'

export default {
  getAccessToken() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${ACCESS_TOKEN}=`);
    if (parts.length === 2) {
      return parts
        .pop()!
        .split(';')
        .shift()!
        .replace('%20', ' ');
    }
  },
}
