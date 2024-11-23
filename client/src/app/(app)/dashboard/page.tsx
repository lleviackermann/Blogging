"use client"
import PrimaryModal from "@/components/modals/PrimaryModal";
import { CirclePlus } from "lucide-react";
import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import PrimaryLoader from "@/components/loaders/PrimaryLoader";
import { Post } from "@/types/posts/index.type";
import PostCard from "@/components/cards/PostCard";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import CarForm from "../components/PostForm";
import { useAppSelector } from "@/store/hooks";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addTaskVisible, setAddTaskVisible] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const toast = useToast();
  const user = useAppSelector((state) => state.user);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/posts", { params: { author: user._id, page: searchParams.get("page") || 1, limit: searchParams.get("limit") || 20 } });
      setPosts([...response.data.data]);
      setTotalPages(response.data.totalPages);
      toast.toast({ title: response.data.message });
    } catch (err: any) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.toast({ title: err.response.data.message, variant: "destructive" })
      } else {
        toast.toast({ title: "Network Error / Server Down", variant: "destructive" })
      }
    } finally {
      setLoading(false);
    }
  }

  const onAddPost = (post: Post) => {
    setPosts((prev) => [...prev, post]);
    setAddTaskVisible(false);
  }

  const onEditPost = (post: Post) => {
    setPosts((prev) => prev.map(hold => { return (hold._id === post._id ? { ...post } : { ...hold }) }));
  }

  const onDelete = async (_id: string) => {
    setPosts((prev) => prev.filter((car) => car._id != _id));
  }

  useEffect(() => {
    fetchPosts();
  }, [searchParams])

  return (
    <div className="flex-1 px-10 w-full bg-black self-center flex flex-col pb-4">
      {
        loading
          ?
          <div className="flex-1 flex justify-center items-center">
            <PrimaryLoader />
          </div>
          :
          <div className="flex flex-col flex-1">
            <div className="flex flex-row justify-end py-6 gap-4">
              <PrimaryModal
                icon={<CirclePlus className="w-5 h-5" />}
                title="Create Post"
                description="Fill the details of your new post"
                open={addTaskVisible}
                setOpen={setAddTaskVisible}
                label="Add Post"
              >
                <CarForm type="create" onFinish={onAddPost} />
              </PrimaryModal>
            </div>
            {
              !posts || posts.length === 0
                ?
                <div className="flex-1 flex justify-center items-center text-center">
                  <div className="flex flex-col gap-2">
                    <p>
                      No Posts Found
                    </p>
                    <p>Press on <CirclePlus className="inline-block w-5 h-5" /> icon to add post</p>
                  </div>
                </div>
                :
                <div className="flex flex-col gap-8 flex-1">
                  <div className="flex-1">
                    <div className="flex flex-row flex-wrap justify-center gap-10 max-h-min flex-grow">
                      {posts.map((post) => (
                        <PostCard
                          {...post}
                          key={post._id}
                          onEdit={onEditPost}
                          onDelete={onDelete}
                          className="w-[300px]"
                          aspectRatio="square"
                          width={300}
                          height={330}
                          showUpdateOptions={true}
                        />
                      ))}
                    </div>
                  </div>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href={`/dashboard/?page=${Math.max(Number(searchParams.get("page")) - 1, 1)}&limit=${searchParams.get("limit") || 20}&search=${searchParams.get("search")}`} />
                      </PaginationItem>
                      {
                        Number(searchParams.get("page")) - 1 > 0
                        ?
                        <PaginationItem>
                          <PaginationLink href={`/dashboard/?page=${Number(searchParams.get("page")) - 1}&limit=${searchParams.get("limit") || 20}&search=${searchParams.get("search")}`}>{Number(searchParams.get("page")) - 1}</PaginationLink>
                        </PaginationItem>
                        :
                        null
                      }
                      <PaginationItem>
                        <PaginationLink isActive href={`/dashboard/?page=${Math.max(Number(searchParams.get("page")), 1)}&limit=${searchParams.get("limit") || 20}&search=${searchParams.get("search")}`}>{Math.max(Number(searchParams.get("page")), 1)}</PaginationLink>
                      </PaginationItem>
                      {
                        Number(searchParams.get("page")) + 1 <= totalPages && Number(searchParams.get("page")) + 1 > 1
                        ?
                        <PaginationItem>
                          <PaginationLink href={`/dashboard/?page=${Number(searchParams.get("page")) + 1}&limit=${searchParams.get("limit") || 20}&search=${searchParams.get("search")}`}>{Number(searchParams.get("page")) + 1}</PaginationLink>
                        </PaginationItem>
                        :
                        null
                      }
                      <PaginationItem>
                        <PaginationNext 
                          href={`/dashboard/?page=${Math.min(Number(searchParams.get("page")) + 1, totalPages)}&limit=${searchParams.get("limit") || 20}&search=${searchParams.get("search")}`}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
            }
          </div>
      }
    </div>
  );
}

export default Posts;