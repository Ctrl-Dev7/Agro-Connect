package com.agroconnect.ui.screens

import android.util.Log
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.agroconnect.data.AgroRepository
import com.agroconnect.data.SupabaseClient
import com.agroconnect.models.Advisory
import com.agroconnect.models.DailyMarketPrice
import com.agroconnect.ui.theme.*
import io.github.jan.supabase.gotrue.auth
import kotlinx.coroutines.launch
import androidx.navigation.NavController
import com.agroconnect.utils.LocationHelper
import com.agroconnect.ui.navigation.Screen
import androidx.compose.ui.platform.LocalContext
import android.Manifest
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import java.text.NumberFormat
import java.util.Locale

private val inrFormat = NumberFormat.getNumberInstance(Locale("en", "IN"))

data class CropPriceItem(
    val cropId: Int,
    val cropName: String,
    val latestPrice: Double,
    val prevPrice: Double,
    val changePct: Double,
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(navController: NavController) {
    val scope = rememberCoroutineScope()
    var cropPrices by remember { mutableStateOf<List<CropPriceItem>>(emptyList()) }
    var totalMandis by remember { mutableIntStateOf(0) }
    var advisories by remember { mutableStateOf<List<Advisory>>(emptyList()) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var loading by remember { mutableStateOf(true) }
    val context = LocalContext.current

    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        val granted = permissions[Manifest.permission.ACCESS_FINE_LOCATION] == true ||
                permissions[Manifest.permission.ACCESS_COARSE_LOCATION] == true
        if (granted) {
            // Just sync location in background, no re-navigation needed
            scope.launch {
                try {
                    val loc = LocationHelper.getCurrentLocation(context)
                    if (loc != null) {
                        val uid = SupabaseClient.client.auth.currentUserOrNull()?.id
                        if (uid != null) AgroRepository.syncUserLocation(uid, loc.latitude, loc.longitude)
                    }
                } catch (e: Exception) {
                    Log.w("AgroConnect", "Location sync skipped: ${e.message}")
                }
            }
        }
    }

    LaunchedEffect(Unit) {
        // Request permissions (non-blocking)
        permissionLauncher.launch(arrayOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        ))

        // Load data immediately (don't wait for permission)
        scope.launch {
            try {
                Log.d("AgroConnect", "Starting data fetch from Supabase...")
                
                val user = com.agroconnect.data.SupabaseClient.client.auth.currentUserOrNull()
                var userLat: Double? = null
                var userLon: Double? = null
                
                // Try GPS (will gracefully fail if no permission yet)
                try {
                    val loc = LocationHelper.getCurrentLocation(context)
                    if (loc != null) {
                        userLat = loc.latitude
                        userLon = loc.longitude
                        if (user != null) {
                            AgroRepository.syncUserLocation(user.id, userLat, userLon)
                        }
                    }
                } catch (e: Exception) {
                    Log.w("AgroConnect", "Location unavailable, using defaults: ${e.message}")
                }
                
                if (userLat == null && user != null) {
                    // Fallback to profile
                    val profile = (AgroRepository.getFarmerProfile(user.id) as? com.agroconnect.models.LocationProfile)
                        ?: (AgroRepository.getBuyerProfile(user.id) as? com.agroconnect.models.LocationProfile)
                    userLat = profile?.lat
                    userLon = profile?.lon
                }

                // Load crops + prices
                val crops = AgroRepository.getCrops()
                Log.d("AgroConnect", "Fetched ${crops.size} crops")
                
                val topCrops = if (crops.size > 6) crops.take(6) else crops
                val priceItems = topCrops.map { crop ->
                    val prices = AgroRepository.getLatestPrices(crop.cropId, 2)
                    val latest = prices.firstOrNull()?.pricePerQuintal ?: 0.0
                    val prev = prices.getOrNull(1)?.pricePerQuintal ?: latest
                    val change = if (prev > 0) ((latest - prev) / prev) * 100 else 0.0
                    CropPriceItem(crop.cropId, crop.cropNameEn, latest, prev, change)
                }
                cropPrices = priceItems
                Log.d("AgroConnect", "Loaded ${priceItems.size} crop prices")

                // Load mandis count
                val mandis = AgroRepository.getMandis(userLat, userLon)
                totalMandis = mandis.size
                Log.d("AgroConnect", "Loaded $totalMandis mandis")

                // Load advisories
                advisories = AgroRepository.getAdvisories().take(4)
                Log.d("AgroConnect", "Loaded ${advisories.size} advisories")
                
            } catch (e: Exception) {
                Log.e("AgroConnect", "Failed to fetch data: ${e.message}", e)
                errorMessage = "Failed to load data: ${e.message}"
            } finally {
                loading = false
            }
        }
    }


    if (loading) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
        }
        return
    }

    if (errorMessage != null) {
        Box(Modifier.fillMaxSize().padding(32.dp), contentAlignment = Alignment.Center) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(Icons.Filled.CloudOff, contentDescription = "CloudOff icon",
                    modifier = Modifier.size(64.dp),
                    tint = MaterialTheme.colorScheme.error
                )
                Spacer(Modifier.height(16.dp))
                Text(
                    "Connection Error",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold
                )
                Spacer(Modifier.height(8.dp))
                Text(
                    errorMessage ?: "",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    textAlign = TextAlign.Center
                )
                Spacer(Modifier.height(16.dp))
                Button(onClick = {
                    loading = true
                    errorMessage = null
                    scope.launch {
                        try {
                            val crops = AgroRepository.getCrops()
                            val topCrops = crops.filter { it.cropId in listOf(1, 2, 4, 7, 8, 9) }
                            cropPrices = topCrops.map { crop ->
                                val prices = AgroRepository.getLatestPrices(crop.cropId, 2)
                                val latest = prices.firstOrNull()?.pricePerQuintal ?: 0.0
                                val prev = prices.getOrNull(1)?.pricePerQuintal ?: latest
                                val change = if (prev > 0) ((latest - prev) / prev) * 100 else 0.0
                                CropPriceItem(crop.cropId, crop.cropNameEn, latest, prev, change)
                            }
                            val mandis = AgroRepository.getMandis()
                            totalMandis = mandis.size
                            advisories = AgroRepository.getAdvisories().take(4)
                        } catch (e: Exception) {
                            Log.e("AgroConnect", "Retry failed: ${e.message}", e)
                            errorMessage = "Retry failed: ${e.message}"
                        } finally {
                            loading = false
                        }
                    }
                }) {
                    Text("Retry")
                }
            }
        }
        return
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(vertical = 16.dp),
    ) {
        // Stat Cards Row
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                StatCard(
                    modifier = Modifier.weight(1f),
                    icon = Icons.Filled.Spa,
                    label = "Crops",
                    value = "${cropPrices.size}",
                    color = Green800,
                )
                StatCard(
                    modifier = Modifier.weight(1f),
                    icon = Icons.Filled.LocationOn,
                    label = "Markets",
                    value = "$totalMandis",
                    color = Info,
                )
                StatCard(
                    modifier = Modifier.weight(1f),
                    icon = Icons.Filled.Warning,
                    label = "Alerts",
                    value = "${advisories.size}",
                    color = WarningDark,
                )
            }
        }

        // Crop Prices Section
        item {
            Text(
                "💰 Live Crop Prices",
                style = MaterialTheme.typography.titleMedium,
                modifier = Modifier.padding(top = 8.dp),
            )
        }

        items(cropPrices) { cp ->
            CropPriceCard(cp)
        }

        // Advisories Section
        item {
            Text(
                "⚠️ Active Advisories",
                style = MaterialTheme.typography.titleMedium,
                modifier = Modifier.padding(top = 8.dp),
            )
        }

        items(advisories) { adv ->
            AdvisoryCardSmall(adv)
        }
    }
}

