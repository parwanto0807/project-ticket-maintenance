"use server"

import * as z from "zod";
import { db } from "@/lib/db";

import { revalidatePath } from "next/cache";
import { EmployeeSchema, DeptSchema } from "@/schemas";
import { getDeptById } from "@/data/master/employee";

export const deleteEmployee = async(id: string)=> {
    try {
       const deleteEmployee = await db.employee.delete({
            where:{
                id
            }
        });
        revalidatePath('/dahsboard/master/employees')
        return {success:"Deleted employee successfull"}
    } catch (error) {
        return { error:"Filed deleted employee"}
    }
}

export const updateEmployee = async (id: string, values: z.infer<typeof EmployeeSchema>) => {

    const validatedFields = EmployeeSchema.safeParse(values);
    const now = new Date()

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        console.error("Validation Error", errors)
        return {
            Error: errors
        }
    }
    try {
        //console.log("Creating Employee with values:", validatedFields.data);
        await db.employee.update({
            data: {
                name: validatedFields.data.name,
                email: validatedFields.data.email,
                address: validatedFields.data.address,
                picture: validatedFields.data.picture,
                userDept: validatedFields.data.userDept,
                updatedAt: now,
            }, 
            where: { id }
        });

        revalidatePath("/dashboard/master/employees")
        return { success: "Succescfully updated employee data" }
    } catch (error) {
        return { error: " Filed updated employee data" }
    }
};

export const createEmployee = async (values: z.infer<typeof EmployeeSchema>) => {

    const validatedFields = EmployeeSchema.safeParse(values);
    const now = new Date()

    if (!validatedFields.success) {
        const errors = validatedFields.error.flatten().fieldErrors;
        console.error("Validation Error", errors)
        return {
            Error: errors
        }
    }
    try {
        //console.log("Creating Employee with values:", validatedFields.data);
        await db.employee.create({
            data: {
                name: validatedFields.data.name,
                email: validatedFields.data.email,
                address: validatedFields.data.address,
                picture: validatedFields.data.picture,
                userDept: validatedFields.data.userDept,
                createdAt: now,
                updatedAt: now,
            }
        });
        revalidatePath("/dashboard/master/employees")
        return { success: "Succescfully created employee data" }
    } catch (error) {
        return { error: " Filed created employee data" }
    }
};

export const createDept = async (values: z.infer<typeof DeptSchema>) => {
    const validatedFieldDept = DeptSchema.safeParse(values)
    const now = new Date()

    if (!validatedFieldDept.success) {
        //const errors = validatedField.error.flatten().fieldErrors
        return {
            error: "Invalid Credentials"
        }
    }

    const {
        dept_name,
        note
    } = validatedFieldDept.data;

    const existingDept = await getDeptById(dept_name);
    if (existingDept) {
        return { error: `Department ${validatedFieldDept.data.dept_name} already in use` }
    }

    try {
        await db.department.create({
            data: {
                dept_name: validatedFieldDept.data.dept_name,
                note: validatedFieldDept.data.note,
                createdAt: now,
                updatedAt: now
            }
        })
        revalidatePath('/dashboard/master/employees/create')
        return { success: "Succesfully created department" };
    } catch (error) {
        return { error: "Filed created department" }
    }
}

export const deleteDept = async (id: string) => {
    try {
        await db.department.delete({
            where: {
                id: (id)
            }
        })
    } catch (error) {
        return { error: "Filed deleted department" }
    }
}