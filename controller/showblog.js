const { Blog } = require("../database/schema/Schema");

const showBlog = async (req, res) => {
  try {
    const userId = req.user.id;

    const showblogs = await Blog.find({ author: userId }, { _id: 0, title: 1, content: 1 });
    console.log(showblogs);
    
    
    // if(showblogs.length === 0) {
    //     return res.status(400).send({ message: "You Haven't Posted Any Blog Yet" });
    // }

    res.json({
      message: "Blogs fetched successfully",
      showblogs
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = showBlog;