<template>
  <div class="com-flow-support">
    <div class="com-flow-support__item">
      <div class="com-flow-support__title">支援者</div>
      <div class="com-flow-support__icon">
        <img src="/public/images/about/icon-flow-supporter.svg" />
      </div>
      <div class="com-flow-support__connect com-flow-support__connect--1">
        <span class="com-flow-support__connect-text">支援金</span>
        <img src="/public/images/about/icon-flow-arrow-right.svg" />
      </div>
    </div>
    <div class="com-flow-support__item">
      <div class="com-flow-support__title">ANYTEAM</div>
      <div class="com-flow-support__icon">
        <img src="/public/images/about/icon-flow-anyteam.svg" />
      </div>
      <div class="com-flow-support__connect com-flow-support__connect--2">
        <div class="text-center">
          <span class="com-flow-support__connect-text">支援金</span>
          <img src="/public/images/about/icon-flow-arrow-right.svg" />
        </div>
        <div class="text-center">
          <img src="/public/images/about/icon-flow-arrow-left.svg" />
          <span class="com-flow-support__connect-text">システム利用料</span>
        </div>
      </div>
    </div>
    <div class="com-flow-support__item">
      <div class="com-flow-support__title">学校</div>
      <div class="com-flow-support__icon">
        <img src="/public/images/about/icon-flow-school.svg" />
      </div>
      <div class="com-flow-support__connect com-flow-support__connect--3">
        <span class="com-flow-support__connect-text">支援金</span>
        <img src="/public/images/about/icon-flow-three-arrows.svg" />
      </div>
    </div>
    <div class="com-flow-support__item">
      <div class="com-flow-support__title">部活</div>
      <div class="com-flow-support__icon">
        <img src="/public/images/about/icon-flow-clubs.svg" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.com-flow-support {
  display: flex;
  max-width: 584px;
  margin: auto;
  &__item {
    background: var(--light-color);
    position: relative;
    margin: 0 3px;
    width: 100%;
  }
  &__title {
    font-size: 1rem;
    font-weight: normal;
    text-align: center;
    margin-top: 6px;
  }
  &__icon {
    padding: 16px 0;
    height: 130px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__connect {
    position: absolute;
    font-size: 0.8rem;
    z-index: 9;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    img {
      width: 3.2rem;
    }
    &--1 {
      top: 40%;
      transform: translate(19px, 0px);
    }
    &--2 {
      top: 28%;
      transform: translate(34px, 0px);
    }
    &--3 {
      top: 10%;
      transform: translate(20px, 0px);
    }
    &-text {
      display: block;
      width: fit-content;
      background-color: var(--secondary-color);
      color: var(--white-color);
      padding: 2px 4px;
      margin-top: 1rem;
      margin-bottom: 1rem;
    }
  }
}
</style>
