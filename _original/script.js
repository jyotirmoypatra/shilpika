const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const money = value => `₹${Number(value).toLocaleString("en-IN")}`;
let cart = JSON.parse(localStorage.getItem("shilpika-cart") || "[]");

function saveCart(){ localStorage.setItem("shilpika-cart", JSON.stringify(cart)); renderCart(); }
function toast(message){ const el=$(".toast"); el.textContent=message; el.classList.add("show"); clearTimeout(toast.timer); toast.timer=setTimeout(()=>el.classList.remove("show"),2300); }
function addToCart(product){
  const found=cart.find(item=>item.id===product.id);
  if(found) found.qty+=1; else cart.push({...product,qty:1});
  saveCart(); toast(`${product.name} added to your bag`);
}
function renderCart(){
  const count=cart.reduce((sum,item)=>sum+item.qty,0);
  $$(".cart-count").forEach(el=>el.textContent=count);
  const list=$(".cart-items"), empty=$(".cart-empty"), subtotal=$(".subtotal b");
  if(!list) return;
  list.innerHTML=cart.map(item=>`
    <div class="cart-row">
      <img src="${item.image}" alt="">
      <div><h4>${item.name}</h4><p>${money(item.price)}</p>
        <div class="quantity-control">
          <button data-action="decrease" data-id="${item.id}" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button data-action="increase" data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <button class="remove-item" data-action="remove" data-id="${item.id}" aria-label="Remove ${item.name}">×</button>
    </div>`).join("");
  const total=cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  subtotal.textContent=money(total);
  empty.style.display=cart.length?"none":"block";
  $(".drawer-foot").style.display=cart.length?"block":"none";
}
function openCart(){ $(".cart-drawer").classList.add("open"); $(".cart-drawer").setAttribute("aria-hidden","false"); $(".overlay").classList.add("show"); document.body.style.overflow="hidden"; }
function closePanels(){ $(".cart-drawer").classList.remove("open"); $(".cart-drawer").setAttribute("aria-hidden","true"); $(".search-modal").classList.remove("open"); $(".search-modal").setAttribute("aria-hidden","true"); $(".overlay").classList.remove("show"); document.body.style.overflow=""; }
$$(".add-btn").forEach(btn=>btn.addEventListener("click",()=>{
  const card=btn.closest(".product-card");
  addToCart({id:card.dataset.id,name:card.dataset.name,price:Number(card.dataset.price),image:card.dataset.image});
}));
$(".cart-open").addEventListener("click",openCart);
$(".drawer-close").addEventListener("click",closePanels);
$(".overlay").addEventListener("click",closePanels);
document.addEventListener("keydown",e=>{if(e.key==="Escape")closePanels();});
$(".cart-items").addEventListener("click",e=>{
  const button=e.target.closest("[data-action]"); if(!button)return;
  const item=cart.find(p=>p.id===button.dataset.id); if(!item)return;
  if(button.dataset.action==="increase")item.qty++;
  if(button.dataset.action==="decrease")item.qty=Math.max(1,item.qty-1);
  if(button.dataset.action==="remove")cart=cart.filter(p=>p.id!==button.dataset.id);
  saveCart();
});
$(".checkout-btn").addEventListener("click",()=>toast("Checkout demo — connect a payment gateway to accept orders."));
$$(".filter-chip").forEach(chip=>chip.addEventListener("click",()=>{
  $$(".filter-chip").forEach(c=>c.classList.remove("active")); chip.classList.add("active");
  const filter=chip.dataset.filter;
  $$(".product-card").forEach(card=>{card.style.display=filter==="all"||card.dataset.category===filter?"":"none";});
}));
$(".search-open").addEventListener("click",()=>{$(".search-modal").classList.add("open");$(".search-modal").setAttribute("aria-hidden","false");$(".overlay").classList.add("show");$("#search-input").focus();});
$(".search-close").addEventListener("click",closePanels);
$("#search-input").addEventListener("input",e=>{
  const term=e.target.value.trim().toLowerCase();
  const matches=$$(".product-card").filter(card=>card.dataset.name.toLowerCase().includes(term));
  $(".search-results").innerHTML=term?matches.map(card=>`<div class="search-result" data-target="${card.dataset.id}">${card.dataset.name} · ${money(card.dataset.price)}</div>`).join("")||"No matching pieces found.":"Start typing to discover something lovely.";
});
$(".search-results").addEventListener("click",e=>{
  const result=e.target.closest("[data-target]"); if(!result)return;
  closePanels(); document.querySelector(`[data-id="${result.dataset.target}"]`)?.scrollIntoView({behavior:"smooth",block:"center"});
});
$(".newsletter-form").addEventListener("submit",e=>{e.preventDefault();$(".newsletter-feedback").textContent="Thank you for joining the Shilpika list! Connect a mailing service to save subscribers.";e.target.reset();});
$(".menu-toggle").addEventListener("click",()=>{
  const nav=$(".main-nav"), open=nav.classList.toggle("open");
  $(".menu-toggle").setAttribute("aria-expanded",String(open));
});
$$(".main-nav a").forEach(a=>a.addEventListener("click",()=>{$(".main-nav").classList.remove("open");$(".menu-toggle").setAttribute("aria-expanded","false");}));
$(".footer-bottom #year") && ($("#year").textContent=new Date().getFullYear());

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}});
},{threshold:.12});
$$(".reveal").forEach(el=>observer.observe(el));
renderCart();
