// types/config.ts

export interface Feature {
  name: string;
  specialCase?: string;
  excluded?: boolean;
}

export interface Plan {
  priceId?: string;
  variantId?: number;
  mode: "payment" | "subscription";
  isFeatured?: boolean;
  name: string;
  duration?: string;
  freeDuration?: string;
  description: string;
  price: number;
  priceAnchor?: number;
  credits?: number;
  priority: number;
  features: Feature[];
  custom?: boolean;
}

export interface StripeConfig {
  plans: Plan[];
}

export interface LemonSqueezyConfig {
  plans: Plan[];
}

export interface ConfigProps {
  appName: string;
  appDescription: string;
  domainName: string;
  crisp: {
    id: string;
    onlyShowOnRoutes: string[];
  };
  canvas: {
    hideShapes: boolean;
    hideIcons: boolean;
    hideBrands: boolean;
    hideUpload: boolean;
    hideEraser: boolean;
    hideDownload: boolean;
    hideClear: boolean;
    hideUndoRedo: boolean;
    hideGrid: boolean;
    hideFullscreen: boolean;
  };
  paymentProvider: "stripe" | "lemonsqueezy";
  stripe: StripeConfig;
  lemonsqueezy: LemonSqueezyConfig;
  aws: {
    bucket: string;
    bucketUrl: string;
    cdn: string;
  };
  mailgun: {
    subdomain: string;
    fromNoReply: string;
    fromAdmin: string;
    supportEmail: string;
    forwardRepliesTo: string;
  };
  colors: {
    theme: string;
    main: string;
  };
  auth: {
    loginUrl: string;
    callbackUrl: string;
  };
}