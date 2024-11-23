"use client"
import axiosInstance from '@/api/axiosInstance'
import PrimaryLoader from '@/components/loaders/PrimaryLoader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { convertToBase64 } from '@/lib/utils'
import { Car } from '@/types/cars/index.type'
import { Plus, X } from 'lucide-react'
import React, { useState } from 'react'

interface CarFormProps {
    type: "create" | "edit";
    onFinish: (car: Car) => void;
    carId?: string;
    defaultTitle?: string;
    defaultDescription?: string;
    defaultTags?: string [];
    defaultImages?: string [];
}

const CarForm: React.FC<CarFormProps> = ({ type, onFinish, carId, defaultTitle, defaultDescription, defaultTags, defaultImages }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [title, setTitle] = useState<string>(defaultTitle ? defaultTitle : "");
    const [description, setDescription] = useState<string>(defaultDescription ? defaultDescription : "");
    const [images, setImages] = useState<string []>([]);
    const [tags, setTags] = useState<string[]>(defaultTags ? defaultTags : []);
    const [tag, setTag] = useState("");
    const toast = useToast();

    const handleAddImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            if (e.target.files.length > 10) {
                return toast.toast({ title: "Can't Upload more than 10 Images", variant: "destructive" })
            }

            let base64s: string [] = [];
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/jpg") {
                    let base64: string = await convertToBase64(file);
                    base64s.push(base64);
                } else {
                    return toast.toast({ title: "Allowed formats are - jpeg, png & jpg", variant: "destructive" })
                }
            }

            setImages([...base64s]);
        }
    }

    const handleAddTag = () => {
        if (tag) {
            if (tags.includes(tag)) {
                toast.toast({ title: "Tags must be distinct", variant: "destructive" })
                return;
            }

            setTags((prev) => [...prev, tag]);
            setTag("");
        }
    }

    const handleRemoveTag = (index: number) => {
        setTags((prev) => prev.filter((_, ind) => ind !== index));
    }

    const handleCreateTask = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axiosInstance.post("/cars/create", { title, description, images, tags });
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

    const handleEditTask = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload: any = { title, description, tags };

            if (images.length > 0) {
                payload.images = images;
            }

            const response = await axiosInstance.put("/cars/" + carId, payload);
            onFinish({ _id: carId!, title, description, tags, images: images.length ? images: defaultImages! });
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

    return (
        <form
            className='flex flex-col gap-4'
            onSubmit={
                type === "create"
                    ?
                    handleCreateTask
                    :
                    handleEditTask
            }
        >
            <div className='flex flex-col gap-1'>
                <label htmlFor='title'>Title</label>
                <Input id='title' value={title} onChange={e => setTitle(e.target.value)} required placeholder="Lamborghini" />
            </div>

            <div className='flex flex-col gap-1'>
                <label htmlFor='tag'>Tags</label>
                <div className='flex flex-row items-center gap-2'>
                    <Input id='tag' value={tag} onChange={e => setTag(e.target.value)} placeholder="Add New Tag" />
                    <Plus className='cursor-pointer' onClick={handleAddTag} />
                </div>
                <div className='flex flex-row flex-wrap gap-2 mt-2'>
                    {
                        tags.map((tag, index) => (
                            <button type='button' className='px-2 py-1 bg-gray-800 rounded-md flex flex-row items-center gap-1 hover:bg-gray-600' onClick={() => handleRemoveTag(index)}>
                                {tag}
                                <X size={16} />
                            </button>
                        ))
                    }
                </div>
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
                <label htmlFor="picture">Images (Max 10)</label>
                <Input onChange={handleAddImages} id="picture" type="file" multiple accept="image/*" />
            </div>

            <div className='flex flex-col gap-1'>
                <label htmlFor='description'>Description</label>
                <Textarea id='description' value={description} onChange={e => setDescription(e.target.value)} placeholder='Figma Designs for Home page' />
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

export default CarForm