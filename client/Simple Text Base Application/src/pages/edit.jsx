import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SidebarProvider } from "@/components/ui/sidebar";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppSidebar from "@/components/sidebar";

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
      if (content === "") throw new Error("Post cannot be empty");
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
    <SidebarProvider>
      <AppSidebar />
      <main h-screen w-full>
        <div className="m-10 p-0">
          <Field className="mt-10">
            <FieldLabel className="text-3xl" htmlFor="textarea-message">
              Edit
            </FieldLabel>
            <FieldDescription>Enter your new message below.</FieldDescription>
            <form onSubmit={handleSubmit}>
              <Textarea
                // className="w-1/4"
                name="content"
                value={content}
                onChange={handleChange}
              />
              <Button
                className="mt-2"
                type="submit"
                disabled={content.trim() === ""}
              >
                Save
              </Button>
            </form>
          </Field>
        </div>
      </main>
    </SidebarProvider>
  );
}

export default Edit;
