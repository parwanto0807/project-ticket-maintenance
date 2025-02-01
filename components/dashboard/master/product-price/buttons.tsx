
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreatePrice() {
  return (
    <Link
      href="/dashboard/master/price-product/create"
      className="flex h-8 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Price Product</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}
export function UpdatePrice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/master/price-product/edit/${id}`}
      className=" text-blue-600 rounded-md border p-2 hover:bg-gray-800 h-8 text-center justify-center"
    >
      <PencilIcon className="w-4" />
    </Link>
  );
}