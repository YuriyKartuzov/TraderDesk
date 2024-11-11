export async function getAllClients() {
  try {
    //localStorage.clear()
    // DEBUG - to reduce number of network calls during dev
    if (localStorage.getItem('clients') != null) {
      console.log('Clients are retrieved from LOCAL storage')
      return JSON.parse(localStorage.getItem('clients'))
    }

    let offset = 0
    let response = await fetch(`/api/clients?limit=100&offset=${offset}`)
    if (!response.ok) throw new Error('Failed to fetch items')
    let data = await response.json()
    let numOfCLients = data.count
    let clients = [...data.items]

    if (numOfCLients > 100) {
      while (numOfCLients > (offset + 1) * 100) {
        offset++
        response = await fetch(`/api/clients?limit=100&offset=${offset * 100}`)
        if (!response.ok) throw new Error('Failed to fetch items')
        data = await response.json()
        clients = [...clients, ...data.items]
      }
    }

    // DEBUG - to reduce number of network calls during dev
    localStorage.setItem('clients', JSON.stringify(clients))

    console.log('Clients are returned from API CALL')
    return clients
  } catch (error) {
    console.error('Error fetching items:', error)
    throw error
  }
}

export async function getClientById(id) {
  try {
    // DEBUG - to reduce number of network calls during dev
    if (localStorage.getItem(`client_id_${id}`) != null) {
      console.log(`Client id ID: ${id} is retrieved from LOCAL storage`)
      return JSON.parse(localStorage.getItem(`client_id_${id}`))
    }

    let client_id = Number(id)
    let response = await fetch(`/api/clients/${client_id}`)
    if (!response.ok) throw new Error('Failed to fetch items')
    let data = await response.json()

    // DEBUG - to reduce number of network calls during dev
    localStorage.setItem(`client_id_${id}`, JSON.stringify(data))

    console.log(`Client with ID: ${id} are returned from API CALL`)
    return data
  } catch (e) {
    throw new Error('Failed to fetch items')
  }
}

export async function getAllTrades() {
  try {
    // DEBUG - to reduce number of network calls during dev
    if (localStorage.getItem('trades') != null) {
      console.log('All trades are retrieved from LOCAL storage')
      return JSON.parse(localStorage.getItem('trades'))
    }

    let offset = 0
    let response = await fetch(`/api/trades?limit=100&offset=${offset}`)
    if (!response.ok) throw new Error('Failed to fetch items')

    let data = await response.json()
    let numOfTrades = data.count
    let trades = [...data.items]

    if (numOfTrades > 100) {
      while (numOfTrades > (offset + 1) * 100) {
        offset++
        response = await fetch(`/api/trades?limit=100&offset=${offset * 100}`)
        if (!response.ok) throw new Error('Failed to fetch items')
        data = await response.json()
        trades = [...trades, ...data.items]
      }
    }

    // DEBUG - to reduce number of network calls during dev
    localStorage.setItem('trades', JSON.stringify(trades))

    console.log('All trades are returned from API CALL')
    return trades
  } catch (error) {
    console.error('Error fetching items:', error)
    throw error
  }
}

export async function getAllTradesByClientId(id) {
  try {
    // DEBUG - to reduce number of network calls during dev
    if (localStorage.getItem(`trades_for_client_${id}`) != null) {
      console.log(
        `Trades for the ClientID: ${id} are retrieved from LOCAL storage`
      )
      return JSON.parse(localStorage.getItem(`trades_for_client_${id}`))
    }

    let client_id = Number(id)
    let response = await fetch(`/api/clients/${client_id}/trades`)

    if (!response.ok) throw new Error('Failed to fetch items')
    let data = await response.json()

    console.log('TRADE DATA FROM API', data.trades)

    // DEBUG - to reduce number of network calls during dev
    localStorage.setItem(`trades_for_client_${id}`, JSON.stringify(data))

    console.log(`Trades for ClientID: ${id} are returned from API CALL`)
    return data
  } catch (e) {
    throw new Error('Failed to fetch items')
  }
}
