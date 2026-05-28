import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const JobsList = ({
  actionLoading,
  jobs,
  onApply,
  onDelete,
  setSelectedJob,
  applicationStatuses = {},
  onCancelApplication,
}) => {
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isRecruiter = useSelector((state) => state.auth.isRecruiter);
  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    onApply();
  };

  const handleDeleteClick = (job) => {
    onDelete(job);
  };

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold">Available Jobs</h1>

      <div className="my-6 flex flex-col gap-6">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="my-4 p-4 flex justify-between items-center gap-4 border rounded-lg"
          >
            <div>
              <h2 className="text-xl font-semibold">{job.position}</h2>
              <p className="opacity-80 mb-4">
                {job.experience} of Experience required
              </p>

              <h2 className="font-semibold">{job.company}</h2>
              <p className="opacity-80">{job.location}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {job.skills.map((item, idx) => (
                <span
                  key={idx}
                  className="mr-2 py-1 px-2 bg-slate-700 text-xs border rounded-md"
                >
                  {item}
                </span>
              ))}
            </div>

            {isRecruiter ? (
              userData.jobIds.includes(job.id) && (
                <div>
                  <button
                    onClick={() => handleDeleteClick(job)}
                    disabled={actionLoading}
                    className={`py-4 px-8 bg-red-600 hover:opacity-70 rounded-lg text-white text-lg font-semibold transition-opacity ${
                      actionLoading && "opacity-30 hover:opacity-40"
                    }`}
                  >
                    Delete
                  </button>
                </div>
              )
            ) : (
              <div className="flex items-center gap-3">
                {applicationStatuses[job.id] ? (
                  <>
                    {applicationStatuses[job.id] === "Pending" ? (
                      <button
                        disabled={true}
                        className="py-4 px-8 bg-slate-600 rounded-lg text-white/50 text-lg font-semibold cursor-not-allowed"
                      >
                        Applied
                      </button>
                    ) : applicationStatuses[job.id] === "Accepted" ? (
                      <button
                        disabled={true}
                        className="py-4 px-8 bg-green-700 border border-green-500 rounded-lg text-white/80 text-lg font-semibold cursor-not-allowed"
                      >
                        Accepted
                      </button>
                    ) : (
                      <button
                        disabled={true}
                        className="py-4 px-8 bg-red-700 border border-red-500 rounded-lg text-white/80 text-lg font-semibold cursor-not-allowed"
                      >
                        Rejected
                      </button>
                    )}
                    <button
                      onClick={() => onCancelApplication(job.id)}
                      className="p-3 text-gray-400 hover:text-red-500 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center"
                      title="Delete application from history"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleApplyClick(job)}
                    className="py-4 px-8 bg-green-600 hover:opacity-70 rounded-lg text-white text-lg font-semibold transition-opacity"
                  >
                    Apply
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobsList;
