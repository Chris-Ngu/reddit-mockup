/*
    I did not allow UpdateUser Query as I do not know if I should allow users 
    to update at this time/ other conflicts that could arise 
*/

import { Resolver, Query, Ctx, Arg, Mutation } from 'type-graphql';
import { User } from '../entities/User';
import { MyContext } from '../types';

@Resolver()
export class UserResolver {
    @Query(() => [User])
    users(
        @Ctx() { em }: MyContext
    ): Promise<User[]> {
        return em.find(User, {});
    }

    @Query(() => User, { nullable: true })
    user(
        @Arg("username", () => String) username: string,
        @Ctx() { em }: MyContext
    ): Promise<User | null> {
        return em.findOne(User, { username });
    }

    @Mutation(() => User)
    async createUser(
        @Arg('Username', () => String) username: string,
        @Arg('Password', () => String) password: string,
        @Ctx() { em }: MyContext
    ): Promise<User | null> {
        const user = em.create(User, { username, password });
        await em.persistAndFlush(user);
        return user;
    }

    @Mutation(() => Boolean)
    async deleteuser(
        @Arg('Username', () => String) username: string,
        @Ctx() { em }: MyContext
    ): Promise<boolean> {
        try {
            await em.nativeDelete(User, { username })
        } catch {
            return false
        }
        return true;
    }
}