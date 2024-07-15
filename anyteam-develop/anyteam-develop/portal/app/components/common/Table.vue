<template>
  <table>
    <slot />
  </table>
</template>

<script>
export default {
  name: "Table"
}
</script>

<style lang="scss" scoped>
table::v-deep {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0 10px;
  color: var(--dark-blue);
  text-align: left;

  &>thead {
    border-collapse: separate;
    border-bottom: 2px solid var(--dark-blue);

    &>tr>th {
      padding-top: 1.3rem;
      padding-bottom: 1.3rem;
      font-size: 1.2rem;
      font-weight: normal;
      &.center {
        text-align: center;
      }
    }
  }
  &>tbody {
    border-collapse: separate;
    border-bottom: 2px solid var(--dark-blue);

    &>tr {
      border-bottom: 2px solid var(--light-gray);
      &.active {
        background-color: var(--light-gray);
      }
      &:last-child {
        border-color: var(--dark-blue);
      }
      &>td {
        height: 4.4rem;
        font-size: 1.2rem;
        &.center {
          text-align: center;
        }
      }
    }
  }
}

</style>
