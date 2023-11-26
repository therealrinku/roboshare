import Link from "next/link";
import { useRouter } from "next/router";
import { FiDownload, FiUpload } from "react-icons/fi";

export default function Tabs() {
  const router = useRouter();
  const activeTab = router.pathname === "/" ? "Upload" : "Download";

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

  return (
    <div className="flex items-center absolute top-0 w-full">
      {TabItems.map((tab) => {
        return (
          <Link href={tab.link} key={tab.link} passHref>
            <a
              className={`${
                activeTab === tab.name && "border-b-transparent"
              } h-10 w-32 flex flex-col items-center justify-center text-sm border-r border-b`}
            >
              {tab.name}
            </a>
          </Link>
        );
      })}

      <div className="border-b w-4/6 h-10" />
    </div>
  );
}
