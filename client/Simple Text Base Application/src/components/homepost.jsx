function HomePost({ username, content }) {
  return (
    <>
      <div className="home-home">
        <span className="home-username">@{username}</span>
        <p className="home-content">{content}</p>
      </div>
    </>
  );
}

export default HomePost;
