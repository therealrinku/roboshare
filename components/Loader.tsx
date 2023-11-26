type LoaderTypes = {
  progress: number;
};

export default function Loader({ progress }: LoaderTypes) {
  return (
    <div className={`flex items-center gap-3 h-[12px] mt-3 justify-center items-center mx-auto`}>
      <div className="w-[200px] bg-[#f0f2f5] h-full">
        <div style={{ width: progress + "%" }} className="bg-green-500 h-full"></div>
      </div>
      <p className="text-sm h-[12px] mt-[4.5px]"> {progress}%</p>
    </div>
  );
}
