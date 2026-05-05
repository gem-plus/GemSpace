import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Post({ username, content, postID, onLike, likes, userID }) {
  const navigate = useNavigate();
  const [likebtn, setlikebtn] = useState(
    likes.includes(userID) ? "unlike" : "like",
  );
  const [likeCount, setLikeCount] = useState(likes.length);

  async function handleLike() {
    const data = await onLike(postID);
    setlikebtn(data.isliked ? "unlike" : "like");
    setLikeCount(data.likeCount);
  }

  function handleEdit() {
    navigate("/edit", { state: { postID } });
  }

  return (
    <>
      <div className="post-post">
        <h4 className="post-username">@{username}</h4>
        <p className="post-content">{content}</p>

        <div className="post-footer">
          <small className="post-likecount">{likeCount} likes</small>

          <div className="post-button">
            <button
              className="post-likebtn"
              onClick={(e) => handleLike(e)}
              type="button"
            >
              {likebtn}
            </button>
            <button
              className="post-editbtn"
              onClick={(e) => handleEdit(e)}
              type="button"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Post;
