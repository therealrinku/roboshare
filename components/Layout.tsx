import Link from "next/link";
import { useRouter } from "next/router";
import { FiDownload, FiUpload } from "react-icons/fi";
import { IoPrism } from "react-icons/io5";

export default function Layout({ children }: { children: React.ReactChild }) {
  const router = useRouter();

  const TabItems = [
    {
      name: "Upload",
      icon: <FiUpload />,
      link: "/",
    },
    {
      name: "Download",
      icon: <FiDownload />,
      link: "/download",
    },
  ];

  const activeTab = router.pathname === "/" ? "Upload" : "Download";

  return (
    <div className="pt-10">
      <div className="h-500 mx-auto shadow-lg md:border md:border-black-700 w-full max-w-2xl">
        <div className="relative sticky top-0 border-b h-10 flex flex-col justify-center">
          <div className="flex items-center">
            {TabItems.map((tab) => {
              return (
                <Link href={tab.link} key={tab.link} passHref>
                  <a
                    className={`${
                      activeTab === tab.name ? "text-white font-bold bg-green-500 " : ""
                    } h-10 w-32 flex flex-col items-center justify-center text-sm`}
                  >
                    {tab.name}
                  </a>
                </Link>
              );
            })}
          </div>

          <Link passHref href="https://arcshare.vercel.app">
            <a className="h-full px-3 text-white bg-gradient-to-r from-green-700 to-green-600 hover:bg-gradient-to-l text-sm font-bold absolute right-0 top-0 flex items-center gap-2">
              {" "}
              <IoPrism /> Arcshare
            </a>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
