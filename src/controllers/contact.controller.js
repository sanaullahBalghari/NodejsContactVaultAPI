import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Contact } from "../models/contact.model.js";

// ================= GET all contacts =================
export const getAllContacts = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;

  // ✅ always filter by logged-in user
  let filter = { user: req.user._id };

  // ✅ search condition
  if (search) {
    const regex = new RegExp(search, "i");
    filter.$or = [
      { name: regex },
      { email: regex },
      { phone: regex },
      { occupation: regex }
    ];
  }

  const skip = (page - 1) * limit;

  const contacts = await Contact.find(filter)
    .skip(Number(skip))
    .limit(Number(limit));

  const total = await Contact.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        contacts,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
      "Contacts fetched successfully"
    )
  );
});

// ================= GET single contact =================
export const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findOne({
    _id: req.params.id,
    user: req.user._id, // ✅ ensure belongs to logged-in user
  });

  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, contact, "Contact fetched successfully"));
});

// ================= CREATE contact =================
export const createContact = asyncHandler(async (req, res) => {
  const { name, phone, email, address, occupation } = req.body;

  if (!name || !phone) {
    throw new ApiError(400, "Name and phone are required");
  }

  // ✅ check duplicate for same user
  const existing = await Contact.findOne({ name, phone, user: req.user._id });
  if (existing) {
    throw new ApiError(409, "Contact with this name and phone already exists");
  }

  const newContact = await Contact.create({
    name,
    phone,
    email,
    address,
    occupation,
    user: req.user._id, // ✅ assign logged-in user
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newContact, "Contact created successfully"));
});

// ================= UPDATE contact =================
export const updateContact = asyncHandler(async (req, res) => {
  const { name, phone, email, address, occupation } = req.body;

  // ✅ find contact with user ownership
  const contact = await Contact.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  // ✅ update fields
  contact.name = name || contact.name;
  contact.phone = phone || contact.phone;
  contact.email = email || contact.email;
  contact.address = address || contact.address;
  contact.occupation = occupation || contact.occupation;

  const updatedContact = await contact.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedContact, "Contact updated successfully"));
});

// ================= DELETE contact =================
export const deleteContact = asyncHandler(async (req, res) => {
  // ✅ find contact with user ownership
  const contact = await Contact.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  await contact.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Contact deleted successfully"));
});
