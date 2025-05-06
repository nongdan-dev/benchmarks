import { createPostLoader, createUserLoader } from "./loaders"

export type GraphQLContext = {
  loaders: {
    userLoader: ReturnType<typeof createUserLoader>
    postLoader: ReturnType<typeof createPostLoader>
  }
}

export const context = (): GraphQLContext => ({
  loaders: {
    userLoader: createUserLoader(),
    postLoader: createPostLoader(),
  },
})
