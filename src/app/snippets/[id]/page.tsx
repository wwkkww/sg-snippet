import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/db";
import * as actions from '@/actions';

interface SnippetShowPageProps {
  params: {
    id: string;
  };
}

export default async function SnippetShowPage(props: SnippetShowPageProps) {
  const snippet = await db.snippets.findFirst({
    where: { id: Number(props.params.id) },
  });

  if(!snippet) {
    return notFound();
  }

  const deleteSnippetAction = actions.deleteSnippet.bind(null, snippet.id)

  return <div>
    <div className="flex m-4 justify-between items-center">
      <h1 className="text-xl font-bold">
        {snippet.title}
      </h1>
      <div>
        <Link className="p-2 border rounded" href={`/snippets/${snippet.id}/edit`}>Edit</Link>
        <form action={deleteSnippetAction}>
          <button className="p-2 border rounded">Delete</button>

        </form>
      </div>
    </div>
    <pre className="p-3 bg-gray-200 border rounded border-gray-200" >
      <code>{snippet.code}</code>
    </pre>
    </div>;
}
