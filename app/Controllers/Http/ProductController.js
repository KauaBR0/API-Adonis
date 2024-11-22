'use strict'

const Product = use('App/Models/Product')
const Database = use('Database')

class ProductController {
  async index ({ response }) {
    const products = await Product.query()
      .select('id', 'name', 'price', 'stock')
      .whereNull('deleted_at')
      .orderBy('name', 'asc')
      .fetch()

    return response.json(products)
  }

  async show ({ params, response }) {
    const product = await Product.query()
      .where('id', params.id)
      .whereNull('deleted_at')
      .first()

    if (!product) {
      return response.status(404).json({ message: 'Product not found' })
    }

    return response.json(product)
  }

  async store ({ request, response }) {
    const data = request.only([
      'name',
      'description',
      'price',
      'sku',
      'stock'
    ])

    try {
      const product = await Product.create(data)
      return response.created(product)
    } catch (error) {
      return response.status(400).json({
        message: 'Error during product registration.',
        error: error.message
      })
    }
  }

  async update ({ params, request, response }) {
    const product = await Product.query()
      .where('id', params.id)
      .whereNull('deleted_at')
      .first()

    if (!product) {
      return response.status(404).json({ message: 'Product not found' })
    }

    const data = request.only([
      'name',
      'description',
      'price',
      'sku',
      'stock'
    ])

    try {
      product.merge(data)
      await product.save()
      return response.json(product)
    } catch (error) {
      return response.status(400).json({
        message: 'Error during product update.',
        error: error.message
      })
    }
  }

  async destroy ({ params, response }) {
    const product = await Product.query()
      .where('id', params.id)
      .whereNull('deleted_at')
      .first()

    if (!product) {
      return response.status(404).json({ message: 'Product not found' })
    }

    try {
      product.deleted_at = new Date()
      await product.save()
      return response.status(204).send()
    } catch (error) {
      return response.status(400).json({
        message: 'Error during product deletion.',
        error: error.message
      })
    }
  }
}

module.exports = ProductController
