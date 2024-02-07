import { Link } from "react-router-dom";
import { useGetUsersQuery } from "../users/usersSlice";

const PostAuthor = ({ userId }) => {

    const { user :author } = useGetUsersQuery('getUsers', {
        selectFromResult: ({ data, isLoading }) => ({
            user: data?.entities[userId]
        })
        //here likely represents a normalized data structure used to efficiently manage and access entities (such as posts) by their IDs.
    })
    console.log(author)
      return  <span>by {author
            ? <Link to={`/user/${userId}`}>{author.name}</Link>
            : 'Unknown author'}</span>
    
}

export default PostAuthor