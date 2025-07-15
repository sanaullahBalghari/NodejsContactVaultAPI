import { Router } from "express";
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact
} from "../controllers/contact.controller.js";

const router = Router();

// GET all
router.get("/", getAllContacts);

// GET by ID
router.get("/:id", getContactById);

// POST new contact
router.post("/", createContact);

// PUT update contact
router.put("/:id", updateContact);

// DELETE contact
router.delete("/:id", deleteContact);

export default router;
