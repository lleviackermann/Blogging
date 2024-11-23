"use client"
import axiosInstance from '@/api/axiosInstance';
import { userActions } from '@/store/features/userSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import PrimaryLoader from '../loaders/PrimaryLoader';

const withAuth = (Component: any) => {
    return function WithAuth(props: any) {
        const router = useRouter();
        const dispatch = useAppDispatch();
        const user = useAppSelector(state => state.user);

        const bootData = async () => {
            try {
                const response = await axiosInstance.get("/boot");
                dispatch(userActions.setBootData({_id: response.data.data._id, name: response.data.data.name, email: response.data.data.email, isLoggedIn: true}));
            } catch (err) {
                console.log(err);
                router.push("/login");
            }
        }

        useEffect(() => {
            if (!user.isLoggedIn) {
                bootData();
            }
        },  [user.isLoggedIn]);

        return (
            !user.isLoggedIn
            ?
            <div className='w-full h-screen flex justify-center items-center'>
                <PrimaryLoader />
            </div>
            :
            <Component {...props} />
        )
    }
}

export default withAuth;