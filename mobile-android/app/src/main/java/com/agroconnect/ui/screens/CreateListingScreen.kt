package com.agroconnect.ui.screens

import android.util.Log
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.agroconnect.data.AgroRepository
import com.agroconnect.data.SupabaseClient
import com.agroconnect.models.Crop
import com.agroconnect.models.Listing
import com.agroconnect.ui.theme.*
import io.github.jan.supabase.gotrue.auth
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreateListingScreen(navController: NavController) {
    val scope = rememberCoroutineScope()
    var crops by remember { mutableStateOf<List<Crop>>(emptyList()) }
    var loading by remember { mutableStateOf(true) }
    var submitting by remember { mutableStateOf(false) }
    var success by remember { mutableStateOf(false) }

    // Form fields
    var itemType by remember { mutableStateOf("CROP") }
    var selectedCropId by remember { mutableIntStateOf(0) }
    var quantity by remember { mutableStateOf("") }
    var price by remember { mutableStateOf("") }
    var unit by remember { mutableStateOf("Quintal") }
    var equipmentDetails by remember { mutableStateOf("") }
    var cropExpanded by remember { mutableStateOf(false) }
    var unitExpanded by remember { mutableStateOf(false) }

    val units = listOf("Quintal", "Kg", "Ton", "Piece", "Bag")

    val currentUserId = remember {
        SupabaseClient.client.auth.currentUserOrNull()?.id ?: ""
    }

    LaunchedEffect(Unit) {
        crops = AgroRepository.getCrops()
        if (crops.isNotEmpty()) selectedCropId = crops.first().cropId
        loading = false
    }

    if (loading) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
        }
        return
    }

    if (success) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(Icons.Filled.CheckCircle, contentDescription = "CheckCircle icon",
                    modifier = Modifier.size(72.dp),
                    tint = Success,
                )
                Spacer(Modifier.height(16.dp))
                Text("Listing Created!", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                Spacer(Modifier.height(8.dp))
                Text("Your item is now visible to buyers.", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                Spacer(Modifier.height(24.dp))
                Button(onClick = { navController.popBackStack() }) {
                    Text("Back to Marketplace")
                }
            }
        }
        return
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        Text("📝 Create New Listing", style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)

        // Item Type Selection
        Card(
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        ) {
            Column(Modifier.padding(16.dp)) {
                Text("What are you selling?", style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.SemiBold)
                Spacer(Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    FilterChip(
                        selected = itemType == "CROP",
                        onClick = { itemType = "CROP" },
                        label = { Text("🌾 Crop") },
                    )
                    FilterChip(
                        selected = itemType == "EQUIPMENT",
                        onClick = { itemType = "EQUIPMENT" },
                        label = { Text("🔧 Equipment") },
                    )
                }
            }
        }

        // Crop or Equipment Details
        Card(
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        ) {
            Column(Modifier.padding(16.dp)) {
                if (itemType == "CROP") {
                    Text("Select Crop", style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.SemiBold)
                    Spacer(Modifier.height(8.dp))
                    ExposedDropdownMenuBox(
                        expanded = cropExpanded,
                        onExpandedChange = { cropExpanded = it },
                    ) {
                        OutlinedTextField(
                            value = crops.find { it.cropId == selectedCropId }?.cropNameEn ?: "Select",
                            onValueChange = {},
                            readOnly = true,
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = cropExpanded) },
                            modifier = Modifier.menuAnchor().fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                        )
                        ExposedDropdownMenu(
                            expanded = cropExpanded,
                            onDismissRequest = { cropExpanded = false },
                        ) {
                            crops.forEach { crop ->
                                DropdownMenuItem(
                                    text = { Text(crop.cropNameEn) },
                                    onClick = {
                                        selectedCropId = crop.cropId
                                        cropExpanded = false
                                    },
                                )
                            }
                        }
                    }
                } else {
                    Text("Equipment Details", style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.SemiBold)
                    Spacer(Modifier.height(8.dp))
                    OutlinedTextField(
                        value = equipmentDetails,
                        onValueChange = { equipmentDetails = it },
                        placeholder = { Text("e.g. Tractor, Water Pump, Sprayer...") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        minLines = 2,
                    )
                }
            }
        }

        // Quantity and Price
        Card(
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        ) {
            Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text("Pricing Details", style = MaterialTheme.typography.labelLarge, fontWeight = FontWeight.SemiBold)

                OutlinedTextField(
                    value = quantity,
                    onValueChange = { quantity = it.filter { c -> c.isDigit() || c == '.' } },
                    label = { Text("Quantity") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    singleLine = true,
                )

                // Unit dropdown
                ExposedDropdownMenuBox(
                    expanded = unitExpanded,
                    onExpandedChange = { unitExpanded = it },
                ) {
                    OutlinedTextField(
                        value = unit,
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Unit") },
                        trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = unitExpanded) },
                        modifier = Modifier.menuAnchor().fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                    )
                    ExposedDropdownMenu(
                        expanded = unitExpanded,
                        onDismissRequest = { unitExpanded = false },
                    ) {
                        units.forEach { u ->
                            DropdownMenuItem(
                                text = { Text(u) },
                                onClick = {
                                    unit = u
                                    unitExpanded = false
                                },
                            )
                        }
                    }
                }

                OutlinedTextField(
                    value = price,
                    onValueChange = { price = it.filter { c -> c.isDigit() || c == '.' } },
                    label = { Text("Price (₹ per unit)") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    singleLine = true,
                )
            }
        }

        // Submit button
        val isValid = quantity.isNotBlank() && price.isNotBlank() &&
                (itemType == "CROP" || equipmentDetails.isNotBlank())

        Button(
            onClick = {
                scope.launch {
                    submitting = true
                    val listing = Listing(
                        sellerUserId = currentUserId,
                        itemType = itemType,
                        cropId = if (itemType == "CROP") selectedCropId else null,
                        equipmentDetails = if (itemType == "EQUIPMENT") equipmentDetails else null,
                        quantity = quantity.toDoubleOrNull() ?: 0.0,
                        unitOfMeasure = unit,
                        listedPrice = price.toDoubleOrNull() ?: 0.0,
                    )
                    val result = AgroRepository.createListing(listing)
                    submitting = false
                    if (result) success = true
                }
            },
            modifier = Modifier.fillMaxWidth().height(52.dp),
            enabled = isValid && !submitting,
            shape = RoundedCornerShape(12.dp),
        ) {
            if (submitting) {
                CircularProgressIndicator(
                    color = MaterialTheme.colorScheme.onPrimary,
                    modifier = Modifier.size(20.dp),
                    strokeWidth = 2.dp,
                )
            } else {
                Icon(Icons.Filled.Publish, contentDescription = "Publish icon")
                Spacer(Modifier.width(8.dp))
                Text("Publish Listing", fontWeight = FontWeight.Bold)
            }
        }

        Spacer(Modifier.height(16.dp))
    }
}
