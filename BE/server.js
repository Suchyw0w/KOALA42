const dotenv = require("dotenv");

// Load environment variables from config/.env file
dotenv.config({
    path: "./config/.env",
  });

// Import database connection
const { databaseConn } = require("./config/db.js");

// Error handling for uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Uncaught exception.... crash inc 💥");
  process.exit(1);
});

const app = require("./app");

// Connect to the database
databaseConn();

// Start the server
const server = app.listen(process.env.APP_PORT || 3000, () => {

  console.log(`⠀⠀⠀⣠⠖⠚⠉⠙⠲⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⠾⠋⠉⠑⠢⣄⠀⠀⠀⠀⠀
⠀⢀⡞⠁⠀⠀⠀⠀⠀⠈⠓⠦⠤⠤⠴⠖⠒⠉⠉⠉⠉⠉⠉⠉⠒⠲⠦⠤⠤⠴⠟⠁⠀⠀⠀⠀⠀⠈⢷⡀⠀⠀⠀
⠀⣾⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣧⠀⠀⠀
⢸⡇⢀⡴⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢦⠀⢹⣆⠀⠀
⠈⢧⡞⣴⠄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣤⣶⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⡀⠀⠀⠀⠠⣤⢧⡾⠙⠀⠀
⠀⠈⢿⡇⠀⠀⠀⢠⠇⠀⠀⠀⠀⠀⠀⠀⠀⣾⣣⣿⣿⣿⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢳⠀⠀⠀⠀⢹⡾⠀⠀⠀⠀
⠀⠀⠘⣇⠀⠀⢀⡾⠀⠀⠀⠀⣾⣿⠀⠀⢸⣯⣿⣿⣿⣿⡇⠀⠀⣿⣷⠄⠀⠀⠀⠀⠈⣷⠀⠀⠀⣼⠁⠀⠀⠀⠀
⠀⠀⠀⠈⠳⠤⣼⠁⠀⠀⠀⠀⠈⠁⠀⠀⠸⣿⣿⣿⣿⣿⡇⠀⠀⠈⠉⠀⠀⠀⠀⠀⠀⠘⣧⠤⠞⠁⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⠻⠿⠿⠿⠟⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣹⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠘⠲⠴⠟⠦⠴⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⡟⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠹⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡴⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢦⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣶⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣸⠋⠁⠀⠀⠀⠀⠀⢀⡖⠚⣻⠀⠀⠀⠀⠀⠀⠀⠈⢻⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡏⠀⠀⠀⣾⠉⠙⢲⣼⡤⠞⠉⠀⠀⠀⢐⡆⠀⠀⠀⠈⣯⢧⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠇⠀⠀⠀⠈⣩⠉⠉⠙⣆⠀⠀⠀⠀⠀⣸⠇⠀⠀⠀⠀⢹⡈⢷⡄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⠀⠀⠀⠀⢰⡏⠀⠀⠀⠸⡆⠀⠀⣠⡶⠋⠀⠀⠀⠀⠀⢸⡇⠀⢿⡀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⡏⠀⠀⠀⠀⢸⡇⠀⠀⠀⢀⡿⠶⠋⠉⠀⠀⠀⠀⠀⠀⠀⣼⠃⠀⠘⣗⠲⣆⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢠⡖⠋⠙⠲⡇⠀⠀⠀⠀⢸⠀⣰⠤⢥⣿⠤⠤⠄⠀⠀⠀⠀⠀⣀⣤⠞⠁⠀⠀⠀⢹⡆⠛⢶⡄⠀⠀⠀
⠀⠀⠀⠀⡟⠀⠀⠀⠀⡇⠀⠀⠀⠀⢸⣸⠃⠀⠀⠙⢷⣖⣃⣠⡤⠴⠖⠋⠉⠀⠀⠀⠀⠀⠀⠈⣷⠀⡼⠃⠀⠀⠀
⠀⠀⠀⢸⡇⠀⠀⠀⠀⡇⠀⠀⠀⠀⢸⡟⠀⠀⠀⠀⠈⢧⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣠⠏⠀⠀⠀⠀
⠀⠀⠀⠈⣧⠀⠀⠀⠀⣷⠀⠀⠀⠀⣼⣇⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⡿⠋⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠘⣧⠀⠀⠀⢿⣀⡀⠀⠀⡿⢻⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡴⠟⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠈⠳⠤⠤⠼⢷⣇⣸⡾⠓⠚⠳⣄⣀⠀⠀⠀⠀⣀⣀⣀⣠⡤⠤⠴⠖⠛⠋⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`);
  console.log(`Server started on port ${process.env.APP_PORT || 3000}`);
});

// Error handling for unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled rejection.... crash inc 💥");
  server.close(() => {
    process.exit(1);
  });
});
