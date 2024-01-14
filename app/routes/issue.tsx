import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { z } from "zod";
import { prisma } from "~/db.server";

const IssueSchema = z.object({
  id: z.number(),
  draftId: z.string(),
  title: z.string(),
  description: z.string(),
});

const IssueListSchema = z.array(IssueSchema);

type Issue = z.infer<typeof IssueSchema>;
type IssueList = z.infer<typeof IssueListSchema>;

const InsertIssueSchema = z.object({
  draftId: z.string(),
  title: z.string(),
  description: z.string(),
});

function IssueList({ issues }: { issues: IssueList }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {issues.map((issue) => (
        <div
          key={issue.id}
          className="flex flex-col gap-2 border p-4 rounded-md bg-amber-50"
        >
          <h2>{issue.title}</h2>
          <p>{issue.description}</p>
          <p>{issue.draftId}</p>
        </div>
      ))}
    </div>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  const newIssue = InsertIssueSchema.parse(data);
  try {
    await prisma.issue.create({ data: newIssue });
  } catch (e) {
    console.log(e);
    return json({ message: "Error" }, { status: 500 });
  }
  return redirect("/issue");
};

export async function loader() {
  const data = await prisma.issue.findMany();
  const issues = IssueListSchema.parse(data);
  return json({ issues });
}

export default function Issue() {
  const { issues } = useLoaderData<typeof loader>();
  const error = useActionData<typeof action>();
  return (
    <div className="p-10 flex flex-col gap-10">
      <h1 className="text-3xl font-medium">Add a new issue</h1>
      <Form method="POST" className="flex flex-col gap-2">
        <div>Draft id</div>
        <input
          type="text"
          name="draftId"
          className="border border-neutral-300 rounded-md p-2"
        />
        <div>Title</div>
        <input
          type="text"
          name="title"
          className="border border-neutral-300 rounded-md p-2"
        />
        <div>Description</div>
        <input
          type="description"
          name="description"
          className="border border-neutral-300 rounded-md p-2"
        />
        <button
          type="submit"
          value="Submit"
          className="p-3 bg-amber-400 rounded-md text-sm font-medium"
        >
          Aggiungi
        </button>
        {error && <div className="text-red-500">{error.message}</div>}
      </Form>
      <IssueList issues={issues} />
    </div>
  );
}
