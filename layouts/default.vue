<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="/">Cafe Pastor</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="/">Beranda</a>
            </li>
            <!-- <li class="nav-item">
              <a class="nav-link" href="#">Settings</a>
            </li> -->
          </ul>
        </div>
      </div>
    </nav>
    <div class="container mt-4">
      <slot />
    </div>
  </div>
</template>

<script setup>
// Tambahkan script setup jika perlu
</script>

<style scoped>
/* Tambahkan CSS untuk tema neumorphism */
body {
  background-color: #fdfdfd;
}

.navbar {
  border-radius: 12px;
  box-shadow: 8px 8px 16px #a3b1c6, -8px -8px 16px #ffffff;
}

.container {
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 8px 8px 16px #a3b1c6, -8px -8px 16px #ffffff;
}

.nav-link {
  color: #333 !important;
}

.nav-link:hover {
  color: #007bff !important;
}
</style>
