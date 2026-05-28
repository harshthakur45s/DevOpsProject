import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import api from "../api/axiosConfig";
import CheckIcon from "./Icons/CheckIcon";
import CrossIcon from "./Icons/CrossIcon";

const ApplicationsSection = () => {
  const isRecruiter = useSelector((state) => state.auth.isRecruiter);
  const userData = useSelector((state) => state.auth.userData);

  const [isLoading, setIsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [applications, setApplications] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [acceptedApplications, setAcceptedApplications] = useState([]);
  const [rejectedApplications, setRejectedApplications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const applicationsResponse = await api.get("/api/v1/applications");
        const jobsResponse = await api.get("/api/v1/jobs");

        const applicationsData = applicationsResponse.data;
        const jobsData = jobsResponse.data;

        if (isRecruiter) {
          const recruiterApplications = applicationsData.filter((application) =>
            userData?.jobIds?.includes(application.jobId)
          );

        const formattedApplications = recruiterApplications.map(
          (application) => {
            const jobInfo = jobsData.find(
              (job) => job.id === application.jobId
            );
            return {
              ...application,
              position: application.position || jobInfo?.position || null,
            };
          }
        );

        setApplications(formattedApplications);

        setPendingApplications(
          formattedApplications.filter((item) => item.status === "Pending")
        );
        setAcceptedApplications(
          formattedApplications.filter((item) => item.status === "Accepted")
        );
        setRejectedApplications(
          formattedApplications.filter((item) => item.status === "Rejected")
        );
      } else {
        const candidateApplications = applicationsData.filter(
          (item) => item.email === userData?.email
        );

        const formattedApplications = candidateApplications.map(
          (application) => {
            const jobInfo = jobsData.find(
              (job) => job.id === application.jobId
            );
            return {
              ...application,
              position: application.position || jobInfo?.position || null,
              company: application.company || jobInfo?.company || null,
              location: application.location || jobInfo?.location || null,
            };
          }
        );

        setApplications(formattedApplications);
      }

        setIsLoading(false);
      } catch (err) {
        console.error("Failed to fetch applications:", err);
        setError("Failed to load applications. Please try again.");
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [isRecruiter, userData]);

  const acceptApplication = async (item) => {
    setActionLoading(true);

    try {
      const response = await api.post(
        `/api/v1/applications/${item.id}`,
        "Accepted"
      );

      if (response.status === 200) {
        setPendingApplications(
          pendingApplications.filter(
            (application) => application.id !== item.id
          )
        );

        setAcceptedApplications(acceptedApplications.concat(item));
        setActionLoading(false);
      }
    } catch (error) {
      console.log(error);
      setActionLoading(false);
    }
  };

  const rejectApplication = async (item) => {
    setActionLoading(true);

    try {
      const response = await api.post(
        `/api/v1/applications/${item.id}`,
        "Rejected"
      );

      if (response.status === 200) {
        setPendingApplications(
          pendingApplications.filter(
            (application) => application.id !== item.id
          )
        );

        setRejectedApplications(rejectedApplications.concat(item));
        setActionLoading(false);
      }
    } catch (error) {
      console.log(error);
      setActionLoading(false);
    }
  };

  const deleteApplication = async (applicationId) => {
    if (!window.confirm("Are you sure you want to delete this application from your history?")) {
      return;
    }
    setActionLoading(true);
    try {
      const response = await api.delete(`/api/v1/applications/${applicationId}`);
      if (response.status === 204 || response.status === 200) {
        setApplications(applications.filter((app) => app.id !== applicationId));
        setPendingApplications(pendingApplications.filter((app) => app.id !== applicationId));
        setAcceptedApplications(acceptedApplications.filter((app) => app.id !== applicationId));
        setRejectedApplications(rejectedApplications.filter((app) => app.id !== applicationId));
      }
      setActionLoading(false);
    } catch (err) {
      console.error("Failed to delete application:", err);
      setError("Failed to delete application from history. Please try again.");
      setActionLoading(false);
    }
  };

  const renderCandidateApplicationDetailsLeftSide = (item) => {
    return (
      <div className="p-6 w-4/5">
        <div className="mb-6">
          <p className="font-semibold">
            {item.name}{" "}
            <span className="ml-10 text-sm opacity-80">
              {item.qualification}
            </span>
          </p>
          <p>{item.position}</p>
        </div>
        <div>
          <p className="opacity-80">{item.email}</p>
          <p className="opacity-80">{item.phone}</p>

          <p className="my-4">
            {item.skills.map((skill, idx) => (
              <span
                key={idx}
                className="mr-2 py-1 px-2 bg-slate-700 text-xs border rounded-md"
              >
                {skill}
              </span>
            ))}
          </p>

          <a href={item.resumeLink} target="_blank" className="underline">
            Resume
          </a>
        </div>
      </div>
    );
  };

  const renderPendingApplications = () => {
    return (
      <div>
        <h2 className="text-white text-2xl font-bold">Pending Applications</h2>

        <div className="my-8 flex flex-col gap-6 text-white">
          {isLoading ? (
            <div>
              <p className="my-10 text-lg font-semibold">Loading...</p>
            </div>
          ) : pendingApplications.length > 0 ? (
            pendingApplications.map((item) => (
              <div
                key={item.id}
                className="flex justify-between divide-x-2 border rounded-lg"
              >
                {renderCandidateApplicationDetailsLeftSide(item)}

                <div className="px-6 w-1/5 flex flex-col flex-grow justify-evenly items-center text-white">
                  <button
                    onClick={() => acceptApplication(item)}
                    disabled={actionLoading}
                    className={`py-3 px-8 flex flex-col items-center justify-center bg-green-600 hover:opacity-70 rounded-lg text-white font-semibold transition-opacity ${
                      actionLoading && "opacity-30 hover:opacity-40"
                    }`}
                  >
                    Accept
                    <CheckIcon width="1.5em" height="1.5em" />
                  </button>
                  <button
                    onClick={() => rejectApplication(item)}
                    disabled={actionLoading}
                    className={`py-3 px-8 flex flex-col items-center justify-center bg-red-600 hover:opacity-70 rounded-lg text-white font-semibold transition-opacity ${
                      actionLoading && "opacity-30 hover:opacity-40"
                    }`}
                  >
                    Reject
                    <CrossIcon width="1.5em" height="1.5em" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>
              <p className="my-10 text-lg font-semibold">
                No pending applications
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAcceptedApplications = () => {
    return (
      <div className="mt-16">
        <h2 className="text-white text-2xl font-bold">Accepted Applications</h2>

        <div className="my-8 flex flex-col gap-6 text-white">
          {isLoading ? (
            <div>
              <p className="my-10 text-lg font-semibold">Loading...</p>
            </div>
          ) : (
            acceptedApplications.map((item) => (
              <div
                key={item.id}
                className="flex justify-between divide-x-2 border border-green-500 rounded-lg"
              >
                {renderCandidateApplicationDetailsLeftSide(item)}

                <div className="px-6 w-1/5 flex flex-col flex-grow justify-evenly items-center text-white">
                  <p className="text-green-500 font-bold text-lg">Accepted</p>
                  <button
                    onClick={() => deleteApplication(item.id)}
                    disabled={actionLoading}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                    title="Delete application from history"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Delete Entry
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderRejectedApplications = () => {
    return (
      <div className="mt-16">
        <h2 className="text-white text-2xl font-bold">Rejected Applications</h2>

        <div className="my-8 flex flex-col gap-6 text-white">
          {isLoading ? (
            <div>
              <p className="my-10 text-lg font-semibold">Loading...</p>
            </div>
          ) : (
            rejectedApplications.map((item) => (
              <div
                key={item.id}
                className="flex justify-between divide-x-2 border border-red-500 rounded-lg"
              >
                {renderCandidateApplicationDetailsLeftSide(item)}

                <div className="px-6 w-1/5 flex flex-col flex-grow justify-evenly items-center text-white">
                  <p className="text-red-500 font-bold text-lg">Rejected</p>
                  <button
                    onClick={() => deleteApplication(item.id)}
                    disabled={actionLoading}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                    title="Delete application from history"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    Delete Entry
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  if (isRecruiter) {
    return (
      <div className="my-10">
        {error && (
          <div className="mb-6 p-4 bg-red-600/20 border border-red-500 rounded-lg text-red-300">
            {error}
          </div>
        )}
        {renderPendingApplications()}

        {acceptedApplications.length > 0 && renderAcceptedApplications()}
        {rejectedApplications.length > 0 && renderRejectedApplications()}
      </div>
    );
  }

  return (
    <div className="my-10">
      <h2 className="text-white text-2xl font-bold">Your Applications</h2>

      {error && (
        <div className="mb-6 p-4 bg-red-600/20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}

      <div className="p-4 my-4 border rounded-lg text-white">
        <div className="flex flex-col gap-2 divide-y divide-white/40">
          {isLoading ? (
            <div>
              <p className="my-10 text-lg font-semibold">Loading...</p>
            </div>
          ) : error ? (
            <div>
              <p className="my-10 text-lg font-semibold text-red-400">Failed to load applications. Please try again.</p>
            </div>
          ) : applications.length > 0 ? (
            applications.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-3 px-4"
              >
                <div>
                  <p className="font-semibold">{item.position || "Position Unavailable"}</p>
                  <p>
                    {item.company || "Company Details Unavailable"}
                    {item.location && (
                      <span className="ml-4 text-sm opacity-80">
                        @ {item.location}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <p
                    className={`${
                      item.status === "Accepted"
                        ? "text-green-500"
                        : item.status === "Rejected"
                        ? "text-red-500"
                        : "text-amber-500"
                    } font-semibold`}
                  >
                    {item.status}
                  </p>
                  <button
                    onClick={() => deleteApplication(item.id)}
                    disabled={actionLoading}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-white/10 transition-colors"
                    title="Delete application from history"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div>
              <p>You have not applied to any jobs!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsSection;
