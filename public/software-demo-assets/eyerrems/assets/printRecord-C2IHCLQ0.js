function i(e,l){const d=l.map(o=>`<tr><td style="padding:6px 12px;font-weight:600;color:#64748b;white-space:nowrap">${o.label}</td><td style="padding:6px 12px">${o.value||"—"}</td></tr>`).join(""),n=`<!DOCTYPE html><html><head><title>${e}</title>
    <style>body{font-family:system-ui,sans-serif;padding:24px;color:#0f172a}
    h1{font-size:18px;margin:0 0 16px}table{border-collapse:collapse;width:100%}
    tr{border-bottom:1px solid #e2e8f0}</style></head><body>
    <h1>${e}</h1><table>${d}</table></body></html>`,t=window.open("","_blank","width=720,height=640");t&&(t.document.write(n),t.document.close(),t.focus(),t.print())}export{i as p};
