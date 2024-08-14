(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[268],{4451:function(e,t,a){Promise.resolve().then(a.bind(a,295))},8925:function(e,t,a){"use strict";a.d(t,{h:function(){return i}});var n=a(8037);let i={getNFT:async(e,t,a,n)=>{let i=await e.query("yours.metadata",{project:t,collection:a,token_id:n});if(null!=i)return{token_id:n,metadata:i,blockchain:"Fishing Game"}},getPudgyRods:async e=>e.query("pudgy.get_rods",{}),equipRod:async(e,t,a)=>{let i={operations:[(0,n.op)("pudgy.equip_fishing_rod",t,a),(0,n.WY6)()],signers:[]};await e.sendTransaction(i)},unequipRod:async(e,t)=>{let a={operations:[(0,n.op)("pudgy.unequip_fishing_rod",t),(0,n.WY6)()],signers:[]};await e.sendTransaction(a)},pullFish:async(e,t)=>{let a={operations:[(0,n.op)("pudgy.pull_fish",t),(0,n.WY6)()],signers:[]};await e.sendTransaction(a)}}},1229:function(e,t,a){"use strict";a.d(t,{ContextProvider:function(){return s},T:function(){return r}});var n=a(7437),i=a(2265);let o=(0,i.createContext)({sessions:{},setSession:()=>{},logout:async()=>{}});function r(){return(0,i.useContext)(o)}function s(e){let{children:t}=e,[a,r]=(0,i.useState)({}),s=(0,i.useRef)({}),l=(0,i.useCallback)((e,t,a)=>{console.log("Setting session for blockchainRid: ".concat(e),t),r(a=>{if(void 0===t){let{[e]:t,...n}=a;return n}return{...a,[e]:t}}),t&&a?(s.current[e.toUpperCase()]=a,localStorage.setItem("session_".concat(e.toUpperCase()),"true")):(delete s.current[e.toUpperCase()],localStorage.removeItem("session_".concat(e.toUpperCase())))},[]),c=(0,i.useCallback)(async e=>{console.log("Handle logout for blockchainRid: ".concat(e));try{let t=s.current[e.toUpperCase()];if(t){let e=t();e instanceof Promise&&await e,console.log("Logout function executed successfully")}else console.warn("No logout function found for blockchainRid: ".concat(e));r(t=>{let{[e]:a,...n}=t;return n}),delete s.current[e.toUpperCase()],localStorage.removeItem("session_".concat(e.toUpperCase())),console.log("Session and logout function removed")}catch(e){console.error("Error during logout:",e)}},[]);return(0,i.useEffect)(()=>{console.log("Current sessions:",a),console.log("Logout functions available:",Object.keys(s.current))},[a]),(0,n.jsx)(o.Provider,{value:{sessions:a,setSession:l,logout:c},children:t})}},2639:function(e,t,a){"use strict";var n=a(7437),i=a(6648);a(2265);var o=a(1471);let r=e=>{switch(e.toLowerCase()){case"ethereum":return"from-blue-500 via-blue-400 to-blue-300";case"mega chain":return"from-purple-600 via-purple-500 to-purple-400";case"fishing game":return"from-green-500 via-green-400 to-green-300";default:return"from-gray-500 via-gray-400 to-gray-300"}},s=e=>{switch(e.toLowerCase()){case"fishes caught":case"fishing rod":case"equipped by":case"durability":return"bg-green-500";case"recent mega chain visit":return"bg-purple-600";default:return"bg-gray-700"}};t.Z=e=>{let{imageUrl:t,tokenName:a,tokenDescription:l,metadata:c,blockchain:d,isGamePage:u=!1,actions:g=[]}=e,m=u?Object.entries(c.properties).filter(e=>{let[t]=e;return["Fishes Caught","Fishing Rod"].includes(t)}):Object.entries(c.properties),h=(e,t)=>(0,n.jsxs)("div",{className:"".concat(s(e[0])," rounded-lg p-2 text-xs"),children:[(0,n.jsxs)("span",{className:"font-semibold",children:[e[0],":"]})," ","object"==typeof e[1]&&"value"in e[1]?String(e[1].value):String(e[1])]},"".concat(e[0],"-").concat(t));return(0,n.jsxs)("div",{className:"bg-[var(--color-card)] rounded-lg shadow-xl overflow-hidden transition-transform duration-300 hover:scale-105 max-w-sm mx-auto",children:[(0,n.jsx)("div",{className:"relative w-full h-64",children:(0,n.jsx)(i.default,{src:t,alt:a,fill:!0,sizes:"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",style:{objectFit:"cover"},className:"rounded-t-lg",priority:!0})}),(0,n.jsxs)("div",{className:"p-4",children:[(0,n.jsx)("h2",{className:"text-xl font-semibold text-white mb-2",children:a}),(0,n.jsxs)("div",{className:"items-center gap-2 mb-3",children:[(0,n.jsx)("p",{className:"text-sm font-semibold text-gray-200 whitespace-nowrap",children:"Token & Metadata Source"}),(0,n.jsx)("div",{className:"inline-flex bg-gradient-to-r ".concat(r(d)," text-white text-sm font-medium px-3 py-1 rounded-full mt-2"),children:d})]}),(0,n.jsx)("p",{className:"text-gray-300 text-sm line-clamp-3 mb-4",children:l}),(0,n.jsx)("div",{className:"mb-4",children:(0,n.jsx)("div",{className:"grid grid-cols-2 sm:grid-cols-3 gap-2",children:m.map((e,t)=>h(e,t))})}),g.length>0&&(0,n.jsx)("div",{className:"mt-4 flex flex-wrap gap-2",children:g.map((e,t)=>(0,n.jsx)("button",{onClick:e.onClick,className:"mega-button text-sm relative",disabled:e.loading,children:e.loading?(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)("span",{className:"opacity-0",children:e.label}),(0,n.jsx)("span",{className:"absolute inset-0 flex items-center justify-center",children:(0,n.jsx)(o.Z,{size:"medium"})})]}):e.label},t))})]})]})}},1471:function(e,t,a){"use strict";var n=a(7437);a(2265),t.Z=e=>{let{size:t="medium"}=e,a={small:"border-[1px]",medium:"border-2",large:"border-3"},i={small:"inset-[2px]",medium:"inset-1",large:"inset-1.5"};return(0,n.jsxs)("div",{className:"".concat({small:"h-4 w-4",medium:"h-8 w-8",large:"h-12 w-12"}[t]," relative"),children:[(0,n.jsx)("div",{className:"absolute inset-0 rounded-full animate-spin-slow ".concat(a[t]," border-transparent"),children:(0,n.jsx)("div",{className:"h-full w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full ".concat({small:"blur-[1px]",medium:"blur-[2px]",large:"blur-[3px]"}[t]," opacity-75")})}),(0,n.jsx)("div",{className:"absolute ".concat(i[t]," bg-[var(--color-background)] rounded-full")}),(0,n.jsx)("div",{className:"absolute ".concat(i[t]," rounded-full animate-spin ").concat(a[t]," border-transparent"),children:(0,n.jsx)("div",{className:"h-full w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"})})]})}},295:function(e,t,a){"use strict";a.r(t),a.d(t,{default:function(){return S}});var n=a(7437),i=a(2265),o=a(6463),r=a(2639),s=a(1471);function l(e){var t,a,n;let i=[e.yours.modules,e.yours.project,e.yours.collection];return[e.name,JSON.stringify(e.properties),i,null!==(t=e.description)&&void 0!==t?t:null,null!==(a=e.image)&&void 0!==a?a:null,null!==(n=e.animation_url)&&void 0!==n?n:null]}function c(e,t,a){return{name:e.name,properties:Object.fromEntries(e.attributes.map(e=>[e.trait_type,e.value])),yours:{modules:[],project:t,collection:a},description:e.description,image:e.image,animation_url:e.animation_url}}var d=a(8037);let u="Mega Chain",g={getNFT:async(e,t,a,n)=>{let i=await e.query("yours.metadata",{project:t,collection:a,token_id:n});return{token_id:n,metadata:i,blockchain:u}},getNFTs:async e=>(await e.query("importer.get_tokens")).map(e=>({...e,blockchain:u})),importNFT:async(e,t,a)=>{await e.call((0,d.op)("importer.import_token",l(a),t))}},m={getGatewayUrl:e=>{let t="ipfs://";if(e.startsWith(t)){let a=e.slice(t.length);return"https://ipfs.io/ipfs/".concat(a)}return e},fetchNFTMetadata:async e=>{let t=await fetch(m.getGatewayUrl(e)),a=await t.json();return{image:m.getGatewayUrl(a.image),name:a.name,description:a.description,attributes:a.attributes}}},h="TheIglooCompany",p=[8109,8110,8111,8112,8113,8114],f=[1447,8400,706,8225,3525,6610],b={getNFTs:async()=>[...await Promise.all(p.map(async e=>{let t=await m.fetchNFTMetadata("".concat("ipfs://bafybeibc5sgo2plmjkq2tzmhrn54bk3crhnc23zd2msg4ea7a4pxrkgfna","/").concat(e));return{token_id:e,metadata:c(t,h,"Pudgy Penguins"),blockchain:"Ethereum"}})),...await Promise.all(f.map(async e=>{let t=await m.fetchNFTMetadata("".concat("https://api.pudgypenguins.io/present","/").concat(e));return{token_id:e,metadata:c({...t,attributes:[t.attributes]},h,"Pudgy Rods"),blockchain:"Ethereum"}}))]};var y=a(1229),x=a(9659);let w={};async function k(e){let t;if(w[e])return w[e];let a=await (0,x.eI)({directoryNodeUrlPool:["https://node0.devnet1.chromia.dev:7740"],blockchainRid:e}),n=await (0,d.nxA)(window.ethereum),i=(0,d._zT)(a,n),o=await i.getAccounts(),r=o[0];if(o.length>0){let{session:e}=await i.login({accountId:r.id,config:{rules:(0,d.mm6)((0,d.i4F)(1)),flags:["MySession"]}});t=e}else{let e=(0,d.Wh)(["A","T"],n.id),{session:i}=await (0,d.UDE)(a,n,d.SCz.open(e,{config:{rules:(0,d.mm6)((0,d.i4F)(1)),flags:["MySession"]}}));t=i}return w[e]=t,t}async function v(e,t,a,n,i){if(!e)return;let o=await k(i),r=await e.query("yours.metadata",{project:t,collection:a,token_id:n});console.log("Metadata: ".concat(JSON.stringify(r))),await e.transactionBuilder().add((0,d.op)("yours.init_transfer",e.account.id,t,a,n,1,l(r)),{onAnchoredHandler:async e=>{if(!e)throw Error("No data provided");let t=await e.createProof(o.blockchainRid);await o.transactionBuilder().add(t,{authenticator:d.wSQ}).add((0,d.op)("yours.apply_transfer",e.tx,e.opIndex),{authenticator:d.wSQ}).buildAndSend()}}).buildAndSendWithAnchoring()}async function N(e,t,a,n,i){if(!e)return;let o=await k(i),r=await o.query("yours.metadata",{project:t,collection:a,token_id:n});await o.transactionBuilder().add((0,d.op)("yours.init_transfer",o.account.id,t,a,n,1,l(r)),{onAnchoredHandler:async t=>{if(!t)throw Error("No data provided");let a=await t.createProof(e.blockchainRid);await e.transactionBuilder().add(a,{authenticator:d.wSQ}).add((0,d.op)("yours.apply_transfer",t.tx,t.opIndex),{authenticator:d.wSQ}).buildAndSend()}}).buildAndSendWithAnchoring()}var j=a(8925),_=a(2755),F=e=>{let{isOpen:t,onClose:a,children:i}=e;return t?(0,n.jsx)("div",{className:"fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50",children:(0,n.jsxs)("div",{className:"modal-content bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-background)] rounded-lg p-6 max-w-sm w-full shadow-xl",children:[(0,n.jsx)("div",{className:"flex justify-end",children:(0,n.jsx)("button",{onClick:a,className:"text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors duration-300",children:"\xd7"})}),i]})}):null},C=a(8353),S=function(){let[e,t]=(0,i.useState)([]),[a,l]=(0,i.useState)(!0),[c,d]=(0,i.useState)({}),{sessions:u}=(0,y.T)(),[m,h]=(0,i.useState)(),p=(0,o.useRouter)(),[f,x]=(0,i.useState)(null),[w,k]=(0,i.useState)(!1);(0,i.useEffect)(()=>{(async()=>{h(u[(await (0,C.Z)()).config.blockchainRid.toUpperCase()])})()},[u]),(0,i.useEffect)(()=>{m&&S()},[m]);let S=async()=>{if(m){l(!0);try{let e=await b.getNFTs(),a=await g.getNFTs(m),n=await (0,_.Z)();console.log("External NFTs: ".concat(JSON.stringify(e))),console.log("Mega Yours NFTs: ".concat(JSON.stringify(a)));let i=[];for(let t of(i.push(...e),a)){let e=i.findIndex(e=>e.token_id===t.token_id);-1!==e?i[e]={metadata:t.metadata,blockchain:t.blockchain,token_id:t.token_id}:i.push(t)}for(let e of a){let t=await j.h.getNFT(n,e.metadata.yours.project,e.metadata.yours.collection,e.token_id);if(console.log("Fishing Game NFT: ".concat(JSON.stringify(t))),t){let a=i.findIndex(t=>t.token_id===e.token_id);-1!==a&&(console.log("Updating NFT as Fishing one"),i[a]={metadata:t.metadata,blockchain:t.blockchain,token_id:e.token_id})}}t(i)}catch(e){console.error("Error fetching NFTs:",e)}finally{l(!1)}}},T=e=>{t(t=>t.map(t=>t.token_id===e.token_id?e:t))},E=(e,t,a)=>{d(n=>({...n,["".concat(e,"-").concat(t)]:a}))},P=async(e,t,a,n)=>{if(m){E(a,"import",!0);try{await g.importNFT(m,a,n);let i=await g.getNFT(m,e,t,a);i?T(i):console.error("Failed to fetch updated NFT data after import")}catch(e){console.error("Error importing token:",e)}finally{E(a,"import",!1)}}},M=async(e,t,a)=>{if(m){E(a,"bridgeToFishing",!0);try{let n=await (0,_.Z)();await v(m,e,t,a,n.config.blockchainRid),await new Promise(e=>setTimeout(e,5e3));let i=await j.h.getNFT(n,e,t,a);i&&T({...i,token_id:a})}catch(e){console.error("Error bridging token to Fishing Game:",e)}finally{E(a,"bridgeToFishing",!1)}}},R=async(e,t,a)=>{if(m){E(a,"bridgeFromFishing",!0);try{let n=await (0,_.Z)();await N(m,e,t,a,n.config.blockchainRid),await new Promise(e=>setTimeout(e,5e3));let i=await g.getNFT(m,e,t,a);i&&T(i)}catch(e){console.error("Error bridging token from Fishing Game:",e)}finally{E(a,"bridgeFromFishing",!1)}}},D=async e=>{p.push("/game?project=".concat(e.metadata.yours.project,"&collection=").concat(e.metadata.yours.collection,"&tokenId=").concat(e.token_id))},U=e=>{x(e),k(!0)},A=()=>{k(!1),x(null)},B=async e=>{if(f){console.log("Bridging: ",JSON.stringify(f)),A(),E(f.token_id,"bridge",!0);try{"Ethereum"===f.blockchain&&"Mega Chain"===e?await P(f.metadata.yours.project,f.metadata.yours.collection,f.token_id,f.metadata):"Mega Chain"===f.blockchain&&"Fishing Game"===e?await M(f.metadata.yours.project,f.metadata.yours.collection,f.token_id):"Fishing Game"===f.blockchain&&"Mega Chain"===e&&await R(f.metadata.yours.project,f.metadata.yours.collection,f.token_id)}catch(e){console.error("Error bridging token:",e)}finally{E(f.token_id,"bridge",!1)}}},I=e=>{let t=[];return t.push({label:"Bridge",onClick:()=>U(e),loading:c["".concat(e.token_id,"-bridge")]||!1}),"Fishing Game"===e.blockchain&&"Pudgy Penguins"===e.metadata.yours.collection&&t.push({label:"Play",onClick:()=>D(e),loading:!1}),t};return a?(0,n.jsx)("div",{className:"container mx-auto px-4 py-8 flex justify-center items-center h-screen",children:(0,n.jsx)(s.Z,{size:"large"})}):(0,n.jsxs)("div",{className:"container mx-auto px-4 py-8",children:[(0,n.jsx)("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",children:e.filter(e=>{var t;return null==e?void 0:null===(t=e.metadata)||void 0===t?void 0:t.image}).map((e,t)=>(0,n.jsx)(r.Z,{imageUrl:e.metadata.image||"",tokenName:e.metadata.name,tokenDescription:e.metadata.description||"",metadata:e.metadata,actions:I(e),blockchain:e.blockchain},"".concat(e.token_id,"-").concat(e.blockchain)))}),(0,n.jsx)(F,{isOpen:w,onClose:A,children:f&&(0,n.jsxs)("div",{className:"p-4",children:[(0,n.jsx)("h2",{className:"text-xl font-bold mb-4",children:"Select a target blockchain"}),(0,n.jsxs)("div",{className:"space-y-2",children:[(0,n.jsx)("button",{className:"w-full py-2 px-4 rounded transition-all duration-200 ".concat("Ethereum"!==f.blockchain?"bg-gray-300 text-gray-500 cursor-not-allowed opacity-50":"bg-blue-500 text-white hover:bg-blue-600"),onClick:()=>B("Mega Chain"),disabled:"Ethereum"!==f.blockchain,children:"Mega Chain"}),(0,n.jsx)("button",{className:"w-full py-2 px-4 rounded transition-all duration-200 ".concat("Mega Chain"!==f.blockchain?"bg-gray-300 text-gray-500 cursor-not-allowed opacity-50":"bg-green-500 text-white hover:bg-green-600"),onClick:()=>B("Fishing Game"),disabled:"Mega Chain"!==f.blockchain,children:"Fishing Game"}),(0,n.jsx)("button",{className:"w-full py-2 px-4 rounded transition-all duration-200 ".concat("Fishing Game"!==f.blockchain?"bg-gray-300 text-gray-500 cursor-not-allowed opacity-50":"bg-purple-500 text-white hover:bg-purple-600"),onClick:()=>B("Mega Chain"),disabled:"Fishing Game"!==f.blockchain,children:"Mega Chain"})]})]})})]})}},2755:function(e,t,a){"use strict";let n;var i=a(9659);let o="5B3DAF8CC857074B61DE6D52E5B5D9E37F99412E008243681B5859C30DFE21EB";async function r(){if(n)return n;let e={directoryNodeUrlPool:"https://node0.devnet1.chromia.dev:7740"};return o?e.blockchainRid=o:e.blockchainIid=2,n=await (0,i.eI)(e)}t.Z=r},8353:function(e,t,a){"use strict";let n;var i=a(9659);let o="https://node0.devnet1.chromia.dev:7740",r="DEB3B1D821B9585DBFF7A7D98A42C0D61271DA114392F25241D0EBD767D27A86";async function s(){if(console.log("Getting Mega Yours Chromia Client"),console.log("NODE_URL_POOL",o),console.log("BLOCKCHAIN_RID",r),n)return n;let e={directoryNodeUrlPool:o};return r?e.blockchainRid=r:e.blockchainIid=1,n=await (0,i.eI)(e)}t.Z=s}},function(e){e.O(0,[999,233,595,971,23,744],function(){return e(e.s=4451)}),_N_E=e.O()}]);