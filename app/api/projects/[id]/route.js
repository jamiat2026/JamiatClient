import { dbConnect } from "@/lib/dbConnect";
import Project from "@/lib/models/Project";

import { corsHeaders } from "../../../layout";

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// OPTIONS handler (for preflight requests)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(req, props) {
  const { params } = await props;
  const { id } = await params;
  await dbConnect();

  const project = await Project.findById(id);
  if (!project) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: corsHeaders,
    });
  }

  return new Response(JSON.stringify(project), {
    status: 200,
    headers: corsHeaders,
  });
}

export async function PUT(req, props) {
  const { params } = await props;
  const { id } = await params;
  await dbConnect();

  const body = await req.json();
  if (body && Object.prototype.hasOwnProperty.call(body, "slug")) {
    if (!body.slug || !String(body.slug).trim()) {
      const existing = await Project.findById(id).select("title");
      const baseTitle = body.title || existing?.title;
      if (!baseTitle) {
        return new Response(JSON.stringify({ error: "Title is required" }), {
          status: 400,
          headers: corsHeaders,
        });
      }
      let slug = generateSlug(baseTitle);
      let slugSuffix = 1;
      while (await Project.findOne({ slug, _id: { $ne: id } })) {
        slug = `${generateSlug(baseTitle)}-${slugSuffix}`;
        slugSuffix++;
      }
      body.slug = slug;
    }
  }

  const updatedProject = await Project.findByIdAndUpdate(id, body, {
    new: true,
  });

  return new Response(JSON.stringify(updatedProject), {
    status: 200,
    headers: corsHeaders,
  });
}

export async function DELETE(req, props) {
  const { params } = await props;
  const { id } = await params;
  await dbConnect();

  await Project.findByIdAndDelete(id);

  return new Response(JSON.stringify({ message: "Project deleted" }), {
    status: 200,
    headers: corsHeaders,
  });
}
