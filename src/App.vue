<template>

  <TheHeader/>
  <the-container>
    <TheNav />
    <TheMain />
  </the-container>
</template>

<script>

import TheHeader from './components/layouts/TheHeader.vue';
import TheNav from './components/layouts/TheNav.vue';
import TheMain from './components/TheMain.vue';

export default {

  components: {
    TheHeader,
    TheNav,
    TheMain
  }

}

</script>

<style>
body {
  font-size: .875rem;
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
  padding-top: .75rem;
  padding-bottom: .75rem;
  font-size: 1rem;
  background-color: rgba(0, 0, 0, .25);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, .25);
}

.navbar .navbar-toggler {
  top: .25rem;
  right: 1rem;
}

.navbar .form-control {
  padding: .75rem 1rem;
  border-width: 0;
  border-radius: 0;
}

.form-control-dark {
  color: #fff;
  background-color: rgba(255, 255, 255, .1);
  border-color: rgba(255, 255, 255, .1);
}

.form-control-dark:focus {
  border-color: transparent;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, .25);
}

/*
 * styles for tabs in components
 */

.nav-pills .active-list {
    color : #fff;
    background-color: #007bff !important;
}

.nav-pills .active-add {
    color : #fff;
    background-color: #28a745 !important;
}

.nav-pills .active-edit {
    color : #343a40;
    background-color: #ffc107 !important;
}

.nav-pills .active-delete {
    color : #fff;
    background-color: #dc3545 !important;
}
</style>