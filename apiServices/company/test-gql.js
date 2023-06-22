import { ApolloServer } from 'apollo-server'

// * typeDefs
import typeDefs from './type-defs.js';

// * resolvers
import resolvers from './resolvers.js';

// * Crear servidor
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return req
  },
});

// * Inicializar servidor

server.listen().then(({ url }) => {
  console.log(`Servidor listo en ${url}`);
});

