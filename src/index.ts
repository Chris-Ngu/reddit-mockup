import 'reflect-metadata';
import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import microConfig from './mikro-orm.config';
import { HelloResolver } from './resolver/hello';
import { PostResolver } from './resolver/post';

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();
    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false
        }),
        context: () => ({ em: orm.em }),
    });

    apolloServer.applyMiddleware({ app });
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