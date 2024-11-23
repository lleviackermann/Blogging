import React, { useState } from 'react'
import { Car } from '@/types/cars/index.type';
import ModalWithText from '@/components/modals/ModalWithText';
import CarForm from '@/app/(app)/components/CarForm';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import axiosInstance from '@/api/axiosInstance';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface CarCardProps extends Car {
    onDelete?: (_id: string) => Promise<void>;
    onEdit?: (Car: Car) => void;
    showUpdateOptions?: boolean;
    className?: string;
    aspectRatio?: "portrait" | "square"
    width?: number
    height?: number
}


const CarCard: React.FC<CarCardProps> = ({ _id, title, description, images, tags, onDelete, onEdit, showUpdateOptions = true, className = "", width, height, aspectRatio = "square" }) => {
    const [loading, setLoading] = useState(false);
    const [editVisible, setEditVisible] = useState<boolean>(false);
    const toast = useToast();
    const router = useRouter();

    const handleDelete = async () => {
        setLoading(true);
        try {
            await axiosInstance.delete("/cars/" + _id);
            onDelete?.(_id)
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

    const handleEdit = (Car: Car) => {
        onEdit?.(Car);
        setEditVisible(false);
    }

    return (
        <div className={cn("space-y-3 hover:cursor-pointer", className)} onClick={() => router.push("/car/" + _id)}>
            <ContextMenu>
                <ContextMenuTrigger disabled={!showUpdateOptions}>
                    <div className="overflow-hidden rounded-md">
                        <Image
                            src={images[0]}
                            alt=""
                            width={width}
                            height={height}
                            className={cn(
                                "h-auto w-auto object-cover transition-all hover:scale-105",
                                aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
                            )}
                        />
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-40">
                    <ContextMenuItem onSelect={(event) => {
                        event.preventDefault();
                    }}>
                        <ModalWithText
                            label='Edit'
                            title='Edit Car'
                            description='Make changes to Edit Car'
                            open={editVisible}
                            setOpen={setEditVisible}
                        >
                            <CarForm
                                type='edit'
                                onFinish={handleEdit}
                                carId={_id}
                                defaultTitle={title}
                                defaultDescription={description}
                                defaultImages={images}
                                defaultTags={tags}
                            />
                        </ModalWithText>
                    </ContextMenuItem>
                    <ContextMenuItem onSelect={(event) => {
                        event.preventDefault();
                        handleDelete();
                    }}>
                        Delete
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
            <div className="space-y-1 text-sm">
                <h3 className="font-medium leading-none">{title}</h3>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    )
}

export default CarCard