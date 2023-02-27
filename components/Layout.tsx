import { Avatar, Tabs } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { FiCreditCard, FiDownload, FiHome, FiUpload } from "react-icons/fi";
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
    <Fragment>
      <div className="md:mt-10 h-screen mx-auto shadow-lg md:border md:border-black-500 rounded-md w-full max-w-2xl">
        <div className="relative px-3 sticky top-0">
          <Tabs
            items={TabItems.map((item) => {
              return {
                label: (
                  <Link href={item.link}>
                    <span className="flex items-center gap-3">
                      {item.icon} {item.name}
                    </span>
                  </Link>
                ),
                key: item.name,
              };
            })}
            onChange={(e) => {
              if (e === "Download") router.push("/download");
              else router.push("/");
            }}
            activeKey={activeTab}
          />

          <Link passHref href="https://arcshare.vercel.app">
            <a className="md:rounded-tr-md py-3 px-3 text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-l text-sm font-bold absolute right-0 top-0 flex items-center gap-2">
              {" "}
              <IoPrism /> Arcshare
            </a>
          </Link>
        </div>
        {children}
      </div>
    </Fragment>
  );
}
