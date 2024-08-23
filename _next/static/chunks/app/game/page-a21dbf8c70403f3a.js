(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[421],{4544:function(e,t,a){Promise.resolve().then(a.bind(a,4611))},8925:function(e,t,a){"use strict";a.d(t,{h:function(){return s}});var r=a(2642),n=a(8037);let s={getNFTs:async e=>(await e.query("pudgy.get_tokens",{account_id:e.account.id})).map(e=>({...e,blockchain:r.Y.FISHING_GAME})),getNFT:async(e,t,a,n)=>{let s=await e.query("yours.metadata",{project:t,collection:a,token_id:n});if(null!=s)return{token_id:n,metadata:s,blockchain:r.Y.FISHING_GAME}},getPudgyRods:async e=>e.query("pudgy.get_rods",{account_id:e.account.id}),equipRod:async(e,t,a)=>{await e.call((0,n.op)("pudgy.equip_fishing_rod",t,a))},unequipRod:async(e,t)=>{await e.call((0,n.op)("pudgy.unequip_fishing_rod",t))},pullFish:async(e,t)=>{await e.call((0,n.op)("pudgy.pull_fish",t))}}},1229:function(e,t,a){"use strict";a.d(t,{ContextProvider:function(){return i},T:function(){return o}});var r=a(7437),n=a(2265);let s=(0,n.createContext)({sessions:{},setSession:()=>{},logout:async()=>{}});function o(){return(0,n.useContext)(s)}function i(e){let{children:t}=e,[a,o]=(0,n.useState)({}),i=(0,n.useRef)({}),l=(0,n.useCallback)((e,t,a)=>{console.log("Setting session for blockchainRid: ".concat(e),t),o(a=>{if(void 0===t){let{[e]:t,...r}=a;return r}return{...a,[e]:t}}),t&&a?(i.current[e.toUpperCase()]=a,localStorage.setItem("session_".concat(e.toUpperCase()),"true")):(delete i.current[e.toUpperCase()],localStorage.removeItem("session_".concat(e.toUpperCase())))},[]),c=(0,n.useCallback)(async e=>{console.log("Handle logout for blockchainRid: ".concat(e));try{console.log("Logout functions available:",Object.keys(i.current));let t=i.current[e.toUpperCase()];if(t){let e=t();e instanceof Promise&&await e,console.log("Logout function executed successfully")}else console.warn("No logout function found for blockchainRid: ".concat(e));o(t=>{let{[e]:a,...r}=t;return r}),delete i.current[e.toUpperCase()],localStorage.removeItem("session_".concat(e.toUpperCase())),console.log("Session and logout function removed")}catch(e){console.error("Error during logout:",e)}},[]);return(0,n.useEffect)(()=>{console.log("Current sessions:",a),console.log("Logout functions available:",Object.keys(i.current))},[a]),(0,r.jsx)(s.Provider,{value:{sessions:a,setSession:l,logout:c},children:t})}},4611:function(e,t,a){"use strict";a.d(t,{default:function(){return g}});var r=a(7437),n=a(2265),s=a(6463),o=a(8925),i=a(2755),l=a(7138),c=a(2639),d=a(6648),u=e=>{let{rods:t,selectedRod:a,onRodClick:n}=e;return(0,r.jsx)("div",{className:"bg-[var(--color-surface)] p-4 rounded-lg shadow-lg",children:(0,r.jsx)("div",{className:"space-y-2",children:t.map(e=>{var t;let s=e.metadata.properties.Durability,o=e.metadata.properties["Equipped By"];return(0,r.jsxs)("div",{className:"flex items-center p-2 border rounded-lg cursor-pointer transition-colors ".concat(a===e.token_id?"bg-[var(--color-primary)] border-[var(--color-accent)]":"bg-[var(--color-card)] hover:bg-[var(--color-surface)]"),onClick:()=>n(e.token_id),children:[(0,r.jsx)("div",{className:"w-10 h-10 relative mr-2 flex-shrink-0",children:(0,r.jsx)(d.default,{src:null!==(t=e.metadata.image)&&void 0!==t?t:"",alt:e.metadata.name,fill:!0,sizes:"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",style:{objectFit:"cover"},className:"rounded-md"})}),(0,r.jsxs)("div",{className:"flex-grow overflow-hidden",children:[(0,r.jsx)("h3",{className:"text-sm font-semibold text-white truncate",children:e.metadata.name}),(0,r.jsxs)("div",{className:"mt-1 flex flex-wrap gap-1",children:[s&&(0,r.jsxs)("span",{className:"text-xs bg-[var(--color-surface)] text-white rounded-full px-2 py-0.5 truncate",children:["Durability: ",String(s)]}),o&&(0,r.jsxs)("span",{className:"text-xs bg-[var(--color-surface)] text-white rounded-full px-2 py-0.5 truncate",children:["Equipped By: ",String(o)]})]})]})]},e.token_id)})})})},h=e=>{var t,a;let{initialNFT:s,session:i}=e,[d,h]=(0,n.useState)(s),[m,g]=(0,n.useState)([]),[p,f]=(0,n.useState)(null),[x,v]=(0,n.useState)(!0),[y,b]=(0,n.useState)(null),N=(0,n.useRef)(null),[w,j]=(0,n.useState)({x:0,y:0}),[k,S]=(0,n.useState)(!1),[C,E]=(0,n.useState)({x:0,y:0,active:!1});(0,n.useEffect)(()=>{(async()=>{if(i)try{let e=await o.h.getPudgyRods(i),t=(await Promise.all(e.map(e=>o.h.getNFT(i,s.metadata.yours.project.name,"Pudgy Rods",e.id)))).filter(e=>void 0!==e);g(t);let a=d.metadata.properties["Fishing Rod"];if(a){let e=t.find(e=>e.metadata.name===a);e&&f(e.token_id)}}catch(e){console.error("Error fetching Fishing Rods:",e)}finally{v(!1)}})()},[d.metadata.properties]),(0,n.useEffect)(()=>{let e;let t=N.current;if(!t)return;let a=t.getContext("2d");if(!a)return;let r=()=>{a.clearRect(0,0,t.width,t.height);let n=a.createLinearGradient(0,0,0,t.height);n.addColorStop(0,"#87CEEB"),n.addColorStop(1,"#E0F6FF"),a.fillStyle=n,a.fillRect(0,0,t.width,t.height),a.fillStyle="#4FA1E2",a.fillRect(0,.6*t.height,t.width,.4*t.height),a.strokeStyle="#3D8BD9",a.lineWidth=2;for(let e=0;e<3;e++){a.beginPath(),a.moveTo(0,t.height*(.6+.05*e));for(let r=0;r<t.width;r+=20)a.lineTo(r,t.height*(.6+.05*e)+5*Math.sin(.03*r+.002*Date.now()));a.stroke()}null!==p&&(a.strokeStyle="black",a.lineWidth=2,a.beginPath(),a.moveTo(t.width,.3*t.height),a.lineTo(w.x,w.y),a.stroke()),C.active&&(a.fillStyle="rgba(255, 255, 255, 0.8)",a.beginPath(),a.arc(C.x,C.y,10,0,2*Math.PI),a.fill()),a.fillStyle="rgba(255, 0, 0, 0.5)",a.beginPath(),a.arc(w.x,w.y,10,0,2*Math.PI),a.fill(),a.strokeStyle="red",a.lineWidth=2,a.beginPath(),a.moveTo(w.x-15,w.y),a.lineTo(w.x+15,w.y),a.moveTo(w.x,w.y-15),a.lineTo(w.x,w.y+15),a.stroke(),e=requestAnimationFrame(r)};return r(),()=>{cancelAnimationFrame(e)}},[p,w,C]);let F=async()=>{try{if(!i)return;let e=await o.h.getNFT(i,d.metadata.yours.project.name,d.metadata.yours.collection,d.token_id);e&&h(e);let t=await Promise.all(m.map(e=>o.h.getNFT(i,d.metadata.yours.project.name,"Pudgy Rods",e.token_id)));g(t.filter(e=>void 0!==e))}catch(e){console.error("Error refreshing NFT metadata:",e)}},_=async e=>{try{p===e?(await o.h.unequipRod(i,d.token_id),f(null)):(await o.h.equipRod(i,d.token_id,e),f(e)),await F()}catch(e){console.error("Error equipping/unequipping rod:",e)}},T=async()=>{b(null),setTimeout(async()=>{if(Math.random()>.5){let e=["Trout","Salmon","Bass","Catfish","Tuna"],t=e[Math.floor(Math.random()*e.length)];b("You caught a ".concat(t,"!"));try{await o.h.pullFish(i,d.token_id),console.log("Successfully pulled fish on the blockchain"),await F()}catch(e){console.error("Error pulling fish:",e),b("Caught a ".concat(t,", but failed to record it. Please try again."))}}else b("No luck this time. Try again!");S(!1)},2e3)};return x?(0,r.jsx)("div",{className:"text-center",children:"Loading Fishing Rods..."}):0===m.length?(0,r.jsxs)("div",{className:"text-center p-4 bg-[var(--color-surface)] rounded-lg",children:[(0,r.jsx)("p",{className:"text-lg font-semibold mb-2",children:"You don't have any Fishing Rods!"}),(0,r.jsx)("p",{className:"mb-4",children:"Visit the Inventory to bridge your Fishing Rods and start fishing."}),(0,r.jsx)(l.default,{href:"/inventory",className:"bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors",children:"Go to Inventory"})]}):(0,r.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-4",children:[(0,r.jsxs)("div",{className:"md:col-span-2 order-1",children:[(0,r.jsx)("canvas",{ref:N,width:800,height:600,className:"w-full h-auto border border-gray-600 rounded cursor-none",onClick:()=>{null===p||k||(S(!0),E({x:w.x,y:w.y,active:!0}),setTimeout(()=>{E(e=>({...e,active:!1})),T()},500))},onMouseMove:e=>{let t=N.current;if(!t)return;let a=t.getBoundingClientRect();j({x:e.clientX-a.left,y:e.clientY-a.top})}}),null===p&&(0,r.jsx)("div",{className:"mt-4 p-4 bg-yellow-900 text-yellow-100 rounded-md",children:"Please equip a fishing rod to start fishing."}),y&&(0,r.jsxs)("div",{className:"mt-4 p-4 bg-green-900 text-green-100 rounded-md flex justify-between items-center",children:[(0,r.jsx)("span",{children:y}),(0,r.jsx)("button",{onClick:()=>{b(null)},className:"bg-green-700 text-white px-2 py-1 rounded hover:bg-green-600 transition-colors",children:"Dismiss"})]})]}),(0,r.jsxs)("div",{className:"md:col-span-1 order-2 flex flex-col",children:[(0,r.jsx)("div",{className:"mb-4",children:(0,r.jsx)(c.Z,{imageUrl:null!==(t=d.metadata.image)&&void 0!==t?t:"",tokenName:d.metadata.name,tokenDescription:null!==(a=d.metadata.description)&&void 0!==a?a:"",metadata:d.metadata,blockchain:d.blockchain,isGamePage:!0,actions:[]})}),(0,r.jsx)("div",{className:"flex-grow overflow-y-auto",children:(0,r.jsx)(u,{rods:m,selectedRod:p,onRodClick:_})})]})]})},m=a(1229);function g(){let{sessions:e}=(0,m.T)(),[t,a]=(0,n.useState)(),[l,c]=(0,n.useState)(null),[d,u]=(0,n.useState)(!0),g=(0,s.useSearchParams)();return((0,n.useEffect)(()=>{(async()=>{console.log("Fetching session"),a(e[(await (0,i.Z)()).config.blockchainRid.toUpperCase()])})()},[e]),(0,n.useEffect)(()=>{(async()=>{if(!t)return;let e=g.get("tokenId"),a=g.get("project"),r=g.get("collection");if(e&&r&&a)try{let n=await o.h.getNFT(t,a,r,parseInt(e));n&&n.metadata.yours.collection===r&&c(n)}catch(e){console.error("Error fetching NFT:",e)}finally{u(!1)}else u(!1)})()},[t,g]),d)?(0,r.jsx)("div",{className:"container mx-auto px-4 py-8 text-white",children:"Loading..."}):t?l?(0,r.jsx)("div",{className:"container mx-auto px-4 py-4 min-h-screen",children:(0,r.jsx)("div",{className:"bg-[var(--color-background)] rounded-lg shadow-md p-4 md:p-6",children:(0,r.jsx)(h,{initialNFT:l,session:t})})}):(0,r.jsx)("div",{className:"container mx-auto px-4 py-8 text-white",children:"NFT not found or not part of the Pudgy Penguin Collection."}):(0,r.jsx)("div",{className:"container mx-auto px-4 py-8 text-white",children:"Session not found."})}},2639:function(e,t,a){"use strict";var r=a(7437),n=a(6648);a(2265);var s=a(1471),o=a(2642);let i=e=>{switch(e){case o.Y.ETHEREUM:return"from-blue-500 via-blue-400 to-blue-300";case o.Y.TOKEN_CHAIN:return"from-purple-600 via-purple-500 to-purple-400";case o.Y.FISHING_GAME:return"from-green-500 via-green-400 to-green-300";default:return"from-gray-500 via-gray-400 to-gray-300"}},l=e=>{switch(e.toLowerCase()){case"fishes caught":case"fishing rod":case"equipped by":case"durability":return"bg-green-500";case"recent ".concat(o.Y.TOKEN_CHAIN," visit"):return"bg-purple-600";default:return"bg-gray-700"}};t.Z=e=>{let{imageUrl:t,tokenName:a,tokenDescription:o,metadata:c,blockchain:d,isGamePage:u=!1,actions:h=[]}=e,m=u?Object.entries(c.properties).filter(e=>{let[t]=e;return["Fishes Caught","Fishing Rod"].includes(t)}):Object.entries(c.properties),g=(e,t)=>(0,r.jsxs)("div",{className:"".concat(l(e[0])," rounded-lg p-2 text-xs"),children:[(0,r.jsxs)("span",{className:"font-semibold",children:[e[0],":"]})," ","object"==typeof e[1]&&"value"in e[1]?String(e[1].value):String(e[1])]},"".concat(e[0],"-").concat(t));return(0,r.jsxs)("div",{className:"bg-[var(--color-card)] rounded-lg shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105 max-w-sm mx-auto",children:[(0,r.jsx)("div",{className:"relative w-full h-64",children:(0,r.jsx)(n.default,{src:t,alt:a,fill:!0,sizes:"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",style:{objectFit:"cover"},className:"rounded-t-lg",priority:!0})}),(0,r.jsxs)("div",{className:"p-4",children:[(0,r.jsx)("h2",{className:"text-xl font-semibold text-white mb-2",children:a}),(0,r.jsxs)("div",{className:"items-center gap-2 mb-3",children:[(0,r.jsx)("p",{className:"text-sm font-semibold text-gray-200 whitespace-nowrap",children:"Token & Metadata Source"}),(0,r.jsx)("div",{className:"inline-flex bg-gradient-to-r ".concat(i(d)," text-white text-sm font-medium px-3 py-1 rounded-full mt-2"),children:d})]}),(0,r.jsx)("p",{className:"text-gray-300 text-sm line-clamp-3 mb-4",children:o}),(0,r.jsx)("div",{className:"mb-4",children:(0,r.jsx)("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-2",children:m.map((e,t)=>g(e,t))})}),h.length>0&&(0,r.jsx)("div",{className:"mt-4 flex flex-wrap gap-2",children:h.map((e,t)=>(0,r.jsx)("button",{onClick:e.onClick,className:"mega-button text-sm relative",disabled:e.loading,children:e.loading?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)("span",{className:"opacity-0",children:e.label}),(0,r.jsx)("span",{className:"absolute inset-0 flex items-center justify-center",children:(0,r.jsx)(s.Z,{size:"medium"})})]}):e.label},t))})]})]})}},1471:function(e,t,a){"use strict";var r=a(7437);a(2265),t.Z=e=>{let{size:t="medium"}=e,a={small:"border-[1px]",medium:"border-2",large:"border-3"},n={small:"inset-[2px]",medium:"inset-1",large:"inset-1.5"};return(0,r.jsxs)("div",{className:"".concat({small:"h-4 w-4",medium:"h-8 w-8",large:"h-12 w-12"}[t]," relative"),children:[(0,r.jsx)("div",{className:"absolute inset-0 rounded-full animate-spin-slow ".concat(a[t]," border-transparent"),children:(0,r.jsx)("div",{className:"h-full w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full ".concat({small:"blur-[1px]",medium:"blur-[2px]",large:"blur-[3px]"}[t]," opacity-75")})}),(0,r.jsx)("div",{className:"absolute ".concat(n[t]," bg-[var(--color-background)] rounded-full")}),(0,r.jsx)("div",{className:"absolute ".concat(n[t]," rounded-full animate-spin ").concat(a[t]," border-transparent"),children:(0,r.jsx)("div",{className:"h-full w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"})})]})}},2642:function(e,t,a){"use strict";a.d(t,{X:function(){return n},Y:function(){return r}});let r={TOKEN_CHAIN:"Token Chain",FISHING_GAME:"Fishing Game",ETHEREUM:"Ethereum"},n="0x0000000000000000000000000000000000000000000000000000000000000000"},2755:function(e,t,a){"use strict";let r;var n=a(9659);let s="08CEC3366574AE7F63CCE43A4160D9AD96510F51EBE4F59DAF16A11930B5D62E";async function o(){if(r)return r;let e={directoryNodeUrlPool:"https://node0.devnet1.chromia.dev:7740"};return s?e.blockchainRid=s:e.blockchainIid=2,r=await (0,n.eI)(e)}t.Z=o}},function(e){e.O(0,[999,969,138,595,971,23,744],function(){return e(e.s=4544)}),_N_E=e.O()}]);