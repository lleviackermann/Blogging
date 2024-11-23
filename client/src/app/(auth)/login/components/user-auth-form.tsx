"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import axiosInstance from "@/api/axiosInstance"
import { useRouter } from "next/navigation"
import PrimaryLoader from "@/components/loaders/PrimaryLoader"
import { useToast } from "@/hooks/use-toast"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> { }

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const router = useRouter();
    const toast = useToast();

    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault()
        setIsLoading(true)
        
        try {
            const response = await axiosInstance.post("/auth/login", {email, password});
            router.replace("/");
        } catch (err: any) {
            console.log(err);
            if (err?.response?.data?.message) {
                toast.toast({title: err.response.data.message, variant: "destructive"})
            } else {
                toast.toast({title: "Network Error / Server Down", variant: "destructive"})
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={cn("grid gap-6", className)} {...props}>
            <form onSubmit={onSubmit}>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label className="font-bold" htmlFor="email">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="name@example.com"
                            type="email"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label className="font-bold" htmlFor="password">
                            Password
                        </Label>
                        <Input
                            id="password"
                            placeholder="*************"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <Button disabled={isLoading}>
                        {
                            isLoading 
                            ? 
                            (
                                <PrimaryLoader className="w-5 h-5" />
                            )
                            :
                            "Log In with Email"
                        }
                    </Button>
                </div>
            </form>
        </div>
    )
}