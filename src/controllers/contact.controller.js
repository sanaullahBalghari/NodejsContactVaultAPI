import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Contact } from "../models/contact.model.js";

//  GET all contacts
export const getAllContacts = asyncHandler(async (req, res) => {
  // 📌 Query params
  const { search, page = 1, limit = 10 } = req.query;
  let filter = {};

  // 📌 Search filter
  if (search) {
    const regex = new RegExp(search, "i"); // i = case-insensitive
    filter = {
      $or: [
        { name: regex },
        { email: regex },
        { phone: regex },
        { occupation: regex }
      ]
    };
  }

  // 📌 Pagination calculation
  const skip = (page - 1) * limit;

  // 📌 Fetch contacts with filter + pagination
  const contacts = await Contact.find(filter)
    .skip(Number(skip))
    .limit(Number(limit));

  // 📌 Total count for matched documents
  const total = await Contact.countDocuments(filter);

  // 📌 Send response
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        contacts,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      },
      "Contacts fetched successfully"
    )
  );
});


//  GET single contact by ID
export const getContactById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const contact = await Contact.findById(id);

  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, contact, "Contact fetched successfully"));
});

//create a contact
export const createContact = asyncHandler(async (req, res) => {
  const {name, phone, email, address, occupation} = req.body;

  if (!name || !phone) {
    throw new ApiError(400, "Name and phone are requried");
  }

  const existing = await Contact.findOne({ name: name, phone: phone, user: req.user._id });

  if (existing) {
    return res.status(409).json({
      success: false,
      message: "Contact with this name and phone already exists",
    });
  }
  

  const newContact = await Contact.create({ name, phone });
  return res
    .status(201)
    .json(new ApiResponse(201, newContact, "Contact created successfully"));
});

// update contact

export const updateContact = asyncHandler(async (req, res) => {
  const id = req.params.id;

  const { name, phone, email, address, occupation } = req.body;

  let updatedContact = await Contact.findByIdAndUpdate(
    id,
    { name, phone, email, address, occupation},
    { new: true, runValidators: true }
  );

  if (!updatedContact) {
    throw new ApiError(404, "Contact not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedContact, "Contact updated successfully"));
});

//  DELETE contact
export const deleteContact = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const deletedContact = await Contact.findByIdAndDelete(id);

  if (deletedContact === -1) {
    throw new ApiError(404, "Contact not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deletedContact, "Contact deleted successfully"));
});
