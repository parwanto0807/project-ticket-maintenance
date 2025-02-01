"use client";

import { Button } from '@/components/ui/button';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from "next/navigation";

export function CreateProduct() {


  return (
    <Link
      href="/dashboard/master/products/create" 
      className="flex h-8 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Product</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateProduct({ id }: { id: string }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/master/products/edit/${id}`);
  };

  return (
    <Button
      onClick={handleClick}
      variant='outline'
      className="text-blue-600 rounded-md border p-2 hover:bg-blue-800 h-8 text-center hover:text-white flex justify-center items-center"
    >
      <PencilIcon className="w-4" />
    </Button>
  );
}
