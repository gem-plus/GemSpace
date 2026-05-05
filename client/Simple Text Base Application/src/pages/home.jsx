import HomePost from "../components/homepost";
import NavBar from "../components/navbar";
import { useEffect, useState } from "react";

function Home() {
  const [post, setpost] = useState([]);

  useEffect(() => {
    async function getpost() {
      const res = await fetch("http://localhost:3000/", {});

      const data = await res.json();
      if (data.success) setpost(data.post);
    }
    getpost();
  }, []);

  return (
    <>
      <header>
        <NavBar />
      </header>
      <div className="home">
        <div className="posts">
          {[...post].reverse().map((post) => (
            <HomePost
              key={post._id}
              username={post.user.username}
              content={post.content}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default Home;
