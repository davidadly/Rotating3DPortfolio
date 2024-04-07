System.register(["./chunk-vendor.js","./chunk-frameworks.js","./chunk-input-demux.js","./chunk-ref-selector.js"],function(){"use strict";var g,O,w,r,k,y,_,q,S,x,M;return{setters:[function(c){g=c.a,O=c.r,w=c.o,r=c.t,k=c.c},function(c){y=c.r,_=c.aG,q=c.aF,S=c.y,x=c.g,M=c.e},function(){},function(){}],execute:function(){var c=Object.defineProperty,v=(e,t)=>c(e,"name",{value:t,configurable:!0});g("click",".js-codespaces-update-skus-url",e=>{const t=e.currentTarget;if(!t)return;const o=t.getAttribute("data-refname");if(document.querySelector("form.js-prefetch-codespace-location")&&o){const s=document.querySelector("[data-codespace-skus-url]"),i=s?s.getAttribute("data-codespace-skus-url"):"";if(i){const a=new URL(i,window.location.origin);a.searchParams.set("ref_name",o),s&&s.setAttribute("data-codespace-skus-url",a.toString()),s&&s.setAttribute("data-branch-has-changed","true")}}}),g("remote-input-error","#js-codespaces-repository-select",()=>{const e=document.querySelector("#js-codespaces-unable-load-repositories-warning");e.hidden=!1}),O(".js-new-codespace-form",async function(e,t){const o=e.closest("[data-replace-remote-form-target]"),n=o.querySelector(".js-new-codespace-submit-button");n instanceof HTMLInputElement&&(n.disabled=!0),e.classList.remove("is-error"),e.classList.add("is-loading");try{const s=await t.html();o.replaceWith(s.html)}catch{e.classList.remove("is-loading"),e.classList.add("is-error")}});let I=null;function A(e){I=e,e!==null&&document.querySelector(".js-codespace-loading-steps").setAttribute("data-current-state",I)}v(A,"advanceLoadingState"),w(".js-codespace-loading-steps",{constructor:HTMLElement,add:e=>{const t=e.getAttribute("data-current-state");t&&A(t)}}),w(".js-codespace-advance-state",{constructor:HTMLElement,add:e=>{const t=e.getAttribute("data-state");t&&A(t)}});let E=null;function H(e){O(".js-fetch-cascade-token",async function(t,o){try{E=(await o.json()).json.token}catch{}}),y(e)}v(H,"fetchCascadeToken");function $(e,t,o){if(document.querySelector(e)){const s=Date.now(),a=setInterval(v(()=>{const C=Date.now()-s;if(E||C>=o){clearInterval(a),t(E||void 0);return}},"checkToken"),50)}}v($,"waitForCascadeTokenWithTimeout"),w(".js-auto-submit-form",{constructor:HTMLFormElement,initialize:y}),w(".js-workbench-form-container",{constructor:HTMLElement,add:e=>{const t=e.querySelector(".js-cascade-token");V(e,t)}});function V(e,t){if(t.value!==""){const o=e.querySelector("form");y(o)}else{const o=document.querySelector(".js-fetch-cascade-token");H(o),$(".js-workbench-form-container",R,1e4)}}v(V,"resolveCascadeToken");function R(e){const t=document.querySelector(".js-workbench-form-container form");t&&e?(U(t,e),W(t,e),y(t)):A("failed")}v(R,"insertCodespaceTokenIntoShowAuthForm");function U(e,t){const o=e.querySelector(".js-cascade-token");o&&o.setAttribute("value",t)}v(U,"insertCodespaceTokenIntoCascadeField");function W(e,t){const o=e.querySelector(".js-partner-info");if(o){let n=o.getAttribute("value");n&&(n=n.replace("%CASCADE_TOKEN_PLACEHOLDER%",t),o.setAttribute("value",n))}}v(W,"insertCodespaceTokenIntoPartnerInfo");var X=Object.defineProperty,J=Object.getOwnPropertyDescriptor,ee=(e,t)=>X(e,"name",{value:t,configurable:!0}),f=(e,t,o,n)=>{for(var s=n>1?void 0:n?J(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(n?a(t,o,s):a(s))||s);return n&&s&&X(t,o,s),s};let u=class extends HTMLElement{async connectedCallback(){if(this.createCodespaceForm){const e=await _(this.createCodespaceForm,!this.vscsLocationList);this.updatePickableLocations(e)}}toggleLoadingVscode(){const e=this.loadingVscode.hidden,t=this.children;for(let o=0;o<t.length;o++)t[o].hidden=e;this.loadingVscode.hidden=!e}pollForVscode(e){this.toggleLoadingVscode();const t=e.currentTarget.getAttribute("data-src");t&&this.vscodePoller.setAttribute("src",t)}async updatePickableLocations(e){if(!e){const o=this.createCodespaceForm.getAttribute("data-codespace-locations-url");if(!o)return;e=await q(o)}const t=e.available;if(this.vscsLocationList){const o=this.vscsLocationList.querySelectorAll(".SelectMenu-item");for(const s of o)t.includes(s.getAttribute("data-location"))?s.removeAttribute("hidden"):s.setAttribute("hidden","hidden");const n=this.createCodespaceForm.querySelector('[name="codespace[location]"]');if(n&&!t.includes(n.value)){n.value=e.current,this.vscsLocationSummary.textContent=this.vscsLocationSummary.getAttribute("data-blank-title");for(const s of o)s.setAttribute("aria-checked","false")}}}vscsTargetUrlUpdated(e){const t=e.currentTarget;this.vscsTargetUrl.value=t.value}};ee(u,"NewCodespaceElement"),f([r],u.prototype,"form",2),f([r],u.prototype,"createCodespaceForm",2),f([r],u.prototype,"createCodespaceWithSkuSelectForm",2),f([r],u.prototype,"vscsTargetUrl",2),f([r],u.prototype,"vscsLocationList",2),f([r],u.prototype,"vscsLocationSummary",2),f([r],u.prototype,"loadingVscode",2),f([r],u.prototype,"vscodePoller",2),u=f([k],u);var te=Object.defineProperty,L=(e,t)=>te(e,"name",{value:t,configurable:!0});g("submit",".js-toggle-hidden-codespace-form",function(e){const t=e.currentTarget;p(t)}),g("click",".js-create-codespace-with-sku-button",async function(e){const t=e.currentTarget,o=t.closest("[data-target*='new-codespace.createCodespaceForm']")||t.closest("[data-target*='new-codespace.createCodespaceWithSkuSelectForm']");await _(o),o.classList.contains("js-open-in-vscode-form")?(p(o),B(o)):(o.submit(),P())});function p(e){const t=e.querySelectorAll(".js-toggle-hidden");for(const n of t)n.hidden=!n.hidden;const o=e.querySelectorAll(".js-toggle-disabled");for(const n of o)n.getAttribute("aria-disabled")?n.removeAttribute("aria-disabled"):n.setAttribute("aria-disabled","true")}L(p,"toggleFormSubmissionInFlight");function N(e){return e.closest("[data-replace-remote-form-target]")}L(N,"getFormTarget");async function P(){const e=document.querySelector(".js-codespaces-details-container");e&&(e.open=!1);const t=document.querySelector("new-codespace");if(t)try{const o=await fetch("/codespaces/new");if(o&&o.ok){const n=S(document,await o.text());t.replaceWith(n)}}catch{}}L(P,"createFormSubmitted"),g("submit",".js-create-codespaces-form-command",function(e){const t=e.currentTarget;t.classList.contains("js-open-in-vscode-form")||(P(),p(t))}),g("submit","form.js-codespaces-delete-form",async function(e){e.preventDefault();const t=e.currentTarget;try{const o=await fetch(t.action,{method:t.method,body:new FormData(t),headers:{Accept:"text/fragment+html","X-Requested-With":"XMLHttpRequest"}});if(o.ok){const n=S(document,await o.text());N(t).replaceWith(n)}else if(o.status===401)t.submit();else throw new Error(`Unexpected response: ${o.statusText}`)}finally{p(t)}}),g("submit","form.js-open-in-vscode-form",async function(e){e.preventDefault();const t=e.currentTarget;await B(t)});async function z(e,t){const o=document.querySelector(`#${e}`),n=await x({content:o.content.cloneNode(!0),dialogClass:"project-dialog"});return t&&t.setAttribute("aria-expanded","true"),n.addEventListener("dialog:remove",function(){t&&p(t)},{once:!0}),n}L(z,"openDialog");async function B(e){const t=await fetch(e.action,{method:e.method,body:new FormData(e),headers:{Accept:"application/json","X-Requested-With":"XMLHttpRequest"}});if(t.ok){const o=await t.json();o.codespace_url?(window.location.href=o.codespace_url,p(e),P()):(e.closest("get-repo")||e.closest("new-codespace")?(e.setAttribute("data-src",o.loading_url),e.dispatchEvent(new CustomEvent("pollvscode"))):e.closest("prefetch-pane")&&(e.setAttribute("data-src",o.loading_url),e.dispatchEvent(new CustomEvent("prpollvscode"))),p(e))}else t.status===422&&await z("concurrency-error",e)}L(B,"createCodespaceIntoVscode");var G=Object.defineProperty,oe=Object.getOwnPropertyDescriptor,se=(e,t)=>G(e,"name",{value:t,configurable:!0}),T=(e,t,o,n)=>{for(var s=n>1?void 0:n?oe(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(n?a(t,o,s):a(s))||s);return n&&s&&G(t,o,s),s};let b=class extends HTMLElement{constructor(){super(...arguments);this.abortPoll=null}connectedCallback(){this.abortPoll=new AbortController,this.loadingIndicator.hidden||this.startPoll()}disconnectedCallback(){var e;(e=this.abortPoll)==null||e.abort()}async exportBranch(e){e.preventDefault(),this.form.hidden=!0,this.loadingIndicator.hidden=!1,(await fetch(this.form.action,{method:this.form.method,body:new FormData(this.form),headers:{Accept:"text/fragment+html","X-Requested-With":"XMLHttpRequest"}})).ok?this.startPoll():(this.form.hidden=!1,this.loadingIndicator.hidden=!0)}async startPoll(){const e=this.getAttribute("data-exported-codespace-url")||"",t=await this.poll(e);if(t)if(t.ok)this.loadingIndicator.hidden=!0,this.viewBranchLink.hidden=!1;else{const o=this.getAttribute("data-export-error-redirect-url")||"";window.location.href=o}}async poll(e,t=1e3){var o,n;if((o=this.abortPoll)==null?void 0:o.signal.aborted)return;const s=await fetch(e,{signal:(n=this.abortPoll)==null?void 0:n.signal});return s.status===202?(await new Promise(i=>setTimeout(i,t)),this.poll(e,t*1.5)):s}};se(b,"ExportBranchElement"),T([r],b.prototype,"form",2),T([r],b.prototype,"loadingIndicator",2),T([r],b.prototype,"viewBranchLink",2),b=T([k],b);var K=Object.defineProperty,ne=Object.getOwnPropertyDescriptor,re=(e,t)=>K(e,"name",{value:t,configurable:!0}),m=(e,t,o,n)=>{for(var s=n>1?void 0:n?ne(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(n?a(t,o,s):a(s))||s);return n&&s&&K(t,o,s),s};let h=class extends HTMLElement{reset(e){for(e.preventDefault(),this.dropdownDetails.hidden=!1,this.modalDetails.hidden=!0,this.exportDetails.hidden=!0,this.skuForm.hidden=!1;this.resultMessage.firstChild;)this.resultMessage.removeChild(this.resultMessage.firstChild);this.resultMessage.hidden=!0,this.errorMessage.hidden=!0}showSettingsModal(){this.dropdownDetails.hidden=!0,this.modalDetails.open=!0,this.modalDetails.hidden=!1,this.dynamicSkus&&this.dynamicSkus.setAttribute("src",this.dynamicSkus.getAttribute("data-src"))}showExportModal(){this.dropdownDetails.hidden=!0,this.exportDetails.open=!0,this.exportDetails.hidden=!1,this.insertBranchExportComponent()}async updateSku(){p(this.skuForm);try{const e=await fetch(this.skuForm.action,{method:this.skuForm.method,body:new FormData(this.skuForm),headers:{Accept:"text/fragment+html","X-Requested-With":"XMLHttpRequest"}});if(e.ok){const t=S(document,await e.text());this.resultMessage.appendChild(t),this.skuForm.hidden=!0,this.resultMessage.hidden=!1}else this.errorMessage.hidden=!1,this.skuForm.hidden=!0}finally{p(this.skuForm)}}async insertBranchExportComponent(){const e=this.querySelector("[data-branch-export-url]");if(!e)return;const t=e.getAttribute("data-branch-export-url");if(!t)return;const o=await M(document,t);!o||(e.innerHTML="",e.appendChild(o))}};re(h,"OptionsPopoverElement"),m([r],h.prototype,"dropdownDetails",2),m([r],h.prototype,"modalDetails",2),m([r],h.prototype,"settingsModal",2),m([r],h.prototype,"skuForm",2),m([r],h.prototype,"resultMessage",2),m([r],h.prototype,"errorMessage",2),m([r],h.prototype,"exportDetails",2),m([r],h.prototype,"dynamicSkus",2),h=m([k],h);var Q=Object.defineProperty,ie=Object.getOwnPropertyDescriptor,ae=(e,t)=>Q(e,"name",{value:t,configurable:!0}),l=(e,t,o,n)=>{for(var s=n>1?void 0:n?ie(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(n?a(t,o,s):a(s))||s);return n&&s&&Q(t,o,s),s};let d=class extends HTMLElement{constructor(){super(...arguments);this.prefetching=!1,this.remainingRetries=3}async connectedCallback(){this.openSkuButton&&this.skipSkuButton?this.prefetchLocationAndSkus():this.showOpenSkuButton()}async prefetchLocationAndSkus(){const e=this.getAttribute("data-branch-has-changed")==="true";if(this.prefetching&&!e)return;const t=document.querySelector("form.js-prefetch-codespace-location")||document.querySelector("form.js-open-in-vscode-form")||document.querySelector("form.js-open-in-web-form");if(t){this.prefetching=!0;const o=await _(t);if(o&&(this.currentLocation=o.current),!this.skuSelect)return;const n=this.getAttribute("data-codespace-skus-url");if(this.currentLocation&&n){const s=await fetch(`${n}&location=${this.currentLocation}`,{headers:{"X-Requested-With":"XMLHttpRequest",Accept:"text/html_fragment"}});if(s.ok){this.setAttribute("data-branch-has-changed","false");const i=S(document,await s.text()),C=Array.from(i.querySelectorAll("input[name='codespace[sku_name]']")).filter(F=>!F.disabled),D=C.find(F=>F.checked);D&&this.defaultSkuPreview?(this.defaultSkuPreview.innerHTML=D.getAttribute("data-preview")||"",this.showSkipSkuButton()):C.length===1?(D||C[0].select(),this.showSkipSkuButton()):this.showOpenSkuButton(),this.skuSelect.replaceWith(i),this.skuSelect.hidden=!1,this.skuError&&(this.skuError.hidden=!0)}else this.showOpenSkuButton(),this.remainingRetries-=1,this.remainingRetries>0&&(this.prefetching=!1),this.skuSelect.hidden=!0,this.skuError&&(this.skuError.hidden=!1)}}}showOpenSkuButton(){var e;this.shownButton===void 0&&this.openSkuButton&&(this.shownButton=this.openSkuButton,this.shownButton.hidden=!1,(e=this.skipSkuButton)==null||e.remove())}showSkipSkuButton(){var e,t;if(this.shownButton===void 0&&this.skipSkuButton){this.shownButton=this.skipSkuButton,this.shownButton.hidden=!1;const o=(e=this.openSkuButton)==null?void 0:e.parentElement;o&&o instanceof HTMLDetailsElement&&(o.hidden=!0),(t=this.openSkuButton)==null||t.remove()}}toggleLoadingVscode(){if(this.loadingVscode){const e=this.loadingVscode.hidden,t=this.children;for(let o=0;o<t.length;o++)t[o].hidden=e;this.loadingVscode.hidden=!e}}pollForVscode(e){if(this.vscodePoller){this.toggleLoadingVscode();const t=e.currentTarget.getAttribute("data-src");t&&this.vscodePoller.setAttribute("src",t)}}useBasicCreation(){this.advancedOptionsLink&&(this.openSkuButton&&(this.openSkuButton.hidden=!1),this.skipSkuButton&&(this.skipSkuButton.hidden=!1),this.advancedOptionsLink&&(this.advancedOptionsLink.hidden=!0)),this.basicOptionsCheck&&this.basicOptionsCheck.classList.remove("v-hidden"),this.advancedOptionsCheck&&this.advancedOptionsCheck.classList.add("v-hidden")}useAdvancedCreation(){this.advancedOptionsLink&&(this.openSkuButton&&(this.openSkuButton.hidden=!0),this.skipSkuButton&&(this.skipSkuButton.hidden=!0),this.advancedOptionsLink.hidden=!1),this.basicOptionsCheck&&this.basicOptionsCheck.classList.add("v-hidden"),this.advancedOptionsCheck&&this.advancedOptionsCheck.classList.remove("v-hidden")}};ae(d,"PrefetchPaneElement"),l([r],d.prototype,"skuSelect",2),l([r],d.prototype,"skuError",2),l([r],d.prototype,"loadingVscode",2),l([r],d.prototype,"vscodePoller",2),l([r],d.prototype,"openSkuButton",2),l([r],d.prototype,"skipSkuButton",2),l([r],d.prototype,"defaultSkuPreview",2),l([r],d.prototype,"dropdownButton",2),l([r],d.prototype,"advancedOptionsLink",2),l([r],d.prototype,"basicOptionsCheck",2),l([r],d.prototype,"advancedOptionsCheck",2),d=l([k],d);var Y=Object.defineProperty,ce=Object.getOwnPropertyDescriptor,de=(e,t)=>Y(e,"name",{value:t,configurable:!0}),Z=(e,t,o,n)=>{for(var s=n>1?void 0:n?ce(t,o):t,i=e.length-1,a;i>=0;i--)(a=e[i])&&(s=(n?a(t,o,s):a(s))||s);return n&&s&&Y(t,o,s),s};let j=class extends HTMLElement{async connectedCallback(){this.closeDetailsPopover();const e=this.getAttribute("data-codespace-url");e&&(window.location.href=e)}closeDetailsPopover(){const e=document.querySelector(".js-codespaces-details-container");e&&(e.open=!1)}};de(j,"VscodeForwarderElement"),Z([r],j.prototype,"vscodeLink",2),j=Z([k],j)}}});
//# sourceMappingURL=codespaces-5092e78d.js.map