const { Blog } = require("../database/schema/Schema");

const deleteBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.blogId;
    console.log(req.params);

    // const { title, content } = req.body;

    const getblog = await Blog.findOne({ _id: blogId, author: userId });
    
    if(!getblog) {
        return res.status(400).send({ message: "Blog not found" });
    }
    
    const deletedBlog = await getblog.deleteOne();
    // const deletedBlog = await Blog.deleteOne({ _id: blogId });
    // const deletedBlog = await Blog.findByIdAndDelete({ _id: blogId });
    // const deletedBlog = await Blog.findOneAndDelete({ _id: blogId });

    if(!deletedBlog) {
        return res.status(400).send({ message: "Blog not deleted" });
    }

    res.json({
      message: "Blog deleted successfully",
      deletedBlog
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = deleteBlog;