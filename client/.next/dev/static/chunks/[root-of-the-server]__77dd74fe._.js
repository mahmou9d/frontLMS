(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/utills/Theme-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'next-themes'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
"use client";
;
;
function ThemeProvider({ children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NextThemesProvider, {
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/utills/Theme-provider.tsx",
        lineNumber: 9,
        columnNumber: 10
    }, this);
}
_c = ThemeProvider;
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/redux/features/auth/authSlice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "userLoggedIn",
    ()=>userLoggedIn,
    "userLoggedOut",
    ()=>userLoggedOut,
    "userRegistration",
    ()=>userRegistration
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/client/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
;
const initialState = {
    token: "",
    user: null
};
const authSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createSlice"])({
    name: "auth",
    initialState,
    reducers: {
        userRegistration: (state, action)=>{
            state.token = action.payload.token;
        },
        userLoggedIn: (state, action)=>{
            state.token = action.payload.accessToken;
            state.user = action.payload.user;
        },
        userLoggedOut: (state)=>{
            state.token = "";
            state.user = null;
        }
    }
});
const { userRegistration, userLoggedIn, userLoggedOut } = authSlice.actions;
const __TURBOPACK__default__export__ = authSlice.reducer;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/redux/features/api/apiSlice.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiSlice",
    ()=>apiSlice,
    "useLazyLoadUserQuery",
    ()=>useLazyLoadUserQuery,
    "useLazyRefreshTokenQuery",
    ()=>useLazyRefreshTokenQuery
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/client/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/* eslint-disable @typescript-eslint/no-explicit-any */ var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/client/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$redux$2f$features$2f$auth$2f$authSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/redux/features/auth/authSlice.ts [app-client] (ecmascript)");
;
;
// Base Query
const baseQuery = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchBaseQuery"])({
    baseUrl: ("TURBOPACK compile-time value", "http://localhost:8000/api/v1/"),
    credentials: "include",
    prepareHeaders: (headers, { getState })=>{
        const token = getState().auth.token;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    }
});
// ✅ تحسين الـ reauth logic
const baseQueryWithReauth = async (args, api, extraOptions)=>{
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        console.log("🔄 Token expired, attempting refresh...");
        const refreshResult = await baseQuery({
            url: "refresh",
            method: "GET",
            credentials: "include"
        }, api, extraOptions);
        if (refreshResult.data) {
            const { accessToken, user } = refreshResult.data;
            // ✅ حدّث الـ token في الـ state
            api.dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$redux$2f$features$2f$auth$2f$authSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userLoggedIn"])({
                accessToken,
                user
            }));
            // ✅ أعد المحاولة بالـ token الجديد
            result = await baseQuery(args, api, extraOptions);
            console.log("✅ Token refreshed successfully");
        } else {
            console.log("❌ Refresh failed, logging out");
            api.dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$redux$2f$features$2f$auth$2f$authSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userLoggedOut"])());
        }
    }
    return result;
};
const apiSlice = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        "User"
    ],
    endpoints: (builder)=>({
            refreshToken: builder.query({
                query: ()=>({
                        url: "refresh",
                        method: "GET"
                    }),
                async onQueryStarted (_arg, { queryFulfilled, dispatch }) {
                    try {
                        const { data } = await queryFulfilled;
                        if (data.status) {
                            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$redux$2f$features$2f$auth$2f$authSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userLoggedIn"])({
                                accessToken: data.accessToken,
                                user: data.user
                            }));
                        }
                    } catch (error) {
                        const status = error?.error?.status || error?.status;
                        if (status === 400 || status === 401) {
                            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$redux$2f$features$2f$auth$2f$authSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userLoggedOut"])());
                        }
                    }
                }
            }),
            loadUser: builder.query({
                query: ()=>({
                        url: "me",
                        method: "GET"
                    }),
                providesTags: [
                    "User"
                ],
                async onQueryStarted (_arg, { queryFulfilled, dispatch }) {
                    try {
                        const { data } = await queryFulfilled;
                        if (data.success) {
                            dispatch((0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$redux$2f$features$2f$auth$2f$authSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["userLoggedIn"])({
                                accessToken: data.accessToken || "",
                                user: data.user
                            }));
                        }
                    } catch (error) {
                        console.error("Load user failed:", error);
                    }
                }
            })
        })
});
const { useLazyRefreshTokenQuery, useLazyLoadUserQuery } = apiSlice;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/client/redux/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "store",
    ()=>store
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/client/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/client/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$redux$2f$features$2f$api$2f$apiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/redux/features/api/apiSlice.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$redux$2f$features$2f$auth$2f$authSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/redux/features/auth/authSlice.ts [app-client] (ecmascript)");
;
;
;
const store = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["configureStore"])({
    reducer: {
        [__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$redux$2f$features$2f$api$2f$apiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiSlice"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$redux$2f$features$2f$api$2f$apiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiSlice"].reducer,
        auth: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$redux$2f$features$2f$auth$2f$authSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    },
    middleware: (getDefaultMiddleware)=>getDefaultMiddleware().concat(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$redux$2f$features$2f$api$2f$apiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiSlice"].middleware),
    devTools: ("TURBOPACK compile-time value", "development") !== "production"
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/Providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$redux$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/redux/store.ts [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'next-auth/react'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module 'react-redux'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
"use client";
;
;
;
;
function Providers({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Provider, {
        store: __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$redux$2f$store$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["store"],
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SessionProvider, {
            children: children
        }, void 0, false, {
            fileName: "[project]/app/Providers.tsx",
            lineNumber: 14,
            columnNumber: 36
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/Providers.tsx",
        lineNumber: 14,
        columnNumber: 12
    }, this);
}
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/utills/AuthInitializer.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module 'react-redux'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$redux$2f$features$2f$api$2f$apiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/client/redux/features/api/apiSlice.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
/* eslint-disable @typescript-eslint/no-explicit-any */ "use client";
;
;
;
const AuthInitializer = ({ children })=>{
    _s();
    const dispatch = useDispatch();
    const didInit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [refreshToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$redux$2f$features$2f$api$2f$apiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLazyRefreshTokenQuery"])();
    const [loadUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$redux$2f$features$2f$api$2f$apiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLazyLoadUserQuery"])();
    const [isInitialized, setIsInitialized] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthInitializer.useEffect": ()=>{
            if (didInit.current) return;
            didInit.current = true;
            const initAuth = {
                "AuthInitializer.useEffect.initAuth": async ()=>{
                    try {
                        const { data, isError } = await refreshToken();
                        if (isError || !data?.status) {
                            console.log("ℹ️ No active session - user needs to login");
                            return;
                        }
                        console.log("✅ Session restored successfully");
                        const { isError: userError } = await loadUser();
                        if (userError) {
                            console.error("Failed to load user data");
                        }
                    } catch (error) {
                        console.error("❌ Unexpected auth initialization error:", error);
                    } finally{
                        setIsInitialized(true);
                    }
                }
            }["AuthInitializer.useEffect.initAuth"];
            initAuth();
        }
    }["AuthInitializer.useEffect"], [
        refreshToken,
        loadUser
    ]);
    if (!isInitialized) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
            }, void 0, false, {
                fileName: "[project]/app/utills/AuthInitializer.tsx",
                lineNumber: 57,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/app/utills/AuthInitializer.tsx",
            lineNumber: 56,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$client$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
};
_s(AuthInitializer, "41ak51SW243ntMyHdYPMQsRY84c=", false, function() {
    return [
        useDispatch,
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$redux$2f$features$2f$api$2f$apiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLazyRefreshTokenQuery"],
        __TURBOPACK__imported__module__$5b$project$5d2f$client$2f$redux$2f$features$2f$api$2f$apiSlice$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLazyLoadUserQuery"]
    ];
});
_c = AuthInitializer;
const __TURBOPACK__default__export__ = AuthInitializer;
var _c;
__turbopack_context__.k.register(_c, "AuthInitializer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__77dd74fe._.js.map