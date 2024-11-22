'use strict'

const Sale = use('App/Models/Sale')
const Product = use('App/Models/Product')
const Client = use('App/Models/Client')
const Database = use('Database')

class SaleController {
  async store ({ request, response }) {
    const data = request.only([
      'client_id',
      'product_id',
      'quantity'
    ])

    const trx = await Database.beginTransaction()

    try {
      const client = await Client.find(data.client_id)
      if (!client) {
        await trx.rollback()
        return response.status(404).json({ message: 'Client not found' })
      }

      const product = await Product.query()
        .where('id', data.product_id)
        .whereNull('deleted_at')
        .first()

      if (!product) {
        await trx.rollback()
        return response.status(404).json({ message: 'Product not found or inactive' })
      }

      if (product.stock < data.quantity) {
        await trx.rollback()
        return response.status(400).json({ message: 'Insufficient stock' })
      }

      const total_price = product.price * data.quantity

      const sale = await Sale.create({
        client_id: data.client_id,
        product_id: data.product_id,
        quantity: data.quantity,
        unit_price: product.price,
        total_price
      }, trx)

      product.stock -= data.quantity
      await product.save(trx)

      await trx.commit()

      await sale.load('client')
      await sale.load('product')

      return response.created(sale)
    } catch (error) {
      await trx.rollback()
      return response.status(400).json({
        message: 'Error during sale registration.',
        error: error.message
      })
    }
  }
}

module.exports = SaleController
