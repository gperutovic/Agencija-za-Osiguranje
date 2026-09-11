import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { JobNavbar } from './components/layout/JobNavbar';
import { JobFooter } from './components/layout/JobFooter';
import { JobsListPage } from './pages/job/JobsListPage';
import { JobDetailPage } from './pages/job/JobDetailPage';
import { CompaniesListPage } from './pages/job/CompaniesListPage';
import { CompanyDetailPage } from './pages/job/CompanyDetailPage';
import { SalariesExplorerPage } from './pages/job/SalariesExplorerPage';
import { InterviewsDatabasePage } from './pages/job/InterviewsDatabasePage';
import { CommunityTalkPage } from './pages/job/CommunityTalkPage';
import { PostJobPage } from './pages/job/PostJobPage';
import { CandidateProfilePage } from './pages/job/CandidateProfilePage';
import { EmployerAtsPage } from './pages/job/EmployerAtsPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-[#06080c] text-slate-100 flex flex-col font-sans selection:bg-[#fb6504] selection:text-white">
        <JobNavbar />
        <main className="flex-1">
          <Routes>
            {/* Core Job Advertising & Search Engine */}
            <Route path="/" element={<JobsListPage />} />
            <Route path="/jobs" element={<JobsListPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />

            {/* Glassdoor Company Hub & Reviews */}
            <Route path="/companies" element={<CompaniesListPage />} />
            <Route path="/companies/:id" element={<CompanyDetailPage />} />

            {/* Levels.fyi & Glassdoor Salaries & Compensation Explorer */}
            <Route path="/salaries" element={<SalariesExplorerPage />} />

            {/* Glassdoor Interview Questions & Prep Database */}
            <Route path="/interviews" element={<InterviewsDatabasePage />} />

            {/* Fishbowl & Blind Workplace Community Talk */}
            <Route path="/community" element={<CommunityTalkPage />} />

            {/* B2B Employer Portal & Job Wizard */}
            <Route path="/post-a-job" element={<PostJobPage />} />

            {/* Candidate Dashboard & Match Tracker */}
            <Route path="/profile" element={<CandidateProfilePage />} />

            {/* Employer ATS Pipeline & Candidate Screener */}
            <Route path="/employer/dashboard" element={<EmployerAtsPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/jobs" replace />} />
          </Routes>
        </main>
        <JobFooter />
      </div>
    </BrowserRouter>
  );
};

export default App;
