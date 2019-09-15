import mongoose from "mongoose";

export type DbClient = mongoose.Mongoose;

export async function getDatabaseClient(dbHost: string, dbName: string) {
	return new Promise<DbClient>((resolve, reject) => {
		const connString = `mongodb://${dbHost}/${dbName}`;
		mongoose.connect(connString, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			useCreateIndex: true
		});
		const db = mongoose.connection;
		db.on("error", (e: Error) => {
			console.error("Db connection error:", e);
			reject(e);
		});
		db.once("open", () => {
			console.log("Db connection success:", connString);
			resolve(mongoose);
		});
	});
}
