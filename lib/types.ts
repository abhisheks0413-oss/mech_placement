export type OpportunityType = "Internship" | "Placement";

export type Opportunity = {
  id: number;
  type: OpportunityType;
  status: OpportunityStatus;
  company: string;
  description: string;
  applicationLink: string;
  applicationLinks: NamedLink[];
  deadline: string;
  compensation: CompensationOffer[];
  documents: NamedDocument[];
  logo?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NamedLink = {
  name: string;
  url: string;
};

export type NamedDocument = {
  name: string;
  url: string;
};

export type CompensationOffer = {
  label: string;
  amount: number;
};

export type OpportunityStatus = "Applications Open" | "Applications Closed";

export type OpportunityUpdate = {
  id: number;
  opportunityId: number;
  message: string;
  createdAt: string;
};

export type PlacementStat = {
  id: number;
  company: string;
  package: number | null;
  placementMode: PlacementMode;
  years: number[];
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PlacementMode = "On Campus" | "Off Campus";

export type AlumniInsight = {
  id: number;
  name: string;
  company: string;
  passoutYear: number;
  position: string;
  placementMode: PlacementMode;
  ctc: number | null;
  review: string;
  createdAt: string;
  updatedAt: string;
};

export type AdminSummary = {
  totalOpportunities: number;
  totalCompanies: number;
  totalAlumni: number;
};

