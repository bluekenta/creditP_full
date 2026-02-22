import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { typeDefs } from './lib/graphql/schema.js';
import { resolvers } from './lib/graphql/resolvers.js';

// Load .env.local so MONGO_URI etc. are set when running without Docker
const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = join(__dirname, '.env.local');
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = (line || '').trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eq = trimmed.indexOf('=');
      if (eq > 0) {
        const key = trimmed.slice(0, eq).trim();
        const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
startStandaloneServer(server, { listen: { port: 4000 } })
  .then(({ url }) => console.log(`GraphQL server ready at ${url}`));
