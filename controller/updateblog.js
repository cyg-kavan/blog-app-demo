const { Blog } = require("../database/schema/Schema");

const updateBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.blogId;
    console.log(req.params);

    const { title, content } = req.body;

    const getblog = await Blog.findOne({ _id: blogId, author: userId })
    
    if(!getblog) {
        return res.status(400).send({ message: "Blog not found" }); 
    }
    
    if (title) {
      const existingBlogTitle = await Blog.findOne({ title: title, author: userId, _id: { $ne: blogId } });
      if (existingBlogTitle) {
        return res
          .status(409)
          .send({
            message: "Blog title already exist, Please choose another title",
          });
      }

      getblog.title = title;
    }

    if (content) getblog.content = content;

    await getblog.save();

    res.json({
      message: "Blog updated successfully",
    //   updatedBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = updateBlog;
