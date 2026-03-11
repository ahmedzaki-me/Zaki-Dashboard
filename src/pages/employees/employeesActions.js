import { supabase } from "@/lib/supabase";

export async function insertEmployee(values) {
  let imageUrl = values.currentImageUrl;
  if (values.image instanceof Blob) {
    const fileName = `${values.name.trim().replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.webp`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(`${fileName}`, values.image, {
        contentType: "image/webp",
        upsert: true,
      });
    if (uploadError) {
      console.error("Storage Error:", uploadError.message);
      return {
        success: false,
        error: `فشل رفع الصورة: ${uploadError.message}`,
      };
    }
    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(`${fileName}`);
    imageUrl = data.publicUrl;
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
      headers: {
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      },
    },
  );

  if (error) {
    console.error("Error Sign Up:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data: authData };
}
export async function deleteEmployee(userId, imgUrl) {
  if (imgUrl) {
    const getPathFromUrl = (url) => {
      const parts = url.split("/public/avatars/");
      return parts[1];
    };
    const pathToFile = getPathFromUrl(imgUrl);
    const { imgData, imgError } = await supabase.storage
      .from("avatars")
      .remove([pathToFile]);
    if (imgError) {
      console.error("Error deleting item image: ", imgError.message);
    } else {
      console.log("item image is deleted: ", imgData);
    }
  }

  const { data, error } = await supabase.functions.invoke("delete-user", {
    body: { userId },
    headers: {
      Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
    },
  });

  if (error) {
    console.error("Delete Error:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function updateEmployee(values, userId, imgUrl) {
  if (!userId) {
    return { success: false, error: "user Id Is Not Defind" };
  }

  let imageUrl = values.currentImageUrl;

  if (values.image instanceof Blob) {
    if (imgUrl) {
      console.log(imgUrl);
      const getPathFromUrl = (url) => {
        const parts = url.split("/public/avatars/");
        console.log("2. parts بعد الـ split:", parts);
        return decodeURIComponent(parts[1]?.split("?")[0]);
      };
      const pathToFile = getPathFromUrl(imgUrl);
      console.log(pathToFile);

      const { data: imgData, error: imgError } = await supabase.storage
        .from("avatars")
        .remove([pathToFile]);
      // .select();
      // if (imgError) {
      //   console.error("Error deleting item image: ", imgError.message);
      // } else {
      //   console.log("item image is deleted: ", imgData);
      // }
      console.log("4. imgData:", imgData);
      console.log("5. imgError:", imgError);
    }

    const fileName = `${values.name.trim().replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.webp`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(`${fileName}`, values.image, {
        contentType: "image/webp",
        upsert: true,
      });
    if (uploadError) {
      console.error("Storage Error:", uploadError.message);
      return {
        success: false,
        error: `فشل رفع الصورة: ${uploadError.message}`,
      };
    }
    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(`${fileName}`);
    imageUrl = data.publicUrl;
  }

  const { data: authData, error } = await supabase.functions.invoke(
    "update-user",
    {
      body: {
        userId: userId,
        email: values.email,
        password: values.password || undefined,
        name: values.name,
        role: values.role,
        avatar_url: imageUrl,
      },
      headers: {
        Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
      },
    },
  );

  if (error) {
    console.error("Error Sign Up:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data: authData };
}
