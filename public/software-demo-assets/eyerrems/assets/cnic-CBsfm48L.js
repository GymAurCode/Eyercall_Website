function t(i){const e=i.replace(/\D/g,"").slice(0,13);return e.length<=5?e:e.length<=12?`${e.slice(0,5)}-${e.slice(5)}`:`${e.slice(0,5)}-${e.slice(5,12)}-${e.slice(12)}`}export{t as f};
