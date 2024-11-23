import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@radix-ui/react-popover'
import { CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, Command  } from 'cmdk'
import { ChevronsUpDown } from 'lucide-react'
import React, { useState } from 'react'

interface PrimaryComboboxProps {
    value: string | null,
    setValue: any,
    options: {name: string, email?: string, _id: string | null} []
}

const PrimaryCombobox: React.FC<PrimaryComboboxProps> = ({value, setValue, options}) => {
    console.log(options)
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? options.find((option) => option._id === value)?.name
                        : "Select Author..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full">
                <Command>
                    <CommandInput placeholder="Search Author..." className='text-black p-1' />
                    <CommandList className='border-[1px] border-gray-500 p-2'>
                        <CommandEmpty>No Author found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option._id}
                                    value={option.name}
                                    onSelect={() => {
                                        setValue(option._id)
                                        setOpen(false)
                                    }}
                                    className='mt-1 cursor-pointer'
                                >
                                    {option.name}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default PrimaryCombobox