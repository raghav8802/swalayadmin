"use client";
import { apiPost } from '@/helpers/axiosRequest';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Page = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const router = useRouter();

    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    console.log("token ::", token);

    const onVerify = async () => {
        setIsLoading(true)
        try {
            const response = await apiPost('/api/admin/verifyemail', { token });
            console.log("verify response", response);
            console.log(response.success);
            if (response.success) {
                router.push('/signin');
            } else {
                setError(true);
            }
            setIsLoading(false)
        } catch (err) {
            console.error("Error verifying token:", err);
            toast.error("Internal server error");
            setIsLoading(false)
        }
    };



    return (
        <main className="flex h-screen w-full items-center justify-center bg-background">

            {
                isLoading ? (<h3 className='text-xl text-muted-foreground'>Loading</h3>)
                    :
                    (

                        <Card className="w-full max-w-md p-6 space-y-4">
                            {error ? (
                                <>
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-bold text-red-600">Oops, Invalid URL</CardTitle>
                                        <CardDescription className="text-muted-foreground">
                                            The URL you tried to access is not valid. Please check the URL and try again.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button className="w-full" onClick={() => router.push('/')}>
                                            Go to Homepage
                                        </Button>
                                    </CardContent>
                                </>
                            ) : (
                                <>
                                    <CardHeader>
                                        <CardTitle className="text-2xl font-bold">Verify Your Identity</CardTitle>
                                        <CardDescription className="text-muted-foreground">
                                            Click the button below to verify your identity and continue.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button className="w-full py-4" onClick={onVerify}>
                                            Verify
                                        </Button>
                                    </CardContent>
                                </>
                            )}
                        </Card>
                    )
            }

        </main>
    );
};

export default Page;
