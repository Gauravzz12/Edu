const express = require('express');
const bodyParser = require('body-parser');
const MarksModel = require('../models/MarksModel');

const router = express.Router();
router.use(bodyParser.json());
router.get('/getGrades', async (req, res) => {
    try {
        
        const id = req.query.id;
        const grades = await MarksModel.find({ _id:id });
        res.json(grades[0].marks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.post('/addGrade', async (req, res) => {
    const { marks, id } = req.body;
    try {  
        const ifExists = await MarksModel.findOne({ _id: id });

        if (ifExists) {
            const existingMarkIndex = ifExists.marks.findIndex(mark => mark.subject === marks.subject && mark.testType === marks.testType);
            if (existingMarkIndex !== -1) {
                ifExists.marks[existingMarkIndex] = marks;
                const updatedMarks = await ifExists.save();
                res.json(updatedMarks.marks[existingMarkIndex]);
            } else {
                ifExists.marks.push(marks);
                const updatedMarks = await ifExists.save();
                res.json(updatedMarks.marks[updatedMarks.marks.length - 1]);
            }
        } else {
            const newMarksEntry = new MarksModel({
                _id: id,
                marks: [marks],
            });
            const savedMarksEntry = await newMarksEntry.save();
            res.json(savedMarksEntry.marks[0]);
        }
    } catch (err) {
        console.error('Error adding marks entry:', err);
        res.status(500).json({ error: 'Failed to add marks entry' });
    }
});


router.post('/removeGrade', async (req, res) => {
    const { gradeId, id } = req.body;
    try {
        const data = await MarksModel.findOneAndUpdate(
            { _id: id },
            { $pull: { marks: { _id: gradeId } } },
            { new: true }
        );
        
        console.log('Marks entry removed successfully');
        res.json(data);
    } catch (err) {
        console.error('Error removing marks entry:', err);
        res.status(500).json({ error: 'Failed to remove marks entry' });
    }
});

  

module.exports = router;
