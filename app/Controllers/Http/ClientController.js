'use strict'

const Client = use('App/Models/Client')
const Database = use('Database')

class ClientController {
  async index ({ response }) {
    const clients = await Client.query()
      .select('id', 'name', 'cpf')
      .orderBy('id')
      .fetch()

    return response.json(clients)
  }

  async show ({ params, request, response }) {
    const { month, year } = request.get()
    
    const client = await Client.query()
      .where('id', params.id)
      .with('addresses')
      .with('phones')
      .with('sales', (builder) => {
        builder.orderBy('sale_date', 'desc')
        if (month && year) {
          builder.whereRaw('MONTH(sale_date) = ? AND YEAR(sale_date) = ?', [month, year])
        }
      })
      .first()

    if (!client) {
      return response.status(404).json({ message: 'Client not found' })
    }

    return response.json(client)
  }

  async store ({ request, response }) {
    const trx = await Database.beginTransaction()
    
    try {
      const { addresses, phones, ...clientData } = request.only([
        'name',
        'cpf',
        'addresses',
        'phones'
      ])

      const client = await Client.create(clientData, trx)

      if (addresses && addresses.length > 0) {
        await client.addresses().createMany(addresses, trx)
      }

      if (phones && phones.length > 0) {
        await client.phones().createMany(phones, trx)
      }

      await trx.commit()
      
      await client.load('addresses')
      await client.load('phones')

      return response.created(client)
    } catch (error) {
      await trx.rollback()
      return response.status(400).json({
        message: 'Error during client registration.',
        error: error.message
      })
    }
  }

  async update ({ params, request, response }) {
    const client = await Client.find(params.id)

    if (!client) {
      return response.status(404).json({ message: 'Client not found' })
    }

    const trx = await Database.beginTransaction()

    try {
      const { addresses, phones, ...clientData } = request.only([
        'name',
        'cpf',
        'addresses',
        'phones'
      ])

      client.merge(clientData)
      await client.save(trx)

      if (addresses) {
        await client.addresses().delete(trx)
        await client.addresses().createMany(addresses, trx)
      }

      if (phones) {
        await client.phones().delete(trx)
        await client.phones().createMany(phones, trx)
      }

      await trx.commit()

      await client.load('addresses')
      await client.load('phones')

      return response.json(client)
    } catch (error) {
      await trx.rollback()
      return response.status(400).json({
        message: 'Error during client update.',
        error: error.message
      })
    }
  }

  async destroy ({ params, response }) {
    const client = await Client.find(params.id)

    if (!client) {
      return response.status(404).json({ message: 'Client not found' })
    }

    const trx = await Database.beginTransaction()

    try {
      await client.sales().delete(trx)
      await client.addresses().delete(trx)
      await client.phones().delete(trx)
      await client.delete(trx)

      await trx.commit()
      return response.status(204).send()
    } catch (error) {
      await trx.rollback()
      return response.status(400).json({
        message: 'Error during client deletion.',
        error: error.message
      })
    }
  }
}

module.exports = ClientController
