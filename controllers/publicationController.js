const db = require('../models');
const path = require('path');
const fs = require('fs/promises'); 
const Publication = db.publication
const { Op } = require('sequelize');
const User = db.user


exports.createPub = async (req, res) => {
  try {
    const { title, content } = req.body;

    const newPublication = await Publication.create({
      title: title,
      content: content,
      fileLink: req.filename,
      userId: req.body.userId,
      projectId: req.body.projectId,
      sectionId: req.body.sectionId,
      taskId: req.body.taskId,
    });

    if (newPublication) {
      return res.status(201).json({ message: 'Publication created successfully', publication: newPublication });
    } else {
      return res.status(400).json({ error: 'Failed to create publication' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error: ' + error });
  }
};


exports.getPublications = async (req, res) => {
  try {
    const userId = req.params.userId;

    const publications = await Publication.findAll({
      include: [{ model: User, attributes: ['id', 'username', 'email'] }],
      where: {
        userId: { [Op.ne]: userId } // Exclude publications by the specified user
      }
    });

    if (publications.length === 0) {
      return res.status(204).json({ message: 'Aucune publication faite' });
    } else {
      return res.status(200).json({ publications });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error: ' + error });
  }
};


exports.getProjectPublications = async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const publications = await Publication.findAll({
      include: [{ model: User, attributes: ['id', 'username', 'email'] }],
      where: {
        projectId: projectId
      },
      order: [['createdAt', 'DESC']] // Order by createdAt in descending order
    });

    if (publications.length === 0) {
      return res.status(204).json({ message: 'Aucune publication pour ce projet' });
    } else {
      return res.status(200).json({ publications });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error: ' + error });
  }
};
 