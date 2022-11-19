/// <reference types="vite/client" />

interface WebAppUser {
  id: number;
  is_bot?: boolean | undefined;
  first_name: string;
  last_name?: string | undefined;
  username?: string | undefined;
  language_code?: string | undefined;
  is_premium?: boolean | undefined;
  photo_url?: string | undefined;
}

interface WebAppChat {
  id: number;
  type: 'group' | 'supergroup' | 'channel';
  title: string;
  username?: string | undefined;
  photo_url?: string | undefined;
}

interface WebAppInitData {
  query_id?: string | undefined;
  user?: WebAppUser | undefined;
  receiver?: WebAppUser | undefined;
  chat?: WebAppChat | undefined;
  start_param?: string | undefined;
  can_send_after?: number | undefined;
  auth_date: number;
  hash: string;
}

interface ThemeParams {
  bg_color?: string | undefined;
  text_color?: string | undefined;
  hint_color?: string | undefined;
  link_color?: string | undefined;
  button_color?: string | undefined;
  button_text_color?: string | undefined;
  secondary_bg_color?: string | undefined;
}

interface BackButton {
  isVisible: boolean;
  onClick: (cb: () => void) => void;
  offClick: (cb: () => void) => void;
  show: () => void;
  hide: () => void;
}

interface MainButtonParams {
  text?: string | undefined;
  color?: string | undefined;
  text_color?: string | undefined;
  is_active?: boolean | undefined;
  is_visible?: boolean | undefined;
}

interface MainButton {
  /**
   * @default CONTINUE
   */
  text: string;
  color: string;
  textColor: string;
  /**
   * @default false
   */
  isVisible: boolean;
  /**
   * @default true
   */
  isActive: boolean;
  isProgressVisible: boolean;
  setText: (text: string) => void;
  onClick: (cb: () => void) => void;
  offClick: (cb: () => void) => void;
  show: () => void;
  hide: () => void;
  enable: () => void;
  disable: () => void;
  showProgress: (leaveActive?: boolean) => void;
  hideProgress: () => void;
  setParams: () => void;
}

interface HapticFeedback {
  impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
  notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
  selectionChanged: () => void;
}

interface PopupButton {
  id?: string | undefined;
  type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive' | undefined;
  text?: string | undefined;
}

interface PopupParams {
  title?: string | undefined;
  message: string;
  buttons?:
    | [PopupButton]
    | [PopupButton, PopupButton]
    | [PopupButton, PopupButton, PopupButton]
    | undefined;
}

/**
 * @see https://core.telegram.org/bots/webapps#initializing-web-apps
 */
interface WebApp {
  initData: string;
  initDataUnsafe: WebAppInitData | {};
  version: string;
  colorScheme: 'light' | 'dark';
  themeParams: ThemeParams;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  BackButton: BackButton;
  MainButton: MainButton;
  HapticFeedback: HapticFeedback;
  isVersionAtLeast: (version: string) => boolean;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  onEvent: (
    eventType:
      | 'themeChanged'
      | 'viewportChanged'
      | 'mainButtonClicked'
      | 'backButtonClicked'
      | 'settingsButtonClicked'
      | 'invoiceClosed'
      | 'popupClosed',
    eventHandler: () => void,
  ) => void;
  offEvent: (
    eventType:
      | 'themeChanged'
      | 'viewportChanged'
      | 'mainButtonClicked'
      | 'backButtonClicked'
      | 'settingsButtonClicked'
      | 'invoiceClosed'
      | 'popupClosed',
    eventHandler: () => void,
  ) => void;
  sendData: (data: any) => void;
  openLink: (url: string) => void;
  openTelegramLink: (url: string) => void;
  openInvoice: (url: string, cb: () => void) => void;
  showPopup: (params: PopupParams, cb: () => void) => void;
  showAlert: (message: string, cb: () => void) => void;
  showConfirm: (message: string, cb: () => void) => void;
  ready: () => void;
  expand: () => void;
  close: () => void;
}

interface Window {
  Telegram: {
    WebApp: WebApp;
  };
}
