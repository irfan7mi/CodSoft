// scripts/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/project-management', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Project Schema (same as server.js)
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['planning', 'active', 'paused', 'completed'], default: 'planning' },
  deadline: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Task Schema (same as server.js)
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  assignee: { type: String, required: true, trim: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  deadline: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', projectSchema);
const Task = mongoose.model('Task', taskSchema);

// Sample data
const sampleProjects = [
  {
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design and improved user experience',
    status: 'active',
    deadline: new Date('2025-07-15'),
    createdAt: new Date('2025-06-01')
  },
  {
    name: 'Mobile App Development',
    description: 'Develop iOS and Android applications for customer engagement',
    status: 'planning',
    deadline: new Date('2025-09-30'),
    createdAt: new Date('2025-06-02')
  },
  {
    name: 'Database Migration',
    description: 'Migrate legacy database to cloud infrastructure',
    status: 'active',
    deadline: new Date('2025-08-20'),
    createdAt: new Date('2025-05-15')
  },
  {
    name: 'Marketing Campaign',
    description: 'Launch Q3 marketing campaign across digital platforms',
    status: 'completed',
    deadline: new Date('2025-06-30'),
    createdAt: new Date('2025-05-01')
  }
];

const generateSampleTasks = (projects) => {
  const tasks = [];
  const assignees = ['Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson', 'Eva Brown', 'Frank Miller'];
  const taskTemplates = [
    { title: 'Research and Analysis', description: 'Conduct thorough research and market analysis' },
    { title: 'Design Mockups', description: 'Create initial design mockups and wireframes' },
    { title: 'Frontend Development', description: 'Implement responsive frontend components' },
    { title: 'Backend API Development', description: 'Build robust backend API endpoints' },
    { title: 'Database Setup', description: 'Configure and optimize database structure' },
    { title: 'Testing and QA', description: 'Perform comprehensive testing and quality assurance' },
    { title: 'Documentation', description: 'Create user and technical documentation' },
    { title: 'Deployment', description: 'Deploy application to production environment' },
    { title: 'Performance Optimization', description: 'Optimize application performance and speed' },
    { title: 'Security Review', description: 'Conduct security audit and implement fixes' }
  ];

  projects.forEach((project, projectIndex) => {
    const numTasks = Math.floor(Math.random() * 6) + 3; // 3-8 tasks per project
    
    for (let i = 0; i < numTasks; i++) {
      const template = taskTemplates[Math.floor(Math.random() * taskTemplates.length)];
      const assignee = assignees[Math.floor(Math.random() * assignees.length)];
      const priorities = ['low', 'medium', 'high'];
      const statuses = ['pending', 'in-progress', 'completed'];
      
      // Create realistic task distribution
      let status;
      if (project.status === 'completed') {
        status = 'completed';
      } else {
        const statusWeights = [0.3, 0.4, 0.3]; // 30% pending, 40% in-progress, 30% completed
        const rand = Math.random();
        if (rand < statusWeights[0]) status = 'pending';
        else if (rand < statusWeights[0] + statusWeights[1]) status = 'in-progress';
        else status = 'completed';
      }

      const taskDeadline = new Date(project.deadline);
      taskDeadline.setDate(taskDeadline.getDate() - Math.floor(Math.random() * 30)); // Random date before project deadline

      tasks.push({
        title: `${template.title} - ${project.name}`,
        description: template.description,
        projectId: project._id,
        assignee: assignee,
        status: status,
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        deadline: taskDeadline,
        createdAt: new Date(project.createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) // Within a week of project creation
      });
    }
  });

  return tasks;
};

const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    // Insert projects
    const insertedProjects = await Project.insertMany(sampleProjects);
    console.log(`Inserted ${insertedProjects.length} projects`);

    // Generate and insert tasks
    const sampleTasks = generateSampleTasks(insertedProjects);
    const insertedTasks = await Task.insertMany(sampleTasks);
    console.log(`Inserted ${insertedTasks.length} tasks`);

    console.log('Database seeding completed successfully!');
    
    // Display summary
    console.log('\n--- SEEDING SUMMARY ---');
    console.log(`Projects created: ${insertedProjects.length}`);
    console.log(`Tasks created: ${insertedTasks.length}`);
    
    const statusCounts = {};
    insertedTasks.forEach(task => {
      statusCounts[task.status] = (statusCounts[task.status] || 0) + 1;
    });
    
    console.log('Task status distribution:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seeding
connectDB().then(seedDatabase);