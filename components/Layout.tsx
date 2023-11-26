import Tabs from "./Tabs";

export default function Layout({ children }: { children: React.ReactChild }) {
  return (
    <div className="flex relative flex-col justify-center h-screen mx-auto md:border-r md:border-l md:border-black-700 w-full max-w-xl">
      <Tabs />
      {children}
    </div>
  );
}
