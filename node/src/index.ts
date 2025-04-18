// src/index.ts
import { ApolloServer } from 'apollo-server';
import { sequelize } from './db';
import { userResolvers } from './resolvers/user.resolver';
import { userTypeDefs } from './schema/user.schema';

const server = new ApolloServer({
  typeDefs: userTypeDefs,
  resolvers: userResolvers,
});

sequelize
  .authenticate()
  .then(async () => {
    sequelize.sync({ alter: true })
      .then(() => {
        console.log('All models were synchronized successfully.');
        return server.listen(3000);
      })
      .then(({ url }) => {
        console.log(`Server is running at ${url}`);
      });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
