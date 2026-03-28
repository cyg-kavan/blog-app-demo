import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/useAuth";
import axios from "axios";
import Modal from "../components/Modal";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfileDetails = async () => {
      setName(user.name);
    };
    fetchProfileDetails();
  }, []);

  const updateProfile = async () => {
    try {
      await axios.patch(
        "http://localhost:8000/api/users/profile",
        { name, password },
        { withCredentials: true }
      );
      alert("Profile updated successfully");
    } catch (error) {
      console.log("Error while updating profile: ", error);
    }
  };

  useEffect(() => {
    const fetchAllUsersRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/admin/requests",
          { withCredentials: true }
        );

        setRequests(response.data.requests);
      } catch (error) {
        console.log("Error when fetching all users requests: ", error);
      }
    };

    if (user.role === "admin") {
      fetchAllUsersRequests();
    }
  }, []);

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/users/my-requests",
          { withCredentials: true }
        );
        setMyRequests(response.data.requests);
      } catch (error) {
        console.log("Error when fetching my requests: ", error);
      }
    };

    if (user.role !== "admin") {
      fetchMyRequests();
    }
  }, []);

  const approveRequest = async (requestId, status) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/admin/requests/${requestId}`,
        { status },
        { withCredentials: true }
      );
      setRequests(prev => prev.map(r => r._id === requestId ? {...r, status} : r))
      alert("Request resolved successfully");
    } catch (error) {
      console.log("Error while resolving request: ", error);
    }
  };

  return (
    <div className="flex">
      <div className="pt-20 w-80 min-h-screen px-6 py-8 border-r border-gray-300 bg-white">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-2xl font-bold text-black self-start">
            Profile Details
          </h1>

          <img
            className="rounded-full w-36 h-36 object-cover border-2 border-gray-300 shadow-sm"
            src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw0PDQ4NDg0PDQ4NDQ0NDg0ODQ8NDQ0NFREYFhURExMYHSggGBolGxMTITEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0NDg0NDisZHxkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAaAAEBAQEBAQEAAAAAAAAAAAAAAwQCBQEH/8QALBABAAECBQIEBgMBAAAAAAAAAAECAwQRMUFRIXEiYYGhEhQyQpHRUrHBE//EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A/cQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAfKqogH0Sm5O3RxMgtNUcn/SEQFf8ApD78ccogNAzw7i5PcFRzTVEugAAAAAAAAAAAAAAAAASrrz7f2D7Vc4/KYAAAAAAAAAO6K+XADQI0V5dlgAAAAAAAAAAAAAfKpygHFyrb8pgAAAAAJ3L1NOvWeIRnFTtEevUGoZYxU8R7wrbv0z00niQVAAAAd26tnADQOaKs4dAAAAAAAAAAAJXZ65cKs8yAAAAAhiLuXSNd54WqnKJniM3n1TnOfIPgCoAA04a99s+k/wCNLzXoW6s6YnlFdAAAA6tz1WZ14kH0AAAAAAAAAHNekorXNEQAAAATv/RPZhbr/wBFXZhUABAABswv0essbZhfp9ZBYBFAAFbWiSlrSQUAAAAAAAAABxc0SWr0lEAAAAHyqM4mOYyefVGU5cPRQxFrPxRrvHIMgCoAAPQtU5UxCGHs/dPpH+tKKAAAAKWt01bWgOwAAAAAAAAAJZ2hK5HXuDgAAAAcXLtNOs9eI1RqxXFP5kFblmmrynmEZws7TH9PnzVXEe581VxHuBGFnmFrdimPOfNH5qriPc+aq4j3BrGWMVO9Mek5LW71M75TxIKAAAAL0x0SojOVgAAAAAAAAAAHNcZw6AZx3cp3cAM+IvZeGNd54VvV/DTM76R3YAAFQAAAAABosX/tq9JanmtuHrzp846IqoOrdOYO7dOUOwAAAAAAAAAAAAARrpy7LAPOxk6R3lmbcZYmfFHWIjTdiVAAAAAAAABfCT4suYQasHYqz+Keke8g0005rRBEPqKAAAAAAAAAAAAAAAAIXsNTV10nmFwHmXcLXTt8Ucx+kHtOa7dM6xE94B449KrB252mO0/txOBp/lPsowDfGBp/lPs6pwVHnPef0DzlreGrq2yjmej0aLVNOlMR6dXaDPZwlNPWfFPnp+GgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/Z"
            alt="profile"
          />

          <div className="w-full space-y-4 mt-4">
            <div className="flex flex-col border-b border-gray-200 pb-2">
              <span className="text-sm text-gray-500">Username</span>
              <span className="font-semibold text-black">{user.name}</span>
            </div>

            <div className="flex flex-col border-b border-gray-200 pb-2">
              <span className="text-sm text-gray-500">Email</span>
              <span className="font-semibold text-black">{user.email}</span>
            </div>

            <div className="flex flex-col border-b border-gray-200 pb-2">
              <span className="text-sm text-gray-500">Role</span>
              <span className="font-semibold text-black capitalize">
                {user.role}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 w-full bg-black text-white font-semibold py-1 rounded-lg hover:bg-gray-900 cursor-pointer"
          >
            Edit Profile
          </button>

          {isModalOpen && (
            <Modal onClose={() => setIsModalOpen(false)}>
              <div className="p-3">
                <h1 className="text-lg font-bold mb-5">Edit Your Profile</h1>
                <form onSubmit={updateProfile} className="space-y-6">
                  <div>
                    <label className="block text-sm/6 font-medium text-black-100">
                      Name
                    </label>
                    <div className="mt-2">
                      <input
                        name="name"
                        type="text"
                        value={name}
                        required
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-2 -outline-offset-1 outline-black placeholder:text-black focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm/6 font-medium text-black-100">
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        name="password"
                        type="password"
                        value={password}
                        required
                        minLength={6}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-black outline-2 -outline-offset-1 outline-black placeholder:text-black focus:outline-2 focus:-outline-offset-2 focus:outline-black sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-lg font-semibold text-white hover:bg-gray-900"
                    >
                      Edit Profile
                    </button>
                  </div>
                </form>
              </div>
            </Modal>
          )}
        </div>
      </div>

      {requests.length !== 0 || myRequests.length !== 0 ? (
        <div className="pt-20 w-350 min-h-screen px-10 py-10">
          <div className="p-3">
            <div className="overflow-hidden rounded-md">
              <table className="table-auto md:table-fixed w-full">
                <thead className="bg-black text-white shadow-lg border-b-2 border-gray-100">
                  <tr>
                    {user.role === "admin" && (
                      <>
                        <th className="p-3">Username</th>
                        <th className="p-3">E-mail</th>
                      </>
                    )}
                    <th className="p-3">Request Type</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Blog Title</th>
                    {user.role === "admin" && <th className="p-3">Actions</th>}
                  </tr>
                </thead>
                <tbody className="bg-gray-50 text-center">
                  {requests.map((request) => (
                    <tr key={request._id}>
                      <td className="p-3">{request.user_id.name}</td>
                      <td className="p-3">{request.user_id.email}</td>
                      <td className="p-3">{request.request_type}</td>
                      <td className="p-3">
                        <button
                          className={`shadow-lg text-sm rounded-2xl py-1 w-30 ${
                            request.status === "Pending"
                              ? "bg-amber-200"
                              : request.status === "Approved"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {request.status}
                        </button>
                      </td>
                      <td className="p-3 truncate">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setIsDetailModalOpen(true);
                          }}
                          className="font-medium hover:text-blue-700 hover:underline cursor-pointer"
                        >
                          {request.blog_id?.title || "-"}
                        </button>
                      </td>

                      {user.role === "admin" && (
                        <td className="p-3">
                          <div className="flex justify-center gap-2">
                            <button
                              disabled={request.status !== "Pending"}
                              onClick={() =>
                                approveRequest(request._id, "Approved")
                              }
                              className="bg-green-600 text-white text-sm font-semibold p-2 rounded-md cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                            >
                              Approve
                            </button>
                            <button
                              disabled={request.status !== "Pending"}
                              onClick={() =>
                                approveRequest(request._id, "Cancelled")
                              }
                              className="bg-red-600 text-white text-sm font-semibold p-2 rounded-md cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}

                  {myRequests.map((myrequest) => (
                    <tr key={myrequest._id}>
                      <td className="p-3">{myrequest.request_type}</td>
                      <td className="p-3">
                        <button
                          className={`shadow-lg text-sm rounded-2xl py-1 w-30 ${
                            myrequest.status === "Pending"
                              ? "bg-amber-200"
                              : myrequest.status === "Approved"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                          {myrequest.status}
                        </button>
                      </td>
                      <td className="p-3 truncate">
                        {myrequest.blog_id?.title || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {isDetailModalOpen && (
                <Modal onClose={() => setIsDetailModalOpen(false)}>
                  <div className="p-3">
                    <h1 className="text-xl font-bold mb-5">
                      {selectedRequest.blog_id?.title}
                    </h1>
                    <div className="flex justify-between font-semibold mb-5">
                      <span>{selectedRequest.user_id.name}</span>
                      {/* <span>{customFormattedDate}</span> */}
                    </div>
                    <p className="text-md whitespace-pre-line">
                      {selectedRequest.blog_id?.content}
                    </p>
                  </div>
                </Modal>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center text-4xl font-semibold w-350 min-h-screen">
          There are no requests
        </div>
      )}
    </div>
  );
}
