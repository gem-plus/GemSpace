import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";


function Edit() {
  const [content, setContent] = useState("");
  const location = useLocation();
  const state = location.state;
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchContent() {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/edit/${state.postID}`,
        {
          method: "get",
          credentials: "include",
        },
      );

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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/update/${state.postID}`,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: content }),
          credentials: "include",
        },
      );
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
    <div className="m-10">
      <h5 className="text-2xl ">Edit your post</h5>
      <form onSubmit={handleSubmit} className="mt-3">
        <Textarea 
          className="w-1/4 "
          name="content"
          value={content}
          onChange={handleChange}
        />
        <Button className="mt-2" type="submit">
          Edit post
        </Button>
      </form>
    </div>
    </>
  );
}

export default Edit;
