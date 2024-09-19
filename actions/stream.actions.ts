"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient, UserRequest } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) {
    throw new Error("User is not logged in");
  }
  if (!apiKey) {
    throw new Error("No API key");
  }
  if (!apiSecret) {
    throw new Error("No API secret");
  }

  const client = new StreamClient(apiKey, apiSecret);

  const userId = user?.id;

  const newUser: UserRequest = {
    id: userId,
    role: "user",
    custom: {
      color: "red",
    },
    name: user?.username || user?.id,
    image: user?.imageUrl,
  };

  await client.upsertUsers([newUser]);

  const expirationTime = Math.floor(Date.now() / 1000) + 3600;
  const issuedAt = Math.floor(Date.now() / 1000) - 60;

  const token = client.generateUserToken({
    user_id: userId,
    exp: expirationTime,
    iat: issuedAt,
  });

  return token;
};
