import type { ProductKind } from "@/data/dashboard";

const labels: Record<ProductKind, string> = {
  motor: "Illustration of a geared motor",
  drone: "Illustration of a quadcopter frame",
  camera: "Illustration of a camera body",
  assembly: "Illustration of a mechanical gearbox",
};

export function ProductArtwork({ kind, className }: { kind: ProductKind; className?: string }) {
  return (
    <svg aria-label={labels[kind]} className={className} viewBox="0 0 420 320" role="img" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`metal-${kind}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e6eaf2" /><stop offset=".34" stopColor="#8c98aa" />
          <stop offset=".68" stopColor="#535f72" /><stop offset="1" stopColor="#cbd2df" />
        </linearGradient>
        <linearGradient id={`dark-${kind}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#657186" /><stop offset="1" stopColor="#252e3d" />
        </linearGradient>
      </defs>
      <ellipse cx="210" cy="268" rx="145" ry="22" fill="#02050c" opacity=".42" />
      {kind === "drone" ? (
        <g strokeLinecap="round" strokeLinejoin="round">
          <path d="M207 151 104 78m109 73 103-73m-109 73L104 224m109-73 103 73" stroke="#a5afc0" strokeWidth="18" />
          <path d="m207 151-103-73m109 73 103-73m-109 73L104 224m109-73 103 73" stroke="#3d485a" strokeWidth="5" />
          <path d="m175 139 33-17 35 17v31l-35 19-33-18v-32Z" fill={`url(#metal-${kind})`} stroke="#dbe1ec" strokeWidth="3" />
          {[{ x: 104, y: 78 }, { x: 316, y: 78 }, { x: 104, y: 224 }, { x: 316, y: 224 }].map((point) => (
            <g key={`${point.x}-${point.y}`}>
              <circle cx={point.x} cy={point.y} r="21" fill={`url(#dark-${kind})`} stroke="#b5bfd0" strokeWidth="4" />
              <ellipse cx={point.x} cy={point.y - 25} rx="42" ry="7" fill="#cbd3df" opacity=".88" />
              <circle cx={point.x} cy={point.y} r="5" fill="#313a49" />
            </g>
          ))}
          <path d="M188 178v25h38v-25" fill="#364153" stroke="#8b97aa" strokeWidth="3" />
        </g>
      ) : kind === "camera" ? (
        <g strokeLinejoin="round">
          <path d="M89 122q0-13 14-13h55l22-23h67l18 23h45q15 0 15 14v103q0 15-15 15H103q-14 0-14-15V122Z" fill={`url(#dark-${kind})`} stroke="#abb5c7" strokeWidth="4" />
          <path d="M111 120h192" stroke="#e0e5ed" strokeWidth="4" opacity=".44" />
          <circle cx="210" cy="174" r="61" fill="#283242" stroke="#bbc4d3" strokeWidth="8" />
          <circle cx="210" cy="174" r="43" fill={`url(#metal-${kind})`} stroke="#e3e8f0" strokeWidth="4" />
          <circle cx="210" cy="174" r="29" fill="#111a29" stroke="#8793a7" strokeWidth="5" />
          <circle cx="201" cy="165" r="9" fill="#b3c4e8" opacity=".7" />
          <rect x="129" y="128" width="24" height="9" rx="4" fill="#a8b3c7" />
          <circle cx="294" cy="133" r="7" fill="#777f91" />
        </g>
      ) : (
        <g strokeLinejoin="round">
          <path d="M126 111 275 86q20-3 34 9l22 21v108l-148 40-56-26V132q0-17 19-21Z" fill={`url(#dark-${kind})`} stroke="#c4cbd8" strokeWidth="4" />
          <path d="m127 112 49 25v127l-49-25V112Z" fill="#8792a4" stroke="#d7dce5" strokeWidth="4" />
          <path d="m176 137 155-21v108l-155 40V137Z" fill={`url(#metal-${kind})`} stroke="#e1e5ec" strokeWidth="4" />
          <path d="m193 148 119-16m-119 31 119-16m-119 31 119-16m-119 31 119-16" stroke="#4a5668" strokeWidth="6" opacity=".72" />
          <ellipse cx="177" cy="198" rx="44" ry="63" fill="#343f51" stroke="#cdd4e0" strokeWidth="7" />
          <ellipse cx="177" cy="198" rx="31" ry="47" fill={`url(#metal-${kind})`} stroke="#f0f2f6" strokeWidth="4" />
          <ellipse cx="177" cy="198" rx="18" ry="31" fill="#252f3f" stroke="#909caf" strokeWidth="5" />
          <path d="m168 190-47-5v23l47 7m166-65 24 4v62l-24 7" fill="#667286" stroke="#d4dae4" strokeWidth="4" />
          <path d="M205 236v22m23-28v22m23-28v22m23-28v22" stroke="#303b4b" strokeWidth="7" />
          <circle cx="147" cy="139" r="5" fill="#e5e9ef" /><circle cx="147" cy="253" r="5" fill="#e5e9ef" />
        </g>
      )}
    </svg>
  );
}
