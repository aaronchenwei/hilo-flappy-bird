import { createGlobalStyle } from 'styled-components';
import styledSanitize from 'styled-sanitize';

const GlobalStyle = createGlobalStyle`
  ${styledSanitize}

  html,
  body,
  #root, {
    min-width: 100%;
    max-width: 100%
    width: 100%;
    min-height: 100%;
    max-height: 100%;
    height: 100%;
  }

  body, button, input, optgroup, select, textarea {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Source Han Sans CN", "Source Han Sans SC", "Microsoft YaHei", "Wenquanyi Micro Hei", "WenQuanYi Zen Hei", "ST Heiti", SimHei, "WenQuanYi Zen Hei Sharp", sans-serif;
  }
`;

export default GlobalStyle;
