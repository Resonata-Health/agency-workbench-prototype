/**
 * Mock data for the Setup wizard's Locations step (step 3).
 *
 * Contacts shown when a site is picked are fabricated (firstname.lastname@<org-domain>)
 * so no real personal data lives in the prototype. Site records are institutional.
 */

export interface SetupContact {
  id: string
  name: string
  department: string
  phone: string
  email: string
}

export const CONTACTS: SetupContact[] = [
  {
    id: 'rosalind-mendez',
    name: 'Dr. Rosalind Mendez',
    department: 'Janssen Medical Affairs',
    phone: '(292) 555-5951',
    email: 'rosalind_mendez@janssen.com'
  },
  {
    id: 'aiden-rao',
    name: 'Dr. Aiden Rao',
    department: 'Janssen Clinical Operations',
    phone: '(292) 555-1077',
    email: 'aiden_rao@janssen.com'
  },
  {
    id: 'priya-shah',
    name: 'Priya Shah',
    department: 'Janssen Regulatory',
    phone: '(292) 555-4019',
    email: 'priya_shah@janssen.com'
  }
]

/* ---------- Sites + site contacts (powers the Add Site typeahead) ---------- */

export interface SiteRecord {
  id: string
  name: string
  state: string
  city: string
  zip: string
  synonyms?: string
  domain: string
}

export interface SiteContact {
  id: string
  firstName: string
  lastName: string
  org: string
  email: string
  phone: string
  status: string
}

export const SITES: SiteRecord[] = [
  { id: '170040', name: 'University of Kansas Medical Center', state: 'KS', city: 'Kansas City', zip: '66101', domain: 'kumc.com' },
  { id: '220071', name: 'Massachusetts General Hospital',      state: 'MA', city: 'Boston',      zip: '02114', synonyms: 'MGH', domain: 'massgeneral.com' },
  { id: '210009', name: 'Johns Hopkins Hospital',              state: 'MD', city: 'Baltimore',   zip: '21287', synonyms: 'JHH', domain: 'hopkins.com' },
  { id: '240010', name: 'Mayo Clinic - Rochester',             state: 'MN', city: 'Rochester',   zip: '55905', domain: 'mayo.com' },
  { id: '360180', name: 'Cleveland Clinic - Main Campus',      state: 'OH', city: 'Cleveland',   zip: '44195', synonyms: 'CCF', domain: 'clevelandclinic.com' }
]

export const SITE_CONTACTS: SiteContact[] = [
  // University of Kansas Medical Center
  { id: 'kumc-1', firstName: 'Maria',  lastName: 'Alvarez', org: 'University of Kansas Medical Center', email: 'maria.alvarez@kumc.com', phone: '913-588-2817', status: 'Approved' },
  { id: 'kumc-2', firstName: 'James',  lastName: 'Porter',  org: 'University of Kansas Medical Center', email: 'james.porter@kumc.com',  phone: '913-226-6009', status: 'Approved' },
  { id: 'kumc-3', firstName: 'Susan',  lastName: 'Kim',     org: 'University of Kansas Medical Center', email: 'susan.kim@kumc.com',     phone: '913-945-9934', status: 'Approved' },
  { id: 'kumc-4', firstName: 'David',  lastName: 'Nguyen',  org: 'University of Kansas Medical Center', email: 'david.nguyen@kumc.com',  phone: '913-945-9926', status: 'Approved' },
  { id: 'kumc-5', firstName: 'Rachel', lastName: 'Foster',  org: 'University of Kansas Medical Center', email: 'rachel.foster@kumc.com', phone: '913-588-2271', status: 'Approved' },
  { id: 'kumc-6', firstName: 'Brian',  lastName: 'Walsh',   org: 'University of Kansas Medical Center', email: 'brian.walsh@kumc.com',   phone: '913-945-9937', status: 'Approved' },
  // Massachusetts General Hospital
  { id: 'mgh-1', firstName: 'Olivia', lastName: 'Bennett', org: 'Massachusetts General Hospital', email: 'olivia.bennett@massgeneral.com', phone: '617-555-0142', status: 'Approved' },
  { id: 'mgh-2', firstName: 'Daniel', lastName: 'Cho',     org: 'Massachusetts General Hospital', email: 'daniel.cho@massgeneral.com',     phone: '617-555-0198', status: 'Approved' },
  // Johns Hopkins Hospital
  { id: 'jhh-1', firstName: 'Emily',  lastName: 'Tran',  org: 'Johns Hopkins Hospital', email: 'emily.tran@hopkins.com',  phone: '410-555-0123', status: 'Approved' },
  { id: 'jhh-2', firstName: 'Marcus', lastName: 'Reed',  org: 'Johns Hopkins Hospital', email: 'marcus.reed@hopkins.com', phone: '410-555-0177', status: 'Approved' },
  // Mayo Clinic - Rochester
  { id: 'mayo-1', firstName: 'Sarah', lastName: 'Johnson', org: 'Mayo Clinic - Rochester', email: 'sarah.johnson@mayo.com', phone: '507-555-0110', status: 'Approved' },
  { id: 'mayo-2', firstName: 'Aaron', lastName: 'Levine',  org: 'Mayo Clinic - Rochester', email: 'aaron.levine@mayo.com',  phone: '507-555-0156', status: 'Approved' },
  // Cleveland Clinic
  { id: 'ccf-1', firstName: 'David', lastName: 'Martinez', org: 'Cleveland Clinic - Main Campus', email: 'david.martinez@clevelandclinic.com', phone: '216-555-0133', status: 'Approved' }
]

/* ---------- Table rows (one row = a contact at a site) ---------- */

export interface SetupSite {
  id: string
  siteId: string
  siteName: string
  location: string
  enroller: string
  email: string
  phone: string
  status: string
  selected: boolean
}

export const DEFAULT_SITES: SetupSite[] = [
  {
    id: 'row-kumc-1',
    siteId: '170040',
    siteName: 'University of Kansas Medical Center',
    location: 'Kansas City, KS',
    enroller: 'Maria Alvarez',
    email: 'maria.alvarez@kumc.com',
    phone: '913-588-2817',
    status: 'Approved',
    selected: true
  },
  {
    id: 'row-kumc-2',
    siteId: '170040',
    siteName: 'University of Kansas Medical Center',
    location: 'Kansas City, KS',
    enroller: 'James Porter',
    email: 'james.porter@kumc.com',
    phone: '913-226-6009',
    status: 'Approved',
    selected: true
  }
]
