const mongoose = require('mongoose');
const taskSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: [true, 'Please add a title'] },
    description: { type: String },
    status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    dueDate: { type: Date }
}, { timestamps: true });
taskSchema.index({ user: 1, status: 1, priority: 1, dueDate: 1 });
taskSchema.index({ title: 'text' });
module.exports = mongoose.model('Task', taskSchema);
