import { Nav } from "src/components/Nav"
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from "src/utils/createUrqlClient";
import { usePostsQuery } from "src/generated/graphql";

const Index = () => {
  const [{ data }] = usePostsQuery();

  return (
    <>
      <Nav />
      <div>
        hello world
      </div>
      {!data
        ? <div>Loading...</div>
        : data.posts.map((post) =>
          <div key={post.id}>
            {post.title}
          </div>
        )
      }
    </>
  )
}

export default withUrqlClient(createUrqlClient, {ssr: true})(Index);
