// Temporary in-memory contacts
let contacts = [
  { id: 1, name: "Ali", phone: "123456" },
  { id: 2, name: "Sara", phone: "987654" }
];




//  GET all contacts 
export const getAllContacts = asyncHandler(async (req, res) => {
 
  return res
    .status(200)
    .json(new ApiResponse(200, contacts, "Contacts fetched successfully"));
});

//  GET single contact by ID
export const getContactById = asyncHandler(async (req, res) => {
  const { id }= req.params
  const contact = contacts.find(c => c.id === Number(id));

  if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, contact, "Contact fetched successfully"));
});

export const createContact=asyncHandler(async(req, res)=>{

  const {name, phone}=res.body 

  if(!name || ! phone){
    throw new ApiError(400,"Name and phone are requried")
  }

  const newContact={
    id:contacts.length + 1,
    name,
    phone

  }

  contacts.push(newContact);
   return res
    .status(201)
    .json(new ApiResponse(201, newContact, "Contact created successfully"));

})

export const updateContact=asyncHandler(async(req, res)=>{

  const{id}=req.params

  const {name, phone}=res.body

  let contact=contacts.find(c=> c.id== Number(id))

   if (!contact) {
    throw new ApiError(404, "Contact not found");
  }

  if(name) contacts.name=name
  if(phone)contacts.phone=phone

    return res
    .status(200)
    .json(new ApiResponse(200, contact, "Contact updated successfully"));
})

// 👉 DELETE contact
export const deleteContact = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const contactIndex = contacts.findIndex(c => c.id === id);

  if (contactIndex === -1) {
    throw new ApiError(404, "Contact not found");
  }

  const deletedContact = contacts[contactIndex];
  contacts.splice(contactIndex, 1);

  return res
    .status(200)
    .json(new ApiResponse(200, deletedContact, "Contact deleted successfully"));
});