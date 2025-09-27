const dotenv = require("dotenv");
dotenv.config({
  path: "./config/.env",
});

const { Sequelize } = require("sequelize");

const inspectDatabase = async () => {
  const sequelize = new Sequelize(process.env.DB_URI, {
    dialect: "postgres",
    logging: false
  });

  try {
    await sequelize.authenticate();
    console.log("Database connected.\n");

    // Check each of the expected tables
    const expectedTables = ["character", "nemesis", "secret"];

    for (const tableName of expectedTables) {
      console.log(`Table: ${tableName}`);
      try {
        const [columns] = await sequelize.query(`
          SELECT 
            column_name, 
            data_type, 
            is_nullable
          FROM information_schema.columns 
          WHERE table_name = '${tableName}' 
          ORDER BY ordinal_position;
        `);

        console.table(columns);
      } catch (error) {
        console.log(`Error table '${tableName}': `, error.message);
      }
    }
  } catch (error) {
    console.error("Error connecting to db: ", error.message);
  } finally {
    await sequelize.close();
  }
};

inspectDatabase();
