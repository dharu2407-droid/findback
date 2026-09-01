const express = require("express");
const multer = require("multer");
const Item = require("../models/item");

const router = express.Router();

// =========================
// IMAGE UPLOAD SETTINGS
// =========================

// Vercel local filesystem is read-only.
// Use memory storage instead of saving files to /uploads.
const upload = multer({
  storage: multer.memoryStorage()
});

// =========================
// GET ALL / SEARCH ITEMS
// =========================

router.get("/", async (req, res) => {
  try {
    const {
      search,
      type,
      category,
      location
    } = req.query;

    const query = {};

    if (type) {
      query.type = type;
    }

    if (category) {
      query.category = {
        $regex: category,
        $options: "i"
      };
    }

    if (location) {
      query.location = {
        $regex: location,
        $options: "i"
      };
    }

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i"
          }
        },
        {
          description: {
            $regex: search,
            $options: "i"
          }
        },
        {
          category: {
            $regex: search,
            $options: "i"
          }
        },
        {
          location: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    const items = await Item
      .find(query)
      .sort({ createdAt: -1 });

    res.json({
      count: items.length,
      items: items
    });

  } catch (error) {
    console.error("GET ITEMS ERROR:", error);

    res.status(500).json({
      message: "Failed to load items"
    });
  }
});

// =========================
// POST ITEM
// =========================

router.post(
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("POST /api/items received");
      console.log("Body:", req.body);
      console.log(
        "Image:",
        req.file ? req.file.originalname : "No image"
      );

      if (!req.body) {
        return res.status(400).json({
          message: "No form data received."
        });
      }

      const {
        title,
        description,
        category,
        location,
        type,
        contactName,
        contactEmail,
        contactPhone
      } = req.body;

      if (
        !title ||
        !description ||
        !category ||
        !location ||
        !type ||
        !contactName ||
        !contactEmail ||
        !contactPhone
      ) {
        return res.status(400).json({
          message: "Please fill all required fields."
        });
      }

      // Image is received in memory for now.
      // Permanent cloud image storage will be added next.
      const image = null;

      const item = await Item.create({
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        location: location.trim(),
        type: type,
        image: image,
        contactName: contactName.trim(),
        contactEmail: contactEmail.trim().toLowerCase(),
        contactPhone: contactPhone.trim()
      });

      res.status(201).json({
        message: "Item posted successfully!",
        item: item
      });

    } catch (error) {
      console.error("POST ITEM ERROR:", error);

      res.status(400).json({
        message: error.message || "Failed to post item"
      });
    }
  }
);

module.exports = router;
