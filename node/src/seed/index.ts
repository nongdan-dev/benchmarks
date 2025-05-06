import { Post, User } from "../shared/sequelize";

export const email: string = "test@gmail.com";

export const seedAdmin = async () => {
//  -------------------------- User -------------------------------
  const users = [
    {
      email,
      name: "test",
    },
  ];

  // Upsert user(s)
  await User.bulkCreate(users, {
    updateOnDuplicate: ["name"],
  });




//  -------------------------- Post -------------------------------
  const user = await User.findOne({
    where: { email },
  }).then(e => e?.toJSON());

  if (!user) throw new Error("User creation failed");
  const posts = [
    {
      title: "title 11111 test",
      content: "content111111 test",
      description: "description111111 test",
      userId: user.id,
    },
  ];

  // Upsert post(s)
  await Post.bulkCreate(posts, {
    updateOnDuplicate: ["content", "description"],
  });

  console.log("Seeding completed.");
};
