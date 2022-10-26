import * as argon2 from "argon2";
import { Arg, Mutation, Resolver } from "type-graphql";
import { User } from "../entity/user";
import dataSource from "../utils";
@Resolver(User)
export class UserResolver {
  @Mutation(() => User)
  async createUser(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    const newUser = new User();
    newUser.email = email;
    newUser.hashedPassword = await argon2.hash(password);
    const userFromDB = await dataSource.manager.save(User, newUser);
    console.log(userFromDB);
    return userFromDB;
  }
}
