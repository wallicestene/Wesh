"use client";
import Banner from "@/components/Banner";
import ChatUI from "@/components/ChatUI";
import Navbar from "@/components/Navbar";
import Platforms from "@/components/Platforms";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";




const Page = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Navbar />
        <main className="flex flex-col pt-(--navbar-h)">
          <Banner />
          <Platforms />
          <ChatUI />
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default Page;
