export interface ProxyConfig {
  name: string;
  type: string;
  server: string;
  port: number | string;
  uuid: string;
  alterId?: number;
  cipher?: string;
  udp?: boolean;
  flow?: string;
  tls?: boolean;
  servername?: string;
  "reality-opts"?: {
    "public-key": string;
    "short-id": string;
  };
  "client-fingerprint"?: string;
  [key: string]: unknown;
}

export interface ProxyGroup {
  name: string;
  type: "select" | "url-test" | "fallback" | "load-balance";
  proxies: string[];
  url?: string;
  interval?: number;
  tolerance?: number;
}

export interface ClashConfig {
  port?: number;
  "socks-port"?: number;
  "allow-lan"?: boolean;
  mode?: string;
  "log-level"?: string;
  "external-controller"?: string;
  dns?: Record<string, unknown>;
  proxies: ProxyConfig[];
  "proxy-groups": ProxyGroup[];
  "rule-providers"?: Record<string, unknown>;
  rules: string[];
}