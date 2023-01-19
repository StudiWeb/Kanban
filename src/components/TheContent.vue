<template>
  <main role="main" id="main" class="col-md-9 ml-auto col-lg-10 px-md-4">
    <div class="pt-3 pb-2 m-3">
      <router-view :key="$route.path"></router-view>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>
