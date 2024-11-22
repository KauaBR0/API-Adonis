'use strict'

const Model = use('Model')

class Sale extends Model {
  client () {
    return this.belongsTo('App/Models/Client')
  }

  product () {
    return this.belongsTo('App/Models/Product')
  }

  static scopeByMonth (query, month, year) {
    return query.whereRaw('MONTH(sale_date) = ? AND YEAR(sale_date) = ?', [month, year])
  }
}

module.exports = Sale
