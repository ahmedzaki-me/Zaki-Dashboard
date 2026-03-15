import { supabase } from "@/lib/supabase";

async function getAccessToken() {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
}

function getAvatarPath(url) {
  return decodeURIComponent(url.split("/public/avatars/")[1]?.split("?")[0]);
}

function buildFileName(name) {
  return `${name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "")}-${Date.now()}.webp`;
}

async function uploadAvatar(name, blob) {
  const fileName = buildFileName(name);
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, blob, {
      contentType: "image/webp",
      upsert: true,
    });

  if (uploadError) {
    return {
      url: null,
      error: `Image upload failed: ${uploadError.message}`,
    };
  }
  const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
  return { url: data.publicUrl, error: null };
}

async function deleteAvatar(imgUrl) {
  if (!imgUrl) return;

  const pathToFile = getAvatarPath(imgUrl);
  const { error } = await supabase.storage.from("avatars").remove([pathToFile]);

  if (error) {
    console.error("Error deleting avatar:", error.message);
  }
}

export async function insertEmployee(values) {
  let imageUrl = values.currentImageUrl;

  if (values.image instanceof Blob) {
    const { url, error } = await uploadAvatar(values.name, values.image);
    if (error) return { success: false, error };
    imageUrl = url;
  }

  const { data: authData, error } = await supabase.functions.invoke(
    "create-employee",
    {
      body: {
        email: values.email,
        password: values.password,
        name: values.name,
        role: values.role,
        avatar_url: imageUrl,
      },
      headers: { Authorization: `Bearer ${await getAccessToken()}` },
    },
  );
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, data: authData };
}

export async function deleteEmployee(userId, imgUrl) {
  const { data, error } = await supabase.functions.invoke("delete-user", {
    body: { userId },
    headers: { Authorization: `Bearer ${await getAccessToken()}` },
  });

  if (error) {
    return { success: false, error: error.message };
  }
  await deleteAvatar(imgUrl);
  return { success: true, data };
}

export async function updateEmployee(values, userId, imgUrl) {
  if (!userId) {
    return { success: false, error: "User ID is not defined" };
  }

  let imageUrl = values.currentImageUrl;
  let newImageUploaded = false;

  if (values.image instanceof Blob) {
    const { url, error: uploadError } = await uploadAvatar(
      values.name,
      values.image,
    );
    if (uploadError) return { success: false, error: uploadError };
    imageUrl = url;
    newImageUploaded = true;
  }

  const { data: authData, error } = await supabase.functions.invoke(
    "update-user",
    {
      body: {
        userId,
        email: values.email,
        password: values.password || undefined,
        name: values.name,
        role: values.role,
        avatar_url: imageUrl,
      },
      headers: { Authorization: `Bearer ${await getAccessToken()}` },
    },
  );

  if (error) {
    if (newImageUploaded) await deleteAvatar(imageUrl);
    return { success: false, error: error.message };
  }

  if (newImageUploaded) await deleteAvatar(imgUrl);

  return { success: true, data: authData };
}
