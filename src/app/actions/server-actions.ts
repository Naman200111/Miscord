"use server";

import { UTApi } from "uploadthing/server";

export async function deleteImage(imageUrl: string) {
  const utapi = new UTApi();
  await utapi.deleteFiles([imageUrl]);
}
