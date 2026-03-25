package com.agroconnect.ui.screens

import android.util.Log
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.agroconnect.data.AgroRepository
import com.agroconnect.data.SupabaseClient
import com.agroconnect.models.CartItem
import com.agroconnect.models.Listing
import io.github.jan.supabase.gotrue.auth
import kotlinx.coroutines.launch
import java.text.NumberFormat
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ListingDetailScreen(navController: NavController, listingId: Long) {
    val scope = rememberCoroutineScope()
    val context = LocalContext.current
    var listing by remember { mutableStateOf<Listing?>(null) }
    var cropName by remember { mutableStateOf<String?>(null) }
    var sellerName by remember { mutableStateOf<String?>(null) }
    var loading by remember { mutableStateOf(true) }
    var addingToCart by remember { mutableStateOf(false) }

    val currentUserId = remember { SupabaseClient.client.auth.currentUserOrNull()?.id }
    val inrFormat = remember { NumberFormat.getNumberInstance(Locale("en", "IN")) }

    LaunchedEffect(listingId) {
        scope.launch {
            loading = true
            try {
                // We'll reuse getListings and find it, or we could add a getListingById in AgroRepository. 
                // For now, let's just fetch all and find it since it's cached/small.
                val allListings = AgroRepository.getListings()
                val foundListing = allListings.find { it.listingId == listingId }
                listing = foundListing
                
                if (foundListing != null) {
                    if (foundListing.itemType == "CROP" && foundListing.cropId != null) {
                        cropName = AgroRepository.getCrops().find { it.cropId == foundListing.cropId }?.cropNameEn
                    }
                    
                    // Try to get seller name
                    val farmer = AgroRepository.getFarmerProfile(foundListing.sellerUserId) as? com.agroconnect.models.UserProfile
                    if (farmer != null) {
                        sellerName = "${farmer.firstName} ${farmer.lastName}"
                    } else {
                        val buyer = AgroRepository.getBuyerProfile(foundListing.sellerUserId) as? com.agroconnect.models.UserProfile
                        if (buyer != null) {
                            sellerName = "${buyer.firstName} ${buyer.lastName}"
                        }
                    }
                }
            } catch (e: Exception) {
                Log.e("AgroConnect", "ListingDetailScreen error: ${e.message}")
            }
            loading = false
        }
    }

    if (loading) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
        }
        return
    }

    val item = listing
    if (item == null) {
        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("Listing not found or sold", color = MaterialTheme.colorScheme.error)
        }
        return
    }

    val emoji = when (item.cropId) {
        1 -> "🌾"; 2 -> "🍚"; 4 -> "🌿"; 7 -> "🧅"; 8 -> "🍅"; 9 -> "🥔"; else -> "📦"
    }
    val title = if (item.itemType == "CROP") cropName ?: "Crop" else "Equipment"

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Card(
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant),
            modifier = Modifier.fillMaxWidth().height(200.dp)
        ) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text(emoji, style = MaterialTheme.typography.displayLarge.copy(fontSize = MaterialTheme.typography.displayLarge.fontSize * 2))
            }
        }

        Text(title, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Bold)

        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Filled.Person, contentDescription = null, modifier = Modifier.size(16.dp), tint = MaterialTheme.colorScheme.onSurfaceVariant)
            Spacer(Modifier.width(8.dp))
            Text("Seller: ${sellerName ?: "Unknown"}", color = MaterialTheme.colorScheme.onSurfaceVariant)
        }

        Divider()

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("Price", style = MaterialTheme.typography.labelMedium)
                Text(
                    "₹${inrFormat.format(item.listedPrice)} / ${item.unitOfMeasure}",
                    style = MaterialTheme.typography.titleLarge,
                    color = MaterialTheme.colorScheme.primary,
                    fontWeight = FontWeight.Bold
                )
            }
            
            Column(horizontalAlignment = Alignment.End) {
                Text("Available Quantity", style = MaterialTheme.typography.labelMedium)
                Text("${item.quantity} ${item.unitOfMeasure}", style = MaterialTheme.typography.titleMedium)
            }
        }

        if (item.equipmentDetails != null) {
            Spacer(Modifier.height(8.dp))
            Text("Description", style = MaterialTheme.typography.labelMedium)
            Text(item.equipmentDetails, style = MaterialTheme.typography.bodyMedium)
        }

        Spacer(Modifier.weight(1f))

        if (item.sellerUserId != currentUserId) {
            Button(
                onClick = {
                    if (currentUserId == null) return@Button
                    scope.launch {
                        addingToCart = true
                        val obj = CartItem(
                            userId = currentUserId,
                            listingId = item.listingId,
                            quantity = 1.0 // Add 1 quintal by default, user can adjust in cart
                        )
                        val success = AgroRepository.addToCart(obj)
                        addingToCart = false
                        if (success) {
                            Toast.makeText(context, "Added to Cart", Toast.LENGTH_SHORT).show()
                            navController.popBackStack()
                        } else {
                            Toast.makeText(context, "Failed to add (already in cart?)", Toast.LENGTH_SHORT).show()
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth().height(56.dp),
                enabled = !addingToCart,
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
            ) {
                if (addingToCart) {
                    CircularProgressIndicator(Modifier.size(24.dp), color = MaterialTheme.colorScheme.onPrimary, strokeWidth = 2.dp)
                } else {
                    Icon(Icons.Filled.ShoppingCart, contentDescription = null)
                    Spacer(Modifier.width(8.dp))
                    Text("Add 1 ${item.unitOfMeasure} to Cart", fontSize = MaterialTheme.typography.titleMedium.fontSize)
                }
            }
        } else {
            OutlinedButton(
                onClick = { /* Could let seller edit pricing here */ },
                modifier = Modifier.fillMaxWidth().height(56.dp)
            ) {
                Text("Manage Your Listing")
            }
        }
    }
}
