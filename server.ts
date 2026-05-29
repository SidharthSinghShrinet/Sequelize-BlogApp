import app from "./app.ts";
import sequelize from "./config/db.ts";

async function startConnection() {
  try {
    // 1. Authenticate
    await sequelize.authenticate();
    console.log("🔗 Connection has been established successfully.");
    // 2. Sync
    await sequelize.sync();
    console.log("👌 All models were synchronized successfully:- DEFAULT MODE");
    // 3. Sync with alter: Uncomment the below lines to enable alter mode. This will automatically update the database schema to match the models without dropping tables. Use with caution in production environments.
    // await sequelize.sync({ alter: true });
    // console.log("👌 All models were synchronized successfully:- ALTER MODE");
    // 4. Start Server
    app.listen(process.env.PORT, (err) => {
      if (err) throw err;
      console.log("✅ Server is running on port: " + process.env.PORT);
    });
  } catch (e) {
    console.error("Error occurred while starting the connection:", e);
    process.exit(1);
  }
}

startConnection()
  .then(() => {
    console.log(
      "✅ Database connection established and server started successfully.",
    );
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
