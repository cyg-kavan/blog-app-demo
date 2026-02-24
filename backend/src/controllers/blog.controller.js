const Blog = require("../models/blog.model");

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
      return res.status(409).send({
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

const updateBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.blogId;
    console.log(req.params);

    const { title, content } = req.body;

    const getblog = await Blog.findOne({ _id: blogId, author: userId });

    if (!getblog) {
      return res.status(400).send({ message: "Blog not found" });
    }

    if (title) {
      const existingBlogTitle = await Blog.findOne({
        title: title,
        author: userId,
        _id: { $ne: blogId },
      });
      if (existingBlogTitle) {
        return res.status(409).send({
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

const deleteBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.blogId;
    console.log(req.params);

    // const { title, content } = req.body;

    const getblog = await Blog.findOne({ _id: blogId, author: userId });

    if (!getblog) {
      return res.status(400).send({ message: "Blog not found" });
    }

    const deletedBlog = await getblog.deleteOne();
    // const deletedBlog = await Blog.deleteOne({ _id: blogId });
    // const deletedBlog = await Blog.findByIdAndDelete({ _id: blogId });
    // const deletedBlog = await Blog.findOneAndDelete({ _id: blogId });

    if (!deletedBlog) {
      return res.status(400).send({ message: "Blog not deleted" });
    }

    res.json({
      message: "Blog deleted successfully",
      deletedBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const showBlog = async (req, res) => {
  try {
    const userId = req.user.id;

    const showblogs = await Blog.find(
      { author: userId },
      { _id: 0, title: 1, content: 1 }
    );
    console.log(showblogs);

    // if(showblogs.length === 0) {
    //     return res.status(400).send({ message: "You Haven't Posted Any Blog Yet" });
    // }

    res.json({
      message: "Blogs fetched successfully",
      showblogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const blogListing = async (req, res) => {
  try {
    const { search, sort, order, page, limit } = req.query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const allowedSortFields = {
      title: "title",
      name: "author.name",
      createdAt: "createdAt",
    };
    const sortParam = (sort || "").trim();

    // const queryObject = {};

    // if(search) {
    //   const users = await User.find({
    //     name: { $regex: search, $options: "i" }
    //   }).select("_id");
    //   console.log(users);

    //   const userIds = users.map(user => user._id)

    //   queryObject.$or = [
    //     { title: { $regex: search, $options: "i"} },
    //     { author: { $in: userIds} }
    //   ]
    // }
    // if(title) queryObject.title = { $regex: title, $options: "i" };

    // if(author) {
    //   const user = await User.findOne({
    //     name: { $regex: author, $options: "i" }
    //   });

    //   if(!user) {
    //     return res.status(404).json({ message: "Author not found"})
    //   }

    //   queryObject.author = user._id;
    // }

    const directionValue = order === "desc" ? -1 : 1;
    // const sortBy = sort === 'name' ? 'author.name' : sort;
    const sortBy = allowedSortFields[sortParam];

    const blogs = await Blog.aggregate([
      // { $match: queryObject },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      { $unwind: "$author" },
      { $match: { isPublished: true } },
      {
        $match: {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { "author.name": { $regex: search, $options: "i" } },
          ],
        },
      },
      { $sort: { [sortBy]: directionValue } },
      { $skip: (pageNumber - 1) * limitNumber },
      { $limit: limitNumber },
      {
        $project: {
          "author.email": 0,
          "author.password": 0,
          "author.__v": 0,
          __v: 0,
          updatedAt: 0,
        },
      },
    ]);

    // console.log(blogs);

    const count = search ? blogs.length : await Blog.countDocuments();

    res.json({
      blogs,
      // searchBlog,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = { createBlog, updateBlog, deleteBlog, showBlog, blogListing };
