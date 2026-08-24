import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { STAGE2_SET_DEFINITIONS } from "../../stage2/setDefinitions";

type Theory = { id:string; category:string; question:string; keyPoints:string[]; fullAnswer:string; activeForRandomization:boolean };
type Practical = { id:string; category:string; practicalKind:string; question:string; openingCue:string; steps:string[]; checklist:{id:string;text:string}[]; fullAnswer:string; activeForRandomization:boolean };
type Data = { theory:Theory[]; practical:Practical[] };
type PoolItem = { kind:"theory"|"practical"; q:Theory|Practical };

function normalizeText(text:string){return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g," ").trim();}
function matchScore(anchor:string,candidate:string){const a=normalizeText(anchor),c=normalizeText(candidate);if(!a||!c)return 0;if(c.includes(a))return 10000+a.length;const tokens=a.split(" ").filter(x=>x.length>=3);if(!tokens.length)return 0;const ct=new Set(c.split(" "));const hit=tokens.filter(x=>ct.has(x)).length;const coverage=hit/tokens.length;const bonus=tokens.length>=3&&c.includes(tokens.slice(0,3).join(" "))?20:0;return coverage*100+bonus;}
function find(anchor:string,pool:PoolItem[]): (PoolItem & {score:number}) | null {let best:PoolItem|null=null,bestScore=0;for(const item of pool){const s=matchScore(anchor,item.q.question);if(s>bestScore){bestScore=s;best=item;}}return best&&bestScore>=55?{...best,score:bestScore}:null;}

export async function GET(){
  const names=["data_v2.txt","data_v2_02.txt","data_v2_03.txt","data_v2_04.txt"];
  const encoded=names.map(n=>fs.readFileSync(path.join(process.cwd(),"public","stage2",n),"utf8")).join("").replace(/\s+/g,"");
  const data=JSON.parse(zlib.gunzipSync(Buffer.from(encoded,"base64")).toString("utf8")) as Data;
  const pool:PoolItem[]=[...data.theory.map(q=>({kind:"theory" as const,q})),...data.practical.map(q=>({kind:"practical" as const,q}))];
  const result=STAGE2_SET_DEFINITIONS.filter(s=>s.number>=11&&s.number<=20).map(s=>({number:s.number,questions:s.questionAnchors.map(anchor=>{const match=find(anchor,pool);if(!match)return{anchor,match:null};const q=match.q;return{anchor,kind:match.kind,score:match.score,id:q.id,category:q.category,question:q.question,keyPoints:"keyPoints" in q?q.keyPoints:undefined,fullAnswer:q.fullAnswer,openingCue:"openingCue" in q?q.openingCue:undefined,steps:"steps" in q?q.steps:undefined,checklist:"checklist" in q?q.checklist:undefined};})}));
  return NextResponse.json(result);
}
