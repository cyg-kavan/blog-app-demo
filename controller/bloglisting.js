const { Blog, User } = require("../database/schema/Schema");

const blogListing = async (req, res) => {
  try {
    const { search, sort, order, page = 1, limit = 10 } = req.query;

    const queryObject = {};

    if(search) {
      const users = await User.find({
        name: { $regex: search, $options: "i" }
      }).select("_id");
      console.log(users);

      const userIds = users.map(user => user._id)

      queryObject.$or = [
        { title: { $regex: search, $options: "i"} },
        { author: { $in: userIds} }
      ]
    }
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
    const sortBy = sort === 'name' ? 'author.name' : sort;

    const blogs = await Blog.aggregate([
      { $match: queryObject },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author"
        }
      },
      { $unwind: "$author" },
      { $sort: { [sortBy]: directionValue } },
      { $skip: (page - 1) * limit },
      { $limit: limit * 1 }
    ]);

    console.log(blogs);

    // const searchBlog = await query
    //   .exec();

      // console.log(searchBlog);
    const count = await Blog.countDocuments();

    res.json({
      blogs,
      // searchBlog,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = blogListing;