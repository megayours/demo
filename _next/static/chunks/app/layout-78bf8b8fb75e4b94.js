(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[185],{9325:function(e,o,n){Promise.resolve().then(n.bind(n,1229)),Promise.resolve().then(n.bind(n,8946)),Promise.resolve().then(n.t.bind(n,8877,23))},1229:function(e,o,n){"use strict";n.d(o,{ContextProvider:function(){return i},T:function(){return r}});var t=n(7437),l=n(2265);let s=(0,l.createContext)({sessions:{},setSession:()=>{},logout:async()=>{}});function r(){return(0,l.useContext)(s)}function i(e){let{children:o}=e,[n,r]=(0,l.useState)({}),i=(0,l.useRef)({}),c=(0,l.useCallback)((e,o,n)=>{console.log("Setting session for blockchainRid: ".concat(e),o),r(n=>{if(void 0===o){let{[e]:o,...t}=n;return t}return{...n,[e]:o}}),o&&n?(i.current[e.toUpperCase()]=n,localStorage.setItem("session_".concat(e.toUpperCase()),"true")):(delete i.current[e.toUpperCase()],localStorage.removeItem("session_".concat(e.toUpperCase())))},[]),a=(0,l.useCallback)(async e=>{console.log("Handle logout for blockchainRid: ".concat(e));try{console.log("Logout functions available:",Object.keys(i.current));let o=i.current[e.toUpperCase()];if(o){let e=o();e instanceof Promise&&await e,console.log("Logout function executed successfully")}else console.warn("No logout function found for blockchainRid: ".concat(e));r(o=>{let{[e]:n,...t}=o;return t}),delete i.current[e.toUpperCase()],localStorage.removeItem("session_".concat(e.toUpperCase())),console.log("Session and logout function removed")}catch(e){console.error("Error during logout:",e)}},[]);return(0,l.useEffect)(()=>{console.log("Current sessions:",n),console.log("Logout functions available:",Object.keys(i.current))},[n]),(0,t.jsx)(s.Provider,{value:{sessions:n,setSession:c,logout:a},children:o})}},1471:function(e,o,n){"use strict";var t=n(7437);n(2265),o.Z=e=>{let{size:o="medium"}=e,n={small:"border-[1px]",medium:"border-2",large:"border-3"},l={small:"inset-[2px]",medium:"inset-1",large:"inset-1.5"};return(0,t.jsxs)("div",{className:"".concat({small:"h-4 w-4",medium:"h-8 w-8",large:"h-12 w-12"}[o]," relative"),children:[(0,t.jsx)("div",{className:"absolute inset-0 rounded-full animate-spin-slow ".concat(n[o]," border-transparent"),children:(0,t.jsx)("div",{className:"h-full w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full ".concat({small:"blur-[1px]",medium:"blur-[2px]",large:"blur-[3px]"}[o]," opacity-75")})}),(0,t.jsx)("div",{className:"absolute ".concat(l[o]," bg-[var(--color-background)] rounded-full")}),(0,t.jsx)("div",{className:"absolute ".concat(l[o]," rounded-full animate-spin ").concat(n[o]," border-transparent"),children:(0,t.jsx)("div",{className:"h-full w-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full"})})]})}},8946:function(e,o,n){"use strict";n.d(o,{default:function(){return x}});var t=n(7437),l=n(2265),s=n(7138),r=n(1229),i=n(8037);async function c(e){if(!window.ethereum)return console.error("Ethereum not found on window"),{session:void 0,logout:()=>{}};let o=await (0,i.nxA)(window.ethereum),n=(0,i._zT)(e,o),t=await n.getAccounts(),l=(0,i.U7w)();if(t.length>0){let e=t[0].id,{session:o,logout:s}=await n.login({accountId:e,loginKeyStore:l,config:{rules:(0,i.mm6)((0,i.i4F)(2)),flags:["MySession"]}});return{session:o,logout:()=>{s(),console.log("Logging out...")}}}let s=(0,i.Wh)(["A","T"],o.id),{session:r,logout:c}=await (0,i.UDE)(e,o,i.SCz.open(s,{config:{rules:(0,i.mm6)((0,i.i4F)(2)),flags:["MySession"]}}));return{session:r,logout:()=>{c(),console.log("Logging out...")}}}var a=n(1471),u=n(2523),d=n(2755),g=()=>{let{sessions:e,setSession:o,logout:n}=(0,r.T)(),[s,i]=(0,l.useState)("loading"),g=(0,l.useRef)(!0),[h,f]=(0,l.useState)(null);(0,l.useEffect)(()=>{console.log("Effect triggered - AccountId changed:",h)},[h]),(0,l.useEffect)(()=>{console.log("Effect triggered - Sessions changed:",e);let o=Object.keys(e).length;0===o?i("login"):2===o&&i("logout")},[e]);let x=async()=>{if(console.log("Login button clicked"),"loading"!==s){i("loading");try{let{session:e,logout:n}=await c(await (0,u.Z)());if(e){console.log("New Mega Session created:",e),o(e.blockchainRid.toString("hex").toUpperCase(),e,n);let t=e.account.id.toString("hex"),l=t?"".concat(t.slice(0,3),"..").concat(t.slice(-3)):null;l&&f(l)}else i("no-wallet");let{session:t,logout:l}=await c(await (0,d.Z)());t?(console.log("New Fishing Session created:",t),o(t.blockchainRid.toString("hex").toUpperCase(),t,l)):i("no-wallet")}catch(e){console.error("Failed to create session:",e),i("login")}}},m=(0,l.useCallback)(async()=>{if(console.log("Logout button clicked"),"loading"!==s)try{for(let o of(i("loading"),Object.values(e)))o&&await n(o.blockchainRid.toString("hex").toUpperCase());console.log("Logout successful")}catch(e){console.error("Logout failed:",e),i("logout")}finally{g.current=!1}},[e,n,s]),v="\n    flex items-center justify-center w-50 px-4 py-2 rounded-full text-white font-semibold\n    transition-all duration-300 ease-in-out\n    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-accent)]\n  ",p={login:{class:"".concat(v," bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 active:from-purple-700 active:via-pink-700 active:to-red-700"),onClick:x,content:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("svg",{className:"w-5 h-5 mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"})}),(0,t.jsx)("span",{children:"Connect Wallet"})]})},logout:{class:"".concat(v," bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 hover:from-red-600 hover:via-orange-600 hover:to-yellow-600 active:from-red-700 active:via-orange-700 active:to-yellow-700"),onClick:m,content:(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("svg",{className:"w-5 h-5 mr-2",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg",children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"})}),(0,t.jsxs)("span",{children:["Disconnect ",h]})]})},loading:{class:"".concat(v," bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 cursor-not-allowed"),onClick:()=>{console.log("Loading button clicked")},content:(0,t.jsx)(a.Z,{size:"medium"})},"no-wallet":{class:"".concat(v," bg-gray-500 cursor-not-allowed"),onClick:()=>{console.log("No wallet button clicked")},content:(0,t.jsx)("span",{children:"MetaMask Missing"})}}[s];return console.log("Rendering button with state:",s),(0,t.jsx)("button",{className:p.class,onClick:()=>{console.log("Button clicked, current state:",s),p.onClick()},disabled:"loading"===s,children:p.content})},h=e=>{let{toggle:o}=e;return(0,t.jsx)("nav",{className:"w-full h-20 bg-[var(--color-surface)] sticky top-0 z-50 shadow-lg",children:(0,t.jsx)("div",{className:"container mx-auto px-4 h-full",children:(0,t.jsxs)("div",{className:"flex justify-between items-center h-full",children:[(0,t.jsx)(s.default,{href:"/",className:"flex items-center",children:(0,t.jsx)("span",{className:"text-2xl font-bold rainbow-text",children:"MegaYours"})}),(0,t.jsx)("button",{type:"button",className:"inline-flex items-center md:hidden text-white",onClick:o,children:(0,t.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,t.jsx)("line",{x1:"3",y1:"12",x2:"21",y2:"12"}),(0,t.jsx)("line",{x1:"3",y1:"6",x2:"21",y2:"6"}),(0,t.jsx)("line",{x1:"3",y1:"18",x2:"21",y2:"18"})]})}),(0,t.jsxs)("ul",{className:"hidden md:flex gap-x-6 text-white",children:[(0,t.jsx)("li",{children:(0,t.jsx)(s.default,{href:"/",className:"nav-link",children:"Home"})}),(0,t.jsx)("li",{children:(0,t.jsx)(s.default,{href:"/inventory",className:"nav-link",children:"Inventory"})}),(0,t.jsx)("li",{children:(0,t.jsx)(s.default,{href:"/create-nft",className:"nav-link",children:"Create"})})]}),(0,t.jsx)("div",{className:"hidden md:block",children:(0,t.jsx)(g,{})})]})})})},f=e=>{let{isOpen:o,toggle:n}=e;return(0,t.jsxs)("div",{className:"fixed w-full h-full overflow-hidden justify-center bg-[var(--color-surface)] grid pt-[120px] left-0 z-50 transition-all duration-300 ".concat(o?"top-0 opacity-100":"-top-full opacity-0"),children:[(0,t.jsx)("button",{className:"absolute right-0 p-5 text-white",onClick:n,children:(0,t.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[(0,t.jsx)("line",{x1:"18",y1:"6",x2:"6",y2:"18"}),(0,t.jsx)("line",{x1:"6",y1:"6",x2:"18",y2:"18"})]})}),(0,t.jsxs)("ul",{className:"text-center leading-relaxed text-xl",children:[(0,t.jsx)("li",{className:"py-2",children:(0,t.jsx)(s.default,{href:"/",onClick:n,className:"nav-link",children:"Home"})}),(0,t.jsx)("li",{className:"py-2",children:(0,t.jsx)(s.default,{href:"/inventory",onClick:n,className:"nav-link",children:"Inventory"})}),(0,t.jsx)("li",{className:"py-2",children:(0,t.jsx)(s.default,{href:"/create-nft",onClick:n,className:"nav-link",children:"Create NFT"})}),(0,t.jsx)("li",{className:"py-2",children:(0,t.jsx)(g,{})})]})]})},x=()=>{let[e,o]=(0,l.useState)(!1),n=()=>{o(!e)};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(f,{isOpen:e,toggle:n}),(0,t.jsx)(h,{toggle:n})]})}},2755:function(e,o,n){"use strict";let t;var l=n(9659);let s="08CEC3366574AE7F63CCE43A4160D9AD96510F51EBE4F59DAF16A11930B5D62E";async function r(){if(t)return t;let e={directoryNodeUrlPool:"https://node0.devnet1.chromia.dev:7740"};return s?e.blockchainRid=s:e.blockchainIid=2,t=await (0,l.eI)(e)}o.Z=r},2523:function(e,o,n){"use strict";let t;var l=n(9659);let s="https://node0.devnet1.chromia.dev:7740",r="1F7D2F96CDC9DF58F05A335CA68D90654CF6872A89A96092658726111F6D616E";async function i(){if(console.log("Getting TokenChain Chromia Client"),console.log("NODE_URL_POOL",s),console.log("BLOCKCHAIN_RID",r),t)return t;let e={directoryNodeUrlPool:s};return r?e.blockchainRid=r:e.blockchainIid=1,t=await (0,l.eI)(e)}o.Z=i},8877:function(){}},function(e){e.O(0,[404,999,969,138,971,23,744],function(){return e(e.s=9325)}),_N_E=e.O()}]);