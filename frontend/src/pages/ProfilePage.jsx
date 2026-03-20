import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/useAuth";
import axios from "axios";
import Modal from "../components/Modal";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    </div>
  );
}
