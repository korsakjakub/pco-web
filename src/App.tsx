import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Queue from "./pages/Queue";
import JoinQueue from "./pages/JoinQueue";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./assets/index.css";
import Context from "./interfaces/Context";
import NotFound from "./pages/NotFound";
import { validateRequiredEnvVars, getEnvVar } from "./utils/validateEnv";
import { StorageService } from "./services/storageService";
import { UI_CONSTANTS, ROUTES } from "./constants/gameDefaults";
import ErrorBoundary from "./components/ErrorBoundary";

// Create QueryClient outside component to prevent recreation
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: UI_CONSTANTS.QUERY_STALE_TIME,
            retry: UI_CONSTANTS.RETRY_ATTEMPTS,
        },
    },
});

const App = () => {
    // Validate environment variables on app start
    validateRequiredEnvVars();
    
    const hostUrl = getEnvVar('VITE_HOST_URL');
    const frontUrl = getEnvVar('VITE_FRONT_URL');
    const env = import.meta.env.MODE;
    
    // Use StorageService instead of direct sessionStorage access
    StorageService.setHostUrl(hostUrl);
    StorageService.setFrontUrl(frontUrl);

    const onReturn = (r: Context) => {
        const contextWithEnv: Context = {
            ...r,
            roomToken: r.roomToken || null,
            env: env,
        };
        StorageService.setContext(contextWithEnv);
    };

    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <Routes>
                    <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
                    <Route path={ROUTES.HOME} element={<Home onReturnFromHome={onReturn} />} />
                    <Route path={ROUTES.JOIN} element={<JoinQueue onReturnFromJoin={onReturn} />} />
                    <Route path={ROUTES.GAME} element={<Game />} />
                    <Route path={ROUTES.QUEUE} element={<Queue />} />
                </Routes>
            </QueryClientProvider>
        </ErrorBoundary>
    );
};

export default App;
