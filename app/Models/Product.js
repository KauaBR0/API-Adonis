'use strict'

const Model = use('Model')

class Product extends Model {
  static get dates () {
    return super.dates.concat(['deleted_at'])
  }

  sales () {
    return this.hasMany('App/Models/Sale')
  }

  //Soft delete
  static scopeActive (query) {
    return query.whereNull('deleted_at')
  }
}

module.exports = Product
