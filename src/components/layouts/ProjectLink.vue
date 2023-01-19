<template>
  <li v-if="isVisible">
    <router-link
      class="nav-link d-flex align-items-center"
      :to="'/' + page + '/' + id"
    >
      <slot name="icon"></slot>
      <span class="ml-2" m>{{ title }}</span>
    </router-link>
  </li>
</template>

<script>
export default {
  props: ["title", "isVisible", "page", "id"],
};
</script>

<style scoped>
.nav-link:hover {
  color: #f8f9fa;
  background-color: #333;
}
</style>
