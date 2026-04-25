function Post({likes = 0, username , content}) {
  // let likes = props.Post.likes.length;
  // const content = props.content;

  return (
    <>
    <div className="post-post"> 
      <h4 className="post-username">@{username}</h4>
      <p className="post-content">{content}</p>
      <small className="post-likecount">{likes} likes</small>

      <div className="post-button">
        <button className="post-likebtn" type="submit ">Like</button>
        <button className="post-editbtn" type="submit ">Edit</button>
      </div>
    </div>
    </>
  );
}

export default Post;
