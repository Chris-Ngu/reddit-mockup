import { __prod__ } from './constants';
import { Post } from './entities/Post';
import { MikroORM } from '@mikro-orm/core';
import path from 'path';

if (!__prod__) {
    require('dotenv').config();
}

export default {
    migrations: {
        path: path.join(__dirname, './migrations'), 
        pattern: /^[\w-]+\d+\.[tj]s$/, 
    },

    debug: !__prod__,
    entities: [Post],
    type: 'postgresql',

    user: process.env.USER,
    password: process.env.PASSWORD,
    dbName: process.env.NAME,
} as Parameters<typeof MikroORM.init>[0];