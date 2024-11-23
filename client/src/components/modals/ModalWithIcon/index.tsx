import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import React, { Dispatch, SetStateAction, useState } from 'react'

interface ModalWithIconProps {
    icon: React.ReactElement,
    title: string,
    description: string,
    open?: boolean,
    setOpen?: Dispatch<SetStateAction<boolean>>,
    children: React.ReactNode
}

const ModalWithIcon: React.FC<ModalWithIconProps> = ({ icon, title, description, open, setOpen, children }) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {icon}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-black" onKeyDown={(e) => e.stopPropagation()} onMouseMove={(e) => e.stopPropagation()}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}

export default ModalWithIcon