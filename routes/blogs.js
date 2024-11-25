const express = require("express");
const { addSection, updateSection, getSection } = require("./homeSection.controller");
const { getAllBlogs, addBlogs, getBlogData, updateBlogData, deleteBlogData } = require("./blogs.controller");



const blogsRouter = express.Router();

blogsRouter.get('/getAllBlogs',getAllBlogs );
blogsRouter.post('/addBlogs',addBlogs );
blogsRouter.get('/getBlogData/:id/blog', getBlogData)
blogsRouter.put('/updateBlogData/:id/blog', updateBlogData)
blogsRouter.delete('/deleteBlogData/:id/blog', deleteBlogData)



module.exports = blogsRouter