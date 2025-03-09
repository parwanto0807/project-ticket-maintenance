
import { db } from "@/lib/db";
import { unstable_noStore as no_store } from "next/cache";
// const ITEMS_PER_PAGE = 10;
const ITEMS_PER_PAGE_EMPLOYEES = 15;

export async function getEmployeesFindWithId (id: string) {
    no_store()
    try {
        const employeesFindWithID = await db.employee.findUnique({
            select: {
                id: true,
                name: true,
                email: true,
                emailCorporate: true,
                address: true,
                picture: true,
                userDept:true,
            }, 
            where: { id }
        });
        return employeesFindWithID;
    } catch (error) {
        return { message: "Filed get data Employee", error }
    }
};

export async function getEmployeesFindAll (query: string, currentPage: number) {
    no_store();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE_EMPLOYEES;

    try {
        const employeesFindAll = await db.employee.findMany({
            skip: offset,
            take: ITEMS_PER_PAGE_EMPLOYEES,
            include: {
                department: true
            },
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: 'insensitive',
                        }
                    },
                    {
                        email: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    },
                    {
                        address: {
                            contains: query, 
                            mode: 'insensitive'
                        }
                    },
                    {
                        department:{
                            dept_name:{
                                contains: query,
                                mode: 'insensitive'
                            }
                        }
                    }

                ]
            },
            orderBy: {
                updatedAt: "desc"
            }
        });
        return employeesFindAll;
    } catch  {
        console.error('Error Fetching Employee')
        throw new Error ('Filed to Fetching Employee')
    }
};
export async function getEmployeesFindData () {
    no_store();
    try {
        const employeesFindData = await db.employee.findMany({
            include: {
                department: true
            },
        
            orderBy: {
                name: "asc"
            }
        });
        return employeesFindData;
    } catch  {
        console.error('Error Fetching Employee')
        throw new Error ('Filed to Fetching Employee')
    }
};

export async function getEmployeesPages (query: string) {
    no_store();
    try {
        const employeesFindPages = await db.employee.count({
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: 'insensitive',
                        }
                    },
                    {
                        email: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    },
                    {
                        address: {
                            contains: query, 
                            mode: 'insensitive'
                        }
                    },
                ]
            },
            orderBy: {
                updatedAt: "asc"
            }
        });
        const totalPagesEmployee = Math.ceil(Number(employeesFindPages) / ITEMS_PER_PAGE_EMPLOYEES)
        return totalPagesEmployee;
    } catch  {
        console.error('Error Fetching Employee')
        throw new Error ('Filed to Fetching Employee')
    }
};

export const getDeptFindAll = async () => {
    try {
        const deptFindAll = await db.department.findMany({
            orderBy: {
                dept_name: "asc"
            }
        });
        return deptFindAll;
    } catch  {
        return { error: "Filed load data department" }
    }
}

export const getDeptById = async (dept_name: string) => {
    no_store()
    try {
        const deptFindById = await db.department.findUnique({
            where: {
                id: (dept_name)
            }
        });
        return deptFindById
    } catch {
        return {error:"Filed get data department by id"}
    }
}