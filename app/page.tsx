import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <nav>

      </nav>
      <h1 className="">hello</h1>
      <Button variant={'ghost'}>Subscribe</Button>
      <UserButton/>
    </div>
  );
}
