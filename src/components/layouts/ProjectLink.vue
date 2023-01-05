<template>
  <li v-if="isVisible">
    <router-link class="nav-link" :to="'/' + page + '/' + id">{{
      title
    }}</router-link>
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
