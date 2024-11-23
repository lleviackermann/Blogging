"use client"
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

interface FilterFormProps {
    priority: undefined | null | string;
    status: undefined | null | string;
    sort: undefined | null | string;
    onFinish: () => void;
}

const FilterForm: React.FC<FilterFormProps> = ({priority, status, sort, onFinish}) => {
    const [selectPriority, setSelectPriority] = useState<string>(priority??"all");
    const [selectStatus, setSelectStatus] = useState<string>(status??"all");
    const [selectSort, setSelectSort] = useState<string>(sort??"desc");
    const router = useRouter();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        let urlSearchParams = new URLSearchParams()
        urlSearchParams.set("priority", selectPriority);
        urlSearchParams.set("status", selectStatus);
        urlSearchParams.set("sort", selectSort);
        router.push("/?" + urlSearchParams.toString());
        onFinish();
    }

    return (
        <form
            className='flex flex-col gap-4'
            onSubmit={handleSubmit}
        >
            <div className='flex flex-col gap-1'>
                <label>Priority</label>
                <Select value={selectPriority} onValueChange={(value: "all" | "low" | "medium" | "high") => setSelectPriority(value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className='flex flex-col gap-1'>
                <label>Status</label>
                <Select value={selectStatus} onValueChange={(value: "all" | "todo" | "inProgress" | "completed") => setSelectStatus(value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="todo">To Do</SelectItem>
                            <SelectItem value="inProgress">In Progress</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div className='flex flex-col gap-1'>
                <label>Sort By Due Date</label>
                <Select value={selectSort} onValueChange={(value: "asc" | "desc") => setSelectSort(value)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="desc">Desc</SelectItem>
                            <SelectItem value="asc">Asc</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <Button>
                Submit
            </Button>
        </form>
    )
}

export default FilterForm;