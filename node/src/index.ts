// src/index.ts
import { ApolloServer } from 'apollo-server';
import { sequelize } from './db';
import { userResolvers } from './resolvers/user.resolver';
import { userTypeDefs } from './schema/user.schema';

// Khởi tạo ApolloServer
const server = new ApolloServer({
  typeDefs: userTypeDefs,
  resolvers: userResolvers,
});

// Kết nối tới DB và start server
sequelize
  .authenticate()
  .then(() => {
    console.log('Database connected successfully!');
    server
      .listen(3000)
      .then(({ url }) => {
        console.log(`Server is running at ${url}`);
      });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
