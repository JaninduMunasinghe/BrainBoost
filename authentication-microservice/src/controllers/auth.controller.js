import jwt from "jsonwebtoken";
import User from "../schemas/user.schema.js";

const generateToken = (res, userId, role) => {
  const jwtSecret = process.env.JWT_SECRET;
  const token = jwt.sign({ userId, role }, jwtSecret, {
    expiresIn: "24h",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
  });

  return token;
};

const clearToken = (res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
};

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const token = generateToken(res, user._id, user.role);
    res.send({ token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

async function register(req, res) {
  try {
    const { name, email, password, NIC, role } = req.body;
    const user = new User({ name, email, password, NIC, role });
    await user.save();
    res.status(201).json({
      message: "User created",
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

//logout
function logout(req, res) {
  clearToken(res);
  res.send("Logged out");
}

async function getLearnerById(req, res) {
  try {
    const userId = req.params.id;

    console.log(userId);

    const user = await User.findById(userId);

    if (user) {
      if (user.role.match("learner")) {
        const { id, email, role } = user;
        res.json({ id, email, role });
      } else {
        res.status(403).json({ error: "Not a valid Learner ID!" });
      }
    } else {
      res.status(404).json({ error: "User Not Found!" });
    }
  } catch (error) {
    console.error("Error Occurred:", error.message);
    res.status(500).json({ error: "Internal Server Error!" });
  }
}

export { login, register, logout, getLearnerById };
