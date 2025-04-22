import { User } from "../models/User";

export const userResolvers = {
  Query: {
    users: async () => {
      return await User.findAll();
    },
  },
  Mutation: {
    registerUser: async (
      _: unknown,
      args: { name: string; email: string; password: string }
    ) => {
      return await User.create(args);
    },
  },
};
