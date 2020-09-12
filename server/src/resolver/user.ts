import { Resolver, Query, Ctx, Arg, Mutation, Field, ObjectType } from 'type-graphql';
import { User } from '../entities/User';
import { MyContext } from '../types';
import { FORGET_PASSWORD_PREFIX, __cookieName__ } from '../constants';
import { EntityManager } from '@mikro-orm/postgresql';
import { v4 } from 'uuid';

import argon2 from 'argon2';
import { UsernamePasswordInput } from '../utils/types/UsernamePasswordInput';
import { validateRegister } from '../utils/validateRegister';
import { sendEmail } from '../utils/sendEmail';

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

    @Mutation(() => UserResponse)
    async ChangePassword(
        @Arg('token', () => String) token: string,
        @Arg('newPassword', () => String) newPassword: string,
        @Ctx() { redis, em, req }: MyContext
    ): Promise<UserResponse> {
        if (newPassword.length <= 2) {
            return {
                errors: [
                    {
                        field: 'newPassword',
                        message: 'length must be greater than 2'
                    }
                ]
            };
        }

        const userID = await redis.get(FORGET_PASSWORD_PREFIX + token);
        if (!userID) {
            return {
                errors: [
                    {
                        field: "token",
                        message: "token expired"
                    },
                ]
            };
        }

        const user = em.findOne(User, { id: parseInt(userID) }) as any
        if (!user) {
            return {
                errors: [
                    {
                        field: 'token',
                        message: 'user no longer exists'
                    }
                ]
            };
        }

        user.password = await argon2.hash(newPassword);
        await em.persistAndFlush(user);

        req.session.userId = user.id

        return { user };
    }

    @Mutation(() => Boolean)
    async forgotPassword(
        @Arg("email") email: string,
        @Ctx() { em, redis }: MyContext
    ): Promise<Boolean> {
        const user = await em.findOne(User, { email });

        if (!user) {
            // never let the outsider know about what exists in the database
            return true;
        }

        const token = v4();
        await redis.set(FORGET_PASSWORD_PREFIX + token, user.id, 'ex', 1000 * 60 * 60 * 24 * 3); //3days

        await sendEmail(email,
            `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
        );

        return true;
    }
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
        const errors = validateRegister(options);
        if (errors) {
            return {
                errors
            }
        }

        const hashed = await argon2.hash(options.password);
        let user;
        try {
            const result = await (em as EntityManager).createQueryBuilder(User)
                .getKnexQuery()
                .insert(
                    {
                        username: options.username,
                        password: hashed,
                        email: options.email,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                )
                .returning("*");
            user = result[0];

        } catch (err: unknown) {
            if (err.code === "23505" || err.detail?.include("already exists")) {
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
        @Arg('usernameOrEmail', () => String) usernameOrEmail: string,
        @Arg('password', () => String) password: string,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        const user = await em.findOne(User,
            usernameOrEmail.includes('@')
                ? { email: usernameOrEmail }
                : { username: usernameOrEmail });

        if (!user) {
            return {
                errors: [
                    {
                        field: 'usernameOrEmail',
                        message: 'username doesn\'t exist'
                    },
                ]
            };
        }
        const valid = await argon2.verify(user.password, password);
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
        } catch (e: unknown) {
            return false
        }
        return true;
    }

    @Mutation(() => Boolean)
    async logout(@Ctx() { req, res }: MyContext) {
        return new Promise((resolve) => req.session.destroy((err) => {
            res.clearCookie(__cookieName__)
            if (err) {
                console.log(err);
                resolve(false);
                return;
            }
            resolve(true);
        }));
    }
}