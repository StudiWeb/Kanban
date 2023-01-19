<template>
  <li>
    <router-link class="nav-link d-flex align-items-center" :to="'/' + page">
      <slot name="icon"></slot>
      <span class="ml-2">{{ title }}</span>
    </router-link>
  </li>
</template>

<script>
export default {
  props: ["title", "page"],
};
</script>

<style scoped>
.nav-link:hover {
  color: #f8f9fa;
  background-color: #333;
}
</style>
