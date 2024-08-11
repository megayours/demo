(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[268],{4451:function(e,t,a){Promise.resolve().then(a.bind(a,2577))},8925:function(e,t,a){"use strict";a.d(t,{h:function(){return n}});var o=a(8037);let n={getNFT:async(e,t,a,o)=>{let n=await e.query("yours.metadata",{project:t,collection:a,token_id:o});if(null!=n)return{token_id:o,metadata:n,blockchain:"Fishing Game",project:n.yours.project,collection:n.yours.collection}},getPudgyRods:async e=>e.query("pudgy.get_rods",{}),equipRod:async(e,t,a)=>{let n={operations:[(0,o.op)("pudgy.equip_fishing_rod",t,a),(0,o.WY6)()],signers:[]};await e.sendTransaction(n)},unequipRod:async(e,t)=>{let a={operations:[(0,o.op)("pudgy.unequip_fishing_rod",t),(0,o.WY6)()],signers:[]};await e.sendTransaction(a)},pullFish:async(e,t)=>{let a={operations:[(0,o.op)("pudgy.pull_fish",t),(0,o.WY6)()],signers:[]};await e.sendTransaction(a)}}},1229:function(e,t,a){"use strict";a.d(t,{ContextProvider:function(){return c},T:function(){return r}});var o=a(7437),n=a(2265);let i=(0,n.createContext)({sessions:{},setSession:()=>{},logout:async()=>{}});function r(){return(0,n.useContext)(i)}function c(e){let{children:t}=e,[a,r]=(0,n.useState)({}),c=(0,n.useRef)({}),l=(0,n.useCallback)((e,t,a)=>{console.log("Setting session for blockchainRid: ".concat(e),t),r(a=>{if(void 0===t){let{[e]:t,...o}=a;return o}return{...a,[e]:t}}),t&&a?(c.current[e.toUpperCase()]=a,localStorage.setItem("session_".concat(e.toUpperCase()),"true")):(delete c.current[e.toUpperCase()],localStorage.removeItem("session_".concat(e.toUpperCase())))},[]),s=(0,n.useCallback)(async e=>{console.log("Handle logout for blockchainRid: ".concat(e));try{let t=c.current[e.toUpperCase()];if(t){let e=t();e instanceof Promise&&await e,console.log("Logout function executed successfully")}else console.warn("No logout function found for blockchainRid: ".concat(e));r(t=>{let{[e]:a,...o}=t;return o}),delete c.current[e.toUpperCase()],localStorage.removeItem("session_".concat(e.toUpperCase())),console.log("Session and logout function removed")}catch(e){console.error("Error during logout:",e)}},[]);return(0,n.useEffect)(()=>{console.log("Current sessions:",a),console.log("Logout functions available:",Object.keys(c.current))},[a]),(0,o.jsx)(i.Provider,{value:{sessions:a,setSession:l,logout:s},children:t})}},2639:function(e,t,a){"use strict";var o=a(7437),n=a(6648);a(2265);var i=a(1471);let r=e=>{switch(e.toLowerCase()){case"ethereum":return"from-blue-500 via-blue-400 to-blue-300";case"mega chain":return"from-purple-600 via-purple-500 to-purple-400";case"fishing game":return"from-green-500 via-green-400 to-green-300";default:return"from-gray-500 via-gray-400 to-gray-300"}},c=e=>{switch(e.toLowerCase()){case"fishes caught":case"fishing rod":case"equipped by":case"durability":return"bg-green-500";case"recent mega chain visit":return"bg-purple-600";default:return"bg-gray-700"}};t.Z=e=>{let{imageUrl:t,tokenName:a,tokenDescription:l,metadata:s,blockchain:d,isGamePage:u=!1,actions:g=[]}=e,h=(e,t)=>(0,o.jsxs)("div",{className:"".concat(c(e.trait_type)," rounded-lg p-2 text-xs"),children:[(0,o.jsxs)("span",{className:"font-semibold",children:[e.trait_type,":"]})," ",e.value]},"".concat(e.trait_type,"-").concat(t)),m=u?s.attributes.filter(e=>["Fishes Caught","Fishing Rod"].includes(e.trait_type)):s.attributes;return(0,o.jsxs)("div",{className:"bg-[var(--color-card)] rounded-lg shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105 max-w-sm mx-auto",children:[(0,o.jsx)("div",{className:"relative w-full h-64",children:(0,o.jsx)(n.default,{src:t,alt:a,fill:!0,sizes:"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",style:{objectFit:"cover"},className:"rounded-t-lg",priority:!0})}),(0,o.jsxs)("div",{className:"p-4",children:[(0,o.jsx)("h2",{className:"text-xl font-semibold text-white mb-2",children:a}),(0,o.jsxs)("div",{className:"items-center gap-2 mb-3",children:[(0,o.jsx)("p",{className:"text-sm font-semibold text-gray-200 whitespace-nowrap",children:"Token & Metadata Source"}),(0,o.jsx)("div",{className:"inline-flex bg-gradient-to-r ".concat(r(d)," text-white text-sm font-medium px-3 py-1 rounded-full mt-2"),children:d})]}),(0,o.jsx)("p",{className:"text-gray-300 text-sm line-clamp-3 mb-4",children:l}),(0,o.jsx)("div",{className:"mb-4",children:(0,o.jsx)("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-2",children:m.map((e,t)=>h(e,t))})}),g.length>0&&(0,o.jsx)("div",{className:"mt-4 flex flex-wrap gap-2",children:g.map((e,t)=>(0,o.jsx)("button",{onClick:e.onClick,className:"mega-button text-sm relative",disabled:e.loading,children:e.loading?(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("span",{className:"opacity-0",children:e.label}),(0,o.jsx)("span",{className:"absolute inset-0 flex items-center justify-center",children:(0,o.jsx)(i.Z,{size:"medium"})})]}):e.label},t))})]})]})}},1471:function(e,t,a){"use strict";var o=a(7437);a(2265),t.Z=e=>{let{size:t="medium"}=e,a={small:"border-[1px]",medium:"border-2",large:"border-3"},n={small:"inset-[2px]",medium:"inset-1",large:"inset-1.5"};return(0,o.jsxs)("div",{className:"".concat({small:"h-4 w-4",medium:"h-8 w-8",large:"h-12 w-12"}[t]," relative"),children:[(0,o.jsx)("div",{className:"absolute inset-0 rounded-full animate-spin-slow ".concat(a[t]," border-transparent"),children:(0,o.jsx)("div",{className:"h-full w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full ".concat({small:"blur-[1px]",medium:"blur-[2px]",large:"blur-[3px]"}[t]," opacity-75")})}),(0,o.jsx)("div",{className:"absolute ".concat(n[t]," bg-[var(--color-background)] rounded-full")}),(0,o.jsx)("div",{className:"absolute ".concat(n[t]," rounded-full animate-spin ").concat(a[t]," border-transparent"),children:(0,o.jsx)("div",{className:"h-full w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"})})]})}},2577:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return _}});var o=a(7437),n=a(2265),i=a(6463),r=a(2639),c=a(1471),l=a(8037);let s={getNFT:async(e,t,a,o)=>{var n,i;let r=await e.query("yours.metadata",{project:t,collection:a,token_id:o});return{token_id:o,metadata:r,blockchain:"Mega Chain",project:(null===(n=r.yours)||void 0===n?void 0:n.project)||"MISSING",collection:(null===(i=r.yours)||void 0===i?void 0:i.collection)||"MISSING"}},getNFTs:async e=>(await e.query("importer.get_tokens")).map(e=>{var t,a;return{...e,blockchain:"Mega Chain",project:(null===(t=e.metadata.yours)||void 0===t?void 0:t.project)||"MISSING",collection:(null===(a=e.metadata.yours)||void 0===a?void 0:a.collection)||"MISSING"}}),importNFT:async(e,t,a,o,n)=>{await e.call((0,l.op)("importer.import_token",[n.name,n.attributes.map(e=>[e.trait_type,e.value]),[[],t,a],n.description,n.image,null],o))}},d={getGatewayUrl:e=>{let t="ipfs://";if(e.startsWith(t)){let a=e.slice(t.length);return"https://ipfs.io/ipfs/".concat(a)}return e},fetchNFTMetadata:async e=>{let t=await fetch(d.getGatewayUrl(e)),a=await t.json();return{image:d.getGatewayUrl(a.image),name:a.name,description:a.description,attributes:a.attributes}}},u="TheIglooCompany",g=[8109,8110,8111,8112,8113,8114],h=[1447,8400,706,8225,3525,6610],m={getNFTs:async()=>[...await Promise.all(g.map(async e=>{let t=await d.fetchNFTMetadata("".concat("ipfs://bafybeibc5sgo2plmjkq2tzmhrn54bk3crhnc23zd2msg4ea7a4pxrkgfna","/").concat(e));return{token_id:e,metadata:t,blockchain:"Ethereum",project:u,collection:"Pudgy Penguins"}})),...await Promise.all(h.map(async e=>{let t=await d.fetchNFTMetadata("".concat("https://api.pudgypenguins.io/present","/").concat(e)),a={...t,attributes:[t.attributes]};return console.log("fixedMetadata",a),{token_id:e,metadata:a,blockchain:"Ethereum",project:u,collection:"Pudgy Rods"}}))]};var p=a(1229),f=a(9659);let b={};async function y(e){let t;if(b[e])return b[e];let a=await (0,f.eI)({directoryNodeUrlPool:["https://node0.devnet1.chromia.dev:7740"],blockchainRid:e}),o=await (0,l.nxA)(window.ethereum),n=(0,l._zT)(a,o),i=await n.getAccounts(),r=i[0];if(i.length>0){let{session:e}=await n.login({accountId:r.id,config:{rules:(0,l.mm6)((0,l.i4F)(1)),flags:["MySession"]}});t=e}else{let e=(0,l.Wh)(["A","T"],o.id),{session:n}=await (0,l.UDE)(a,o,l.SCz.open(e,{config:{rules:(0,l.mm6)((0,l.i4F)(1)),flags:["MySession"]}}));t=n}return b[e]=t,t}async function x(e,t,a,o,n){if(!e)return;let i=await y(n),r=await e.query("yours.metadata",{project:t,collection:a,token_id:o});console.log("Metadata: ".concat(r)),await e.transactionBuilder().add((0,l.op)("yours.init_transfer",e.account.id,t,a,o,1,r),{onAnchoredHandler:async e=>{if(!e)throw Error("No data provided");let t=await e.createProof(i.blockchainRid);await i.transactionBuilder().add(t,{authenticator:l.wSQ}).add((0,l.op)("yours.apply_transfer",e.tx,e.opIndex),{authenticator:l.wSQ}).buildAndSend()}}).buildAndSendWithAnchoring()}async function w(e,t,a,o,n){if(!e)return;let i=await y(n),r=await i.query("yours.metadata",{project:t,collection:a,token_id:o});await i.transactionBuilder().add((0,l.op)("yours.init_transfer",i.account.id,t,a,o,1,r),{onAnchoredHandler:async t=>{if(!t)throw Error("No data provided");let a=await t.createProof(e.blockchainRid);await e.transactionBuilder().add(a,{authenticator:l.wSQ}).add((0,l.op)("yours.apply_transfer",t.tx,t.opIndex),{authenticator:l.wSQ}).buildAndSend()}}).buildAndSendWithAnchoring()}var k=a(8925),v=a(2755),N=e=>{let{isOpen:t,onClose:a,children:n}=e;return t?(0,o.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50",children:(0,o.jsxs)("div",{className:"modal-content bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-background)] rounded-lg p-6 max-w-sm w-full shadow-xl",children:[(0,o.jsx)("div",{className:"flex justify-end",children:(0,o.jsx)("button",{onClick:a,className:"text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors duration-300",children:"\xd7"})}),n]})}):null},j=a(8353),_=function(){let[e,t]=(0,n.useState)([]),[a,l]=(0,n.useState)(!0),[d,u]=(0,n.useState)({}),{sessions:g}=(0,p.T)(),[h,f]=(0,n.useState)(),b=(0,i.useRouter)(),[y,_]=(0,n.useState)(null),[F,C]=(0,n.useState)(!1);(0,n.useEffect)(()=>{(async()=>{f(g[(await (0,j.Z)()).config.blockchainRid.toUpperCase()])})()},[g]),(0,n.useEffect)(()=>{h&&S()},[h]);let S=async()=>{if(h){l(!0);try{let e=await m.getNFTs(),a=await s.getNFTs(h),o=await (0,v.Z)();console.log("External NFTs: ".concat(JSON.stringify(e))),console.log("Mega Yours NFTs: ".concat(JSON.stringify(a)));let n=[];for(let t of(n.push(...e),a)){let e=n.findIndex(e=>e.token_id===t.token_id);-1!==e?n[e]={metadata:t.metadata,blockchain:t.blockchain,token_id:t.token_id,project:t.project,collection:t.collection}:n.push(t)}for(let e of a){let t=await k.h.getNFT(o,e.project,e.collection,e.token_id);if(console.log("Fishing Game NFT: ".concat(JSON.stringify(t))),t){let a=n.findIndex(t=>t.token_id===e.token_id);-1!==a&&(console.log("Updating NFT as Fishing one"),n[a]={metadata:t.metadata,blockchain:t.blockchain,token_id:e.token_id,project:e.project,collection:e.collection})}}t(n)}catch(e){console.error("Error fetching NFTs:",e)}finally{l(!1)}}},E=e=>{t(t=>t.map(t=>t.token_id===e.token_id?e:t))},T=(e,t,a)=>{u(o=>({...o,["".concat(e,"-").concat(t)]:a}))},I=async(e,t,a,o)=>{if(h){T(a,"import",!0);try{await s.importNFT(h,e,t,a,o);let n=await s.getNFT(h,e,t,a);n?E(n):console.error("Failed to fetch updated NFT data after import")}catch(e){console.error("Error importing token:",e)}finally{T(a,"import",!1)}}},M=async(e,t,a)=>{if(h){T(a,"bridgeToFishing",!0);try{let o=await (0,v.Z)();await x(h,e,t,a,o.config.blockchainRid),await new Promise(e=>setTimeout(e,5e3));let n=await k.h.getNFT(o,e,t,a);n&&E({...n,token_id:a,collection:t})}catch(e){console.error("Error bridging token to Fishing Game:",e)}finally{T(a,"bridgeToFishing",!1)}}},P=async(e,t,a)=>{if(h){T(a,"bridgeFromFishing",!0);try{let o=await (0,v.Z)();await w(h,e,t,a,o.config.blockchainRid),await new Promise(e=>setTimeout(e,5e3));let n=await s.getNFT(h,e,t,a);n&&E(n)}catch(e){console.error("Error bridging token from Fishing Game:",e)}finally{T(a,"bridgeFromFishing",!1)}}},G=async e=>{b.push("/game?project=".concat(e.project,"&collection=").concat(e.collection,"&tokenId=").concat(e.token_id))},R=e=>{_(e),C(!0)},U=()=>{C(!1),_(null)},A=async e=>{if(y){U(),T(y.token_id,"bridge",!0);try{"Ethereum"===y.blockchain&&"Mega Chain"===e?await I(y.project,y.collection,y.token_id,y.metadata):"Mega Chain"===y.blockchain&&"Fishing Game"===e?await M(y.project,y.collection,y.token_id):"Fishing Game"===y.blockchain&&"Mega Chain"===e&&await P(y.project,y.collection,y.token_id)}catch(e){console.error("Error bridging token:",e)}finally{T(y.token_id,"bridge",!1)}}},B=e=>{let t=[];return t.push({label:"Bridge",onClick:()=>R(e),loading:d["".concat(e.token_id,"-bridge")]||!1}),"Fishing Game"===e.blockchain&&"Pudgy Penguins"===e.collection&&t.push({label:"Play",onClick:()=>G(e),loading:!1}),t};return a?(0,o.jsx)("div",{className:"container mx-auto px-4 py-8 flex justify-center items-center h-screen",children:(0,o.jsx)(c.Z,{size:"large"})}):(0,o.jsxs)("div",{className:"container mx-auto px-4 py-8",children:[(0,o.jsx)("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",children:e.filter(e=>{var t;return null==e?void 0:null===(t=e.metadata)||void 0===t?void 0:t.image}).map((e,t)=>(0,o.jsx)(r.Z,{imageUrl:e.metadata.image||"",tokenName:e.metadata.name,tokenDescription:e.metadata.description,metadata:e.metadata,actions:B(e),blockchain:e.blockchain},"".concat(e.token_id,"-").concat(e.blockchain)))}),(0,o.jsx)(N,{isOpen:F,onClose:U,children:y&&(0,o.jsxs)("div",{className:"p-4",children:[(0,o.jsx)("h2",{className:"text-xl font-bold mb-4",children:"Select a target blockchain"}),(0,o.jsxs)("div",{className:"space-y-2",children:[(0,o.jsx)("button",{className:"w-full py-2 px-4 rounded transition-all duration-200 ".concat("Ethereum"!==y.blockchain?"bg-gray-300 text-gray-500 cursor-not-allowed opacity-50":"bg-blue-500 text-white hover:bg-blue-600"),onClick:()=>A("Mega Chain"),disabled:"Ethereum"!==y.blockchain,children:"Mega Chain"}),(0,o.jsx)("button",{className:"w-full py-2 px-4 rounded transition-all duration-200 ".concat("Mega Chain"!==y.blockchain?"bg-gray-300 text-gray-500 cursor-not-allowed opacity-50":"bg-green-500 text-white hover:bg-green-600"),onClick:()=>A("Fishing Game"),disabled:"Mega Chain"!==y.blockchain,children:"Fishing Game"}),(0,o.jsx)("button",{className:"w-full py-2 px-4 rounded transition-all duration-200 ".concat("Fishing Game"!==y.blockchain?"bg-gray-300 text-gray-500 cursor-not-allowed opacity-50":"bg-purple-500 text-white hover:bg-purple-600"),onClick:()=>A("Mega Chain"),disabled:"Fishing Game"!==y.blockchain,children:"Mega Chain"})]})]})})]})}},2755:function(e,t,a){"use strict";let o;var n=a(9659);let i="2CD6F1B889AC56E735BE2B82F6F2021804F356C581725E392EECCC85D50F449B";async function r(){if(o)return o;let e={directoryNodeUrlPool:"https://node0.devnet1.chromia.dev:7740"};return i?e.blockchainRid=i:e.blockchainIid=2,o=await (0,n.eI)(e)}t.Z=r},8353:function(e,t,a){"use strict";let o;var n=a(9659);let i="https://node0.devnet1.chromia.dev:7740",r="1DF67D3EBCD16D012BE3A8F591B778F3ECE35E122389E155838CF814A473063E";async function c(){if(console.log("Getting Mega Yours Chromia Client"),console.log("NODE_URL_POOL",i),console.log("BLOCKCHAIN_RID",r),o)return o;let e={directoryNodeUrlPool:i};return r?e.blockchainRid=r:e.blockchainIid=1,o=await (0,n.eI)(e)}t.Z=c}},function(e){e.O(0,[999,233,595,971,23,744],function(){return e(e.s=4451)}),_N_E=e.O()}]);