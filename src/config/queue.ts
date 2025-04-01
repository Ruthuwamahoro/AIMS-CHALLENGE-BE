const Bull = require('bull');
const File = require('../models/file.model');
const fs = require('fs').promises;

const fileQueue = new Bull('file-queue', {
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
});

fileQueue.process(async (job) => {
  const { type, data } = job.data;

  if (type === 'delete') {
    await File.deleteOne({ _id: data.fileId });

    await fs.unlink(data.filePath).catch((err) => {
      console.error(`Error deleting file from disk: ${err.message}`);
    });
  } else if (type === 'share') {
    const file = await File.findOne({ _id: data.fileId });
    if (!file) throw new Error('File not found during sharing task');

    if (!file.sharedWith.includes(data.userId)) {
      file.sharedWith.push(data.userId);
      await file.save();
    }
  } else {
    console.error(`Unknown job type: ${type}`);
  }
});

module.exports = fileQueue;
