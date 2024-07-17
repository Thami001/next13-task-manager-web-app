import React from 'react';
import {ClerkProvider} from "@clerk/nextjs";
import {Toaster} from "sonner";
import {ModalProvider} from "@/components/providers/modalProvider";
import {QueryProvider} from "@/components/providers/queryProvider";

const PlatformLayout = ({children} : {children: React.ReactNode}) => {
    return (
        <ClerkProvider>
            <QueryProvider>
            <Toaster/>
            <ModalProvider/>
            {children}
            </QueryProvider>
        </ClerkProvider>
    );
};

export default PlatformLayout;