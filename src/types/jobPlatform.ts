export type WorkplaceType = 'Remote' | 'Hybrid' | 'Onsite';
export type JobType = 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
export type ExperienceLevel = 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
export type EmploymentStatus = 'Current' | 'Former';
export type BusinessOutlook = 'Positive' | 'Neutral' | 'Negative';
export type InterviewExperience = 'Positive' | 'Neutral' | 'Negative';
export type OfferOutcome = 'Accepted' | 'Declined' | 'No Offer' | 'Pending';
export type BenefitCategory =
  | 'Health & Wellness'
  | 'Financial & Retirement'
  | 'Work Flexibility'
  | 'Time Off'
  | 'Professional Growth';

export interface CeoInfo {
  name: string;
  title: string;
  photoUrl: string;
  approvalRate: number; // 0 to 100 percentage
  totalRatings: number;
}

export interface CultureScores {
  cultureAndValues: number; // 1.0 to 5.0
  workLifeBalance: number;
  seniorLeadership: number;
  compAndBenefits: number;
  careerOpportunities: number;
  diversityInclusion: number;
}

export interface Company {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  bannerUrl: string;
  industry: string;
  headquarters: string;
  employeeCount: string;
  foundedYear: number;
  website: string;
  rating: number; // 1.0 to 5.0
  reviewCount: number;
  ceo: CeoInfo;
  recommendToFriendRate: number; // percentage
  businessOutlookRate: number; // percentage
  cultureScores: CultureScores;
  techStack: string[];
  perks: string[];
  verified: boolean;
  about: string;
  officeLocations: string[];
  openRolesCount: number;
}

export interface ReviewResponse {
  author: string;
  title: string;
  comment: string;
  date: string;
}

export interface Review {
  id: string;
  companyId: string;
  companyName: string;
  rating: number; // 1.0 to 5.0
  subRatings?: Partial<CultureScores>;
  title: string;
  pros: string;
  cons: string;
  adviceToManagement?: string;
  authorRole: string;
  employmentStatus: EmploymentStatus;
  yearsAtCompany: string;
  recommends: boolean;
  ceoApproval: boolean;
  businessOutlook: BusinessOutlook;
  helpfulCount: number;
  createdAt: string;
  verifiedEmployee: boolean;
  employerResponse?: ReviewResponse;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  type: 'Behavioral' | 'Technical' | 'System Design' | 'Take-Home' | 'Culture Fit';
  helpfulCount: number;
  answersCount: number;
}

export interface Interview {
  id: string;
  companyId: string;
  companyName: string;
  jobTitle: string;
  department: string;
  difficulty: number; // 1.0 (Very Easy) to 5.0 (Very Hard)
  experience: InterviewExperience;
  offerOutcome: OfferOutcome;
  processLength: string; // e.g. "2 weeks", "1 month"
  applicationSource: 'Online Application' | 'Recruiter Reachout' | 'Employee Referral' | 'Campus' | 'Agency';
  stages: string[]; // e.g. ["Recruiter Screen", "Coding Challenge", "System Design", "Onsite Panel"]
  questions: InterviewQuestion[];
  advice: string;
  helpfulCount: number;
  createdAt: string;
}

export interface SalaryReport {
  id: string;
  companyId: string;
  companyName: string;
  jobTitle: string;
  department: string;
  level: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Staff/Principal' | 'Director';
  baseSalary: number;
  bonus: number;
  equity: number;
  totalComp: number;
  yearsOfExperience: number;
  location: string;
  currency: 'EUR' | 'USD';
  verified: boolean;
  createdAt: string;
}

export interface BenefitComment {
  author: string;
  comment: string;
  rating: number;
  date: string;
}

export interface CompanyBenefit {
  id: string;
  companyId: string;
  category: BenefitCategory;
  name: string;
  rating: number; // 1.0 to 5.0
  ratingCount: number;
  description: string;
  comments: BenefitComment[];
}

export interface Job {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  companyRating: number;
  title: string;
  department: string;
  location: string;
  workplaceType: WorkplaceType;
  type: JobType;
  experienceLevel: ExperienceLevel;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  perks: string[];
  easyApply: boolean;
  applicantCount: number;
  responseSLA: string; // e.g., "Typically responds within 24h"
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'closed';
  featured?: boolean;
}

export interface DiscussionReply {
  id: string;
  authorAnonTag: string;
  authorRole?: string;
  content: string;
  createdAt: string;
  upvotes: number;
}

export interface DiscussionPost {
  id: string;
  companyId?: string;
  companyName?: string;
  category: 'Workplace Talk' | 'Interview Prep' | 'Salary & Negotiations' | 'Career Advice' | 'Company Culture';
  title: string;
  content: string;
  authorAnonTag: string;
  authorRole?: string;
  isVerifiedEmployee?: boolean;
  upvotes: number;
  replyCount: number;
  replies: DiscussionReply[];
  createdAt: string;
}

export interface CandidateApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string;
  resumeUrl?: string;
  coverNote?: string;
  skillsMatched: string[];
  skillsMissing: string[];
  matchScore: number; // 0 - 100 %
  status: 'Applied' | 'Reviewing' | 'Interviewing' | 'Offered' | 'Rejected';
  appliedAt: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  title: string;
  bio: string;
  location: string;
  experienceYears: number;
  targetSalary: number;
  preferredWorkplace: WorkplaceType;
  skills: string[];
  savedJobIds: string[];
  appliedJobIds: string[];
}
