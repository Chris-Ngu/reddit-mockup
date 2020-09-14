import { __prod__ } from './constants';
import { Post } from './entities/Post';
import { User } from './entities/User';

if (!__prod__) {
    require('dotenv').config();
}

export default ({
    type: 'postgres',
    database: 'awad',
    username: process.env.USER,
    password: process.env.PASSWORD,
    logging: true,
    synchronize: true,
    entities: [Post, User]
})