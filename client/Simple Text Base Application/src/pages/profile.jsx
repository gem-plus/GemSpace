import Post from "../components/post";
function Profile(props) {
  const greet = props.name ? `Hello, ${props.name}` : "Hello, User";

  return (
    <>
      <h3 className="post-header">{greet}</h3>
      <h5 className="post-text">Create new posts</h5>
      <div className="post-form">
        <textarea
          className="post-textarea"
          placeholder="What's on your mind ?"
        ></textarea>
        <input className="post-submit" type="submit" value="Create new post" />
      </div>
      <div className="posts">
        <h3>Your post's</h3>
        {/* { props.user.posts.reverse().forEach(function(){
          <Post username="darkNYX" content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus odio nostrum corrupti laborum error perferendis nam, dicta rem eum aliquid culpa quia maxime vitae qui a. Esse facilis ab rerum!"/>
        })} */}
        <Post
          username="darkNYX"
          content="Lorem ipsum dolor sit amet consectetur adipisicing elit. Minus odio nostrum corrupti laborum error perferendis nam, dicta rem eum aliquid culpa quia maxime vitae qui a. Esse facilis ab rerum!"
        />
      </div>
    </>
  );
}

export default Profile;
