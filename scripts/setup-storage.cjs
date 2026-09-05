const fs=require('fs');
const e=Object.fromEntries(fs.readFileSync('C:/Users/USER/shiplink/.env.local','utf8')
  .split('\n').filter(l=>l.includes('=')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim()]}));
const U=e.NEXT_PUBLIC_SUPABASE_URL, S=e.SUPABASE_SERVICE_ROLE_KEY;
const H={apikey:S,Authorization:'Bearer '+S,'Content-Type':'application/json'};
(async()=>{
  let r=await fetch(U+'/storage/v1/bucket',{method:'POST',headers:H,body:JSON.stringify({
    id:'math-bible',name:'math-bible',public:true,file_size_limit:52428800,
    allowed_mime_types:null})});
  console.log('create bucket:', r.status, (await r.text()).slice(0,160));
  r=await fetch(U+'/storage/v1/bucket',{headers:H});
  console.log('buckets:', JSON.stringify((await r.json()).map(b=>({id:b.id,public:b.public}))));
})();
