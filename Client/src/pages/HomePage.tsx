import { useEffect } from "react";
import Header from "../components/Header";
import LeftNav from "../components/LeftNav";
import Post from "../components/Posts/Post";
import Poster from "../components/Posts/Poster";
import RightNav from "../components/RightNav";
import { usePostStore } from "../store/postStore";


const HomePage = () => {
  const { posts, loading, hasMore, fetchPosts, resetPosts } = usePostStore();


  useEffect(() => {
    resetPosts();
    fetchPosts();
  }, [resetPosts, fetchPosts]);

  useEffect(() => {
    const handleScroll = async () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.scrollHeight
      ) {
        if (!loading) {
          await fetchPosts();
        }
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, fetchPosts]);

  return (
    <>
      <Header />
      <main className="flex justify-center sm:justify-between pt-16">
        <LeftNav />
        <div className="w-[680px] mx-[clamp(0px,3vw,80px)] min-w-[300px] flex flex-col pt-4 items-center gap-4 pb-12">

          {/* whats on your mind */}
          <Poster />

          {posts.map((p) => <Post key={p.id} {...p} />)}
          {!loading && !posts.length && (
            <div className="text-neutral-400 py-6">No posts yet...</div>
          )}

          {!loading && posts.length > 0 && !hasMore && (
            <div className="text-neutral-500 py-6">You’ve reached the end!</div>
          )}

          {loading && (
            <div className="bg-neutral-900 w-full flex flex-col items-center rounded-2xl px-3 pt-3 gap-3 animate-pulse">

              {/* Header: Profile pic + username */}
              <div className="w-full flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-neutral-700"></div>
                <div className="flex flex-col gap-1">
                  <div className="w-24 h-4 rounded bg-neutral-700"></div>
                  <div className="w-16 h-3 rounded bg-neutral-800"></div>
                </div>
              </div>

              {/* Post content */}
              <div className="w-full max-w-[640px] h-16 rounded bg-neutral-700"></div>

              <div className="flex justify-between w-full max-w-[640px] h-4">
                <div className="w-12 h-3 rounded bg-neutral-700"></div>
                <div className="w-16 h-3 rounded bg-neutral-700"></div>
              </div>


              <div className="w-full max-w-[640px] h-8"></div>

            </div>
          )}

        </div>
        <RightNav />
      </main>
    </>
  )
}

export default HomePage