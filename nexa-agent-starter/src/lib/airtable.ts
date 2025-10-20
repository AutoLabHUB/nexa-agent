const API = "https://api.airtable.com/v0";
const BASE = process.env.AIRTABLE_BASE_ID!;
const HEADERS: Record<string,string> = {
  "Authorization": `Bearer ${process.env.AIRTABLE_TOKEN}`,
  "Content-Type": "application/json"
};

export type AirtableRecord<T> = { id: string; fields: T; createdTime?: string };

async function atFetch(path: string, init?: RequestInit){
  const res = await fetch(`${API}/${BASE}/${path}`, { ...init, headers: HEADERS });
  if (!res.ok) throw new Error(`Airtable ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function findByField<T>(table: string, field: string, value: string){
  const filter = encodeURIComponent(`{${field}} = '${value.replace(/'/g, "\'")}'`);
  const data = await atFetch(`${encodeURIComponent(table)}?filterByFormula=${filter}`);
  return (data.records || []) as AirtableRecord<T>[];
}

export async function create<T>(table: string, fields: any){
  const body = JSON.stringify({ records: [{ fields }], typecast: true });
  const data = await atFetch(encodeURIComponent(table), { method: "POST", body });
  return (data.records?.[0]) as AirtableRecord<T>;
}

export async function update<T>(table: string, id: string, fields: any){
  const body = JSON.stringify({ records: [{ id, fields }], typecast: true });
  const data = await atFetch(encodeURIComponent(table), { method: "PATCH", body });
  return (data.records?.[0]) as AirtableRecord<T>;
}

export async function upsertByEmail(tableContacts: string, contact: { name: string; email: string; phone?: string }){
  const existing = await findByField<any>(tableContacts, "Email", contact.email);
  if (existing[0]){
    return update(tableContacts, existing[0].id, {
      "Contact Name": contact.name,
      "Email": contact.email,
      "Phone": contact.phone || ""
    });
  }
  return create(tableContacts, {
    "Contact Name": contact.name, "Email": contact.email, "Phone": contact.phone || ""
  });
}
