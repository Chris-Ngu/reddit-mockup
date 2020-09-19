import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "src/utils/createUrqlClient";
import { usePostsQuery } from "src/generated/graphql";
import { Layout } from "src/components/Layout";
import { Link } from "@chakra-ui/core";
import NextLink from 'next/link';
const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>
          create Post
      </Link>
      </NextLink>
      {!data
        ? <div>Loading...</div>
        : data.posts.map((post) =>
          <div key={post.id}>
            {post.title}
          </div>
        )
      }
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
