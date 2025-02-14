import { NextResponse } from "next/server";
import Airtable from "airtable";
export async function GET() {
  try {
    const base = new Airtable({
      apiKey:
        "patyfDcedyFIgbnAE.d453878862966d0a8e6e210e2a57b2056aa6ce62f8d96ea597fc3d033b5a678e",
    }).base("appBZJKmKN3iViICl");
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
    console.log(records[0].detailedAnalysis);
    return NextResponse.json({ data: records });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
