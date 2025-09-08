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
        window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.scrollHeight
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
        <div className="w-[680px] mx-[clamp(0px,3vw,80px)] min-w-[485px] flex flex-col pt-4 items-center gap-4 pb-12">

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
            <div className="bg-neutral-900 flex items-center justify-center w-full h-[125px] rounded-2xl">
              <div className="bg-transparent w-12 h-12 rounded-full border-[8px] border-gray-400 border-t-white animate-spin"></div>
            </div>
          )}

        </div>
        <RightNav />
      </main>
    </>
  )
}

export default HomePage