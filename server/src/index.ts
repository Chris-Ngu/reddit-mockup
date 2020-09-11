import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__, __corsOrigin__, __cookieName__ } from './constants';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import microConfig from './mikro-orm.config';
import { HelloResolver } from './resolver/hello';
import { PostResolver } from './resolver/post';
import { UserResolver } from './resolver/user';

import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';

import cors from 'cors';

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();
    const RedisStore = connectRedis(session);
    const redis = new Redis();

    app.use(
        cors({
            origin: __corsOrigin__,
            credentials: true
        })
    )

    app.use(
        session({
            name: __cookieName__,
            store: new RedisStore({
                client: redis,
                disableTouch: true
            }),
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, //10 years
                httpOnly: true,
                sameSite: 'lax', //csrf
                secure: __prod__
            },
            saveUninitialized: false,
            secret: "keyboard cat",
            resave: false,
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
        }),
        context: ({ req, res }) => ({ em: orm.em, req, res, redis }),
    });

    apolloServer.applyMiddleware({
        app,
        cors: false
    });
    app.listen(4000, () => {
        console.log('Backend server started on localhost:4000');
    });

    // creating post
    // const post = orm.em.create(Post, { title: 'my first post' });
    // await orm.em.persistAndFlush(post);

    // Showing all posts
    // const records = await orm.em.find(Post, {});
    // console.log(records);
}

main().catch((err) => {
    console.log(err);
})