### Installation Steps

1. **Install dependencies**
```bash
   npm install
   cp config/.env.example config/.env
```

2. **Edit config/.env**

3. **Start the app**
```bash
   npm run dev - start the app
   npm run inspect-db - get database tables and columns
```

## Tech Stack
- **Runtime**: Node.js - Express.js
- **Database**: PostgreSQL - Sequelize
- **Documentation**: Swagger/OpenAPI 3.0
- **Security**: Helmet.js
- **Logging**: Morgan
- **Development**: Nodemon

## API
- Docs: http://localhost:3000/api/v1/docs
- Health Check: http://localhost:3000/api/v1/health

### Time Spent
- ~8 hours

### Known issues
1. Not sure if gender: "M" also counts as a male since there are random uppercase characters - I counted them as a male
2. If i had more time i would take a look at error handling
3. If there would be more data I think pagination would have to be implemented
4. Caching / Rate limiting but since its just example I don't think its necessary
5. Unit tests or some kind of testing
6. Typescript