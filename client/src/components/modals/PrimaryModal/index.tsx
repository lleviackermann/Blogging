import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import React, { Dispatch, SetStateAction } from 'react'

interface PrimaryModalProps {
    icon?: React.ReactElement,
    label: string,
    title: string,
    description: string,
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    children: React.ReactNode
}

const PrimaryModal: React.FC<PrimaryModalProps> = ({ icon, label, title, description, open, setOpen, children }) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='gap-2'>{icon} {label}</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-black max-h-[80%] overflow-y-auto" onKeyDown={(e) => e.stopPropagation()}>
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

export default PrimaryModal