(()=>{const e=document.querySelector("#searchBar"),t=document.querySelector("#getBtn"),n=document.querySelector("#responseArea");let o,i,a;new URLSearchParams(location.search),t.onclick=function(){i="did:web:bboi.solidcommunity.net:public",a="did:web:secureissuer.solidcommunity.net:public",o="did:web:secureapp.solidcommunity.net:public",async function(){let t=e.value;console.log("Sending first request for the resource...");let o=await fetch(t,{method:"POST",headers:{didvc:"true"},body:JSON.stringify({VPCompliant:!1,agent:"did:web:bboi.solidcommunity.net:public",client:"did:web:secureapp.solidcommunity.net:public",issuer:"did:web:secureissuer.solidcommunity.net:public"})}),i=await o.json();$(".label-loader").html("Copy the code and accept the request on your mobile phone").fadeIn(),$(".loader").fadeIn(),window.setTimeout((async()=>{$.ajax({method:"POST",url:"http://localhost:8080/generateInvitation",data:{cssInvitationUrl:i.invitationUrl},success:async function(e){obj_new_request={challenge:e.payload.options.challenge,domain:e.payload.options.domain,target:e.payload.presentation_definition.requestACP.target,owner:e.payload.presentation_definition.requestACP.owner,issuer:e.payload.presentation_definition.requestACP.issuer,creator:e.payload.presentation_definition.requestACP.creator,client:e.payload.presentation_definition.requestACP.client,agent:e.payload.presentation_definition.requestACP.agent,cssInvitationConnection:e.cssInvitationConnection,input_descriptors:JSON.stringify(e.payload.presentation_definition.input_descriptors)},"VerifiablePresentationRequest"===e.payload.type[0]&&(obj_new_request.vpr=JSON.stringify(e.payload)),obj_new_request.connectionId=e.connectionId,n.innerHTML=JSON.stringify(e.payload,null,2).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,(function(e){var t="number";return/^"/.test(e)?t=/:$/.test(e)?"key":"string":/true|false/.test(e)?t="boolean":/null/.test(e)&&(t="null"),'<span class="'+t+'">'+e+"</span>"})),$("#invitation").html(e.url),$("#invitation").append('<img src="'+e.qrcode+'">'),$.ajax({method:"POST",url:"http://localhost:8080/requestUserCredential",data:obj_new_request,success:async function(e){$("#invitation").html(""),$(".label-loader").css("display","none").html("Proof accepted, sending the request to the server").fadeIn(),$(".loader").css("display","none").addClass("loader-almost-load").fadeIn(),n.innerHTML=e.content,window.setTimeout((()=>{$(".loader-loaded").css("display","none")}),500)}})}})}),1e3)}()}})();