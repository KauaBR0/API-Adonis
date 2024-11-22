'use strict'

const Schema = use('Schema')

class ProductsSchema extends Schema {
  up () {
    this.create('products', (table) => {
      table.increments()
      table.string('name', 255).notNullable()
      table.text('description')
      table.decimal('price', 10, 2).notNullable()
      table.string('sku', 50).unique()
      table.integer('stock').defaultTo(0)
      table.boolean('is_active').defaultTo(true)
      table.timestamp('deleted_at').nullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('products')
  }
}

module.exports = ProductsSchema
