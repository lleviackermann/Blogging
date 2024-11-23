"use client"
import PrimaryNavbar from '@/components/navbars/PrimaryNavbar';
import withAuth from '@/components/withAuth';
import React from 'react'

const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <React.Fragment>
            <PrimaryNavbar />
            {children}
        </React.Fragment>
    )
}

export default withAuth(layout);