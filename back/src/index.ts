import "reflect-metadata";
import * as dotenv from "dotenv";
import { ApolloServer } from "apollo-server";
import { buildSchema } from "type-graphql";
import { WilderResolver } from "./resolver/wilderResolver";
import { UserResolver } from "./resolver/userResolver";
import dataSource from "./utils";

dotenv.config();

const port = 5000;

const start = async (): Promise<void> => {
  await dataSource.initialize();
  const schema = await buildSchema({
    resolvers: [WilderResolver, UserResolver],
  });
  const server = new ApolloServer({ schema });

  try {
    const { url }: { url: string } = await server.listen({ port });
    console.log(`🚀  Server ready at ${url}`);
  } catch (err) {
    console.log("Error starting the server");
  }
};

void start();
