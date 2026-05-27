import { SignJWT } from "jose";

const generateToken = async (id: number | string) => {
  const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_key",
  );
  const token = await new SignJWT({ id })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secretKey);
  return token;
};

export default generateToken;
