import { corsHeaders } from "../../layout";

export async function GET() {
  const donationTypes = [
    { type: "Hadiya", isEnabled: false },
    { type: "Zakat", isEnabled: false },
    { type: "Sadqa", isEnabled: false },
    { type: "others(general donations & interest income)", isEnabled: false },
  ];

  return new Response(JSON.stringify(donationTypes), {
    status: 200,
    headers: corsHeaders,
  });
}

// OPTIONS handler (for preflight requests)
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
