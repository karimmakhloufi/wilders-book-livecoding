import "reflect-metadata";
import { ApolloServer, gql } from "apollo-server";
import dataSource from "./utils";

import { Wilder } from "./entity/wilder";
import { Skill } from "./entity/skill";

const typeDefs = gql`
  type Wilder {
    name: String
    grades: [Grade]
  }
  type Skill {
    name: String
  }
  type Grade {
    grade: Int
    skill: Skill
  }
  type Query {
    getAllWilders: [Wilder]
  }
  type Mutation {
    createSkill(name: String): Skill
  }
`;

const resolvers = {
  Query: {
    getAllWilders: async () => {
      const allWilders = await dataSource.manager.find(Wilder, {
        relations: {
          grades: {
            skill: true,
          },
        },
      });
      console.log(JSON.stringify(allWilders, null, 2));
      return allWilders;
    },
  },
  Mutation: {
    createSkill: async (_: any, args: any) => {
      console.log(args);
      const skillToCreate = new Skill();
      skillToCreate.name = args.name;
      return await dataSource.manager.save(Skill, skillToCreate);
    },
  },
};

const port = 5000;

const start = async (): Promise<void> => {
  await dataSource.initialize();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  try {
    const { url }: { url: string } = await server.listen({ port });
    console.log(`🚀  Server ready at ${url}`);
  } catch (err) {
    console.log("Error starting the server");
  }
};

void start();
