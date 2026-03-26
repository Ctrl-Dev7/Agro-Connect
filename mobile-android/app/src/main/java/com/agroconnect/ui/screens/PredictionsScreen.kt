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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.agroconnect.data.AgroRepository
import com.agroconnect.models.*
import com.agroconnect.ui.theme.*
import kotlinx.coroutines.launch
import io.github.jan.supabase.gotrue.auth
import com.agroconnect.utils.LocationHelper
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import android.Manifest
import androidx.compose.ui.platform.LocalContext
import java.text.NumberFormat
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PredictionsScreen() {
    val scope = rememberCoroutineScope()
    var crops by remember { mutableStateOf<List<Crop>>(emptyList()) }
    var mandis by remember { mutableStateOf<List<Mandi>>(emptyList()) }
    var selectedCrop by remember { mutableIntStateOf(1) }
    var selectedMandi by remember { mutableIntStateOf(47) }
    var prediction by remember { mutableStateOf<PredictionResponse?>(null) }
    var loading by remember { mutableStateOf(false) }
    var initialLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    val inrFormat = remember { NumberFormat.getNumberInstance(Locale("en", "IN")) }

    LaunchedEffect(Unit) {
        scope.launch {
            try {
                crops = AgroRepository.getCrops()
                mandis = AgroRepository.getMandis()
            } catch (e: Exception) { Log.e("AgroConnect", "PredictionsScreen init failed: ${e.message}", e) }
            initialLoading = false
        }
    }

    fun loadPrediction() {
        scope.launch {
            loading = true
            try {
                errorMessage = null
                prediction = AgroRepository.getPredictions(selectedCrop, selectedMandi)
            } catch (e: Exception) {
                Log.e("AgroConnect", "getPredictions failed: ${e.message}", e)
                errorMessage = if (e.message?.contains("422") == true) {
                    "Insufficient data for this market. We need at least 7 days of recent price history."
                } else {
                    "Failed to fetch forecast. Please try again later."
                }
            }
            loading = false
        }
    }

    val context = LocalContext.current
    val permissionLauncher = rememberLauncherForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        if (permissions[Manifest.permission.ACCESS_FINE_LOCATION] == true ||
            permissions[Manifest.permission.ACCESS_COARSE_LOCATION] == true) {
            scope.launch {
                val loc = LocationHelper.getCurrentLocation(context)
                if (loc != null) {
                    val sorted = AgroRepository.getMandis(loc.latitude, loc.longitude)
                    if (sorted.isNotEmpty()) {
                        selectedMandi = sorted.first().mandiId
                        loadPrediction()
                    }
                }
            }
        }
    }

    // Auto-load on first open
    LaunchedEffect(crops, mandis) {
        if (crops.isNotEmpty() && mandis.isNotEmpty() && prediction == null) {
            scope.launch {
                try {
                    // Try GPS first
                    val loc = LocationHelper.getCurrentLocation(context)
                    if (loc != null) {
                        val sorted = AgroRepository.getMandis(loc.latitude, loc.longitude)
                        if (sorted.isNotEmpty()) {
                            selectedMandi = sorted.first().mandiId
                        }
                    } else {
                        // Fallback to profile
                        val user = com.agroconnect.data.SupabaseClient.client.auth.currentUserOrNull()
                        if (user != null) {
                            val profile = (AgroRepository.getFarmerProfile(user.id) as? com.agroconnect.models.LocationProfile)
                                ?: (AgroRepository.getBuyerProfile(user.id) as? com.agroconnect.models.LocationProfile)
                            
                            if (profile != null && profile.lat != null && profile.lon != null) {
                                val sorted = AgroRepository.getMandis(profile.lat, profile.lon)
                                if (sorted.isNotEmpty()) {
                                    selectedMandi = sorted.first().mandiId
                                }
                            }
                        }
                    }
                } catch (e: Exception) {
                    Log.e("AgroConnect", "Default mandi selection failed: ${e.message}")
                }
                loadPrediction()
            }
        }
    }

    if (initialLoading) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
        }
        return
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        contentPadding = PaddingValues(vertical = 16.dp),
    ) {
        // Crop & Mandi Selection
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
            ) {
                Column(Modifier.padding(16.dp)) {
                    Text("Select Crop & Market", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                    Spacer(Modifier.height(12.dp))

                    // Crop dropdown
                    var cropExpanded by remember { mutableStateOf(false) }
                    Text("Crop", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(Modifier.height(4.dp))
                    ExposedDropdownMenuBox(
                        expanded = cropExpanded,
                        onExpandedChange = { cropExpanded = it },
                    ) {
                        OutlinedTextField(
                            value = crops.find { it.cropId == selectedCrop }?.cropNameEn ?: "Select Crop",
                            onValueChange = {},
                            readOnly = true,
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = cropExpanded) },
                            modifier = Modifier.menuAnchor().fillMaxWidth(),
                            shape = androidx.compose.foundation.shape.RoundedCornerShape(12.dp),
                            singleLine = true,
                        )
                        ExposedDropdownMenu(
                            expanded = cropExpanded,
                            onDismissRequest = { cropExpanded = false },
                        ) {
                            crops.forEach { crop ->
                                DropdownMenuItem(
                                    text = { Text(crop.cropNameEn) },
                                    onClick = {
                                        selectedCrop = crop.cropId
                                        cropExpanded = false
                                    },
                                )
                            }
                        }
                    }

                    Spacer(Modifier.height(12.dp))

                    // Mandi dropdown
                    var mandiExpanded by remember { mutableStateOf(false) }
                    Text("Market", style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                    Spacer(Modifier.height(4.dp))
                    ExposedDropdownMenuBox(
                        expanded = mandiExpanded,
                        onExpandedChange = { mandiExpanded = it },
                    ) {
                        OutlinedTextField(
                            value = mandis.find { it.mandiId == selectedMandi }?.let { "${it.mandiName} (${it.stateCode})" } ?: "Select Market",
                            onValueChange = {},
                            readOnly = true,
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = mandiExpanded) },
                            modifier = Modifier.menuAnchor().fillMaxWidth(),
                            shape = androidx.compose.foundation.shape.RoundedCornerShape(12.dp),
                            singleLine = true,
                        )
                        ExposedDropdownMenu(
                            expanded = mandiExpanded,
                            onDismissRequest = { mandiExpanded = false },
                        ) {
                            mandis.forEach { mandi ->
                                DropdownMenuItem(
                                    text = { Text("${mandi.mandiName} (${mandi.stateCode})") },
                                    onClick = {
                                        selectedMandi = mandi.mandiId
                                        mandiExpanded = false
                                    },
                                )
                            }
                        }
                    }

                    Spacer(Modifier.height(16.dp))
                    Button(
                        onClick = { loadPrediction() },
                        modifier = Modifier.fillMaxWidth(),
                        enabled = !loading,
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                    ) {
                        if (loading) {
                            CircularProgressIndicator(Modifier.size(18.dp), color = MaterialTheme.colorScheme.onPrimary, strokeWidth = 2.dp)
                            Spacer(Modifier.width(8.dp))
                        }
                        Icon(Icons.Filled.BarChart, contentDescription = "BarChart icon", modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(8.dp))
                        Text(if (loading) "Predicting…" else "Get Forecast")
                    }

                    if (errorMessage != null) {
                        Spacer(Modifier.height(12.dp))
                        Text(
                            text = errorMessage!!,
                            color = MaterialTheme.colorScheme.error,
                            style = MaterialTheme.typography.bodySmall,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }
        }

        // Trend Cards
        prediction?.let { pred ->
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                ) {
                    val trendIcon = when (pred.trendDirection) {
                        "UP" -> Icons.Filled.TrendingUp
                        "DOWN" -> Icons.Filled.TrendingDown
                        else -> Icons.Filled.Remove
                    }
                    val trendLabel = when (pred.trendDirection) {
                        "UP" -> "📈 Upward"
                        "DOWN" -> "📉 Down"
                        else -> "➡️ Stable"
                    }

                    StatCard(Modifier.weight(1f), trendIcon, "Trend", trendLabel, Green800)
                    StatCard(Modifier.weight(1f), Icons.Filled.CheckCircle, "Confidence", "${pred.confidenceScore.toInt()}%", if (pred.confidenceScore >= 80) Success else WarningDark)
                }
            }

            // Sell Recommendation
            pred.sellWindow?.let { sw ->
                item {
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Green50),
                        elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
                        shape = RoundedCornerShape(12.dp),
                    ) {
                        Row(
                            modifier = Modifier.padding(16.dp),
                            verticalAlignment = Alignment.Top,
                        ) {
                            Icon(Icons.Filled.CheckCircle, contentDescription = "CheckCircle icon",
                                tint = Green800,
                                modifier = Modifier.size(28.dp),
                            )
                            Spacer(Modifier.width(12.dp))
                            Column {
                                Text(
                                    "📊 Selling Recommendation",
                                    style = MaterialTheme.typography.titleSmall,
                                    fontWeight = FontWeight.Bold,
                                    color = Green900,
                                )
                                Spacer(Modifier.height(4.dp))
                                Text(
                                    "${sw.reason} Best price: ₹${inrFormat.format(sw.predictedPeakPrice)}/qtl on Day ${sw.recommendedDay}",
                                    style = MaterialTheme.typography.bodySmall,
                                    color = Brown800,
                                )
                            }
                        }
                    }
                }
            }

            // 7-Day Table
            item {
                Text("📅 7-Day Forecast", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            }

            items(pred.predictions) { day ->
                val isBest = pred.sellWindow?.recommendedDay == day.forecastDayIndex
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = if (isBest) Green50 else MaterialTheme.colorScheme.surface
                    ),
                    elevation = CardDefaults.cardElevation(defaultElevation = if (isBest) 2.dp else 1.dp),
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp, vertical = 12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("Day ${day.forecastDayIndex}", style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold)
                                if (isBest) {
                                    Spacer(Modifier.width(8.dp))
                                    Box(
                                        modifier = Modifier
                                            .height(22.dp)
                                            .background(
                                                color = Green800,
                                                shape = RoundedCornerShape(11.dp)
                                            )
                                            .padding(horizontal = 8.dp),
                                        contentAlignment = Alignment.Center
                                    ) {
                                        Text("BEST", style = MaterialTheme.typography.labelSmall, color = White)
                                    }
                                }
                            }
                            Text(day.forecastDate, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
                        }
                        Column(horizontalAlignment = Alignment.End) {
                            Text("₹${inrFormat.format(day.predictedPrice)}", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                            if (day.confidenceLower != null && day.confidenceUpper != null) {
                                Text(
                                    "₹${inrFormat.format(day.confidenceLower.toInt())} – ₹${inrFormat.format(day.confidenceUpper.toInt())}",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
