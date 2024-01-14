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
    <div>
      {issues.map((issue) => (
        <div key={issue.id}>
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
    <div>
      <IssueList issues={issues} />
      {error && <div>{error.message}</div>}
      <Form method="POST">
        <div>Draft id</div>
        <input type="text" name="draftId" />
        <div>Title</div>
        <input type="text" name="title" />
        <div>Description</div>
        <input type="description" name="description" />
        <button type="submit" value="Submit">
          Aggiungi
        </button>
      </Form>
    </div>
  );
}
