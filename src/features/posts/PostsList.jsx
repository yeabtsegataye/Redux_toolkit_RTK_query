import PostExecrept from "./PostsExcerp";
import { useGetPostsQuery } from './postsSlice';

function PostsList() {
     ///////////////
    const {
        data: posts,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsQuery('getPosts')
    console.log(posts)
    /////////////////
     let content;
     if (isLoading) {
        content = <p>"Loading..."</p>;
    } else if (isSuccess) {
        content = posts.ids.map(postId => <PostExecrept key={postId} postId={postId} />)
    } else if (isError) {
        content = <p>{error}</p>;
    }
     /////////////
  return (
    <section>{content}</section>
  )
}

export default PostsList