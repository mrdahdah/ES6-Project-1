export const uid = (prefix = '') => prefix + Math.random().toString(36).slice(2,9);
export const timeAgo = ts => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s/60); if (m < 60) return `${m}m`;
  const h = Math.floor(m/60); if (h < 24) return `${h}h`;
  const d = Math.floor(h/24); return `${d}d`;
};

export function initials(name){ if (!name) return '?'; return name.split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase(); }

// Return avatar url; prefer Gravatar when email provided, else DiceBear initials
export function avatarUrl(name, email){
  if (email){
    const h = md5(String(email).trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${h}?s=160&d=identicon`;
  }
  const seed = encodeURIComponent(name || 'user');
  return `https://api.dicebear.com/6.x/initials/svg?seed=${seed}`;
}

// Minimal MD5 (adapted for small use cases)
function md5(str){
  // Lightweight implementation - good for generating gravatar hashes in-browser
  function rotl(n,c){ return (n<<c)|(n>>> (32-c)); }
  function tohex(i){ return ('00000000'+(i>>>0).toString(16)).slice(-8); }
  var x=[], k, a=1732584193, b=-271733879, c=-1732584194, d=271733878;
  var s=[7,12,17,22,5,9,14,20,4,11,16,23,6,10,15,21];
  for (k=0;k<str.length;k++) x[k>>2] |= (str.charCodeAt(k)&0xff) << ((k%4)<<3);
  x[x.length]=0x80; while((x.length%16)!=14) x.push(0); x.push(str.length*8); x.push(0);
  for (var i=0;i<x.length;i+=16){
    var oa=a, ob=b, oc=c, od=d;
    var j;
    for (j=0;j<64;j++){
      var f, g;
      if (j<16){ f=(b&c)|((~b)&d); g=j; }
      else if (j<32){ f=(d&b)|((~d)&c); g=(5*j+1)%16; }
      else if (j<48){ f=b^c^d; g=(3*j+5)%16; }
      else { f=c^(b|(~d)); g=(7*j)%16; }
      var tmp = d; d = c; c = b; b = b + rotl((a + f + x[i+g] + ((j<16)?0xd76aa478:(j<32)?0xe8c7b756:(j<48)?0x242070db:0xc1bdceee))|0, s[(j%4)+((Math.floor(j/16))*4)]);
      a = tmp;
    }
    a = (a+oa)|0; b = (b+ob)|0; c = (c+oc)|0; d = (d+od)|0;
  }
  return tohex(a)+tohex(b)+tohex(c)+tohex(d);
}
