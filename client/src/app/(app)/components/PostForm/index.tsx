"use client"
import axiosInstance from '@/api/axiosInstance'
import PrimaryLoader from '@/components/loaders/PrimaryLoader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { convertToBase64 } from '@/lib/utils'
import { Post } from '@/types/posts/index.type'
import React, { useState } from 'react'

interface PostFormProps {
    type: "create" | "edit";
    onFinish: (post: Post) => void;
    postId?: string;
    defaultTitle?: string;
    defaultDescription?: string;
    defaultTags?: string [];
    defaultImages?: string [];
}

const PostForm: React.FC<PostFormProps> = ({ type, onFinish, postId, defaultTitle, defaultDescription, defaultTags, defaultImages }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(defaultTitle ? defaultTitle : "");
    const [content, setContent] = useState<string>(defaultDescription ? defaultDescription : "");
    const [image, setImage] = useState<string>("");
    const toast = useToast();

    const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            if (e.target.files.length > 10) {
                return toast.toast({ title: "Can't Upload more than 10 Images", variant: "destructive" })
            }

            let base64: string;
            const file = e.target.files[0];
            if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg") {
                base64 = await convertToBase64(file);
            } else {
                return toast.toast({ title: "Allowed formats are - jpeg, png & jpg", variant: "destructive" })
            }

            setImage(base64);
        }
    }

    const handleCreatePost = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosInstance.post("/post", { title, bio: content, image });
            onFinish(response.data.data);
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

    // const handleEditTask = async (e: React.SyntheticEvent) => {
    //     e.preventDefault();
    //     setLoading(true);

    //     try {
    //         const payload: any = { title, content, tags };

    //         const response = await axiosInstance.put("/cars/" + carId, payload);
    //         onFinish({ _id: carId!, title, bio, image });
    //         toast.toast({ title: response.data.message });
    //     } catch (err: any) {
    //         console.log(err);
    //         if (err?.response?.data?.message) {
    //             toast.toast({ title: err.response.data.message, variant: "destructive" })
    //         } else {
    //             toast.toast({ title: "Network Error / Server Down", variant: "destructive" })
    //         }
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    return (
        <form
            className='flex flex-col gap-4'
            onSubmit={
                type === "create"
                    ?
                    handleCreatePost
                    :
                    handleCreatePost
            }
        >
            <div className='flex flex-col gap-1'>
                <label htmlFor='title'>Title</label>
                <Input id='title' value={title} onChange={e => setTitle(e.target.value)} required placeholder="My first post" />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
                <label htmlFor="picture">Image</label>
                <Input onChange={handleAddImage} id="picture" type="file" accept="image/*" />
            </div>

            <div className='flex flex-col gap-1'>
                <label htmlFor='content'>Content</label>
                <Textarea id='content' value={content} onChange={e => setContent(e.target.value)} placeholder='This is the content of the post' />
            </div>

            <Button>
                {
                    loading
                        ?
                        <PrimaryLoader className='w-5 h-5' />
                        :
                        "Submit"
                }
            </Button>
        </form>
    )
}

export default PostForm