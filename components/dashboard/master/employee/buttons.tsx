import { PencilIcon, PlusIcon, } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreateEmployee() {
  return (
    <Link
      href="/dashboard/master/employees/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Employee</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateEmployee({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/master/employees/edit/${id}`}
      className=" text-blue-600 rounded-md border p-2 hover:bg-gray-800"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
