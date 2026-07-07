import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Heart, MoveHorizontal as MoreHorizontal, CreditCard as Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

dayjs.extend(relativeTime);

function Post({ username, content, postID, likes, userID, date, onLike, onDelete }) {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(likes.includes(userID) ? true : false);
  const [likeCount, setLikeCount] = useState(likes.length);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  async function handleLike() {
    if (!isLiked) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }

    const data = await onLike(postID);
    setIsLiked(data.isliked);
    setLikeCount(data.likeCount);
  }

  function handleEdit() {
    navigate("/edit", { state: { postID, userID } });
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

      setIsDeleted(true);
      setTimeout(() => {
        onDelete(postID);
      }, 200);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <article
      className={`group bg-card border border-border/50 rounded-xl overflow-hidden transition-all duration-200 hover:border-border hover:shadow-sm ${
        isDeleted ? "opacity-0 scale-95" : ""
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">@{username}</span>
            <span className="text-muted-foreground text-sm">·</span>
            <time className="text-muted-foreground text-sm">
              {dayjs(date).fromNow()}
            </time>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={handleEdit} className="gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="gap-2 text-destructive focus:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="mt-3 text-foreground leading-relaxed whitespace-pre-wrap break-words">
          {content}
        </p>

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/30">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors ${
              isLiked
                ? "text-destructive"
                : "text-muted-foreground hover:text-destructive"
            }`}
          >
            <span
              className={`p-1.5 rounded-full transition-colors ${
                isLiked ? "bg-destructive/10" : "hover:bg-destructive/10"
              } ${isAnimating ? "animate-heart-pop" : ""}`}
            >
              <Heart
                className={`w-4 h-4 transition-transform ${
                  isLiked ? "fill-current" : ""
                }`}
              />
            </span>
            <span className={`text-sm ${isLiked ? "font-medium" : ""}`}>
              {likeCount}
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default Post;
