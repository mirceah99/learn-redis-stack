import fs from "fs";
import csv from "csv-parser";

const results = [];

export const data = new Promise((resolve,reject)=>{
    fs.createReadStream("./some-sample-data.csv")
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        resolve(results);
      });
})
// export const data = getData();