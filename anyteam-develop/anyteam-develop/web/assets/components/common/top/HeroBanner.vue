<template>
  <div class="com-hero-banner">
    <div class="com-hero-banner__background">
      <div class="com-hero-banner__background-transperant"></div>
    </div>
    <div class="com-hero-banner__inner">
      <div class="sp-only">
        <div class="com-hero-banner__title">ANYTEAM</div>
        <div class="com-hero-banner__subtitle">部活支援プラットフォーム</div>
        <div class="com-hero-banner__desc mt-25">
          <div>あなたとTEAM</div>
          <div class="mt-11">もっと強く</div>
          <div>もっと熱く</div>
          <div>もっと身近に</div>
          <div class="mt-11">”支援”の力で繋がろう</div>
        </div>
        <div class="mt-27">
          <a href="/#search">
            <button class="btn btn-secondary btn-wide">部活を探す</button>
          </a>
        </div>
        <div class="flex justify-center">
          <a href="/about" class="com-hero-banner__about flex items-center">
            <div class="com-hero-banner__about-icon flex justify-center items-center">
              <img src="/public/images/top/icon-info.svg" alt="">
            </div>
            <p class="com-hero-banner__about-title">ANYTEAMとは？</p>
          </a>
        </div>
      </div>
      <div class="pc-tablet-only">
        <h1 class="com-hero-banner__title">あなたとTEAM</h1>
        <p class="com-hero-banner__subtitle">もっと強く、もっと熱く、もっと身近に　”支援”の力で繋がろう</p>
        <p class="com-hero-banner__subtitle">1,000校以上の幅広い部活動が支援を開始しています。</p>
        <a href="/#search">
          <button class="btn btn-secondary btn-wide com-hero-banner__button">部活を探す</button>
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {};
</script>

<style lang="scss" scoped>
.com-hero-banner {
  position: relative;
  padding-top: 231px;
  text-align: center;
  color: var(--white-color);
  &__inner {
    position: relative;
    z-index: 10;
    margin-top: -150px; 
  }
  &__subtitle {
    font-size: 16px;
    color: var(--white-color);
  }
  &__title {
    font-size: 40px;
    color: var(--white-color);
    line-height: 1em;
    font-weight: 800;
  }
  &__background {
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 380px;
    background-image: url("/public/images/top/hero.png");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    &-transperant {
      height: 100%;
      background-image: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(20,20,20,0) 20%, rgba(0,0,0,0) 100%);
    }
  }
  &__about {
    margin-top: 16px;
    color: var(--secondary-color);
    text-decoration-color: var(--secondary-color);
    &-icon {
      border-radius: 50%;
      width: 16px;
      height: 16px;
      border: 1px solid var(--secondary-color);
    }
    &-title {
      font-size: 12px;
      margin-left: 8px;
    }
  }
  @media screen and (min-width: 768px) {
    &__background {
      height: 650px;
      &-transperant {
        background-image: linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(20,20,20,0) 40%, rgba(0,0,0,0) 100%);
      }
    }
    &__inner {
      margin-top: -100px;
      height: 500px;
    }
    &__title {
      font-size: 60px;
      font-weight: normal;
    }
    &__button {
      border-radius: 999px;
      margin-top: 30px;
    }
  }
}
</style>