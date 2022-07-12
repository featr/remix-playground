import type { Joke } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export default function JokeRoute() {
  const data = useLoaderData<LoaderData>();
  console.log("data", data);
  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data.joke.content}</p>
    </div>
  );
}

type LoaderData = { joke: Joke };

export const loader: LoaderFunction = async ({ params }) => {
  console.log("params", params);
  const joke: Joke | null = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) throw new Error("Joke not found");
  const data: LoaderData = { joke };
  return json(data);
};