@Composable
fun StatCard(
    modifier: Modifier = Modifier,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    label: String,
    value: String,
    color: androidx.compose.ui.graphics.Color,
) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
        ) {
            Icon(icon, contentDescription = "Graphic Element", tint = color, modifier = Modifier.size(28.dp))
            Spacer(Modifier.height(6.dp))
            Text(value, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
            Text(label, style = MaterialTheme.typography.labelSmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
fun CropPriceCard(cp: CropPriceItem) {
    val emoji = when (cp.cropId) {
        1 -> "🌾"; 2 -> "🍚"; 4 -> "🌿"; 7 -> "🧅"; 8 -> "🍅"; 9 -> "🥔"; else -> "🌱"
    }
    val isUp = cp.changePct >= 0

    Card(
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 14.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(emoji, style = MaterialTheme.typography.headlineMedium)
            Spacer(Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(cp.cropName, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                Text("₹${inrFormat.format(cp.latestPrice)}/qtl", style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            Column(horizontalAlignment = Alignment.End) {
                Text(
                    "₹${inrFormat.format(cp.latestPrice)}",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                )
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(if (isUp) Icons.Filled.TrendingUp else Icons.Filled.TrendingDown, contentDescription = "TrendingDown icon",
                        tint = if (isUp) Success else Danger,
                        modifier = Modifier.size(14.dp),
                    )
                    Spacer(Modifier.width(2.dp))
                    Text(
                        "${if (isUp) "+" else ""}${"%.1f".format(cp.changePct)}%",
                        style = MaterialTheme.typography.labelSmall,
                        color = if (isUp) Success else Danger,
                        fontWeight = FontWeight.SemiBold,
                    )
                }
            }
        }
    }
}

@Composable
fun AdvisoryCardSmall(adv: Advisory) {
    val urgencyColor = when (adv.urgency) {
        "CRITICAL" -> Danger
        "HIGH" -> WarningDark
        "MEDIUM" -> Info
        else -> Success
    }
    val typeEmoji = when (adv.advisoryType) {
        "Pest Control" -> "🐛"; "Irrigation" -> "💧"; "Fertilization" -> "🌱"
        "Weather" -> "⛈️"; "Storage" -> "📦"; "Market Intelligence" -> "📊"
        "Soil Health" -> "🧪"; else -> "📋"
    }

    Card(
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp),
            verticalAlignment = Alignment.Top,
        ) {
            Text(typeEmoji, style = MaterialTheme.typography.titleLarge)
            Spacer(Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(adv.titleEn, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                Spacer(Modifier.height(4.dp))
                Box(
                    modifier = Modifier
                        .height(24.dp)
                        .background(
                            color = urgencyColor.copy(alpha = 0.12f),
                            shape = RoundedCornerShape(12.dp)
                        )
                        .padding(horizontal = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        adv.urgency, 
                        style = MaterialTheme.typography.labelSmall,
                        color = urgencyColor
                    )
                }
            }
        }
    }
}
