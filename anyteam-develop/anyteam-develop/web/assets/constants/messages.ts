export const invalidEmail = 'このメールアドレスは既に使用されています。';
export const invalidPassword = 'パスワードは半角英数字6文字〜50文字で入力してください。';
export const invalidRequired = 'この項目は必須です。';
export const invalidMinVal = '最低金額以上の値を入力してください';
export const unmatchedPassword = '確認パスワードが一致しません。';
export const loginFailureMessage = 'ログインに失敗しました';
export const registerFailureMessage = '登録に失敗しました。';
export const updateFailureMessage = '更新に失敗しました。';
export const logoutFailureMessage = 'ログアウトに失敗しました。';
export const noData = '該当データが存在しません。';
export const dateExpired = '有効期限が過ぎています';
export const invalidMonthExpired = () => '有効期限(月)は01～12までの数字2桁で入力してください。';
export const invalidLength = (length: number | string) =>
  `このフィールドは${length}文字で入力してください。`;
export const invalidMaxLength = (length: number) =>
  `このフィールドは${length}文字以下で入力してください。`;
export const invalidMinLength = (length: number) =>
  `このフィールドは${length}文字以上で入力してください。`;
