const { default: mongoose } = require("mongoose");
const Blog = require("../models/blog.model");

const createBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content } = req.body;

    if (!(title && content)) {
      return res.status(400).json({
        success: false,
        message: "All inputs are required",
      });
    }

    const existingBlogTitle = await Blog.findOne({
      title: title,
      author: userId,
    });

    if (existingBlogTitle) {
      return res.status(409).json({
        success: false,
        message: "Blog title already exist, Please choose another title",
      });
    }

    const newBlog = new Blog({
      title: title,
      content: content,
      author: userId,
    });

    const blog = await newBlog.save();

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getBlogById = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.blogId;

    const fetchBlog = await Blog.findOne({ _id: blogId, author: userId });

    if (!fetchBlog) {
      return res.status(400).json({
        success: false,
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog fetched successfully",
      data: fetchBlog,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
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
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    if (title) {
      const existingBlogTitle = await Blog.findOne({
        title: title,
        author: userId,
        _id: { $ne: blogId },
      });
      if (existingBlogTitle) {
        return res.status(409).json({
          success: false,
          message: "Blog title already exist, Please choose another title",
        });
      }

      getblog.title = title;
    }

    if (content) getblog.content = content;

    const updatedBlog = await getblog.save();

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const userId = req.user.id;
    const blogId = req.params.blogId;
    console.log(req.params);

    const getblog = await Blog.findOne({ _id: blogId, author: userId });

    if (!getblog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const deletedBlog = await getblog.deleteOne();
    // const deletedBlog = await Blog.deleteOne({ _id: blogId });
    // const deletedBlog = await Blog.findByIdAndDelete({ _id: blogId });
    // const deletedBlog = await Blog.findOneAndDelete({ _id: blogId });

    if (!deletedBlog) {
      return res.status(400).json({
        success: false,
        message: "Blog not deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
      data: deletedBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const showBlog = async (req, res) => {
  try {
    const userId = req.user.id;

    const showblogs = await Blog.find(
      { author: userId },
      { title: 1, content: 1, createdAt: 1 }
    );

    // if(showblogs.length === 0) {
    //     return res.status(400).json({ message: "You Haven't Posted Any Blog Yet" });
    // }

    return res.json({
      success: true,
      message: "Blogs fetched successfully",
      data: showblogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const blogListing = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { search, sort, order, page, limit, status } = req.query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    // const isPublished = !status || status === 'published'
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

    const pipeline = [
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
      // { $match: { isPublished } },
    ];

    const matchStage = {
      ...(status === "published" && { isPublished: true }),
      ...(status === "unpublished" && { isPublished: false }),
      ...(userId && { "author._id": new mongoose.Types.ObjectId(userId) }),
      ...(!userId && { isPublished: true }),
    };

    pipeline.push(
      { $match: matchStage },
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
      }
    );
    const blogs = await Blog.aggregate(pipeline);

    // if(userId) {
    //   pipeline.push({
    //     $match: { "author._id": new mongoose.Types.ObjectId(userId) },
    //   })

    // if(status === "published") {
    //   pipeline.push({ $match: { isPublished: true } });
    // } else if(status === "unpublished") {
    //   pipeline.push({ $match: { isPublished: false } });
    // }
    // }

    // console.log(blogs);

    const count = search ? blogs.length : await Blog.countDocuments();

    return res.json({
      success: true,
      message: "Blogs fetched successfully",
      data: blogs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      limit,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  showBlog,
  blogListing,
  getBlogById,
};
