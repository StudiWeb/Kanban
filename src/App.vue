<template>
  <TheHeader />
  <div class="container-fluid">
    <div class="row">
      <TheNav />
      <TheMain />
    </div>
  </div>
</template>

<script>
import TheHeader from "./components/layouts/TheHeader.vue";
import TheNav from "./components/layouts/TheNav.vue";
import TheMain from "./components/TheMain.vue";

export default {
  components: {
    TheHeader,
    TheNav,
    TheMain,
  },
};
</script>

<style>
body {
  font-size: 0.875rem;
}

.feather {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}

/*
 * Navbar
 */

.navbar-brand {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  font-size: 1rem;
  background-color: rgba(0, 0, 0, 0.25);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.25);
}

.navbar .navbar-toggler {
  top: 0.25rem;
  right: 1rem;
}

.navbar .form-control {
  padding: 0.75rem 1rem;
  border-width: 0;
  border-radius: 0;
}

.form-control-dark {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
}

.form-control-dark:focus {
  border-color: transparent;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25);
}

/*
*styles for tooltips
*/

[rel="tolltip"] {
  content: attr(title);
  z-index: 9999;
}

.tooltip-inner {
  max-width: 340px;
  background-color: #007bff !important;
}

.tooltip.bs-tooltip-right .arrow:before {
  border-right-color: #007bff !important;
}
.tooltip.bs-tooltip-left .arrow:before {
  border-left-color: #007bff !important;
}
.tooltip.bs-tooltip-bottom .arrow:before {
  border-bottom-color: #007bff !important;
}
.tooltip.bs-tooltip-top .arrow:before {
  border-top-color: #007bff !important;
}

/*
 * styles for tabs in components
 */

.nav-pills .active-list {
  color: #fff;
  background-color: #007bff !important;
}

.nav-pills .active-add {
  color: #fff;
  background-color: #28a745 !important;
}

.nav-pills .active-edit {
  color: #343a40;
  background-color: #ffc107 !important;
}

.nav-pills .active-delete {
  color: #fff;
  background-color: #dc3545 !important;
}
</style>
