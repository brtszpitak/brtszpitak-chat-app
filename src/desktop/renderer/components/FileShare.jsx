import React, { useRef, useState } from "react";
import { API_BASE } from "../../../shared/config.js";

export default function FileShare() {
  const [status, setStatus] = useState("");
  const inputRef = useRef(null);

  const upload = async (file) => {
    try {
      setStatus("Uploading...");
      const fd = new FormData();
      fd.append("file", file);
      const r = await fetch(`${API_BASE}/upload`, { method: "POST", body: fd });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const j = await r.json();
      const fname = j?.file?.filename || j?.name || "";
      const url = j?.url || (fname ? `${API_BASE}/uploads/${fname}` : "");
      setStatus(url ? `Uploaded: ${url}` : "Uploaded.");
    } catch (e) {
      setStatus("Upload failed");
    }
  };

  const onDrop = (e) => { e.preventDefault(); const f = e.dataTransfer?.files?.[0]; if (f) upload(f); };
  const onPick = (e) => { const f = e.target.files?.[0]; if (f) upload(f); };

  return (
    <div onDragOver={(e)=>e.preventDefault()} onDrop={onDrop}
         style={{border:"1px dashed #888", padding:12, borderRadius:8}}>
      <div style={{display:"flex", gap:8, alignItems:"center"}}>
        <button onClick={()=> inputRef.current?.click()}>Choose file</button>
        <span style={{opacity:0.7}}>or drop a file here</span>
        <input ref={inputRef} type="file" style={{display:"none"}} onChange={onPick} />
      </div>
      <div style={{marginTop:6, fontSize:12, opacity:0.8}}>{status}</div>
    </div>
  );
}
