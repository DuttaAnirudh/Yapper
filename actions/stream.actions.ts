"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient, UserRequest } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiScret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) {
    throw new Error("User is not logged in");
  }
  if (!apiKey) {
    throw new Error("No API key");
  }
  if (!apiScret) {
    throw new Error("No API secret");
  }

  const client = new StreamClient(apiKey, apiScret);

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

  // validity is optional (by default the token is valid for an hour)
  const validity = 60 * 60 * 24;

  const token = client.generateUserToken({
    user_id: userId,
    validity_in_seconds: validity,
  });

  return token;
};
