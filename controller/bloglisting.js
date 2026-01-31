const { Blog, User } = require("../database/schema/Schema");

const blogListing = async (req, res) => {
  try {
    const { title, content, author, sort, page = 1, limit = 10 } = req.query;

    const queryObject = {};

    if(title) queryObject.title = { $regex: title, $options: "i" };

    if(content) queryObject.content = { $regex: content, $options: "i" };

    if(author) {
      const user = await User.findOne({
        name: { $regex: author, $options: "i" }
      });

      if(!user) {
        return res.status(404).json({ message: "Author not found"})
      }

      queryObject.author = user._id;
    }
    
    console.log(queryObject);
    
    let query = Blog.find(queryObject).populate("author", "name");
    
    if(sort) {
      const sortBy = sort.split(",").join(" ");
      console.log(sortBy);
      
      query = query.sort(sortBy);
    }

    const searchBlog = await query
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Blog.countDocuments();

    if(!searchBlog) {
      return res.status(400).json({ message: "Something went wrong"})
    }

    res.json({
      searchBlog,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = blogListing;