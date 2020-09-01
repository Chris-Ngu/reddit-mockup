/*
    I did not allow UpdateUser Query as I do not know if I should allow users 
    to update at this time/ other conflicts that could arise 
*/

import { Resolver, Query, Ctx, Arg, Mutation, InputType, Field, ObjectType } from 'type-graphql';
import { User } from '../entities/User';
import { MyContext } from '../types';
import argon2 from 'argon2';

@InputType()
class UsernamePasswordInput {
    @Field(() => String)
    username: string

    @Field(() => String)
    password: string
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[]

    @Field(() => User, { nullable: true })
    user?: User
}

@ObjectType()
class FieldError {
    @Field()
    field: string

    @Field()
    message: string
}

@Resolver()
export class UserResolver {
    @Query(() => User, { nullable: true })
    async me(
        @Ctx() { em, req }: MyContext
    ): Promise<User | null> {
        if (!req.session.userId) {
            return null
        }
        const user = await em.findOne(User, { id: req.session.userId })
        return user;
    }


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

    @Mutation(() => UserResponse)
    async createUser(
        @Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        if (options.username.length <= 2) {
            return {
                errors: [{
                    field: 'username',
                    message: 'length must be greater than 2'
                }]
            }
        }
        if (options.password.length <= 3) {
            return {
                errors: [{
                    field: 'password',
                    message: 'length must be greater than 3'
                }]
            }
        }
        const hashed = await argon2.hash(options.password);
        const user = em.create(User, { username: options.username, password: hashed });

        try {
            await em.persistAndFlush(user);
        } catch (err) {
            if (err.code === "23505" || err.detail.includes("already exists")) {
                return {
                    errors: [{
                        field: 'username',
                        message: 'username already taken'
                    }]
                };
            }

        }

        // After registration, user is already logged in
        req.session.userId = user.id;
        return { user }

    };

    @Mutation(() => UserResponse)
    async login(
        @Arg('options', () => UsernamePasswordInput) options: UsernamePasswordInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User, { username: options.username })
        if (!user) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'username doesn\'t exist'
                    },
                ]
            };
        }
        const valid = await argon2.verify(user.password, options.password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'incorrect password',
                    }
                ]
            }
        }

        req.session.userId = user.id;
        return { user };
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