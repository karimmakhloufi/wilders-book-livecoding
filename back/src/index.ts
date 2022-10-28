import "reflect-metadata";
import * as dotenv from "dotenv";
import jwt from "jsonwebtoken";
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
    authChecker: ({ context }, roles) => {
      console.log("context", context);
      console.log("roles in decorator", roles);
      if (context.email === undefined) {
        return false;
      } else if (roles.length === 0 || roles.includes(context.role)) {
        return true;
      } else {
        return false;
      }
    },
  });
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      if (
        req.headers.authorization === undefined ||
        process.env.JWT_SECRET_KEY === undefined
      ) {
        return {};
      } else {
        try {
          const user = jwt.verify(
            req.headers.authorization,
            process.env.JWT_SECRET_KEY
          );
          return user;
        } catch (err) {
          console.log(err);
          return {};
        }
      }
    },
  });

  try {
    const { url }: { url: string } = await server.listen({ port });
    console.log(`🚀  Server ready at ${url}`);
  } catch (err) {
    console.log("Error starting the server");
  }
};

void start();
