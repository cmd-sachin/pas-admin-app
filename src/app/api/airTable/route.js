import { NextResponse } from "next/server";
import Airtable from "airtable";
export async function GET() {
  try {
    const base = new Airtable({
      apiKey: process.env.accessTokenKey,
    }).base(process.env.baseKey);
    let allRecords = [];
    const records = await new Promise((resolve, reject) => {
      const tempRecords = [];
      base("Candidate")
        .select({ view: "Grid view" })
        .eachPage(
          (records, fetchNextPage) => {
            records.forEach((record) => {
              const fields = record.fields;

              tempRecords.push(fields);
            });
            fetchNextPage();
          },
          (err) => {
            if (err) {
              reject(err);
            } else {
              resolve(tempRecords);
            }
          }
        );
    });

    return NextResponse.json({ data: records });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
