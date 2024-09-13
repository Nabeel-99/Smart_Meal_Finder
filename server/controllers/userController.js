import Joi from "joi";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

// validate user
const validate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().required().label("Email"),
    password: Joi.string().required().label("password"),
  });
  return schema.validate(data);
};
// create user
export const createUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    // check if there is no validation error
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    // use salt for enhanced security and bcrypt to hash the password
    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    // create user
    const newUser = new User({ ...req.body, password: hashPassword });
    await newUser.save();
    return res.status(200).json({ message: "user created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
