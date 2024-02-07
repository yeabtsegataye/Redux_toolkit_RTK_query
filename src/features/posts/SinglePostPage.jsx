import PostAuthor from "./PostAuthor";
import ReactionButtons from "./ReactionButtons";
import TimeAgo from "./TimeAgo";
import { useGetPostsQuery } from "./postsSlice"
import { Link, useParams } from "react-router-dom"

function SinglePostPage() {
    const { postId } = useParams();
    console.log(postId)
    //////////////////
    const { post, isLoading, error } = useGetPostsQuery('getPosts', {
        selectFromResult: ({ data, isLoading }) => ({
            post: data?.entities[postId], //here likely represents a normalized data structure used to efficiently manage and access entities (such as posts) by their IDs.
            isLoading
        })
    })
    //////////////////
    if (isLoading) {
        return <h1>Loading...</h1>
    }
    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }
    if (error) {
        return <h1>{error.message}</h1>
    }
    //////////////////
    return (
        <article>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <p className="postCredit">
                <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
                <PostAuthor userId={post.userId} />
                <TimeAgo timestamp={post.date} />
            </p>
            <ReactionButtons post={post} />
        </article>
    )
    //////////////////
    
}

export default SinglePostPage