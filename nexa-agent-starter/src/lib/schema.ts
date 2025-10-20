export type Id = string;

export type Contact = {
  id?: Id;
  name: string;
  email: string;
  phone?: string;
  orgId?: Id;
  notes?: string;
};

export type Org = {
  id?: Id;
  name: string;
  domain?: string;
  primaryContactId?: Id;
  notes?: string;
};

export type Enquiry = {
  id?: Id;
  subject: string;
  bodySnippet?: string;
  receivedAt?: string;
  source: "Email" | "Webform" | "Other";
  contactId?: Id;
  orgId?: Id;
  decision?: "To Proposal" | "To Discovery" | "Undecided";
  status?: "ENQUIRY_CAPTURED" | "ROUTE_DECISION" | "CLOSED";
  gmailThreadId?: string;
};
