import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

dayjs.extend(relativeTime);

function HomePost({
  username,
  avatarURL,
  content,
  userID,
  postID,
  postOwner,
  likes,
  date,
  page,
  onLike,
  onFollowing,
}) {
  const [followbtn, setFollowBtn] = useState(
    userID && postOwner !== userID ? "follow" : "",
  );

  const [likebtn, setlikebtn] = useState(
    userID && likes.includes(userID) ? "unlike" : "like",
  );
  const [error, setError] = useState(null);
  const [likeCount, setLikeCount] = useState(likes.length);

  async function handleFollowing() {
    if (!userID) {
      setError("Please login !");
      return;
    }

    const data = await onFollowing(postOwner);
    setFollowBtn(data.isfollow ? "unfollow" : "follow");
  }

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
          <CardHeader className="flex items-center gap-4">
            <img
              src={avatarURL}
              alt="Avatar Pic"
              className="rounded-full object-coverrounded"
            />
            <div>
              <CardTitle>@{username}</CardTitle>
              <small>{dayjs(date).fromNow()}</small>
            </div>
           {page === "home" && 
           <div>
              <button className=" text-red-500" onClick={handleFollowing}>
                {followbtn}
              </button>
            </div>}
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
