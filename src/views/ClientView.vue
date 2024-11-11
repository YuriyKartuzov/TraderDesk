<template>
  <div class="profile-page">
    <div class="profile-column">
      <div class="customer-info" v-if="client">
        <h2>Client Profile</h2>
        <p><strong>Name:</strong> {{ client.contact_name }}</p>
        <p><strong>Title:</strong> {{ client.contact_title }}</p>
        <p><strong>Email:</strong> {{ client.contact_email }}</p>
        <p><strong>Phone:</strong> {{ client.contact_phone }}</p>
      </div>

      <div class="additional-info" v-if="client">
        <h3>Additional Details</h3>
        <p><strong>Company Name:</strong> {{ client.company_name }}</p>
        <p><strong>Compnay Type:</strong> {{ client.company_type }}</p>
        <p>
          <strong>Assets under Management:</strong> ${{ client.total_aum }}M
        </p>
        <p><strong>Location:</strong> {{ client.location }}</p>
        <p><strong>Tier:</strong> {{ client.tier }}</p>
        <p><strong>Year established:</strong> {{ client.year_established }}</p>
      </div>
    </div>

    <div class="trades-column" v-if="trades">
      <div class="aggregated-data">
        <div class="aggregated-section">
          <h4>Total Trades</h4>
          <p v-if="totalTrades">
            {{ totalTrades }}
          </p>
        </div>
        <div class="aggregated-section">
          <h4>Total Commission</h4>
          <p>${{ formatToTwoDecimals(totalCommission) }}</p>
        </div>
        <div class="aggregated-section">
          <h4>Risk Level</h4>
          <p>{{ client.risk_profile }}</p>
        </div>
      </div>

      <div class="trade-data">
        <h3>Trade History</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Stock</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Price</th>
              <th class="currency-field">Total</th>
              <th>Absolute Commision</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="trade in trades" :key="trade.id">
              <td>{{ trade.date }}</td>
              <td>{{ trade.ticker }}</td>
              <td>{{ trade.side }}</td>
              <td>
                {{ new Intl.NumberFormat('en-US').format(trade.quantity) }}
              </td>
              <td>
                ${{
                  new Intl.NumberFormat('en-US').format(
                    Number(trade.price).toFixed(2)
                  )
                }}
              </td>
              <td class="currency-field">
                ${{ formatToTwoDecimals(trade.quantity * trade.price) }}
              </td>

              <td>${{ formatToTwoDecimals(trade.abs_comm) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllTradesByClientId, getClientById } from '@/services/apiService'
export default {
  client_id: null,
  data() {
    return {
      client: null,
      trades: null,
      totalTrades: 0,
      totalCommission: 0.0
    }
  },
  async created() {
    try {
      // Get client (While i could have pass a client object from home component, I just wanted to use another API route)
      this.client_id = this.$route.params.id
      this.client = await getClientById(this.client_id)
      console.log(this.client)

      // Get Trades for the client
      this.trades = await getAllTradesByClientId(this.client_id)
      this.trades.sort((a, b) => new Date(b.date) - new Date(a.date))
      this.calculateAbsoluteCommision()
      console.log(this.trades)
    } catch (err) {
      this.error = err.message
    } finally {
      this.loading = false
    }
  },
  methods: {
    formatToFourDecimals(amount) {
      return parseFloat(amount).toFixed(4)
    },
    formatToTwoDecimals(amount) {
      return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount)
    },
    calculateAbsoluteCommision() {
      for (let i = 0; i < this.trades.length; i++) {
        const tr = this.trades[i]
        let abs_comm = 0

        switch (tr.commission_type) {
          case 'ABS':
            abs_comm = tr.commission_amount
            break
          case 'BP':
            abs_comm =
              (Number(tr.commission_amount) / 10000) * (tr.quantity * tr.price)
            break
          case 'PER':
            abs_comm =
              (Number(tr.commission_amount) / 100) * (tr.quantity * tr.price)
            break
        }

        this.trades[i].abs_comm = abs_comm
        this.totalCommission += parseFloat(abs_comm)
      }

      this.totalTrades = this.trades.length
    }
  }
}
</script>

<style scoped>
.profile-page {
  display: grid;
  grid-template-columns: 30% 70%;
  gap: 16px;
  height: 100vh;
  padding: 20px;
}

.profile-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.trades-column {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 16px;
}

.customer-info,
.additional-info,
.aggregated-data,
.trade-data {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.aggregated-data {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.aggregated-section {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th,
table td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

table th {
  background-color: #f0f0f0;
}

.trade-data {
  overflow-y: auto;
}

.currency-field {
  text-align: right;
}
</style>
