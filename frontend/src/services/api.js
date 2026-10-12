const API='/api';
export async function api(path,options={}){const token=localStorage.getItem('token');const headers={...(options.headers||{})};if(token)headers.Authorization=`Bearer ${token}`;let res=await fetch(API+path,{...options,headers});if(!res.ok){let data={};try{data=await res.json()}catch{};throw new Error(data.message||'Request failed')}return res.status===204?null:res.json()}
export const fileUrl=id=>`${API}/notes/${id}/file`;
