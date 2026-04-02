import { useNavigate } from "react-router-dom";

export default function BlogForm({
  title,
  setTitle,
  content,
  setContent,
  handleSubmit,
  buttonText,
  headingText,
}) {

  const navigate = useNavigate();
  return (
    <div className="px-8 py-10 mt-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-black">{headingText}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-lg font-medium text-black mb-2">
            Enter Your Blog Title
          </label>

          <input
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-black rounded-md px-4 py-2 outline-none focus:ring-1 focus:ring-black"
            placeholder="Enter blog title..."
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-black mb-2">
            Write Blog Content
          </label>

          <textarea
            value={content}
            required
            rows="12"
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-black rounded-md px-4 py-3 outline-none focus:ring-1 focus:ring-black resize-none"
            placeholder="Write your blog here..."
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-black text-white font-semibold px-6 py-2 rounded-md hover:bg-gray-900 cursor-pointer"
          >
            {buttonText}
          </button>
          <button
            onClick={() => navigate("/my-blogs")}
            type="button"
            className="bg-black text-white font-semibold px-6 py-2 rounded-md hover:bg-gray-900 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
