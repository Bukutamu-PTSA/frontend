import{K as e,U as t}from"./link-B930kiir.js";var n=e(t());function r(e){let{baseName:t,headers:r,rows:i}=e,[a,o]=(0,n.useState)(!1),u=(0,n.useRef)(null),p=(0,n.useCallback)(()=>{o(!0),u.current&&window.clearTimeout(u.current),u.current=window.setTimeout(()=>o(!1),2e3)},[]);return{copied:a,handleCopy:(0,n.useCallback)(async()=>{try{await s(r,i),p()}catch(e){console.error(`Gagal menyalin data:`,e),alert(`Gagal menyalin data ke clipboard.`)}},[r,i,p]),handleCsv:(0,n.useCallback)(()=>{c(r,i,t)},[r,i,t]),handleExcel:(0,n.useCallback)(()=>{l(r,i,t)},[r,i,t]),handlePdf:(0,n.useCallback)(()=>{d(r,i,t)},[r,i,t]),handlePrint:f}}function i(){return new Date().toISOString().split(`T`)[0]??``}function a(e,t){let n=URL.createObjectURL(e),r=document.createElement(`a`);r.href=n,r.download=t,r.click(),URL.revokeObjectURL(n)}function o(e,t){return`${e.join(`	`)}\n${t.map(e=>e.join(`	`)).join(`
`)}`}async function s(e,t){let n=o(e,t),r=()=>{let e=document.createElement(`textarea`);e.value=n,e.style.position=`fixed`,e.style.opacity=`0`,document.body.appendChild(e),e.select();let t=document.execCommand(`copy`);return document.body.removeChild(e),t};if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(n);else if(!r())throw Error(`Gagal menyalin ke clipboard.`)}function c(e,t,n){let r=e=>`"${String(e).replace(/"/g,`""`)}"`,o=[e.map(r).join(`,`),...t.map(e=>e.map(r).join(`,`))].join(`
`);a(new Blob([`\uFEFF${o}`],{type:`text/csv;charset=utf-8;`}),`${n}_${i()}.csv`)}function l(e,t,n){let r=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8" /></head><body>${`
    <table border="1">
      <thead>
        <tr>${e.map(e=>`<th style="background:#EDF3F8;font-weight:bold;">${e}</th>`).join(``)}</tr>
      </thead>
      <tbody>
        ${t.map(e=>`<tr>${e.map(e=>`<td>${e}</td>`).join(``)}</tr>`).join(``)}
      </tbody>
    </table>`}</body></html>`;a(new Blob([r],{type:`application/vnd.ms-excel;charset=utf-8;`}),`${n}_${i()}.xls`)}function u(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`)}function d(e,t,n){let r=e=>`<th style="border:1px solid #d1d5db;padding:6px 10px;background:#EDF3F8;text-align:left;font-size:11px;">${u(e)}</th>`,o=e=>`<td style="border:1px solid #d1d5db;padding:6px 10px;font-size:11px;">${u(String(e))}</td>`,s=`<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>${u(n)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; margin: 32px; color: #111827; }
  h1 { font-size: 18px; margin: 0 0 4px; }
  .sub { font-size: 12px; color: #6b7280; margin: 0 0 20px; }
  table { width: 100%; border-collapse: collapse; }
  th, td { border: 1px solid #d1d5db; padding: 6px 10px; font-size: 11px; text-align: left; }
  th { background: #EDF3F8; }
</style>
</head>
<body>
<h1>${u(n)}</h1>
<p class="sub">Dicetak ${new Date().toLocaleString(`id-ID`)}</p>
<table>
<thead><tr><th style="border:1px solid #d1d5db;padding:6px 10px;background:#EDF3F8;text-align:left;">No</th>${e.map(r).join(``)}</tr></thead>
<tbody>${t.map((e,t)=>`<tr><td style="border:1px solid #d1d5db;padding:6px 10px;text-align:center;">${t+1}</td>${e.map(o).join(``)}</tr>`).join(``)}</tbody>
</table>
</body>
</html>`;a(new Blob([s],{type:`application/pdf;charset=utf-8;`}),`${n}_${i()}.pdf`)}function f(){window.print()}export{r as t};