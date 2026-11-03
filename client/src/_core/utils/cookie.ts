// "use server";

import { cookies } from "next/headers";

export const setCookie = async (
    name : string,
    value : string,
    maxAgeInSeconds : number,
) => {
    const cookieStore = await cookies();

    cookieStore.set(name, value, {
        httpOnly : true, 
        secure : process.env.NODE_ENV === "production", 
        sameSite : "lax",
        path : "/",
        maxAge : maxAgeInSeconds,
    })
}

export const getCookie = async (name : string) => {
    const cookieStore = await cookies();
    return cookieStore.get(name)?.value;
}

export const deleteCookie = async (name : string) => {
    const cookieStore = await cookies();
    cookieStore.delete(name);
}

export const forwardSetCookies = async (setCookieHeaders?: string[]) => {
  if (!setCookieHeaders?.length) return;
  const cookieStore = await cookies();

  for (const raw of setCookieHeaders) {
    const [pair, ...attrs] = raw.split(";").map((s) => s.trim());
    const eq = pair.indexOf("=");          
    if (eq <= 0) continue;
    const name = pair.slice(0, eq);
    const value = pair.slice(eq + 1);
    const maxAgeAttr = attrs.find((a) => a.toLowerCase().startsWith("max-age="));
    const maxAge = maxAgeAttr ? Number(maxAgeAttr.split("=")[1]) : undefined;

    cookieStore.set(name, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      ...(maxAge ? { maxAge } : {}),
    });
  }
};