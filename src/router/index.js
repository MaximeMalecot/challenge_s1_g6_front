import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/Home/HomeView.vue";
import { ROLES } from "@/constants/roles";
import { useAuthStore } from "@/stores/auth";
import adminRoutes from "./admin-router";
import redirectionsRoutes from "./redirections-router";

// @todo change this to the store data
const userRole = ROLES.CLIENT;
// const user = null;

const userHasRole = (role, checkAuth = true) => {
    try {
        const authStore = useAuthStore();

        if (checkAuth && !authStore.isConnected) {
            return false;
        }

        if (authStore.userData.roles.includes(role)) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.error(e.message);
        return false;
    }
};

const checkUserLogged = () => {
    const authStore = useAuthStore();
    return authStore.isConnected;
};

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/offres",
            name: "offers",
            component: () => import("../views/Offers/OffersView.vue"),
        },
        {
            path: "/offres/:id",
            name: "offer",
            component: () => import("../views/Offer/OfferView.vue"),
        },
        {
            path: "/abonnements/plans",
            name: "plans",
            component: () =>
                import("../views/SubscriptionPlan/SubscriptionPlanView.vue"),
        },
        {
            path: "/dashboard",
            name: "dashboard",
            component: () => import("../views/Dashboard/DashboardView.vue"),
            children: [
                {
                    path: "",
                    name: "dashboard-home",
                    component: () =>
                        import(
                            "../views/Dashboard/DashboardOffers/DashboardOffersView.vue"
                        ),
                    beforeEnter: async (to, from, next) => {
                        // When accessing /dashboard/ it will redirect the user to the correct page
                        if (userHasRole(ROLES.CLIENT, false)) {
                            return next({ name: "dashboard-offers" });
                        }

                        if (userHasRole(ROLES.FREELANCER_PREMIUM, false)) {
                            return next({ name: "dashboard-propositions" });
                        }
                        return next({ name: "dashboard-settings" });
                    },
                },
                {
                    path: "offers",
                    name: "dashboard-offers",
                    component: () =>
                        import(
                            "../views/Dashboard/DashboardOffers/DashboardOffersView.vue"
                        ),
                    beforeEnter: async (to, from, next) => {
                        // When accessing /dashboard/ it will redirect the user to the correct page
                        if (
                            to.name === "dashboard-offers" &&
                            !userHasRole(ROLES.CLIENT, false)
                        ) {
                            return next({ name: "dashboard-home" });
                        }
                        return next();
                    },
                },
                {
                    path: "offers/:id",
                    name: "client-offer",
                    component: () =>
                        import("../views/Dashboard/client-offer/ClientOfferView.vue"),
                },
                {
                    path: "propositions",
                    name: "dashboard-propositions",
                    component: () =>
                        import(
                            "../views/Dashboard/DashboardPropositions/DashboardPropositionsView.vue"
                        ),
                    beforeEnter: async (to, from, next) => {
                        // When accessing /dashboard/ it will redirect the user to the correct page
                        if (
                            !userHasRole(ROLES.FREELANCER, false) &&
                            !userHasRole(ROLES.FREELANCER_PREMIUM, false)
                        ) {
                            return next({ name: "dashboard-home" });
                        }
                        return next();
                    },
                },
                {
                    path: "projects",
                    name: "dashboard-projects",
                    component: () =>
                        import(
                            "../views/Dashboard/DashboardProjects/DashboardProjectsView.vue"
                        ),
                },
                {
                    path: "projects/new",
                    name: "new_project",
                    component: () =>
                        import("../views/NewProject/NewProjectView.vue"),
                    beforeEnter: async (to, from, next) => {
                        // When accessing /dashboard/ it will redirect the user to the correct page
                        if (
                            to.name === "new_project" &&
                            !userHasRole(ROLES.CLIENT)
                        ) {
                            return next({ name: "dashboard-home" });
                        }
                        return next();
                    },
                },
                {
                    path: "projects/:id",
                    name: "dashboard-project",
                    component: () =>
                        import(
                            "../views/Dashboard/DashboardProject/DashboardProjectView.vue"
                        ),
                },
                {
                    path: "settings",
                    name: "dashboard-settings",
                    component: () =>
                        import(
                            "../views/Dashboard/DashboardSettings/DashboardSettingsView.vue"
                        ),
                },
            ],
            beforeEnter: async (to, from, next) => {
                if (!checkUserLogged()) {
                    return next({ name: "login" });
                }
                return next();
            },
        },
        {
            path: "/auth",
            name: "auth-portal",
            component: () => import("../views/AuthPortalView.vue"),
            beforeEnter: async (to, from, next) => {
                if (checkUserLogged()) {
                    return next({ name: "home" });
                }
                return next();
            },
        },
        {
            path: "/login",
            name: "login",
            component: () => import("../views/LoginView.vue"),
            beforeEnter: async (to, from, next) => {
                if (checkUserLogged()) {
                    return next({ name: "home" });
                }
                return next();
            },
        },
        {
            path: "/signup",
            name: "signup",
            component: () => import("../views/SignupView.vue"),
            beforeEnter: async (to, from, next) => {
                if (checkUserLogged()) {
                    return next({ name: "home" });
                }
                return next();
            },
        },
        {
            path: "/verify-account/:token",
            name: "verify-account",
            component: () => import("../views/VerifyAccountView.vue"),
        },
        {
            path: "/reset-password",
            name: "reset-password",
            component: () => import("../views/ResetPasswordView.vue"),
        },
        {
            path: "/reset-password/:token",
            name: "reset-password-token",
            component: () => import("../views/ResetPasswordTokenView.vue"),
        },
        {
            path: "/admin",
            name: "admin-index",
            component: () => import("../views/Admin/AdminView.vue"),
            beforeEnter: async (to, from, next) => {
                if (!userHasRole(ROLES.ADMIN, true)) {
                    return next({ name: "dashboard-home" });
                }
                return next();
            },
            children: adminRoutes
        },
        {
            path: "/redirection",
            name: "redirection-index",
            children: redirectionsRoutes
        }
    ],
});

export default router;
