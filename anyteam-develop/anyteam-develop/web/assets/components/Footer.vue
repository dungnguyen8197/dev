<template>
  <div>
    <div class="footer__wrap">
      <div class="section-container footer__container-1">
        <div class="footer__head">
          <img class="footer__logo" src="/public/images/common/icon-logo-white.svg" alt="ANYTEAM" />
          <div class="flex items-center justify-between">
            <a href="#" class="footer__sns flex items-center justify-center mr-10">
              <img src="/public/images/common/icon-twitter.svg" alt="twitter" />
            </a>
            <a href="#" class="footer__sns flex items-center justify-center mr-10">
              <img src="/public/images/common/icon-facebook.svg" alt="facebook" />
            </a>
            <a href="#" class="footer__sns flex items-center justify-center">
              <img src="/public/images/common/icon-instagram.svg" alt="instagram" />
            </a>
          </div>
        </div>
        <div class="sp-only">
          <div class="footer__link">
            <a href="/about" class="text-deco-none text-sm">ANYTEAMとは？</a>
          </div>
          <div class="footer__link">
            <a href="/about/terms" class="text-deco-none text-sm">利用規約</a>
          </div>
          <div class="footer__link">
            <a href="/about/commercial-transactions" class="text-deco-none text-sm">特定商取引法に基づく表記</a>
          </div>
          <div class="footer__link">
            <a href="/about/privacy" class="text-deco-none text-sm">プライバシーポリシー</a>
          </div>
          <div class="footer__link">
            <a href="/about/company" class="text-deco-none text-sm">運営会社</a>
          </div>
        </div>
        <div class="pc-tablet-only flex justify-between footer__links-pc">
          <div>
            <div class="mb-15 text-base">ANYTEAMについて</div>
            <div class="footer__link">
              <a href="/about" class="text-deco-none text-sm"><span></span>ANYTEAMとは？</a>
            </div>
            <div class="footer__link">
              <a href="/about/support" class="text-deco-none text-sm"><span></span>支援の流れについて</a>
            </div>
            <div class="footer__link">
              <a href="#" class="text-deco-none text-sm"><span></span>寄付控除について</a>
            </div>
          </div>
          <div>        
            <div class="footer__link mb-25">
              <a href="/#search" class="text-deco-none text-base">部活を探す</a>
            </div>
            <div class="footer__link">
              <a href="/about/faq" class="text-deco-none text-base">お問い合わせ（Q&A)</a>
            </div>
          </div>
        </div>
        <div class="pc-tablet-only">
          <a href="/user/register">
            <button class="footer__button">会員登録</button>
          </a>
          <a href="/user/login">
            <button class="footer__button">ログイン</button>
          </a>
        </div>
      </div>
    </div>
    <div class="pc-tablet-only footer__foot">
      <div class="section-container flex justify-between items-center">
        <div class="flex items-center">
          <div class="footer__link">
            <a href="/about/company" class="text-deco-none text-sm">運営会社</a>
          </div>
          <span></span>
          <div class="footer__link">
            <a href="/about/terms" class="text-deco-none text-sm">利用規約</a>
          </div>
          <span></span>
          <div class="footer__link">
            <a href="/about/privacy" class="text-deco-none text-sm">プライバシーポリシー</a>
          </div>
        </div>
        <div class="text-xs">© 2021 Undotsushin, Inc.</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
.footer {
  &__wrap {
    background-color: var(--secondary-color);
    color: var(--white-color);
    padding-top: 4rem;
    padding-bottom: 4rem;
  }
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  &__logo {
    width: 100px;
  }
  &__sns {
    border: 1px solid var(--white-color);
    border-radius: 50%;
    width: 4rem;
    height: 4rem;
    padding: 1rem;
  }
  &__link {
    padding: 0.4rem 0;
    cursor: pointer;
    & > a {
      color: var(--white-color);
    }

    &:hover > a {
      text-decoration: underline;
    }
    span {
      display: inline-block;
      height: 2px;
      width: 10px;
      margin: 0 5px 3px 0;
      background-color: var(--white-color);
      border-radius: 1px;
    }
  }
  &__button {
    display: block;
    text-decoration: none;
    background-color: var(--white-color);
    color: var(--secondary-color);
    border: none;
    border-radius: 999px;
    padding: 0.6rem 3.6rem;
    margin-bottom: 1rem;
    font-size: 1.4rem;
    cursor: pointer;
  }
  &__foot {
    border-top: 1px solid #1367D5;
    background-color: var(--secondary-color);
    color: var(--white-color);
    span {
      width: 1px;
      height: 13px;
      margin-right: 1rem;
      margin-left: 1rem;
      background-color: var(--white-color);
    }
  }
  @media screen and (min-width: 768px) {
    &__container-1 {
      display: flex;
      justify-content: space-between;
    }
    &__head {
      flex-direction: column;
      justify-content: flex-start;
    }
    &__logo {
      width: 160px;
      margin-bottom: 2rem;
    }
    &__sns {
      width: 4.7rem;
      height: 4.7rem;
      background-color: #1367D5;
      border: none;
    }
    &__links-pc {
      min-width: 30rem;
    }
  }
  @media screen and (min-width: 992px) {
    &__links-pc {
      min-width: 40rem;
    }
  }
}
</style>