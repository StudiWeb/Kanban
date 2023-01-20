<template>
  <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
    <a class="navbar-brand col-md-3 col-lg-2 mr-0 px-3" href="/">Kanban</a>
    <button
      @click="toggleSidebar()"
      class="btn btn-dark toggle-button ml-4 mr-auto"
    >
      <i class="bi bi-chevron-left"></i>
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
      toggle: true,
    };
  },

  methods: {
    toggleSidebar() {
      if (this.toggle) {
        this.toggle = false;
        const arrow = $('<i class="bi bi-chevron-right"></i>');
        $("#sidebarMenu").removeClass("d-md-block");
        $("#main").removeClass('col-md-9 ml-auto col-lg-10 px-md-4"');
        $("#main").addClass("col-12");
        $(".toggle-button").empty();
        $(".toggle-button").append(arrow);
      } else {
        this.toggle = true;
        const arrow = $('<i class="bi bi-chevron-left"></i>');
        $("#sidebarMenu").addClass("d-md-block");
        $("#main").addClass('col-md-9 ml-auto col-lg-10 px-md-4"');
        $(".toggle-button").empty();
        $(".toggle-button").append(arrow);
      }
    },
  },
};
</script>
