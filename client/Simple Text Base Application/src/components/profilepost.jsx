import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

dayjs.extend(relativeTime);

function Post({ username, content , postID , likes, userID , date , onLike , onDelete }) {
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

  async function handleDelete() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/delete/${postID}`,
        {
          method: "post",
          credentials: "include",
        },
      );
      const data = await res.json();
      if (!data.success) throw new Error("Deletion failed");

      await onDelete(postID);

    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <Card size="sm" className="w-80 h-48 flex flex-col">
        <CardHeader >
          <CardTitle>@{username}</CardTitle>
          <small>{dayjs(date).fromNow()}</small>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="max-h-24 overflow-y-auto wrap-break-word">{content}</p>
        </CardContent>
        <CardFooter className="mt-auto flex items-center justify-start py-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <small className="">{likeCount} likes</small>
              <Button
                variant="outline"
                onClick={(e) => handleLike(e)}
                size="sm"
              >
                {likebtn}
              </Button>
            </div>
            <div>
            <Button variant="outline" onClick={handleEdit} size="sm" className="m-1">
              Edit
            </Button>
            <Button variant="outline" onClick={handleDelete} size="sm" className="m-1 text-red-600">
              Delete
            </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}

export default Post;
