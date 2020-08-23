import { MikroORM } from '@mikro-orm/core';
import { __prod__ } from './constants';
import { Post } from './entities/Post';

if (!__prod__) {
    require('dotenv').config();
}

const main = async () => {

    const orm = await MikroORM.init({
        user: process.env.USER,
        password: process.env.PASSWORD,
        debug: !__prod__,
        dbName: process.env.NAME,
    
        entities: [Post],
        type: 'postgresql'
    });

    const post = orm.em.create(Post, { title: 'my first post' });
    //const post = new Post('my first post');

    await orm.em.persistAndFlush(post);
}

main().catch((err) => {
    console.log(err);
})