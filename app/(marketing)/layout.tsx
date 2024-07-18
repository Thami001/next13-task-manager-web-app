
import {Navbar} from "@/app/(marketing)/_componets/navbar";
import {Footer} from "@/app/(marketing)/_componets/footer";



const MarketingLayout = ({children} : {children : React.ReactNode}) => {
    return (
        <div className={"h-full "}>
            <Navbar/>
            <main className={"pt-40 pb-20 "}>
            {children}
            </main>
            <Footer/>
        </div>
    );
};

export default MarketingLayout;