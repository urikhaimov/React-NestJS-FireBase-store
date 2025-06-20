import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=fb4ecf99"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=fb4ecf99"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react;
import __vite__cjsImport2_reactDom_client from "/node_modules/.vite/deps/react-dom_client.js?v=fb4ecf99"; const ReactDOM = __vite__cjsImport2_reactDom_client.__esModule ? __vite__cjsImport2_reactDom_client.default : __vite__cjsImport2_reactDom_client;
import App from "/src/App.tsx?t=1750400278185";
import { QueryClientProvider } from "/node_modules/.vite/deps/@tanstack_react-query.js?v=fb4ecf99";
import { queryClient } from "/src/api/queryClient.ts";
import { StoreConfigContext, defaultConfig } from "/src/context/StoreConfigContext.tsx";
import { ErrorBoundary } from "/node_modules/.vite/deps/@sentry_react.js?v=fb4ecf99";
import { StoreBoundThemeProvider } from "/src/providers/StoreBoundThemeProvider.tsx";
import { BrowserRouter } from "/node_modules/.vite/deps/react-router-dom.js?v=fb4ecf99";
import { loadStoreConfig } from "/src/utils/loadStoreConfig.ts";
import { RedirectProvider } from "/src/context/RedirectContext.tsx";
import { AuthProvider } from "/src/context/AuthContext.tsx";
import { LocalizationProvider } from "/node_modules/.vite/deps/@mui_x-date-pickers.js?v=fb4ecf99";
import { AdapterDayjs } from "/node_modules/.vite/deps/@mui_x-date-pickers_AdapterDayjs.js?v=fb4ecf99";
import "/src/index.css";
const storeId = localStorage.getItem("storeId") || "store1";
const storeConfig = loadStoreConfig(storeId) ?? defaultConfig;
ReactDOM.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxDEV(React.StrictMode, { children: /* @__PURE__ */ jsxDEV(BrowserRouter, { children: /* @__PURE__ */ jsxDEV(ErrorBoundary, { fallback: /* @__PURE__ */ jsxDEV("p", { children: "⚠ Something went wrong. Our team has been notified!" }, void 0, false, {
    fileName: "C:/Projects/onlineShop/NestJs/apps/frontend/src/main.tsx",
    lineNumber: 24,
    columnNumber: 32
  }, this), children: /* @__PURE__ */ jsxDEV(StoreConfigContext.Provider, { value: storeConfig, children: /* @__PURE__ */ jsxDEV(StoreBoundThemeProvider, { children: /* @__PURE__ */ jsxDEV(AuthProvider, { children: /* @__PURE__ */ jsxDEV(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxDEV(RedirectProvider, { children: /* @__PURE__ */ jsxDEV(LocalizationProvider, { dateAdapter: AdapterDayjs, children: /* @__PURE__ */ jsxDEV(App, {}, void 0, false, {
    fileName: "C:/Projects/onlineShop/NestJs/apps/frontend/src/main.tsx",
    lineNumber: 31,
    columnNumber: 21
  }, this) }, void 0, false, {
    fileName: "C:/Projects/onlineShop/NestJs/apps/frontend/src/main.tsx",
    lineNumber: 30,
    columnNumber: 19
  }, this) }, void 0, false, {
    fileName: "C:/Projects/onlineShop/NestJs/apps/frontend/src/main.tsx",
    lineNumber: 29,
    columnNumber: 17
  }, this) }, void 0, false, {
    fileName: "C:/Projects/onlineShop/NestJs/apps/frontend/src/main.tsx",
    lineNumber: 28,
    columnNumber: 15
  }, this) }, void 0, false, {
    fileName: "C:/Projects/onlineShop/NestJs/apps/frontend/src/main.tsx",
    lineNumber: 27,
    columnNumber: 13
  }, this) }, void 0, false, {
    fileName: "C:/Projects/onlineShop/NestJs/apps/frontend/src/main.tsx",
    lineNumber: 26,
    columnNumber: 11
  }, this) }, void 0, false, {
    fileName: "C:/Projects/onlineShop/NestJs/apps/frontend/src/main.tsx",
    lineNumber: 25,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "C:/Projects/onlineShop/NestJs/apps/frontend/src/main.tsx",
    lineNumber: 24,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "C:/Projects/onlineShop/NestJs/apps/frontend/src/main.tsx",
    lineNumber: 23,
    columnNumber: 5
  }, this) }, void 0, false, {
    fileName: "C:/Projects/onlineShop/NestJs/apps/frontend/src/main.tsx",
    lineNumber: 22,
    columnNumber: 3
  }, this)
);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJtYXBwaW5ncyI6IkFBdUIrQjtBQXZCL0IsT0FBT0EsV0FBVztBQUNsQixPQUFPQyxjQUFjO0FBQ3JCLE9BQU9DLFNBQVM7QUFDaEIsU0FBU0MsMkJBQTJCO0FBQ3BDLFNBQVNDLG1CQUFtQjtBQUM1QixTQUFTQyxvQkFBb0JDLHFCQUFxQjtBQUNsRCxTQUFTQyxxQkFBcUI7QUFDOUIsU0FBU0MsK0JBQStCO0FBQ3hDLFNBQVNDLHFCQUFxQjtBQUM5QixTQUFTQyx1QkFBdUI7QUFDaEMsU0FBU0Msd0JBQXdCO0FBQ2pDLFNBQVNDLG9CQUFvQjtBQUU3QixTQUFTQyw0QkFBNEI7QUFDckMsU0FBU0Msb0JBQW9CO0FBQzdCLE9BQU87QUFFUCxNQUFNQyxVQUFVQyxhQUFhQyxRQUFRLFNBQVMsS0FBSztBQUNuRCxNQUFNQyxjQUFjUixnQkFBZ0JLLE9BQU8sS0FBS1Q7QUFFaERMLFNBQVNrQixXQUFXQyxTQUFTQyxlQUFlLE1BQU0sQ0FBRSxFQUFFQztBQUFBQSxFQUNwRCx1QkFBQyxNQUFNLFlBQU4sRUFDQyxpQ0FBQyxpQkFDQyxpQ0FBQyxpQkFBYyxVQUFVLHVCQUFDLE9BQUUsbUVBQUg7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQUFzRCxHQUM3RSxpQ0FBQyxtQkFBbUIsVUFBbkIsRUFBNEIsT0FBT0osYUFDbEMsaUNBQUMsMkJBQ0MsaUNBQUMsZ0JBQ0MsaUNBQUMsdUJBQW9CLFFBQVFkLGFBQzNCLGlDQUFDLG9CQUNDLGlDQUFDLHdCQUFxQixhQUFhVSxjQUNqQyxpQ0FBQyxTQUFEO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FBSSxLQUROO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FFQSxLQUhGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FJQSxLQUxGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FNQSxLQVBGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FRQSxLQVRGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FVQSxLQVhGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FZQSxLQWJGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FjQSxLQWZGO0FBQUE7QUFBQTtBQUFBO0FBQUEsU0FnQkEsS0FqQkY7QUFBQTtBQUFBO0FBQUE7QUFBQSxTQWtCQTtBQUNGIiwibmFtZXMiOlsiUmVhY3QiLCJSZWFjdERPTSIsIkFwcCIsIlF1ZXJ5Q2xpZW50UHJvdmlkZXIiLCJxdWVyeUNsaWVudCIsIlN0b3JlQ29uZmlnQ29udGV4dCIsImRlZmF1bHRDb25maWciLCJFcnJvckJvdW5kYXJ5IiwiU3RvcmVCb3VuZFRoZW1lUHJvdmlkZXIiLCJCcm93c2VyUm91dGVyIiwibG9hZFN0b3JlQ29uZmlnIiwiUmVkaXJlY3RQcm92aWRlciIsIkF1dGhQcm92aWRlciIsIkxvY2FsaXphdGlvblByb3ZpZGVyIiwiQWRhcHRlckRheWpzIiwic3RvcmVJZCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJzdG9yZUNvbmZpZyIsImNyZWF0ZVJvb3QiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwicmVuZGVyIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VzIjpbIm1haW4udHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20vY2xpZW50JztcclxuaW1wb3J0IEFwcCBmcm9tICcuL0FwcCc7XHJcbmltcG9ydCB7IFF1ZXJ5Q2xpZW50UHJvdmlkZXIgfSBmcm9tICdAdGFuc3RhY2svcmVhY3QtcXVlcnknO1xyXG5pbXBvcnQgeyBxdWVyeUNsaWVudCB9IGZyb20gJy4vYXBpL3F1ZXJ5Q2xpZW50JztcclxuaW1wb3J0IHsgU3RvcmVDb25maWdDb250ZXh0LCBkZWZhdWx0Q29uZmlnIH0gZnJvbSAnLi9jb250ZXh0L1N0b3JlQ29uZmlnQ29udGV4dCc7XHJcbmltcG9ydCB7IEVycm9yQm91bmRhcnkgfSBmcm9tICdAc2VudHJ5L3JlYWN0JztcclxuaW1wb3J0IHsgU3RvcmVCb3VuZFRoZW1lUHJvdmlkZXIgfSBmcm9tICcuL3Byb3ZpZGVycy9TdG9yZUJvdW5kVGhlbWVQcm92aWRlcic7XHJcbmltcG9ydCB7IEJyb3dzZXJSb3V0ZXIgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcclxuaW1wb3J0IHsgbG9hZFN0b3JlQ29uZmlnIH0gZnJvbSAnLi91dGlscy9sb2FkU3RvcmVDb25maWcnO1xyXG5pbXBvcnQgeyBSZWRpcmVjdFByb3ZpZGVyIH0gZnJvbSAnLi9jb250ZXh0L1JlZGlyZWN0Q29udGV4dCc7XHJcbmltcG9ydCB7IEF1dGhQcm92aWRlciB9IGZyb20gJy4vY29udGV4dC9BdXRoQ29udGV4dCc7XHJcbmltcG9ydCB7IHVzZVN0b3JlU2V0dGluZ3MgfSBmcm9tICcuL3N0b3Jlcy91c2VTdG9yZVNldHRpbmdzJztcclxuaW1wb3J0IHsgTG9jYWxpemF0aW9uUHJvdmlkZXIgfSBmcm9tICdAbXVpL3gtZGF0ZS1waWNrZXJzJztcclxuaW1wb3J0IHsgQWRhcHRlckRheWpzIH0gZnJvbSAnQG11aS94LWRhdGUtcGlja2Vycy9BZGFwdGVyRGF5anMnO1xyXG5pbXBvcnQgJy4vaW5kZXguY3NzJztcclxuXHJcbmNvbnN0IHN0b3JlSWQgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnc3RvcmVJZCcpIHx8ICdzdG9yZTEnOyAvLyBmYWxsYmFjayB0byB1c2VTdG9yZVNldHRpbmdzIG5vdCBwb3NzaWJsZSBpbiBtb2R1bGUgc2NvcGVcclxuY29uc3Qgc3RvcmVDb25maWcgPSBsb2FkU3RvcmVDb25maWcoc3RvcmVJZCkgPz8gZGVmYXVsdENvbmZpZztcclxuXHJcblJlYWN0RE9NLmNyZWF0ZVJvb3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jvb3QnKSEpLnJlbmRlcihcclxuICA8UmVhY3QuU3RyaWN0TW9kZT5cclxuICAgIDxCcm93c2VyUm91dGVyPlxyXG4gICAgICA8RXJyb3JCb3VuZGFyeSBmYWxsYmFjaz17PHA+4pqgIFNvbWV0aGluZyB3ZW50IHdyb25nLiBPdXIgdGVhbSBoYXMgYmVlbiBub3RpZmllZCE8L3A+fT5cclxuICAgICAgICA8U3RvcmVDb25maWdDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXtzdG9yZUNvbmZpZ30+XHJcbiAgICAgICAgICA8U3RvcmVCb3VuZFRoZW1lUHJvdmlkZXI+XHJcbiAgICAgICAgICAgIDxBdXRoUHJvdmlkZXI+XHJcbiAgICAgICAgICAgICAgPFF1ZXJ5Q2xpZW50UHJvdmlkZXIgY2xpZW50PXtxdWVyeUNsaWVudH0+XHJcbiAgICAgICAgICAgICAgICA8UmVkaXJlY3RQcm92aWRlcj5cclxuICAgICAgICAgICAgICAgICAgPExvY2FsaXphdGlvblByb3ZpZGVyIGRhdGVBZGFwdGVyPXtBZGFwdGVyRGF5anN9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxBcHAgLz5cclxuICAgICAgICAgICAgICAgICAgPC9Mb2NhbGl6YXRpb25Qcm92aWRlcj5cclxuICAgICAgICAgICAgICAgIDwvUmVkaXJlY3RQcm92aWRlcj5cclxuICAgICAgICAgICAgICA8L1F1ZXJ5Q2xpZW50UHJvdmlkZXI+XHJcbiAgICAgICAgICAgIDwvQXV0aFByb3ZpZGVyPlxyXG4gICAgICAgICAgPC9TdG9yZUJvdW5kVGhlbWVQcm92aWRlcj5cclxuICAgICAgICA8L1N0b3JlQ29uZmlnQ29udGV4dC5Qcm92aWRlcj5cclxuICAgICAgPC9FcnJvckJvdW5kYXJ5PlxyXG4gICAgPC9Ccm93c2VyUm91dGVyPlxyXG4gIDwvUmVhY3QuU3RyaWN0TW9kZT5cclxuKTtcclxuIl0sImZpbGUiOiJDOi9Qcm9qZWN0cy9vbmxpbmVTaG9wL05lc3RKcy9hcHBzL2Zyb250ZW5kL3NyYy9tYWluLnRzeCJ9