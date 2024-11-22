'use strict'

const Model = use('Model')

class Client extends Model {
  addresses () {
    return this.hasMany('App/Models/Address')
  }

  phones () {
    return this.hasMany('App/Models/Phone')
  }

  sales () {
    return this.hasMany('App/Models/Sale')
  }
}

module.exports = Client
