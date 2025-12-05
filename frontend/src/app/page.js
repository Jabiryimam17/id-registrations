'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
// import Image from "next/image";


export default function HomePage() {
  const router = useRouter();

  return (
      <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-green-100 to-yellow-200"

      >
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full">
          {/* <Image
                    src="/ethiopia_logo.png" // You need to add this image in public folder
                    alt="Ethiopia Logo"
                    width={80}
                    height={80}
                    className="mx-auto mb-4"
                /> */}
          <h1 className="text-3xl font-extrabold text-green-700 mb-2">Welcome to Ethiopia eVote</h1>
          <p className="text-gray-600 mb-6">
            Secure digital voting platform for citizens and parties.
          </p>
          <div className="space-y-4">
            <Button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg py-6 rounded-xl shadow-md"
                onClick={() => router.push('/add-party')}
            >
              Register as Political Party
            </Button>
            <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-6 rounded-xl shadow-md"
                onClick={() => router.push('/register')}
            >
              Register as Voter
            </Button>
          </div>
        </div>
      </motion.div>
  );
}
