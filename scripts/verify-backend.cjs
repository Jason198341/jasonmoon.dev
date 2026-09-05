const fs=require('fs');
const e=Object.fromEntries(fs.readFileSync('C:/Users/USER/shiplink/.env.local','utf8')
  .split('\n').filter(l=>l.includes('=')).map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim()]}));
const {createClient}=require('@supabase/supabase-js');
const sb=createClient(e.NEXT_PUBLIC_SUPABASE_URL, e.NEXT_PUBLIC_SUPABASE_ANON_KEY);
const PASS='rnrud9881@@HH';
const ok=(n,er,extra='')=>console.log((er?'FAIL':'PASS').padEnd(5), n, er?('- '+er.message).slice(0,90):extra);
(async()=>{
  let r;
  r=await sb.rpc('math_check',{p_pass:PASS});           ok('math_check(정답)', r.error, '=> '+r.data);
  r=await sb.rpc('math_check',{p_pass:'wrong'});        ok('math_check(오답)', r.error, '=> '+r.data);
  r=await sb.rpc('math_stats');                          ok('math_stats', r.error, JSON.stringify(r.data));

  // 쓰기 차단 확인 (RLS)
  r=await sb.from('math_posts').insert({title:'x',body:'y'});
  ok('직접 INSERT 차단됨', r.error?null:{message:'차단 안 됨!'}, r.error?'(정상 차단)':'');

  // RPC 쓰기
  r=await sb.rpc('math_post_add',{p_pass:PASS,p_category:'notice',p_title:'연결 테스트',p_body:'백엔드 검증',p_author:'아빠',p_concept_id:null});
  ok('math_post_add', r.error); const postId=r.data;
  r=await sb.rpc('math_comment_add',{p_pass:PASS,p_post_id:postId,p_author:'아빠',p_body:'댓글 테스트'});
  ok('math_comment_add', r.error);
  r=await sb.rpc('math_progress_set',{p_pass:PASS,p_concept_id:'e-dec',p_status:'doing',p_mastery:2});
  ok('math_progress_set', r.error);
  r=await sb.rpc('math_record_add',{p_pass:PASS,p_concept_id:'e-dec',p_session_date:null,p_who:'세연',
    p_blank_before:'백지 전',p_blank_after:'백지 후',p_self_score:3,p_note:'테스트',p_images:[]});
  ok('math_record_add', r.error); const recId=r.data;
  r=await sb.rpc('math_journal_add',{p_pass:PASS,p_entry_date:null,p_title:'첫 일지',p_body:'테스트',p_mood:'good',p_concept_ids:['e-dec']});
  ok('math_journal_add', r.error); const jId=r.data;
  r=await sb.rpc('math_note_save',{p_pass:PASS,p_id:null,p_concept_id:'e-dec',p_lv:'E',p_title:'노트 테스트',p_body:'# 소수',p_tags:['test']});
  ok('math_note_save', r.error); const nId=r.data;

  // 잘못된 패스코드 차단
  r=await sb.rpc('math_post_add',{p_pass:'nope',p_category:'thought',p_title:'x',p_body:'y',p_author:'z',p_concept_id:null});
  ok('잘못된 패스코드 거부', r.error?null:{message:'거부 안 됨!'}, r.error?'(정상 거부)':'');

  // 읽기
  r=await sb.from('math_posts').select('*').limit(5);   ok('공개 읽기 math_posts', r.error, 'rows='+(r.data?.length));
  r=await sb.from('math_records').select('*');          ok('공개 읽기 math_records', r.error, 'rows='+(r.data?.length));

  // 스토리지 업로드/다운로드
  const path='test/'+Date.now()+'.txt';
  r=await sb.storage.from('math-bible').upload(path, new Blob(['백지 훈련 테스트 파일']), {contentType:'text/plain'});
  ok('storage upload', r.error);
  const {data:pub}=sb.storage.from('math-bible').getPublicUrl(path);
  const dl=await fetch(pub.publicUrl);
  ok('storage public download', dl.ok?null:{message:'status '+dl.status}, await dl.text());

  // 정리
  await sb.rpc('math_post_delete',{p_pass:PASS,p_id:postId});
  await sb.rpc('math_record_delete',{p_pass:PASS,p_id:recId});
  await sb.rpc('math_journal_delete',{p_pass:PASS,p_id:jId});
  await sb.rpc('math_note_delete',{p_pass:PASS,p_id:nId});
  r=await sb.rpc('math_stats'); console.log('\n정리 후 stats:', JSON.stringify(r.data));
})();
