import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import api from "../api/axiosConfig";
import { removeJobIdFromRecruiter } from "../store/authSlice";
import JobsList from "../components/JobsList";
import JobApplication from "../components/modals/JobApplication";
import Confirmation from "../components/modals/Confirmation";

const JobListings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const isRecruiter = useSelector((state) => state.auth.isRecruiter);

  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [isJobApplicationModalOpen, setIsJobApplicationModalOpen] =
    useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const [confirmationMessage, setConfirmationMessage] = useState("");

  const [jobs, setJobs] = useState([]);
  const [applicationStatuses, setApplicationStatuses] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const jobsResponse = await api.get("/api/v1/jobs");
        setJobs(jobsResponse.data);

        if (userData && !isRecruiter) {
          const appsResponse = await api.get("/api/v1/applications");
          const candidateApps = appsResponse.data.filter(
            (app) => app.email === userData.email
          );
          
          const dismissedStr = localStorage.getItem(`dismissed_jobs_${userData.email}`);
          const dismissedIds = dismissedStr ? JSON.parse(dismissedStr) : [];

          const statuses = {};
          candidateApps.forEach((app) => {
            if (!dismissedIds.includes(app.jobId)) {
              statuses[app.jobId] = app.status;
            }
          });
          setApplicationStatuses(statuses);
        }
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Failed to load jobs. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [userData, isRecruiter]);

  const openApplicationModal = () => {
    setIsJobApplicationModalOpen(true);
  };

  const closeApplicationModal = () => {
    setIsJobApplicationModalOpen(false);
  };

  const openConfirmationModal = () => {
    setIsConfirmationModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const applyForJob = async (formData) => {
    try {
      const applyResponse = await api.post("/api/v1/applications", formData);

      if (applyResponse.status === 201) {
        closeApplicationModal();
        
        // Remove from dismissed jobs in localStorage since they are applying again
        const dismissedStr = localStorage.getItem(`dismissed_jobs_${userData.email}`);
        const dismissedIds = dismissedStr ? JSON.parse(dismissedStr) : [];
        const filteredDismissed = dismissedIds.filter((id) => id !== selectedJob.id);
        localStorage.setItem(`dismissed_jobs_${userData.email}`, JSON.stringify(filteredDismissed));

        setApplicationStatuses({
          ...applicationStatuses,
          [selectedJob.id]: "Pending"
        });

        setConfirmationMessage(
          `Successfully applied to the job: ${selectedJob?.position} at ${selectedJob?.company}`
        );

        openConfirmationModal();
      }
    } catch (error) {
      console.log(error);
      closeApplicationModal();

      setConfirmationMessage(
        "Some error occurred while applying for the job. Kindly try again!"
      );

      openConfirmationModal();
    }
  };

  const handleCancelApplication = async (jobId) => {
    if (!window.confirm("Are you sure you want to dismiss this status and enable re-applying?")) {
      return;
    }
    
    // Add jobId to dismissed jobs in localStorage
    const dismissedStr = localStorage.getItem(`dismissed_jobs_${userData.email}`);
    const dismissedIds = dismissedStr ? JSON.parse(dismissedStr) : [];
    if (!dismissedIds.includes(jobId)) {
      dismissedIds.push(jobId);
      localStorage.setItem(`dismissed_jobs_${userData.email}`, JSON.stringify(dismissedIds));
    }

    // Remove jobId from applicationStatuses state so button resets to "Apply"
    const updatedStatuses = { ...applicationStatuses };
    delete updatedStatuses[jobId];
    setApplicationStatuses(updatedStatuses);
  };

  const deleteJob = async (job) => {
    setActionLoading(true);

    try {
      const deleteResponse = await api.delete(`/api/v1/jobs/${job.id}`);

      if (deleteResponse.status === 204) {
        const removeResponse = await api.post(
          `/api/v1/recruiters/${userData.email}/removejob`,
          job.id
        );

        if (removeResponse.status === 200) {
          dispatch(removeJobIdFromRecruiter({ jobId: job.id }));
          setJobs(jobs.filter((item) => item.id !== job.id));

          setConfirmationMessage(
            `Successfully deleted the job: ${job?.position} at ${job?.company}`
          );

          openConfirmationModal();
        }

        setActionLoading(false);
      }
    } catch (error) {
      console.log(error);
      setActionLoading(false);

      setConfirmationMessage(
        "Some error occurred while deleting the job. Kindly try again!"
      );

      openConfirmationModal();
    }
  };

  return (
    <div className="pt-40 px-32">
      {error && (
        <div className="mb-6 p-4 bg-red-600/20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {isRecruiter && (
        <div className="my-6">
          <button
            onClick={() => navigate("/postjob")}
            className="py-3 px-8 bg-green-600 hover:opacity-70 rounded-lg text-white text-lg font-bold transition-opacity"
          >
            + Post New Job
          </button>
        </div>
      )}

      {isLoading ? (
        <div>
          <p className="text-white text-lg font-bold">Loading...</p>
        </div>
      ) : error ? (
        <div>
          <p className="text-white text-lg font-bold">
            Failed to load jobs. Please check your connection and try again.
          </p>
        </div>
      ) : jobs.length > 0 ? (
        <JobsList
          actionLoading={actionLoading}
          jobs={jobs}
          onApply={openApplicationModal}
          onDelete={deleteJob}
          setSelectedJob={setSelectedJob}
          applicationStatuses={applicationStatuses}
          onCancelApplication={handleCancelApplication}
        />
      ) : (
        <div>
          <p className="text-white text-lg font-bold">
            No available jobs to show! Kindly check later
          </p>
        </div>
      )}

      <JobApplication
        isOpen={isJobApplicationModalOpen}
        onClose={closeApplicationModal}
        job={selectedJob}
        applyForJob={applyForJob}
      />

      <Confirmation
        isOpen={isConfirmationModalOpen}
        onClose={closeConfirmationModal}
        message={confirmationMessage}
      />
    </div>
  );
};

export default JobListings;
