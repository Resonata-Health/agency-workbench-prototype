/**
 * Mock data for the Setup wizard's Contacts step (step 3).
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

export interface SetupSite {
  id: string
  siteName: string
  location: string
  enroller: string
  availability: 'Available' | 'Not Yet Available'
  selected: boolean
}

export const DEFAULT_SITES: SetupSite[] = [
  {
    id: 'mayo-rochester',
    siteName: 'Mayo Clinic - Rochester',
    location: 'Rochester, MN',
    enroller: 'Dr. Sarah Johnson',
    availability: 'Available',
    selected: true
  },
  {
    id: 'cleveland-main',
    siteName: 'Cleveland Clinic - Main Campus',
    location: 'Cleveland, OH',
    enroller: 'Dr. David Martinez',
    availability: 'Available',
    selected: true
  },
  {
    id: 'md-anderson',
    siteName: 'MD Anderson Cancer Center',
    location: 'Houston, TX',
    enroller: 'Dr. Amanda Foster',
    availability: 'Not Yet Available',
    selected: false
  }
]
