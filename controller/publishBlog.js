const { Blog } = require("../database/schema/Schema");

const publishBlog = async (req, res) => {
    try {
        const blogId = req.params.blogId;
        const { isPublished } = req.body;
        
        if(!isPublished) {
            return res.status(400).send({ message: "Publish status required" });
        }
        
        const updatedPublishStatus = await Blog.findByIdAndUpdate(
            blogId,
            { isPublished },
            { new: true, runValidators: true }
        )

        if(!updatedPublishStatus) {
            return res.status(404).send({ message: "Blog doesn't exist Or Error in updating publish status" });
        }

        return res.json({
            message: "Publish status updated successfully",
            blogs: updatedPublishStatus,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "This is not a valid status" });
    }
}

module.exports = publishBlog;
