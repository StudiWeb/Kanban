<template>
  <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
    <a class="navbar-brand col-md-3 col-lg-2 mr-0 px-3" href="/">Kanban</a>
    <button @click="toggleSidebar()" class="btn btn-dark ml-4 mr-auto">
      {{ tooggleButtonTitle }}
    </button>
    <button
      class="navbar-toggler position-absolute d-md-none collapsed"
      type="button"
      data-toggle="collapse"
      data-target="#sidebarMenu"
      aria-controls="sidebarMenu"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      tooggleButtonTitle: "Hide menu",
    };
  },

  methods: {
    toggleSidebar() {
      if (this.tooggleButtonTitle === "Hide menu") {
        $("#sidebarMenu").removeClass("d-md-block");
        this.tooggleButtonTitle = "Show menu";
        $("#main").removeClass('col-md-9 ml-auto col-lg-10 px-md-4"');
        $("#main").addClass("col-12");
      } else {
        $("#sidebarMenu").addClass("d-md-block");
        this.tooggleButtonTitle = "Hide menu";
        $("#main").addClass('col-md-9 ml-auto col-lg-10 px-md-4"');
      }
    },
  },
};
</script>
