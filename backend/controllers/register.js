const registerUser = async (req, res) => {
    const { username, email, password, userType } = req.body;
}

try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hashedPassword,
        userType
    })
} catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Internal server error" });
}