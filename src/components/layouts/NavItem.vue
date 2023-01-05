<template>
  <li>
    <router-link class="nav-link" :to="'/' + page">{{ title }}</router-link>
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
