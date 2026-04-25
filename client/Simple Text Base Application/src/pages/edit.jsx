function Edit() {
  return (
    <>
      <h5 className="post-text">Edit your post</h5>
      <div className="post-form">
        <textarea
          className="post-textarea"
        ></textarea>
        <input className="post-submit" type="submit" value="Update post" />
      </div>
    </>
  );
}

export default Edit;
