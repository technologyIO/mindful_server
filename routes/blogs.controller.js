const Blogs = require("../database/models/BlogSection");



const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blogs.find();
        res.json(blogs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
const addBlogs = async (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            msg: 'No data'
        });
    }

    try {
        const blog = new Blogs(body);

        await blog.save();

        return res.json(blog);

    } catch (err) {
        // console.error(err.message);
       return  res.status(500).json({message:err.message});
    }
}

const getBlogData = async (req, res) => {
    const {id } = req.params;
    try {
        const blog = await Blogs.findById(id);

        if (!blog) {
            return res.status(404).json({
                msg: 'No blog found'
            });
        }

        return res.json(blog);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const updateBlogData = async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            msg: 'No data'
        });
    }

    try {
        const blog = await Blogs.findByIdAndUpdate(id, body, { new: true });

        if (!blog) {
            return res.status(404).json({
                msg: 'No blog found'
            });
        }

        return res.json(blog);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}

const deleteBlogData = async (req, res) => {
    const { id } = req.params;

    try {
        const blog = await Blogs.findByIdAndDelete(id);

        if (!blog) {
            return res.status(404).json({
                msg: 'No blog found'
            });
        }

        return res.json({
            msg: 'Blog deleted successfully'
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}


module.exports = {
    addBlogs,
    getBlogData,
    getAllBlogs,
    updateBlogData,
    deleteBlogData
}
