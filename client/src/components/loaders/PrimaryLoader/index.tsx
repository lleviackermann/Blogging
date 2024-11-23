import { cn } from '@/lib/utils';
import React from 'react'

interface PrimaryLoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const PrimaryLoader: React.FC<PrimaryLoaderProps> = (props) => {
    const { className, ...restProps } = props;
    return (
        <div className={cn("w-12 h-12 rounded-full animate-spin border-y border-solid border-yellow-500 border-t-transparent shadow-md", className)}></div>
    )
}

export default PrimaryLoader