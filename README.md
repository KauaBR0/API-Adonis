# Sistema de Gerenciamento de Vendas

API RESTful para gerenciamento de vendas, clientes e produtos, desenvolvida com AdonisJS e MySQL.

## Requisitos

- Node.js >= 14.x
- MySQL >= 8.0
- NPM ou Yarn

## Configuração

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env` com suas credenciais do banco de dados:
```env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=sales_management
```

4. Execute as migrações do banco de dados:
```bash
node ace migration:run
```

5. Rodar o projeto:
```bash
npm run start
```

## Rotas da API

### Autenticação

- `POST /signup` - Cadastro de usuário
  - Body: `{ "email": "string", "password": "string" }`

- `POST /login` - Login de usuário
  - Body: `{ "email": "string", "password": "string" }`
  - Retorna: Token JWT

### Clientes (requer autenticação)

- `GET /clients` - Lista todos os clientes
- `GET /clients/:id` - Detalhes do cliente e suas vendas
  - Query params opcionais: `month` e `year` para filtrar vendas
- `POST /clients` - Cadastra novo cliente
  - Body: 
    ```json
    {
      "name": "string",
      "cpf": "string",
      "addresses": [{
        "street": "string",
        "number": "string",
        "complement": "string",
        "neighborhood": "string",
        "city": "string",
        "state": "string",
        "zip_code": "string"
      }],
      "phones": [{
        "number": "string"
      }]
    }
    ```
- `PUT /clients/:id` - Atualiza cliente
- `DELETE /clients/:id` - Remove cliente e seus dados relacionados

### Produtos (requer autenticação)

- `GET /products` - Lista todos os produtos ativos
- `GET /products/:id` - Detalhes do produto
- `POST /products` - Cadastra novo produto
  - Body:
    ```json
    {
      "name": "string",
      "description": "string",
      "price": number,
      "sku": "string",
      "stock": number
    }
    ```
- `PUT /products/:id` - Atualiza produto
- `DELETE /products/:id` - Soft delete do produto

### Vendas (requer autenticação)

- `POST /sales` - Registra nova venda
  - Body:
    ```json
    {
      "client_id": number,
      "product_id": number,
      "quantity": number
    }
    ```

## Recursos e Funcionalidades

- Autenticação JWT
- CRUD completo de clientes com endereços e telefones
- CRUD completo de produtos com soft delete
- Registro de vendas com validação de estoque
- Transações para garantir integridade dos dados
- Filtro de vendas por mês/ano
- Ordenação de listagens conforme especificado

## Validações

- Autenticação obrigatória para rotas protegidas
- CPF único por cliente
- SKU único por produto
- Verificação de estoque disponível
- Validação de dados obrigatórios
- Integridade referencial nas relações
