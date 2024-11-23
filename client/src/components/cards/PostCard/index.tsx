import React, { useState } from 'react'
import { Post } from '@/types/posts/index.type';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import moment from "moment";
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/api/axiosInstance';

interface PostCardProps extends Post {
    onDelete?: (_id: string) => Promise<void>;
    onLiked?: (liked: boolean, id: string) => void;
    showUpdateOptions?: boolean;
    className?: string;
    aspectRatio?: "portrait" | "square"
    width?: number
    height?: number
}

const PostCard: React.FC<PostCardProps> = ({ onDelete, onLiked, showUpdateOptions = true, className = "", width, height, aspectRatio = "square", ...props }) => {
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleLike = async () => {
        setLoading(true);

        try {   
            const response = await axiosInstance.post(`/posts/${props._id}/toggle-like`);
            onLiked?.(response.data.liked, props._id);
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
    };

    return (
        <div className={cn("hover:cursor-pointer flex flex-col gap-2 bg-gray-900 p-4 bg-opacity-50 rounded-md shadow-sm shadow-blue-300", className)}>
            <div className='flex flex-row items-start justify-between'>
                <h3 className="font-medium">{props.title}</h3>
                <h5 className="font-medium text-sm text-muted-foreground">{props.authorName}</h5>
            </div>
            {
                props.image 
                &&
                <div className="overflow-hidden rounded-md">
                    <Image
                        src={props.image}
                        alt=""
                        width={width}
                        height={height}
                        className={cn(
                            "h-auto w-auto object-cover transition-all hover:scale-105",
                            aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                        )}
                        />
                </div>
            }
            <div className="space-y-1 text-sm">
                <p className="text-md text-muted-foreground break-words">{props.bio}</p>
                <div className='flex flex-row justify-between items-center'>
                    <div className='flex flex-row items-center gap-1'>
                        <Heart fill={props.isLiked ? 'red' : 'transparent'} stroke='red' className={'w-5 h-5 cursor-pointer'} onClick={!loading ? handleLike: () => {}} />
                        <p>{props.likes}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">{moment(props.createdAt).fromNow()}</p>
                </div>
            </div>
        </div>
    )
}

export default PostCard