"use server";

import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";

export async function editSnippet(id: number, code: string) {
  await db.snippets.update({
    where: { id },
    data: { code },
  });

  redirect(`/snippets/${id}`);
}

export async function deleteSnippet(id: number) {
  await db.snippets.delete({
    where: { id },
  });

  revalidatePath("/");
  redirect("/");
}

export async function createSnippet(formState: { message: string }, formData: FormData) {
  try {
    // get input
    const title = formData.get("title");
    const code = formData.get("code");

    if (typeof title !== "string" || title.length < 3) {
      return { message: "Title must be longer" };
    }
    if (typeof code !== "string" || code.length < 10) {
      return { message: "Code must be longer" };
    }

    // create record
    await db.snippets.create({
      data: {
        title,
        code,
      },
    });
    // throw new Error("Failed to save to database");
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        message: error.message,
      };
    } else {
      return {
        message: "Something went wrong...",
      };
    }
  }

  revalidatePath("/");
  // redirect back to root route
  redirect("/");
}
