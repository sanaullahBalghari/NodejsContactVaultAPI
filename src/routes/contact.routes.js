import { Router } from "express";
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
} from "../controllers/contact.controller.js";
import { contactValidationRules, validate } from "../middlewares/validation.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// GET all
router.get("/", protect,getAllContacts);

// GET by ID
router.get("/:id", protect,getContactById);

// POST new contact
router.post("/", protect, contactValidationRules, validate, createContact);

// PUT update contact
router.put("/:id",protect, contactValidationRules, validate, updateContact);

// DELETE contact
router.delete("/:id",protect, deleteContact);

export default router;
