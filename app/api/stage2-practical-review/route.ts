import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { STAGE2_ANSWER_OVERRIDES } from "../../stage2/answerOverrides";
import { STAGE2_ANSWER_OVERRIDES_11_20 } from "../../stage2/answerOverrides11to20";
import { STAGE2_ANSWER_OVERRIDES_21_34 } from "../../stage2/answerOverrides21to34";

type Practical = { id:string; category:string; practicalKind:string; question:string; openingCue:string; steps:string[]; checklist:{id:string;text:string}[]; fullAnswer:string; activeForRandomization:boolean };
type Data = { practical:Practical[] };

export async function GET(){
  const names=["data_v2.txt","data_v2_02.txt","data_v2_03.txt","data_v2_04.txt"];
  const encoded=names.map(n=>fs.readFileSync(path.join(process.cwd(),"public","stage2",n),"utf8")).join("").replace(/\s+/g,"");
  const data=JSON.parse(zlib.gunzipSync(Buffer.from(encoded,"base64")).toString("utf8")) as Data;
  const practical=data.practical.map(q=>({
    ...q,
    ...(STAGE2_ANSWER_OVERRIDES[q.id]??{}),
    ...(STAGE2_ANSWER_OVERRIDES_11_20[q.id]??{}),
    ...(STAGE2_ANSWER_OVERRIDES_21_34[q.id]??{}),
  }));
  return NextResponse.json(practical);
}
