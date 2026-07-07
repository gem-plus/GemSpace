import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Heart, MessageCircle, Share2, UserPlus, UserMinus } from "lucide-react";

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
  const [isFollowing, setIsFollowing] = useState(
    userID && postOwner !== userID ? false : null
  );
  const [isLiked, setIsLiked] = useState(
    userID && likes.includes(userID) ? true : false
  );
  const [likeCount, setLikeCount] = useState(likes.length);
  const [error, setError] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  async function handleFollowing() {
    if (!userID) {
      setError("Please log in to follow");
      setTimeout(() => setError(null), 3000);
      return;
    }

    const data = await onFollowing(postOwner);
    setIsFollowing(data.isfollow);
  }

  async function handleLike() {
    if (!userID) {
      setError("Please log in to like");
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!isLiked) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }

    const data = await onLike(postID);
    setIsLiked(data.isliked);
    setLikeCount(data.likeCount);
  }

  return (
    <article className="group relative bg-card hover:bg-muted/30 transition-colors duration-150 border-b border-border/50">
      <div className="flex gap-3 p-4">
        <a href="#" className="shrink-0">
          <img
            src={avatarURL}
            alt={`@${username}'s avatar`}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-transparent hover:ring-primary/20 transition-all"
          />
        </a>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground hover:underline cursor-pointer">
              @{username}
            </span>
            <span className="text-muted-foreground text-sm">·</span>
            <time className="text-muted-foreground text-sm hover:underline cursor-pointer">
              {dayjs(date).fromNow()}
            </time>

            {page === "home" && userID && postOwner !== userID && (
              <button
                onClick={handleFollowing}
                className={`ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium transition-all ${
                  isFollowing
                    ? "bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserMinus className="w-3.5 h-3.5" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            )}
          </div>

          <p className="mt-2 text-foreground leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </p>

          <div className="flex items-center gap-6 mt-3 max-w-md">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 group/like transition-colors ${
                isLiked
                  ? "text-destructive"
                  : "text-muted-foreground hover:text-destructive"
              }`}
            >
              <span className={`p-2 rounded-full transition-colors ${
                isLiked
                  ? "bg-destructive/10"
                  : "group-hover/like:bg-destructive/10"
              } ${isAnimating ? "animate-heart-pop" : ""}`}>
                <Heart
                  className={`w-5 h-5 transition-transform ${
                    isLiked ? "fill-current" : ""
                  }`}
                />
              </span>
              <span className={`text-sm ${isLiked ? "font-medium" : ""}`}>
                {likeCount}
              </span>
            </button>

            <button
              disabled
              className="flex items-center gap-2 text-muted-foreground opacity-50 cursor-not-allowed"
            >
              <span className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                <MessageCircle className="w-5 h-5" />
              </span>
              <span className="text-sm">0</span>
            </button>

            <button
              disabled
              className="flex items-center gap-2 text-muted-foreground opacity-50 cursor-not-allowed"
            >
              <span className="p-2 rounded-full hover:bg-primary/10 transition-colors">
                <Share2 className="w-5 h-5" />
              </span>
            </button>
          </div>

          {error && (
            <p className="text-destructive text-sm mt-2 animate-fade-in">
              {error}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export default HomePost;
