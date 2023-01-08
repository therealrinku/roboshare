import Link from "next/link";
import { IoPrism } from "react-icons/io5";

export default function Nav() {
  return (
    <div className="border-0 border-b border-dotted border-violet-500 h-16 flex py-2 flex justify-center">
      <Link href="/" passHref>
        <a className="flex gap-2 items-center text-lg font-bold">
          <IoPrism />
          <p>Arcshare</p>
        </a>
      </Link>
    </div>
  );
}
