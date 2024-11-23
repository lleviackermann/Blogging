"use client"
import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import PrimaryLoader from "@/components/loaders/PrimaryLoader";
import { Post } from "@/types/posts/index.type";
import PostCard from "@/components/cards/PostCard";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import PrimaryCombobox from "@/components/comboboxes/PrimaryCombobox";


const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const searchParams = useSearchParams();
  const toast = useToast();
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState<{ name: string, email: string, _id: string }[]>([]);
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const response = await axiosInstance.get("/posts", { params: { page: searchParams.get("page") || 1, limit: searchParams.get("limit") || 20, author: selectedUser } });
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
    }
  }

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/users");
      setUsers([...response.data.data]);
      toast.toast({ title: response.data.message });
    } catch (err: any) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.toast({ title: err.response.data.message, variant: "destructive" })
      } else {
        toast.toast({ title: "Network Error / Server Down", variant: "destructive" })
      }
    }
  }

  const onLiked = async (liked: boolean, id: string) => {
    setPosts((prev) => prev.map((post) => post._id === id ? { ...post, likes: (post.isLiked && !liked ? post.likes - 1 : !post.isLiked && liked ? post.likes + 1 : post.likes), isLiked: liked } : post))
  }

  const fetchData = async (type: "all" | "posts") => {
    setLoading(true);
    try {
      if (type == "all") {
        await Promise.all([
          fetchPosts(),
          fetchUsers()
        ])
      } else if (type === "posts") {
        await fetchPosts()
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData("posts");
  }, [selectedUser])

  useEffect(() => {
    fetchData("all");
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
            <div className="flex flex-row justify-between py-6 gap-4">
              <PrimaryCombobox
                options={[{ name: "all", _id: null }, ...users]}
                value={selectedUser}
                setValue={setSelectedUser}
              />
            </div>
            {
              !posts || posts.length === 0
                ?
                <div className="flex-1 flex justify-center items-center text-center">
                  <div className="flex flex-col gap-2">
                    <p>
                      No Posts Found
                    </p>
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
                          className="w-[300px] self-start"
                          aspectRatio="square"
                          width={300}
                          height={330}
                          showUpdateOptions={false}
                          onLiked={onLiked}
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