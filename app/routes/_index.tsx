import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="p-4 flex flex-col gap-2">
      <h2 className="text-md font-bold">Navigation menu</h2>
      <Link to="issue" className="hover:underline">
        Issue
      </Link>
    </div>
  );
}
