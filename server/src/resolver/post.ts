import { isAuth } from '../middleware/isAuth';
import { MyContext } from 'src/types';
import { Resolver, Query, Arg, Int, Mutation, InputType, Field, Ctx, UseMiddleware } from 'type-graphql';
import { Post } from '../entities/Post';
import { getConnection } from 'typeorm';

@InputType()
class PostInput {
    @Field()
    title: string
    @Field()
    text: String
}

@Resolver()
export class PostResolver {
    @Query(() => [Post])
    posts(
        @Arg('limit') limit: number
        @Arg('cursor', () => String, { nullable: true }) cursor: string | null
    ): Promise<Post[]> {
        const realLimit = Math.min(50, limit);
        const qb = getConnection()
            .getRepository(Post)
            .createQueryBuilder('p')
            .orderBy('"createdAt"', 'DESC')
            .take(realLimit);
        if (cursor) {
            qb.where('"createdAt" > :cursor', { cursor: new Date(parseInt(cursor)) })
        }
        return qb.getMany();
    }

    @Query(() => Post, { nullable: true })
    post(
        @Arg("id", () => Int) id: number,
    ): Promise<Post | undefined> {
        return Post.findOne(id);
    }

    @Mutation(() => Post)
    @UseMiddleware(isAuth)
    async createPost(
        @Arg("input") input: PostInput,
        @Ctx() { req }: MyContext
    ): Promise<Post> {

        //Not sure why this is throwing an error even though it compiles and works
        return Post.create({
            ...input,
            creatorId: req.session.userId
        }).save();
    };

    @Mutation(() => Post, { nullable: true })
    async updatePost(
        @Arg('id') id: number,
        @Arg('title', () => String, { nullable: true }) title: string,
    ): Promise<Post | undefined> {
        const post = await Post.findOne(id);
        if (!post) {
            return undefined;
        }
        if (typeof title !== 'undefined') {
            await Post.update({ id }, { title });
        }
        return post;
    }

    @Mutation(() => Boolean)
    async deletePost(
        @Arg('id') id: number
    ): Promise<boolean> {
        try {
            await Post.delete(id);
        } catch (e: unknown) {
            return false
        }
        return true;
    }
}