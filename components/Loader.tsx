import Image from "next/image";

const Loader = () => {
  return (
    <div className="flex-center h-[40px] lg:h-screen w-full mt-[60px]">
      <Image
        src={"/icons/loading-circle.svg"}
        alt="loading"
        height={50}
        width={50}
      />
    </div>
  );
};

export default Loader;
