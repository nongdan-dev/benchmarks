// src/index.ts
import express, { Request, Response } from 'ultimate-express';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { sequelize } from './db';
import { userResolvers } from './resolvers/user.resolver';
import { userTypeDefs } from './schema/user.schema';
import { User } from './models/User';

const PORT = 4000
const startServer = async () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));


  const server = new ApolloServer({
    typeDefs: userTypeDefs,
    resolvers: userResolvers,
  });

  await sequelize.authenticate();
  await sequelize.sync({ alter: true });
  const { url } = await startStandaloneServer(server, {
    listen: {
      port: PORT
    }
  });
  console.log(`🚀 Server Graphql is running at ${url}`);

  app.get('/user', async (req: Request,res: Response) =>{
    const users = await User.findAll().then( arr => arr.map(e => e.toJSON()))
    return res.status(200).json({
      status: true,
      users
    })
  });

  app.post('/create', async (req, res) =>{
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      throw new Error('Missing params')
    }

    const user = await User.create({...req.body}).then( v => v.toJSON())
    return res.status(200).json({
      status: true,
      user
    })
  })


  app.listen(4001, () => {
    console.log(`Server Restful is running on port: 4001`);
});
};

startServer().catch((error) => {
  console.error('Error starting server:', error);
});
