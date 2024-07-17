import React from 'react';
import {Navbar} from "@/app/(marketing)/_componets/navbar";
import {Footer} from "@/app/(marketing)/_componets/footer";



const MarketingLayout = ({children} : {children : React.ReactNode}) => {
    return (
        <main className={"h-full bg-slate-100"}>
            <Navbar/>
            <main className={"pt-40 pb-20 bg-slate-100"}>
            {children}
            </main>
            <Footer/>
        </main>
    );
};

export default MarketingLayout;