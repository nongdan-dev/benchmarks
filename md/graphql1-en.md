# GraphQL Backend Introduction

**For frontend developers experienced in React + TypeScript, but new to backend and GraphQL**

## 1. RESTful API – A Common Foundation in Web Development

In modern web development, REST (Representational State Transfer) is one of the most widely adopted API architectures. REST emphasizes **statelessness**, is **URI-based**, and operates using standard HTTP methods such as:

* `GET`, `POST`, `PUT`, `PATCH`, `DELETE` — corresponding to the basic CRUD operations.

REST emerged around the year 2000, during the transition from static Web 1.0 to dynamic Web 2.0. At the time, it served to **standardize API design**, offering a simpler alternative to complex solutions like SOAP and XML-RPC.

Today, terms like “Web 3.0” are often seen in the blockchain and crypto space. However, it's important to note that many “web3” libraries simply adopt the name for trend alignment and do not reflect the core technical evolution toward semantic web or decentralization.

### REST API Example with Node.js (Express + TypeScript)

```ts
app.get('/users/:id', async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: Number(req.params.id) }});
  res.json(user);
});
```

### Common Limitations of REST:

* **Advanced filtering**: Implementing complex filtering often requires custom query string logic, which can be hard to maintain.
* **Data joins**: REST lacks built-in support for relational queries. To include related entities like `User → Posts`, you must use eager loading with ORM or aggregate data on the frontend manually.
* **Frontend typing**: Auto-generating types for the frontend is limited without using tools like OpenAPI or Swagger.

---

## 2. GraphQL – A More Flexible Query System

GraphQL (Graph Query Language) was developed internally at Facebook in 2012 and open-sourced in 2015. It was designed to address REST’s limitations, especially in mobile contexts, such as over-fetching, under-fetching, and lack of version flexibility.

### Why is it called “Graph”?

The name is derived from:

* Facebook's **social graph** data model.
* The schema’s **graph-like structure**:

  * Nodes: Each type (User, Post, Comment, etc.) represents a node.
  * Edges: The relationships between types represent edges (e.g., User has many Posts).

However, this doesn’t imply that GraphQL is a **graph database** — it merely uses a logical graph structure for querying, unlike actual graph databases like Neo4j.

### Key Advantages Over REST:

* **Over-fetching**: REST may return unused data. GraphQL allows clients to request only the fields they need.
* **Under-fetching**: REST may require multiple endpoints to build one UI screen. GraphQL supports nested queries in a single call.
* **Versioning**: GraphQL evolves schema without requiring `/v1`, `/v2` style versioning.
* **Joins**: GraphQL supports querying across relationships natively within a single request.

### But in practice?

* Despite its design, **over-fetching still occurs** — especially when using auto-generated queries from tools like Apollo or Relay, which often fetch all fields by default.
* The **real strength of GraphQL lies in the backend's flexibility** through **strong typing** and **resolver logic**, not just in cleaner queries.

### Schema & Resolver Examples

#### Traditional ObjectType Definition

```ts
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
  })
});
```

#### Modern Code-First Approach (TypeScript)

```ts
@ObjectType()
class User {
  @Field() id: number;
  @Field() username: string;
}
```

#### Resolver Example

```ts
@Resolver(User)
export class UserResolver {
  @Query(() => [User])
  async users(@Ctx() ctx: MyContext) {
    return ctx.db.user.findMany();
  }
}
```

Resolvers are powerful:

* They support **batching** to avoid the N+1 problem.
* They enable **per-field authorization** based on context or roles.
* They provide flexibility for **caching**, access control, and complex logic.

### Auto-generating Typings for Frontend

Using tools like GraphQL Code Generator, you can generate TypeScript types from your GraphQL schema, ensuring **type safety across the stack**.

### GraphQL Challenges

| Issue                      | Description                                                 |
| -------------------------- | ----------------------------------------------------------- |
| Unlimited depth            | Susceptible to DDoS via deeply nested queries               |
| No persisted queries       | Caching on the backend becomes harder                       |
| Devs fetch too many fields | Over-fetching still happens                                 |
| Inefficient resolvers      | Leads to N+1 query issues                                   |
| Lacks HTTP-level caching   | Unlike RESTful `GET` with cache headers                     |
| Complex authorization      | Especially with nested fields and role-based access control |

---

## 3. Auto-generated CRUD GraphQL using Sequelize (Node.js)

Inspired by Hasura, we implemented an internal system using Node.js + Sequelize + GraphQL to:

* Auto-generate CRUD schema.
* Support full filtering, sorting, and pagination.

This is a common trend:

* **Node.js**: PostGraphile
* **PHP**: Laravel Lighthouse
* **Go**: Gqlgen
* **Rust**: Seaography
* **Native DB**: Dgraph

---

## 4. Rust Implementation – For Better Performance

We ported key features from the Node.js system to Rust, aiming for higher performance and lower latency.

* Tech stack: `async-graphql`, `sqlx`, `axum`, `anyhow`, etc.
* Uses multi-threaded async runtime for concurrent request handling.
* We’ll demonstrate performance benchmarks and sample Rust code in the live session.

---

## 5. Conclusion

Empowering frontend developers to contribute to backend systems is strategically beneficial. They bring a unique perspective that prioritizes **developer experience** and **API usability**.

The plan:

* Begin by understanding the current internal Node.js framework.
* Gradually evolve to a Rust-based implementation for performance-critical components.
* Maintain a **pragmatic approach** — even using Node.js to generate Rust code when necessary.

This transition is not just about rewriting, but about rethinking how frontend and backend can better align — both in code and in practice.
