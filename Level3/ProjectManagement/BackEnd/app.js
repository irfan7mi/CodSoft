// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/project-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Project Schema
const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'paused', 'completed'],
    default: 'planning'
  },
  deadline: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Task Schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  assignee: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  deadline: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update updatedAt field before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

taskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Project = mongoose.model('Project', projectSchema);
const Task = mongoose.model('Task', taskSchema);

// PROJECT ROUTES

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single project
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new project
app.post('/api/projects', async (req, res) => {
  try {
    const { name, description, status, deadline } = req.body;
    
    if (!name || !description || !deadline) {
      return res.status(400).json({ error: 'Name, description, and deadline are required' });
    }

    const project = new Project({
      name,
      description,
      status: status || 'planning',
      deadline: new Date(deadline)
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const { name, description, status, deadline } = req.body;
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        status,
        deadline: new Date(deadline),
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete project and all its tasks
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Delete all tasks associated with this project
    await Task.deleteMany({ projectId: req.params.id });
    
    // Delete the project
    await Project.findByIdAndDelete(req.params.id);

    res.json({ message: 'Project and associated tasks deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project progress
app.get('/api/projects/:id/progress', async (req, res) => {
  try {
    const tasks = await Task.find({ projectId: req.params.id });
    const completedTasks = tasks.filter(task => task.status === 'completed');
    const progress = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
    
    res.json({ 
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      progress
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// TASK ROUTES

// Get all tasks or tasks by project
app.get('/api/tasks', async (req, res) => {
  try {
    const { projectId, status, assignee } = req.query;
    let filter = {};

    if (projectId) filter.projectId = projectId;
    if (status) filter.status = status;
    if (assignee) filter.assignee = new RegExp(assignee, 'i');

    const tasks = await Task.find(filter)
      .populate('projectId', 'name')
      .sort({ createdAt: -1 });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single task
app.get('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('projectId', 'name');
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new task
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, projectId, assignee, status, priority, deadline } = req.body;
    
    if (!title || !projectId || !assignee || !deadline) {
      return res.status(400).json({ error: 'Title, projectId, assignee, and deadline are required' });
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const task = new Task({
      title,
      description: description || '',
      projectId,
      assignee,
      status: status || 'pending',
      priority: priority || 'medium',
      deadline: new Date(deadline)
    });

    const savedTask = await task.save();
    const populatedTask = await Task.findById(savedTask._id).populate('projectId', 'name');
    
    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { title, description, assignee, status, priority, deadline } = req.body;
    
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        assignee,
        status,
        priority,
        deadline: new Date(deadline),
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    ).populate('projectId', 'name');

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DASHBOARD ROUTES

// Get dashboard statistics
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const inProgressTasks = await Task.countDocuments({ status: 'in-progress' });
    const pendingTasks = await Task.countDocuments({ status: 'pending' });

    // Get overdue tasks
    const today = new Date();
    const overdueTasks = await Task.countDocuments({
      deadline: { $lt: today },
      status: { $ne: 'completed' }
    });

    // Get upcoming deadlines (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    const upcomingTasks = await Task.find({
      deadline: { $gte: today, $lte: nextWeek },
      status: { $ne: 'completed' }
    })
    .populate('projectId', 'name')
    .sort({ deadline: 1 })
    .limit(5);

    // Get recent projects
    const recentProjects = await Project.find()
      .sort({ updatedAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalProjects,
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        overdueTasks
      },
      upcomingTasks,
      recentProjects
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get project progress for all projects
app.get('/api/dashboard/project-progress', async (req, res) => {
  try {
    const projects = await Project.find();
    const projectProgress = [];

    for (const project of projects) {
      const tasks = await Task.find({ projectId: project._id });
      const completedTasks = tasks.filter(task => task.status === 'completed');
      const progress = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
      
      projectProgress.push({
        project: {
          _id: project._id,
          name: project.name,
          status: project.status,
          deadline: project.deadline
        },
        totalTasks: tasks.length,
        completedTasks: completedTasks.length,
        progress
      });
    }

    res.json(projectProgress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Connect to database and start server
connectDB().then(() => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = app;