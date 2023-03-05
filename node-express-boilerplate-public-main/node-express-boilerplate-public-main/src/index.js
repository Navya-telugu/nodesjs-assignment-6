const express = require('express')
const app = express()
const mongoose = require('mongoose');

const bodyParser = require("body-parser");
const port = 3000
app.use(express.urlencoded());

app.use(express.json());


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())
mongoose.connect('mongodb://localhost:27017/Blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const blogSchema =new mongoose.Schema({
  topic: {
     type: String, 
     required: true
     },
  description: {
     type: String, 
     required: true
     },
  posted_at: {
     type: Date,
    default: Date.now
     },
  posted_by: { 
    type: String,
    required: true
     },

})
const Blog = mongoose.model('Blog', blogSchema);


app.get('/blog', async (req, res) => {
  const { page, search } = req.query;
  const regex = new RegExp(search, 'i');
  const skip = (page - 1) * 5;
  const blogs = await Blog.find({ topic: regex })
    .sort({ posted_at: -1 })
    .skip(skip)
    .limit(5);
  res.json({ status: 'success', result: blogs });
});
app.post('/blog', async (req, res) => {
  const { topic, description, posted_by } = req.body;
  const blog = new Blog({ topic, description, posted_by });
  const savedBlog = await blog.save();
  res.json({ status: 'success', result: savedBlog });
});

app.put('/blog/:id', async (req, res) => {
  const { id } = req.params;
  const { topic, description, posted_by } = req.body;
  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { topic, description, posted_by },
    { new: true }
  );
  res.json({ status: 'success', result: updatedBlog });
});

app.delete('/blog/:id', async (req, res) => {
  const { id } = req.params;
  const deletedBlog = await Blog.findByIdAndDelete(id);
  res.json({ status: 'success', result: deletedBlog });
});



app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;