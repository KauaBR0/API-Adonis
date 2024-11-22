'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

// Rotas públicas de autenticação
Route.post('/signup', 'AuthController.signup')
Route.post('/login', 'AuthController.login')

Route.group(() => {
  // Rotas de clientes
  Route.get('/clients', 'ClientController.index')
  Route.get('/clients/:id', 'ClientController.show')
  Route.post('/clients', 'ClientController.store')
  Route.put('/clients/:id', 'ClientController.update')
  Route.delete('/clients/:id', 'ClientController.destroy')

  // Rotas de produtos
  Route.get('/products', 'ProductController.index')
  Route.get('/products/:id', 'ProductController.show')
  Route.post('/products', 'ProductController.store')
  Route.put('/products/:id', 'ProductController.update')
  Route.delete('/products/:id', 'ProductController.destroy')

  // Rota de vendas
  Route.post('/sales', 'SaleController.store')
}).middleware('auth')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})
