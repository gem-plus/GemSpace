import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      <Card size="sm" className="w-80 h-48 flex flex-col">
        <CardHeader>
          <CardTitle>@{username}</CardTitle>
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
            <Button variant="outline" onClick={handleEdit} size="sm">
              Edit
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}

export default Post;
