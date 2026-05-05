import { useEffect, useState } from "react";
import NavBar from "../components/navbar";
import { useLocation, useNavigate } from "react-router-dom";

function Edit() {
  const [content, setContent] = useState("");
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchContent() {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${state.postID}`, {
        method: "get",
        credentials: "include",
      });

      const data = await res.json();
      setContent(data.post.content);
    }
    fetchContent();
  }, [state.postID]);

  function handleChange(e) {
    setContent(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}${state.postID}`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content }),
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        navigate("/profile");
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <NavBar />
      <h5 className="post-text">Edit your post</h5>
      <form className="post-form" onSubmit={(e) => handleSubmit(e)}>
        <textarea
          className="post-textarea"
          name="content"
          value={content}
          onChange={handleChange}
        >
        </textarea>
        <input className="post-submit" type="submit" value="Update post" />
      </form>
    </>
  );
}

export default Edit;
