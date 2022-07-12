import type { Joke } from "@prisma/client";
import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export default function JokesIndexRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.randomJoke.id}>"{data.randomJoke.name}" Permalink</Link>
    </div>
  );
}

type LoaderData = { randomJoke: Pick<Joke, "content" | "id" | "name"> };

export const loader: LoaderFunction = async ({ params }) => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
    select: {
      id: true,
      name: true,
      content: true,
    },
  });
  const data: LoaderData = { randomJoke };
  return json(data);
};
