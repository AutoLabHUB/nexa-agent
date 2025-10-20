export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: 'ui-sans-serif, system-ui' }}>
      <h1>Nex‑a Agent</h1>
      <p>API is live. Use the endpoints to log enquiries, create proposals and discovery,
         and call /api/agent/run from Airtable automations.</p>
      <ul>
        <li>POST /api/intake/enquiry</li>
        <li>POST /api/proposals</li>
        <li>POST /api/proposals/[id]/approve</li>
        <li>POST /api/discovery</li>
        <li>POST /api/contracts/create</li>
        <li>POST /api/webhooks/acrobat</li>
        <li>POST /api/agent/run</li>
        <li>POST /api/tools/notify/email</li>
        <li>POST /api/tools/notify/slack</li>
      </ul>
    </main>
  );
}
