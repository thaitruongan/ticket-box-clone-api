const Permission = require("../models/permission-model");
const mongoose = require("mongoose");

const permissionController = {
  list: async (req, res) => {
    try {
      const permissions = await Permission.find();
      res.status(200).json({
        message: "Success",
        data: permissions,
      });
    } catch (err) {
      res.status(400).json(err);
    }
  },
  getById: async (req, res) => {
    try {
      const permission = await Permission.findById(req.params.id);
      if (!permission) {
        return res.status(404).json({
          message: "Permission Not Found!",
        });
      }
      return res.status(200).json({
        message: "Success",
        data: permission,
      });
    } catch (err) {
      res.status(400).json(err);
    }
  },
  create: async (req, res) => {
    req.body.createBy = req.user.id;
    const newPermission = new Permission(req.body);
    try {
      await newPermission.save();
      res.status(200).json({
        message: "Success",
        data: newPermission,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: "Failed",
        error: err,
      });
    }
  },
  delete: async (req, res) => {
    try {
      const permission = await Permission.findById(req.params.id);
      if (!permission) {
        return res.status(404).send({
          message: "Permission Not Found!",
        });
      } else {
        try {
          await permission.delete();
          res.status(200).json({
            message: "Success! Permission has been deleted",
          });
        } catch (err) {
          res.status(500).json({
            message: "Failed",
            error: err,
          });
        }
      }
    } catch (err) {
      res.status(400).json({
        message: "Failed",
        error: err,
      });
    }
  },

  async isExists(filter) {
    console.log(typeof filter, filter);
    return Permission.findOne(filter).select("_id").lean();
  },
};

module.exports = permissionController;
