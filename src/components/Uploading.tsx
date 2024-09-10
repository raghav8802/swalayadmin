import Image from "next/image";
import Link from "next/link";

interface ErrorSectionProps {
  message: string;
}

const Uploading: React.FC<ErrorSectionProps> = ({ message = "Uploading" }) => {
  return (
    <div className="flex min-h-[80dvh] flex-col items-center justify-center bg-background px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">

        <div className="flex items-center justify-center">
        <Image src={'/images/upload2.gif'}  alt="file uploading" width={120} height={120} />
        </div>
        
        <h1 className="text-m font-bold tracking-tight text-foreground sm:text-2xl">
          {message}
        </h1>
        <p className="mt-4 text-muted-foreground text-lg">
        Please be patient while the process completes
        </p>
       
      </div>
    </div>
  );
};

export default Uploading;
