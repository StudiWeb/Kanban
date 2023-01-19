<template>
  <div class="team card">
    <h5 class="card-header text-center">{{ title }}</h5>
    <div class="card-body">
      <slot name="search"></slot>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Job position</th>
          </tr>
        </thead>
        <tbody>
          <slot></slot>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title"],
};
</script>

<style scoped>
.card-body {
  overflow-y: scroll;
}

@media (max-width: 1200px) {
  .team {
    height: 480px;
    width: 100%;
  }
}

@media (min-width: 1200px) {
  .team {
    height: 480px;
    width: 420px;
  }
}
</style>
