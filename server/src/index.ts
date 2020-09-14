import 'reflect-metadata';
import { createConnection } from 'typeorm';
import TypeOrmConfig from './typeorm.config';
import { __prod__, __corsOrigin__, __cookieName__ } from './constants';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import { HelloResolver } from './resolver/hello';
import { PostResolver } from './resolver/post';
import { UserResolver } from './resolver/user';

import Redis from 'ioredis';
import session from 'express-session';
import connectRedis from 'connect-redis';

import cors from 'cors';

import { Post } from './entities/Post';
import { User } from './entities/User';

const main = async () => {
    const conn = await createConnection({
        type: 'postgres',
        database: 'awad',
        username: 'postgres',
        password: 'postgres',
        logging: true,
        synchronize: true,
        entities: [Post, User]
    });

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
        context: ({ req, res }) => ({ req, res, redis }),
    });

    apolloServer.applyMiddleware({
        app,
        cors: false
    });
    app.listen(4000, () => {
        console.log('Backend server started on localhost:4000');
    });
}

main().catch((err) => {
    console.log(err);
})