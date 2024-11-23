"use client"
import axiosInstance from '@/api/axiosInstance'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'
import { userActions } from '@/store/features/userSlice'
import { useAppDispatch } from '@/store/hooks'
import { CircleUser, Menu } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const PrimaryNavbar = () => {
    const dispatch = useAppDispatch();
    const toast = useToast();

    const handleLogout = async () => {
        try {
            const response = await axiosInstance.get("/auth/logout");
            dispatch(userActions.reset());
            toast.toast({title: response.data.message});
        } catch (err: any) {
            console.log(err);
            if (err?.response?.data?.message) {
                toast.toast({ title: err.response.data.message, variant: "destructive" })
            } else {
                toast.toast({ title: "Network Error / Server Down", variant: "destructive" })
            }
        }
    }

    return (
        <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-black px-4 md:px-6 z-10">
            <nav className="flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 text-lg font-semibold md:text-base"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-6 w-6"
                    >
                        <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                    </svg>
                    <span className="sr-only">Caro</span>
                </Link>
            </nav>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                <form className="ml-auto flex-1 sm:flex-initial">
                </form>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <CircleUser className="h-5 w-5" />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuItem className='cursor-pointer'>
                            <Link href="/profile/cars">
                                Your Cars
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}

export default PrimaryNavbar