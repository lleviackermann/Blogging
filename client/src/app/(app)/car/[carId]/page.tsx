"use client";

import axiosInstance from '@/api/axiosInstance';
import PrimaryLoader from '@/components/loaders/PrimaryLoader';
import PrimaryModal from '@/components/modals/PrimaryModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Car } from '@/types/cars/index.type';
import { CirclePlus, Pen, User } from 'lucide-react';
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import CarForm from '../../components/CarForm';
import { Badge } from '@/components/ui/badge';

const page = () => {
    const [carData, setCarData] = useState<Car | null>(null);
    const [loading, setLoading] = useState(true);
    const [editVisible, setEditVisible] = useState(false);
    const toast = useToast();
    const params = useParams();
    const router = useRouter();

    const fetchCar = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("/cars/" + params.carId);
            setCarData(response.data);
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

    const handleEdit = () => {
        setEditVisible(false);
        fetchCar();
    }

    const handleDelete = async () => {
        setLoading(true);
        try {
            await axiosInstance.delete("/cars/" + carData?._id);
        } catch (err: any) {
            console.log(err);
            if (err?.response?.data?.message) {
                toast.toast({ title: err.response.data.message, variant: "destructive" })
            } else {
                toast.toast({ title: "Network Error / Server Down", variant: "destructive" })
            }
        } finally {
            setLoading(false);
            router.back();
        }
    }

    useEffect(() => {
        fetchCar();
    }, []);

    return (
        loading
            ?
            <div className="flex-1 flex justify-center items-center">
                <PrimaryLoader />
            </div>
            :
            <div className="flex-col flex">
                <div className="flex-1 space-y-6 p-8 pt-6">
                    <div className="flex items-center justify-between space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight"></h2>
                        <div className="flex items-center space-x-2">
                            <PrimaryModal
                                icon={<Pen className="w-5 h-5" />}
                                title='Edit Car'
                                description='Make changes to Edit Car'
                                open={editVisible}
                                setOpen={setEditVisible}
                                label="Edit Car"
                            >
                                <CarForm
                                    type='edit'
                                    onFinish={handleEdit}
                                    carId={carData?._id}
                                    defaultTitle={carData?.title}
                                    defaultDescription={carData?.description}
                                    defaultImages={carData?.images}
                                    defaultTags={carData?.tags}
                                />
                            </PrimaryModal>
                            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 items-start">
                        <Card className="col-span-3 bg-gray-900 text-white">
                            <CardHeader>
                                <CardTitle>{carData?.title}</CardTitle>
                                <CardDescription>
                                    {carData?.description}
                                </CardDescription>

                                <div className='pt-4 flex flex-col gap-4'>
                                    <div className='flex flex-row flex-wrap gap-2'>
                                        {
                                            carData?.tags.map((tag, index) => (
                                                <Badge key={index} variant="secondary">{tag}</Badge>
                                            ))
                                        }
                                    </div>

                                    <div className='flex flex-row gap-2 items-center'>
                                        <div>
                                            <User className='h-[30px] w-[30px]' />
                                        </div>
                                        <div>
                                            <p className='font-bold'>{carData?.user?.name}</p>
                                            <p className='text-sm'>{carData?.user?.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                        <div className="col-span-4 flex justify-center items-center">
                            <Carousel className="w-[80%]">
                                <CarouselContent>
                                    {carData?.images?.map((image, index) => (
                                        <CarouselItem key={index}>
                                            <div className="overflow-hidden text-center rounded-lg">
                                                <Image
                                                    src={image}
                                                    alt=""
                                                    width={1000}
                                                    height={1000}
                                                    className={cn(
                                                        "h-[500px] w-full object-cover transition-all hover:scale-105 aspect-square rounded-lg overflow-hidden"
                                                    )}
                                                />
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
                        </div>
                    </div>
                </div>

            </div>
    )
}

export default page