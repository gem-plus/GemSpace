import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function HomePost({ username, content, onLike, userID, postID, likes }) {
  const [likebtn, setlikebtn] = useState(
    userID && likes.includes(userID) ? "unlike" : "like",
  );
  const [error, setError] = useState(null);
  const [likeCount, setLikeCount] = useState(likes.length);

  async function handleLike() {
    if (!userID) {
      setError("Please login !");
      return;
    }

    const data = await onLike(postID);

    setlikebtn(data.isliked ? "unlike" : "like");
    setLikeCount(data.likeCount);
  }
  return (
    <>
      <div className="ml-10 mt-5">
        <Card size="sm" className="w-250 h-48 ">
          <CardHeader>
            <CardTitle>@{username}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="max-h-64 overflow-y-auto wrap-break-word">
              {content}
            </p>
          </CardContent>
          <CardFooter className="mt-auto">
            <div className="flex items-center gap-2">
              <small className="">{likeCount} likes</small>
              <Button
                variant="outline"
                onClick={(e) => handleLike(e)}
                size="sm"
                >
                {likebtn}
              </Button>
                {error && <p className="text-red-500 text-sm ">{error}</p>}
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default HomePost;
