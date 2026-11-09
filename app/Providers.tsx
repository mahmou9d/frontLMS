"use client"
import { store } from "@/redux/store";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { Provider } from "react-redux";



interface ProviderProps {
    children: ReactNode
}

export function Providers({children}:ProviderProps){
    return <Provider store={store}><SessionProvider>{children}</SessionProvider></Provider>
}