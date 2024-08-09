import User from "../models/UserModel.js";

export const searchContacts = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;
    if (searchTerm || undefined || searchTerm === null) {
      return res.status(400).send("searchTerm is required.");
    }

    //  to remove special characters
    const sanitizedSearchTerm = searchTerm?.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },

        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });

    // console.log(contacts, "CONTACTS");
    return res.status(200).json({
      status: 1,
      data: contacts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error.");
  }
};
