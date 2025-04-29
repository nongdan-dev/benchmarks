// import express, { Request, Response } from "express";
// import "dotenv/config";
// import "express-async-errors";
// import { sequelize } from "./db.js";
// import { User } from "./models/User.js";

// process.on("uncaughtException", (err) => {
//   console.error("Uncaught Exception:", err);
// });

// process.on("unhandledRejection", (err) => {
//   console.error("Unhandled Rejection:", err);
// });

// const PORT = process.env.PORT || 4000;

// const startServer = async () => {
//   const app = express();

//   app.use(express.json());
//   app.use(express.urlencoded({ extended: false }));

//   try {
//     await sequelize.authenticate();
//     console.log("Database connected.");

//     await sequelize.sync({ alter: true });
//     console.log("Database synced.");
//   } catch (error) {
//     console.error("Database connection failed:", error);
//     process.exit(1);
//   }

//   app.get("/users", async (_req: Request, res: Response) => {
//     const users = await User.findAll();
//     return res.status(200).json(users.map((u) => u.toJSON()));
//   });

//   app.post("/create", async (req: Request, res: Response) => {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "Missing params" });
//     }

//     const user = await User.create({ name, email, password });
//     return res.status(201).json(user.toJSON());
//   });

//   app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//   });
// };

// startServer().catch((err) => {
//   console.error("Failed to start server:", err);
// });
