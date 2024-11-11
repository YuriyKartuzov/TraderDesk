<template>
  <div class="home">
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <div v-else>
      <span class="table-title">Clients</span>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search..."
        class="search-bar"
      />
    </div>

    <table class="clients-table">
      <thead>
        <tr>
          <th
            v-for="col in clinet_columns"
            :key="col.data_field"
            @click="sortTable(col.data_field)"
            class="table-header"
          >
            {{ col.disp }}
            <span
              v-if="
                sortColumn === col.data_field &&
                col.data_field != 'view_profile' &&
                col.data_field != 'client_name'
              "
              class="sort-icon"
            >
              {{ sortAsc ? '▲' : '▼' }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cl in filteredUsers" :key="cl.id" class="table-row">
          <td>{{ cl.company_name }}</td>
          <td>{{ cl.company_type }}</td>
          <td>{{ cl.location }}</td>
          <td>{{ cl.contact_name }}</td>
          <td>{{ cl.contact_title }}</td>
          <td>${{ cl.total_aum }} M</td>
          <td>{{ cl.risk_profile }}</td>

          <td>
            <router-link
              :to="{
                path: '/client/' + cl.id
              }"
              class="profile-link"
            >
              <font-awesome-icon
                :icon="['fas', 'address-card']"
                class="icon-profile"
              />
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { getAllClients } from '@/services/apiService'

export default {
  name: 'HomeView',
  data() {
    return {
      clients: [],
      loading: true,
      error: null,
      clinet_columns: [
        { disp: 'Company Name', data_field: 'company_name' },
        { disp: 'Company Type', data_field: 'company_type' },
        { disp: 'Location', data_field: 'location' },
        { disp: 'Name', data_field: 'contact_name' },
        { disp: 'Title', data_field: 'contact_title' },
        { disp: 'AUM', data_field: 'total_aum' },
        { disp: 'Risk', data_field: 'risk_profile' },
        { disp: 'View Profile', data_field: 'view_profile' }
      ],
      sortColumn: 'company_name',
      sortAsc: true,
      sortOrderForRisk: { Low: 3, Moderate: 2, High: 1 },
      searchQuery: ''
    }
  },
  async created() {
    try {
      this.clients = await getAllClients()
    } catch (err) {
      this.error = err.message
    } finally {
      this.loading = false
    }
  },
  computed: {
    filteredUsers() {
      if (!this.searchQuery) return this.clients

      return this.clients.filter(client => {
        const searchText = this.searchQuery.toLowerCase()
        return (
          client.company_name.toLowerCase().includes(searchText) ||
          client.company_type.toLowerCase().includes(searchText) ||
          client.location.toLowerCase().includes(searchText) ||
          client.contact_name.toLowerCase().includes(searchText) ||
          client.contact_title.toLowerCase().includes(searchText)
        )
      })
    }
  },
  methods: {
    sortTable(col) {
      if (col == 'view_profile' || col == 'contact_name') {
        return
      }

      if (this.sortColumn == col) {
        this.sortAsc = !this.sortAsc
      } else {
        this.sortAsc = true
        this.sortColumn = col
      }

      this.clients.sort((a, b) => {
        if (col == 'risk_profile') {
          const aPriority = this.sortOrderForRisk[a.risk_profile]
          const bPriority = this.sortOrderForRisk[b.risk_profile]
          return this.sortAsc ? aPriority - bPriority : bPriority - aPriority
        } else {
          if (a[col] < b[col]) return this.sortAsc ? -1 : 1
          if (a[col] > b[col]) return this.sortAsc ? 1 : -1
          return 0
        }
      })
    }
  }
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.table-title {
  font-size: 1.6em;
  font-weight: bold;
  margin-bottom: 10px;
}

.search-bar {
  margin-left: 40px;
  padding: 8px 12px;
  margin-bottom: 15px;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.clients-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.clients-table th,
.clients-table td {
  padding: 12px 15px;
  text-align: left;
}

.table-header {
  background-color: #cadeec;
  color: black;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 0.9em;
  font-weight: bold;
}

.table-row {
  transition: background-color 0.3s ease;
}

.table-row:hover {
  background-color: #f1f1f1;
}

.risk {
  padding: 8px 12px;
  text-align: center;
  font-weight: bold;
  display: flex;
  justify-content: center;
  color: #fff;
  height: 100%;
  white-space: nowrap;
  height: 100%;
}

.low {
  background-color: #3dfb8c;
}

.moderate {
  background-color: #f8c24f;
}

.high {
  background-color: #f57070;
}

.icon-profile {
  width: 100%;
  font-size: 1.4em;
  color: #456c9d;
  height: 35px;
}

.icon-profile:hover {
  color: #124078;
}

.profile-link {
  display: inline-block;
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.sort-icon {
  font-size: 0.8em;
  margin-left: 5px;
}

.clients-table td {
  font-size: 1em;
  line-height: 1.5;
}

.risk {
  text-align: center;
}
</style>
