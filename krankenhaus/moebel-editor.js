/* Klinik am Park – eigenständiger, einfacher Möbel-Baumodus.
   Bestehende Möbel, Baupläne, Kamera und die Inselreich-Spiele bleiben unverändert. */
export function setupFurniture(ctx){
 const {THREE,roomSpecs,roomGroups,roomAt,groundHit,renderer,scene,stage,
  mat,box,cylinder,sphere,white,black,teal,tealLight,oak,oakDark,soil,
  gold,leaf,leaf2,glass,chairBlue,screenMat,setCameraMode,stopOther}=ctx;
 const catalog=[
  ['stuhl','alltag','🪑','Stuhl',.55,.55],
  ['bank','alltag','🛋️','Sitzbank',1.35,.60],
  ['tisch','alltag','🪵','Tisch',.95,.70],
  ['sofa','alltag','🛋️','Sofa',1.45,.72],
  ['tresen','alltag','🧑‍💻','Tresen',1.85,.85],
  ['computer','alltag','💻','Computer',.65,.53],
  ['wasser','alltag','🚰','Wasserspender',.46,.46],
  ['liege','medizin','🩺','Untersuchungsliege',.94,1.70],
  ['bett','medizin','🛏️','Krankenbett',1.10,1.90],
  ['monitor','medizin','🖥️','Monitor',.55,.49],
  ['wagen','medizin','🛒','Medizinwagen',.70,.58],
  ['schrank','medizin','🗄️','Medizinschrank',.90,.50],
  ['becken','medizin','🚰','Waschbecken',.80,.54],
  ['spender','medizin','🧴','Desinfektion',.36,.36],
  ['pflanze','deko','🪴','Pflanze',.63,.63],
  ['lampe','deko','💡','Stehlampe',.44,.44],
  ['eimer','deko','🗑️','Mülleimer',.44,.44],
  ['schild','deko','🪧','Hinweisschild',.90,.36]
 ].map(([key,category,icon,label,w,d])=>({key,category,icon,label,w,d}));
 const types=new Map(catalog.map(v=>[v.key,v]));
 const records=new Map(),history=[];
 const storageKey='klinik-am-park-moebel-v1';
 let open=false,category='alltag',chosen='stuhl',selected=null,nextId=0;
 const panel=document.getElementById('furniturePanel');
 const toggle=document.getElementById('toggleFurniture');
 const hint=document.getElementById('furnitureHint');
 const display=document.getElementById('status');
 const items=document.getElementById('furnitureItems');
 const rotate=document.getElementById('furnitureRotate');
 const remove=document.getElementById('furnitureDelete');
 const undo=document.getElementById('furnitureUndo');
 const material={
  frame:mat(0x4b858a,.65),steel:mat(0x80979d,.48,.3),
  pale:mat(0xf0f4ef,.84),fabric:mat(0x7eafb9,.9),dark:mat(0x365a65),
  blanket:mat(0x9acbc5,.9),brown:mat(0xc79b6a,.83)
 };
 const selectionMaterial=new THREE.MeshBasicMaterial({
  color:0xffbd50,side:THREE.DoubleSide,transparent:true,opacity:.95,depthWrite:false
 });
 const status=(v)=>{hint.textContent=v;display.textContent=v};
 function model(type,root){
  const b=(w,h,d,x,y,z,m)=>box(w,h,d,x,y,z,m,root,false);
  const c=(rt,rb,h,x,y,z,m)=>cylinder(rt,rb,h,x,y,z,m,12,root);
  const ball=(r,x,y,z,m)=>sphere(r,x,y,z,m,root);
  const legs=(w,d,h)=>{for(const x of [-w/2,w/2])for(const z of [-d/2,d/2])
   b(.055,h-.18,.055,x,(h+.18)/2,z,material.steel)};
  switch(type){
   case 'stuhl': case 'bank': case 'sofa':{
    const w=type==='stuhl'?.49:type==='bank'?1.25:1.33,d=type==='sofa'?.57:.43;
    legs(w-.12,d-.10,.48);
    b(w,.14,d,0,.48,0,material.fabric);
    b(w,.48,.11,0,.69,-d/2,material.fabric);
    if(type==='sofa')for(const x of [-w/2+.07,w/2-.07])
     b(.14,.38,d,x,.62,0,material.frame);
    break
   }
   case 'tisch': b(.94,.10,.69,0,.75,0,oak);legs(.77,.52,.71);break;
   case 'tresen':
    b(1.77,.79,.74,0,.59,0,material.frame);
    b(1.88,.12,.88,0,1.03,0,material.pale);
    for(const x of [-.50,.50])b(.53,.40,.025,x,.61,.386,tealLight);
    b(.23,.19,.03,0,.65,.40,white);
    b(.07,.17,.04,0,.65,.425,teal);b(.16,.07,.04,0,.65,.425,teal);break;
   case 'computer':
    b(.63,.08,.48,0,.69,0,oak);legs(.49,.35,.65);
    b(.50,.37,.07,0,1.04,-.12,material.dark);
    b(.42,.29,.03,0,1.04,-.077,screenMat);
    b(.32,.023,.13,0,.76,.15,material.pale);break;
   case 'wasser':
    b(.42,.68,.42,0,.56,0,material.pale);
    b(.37,.26,.35,0,1.02,0,material.frame);
    c(.16,.17,.34,0,1.30,0,glass);
    b(.11,.075,.12,0,.91,.23,material.dark);break;
   case 'liege': case 'bett':{
    const big=type==='bett',w=big?1.03:.88,d=big?1.82:1.63;
    legs(w-.16,d-.18,.66);
    b(w,.15,d,0,.67,0,material.frame);
    b(w-.08,.10,d-.10,0,.80,0,material.pale);
    b(w-.11,.022,d*.45,0,.864,d*.20,material.blanket);
    b(w-.16,.10,.33,0,.91,-d*.32,white);
    b(w,.31,.065,0,.96,-d/2,material.frame);
    if(big)for(const x of [-w/2,w/2])
     b(.055,.18,d-.1,x,.89,0,material.steel);
    break
   }
   case 'monitor':
    b(.55,.10,.52,0,.23,0,material.steel);
    b(.065,.87,.065,0,.72,0,material.steel);
    b(.56,.45,.12,0,1.24,0,material.dark);
    b(.46,.34,.025,0,1.25,.071,screenMat);break;
   case 'wagen':
    for(const x of [-.26,.26])for(const z of [-.18,.18]){
     b(.045,.70,.045,x,.55,z,material.steel);ball(.06,x,.20,z,black)
    }
    for(const y of [.47,.84])b(.68,.06,.55,0,y,0,material.pale);
    b(.22,.11,.14,-.12,.94,0,tealLight);
    c(.07,.07,.13,.19,.96,.03,material.frame);break;
   case 'schrank':
    b(.89,1.44,.48,0,.90,0,material.pale);
    b(.91,.055,.50,0,1.64,0,material.frame);
    b(.05,1.25,.03,0,.93,.248,material.frame);
    for(const x of [-.21,.21])b(.045,.18,.03,x,.85,.269,material.steel);
    b(.74,.10,.027,0,1.38,.253,tealLight);break;
   case 'becken':
    b(.77,.63,.42,0,.55,0,material.pale);
    b(.80,.10,.50,0,.91,.03,white);
    b(.49,.018,.27,0,.97,.05,material.frame);
    c(.04,.04,.23,0,1.07,-.08,material.steel);
    b(.19,.04,.07,0,1.21,-.02,material.steel);break;
   case 'spender':
    b(.26,.64,.28,0,.53,0,material.steel);
    b(.28,.28,.24,0,1.01,0,material.pale);
    b(.20,.045,.09,0,1.18,.15,material.frame);
    b(.16,.10,.14,0,1.26,0,tealLight);break;
   case 'pflanze':
    c(.24,.19,.34,0,.38,0,soil);
    c(.27,.27,.04,0,.56,0,oakDark);
    for(let i=0;i<6;i++){const a=i*Math.PI/3;
     ball(.22,Math.cos(a)*.17,.82,Math.sin(a)*.17,i%2?leaf:leaf2)}
    ball(.24,0,1.03,0,leaf);break;
   case 'lampe':
    c(.21,.21,.065,0,.24,0,material.steel);
    c(.055,.06,1.28,0,.89,0,material.steel);
    c(.29,.17,.28,0,1.64,0,gold);
    ball(.13,0,1.50,0,material.pale);break;
   case 'eimer':
    c(.19,.22,.50,0,.43,0,material.steel);
    c(.24,.24,.045,0,.70,0,material.dark);break;
   case 'schild':
    b(.06,1.20,.06,0,.73,0,material.steel);
    b(.88,.47,.13,0,1.36,0,tealLight);
    b(.77,.34,.025,0,1.36,.080,material.pale);
    b(.46,.05,.035,0,1.43,.106,material.frame);
    b(.61,.04,.035,0,1.28,.106,material.frame);break;
  }
 }
 const snapshot=()=>Array.from(records.values(),x=>({
  id:x.id,type:x.type,roomId:x.roomId,x:x.x,z:x.z,turn:x.turn
 }));
 function save(){
  try{localStorage.setItem(storageKey,JSON.stringify(snapshot()))}
  catch(e){console.warn('Möbel konnten nicht gespeichert werden',e)}
  document.getElementById('furnitureCount').textContent=
    records.size+' selbst platzierte Möbel · Bestehende Einrichtung bleibt.'
 }
 function create(entry){
  if(!types.has(entry.type)||!roomGroups.has(entry.roomId))return false;
  const root=new THREE.Group();
  root.userData.furnitureId=entry.id;root.name='Möbel '+types.get(entry.type).label;
  model(entry.type,root);
  root.position.set(entry.x,0,entry.z);
  root.rotation.y=entry.turn*Math.PI/2;
  roomGroups.get(entry.roomId).add(root);
  records.set(entry.id,{...entry,root});return true
 }
 function erase(id){
  const r=records.get(id);if(!r)return;
  r.root.parent?.remove(r.root);
  r.root.traverse(obj=>obj.geometry?.dispose?.());
  records.delete(id);if(selected===id)selected=null
 }
 function footprint(type,turn){
  const o=types.get(type);return turn%2?[o.d,o.w]:[o.w,o.d]
 }
 function valid(type,roomId,x,z,turn,except=null){
  const r=roomSpecs.find(x=>x.id===roomId);if(!r||!types.has(type))return false;
  if(!Number.isFinite(x)||!Number.isFinite(z))return false;
  const [w,d]=footprint(type,turn);
  if(Math.abs(x)+w/2>r.w/2-.16||Math.abs(z)+d/2>r.d/2-.17)return false;
  for(const other of records.values()){
   if(other.id===except||other.roomId!==roomId)continue;
   const [ow,od]=footprint(other.type,other.turn);
   if(Math.abs(other.x-x)<(w+ow)/2+.09&&Math.abs(other.z-z)<(d+od)/2+.09)return false
  }
  return true
 }
 function selectedButtons(){
  const enabled=!!selected&&records.has(selected);
  rotate.disabled=!enabled;remove.disabled=!enabled;undo.disabled=!history.length
 }
 function select(id){
  selected=id&&records.has(id)?id:null;
  for(const r of records.values()){
   const old=r.root.getObjectByName('furniture-ring');if(old)r.root.remove(old);
   if(r.id===selected){
    const [w,d]=footprint(r.type,r.turn),radius=Math.max(w,d)*.65;
    const ring=new THREE.Mesh(new THREE.RingGeometry(radius,radius+.05,32),selectionMaterial);
    ring.name='furniture-ring';ring.rotation.x=-Math.PI/2;ring.position.y=.19;
    r.root.add(ring)
   }
  }
  selectedButtons()
 }
 function remember(before=snapshot()){
  history.push(before);if(history.length>20)history.shift();
  selectedButtons()
 }
 function menu(){
  document.querySelectorAll('[data-fcategory]').forEach(b=>{
   b.classList.toggle('active',b.dataset.fcategory===category);
   b.setAttribute('aria-pressed',String(b.dataset.fcategory===category))
  });
  items.replaceChildren();
  for(const o of catalog.filter(x=>x.category===category)){
   const button=document.createElement('button');button.type='button';
   button.classList.toggle('chosen',chosen===o.key);
   button.setAttribute('aria-pressed',String(chosen===o.key));
   const icon=document.createElement('span');icon.className='itemIcon';
   icon.textContent=o.icon;icon.setAttribute('aria-hidden','true');
   const label=document.createElement('span');label.textContent=o.label;
   button.append(icon,label);
   button.onclick=()=>{
    chosen=o.key;select(null);menu();setCameraMode('build');
    status(o.icon+' '+o.label+' ausgewählt. Im Zimmer antippen.')
   };
   items.appendChild(button)
  }
 }
 function close(){
  if(!open)return;
  open=false;panel.hidden=true;toggle.classList.remove('active');
  toggle.textContent='🪑 Möbel bauen';toggle.setAttribute('aria-expanded','false');
  select(null);save();setCameraMode('pan');
  display.textContent='✅ Möbel gespeichert. Kamera wieder frei.'
 }
 function show(){
  stopOther();
  open=true;panel.hidden=false;toggle.classList.add('active');
  toggle.textContent='🪑 Möbelmodus aktiv';toggle.setAttribute('aria-expanded','true');
  select(null);menu();setCameraMode('build');
  status('🪑 Möbel auswählen, dann im Raum tippen. Zwei Finger zum Zoomen.')
 }
 toggle.onclick=()=>open?close():show();
 document.getElementById('furnitureDone').onclick=close;
 document.querySelectorAll('[data-fcategory]').forEach(b=>b.onclick=()=>{
  category=b.dataset.fcategory;
  chosen=catalog.find(x=>x.category===category).key;
  select(null);menu();setCameraMode('build');
  status('🪑 Möbel wählen und im Zimmer antippen.')
 });
 rotate.onclick=()=>{
  const r=records.get(selected);if(!r)return;
  const turn=(r.turn+1)%4;
  if(!valid(r.type,r.roomId,r.x,r.z,turn,r.id)){
   status('🚫 Zum Drehen ist hier zu wenig Platz.');return
  }
  remember();r.turn=turn;r.root.rotation.y=turn*Math.PI/2;
  select(r.id);save();status('↻ Möbel um 90° gedreht.')
 };
 remove.onclick=()=>{
  if(!selected)return;
  remember();erase(selected);select(null);save();
  status('🗑️ Möbel entfernt. Mit Rückgängig kannst du es zurückholen.')
 };
 undo.onclick=()=>{
  const previous=history.pop();if(!previous)return;
  for(const id of [...records.keys()])erase(id);
  for(const entry of previous)create(entry);
  select(null);save();selectedButtons();status('↶ Letzten Schritt rückgängig gemacht.')
 };
 function place(px,py){
  const hit=groundHit(px,py);if(!hit)return;
  const room=roomAt(hit.x,hit.z);
  if(!room){status('🚫 Bitte in ein Zimmer tippen. Flur und Eingang bleiben frei.');return}
  const x=Math.round((hit.x-room.x)*10)/10,z=Math.round((hit.z-room.z)*10)/10;
  if(!valid(chosen,room.id,x,z,0)){
   status('🚫 Zu wenig Platz. Bitte eine freie Stelle wählen.');return
  }
  if(records.size>=80){status('⚠️ Höchstens 80 zusätzliche Möbel, damit das Handy flüssig bleibt.');return}
  remember();const id='f-'+(++nextId);
  create({id,type:chosen,roomId:room.id,x,z,turn:0});
  select(id);save();renderer.shadowMap.needsUpdate=true;
  status('✅ '+types.get(chosen).label+' platziert. Nochmal tippen oder Möbel ziehen.')
 }
 function pick(px,py){
  if(!records.size)return null;
  const rect=renderer.domElement.getBoundingClientRect();
  const xy=new THREE.Vector2((px-rect.left)/rect.width*2-1,
   -(py-rect.top)/rect.height*2+1);
  const ray=new THREE.Raycaster();ray.setFromCamera(xy,ctx.camera);
  const hits=ray.intersectObjects([...records.values()].map(x=>x.root),true);
  for(const h of hits){
   let obj=h.object;
   while(obj&&!obj.userData.furnitureId)obj=obj.parent;
   if(obj?.userData.furnitureId)return records.get(obj.userData.furnitureId)
  }
  return null
 }
 function pointerStart(px,py){
  if(!open)return null;
  const item=pick(px,py),hit=groundHit(px,py);
  if(!item)return {mode:'furniturePlace',startX:px,startY:py,moved:false};
  select(item.id);status('🪑 Möbel ausgewählt. Ziehen, drehen oder entfernen.');
  const room=roomSpecs.find(r=>r.id===item.roomId);
  return {mode:'furnitureMove',id:item.id,startX:px,startY:py,moved:false,
   before:snapshot(),offsetX:hit?item.x+room.x-hit.x:0,
   offsetZ:hit?item.z+room.z-hit.z:0}
 }
 function pointerMove(px,py,state){
  if(state.mode==='furniturePlace'){
   if(Math.hypot(px-state.startX,py-state.startY)>16)state.moved=true;
   return
  }
  if(state.mode!=='furnitureMove'||Math.hypot(px-state.startX,py-state.startY)<6)return;
  const item=records.get(state.id),hit=groundHit(px,py);
  if(!item||!hit)return;
  const r=roomSpecs.find(x=>x.id===item.roomId);
  const x=Math.round((hit.x+state.offsetX-r.x)*10)/10;
  const z=Math.round((hit.z+state.offsetZ-r.z)*10)/10;
  if(!valid(item.type,item.roomId,x,z,item.turn,item.id))return;
  item.x=x;item.z=z;item.root.position.set(x,0,z);
  state.moved=true;renderer.shadowMap.needsUpdate=true
 }
 function pointerEnd(px,py,state){
  if(state.mode==='furniturePlace'){
   if(!state.moved)place(px,py);
   else status('🪑 Kurz auf eine freie Stelle tippen, um zu platzieren.')
  }else if(state.mode==='furnitureMove'&&state.moved){
   const item=records.get(state.id),before=state.before.find(x=>x.id===state.id);
   if(item&&before&&(item.x!==before.x||item.z!==before.z)){
    remember(state.before);save();status('✅ Möbel verschoben und gespeichert.')
   }
  }
 }
 function removeRoom(roomId){
  for(const r of [...records.values()])if(r.roomId===roomId)erase(r.id);
  save()
 }
 function restore(){
  try{
   const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');
   if(Array.isArray(saved))for(const r of saved.slice(0,80)){
    if(!r||!/^f-[0-9]+$/.test(r.id)||records.has(r.id)||
     !types.has(r.type)||!roomGroups.has(r.roomId)||
     !Number.isFinite(r.x)||!Number.isFinite(r.z)||
     !Number.isInteger(r.turn)||r.turn<0||r.turn>3)continue;
    const room=roomSpecs.find(x=>x.id===r.roomId),[w,d]=footprint(r.type,r.turn);
    if(!room||Math.abs(r.x)+w/2>room.w/2-.12||
     Math.abs(r.z)+d/2>room.d/2-.12)continue;
    create({id:r.id,type:r.type,roomId:r.roomId,x:r.x,z:r.z,turn:r.turn});
    nextId=Math.max(nextId,Number(r.id.slice(2)))
   }
  }catch(e){console.warn('Möbel konnten nicht geladen werden',e)}
  save()
 }
 restore();menu();selectedButtons();
 return {get editing(){return open},close,pointerStart,pointerMove,pointerEnd,removeRoom};
}