const { Blog } = require("../database/schema/Schema.js");

const createBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content } = req.body;

    if (!(title && content)) {
      return res.status(400).send({ message: "All inputs are required" });
    }

    const existingBlogTitle = await Blog.findOne({
      title: title,
      author: userId,
    });
    if (existingBlogTitle) {
      return res
        .status(409)
        .send({
          message: "Blog title already exist, Please choose another title",
        });
    }

    const newBlog = new Blog({
      title: title,
      content: content,
      author: userId,
    });

    const blog = await newBlog.save();

    res.json(blog);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = createBlog;
