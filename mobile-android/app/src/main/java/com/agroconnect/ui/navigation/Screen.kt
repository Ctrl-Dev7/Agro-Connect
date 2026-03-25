package com.agroconnect.ui.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.ui.graphics.vector.ImageVector

sealed class Screen(
    val route: String,
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector,
) {
    data object Login : Screen(
        route = "login",
        title = "Login",
        selectedIcon = Icons.Filled.AccountCircle,
        unselectedIcon = Icons.Outlined.AccountCircle,
    )
    data object Register : Screen(
        route = "register",
        title = "Register",
        selectedIcon = Icons.Filled.PersonAdd,
        unselectedIcon = Icons.Outlined.PersonAdd,
    )
    data object Dashboard : Screen(
        route = "dashboard",
        title = "Dashboard",
        selectedIcon = Icons.Filled.Dashboard,
        unselectedIcon = Icons.Outlined.Dashboard,
    )
    data object Predictions : Screen(
        route = "predictions",
        title = "Prices",
        selectedIcon = Icons.Filled.TrendingUp,
        unselectedIcon = Icons.Outlined.TrendingUp,
    )
    data object Marketplace : Screen(
        route = "marketplace",
        title = "Market",
        selectedIcon = Icons.Filled.Storefront,
        unselectedIcon = Icons.Outlined.Storefront,
    )
    data object CreateListing : Screen(
        route = "create_listing",
        title = "Sell",
        selectedIcon = Icons.Filled.AddBusiness,
        unselectedIcon = Icons.Outlined.AddBusiness,
    )
    data object Weather : Screen(
        route = "weather",
        title = "Weather",
        selectedIcon = Icons.Filled.Cloud,
        unselectedIcon = Icons.Outlined.Cloud,
    )
    data object Advisories : Screen(
        route = "advisories",
        title = "Tips",
        selectedIcon = Icons.Filled.MenuBook,
        unselectedIcon = Icons.Outlined.MenuBook,
    )
    data object ListingDetail : Screen(
        route = "listing_detail/{listingId}",
        title = "Listing Details",
        selectedIcon = Icons.Filled.Info,
        unselectedIcon = Icons.Outlined.Info,
    ) {
        fun createRoute(listingId: Long) = "listing_detail/$listingId"
    }

    data object Cart : Screen(
        route = "cart",
        title = "Cart",
        selectedIcon = Icons.Filled.ShoppingCart,
        unselectedIcon = Icons.Outlined.ShoppingCart,
    )
    
    data object Checkout : Screen(
        route = "checkout",
        title = "Checkout",
        selectedIcon = Icons.Filled.Payment,
        unselectedIcon = Icons.Outlined.Payment,
    )
    
    data object Orders : Screen(
        route = "orders",
        title = "My Orders",
        selectedIcon = Icons.Filled.ListAlt,
        unselectedIcon = Icons.Outlined.ListAlt,
    )

    data object Settings : Screen(
        route = "settings",
        title = "Settings",
        selectedIcon = Icons.Filled.Settings,
        unselectedIcon = Icons.Outlined.Settings,
    )

    companion object {
        val bottomNavItems = listOf(Dashboard, Predictions, Marketplace, Weather, Advisories)
    }
}
