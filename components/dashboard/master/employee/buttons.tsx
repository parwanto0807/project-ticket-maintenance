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

export function UpdateEmployee({ id, className }: { id: string; className?: string }) {
  return (
    <Link
      href={`/dashboard/master/employees/edit/${id}`}
      className={`inline-flex items-center justify-center rounded-lg border border-blue-200 bg-blue-50/50 p-2 text-blue-600 transition-all duration-200 hover:bg-blue-600 hover:text-white dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-600 dark:hover:text-white ${className}`}
    >
      <PencilIcon className="w-4 h-4" />
    </Link>
  );
}
