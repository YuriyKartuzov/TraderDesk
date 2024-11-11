<template>
  <div id="app">
    <nav class="navbar">
      <div class="logo" @click="clearLocalStorage()">Paradigm Capital</div>
      <ul class="nav-links">
        <li v-if="$route.name === 'client'">
          <router-link to="/" class="home_link">Home</router-link>
        </li>
      </ul>
    </nav>

    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    clearLocalStorage() {
      localStorage.clear()
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #456c9d;
  color: white;
}

.logo {
  font-size: 1.5em;
  cursor: pointer;
}

.nav-links {
  list-style-type: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 20px;
}

.nav-links li {
  display: flex;
  align-items: center;
}

.home_link {
  text-decoration: none;
  color: white;
  font-size: 1.2em;
}

.home_link:hover {
  color: #f39c12;
}
</style>
