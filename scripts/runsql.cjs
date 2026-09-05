const fs=require('fs'); const {Client}=require('pg');
const notes=fs.readFileSync('C:/Users/USER/shiplink/.env.production.notes','utf8');
const pw=(notes.match(/SUPABASE_DB_PASSWORD=(.+)/)||[])[1].trim();
const sql=fs.readFileSync(process.argv[2],'utf8');
const c=new Client({host:'aws-0-us-east-1.pooler.supabase.com',port:5432,
  user:'postgres.ojsmhlsabljntvkvicgc',password:pw,database:'postgres',
  ssl:{rejectUnauthorized:false},connectionTimeoutMillis:20000});
(async()=>{
  await c.connect();
  try{ await c.query(sql); console.log('SQL OK:', process.argv[2]); }
  catch(e){ console.error('SQL FAIL:', e.message); process.exitCode=1; }
  const {rows}=await c.query("select tablename from pg_tables where schemaname='public' and tablename like 'math%' order by 1");
  console.log('math tables:', rows.map(r=>r.tablename).join(', '));
  await c.end();
})();
