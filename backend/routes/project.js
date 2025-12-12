const express = require('express');
const Projects = require('../models/Project');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

// CREATE - Post a new project
router.post('/', protect, authorize('lead', 'admin'), async (req, res) => {
    try {
        const { name, Teamlead } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Project name is required' });
        }
        const project = await Projects.create({
            name,
            Teamlead,
        });
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// READ - Get all projects
router.get('/', protect, async (req, res) => {
    try {
        const Projectdata = await Projects.find({});
        res.json(Projectdata);
    } catch (error) {
        res.status(500).json({ error: error.message || error });
    }
});

// // READ - Get a single project by ID
// router.get('/:id', async (req, res) => {
//     try {
//         const project = Project.find(p => p.id === parseInt(req.params.id));

//         if (!project) {
//             return res.status(404).json({ error: 'Project not found' });
//         }

//         res.json(project);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // UPDATE - Update a project
// router.put('/:id', async (req, res) => {
//     try {
//         const project = Project.find(p => p.id === parseInt(req.params.id));

//         if (!project) {
//             return res.status(404).json({ error: 'Project not found' });
//         }

//         if (req.body.name) project.name = req.body.name;
//         if (req.body.description) project.description = req.body.description;
//         project.updatedAt = new Date();

//         res.json(project);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// // DELETE - Delete a project
// router.delete('/:id', async (req, res) => {
//     try {
//         const index = Project.findIndex(p => p.id === parseInt(req.params.id));

//         if (index === -1) {
//             return res.status(404).json({ error: 'Project not found' });
//         }

//         const deletedProject = Project.splice(index, 1);
//         res.json(deletedProject[0]);
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

module.exports = router;