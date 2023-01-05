<template>
  <div class="card" style="min-height: 480px; max-height: 640px">
    <div class="card-header h5 text-center text-uppercase">{{ title }}</div>
    <div class="card-body d-flex flex-column align-items-center">
      <slot name="tasks"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "type"],

  mounted() {
    if (this.type === "todo") {
      $(".card:nth-child(1) .card-header:nth-child(1)").addClass("todo-header");
      $(".card:nth-child(1) .card-body:nth-child(2)").addClass("todo-body");
    } else if (this.type === "doing") {
      $(".card:nth-child(2) .card-header:nth-child(1)").addClass(
        "doing-header"
      );
      $(".card:nth-child(2) .card-body:nth-child(2)").addClass("doing-body");
    } else if (this.type === "testing") {
      $(".card:nth-child(3) .card-header:nth-child(1)").addClass(
        "testing-header"
      );
      $(".card:nth-child(3) .card-body:nth-child(2)").addClass("testing-body");
    } else if (this.type === "done") {
      $(".card:nth-child(4) .card-header:nth-child(1)").addClass("done-header");
      $(".card:nth-child(4) .card-body:nth-child(2)").addClass("done-body");
    }
  },
};
</script>

<style scoped>
.todo-header {
  background-color: rgba(0, 123, 255, 1);
  color: #fff;
}
.doing-header {
  background-color: rgba(220, 53, 69, 1);
  color: #fff;
}

.testing-header {
  background-color: rgba(255, 193, 7, 1);
  color: #fff;
}

.done-header {
  background-color: rgba(40, 167, 69, 1);
  color: #fff;
}

.todo-body {
  background-color: rgba(0, 123, 255, 0.125);
}
.doing-body {
  background-color: rgba(220, 53, 69, 0.125);
}

.testing-body {
  background-color: rgba(255, 193, 7, 0.125);
}

.done-body {
  background-color: rgba(40, 167, 69, 0.125);
}

.card-body {
  overflow-y: scroll;
}
</style>
