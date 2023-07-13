const db = require('../models');
const Role = db.role;

exports.postRole = async (req, res) => {
  try {
    const roleName = req.body.roleName;
    const roles = ['admin', 'client', 'developer'];

    const searchRole = await Role.findOne({ where: { roleName: roleName } });

    if (searchRole) {
      return res.status(401).json({ error: "Role already exists" });
    } else {
      if (!roles.includes(roleName)) {
        return res.status(401).json({ message: 'Unauthorized role' });
      } else {
        const createdRole = await Role.create({ roleName: roleName });
        return res.status(200).json({ createdRole });
      }
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
