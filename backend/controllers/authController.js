import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { logActivity } from '../middleware/auditMiddleware.js';

const getJwtSecret = () => process.env.JWT_SECRET || 'secret123';

const createToken = (user) => jwt.sign(
  { id: user._id.toString(), email: user.email, role: user.role },
  getJwtSecret(),
  { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
);

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with that email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'User'
    });

    return res.status(201).json({
      message: 'User registered successfully.',
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
      token: createToken(user)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Registration failed.', error: error.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // FIX: 'super-admin' සහ 'super admin' validation check එකට එකතු කළා
    const allowedRoles = ['user', 'admin', 'super-admin', 'super admin'];
    const cleanRole = role ? role.toLowerCase().trim() : '';

    if (!username || !email || !password || !allowedRoles.includes(cleanRole)) {
      return res.status(400).json({ message: 'Username, email, password, and a valid role are required.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'A user with that email already exists.' });
    }

    // Role mapping to clean Database string format
    let assignedRole = 'User';
    if (cleanRole === 'admin') assignedRole = 'Admin';
    if (cleanRole === 'super-admin' || cleanRole === 'super admin') assignedRole = 'Super Admin';

    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
      role: assignedRole
    });

    await logActivity('USER_CREATED', req.user, user.username, { role: user.role, email: user.email }, req);
    return res.status(201).json({
      message: 'User created successfully.',
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (error) {
    return res.status(500).json({ message: 'User creation failed.', error: error.message });
  }
};

export const listUsers = async (_req, res) => {
  try {
    const users = await User.find({}, 'username email role createdAt').sort({ createdAt: -1 });
    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load users.', error: error.message });
  }
};

export const resetUserPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters.' });
    }

    const user = await User.findById(req.params.id).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();
    await logActivity('PASSWORD_RESET', req.user, user.username, { userId: user._id.toString() }, req);

    return res.json({ message: `Password reset successfully for ${user.username}.` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to reset user password.' });
  }
};

export const login = async (req, res) => {
  try {
    const { identifier, username, email, password } = req.body;
    const loginIdentifier = (identifier || username || email || '').trim();

    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: 'Username/email and password are required.' });
    }

    const user = await User.findOne({
      $or: [{ email: loginIdentifier.toLowerCase() }, { username: loginIdentifier }]
    }).select('+password');
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    return res.json({
      message: 'Login successful.',
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
      token: createToken(user)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Login failed.', error: err.message });
  }
};